import { api, APIError } from "encore.dev/api";
import { supabaseAdmin } from "../supabase/client";

export interface Bill {
  id: string;
  appointmentId: string;
  patientId: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: string;
  paymentReference?: string;
  invoiceNumber: string;
  dueDate: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBillRequest {
  appointmentId: string;
  patientId: string;
  amount: number;
  taxAmount?: number;
  dueDate: Date;
}

export interface UpdateBillRequest {
  id: string;
  amount?: number;
  taxAmount?: number;
  status?: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: string;
  paymentReference?: string;
  dueDate?: Date;
  paidAt?: Date;
}

export interface ListBillsRequest {
  limit?: number;
  offset?: number;
  patientId?: string;
  status?: string;
  appointmentId?: string;
}

export interface ListBillsResponse {
  bills: Bill[];
  total: number;
}

// Generates a unique invoice number
function generateInvoiceNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${timestamp}-${random}`;
}

// Maps a Supabase row to the Bill interface.
function mapRowToBill(row: any): Bill {
  return {
    id: row.id,
    appointmentId: row.appointment_id,
    patientId: row.patient_id,
    amount: row.amount,
    taxAmount: row.tax_amount,
    totalAmount: row.total_amount,
    status: row.status,
    paymentMethod: row.payment_method,
    paymentReference: row.payment_reference,
    invoiceNumber: row.invoice_number,
    dueDate: new Date(row.due_date),
    paidAt: row.paid_at ? new Date(row.paid_at) : undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// Creates a new bill.
export const createBill = api<CreateBillRequest, Bill>(
  { expose: true, method: "POST", path: "/bills" },
  async (req) => {
    const taxAmount = req.taxAmount || 0;
    const totalAmount = req.amount + taxAmount;

    const { data, error } = await supabaseAdmin
      .from("billing")
      .insert({
        appointment_id: req.appointmentId,
        patient_id: req.patientId,
        amount: req.amount,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        status: 'pending',
        invoice_number: generateInvoiceNumber(),
        due_date: req.dueDate.toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw APIError.internal("Failed to create bill", { cause: error });
    }
    return mapRowToBill(data);
  }
);

// Retrieves a bill by ID.
export const getBill = api<{ id: string }, Bill>(
  { expose: true, method: "GET", path: "/bills/:id" },
  async ({ id }) => {
    const { data, error } = await supabaseAdmin
      .from("billing")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw APIError.notFound("Bill not found", { cause: error });
    }
    return mapRowToBill(data);
  }
);

// Lists bills with optional filtering.
export const listBills = api<ListBillsRequest, ListBillsResponse>(
  { expose: true, method: "GET", path: "/bills" },
  async (req) => {
    const limit = req.limit || 50;
    const offset = req.offset || 0;

    let query = supabaseAdmin.from("billing").select("*", { count: "exact" });

    if (req.patientId) query = query.eq("patient_id", req.patientId);
    if (req.status) query = query.eq("status", req.status);
    if (req.appointmentId) query = query.eq("appointment_id", req.appointmentId);

    query = query.range(offset, offset + limit - 1).order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw APIError.internal("Failed to list bills", { cause: error });
    }

    return {
      bills: data.map(mapRowToBill),
      total: count || 0,
    };
  }
);

// Updates an existing bill.
export const updateBill = api<UpdateBillRequest, Bill>(
  { expose: true, method: "PUT", path: "/bills/:id" },
  async (req) => {
    const { id, ...updates } = req;

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (updates.amount) updateData.amount = updates.amount;
    if (updates.taxAmount) updateData.tax_amount = updates.taxAmount;
    if (updates.status) updateData.status = updates.status;
    if (updates.paymentMethod) updateData.payment_method = updates.paymentMethod;
    if (updates.paymentReference) updateData.payment_reference = updates.paymentReference;
    if (updates.dueDate) updateData.due_date = updates.dueDate.toISOString();
    if (updates.paidAt) updateData.paid_at = updates.paidAt.toISOString();

    // Recalculate total amount if amount or tax changed
    if (updates.amount !== undefined || updates.taxAmount !== undefined) {
      const { data: current, error } = await supabaseAdmin
        .from("billing")
        .select("amount, tax_amount")
        .eq("id", id)
        .single();
      
      if (error) throw APIError.notFound("Bill not found for recalculation");

      const newAmount = updates.amount !== undefined ? updates.amount : current.amount;
      const newTaxAmount = updates.taxAmount !== undefined ? updates.taxAmount : current.tax_amount;
      updateData.total_amount = newAmount + newTaxAmount;
    }

    const { data, error } = await supabaseAdmin
      .from("billing")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw APIError.internal("Failed to update bill", { cause: error });
    }
    return mapRowToBill(data);
  }
);

// Deletes a bill.
export const deleteBill = api<{ id: string }, void>(
  { expose: true, method: "DELETE", path: "/bills/:id" },
  async ({ id }) => {
    const { error } = await supabaseAdmin.from("billing").delete().eq("id", id);
    if (error) {
      throw APIError.internal("Failed to delete bill", { cause: error });
    }
  }
);
