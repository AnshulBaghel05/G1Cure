import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';

interface SimpleSearchProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  debounceMs?: number;
}

const SimpleSearch: React.FC<SimpleSearchProps> = ({
  placeholder = 'Search...',
  onSearch,
  onChange,
  className,
  size = 'md',
  debounceMs = 300,
}) => {
  const [value, setValue] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const sizes = {
    sm: 'h-8 text-sm px-8',
    md: 'h-10 text-base px-10',
    lg: 'h-12 text-lg px-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      onSearch?.(newValue);
    }, debounceMs);

    setDebounceTimer(timer);
  };

  const handleClear = () => {
    setValue('');
    onChange?.('');
    onSearch?.('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <Search
        className={cn(
          'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400',
          iconSizes[size]
        )}
      />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-lg border border-gray-300 dark:border-gray-600',
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-all duration-200',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          sizes[size],
          className
        )}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            'absolute right-3 top-1/2 transform -translate-y-1/2',
            'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
            'transition-colors duration-200'
          )}
        >
          <X className={iconSizes[size]} />
        </button>
      )}
    </form>
  );
};

export default SimpleSearch;
