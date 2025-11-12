import { supabase, supabaseAdmin, handleSupabaseError } from './supabase';

export interface Patient {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  emergency_contact: string;
  emergency_phone: string;
  medical_history?: string;
  allergies?: string;
  current_medications?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePatientData {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  emergency_contact: string;
  emergency_phone: string;
  medical_history?: string;
  allergies?: string;
  current_medications?: string;
}

export interface UpdatePatientData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  medical_history?: string;
  allergies?: string;
  current_medications?: string;
}

// Get all patients (with optional search and pagination)
export async function getPatients(options?: {
  search?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    let query = supabase.from('patients').select('*', { count: 'exact' });

    // Search by name or email
    if (options?.search) {
      query = query.or(
        `first_name.ilike.%${options.search}%,last_name.ilike.%${options.search}%,email.ilike.%${options.search}%`
      );
    }

    // Pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    // Order by created_at descending
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw handleSupabaseError(error);

    return {
      patients: data || [],
      total: count || 0,
    };
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get patient by ID
export async function getPatientById(id: string) {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get patient by user ID
export async function getPatientByUserId(userId: string) {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Create new patient
export async function createPatient(patientData: CreatePatientData) {
  try {
    const { data, error } = await supabase
      .from('patients')
      .insert([patientData])
      .select()
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Update patient
export async function updatePatient(id: string, updates: UpdatePatientData) {
  try {
    const { data, error } = await supabase
      .from('patients')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Delete patient
export async function deletePatient(id: string) {
  try {
    const { error } = await supabase.from('patients').delete().eq('id', id);

    if (error) throw handleSupabaseError(error);
    return { success: true };
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get patient's medical records
export async function getPatientMedicalRecords(patientId: string) {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('patient_id', patientId)
      .order('record_date', { ascending: false });

    if (error) throw handleSupabaseError(error);
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get patient's appointments
export async function getPatientAppointments(patientId: string) {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, doctors(*)')
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: false });

    if (error) throw handleSupabaseError(error);
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error);
  }
}
