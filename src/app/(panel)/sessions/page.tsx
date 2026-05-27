'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Icon } from '@/components/ui/Icon';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { useI18n } from '@/i18n/I18nProvider';
import { api, getApiError } from '@/lib/api';
import type { AdminSession, Game, Paginated, SessionStatus } from '@/lib/types';
import { formatDateTime } from '@/lib/formatters';

export default function SessionsPage() {
  const { t, locale } = useI18n();
  const [items, setItems] = useState<AdminSession[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [statusFilter, setStatusFilter] = useState<SessionStatus | 'all'>('all');
  const [gameFilter, setGameFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<AdminSession | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<Paginated<AdminSession>>('/admin/sessions', {
        params: {
          status: statusFilter,
          gameId: gameFilter || undefined,
          page,
          pageSize,
        },
      });
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      toast.error(getApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, gameFilter, page, pageSize]);

  useEffect(() => {
    void fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    api
      .get<{ games: Game[] }>('/admin/games')
      .then((r) => setGames(r.data.games))
      .catch(() => null);
  }, []);

  async function deleteSession() {
    if (!deleting) return;
    try {
      await api.delete(`/admin/sessions/${deleting.id}`);
      toast.success(t('toasts.sessionDeleted'));
      setDeleting(null);
      void fetchSessions();
    } catch (err) {
      toast.error(getApiError(err).message);
    }
  }

  return (
    <>
      <PageHeader title={t('sessions.title')} subtitle={t('sessions.subtitle')} />

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select
            label={t('sessions.filters.status')}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as SessionStatus | 'all');
              setPage(1);
            }}
          >
            <option value="all">{t('sessions.status.all')}</option>
            <option value="open">{t('sessions.status.open')}</option>
            <option value="active">{t('sessions.status.active')}</option>
            <option value="finished">{t('sessions.status.finished')}</option>
          </Select>
          <Select
            label={t('sessions.filters.game')}
            value={gameFilter}
            onChange={(e) => {
              setGameFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">{t('sessions.filters.all')}</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
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
                <TH>{t('sessions.columns.title')}</TH>
                <TH className="hidden md:table-cell">{t('sessions.columns.game')}</TH>
                <TH className="hidden lg:table-cell">{t('sessions.columns.creator')}</TH>
                <TH className="hidden sm:table-cell">{t('sessions.columns.mode')}</TH>
                <TH className="hidden md:table-cell">{t('sessions.columns.queue')}</TH>
                <TH className="hidden md:table-cell">{t('sessions.columns.matches')}</TH>
                <TH>{t('sessions.columns.status')}</TH>
                <TH className="hidden lg:table-cell">{t('sessions.columns.scheduled')}</TH>
                <TH className="text-right">{t('sessions.columns.actions')}</TH>
              </TR>
            </THead>
            <TBody>
              {items.map((s) => (
                <TR key={s.id}>
                  <TD className="font-semibold text-ink">{s.title}</TD>
                  <TD className="hidden md:table-cell">{s.game.name}</TD>
                  <TD className="hidden lg:table-cell">
                    <Link href={`/users/${s.createdById}`} className="hover:underline">
                      {s.createdBy.name}
                    </Link>
                  </TD>
                  <TD className="hidden sm:table-cell capitalize">{s.gameMode}</TD>
                  <TD className="hidden md:table-cell">{s._count.queue}</TD>
                  <TD className="hidden md:table-cell">{s._count.matches}</TD>
                  <TD>
                    <Badge
                      tone={
                        s.status === 'open'
                          ? 'info'
                          : s.status === 'active'
                            ? 'success'
                            : 'neutral'
                      }
                    >
                      {t(`sessions.status.${s.status}`)}
                    </Badge>
                  </TD>
                  <TD className="hidden lg:table-cell text-xs">
                    {formatDateTime(s.scheduledAt, locale)}
                  </TD>
                  <TD>
                    <div className="flex justify-end">
                      <Button variant="subtle" size="sm" onClick={() => setDeleting(s)}>
                        <Icon.Trash size={14} />
                      </Button>
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
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title={t('sessions.deleteTitle')}
        subtitle={deleting?.title}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              {t('common.cancel')}
            </Button>
            <Button variant="danger" onClick={deleteSession}>
              {t('common.delete')}
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-secondary">{t('sessions.deleteSubtitle')}</p>
      </Modal>
    </>
  );
}
