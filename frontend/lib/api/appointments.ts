import { supabase, handleSupabaseError } from './supabase';

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  appointment_type: 'in_person' | 'telemedicine';
  reason: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentData {
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  appointment_type: 'in_person' | 'telemedicine';
  reason: string;
  notes?: string;
}

export interface UpdateAppointmentData {
  appointment_date?: string;
  appointment_time?: string;
  duration_minutes?: number;
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  appointment_type?: 'in_person' | 'telemedicine';
  reason?: string;
  notes?: string;
}

// Get all appointments (with optional filters)
export async function getAppointments(options?: {
  patient_id?: string;
  doctor_id?: string;
  status?: string;
  date?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    let query = supabase
      .from('appointments')
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

    // Filter by date
    if (options?.date) {
      query = query.eq('appointment_date', options.date);
    }

    // Pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    // Order by appointment date and time
    query = query.order('appointment_date', { ascending: true });
    query = query.order('appointment_time', { ascending: true });

    const { data, error, count } = await query;

    if (error) throw handleSupabaseError(error);

    return {
      appointments: data || [],
      total: count || 0,
    };
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get appointment by ID
export async function getAppointmentById(id: string) {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patients(*), doctors(*)')
      .eq('id', id)
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Create new appointment
export async function createAppointment(appointmentData: CreateAppointmentData) {
  try {
    // Check for conflicts
    const { data: conflicts } = await supabase
      .from('appointments')
      .select('id')
      .eq('doctor_id', appointmentData.doctor_id)
      .eq('appointment_date', appointmentData.appointment_date)
      .eq('appointment_time', appointmentData.appointment_time)
      .neq('status', 'cancelled');

    if (conflicts && conflicts.length > 0) {
      throw new Error('This time slot is already booked');
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert([{ ...appointmentData, status: 'scheduled' }])
      .select('*, patients(*), doctors(*)')
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Update appointment
export async function updateAppointment(id: string, updates: UpdateAppointmentData) {
  try {
    const { data, error } = await supabase
      .from('appointments')
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

// Cancel appointment
export async function cancelAppointment(id: string, reason?: string) {
  try {
    const updates: any = {
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    };

    if (reason) {
      updates.notes = reason;
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select('*, patients(*), doctors(*)')
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Reschedule appointment
export async function rescheduleAppointment(
  id: string,
  newDate: string,
  newTime: string
) {
  try {
    // Get the appointment
    const appointment = await getAppointmentById(id);

    // Check for conflicts at new time
    const { data: conflicts } = await supabase
      .from('appointments')
      .select('id')
      .eq('doctor_id', appointment.doctor_id)
      .eq('appointment_date', newDate)
      .eq('appointment_time', newTime)
      .neq('status', 'cancelled')
      .neq('id', id);

    if (conflicts && conflicts.length > 0) {
      throw new Error('This time slot is already booked');
    }

    const { data, error } = await supabase
      .from('appointments')
      .update({
        appointment_date: newDate,
        appointment_time: newTime,
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

// Complete appointment
export async function completeAppointment(id: string, notes?: string) {
  try {
    const updates: any = {
      status: 'completed',
      updated_at: new Date().toISOString(),
    };

    if (notes) {
      updates.notes = notes;
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select('*, patients(*), doctors(*)')
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get upcoming appointments
export async function getUpcomingAppointments(userId: string, role: 'patient' | 'doctor') {
  try {
    const today = new Date().toISOString().split('T')[0];

    let query = supabase
      .from('appointments')
      .select('*, patients(*), doctors(*)')
      .gte('appointment_date', today)
      .in('status', ['scheduled', 'confirmed']);

    if (role === 'patient') {
      query = query.eq('patient_id', userId);
    } else if (role === 'doctor') {
      query = query.eq('doctor_id', userId);
    }

    query = query.order('appointment_date', { ascending: true });
    query = query.order('appointment_time', { ascending: true });
    query = query.limit(10);

    const { data, error } = await query;

    if (error) throw handleSupabaseError(error);
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get available time slots for a doctor on a specific date
export async function getAvailableSlots(doctorId: string, date: string) {
  try {
    // Get all appointments for the doctor on this date
    const { data: bookedSlots, error } = await supabase
      .from('appointments')
      .select('appointment_time, duration_minutes')
      .eq('doctor_id', doctorId)
      .eq('appointment_date', date)
      .neq('status', 'cancelled');

    if (error) throw handleSupabaseError(error);

    // Generate all possible slots (9 AM to 5 PM, 30-minute intervals)
    const allSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        allSlots.push(time);
      }
    }

    // Filter out booked slots
    const bookedTimes = bookedSlots?.map((slot) => slot.appointment_time) || [];
    const availableSlots = allSlots.filter((slot) => !bookedTimes.includes(slot));

    return availableSlots;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}
