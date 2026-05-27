import { cn } from '@/lib/cn';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-xl bg-[linear-gradient(110deg,rgba(255,255,255,0.04)_8%,rgba(255,255,255,0.12)_18%,rgba(255,255,255,0.04)_33%)] bg-[length:200%_100%]',
        className,
      )}
    />
  );
}
