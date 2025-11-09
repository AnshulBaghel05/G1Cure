import { api, APIError } from "encore.dev/api";
import { supabaseAdmin } from "../supabase/client";

export interface TelemedicineSession {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  roomId: string;
  status: "scheduled" | "active" | "completed" | "cancelled";
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  recordingUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSessionRequest {
  appointmentId: string;
  patientId: string;
  doctorId: string;
}

export interface UpdateSessionRequest {
  id: string;
  status?: "scheduled" | "active" | "completed" | "cancelled";
  startTime?: Date;
  endTime?: Date;
  recordingUrl?: string;
  notes?: string;
}

export interface ListSessionsRequest {
  limit?: number;
  offset?: number;
  patientId?: string;
  doctorId?: string;
  status?: string;
}

export interface ListSessionsResponse {
  sessions: TelemedicineSession[];
  total: number;
}

export interface JoinSessionResponse {
  roomId: string;
  token: string;
  sessionUrl: string;
}

// Generates a unique room ID
function generateRoomId(): string {
  return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Maps a Supabase row to the TelemedicineSession interface.
function mapRowToSession(row: any): TelemedicineSession {
  return {
    id: row.id,
    appointmentId: row.appointment_id,
    patientId: row.patient_id,
    doctorId: row.doctor_id,
    roomId: row.room_id,
    status: row.status,
    startTime: row.start_time ? new Date(row.start_time) : undefined,
    endTime: row.end_time ? new Date(row.end_time) : undefined,
    duration: row.duration,
    recordingUrl: row.recording_url,
    notes: row.notes,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// Creates a new telemedicine session.
export const createSession = api<CreateSessionRequest, TelemedicineSession>(
  { expose: true, method: "POST", path: "/telemedicine/sessions" },
  async (req) => {
    const roomId = generateRoomId();

    const { data, error } = await supabaseAdmin
      .from("telemedicine_sessions")
      .insert({
        appointment_id: req.appointmentId,
        patient_id: req.patientId,
        doctor_id: req.doctorId,
        room_id: roomId,
        status: 'scheduled',
      })
      .select()
      .single();

    if (error) {
      throw APIError.internal("Failed to create telemedicine session", { cause: error });
    }
    return mapRowToSession(data);
  }
);

// Retrieves a telemedicine session by ID.
export const getSession = api<{ id: string }, TelemedicineSession>(
  { expose: true, method: "GET", path: "/telemedicine/sessions/:id" },
  async ({ id }) => {
    const { data, error } = await supabaseAdmin
      .from("telemedicine_sessions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw APIError.notFound("Telemedicine session not found", { cause: error });
    }
    return mapRowToSession(data);
  }
);

// Lists telemedicine sessions with optional filtering.
export const listSessions = api<ListSessionsRequest, ListSessionsResponse>(
  { expose: true, method: "GET", path: "/telemedicine/sessions" },
  async (req) => {
    const limit = req.limit || 50;
    const offset = req.offset || 0;

    let query = supabaseAdmin.from("telemedicine_sessions").select("*", { count: "exact" });

    if (req.patientId) query = query.eq("patient_id", req.patientId);
    if (req.doctorId) query = query.eq("doctor_id", req.doctorId);
    if (req.status) query = query.eq("status", req.status);

    query = query.range(offset, offset + limit - 1).order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw APIError.internal("Failed to list telemedicine sessions", { cause: error });
    }

    return {
      sessions: data.map(mapRowToSession),
      total: count || 0,
    };
  }
);

// Updates an existing telemedicine session.
export const updateSession = api<UpdateSessionRequest, TelemedicineSession>(
  { expose: true, method: "PUT", path: "/telemedicine/sessions/:id" },
  async (req) => {
    const { id, ...updates } = req;

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (updates.status) updateData.status = updates.status;
    if (updates.startTime) updateData.start_time = updates.startTime.toISOString();
    if (updates.endTime) updateData.end_time = updates.endTime.toISOString();
    if (updates.recordingUrl) updateData.recording_url = updates.recordingUrl;
    if (updates.notes) updateData.notes = updates.notes;

    // Calculate duration if both start and end times are provided
    if (updates.startTime && updates.endTime) {
      const duration = Math.floor((updates.endTime.getTime() - updates.startTime.getTime()) / 1000 / 60);
      updateData.duration = duration;
    }

    const { data, error } = await supabaseAdmin
      .from("telemedicine_sessions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw APIError.internal("Failed to update telemedicine session", { cause: error });
    }
    return mapRowToSession(data);
  }
);

// Joins a telemedicine session and returns connection details.
export const joinSession = api<{ id: string }, JoinSessionResponse>(
  { expose: true, method: "POST", path: "/telemedicine/sessions/:id/join" },
  async ({ id }) => {
    const { data: session, error } = await supabaseAdmin
      .from("telemedicine_sessions")
      .select("room_id, status")
      .eq("id", id)
      .single();

    if (error || !session) {
      throw APIError.notFound("Telemedicine session not found");
    }

    if (session.status === "cancelled") {
      throw APIError.failedPrecondition("Session has been cancelled");
    }

    if (session.status === "completed") {
      throw APIError.failedPrecondition("Session has already been completed");
    }

    // Generate a temporary token for the session (in production, use proper JWT)
    const token = `temp_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Construct session URL (this would be your video conferencing URL)
    const sessionUrl = `https://meet.g1cure.com/room/${session.room_id}?token=${token}`;

    return {
      roomId: session.room_id,
      token,
      sessionUrl,
    };
  }
);

// Deletes a telemedicine session.
export const deleteSession = api<{ id: string }, void>(
  { expose: true, method: "DELETE", path: "/telemedicine/sessions/:id" },
  async ({ id }) => {
    const { error } = await supabaseAdmin.from("telemedicine_sessions").delete().eq("id", id);
    if (error) {
      throw APIError.internal("Failed to delete telemedicine session", { cause: error });
    }
  }
);
