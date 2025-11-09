import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

interface AnimatedToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
  className?: string;
}

const AnimatedToast: React.FC<AnimatedToastProps> = ({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  className,
}) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  const iconColors = {
    success: 'text-green-100',
    error: 'text-red-100',
    warning: 'text-yellow-100',
    info: 'text-blue-100',
  };

  React.useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          "fixed top-4 right-4 z-50 max-w-sm w-full",
          className
        )}
        initial={{ opacity: 0, x: 300, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 300, scale: 0.8 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        <div className={cn(
          "rounded-lg shadow-lg p-4 flex items-start space-x-3",
          colors[type]
        )}>
          <div className={cn("flex-shrink-0", iconColors[type])}>
            {icons[type]}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{message}</p>
          </div>
          
          {onClose && (
            <button
              onClick={onClose}
              className={cn(
                "flex-shrink-0 ml-2 p-1 rounded-md",
                iconColors[type],
                "hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
              )}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedToast;
