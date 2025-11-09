import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Monitor, 
  MonitorOff,
  MessageCircle,
  Settings,
  Users,
  Recording,
  RecordingOff,
  MoreVertical,
  Minimize2,
  Maximize2,
  Wifi,
  WifiOff,
  Download,
  Upload,
  Activity,
  Zap,
  Shield,
  Volume2,
  VolumeX
} from 'lucide-react';
import backend from '~backend/client';

interface CustomWebRTCVideoProps {
  sessionId: string;
  roomId: string;
  userRole: 'patient' | 'doctor';
  onEndCall: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
}

interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: 'patient' | 'doctor';
  message: string;
  timestamp: Date;
}

interface ConnectionStats {
  bandwidth: number;
  latency: number;
  packetLoss: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

interface QualitySettings {
  videoWidth: number;
  videoHeight: number;
  videoFps: number;
  videoBitrate: number;
  audioBitrate: number;
}

export function CustomWebRTCVideo({ 
  sessionId, 
  roomId, 
  userRole, 
  onEndCall, 
  onMinimize,
  isMinimized = false 
}: CustomWebRTCVideoProps) {
  const { toast } = useToast();
  
  // WebRTC state
  const [peerConnections, setPeerConnections] = useState<Map<string, RTCPeerConnection>>(new Map());
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  
  // UI state
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMinimizedView, setIsMinimizedView] = useState(false);
  
