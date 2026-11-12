'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

const variants = {
  default: 'border-border',
  primary: 'border-primary-accent bg-primary-accent/5',
  success: 'border-success bg-success/5',
  warning: 'border-warning bg-warning/5',
  error: 'border-error bg-error/5',
};

const stepVariants = {
  pending: 'bg-surface border-border text-text-muted',
  active: 'bg-primary-accent border-primary-accent text-white',
  completed: 'bg-success border-success text-white',
  error: 'bg-error border-error text-white',
};

export default function Stepper({
  steps = [],
  currentStep = 0,
  variant = 'default',
  orientation = 'horizontal',
  className = '',
  onStepClick,
}) {
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const handleStepClick = (index) => {
    if (onStepClick) {
      onStepClick(index);
    }
    // Allow clicking on completed steps to go back
    if (index < currentStep) {
      // Navigate to previous step
    }
  };

  const isVertical = orientation === 'vertical';

  return (
    <div className={`${isVertical ? 'flex flex-col gap-4' : 'flex items-center gap-2'} ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep || completedSteps.has(index);
        const isActive = index === currentStep;
        const isError = step.variant === 'error';
        const status = isError ? 'error' : isCompleted ? 'completed' : isActive ? 'active' : 'pending';

        const content = (
          <div className="flex items-center gap-3">
            <motion.div
              initial={false}
              animate={{
                scale: isActive ? 1.1 : 1,
                backgroundColor: isCompleted
                  ? 'rgb(34, 197, 94)'
                  : isActive
                    ? 'rgb(12, 4, 53)'
                    : isError
                      ? 'rgb(239, 68, 68)'
                      : 'rgb(236, 236, 236)',
                borderColor: isCompleted
                  ? 'rgb(34, 197, 94)'
                  : isActive
                    ? 'rgb(12, 4, 53)'
                    : isError
                      ? 'rgb(239, 68, 68)'
                      : 'rgb(226, 226, 226)',
              }}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${step.variant === 'error' ? '' : ''}`}
            >
              {isCompleted ? (
                <Check size={16} className="text-white" />
              ) : (
                <span className={`text-sm font-semibold ${
                  isActive ? 'text-white' : isError ? 'text-white' : 'text-text-muted'
                }`}>
                  {index + 1}
                </span>
              )}
            </motion.div>

            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${
                isActive || isCompleted ? 'text-text-primary' : 'text-text-muted'
              }`}>
                {step.title}
              </p>
              {step.description && (
                <p className="text-xs text-text-muted mt-0.5 hidden sm:block">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );

        const stepWrapper = (
          <div key={index} className="flex-1">
            {onStepClick && index < currentStep ? (
              <button
                onClick={() => handleStepClick(index)}
                className="w-full text-left hover:opacity-80 transition-opacity cursor-pointer"
              >
                {content}
              </button>
            ) : (
              content
            )}
          </div>
        );

        return (
          <>
            {stepWrapper}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 min-w-[20px] ${
                  isCompleted ? 'bg-success' : 'bg-border'
                }`}
              />
            )}
          </>
        );
      })}
    </div>
  );
}

export function StepperVertical({ steps = [], currentStep = 0, className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isPending = index > currentStep;

        return (
          <div key={index} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted
                    ? 'rgb(34, 197, 94)'
                    : isActive
                      ? 'rgb(12, 4, 53)'
                      : 'rgb(236, 236, 236)',
                  borderColor: isCompleted
                    ? 'rgb(34, 197, 94)'
                    : isActive
                      ? 'rgb(12, 4, 53)'
                      : 'rgb(226, 226, 226)',
                }}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
              >
                {isCompleted ? (
                  <Check size={16} className="text-white" />
                ) : (
                  <span className={`text-sm font-semibold ${
                    isActive ? 'text-white' : 'text-text-muted'
                  }`}>
                    {index + 1}
                  </span>
                )}
              </motion.div>
              {index < steps.length - 1 && (
                <div
                  className={`w-0.5 flex-1 min-h-[40px] ${
                    isCompleted ? 'bg-success' : 'bg-border'
                  }`}
                />
              )}
            </div>

            <div className="flex-1 pb-8">
              <p className={`text-sm font-medium ${
                isActive || isCompleted ? 'text-text-primary' : 'text-text-muted'
              }`}>
                {step.title}
              </p>
              {step.description && (
                <p className="text-xs text-text-muted mt-1">
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
