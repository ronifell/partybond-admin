'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { useI18n } from '@/i18n/I18nProvider';
import { useAuth } from '@/lib/auth';
import { getApiUrl } from '@/lib/api';
import type { Locale } from '@/i18n';
import { cn } from '@/lib/cn';

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n();
  const { user } = useAuth();

  return (
    <>
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

      <Card>
        <CardBody>
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-secondary">
            <Icon.Globe size={16} />
            {t('settings.language')}
          </h2>
          <p className="mt-1 text-sm text-ink-secondary">{t('settings.languageHint')}</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(['pt', 'en'] as Locale[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                className={cn(
                  'flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all',
                  locale === l
                    ? 'border-transparent bg-brand-gradient-soft shadow-[inset_0_0_0_1px_rgba(123,63,242,0.45)]'
                    : 'border-glass-border bg-glass-surface hover:border-glass-border-strong',
                )}
              >
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {l === 'pt' ? t('settings.portuguese') : t('settings.english')}
                  </p>
                  <p className="text-[11px] text-ink-disabled">{l === 'pt' ? 'PT-BR' : 'EN-US'}</p>
                </div>
                {locale === l ? <Icon.Check className="text-status-success" /> : null}
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
            {t('settings.profile')}
          </h2>
          <div className="mt-4 flex items-center gap-4">
            <Avatar src={user?.photoUrl ?? null} name={user?.name ?? ''} size={64} />
            <div>
              <p className="text-base font-semibold text-ink">{user?.name}</p>
              <p className="text-sm text-ink-secondary">{user?.email}</p>
              <div className="mt-2 flex gap-1.5">
                <Badge tone="brand">{t('users.tag.admin')}</Badge>
                <Badge tone="success">{t('users.tag.active')}</Badge>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
            {t('settings.backend')}
          </h2>
          <p className="mt-1 text-sm text-ink-secondary">{t('settings.backendHint')}</p>
          <div className="mt-3 rounded-xl2 border border-glass-border bg-bg-card px-3 py-2 font-mono text-xs text-ink-secondary">
            {getApiUrl()}
          </div>
        </CardBody>
      </Card>
    </>
  );
}
