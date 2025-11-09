import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface AnimatedSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function AnimatedSwitch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className = '',
  label,
  variant = 'default'
}: AnimatedSwitchProps) {
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-12 h-6',
    lg: 'w-16 h-8'
  };

  const thumbSize = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  };

  const iconSize = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const variantColors = {
    default: {
      bg: checked ? 'bg-blue-600' : 'bg-gray-300',
      thumb: 'bg-white',
      icon: checked ? 'text-blue-600' : 'text-gray-400'
    },
    success: {
      bg: checked ? 'bg-green-600' : 'bg-gray-300',
      thumb: 'bg-white',
      icon: checked ? 'text-green-600' : 'text-gray-400'
    },
    warning: {
      bg: checked ? 'bg-yellow-600' : 'bg-gray-300',
      thumb: 'bg-white',
      icon: checked ? 'text-yellow-600' : 'text-gray-400'
    },
    danger: {
      bg: checked ? 'bg-red-600' : 'bg-gray-300',
      thumb: 'bg-white',
      icon: checked ? 'text-red-600' : 'text-gray-400'
    }
  };

  const colors = variantColors[variant];

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <motion.button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        className={`
          relative inline-flex items-center justify-center rounded-full transition-colors duration-200
          ${sizeClasses[size]} ${colors.bg}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        `}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        animate={{
          scale: [1, 1.05, 1],
          transition: { duration: 0.2 }
        }}
      >
        <motion.div
          className={`${thumbSize[size]} ${colors.thumb} rounded-full shadow-lg flex items-center justify-center`}
          animate={{
            x: checked ? (size === 'sm' ? 16 : size === 'md' ? 24 : 32) : 0
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        >
          <motion.div
            animate={{
              opacity: checked ? 1 : 0,
              scale: checked ? 1 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            {checked ? (
              <Check className={`${iconSize[size]} ${colors.icon}`} />
            ) : (
              <X className={`${iconSize[size]} ${colors.icon}`} />
            )}
          </motion.div>
        </motion.div>
      </motion.button>
      
      {label && (
        <span className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
          {label}
        </span>
      )}
    </div>
  );
}
