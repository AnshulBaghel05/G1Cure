import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ThumbsUp, Award, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedRatingProps {
  value: number;
  maxValue?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'star' | 'heart' | 'thumbs' | 'award' | 'zap';
  showValue?: boolean;
  showLabel?: boolean;
  label?: string;
  className?: string;
  color?: string;
  allowHalf?: boolean;
  showTooltip?: boolean;
  tooltipText?: string[];
}

const AnimatedRating: React.FC<AnimatedRatingProps> = ({
  value,
  maxValue = 5,
  onChange,
  readOnly = false,
  size = 'md',
  variant = 'star',
  showValue = false,
  showLabel = false,
  label,
  className,
  color,
  allowHalf = false,
  showTooltip = false,
  tooltipText = [],
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  // Get icon based on variant
  const getIcon = () => {
    switch (variant) {
      case 'star':
        return Star;
      case 'heart':
        return Heart;
      case 'thumbs':
        return ThumbsUp;
      case 'award':
        return Award;
      case 'zap':
        return Zap;
      default:
        return Star;
    }
  };

  // Get color based on variant
  const getVariantColor = () => {
    if (color) return color;
    
    switch (variant) {
      case 'star':
        return 'text-yellow-400';
      case 'heart':
        return 'text-red-400';
      case 'thumbs':
        return 'text-green-400';
      case 'award':
        return 'text-purple-400';
      case 'zap':
        return 'text-blue-400';
      default:
        return 'text-yellow-400';
    }
  };

  // Get hover color
  const getHoverColor = () => {
    if (color) return color;
    
    switch (variant) {
      case 'star':
        return 'text-yellow-500';
      case 'heart':
        return 'text-red-500';
      case 'thumbs':
        return 'text-green-500';
      case 'award':
        return 'text-purple-500';
      case 'zap':
        return 'text-blue-500';
      default:
        return 'text-yellow-500';
    }
  };

  // Get empty color
  const getEmptyColor = () => {
    return 'text-gray-300 dark:text-gray-600';
  };

  // Handle click
  const handleClick = (clickValue: number) => {
    if (!readOnly && onChange) {
      onChange(clickValue);
    }
  };

  // Handle hover
  const handleHover = (hoverValue: number | null) => {
    if (!readOnly) {
      setHoverValue(hoverValue);
      setIsHovering(hoverValue !== null);
    }
  };

  // Get display value (either hover value or actual value)
  const displayValue = hoverValue !== null ? hoverValue : value;

  // Get tooltip text
  const getTooltipText = (index: number) => {
    if (tooltipText && tooltipText[index]) {
      return tooltipText[index];
    }
    
    const defaultTexts = {
      star: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'],
      heart: ['Hate it', 'Don\'t like it', 'It\'s okay', 'Like it', 'Love it'],
      thumbs: ['Very Bad', 'Bad', 'Okay', 'Good', 'Very Good'],
      award: ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'],
      zap: ['Very Slow', 'Slow', 'Normal', 'Fast', 'Very Fast'],
    };
    
    return defaultTexts[variant as keyof typeof defaultTexts]?.[index] || `${index + 1}`;
  };

  const IconComponent = getIcon();

  return (
    <div className={cn("inline-flex items-center space-x-2", className)}>
      {/* Rating Icons */}
      <div className="flex items-center space-x-1">
        {Array.from({ length: maxValue }, (_, index) => {
          const iconValue = index + 1;
          const isFilled = iconValue <= displayValue;
          const isHalf = allowHalf && iconValue - 0.5 <= displayValue && iconValue > displayValue;
          const isActive = isFilled || isHalf;

          return (
            <motion.div
              key={index}
              className="relative cursor-pointer"
              onClick={() => handleClick(iconValue)}
              onMouseEnter={() => handleHover(iconValue)}
              onMouseLeave={() => handleHover(null)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              {/* Empty Icon */}
              <IconComponent
                className={cn(
                  sizeClasses[size],
                  getEmptyColor(),
                  "transition-colors duration-200"
                )}
              />
              
              {/* Filled Icon */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconComponent
                      className={cn(
                        sizeClasses[size],
                        isHovering ? getHoverColor() : getVariantColor(),
                        "transition-colors duration-200"
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Half Icon (if applicable) */}
              {allowHalf && isHalf && !isFilled && (
                <motion.div
                  className="absolute inset-0 overflow-hidden"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative">
                    <IconComponent
                      className={cn(
                        sizeClasses[size],
                        getEmptyColor(),
                        "absolute inset-0"
                      )}
                    />
                    <div className="absolute inset-0 overflow-hidden">
                      <IconComponent
                        className={cn(
                          sizeClasses[size],
                          isHovering ? getHoverColor() : getVariantColor(),
                          "transform -translate-x-1/2"
                        )}
                        style={{ width: '50%' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tooltip */}
              {showTooltip && (
                <AnimatePresence>
                  {isHovering && hoverValue === iconValue && (
                    <motion.div
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10"
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {getTooltipText(index)}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900" />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Value Display */}
      {showValue && (
        <motion.span
          className={cn(
            "font-medium text-gray-700 dark:text-gray-300",
            textSizes[size]
          )}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {value.toFixed(allowHalf ? 1 : 0)}/{maxValue}
        </motion.span>
      )}

      {/* Label */}
      {showLabel && label && (
        <motion.span
          className={cn(
            "text-gray-600 dark:text-gray-400",
            textSizes[size]
          )}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          {label}
        </motion.span>
      )}
    </div>
  );
};

export default AnimatedRating;
