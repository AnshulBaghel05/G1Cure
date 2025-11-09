import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface SimpleTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

const SimpleTabs: React.FC<SimpleTabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  className,
  variant = 'default',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeContent = tabs.find(tab => tab.id === activeTab)?.content;

  const getTabClasses = (tab: Tab) => {
    const isActive = activeTab === tab.id;
    const base = 'px-4 py-2 font-medium transition-all duration-200 focus:outline-none';

    if (variant === 'pills') {
      return cn(
        base,
        'rounded-lg',
        isActive
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
        tab.disabled && 'opacity-50 cursor-not-allowed'
      );
    }

    if (variant === 'underline') {
      return cn(
        base,
        'border-b-2',
        isActive
          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
        tab.disabled && 'opacity-50 cursor-not-allowed'
      );
    }

    return cn(
      base,
      'border border-gray-300 dark:border-gray-600',
      isActive
        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-0'
        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
      tab.disabled && 'opacity-50 cursor-not-allowed'
    );
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'flex gap-2',
          variant === 'underline' && 'border-b border-gray-200 dark:border-gray-700'
        )}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={getTabClasses(tab)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {activeContent}
      </div>
    </div>
  );
};

export default SimpleTabs;
