import { supabase, handleSupabaseError } from './supabase';

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id?: string;
  record_type: 'diagnosis' | 'lab_result' | 'imaging' | 'procedure' | 'note';
  title: string;
  description: string;
  record_date: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateMedicalRecordData {
  patient_id: string;
  doctor_id?: string;
  record_type: 'diagnosis' | 'lab_result' | 'imaging' | 'procedure' | 'note';
  title: string;
  description: string;
  record_date: string;
  attachments?: string[];
}

// Get medical records for a patient
export async function getPatientMedicalRecords(patientId: string) {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*, doctors(first_name, last_name)')
      .eq('patient_id', patientId)
      .order('record_date', { ascending: false });

    if (error) throw handleSupabaseError(error);
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Create medical record
export async function createMedicalRecord(recordData: CreateMedicalRecordData) {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .insert([recordData])
      .select('*, doctors(first_name, last_name)')
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get record by ID
export async function getMedicalRecordById(id: string) {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*, patients(*), doctors(*)')
      .eq('id', id)
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Upload file attachment
export async function uploadMedicalFile(file: File, patientId: string) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${patientId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('medical-files')
      .upload(fileName, file);

    if (error) throw handleSupabaseError(error);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('medical-files')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}
