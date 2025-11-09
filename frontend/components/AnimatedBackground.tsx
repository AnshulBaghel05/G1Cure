import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'dots' | 'waves' | 'geometric' | 'particles';
  className?: string;
}

export function AnimatedBackground({ variant = 'dots', className = '' }: AnimatedBackgroundProps) {
  const renderDots = () => (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );

  const renderWaves = () => (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800">
        <defs>
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {[...Array(3)].map((_, i) => (
          <motion.path
            key={i}
            d={`M0,${400 + i * 50} Q300,${350 + i * 30} 600,${400 + i * 50} T1200,${400 + i * 50} V800 H0 Z`}
            fill="url(#wave-gradient)"
            animate={{
              d: [
                `M0,${400 + i * 50} Q300,${350 + i * 30} 600,${400 + i * 50} T1200,${400 + i * 50} V800 H0 Z`,
                `M0,${420 + i * 50} Q300,${370 + i * 30} 600,${380 + i * 50} T1200,${420 + i * 50} V800 H0 Z`,
                `M0,${400 + i * 50} Q300,${350 + i * 30} 600,${400 + i * 50} T1200,${400 + i * 50} V800 H0 Z`,
              ],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );

  const renderGeometric = () => (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute border border-blue-200/30"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );

  const renderParticles = () => (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );

  const variants = {
    dots: renderDots,
    waves: renderWaves,
    geometric: renderGeometric,
    particles: renderParticles,
  };

  return variants[variant]();
}
