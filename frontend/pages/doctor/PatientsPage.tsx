import React, { useState } from 'react';
import {
  Users, Search, Plus, Filter, Eye, Edit, MessageSquare,
  Activity, TrendingUp, Heart, Brain, Calendar, FileText,
  Phone, Mail, MapPin, Clock, AlertCircle, CheckCircle
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  nextAppointment: string;
  status: 'active' | 'inactive' | 'critical' | 'recovered';
  riskLevel: 'low' | 'medium' | 'high';
  conditions: string[];
  aiInsights: string[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
}

export function PatientsPage() {
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'analytics' | 'ai-insights'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');

  const isDark = resolvedTheme === 'dark';

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Activity, count: null, color: 'text-blue-500' },
    { id: 'patients', name: 'Patient List', icon: Users, count: 247, color: 'text-green-500' },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp, count: null, color: 'text-purple-500' },
    { id: 'ai-insights', name: 'AI Insights', icon: Brain, count: null, color: 'text-orange-500' },
  ];

  const mockPatients: Patient[] = [
    {
      id: 'P001',
      name: 'Sarah Johnson',
      age: 34,
      gender: 'Female',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-01-25',
      status: 'active',
      riskLevel: 'medium',
      conditions: ['Hypertension', 'Type 2 Diabetes'],
      aiInsights: ['Blood pressure trending upward', 'Consider lifestyle modifications', 'Monitor HbA1c levels'],
      contact: {
        phone: '+1 (555) 123-4567',
        email: 'sarah.johnson@email.com',
        address: '123 Main St, City, State 12345'
      }
    },
    {
      id: 'P002',
      name: 'Michael Chen',
      age: 28,
      gender: 'Male',
      lastVisit: '2024-01-12',
      nextAppointment: '2024-02-01',
      status: 'active',
      riskLevel: 'low',
      conditions: ['Asthma'],
      aiInsights: ['Asthma well-controlled', 'Continue current medication', 'Monitor peak flow'],
      contact: {
        phone: '+1 (555) 234-5678',
        email: 'michael.chen@email.com',
        address: '456 Oak Ave, City, State 12345'
      }
    },
    {
      id: 'P003',
      name: 'Emily Davis',
      age: 45,
      gender: 'Female',
      lastVisit: '2024-01-08',
      nextAppointment: '2024-01-30',
      status: 'critical',
      riskLevel: 'high',
      conditions: ['Heart Disease', 'High Cholesterol'],
      aiInsights: ['Cardiac risk factors elevated', 'Immediate lifestyle intervention needed', 'Consider statin therapy'],
      contact: {
        phone: '+1 (555) 345-6789',
        email: 'emily.davis@email.com',
        address: '789 Pine Rd, City, State 12345'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'inactive': return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
      case 'critical': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'recovered': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div
          className={`p-6 rounded-2xl border transition-all duration-500 ${
            isDark
              ? 'bg-slate-800/50 border-slate-700/50'
              : 'bg-white/80 border-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>Total Patients</p>
                <p className="text-2xl font-bold text-blue-600">247</p>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          <p className={`text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>+12% from last month</p>
        </div>

        <div
          className={`p-6 rounded-2xl border transition-all duration-500 ${
            isDark
              ? 'bg-slate-800/50 border-slate-700/50'
              : 'bg-white/80 border-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>Active Patients</p>
                <p className="text-2xl font-bold text-green-600">189</p>
              </div>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
          <p className={`text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>76% of total patients</p>
        </div>

        <div
          className={`p-6 rounded-2xl border transition-all duration-500 ${
            isDark
              ? 'bg-slate-800/50 border-slate-700/50'
              : 'bg-white/80 border-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>Today's Appointments</p>
                <p className="text-2xl font-bold text-orange-600">18</p>
              </div>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
          <p className={`text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>3 pending confirmations</p>
        </div>

        <div
          className={`p-6 rounded-2xl border transition-all duration-500 ${
            isDark
              ? 'bg-slate-800/50 border-slate-700/50'
              : 'bg-white/80 border-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>High Risk Patients</p>
                <p className="text-2xl font-bold text-red-600">23</p>
              </div>
            </div>
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          <p className={`text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>Require close monitoring</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`p-6 rounded-2xl border transition-all duration-500 ${
            isDark
              ? 'bg-slate-800/50 border-slate-700/50'
              : 'bg-white/80 border-slate-200/50'
          }`}
        >
          <h3 className={`text-xl font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>Patient Demographics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Age 18-30</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '25%' }} />
                </div>
                <span className="text-sm font-medium text-blue-600">25%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Age 31-50</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '45%' }} />
                </div>
                <span className="text-sm font-medium text-green-600">45%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Age 51+</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '30%' }} />
                </div>
                <span className="text-sm font-medium text-purple-600">30%</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`p-6 rounded-2xl border transition-all duration-500 ${
            isDark
              ? 'bg-slate-800/50 border-slate-700/50'
              : 'bg-white/80 border-slate-200/50'
          }`}
        >
          <h3 className={`text-xl font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>Common Conditions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Hypertension</span>
              <span className="text-sm font-medium text-red-600">34 patients</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Diabetes</span>
              <span className="text-sm font-medium text-orange-600">28 patients</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Asthma</span>
              <span className="text-sm font-medium text-blue-600">22 patients</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Heart Disease</span>
              <span className="text-sm font-medium text-purple-600">19 patients</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPatientList = () => (
    <div className="space-y-6">
      <div className={`rounded-2xl border transition-all duration-500 ${
        isDark 
          ? 'bg-slate-800/50 border-slate-700/50' 
          : 'bg-white/80 border-slate-200/50'
      } overflow-hidden`}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className={`text-xl font-semibold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>Patient Directory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${
              isDark ? 'bg-slate-700/50' : 'bg-slate-50'
            }`}>
              <tr>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Patient</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Age/Gender</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Status</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Risk Level</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Last Visit</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {mockPatients.map((patient, index) => (
                <tr
                  key={patient.id}
                  className={`hover:${
                    isDark ? 'bg-slate-700/30' : 'bg-slate-50'
                  } transition-colors duration-200`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className={`font-medium ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>{patient.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <p className={`text-xs ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>{patient.contact.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>{patient.age} years</p>
                    <p className={`text-sm ${
                      isDark ? 'text-slate-500' : 'text-slate-500'
                    }`}>{patient.gender}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                      {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(patient.riskLevel)}`}>
                      {patient.riskLevel.charAt(0).toUpperCase() + patient.riskLevel.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>{patient.lastVisit}</p>
                    <p className={`text-sm ${
                      isDark ? 'text-slate-500' : 'text-slate-500'
                    }`}>Next: {patient.nextAppointment}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-lg transition-colors duration-200">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/20 rounded-lg transition-colors duration-200">
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`p-6 rounded-2xl border transition-all duration-500 ${
            isDark
              ? 'bg-slate-800/50 border-slate-700/50'
              : 'bg-white/80 border-slate-200/50'
          }`}
        >
          <h3 className={`text-xl font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>Patient Growth</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>This Month</span>
              <span className="text-sm font-medium text-green-600">+23 patients</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Last Month</span>
              <span className="text-sm font-medium text-blue-600">+18 patients</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>3 Months Ago</span>
              <span className="text-sm font-medium text-purple-600">+15 patients</span>
            </div>
          </div>
        </div>

        <div
          className={`p-6 rounded-2xl border transition-all duration-500 ${
            isDark
              ? 'bg-slate-800/50 border-slate-700/50'
              : 'bg-white/80 border-slate-200/50'
          }`}
        >
          <h3 className={`text-xl font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>Appointment Trends</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Completed</span>
              <span className="text-sm font-medium text-green-600">156</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Scheduled</span>
              <span className="text-sm font-medium text-blue-600">89</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Cancelled</span>
              <span className="text-sm font-medium text-red-600">12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIInsights = () => (
    <div className="space-y-6">
      <div
        className={`p-6 rounded-2xl border transition-all duration-500 ${
          isDark
            ? 'bg-slate-800/50 border-slate-700/50'
            : 'bg-white/80 border-slate-200/50'
        }`}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className={`text-xl font-semibold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>AI-Powered Patient Insights</h3>
            <p className={`text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>Intelligent analysis of patient data and health trends</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockPatients.map((patient, index) => (
            <div
              key={patient.id}
              className={`p-4 rounded-xl border transition-all duration-500 ${
                isDark
                  ? 'bg-slate-700/30 border-slate-600/50'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className={`font-medium ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>{patient.name}</p>
                  <p className={`text-sm ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>{patient.conditions.join(', ')}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {patient.aiInsights.map((insight, insightIndex) => (
                  <div key={insightIndex} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <p className={`text-sm ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    } p-6`}>

      {/* Header */}
      <div
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Patient Management
            </h1>
            <p className={`text-lg ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Comprehensive patient care with AI-powered insights
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <button
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Patient</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        className={`mb-6 rounded-2xl border transition-all duration-500 ${
          isDark
            ? 'bg-slate-800/50 border-slate-700/50'
            : 'bg-white/80 border-slate-200/50'
        }`}
      >
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <tab.icon className={`w-5 h-5 ${tab.color}`} />
                <span>{tab.name}</span>
                {tab.count && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div
        className={`mb-6 rounded-2xl border transition-all duration-500 ${
          isDark
            ? 'bg-slate-800/50 border-slate-700/50'
            : 'bg-white/80 border-slate-200/50'
        } p-4`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500'
              }`}
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="critical">Critical</option>
            <option value="recovered">Recovered</option>
          </select>
          
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className={`px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          
          <button className="px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'patients' && renderPatientList()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'ai-insights' && renderAIInsights()}
      </div>
    </div>
  );
}
