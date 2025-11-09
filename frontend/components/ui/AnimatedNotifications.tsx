import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, XCircle, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

interface AnimatedNotificationsProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxNotifications?: number;
  className?: string;
}

const AnimatedNotifications: React.FC<AnimatedNotificationsProps> = ({
  notifications,
  onRemove,
  position = 'top-right',
  maxNotifications = 5,
  className,
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  const iconMap = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colorMap = {
    success: {
      bg: 'bg-green-500',
      text: 'text-green-100',
      border: 'border-green-600',
      icon: 'text-green-100',
    },
    error: {
      bg: 'bg-red-500',
      text: 'text-red-100',
      border: 'border-red-600',
      icon: 'text-red-100',
    },
    warning: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-100',
      border: 'border-yellow-600',
      icon: 'text-yellow-100',
    },
    info: {
      bg: 'bg-blue-500',
      text: 'text-blue-100',
      border: 'border-blue-600',
      icon: 'text-blue-100',
    },
  };

  const displayedNotifications = notifications.slice(0, maxNotifications);

  return (
    <div className={cn("fixed z-50 space-y-2", positionClasses[position], className)}>
      <AnimatePresence>
        {displayedNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            layout
            initial={{ 
              opacity: 0, 
              x: position.includes('right') ? 300 : position.includes('left') ? -300 : 0,
              y: position.includes('top') ? -50 : 50,
              scale: 0.8 
            }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              y: 0, 
              scale: 1 
            }}
            exit={{ 
              opacity: 0, 
              x: position.includes('right') ? 300 : position.includes('left') ? -300 : 0,
              y: position.includes('top') ? -50 : 50,
              scale: 0.8 
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3,
              delay: index * 0.1
            }}
            className={cn(
              "w-80 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 overflow-hidden",
              colorMap[notification.type].border
            )}
          >
            {/* Header */}
            <div className={cn(
              "px-4 py-3 flex items-start space-x-3",
              colorMap[notification.type].bg
            )}>
              <div className={cn("flex-shrink-0", colorMap[notification.type].icon)}>
                {iconMap[notification.type]}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={cn(
                  "text-sm font-medium",
                  colorMap[notification.type].text
                )}>
                  {notification.title}
                </h4>
                {notification.message && (
                  <p className={cn(
                    "text-sm mt-1 opacity-90",
                    colorMap[notification.type].text
                  )}>
                    {notification.message}
                  </p>
                )}
              </div>
              
              <motion.button
                onClick={() => onRemove(notification.id)}
                className={cn(
                  "flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors duration-200",
                  colorMap[notification.type].text
                )}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Action Button */}
            {notification.action && (
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700">
                <motion.button
                  onClick={notification.action.onClick}
                  className="w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {notification.action.label}
                </motion.button>
              </div>
            )}

            {/* Progress Bar for Auto-dismiss */}
            {!notification.persistent && notification.duration && (
              <motion.div
                className={cn(
                  "h-1",
                  colorMap[notification.type].bg
                )}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ 
                  duration: notification.duration / 1000, 
                  ease: "linear" 
                }}
                onAnimationComplete={() => {
                  if (!notification.persistent) {
                    onRemove(notification.id);
                  }
                }}
                style={{ transformOrigin: "left" }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove non-persistent notifications
    if (!notification.persistent && notification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }

    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const showSuccess = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'success',
      title,
      message,
      duration: 5000,
      ...options,
    });
  };

  const showError = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 7000,
      ...options,
    });
  };

  const showWarning = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration: 6000,
      ...options,
    });
  };

  const showInfo = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'info',
      title,
      message,
      duration: 5000,
      ...options,
    });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default AnimatedNotifications;
