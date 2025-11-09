/**
 * Centralized Validation Schemas using Zod
 *
 * This file exports all validation schemas for the G1Cure healthcare platform.
 * Import schemas as needed for form validation and API request validation.
 *
 * @example
 * ```typescript
 * import { userProfileSchema, appointmentSchema } from '@/lib/schemas';
 *
 * // Validate data
 * const result = userProfileSchema.safeParse(userData);
 * if (!result.success) {
 *   console.error(result.error);
 * }
 * ```
 */

// User schemas
export * from './user.schema';

// Appointment schemas
export * from './appointment.schema';

// Billing schemas
export * from './billing.schema';

// Medical schemas (prescriptions, records, lab reports)
export * from './medical.schema';

// Telemedicine schemas
export * from './telemedicine.schema';

// Review schemas
export * from './review.schema';

// Common utility schemas
import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const searchSchema = z.object({
  query: z.string()
    .min(1, 'Search query is required')
    .max(200, 'Search query must be less than 200 characters'),
  filters: z.record(z.any()).optional(),
  ...paginationSchema.shape,
});

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export const dateRangeSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), 'Invalid start date'),
  endDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), 'Invalid end date'),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start <= end;
}, 'Start date must be before or equal to end date');

export const fileUploadSchema = z.object({
  filename: z.string()
    .min(1, 'Filename is required')
    .max(255, 'Filename must be less than 255 characters')
    .regex(/^[a-zA-Z0-9_\-. ]+$/, 'Filename contains invalid characters'),
  contentType: z.string()
    .regex(/^[a-z]+\/[a-z0-9\-+.]+$/, 'Invalid content type'),
  size: z.number()
    .positive('File size must be positive')
    .max(10 * 1024 * 1024, 'File size cannot exceed 10MB'),
});

export const notificationSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  type: z.enum(['appointment', 'medical', 'billing', 'system', 'reminder']),
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  message: z.string()
    .min(1, 'Message is required')
    .max(500, 'Message must be less than 500 characters'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  action: z.string()
    .max(100, 'Action text must be less than 100 characters')
    .optional(),
  actionUrl: z.string().url('Invalid action URL').optional(),
  isRead: z.boolean().default(false),
});

// Type exports
export type Pagination = z.infer<typeof paginationSchema>;
export type Search = z.infer<typeof searchSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type DateRange = z.infer<typeof dateRangeSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
export type Notification = z.infer<typeof notificationSchema>;
