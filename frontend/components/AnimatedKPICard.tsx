import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AnimatedKPICardProps {
  title: string;
  value: number;
  previousValue?: number;
  prefix?: string;
  suffix?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  bgColor?: string;
  sparklineData?: number[];
  delay?: number;
}

export function AnimatedKPICard({
  title,
  value,
  previousValue,
  prefix = '',
  suffix = '',
  icon: Icon,
  color = 'text-blue-600',
  bgColor = 'bg-blue-100',
  sparklineData = [],
  delay = 0,
}: AnimatedKPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const springValue = useSpring(0, { stiffness: 100, damping: 30 });

  // Calculate percentage change
  const percentageChange = previousValue 
    ? ((value - previousValue) / previousValue) * 100 
    : 0;
  
  const isPositive = percentageChange >= 0;

  // Animate value on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      springValue.set(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, springValue, delay]);

  // Update display value based on spring animation
  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(latest);
    });

    return unsubscribe;
  }, [springValue]);

  // Format display value
  const formatValue = (val: number) => {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M';
    } else if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'K';
    }
    return Math.round(val).toString();
  };

  // Generate sparkline path
  const generateSparklinePath = (data: number[]) => {
    if (data.length < 2) return '';
    
    const width = 100;
    const height = 30;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((point - min) / range) * height;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <div className={`w-full h-full ${bgColor} rounded-full transform translate-x-8 -translate-y-8`} />
        </div>
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <motion.div 
            className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Icon className={`w-4 h-4 ${color}`} />
          </motion.div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Main value */}
          <motion.div 
            className="text-2xl font-bold text-gray-900"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
          >
            {prefix}{formatValue(displayValue)}{suffix}
          </motion.div>
          
          {/* Percentage change */}
          {previousValue !== undefined && (
            <motion.div 
              className="flex items-center gap-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.4 }}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(percentageChange).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500">vs last period</span>
            </motion.div>
          )}
          
          {/* Sparkline */}
          {sparklineData.length > 1 && (
            <motion.div 
              className="h-8 w-full"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: delay + 0.6, duration: 0.8 }}
            >
              <svg width="100%" height="100%" viewBox="0 0 100 30" className="overflow-visible">
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color.replace('text-', '').replace('-600', '')} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color.replace('text-', '').replace('-600', '')} stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Area under curve */}
                <motion.path
                  d={`${generateSparklinePath(sparklineData)} L 100,30 L 0,30 Z`}
                  fill={`url(#gradient-${title})`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: delay + 0.8, duration: 1 }}
                />
                
                {/* Line */}
                <motion.path
                  d={generateSparklinePath(sparklineData)}
                  stroke={color.includes('blue') ? '#3b82f6' : color.includes('green') ? '#10b981' : '#6366f1'}
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: delay + 0.8, duration: 1 }}
                />
                
                {/* Data points */}
                {sparklineData.map((point, index) => {
                  const max = Math.max(...sparklineData);
                  const min = Math.min(...sparklineData);
                  const range = max - min || 1;
                  const x = (index / (sparklineData.length - 1)) * 100;
                  const y = 30 - ((point - min) / range) * 30;
                  
                  return (
                    <motion.circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="2"
                      fill={color.includes('blue') ? '#3b82f6' : color.includes('green') ? '#10b981' : '#6366f1'}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: delay + 1 + index * 0.1 }}
                    />
                  );
                })}
              </svg>
            </motion.div>
          )}
        </CardContent>
        
        {/* Hover effect overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0"
          whileHover={{ 
            opacity: 1,
            x: ['-100%', '100%'],
            transition: { duration: 0.6 }
          }}
        />
      </Card>
    </motion.div>
  );
}
