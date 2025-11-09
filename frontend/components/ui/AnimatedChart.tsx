import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface AnimatedChartProps {
  data: ChartData[];
  type: 'bar' | 'line' | 'pie';
  className?: string;
  title?: string;
  width?: number;
  height?: number;
  onDataPointClick?: (data: ChartData, index: number) => void;
}

const AnimatedChart: React.FC<AnimatedChartProps> = ({
  data,
  type,
  className,
  title,
  width = 400,
  height = 300,
  onDataPointClick,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const maxValue = Math.max(...data.map(d => d.value));
  const getColor = (index: number) => colors[index % colors.length];

  // Bar Chart
  if (type === 'bar') {
    const barWidth = width / data.length;
    const barSpacing = barWidth * 0.1;
    const actualBarWidth = barWidth - barSpacing;

    return (
      <div className={cn("w-full", className)}>
        {title && (
          <motion.h3
            className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h3>
        )}
        
        <div className="relative" style={{ width, height }}>
          <div className="flex items-end justify-between h-full space-x-2">
            {data.map((item, index) => {
              const barHeight = (item.value / maxValue) * height;
              
              return (
                <motion.div
                  key={index}
                  className="flex-1 bg-blue-500 rounded-t cursor-pointer hover:bg-blue-600 transition-colors duration-200"
                  style={{
                    height: barHeight,
                    backgroundColor: getColor(index),
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: barHeight }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => onDataPointClick?.(item, index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-center text-white text-xs mt-1">
                    {item.value}
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2">
            {data.map((item, index) => (
              <motion.span
                key={index}
                className="text-xs text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
              >
                {item.label}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Line Chart
  if (type === 'line') {
    const points = data.map((item, index) => ({
      x: (index / (data.length - 1)) * width,
      y: height - (item.value / maxValue) * height,
      label: item.label,
      value: item.value,
    }));

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
      <div className={cn("w-full", className)}>
        {title && (
          <motion.h3
            className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h3>
        )}
        
        <div className="relative" style={{ width, height }}>
          <svg width={width} height={height} className="overflow-visible">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(156, 163, 175, 0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Line path */}
            <motion.path
              d={pathData}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="drop-shadow-sm"
            />
            
            {/* Data points */}
            {points.map((point, index) => (
              <motion.circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#3B82F6"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onDataPointClick?.(data[index], index)}
                className="cursor-pointer hover:r-6 transition-all duration-200"
              />
            ))}
            
            {/* Hover tooltip */}
            {hoveredIndex !== null && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <rect
                  x={points[hoveredIndex].x - 30}
                  y={points[hoveredIndex].y - 40}
                  width="60"
                  height="30"
                  fill="rgba(0, 0, 0, 0.8)"
                  rx="4"
                />
                <text
                  x={points[hoveredIndex].x}
                  y={points[hoveredIndex].y - 25}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                >
                  {data[hoveredIndex].value}
                </text>
              </motion.g>
            )}
          </svg>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2">
            {data.map((item, index) => (
              <motion.span
                key={index}
                className="text-xs text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
              >
                {item.label}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Pie Chart
  if (type === 'pie') {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <div className={cn("w-full", className)}>
        {title && (
          <motion.h3
            className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h3>
        )}
        
        <div className="relative" style={{ width, height }}>
          <div className="flex items-center justify-center">
            <svg width={Math.min(width, height)} height={Math.min(width, height)} viewBox="-100 -100 200 200">
              {data.map((item, index) => {
                const angle = (item.value / total) * 360;
                const startAngle = currentAngle;
                currentAngle += angle;

                const x1 = Math.cos((startAngle * Math.PI) / 180);
                const y1 = Math.sin((startAngle * Math.PI) / 180);
                const x2 = Math.cos((currentAngle * Math.PI) / 180);
                const y2 = Math.sin((currentAngle * Math.PI) / 180);

                const largeArcFlag = angle > 180 ? 1 : 0;

                const pathData = [
                  `M 0 0`,
                  `L ${x1 * 80} ${y1 * 80}`,
                  `A 80 80 0 ${largeArcFlag} 1 ${x2 * 80} ${y2 * 80}`,
                  'Z',
                ].join(' ');

                return (
                  <motion.path
                    key={index}
                    d={pathData}
                    fill={getColor(index)}
                    initial={{ scale: 0, rotate: startAngle }}
                    animate={{ scale: 1, rotate: startAngle }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => onDataPointClick?.(item, index)}
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      filter: hoveredIndex === index ? 'brightness(1.1)' : 'brightness(1)',
                    }}
                  />
                );
              })}
            </svg>
          </div>
          
          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {data.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.6, duration: 0.3 }}
              >
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: getColor(index) }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {item.label}: {((item.value / total) * 100).toFixed(1)}%
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full p-4 text-center text-gray-500", className)}>
      <p>Unsupported chart type: {type}</p>
    </div>
  );
};

export default AnimatedChart;
