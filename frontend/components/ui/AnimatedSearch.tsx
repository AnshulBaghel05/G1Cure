import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, TrendingUp, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'suggestion';
  icon?: React.ReactNode;
  category?: string;
}

interface AnimatedSearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  suggestions?: SearchSuggestion[];
  showSuggestions?: boolean;
  showFilters?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled' | 'minimal';
  debounceMs?: number;
  onQueryChange?: (query: string) => void;
}

const AnimatedSearch: React.FC<AnimatedSearchProps> = ({
  placeholder = 'Search...',
  onSearch,
  suggestions = [],
  showSuggestions = true,
  showFilters = false,
  className,
  size = 'md',
  variant = 'default',
  debounceMs = 300,
  onQueryChange,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsPanel, setShowSuggestionsPanel] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    default: "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-sm",
    outlined: "bg-transparent border-2 border-gray-300 dark:border-gray-600",
    filled: "bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600",
    minimal: "bg-transparent border-b border-gray-300 dark:border-gray-600 rounded-none",
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      onQueryChange?.(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, onQueryChange]);

  // Handle search submission
  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestionsPanel(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    onSearch(suggestion.text);
    setShowSuggestionsPanel(false);
    inputRef.current?.blur();
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestionsPanel(false);
      inputRef.current?.blur();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestionsPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions based on query
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.text.toLowerCase().includes(query.toLowerCase())
  );

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return <Clock className="w-4 h-4" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4" />;
      case 'suggestion':
        return <Star className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'recent':
        return 'text-blue-500';
      case 'trending':
        return 'text-green-500';
      case 'suggestion':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className={cn("relative", className)} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <motion.div
          className={cn(
            "flex items-center space-x-3 rounded-lg transition-all duration-200",
            "focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
            variantClasses[variant],
            sizeClasses[size],
            isFocused && "ring-2 ring-blue-500 ring-offset-2"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Search Icon */}
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          
          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              if (showSuggestions && suggestions.length > 0) {
                setShowSuggestionsPanel(true);
              }
            }}
            onBlur={() => setIsFocused(false)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          
          {/* Clear Button */}
          {query && (
            <motion.button
              onClick={() => {
                setQuery('');
                setShowSuggestionsPanel(false);
                inputRef.current?.focus();
              }}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
          
          {/* Filter Button */}
          {showFilters && (
            <motion.button
              onClick={() => setShowSuggestionsPanel(!showSuggestionsPanel)}
              className={cn(
                "p-1 rounded-full transition-colors duration-200",
                showSuggestionsPanel
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Filter className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Search Suggestions Panel */}
      <AnimatePresence>
        {showSuggestionsPanel && (filteredSuggestions.length > 0 || showFilters) && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.2
            }}
          >
            {/* Suggestions */}
            {filteredSuggestions.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Suggestions
                </div>
                {filteredSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion.id}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                  >
                    <div className={cn("flex-shrink-0", getSuggestionColor(suggestion.type))}>
                      {suggestion.icon || getSuggestionIcon(suggestion.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900 dark:text-white font-medium">
                        {suggestion.text}
                      </div>
                      {suggestion.category && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {suggestion.category}
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Filters */}
            {showFilters && (
              <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Filters
                </div>
                <div className="px-4 py-2 space-y-2">
                  {/* Add your filter controls here */}
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Filter options will appear here
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Button (Optional) */}
      {query && (
        <motion.button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors duration-200"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Search
        </motion.button>
      )}
    </div>
  );
};

export default AnimatedSearch;
