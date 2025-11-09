import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Shield, Database, Bell, Globe, Lock, Key, 
  Monitor, HardDrive, Network, Zap, Save, RefreshCw, 
  CheckCircle, AlertCircle, Clock, Eye, EyeOff, 
  Trash2, Download, Upload, Plus, Minus, Search, Brain, Target, Sparkles
} from 'lucide-react';
import { 
  AnimatedCard, AnimatedButton, AnimatedIcon, AnimatedBadge, 
  AnimatedInput, AnimatedModal, AnimatedProgress, AnimatedSwitch 
} from '@/components/ui';
import { ThemeToggle } from '../../contexts/ThemeContext';

interface SystemSetting {
  id: string;
  category: string;
  name: string;
  value: string | boolean | number;
  type: 'text' | 'boolean' | 'number' | 'select';
  description: string;
  isRequired: boolean;
  lastModified: string;
  modifiedBy: string;
}

interface SecurityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'error';
  details: string;
}

export function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSetting, setSelectedSetting] = useState<SystemSetting | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  const systemSettings: SystemSetting[] = [
    {
      id: '1',
      category: 'general',
      name: 'Site Name',
      value: 'G1Cure Healthcare',
      type: 'text',
      description: 'The name of your healthcare application',
      isRequired: true,
      lastModified: '2024-02-20 10:30 AM',
      modifiedBy: 'admin@g1cure.com'
    },
    {
      id: '2',
      category: 'general',
      name: 'Maintenance Mode',
      value: false,
      type: 'boolean',
      description: 'Enable maintenance mode for system updates',
      isRequired: false,
      lastModified: '2024-02-19 03:15 PM',
      modifiedBy: 'admin@g1cure.com'
    },
    {
      id: '3',
      category: 'security',
      name: 'Session Timeout',
      value: 30,
      type: 'number',
      description: 'Session timeout in minutes',
      isRequired: true,
      lastModified: '2024-02-18 09:45 AM',
      modifiedBy: 'admin@g1cure.com'
    },
    {
      id: '4',
      category: 'security',
      name: 'Two-Factor Authentication',
      value: true,
      type: 'boolean',
      description: 'Require 2FA for all users',
      isRequired: false,
      lastModified: '2024-02-17 02:20 PM',
      modifiedBy: 'admin@g1cure.com'
    },
    {
      id: '5',
      category: 'notifications',
      name: 'Email Notifications',
      value: true,
      type: 'boolean',
      description: 'Enable email notifications',
      isRequired: false,
      lastModified: '2024-02-16 11:30 AM',
      modifiedBy: 'admin@g1cure.com'
    },
    {
      id: '6',
      category: 'database',
      name: 'Database Connection Pool',
      value: 10,
      type: 'number',
      description: 'Maximum database connections',
      isRequired: true,
      lastModified: '2024-02-15 09:20 AM',
      modifiedBy: 'admin@g1cure.com'
    }
  ];

  const securityLogs: SecurityLog[] = [
    {
      id: '1',
      action: 'Login Success',
      user: 'admin@g1cure.com',
      timestamp: '2024-02-20 10:30 AM',
      ipAddress: '192.168.1.100',
      status: 'success',
      details: 'User logged in successfully'
    },
    {
      id: '2',
      action: 'Settings Modified',
      user: 'admin@g1cure.com',
      timestamp: '2024-02-20 09:15 AM',
      ipAddress: '192.168.1.100',
      status: 'success',
      details: 'Security settings updated'
    },
    {
      id: '3',
      action: 'Failed Login Attempt',
      user: 'unknown@example.com',
      timestamp: '2024-02-20 08:45 AM',
      ipAddress: '203.0.113.1',
      status: 'warning',
      details: 'Invalid password attempt'
    }
  ];

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'backup', label: 'Backup & Restore', icon: HardDrive },
    { id: 'logs', label: 'Security Logs', icon: Monitor }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'danger';
      default: return 'warning';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      default: return Clock;
    }
  };

  const openEditModal = (setting: SystemSetting) => {
    setSelectedSetting(setting);
    setIsEditModalOpen(true);
  };

  const handleSaveAllChanges = () => {
    // Implement save all changes functionality
    console.log('Saving all changes...');
    // Show success message
    alert('All changes saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating 3D Icons */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-20 right-20 text-blue-400/30 dark:text-blue-300/30"
      >
        <Brain className="w-16 h-16" />
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-20 left-20 text-emerald-400/30 dark:text-emerald-300/30"
      >
        <Target className="w-20 h-20" />
      </motion.div>

      <div className="relative z-10 p-6">
        {/* Header with Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                System Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg">
                Configure system preferences, security, and notifications
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <ThemeToggle />
              <AnimatedButton
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:border-blue-400 dark:text-blue-400"
                onClick={() => setIsBackupModalOpen(true)}
              >
                <Download className="w-4 h-4 mr-2" />
                Backup Settings
              </AnimatedButton>
              <AnimatedButton
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={handleSaveAllChanges}
              >
                <Save className="w-4 h-4 mr-2" />
                Save All Changes
              </AnimatedButton>
            </div>
          </div>
        </motion.div>

        {/* Enhanced System Health Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { title: 'System Status', value: 'Healthy', icon: CheckCircle, color: 'green', progress: 95 },
            { title: 'Security Score', value: '92/100', icon: Shield, color: 'blue', progress: 92 },
            { title: 'Database Health', value: 'Optimal', icon: Database, color: 'purple', progress: 98 },
            { title: 'Uptime', value: '99.9%', icon: Zap, color: 'yellow', progress: 99.9 }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -8 }}
            >
              <AnimatedCard
                className="p-8 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-700/70 backdrop-blur-xl border border-white/30 dark:border-gray-600/30 shadow-xl hover:shadow-2xl transition-all duration-300"
                hoverEffect="lift"
                entranceAnimation="slideUp"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-800/30">
                    <AnimatedIcon
                      size="xl"
                      animation="pulse"
                      color="var(--color-blue-600)"
                    >
                      <stat.icon className="w-8 h-8" />
                    </AnimatedIcon>
                  </div>
                  <AnimatedBadge variant="success" size="lg">
                    {stat.value}
                  </AnimatedBadge>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {stat.title}
                </h3>
                <AnimatedProgress
                  value={stat.progress}
                  size="sm"
                  variant="gradient"
                  className="mt-3"
                />
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <AnimatedCard 
            className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20"
            hoverEffect="glow"
            entranceAnimation="slideUp"
          >
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <AnimatedInput
              type="text"
              placeholder="Search settings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {activeTab === 'logs' ? (
            // Security Logs View
            <div className="space-y-4">
              {securityLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.01, x: 5 }}
                >
                  <AnimatedCard 
                    className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20"
                    hoverEffect="glow"
                    entranceAnimation="slideLeft"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full bg-${getStatusColor(log.status)}-100 dark:bg-${getStatusColor(log.status)}-900/20 flex items-center justify-center`}>
                          <AnimatedIcon
                            size="sm"
                            animation="pulse"
                            color={`var(--color-${getStatusColor(log.status)}-600)`}
                          >
                            <CheckCircle className="w-5 h-5" />
                          </AnimatedIcon>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {log.action}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {log.user} • {log.ipAddress}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {log.timestamp}
                          </p>
                        </div>
                      </div>
                      <AnimatedBadge
                        variant={getStatusColor(log.status) as any}
                        size="sm"
                      >
                        {log.status}
                      </AnimatedBadge>
                    </div>
                  </AnimatedCard>
                </motion.div>
              ))}
            </div>
          ) : (
            // Settings List View
            <div className="space-y-4">
              {systemSettings
                .filter(setting => 
                  setting.category === activeTab && 
                  (searchTerm === '' || 
                   setting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   setting.description.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map((setting, index) => (
                  <motion.div
                    key={setting.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.01, x: 5 }}
                  >
                    <AnimatedCard 
                      className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20"
                      hoverEffect="glow"
                      entranceAnimation="slideLeft"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {setting.name}
                            </h3>
                            {setting.isRequired && (
                              <AnimatedBadge variant="danger" size="sm">
                                Required
                              </AnimatedBadge>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {setting.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
                            <span>Last modified: {setting.lastModified}</span>
                            <span>By: {setting.modifiedBy}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 ml-6">
                          {setting.type === 'boolean' ? (
                            <AnimatedSwitch
                              checked={setting.value as boolean}
                              onChange={() => {}}
                              size="lg"
                            />
                          ) : setting.type === 'number' ? (
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                              {setting.value}
                            </span>
                          ) : (
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                              {setting.value as string}
                            </span>
                          )}
                          <AnimatedButton
                            size="sm"
                            variant="outline"
                            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            onClick={() => openEditModal(setting)}
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Edit
                          </AnimatedButton>
                        </div>
                      </div>
                    </AnimatedCard>
                  </motion.div>
                ))}
            </div>
          )}
        </motion.div>

        {/* Edit Setting Modal */}
        <AnimatedModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Setting - ${selectedSetting?.name}`}
          size="lg"
        >
          {selectedSetting && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Setting Name
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {selectedSetting.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <p className="text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {selectedSetting.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Modified
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedSetting.lastModified}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Modified By
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedSetting.modifiedBy}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <AnimatedButton
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </AnimatedButton>
                <AnimatedButton
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </AnimatedButton>
              </div>
            </div>
          )}
        </AnimatedModal>

        {/* Backup Settings Modal */}
        <AnimatedModal
          isOpen={isBackupModalOpen}
          onClose={() => setIsBackupModalOpen(false)}
          title="Backup System Settings"
          size="md"
        >
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Download className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Backup System Configuration
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Download a backup of all current system settings and configurations
              </p>
            </div>

            <div className="space-y-4">
              <AnimatedButton
                variant="outline"
                className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Download JSON Backup
              </AnimatedButton>
              <AnimatedButton
                variant="outline"
                className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV Backup
              </AnimatedButton>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <AnimatedButton
                variant="outline"
                onClick={() => setIsBackupModalOpen(false)}
              >
                Close
              </AnimatedButton>
            </div>
          </div>
        </AnimatedModal>
      </div>
    </div>
  );
}
