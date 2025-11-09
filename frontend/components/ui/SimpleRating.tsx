import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface SimpleRatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showValue?: boolean;
}

const SimpleRating: React.FC<SimpleRatingProps> = ({
  value,
  onChange,
  max = 5,
  readonly = false,
  size = 'md',
  className,
  showValue = false,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleClick = (index: number) => {
    if (!readonly && onChange) {
      onChange(index + 1);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (!readonly) {
      setHoverValue(index + 1);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div className="flex gap-1">
        {Array.from({ length: max }).map((_, index) => {
          const isFilled = index < displayValue;
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className={cn(
                'transition-all duration-200',
                !readonly && 'hover:scale-110 cursor-pointer',
                readonly && 'cursor-default'
              )}
            >
              <Star
                className={cn(
                  sizes[size],
                  'transition-colors duration-200',
                  isFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-none text-gray-300 dark:text-gray-600'
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {value.toFixed(1)} / {max}
        </span>
      )}
    </div>
  );
};

export default SimpleRating;
