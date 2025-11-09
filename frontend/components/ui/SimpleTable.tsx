import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleTableProps {
  headers: string[];
  data: any[][];
  className?: string;
  onRowClick?: (rowIndex: number) => void;
}

const SimpleTable: React.FC<SimpleTableProps> = ({
  headers,
  data,
  className,
  onRowClick,
}) => {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(rowIndex)}
              className={cn(
                'transition-colors duration-150',
                onRowClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTable;
