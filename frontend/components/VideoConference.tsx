import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Maximize2
} from 'lucide-react';
import AgoraRTC, { 
  IAgoraRTCClient, 
  IAgoraRTCRemoteUser, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack,
  IScreenVideoTrack
} from 'agora-rtc-sdk-ng';
import backend from '~backend/client';

interface VideoConferenceProps {
  sessionId: string;
  channelName: string;
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

export function VideoConference({ 
  sessionId, 
  channelName, 
  userRole, 
  onEndCall, 
  onMinimize,
  isMinimized = false 
}: VideoConferenceProps) {
  const { toast } = useToast();
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localScreenTrack, setLocalScreenTrack] = useState<IScreenVideoTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeAgora();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const initializeAgora = async () => {
    try {
      // Get Agora credentials from backend
      const response = await backend.telemedicine.joinVideoSession({
        sessionId,
        userId: 'current-user-id', // This should come from auth context
        userRole,
      });

      const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      setClient(agoraClient);

      // Set up event handlers
      agoraClient.on('user-published', handleUserPublished);
      agoraClient.on('user-unpublished', handleUserUnpublished);
      agoraClient.on('user-joined', handleUserJoined);
      agoraClient.on('user-left', handleUserLeft);
      agoraClient.on('connection-state-change', handleConnectionStateChange);

      // Join the channel
      await agoraClient.join(response.agoraAppId, response.channelName, response.token, response.uid);
      setConnectionStatus('connected');

      // Create and publish local tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      await agoraClient.publish([audioTrack, videoTrack]);

      // Display local video
      if (localVideoRef.current) {
        audioTrack.play();
        videoTrack.play(localVideoRef.current);
      }

      setIsConnecting(false);
      toast({
        title: 'Connected',
        description: 'Successfully joined the video call',
      });

    } catch (error) {
      console.error('Failed to initialize Agora:', error);
      setConnectionStatus('disconnected');
      setIsConnecting(false);
      toast({
        title: 'Connection Failed',
        description: 'Failed to join the video call',
        variant: 'destructive',
      });
    }
  };

  const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
    await client?.subscribe(user, mediaType);

