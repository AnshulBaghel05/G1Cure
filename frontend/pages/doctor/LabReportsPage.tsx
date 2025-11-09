import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Clock, CheckCircle, AlertCircle, Search, Plus, 
  TrendingUp, Filter, Download, Share2, Eye, Brain, Activity
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface LabReport {
  id: string;
  patientName: string;
  testType: string;
  status: 'pending' | 'completed' | 'critical' | 'normal';
  date: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  doctor: string;
  lab: string;
}

export function LabReportsPage() {
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'analytics' | 'ai-insights'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const isDark = resolvedTheme === 'dark';

  const tabs = [
    { id: 'pending', name: 'Pending Results', icon: Clock, count: 23, color: 'text-orange-500' },
    { id: 'history', name: 'Report History', icon: CheckCircle, count: 156, color: 'text-green-500' },
    { id: 'analytics', name: 'Analytics', icon: Activity, count: null, color: 'text-blue-500' },
    { id: 'ai-insights', name: 'AI Insights', icon: Brain, count: null, color: 'text-purple-500' },
  ];

  // Mock data for demonstration
  const mockReports: LabReport[] = [
    {
      id: 'LR001',
      patientName: 'Sarah Johnson',
      testType: 'Complete Blood Count',
      status: 'critical',
      date: '2024-01-15',
      priority: 'urgent',
      doctor: 'Dr. Smith',
      lab: 'Central Lab'
    },
    {
      id: 'LR002',
      patientName: 'Michael Chen',
      testType: 'Lipid Panel',
      status: 'completed',
      date: '2024-01-14',
      priority: 'medium',
      doctor: 'Dr. Johnson',
      lab: 'Central Lab'
    },
    {
      id: 'LR003',
      patientName: 'Emily Davis',
      testType: 'Thyroid Function',
      status: 'pending',
      date: '2024-01-15',
      priority: 'high',
      doctor: 'Dr. Williams',
      lab: 'Endocrine Lab'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'completed': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'pending': return 'text-orange-500 bg-orange-100 dark:bg-orange-900/20';
      case 'normal': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    } p-6`}>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Lab Reports & Analytics
            </h1>
            <p className={`text-lg ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              AI-powered laboratory management with real-time insights
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Request Report</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
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
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`mb-6 rounded-2xl border transition-all duration-500 ${
          isDark 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/80 border-slate-200/50'
        } p-4`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500'
              }`}
            />
          </div>
          
          <select className={`px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}>
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <button className="px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`rounded-2xl border transition-all duration-500 ${
          isDark 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/80 border-slate-200/50'
        } overflow-hidden`}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className={`text-xl font-semibold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>Lab Reports</h3>
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
                }`}>Test Type</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Status</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Priority</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Date</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {mockReports.map((report, index) => (
                <motion.tr
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`hover:${
                    isDark ? 'bg-slate-700/30' : 'bg-slate-50'
                  } transition-colors duration-200`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className={`font-medium ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>{report.patientName}</p>
                      <p className={`text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>{report.doctor}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>{report.testType}</p>
                    <p className={`text-sm ${
                      isDark ? 'text-slate-500' : 'text-slate-500'
                    }`}>{report.lab}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(report.priority)}`}>
                      {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>{report.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-lg transition-colors duration-200">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
