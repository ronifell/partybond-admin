'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'ghost' | 'danger' | 'subtle';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const sizeClass: Record<Size, string> = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  className,
  children,
  leftIcon,
  rightIcon,
  disabled,
  ...rest
}: ButtonProps) {
  const baseByVariant: Record<Variant, string> = {
    primary:
      'bg-brand-gradient text-white shadow-glow hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100',
    ghost:
      'border border-glass-border bg-glass-surface text-ink hover:border-glass-border-strong hover:bg-glass-surface-light',
    danger:
      'border border-status-error/40 bg-status-error/10 text-status-error hover:bg-status-error/20',
    subtle:
      'border border-transparent bg-bg-card text-ink-secondary hover:text-ink hover:bg-glass-surface-light',
  };

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(
        'inline-flex select-none items-center justify-center gap-2 rounded-xl2 font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60',
        sizeClass[size],
        baseByVariant[variant],
        className,
      )}
      {...rest}
    >
      {loading ? <Spinner /> : leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </svg>
  );
}
