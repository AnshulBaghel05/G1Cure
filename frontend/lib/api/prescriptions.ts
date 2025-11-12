import { supabase, handleSupabaseError } from './supabase';

export interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  medications: Medication[];
  diagnosis: string;
  notes?: string;
  issued_date: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface CreatePrescriptionData {
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  medications: Medication[];
  diagnosis: string;
  notes?: string;
  issued_date: string;
  expiry_date?: string;
}

// Get prescriptions for a patient
export async function getPatientPrescriptions(patientId: string) {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*, doctors(first_name, last_name, specialization)')
      .eq('patient_id', patientId)
      .order('issued_date', { ascending: false });

    if (error) throw handleSupabaseError(error);
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Create prescription
export async function createPrescription(prescriptionData: CreatePrescriptionData) {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .insert([prescriptionData])
      .select('*, doctors(first_name, last_name)')
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get prescription by ID
export async function getPrescriptionById(id: string) {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*, patients(*), doctors(*)')
      .eq('id', id)
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}
