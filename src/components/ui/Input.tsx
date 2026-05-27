'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, className, leftIcon, rightIcon, id, ...rest },
  ref,
) {
  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={id} className="label-base">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {leftIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-secondary">
            {leftIcon}
          </span>
        ) : null}
        <input
          id={id}
          ref={ref}
          className={cn(
            'input-base',
            leftIcon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : '',
            error
              ? 'border-status-error/60 focus:border-status-error focus:shadow-[0_0_24px_rgba(255,82,82,0.25)]'
              : '',
            className,
          )}
          {...rest}
        />
        {rightIcon ? (
          <span className="absolute inset-y-0 right-3 flex items-center text-ink-secondary">
            {rightIcon}
          </span>
        ) : null}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-status-error">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-secondary">{hint}</p>
      ) : null}
    </div>
  );
});
