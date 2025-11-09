import { z } from 'zod';

// Appointment validation schemas
export const appointmentSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  doctorId: z.string().uuid('Invalid doctor ID'),
  date: z.string().refine((date) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
  }, 'Appointment date must be today or in the future'),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  type: z.enum(['consultation', 'follow-up', 'emergency', 'routine-checkup', 'telemedicine']),
  reason: z.string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must be less than 500 characters'),
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
  duration: z.number()
    .int('Duration must be a whole number')
    .min(15, 'Duration must be at least 15 minutes')
    .max(240, 'Duration cannot exceed 4 hours')
    .default(30),
  status: z.enum(['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show']).default('scheduled'),
});

export const createAppointmentSchema = appointmentSchema.omit({
  patientId: true,
  status: true
});

export const updateAppointmentSchema = appointmentSchema.partial().extend({
  id: z.string().uuid('Invalid appointment ID'),
});

export const cancelAppointmentSchema = z.object({
  id: z.string().uuid('Invalid appointment ID'),
  reason: z.string()
    .min(10, 'Cancellation reason must be at least 10 characters')
    .max(500, 'Cancellation reason must be less than 500 characters'),
});

export const rescheduleAppointmentSchema = z.object({
  id: z.string().uuid('Invalid appointment ID'),
  newDate: z.string().refine((date) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
  }, 'New appointment date must be today or in the future'),
  newTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  reason: z.string()
    .min(10, 'Reason for rescheduling must be at least 10 characters')
    .max(500, 'Reason must be less than 500 characters')
    .optional(),
});

export const appointmentFilterSchema = z.object({
  doctorId: z.string().uuid().optional(),
  patientId: z.string().uuid().optional(),
  status: z.enum(['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show']).optional(),
  type: z.enum(['consultation', 'follow-up', 'emergency', 'routine-checkup', 'telemedicine']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// Type exports
export type Appointment = z.infer<typeof appointmentSchema>;
export type CreateAppointment = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointment = z.infer<typeof updateAppointmentSchema>;
export type CancelAppointment = z.infer<typeof cancelAppointmentSchema>;
export type RescheduleAppointment = z.infer<typeof rescheduleAppointmentSchema>;
export type AppointmentFilter = z.infer<typeof appointmentFilterSchema>;
