import { api, APIError } from "encore.dev/api";
import { supabaseAdmin } from "../supabase/client";
import { createBill } from "./billing";
import { getAuthData } from "~encore/auth";

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: Date;
  duration: number;
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show";
  type: "consultation" | "follow-up" | "emergency" | "telemedicine";
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  createdAt: Date;
  updatedAt: Date;
  // Add nested patient and doctor info
  patient?: {
    firstName: string;
    lastName: string;
  };
  doctor?: {
    firstName: string;
    lastName: string;
    specialization: string;
    consultationFee: number;
  };
}

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  appointmentDate: Date;
  duration: number;
  type: "consultation" | "follow-up" | "emergency" | "telemedicine";
  notes?: string;
  symptoms?: string;
  price?: number; // Optional price for admin override
}

export interface UpdateAppointmentRequest {
  id: string;
  appointmentDate?: Date;
  duration?: number;
  status?: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show";
  type?: "consultation" | "follow-up" | "emergency" | "telemedicine";
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
}

export interface ListAppointmentsRequest {
  limit?: number;
  offset?: number;
  patientId?: string;
  doctorId?: string;
  status?: string;
  date?: Date;
}

export interface ListAppointmentsResponse {
  appointments: Appointment[];
  total: number;
}

// Maps a Supabase row to the Appointment interface.
function mapRowToAppointment(row: any): Appointment {
  return {
    id: row.id,
    patientId: row.patient_id,
    doctorId: row.doctor_id,
    appointmentDate: new Date(row.appointment_date),
    duration: row.duration,
    status: row.status,
    type: row.type,
    notes: row.notes,
    symptoms: row.symptoms,
    diagnosis: row.diagnosis,
    prescription: row.prescription,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    // Map nested data from the join
    patient: row.patients ? {
      firstName: row.patients.first_name,
      lastName: row.patients.last_name,
    } : undefined,
    doctor: row.doctors ? {
      firstName: row.doctors.first_name,
      lastName: row.doctors.last_name,
      specialization: row.doctors.specialization,
      consultationFee: row.doctors.consultation_fee,
    } : undefined,
  };
}

// Creates a new appointment.
export const createAppointment = api<CreateAppointmentRequest, Appointment>(
  { expose: true, method: "POST", path: "/appointments", auth: true },
  async (req) => {
    const auth = getAuthData();
    if (!auth) throw APIError.unauthenticated("User not authenticated");

    // 1. Create the appointment
    const { data: appointmentData, error: appointmentError } = await supabaseAdmin
      .from("appointments")
      .insert({
        patient_id: req.patientId,
        doctor_id: req.doctorId,
        appointment_date: req.appointmentDate.toISOString(),
        duration: req.duration,
        status: 'scheduled',
        type: req.type,
        notes: req.notes,
        symptoms: req.symptoms,
      })
      .select()
      .single();

    if (appointmentError) {
      throw APIError.internal("Failed to create appointment", { cause: appointmentError });
    }

    // 2. If the appointment is created successfully, create a bill
    // Admins can override the price, otherwise use the doctor's consultation fee.
    let billAmount = req.price;
    if (billAmount === undefined) {
      const { data: doctorData, error: doctorError } = await supabaseAdmin
        .from("doctors")
        .select("consultation_fee")
        .eq("id", req.doctorId)
        .single();
      
      if (doctorError || !doctorData) {
        // If we can't get the doctor's fee, we can't create a bill.
        // We should probably roll back the appointment creation or handle this case.
        // For now, we'll log an error and continue without a bill.
        console.error("Could not fetch doctor's fee to create bill:", doctorError);
      } else {
        billAmount = doctorData.consultation_fee;
      }
    }

    if (billAmount !== undefined) {
      try {
        await createBill({
          appointmentId: appointmentData.id,
          patientId: req.patientId,
          amount: billAmount,
          dueDate: new Date(req.appointmentDate), // Due on the day of appointment
        });
      } catch (billError) {
        // If bill creation fails, the appointment is still created.
        // This might need a more robust transaction/rollback mechanism in a real-world scenario.
        console.error("Failed to create bill for new appointment:", billError);
      }
    }

    return mapRowToAppointment(appointmentData);
  }
);

// Retrieves an appointment by ID.
export const getAppointment = api<{ id: string }, Appointment>(
  { expose: true, method: "GET", path: "/appointments/:id" },
  async ({ id }) => {
    const { data, error } = await supabaseAdmin
      .from("appointments")
      .select("*, patients(first_name, last_name), doctors(first_name, last_name, specialization, consultation_fee)")
      .eq("id", id)
      .single();

    if (error) {
      throw APIError.notFound("Appointment not found", { cause: error });
    }
    return mapRowToAppointment(data);
  }
);

// Lists appointments with optional filtering.
export const listAppointments = api<ListAppointmentsRequest, ListAppointmentsResponse>(
  { expose: true, method: "GET", path: "/appointments" },
  async (req) => {
    const limit = req.limit || 50;
    const offset = req.offset || 0;

    // Use a join to fetch related patient and doctor data
    let query = supabaseAdmin
      .from("appointments")
      .select("*, patients(first_name, last_name), doctors(first_name, last_name, specialization, consultation_fee)", { count: "exact" });

    if (req.patientId) query = query.eq("patient_id", req.patientId);
    if (req.doctorId) query = query.eq("doctor_id", req.doctorId);
    if (req.status) query = query.eq("status", req.status);
    if (req.date) {
      const startDate = new Date(req.date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(req.date);
      endDate.setHours(23, 59, 59, 999);
      query = query.gte("appointment_date", startDate.toISOString());
      query = query.lte("appointment_date", endDate.toISOString());
    }

    query = query.range(offset, offset + limit - 1).order("appointment_date", { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error("Supabase listAppointments error:", error);
      throw APIError.internal("Failed to list appointments", { cause: error });
    }

    return {
      appointments: data.map(mapRowToAppointment),
      total: count || 0,
    };
  }
);

// Updates an existing appointment.
export const updateAppointment = api<UpdateAppointmentRequest, Appointment>(
  { expose: true, method: "PUT", path: "/appointments/:id" },
  async (req) => {
    const { id, ...updates } = req;

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (updates.appointmentDate) updateData.appointment_date = updates.appointmentDate.toISOString();
    if (updates.duration) updateData.duration = updates.duration;
    if (updates.status) updateData.status = updates.status;
    if (updates.type) updateData.type = updates.type;
    if (updates.notes) updateData.notes = updates.notes;
    if (updates.symptoms) updateData.symptoms = updates.symptoms;
    if (updates.diagnosis) updateData.diagnosis = updates.diagnosis;
    if (updates.prescription) updateData.prescription = updates.prescription;

    const { data, error } = await supabaseAdmin
      .from("appointments")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw APIError.internal("Failed to update appointment", { cause: error });
    }
    return mapRowToAppointment(data);
  }
);

// Deletes an appointment.
export const deleteAppointment = api<{ id: string }, void>(
  { expose: true, method: "DELETE", path: "/appointments/:id" },
  async ({ id }) => {
    const { error } = await supabaseAdmin.from("appointments").delete().eq("id", id);
    if (error) {
      throw APIError.internal("Failed to delete appointment", { cause: error });
    }
  }
);
