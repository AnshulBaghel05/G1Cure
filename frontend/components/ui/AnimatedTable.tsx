import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface AnimatedTableProps {
  columns: Column[];
  data: any[];
  className?: string;
  onRowClick?: (row: any) => void;
  loading?: boolean;
  emptyMessage?: string;
}

const AnimatedTable: React.FC<AnimatedTableProps> = ({
  columns,
  data,
  className,
  onRowClick,
  loading = false,
  emptyMessage = "No data available",
}) => {
  if (loading) {
    return (
      <div className={cn("bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden", className)}>
        <div className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-700 h-12"></div>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border-t border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4">
                <div className="flex space-x-4">
                  {columns.map((_, colIndex) => (
                    <div key={colIndex} className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={cn(
        "bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center",
        className
      )}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📊</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">{emptyMessage}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <motion.tr
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                    index === 0 ? "pl-6" : "",
                    index === columns.length - 1 ? "pr-6" : ""
                  )}
                >
                  {column.label}
                </th>
              ))}
            </motion.tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: rowIndex * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  backgroundColor: "rgba(59, 130, 246, 0.05)",
                  scale: 1.01,
                  transition: { duration: 0.2 }
                }}
                className={cn(
                  "transition-all duration-200",
                  onRowClick && "cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100",
                      index === 0 ? "pl-6" : "",
                      index === columns.length - 1 ? "pr-6" : ""
                    )}
                  >
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnimatedTable;
