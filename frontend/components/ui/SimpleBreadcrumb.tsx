import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface SimpleBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  showHome?: boolean;
  onNavigate?: (href: string) => void;
}

const SimpleBreadcrumb: React.FC<SimpleBreadcrumbProps> = ({
  items,
  className,
  separator = <ChevronRight className="w-4 h-4" />,
  showHome = true,
  onNavigate,
}) => {
  const allItems = showHome
    ? [{ label: 'Home', href: '/', icon: <Home className="w-4 h-4" /> }, ...items]
    : items;

  const handleClick = (e: React.MouseEvent, href?: string) => {
    if (href && onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <nav className={cn('flex items-center space-x-2 text-sm', className)}>
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="text-gray-400 dark:text-gray-600">
                {separator}
              </span>
            )}
            {item.href && !isLast ? (
              <a
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={cn(
                  'flex items-center gap-1.5 text-gray-600 dark:text-gray-400',
                  'hover:text-blue-600 dark:hover:text-blue-400',
                  'transition-colors duration-200'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ) : (
              <span
                className={cn(
                  'flex items-center gap-1.5',
                  isLast
                    ? 'text-gray-900 dark:text-white font-medium'
                    : 'text-gray-600 dark:text-gray-400'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default SimpleBreadcrumb;
