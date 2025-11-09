import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface AnimatedAccordionProps {
  items: AccordionItem[];
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated';
  allowMultiple?: boolean;
  defaultOpen?: string[];
}

const AnimatedAccordion: React.FC<AnimatedAccordionProps> = ({
  items,
  className,
  variant = 'default',
  allowMultiple = false,
  defaultOpen = [],
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setOpenItems(prev =>
        prev.includes(itemId) ? [] : [itemId]
      );
    }
  };

  const variantClasses = {
    default: "border-b border-gray-200 dark:border-gray-700",
    bordered: "border border-gray-200 dark:border-gray-700 rounded-lg mb-2",
    elevated: "bg-white dark:bg-gray-800 rounded-lg shadow-md mb-2",
  };

  return (
    <div className={cn("w-full", className)}>
      {items.map((item, index) => {
        const isOpen = openItems.includes(item.id);
        const isDisabled = item.disabled;

        return (
          <motion.div
            key={item.id}
            className={cn(
              "overflow-hidden",
              variantClasses[variant],
              variant === 'bordered' && "p-4",
              variant === 'elevated' && "p-4"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
          >
            <motion.button
              onClick={() => !isDisabled && toggleItem(item.id)}
              disabled={isDisabled}
              className={cn(
                "w-full flex items-center justify-between py-4 px-4 text-left transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                variant === 'default' && "hover:bg-gray-50 dark:hover:bg-gray-800",
                variant === 'bordered' && "hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg",
                variant === 'elevated' && "hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg",
                !isDisabled && "cursor-pointer"
              )}
              whileHover={!isDisabled ? { backgroundColor: "rgba(59, 130, 246, 0.05)" } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center space-x-3">
                {item.icon && (
                  <motion.div
                    className="text-gray-500 dark:text-gray-400"
                    animate={{ rotate: isOpen ? 360 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.icon}
                  </motion.div>
                )}
                <span className={cn(
                  "font-medium text-gray-900 dark:text-white",
                  isOpen && "text-blue-600 dark:text-blue-400"
                )}>
                  {item.title}
                </span>
              </div>
              
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-400 dark:text-gray-500"
              >
                {allowMultiple ? (
                  isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </motion.div>
            </motion.button>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.3, ease: "easeInOut" },
                    opacity: { duration: 0.2, ease: "easeInOut" }
                  }}
                  className="overflow-hidden"
                >
                  <motion.div
                    className="px-4 pb-4 text-gray-600 dark:text-gray-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    {item.content}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AnimatedAccordion;
