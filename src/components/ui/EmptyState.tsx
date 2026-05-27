import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, subtitle, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-glass-border bg-glass-highlight/30 px-6 py-14 text-center',
        className,
      )}
    >
      {icon ? <div className="text-ink-secondary">{icon}</div> : null}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        {subtitle ? <p className="text-xs text-ink-secondary">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
