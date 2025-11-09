import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Search, Plus } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function AppointmentsPage() {
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'past'>('today');
  const [searchTerm, setSearchTerm] = useState('');

  const isDark = resolvedTheme === 'dark';

  const tabs = [
    { id: 'today', name: 'Today\'s Schedule', icon: Calendar, count: 18 },
    { id: 'upcoming', name: 'Upcoming', icon: Clock, count: 45 },
    { id: 'past', name: 'Past Appointments', icon: Calendar, count: 156 },
  ];

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
              Appointments
            </h1>
            <p className={`text-lg ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Manage your patient appointments and schedule
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Schedule Appointment</span>
          </motion.button>
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
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Search */}
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search appointments by patient name, type, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark 
                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500'
            }`}
          />
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
        } p-8`}
      >
        <div className="text-center">
          <Calendar className={`w-16 h-16 mx-auto mb-4 ${
            isDark ? 'text-slate-600' : 'text-slate-400'
          }`} />
          <h3 className={`text-xl font-medium mb-2 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {activeTab === 'today' ? 'Today\'s Schedule' : activeTab === 'upcoming' ? 'Upcoming Appointments' : 'Past Appointments'}
          </h3>
          <p className={`${
            isDark ? 'text-slate-500' : 'text-slate-500'
          }`}>
            {activeTab === 'today' && 'View and manage today\'s scheduled appointments'}
            {activeTab === 'upcoming' && 'See upcoming appointments and plan your schedule'}
            {activeTab === 'past' && 'Review completed appointments and patient history'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
