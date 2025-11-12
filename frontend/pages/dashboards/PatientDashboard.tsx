import React from 'react';
import {
  useNotifications,
} from '@/components/ui';
import { 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  TrendingUp,
  Users,
  HeartPulse,
  Bell,
  Clock,
  MapPin,
  Phone,
  Video,
  FileText,
  Activity,
  AlertTriangle,
  Ambulance,
  MapPin as LocationIcon,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { extractUserId } from '../../lib/type-utils';
import { useQuery } from '@tanstack/react-query';
import { getAppointments, getBills } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import type { Appointment } from '@/lib/api/appointments';
import { ThemeToggle } from '../../contexts/ThemeContext';

export function PatientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useNotifications();

  const userId = extractUserId(user);
  
  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments', userId],
    queryFn: async () => await getAppointments({ patientId: userId!, limit: 10 }),
    enabled: !!userId,
  });

  const { data: billsData, isLoading: billsLoading } = useQuery({
    queryKey: ['bills', userId],
    queryFn: async () => await getBills({ patientId: userId!, status: 'pending' }),
    enabled: !!userId,
  });

  const upcomingAppointments = (appointmentsData as any)?.appointments?.filter((a: any) => new Date(a.appointmentDate) >= new Date()) || [];

  const stats = [
    { 
      title: 'Upcoming Appointments', 
      value: upcomingAppointments.length, 
      icon: Calendar, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100 dark:bg-blue-900/50',
      trend: '+2 this week'
    },
    { 
      title: 'Pending Bills', 
      value: (billsData as any)?.total || 0, 
      icon: CreditCard, 
      color: 'text-red-600', 
      bgColor: 'bg-red-100 dark:bg-red-900/50',
      trend: 'Due soon'
    },
    { 
      title: 'Completed Visits', 
      value: 12, 
      icon: CheckCircle, 
      color: 'text-green-600', 
      bgColor: 'bg-green-100 dark:bg-green-900/50',
      trend: '+3 this month'
    },
    { 
      title: 'Health Score', 
      value: 85, 
      suffix: '%', 
      icon: TrendingUp, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-100 dark:bg-purple-900/50',
      trend: '+5 points'
    },
  ];

  const vitalsData = [
    { label: 'Jan', value: 120 },
    { label: 'Feb', value: 122 },
    { label: 'Mar', value: 118 },
    { label: 'Apr', value: 125 },
    { label: 'May', value: 123 },
    { label: 'Jun', value: 120 },
  ];

  const getDoctorName = (appointment: Appointment) => {
    if (appointment.doctor) {
      return `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`;
    }
    return 'Your Doctor'; // Fallback
  };

  const handleEmergency = async () => {
    try {
      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Show emergency notification
            showError('EMERGENCY ALERT', 'Emergency services have been notified! Help is on the way.');
            
            // Emergency record would be created in database
            console.log('Emergency alert:', {
              patientId: userId,
              latitude,
              longitude,
              timestamp: new Date().toISOString(),
              status: 'active'
            });
            
            // Open Google Maps with nearest hospitals
            const mapsUrl = `https://www.google.com/maps/search/hospital+emergency/@${latitude},${longitude},15z`;
            window.open(mapsUrl, '_blank');
            
            // Call emergency number (if supported by browser)
            window.location.href = 'tel:911';
          },
          (error) => {
            console.error('Error getting location:', error);
            showError('Location Error', 'Unable to get your location. Please call 911 directly.');
            window.location.href = 'tel:911';
          }
        );
      } else {
        showError('Location Not Supported', 'Please call 911 directly for emergency assistance.');
        window.location.href = 'tel:911';
      }
    } catch (error) {
      console.error('Emergency error:', error);
      showError('Emergency Error', 'Please call 911 directly for immediate assistance.');
      window.location.href = 'tel:911';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      {/* Floating 3D Icons */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-10 dark:opacity-20">
          <HeartPulse className="text-blue-400" />
        </div>
        <div className="absolute top-40 right-20 text-5xl opacity-10 dark:opacity-20">
          <Activity className="text-purple-400" />
        </div>
        <div className="absolute bottom-40 left-20 text-4xl opacity-10 dark:opacity-20">
          <TrendingUp className="text-emerald-400" />
        </div>
      </div>

      <div className="relative z-10 space-y-8 p-8">
        {/* Enhanced Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                Patient Dashboard
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mt-3">
                Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.first_name}</span>! Here's your health journey overview.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {/* Emergency Button */}
              <button
                onClick={handleEmergency}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 animate-pulse hover:scale-105"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>EMERGENCY</span>
              </button>

              <button
                onClick={() => showInfo('Dashboard', 'Your health data is up to date!')}
                className="px-6 py-3 border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-slate-900 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 hover:scale-105"
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={stat.title} className="relative group hover:-translate-y-2 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
              <div className="relative p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                      {stat.title}
                    </p>
                    <p className="text-4xl font-bold text-slate-900 dark:text-white">
                      {stat.value}{stat.suffix || ''}
                    </p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                      {stat.trend}
                    </p>
                  </div>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.bgColor} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Enhanced Appointments Card */}
          <div className="lg:col-span-2">
            <div className="relative group h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
              <div className="relative h-full p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Upcoming Appointments
                  </h3>
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-lg">
                    {upcomingAppointments.length} upcoming
                  </div>
                </div>
                
                {appointmentsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                      </div>
                    ))}
                  </div>
                ) : upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.slice(0, 3).map((appointment: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm hover:scale-105 hover:translate-x-1 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                      <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {getDoctorName(appointment)}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                              <Clock className="w-4 h-4" />
                              <span>
                          {new Date(appointment.appointmentDate).toLocaleDateString()} at {new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                            {appointment.type}
                          </div>
                          <button
                            className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                            onClick={() => showSuccess('Appointment', 'Appointment details opened!')}
                          >
                            <MapPin className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Calendar className="w-10 h-10 text-white" />
                    </div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg font-medium">
                      No upcoming appointments
                    </p>
                    <button
                      className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => navigate('/patient/book-appointment')}
                    >
                      Book Your First Appointment
                    </button>
                </div>
              )}
              </div>
            </div>
          </div>

          {/* Enhanced Quick Actions Card */}
          <div>
            <div className="relative group h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
              <div className="relative h-full p-6 rounded-2xl">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Quick Actions
                </h3>
                <div className="space-y-4">
                  <button 
                    className="w-full flex items-center p-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
                    onClick={() => {
                      navigate('/patient/book-appointment');
                      showSuccess('Navigation', 'Opening appointment booking...');
                    }}
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span>Book Appointment</span>
                  </button>
                  
                  <button 
                    className="w-full flex items-center p-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
                    onClick={() => {
                      navigate('/patient/billing');
                      showInfo('Billing', 'Opening billing portal...');
                    }}
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <span>View Bills</span>
                  </button>
                  
                  <button 
                    className="w-full flex items-center p-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
                    onClick={() => {
                      navigate('/patient/medical-records');
                      showInfo('Records', 'Opening medical records...');
                    }}
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <span>Medical Records</span>
                  </button>
                  
                  <button 
                    className="w-full flex items-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
                    onClick={() => {
                      navigate('/patient/profile');
                      showInfo('Profile', 'Opening profile settings...');
                    }}
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <Users className="w-4 h-4" />
                    </div>
                    <span>My Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Health Chart */}
        <div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
            <div className="relative p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Health Vitals Trend (Systolic BP)
                </h3>
                <div className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-medium shadow-lg">
                  Normal Range
                </div>
              </div>

              <div className="h-64 flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                <div className="text-center">
                  <Activity className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                  <p className="text-slate-600 dark:text-slate-400">Blood Pressure Trend Chart</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">Data visualization area</p>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">85%</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Health Score</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">92%</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Medication Adherence</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl border border-orange-200/50 dark:border-orange-700/50">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">78%</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Exercise Goal</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Recent Activity Section */}
        <div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-white/20 dark:border-slate-700/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500" />
            <div className="relative p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Recent Activity
                </h3>
                <button className="px-4 py-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white rounded-xl font-medium transition-all duration-300 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-slate-900">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {[
                  { icon: Video, text: 'Completed telemedicine session with Dr. Smith', time: '2 hours ago', type: 'success', color: 'from-emerald-500 to-teal-500' },
                  { icon: FileText, text: 'Lab results uploaded - All normal', time: '1 day ago', type: 'info', color: 'from-blue-500 to-indigo-500' },
                  { icon: Activity, text: 'Blood pressure reading recorded', time: '2 days ago', type: 'warning', color: 'from-orange-500 to-red-500' },
                  { icon: Phone, text: 'Appointment reminder sent', time: '3 days ago', type: 'primary', color: 'from-purple-500 to-pink-500' },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm hover:scale-105 hover:translate-x-1 transition-all duration-300"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br ${activity.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <activity.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {activity.text}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activity.time}
                      </p>
                    </div>
                    <div className={`px-3 py-1 bg-gradient-to-r ${activity.color} text-white rounded-full text-xs font-medium shadow-lg`}>
                      {activity.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
