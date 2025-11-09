import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Video, Play, Clock, User, UserCheck, ExternalLink, Brain, Activity, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TelemedicineForm } from '../components/TelemedicineForm';
import { AdvancedTelemedicine } from '../components/AdvancedTelemedicine';
import backend from '~backend/client';
import type { TelemedicineSession } from '~backend/telemedicine/session';

export function TelemedicinePage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'session' | 'analytics'>('list');
  const [activeSession, setActiveSession] = useState<TelemedicineSession | null>(null);

  const { data: sessionsData, isLoading, error } = useQuery({
    queryKey: ['telemedicine-sessions', searchTerm],
    queryFn: async () => {
      const response = await backend.telemedicine.listSessions({
        limit: 100,
      });
      return response;
    },
  });

  const { data: appointmentsData } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await backend.clinic.listAppointments({ 
        limit: 1000,
      });
      return response;
    },
  });

  const { data: patientsData } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const response = await backend.clinic.listPatients({ limit: 1000 });
      return response;
    },
  });

  const { data: doctorsData } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const response = await backend.clinic.listDoctors({ limit: 1000 });
      return response;
    },
  });

  const joinSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      return await backend.telemedicine.joinSession({ id: sessionId });
    },
    onSuccess: (data) => {
      window.open(data.sessionUrl, '_blank');
      toast({
        title: t('common.success'),
        description: 'Joining telemedicine session...',
      });
    },
    onError: (error) => {
      console.error('Join session error:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to join session',
        variant: 'destructive',
      });
    },
  });

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['telemedicine-sessions'] });
    handleFormClose();
    toast({
      title: t('common.success'),
      description: 'Telemedicine session created successfully',
    });
  };

  const handleJoinSession = (sessionId: string) => {
    joinSessionMutation.mutate(sessionId);
  };

  const handleStartAdvancedSession = (session: TelemedicineSession) => {
    setActiveSession(session);
    setViewMode('session');
  };

  const handleEndSession = () => {
    setActiveSession(null);
    setViewMode('list');
    toast({
      title: "Session Ended",
      description: "Telemedicine session has been ended",
    });
  };

  const getPatientName = (patientId: string) => {
    const patient = patientsData?.patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctorsData?.doctors.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{t('common.error')}: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('nav.telemedicine')}</h1>
          <p className="text-gray-600 mt-1">
            Advanced AI-powered telemedicine with real-time monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setViewMode('list')}
            className="flex items-center gap-2"
          >
            <Video className="w-4 h-4" />
            Sessions
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setViewMode('analytics')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Analytics
          </Button>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Session
          </Button>
        </div>
      </div>

      {viewMode === 'list' && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessionsData?.sessions.map((session, index) => (
            <div key={session.id} className="hover:-translate-y-0.5 transition-transform duration-200">
              <Card className="h-full transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Video className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          Session #{session.roomId.slice(-8)}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Patient:</span>
                      <span className="font-medium">{getPatientName(session.patientId)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Doctor:</span>
                      <span className="font-medium">{getDoctorName(session.doctorId)}</span>
                    </div>
                    {session.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Duration:</span>
                        <span>{session.duration} minutes</span>
                      </div>
                    )}
                  </div>
                  
                  {session.startTime && (
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Started:</span> {new Date(session.startTime).toLocaleString()}
                    </div>
                  )}
                  
                  {session.notes && (
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Notes:</span> {session.notes}
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    {(session.status === 'scheduled' || session.status === 'active') && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleJoinSession(session.id)}
                          disabled={joinSessionMutation.isPending}
                          className="flex-1"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Join Session
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartAdvancedSession(session)}
                          className="flex-1"
                        >
                          <Brain className="w-3 h-3 mr-1" />
                          Advanced
                        </Button>
                      </>
                    )}
                    {session.recordingUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(session.recordingUrl, '_blank')}
                        className="flex-1"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Recording
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {sessionsData?.sessions.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No telemedicine sessions found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first telemedicine session'}
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Session
          </Button>
        </div>
      )}

      {viewMode === 'session' && activeSession && (
        <div>
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={() => setViewMode('list')}
              className="mb-4"
            >
              ← Back to Sessions
            </Button>
          </div>
          <AdvancedTelemedicine 
            sessionId={activeSession.id}
            patientId={activeSession.patientId}
            doctorId={activeSession.doctorId}
            onEndSession={handleEndSession}
          />
        </div>
      )}

      {viewMode === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Video className="w-5 h-5 text-blue-600" />
                  Total Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {sessionsData?.sessions.length || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Active Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {sessionsData?.sessions.filter(s => s.status === 'active').length || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  32
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  Quality Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  96%
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Telemedicine Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">Session Status</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Active:</span>
                      <span className="font-semibold">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span className="font-semibold">70%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cancelled:</span>
                      <span className="font-semibold">15%</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">Quality Metrics</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Video Quality:</span>
                      <span className="font-semibold">98%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Audio Quality:</span>
                      <span className="font-semibold">95%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Connection:</span>
                      <span className="font-semibold">99%</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">AI Features</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Auto Notes:</span>
                      <span className="font-semibold">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vitals Monitor:</span>
                      <span className="font-semibold">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AI Analysis:</span>
                      <span className="font-semibold">78%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showForm && (
        <TelemedicineForm
          appointments={appointmentsData?.appointments || []}
          patients={patientsData?.patients || []}
          doctors={doctorsData?.doctors || []}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
