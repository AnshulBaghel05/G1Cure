import { z } from 'zod';

// Review validation schemas
export const reviewSchema = z.object({
  doctorId: z.string().uuid('Invalid doctor ID'),
  patientId: z.string().uuid('Invalid patient ID'),
  appointmentId: z.string().uuid('Invalid appointment ID').optional(),
  rating: z.number()
    .int('Rating must be a whole number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  comment: z.string()
    .min(10, 'Review must be at least 10 characters')
    .max(2000, 'Review must be less than 2000 characters')
    .optional(),
  categories: z.object({
    professionalism: z.number().int().min(1).max(5).optional(),
    communication: z.number().int().min(1).max(5).optional(),
    waitTime: z.number().int().min(1).max(5).optional(),
    facilityQuality: z.number().int().min(1).max(5).optional(),
    overallExperience: z.number().int().min(1).max(5).optional(),
  }).optional(),
  wouldRecommend: z.boolean().optional(),
  isAnonymous: z.boolean().default(false),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
});

export const createReviewSchema = reviewSchema.omit({
  patientId: true,
  status: true,
});

export const updateReviewSchema = reviewSchema.partial().extend({
  id: z.string().uuid('Invalid review ID'),
});

export const reviewFilterSchema = z.object({
  doctorId: z.string().uuid().optional(),
  patientId: z.string().uuid().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  minRating: z.number().int().min(1).max(5).optional(),
  maxRating: z.number().int().min(1).max(5).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const reviewResponseSchema = z.object({
  reviewId: z.string().uuid('Invalid review ID'),
  doctorId: z.string().uuid('Invalid doctor ID'),
  response: z.string()
    .min(10, 'Response must be at least 10 characters')
    .max(1000, 'Response must be less than 1000 characters'),
});

// Type exports
export type Review = z.infer<typeof reviewSchema>;
export type CreateReview = z.infer<typeof createReviewSchema>;
export type UpdateReview = z.infer<typeof updateReviewSchema>;
export type ReviewFilter = z.infer<typeof reviewFilterSchema>;
export type ReviewResponse = z.infer<typeof reviewResponseSchema>;