    if (mediaType === 'video') {
      setRemoteUsers(prev => [...prev, user]);
      if (remoteVideoRef.current) {
        user.videoTrack?.play(remoteVideoRef.current);
      }
    }
    if (mediaType === 'audio') {
      user.audioTrack?.play();
    }
  };

  const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
    setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
  };

  const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
    setRemoteUsers(prev => [...prev, user]);
  };

  const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
    setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
  };

  const handleConnectionStateChange = (curState: string, prevState: string) => {
    console.log('Connection state changed:', prevState, '->', curState);
    if (curState === 'CONNECTED') {
      setConnectionStatus('connected');
    } else if (curState === 'DISCONNECTED') {
      setConnectionStatus('disconnected');
    }
  };

  const toggleAudio = async () => {
    if (localAudioTrack) {
      if (isAudioEnabled) {
        await localAudioTrack.setEnabled(false);
        setIsAudioEnabled(false);
      } else {
        await localAudioTrack.setEnabled(true);
        setIsAudioEnabled(true);
      }
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      if (isVideoEnabled) {
        await localVideoTrack.setEnabled(false);
        setIsVideoEnabled(false);
      } else {
        await localVideoTrack.setEnabled(true);
        setIsVideoEnabled(true);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenTrack = await AgoraRTC.createScreenVideoTrack();
        setLocalScreenTrack(screenTrack);
        await client?.publish(screenTrack);
        setIsScreenSharing(true);
        toast({
          title: 'Screen Sharing Started',
          description: 'Your screen is now being shared',
        });
      } else {
        if (localScreenTrack) {
          await client?.unpublish(localScreenTrack);
          localScreenTrack.close();
          setLocalScreenTrack(null);
        }
        setIsScreenSharing(false);
        toast({
          title: 'Screen Sharing Stopped',
          description: 'Screen sharing has been stopped',
        });
      }
    } catch (error) {
      console.error('Screen sharing error:', error);
      toast({
        title: 'Screen Sharing Failed',
        description: 'Failed to start screen sharing',
        variant: 'destructive',
      });
    }
  };

  const toggleRecording = async () => {
    try {
      if (!isRecording) {
        // Start recording (this would integrate with your backend recording service)
        setIsRecording(true);
        toast({
          title: 'Recording Started',
          description: 'Session recording has begun',
        });
      } else {
        // Stop recording
        setIsRecording(false);
        toast({
          title: 'Recording Stopped',
          description: 'Session recording has stopped',
        });
      }
    } catch (error) {
      console.error('Recording error:', error);
      toast({
        title: 'Recording Failed',
        description: 'Failed to control recording',
        variant: 'destructive',
      });
    }
  };

  const sendChatMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await backend.telemedicine.sendChatMessage({
        sessionId,
        message: newMessage,
      });

      setChatMessages(prev => [...prev, {
        id: response.id,
        senderName: response.senderName,
        senderRole: response.senderRole,
        message: response.message,
        timestamp: response.timestamp,
      }]);

      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Message Failed',
        description: 'Failed to send chat message',
        variant: 'destructive',
      });
    }
  };

  const endCall = async () => {
    try {
      await backend.telemedicine.endVideoSession({ sessionId });
      cleanup();
      onEndCall();
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  const cleanup = () => {
    if (localAudioTrack) {
      localAudioTrack.close();
    }
    if (localVideoTrack) {
      localVideoTrack.close();
    }
    if (localScreenTrack) {
      localScreenTrack.close();
    }
    if (client) {
      client.leave();
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Card className="w-80 bg-white shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Video Call</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
                  {connectionStatus}
                </Badge>
                <Button size="sm" variant="ghost" onClick={onMinimize}>
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-center space-x-2">
              <Button size="sm" onClick={toggleAudio} variant={isAudioEnabled ? 'default' : 'destructive'}>
                {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>
              <Button size="sm" onClick={toggleVideo} variant={isVideoEnabled ? 'default' : 'destructive'}>
                {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </Button>
              <Button size="sm" onClick={endCall} variant="destructive">
                <PhoneOff className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black"
    >
      <div className="relative h-full flex">
        {/* Main Video Area */}
        <div className="flex-1 relative">
          {/* Remote Video */}
          <div 
            ref={remoteVideoRef}
            className="w-full h-full bg-gray-900"
          />
          
          {/* Local Video */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden">
            <div 
              ref={localVideoRef}
              className="w-full h-full"
            />
          </div>

          {/* Connection Status */}
          <div className="absolute top-4 left-4">
            <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
              {connectionStatus}
            </Badge>
          </div>

          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-4 left-32">
              <Badge variant="destructive" className="animate-pulse">
                <Recording className="w-3 h-3 mr-1" />
                Recording
              </Badge>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full p-2">
              <Button
                size="sm"
                onClick={toggleAudio}
                variant={isAudioEnabled ? 'default' : 'destructive'}
                className="rounded-full w-12 h-12"
              >
                {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>
              
              <Button
                size="sm"
                onClick={toggleVideo}
                variant={isVideoEnabled ? 'default' : 'destructive'}
                className="rounded-full w-12 h-12"
              >
                {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>
              
              <Button
                size="sm"
                onClick={toggleScreenShare}
                variant={isScreenSharing ? 'destructive' : 'default'}
                className="rounded-full w-12 h-12"
              >
                {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
              </Button>
              
              <Button
                size="sm"
                onClick={toggleRecording}
                variant={isRecording ? 'destructive' : 'default'}
                className="rounded-full w-12 h-12"
              >
                {isRecording ? <RecordingOff className="w-5 h-5" /> : <Recording className="w-5 h-5" />}
              </Button>
              
              <Button
                size="sm"
                onClick={() => setIsChatOpen(!isChatOpen)}
                variant={isChatOpen ? 'default' : 'outline'}
                className="rounded-full w-12 h-12"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
              
              <Button
                size="sm"
                onClick={endCall}
                variant="destructive"
                className="rounded-full w-12 h-12"
              >
                <PhoneOff className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Minimize Button */}
          {onMinimize && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onMinimize}
              className="absolute top-4 right-4 text-white hover:bg-white/20"
            >
              <Minimize2 className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Chat Panel */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="w-80 bg-white border-l border-gray-200 flex flex-col"
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold">Chat</h3>
              </div>
              
              <div 
                ref={chatContainerRef}
                className="flex-1 p-4 overflow-y-auto space-y-2"
              >
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col ${
                      message.senderRole === userRole ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        message.senderRole === userRole
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm font-medium">{message.senderName}</p>
                      <p className="text-sm">{message.message}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button size="sm" onClick={sendChatMessage}>
                    Send
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading Overlay */}
      {isConnecting && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Connecting to video call...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
