/**
 * Global Error Handler Utility
 * Provides consistent error handling across the application
 */

import { toast } from '@/components/ui/use-toast';

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: any;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Handle API errors and display user-friendly messages
 */
export function handleApiError(error: any): ErrorResponse {
  console.error('API Error:', error);

  // Handle network errors
  if (!navigator.onLine) {
    return {
      message: 'No internet connection. Please check your network and try again.',
      code: 'NETWORK_ERROR',
    };
  }

  // Handle Supabase errors
  if (error?.message?.includes('JWT')) {
    return {
      message: 'Your session has expired. Please login again.',
      code: 'AUTH_ERROR',
    };
  }

  // Handle API response errors
  if (error?.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return {
          message: data?.message || 'Invalid request. Please check your input.',
          code: 'BAD_REQUEST',
          details: data?.details,
        };
      case 401:
        return {
          message: 'You are not authorized. Please login.',
          code: 'UNAUTHORIZED',
        };
      case 403:
        return {
          message: 'You do not have permission to perform this action.',
          code: 'FORBIDDEN',
        };
      case 404:
        return {
          message: data?.message || 'Resource not found.',
          code: 'NOT_FOUND',
        };
      case 409:
        return {
          message: data?.message || 'This resource already exists.',
          code: 'CONFLICT',
        };
      case 422:
        return {
          message: data?.message || 'Validation failed. Please check your input.',
          code: 'VALIDATION_ERROR',
          details: data?.details,
        };
      case 429:
        return {
          message: 'Too many requests. Please try again later.',
          code: 'RATE_LIMIT',
        };
      case 500:
        return {
          message: 'Server error. Please try again later.',
          code: 'SERVER_ERROR',
        };
      case 503:
        return {
          message: 'Service temporarily unavailable. Please try again later.',
          code: 'SERVICE_UNAVAILABLE',
        };
      default:
        return {
          message: data?.message || 'Something went wrong. Please try again.',
          code: 'UNKNOWN_ERROR',
        };
    }
  }

  // Handle Encore API errors
  if (error?.code) {
    switch (error.code) {
      case 'invalid_argument':
        return {
          message: error.message || 'Invalid input provided.',
          code: 'INVALID_ARGUMENT',
        };
      case 'not_found':
        return {
          message: error.message || 'Resource not found.',
          code: 'NOT_FOUND',
        };
      case 'permission_denied':
        return {
          message: error.message || 'Permission denied.',
          code: 'PERMISSION_DENIED',
        };
      case 'unauthenticated':
        return {
          message: 'Please login to continue.',
          code: 'UNAUTHENTICATED',
        };
      default:
        return {
          message: error.message || 'An error occurred.',
          code: error.code,
        };
    }
  }

  // Handle generic errors
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'ERROR',
    };
  }

  // Fallback
  return {
    message: 'An unexpected error occurred. Please try again.',
    code: 'UNKNOWN',
  };
}

/**
 * Display error toast notification
 */
export function showErrorToast(error: any, customMessage?: string) {
  const errorResponse = handleApiError(error);

  toast({
    title: 'Error',
    description: customMessage || errorResponse.message,
    variant: 'destructive',
  });

  return errorResponse;
}

/**
 * Display success toast notification
 */
export function showSuccessToast(message: string, description?: string) {
  toast({
    title: message,
    description,
  });
}

/**
 * Async error wrapper for API calls
 */
export async function withErrorHandling<T>(
  promise: Promise<T>,
  options?: {
    onError?: (error: ErrorResponse) => void;
    customErrorMessage?: string;
    showToast?: boolean;
  }
): Promise<{ data?: T; error?: ErrorResponse }> {
  try {
    const data = await promise;
    return { data };
  } catch (error) {
    const errorResponse = handleApiError(error);

    if (options?.showToast !== false) {
      showErrorToast(error, options?.customErrorMessage);
    }

    if (options?.onError) {
      options.onError(errorResponse);
    }

    return { error: errorResponse };
  }
}

/**
 * Form validation error handler
 */
export function handleValidationErrors(errors: Record<string, any>) {
  const firstError = Object.values(errors)[0];
  if (firstError?.message) {
    showErrorToast(new Error(firstError.message));
  }
}

/**
 * Log error to monitoring service (e.g., Sentry)
 */
export function logError(error: any, context?: Record<string, any>) {
  console.error('Error logged:', error, context);

  // TODO: Integrate with error monitoring service (Sentry, LogRocket, etc.)
  // Example:
  // if (import.meta.env.PROD) {
  //   Sentry.captureException(error, { extra: context });
  // }
}

/**
 * Retry logic for failed API calls
 */
export async function retryRequest<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    backoff?: boolean;
  } = {}
): Promise<T> {
  const { maxRetries = 3, delayMs = 1000, backoff = true } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const delay = backoff ? delayMs * Math.pow(2, attempt) : delayMs;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
