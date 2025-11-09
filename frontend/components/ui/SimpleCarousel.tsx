import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SimpleCarouselProps {
  children: React.ReactNode[];
  className?: string;
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
}

const SimpleCarousel: React.FC<SimpleCarouselProps> = ({
  children,
  className,
  autoPlay = false,
  interval = 3000,
  showControls = true,
  showIndicators = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % children.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, children.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + children.length) % children.length);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % children.length);
  };

  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)}>
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {children.map((child, index) => (
          <div key={index} className="min-w-full">
            {child}
          </div>
        ))}
      </div>

      {/* Controls */}
      {showControls && children.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={cn(
              'absolute left-2 top-1/2 -translate-y-1/2',
              'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
              'p-2 rounded-full shadow-lg',
              'hover:bg-white dark:hover:bg-gray-800',
              'transition-all duration-200 hover:scale-110'
            )}
          >
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          <button
            onClick={goToNext}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2',
              'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
              'p-2 rounded-full shadow-lg',
              'hover:bg-white dark:hover:bg-gray-800',
              'transition-all duration-200 hover:scale-110'
            )}
          >
            <ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && children.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-200',
                currentIndex === index
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleCarousel;
