import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  FileText,
  Video,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Heart,
  Activity,
  DollarSign,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Plus,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Patient {
  id: string;
  name: string;
  age: number;
  lastVisit: string;
  nextAppointment: string;
  status: 'active' | 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: 'consultation' | 'follow-up' | 'emergency';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export function DoctorDashboard() {
  const { resolvedTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');

  const isDark = resolvedTheme === 'dark';

  // Mock data
  const stats = [
    { title: 'Total Patients', value: '1,247', change: '+12%', icon: Users, color: 'blue', description: 'Active patients in your care' },
    { title: 'Today\'s Appointments', value: '18', change: '+3', icon: Calendar, color: 'green', description: 'Scheduled for today' },
    { title: 'Pending Reports', value: '23', change: '-5%', icon: FileText, color: 'orange', description: 'Lab results awaiting review' },
    { title: 'Telemedicine Sessions', value: '8', change: '+25%', icon: Video, color: 'purple', description: 'Virtual consultations today' },
    { title: 'Critical Cases', value: '3', change: '0', icon: AlertCircle, color: 'red', description: 'Requiring immediate attention' },
    { title: 'Patient Satisfaction', value: '4.8', change: '+0.2', icon: Star, color: 'yellow', description: 'Average rating this month' },
  ];

  const patients: Patient[] = [
    { id: '1', name: 'Sarah Johnson', age: 34, lastVisit: '2024-01-15', nextAppointment: '2024-02-20', status: 'active', priority: 'high' },
    { id: '2', name: 'Michael Chen', age: 28, lastVisit: '2024-01-10', nextAppointment: '2024-02-15', status: 'pending', priority: 'medium' },
    { id: '3', name: 'Emily Davis', age: 45, lastVisit: '2024-01-12', nextAppointment: '2024-02-18', status: 'active', priority: 'low' },
    { id: '4', name: 'David Wilson', age: 52, lastVisit: '2024-01-08', nextAppointment: '2024-02-22', status: 'completed', priority: 'medium' },
  ];

  const appointments: Appointment[] = [
    { id: '1', patientName: 'Sarah Johnson', time: '09:00 AM', type: 'consultation', status: 'scheduled' },
    { id: '2', patientName: 'Michael Chen', time: '10:30 AM', type: 'follow-up', status: 'scheduled' },
    { id: '3', patientName: 'Emily Davis', time: '02:00 PM', type: 'consultation', status: 'in-progress' },
    { id: '4', patientName: 'David Wilson', time: '03:30 PM', type: 'emergency', status: 'scheduled' },
  ];

  const chartData = [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 15 },
    { label: 'Wed', value: 8 },
    { label: 'Thu', value: 20 },
    { label: 'Fri', value: 18 },
    { label: 'Sat', value: 10 },
    { label: 'Sun', value: 5 },
  ];

  const revenueData = [
    { label: 'Jan', value: 12500 },
    { label: 'Feb', value: 15800 },
    { label: 'Mar', value: 14200 },
    { label: 'Apr', value: 18900 },
    { label: 'May', value: 16500 },
    { label: 'Jun', value: 22000 },
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Doctor Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome back, Dr. Smith. Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <button className="px-4 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 hover:scale-105">
              <Plus className="w-4 h-4" />
              <span>New Patient</span>
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 hover:scale-105">
              <Calendar className="w-4 h-4" />
              <span>Schedule Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.change.startsWith('+') 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                    : stat.change.startsWith('-')
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </p>
              </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: Plus, label: 'New Patient', color: 'blue' },
              { icon: Calendar, label: 'Schedule', color: 'green' },
              { icon: Video, label: 'Telemedicine', color: 'purple' },
              { icon: FileText, label: 'Lab Reports', color: 'orange' },
              { icon: MessageSquare, label: 'Messages', color: 'indigo' },
              { icon: Users, label: 'Patient List', color: 'teal' },
            ].map((action, index) => (
              <button
                key={action.label}
                className={`p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 ${
                  isDark ? 'hover:bg-slate-700/80' : 'hover:bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-full bg-${action.color}-100 dark:bg-${action.color}-900/30 mx-auto mb-2 flex items-center justify-center`}>
                  <action.icon className={`w-5 h-5 text-${action.color}-600 dark:text-${action.color}-400`} />
                </div>
                <p className={`text-xs font-medium text-center ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {action.label}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Charts & Analytics */}
        <div className="lg:col-span-2 space-y-8">

          {/* Patient Activity Chart */}
          <div>
            <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Patient Activity
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Weekly patient visits and appointments
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {['week', 'month', 'year'].map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setSelectedTimeframe(timeframe)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                        selectedTimeframe === timeframe
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-72 flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                <div className="text-center">
                  <Activity className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                  <p className="text-gray-600 dark:text-gray-400">Patient Activity Chart</p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div>
            <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Revenue Overview
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Monthly revenue and growth trends
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+18.5%</span>
                </div>
              </div>
              <div className="h-72 flex items-center justify-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <p className="text-gray-600 dark:text-gray-400">Revenue Overview Chart</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Recent Activity */}
        <div className="space-y-8">

          {/* Quick Actions */}
          <div>
            <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Plus, label: 'Add Patient', color: 'blue' },
                  { icon: Calendar, label: 'Schedule Visit', color: 'green' },
                  { icon: FileText, label: 'Write Report', color: 'orange' },
                  { icon: Video, label: 'Start Session', color: 'purple' },
                ].map((action, index) => (
                  <button
                    key={action.label}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 group hover:scale-105 hover:translate-x-1"
                  >
                    <div className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/20`}>
                      <action.icon className={`w-4 h-4 text-${action.color}-600`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Today's Appointments */}
          <div>
            <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Today's Appointments
                </h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm font-medium">
                  {appointments.length}
                </span>
              </div>
              <div className="space-y-3">
                {appointments.map((appointment, index) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        appointment.status === 'scheduled' ? 'bg-blue-500' :
                        appointment.status === 'in-progress' ? 'bg-yellow-500' :
                        appointment.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {appointment.patientName}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {appointment.time} • {appointment.type}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      appointment.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      appointment.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Patients */}
          <div>
            <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Patients
              </h3>
              <div className="space-y-3">
                {patients.slice(0, 4).map((patient, index) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {patient.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Age: {patient.age} • {patient.status}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      patient.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                      patient.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {patient.priority}
                    </span>
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