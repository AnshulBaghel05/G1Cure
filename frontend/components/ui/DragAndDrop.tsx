import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Upload, File, X, Check, AlertCircle } from 'lucide-react';
import AnimatedButton from './AnimatedButton';

interface DragItem {
  id: string;
  content: React.ReactNode;
  data?: any;
}

interface DragAndDropProps {
  items: DragItem[];
  onReorder?: (newOrder: DragItem[]) => void;
  onDrop?: (item: DragItem, targetIndex: number) => void;
  onRemove?: (itemId: string) => void;
  className?: string;
  variant?: 'list' | 'grid' | 'timeline';
  droppable?: boolean;
  sortable?: boolean;
  removable?: boolean;
  maxItems?: number;
}

interface DragState {
  draggedItem: DragItem | null;
  draggedIndex: number | null;
  hoverIndex: number | null;
}

export function DragAndDrop({
  items,
  onReorder,
  onDrop,
  onRemove,
  className = '',
  variant = 'list',
  droppable = true,
  sortable = true,
  removable = false,
  maxItems
}: DragAndDropProps) {
  const [dragState, setDragState] = useState<DragState>({
    draggedItem: null,
    draggedIndex: null,
    hoverIndex: null
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((item: DragItem, index: number) => {
    if (!sortable) return;
    setDragState({
      draggedItem: item,
      draggedIndex: index,
      hoverIndex: null
    });
  }, [sortable]);

  const handleDragEnd = useCallback(() => {
    if (dragState.draggedIndex !== null && dragState.hoverIndex !== null) {
      const newOrder = [...items];
      const [draggedItem] = newOrder.splice(dragState.draggedIndex, 1);
      newOrder.splice(dragState.hoverIndex, 0, draggedItem);
      
      if (onReorder) {
        onReorder(newOrder);
      }
    }
    
    setDragState({
      draggedItem: null,
      draggedIndex: null,
      hoverIndex: null
    });
  }, [dragState, items, onReorder]);

  const handleDragOver = useCallback((index: number) => {
    if (dragState.draggedIndex !== null && dragState.draggedIndex !== index) {
      setDragState(prev => ({ ...prev, hoverIndex: index }));
    }
  }, [dragState.draggedIndex]);

  const handleDrop = useCallback((item: DragItem, targetIndex: number) => {
    if (onDrop) {
      onDrop(item, targetIndex);
    }
  }, [onDrop]);

  const handleRemove = useCallback((itemId: string) => {
    if (onRemove) {
      onRemove(itemId);
    }
  }, [onRemove]);

  const getContainerClasses = () => {
    const baseClasses = 'relative min-h-[200px] transition-all duration-200';
    
    switch (variant) {
      case 'list':
        return `${baseClasses} space-y-2`;
      case 'grid':
        return `${baseClasses} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`;
      case 'timeline':
        return `${baseClasses} space-y-4`;
      default:
        return baseClasses;
    }
  };

  const getItemClasses = (index: number) => {
    const baseClasses = 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm cursor-move transition-all duration-200';
    
    if (dragState.hoverIndex === index && dragState.draggedIndex !== null) {
      return `${baseClasses} border-blue-400 shadow-lg scale-105`;
    }
    
    if (dragState.draggedIndex === index) {
      return `${baseClasses} opacity-50 scale-95`;
    }
    
    return baseClasses;
  };

  const renderItem = (item: DragItem, index: number) => (
    <motion.div
      key={item.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`${getItemClasses(index)} p-4`}
      onDragStart={() => handleDragStart(item, index)}
      onDragEnd={handleDragEnd}
      onDragOver={() => handleDragOver(index)}
      onDrop={() => handleDrop(item, index)}
      drag={sortable}
      dragConstraints={containerRef}
      dragElastic={0.1}
      whileDrag={{ 
        scale: 1.05,
        zIndex: 1000,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {item.content}
        </div>
        
        {removable && (
          <AnimatedButton
            variant="ghost"
            size="sm"
            onClick={() => handleRemove(item.id)}
            className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </AnimatedButton>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className={getContainerClasses()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
      >
        <AnimatePresence>
          {items.map((item, index) => renderItem(item, index))}
        </AnimatePresence>
        
        {isDragOver && droppable && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center"
          >
            <div className="text-center text-blue-600 dark:text-blue-400">
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Drop here</p>
            </div>
          </motion.div>
        )}
        
        {maxItems && items.length >= maxItems && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-500 dark:text-gray-400 py-4"
          >
            <AlertCircle className="w-5 h-5 mx-auto mb-2" />
            <p className="text-sm">Maximum items reached ({maxItems})</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Specialized components for different use cases
export function AppointmentScheduler({
  appointments,
  onReorder,
  className = ''
}: {
  appointments: DragItem[];
  onReorder: (newOrder: DragItem[]) => void;
  className?: string;
}) {
  return (
    <DragAndDrop
      items={appointments}
      onReorder={onReorder}
      variant="timeline"
      sortable={true}
      removable={false}
      className={className}
    />
  );
}

export function FileUploader({
  files,
  onDrop,
  onRemove,
  maxFiles = 10,
  className = ''
}: {
  files: DragItem[];
  onDrop: (item: DragItem, targetIndex: number) => void;
  onRemove: (itemId: string) => void;
  maxFiles?: number;
  className?: string;
}) {
  return (
    <DragAndDrop
      items={files}
      onDrop={onDrop}
      onRemove={onRemove}
      variant="grid"
      sortable={true}
      removable={true}
      maxItems={maxFiles}
      className={className}
    />
  );
}

export function SortableList({
  items,
  onReorder,
  className = ''
}: {
  items: DragItem[];
  onReorder: (newOrder: DragItem[]) => void;
  className?: string;
}) {
  return (
    <DragAndDrop
      items={items}
      onReorder={onReorder}
      variant="list"
      sortable={true}
      removable={false}
      className={className}
    />
  );
}
