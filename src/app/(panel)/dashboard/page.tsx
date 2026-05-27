'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { useI18n } from '@/i18n/I18nProvider';
import { api, getApiError } from '@/lib/api';
import type { DashboardStats } from '@/lib/types';
import { formatNumber, formatRelative } from '@/lib/formatters';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { t, locale } = useI18n();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get<DashboardStats>('/admin/stats')
      .then((r) => {
        if (!cancelled) setData(r.data);
      })
      .catch((err) => toast.error(getApiError(err).message))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageHeader title={t('dashboard.title')} subtitle={t('dashboard.subtitle')} />

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatTile
          label={t('dashboard.totalUsers')}
          value={data?.counts.users}
          loading={loading}
          tone="brand"
          icon={<Icon.Users size={18} />}
        />
        <StatTile
          label={t('dashboard.newUsers24h')}
          value={data?.counts.newUsers24h}
          loading={loading}
          tone="info"
          icon={<Icon.Refresh size={18} />}
        />
        <StatTile
          label={t('dashboard.newUsers7d')}
          value={data?.counts.newUsers7d}
          loading={loading}
          tone="info"
          icon={<Icon.Refresh size={18} />}
        />
        <StatTile
          label={t('dashboard.admins')}
          value={data?.counts.admins}
          loading={loading}
          tone="brand"
          icon={<Icon.Shield size={18} />}
        />
        <StatTile
          label={t('dashboard.bannedUsers')}
          value={data?.counts.bannedUsers}
          loading={loading}
          tone="error"
          icon={<Icon.Ban size={18} />}
        />
        <StatTile
          label={t('dashboard.openReports')}
          value={data?.counts.openReports}
          loading={loading}
          tone="warn"
          icon={<Icon.Reports size={18} />}
        />
        <StatTile
          label={t('dashboard.activeGames')}
          value={data ? `${data.counts.activeGames}/${data.counts.games}` : undefined}
          loading={loading}
          tone="success"
          icon={<Icon.Games size={18} />}
        />
        <StatTile
          label={t('dashboard.activeMatches')}
          value={data?.counts.activeMatches}
          loading={loading}
          tone="success"
          icon={<Icon.Matches size={18} />}
        />
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-glass-border px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-ink">
                {t('dashboard.chartTitle')}
              </h2>
              <p className="text-xs text-ink-secondary">
                {t('dashboard.chartStarted')} · {t('dashboard.chartEnded')}
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-ink-secondary">
              <span className="flex items-center gap-1">
                <span className="h-2 w-3 rounded-sm bg-brand-purple" />
                {t('dashboard.chartStarted')}
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-3 rounded-sm bg-brand-blue" />
                {t('dashboard.chartEnded')}
              </span>
            </div>
          </div>
          <div className="p-5">
            {loading ? (
              <Skeleton className="h-56 w-full" />
            ) : data ? (
              <MatchesBarChart data={data.matchesChart} />
            ) : (
              <EmptyState title={t('common.empty')} />
            )}
          </div>
        </Card>

        <Card>
          <div className="border-b border-glass-border px-5 py-4">
            <h2 className="text-base font-semibold text-ink">
              {t('dashboard.recentRegistrations')}
            </h2>
          </div>
          <div className="p-3">
            {loading ? (
              <div className="space-y-2 p-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : data && data.recentRegistrations.length > 0 ? (
              <ul className="space-y-1">
                {data.recentRegistrations.map((u) => (
                  <li key={u.id}>
                    <Link
                      href={`/users/${u.id}`}
                      className="flex items-center gap-3 rounded-xl2 p-2 hover:bg-glass-highlight"
                    >
                      <Avatar src={u.photoUrl} name={u.name} size={36} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{u.name}</p>
                        <p className="truncate text-[11px] text-ink-secondary">{u.email}</p>
                      </div>
                      <span className="whitespace-nowrap text-[11px] text-ink-disabled">
                        {formatRelative(u.createdAt, locale)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title={t('dashboard.noRecentUsers')} />
            )}
          </div>
        </Card>
      </section>
    </>
  );
}

interface StatTileProps {
  label: string;
  value: number | string | undefined;
  loading: boolean;
  tone?: 'brand' | 'success' | 'warn' | 'error' | 'info' | 'neutral';
  icon?: React.ReactNode;
}

function StatTile({ label, value, loading, tone = 'brand', icon }: StatTileProps) {
  const { locale } = useI18n();
  const toneRing: Record<NonNullable<StatTileProps['tone']>, string> = {
    brand: 'shadow-[inset_0_0_0_1px_rgba(123,63,242,0.18)]',
    success: 'shadow-[inset_0_0_0_1px_rgba(0,200,83,0.18)]',
    warn: 'shadow-[inset_0_0_0_1px_rgba(255,176,32,0.18)]',
    error: 'shadow-[inset_0_0_0_1px_rgba(255,82,82,0.18)]',
    info: 'shadow-[inset_0_0_0_1px_rgba(0,209,255,0.18)]',
    neutral: '',
  };
  const iconBg: Record<NonNullable<StatTileProps['tone']>, string> = {
    brand: 'bg-brand-purple/15 text-brand-blue',
    success: 'bg-status-success/15 text-status-success',
    warn: 'bg-status-warn/15 text-status-warn',
    error: 'bg-status-error/15 text-status-error',
    info: 'bg-status-info/15 text-status-info',
    neutral: 'bg-glass-surface text-ink-secondary',
  };

  return (
    <Card className={'p-5 ' + toneRing[tone]} hoverable>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-secondary">
          {label}
        </p>
        {icon ? (
          <span className={'flex h-8 w-8 items-center justify-center rounded-lg ' + iconBg[tone]}>
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mt-3 text-2xl font-bold text-ink sm:text-3xl">
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : value === undefined ? (
          '—'
        ) : typeof value === 'number' ? (
          formatNumber(value, locale)
        ) : (
          value
        )}
      </div>
    </Card>
  );
}

function MatchesBarChart({
  data,
}: {
  data: Array<{ day: string; matches: number; ended: number }>;
}) {
  const max = Math.max(1, ...data.flatMap((d) => [d.matches, d.ended]));
  const { locale } = useI18n();
  return (
    <div className="flex h-56 items-end justify-between gap-2">
      {data.map((d) => {
        const date = new Date(d.day);
        const labelDay = date.toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US', {
          weekday: 'short',
        });
        return (
          <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-full w-full items-end justify-center gap-1">
              <div
                className="w-1/2 max-w-[18px] rounded-t-md bg-brand-purple/80 transition-all hover:bg-brand-purple"
                style={{ height: `${(d.matches / max) * 100}%` }}
                title={String(d.matches)}
              />
              <div
                className="w-1/2 max-w-[18px] rounded-t-md bg-brand-blue/80 transition-all hover:bg-brand-blue"
                style={{ height: `${(d.ended / max) * 100}%` }}
                title={String(d.ended)}
              />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-ink-disabled">
              {labelDay}
            </span>
          </div>
        );
      })}
    </div>
  );
}
