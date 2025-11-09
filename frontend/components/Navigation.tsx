import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Heart, 
  Menu, 
  X, 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Home,
  Users,
  Calendar,
  FileText,
  Video,
  BarChart3,
  Cog,
  HelpCircle,
  Activity,
  TrendingUp,
  Brain
} from 'lucide-react';
import { AnimatedButton, AnimatedIcon } from './ui';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from '../contexts/ThemeContext';

interface NavigationProps {
  onAuthClick: (type: 'login' | 'signup') => void;
}

export function Navigation({ onAuthClick }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getRoleBasedNavigation = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
          { name: 'Users', path: '/admin/users', icon: Users },
          { name: 'Departments', path: '/admin/departments', icon: Cog },
          { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
          { name: 'Settings', path: '/admin/settings', icon: Settings },
          { name: 'Billing', path: '/admin/billing', icon: FileText },
          { name: 'Notifications', path: '/admin/notifications', icon: Bell },
          { name: 'Help', path: '/admin/help', icon: HelpCircle },
        ];
      case 'doctor':
        return [
          { name: 'Dashboard', path: '/doctor/dashboard', icon: Home },
          { name: 'Patients', path: '/doctor/patients', icon: Users },
          { name: 'Appointments', path: '/doctor/appointments', icon: Calendar },
          { name: 'Telemedicine', path: '/doctor/telemedicine', icon: Video },
          { name: 'Lab Reports', path: '/doctor/lab-reports', icon: FileText },
          { name: 'Messages', path: '/doctor/messages', icon: Bell },
          { name: 'Settings', path: '/doctor/settings', icon: Settings },
          { name: 'Help', path: '/doctor/help', icon: HelpCircle },
        ];
      case 'patient':
        return [
          { name: 'Dashboard', path: '/patient/dashboard', icon: Home },
          { name: 'Appointments', path: '/patient/appointments', icon: Calendar },
          { name: 'Medical Records', path: '/patient/medical-records', icon: FileText },
          { name: 'Telemedicine', path: '/patient/telemedicine', icon: Video },
          { name: 'Billing', path: '/patient/billing', icon: FileText },
          { name: 'Notifications', path: '/patient/notifications', icon: Bell },
          { name: 'Settings', path: '/patient/settings', icon: Settings },
          { name: 'Help', path: '/patient/help', icon: HelpCircle },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getRoleBasedNavigation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <AnimatedIcon size="lg" animation="pulse" color="#3B82F6">
              <Heart className="w-8 h-8" />
            </AnimatedIcon>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              G1Cure
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <div className="flex items-center space-x-6">
                {/* Main Navigation */}
                <div className="flex items-center space-x-6">
                  {navigationItems.map((item) => (
                    <motion.div
                      key={item.name}
                      whileHover={{ y: -2 }}
                      className="relative"
                    >
                      <button
                        onClick={() => navigate(item.path)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          location.pathname === item.path
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                            : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </button>
                      {location.pathname === item.path && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-4">
                  {/* Theme Toggle */}
                  <div className="flex items-center space-x-2">
                    <ThemeToggle />
                    
                    {/* Notifications */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      {notifications > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                        >
                          {notifications}
                        </motion.span>
                      )}
                    </motion.button>

                    {/* Search */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                    >
                      <Search className="w-5 h-5" />
                    </motion.button>

                    {/* Profile Menu */}
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                      >
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">{user.first_name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                      </motion.button>

                      <AnimatePresence>
                        {isProfileOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2"
                          >
                            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.first_name} {user.last_name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {user.role}
                              </p>
                            </div>
                            
                            <div className="py-1">
                              <button
                                onClick={() => navigate(`/${user.role}/profile`)}
                                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                              >
                                <User className="w-4 h-4" />
                                <span>Profile</span>
                              </button>
                              <button
                                onClick={() => navigate(`/${user.role}/settings`)}
                                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                              >
                                <Settings className="w-4 h-4" />
                                <span>Settings</span>
                              </button>
                              <button
                                onClick={handleLogout}
                                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                              >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Public Navigation */
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAuthClick('login')}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300"
                >
                  Sign In
                </motion.button>
                <AnimatedButton
                  onClick={() => onAuthClick('signup')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </AnimatedButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-6 space-y-4">
              {user ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  {/* Navigation Items */}
                  <div className="space-y-2">
                    {navigationItems.map((item) => (
                      <motion.button
                        key={item.name}
                        whileHover={{ x: 5 }}
                        onClick={() => {
                          navigate(item.path);
                          setIsMenuOpen(false);
                        }}
                        className={`flex items-center space-x-3 w-full p-3 rounded-lg text-left transition-colors duration-200 ${
                          location.pathname === item.path
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                    <button
                      onClick={() => {
                        navigate(`/${user.role}/settings`);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                /* Public Mobile Menu */
                <div className="space-y-4">
                  <AnimatedButton
                    onClick={() => {
                      onAuthClick('login');
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 py-3 rounded-lg font-medium"
                  >
                    Sign In
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={() => {
                      onAuthClick('signup');
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-3 rounded-lg font-medium"
                  >
                    Create Account
                  </AnimatedButton>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}