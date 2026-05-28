import { cn } from '@/lib/cn';

const sizeClass = {
  sm: 'h-9 w-9',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
} as const;

type AppLogoSize = keyof typeof sizeClass;

interface AppLogoProps {
  size?: AppLogoSize;
  className?: string;
}

export function AppLogo({ size = 'md', className }: AppLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Partybond"
      className={cn('object-contain', sizeClass[size], className)}
    />
  );
}
