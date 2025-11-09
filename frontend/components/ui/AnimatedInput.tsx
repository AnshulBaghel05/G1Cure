import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date';
  error?: string;
  success?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  placeholder,
  value = '',
  onChange,
  type = 'text',
  error,
  success,
  disabled = false,
  required = false,
  className,
  icon,
  iconPosition = 'left',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(!!value);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    setIsFilled(!!value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
    setIsFilled(!!e.target.value);
  };

  return (
    <div className={cn("relative", className)}>
      {label && (
        <motion.label
          className={cn(
            "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
            required && "after:content-['*'] after:ml-1 after:text-red-500"
          )}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10">
            {icon}
          </div>
        )}
        
        <motion.input
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-3 border-2 rounded-lg transition-all duration-300",
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
            "placeholder-gray-400 dark:placeholder-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            icon && iconPosition === 'left' && "pl-10",
            icon && iconPosition === 'right' && "pr-10",
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : success
              ? "border-green-500 focus:ring-green-500 focus:border-green-500"
              : isFocused
              ? "border-blue-500 focus:ring-blue-500 focus:border-blue-500"
              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500",
            disabled && "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700",
            className
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileFocus={{ scale: 1.01 }}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10">
            {icon}
          </div>
        )}
        
        {/* Floating label animation */}
        {label && (
          <motion.div
            className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-300",
              isFocused || isFilled
                ? "text-blue-600 dark:text-blue-400 text-xs -translate-y-6 bg-white dark:bg-gray-800 px-2"
                : "text-gray-400 dark:text-gray-500 text-base"
            )}
            animate={{
              y: isFocused || isFilled ? -24 : 0,
              scale: isFocused || isFilled ? 0.85 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <motion.div
          className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span>⚠️</span>
          <span>{error}</span>
        </motion.div>
      )}
      
      {/* Success message */}
      {success && (
        <motion.div
          className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center space-x-1"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span>✅</span>
          <span>{success}</span>
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedInput;
