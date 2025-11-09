import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleSkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}

const SimpleSkeleton: React.FC<SimpleSkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
}) => {
  const variantClasses = {
    text: 'h-4',
    rectangular: 'h-32',
    circular: 'rounded-full w-12 h-12',
  };

  const style = {
    width: width,
    height: variant !== 'text' && variant !== 'circular' ? height : undefined,
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
        variantClasses[variant],
        className
      )}
      style={style}
    />
  );
};

export default SimpleSkeleton;
