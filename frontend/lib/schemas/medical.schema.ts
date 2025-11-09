import { z } from 'zod';

// Prescription validation schemas
export const medicationSchema = z.object({
  name: z.string()
    .min(2, 'Medication name must be at least 2 characters')
    .max(200, 'Medication name must be less than 200 characters'),
  dosage: z.string()
    .min(1, 'Dosage is required')
    .max(100, 'Dosage must be less than 100 characters'),
  frequency: z.string()
    .min(1, 'Frequency is required')
    .max(100, 'Frequency must be less than 100 characters'),
  duration: z.string()
    .min(1, 'Duration is required')
    .max(100, 'Duration must be less than 100 characters'),
  instructions: z.string()
    .max(500, 'Instructions must be less than 500 characters')
    .optional(),
});

export const prescriptionSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  doctorId: z.string().uuid('Invalid doctor ID'),
  appointmentId: z.string().uuid('Invalid appointment ID').optional(),
  medications: z.array(medicationSchema)
    .min(1, 'At least one medication is required'),
  diagnosis: z.string()
    .min(10, 'Diagnosis must be at least 10 characters')
    .max(1000, 'Diagnosis must be less than 1000 characters'),
  notes: z.string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional(),
  validUntil: z.string().refine((date) => {
    const validDate = new Date(date);
    const today = new Date();
    return validDate >= today;
  }, 'Validity date must be in the future'),
  status: z.enum(['active', 'completed', 'cancelled']).default('active'),
});

export const createPrescriptionSchema = prescriptionSchema.omit({
  patientId: true,
  doctorId: true,
  status: true,
});

export const updatePrescriptionSchema = prescriptionSchema.partial().extend({
  id: z.string().uuid('Invalid prescription ID'),
});

// Medical record validation schemas
export const vitalSignsSchema = z.object({
  bloodPressure: z.string()
    .regex(/^\d{2,3}\/\d{2,3}$/, 'Invalid blood pressure format (e.g., 120/80)')
    .optional(),
  heartRate: z.number()
    .int('Heart rate must be a whole number')
    .min(30, 'Heart rate must be at least 30 bpm')
    .max(250, 'Heart rate cannot exceed 250 bpm')
    .optional(),
  temperature: z.number()
    .min(35, 'Temperature must be at least 35°C')
    .max(43, 'Temperature cannot exceed 43°C')
    .optional(),
  weight: z.number()
    .positive('Weight must be positive')
    .max(500, 'Weight cannot exceed 500 kg')
    .optional(),
  height: z.number()
    .positive('Height must be positive')
    .max(300, 'Height cannot exceed 300 cm')
    .optional(),
  oxygenSaturation: z.number()
    .int('Oxygen saturation must be a whole number')
    .min(0, 'Oxygen saturation cannot be negative')
    .max(100, 'Oxygen saturation cannot exceed 100%')
    .optional(),
  respiratoryRate: z.number()
    .int('Respiratory rate must be a whole number')
    .min(5, 'Respiratory rate must be at least 5 breaths/min')
    .max(60, 'Respiratory rate cannot exceed 60 breaths/min')
    .optional(),
});

export const medicalRecordSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  appointmentId: z.string().uuid('Invalid appointment ID').optional(),
  doctorId: z.string().uuid('Invalid doctor ID'),
  visitDate: z.string(),
  chiefComplaint: z.string()
    .min(5, 'Chief complaint must be at least 5 characters')
    .max(500, 'Chief complaint must be less than 500 characters'),
  diagnosis: z.string()
    .min(5, 'Diagnosis must be at least 5 characters')
    .max(1000, 'Diagnosis must be less than 1000 characters')
    .optional(),
  symptoms: z.array(z.string()).optional(),
  vitalSigns: vitalSignsSchema.optional(),
  treatment: z.string()
    .max(2000, 'Treatment description must be less than 2000 characters')
    .optional(),
  notes: z.string()
    .max(5000, 'Notes must be less than 5000 characters')
    .optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string().url('Invalid attachment URL'),
    type: z.string(),
  })).optional(),
});

export const createMedicalRecordSchema = medicalRecordSchema.omit({
  patientId: true,
  doctorId: true,
});

export const updateMedicalRecordSchema = medicalRecordSchema.partial().extend({
  id: z.string().uuid('Invalid medical record ID'),
});

// Lab report validation schema
export const labReportSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  doctorId: z.string().uuid('Invalid doctor ID'),
  testName: z.string()
    .min(2, 'Test name must be at least 2 characters')
    .max(200, 'Test name must be less than 200 characters'),
  testType: z.enum(['blood', 'urine', 'imaging', 'biopsy', 'other']),
  testDate: z.string(),
  results: z.string()
    .min(5, 'Results must be at least 5 characters')
    .max(5000, 'Results must be less than 5000 characters')
    .optional(),
  normalRange: z.string()
    .max(500, 'Normal range must be less than 500 characters')
    .optional(),
  status: z.enum(['pending', 'completed', 'cancelled']).default('pending'),
  fileUrl: z.string().url('Invalid file URL').optional(),
  notes: z.string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional(),
});

export const createLabReportSchema = labReportSchema.omit({
  patientId: true,
  doctorId: true,
  status: true,
});

// Type exports
export type Medication = z.infer<typeof medicationSchema>;
export type Prescription = z.infer<typeof prescriptionSchema>;
export type CreatePrescription = z.infer<typeof createPrescriptionSchema>;
export type UpdatePrescription = z.infer<typeof updatePrescriptionSchema>;
export type VitalSigns = z.infer<typeof vitalSignsSchema>;
export type MedicalRecord = z.infer<typeof medicalRecordSchema>;
export type CreateMedicalRecord = z.infer<typeof createMedicalRecordSchema>;
export type UpdateMedicalRecord = z.infer<typeof updateMedicalRecordSchema>;
export type LabReport = z.infer<typeof labReportSchema>;
export type CreateLabReport = z.infer<typeof createLabReportSchema>;