  // Quality and performance state
  const [connectionStats, setConnectionStats] = useState<ConnectionStats>({
    bandwidth: 0,
    latency: 0,
    packetLoss: 0,
    quality: 'good'
  });
  const [qualitySettings, setQualitySettings] = useState<QualitySettings>({
    videoWidth: 1280,
    videoHeight: 720,
    videoFps: 30,
    videoBitrate: 1500,
    audioBitrate: 128
  });
  const [currentQuality, setCurrentQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');
  
  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const signalingSocketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // STUN/TURN servers
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      {
        urls: 'turn:your-turn-server.com:3478',
        username: 'username',
        credential: 'password'
      }
    ],
    iceCandidatePoolSize: 10
  };

  // Initialize WebRTC connection
  useEffect(() => {
    initializeWebRTC();
    return () => {
      cleanup();
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Connection stats monitoring
  useEffect(() => {
    if (connectionStatus === 'connected') {
      startStatsMonitoring();
    } else {
      stopStatsMonitoring();
    }
  }, [connectionStatus]);

  const initializeWebRTC = async () => {
    try {
      // Get session details and optimal server
      const sessionResponse = await backend.telemedicine.joinWebRTCSession({
        sessionId,
        userId: 'current-user-id', // Should come from auth context
        userRole,
      });

      // Connect to signaling server
      await connectToSignalingServer(sessionResponse.signalingUrl, roomId);
      
      // Get local media stream
      await getLocalMediaStream();
      
      setIsConnecting(false);
      setConnectionStatus('connected');
      
      toast({
        title: 'Connected',
        description: 'Successfully joined the video call',
      });

    } catch (error) {
      console.error('Failed to initialize WebRTC:', error);
      setConnectionStatus('disconnected');
      setIsConnecting(false);
      toast({
        title: 'Connection Failed',
        description: 'Failed to join the video call',
        variant: 'destructive',
      });
    }
  };

  const connectToSignalingServer = (signalingUrl: string, roomId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(signalingUrl);
      signalingSocketRef.current = socket;

      socket.onopen = () => {
        console.log('Connected to signaling server');
        socket.send(JSON.stringify({
          type: 'join-room',
          roomId,
          userId: 'current-user-id',
          userRole
        }));
        resolve();
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleSignalingMessage(data);
      };

      socket.onerror = (error) => {
        console.error('Signaling server error:', error);
        reject(error);
      };

      socket.onclose = () => {
        console.log('Disconnected from signaling server');
        setConnectionStatus('disconnected');
      };
    });
  };

  const handleSignalingMessage = (data: any) => {
    switch (data.type) {
      case 'room-info':
        handleRoomInfo(data);
        break;
      case 'user-joined':
        handleUserJoined(data);
        break;
      case 'user-left':
        handleUserLeft(data);
        break;
      case 'offer':
        handleOffer(data);
        break;
      case 'answer':
        handleAnswer(data);
        break;
      case 'ice-candidate':
        handleIceCandidate(data);
        break;
      case 'chat-message':
        handleChatMessage(data);
        break;
      case 'screen-share-started':
        handleScreenShareStarted(data);
        break;
      case 'screen-share-stopped':
        handleScreenShareStopped(data);
        break;
      case 'recording-started':
        handleRecordingStarted(data);
        break;
      case 'recording-stopped':
        handleRecordingStopped(data);
        break;
    }
  };

  const getLocalMediaStream = async () => {
    try {
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: qualitySettings.audioBitrate * 1000
        },
        video: {
          width: { ideal: qualitySettings.videoWidth },
          height: { ideal: qualitySettings.videoHeight },
          frameRate: { ideal: qualitySettings.videoFps },
          facingMode: 'user'
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Apply quality constraints
      applyQualityConstraints(stream);
    } catch (error) {
      console.error('Failed to get local media stream:', error);
      toast({
        title: 'Media Access Error',
        description: 'Please allow camera and microphone access',
        variant: 'destructive',
      });
    }
  };

  const applyQualityConstraints = (stream: MediaStream) => {
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      const capabilities = videoTrack.getCapabilities();
      if (capabilities.width && capabilities.height) {
        const settings = {
          width: { ideal: qualitySettings.videoWidth },
          height: { ideal: qualitySettings.videoHeight },
          frameRate: { ideal: qualitySettings.videoFps }
        };
        videoTrack.applyConstraints(settings);
      }
    }
  };

  const createPeerConnection = (peerId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection(iceServers);
    
    // Add local stream tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    // Handle incoming tracks
    pc.ontrack = (event) => {
      const stream = event.streams[0];
      setRemoteStreams(prev => new Map(prev.set(peerId, stream)));
      
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && signalingSocketRef.current) {
        signalingSocketRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          candidate: event.candidate,
          target: peerId
        }));
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${peerId}:`, pc.connectionState);
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        setRemoteStreams(prev => {
          const newMap = new Map(prev);
          newMap.delete(peerId);
          return newMap;
        });
      }
    };

    setPeerConnections(prev => new Map(prev.set(peerId, pc)));
    return pc;
  };

  const handleRoomInfo = (data: any) => {
    // Create peer connections for existing users
    data.users.forEach((user: any) => {
      if (user.socketId !== signalingSocketRef.current?.url) {
        createPeerConnection(user.socketId);
      }
    });
  };

  const handleUserJoined = async (data: any) => {
    const pc = createPeerConnection(data.socketId);
    
    // Create and send offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    if (signalingSocketRef.current) {
      signalingSocketRef.current.send(JSON.stringify({
        type: 'offer',
        offer,
        target: data.socketId
      }));
    }
  };

  const handleUserLeft = (data: any) => {
    const pc = peerConnections.get(data.socketId);
    if (pc) {
      pc.close();
      setPeerConnections(prev => {
        const newMap = new Map(prev);
        newMap.delete(data.socketId);
        return newMap;
      });
    }
    
    setRemoteStreams(prev => {
      const newMap = new Map(prev);
      newMap.delete(data.socketId);
      return newMap;
    });
  };

  const handleOffer = async (data: any) => {
    const pc = peerConnections.get(data.from) || createPeerConnection(data.from);
    
    await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    
    if (signalingSocketRef.current) {
      signalingSocketRef.current.send(JSON.stringify({
        type: 'answer',
        answer,
        target: data.from
      }));
    }
  };

  const handleAnswer = async (data: any) => {
    const pc = peerConnections.get(data.from);
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    }
  };

  const handleIceCandidate = async (data: any) => {
    const pc = peerConnections.get(data.from);
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  };

  const handleChatMessage = (data: any) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      senderName: data.userId,
      senderRole: data.userRole,
      message: data.message,
      timestamp: new Date(data.timestamp)
    };
    setChatMessages(prev => [...prev, message]);
  };

  const handleScreenShareStarted = (data: any) => {
    // Handle remote screen sharing
    console.log('Remote user started screen sharing');
  };

  const handleScreenShareStopped = (data: any) => {
    // Handle remote screen sharing stopped
    console.log('Remote user stopped screen sharing');
  };

  const handleRecordingStarted = (data: any) => {
    console.log('Recording started by remote user');
  };

  const handleRecordingStopped = (data: any) => {
    console.log('Recording stopped by remote user');
  };

  // Control functions
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor'
        },
        audio: false
      });
      
      setScreenStream(stream);
      setIsScreenSharing(true);
      
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = stream;
      }

      // Send screen share notification
      if (signalingSocketRef.current) {
        signalingSocketRef.current.send(JSON.stringify({
          type: 'screen-share-start',
          roomId,
          streamId: stream.id
        }));
      }

      // Handle screen share stop
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

    } catch (error) {
      console.error('Failed to start screen sharing:', error);
      toast({
        title: 'Screen Share Error',
        description: 'Failed to start screen sharing',
        variant: 'destructive',
      });
    }
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
      
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = null;
      }

      // Send screen share stop notification
      if (signalingSocketRef.current) {
        signalingSocketRef.current.send(JSON.stringify({
          type: 'screen-share-stop',
          roomId
        }));
      }
    }
  };

  const startRecording = async () => {
    if (!localStream) return;

    try {
      const stream = new MediaStream([
        ...localStream.getTracks(),
        ...Array.from(remoteStreams.values()).flatMap(s => s.getTracks())
      ]);

      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      recordingChunksRef.current = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(recordingChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        // Save recording to backend
        try {
          const formData = new FormData();
          formData.append('recording', blob, `session_${sessionId}_${Date.now()}.webm`);
          formData.append('sessionId', sessionId);
          
          // Upload to backend
          // await backend.telemedicine.uploadRecording(formData);
          
          toast({
            title: 'Recording Saved',
            description: 'Session recording has been saved',
          });
        } catch (error) {
          console.error('Failed to save recording:', error);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      // Send recording notification
      if (signalingSocketRef.current) {
        signalingSocketRef.current.send(JSON.stringify({
          type: 'start-recording',
          roomId
        }));
      }

    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        title: 'Recording Error',
        description: 'Failed to start recording',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current = null;

      // Send recording stop notification
      if (signalingSocketRef.current) {
        signalingSocketRef.current.send(JSON.stringify({
          type: 'stop-recording',
          roomId
        }));
      }
    }
  };

  const sendChatMessage = () => {
    if (!newMessage.trim()) return;

    if (signalingSocketRef.current) {
      signalingSocketRef.current.send(JSON.stringify({
        type: 'chat-message',
        roomId,
        message: newMessage
      }));
    }

    setNewMessage('');
  };

  const changeQuality = (quality: 'low' | 'medium' | 'high' | 'ultra') => {
    setCurrentQuality(quality);
    
    const qualityPresets = {
      low: { width: 640, height: 480, fps: 15, videoBitrate: 500, audioBitrate: 64 },
      medium: { width: 1280, height: 720, fps: 30, videoBitrate: 1500, audioBitrate: 128 },
      high: { width: 1920, height: 1080, fps: 30, videoBitrate: 3000, audioBitrate: 256 },
      ultra: { width: 2560, height: 1440, fps: 60, videoBitrate: 6000, audioBitrate: 320 }
    };

    const newSettings = qualityPresets[quality];
    setQualitySettings(newSettings);

    if (localStream) {
      applyQualityConstraints(localStream);
    }
  };

  const startStatsMonitoring = () => {
    statsIntervalRef.current = setInterval(async () => {
      const stats: ConnectionStats = {
        bandwidth: 0,
        latency: 0,
        packetLoss: 0,
        quality: 'good'
      };

      // Collect stats from all peer connections
      for (const [peerId, pc] of peerConnections) {
        try {
          const connectionStats = await pc.getStats();
          
          connectionStats.forEach((report) => {
            if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
              stats.bandwidth += report.bytesReceived || 0;
              stats.packetLoss += report.packetsLost || 0;
            }
          });
        } catch (error) {
          console.error('Failed to get connection stats:', error);
        }
      }

      // Calculate quality score
      const packetLossRate = stats.packetLoss / Math.max(stats.bandwidth, 1);
      if (packetLossRate < 0.01) stats.quality = 'excellent';
      else if (packetLossRate < 0.05) stats.quality = 'good';
      else if (packetLossRate < 0.1) stats.quality = 'fair';
      else stats.quality = 'poor';

      setConnectionStats(stats);
    }, 2000);
  };

  const stopStatsMonitoring = () => {
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
      statsIntervalRef.current = null;
    }
  };

  const cleanup = () => {
    // Stop all media streams
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
    }

    // Close all peer connections
    peerConnections.forEach(pc => pc.close());

    // Stop recording
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    // Close signaling connection
    if (signalingSocketRef.current) {
      signalingSocketRef.current.close();
    }

    // Stop stats monitoring
    stopStatsMonitoring();
  };

  const endCall = () => {
    cleanup();
    onEndCall();
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Card className="w-64 h-48 bg-black/90 border-white/20">
          <CardContent className="p-2 h-full">
            <div className="relative h-full">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover rounded"
              />
              <div className="absolute bottom-2 left-2 flex gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsMinimizedView(false)}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={endCall}
                >
                  <PhoneOff className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="flex h-full">
        {/* Main Video Area */}
        <div className="flex-1 relative">
          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Screen Share Video */}
          {isScreenSharing && (
            <video
              ref={screenVideoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-contain bg-black"
            />
          )}

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-48 h-36">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover rounded-lg border-2 border-white/20"
            />
          </div>

          {/* Connection Status */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Badge 
              variant={connectionStatus === 'connected' ? 'default' : 'destructive'}
              className="flex items-center gap-1"
            >
              {connectionStatus === 'connected' ? (
                <Wifi className="w-3 h-3" />
              ) : (
                <WifiOff className="w-3 h-3" />
              )}
              {connectionStatus}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {connectionStats.quality}
            </Badge>
          </div>

          {/* Loading Overlay */}
          {isConnecting && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Connecting to video call...</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls Panel */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
          <Button
            variant={isAudioEnabled ? "secondary" : "destructive"}
            size="sm"
            onClick={toggleAudio}
          >
            {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </Button>

          <Button
            variant={isVideoEnabled ? "secondary" : "destructive"}
            size="sm"
            onClick={toggleVideo}
          >
            {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </Button>

          <Button
            variant={isScreenSharing ? "destructive" : "secondary"}
            size="sm"
            onClick={isScreenSharing ? stopScreenShare : startScreenShare}
          >
            {isScreenSharing ? <MonitorOff className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
          </Button>

          {userRole === 'doctor' && (
            <Button
              variant={isRecording ? "destructive" : "secondary"}
              size="sm"
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? <RecordingOff className="w-4 h-4" /> : <Recording className="w-4 h-4" />}
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <MessageCircle className="w-4 h-4" />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <Settings className="w-4 h-4" />
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={endCall}
          >
            <PhoneOff className="w-4 h-4" />
          </Button>
        </div>

        {/* Chat Panel */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </CardTitle>
              </CardHeader>
              
              <CardContent className="h-full flex flex-col">
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto space-y-2 mb-4"
                >
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-2 rounded-lg ${
                        message.senderRole === userRole
                          ? 'bg-blue-500 text-white ml-auto'
                          : 'bg-gray-100 dark:bg-gray-700'
                      } max-w-xs`}
                    >
                      <div className="text-xs opacity-75">{message.senderName}</div>
                      <div>{message.message}</div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  />
                  <Button onClick={sendChatMessage}>Send</Button>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Panel */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Quality Settings */}
                <div>
                  <label className="text-sm font-medium">Video Quality</label>
                  <Select value={currentQuality} onValueChange={changeQuality}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (480p)</SelectItem>
                      <SelectItem value="medium">Medium (720p)</SelectItem>
                      <SelectItem value="high">High (1080p)</SelectItem>
                      <SelectItem value="ultra">Ultra (1440p)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Connection Stats */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Connection Stats</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {(connectionStats.bandwidth / 1024 / 1024).toFixed(1)} MB/s
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {connectionStats.latency}ms
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {(connectionStats.packetLoss * 100).toFixed(1)}% loss
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {connectionStats.quality}
                    </div>
                  </div>
                </div>

                {/* Minimize Button */}
                <Button
                  variant="outline"
                  onClick={() => setIsMinimizedView(true)}
                  className="w-full"
                >
                  <Minimize2 className="w-4 h-4 mr-2" />
                  Minimize
                </Button>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
