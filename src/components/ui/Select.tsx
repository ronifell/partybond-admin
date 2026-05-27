'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, className, children, id, ...rest },
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
        <select
          id={id}
          ref={ref}
          className={cn(
            'input-base appearance-none pr-9',
            error ? 'border-status-error/60 focus:border-status-error' : '',
            className,
          )}
          {...rest}
        >
          {children}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-status-error">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-secondary">{hint}</p>
      ) : null}
    </div>
  );
});
