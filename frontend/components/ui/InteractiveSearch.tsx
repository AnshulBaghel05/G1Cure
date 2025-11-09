import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown, Check } from 'lucide-react';
import AnimatedButton from './AnimatedButton';

interface SearchOption {
  id: string;
  label: string;
  value: string;
  category?: string;
}

interface FilterOption {
  id: string;
  label: string;
  value: string;
  options: { id: string; label: string; value: string }[];
}

interface InteractiveSearchProps {
  placeholder?: string;
  onSearch: (query: string, filters: Record<string, string[]>) => void;
  searchOptions?: SearchOption[];
  filterOptions?: FilterOption[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showFilters?: boolean;
  debounceMs?: number;
}

export function InteractiveSearch({
  placeholder = 'Search...',
  onSearch,
  searchOptions = [],
  filterOptions = [],
  className = '',
  size = 'md',
  showFilters = true,
  debounceMs = 300
}: InteractiveSearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Handle search when debounced query changes
  useEffect(() => {
    if (debouncedQuery !== '') {
      onSearch(debouncedQuery, activeFilters);
    }
  }, [debouncedQuery, activeFilters, onSearch]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg'
  };

  const filteredSuggestions = searchOptions.filter(option =>
    option.label.toLowerCase().includes(query.toLowerCase()) ||
    option.value.toLowerCase().includes(query.toLowerCase())
  );

  const handleFilterChange = (filterId: string, value: string, checked: boolean) => {
    setActiveFilters(prev => {
      const current = prev[filterId] || [];
      if (checked) {
        return { ...prev, [filterId]: [...current, value] };
      } else {
        return { ...prev, [filterId]: current.filter(v => v !== value) };
      }
    });
  };

  const clearFilters = () => {
    setActiveFilters({});
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((acc, curr) => acc + curr.length, 0);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <motion.div
          initial={false}
          animate={{
            boxShadow: isFocused 
              ? '0 0 0 3px rgba(59, 130, 246, 0.1)' 
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
          className={`relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 ${sizeClasses[size]}`}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full h-full pl-10 pr-20 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />

          {/* Filter Toggle Button */}
          {filterOptions.length > 0 && (
            <AnimatedButton
              variant="ghost"
              size="sm"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <Filter className="w-4 h-4" />
              {getActiveFilterCount() > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center text-xs">
                  {getActiveFilterCount()}
                </span>
              )}
            </AnimatedButton>
          )}

          {/* Clear Button */}
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setQuery('')}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {filteredSuggestions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                onClick={() => {
                  setQuery(option.label);
                  setShowSuggestions(false);
                  onSearch(option.value, activeFilters);
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 dark:text-white">{option.label}</span>
                  {option.category && (
                    <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                      {option.category}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFiltersOpen && filterOptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Filters</h3>
              <AnimatedButton
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear All
              </AnimatedButton>
            </div>

            <div className="space-y-4">
              {filterOptions.map((filter) => (
                <div key={filter.id}>
                  <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {filter.label}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {filter.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={activeFilters[filter.id]?.includes(option.value) || false}
                          onChange={(e) => handleFilterChange(filter.id, option.value, e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
