import { supabase, handleSupabaseError } from './supabase';

export interface Doctor {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  specialization: string;
  license_number: string;
  years_of_experience: number;
  bio?: string;
  qualifications?: string;
  consultation_fee: number;
  availability?: any; // JSON object
  rating?: number;
  total_reviews?: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDoctorData {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  specialization: string;
  license_number: string;
  years_of_experience: number;
  bio?: string;
  qualifications?: string;
  consultation_fee: number;
  availability?: any;
}

export interface UpdateDoctorData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  years_of_experience?: number;
  bio?: string;
  qualifications?: string;
  consultation_fee?: number;
  availability?: any;
  is_verified?: boolean;
}

// Get all doctors (with optional filters)
export async function getDoctors(options?: {
  search?: string;
  specialization?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    let query = supabase.from('doctors').select('*', { count: 'exact' });

    // Search by name or specialization
    if (options?.search) {
      query = query.or(
        `first_name.ilike.%${options.search}%,last_name.ilike.%${options.search}%,specialization.ilike.%${options.search}%`
      );
    }

    // Filter by specialization
    if (options?.specialization) {
      query = query.eq('specialization', options.specialization);
    }

    // Pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options?.offset, options.offset + (options.limit || 10) - 1);
    }

    // Order by rating
    query = query.order('rating', { ascending: false, nullsFirst: false });

    const { data, error, count } = await query;

    if (error) throw handleSupabaseError(error);

    return {
      doctors: data || [],
      total: count || 0,
    };
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get doctor by ID
export async function getDoctorById(id: string) {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get doctor by user ID
export async function getDoctorByUserId(userId: string) {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Create new doctor
export async function createDoctor(doctorData: CreateDoctorData) {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .insert([{ ...doctorData, is_verified: false }])
      .select()
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Update doctor
export async function updateDoctor(id: string, updates: UpdateDoctorData) {
  try {
    const { data, error } = await supabase
      .from('doctors')
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

// Delete doctor
export async function deleteDoctor(id: string) {
  try {
    const { error } = await supabase.from('doctors').delete().eq('id', id);

    if (error) throw handleSupabaseError(error);
    return { success: true };
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get doctor's appointments
export async function getDoctorAppointments(doctorId: string) {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patients(*)')
      .eq('doctor_id', doctorId)
      .order('appointment_date', { ascending: false });

    if (error) throw handleSupabaseError(error);
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get doctor's reviews
export async function getDoctorReviews(doctorId: string) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, patients(first_name, last_name)')
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false });

    if (error) throw handleSupabaseError(error);
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get doctor specializations (for filters)
export async function getDoctorSpecializations() {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('specialization')
      .order('specialization');

    if (error) throw handleSupabaseError(error);

    // Get unique specializations
    const specializations = [...new Set(data?.map((d) => d.specialization) || [])];
    return specializations;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}
