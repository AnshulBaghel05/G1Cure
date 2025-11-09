import React, { useState } from 'react';
import { Video, Clock, Settings, Search, Plus } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function TelemedicinePage() {
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'sessions' | 'history' | 'settings'>('sessions');
  const [searchTerm, setSearchTerm] = useState('');

  const isDark = resolvedTheme === 'dark';

  const tabs = [
    { id: 'sessions', name: 'Active Sessions', icon: Video, count: 8 },
    { id: 'history', name: 'Session History', icon: Clock, count: 156 },
    { id: 'settings', name: 'Settings', icon: Settings, count: null },
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    } p-6`}>
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Telemedicine
            </h1>
            <p className={`text-lg ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Conduct virtual consultations with your patients
            </p>
          </div>

          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>New Session</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`mb-6 rounded-2xl border transition-all duration-500 ${
          isDark
            ? 'bg-slate-800/50 border-slate-700/50'
            : 'bg-white/80 border-slate-200/50'
        }`}>
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
                {tab.count !== null && (
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

      {/* Search */}
      <div className={`mb-6 rounded-2xl border transition-all duration-500 ${
          isDark
            ? 'bg-slate-800/50 border-slate-700/50'
            : 'bg-white/80 border-slate-200/50'
        } p-4`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search sessions by patient name, type, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark 
                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500'
            }`}
          />
        </div>
      </div>

      {/* Content */}
      <div className={`rounded-2xl border transition-all duration-500 ${
          isDark
            ? 'bg-slate-800/50 border-slate-700/50'
            : 'bg-white/80 border-slate-200/50'
        } p-8`}>
        <div className="text-center">
          <Video className={`w-16 h-16 mx-auto mb-4 ${
            isDark ? 'text-slate-600' : 'text-slate-400'
          }`} />
          <h3 className={`text-xl font-medium mb-2 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {activeTab === 'sessions' ? 'Active Sessions' : activeTab === 'history' ? 'Session History' : 'Settings'}
          </h3>
          <p className={`${
            isDark ? 'text-slate-500' : 'text-slate-500'
          }`}>
            {activeTab === 'sessions' && 'View and manage active telemedicine sessions'}
            {activeTab === 'history' && 'Review past telemedicine sessions and patient records'}
            {activeTab === 'settings' && 'Configure telemedicine settings and preferences'}
          </p>
        </div>
      </div>
    </div>
  );
}
