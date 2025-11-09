import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  title: string;
  description?: string;
}

interface SimpleStepperProps {
  steps: Step[];
  currentStep: number;
  onChange?: (step: number) => void;
  className?: string;
  variant?: 'horizontal' | 'vertical';
}

const SimpleStepper: React.FC<SimpleStepperProps> = ({
  steps,
  currentStep,
  onChange,
  className,
  variant = 'horizontal',
}) => {
  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'pending';
  };

  const getStepClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-blue-500 border-blue-500 text-white';
      case 'current':
        return 'bg-white dark:bg-gray-800 border-blue-500 text-blue-500 ring-4 ring-blue-100 dark:ring-blue-900';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400';
    }
  };

  const handleStepClick = (index: number) => {
    if (onChange && index <= currentStep) {
      onChange(index);
    }
  };

  if (variant === 'vertical') {
    return (
      <div className={cn('space-y-4', className)}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          return (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={index > currentStep}
                  className={cn(
                    'w-10 h-10 rounded-full border-2 flex items-center justify-center',
                    'transition-all duration-200 font-semibold',
                    getStepClasses(status),
                    index <= currentStep && 'cursor-pointer hover:scale-105',
                    index > currentStep && 'cursor-not-allowed'
                  )}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-12 bg-gray-300 dark:bg-gray-600 my-2" />
                )}
              </div>
              <div className="flex-1 pt-2">
                <h4 className={cn(
                  'font-medium',
                  status === 'current'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-900 dark:text-white'
                )}>
                  {step.title}
                </h4>
                {step.description && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={index > currentStep}
                  className={cn(
                    'w-10 h-10 rounded-full border-2 flex items-center justify-center',
                    'transition-all duration-200 font-semibold',
                    getStepClasses(status),
                    index <= currentStep && 'cursor-pointer hover:scale-105',
                    index > currentStep && 'cursor-not-allowed'
                  )}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
                <div className="text-center">
                  <p className={cn(
                    'text-sm font-medium',
                    status === 'current'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white'
                  )}>
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2',
                    index < currentStep
                      ? 'bg-blue-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleStepper;
