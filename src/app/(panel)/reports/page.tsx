'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { useI18n } from '@/i18n/I18nProvider';
import { api, getApiError } from '@/lib/api';
import type { Paginated, Report, ReportStatus } from '@/lib/types';
import { formatDateTime } from '@/lib/formatters';
import { cn } from '@/lib/cn';

const FILTERS: Array<{ value: ReportStatus | 'all'; key: string }> = [
  { value: 'all', key: 'reports.filters.all' },
  { value: 'open', key: 'reports.filters.open' },
  { value: 'reviewed', key: 'reports.filters.reviewed' },
  { value: 'dismissed', key: 'reports.filters.dismissed' },
];

export default function ReportsPage() {
  const { t, locale } = useI18n();
  const [filter, setFilter] = useState<ReportStatus | 'all'>('open');
  const [items, setItems] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Report | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<Paginated<Report>>('/admin/reports', {
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
    void fetchReports();
  }, [fetchReports]);

  async function quickResolve(r: Report, status: ReportStatus) {
    try {
      await api.patch(`/admin/reports/${r.id}`, { status });
      toast.success(t('toasts.reportUpdated'));
      void fetchReports();
    } catch (err) {
      toast.error(getApiError(err).message);
    }
  }

  async function banReported(r: Report) {
    try {
      await api.post(`/admin/users/${r.reportedId}/ban`, {
        reason: `Reported: ${t(`reports.category.${r.category}`)}`,
      });
      await api.patch(`/admin/reports/${r.id}`, { status: 'reviewed' });
      toast.success(t('toasts.banned'));
      void fetchReports();
    } catch (err) {
      toast.error(getApiError(err).message);
    }
  }

  return (
    <>
      <PageHeader title={t('reports.title')} subtitle={t('reports.subtitle')} />

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
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title={t('common.noResults')}
            subtitle={t('reports.subtitle')}
            className="border-0 bg-transparent"
          />
        ) : (
          <ul className="divide-y divide-glass-border">
            {items.map((r) => (
              <li key={r.id} className="px-5 py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex flex-1 items-start gap-3 min-w-0">
                    <Avatar src={r.reported.photoUrl} name={r.reported.name} size={44} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/users/${r.reportedId}`}
                          className="truncate text-sm font-semibold text-ink hover:underline"
                        >
                          {r.reported.name}
                        </Link>
                        <Badge
                          tone={
                            r.category === 'harassment' || r.category === 'inappropriate_content'
                              ? 'error'
                              : r.category === 'spam'
                                ? 'warn'
                                : 'info'
                          }
                        >
                          {t(`reports.category.${r.category}`)}
                        </Badge>
                        <Badge
                          tone={
                            r.status === 'open'
                              ? 'warn'
                              : r.status === 'reviewed'
                                ? 'info'
                                : 'neutral'
                          }
                        >
                          {t(`reports.status.${r.status}`)}
                        </Badge>
                        {r.reported.bannedAt ? (
                          <Badge tone="error">{t('users.tag.banned')}</Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-ink-secondary">
                        {t('reports.columns.reporter')}:{' '}
                        <Link href={`/users/${r.reporterId}`} className="underline">
                          {r.reporter.name}
                        </Link>{' '}
                        · {formatDateTime(r.createdAt, locale)}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-ink-secondary">
                        {r.details || (
                          <span className="italic text-ink-disabled">{t('reports.noDetails')}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 md:flex-col md:items-end">
                    {r.status !== 'reviewed' ? (
                      <Button variant="ghost" size="sm" onClick={() => quickResolve(r, 'reviewed')}>
                        {t('reports.actions.review')}
                      </Button>
                    ) : null}
                    {r.status !== 'dismissed' ? (
                      <Button variant="subtle" size="sm" onClick={() => quickResolve(r, 'dismissed')}>
                        {t('reports.actions.dismiss')}
                      </Button>
                    ) : (
                      <Button variant="subtle" size="sm" onClick={() => quickResolve(r, 'open')}>
                        {t('reports.actions.reopen')}
                      </Button>
                    )}
                    {!r.reported.bannedAt ? (
                      <Button variant="danger" size="sm" onClick={() => banReported(r)}>
                        {t('reports.actions.banReported')}
                      </Button>
                    ) : null}
                    <Button variant="subtle" size="sm" onClick={() => setEditing(r)}>
                      {t('common.edit')}
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-glass-border px-5">
          <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} />
        </div>
      </Card>

      {editing ? (
        <ReportNoteModal
          report={editing}
          onClose={() => setEditing(null)}
          onDone={() => {
            setEditing(null);
            void fetchReports();
          }}
        />
      ) : null}
    </>
  );
}

function ReportNoteModal({
  report,
  onClose,
  onDone,
}: {
  report: Report;
  onClose: () => void;
  onDone: () => void;
}) {
  const { t } = useI18n();
  const [status, setStatus] = useState<ReportStatus>(report.status);
  const [note, setNote] = useState(report.adminNote ?? '');
  const [submitting, setSubmitting] = useState(false);

  async function save() {
    setSubmitting(true);
    try {
      await api.patch(`/admin/reports/${report.id}`, {
        status,
        adminNote: note.trim() || undefined,
      });
      toast.success(t('toasts.reportUpdated'));
      onDone();
    } catch (err) {
      toast.error(getApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={t('reports.title')}
      subtitle={`${report.reported.name} · ${t(`reports.category.${report.category}`)}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={save} loading={submitting}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <p className="label-base">{t('common.status')}</p>
          <div className="flex flex-wrap gap-1.5">
            {(['open', 'reviewed', 'dismissed'] as ReportStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors',
                  status === s
                    ? 'border-transparent bg-brand-gradient text-white shadow-glow-soft'
                    : 'border-glass-border bg-glass-surface text-ink-secondary hover:text-ink',
                )}
              >
                {t(`reports.status.${s}`)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="note" className="label-base">
            {t('reports.noteLabel')}
          </label>
          <textarea
            id="note"
            className="input-base min-h-[120px] resize-y"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('reports.notePlaceholder')}
          />
        </div>
      </div>
    </Modal>
  );
}
