import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface SVGMorphButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function SVGMorphButton({
  children,
  onClick,
  variant = 'default',
  size = 'default',
  className = '',
  disabled = false,
}: SVGMorphButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // SVG path for the morphing effect
  const defaultPath = "M0,0 L100,0 L100,40 L0,40 Z";
  const hoveredPath = "M0,5 L95,0 L100,35 L5,40 Z";

  return (
    <Button
      variant={variant}
      size={size}
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background morphing shape */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={false}
        animate={{
          background: isHovered 
            ? 'linear-gradient(45deg, #3b82f6, #8b5cf6)' 
            : 'linear-gradient(0deg, #3b82f6, #3b82f6)'
        }}
        transition={{ duration: 0.3 }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 40"
          className="absolute inset-0"
          preserveAspectRatio="none"
        >
          <motion.path
            d={defaultPath}
            animate={{ d: isHovered ? hoveredPath : defaultPath }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            fill="currentColor"
            className="text-white/20"
          />
        </svg>
      </motion.div>

      {/* Content with micro-interactions */}
      <motion.div
        className="relative z-10 flex items-center gap-2"
        animate={{
          x: isHovered ? 2 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 0.6 }}
      />

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 bg-white/30 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 4, opacity: [0, 1, 0] }}
        transition={{ duration: 0.4 }}
      />
    </Button>
  );
}
