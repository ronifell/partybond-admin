import { cn } from '@/lib/cn';

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}

function initials(name?: string | null): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || '?';
}

export function Avatar({ src, name, size = 40, className }: AvatarProps) {
  const dim = { width: size, height: size, fontSize: Math.round(size * 0.4) };
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name ?? 'avatar'}
        style={dim}
        className={cn(
          'rounded-full object-cover border border-glass-border bg-bg-card',
          className,
        )}
      />
    );
  }
  return (
    <div
      style={dim}
      className={cn(
        'flex items-center justify-center rounded-full bg-brand-gradient font-semibold text-white shadow-glow-soft',
        className,
      )}
    >
      {initials(name)}
    </div>
  );
}
