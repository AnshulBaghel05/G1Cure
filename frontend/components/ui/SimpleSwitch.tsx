import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SimpleSwitch: React.FC<SimpleSwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: checked ? 'translate-x-4' : 'translate-x-0.5',
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: checked ? 'translate-x-5' : 'translate-x-0.5',
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: checked ? 'translate-x-7' : 'translate-x-0.5',
    },
  };

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <label className={cn('inline-flex items-center gap-3 cursor-pointer', className)}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleToggle}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={cn(
            'rounded-full transition-all duration-200',
            sizes[size].track,
            checked
              ? 'bg-blue-500'
              : 'bg-gray-300 dark:bg-gray-600',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <div
            className={cn(
              'absolute top-0.5 rounded-full bg-white shadow-md',
              'transition-transform duration-200',
              sizes[size].thumb,
              sizes[size].translate
            )}
          />
        </div>
      </div>
      {label && (
        <span className={cn(
          'text-sm font-medium text-gray-900 dark:text-white',
          disabled && 'opacity-50'
        )}>
          {label}
        </span>
      )}
    </label>
  );
};

export default SimpleSwitch;
