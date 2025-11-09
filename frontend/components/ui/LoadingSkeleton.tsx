import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  lines = 1,
}) => {
  const shimmer = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700";
  
  const baseClasses = cn(
    "animate-pulse rounded",
    shimmer,
    className
  );

  if (variant === 'text') {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              baseClasses,
              "h-4",
              index === lines - 1 ? "w-3/4" : "w-full"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'circular') {
    return (
      <motion.div
        className={cn(
          baseClasses,
          "rounded-full",
          width ? `w-${width}` : "w-12",
          height ? `h-${height}` : "h-12"
        )}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />
    );
  }

  if (variant === 'rectangular') {
    return (
      <motion.div
        className={cn(
          baseClasses,
          width ? `w-${width}` : "w-full",
          height ? `h-${height}` : "h-4"
        )}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <motion.div
        className={cn(
          "bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={cn(baseClasses, "h-6 w-1/3")} />
        <div className={cn(baseClasses, "h-4 w-full")} />
        <div className={cn(baseClasses, "h-4 w-2/3")} />
        <div className="flex space-x-2 mt-4">
          <div className={cn(baseClasses, "h-8 w-20")} />
          <div className={cn(baseClasses, "h-8 w-16")} />
        </div>
      </motion.div>
    );
  }

  return null;
};

export default LoadingSkeleton;
