import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, User, Shield, Bell, Monitor, Palette, Database, 
  Key, Eye, EyeOff, Smartphone, Globe, Lock, Unlock, 
  Brain, Activity, Zap, Save, RefreshCw, Download, Upload
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
}

export function SettingsPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'ai-preferences' | 'system'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isDark = resolvedTheme === 'dark';

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User, color: 'text-blue-500' },
    { id: 'security', name: 'Security', icon: Shield, color: 'text-green-500' },
    { id: 'notifications', name: 'Notifications', icon: Bell, color: 'text-purple-500' },
    { id: 'ai-preferences', name: 'AI Preferences', icon: Brain, color: 'text-orange-500' },
    { id: 'system', name: 'System', icon: Settings, color: 'text-red-500' },
  ];

  const renderProfile = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-2xl border transition-all duration-500 ${
          isDark 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/80 border-slate-200/50'
        }`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className={`text-xl font-semibold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>Personal Information</h3>
            <p className={`text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>Update your personal and professional details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>First Name</label>
            <input
              type="text"
              defaultValue="Dr. Michael"
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>Last Name</label>
            <input
              type="text"
              defaultValue="Chen"
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>Email</label>
            <input
              type="email"
              defaultValue="michael.chen@hospital.com"
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>Phone</label>
            <input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>Specialization</label>
            <input
              type="text"
              defaultValue="Cardiology, Internal Medicine"
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>Bio</label>
            <textarea
              rows={4}
              defaultValue="Experienced cardiologist with over 15 years of practice in treating cardiovascular diseases. Specialized in interventional cardiology and preventive care."
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-2xl border transition-all duration-500 ${
          isDark 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/80 border-slate-200/50'
        }`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className={`text-xl font-semibold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>Password & Security</h3>
            <p className={`text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>Manage your account security settings</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="twoFactor"
              defaultChecked
              className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="twoFactor" className={`text-sm ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>Enable Two-Factor Authentication</label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="sessionTimeout"
              defaultChecked
              className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="sessionTimeout" className={`text-sm ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>Auto-logout after 30 minutes of inactivity</label>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <Shield className="w-5 h-5" />
            <span>Update Security</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-2xl border transition-all duration-500 ${
          isDark 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/80 border-slate-200/50'
        }`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
            <Bell className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className={`text-xl font-semibold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>Notification Preferences</h3>
            <p className={`text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>Customize how and when you receive notifications</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <h4 className={`text-lg font-medium mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>Patient Alerts</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Critical lab results</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Appointment reminders</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Patient messages</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <h4 className={`text-lg font-medium mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>System Notifications</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>System updates</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Maintenance alerts</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className={`text-lg font-medium mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>Delivery Methods</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>In-app notifications</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Email notifications</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>SMS alerts</span>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <Bell className="w-5 h-5" />
            <span>Save Preferences</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );

  const renderAIPreferences = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-2xl border transition-all duration-500 ${
          isDark 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/80 border-slate-200/50'
        }`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className={`text-xl font-semibold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>AI Assistant Preferences</h3>
            <p className={`text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>Customize your AI-powered healthcare assistant</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <h4 className={`text-lg font-medium mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>AI Features</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Symptom analysis suggestions</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Treatment recommendations</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Drug interaction alerts</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <h4 className={`text-lg font-medium mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>Learning Preferences</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Learn from my decisions</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Personalized insights</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className={`text-lg font-medium mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>AI Sensitivity Level</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="aiSensitivity"
                  id="conservative"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="conservative" className={`text-sm ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Conservative - Fewer but more accurate suggestions</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="aiSensitivity"
                  id="balanced"
                  className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="balanced" className={`text-sm ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Balanced - Moderate suggestions with good accuracy</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="aiSensitivity"
                  id="aggressive"
                  className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="aggressive" className={`text-sm ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Aggressive - More suggestions, may include false positives</label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <Brain className="w-5 h-5" />
            <span>Save AI Preferences</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );

  const renderSystem = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-2xl border transition-all duration-500 ${
          isDark 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/80 border-slate-200/50'
        }`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className={`text-xl font-semibold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>System Settings</h3>
            <p className={`text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>Manage system preferences and data</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <h4 className={`text-lg font-medium mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>Appearance</h4>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  resolvedTheme === 'light'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Light Mode
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  resolvedTheme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Dark Mode
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  resolvedTheme === 'system'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                System
              </button>
            </div>
          </div>

          <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <h4 className={`text-lg font-medium mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>Data Management</h4>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export My Data</span>
              </button>
              <button className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Import Data</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className={`text-lg font-medium mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>System Actions</h4>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh System Cache</span>
              </button>
              <button className="w-full px-4 py-3 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 text-red-600 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2">
                <Database className="w-4 h-4" />
                <span>Clear All Data</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

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
              Settings & Preferences
            </h1>
            <p className={`text-lg ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Customize your healthcare experience
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Reset to Defaults</span>
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
                <tab.icon className={`w-5 h-5 ${tab.color}`} />
                <span>{tab.name}</span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'security' && renderSecurity()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'ai-preferences' && renderAIPreferences()}
          {activeTab === 'system' && renderSystem()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
