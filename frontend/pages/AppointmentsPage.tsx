import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Edit, Trash2, Calendar, Clock, User, UserCheck, Star, Brain, TrendingUp, Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AppointmentForm } from '../components/AppointmentForm';
import { ReviewForm } from '../components/ReviewForm';
import { SmartScheduler } from '../components/SmartScheduler';
import { getAppointments, getAppointmentById, createAppointment, updateAppointment, cancelAppointment } from '@/lib/api';
import type { Appointment } from '@/lib/api';
import { useAuth } from '../contexts/AuthContext';

export function AppointmentsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [reviewingAppointment, setReviewingAppointment] = useState<Appointment | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'scheduler' | 'analytics'>('list');

  const isPatient = user?.role === 'patient';

  const { data: appointmentsData, isLoading, error } = useQuery({
    queryKey: ['appointments', searchTerm, user?.id],
    queryFn: async () => {
      const params: { limit: number; patientId?: string; search?: string } = { limit: 100 };
      if (isPatient) {
        params.patientId = user.profile_id;
      }
      // Add search logic if needed
      return await getAppointments(params);
    },
    enabled: !!user,
  });

  const { data: patientsData } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => await backend.clinic.listPatients({ limit: 1000 }),
    enabled: showForm && !isPatient,
  });

  const { data: doctorsData } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => await backend.clinic.listDoctors({ limit: 1000 }),
    enabled: showForm,
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: async (appointmentId: string) => {
      await cancelAppointment(appointmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: t('common.success'),
        description: 'Appointment deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Delete appointment error:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to delete appointment',
        variant: 'destructive',
      });
    },
  });

  // Check if patient can review appointment
  const { data: canReviewData } = useQuery({
    queryKey: ['can-review', reviewingAppointment?.id],
    queryFn: async () => {
      if (!reviewingAppointment) return null;
      return await backend.reviews.canReviewAppointment({ appointmentId: reviewingAppointment.id });
    },
    enabled: !!reviewingAppointment && isPatient,
  });

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleDelete = async (appointmentId: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteAppointmentMutation.mutate(appointmentId);
    }
  };

  const handleReview = (appointment: Appointment) => {
    setReviewingAppointment(appointment);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAppointment(null);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
    handleFormClose();
    toast({
      title: t('common.success'),
      description: editingAppointment ? 'Appointment updated successfully' : 'Appointment created successfully',
    });
  };

  const handleSlotSelect = (slot: any) => {
    toast({
      title: "Slot Selected",
      description: `Selected ${slot.doctorName} at ${slot.startTime.toLocaleTimeString()}`,
    });
    // Here you would typically open the appointment form with pre-filled data
    setShowForm(true);
  };

  const handleWaitlistJoin = (slot: any) => {
    toast({
      title: "Waitlist Joined",
      description: `Added to waitlist for ${slot.doctorName}`,
    });
  };

  const handleReviewClose = () => {
    setReviewingAppointment(null);
  };

  const handleReviewSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
    queryClient.invalidateQueries({ queryKey: ['reviews'] });
    handleReviewClose();
  };

  const getPatientName = (appointment: Appointment) => {
    if (isPatient) return `${user?.first_name} ${user?.last_name}`;
    if (appointment.patient) {
      return `${appointment.patient.firstName} ${appointment.patient.lastName}`;
    }
    return 'Unknown Patient';
  };

  const getDoctorName = (appointment: Appointment) => {
    if (appointment.doctor) {
      return `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`;
    }
    return 'Unknown Doctor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'no-show': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'border-blue-300 text-blue-800 dark:border-blue-700 dark:text-blue-300';
      case 'follow-up': return 'border-green-300 text-green-800 dark:border-green-700 dark:text-green-300';
      case 'emergency': return 'border-red-300 text-red-800 dark:border-red-700 dark:text-red-300';
      case 'telemedicine': return 'border-purple-300 text-purple-800 dark:border-purple-700 dark:text-purple-300';
      default: return 'border-gray-300 text-gray-800 dark:border-gray-600 dark:text-gray-300';
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
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('appointments.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Advanced appointment management with AI-powered scheduling
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setViewMode('list')}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Appointments
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setViewMode('scheduler')}
            className="flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            Smart Scheduler
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
            {isPatient ? 'Book New Appointment' : t('appointments.add')}
          </Button>
        </div>
      </div>

      {viewMode === 'list' && (
        <div
          className="flex items-center gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={isPatient ? 'Search by doctor or date...' : t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse bg-white dark:bg-gray-800">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {appointmentsData?.appointments.map((appointment, index) => (
                <div
                  key={appointment.id}
                >
                  <Card className="h-full transition-all duration-200 hover:shadow-lg dark:bg-gray-800">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <CardTitle className="text-lg dark:text-white">
                              {new Date(appointment.appointmentDate).toLocaleDateString()}
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(appointment.appointmentDate).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                          <Badge variant="outline" className={getTypeColor(appointment.type)}>
                            {appointment.type}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        {!isPatient && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">Patient:</span>
                            <span className="font-medium dark:text-white">{getPatientName(appointment)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">Doctor:</span>
                          <span className="font-medium dark:text-white">{getDoctorName(appointment)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                          <span className="dark:text-white">{appointment.duration} minutes</span>
                        </div>
                      </div>
                      
                      {appointment.symptoms && (
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(appointment)}
                          className="flex-1"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          {t('common.edit')}
                        </Button>
                        {isPatient && appointment.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReview(appointment)}
                            className="flex-1 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/50"
                          >
                            <Star className="w-3 h-3 mr-1" />
                            Review
                          </Button>
                        )}
                        {!isPatient && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(appointment.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {appointmentsData?.appointments.length === 0 && !isLoading && (
            <div
              className="text-center py-12"
            >
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No appointments found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by scheduling your first appointment'}
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {isPatient ? 'Book New Appointment' : t('appointments.add')}
              </Button>
            </div>
          )}
        </>
      )}

      {viewMode === 'scheduler' && (
        <div
        >
          <SmartScheduler 
            onSlotSelect={handleSlotSelect}
            onWaitlistJoin={handleWaitlistJoin}
            currentRequest={{
              patientId: user?.profile_id || '',
              patientName: `${user?.first_name} ${user?.last_name}`,
              preferredDate: new Date(),
              urgency: 'medium',
              symptoms: '',
              duration: 30,
              type: 'consultation'
            }}
          />
        </div>
      )}

      {viewMode === 'analytics' && (
        <div
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Total Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {appointmentsData?.appointments.length || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Completed Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {appointmentsData?.appointments.filter(a => 
                    a.status === 'completed' && 
                    new Date(a.appointmentDate).toDateString() === new Date().toDateString()
                  ).length || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  AI Optimizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  18
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  Efficiency Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  94%
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Appointment Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">Status Distribution</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Scheduled:</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span className="font-semibold">35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cancelled:</span>
                      <span className="font-semibold">20%</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">Type Distribution</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Consultation:</span>
                      <span className="font-semibold">60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Follow-up:</span>
                      <span className="font-semibold">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Emergency:</span>
                      <span className="font-semibold">15%</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">AI Insights</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Optimal Slots:</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conflict Resolved:</span>
                      <span className="font-semibold">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Waitlist Success:</span>
                      <span className="font-semibold">85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showForm && (
        <AppointmentForm
          appointment={editingAppointment}
          patients={patientsData?.patients || []}
          doctors={doctorsData?.doctors || []}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {reviewingAppointment && canReviewData?.canReview && (
        <ReviewForm
          appointmentId={reviewingAppointment.id}
          doctorName={getDoctorName(reviewingAppointment)}
          appointmentDate={new Date(reviewingAppointment.appointmentDate)}
          onClose={handleReviewClose}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
}
