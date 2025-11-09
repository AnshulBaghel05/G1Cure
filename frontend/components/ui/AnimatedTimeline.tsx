import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, User, Calendar, ArrowRight, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  user?: string;
  status: 'completed' | 'pending' | 'in-progress' | 'cancelled' | 'info';
  icon?: React.ReactNode;
  color?: string;
  tags?: string[];
}

interface AnimatedTimelineProps {
  items: TimelineItem[];
  className?: string;
  variant?: 'default' | 'vertical' | 'horizontal' | 'cards' | 'minimal';
  showConnectors?: boolean;
  showDates?: boolean;
  showStatus?: boolean;
  showIcons?: boolean;
  showTags?: boolean;
  onItemClick?: (item: TimelineItem) => void;
  maxItems?: number;
  collapsible?: boolean;
}

const AnimatedTimeline: React.FC<AnimatedTimelineProps> = ({
  items,
  className,
  variant = 'default',
  showConnectors = true,
  showDates = true,
  showStatus = true,
  showIcons = true,
  showTags = true,
  onItemClick,
  maxItems,
  collapsible = false,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);

  const displayedItems = maxItems ? items.slice(0, maxItems) : items;

  // Get status icon and color
  const getStatusConfig = (status: string) => {
    const configs = {
      completed: {
        icon: <CheckCircle className="w-5 h-5" />,
        color: 'text-green-500',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        borderColor: 'border-green-500',
      },
      pending: {
        icon: <Clock className="w-5 h-5" />,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        borderColor: 'border-yellow-500',
      },
      'in-progress': {
        icon: <ArrowRight className="w-5 h-5" />,
        color: 'text-blue-500',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        borderColor: 'border-blue-500',
      },
      cancelled: {
        icon: <AlertCircle className="w-5 h-5" />,
        color: 'text-red-500',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        borderColor: 'border-red-500',
      },
      info: {
        icon: <Info className="w-5 h-5" />,
        color: 'text-gray-500',
        bgColor: 'bg-gray-100 dark:bg-gray-900/30',
        borderColor: 'border-gray-500',
      },
    };
    return configs[status as keyof typeof configs] || configs.info;
  };

  // Toggle item expansion
  const toggleItem = (itemId: string) => {
    if (collapsible) {
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
        return newSet;
      });
    }
  };

  // Default vertical timeline
  if (variant === 'default' || variant === 'vertical') {
    return (
      <div className={cn("w-full", className)}>
        {collapsible && (
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{isCollapsed ? 'Expand' : 'Collapse'}</span>
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.button>
        )}

        <div className="relative">
          {showConnectors && (
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
          )}
          
          <div className="space-y-6">
            {displayedItems.map((item, index) => {
              const statusConfig = getStatusConfig(item.status);
              const isExpanded = expandedItems.has(item.id);
              const hasDescription = item.description && item.description.length > 100;

              return (
                <motion.div
                  key={item.id}
                  className="relative flex items-start space-x-4"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                >
                  {/* Icon/Status */}
                  <div className="flex-shrink-0">
                    <motion.div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                        statusConfig.bgColor,
                        statusConfig.borderColor,
                        onItemClick && "cursor-pointer hover:scale-110"
                      )}
                      whileHover={onItemClick ? { scale: 1.1 } : {}}
                      whileTap={onItemClick ? { scale: 0.9 } : {}}
                      onClick={() => onItemClick?.(item)}
                    >
                      {showIcons && (item.icon || statusConfig.icon)}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200"
                      whileHover={{ y: -2, scale: 1.01 }}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        {showStatus && (
                          <span className={cn(
                            "px-2 py-1 text-xs font-medium rounded-full",
                            statusConfig.bgColor,
                            statusConfig.color
                          )}>
                            {item.status.replace('-', ' ')}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {item.description && (
                        <div className="mb-3">
                          <p className={cn(
                            "text-gray-600 dark:text-gray-300",
                            collapsible && hasDescription && !isExpanded && "line-clamp-2"
                          )}>
                            {item.description}
                          </p>
                          {collapsible && hasDescription && (
                            <button
                              onClick={() => toggleItem(item.id)}
                              className="text-blue-500 hover:text-blue-600 text-sm font-medium mt-1"
                            >
                              {isExpanded ? 'Show less' : 'Show more'}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        {showDates && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{item.date}</span>
                          </div>
                        )}
                        
                        {item.time && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{item.time}</span>
                          </div>
                        )}
                        
                        {item.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{item.location}</span>
                          </div>
                        )}
                        
                        {item.user && (
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{item.user}</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {showTags && item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.tags.map((tag, tagIndex) => (
                            <motion.span
                              key={tagIndex}
                              className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: (index * 0.1) + (tagIndex * 0.05), duration: 0.3 }}
                            >
                              {tag}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Horizontal timeline
  if (variant === 'horizontal') {
    return (
      <div className={cn("w-full overflow-x-auto", className)}>
        <div className="flex space-x-6 min-w-max pb-4">
          {displayedItems.map((item, index) => {
            const statusConfig = getStatusConfig(item.status);

            return (
              <motion.div
                key={item.id}
                className="flex-shrink-0 w-80"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onItemClick?.(item)}
                >
                  {/* Icon */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      statusConfig.bgColor,
                      statusConfig.color
                    )}>
                      {showIcons && (item.icon || statusConfig.icon)}
                    </div>
                    {showStatus && (
                      <span className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        statusConfig.bgColor,
                        statusConfig.color
                      )}>
                        {item.status.replace('-', ' ')}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  
                  {item.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                      {item.description}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    {showDates && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{item.date}</span>
                      </div>
                    )}
                    
                    {item.time && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{item.time}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {showTags && item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Cards timeline
  if (variant === 'cards') {
    return (
      <div className={cn("w-full", className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item, index) => {
            const statusConfig = getStatusConfig(item.status);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-200 cursor-pointer h-full"
                  whileHover={{ y: -8, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onItemClick?.(item)}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      statusConfig.bgColor,
                      statusConfig.color
                    )}>
                      {showIcons && (item.icon || statusConfig.icon)}
                    </div>
                    {showStatus && (
                      <span className={cn(
                        "px-3 py-1 text-sm font-medium rounded-full",
                        statusConfig.bgColor,
                        statusConfig.color
                      )}>
                        {item.status.replace('-', ' ')}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  
                  {item.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-4">
                      {item.description}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {showDates && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{item.date}</span>
                      </div>
                    )}
                    
                    {item.time && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{item.time}</span>
                      </div>
                    )}
                    
                    {item.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {showTags && item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Minimal timeline
  if (variant === 'minimal') {
    return (
      <div className={cn("w-full", className)}>
        <div className="space-y-3">
          {displayedItems.map((item, index) => {
            const statusConfig = getStatusConfig(item.status);

            return (
              <motion.div
                key={item.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.05, 
                  duration: 0.3,
                  ease: "easeOut"
                }}
                whileHover={{ x: 5 }}
                onClick={() => onItemClick?.(item)}
              >
                {/* Icon */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  statusConfig.bgColor,
                  statusConfig.color
                )}>
                  {showIcons && (item.icon || statusConfig.icon)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.title}
                  </h3>
                  {showDates && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.date}
                    </p>
                  )}
                </div>

                {/* Status */}
                {showStatus && (
                  <div className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    statusConfig.bgColor.replace('bg-', 'bg-').replace('/30', '')
                  )} />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default AnimatedTimeline;
