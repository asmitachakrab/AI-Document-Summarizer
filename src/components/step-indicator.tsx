"use client";

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, label: 'Upload' },
  { id: 2, label: 'Review text' },
  { id: 3, label: 'Summary' },
] as const;

export interface StepIndicatorProps {
  /** 1-based current step. Steps before it render as completed. */
  currentStep: 1 | 2 | 3;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <ol className="mx-auto flex w-full max-w-md items-center justify-center gap-0 py-2" aria-label="Progress">
      {STEPS.map((step, index) => {
        const isDone = step.id < currentStep;
        const isActive = step.id === currentStep;
        return (
          <li key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                  isDone && 'bg-slate-800 text-white',
                  isActive && 'bg-slate-800 text-white ring-4 ring-violet-200',
                  !isDone && !isActive && 'border border-slate-300 bg-white text-slate-400'
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                {isDone ? <Check className="h-4 w-4" /> : step.id}
              </span>
              <span
                className={cn(
                  'mt-1.5 text-[11px] font-medium',
                  isActive ? 'text-slate-900' : isDone ? 'text-slate-600' : 'text-slate-400'
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <span
                className={cn(
                  'mx-2 mb-5 h-0.5 w-12 rounded-full sm:w-20',
                  step.id < currentStep ? 'bg-violet-500' : 'bg-slate-200'
                )}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
