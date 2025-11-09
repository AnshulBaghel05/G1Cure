import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
}

interface SimpleAccordionProps {
  items: AccordionItemProps[];
  allowMultiple?: boolean;
  className?: string;
}

const SimpleAccordion: React.FC<SimpleAccordionProps> = ({
  items,
  allowMultiple = false,
  className,
}) => {
  const [openItems, setOpenItems] = useState<Set<number>>(
    new Set(items.map((item, index) => item.defaultOpen ? index : -1).filter(i => i !== -1))
  );

  const toggleItem = (index: number) => {
    if (items[index].disabled) return;

    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, index) => {
        const isOpen = openItems.has(index);
        return (
          <div
            key={index}
            className={cn(
              'border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden',
              'transition-colors duration-200',
              item.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <button
              onClick={() => toggleItem(index)}
              disabled={item.disabled}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3',
                'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700',
                'transition-colors duration-200',
                'text-left font-medium text-gray-900 dark:text-white',
                item.disabled && 'cursor-not-allowed'
              )}
            >
              <span>{item.title}</span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 transition-transform duration-200',
                  isOpen && 'transform rotate-180'
                )}
              />
            </button>
            <div
              className={cn(
                'overflow-hidden transition-all duration-200',
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SimpleAccordion;
