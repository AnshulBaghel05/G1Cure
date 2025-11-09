import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarouselItem {
  id: string;
  content: React.ReactNode;
  title?: string;
  description?: string;
}

interface AnimatedCarouselProps {
  items: CarouselItem[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  showTitle?: boolean;
  variant?: 'default' | 'cards' | 'fullscreen';
  height?: string | number;
  loop?: boolean;
  onSlideChange?: (index: number) => void;
}

const AnimatedCarousel: React.FC<AnimatedCarouselProps> = ({
  items,
  className,
  autoPlay = false,
  autoPlayInterval = 5000,
  showArrows = true,
  showDots = true,
  showTitle = false,
  variant = 'default',
  height = '400px',
  loop = true,
  onSlideChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => {
      if (prevIndex === items.length - 1) {
        return loop ? 0 : prevIndex;
      }
      return prevIndex + 1;
    });
  }, [items.length, loop]);

  const previousSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        return loop ? items.length - 1 : prevIndex;
      }
      return prevIndex - 1;
    });
  }, [items.length, loop]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, nextSlide]);

  // Notify parent of slide change
  useEffect(() => {
    onSlideChange?.(currentIndex);
  }, [currentIndex, onSlideChange]);

  if (!items || items.length === 0) {
    return null;
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      nextSlide();
    } else if (swipe > swipeConfidenceThreshold) {
      previousSlide();
    }
  };

  const carouselHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div className={cn("relative w-full overflow-hidden", className)} style={{ height: carouselHeight }}>
      {/* Carousel Container */}
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute w-full h-full"
          >
            <div className="w-full h-full">
              {items[currentIndex].content}
              
              {/* Title and Description Overlay */}
              {showTitle && (items[currentIndex].title || items[currentIndex].description) && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {items[currentIndex].title && (
                    <h3 className="text-xl font-semibold mb-2">{items[currentIndex].title}</h3>
                  )}
                  {items[currentIndex].description && (
                    <p className="text-sm opacity-90">{items[currentIndex].description}</p>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {showArrows && items.length > 1 && (
        <>
          <motion.button
            onClick={previousSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && items.length > 1 && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.3 }}
        >
          {items.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-200",
                index === currentIndex
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/75"
              )}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 0 }}
              animate={{ scale: index === currentIndex ? 1.1 : 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            />
          ))}
        </motion.div>
      )}

      {/* Progress Bar */}
      {autoPlay && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-white/20"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: autoPlayInterval / 1000, ease: "linear" }}
          style={{ transformOrigin: "left" }}
        />
      )}

      {/* Slide Counter */}
      <motion.div
        className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm text-white text-sm font-medium"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      >
        {currentIndex + 1} / {items.length}
      </motion.div>
    </div>
  );
};

export default AnimatedCarousel;
