import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SimpleCounterProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  separator?: string;
}

const SimpleCounter: React.FC<SimpleCounterProps> = ({
  from = 0,
  to,
  duration = 2000,
  suffix = '',
  prefix = '',
  decimals = 0,
  className,
  separator = ',',
}) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    const startTime = Date.now();
    const difference = to - from;

    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = from + (difference * easeOutQuart);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(to);
      }
    };

    requestAnimationFrame(updateCount);
  }, [from, to, duration]);

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join('.');
  };

  return (
    <span className={cn('font-bold tabular-nums', className)}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

export default SimpleCounter;
