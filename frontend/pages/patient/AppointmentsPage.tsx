import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, User, MapPin, Video, Plus, Search, Filter, 
  Eye, Edit, CheckCircle, AlertCircle, Heart, Stethoscope,
  Phone, MessageSquare, FileText, Activity
} from 'lucide-react';
import { 
  AnimatedCard, AnimatedButton, AnimatedIcon, AnimatedBadge, 
  AnimatedInput, AnimatedModal 
} from '@/components/ui';
import { ThemeToggle } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import backend from '~backend/client';
import type { Appointment } from '~backend/clinic/appointment';

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: 'consultation' | 'follow-up' | 'telemedicine';
  doctor: string;
  specialty: string;
  location: string;
  status: 'scheduled' | 'confirmed' | 'completed';
  duration: number;
  notes?: string;
}

export function AppointmentsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patient: '',
    doctor: '',
    appointmentDate: '',
    duration: '30',
    type: 'consultation',
    symptoms: '',
    notes: ''
  });

  // Fetch real-time appointments data
  const { data: appointmentsData, isLoading: appointmentsLoading, error: appointmentsError } = useQuery({
    queryKey: ['appointments', user?.profile_id],
    queryFn: async () => await backend.clinic.listAppointments({ patientId: user!.profile_id, limit: 50 }),
    enabled: !!user?.profile_id,
  });

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      return await backend.clinic.createAppointment(appointmentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', user?.profile_id] });
      setIsBookAppointmentModalOpen(false);
      setNewAppointment({
        patient: '',
        doctor: '',
        appointmentDate: '',
        duration: '30',
        type: 'consultation',
        symptoms: '',
        notes: ''
      });
    },
  });

  const appointments = appointmentsData?.appointments || [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return Stethoscope;
      case 'follow-up': return Heart;
      case 'telemedicine': return Video;
      default: return Calendar;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'from-blue-500 to-indigo-500';
      case 'confirmed': return 'from-emerald-500 to-teal-500';
      case 'completed': return 'from-purple-500 to-pink-500';
      default: return 'from-orange-500 to-red-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'confirmed': return 'Confirmed';
      case 'completed': return 'Completed';
      default: return 'Pending';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const doctorName = appointment.doctor ? 
      `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}` : 
      'Unknown Doctor';
    const specialty = appointment.doctor?.specialty || 'General';
    
    const matchesSearch = doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || appointment.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleBookAppointment = async () => {
    if (!newAppointment.doctor || !newAppointment.appointmentDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await createAppointmentMutation.mutateAsync({
        patientId: user!.profile_id,
        doctorId: newAppointment.doctor,
        appointmentDate: newAppointment.appointmentDate,
        duration: parseInt(newAppointment.duration),
        type: newAppointment.type,
        notes: newAppointment.notes,
        symptoms: newAppointment.symptoms
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      <div className="relative z-10 space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              Appointments
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mt-3">
              Schedule and manage your medical appointments with ease
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <AnimatedButton
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl px-8 py-3 rounded-xl font-medium"
              onClick={() => setIsBookAppointmentModalOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Book Appointment
            </AnimatedButton>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl">
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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="all">All Types</option>
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="telemedicine">Telemedicine</option>
            </select>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-6">
          {appointmentsLoading ? (
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
          ) : appointmentsError ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <p className="text-red-600 dark:text-red-400 text-lg font-medium">
                Error loading appointments
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Please try refreshing the page
              </p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                No appointments found
              </p>
              <p className="text-slate-500 dark:text-slate-500 mt-2">
                {searchTerm ? 'Try adjusting your search criteria' : 'Book your first appointment to get started'}
              </p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => {
              const doctorName = appointment.doctor ? 
                `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}` : 
                'Unknown Doctor';
              const specialty = appointment.doctor?.specialty || 'General';
              const appointmentDate = new Date(appointment.appointmentDate);
              
              return (
                <div key={appointment.id} className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                        {React.createElement(getTypeIcon(appointment.type), { className: "w-7 h-7 text-white" })}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {doctorName}
                          </h3>
                          <div className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(appointment.status)} text-white rounded-full text-sm font-medium shadow-lg`}>
                            {getStatusText(appointment.status)}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="font-medium">{appointmentDate.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-medium">{appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({appointment.duration} min)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span className="font-medium">{appointment.type === 'telemedicine' ? 'Virtual Consultation' : 'In-Person'}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                          <Stethoscope className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          <span>{specialty}</span>
                        </div>
                        {appointment.notes && (
                          <div className="mt-3 p-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
                            <p className="text-sm text-slate-600 dark:text-slate-400">{appointment.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <AnimatedButton
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setIsModalOpen(true);
                        }}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </AnimatedButton>
                      <AnimatedButton
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </AnimatedButton>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Appointment Detail Modal */}
      <AnimatedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Appointment Details"
        size="lg"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    {React.createElement(getTypeIcon(selectedAppointment.type), { className: "w-6 h-6 text-white" })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {selectedAppointment.doctor}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">{selectedAppointment.specialty}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {new Date(selectedAppointment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {selectedAppointment.time} ({selectedAppointment.duration} min)
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-purple-500" />
                    <span className="text-slate-700 dark:text-slate-300">{selectedAppointment.location}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Status</h4>
                  <div className={`inline-flex px-3 py-1 bg-gradient-to-r ${getStatusColor(selectedAppointment.status)} text-white rounded-full text-sm font-medium`}>
                    {getStatusText(selectedAppointment.status)}
                  </div>
                </div>
                {selectedAppointment.notes && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Notes</h4>
                    <p className="text-slate-700 dark:text-slate-300">{selectedAppointment.notes}</p>
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
              <AnimatedButton
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Message Doctor
              </AnimatedButton>
            </div>
          </div>
        )}
      </AnimatedModal>

      {/* Book Appointment Modal */}
      <AnimatedModal
        isOpen={isBookAppointmentModalOpen}
        onClose={() => setIsBookAppointmentModalOpen(false)}
        title="Schedule New Appointment"
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Patient
              </label>
              <select
                value={newAppointment.patient}
                onChange={(e) => setNewAppointment({...newAppointment, patient: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">Select patient</option>
                <option value="self">Self</option>
                <option value="family">Family Member</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Doctor
              </label>
              <select
                value={newAppointment.doctor}
                onChange={(e) => setNewAppointment({...newAppointment, doctor: e.target.value})}
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
                Appointment Date
              </label>
              <input
                type="date"
                value={newAppointment.appointmentDate}
                onChange={(e) => setNewAppointment({...newAppointment, appointmentDate: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Duration
              </label>
              <select
                value={newAppointment.duration}
                onChange={(e) => setNewAppointment({...newAppointment, duration: e.target.value})}
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
                Appointment Type
              </label>
              <select
                value={newAppointment.type}
                onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="consultation">Consultation</option>
                <option value="follow-up">Follow-up</option>
                <option value="telemedicine">Telemedicine</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Symptoms (Optional)
            </label>
            <textarea
              value={newAppointment.symptoms}
              onChange={(e) => setNewAppointment({...newAppointment, symptoms: e.target.value})}
              placeholder="Describe your symptoms..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Additional Notes (Optional)
            </label>
            <textarea
              value={newAppointment.notes}
              onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
              placeholder="Any additional information..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-600">
            <AnimatedButton
              onClick={() => setIsBookAppointmentModalOpen(false)}
              className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg hover:shadow-xl"
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              onClick={handleBookAppointment}
              disabled={createAppointmentMutation.isPending}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {createAppointmentMutation.isPending ? 'Scheduling...' : 'Schedule Appointment'}
            </AnimatedButton>
          </div>
        </div>
      </AnimatedModal>
    </div>
  );
}
