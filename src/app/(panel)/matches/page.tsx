'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { useI18n } from '@/i18n/I18nProvider';
import { api, getApiError } from '@/lib/api';
import type { AdminMatch, MatchStatus, MatchWithInteractions, Paginated } from '@/lib/types';
import { formatDateTime } from '@/lib/formatters';
import { cn } from '@/lib/cn';

const FILTERS: Array<{ value: MatchStatus | 'all'; key: string }> = [
  { value: 'all', key: 'matches.filters.all' },
  { value: 'active', key: 'matches.filters.active' },
  { value: 'finished', key: 'matches.filters.finished' },
  { value: 'expired', key: 'matches.filters.expired' },
];

export default function MatchesPage() {
  const { t, locale } = useI18n();
  const [filter, setFilter] = useState<MatchStatus | 'all'>('all');
  const [items, setItems] = useState<AdminMatch[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [interactionsMatch, setInteractionsMatch] = useState<MatchWithInteractions | null>(null);
  const [loadingInteractions, setLoadingInteractions] = useState(false);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<Paginated<AdminMatch>>('/admin/matches', {
        params: { status: filter, page, pageSize },
      });
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      toast.error(getApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [filter, page, pageSize]);

  useEffect(() => {
    void fetchMatches();
  }, [fetchMatches]);

  async function forceFinish(m: AdminMatch) {
    try {
      await api.post(`/admin/matches/${m.id}/finish`);
      toast.success(t('toasts.matchFinished'));
      void fetchMatches();
    } catch (err) {
      toast.error(getApiError(err).message);
    }
  }

  async function viewInteractions(m: AdminMatch) {
    setLoadingInteractions(true);
    try {
      const res = await api.get<{ match: MatchWithInteractions }>(
        `/admin/matches/${m.id}/interactions`,
      );
      setInteractionsMatch(res.data.match);
    } catch (err) {
      toast.error(getApiError(err).message);
    } finally {
      setLoadingInteractions(false);
    }
  }

  return (
    <>
      <PageHeader title={t('matches.title')} subtitle={t('matches.subtitle')} />

      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl2 border border-glass-border bg-glass-surface p-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                setFilter(f.value);
                setPage(1);
              }}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors',
                filter === f.value
                  ? 'bg-brand-gradient text-white shadow-glow-soft'
                  : 'text-ink-secondary hover:text-ink',
              )}
            >
              {t(f.key)}
            </button>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading && items.length === 0 ? (
          <div className="space-y-2 p-5">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState title={t('common.noResults')} className="border-0 bg-transparent" />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>{t('matches.columns.players')}</TH>
                <TH className="hidden md:table-cell">{t('matches.columns.session')}</TH>
                <TH>{t('matches.columns.status')}</TH>
                <TH className="hidden sm:table-cell">{t('matches.columns.interactions')}</TH>
                <TH className="hidden lg:table-cell">{t('matches.columns.started')}</TH>
                <TH className="hidden lg:table-cell">{t('matches.columns.ended')}</TH>
                <TH className="text-right">{t('matches.columns.actions')}</TH>
              </TR>
            </THead>
            <TBody>
              {items.map((m) => (
                <TR key={m.id}>
                  <TD>
                    <div className="flex items-center gap-2">
                      <Link href={`/users/${m.userAId}`} className="flex items-center gap-2 hover:underline">
                        <Avatar src={m.userA.photoUrl} name={m.userA.name} size={28} />
                        <span className="text-sm">{m.userA.name}</span>
                      </Link>
                      <span className="text-ink-disabled">×</span>
                      <Link href={`/users/${m.userBId}`} className="flex items-center gap-2 hover:underline">
                        <Avatar src={m.userB.photoUrl} name={m.userB.name} size={28} />
                        <span className="text-sm">{m.userB.name}</span>
                      </Link>
                    </div>
                  </TD>
                  <TD className="hidden md:table-cell">{m.session.title}</TD>
                  <TD>
                    <Badge
                      tone={
                        m.status === 'active'
                          ? 'success'
                          : m.status === 'finished'
                            ? 'neutral'
                            : 'warn'
                      }
                    >
                      {m.status}
                    </Badge>
                  </TD>
                  <TD className="hidden sm:table-cell">{m._count.interactions}</TD>
                  <TD className="hidden lg:table-cell text-xs">
                    {formatDateTime(m.startedAt, locale)}
                  </TD>
                  <TD className="hidden lg:table-cell text-xs">
                    {m.endedAt ? formatDateTime(m.endedAt, locale) : '—'}
                  </TD>
                  <TD>
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="ghost" size="sm" onClick={() => viewInteractions(m)}>
                        {t('matches.actions.viewInteractions')}
                      </Button>
                      {m.status === 'active' ? (
                        <Button variant="danger" size="sm" onClick={() => forceFinish(m)}>
                          {t('matches.actions.forceFinish')}
                        </Button>
                      ) : null}
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
        <div className="border-t border-glass-border px-5">
          <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} />
        </div>
      </Card>

      <Modal
        open={!!interactionsMatch || loadingInteractions}
        onClose={() => setInteractionsMatch(null)}
        title={t('matches.interactions.title')}
        size="lg"
        subtitle={
          interactionsMatch
            ? `${interactionsMatch.userA.name} × ${interactionsMatch.userB.name}`
            : undefined
        }
      >
        {loadingInteractions || !interactionsMatch ? (
          <Skeleton className="h-40 w-full" />
        ) : interactionsMatch.interactions.length === 0 ? (
          <EmptyState
            title={t('matches.interactions.empty')}
            className="border-0 bg-transparent"
          />
        ) : (
          <ul className="space-y-2">
            {interactionsMatch.interactions.map((it) => (
              <li
                key={it.id}
                className="flex items-center gap-3 rounded-xl2 border border-glass-border bg-glass-highlight px-3 py-2"
              >
                <Avatar src={it.user.photoUrl} name={it.user.name} size={28} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{it.user.name}</p>
                  <p className="text-[11px] text-ink-secondary">
                    {formatDateTime(it.createdAt, locale)}
                  </p>
                </div>
                <Badge tone="brand">{t(`matches.interactions.types.${it.type}`)}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </>
  );
}
