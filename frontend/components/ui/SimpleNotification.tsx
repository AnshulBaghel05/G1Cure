import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface SimpleNotificationProps {
  notification: Notification;
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const SimpleNotification: React.FC<SimpleNotificationProps> = ({
  notification,
  onRemove,
  position = 'top-right',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto-remove after duration
    if (notification.duration) {
      const timer = setTimeout(() => {
        handleRemove();
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(notification.id), 300);
  };

  const variants = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-500',
      text: 'text-green-800 dark:text-green-200',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-500',
      text: 'text-red-800 dark:text-red-200',
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-500',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-500',
      text: 'text-blue-800 dark:text-blue-200',
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
  };

  const variant = variants[notification.type];

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div
      className={cn(
        'fixed z-50 max-w-sm w-full',
        'transform transition-all duration-300',
        positionClasses[position],
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      <div
        className={cn(
          'rounded-lg shadow-lg border-l-4 p-4',
          variant.bg,
          variant.border
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {variant.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={cn('text-sm font-semibold', variant.text)}>
              {notification.title}
            </h4>
            {notification.message && (
              <p className={cn('text-sm mt-1', variant.text)}>
                {notification.message}
              </p>
            )}
          </div>
          <button
            onClick={handleRemove}
            className={cn(
              'flex-shrink-0 p-1 rounded-lg',
              'hover:bg-black/10 dark:hover:bg-white/10',
              'transition-colors duration-200'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Container component for managing multiple notifications
interface SimpleNotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const SimpleNotificationContainer: React.FC<SimpleNotificationContainerProps> = ({
  notifications,
  onRemove,
  position = 'top-right',
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className={cn('absolute space-y-2', position)}>
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="pointer-events-auto"
            style={{ marginTop: index > 0 ? '8px' : 0 }}
          >
            <SimpleNotification
              notification={notification}
              onRemove={onRemove}
              position={position}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleNotification;
