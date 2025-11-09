import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
  variant?: 'default' | 'pills' | 'underline' | 'cards';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onChange?: (tabId: string) => void;
}

const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
  tabs,
  defaultTab,
  className,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    if (!tabs.find(tab => tab.id === tabId)?.disabled) {
      setActiveTab(tabId);
      onChange?.(tabId);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    default: {
      container: "border-b border-gray-200 dark:border-gray-700",
      tab: "border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600",
      active: "border-blue-500 text-blue-600 dark:text-blue-400",
    },
    pills: {
      container: "space-x-1",
      tab: "rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800",
      active: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    underline: {
      container: "border-b border-gray-200 dark:border-gray-700",
      tab: "border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600",
      active: "border-blue-500 text-blue-600 dark:text-blue-400",
    },
    cards: {
      container: "space-x-2",
      tab: "rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
      active: "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    },
  };

  const currentVariant = variantClasses[variant];

  return (
    <div className={cn("w-full", className)}>
      {/* Tab Navigation */}
      <div className={cn(
        "flex",
        fullWidth ? "w-full" : "w-fit",
        variant === 'pills' ? "flex-wrap gap-2" : "",
        currentVariant.container
      )}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isDisabled = tab.disabled;

          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              disabled={isDisabled}
              className={cn(
                "flex items-center space-x-2 font-medium transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                sizeClasses[size],
                currentVariant.tab,
                isActive && currentVariant.active,
                !isActive && "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300",
                fullWidth && "flex-1 justify-center",
                !isDisabled && "cursor-pointer"
              )}
              whileHover={!isDisabled ? { scale: 1.02, y: -1 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              {tab.icon && (
                <motion.div
                  className="flex-shrink-0"
                  animate={{ rotate: isActive ? 360 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {tab.icon}
                </motion.div>
              )}
              
              <span>{tab.label}</span>
              
              {tab.badge && (
                <motion.span
                  className={cn(
                    "inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full",
                    isActive 
                      ? "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                  )}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {tab.badge}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {tabs.map(tab => {
            if (tab.id === activeTab) {
              return (
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.3
                  }}
                  className="w-full"
                >
                  {tab.content}
                </motion.div>
              );
            }
            return null;
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnimatedTabs;
