import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Award, Zap, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  startValue?: number;
  duration?: number;
  delay?: number;
  className?: string;
  variant?: 'default' | 'highlight' | 'gradient' | 'outline' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  showLabel?: boolean;
  label?: string;
  showPrefix?: boolean;
  prefix?: string;
  showSuffix?: boolean;
  suffix?: string;
  formatValue?: (value: number) => string;
  onComplete?: () => void;
  autoStart?: boolean;
  loop?: boolean;
  loopDelay?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  startValue = 0,
  duration = 2,
  delay = 0,
  className,
  variant = 'default',
  size = 'md',
  showIcon = false,
  icon,
  iconPosition = 'left',
  showLabel = false,
  label,
  showPrefix = false,
  prefix = '',
  showSuffix = false,
  suffix = '',
  formatValue,
  onComplete,
  autoStart = true,
  loop = false,
  loopDelay = 3,
}) => {
  const [displayValue, setDisplayValue] = useState(startValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  
  const motionValue = useMotionValue(startValue);
  const roundedValue = useTransform(motionValue, (latest) => Math.round(latest));

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  };

  const iconSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const variantClasses = {
    default: "text-gray-900 dark:text-white",
    highlight: "text-blue-600 dark:text-blue-400",
    gradient: "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
    outline: "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 border-2 border-blue-600 rounded-lg px-4 py-2",
    minimal: "text-gray-600 dark:text-gray-400",
  };

  const iconVariants = {
    left: "flex-row",
    right: "flex-row-reverse",
    top: "flex-col",
    bottom: "flex-col-reverse",
  };

  // Get default icon based on value trend
  const getDefaultIcon = () => {
    if (value > startValue) {
      return <TrendingUp className={iconSizeClasses[size]} />;
    } else if (value < startValue) {
      return <TrendingDown className={iconSizeClasses[size]} />;
    } else {
      return <Target className={iconSizeClasses[size]} />;
    }
  };

  // Format the display value
  const formatDisplayValue = (val: number) => {
    if (formatValue) {
      return formatValue(val);
    }
    
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M';
    } else if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'K';
    }
    
    return val.toString();
  };

  // Start animation
  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    const controls = animate(motionValue, value, {
      duration,
      delay,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplayValue(latest);
      },
      onComplete: () => {
        setIsAnimating(false);
        onComplete?.();
        
        if (loop) {
          setTimeout(() => {
            setLoopCount(prev => prev + 1);
            motionValue.set(startValue);
            startAnimation();
          }, loopDelay * 1000);
        }
      },
    });

    return controls;
  };

  // Auto-start animation when component mounts
  useEffect(() => {
    if (autoStart) {
      const timer = setTimeout(() => {
        startAnimation();
      }, delay * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [autoStart, delay]);

  // Restart animation when value changes
  useEffect(() => {
    if (autoStart && !isAnimating) {
      motionValue.set(startValue);
      startAnimation();
    }
  }, [value, startValue]);

  // Handle loop count changes
  useEffect(() => {
    if (loop && loopCount > 0) {
      startAnimation();
    }
  }, [loopCount]);

  // Intersection Observer for auto-start on scroll
  useEffect(() => {
    if (!autoStart || !countRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isAnimating) {
            startAnimation();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(countRef.current);

    return () => observer.unobserve(countRef.current!);
  }, [autoStart, isAnimating]);

  const displayIcon = icon || getDefaultIcon();

  return (
    <div
      ref={countRef}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <motion.div
        className={cn(
          "flex items-center justify-center",
          iconVariants[iconPosition],
          iconPosition === 'left' || iconPosition === 'right' ? 'space-x-3' : 'space-y-2'
        )}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Icon */}
        {showIcon && (
          <motion.div
            className={cn(
              "flex-shrink-0",
              iconPosition === 'left' || iconPosition === 'right' ? 'order-first' : 'order-first'
            )}
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            {displayIcon}
          </motion.div>
        )}

        {/* Counter Value */}
        <div className="text-center">
          <motion.div
            className={cn(
              "font-bold tracking-tight",
              sizeClasses[size],
              variantClasses[variant]
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {showPrefix && prefix}
            <motion.span
              key={`${value}-${loopCount}`}
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {formatDisplayValue(displayValue)}
            </motion.span>
            {showSuffix && suffix}
          </motion.div>

          {/* Label */}
          {showLabel && label && (
            <motion.div
              className="text-sm text-gray-600 dark:text-gray-400 mt-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {label}
            </motion.div>
          )}
        </div>

        {/* Icon on right/bottom */}
        {showIcon && (iconPosition === 'right' || iconPosition === 'bottom') && (
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, rotate: 180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            {displayIcon}
          </motion.div>
        )}
      </motion.div>

      {/* Animation indicator */}
      {isAnimating && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-full h-full bg-blue-500 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedCounter;
