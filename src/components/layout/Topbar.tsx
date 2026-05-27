'use client';

import { useAuth } from '@/lib/auth';
import { useI18n } from '@/i18n/I18nProvider';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import type { Locale } from '@/i18n';

interface TopbarProps {
  onOpenSidebar: () => void;
}

export function Topbar({ onOpenSidebar }: TopbarProps) {
  const { user, signOut } = useAuth();
  const { t, locale, setLocale } = useI18n();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-glass-border bg-bg/70 px-4 backdrop-blur-xl lg:px-8">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="rounded-lg p-2 text-ink-secondary hover:bg-glass-surface-light lg:hidden"
        aria-label="Open menu"
      >
        <Icon.Menu />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-2 rounded-xl2 border border-glass-border bg-glass-surface p-0.5">
        {(['pt', 'en'] as Locale[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            className={
              'rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ' +
              (locale === l
                ? 'bg-brand-gradient text-white shadow-glow-soft'
                : 'text-ink-secondary hover:text-ink')
            }
          >
            {l === 'pt' ? 'PT' : 'EN'}
          </button>
        ))}
      </div>

      <div className="hidden items-center gap-3 rounded-xl2 border border-glass-border bg-glass-surface px-3 py-1.5 sm:flex">
        <Avatar src={user?.photoUrl ?? null} name={user?.name ?? ''} size={28} />
        <div className="text-xs leading-tight">
          <p className="font-semibold text-ink">{user?.name}</p>
          <p className="text-ink-disabled">{user?.email}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={signOut}
        className="inline-flex items-center gap-2 rounded-xl2 border border-glass-border bg-glass-surface px-3 py-2 text-xs font-semibold text-ink-secondary transition-colors hover:border-status-error/40 hover:bg-status-error/10 hover:text-status-error"
        title={t('auth.signOut')}
      >
        <Icon.Logout size={16} />
        <span className="hidden md:inline">{t('auth.signOut')}</span>
      </button>
    </header>
  );
}
