import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function PageHeader({
  title,
  subtitle,
  action,
  compact,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex shrink-0 flex-col gap-[0.5%] sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div>
        <h1
          className={
            compact
              ? 'text-[clamp(1.25rem,2.8vw,2rem)] font-extrabold tracking-tight text-ink'
              : 'text-[clamp(1.5rem,3.2vw,2.25rem)] font-extrabold tracking-tight text-ink'
          }
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            className={
              compact
                ? 'mt-[0.3%] max-w-2xl text-[clamp(0.65rem,1.1vw,0.8rem)] text-ink-secondary'
                : 'mt-[0.5%] max-w-2xl text-[clamp(0.75rem,1.2vw,0.875rem)] text-ink-secondary'
            }
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex flex-wrap items-center gap-[1%]">{action}</div> : null}
    </div>
  );
}
