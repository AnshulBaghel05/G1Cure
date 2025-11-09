import { z, ZodError } from 'zod';
import { showErrorToast } from '../errorHandler';

/**
 * Validation utility functions for Zod schemas
 */

/**
 * Validates data against a Zod schema and returns typed result
 */
export function validate<T extends z.ZodType<any, any>>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: Record<string, string> } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return {
      success: false,
      errors: { _error: 'Validation failed' },
    };
  }
}

/**
 * Safe parse wrapper that returns typed result or null
 */
export function safeParse<T extends z.ZodType<any, any>>(
  schema: T,
  data: unknown
): z.infer<T> | null {
  const result = schema.safeParse(data);
  return result.success ? result.data : null;
}

/**
 * Validates data and shows error toast on failure
 */
export function validateWithToast<T extends z.ZodType<any, any>>(
  schema: T,
  data: unknown,
  errorMessage?: string
): z.infer<T> | null {
  const result = validate(schema, data);

  if (!result.success) {
    const firstError = Object.values(result.errors)[0];
    showErrorToast(
      new Error(firstError),
      errorMessage || 'Validation failed'
    );
    return null;
  }

  return result.data;
}

/**
 * Formats Zod errors for display in forms
 */
export function formatZodErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  return errors;
}

/**
 * Creates a validation resolver for React Hook Form
 */
export function zodResolver<T extends z.ZodType<any, any>>(schema: T) {
  return async (data: unknown) => {
    try {
      const values = await schema.parseAsync(data);
      return {
        values,
        errors: {},
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          values: {},
          errors: formatZodErrors(error),
        };
      }
      return {
        values: {},
        errors: {
          _error: 'Validation failed',
        },
      };
    }
  };
}

/**
 * Validates partial data (useful for multi-step forms)
 */
export function validatePartial<T extends z.ZodType<any, any>>(
  schema: T,
  data: unknown,
  fields: string[]
): { success: boolean; errors: Record<string, string> } {
  try {
    const partialSchema = schema.pick(
      fields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );
    partialSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, errors: formatZodErrors(error) };
    }
    return { success: false, errors: { _error: 'Validation failed' } };
  }
}

/**
 * Validates array of data against schema
 */
export function validateArray<T extends z.ZodType<any, any>>(
  schema: T,
  dataArray: unknown[]
): { success: boolean; errors: Record<number, Record<string, string>> } {
  const errors: Record<number, Record<string, string>> = {};
  let hasErrors = false;

  dataArray.forEach((data, index) => {
    const result = validate(schema, data);
    if (!result.success) {
      errors[index] = result.errors;
      hasErrors = true;
    }
  });

  return { success: !hasErrors, errors };
}

/**
 * Type-safe form data parser with schema validation
 */
export function parseFormData<T extends z.ZodType<any, any>>(
  schema: T,
  formData: FormData
): z.infer<T> | null {
  const data: Record<string, any> = {};

  formData.forEach((value, key) => {
    // Handle nested objects (e.g., "address.street")
    if (key.includes('.')) {
      const keys = key.split('.');
      let current = data;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    } else {
      data[key] = value;
    }
  });

  return safeParse(schema, data);
}

/**
 * Validates query parameters from URL
 */
export function validateQueryParams<T extends z.ZodType<any, any>>(
  schema: T,
  params: URLSearchParams | Record<string, any>
): z.infer<T> | null {
  const data: Record<string, any> = {};

  if (params instanceof URLSearchParams) {
    params.forEach((value, key) => {
      // Try to parse numbers and booleans
      if (value === 'true') data[key] = true;
      else if (value === 'false') data[key] = false;
      else if (!isNaN(Number(value)) && value !== '') data[key] = Number(value);
      else data[key] = value;
    });
  } else {
    Object.assign(data, params);
  }

  return safeParse(schema, data);
}
