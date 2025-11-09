import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
}

const SimpleCard: React.FC<SimpleCardProps> = ({
  children,
  className,
  onClick,
  variant = 'default',
}) => {
  const baseClasses = "rounded-xl transition-shadow duration-200 cursor-pointer";

  const variants = {
    default: "bg-white dark:bg-gray-800 shadow-md hover:shadow-lg",
    elevated: "bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl",
    outlined: "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600",
    gradient: "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl",
  };

  return (
    <div
      className={cn(
        baseClasses,
        variants[variant],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default SimpleCard;
