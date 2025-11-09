import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  description?: string;
  location?: string;
  time?: string;
  type: 'appointment' | 'meeting' | 'reminder' | 'event';
  color?: string;
}

interface AnimatedCalendarProps {
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
  view?: 'month' | 'week' | 'day';
  showEvents?: boolean;
  showNavigation?: boolean;
  showToday?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

const AnimatedCalendar: React.FC<AnimatedCalendarProps> = ({
  events = [],
  onDateSelect,
  onEventClick,
  className,
  view = 'month',
  showEvents = true,
  showNavigation = true,
  showToday = true,
  minDate,
  maxDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Generate calendar data
  const calendarData = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const totalDays = 42; // 6 weeks * 7 days

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }

    return days;
  }, [currentYear, currentMonth]);

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is in current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth;
  };

  // Check if date is selected
  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  // Get month name
  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  };

  // Get day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get event color
  const getEventColor = (type: string) => {
    const colors = {
      appointment: 'bg-blue-500',
      meeting: 'bg-green-500',
      reminder: 'bg-yellow-500',
      event: 'bg-purple-500',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Calendar Header */}
      {showNavigation && (
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={goToPreviousMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            
            <motion.h2
              className="text-2xl font-bold text-gray-900 dark:text-white"
              key={`${currentYear}-${currentMonth}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {getMonthName(currentMonth)} {currentYear}
            </motion.h2>
            
            <motion.button
              onClick={goToNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
          
          {showToday && (
            <motion.button
              onClick={goToToday}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Today
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Day Names Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day, index) => (
          <motion.div
            key={day}
            className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            {day}
          </motion.div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarData.map((date, index) => {
          const dateEvents = getEventsForDate(date);
          const hasEvents = dateEvents.length > 0;
          
          return (
            <motion.div
              key={index}
              className={cn(
                "min-h-[100px] p-2 border border-gray-200 dark:border-gray-700 transition-all duration-200",
                "hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer",
                !isCurrentMonth(date) && "opacity-40",
                isToday(date) && "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600",
                isSelected(date) && "bg-blue-100 dark:bg-blue-900/40 border-blue-500 dark:border-blue-400"
              )}
              onClick={() => handleDateSelect(date)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: index * 0.01, 
                duration: 0.3,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Date Number */}
              <div className={cn(
                "text-sm font-medium mb-1",
                isToday(date) && "text-blue-600 dark:text-blue-400",
                isSelected(date) && "text-blue-700 dark:text-blue-300",
                !isCurrentMonth(date) && "text-gray-400 dark:text-gray-500"
              )}>
                {date.getDate()}
              </div>

              {/* Events */}
              {showEvents && hasEvents && (
                <div className="space-y-1">
                  {dateEvents.slice(0, 3).map((event, eventIndex) => (
                    <motion.div
                      key={event.id}
                      className={cn(
                        "px-2 py-1 text-xs text-white rounded truncate cursor-pointer",
                        getEventColor(event.type)
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: (index * 0.01) + (eventIndex * 0.1), 
                        duration: 0.3 
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {event.title}
                    </motion.div>
                  ))}
                  {dateEvents.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      +{dateEvents.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Selected Date Events */}
      {selectedDate && showEvents && (
        <AnimatePresence>
          <motion.div
            className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3
            }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Events for {selectedDate.toLocaleDateString()}
            </h3>
            
            {getEventsForDate(selectedDate).length > 0 ? (
              <div className="space-y-3">
                {getEventsForDate(selectedDate).map((event, index) => (
                  <motion.div
                    key={event.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    style={{ borderLeftColor: getEventColor(event.type).replace('bg-', '') }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    onClick={() => onEventClick?.(event)}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {event.title}
                        </h4>
                        {event.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          {event.time && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{event.time}</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={cn(
                        "px-2 py-1 text-xs text-white rounded-full",
                        getEventColor(event.type)
                      )}>
                        {event.type}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No events scheduled for this date</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default AnimatedCalendar;
