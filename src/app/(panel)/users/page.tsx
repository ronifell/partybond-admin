'use client';

import { useEffect, useState, useCallback, type FormEvent } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { useI18n } from '@/i18n/I18nProvider';
import { useAuth } from '@/lib/auth';
import { api, getApiError } from '@/lib/api';
import type { AdminUser, Paginated } from '@/lib/types';
import { formatDate } from '@/lib/formatters';
import { cn } from '@/lib/cn';

type StatusFilter = 'all' | 'active' | 'banned' | 'admin';

export default function UsersPage() {
  const { t, locale } = useI18n();
  const { user: me } = useAuth();
  const [items, setItems] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [loading, setLoading] = useState(true);
  const [banTarget, setBanTarget] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const fetchUsers = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      try {
        const res = await api.get<Paginated<AdminUser>>('/admin/users', {
          params: {
            search: search.trim() || undefined,
            status: statusFilter,
            page,
            pageSize,
          },
          signal,
        });
        setItems(res.data.items);
        setTotal(res.data.total);
      } catch (err) {
        if ((err as { code?: string }).code === 'ERR_CANCELED') return;
        toast.error(getApiError(err).message);
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter, page, pageSize],
  );

  useEffect(() => {
    const ctrl = new AbortController();
    void fetchUsers(ctrl.signal);
    return () => ctrl.abort();
  }, [fetchUsers]);

  function onSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    void fetchUsers();
  }

  async function toggleAdminFlag(u: AdminUser) {
    try {
      const next = !u.isAdmin;
      await api.patch(`/admin/users/${u.id}/admin`, { isAdmin: next });
      toast.success(next ? t('toasts.promoted') : t('toasts.demoted'));
      void fetchUsers();
    } catch (err) {
      toast.error(getApiError(err).message);
    }
  }

  async function unbanUser(u: AdminUser) {
    try {
      await api.post(`/admin/users/${u.id}/unban`);
      toast.success(t('toasts.unbanned'));
      void fetchUsers();
    } catch (err) {
      toast.error(getApiError(err).message);
    }
  }

  return (
    <>
      <PageHeader title={t('users.title')} subtitle={t('users.subtitle')} />

      <Card className="p-4">
        <form onSubmit={onSearchSubmit} className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <Input
              placeholder={t('users.searchPlaceholder')}
              leftIcon={<Icon.Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl2 border border-glass-border bg-glass-surface p-1">
            {(['all', 'active', 'banned', 'admin'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors',
                  statusFilter === s
                    ? 'bg-brand-gradient text-white shadow-glow-soft'
                    : 'text-ink-secondary hover:text-ink',
                )}
              >
                {t(`users.filters.${s}`)}
              </button>
            ))}
          </div>
          <Button type="submit" variant="ghost" size="md">
            {t('common.search')}
          </Button>
        </form>
      </Card>

      <Card className="overflow-hidden">
        {loading && items.length === 0 ? (
          <div className="space-y-2 p-5">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title={t('common.noResults')}
            subtitle={t('users.subtitle')}
            className="border-0 bg-transparent"
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>{t('users.columns.user')}</TH>
                <TH className="hidden md:table-cell">{t('users.columns.email')}</TH>
                <TH className="hidden lg:table-cell">{t('users.columns.state')}</TH>
                <TH className="hidden md:table-cell">{t('users.columns.reports')}</TH>
                <TH className="hidden lg:table-cell">{t('users.columns.joined')}</TH>
                <TH>{t('users.columns.status')}</TH>
                <TH className="text-right">{t('users.columns.actions')}</TH>
              </TR>
            </THead>
            <TBody>
              {items.map((u) => {
                const isSelf = me?.id === u.id;
                return (
                  <TR key={u.id}>
                    <TD>
                      <Link href={`/users/${u.id}`} className="flex items-center gap-3">
                        <Avatar src={u.photoUrl} name={u.name} size={36} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-ink">{u.name}</p>
                          <p className="truncate text-[11px] text-ink-disabled">#{u.id.slice(0, 8)}</p>
                        </div>
                      </Link>
                    </TD>
                    <TD className="hidden md:table-cell">{u.email}</TD>
                    <TD className="hidden lg:table-cell">
                      <Badge tone={u.state === 'in_match' ? 'success' : u.state === 'in_queue' ? 'info' : 'neutral'}>
                        {t(`users.state.${u.state}`)}
                      </Badge>
                    </TD>
                    <TD className="hidden md:table-cell">
                      {u._count?.reportsReceived ?? 0}
                    </TD>
                    <TD className="hidden lg:table-cell">{formatDate(u.createdAt, locale)}</TD>
                    <TD>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {u.isAdmin ? <Badge tone="brand">{t('users.tag.admin')}</Badge> : null}
                        {u.bannedAt ? (
                          <Badge tone="error">{t('users.tag.banned')}</Badge>
                        ) : !u.isAdmin ? (
                          <Badge tone="success">{t('users.tag.active')}</Badge>
                        ) : null}
                      </div>
                    </TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1.5">
                        {u.bannedAt ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => unbanUser(u)}
                            disabled={isSelf}
                          >
                            {t('users.action.unban')}
                          </Button>
                        ) : (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setBanTarget(u)}
                            disabled={isSelf || u.isAdmin}
                            title={u.isAdmin ? 'Cannot ban an admin' : ''}
                          >
                            <Icon.Ban size={14} />
                            <span className="hidden sm:inline">{t('users.action.ban')}</span>
                          </Button>
                        )}
                        <Button
                          variant="subtle"
                          size="sm"
                          onClick={() => toggleAdminFlag(u)}
                          disabled={isSelf}
                        >
                          <Icon.Shield size={14} />
                          <span className="hidden lg:inline">
                            {u.isAdmin ? t('users.action.revokeAdmin') : t('users.action.makeAdmin')}
                          </span>
                        </Button>
                        <Button
                          variant="subtle"
                          size="sm"
                          onClick={() => setDeleteTarget(u)}
                          disabled={isSelf || u.isAdmin}
                          title={u.isAdmin ? 'Cannot delete an admin' : ''}
                        >
                          <Icon.Trash size={14} />
                        </Button>
                      </div>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        )}
        <div className="border-t border-glass-border px-5">
          <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} />
        </div>
      </Card>

      {banTarget ? (
        <BanUserModal
          user={banTarget}
          onClose={() => setBanTarget(null)}
          onDone={() => {
            setBanTarget(null);
            void fetchUsers();
          }}
        />
      ) : null}

      {deleteTarget ? (
        <DeleteUserModal
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDone={() => {
            setDeleteTarget(null);
            void fetchUsers();
          }}
        />
      ) : null}
    </>
  );
}

