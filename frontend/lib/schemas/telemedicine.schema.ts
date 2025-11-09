import { z } from 'zod';

// Telemedicine validation schemas
export const videoSessionSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  doctorId: z.string().uuid('Invalid doctor ID'),
  appointmentId: z.string().uuid('Invalid appointment ID').optional(),
  scheduledDate: z.string().refine((date) => {
    const sessionDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sessionDate >= today;
  }, 'Session date must be today or in the future'),
  scheduledTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  duration: z.number()
    .int('Duration must be a whole number')
    .min(15, 'Duration must be at least 15 minutes')
    .max(120, 'Duration cannot exceed 2 hours')
    .default(30),
  type: z.enum(['consultation', 'follow-up']).default('consultation'),
  status: z.enum(['scheduled', 'waiting', 'active', 'ended', 'cancelled']).default('scheduled'),
  channelName: z.string().optional(),
  sessionId: z.string().optional(),
  notes: z.string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional(),
  recordingEnabled: z.boolean().default(false),
  recordingUrl: z.string().url('Invalid recording URL').optional(),
  screenShareEnabled: z.boolean().default(true),
  chatEnabled: z.boolean().default(true),
  waitingRoomEnabled: z.boolean().default(true),
});

export const createVideoSessionSchema = videoSessionSchema.omit({
  patientId: true,
  status: true,
  channelName: true,
  sessionId: true,
  recordingUrl: true,
});

export const joinVideoSessionSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  userId: z.string().uuid('Invalid user ID'),
  userRole: z.enum(['patient', 'doctor']),
});

export const updateVideoSessionSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  status: z.enum(['waiting', 'active', 'ended', 'cancelled']).optional(),
  recordingUrl: z.string().url('Invalid recording URL').optional(),
  screenShareEnabled: z.boolean().optional(),
  chatEnabled: z.boolean().optional(),
});

export const videoChatMessageSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  senderId: z.string().uuid('Invalid sender ID'),
  senderName: z.string()
    .min(1, 'Sender name is required')
    .max(100, 'Sender name must be less than 100 characters'),
  senderRole: z.enum(['patient', 'doctor']),
  message: z.string()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message must be less than 1000 characters'),
});

export const sendChatMessageSchema = videoChatMessageSchema.omit({
  senderId: true,
  senderName: true,
  senderRole: true,
});

// Type exports
export type VideoSession = z.infer<typeof videoSessionSchema>;
export type CreateVideoSession = z.infer<typeof createVideoSessionSchema>;
export type JoinVideoSession = z.infer<typeof joinVideoSessionSchema>;
export type UpdateVideoSession = z.infer<typeof updateVideoSessionSchema>;
export type VideoChatMessage = z.infer<typeof videoChatMessageSchema>;
export type SendChatMessage = z.infer<typeof sendChatMessageSchema>;
