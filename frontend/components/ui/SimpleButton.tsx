import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  type?: 'button' | 'submit' | 'reset';
}

const SimpleButton: React.FC<SimpleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  type = 'button',
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]";

  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500",
    secondary: "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg hover:shadow-xl focus:ring-gray-500",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800",
    danger: "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      type={type}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <div className={cn("mr-2 animate-spin", iconSizes[size])}>
          <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}

      {icon && iconPosition === 'left' && !loading && (
        <span className={cn("mr-2", iconSizes[size])}>
          {icon}
        </span>
      )}

      {children}

      {icon && iconPosition === 'right' && !loading && (
        <span className={cn("ml-2", iconSizes[size])}>
          {icon}
        </span>
      )}
    </button>
  );
};

export default SimpleButton;
