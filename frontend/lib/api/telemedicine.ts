import { supabase, handleSupabaseError } from './supabase';

export interface TelemedicineSession {
  id: string;
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  session_url?: string;
  channel_name?: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  started_at?: string;
  ended_at?: string;
  duration_minutes?: number;
  created_at: string;
}

// Create telemedicine session
export async function createTelemedicineSession(appointmentId: string) {
  try {
    const { data: appointment } = await supabase
      .from('appointments')
      .select('patient_id, doctor_id')
      .eq('id', appointmentId)
      .single();

    if (!appointment) throw new Error('Appointment not found');

    const channelName = `session_${appointmentId}_${Date.now()}`;

    const { data, error } = await supabase
      .from('telemedicine_sessions')
      .insert([
        {
          appointment_id: appointmentId,
          patient_id: appointment.patient_id,
          doctor_id: appointment.doctor_id,
          channel_name: channelName,
          status: 'waiting',
        },
      ])
      .select()
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Get session by appointment ID
export async function getSessionByAppointmentId(appointmentId: string) {
  try {
    const { data, error } = await supabase
      .from('telemedicine_sessions')
      .select('*')
      .eq('appointment_id', appointmentId)
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// Start session
export async function startSession(sessionId: string) {
  try {
    const { data, error } = await supabase
      .from('telemedicine_sessions')
      .update({
        status: 'in_progress',
        started_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}

// End session
export async function endSession(sessionId: string) {
  try {
    const session = await supabase
      .from('telemedicine_sessions')
      .select('started_at')
      .eq('id', sessionId)
      .single();

    const duration = session.data?.started_at
      ? Math.floor(
          (new Date().getTime() - new Date(session.data.started_at).getTime()) / 60000
        )
      : 0;

    const { data, error } = await supabase
      .from('telemedicine_sessions')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        duration_minutes: duration,
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    throw handleSupabaseError(error);
  }
}
