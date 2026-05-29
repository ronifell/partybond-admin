import Link from 'next/link';
import { cn } from '@/lib/cn';
import { AppLogo } from '@/components/ui/AppLogo';

const sizeClass = {
  sm: {
    logo: 'xs' as const,
    wordmark: 'app-brand-wordmark-sm',
  },
  md: {
    logo: 'sm' as const,
    wordmark: 'app-brand-wordmark-md',
  },
} as const;

type AppBrandSize = keyof typeof sizeClass;

interface AppBrandProps {
  size?: AppBrandSize;
  className?: string;
  /** Pass `false` to render a static mark (no navigation link). */
  href?: string | false;
  onClick?: () => void;
}

export function AppBrand({
  size = 'sm',
  className,
  href = '/dashboard',
  onClick,
}: AppBrandProps) {
  const { logo, wordmark } = sizeClass[size];
  const rootClassName = cn('flex items-center gap-2.5 shrink-0', className);

  const content = (
    <>
      <AppLogo size={logo} />
      <span className={wordmark} aria-label="Partybond">
        <span className="app-brand-wordmark-party">PARTY</span>
        <span className="app-brand-wordmark-bond">BOND</span>
      </span>
    </>
  );

  if (href === false) {
    return <div className={rootClassName}>{content}</div>;
  }

  return (
    <Link href={href} onClick={onClick} className={rootClassName}>
      {content}
    </Link>
  );
}
