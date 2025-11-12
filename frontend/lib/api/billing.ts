import { supabase, handleSupabaseError } from './supabase';

export interface Bill {
  id: string;
  patient_id: string;
  doctor_id?: string;
  appointment_id?: string;
  total_amount: number;
  paid_amount: number;
  status: 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
  due_date?: string;
  payment_method?: string;
  transaction_id?: string;
  items: BillItem[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BillItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface CreateBillData {
  patient_id: string;
  doctor_id?: string;
  appointment_id?: string;
  total_amount: number;
  paid_amount?: number;
  due_date?: string;
  items: BillItem[];
  notes?: string;
}

export interface UpdateBillData {
  total_amount?: number;
  paid_amount?: number;
  status?: 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
  due_date?: string;
  payment_method?: string;
  transaction_id?: string;
  items?: BillItem[];
  notes?: string;
}

export interface PaymentData {
  amount: number;
  payment_method: string;
  transaction_id?: string;
}

// Get all bills (with optional filters)
export async function getBills(options?: {
  patient_id?: string;
  doctor_id?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    let query = supabase
      .from('billing')
      .select('*, patients(*), doctors(*)', { count: 'exact' });

    // Filter by patient
    if (options?.patient_id) {
      query = query.eq('patient_id', options.patient_id);
    }

    // Filter by doctor
    if (options?.doctor_id) {
      query = query.eq('doctor_id', options.doctor_id);
    }

    // Filter by status
    if (options?.status) {
      query = query.eq('status', options.status);
    }

    // Pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    // Order by created date
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw handleSupabaseError(error);

    return {
      bills: data || [],
      total: count || 0,
    };
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get bill by ID
export async function getBillById(id: string) {
  try {
    const { data, error } = await supabase
      .from('billing')
      .select('*, patients(*), doctors(*), appointments(*)')
      .eq('id', id)
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Create new bill
export async function createBill(billData: CreateBillData) {
  try {
    const { data, error } = await supabase
      .from('billing')
      .insert([
        {
          ...billData,
          status: 'pending',
          paid_amount: billData.paid_amount || 0,
        },
      ])
      .select('*, patients(*), doctors(*)')
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Update bill
export async function updateBill(id: string, updates: UpdateBillData) {
  try {
    const { data, error } = await supabase
      .from('billing')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, patients(*), doctors(*)')
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Process payment
export async function processPayment(billId: string, paymentData: PaymentData) {
  try {
    // Get current bill
    const bill = await getBillById(billId);

    const newPaidAmount = bill.paid_amount + paymentData.amount;
    const newStatus =
      newPaidAmount >= bill.total_amount
        ? 'paid'
        : newPaidAmount > 0
        ? 'partially_paid'
        : 'pending';

    const { data, error } = await supabase
      .from('billing')
      .update({
        paid_amount: newPaidAmount,
        status: newStatus,
        payment_method: paymentData.payment_method,
        transaction_id: paymentData.transaction_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', billId)
      .select('*, patients(*), doctors(*)')
      .single();

    if (error) throw handleSupabaseError(error);

    // Record payment transaction
    await supabase.from('payment_transactions').insert([
      {
        bill_id: billId,
        amount: paymentData.amount,
        payment_method: paymentData.payment_method,
        transaction_id: paymentData.transaction_id,
        status: 'completed',
      },
    ]);

    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Cancel bill
export async function cancelBill(id: string) {
  try {
    const { data, error } = await supabase
      .from('billing')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, patients(*), doctors(*)')
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get patient billing summary
export async function getPatientBillingSummary(patientId: string) {
  try {
    const { data, error } = await supabase
      .from('billing')
      .select('status, total_amount, paid_amount')
      .eq('patient_id', patientId);

    if (error) throw handleSupabaseError(error);

    const summary = {
      total_billed: 0,
      total_paid: 0,
      total_pending: 0,
      total_overdue: 0,
    };

    data?.forEach((bill) => {
      summary.total_billed += bill.total_amount;
      summary.total_paid += bill.paid_amount;

      if (bill.status === 'pending' || bill.status === 'partially_paid') {
        summary.total_pending += bill.total_amount - bill.paid_amount;
      }

      if (bill.status === 'overdue') {
        summary.total_overdue += bill.total_amount - bill.paid_amount;
      }
    });

    return summary;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get payment history
export async function getPaymentHistory(patientId: string) {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*, billing!inner(patient_id)')
      .eq('billing.patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw handleSupabaseError(error);
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Mark overdue bills
export async function markOverdueBills() {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('billing')
      .update({ status: 'overdue' })
      .lt('due_date', today)
      .in('status', ['pending', 'partially_paid']);

    if (error) throw handleSupabaseError(error);
    return { success: true };
  } catch (error) {
    throw handleSupabaseError(error);
  }
}
