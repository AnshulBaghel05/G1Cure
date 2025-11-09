import { api, APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { getAuthData } from "~encore/auth";
import { supabaseAdmin } from "../supabase/client";
import AccessToken from 'agora-access-token';

const agoraAppId = secret("AgoraAppId");
const agoraAppCertificate = secret("AgoraAppCertificate");

export interface VideoSession {
  id: string;
  sessionId: string;
  channelName: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  status: "waiting" | "active" | "ended" | "cancelled";
  startTime?: Date;
  endTime?: Date;
  recordingUrl?: string;
  screenShareEnabled: boolean;
  chatEnabled: boolean;
  waitingRoomEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVideoSessionRequest {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  channelName?: string;
  enableScreenShare?: boolean;
  enableChat?: boolean;
  enableWaitingRoom?: boolean;
}

export interface JoinVideoSessionRequest {
  sessionId: string;
  userId: string;
  userRole: "patient" | "doctor";
}

export interface JoinVideoSessionResponse {
  token: string;
  channelName: string;
  sessionId: string;
  agoraAppId: string;
  uid: number;
  role: string;
}

export interface UpdateVideoSessionRequest {
  sessionId: string;
  status?: "waiting" | "active" | "ended" | "cancelled";
  recordingUrl?: string;
  screenShareEnabled?: boolean;
  chatEnabled?: boolean;
}

export interface VideoChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  senderRole: "patient" | "doctor";
  message: string;
  timestamp: Date;
}

export interface SendChatMessageRequest {
  sessionId: string;
  message: string;
}

// Generate Agora access token
function generateAgoraToken(channelName: string, uid: number, role: number): string {
  const appId = agoraAppId();
  const appCertificate = agoraAppCertificate();
  
  if (!appId || !appCertificate) {
    throw APIError.internal("Agora credentials not configured");
  }

  const token = new AccessToken(appId, appCertificate, channelName, uid);
  token.addPrivilege(AccessToken.Privileges.kJoinChannel, Math.floor(Date.now() / 1000) + 3600);
  token.addPrivilege(AccessToken.Privileges.kPublishAudioStream, Math.floor(Date.now() / 1000) + 3600);
  token.addPrivilege(AccessToken.Privileges.kPublishVideoStream, Math.floor(Date.now() / 1000) + 3600);
  token.addPrivilege(AccessToken.Privileges.kPublishDataStream, Math.floor(Date.now() / 1000) + 3600);

  return token.build();
}

// Create a new video session
export const createVideoSession = api<CreateVideoSessionRequest, VideoSession>(
  { expose: true, method: "POST", path: "/telemedicine/video/sessions", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    // Verify user has permission to create session
    if (auth.role !== 'doctor' && auth.role !== 'admin') {
      throw APIError.permissionDenied("Only doctors can create video sessions");
    }

    const channelName = req.channelName || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sessionId = `vs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const { data, error } = await supabaseAdmin
      .from("video_sessions")
      .insert({
        session_id: sessionId,
        channel_name: channelName,
        patient_id: req.patientId,
        doctor_id: req.doctorId,
        appointment_id: req.appointmentId,
        status: 'waiting',
        screen_share_enabled: req.enableScreenShare ?? true,
        chat_enabled: req.enableChat ?? true,
        waiting_room_enabled: req.enableWaitingRoom ?? true,
      })
      .select()
      .single();

    if (error) {
      throw APIError.internal("Failed to create video session", { cause: error });
    }

    return {
      id: data.id,
      sessionId: data.session_id,
      channelName: data.channel_name,
      patientId: data.patient_id,
      doctorId: data.doctor_id,
      appointmentId: data.appointment_id,
      status: data.status,
      startTime: data.start_time ? new Date(data.start_time) : undefined,
      endTime: data.end_time ? new Date(data.end_time) : undefined,
      recordingUrl: data.recording_url,
      screenShareEnabled: data.screen_share_enabled,
      chatEnabled: data.chat_enabled,
      waitingRoomEnabled: data.waiting_room_enabled,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
);

// Join a video session
export const joinVideoSession = api<JoinVideoSessionRequest, JoinVideoSessionResponse>(
  { expose: true, method: "POST", path: "/telemedicine/video/join", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    // Get session details
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("video_sessions")
      .select("*")
      .eq("session_id", req.sessionId)
      .single();

    if (sessionError || !session) {
      throw APIError.notFound("Video session not found");
    }

    // Verify user has permission to join
    if (req.userRole === 'patient' && session.patient_id !== req.userId) {
      throw APIError.permissionDenied("Patient can only join their own sessions");
    }
    if (req.userRole === 'doctor' && session.doctor_id !== req.userId) {
      throw APIError.permissionDenied("Doctor can only join their own sessions");
    }

    // Generate unique UID for the user
    const uid = Math.floor(Math.random() * 100000);
    
    // Generate Agora token
    const token = generateAgoraToken(session.channel_name, uid, req.userRole === 'doctor' ? 1 : 0);

    // Update session status if doctor is joining
    if (req.userRole === 'doctor' && session.status === 'waiting') {
      await supabaseAdmin
        .from("video_sessions")
        .update({ 
          status: 'active',
          start_time: new Date().toISOString()
        })
        .eq("session_id", req.sessionId);
    }

    return {
      token,
      channelName: session.channel_name,
      sessionId: session.session_id,
      agoraAppId: agoraAppId() || "",
      uid,
      role: req.userRole,
    };
  }
);

// End a video session
export const endVideoSession = api<{ sessionId: string }, { success: boolean }>(
  { expose: true, method: "POST", path: "/telemedicine/video/end", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    // Get session details
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("video_sessions")
      .select("*")
      .eq("session_id", req.sessionId)
      .single();

    if (sessionError || !session) {
      throw APIError.notFound("Video session not found");
    }

    // Verify user has permission to end session
    if (auth.role !== 'admin' && session.doctor_id !== auth.userID) {
      throw APIError.permissionDenied("Only the doctor or admin can end the session");
    }

    const { error } = await supabaseAdmin
      .from("video_sessions")
      .update({ 
        status: 'ended',
        end_time: new Date().toISOString()
      })
      .eq("session_id", req.sessionId);

    if (error) {
      throw APIError.internal("Failed to end video session", { cause: error });
    }

    return { success: true };
  }
);

// Send chat message
export const sendChatMessage = api<SendChatMessageRequest, VideoChatMessage>(
  { expose: true, method: "POST", path: "/telemedicine/video/chat", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    // Get session details
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("video_sessions")
      .select("*")
      .eq("session_id", req.sessionId)
      .single();

    if (sessionError || !session) {
      throw APIError.notFound("Video session not found");
    }

    // Verify user is part of the session
    if (session.patient_id !== auth.userID && session.doctor_id !== auth.userID) {
      throw APIError.permissionDenied("User not part of this session");
    }

    // Get user details
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("first_name, last_name, role")
      .eq("id", auth.userID)
      .single();

    if (userError || !user) {
      throw APIError.notFound("User not found");
    }

    const { data, error } = await supabaseAdmin
      .from("video_chat_messages")
      .insert({
        session_id: req.sessionId,
        sender_id: auth.userID,
        sender_name: `${user.first_name} ${user.last_name}`,
        sender_role: user.role === 'doctor' ? 'doctor' : 'patient',
        message: req.message,
      })
      .select()
      .single();

    if (error) {
      throw APIError.internal("Failed to send chat message", { cause: error });
    }

    return {
      id: data.id,
      sessionId: data.session_id,
      senderId: data.sender_id,
      senderName: data.sender_name,
      senderRole: data.sender_role,
      message: data.message,
      timestamp: new Date(data.created_at),
    };
  }
);

// Get chat messages for a session
export const getChatMessages = api<{ sessionId: string }, { messages: VideoChatMessage[] }>(
  { expose: true, method: "GET", path: "/telemedicine/video/chat/:sessionId", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    // Get session details
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("video_sessions")
      .select("*")
      .eq("session_id", req.sessionId)
      .single();

    if (sessionError || !session) {
      throw APIError.notFound("Video session not found");
    }

    // Verify user is part of the session
    if (session.patient_id !== auth.userID && session.doctor_id !== auth.userID) {
      throw APIError.permissionDenied("User not part of this session");
    }

    const { data, error } = await supabaseAdmin
      .from("video_chat_messages")
      .select("*")
      .eq("session_id", req.sessionId)
      .order("created_at", { ascending: true });

    if (error) {
      throw APIError.internal("Failed to get chat messages", { cause: error });
    }

    return {
      messages: data.map(msg => ({
        id: msg.id,
        sessionId: msg.session_id,
        senderId: msg.sender_id,
        senderName: msg.sender_name,
        senderRole: msg.sender_role,
        message: msg.message,
        timestamp: new Date(msg.created_at),
      }))
    };
  }
);
