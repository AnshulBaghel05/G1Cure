import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SlidingCard {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  details?: string[];
  gradient?: string;
}

interface SlidingCardsProps {
  cards: SlidingCard[];
  autoSlide?: boolean;
  slideDuration?: number;
  visibleCards?: number;
}

export function SlidingCards({ 
  cards, 
  autoSlide = true, 
  slideDuration = 4000,
  visibleCards = 3 
}: SlidingCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!autoSlide || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, cards.length - visibleCards + 1));
    }, slideDuration);

    return () => clearInterval(interval);
  }, [autoSlide, isHovered, cards.length, visibleCards, slideDuration]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, cards.length - visibleCards + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, cards.length - visibleCards) : prev - 1
    );
  };

  const getVisibleCards = () => {
    const visible = [];
    for (let i = 0; i < visibleCards && i < cards.length; i++) {
      const cardIndex = (currentIndex + i) % cards.length;
      visible.push({ ...cards[cardIndex], displayIndex: i });
    }
    return visible;
  };

  return (
    <div 
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 rounded-2xl" />
      
      {/* Cards container */}
      <div className="relative p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {getVisibleCards().map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={`${card.id}-${currentIndex}`}
                  initial={{ 
                    opacity: 0, 
                    x: 100,
                    scale: 0.9,
                    rotateY: 15
                  }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    scale: 1,
                    rotateY: 0
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: -100,
                    scale: 0.9,
                    rotateY: -15
                  }}
                  transition={{ 
                    duration: 0.6,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                  }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.05,
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                  className="group perspective-1000"
                >
                  <Card className={`h-full transition-all duration-500 hover:shadow-2xl border-0 overflow-hidden ${
                    card.gradient || 'bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30'
                  }`}>
                    {/* Card glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Floating particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
                          animate={{
                            x: [0, 50, 0],
                            y: [0, -30, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 3,
                            delay: i * 0.5,
                            repeat: Infinity,
                            repeatType: "loop"
                          }}
                          style={{
                            left: `${20 + i * 30}%`,
                            top: `${60 + i * 10}%`,
                          }}
                        />
                      ))}
                    </div>

                    <CardHeader className="relative z-10 space-y-4">
                      <motion.div 
                        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                        whileHover={{ 
                          rotate: [0, -10, 10, 0],
                          scale: 1.1
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                          {card.title}
                        </CardTitle>
                        <CardDescription className="mt-2 text-gray-600">
                          {card.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    
                    {card.details && (
                      <CardContent className="relative z-10">
                        <ul className="space-y-2">
                          {card.details.map((detail, i) => (
                            <motion.li 
                              key={i}
                              className="flex items-center gap-3 text-sm text-gray-600"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + i * 0.1 }}
                            >
                              <motion.div 
                                className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ 
                                  duration: 2,
                                  delay: i * 0.2,
                                  repeat: Infinity 
                                }}
                              />
                              {detail}
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    )}

                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    />
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Navigation controls */}
        {cards.length > visibleCards && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="w-10 h-10 rounded-full p-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            {/* Dots indicator */}
            <div className="flex gap-2">
              {Array.from({ length: Math.max(1, cards.length - visibleCards + 1) }).map((_, i) => (
                <motion.button
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentIndex(i)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="w-10 h-10 rounded-full p-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {autoSlide && !isHovered && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/50">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: slideDuration / 1000,
              ease: "linear",
              repeat: Infinity
            }}
          />
        </div>
      )}
    </div>
  );
}
