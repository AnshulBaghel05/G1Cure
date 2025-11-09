import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, AlertTriangle, Info, Clock, User, Calendar, FileText, Video, CreditCard } from 'lucide-react';
import AnimatedButton from './AnimatedButton';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'appointment' | 'billing' | 'medical' | 'telemedicine';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'system' | 'appointment' | 'billing' | 'medical' | 'telemedicine' | 'general';
  userId?: string;
  metadata?: Record<string, any>;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  categories: string[];
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface RealTimeNotificationsProps {
  userId?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxNotifications?: number;
  autoHide?: boolean;
  autoHideDelay?: number;
  showUnreadCount?: boolean;
  className?: string;
}

export function RealTimeNotifications({
  userId,
  position = 'top-right',
  maxNotifications = 5,
  autoHide = true,
  autoHideDelay = 5000,
  showUnreadCount = true,
  className = ''
}: RealTimeNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    inApp: true,
    categories: ['system', 'appointment', 'billing', 'medical', 'telemedicine', 'general'],
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  // Mock notifications for demonstration
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'appointment',
        title: 'Appointment Reminder',
        message: 'You have an appointment with Dr. Smith in 30 minutes',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
        actionUrl: '/appointments',
        actionText: 'View Details',
        priority: 'high',
        category: 'appointment',
        metadata: { appointmentId: '123', doctorName: 'Dr. Smith' }
      },
      {
        id: '2',
        type: 'billing',
        title: 'Payment Due',
        message: 'Your invoice #INV-001 is due in 3 days',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        read: false,
        actionUrl: '/billing',
        actionText: 'Pay Now',
        priority: 'medium',
        category: 'billing',
        metadata: { invoiceId: 'INV-001', amount: 150.00 }
      },
      {
        id: '3',
        type: 'medical',
        title: 'Lab Results Ready',
        message: 'Your blood test results are now available',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: true,
        actionUrl: '/medical-records',
        actionText: 'View Results',
        priority: 'medium',
        category: 'medical',
        metadata: { testType: 'Blood Test', labName: 'City Lab' }
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  // WebSocket connection for real-time notifications
  useEffect(() => {
    if (!userId) return;

    const connectWebSocket = () => {
      try {
        // In a real app, this would connect to your notification service
        // For now, we'll simulate the connection
        setIsConnected(true);
        
        // Simulate incoming notifications
        const interval = setInterval(() => {
          if (Math.random() > 0.7) { // 30% chance of new notification
            addNotification(generateMockNotification());
          }
        }, 10000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setIsConnected(false);
        
        // Attempt to reconnect
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
      }
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [userId]);

  // Generate mock notifications
  const generateMockNotification = (): Notification => {
    const types: Notification['type'][] = ['appointment', 'billing', 'medical', 'telemedicine', 'info'];
    const priorities: Notification['priority'][] = ['low', 'medium', 'high', 'urgent'];
    const categories: Notification['category'][] = ['appointment', 'billing', 'medical', 'telemedicine', 'general'];

    const type = types[Math.floor(Math.random() * types.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];

    const notifications = {
      appointment: {
        title: 'Appointment Update',
        message: 'Your appointment has been rescheduled',
        metadata: { appointmentId: 'APP-' + Math.random().toString(36).substr(2, 9) }
      },
      billing: {
        title: 'Payment Received',
        message: 'Thank you for your payment',
        metadata: { invoiceId: 'INV-' + Math.random().toString(36).substr(2, 9) }
      },
      medical: {
        title: 'Medical Record Update',
        message: 'Your medical records have been updated',
        metadata: { recordType: 'Prescription' }
      },
      telemedicine: {
        title: 'Telemedicine Session',
        message: 'Your telemedicine session is starting soon',
        metadata: { sessionId: 'TEL-' + Math.random().toString(36).substr(2, 9) }
      },
      info: {
        title: 'System Update',
        message: 'New features are now available',
        metadata: { updateType: 'Feature Release' }
      }
    };

    const notification = notifications[type];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: notification.title,
      message: notification.message,
      timestamp: new Date(),
      read: false,
      priority,
      category,
      metadata: notification.metadata
    };
  };

  // Add new notification
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => {
      const newNotifications = [notification, ...prev];
      if (newNotifications.length > maxNotifications) {
        newNotifications.splice(maxNotifications);
      }
      return newNotifications;
    });

    // Auto-hide notification
    if (autoHide) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, autoHideDelay);
    }
  }, [maxNotifications, autoHide, autoHideDelay]);

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Get notification icon
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-5 h-5" />;
      case 'billing':
        return <CreditCard className="w-5 h-5" />;
      case 'medical':
        return <FileText className="w-5 h-5" />;
      case 'telemedicine':
        return <Video className="w-5 h-5" />;
      case 'success':
        return <Check className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  // Get notification color classes
  const getNotificationColors = (type: Notification['type'], priority: Notification['priority']) => {
    const baseColors = {
      appointment: 'bg-blue-50 border-blue-200 text-blue-800',
      billing: 'bg-green-50 border-green-200 text-green-800',
      medical: 'bg-purple-50 border-purple-200 text-purple-800',
      telemedicine: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-gray-50 border-gray-200 text-gray-800'
    };

    const priorityColors = {
      low: 'border-l-4 border-l-gray-400',
      medium: 'border-l-4 border-l-yellow-400',
      high: 'border-l-4 border-l-orange-400',
      urgent: 'border-l-4 border-l-red-400'
    };

    return `${baseColors[type]} ${priorityColors[priority]}`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      {/* Notification Bell */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-3 bg-white dark:bg-gray-800 shadow-lg rounded-full hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          
          {showUnreadCount && unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </AnimatedButton>
      </motion.div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              <div className="flex items-center space-x-2">
                <AnimatedButton
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Mark all read
                </AnimatedButton>
                <AnimatedButton
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Clear all
                </AnimatedButton>
                <AnimatedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </AnimatedButton>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-600">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 p-2 rounded-full ${getNotificationColors(notification.type, notification.priority)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {notification.timestamp.toLocaleTimeString()}
                              </span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {notification.message}
                          </p>
                          
                          {notification.actionUrl && notification.actionText && (
                            <div className="mt-3">
                              <AnimatedButton
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  markAsRead(notification.id);
                                  // Navigate to action URL
                                  window.location.href = notification.actionUrl!;
                                }}
                                className="text-xs"
                              >
                                {notification.actionText}
                              </AnimatedButton>
                            </div>
                          )}
                        </div>
                        
                        <AnimatedButton
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </AnimatedButton>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </span>
                <span className={`flex items-center space-x-1 ${
                  isConnected ? 'text-green-600' : 'text-red-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
