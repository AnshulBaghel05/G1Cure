import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Search, Plus, Filter, Send, Reply, Forward, 
  Archive, Trash2, Star, Clock, User, Phone, Video, FileText,
  Brain, TrendingUp, Activity, CheckCircle, AlertCircle, Mail
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Message {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  timestamp: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'email' | 'sms' | 'in-app' | 'voice';
}

export function MessagesPage() {
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'drafts' | 'analytics' | 'ai-assistant'>('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const isDark = resolvedTheme === 'dark';

  const tabs = [
    { id: 'inbox', name: 'Inbox', icon: MessageSquare, count: 23, color: 'text-blue-500' },
    { id: 'sent', name: 'Sent', icon: Send, count: 45, color: 'text-green-500' },
    { id: 'drafts', name: 'Drafts', icon: FileText, count: 8, color: 'text-yellow-500' },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp, count: null, color: 'text-purple-500' },
    { id: 'ai-assistant', name: 'AI Assistant', icon: Brain, count: null, color: 'text-orange-500' },
  ];

  // Mock data for demonstration
  const mockMessages: Message[] = [
    {
      id: 'M001',
      sender: 'Dr. Sarah Johnson',
      recipient: 'Dr. Michael Chen',
      subject: 'Patient Consultation Request',
      content: 'Hi Michael, I have a patient with complex cardiac symptoms that I\'d like to discuss. Are you available for a consultation this week?',
      timestamp: '2024-01-15 10:30 AM',
      status: 'unread',
      priority: 'high',
      type: 'email'
    },
    {
      id: 'M002',
      sender: 'Nurse Williams',
      recipient: 'Dr. Michael Chen',
      subject: 'Lab Results Alert',
      content: 'Critical lab results for patient Emily Davis. Blood pressure elevated and cholesterol levels concerning.',
      timestamp: '2024-01-15 09:15 AM',
      status: 'read',
      priority: 'urgent',
      type: 'in-app'
    },
    {
      id: 'M003',
      sender: 'Patient Support',
      recipient: 'Dr. Michael Chen',
      subject: 'System Maintenance Notice',
      content: 'Scheduled maintenance on January 20th from 2-4 AM. Some features may be temporarily unavailable.',
      timestamp: '2024-01-14 3:00 PM',
      status: 'read',
      priority: 'low',
      type: 'email'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
      case 'read': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'replied': return 'text-purple-500 bg-purple-100 dark:bg-purple-900/20';
      case 'archived': return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'in-app': return MessageSquare;
      case 'voice': return Phone;
      default: return MessageSquare;
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
              Communication Center
            </h1>
            <p className={`text-lg ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              AI-powered messaging with intelligent insights
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
              <span>New Message</span>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search messages..."
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
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={`px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <option value="all">All Types</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="in-app">In-App</option>
            <option value="voice">Voice</option>
          </select>
          
          <button className="px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </motion.div>

      {/* Messages List */}
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
          }`}>Message Inbox</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${
              isDark ? 'bg-slate-700/50' : 'bg-slate-50'
            }`}>
              <tr>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Sender</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Subject</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Type</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Status</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Priority</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Time</th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {mockMessages.map((message, index) => {
                const TypeIcon = getTypeIcon(message.type);
                return (
                  <motion.tr
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`hover:${
                      isDark ? 'bg-slate-700/30' : 'bg-slate-50'
                    } transition-colors duration-200 cursor-pointer`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <p className={`font-medium ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}>{message.sender}</p>
                          <p className={`text-sm ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}>To: {message.recipient}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-medium ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>{message.subject}</p>
                      <p className={`text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      } truncate max-w-xs`}>{message.content}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="w-4 h-4 text-slate-500" />
                        <span className={`text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>{message.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                        {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(message.priority)}`}>
                        {message.priority.charAt(0).toUpperCase() + message.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>{message.timestamp}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200">
                          <Reply className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200">
                          <Forward className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-lg transition-colors duration-200">
                          <Archive className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
