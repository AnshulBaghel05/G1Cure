import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedIconProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'pulse' | 'bounce' | 'spin' | 'rotate' | 'float' | 'shake' | 'none';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  onClick?: () => void;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  children,
  className,
  animation = 'none',
  size = 'md',
  color,
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-16 h-16',
  };

  const animations = {
    pulse: {
      animate: { scale: [1, 1.1, 1] },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    bounce: {
      animate: { y: [0, -10, 0] },
      transition: { duration: 1, repeat: Infinity, ease: "easeInOut" }
    },
    spin: {
      animate: { rotate: 360 },
      transition: { duration: 3, repeat: Infinity, ease: "linear" }
    },
    rotate: {
      animate: { rotate: 360 },
      transition: { duration: 3, repeat: Infinity, ease: "linear" }
    },
    float: {
      animate: { y: [0, -5, 0] },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    shake: {
      animate: { x: [0, -5, 5, -5, 0] },
      transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
    },
    none: {}
  };

  const selectedAnimation = animations[animation];

  return (
    <motion.div
      className={cn(
        sizeClasses[size],
        "flex items-center justify-center",
        onClick && "cursor-pointer",
        className
      )}
      style={color ? { color } : undefined}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      {...selectedAnimation}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedIcon;
