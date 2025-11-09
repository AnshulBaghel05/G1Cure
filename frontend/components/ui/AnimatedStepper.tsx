import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface AnimatedStepperProps {
  steps: Step[];
  currentStep?: number;
  onStepChange?: (stepIndex: number) => void;
  className?: string;
  variant?: 'default' | 'vertical' | 'cards';
  showStepNumbers?: boolean;
  allowStepClick?: boolean;
  showProgress?: boolean;
}

const AnimatedStepper: React.FC<AnimatedStepperProps> = ({
  steps,
  currentStep = 0,
  onStepChange,
  className,
  variant = 'default',
  showStepNumbers = true,
  allowStepClick = true,
  showProgress = true,
}) => {
  const [activeStep, setActiveStep] = useState(currentStep);

  const handleStepClick = (stepIndex: number) => {
    if (allowStepClick && stepIndex <= activeStep && !steps[stepIndex].disabled) {
      setActiveStep(stepIndex);
      onStepChange?.(stepIndex);
    }
  };

  const goToNextStep = () => {
    if (activeStep < steps.length - 1) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      onStepChange?.(nextStep);
    }
  };

  const goToPreviousStep = () => {
    if (activeStep > 0) {
      const prevStep = activeStep - 1;
      setActiveStep(prevStep);
      onStepChange?.(prevStep);
    }
  };

  const progressPercentage = ((activeStep + 1) / steps.length) * 100;

  if (variant === 'vertical') {
    return (
      <div className={cn("flex space-x-8", className)}>
        {/* Steps */}
        <div className="flex-shrink-0">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            const isDisabled = step.disabled;

            return (
              <motion.div
                key={step.id}
                className={cn(
                  "flex items-start space-x-4 mb-8 last:mb-0",
                  allowStepClick && !isDisabled && "cursor-pointer"
                )}
                onClick={() => handleStepClick(index)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                {/* Step Icon/Number */}
                <motion.div
                  className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isActive
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                  )}
                  whileHover={allowStepClick && !isDisabled ? { scale: 1.1 } : {}}
                  whileTap={allowStepClick && !isDisabled ? { scale: 0.9 } : {}}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    showStepNumbers && index + 1
                  )}
                </motion.div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    "text-sm font-medium",
                    isCompleted
                      ? "text-green-600 dark:text-green-400"
                      : isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  )}>
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {step.description}
                    </p>
                  )}
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <motion.div
                    className={cn(
                      "absolute left-5 w-0.5 h-8 ml-4",
                      isCompleted
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    )}
                    initial={{ height: 0 }}
                    animate={{ height: isCompleted ? 32 : 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3
            }}
            className="w-full"
          >
            {steps[activeStep].content}
          </motion.div>
        </div>
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Progress Bar */}
        {showProgress && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        )}

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            const isDisabled = step.disabled;

            return (
              <motion.div
                key={step.id}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200",
                  isCompleted
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : isActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
                  allowStepClick && !isDisabled && "cursor-pointer hover:shadow-md"
                )}
                onClick={() => handleStepClick(index)}
                whileHover={allowStepClick && !isDisabled ? { y: -4, scale: 1.02 } : {}}
                whileTap={allowStepClick && !isDisabled ? { scale: 0.98 } : {}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2",
                      isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : isActive
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : step.icon ? (
                      step.icon
                    ) : (
                      showStepNumbers && index + 1
                    )}
                  </motion.div>
                  
                  <div className="flex-1">
                    <h3 className={cn(
                      "font-medium",
                      isCompleted
                        ? "text-green-700 dark:text-green-300"
                        : isActive
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300"
                    )}>
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-8">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3
            }}
            className="w-full"
          >
            {steps[activeStep].content}
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6">
          <motion.button
            onClick={goToPreviousStep}
            disabled={activeStep === 0}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              activeStep === 0
                ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
            whileHover={activeStep > 0 ? { scale: 1.05 } : {}}
            whileTap={activeStep > 0 ? { scale: 0.95 } : {}}
          >
            Previous
          </motion.button>

          <motion.button
            onClick={goToNextStep}
            disabled={activeStep === steps.length - 1}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              activeStep === steps.length - 1
                ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                : "bg-blue-500 text-white hover:bg-blue-600"
            )}
            whileHover={activeStep < steps.length - 1 ? { scale: 1.05 } : {}}
            whileTap={activeStep < steps.length - 1 ? { scale: 0.95 } : {}}
          >
            Next
            <ChevronRight className="inline-block w-4 h-4 ml-1" />
          </motion.button>
        </div>
      </div>
    );
  }

  // Default horizontal stepper
  return (
    <div className={cn("w-full", className)}>
      {/* Progress Bar */}
      {showProgress && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      )}

      {/* Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const isDisabled = step.disabled;

          return (
            <motion.div
              key={step.id}
              className={cn(
                "flex flex-col items-center space-y-2",
                allowStepClick && !isDisabled && "cursor-pointer"
              )}
              onClick={() => handleStepClick(index)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              {/* Step Icon/Number */}
              <motion.div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                )}
                whileHover={allowStepClick && !isDisabled ? { scale: 1.1 } : {}}
                whileTap={allowStepClick && !isDisabled ? { scale: 0.9 } : {}}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : step.icon ? (
                  step.icon
                ) : (
                  showStepNumbers && index + 1
                )}
              </motion.div>

              {/* Step Title */}
              <span className={cn(
                "text-sm font-medium text-center",
                isCompleted
                  ? "text-green-600 dark:text-green-400"
                  : isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              )}>
                {step.title}
              </span>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <motion.div
                  className={cn(
                    "absolute w-full h-0.5",
                    isCompleted
                      ? "bg-green-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  )}
                  style={{ left: `${(index + 1) * (100 / steps.length)}%` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Content */}
      <div className="mt-8">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.3
          }}
          className="w-full"
        >
          {steps[activeStep].content}
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <motion.button
          onClick={goToPreviousStep}
          disabled={activeStep === 0}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            activeStep === 0
              ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          )}
          whileHover={activeStep > 0 ? { scale: 1.05 } : {}}
          whileTap={activeStep > 0 ? { scale: 0.95 } : {}}
        >
          Previous
        </motion.button>

        <motion.button
          onClick={goToNextStep}
          disabled={activeStep === steps.length - 1}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            activeStep === steps.length - 1
              ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              : "bg-blue-500 text-white hover:bg-blue-600"
          )}
          whileHover={activeStep < steps.length - 1 ? { scale: 1.05 } : {}}
          whileTap={activeStep < steps.length - 1 ? { scale: 0.95 } : {}}
        >
          Next
          <ChevronRight className="inline-block w-4 h-4 ml-1" />
        </motion.button>
      </div>
    </div>
  );
};

export default AnimatedStepper;
