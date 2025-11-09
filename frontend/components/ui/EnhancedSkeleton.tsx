import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  type?: 'text' | 'title' | 'avatar' | 'card' | 'table' | 'chart';
  lines?: number;
  className?: string;
  height?: string;
  width?: string;
  rounded?: boolean;
}

const skeletonVariants = {
  pulse: {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  },
  shimmer: {
    animate: {
      backgroundPosition: ['-200% 0', '200% 0'],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  }
};

export function EnhancedSkeleton({ 
  type = 'text', 
  lines = 1, 
  className = '', 
  height, 
  width, 
  rounded = true 
}: SkeletonProps) {
  const baseClasses = `bg-gray-200 dark:bg-gray-700 ${rounded ? 'rounded' : ''} ${className}`;
  
  const renderSkeleton = () => {
    switch (type) {
      case 'title':
        return (
          <motion.div
            variants={skeletonVariants}
            animate="animate"
            className={`${baseClasses} h-8 w-3/4`}
            style={{
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%'
            }}
          />
        );
      
      case 'avatar':
        return (
          <motion.div
            variants={skeletonVariants}
            animate="animate"
            className={`${baseClasses} w-12 h-12 rounded-full`}
            style={{
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%'
            }}
          />
        );
      
      case 'card':
        return (
          <motion.div
            variants={skeletonVariants}
            animate="animate"
            className={`${baseClasses} p-4 space-y-3`}
            style={{
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%'
            }}
          >
            <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-3 w-2/3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </motion.div>
        );
      
      case 'table':
        return (
          <div className="space-y-3">
            {Array.from({ length: lines }).map((_, i) => (
              <motion.div
                key={i}
                variants={skeletonVariants}
                animate="animate"
                className={`${baseClasses} h-12 w-full`}
                style={{
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%'
                }}
              />
            ))}
          </div>
        );
      
      case 'chart':
        return (
          <motion.div
            variants={skeletonVariants}
            animate="animate"
            className={`${baseClasses} w-full h-64`}
            style={{
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%'
            }}
          />
        );
      
      default: // text
        return (
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <motion.div
                key={i}
                variants={skeletonVariants}
                animate="animate"
                className={`${baseClasses} h-4`}
                style={{
                  width: i === lines - 1 ? '60%' : '100%',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%'
                }}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div 
      className={baseClasses}
      style={{ 
        height: height || undefined, 
        width: width || undefined 
      }}
    >
      {renderSkeleton()}
    </div>
  );
}

// Specialized skeleton components
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}
    >
      <div className="space-y-4">
        <EnhancedSkeleton type="title" />
        <EnhancedSkeleton type="text" lines={3} />
        <div className="flex space-x-2">
          <EnhancedSkeleton type="avatar" />
          <div className="flex-1 space-y-2">
            <EnhancedSkeleton type="text" lines={2} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TableSkeleton({ rows = 5, className = '' }: { rows?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}
    >
      <EnhancedSkeleton type="title" className="mb-6" />
      <EnhancedSkeleton type="table" lines={rows} />
    </motion.div>
  );
}

export function ChartSkeleton({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}
    >
      <EnhancedSkeleton type="title" className="mb-6" />
      <EnhancedSkeleton type="chart" />
    </motion.div>
  );
}
