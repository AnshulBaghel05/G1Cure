import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, Phone, Mic, MicOff, Camera, CameraOff, MessageSquare, 
  Calendar, Clock, User, Stethoscope, Plus, Search, Eye, 
  CheckCircle, AlertCircle, Heart, Star, Wifi, Signal, Download
} from 'lucide-react';
import { 
  AnimatedCard, AnimatedButton, AnimatedIcon, AnimatedBadge, 
  AnimatedInput, AnimatedModal 
} from '@/components/ui';
import { ThemeToggle } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useBackendClient } from '../../lib/backend';

interface TelemedicineSession {
  id: string;
  date: string;
  time: string;
  doctor: string;
  specialty: string;
  status: 'scheduled' | 'completed';
  duration: number;
  type: 'consultation' | 'follow-up';
  notes?: string;
  meetingId?: string;
}

export function TelemedicinePage() {
  const { user } = useAuth();
  const backend = useBackendClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedSession, setSelectedSession] = useState<TelemedicineSession | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookSessionModalOpen, setIsBookSessionModalOpen] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [newSession, setNewSession] = useState({
    doctor: '',
    appointmentDate: '',
    duration: '30',
    type: 'consultation',
    notes: ''
  });
  const [telemedicineSessions, setTelemedicineSessions] = useState<TelemedicineSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);

        // Load telemedicine sessions from backend
        const sessionsResponse = await backend.telemedicine.listSessions({
          patientId: user.profile_id || user.id,
          limit: 100
        });

        // Transform backend sessions to our TelemedicineSession interface
        const transformedSessions: TelemedicineSession[] = sessionsResponse.sessions.map(session => ({
          id: session.id,
          date: session.startTime ? new Date(session.startTime).toISOString().split('T')[0] : '',
          time: session.startTime ? new Date(session.startTime).toLocaleTimeString() : '',
          doctor: session.doctorId, // We'll need to fetch doctor details
          specialty: 'General', // Default specialty
          status: session.status === 'completed' ? 'completed' as const : 'scheduled' as const,
          duration: 30, // Default duration
          type: 'consultation' as const,
          notes: session.notes || '',
          meetingId: session.id // Use session ID as meeting ID
        }));

        setTelemedicineSessions(transformedSessions);

      } catch (err) {
        console.error('Error loading telemedicine sessions:', err);
        setError('Failed to load telemedicine sessions. Please try again.');
        
        // Fallback to mock data if API fails
        const fallbackSessions = [
          {
            id: '1',
            date: '2024-01-20',
            time: '10:00 AM',
            doctor: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            status: 'scheduled' as const,
            duration: 30,
            type: 'consultation' as const,
            notes: 'Follow-up consultation for heart condition',
            meetingId: 'meeting-001'
          },
          {
            id: '2',
            date: '2024-01-15',
            time: '2:00 PM',
            doctor: 'Dr. Michael Chen',
            specialty: 'Internal Medicine',
            status: 'completed' as const,
            duration: 45,
            type: 'follow-up' as const,
            notes: 'Completed - Discussed test results and medication adjustments',
            meetingId: 'meeting-002'
          }
        ];

        setTelemedicineSessions(fallbackSessions);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, backend]);

  // Mock create session function
  const createSessionMutation = {
    mutateAsync: async (sessionData: any) => {
      // Simulate session creation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Creating session:', sessionData);
      return { success: true, sessionId: 'session-' + Date.now() };
    },
    isPending: false
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'completed': return 'success';
      default: return 'warning';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return Stethoscope;
      case 'follow-up': return Heart;
      default: return Video;
    }
  };

  const filteredSessions = telemedicineSessions.filter(session => {
    const doctorName = session.doctor ? 
      `Dr. ${session.doctor.firstName} ${session.doctor.lastName}` : 
      'Unknown Doctor';
    const specialty = session.doctor?.specialty || 'General';
    
    const matchesSearch = doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const joinSession = (session: TelemedicineSession) => {
    setIsInCall(true);
  };

  const endCall = () => {
    setIsInCall(false);
    setIsMuted(false);
    setIsVideoOn(true);
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOn(!isVideoOn);

  const handleBookSession = async () => {
    if (!newSession.doctor || !newSession.appointmentDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await createSessionMutation.mutateAsync({
        patientId: user!.profile_id,
        doctorId: newSession.doctor,
        appointmentDate: newSession.appointmentDate,
        duration: parseInt(newSession.duration),
        type: newSession.type,
        notes: newSession.notes
      });
      alert('Telemedicine session booked successfully!');
    } catch (error) {
      console.error('Error booking session:', error);
      alert('Failed to book session. Please try again.');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading telemedicine sessions...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Sessions</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      {/* Floating 3D Icons */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-6xl opacity-10 dark:opacity-20"
        >
          <Video className="text-blue-400" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-40 right-20 text-5xl opacity-10 dark:opacity-20"
        >
          <Phone className="text-purple-400" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-40 left-20 text-4xl opacity-10 dark:opacity-20"
        >
          <Stethoscope className="text-emerald-400" />
        </motion.div>
      </div>

      <div className="relative z-10 space-y-8 p-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent"
              >
                Telemedicine
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-slate-600 dark:text-slate-300 mt-3"
              >
                Connect with healthcare providers through secure video consultations
              </motion.p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <AnimatedButton
                onClick={() => setIsBookSessionModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl px-8 py-3 rounded-xl font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Book Session
              </AnimatedButton>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Active Call Interface */}
        {isInCall && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
              <div className="relative p-6 rounded-2xl">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Active Call
                  </h2>
                  <p className="text-xl text-slate-600 dark:text-slate-400">
                    Dr. Sarah Johnson - Cardiology Consultation
                  </p>
                </div>

                {/* Enhanced Video Interface */}
                <div className="relative bg-gradient-to-br from-slate-800 via-blue-900 to-purple-900 rounded-2xl h-96 mb-6 overflow-hidden border-2 border-white/20 dark:border-slate-600/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-2xl">
                        <Video className="w-12 h-12 text-white" />
                      </div>
                      <p className="text-2xl font-bold mb-2">Video Call Interface</p>
                      <p className="text-slate-300">Your camera and microphone are active</p>
                    </div>
                  </div>
                  
                  {/* Enhanced Connection Status */}
                  <div className="absolute top-4 right-4 flex items-center space-x-3">
                    <div className="px-3 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-xl border border-emerald-500/30">
                      <div className="flex items-center space-x-2 text-emerald-400 text-sm font-medium">
                        <Wifi className="w-4 h-4" />
                        <span>Excellent</span>
                      </div>
                    </div>
                    <div className="px-3 py-2 bg-blue-500/20 backdrop-blur-sm rounded-xl border border-blue-500/30">
                      <div className="flex items-center space-x-2 text-blue-400 text-sm font-medium">
                        <Signal className="w-4 h-4" />
                        <span>HD</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Call Controls */}
                <div className="flex items-center justify-center space-x-6">
                  <AnimatedButton
                    className={`border-2 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                      isMuted 
                        ? 'border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' 
                        : 'border-slate-500 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/20'
                    }`}
                    onClick={toggleMute}
                  >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </AnimatedButton>

                  <AnimatedButton
                    className={`border-2 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                      isVideoOn 
                        ? 'border-slate-500 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/20' 
                        : 'border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                    onClick={toggleVideo}
                  >
                    {isVideoOn ? <Camera className="w-6 h-6" /> : <CameraOff className="w-6 h-6" />}
                  </AnimatedButton>

                  <AnimatedButton
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl px-8 py-4 rounded-xl text-lg font-medium"
                    onClick={endCall}
                  >
                    <Phone className="w-6 h-6" />
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Enhanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
            <div className="relative p-6 rounded-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search doctors or specialties..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Sessions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {sessionsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : sessionsError ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <p className="text-red-600 dark:text-red-400 text-lg font-medium">
                Error loading telemedicine sessions
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Please try refreshing the page
              </p>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Video className="w-10 h-10 text-white" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                No telemedicine sessions found
              </p>
              <p className="text-slate-500 dark:text-slate-500 mt-2">
                {searchTerm ? 'Try adjusting your search criteria' : 'Book your first telemedicine session to get started'}
              </p>
            </div>
          ) : (
            filteredSessions.map((session, index) => {
              const doctorName = session.doctor ? 
                `Dr. ${session.doctor.firstName} ${session.doctor.lastName}` : 
                'Unknown Doctor';
              const specialty = session.doctor?.specialty || 'General';
              
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.01, y: -5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
                  <div className="relative p-6 rounded-2xl">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                          {React.createElement(getTypeIcon(session.type), { className: "w-7 h-7 text-white" })}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                              {doctorName}
                            </h3>
                            <div className={`px-3 py-1 bg-gradient-to-r ${
                              session.status === 'scheduled' ? 'from-blue-500 to-indigo-500' :
                              'from-emerald-500 to-teal-500'
                            } text-white rounded-full text-sm font-medium shadow-lg`}>
                              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="font-medium">{new Date(session.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-lg flex items-center justify-center">
                                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <span className="font-medium">{session.time} ({session.duration} min)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg flex items-center justify-center">
                                <Stethoscope className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="font-medium">{specialty}</span>
                            </div>
                          </div>
                          {session.notes && (
                            <div className="mt-3 p-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
                              <p className="text-sm text-slate-600 dark:text-slate-400">{session.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <AnimatedButton
                          onClick={() => {
                            setSelectedSession(session);
                            setIsModalOpen(true);
                          }}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </AnimatedButton>
                        {session.status === 'scheduled' && (
                          <AnimatedButton
                            onClick={() => joinSession(session)}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl"
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Join Session
                          </AnimatedButton>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>

      {/* Enhanced Session Detail Modal */}
      <AnimatedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Session Details"
        size="lg"
      >
        {selectedSession && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    {React.createElement(getTypeIcon(selectedSession.type), { className: "w-6 h-6 text-white" })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {selectedSession.doctor}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">{selectedSession.specialty}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {new Date(selectedSession.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {selectedSession.time} ({selectedSession.duration} min)
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Status</h4>
                  <div className={`inline-flex px-3 py-1 bg-gradient-to-r ${
                    selectedSession.status === 'scheduled' ? 'from-blue-500 to-indigo-500' :
                    'from-emerald-500 to-teal-500'
                  } text-white rounded-full text-sm font-medium`}>
                    {selectedSession.status.charAt(0).toUpperCase() + selectedSession.status.slice(1)}
                  </div>
                </div>
                {selectedSession.notes && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Notes</h4>
                    <p className="text-slate-700 dark:text-slate-300">{selectedSession.notes}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-600">
              <AnimatedButton
                onClick={() => setIsModalOpen(false)}
                className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg hover:shadow-xl"
              >
                Close
              </AnimatedButton>
              {selectedSession.status === 'scheduled' && (
                <AnimatedButton
                  onClick={() => {
                    joinSession(selectedSession);
                    setIsModalOpen(false);
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Join Session
                </AnimatedButton>
              )}
            </div>
          </div>
        )}
      </AnimatedModal>

      {/* Book Session Modal */}
      <AnimatedModal
        isOpen={isBookSessionModalOpen}
        onClose={() => setIsBookSessionModalOpen(false)}
        title="Book Telemedicine Session"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Doctor
              </label>
              <select
                value={newSession.doctor}
                onChange={(e) => setNewSession({...newSession, doctor: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">Select doctor</option>
                <option value="dr-sarah-johnson">Dr. Sarah Johnson - Cardiology</option>
                <option value="dr-michael-chen">Dr. Michael Chen - Dermatology</option>
                <option value="dr-emily-rodriguez">Dr. Emily Rodriguez - Endocrinology</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Session Date
              </label>
              <input
                type="date"
                value={newSession.appointmentDate}
                onChange={(e) => setNewSession({...newSession, appointmentDate: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Duration
              </label>
              <select
                value={newSession.duration}
                onChange={(e) => setNewSession({...newSession, duration: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Session Type
              </label>
              <select
                value={newSession.type}
                onChange={(e) => setNewSession({...newSession, type: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="consultation">Consultation</option>
                <option value="follow-up">Follow-up</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Notes (Optional)
            </label>
            <textarea
              value={newSession.notes}
              onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
              placeholder="Describe your symptoms or concerns..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-600">
            <AnimatedButton
              onClick={() => setIsBookSessionModalOpen(false)}
              className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg hover:shadow-xl"
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              onClick={handleBookSession}
              disabled={createSessionMutation.isPending}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Video className="w-4 h-4 mr-2" />
              {createSessionMutation.isPending ? 'Booking...' : 'Book Session'}
            </AnimatedButton>
          </div>
        </div>
      </AnimatedModal>
    </div>
  );
}
