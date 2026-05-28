'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/i18n/I18nProvider';
import { AppLogo } from '@/components/ui/AppLogo';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const NAV = [
  { href: '/dashboard', key: 'nav.dashboard', icon: Icon.Dashboard },
  { href: '/users', key: 'nav.users', icon: Icon.Users },
  { href: '/reports', key: 'nav.reports', icon: Icon.Reports },
  { href: '/games', key: 'nav.games', icon: Icon.Games },
  { href: '/sessions', key: 'nav.sessions', icon: Icon.Sessions },
  { href: '/matches', key: 'nav.matches', icon: Icon.Matches },
  { href: '/settings', key: 'nav.settings', icon: Icon.Settings },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-glass-border bg-black/10 backdrop-blur-md transition-transform duration-200 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-glass-border px-5 py-5">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <AppLogo size="sm" />
            <div>
              <p className="text-sm font-semibold leading-none gradient-text">
                {t('app.name')}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-ink-disabled">
                v1.0
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-ink-secondary hover:bg-glass-surface-light lg:hidden"
            aria-label="Close menu"
          >
            <Icon.Close size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          <ul className="space-y-1">
            {NAV.map((item) => {
              const Icn = item.icon;
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'group flex items-center gap-3 rounded-xl2 px-3 py-2.5 text-sm font-medium transition-all',
                      active
                        ? 'bg-brand-gradient-soft text-ink shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                        : 'text-ink-secondary hover:bg-glass-highlight hover:text-ink',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                        active
                          ? 'bg-brand-gradient text-white shadow-glow-soft'
                          : 'bg-glass-surface text-ink-secondary group-hover:text-ink',
                      )}
                    >
                      <Icn size={16} />
                    </span>
                    <span className="flex-1">{t(item.key)}</span>
                    {active ? <Icon.ChevronRight size={14} className="text-ink-disabled" /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto flex w-full shrink-0 flex-col">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/left.png"
            alt=""
            className="block w-full object-cover object-bottom"
          />
          <div className="border-t border-glass-border bg-black px-5 py-4 text-[11px] text-ink-disabled">
            <p className="gradient-text font-semibold uppercase tracking-wider">Partybond</p>
            <p className="mt-1">{t('app.tagline')}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
