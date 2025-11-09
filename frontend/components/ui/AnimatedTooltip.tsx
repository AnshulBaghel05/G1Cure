import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedTooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  maxWidth?: number;
  showArrow?: boolean;
}

const AnimatedTooltip: React.FC<AnimatedTooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 0.5,
  className,
  maxWidth = 200,
  showArrow = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => setIsVisible(false), 100);
    setTimeoutId(id);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900 dark:border-t-gray-700',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900 dark:border-b-gray-700',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900 dark:border-l-gray-700',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900 dark:border-r-gray-700',
  };

  const arrowStyles = {
    top: { borderTop: '4px solid' },
    bottom: { borderBottom: '4px solid' },
    left: { borderLeft: '4px solid' },
    right: { borderRight: '4px solid' },
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={cn(
              "absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg",
              "max-w-xs break-words",
              positionClasses[position],
              className
            )}
            style={{ maxWidth }}
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              ...(position === 'top' && { y: 10 }),
              ...(position === 'bottom' && { y: -10 }),
              ...(position === 'left' && { x: 10 }),
              ...(position === 'right' && { x: -10 }),
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0,
              x: 0,
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8,
              ...(position === 'top' && { y: 10 }),
              ...(position === 'bottom' && { y: -10 }),
              ...(position === 'left' && { x: 10 }),
              ...(position === 'right' && { x: -10 }),
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.2
            }}
          >
            {content}
            
            {showArrow && (
              <motion.div
                className={cn(
                  "absolute w-0 h-0",
                  arrowClasses[position]
                )}
                style={arrowStyles[position]}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedTooltip;
