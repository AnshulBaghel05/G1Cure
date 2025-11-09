import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  delay?: number;
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'none';
  entranceAnimation?: 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'fadeIn' | 'none';
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  onClick,
  hoverable = true,
  variant = 'default',
  delay = 0,
  hoverEffect = 'lift',
  entranceAnimation = 'slideUp',
}) => {
  const baseClasses = "rounded-xl transition-all duration-300 cursor-pointer";
  
  const variants = {
    default: "bg-white dark:bg-gray-800 shadow-md hover:shadow-lg",
    elevated: "bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl",
    outlined: "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600",
    gradient: "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl",
  };

  const hoverEffects = {
    lift: { y: -4, scale: 1.02 },
    glow: { scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" },
    scale: { scale: 1.05 },
    none: {}
  };

  const entranceAnimations = {
    slideUp: { opacity: 0, y: 20 },
    slideDown: { opacity: 0, y: -20 },
    slideLeft: { opacity: 0, x: 20 },
    slideRight: { opacity: 0, x: -20 },
    fadeIn: { opacity: 0 },
    none: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className={cn(
        baseClasses,
        variants[variant],
        className
      )}
      onClick={onClick}
      initial={entranceAnimations[entranceAnimation]}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: delay * 0.1,
        ease: "easeOut"
      }}
      whileHover={hoverable ? hoverEffects[hoverEffect] : {}}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
