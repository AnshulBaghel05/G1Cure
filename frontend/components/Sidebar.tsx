import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  BarChart3, 
  Calendar, 
  FileText, 
  CreditCard, 
  Video, 
  Users, 
  Settings, 
  Cog, 
  Shield,
  Bell,
  User,
  LogOut,
  Home,
  Activity,
  TrendingUp,
  Database,
  Clipboard,
  MessageSquare,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';
import { AnimatedIcon, AnimatedBadge } from '@/components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isCollapsed: propIsCollapsed, onToggle: propOnToggle }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const onToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (propOnToggle) {
      propOnToggle();
    }
  };
  
  const finalIsCollapsed = propIsCollapsed !== undefined ? propIsCollapsed : isCollapsed;
  const { user, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications] = useState(5); // Mock notification count

  const isDark = resolvedTheme === 'dark';

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
      case 'patient':
        return [
          { name: 'Dashboard', path: '/patient/dashboard', icon: Home, badge: null },
          { name: 'Appointments', path: '/patient/appointments', icon: Calendar, badge: 2 },
          { name: 'Medical Records', path: '/patient/medical-records', icon: FileText, badge: null },
          { name: 'Billing', path: '/patient/billing', icon: CreditCard, badge: 1 },
          { name: 'Telemedicine', path: '/patient/telemedicine', icon: Video, badge: null },
          { name: 'Notifications', path: '/patient/notifications', icon: Bell, badge: 5 },
          { name: 'Settings', path: '/patient/settings', icon: Settings, badge: null },
          { name: 'Help', path: '/patient/help', icon: HelpCircle, badge: null },
        ];
      case 'doctor':
        return [
          { name: 'Dashboard', path: '/doctor/dashboard', icon: Home, badge: null },
          { name: 'Patients', path: '/doctor/patients', icon: Users, badge: 12 },
          { name: 'Appointments', path: '/doctor/appointments', icon: Calendar, badge: 5 },
          { name: 'Telemedicine', path: '/doctor/telemedicine', icon: Video, badge: 2 },
          { name: 'Lab Reports', path: '/doctor/lab-reports', icon: FileText, badge: 8 },
          { name: 'Messages', path: '/doctor/messages', icon: MessageSquare, badge: 3 },
          { name: 'Settings', path: '/doctor/settings', icon: Settings, badge: null },
          { name: 'Help', path: '/doctor/help', icon: HelpCircle, badge: null },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: Home, badge: null },
          { name: 'User Management', path: '/admin/users', icon: Users, badge: 8 },
          { name: 'Departments', path: '/admin/departments', icon: Cog, badge: null },
          { name: 'Analytics', path: '/admin/analytics', icon: BarChart3, badge: null },
          { name: 'System Settings', path: '/admin/settings', icon: Settings, badge: null },
          { name: 'Billing', path: '/admin/billing', icon: CreditCard, badge: null },
          { name: 'Notifications', path: '/admin/notifications', icon: Bell, badge: 3 },
          { name: 'Help', path: '/admin/help', icon: HelpCircle, badge: null },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getRoleBasedNavigation();

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 }
  };

  const itemVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 }
  };

  return (
    <motion.div
      variants={sidebarVariants}
      animate={finalIsCollapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-indigo-900 text-white shadow-2xl relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          {!finalIsCollapsed && (
            <motion.div
              variants={itemVariants}
              animate={finalIsCollapsed ? 'collapsed' : 'expanded'}
              className="flex items-center space-x-3"
            >
              <AnimatedIcon size="lg" animation="pulse" color="#FFFFFF">
                <Heart className="w-8 h-8" />
              </AnimatedIcon>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                G1Cure
              </span>
            </motion.div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300"
          >
            {finalIsCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* User Profile */}
      {user && (
        <motion.div
          variants={itemVariants}
          animate={finalIsCollapsed ? 'collapsed' : 'expanded'}
          className="relative z-10 p-4 border-b border-white/20"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            {!finalIsCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-blue-200 capitalize">
                  {user.role}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="relative z-10 flex-1 overflow-y-auto py-4">
        <nav className="space-y-2 px-3">
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="relative"
            >
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 group ${
                  location.pathname === item.path
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="relative">
                  <item.icon className="w-5 h-5" />
                  {item.badge && (
                    <AnimatedBadge
                      variant="danger"
                      size="sm"
                      className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center text-xs"
                    >
                      {item.badge}
                    </AnimatedBadge>
                  )}
                </div>
                
                {!finalIsCollapsed && (
                  <motion.span
                    variants={itemVariants}
                    animate={finalIsCollapsed ? 'collapsed' : 'expanded'}
                    className="text-sm font-medium"
                  >
                    {item.name}
                  </motion.span>
                )}
              </button>
              
              {/* Active Indicator */}
              {location.pathname === item.path && (
                <motion.div
                  layoutId="activeSidebarItem"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full"
                />
              )}
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="relative z-10 p-4 border-t border-white/20 space-y-2">
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-white hover:bg-white/20 transition-all duration-300 group"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {!finalIsCollapsed && (
            <motion.span
              variants={itemVariants}
              animate={finalIsCollapsed ? 'collapsed' : 'expanded'}
              className="text-sm font-medium"
            >
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </motion.span>
          )}
        </motion.button>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5" />
          {!finalIsCollapsed && (
            <motion.span
              variants={itemVariants}
              animate={finalIsCollapsed ? 'collapsed' : 'expanded'}
              className="text-sm font-medium"
            >
              Sign Out
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* Collapsed Tooltips */}
      {finalIsCollapsed && (
        <div className="absolute left-full top-0 ml-2 p-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          {navigationItems.map((item) => (
            <div key={item.name} className="whitespace-nowrap py-1">
              {item.name}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
