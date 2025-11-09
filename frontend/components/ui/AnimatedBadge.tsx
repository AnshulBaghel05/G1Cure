import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
  pulse?: boolean;
  glow?: boolean;
}

const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  onClick,
  removable = false,
  onRemove,
  icon,
  pulse = false,
  glow = false,
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    primary: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    info: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    outline: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const glowClasses = glow ? "shadow-lg" : "";
  const pulseClasses = pulse ? "animate-pulse" : "";

  return (
    <motion.div
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        glowClasses,
        pulseClasses,
        onClick && "cursor-pointer hover:scale-105",
        className
      )}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
    >
      {icon && (
        <motion.span
          className={cn("mr-1.5", iconSizes[size])}
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {icon}
        </motion.span>
      )}
      
      <span>{children}</span>
      
      {removable && onRemove && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={cn(
            "ml-1.5 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200",
            iconSizes[size]
          )}
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.8 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <svg
            className="w-full h-full"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.button>
      )}
    </motion.div>
  );
};

export default AnimatedBadge;
