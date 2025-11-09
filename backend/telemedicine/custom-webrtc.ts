import { api, APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { getAuthData } from "~encore/auth";
import { supabaseAdmin } from "../supabase/client";
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { EventEmitter } from 'events';

// Custom WebRTC Signaling Server
class CustomWebRTCSignalingServer extends EventEmitter {
  private io: SocketIOServer;
  private rooms: Map<string, Set<string>> = new Map();
  private userSessions: Map<string, any> = new Map();
  private stunServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ];
  private turnServers = [
    {
      urls: 'turn:your-turn-server.com:3478',
      username: 'username',
      credential: 'password'
    }
  ];

  constructor(server: any) {
    super();
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Join room
      socket.on('join-room', (data) => {
        const { roomId, userId, userRole } = data;
        socket.join(roomId);
        
        if (!this.rooms.has(roomId)) {
          this.rooms.set(roomId, new Set());
        }
        this.rooms.get(roomId)!.add(socket.id);
        
        this.userSessions.set(socket.id, { roomId, userId, userRole });
        
        // Notify others in room
        socket.to(roomId).emit('user-joined', {
          userId,
          userRole,
          socketId: socket.id
        });

        // Send room info to joining user
        const roomUsers = Array.from(this.rooms.get(roomId) || [])
          .filter(id => id !== socket.id)
          .map(id => this.userSessions.get(id));
        
        socket.emit('room-info', {
          users: roomUsers,
          stunServers: this.stunServers,
          turnServers: this.turnServers
        });
      });

      // Handle WebRTC signaling
      socket.on('offer', (data) => {
        socket.to(data.target).emit('offer', {
          offer: data.offer,
          from: socket.id
        });
      });

      socket.on('answer', (data) => {
        socket.to(data.target).emit('answer', {
          answer: data.answer,
          from: socket.id
        });
      });

      socket.on('ice-candidate', (data) => {
        socket.to(data.target).emit('ice-candidate', {
          candidate: data.candidate,
          from: socket.id
        });
      });

      // Screen sharing
      socket.on('screen-share-start', (data) => {
        socket.to(data.roomId).emit('screen-share-started', {
          from: socket.id,
          streamId: data.streamId
        });
      });

      socket.on('screen-share-stop', (data) => {
        socket.to(data.roomId).emit('screen-share-stopped', {
          from: socket.id
        });
      });

      // Chat messages
      socket.on('chat-message', (data) => {
        const session = this.userSessions.get(socket.id);
        if (session) {
          this.io.to(data.roomId).emit('chat-message', {
            message: data.message,
            from: socket.id,
            userId: session.userId,
            userRole: session.userRole,
            timestamp: new Date()
          });
        }
      });

      // Recording
      socket.on('start-recording', (data) => {
        socket.to(data.roomId).emit('recording-started', {
          from: socket.id
        });
      });

      socket.on('stop-recording', (data) => {
        socket.to(data.roomId).emit('recording-stopped', {
          from: socket.id,
          recordingUrl: data.recordingUrl
        });
      });

      // Disconnect
      socket.on('disconnect', () => {
        const session = this.userSessions.get(socket.id);
        if (session) {
          const roomId = session.roomId;
          const room = this.rooms.get(roomId);
          if (room) {
            room.delete(socket.id);
            if (room.size === 0) {
              this.rooms.delete(roomId);
            }
          }
          socket.to(roomId).emit('user-left', {
            userId: session.userId,
            socketId: socket.id
          });
        }
        this.userSessions.delete(socket.id);
      });
    });
  }

  public getIO() {
    return this.io;
  }
}

