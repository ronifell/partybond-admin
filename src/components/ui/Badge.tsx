import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type Tone = 'neutral' | 'success' | 'warn' | 'error' | 'info' | 'brand';

const toneClass: Record<Tone, string> = {
  neutral: 'border-glass-border bg-glass-surface text-ink-secondary',
  success: 'border-status-success/40 bg-status-success/10 text-status-success',
  warn: 'border-status-warn/40 bg-status-warn/10 text-status-warn',
  error: 'border-status-error/40 bg-status-error/10 text-status-error',
  info: 'border-status-info/40 bg-status-info/10 text-status-info',
  brand: 'border-brand-purple/50 bg-brand-purple/15 text-brand-blue',
};

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

export function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  return <span className={cn('pill', toneClass[tone], className)}>{children}</span>;
}
