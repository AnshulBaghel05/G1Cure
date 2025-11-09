import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Circle } from 'lucide-react';

interface TimelineItem {
  title: string;
  description?: string;
  date?: string;
  status?: 'completed' | 'current' | 'pending';
  icon?: React.ReactNode;
}

interface SimpleTimelineProps {
  items: TimelineItem[];
  className?: string;
  variant?: 'default' | 'compact';
}

const SimpleTimeline: React.FC<SimpleTimelineProps> = ({
  items,
  className,
  variant = 'default',
}) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-500';
      case 'current':
        return 'bg-blue-500 border-blue-500';
      default:
        return 'bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-600';
    }
  };

  const getStatusIcon = (item: TimelineItem) => {
    if (item.icon) return item.icon;
    if (item.status === 'completed') {
      return <Check className="w-3 h-3 text-white" />;
    }
    return null;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, index) => (
        <div key={index} className="flex gap-4">
          {/* Timeline line and icon */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                'transition-all duration-200',
                getStatusColor(item.status),
                item.status === 'current' && 'ring-4 ring-blue-100 dark:ring-blue-900'
              )}
            >
              {getStatusIcon(item)}
            </div>
            {index < items.length - 1 && (
              <div
                className={cn(
                  'w-0.5 flex-1 min-h-8',
                  item.status === 'completed'
                    ? 'bg-green-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                )}
              />
            )}
          </div>

          {/* Content */}
          <div className={cn('flex-1', variant === 'compact' ? 'pb-2' : 'pb-6')}>
            <div className="flex items-start justify-between">
              <div>
                <h4 className={cn(
                  'font-medium text-gray-900 dark:text-white',
                  item.status === 'current' && 'text-blue-600 dark:text-blue-400'
                )}>
                  {item.title}
                </h4>
                {item.description && variant === 'default' && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                )}
              </div>
              {item.date && (
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                  {item.date}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SimpleTimeline;