function BanUserModal({
  user,
  onClose,
  onDone,
}: {
  user: AdminUser;
  onClose: () => void;
  onDone: () => void;
}) {
  const { t } = useI18n();
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    try {
      await api.post(`/admin/users/${user.id}/ban`, { reason: reason.trim() || undefined });
      toast.success(t('toasts.banned'));
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
      title={t('users.ban.title')}
      subtitle={`${user.name} · ${user.email}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="danger" onClick={submit} loading={submitting}>
            {t('users.ban.confirm')}
          </Button>
        </>
      }
    >
      <p className="mb-4 text-sm text-ink-secondary">{t('users.ban.subtitle')}</p>
      <Input
        label={t('users.ban.reason')}
        placeholder={t('users.ban.reasonPlaceholder')}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        maxLength={500}
      />
    </Modal>
  );
}

function DeleteUserModal({
  user,
  onClose,
  onDone,
}: {
  user: AdminUser;
  onClose: () => void;
  onDone: () => void;
}) {
  const { t } = useI18n();
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    try {
      await api.delete(`/admin/users/${user.id}`);
      toast.success(t('toasts.deleted'));
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
      title={t('users.delete.title')}
      subtitle={`${user.name} · ${user.email}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="danger" onClick={submit} loading={submitting}>
            {t('users.delete.confirm')}
          </Button>
        </>
      }
    >
      <p className="text-sm text-ink-secondary">{t('users.delete.subtitle')}</p>
    </Modal>
  );
}
