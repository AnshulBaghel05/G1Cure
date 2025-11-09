import React from 'react';
import { cn } from '@/lib/utils';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  data: DataPoint[];
  type?: 'bar' | 'line' | 'pie';
  className?: string;
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
}

const SimpleChart: React.FC<SimpleChartProps> = ({
  data,
  type = 'bar',
  className,
  height = 200,
  showLabels = true,
  showValues = true,
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-cyan-500',
  ];

  if (type === 'bar') {
    return (
      <div className={cn('w-full', className)}>
        <div className="flex items-end justify-around gap-2" style={{ height }}>
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * 100;
            const color = item.color || colors[index % colors.length];

            return (
              <div key={index} className="flex flex-col items-center flex-1 max-w-20">
                {showValues && (
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {item.value}
                  </span>
                )}
                <div
                  className={cn(
                    'w-full rounded-t-lg transition-all duration-500',
                    color
                  )}
                  style={{ height: `${barHeight}%` }}
                />
                {showLabels && (
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center truncate w-full">
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === 'line') {
    return (
      <div className={cn('w-full', className)}>
        <div className="relative" style={{ height }}>
          <svg width="100%" height="100%" className="overflow-visible">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(percent => (
              <line
                key={percent}
                x1="0"
                y1={`${100 - percent}%`}
                x2="100%"
                y2={`${100 - percent}%`}
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-200 dark:text-gray-700"
              />
            ))}

            {/* Line path */}
            <polyline
              points={data.map((item, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = 100 - (item.value / maxValue) * 100;
                return `${x}%,${y}%`;
              }).join(' ')}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-blue-500"
            />

            {/* Data points */}
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - (item.value / maxValue) * 100;

              return (
                <circle
                  key={index}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill="currentColor"
                  className="text-blue-500"
                />
              );
            })}
          </svg>
        </div>
        {showLabels && (
          <div className="flex justify-between mt-2">
            {data.map((item, index) => (
              <span key={index} className="text-xs text-gray-600 dark:text-gray-400">
                {item.label}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Pie chart
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <svg width={height} height={height} viewBox="0 0 100 100">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const color = item.color || colors[index % colors.length];

          const startAngle = currentAngle;
          currentAngle += angle;

          // Simple pie slice using path
          const start = polarToCartesian(50, 50, 40, startAngle);
          const end = polarToCartesian(50, 50, 40, startAngle + angle);
          const largeArc = angle > 180 ? 1 : 0;

          const pathData = [
            `M 50 50`,
            `L ${start.x} ${start.y}`,
            `A 40 40 0 ${largeArc} 1 ${end.x} ${end.y}`,
            'Z'
          ].join(' ');

          return (
            <path
              key={index}
              d={pathData}
              className={color.replace('bg-', 'fill-')}
            />
          );
        })}
      </svg>
      {showLabels && (
        <div className="space-y-2">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            const color = item.color || colors[index % colors.length];

            return (
              <div key={index} className="flex items-center gap-2">
                <div className={cn('w-3 h-3 rounded-full', color)} />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {item.label}: {showValues && `${item.value} (${percentage}%)`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

export default SimpleChart;
