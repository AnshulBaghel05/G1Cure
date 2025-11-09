import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'table' | 'list' | 'form' | 'avatar';
  width?: string | number;
  height?: string | number;
  lines?: number;
  rows?: number;
  columns?: number;
  animated?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
  color?: 'light' | 'dark' | 'custom';
  customColor?: string;
}

const AnimatedSkeleton: React.FC<AnimatedSkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  lines = 1,
  rows = 3,
  columns = 1,
  animated = true,
  speed = 'normal',
  color = 'light',
  customColor,
}) => {
  const speedConfig = {
    slow: { duration: 2, repeatDelay: 0.5 },
    normal: { duration: 1.5, repeatDelay: 0.3 },
    fast: { duration: 1, repeatDelay: 0.1 },
  };

  const colorConfig = {
    light: {
      base: 'bg-gray-200 dark:bg-gray-700',
      shimmer: 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
    },
    dark: {
      base: 'bg-gray-700 dark:bg-gray-800',
      shimmer: 'bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800',
    },
    custom: {
      base: customColor || 'bg-gray-200',
      shimmer: customColor || 'bg-gray-200',
    },
  };

  const currentColor = colorConfig[color];
  const currentSpeed = speedConfig[speed];

  // Shimmer animation
  const shimmerAnimation = animated ? {
    background: currentColor.shimmer,
    backgroundSize: '200% 100%',
    animation: `shimmer ${currentSpeed.duration}s ease-in-out infinite`,
  } : {};

  // Text skeleton
  if (variant === 'text') {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              "rounded",
              currentColor.base,
              className
            )}
            style={{
              height: height || '1rem',
              width: index === lines - 1 ? (width || '75%') : (width || '100%'),
              ...shimmerAnimation,
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          />
        ))}
      </div>
    );
  }

  // Circular skeleton
  if (variant === 'circular') {
    const size = width || height || '3rem';
    return (
      <motion.div
        className={cn(
          "rounded-full",
          currentColor.base,
          className
        )}
        style={{
          width: size,
          height: size,
          ...shimmerAnimation,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />
    );
  }

  // Rectangular skeleton
  if (variant === 'rectangular') {
    return (
      <motion.div
        className={cn(
          "rounded",
          currentColor.base,
          className
        )}
        style={{
          width: width || '100%',
          height: height || '1rem',
          ...shimmerAnimation,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      />
    );
  }

  // Card skeleton
  if (variant === 'card') {
    return (
      <motion.div
        className={cn(
          "bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3 border border-gray-200 dark:border-gray-700",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className={cn("h-6 rounded", currentColor.base)}
          style={{
            width: width || '60%',
            ...shimmerAnimation,
          }}
        />
        <div
          className={cn("h-4 rounded", currentColor.base)}
          style={{
            width: width || '100%',
            ...shimmerAnimation,
          }}
        />
        <div
          className={cn("h-4 rounded", currentColor.base)}
          style={{
            width: width || '80%',
            ...shimmerAnimation,
          }}
        />
        <div className="flex space-x-2 mt-4">
          <div
            className={cn("h-8 rounded", currentColor.base)}
            style={{
              width: '80px',
              ...shimmerAnimation,
            }}
          />
          <div
            className={cn("h-8 rounded", currentColor.base)}
            style={{
              width: '60px',
              ...shimmerAnimation,
            }}
          />
        </div>
      </motion.div>
    );
  }

  // Table skeleton
  if (variant === 'table') {
    return (
      <div className={cn("space-y-3", className)}>
        {/* Header */}
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <motion.div
              key={index}
              className={cn("h-4 rounded", currentColor.base)}
              style={{
                width: index === 0 ? '20%' : index === columns - 1 ? '15%' : '25%',
                ...shimmerAnimation,
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            />
          ))}
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <motion.div
            key={rowIndex}
            className="flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rowIndex * 0.1, duration: 0.3 }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={cn("h-4 rounded", currentColor.base)}
                style={{
                  width: colIndex === 0 ? '20%' : colIndex === columns - 1 ? '15%' : '25%',
                  ...shimmerAnimation,
                }}
              />
            ))}
          </motion.div>
        ))}
      </div>
    );
  }

  // List skeleton
  if (variant === 'list') {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <div
              className={cn("w-10 h-10 rounded-full", currentColor.base)}
              style={shimmerAnimation}
            />
            <div className="flex-1 space-y-2">
              <div
                className={cn("h-4 rounded", currentColor.base)}
                style={{
                  width: index === lines - 1 ? '60%' : '100%',
                  ...shimmerAnimation,
                }}
              />
              <div
                className={cn("h-3 rounded", currentColor.base)}
                style={{
                  width: '80%',
                  ...shimmerAnimation,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Form skeleton
  if (variant === 'form') {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <div
              className={cn("h-4 rounded", currentColor.base)}
              style={{
                width: index === lines - 1 ? '40%' : '60%',
                ...shimmerAnimation,
              }}
            />
            <div
              className={cn("h-10 rounded", currentColor.base)}
              style={{
                width: '100%',
                ...shimmerAnimation,
              }}
            />
          </motion.div>
        ))}
        
        <div className="flex space-x-3 pt-4">
          <div
            className={cn("h-10 rounded", currentColor.base)}
            style={{
              width: '100px',
              ...shimmerAnimation,
            }}
          />
          <div
            className={cn("h-10 rounded", currentColor.base)}
            style={{
              width: '80px',
              ...shimmerAnimation,
            }}
          />
        </div>
      </div>
    );
  }

  // Avatar skeleton
  if (variant === 'avatar') {
    const size = width || height || '3rem';
    return (
      <motion.div
        className={cn(
          "rounded-full",
          currentColor.base,
          className
        )}
        style={{
          width: size,
          height: size,
          ...shimmerAnimation,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />
    );
  }

  // Default text skeleton
  return (
    <div
      className={cn(
        "rounded",
        currentColor.base,
        className
      )}
      style={{
        width: width || '100%',
        height: height || '1rem',
        ...shimmerAnimation,
      }}
    />
  );
};

// CSS for shimmer animation
const shimmerCSS = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

// Add CSS to document head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerCSS;
  document.head.appendChild(style);
}

export default AnimatedSkeleton;