// WebRTC Session Management
export interface WebRTCSession {
  id: string;
  roomId: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  status: 'waiting' | 'active' | 'ended' | 'cancelled';
  startTime?: Date;
  endTime?: Date;
  recordingUrl?: string;
  participants: string[];
  quality: 'low' | 'medium' | 'high' | 'ultra';
  bandwidth: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWebRTCSessionRequest {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  enableRecording?: boolean;
  enableScreenShare?: boolean;
  enableChat?: boolean;
}

export interface JoinWebRTCSessionRequest {
  sessionId: string;
  userId: string;
  userRole: 'patient' | 'doctor';
}

export interface JoinWebRTCSessionResponse {
  sessionId: string;
  roomId: string;
  signalingUrl: string;
  stunServers: any[];
  turnServers: any[];
  quality: string;
  permissions: {
    canRecord: boolean;
    canScreenShare: boolean;
    canChat: boolean;
  };
}

// Create WebRTC session
export const createWebRTCSession = api<CreateWebRTCSessionRequest, WebRTCSession>(
  { expose: true, method: "POST", path: "/telemedicine/webrtc/sessions", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    if (auth.role !== 'doctor' && auth.role !== 'admin') {
      throw APIError.permissionDenied("Only doctors can create WebRTC sessions");
    }

    const roomId = `webrtc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sessionId = `wts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const { data, error } = await supabaseAdmin
      .from("webrtc_sessions")
      .insert({
        session_id: sessionId,
        room_id: roomId,
        patient_id: req.patientId,
        doctor_id: req.doctorId,
        appointment_id: req.appointmentId,
        status: 'waiting',
        quality: req.quality || 'high',
        bandwidth: 0,
        participants: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw APIError.internal("Failed to create WebRTC session", { cause: error });
    }

    return {
      id: data.id,
      sessionId: data.session_id,
      roomId: data.room_id,
      patientId: data.patient_id,
      doctorId: data.doctor_id,
      appointmentId: data.appointment_id,
      status: data.status,
      startTime: data.start_time ? new Date(data.start_time) : undefined,
      endTime: data.end_time ? new Date(data.end_time) : undefined,
      recordingUrl: data.recording_url,
      participants: data.participants || [],
      quality: data.quality,
      bandwidth: data.bandwidth,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
);

// Join WebRTC session
export const joinWebRTCSession = api<JoinWebRTCSessionRequest, JoinWebRTCSessionResponse>(
  { expose: true, method: "POST", path: "/telemedicine/webrtc/join", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("webrtc_sessions")
      .select("*")
      .eq("session_id", req.sessionId)
      .single();

    if (sessionError || !session) {
      throw APIError.notFound("WebRTC session not found");
    }

    // Verify permissions
    if (req.userRole === 'patient' && session.patient_id !== req.userId) {
      throw APIError.permissionDenied("Patient can only join their own sessions");
    }
    if (req.userRole === 'doctor' && session.doctor_id !== req.userId) {
      throw APIError.permissionDenied("Doctor can only join their own sessions");
    }

    // Update session status if doctor is joining
    if (req.userRole === 'doctor' && session.status === 'waiting') {
      await supabaseAdmin
        .from("webrtc_sessions")
        .update({ 
          status: 'active',
          start_time: new Date().toISOString()
        })
        .eq("session_id", req.sessionId);
    }

    // Add participant
    const participants = session.participants || [];
    if (!participants.includes(req.userId)) {
      participants.push(req.userId);
      await supabaseAdmin
        .from("webrtc_sessions")
        .update({ 
          participants,
          updated_at: new Date().toISOString()
        })
        .eq("session_id", req.sessionId);
    }

    return {
      sessionId: session.session_id,
      roomId: session.room_id,
      signalingUrl: `ws://localhost:4000/webrtc-signaling`,
      stunServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ],
      turnServers: [
        {
          urls: 'turn:your-turn-server.com:3478',
          username: 'username',
          credential: 'password'
        }
      ],
      quality: session.quality,
      permissions: {
        canRecord: req.userRole === 'doctor',
        canScreenShare: true,
        canChat: true,
      },
    };
  }
);

// End WebRTC session
export const endWebRTCSession = api<{ sessionId: string }, { success: boolean }>(
  { expose: true, method: "POST", path: "/telemedicine/webrtc/end", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("webrtc_sessions")
      .select("*")
      .eq("session_id", req.sessionId)
      .single();

    if (sessionError || !session) {
      throw APIError.notFound("WebRTC session not found");
    }

    // Verify permissions
    if (session.doctor_id !== auth.userId && auth.role !== 'admin') {
      throw APIError.permissionDenied("Only the doctor or admin can end the session");
    }

    const { error } = await supabaseAdmin
      .from("webrtc_sessions")
      .update({ 
        status: 'ended',
        end_time: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("session_id", req.sessionId);

    if (error) {
      throw APIError.internal("Failed to end WebRTC session", { cause: error });
    }

    return { success: true };
  }
);

// Get WebRTC session details
export const getWebRTCSession = api<{ sessionId: string }, WebRTCSession>(
  { expose: true, method: "GET", path: "/telemedicine/webrtc/sessions/:sessionId", auth: true },
  async (req) => {
    const { data: session, error } = await supabaseAdmin
      .from("webrtc_sessions")
      .select("*")
      .eq("session_id", req.sessionId)
      .single();

    if (error || !session) {
      throw APIError.notFound("WebRTC session not found");
    }

    return {
      id: session.id,
      sessionId: session.session_id,
      roomId: session.room_id,
      patientId: session.patient_id,
      doctorId: session.doctor_id,
      appointmentId: session.appointment_id,
      status: session.status,
      startTime: session.start_time ? new Date(session.start_time) : undefined,
      endTime: session.end_time ? new Date(session.end_time) : undefined,
      recordingUrl: session.recording_url,
      participants: session.participants || [],
      quality: session.quality,
      bandwidth: session.bandwidth,
      createdAt: new Date(session.created_at),
      updatedAt: new Date(session.updated_at),
    };
  }
);

// Initialize signaling server
let signalingServer: CustomWebRTCSignalingServer | null = null;

export function initializeWebRTCSignaling(server: any) {
  if (!signalingServer) {
    signalingServer = new CustomWebRTCSignalingServer(server);
    console.log('Custom WebRTC Signaling Server initialized');
  }
  return signalingServer;
}

export function getSignalingServer() {
  return signalingServer;
}
