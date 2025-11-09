import { api, APIError } from "encore.dev/api";
import { supabaseAdmin } from "../supabase/client";

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePrescriptionRequest {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface UpdatePrescriptionRequest {
  id: string;
  medicationName?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

export interface ListPrescriptionsRequest {
  limit?: number;
  offset?: number;
  patientId?: string;
  doctorId?: string;
  appointmentId?: string;
}

export interface ListPrescriptionsResponse {
  prescriptions: Prescription[];
  total: number;
}

// Maps a Supabase row to the Prescription interface.
function mapRowToPrescription(row: any): Prescription {
  return {
    id: row.id,
    appointmentId: row.appointment_id,
    patientId: row.patient_id,
    doctorId: row.doctor_id,
    medicationName: row.medication_name,
    dosage: row.dosage,
    frequency: row.frequency,
    duration: row.duration,
    instructions: row.instructions,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// Creates a new prescription.
export const createPrescription = api<CreatePrescriptionRequest, Prescription>(
  { expose: true, method: "POST", path: "/prescriptions" },
  async (req) => {
    const { data, error } = await supabaseAdmin
      .from("prescriptions")
      .insert({
        appointment_id: req.appointmentId,
        patient_id: req.patientId,
        doctor_id: req.doctorId,
        medication_name: req.medicationName,
        dosage: req.dosage,
        frequency: req.frequency,
        duration: req.duration,
        instructions: req.instructions,
      })
      .select()
      .single();

    if (error) {
      throw APIError.internal("Failed to create prescription", { cause: error });
    }
    return mapRowToPrescription(data);
  }
);

// Retrieves a prescription by ID.
export const getPrescription = api<{ id: string }, Prescription>(
  { expose: true, method: "GET", path: "/prescriptions/:id" },
  async ({ id }) => {
    const { data, error } = await supabaseAdmin
      .from("prescriptions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw APIError.notFound("Prescription not found", { cause: error });
    }
    return mapRowToPrescription(data);
  }
);

// Lists prescriptions with optional filtering.
export const listPrescriptions = api<ListPrescriptionsRequest, ListPrescriptionsResponse>(
  { expose: true, method: "GET", path: "/prescriptions" },
  async (req) => {
    const limit = req.limit || 50;
    const offset = req.offset || 0;

    let query = supabaseAdmin.from("prescriptions").select("*", { count: "exact" });

    if (req.patientId) query = query.eq("patient_id", req.patientId);
    if (req.doctorId) query = query.eq("doctor_id", req.doctorId);
    if (req.appointmentId) query = query.eq("appointment_id", req.appointmentId);

    query = query.range(offset, offset + limit - 1).order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw APIError.internal("Failed to list prescriptions", { cause: error });
    }

    return {
      prescriptions: data.map(mapRowToPrescription),
      total: count || 0,
    };
  }
);

// Updates an existing prescription.
export const updatePrescription = api<UpdatePrescriptionRequest, Prescription>(
  { expose: true, method: "PUT", path: "/prescriptions/:id" },
  async (req) => {
    const { id, ...updates } = req;

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (updates.medicationName) updateData.medication_name = updates.medicationName;
    if (updates.dosage) updateData.dosage = updates.dosage;
    if (updates.frequency) updateData.frequency = updates.frequency;
    if (updates.duration) updateData.duration = updates.duration;
    if (updates.instructions) updateData.instructions = updates.instructions;

    const { data, error } = await supabaseAdmin
      .from("prescriptions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw APIError.internal("Failed to update prescription", { cause: error });
    }
    return mapRowToPrescription(data);
  }
);

// Deletes a prescription.
export const deletePrescription = api<{ id: string }, void>(
  { expose: true, method: "DELETE", path: "/prescriptions/:id" },
  async ({ id }) => {
    const { error } = await supabaseAdmin.from("prescriptions").delete().eq("id", id);
    if (error) {
      throw APIError.internal("Failed to delete prescription", { cause: error });
    }
  }
);
