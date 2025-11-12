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

// Get all telemedicine sessions
export async function getTelemedicineSessions(options?: {
  patient_id?: string;
  doctor_id?: string;
  status?: string;
  limit?: number;
}) {
  try {
    let query = supabase
      .from('telemedicine_sessions')
      .select('*, appointments(*), patients(*), doctors(*)');

    if (options?.patient_id) {
      query = query.eq('patient_id', options.patient_id);
    }
    if (options?.doctor_id) {
      query = query.eq('doctor_id', options.doctor_id);
    }
    if (options?.status) {
      query = query.eq('status', options.status);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw handleSupabaseError(error);
    return { sessions: data || [], total: data?.length || 0 };
  } catch (error) {
    throw handleSupabaseError(error);
  }
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

// Join session
export async function joinSession(sessionId: string) {
  try {
    const { data: session, error } = await supabase
      .from('telemedicine_sessions')
      .select('*, channel_name')
      .eq('id', sessionId)
      .single();

    if (error) throw handleSupabaseError(error);

    if (!session) {
      throw new Error('Session not found');
    }

    // Generate session URL (you can customize this based on your video provider)
    const sessionUrl = session.session_url || `/telemedicine/session/${sessionId}?channel=${session.channel_name}`;

    // Update session status to active if it's scheduled
    if (session.status === 'waiting' || session.status === 'scheduled') {
      await startSession(sessionId);
    }

    return { sessionUrl, session };
  } catch (error) {
    throw handleSupabaseError(error);
  }
}
