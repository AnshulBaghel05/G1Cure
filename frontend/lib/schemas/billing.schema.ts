import { z } from 'zod';

// Billing and payment validation schemas
export const billSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  appointmentId: z.string().uuid('Invalid appointment ID').optional(),
  amount: z.number()
    .positive('Amount must be positive')
    .max(1000000, 'Amount cannot exceed 1,000,000')
    .multipleOf(0.01, 'Amount must have at most 2 decimal places'),
  type: z.enum(['consultation', 'procedure', 'medication', 'lab-work', 'imaging', 'other']),
  description: z.string()
    .min(5, 'Description must be at least 5 characters')
    .max(500, 'Description must be less than 500 characters'),
  dueDate: z.string().refine((date) => {
    return !isNaN(new Date(date).getTime());
  }, 'Invalid due date'),
  status: z.enum(['paid', 'pending', 'overdue', 'disputed', 'cancelled']).default('pending'),
  insurance: z.string()
    .max(100, 'Insurance name must be less than 100 characters')
    .optional(),
  insuranceCoverage: z.number()
    .min(0, 'Insurance coverage cannot be negative')
    .max(100, 'Insurance coverage cannot exceed 100%')
    .optional(),
  patientResponsibility: z.number()
    .nonnegative('Patient responsibility cannot be negative'),
  items: z.array(z.object({
    name: z.string().min(1, 'Item name is required'),
    quantity: z.number().int().positive('Quantity must be positive'),
    unitPrice: z.number().positive('Unit price must be positive'),
    totalPrice: z.number().positive('Total price must be positive'),
  })).optional(),
});

export const createBillSchema = billSchema.omit({
  patientId: true,
  status: true,
  patientResponsibility: true,
}).extend({
  patientResponsibility: z.number().nonnegative().optional(),
});

export const updateBillSchema = billSchema.partial().extend({
  id: z.string().uuid('Invalid bill ID'),
});

export const paymentSchema = z.object({
  billId: z.string().uuid('Invalid bill ID'),
  amount: z.number()
    .positive('Amount must be positive')
    .multipleOf(0.01, 'Amount must have at most 2 decimal places'),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'insurance', 'cash', 'bank_transfer', 'upi']),
  transactionId: z.string()
    .min(5, 'Transaction ID must be at least 5 characters')
    .optional(),
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
});

export const cardPaymentSchema = z.object({
  cardNumber: z.string()
    .regex(/^\d{13,19}$/, 'Invalid card number')
    .refine((val) => {
      // Luhn algorithm validation
      let sum = 0;
      let isEven = false;
      for (let i = val.length - 1; i >= 0; i--) {
        let digit = parseInt(val[i]);
        if (isEven) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
      }
      return sum % 10 === 0;
    }, 'Invalid card number'),
  cardHolderName: z.string()
    .min(3, 'Card holder name must be at least 3 characters')
    .max(100, 'Card holder name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Card holder name can only contain letters'),
  expiryMonth: z.string()
    .regex(/^(0[1-9]|1[0-2])$/, 'Invalid expiry month (MM)'),
  expiryYear: z.string()
    .regex(/^\d{2}$/, 'Invalid expiry year (YY)')
    .refine((year) => {
      const currentYear = new Date().getFullYear() % 100;
      return parseInt(year) >= currentYear;
    }, 'Card has expired'),
  cvv: z.string()
    .regex(/^\d{3,4}$/, 'Invalid CVV'),
});

export const billFilterSchema = z.object({
  patientId: z.string().uuid().optional(),
  status: z.enum(['paid', 'pending', 'overdue', 'disputed', 'cancelled']).optional(),
  type: z.enum(['consultation', 'procedure', 'medication', 'lab-work', 'imaging', 'other']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.number().nonnegative().optional(),
  maxAmount: z.number().positive().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// Type exports
export type Bill = z.infer<typeof billSchema>;
export type CreateBill = z.infer<typeof createBillSchema>;
export type UpdateBill = z.infer<typeof updateBillSchema>;
export type Payment = z.infer<typeof paymentSchema>;
export type CardPayment = z.infer<typeof cardPaymentSchema>;
export type BillFilter = z.infer<typeof billFilterSchema>;
