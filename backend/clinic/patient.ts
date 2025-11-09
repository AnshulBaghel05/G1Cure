import { api, APIError } from "encore.dev/api";
import { supabaseAdmin } from "../supabase/client";

export interface Patient {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "other";
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePatientRequest {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "other";
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
}

export interface UpdatePatientRequest {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other";
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
}

export interface ListPatientsRequest {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface ListPatientsResponse {
  patients: Patient[];
  total: number;
}

// Maps a Supabase row to the Patient interface.
function mapRowToPatient(row: any): Patient {
  return {
    id: row.id,
    userId: row.user_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    dateOfBirth: new Date(row.date_of_birth),
    gender: row.gender,
    address: row.address,
    emergencyContact: row.emergency_contact,
    emergencyPhone: row.emergency_phone,
    medicalHistory: row.medical_history,
    allergies: row.allergies,
    currentMedications: row.current_medications,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// Creates a new patient record.
export const createPatient = api<CreatePatientRequest, Patient>(
  { expose: true, method: "POST", path: "/patients" },
  async (req) => {
    const { data, error } = await supabaseAdmin
      .from("patients")
      .insert({
        user_id: req.userId,
        first_name: req.firstName,
        last_name: req.lastName,
        email: req.email,
        phone: req.phone,
        date_of_birth: req.dateOfBirth.toISOString(),
        gender: req.gender,
        address: req.address,
        emergency_contact: req.emergencyContact,
        emergency_phone: req.emergencyPhone,
        medical_history: req.medicalHistory,
        allergies: req.allergies,
        current_medications: req.currentMedications,
      })
      .select()
      .single();

    if (error) {
      throw APIError.internal("Failed to create patient", { cause: error });
    }
    return mapRowToPatient(data);
  }
);

// Retrieves a patient by ID.
export const getPatient = api<{ id: string }, Patient>(
  { expose: true, method: "GET", path: "/patients/:id" },
  async ({ id }) => {
    const { data, error } = await supabaseAdmin
      .from("patients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw APIError.notFound("Patient not found", { cause: error });
    }
    return mapRowToPatient(data);
  }
);

// Lists all patients with optional search and pagination.
export const listPatients = api<ListPatientsRequest, ListPatientsResponse>(
  { expose: true, method: "GET", path: "/patients" },
  async (req) => {
    const limit = req.limit || 50;
    const offset = req.offset || 0;

    let query = supabaseAdmin.from("patients").select("*", { count: "exact" });

    if (req.search) {
      query = query.or(`first_name.ilike.%${req.search}%,last_name.ilike.%${req.search}%,email.ilike.%${req.search}%,phone.ilike.%${req.search}%`);
    }

    query = query.range(offset, offset + limit - 1).order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw APIError.internal("Failed to list patients", { cause: error });
    }

    return {
      patients: data.map(mapRowToPatient),
      total: count || 0,
    };
  }
);

// Updates an existing patient record.
export const updatePatient = api<UpdatePatientRequest, Patient>(
  { expose: true, method: "PUT", path: "/patients/:id" },
  async (req) => {
    const { id, ...updates } = req;

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (updates.firstName) updateData.first_name = updates.firstName;
    if (updates.lastName) updateData.last_name = updates.lastName;
    if (updates.email) updateData.email = updates.email;
    if (updates.phone) updateData.phone = updates.phone;
    if (updates.dateOfBirth) updateData.date_of_birth = updates.dateOfBirth.toISOString();
    if (updates.gender) updateData.gender = updates.gender;
    if (updates.address) updateData.address = updates.address;
    if (updates.emergencyContact) updateData.emergency_contact = updates.emergencyContact;
    if (updates.emergencyPhone) updateData.emergency_phone = updates.emergencyPhone;
    if (updates.medicalHistory) updateData.medical_history = updates.medicalHistory;
    if (updates.allergies) updateData.allergies = updates.allergies;
    if (updates.currentMedications) updateData.current_medications = updates.currentMedications;

    const { data, error } = await supabaseAdmin
      .from("patients")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw APIError.internal("Failed to update patient", { cause: error });
    }
    return mapRowToPatient(data);
  }
);

// Deletes a patient record.
export const deletePatient = api<{ id: string }, void>(
  { expose: true, method: "DELETE", path: "/patients/:id" },
  async ({ id }) => {
    const { error } = await supabaseAdmin.from("patients").delete().eq("id", id);
    if (error) {
      throw APIError.internal("Failed to delete patient", { cause: error });
    }
  }
);
