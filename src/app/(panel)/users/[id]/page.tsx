'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useI18n } from '@/i18n/I18nProvider';
import { useAuth } from '@/lib/auth';
import { api, getApiError } from '@/lib/api';
import type { UserDetailResponse } from '@/lib/types';
import { formatDateTime } from '@/lib/formatters';

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { t, locale } = useI18n();
  const { user: me } = useAuth();
  const [data, setData] = useState<UserDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBan, setShowBan] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<UserDetailResponse>(`/admin/users/${params.id}`);
      setData(res.data);
    } catch (err) {
      toast.error(getApiError(err).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (loading || !data) {
    return (
      <>
        <PageHeader title={t('users.detail.title')} />
        <Card>
          <div className="space-y-4 p-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </Card>
      </>
    );
  }

  const u = data.user;
  const isSelf = me?.id === u.id;

  async function ban() {
    setSubmitting(true);
    try {
      await api.post(`/admin/users/${u.id}/ban`, { reason: banReason.trim() || undefined });
      toast.success(t('toasts.banned'));
      setShowBan(false);
      setBanReason('');
      void load();
    } catch (err) {
      toast.error(getApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function unban() {
    try {
      await api.post(`/admin/users/${u.id}/unban`);
      toast.success(t('toasts.unbanned'));
      void load();
    } catch (err) {
      toast.error(getApiError(err).message);
    }
  }

  async function toggleAdmin() {
    try {
      await api.patch(`/admin/users/${u.id}/admin`, { isAdmin: !u.isAdmin });
      toast.success(u.isAdmin ? t('toasts.demoted') : t('toasts.promoted'));
      void load();
    } catch (err) {
      toast.error(getApiError(err).message);
    }
  }

  async function deleteUser() {
    setSubmitting(true);
    try {
      await api.delete(`/admin/users/${u.id}`);
      toast.success(t('toasts.deleted'));
      router.replace('/users');
    } catch (err) {
      toast.error(getApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        title={u.name}
        subtitle={u.email}
        action={
          <Button variant="ghost" onClick={() => router.back()} leftIcon={<Icon.ChevronRight size={14} className="rotate-180" />}>
            {t('common.back')}
          </Button>
        }
      />

      <Card>
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start">
          <div className="flex items-center gap-4 md:flex-col md:items-start">
            <Avatar src={u.photoUrl} name={u.name} size={96} className="shadow-glow-soft" />
            <div className="flex flex-wrap gap-1.5">
              {u.isAdmin ? <Badge tone="brand">{t('users.tag.admin')}</Badge> : null}
              {u.bannedAt ? (
                <Badge tone="error">{t('users.tag.banned')}</Badge>
              ) : (
                <Badge tone="success">{t('users.tag.active')}</Badge>
              )}
              <Badge tone="info">{t(`users.state.${u.state}`)}</Badge>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3">
            <InfoRow label="ID" value={<code className="text-xs text-ink-secondary">{u.id}</code>} />
            <InfoRow label={t('auth.email')} value={u.email} />
            <InfoRow label="Age" value={String(u.age)} />
            <InfoRow label={t('common.joined')} value={formatDateTime(u.createdAt, locale)} />
            <InfoRow
              label={t('common.lastSeen')}
              value={u.lastSeenAt ? formatDateTime(u.lastSeenAt, locale) : t('common.never')}
            />
            <InfoRow
              label={t('dashboard.totalReports')}
              value={`${u._count.reportsReceived} / ${u._count.reportsFiled}`}
            />
            {u.bannedAt ? (
              <InfoRow
                label={t('users.bannedSince')}
                value={formatDateTime(u.bannedAt, locale)}
              />
            ) : null}
            {u.banReason ? <InfoRow label={t('users.banReason')} value={u.banReason} /> : null}
          </div>

          <div className="flex flex-col gap-2 md:w-48">
            {u.bannedAt ? (
              <Button variant="ghost" onClick={unban} disabled={isSelf}>
                <Icon.Check size={14} /> {t('users.action.unban')}
              </Button>
            ) : (
              <Button
                variant="danger"
                onClick={() => setShowBan(true)}
                disabled={isSelf || u.isAdmin}
              >
                <Icon.Ban size={14} /> {t('users.action.ban')}
              </Button>
            )}
            <Button variant="subtle" onClick={toggleAdmin} disabled={isSelf}>
              <Icon.Shield size={14} />
              {u.isAdmin ? t('users.action.revokeAdmin') : t('users.action.makeAdmin')}
            </Button>
            <Button
              variant="subtle"
              onClick={() => setShowDelete(true)}
              disabled={isSelf || u.isAdmin}
            >
              <Icon.Trash size={14} /> {t('users.action.delete')}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-secondary">
              {t('users.detail.gameProfiles')}
            </h2>
            {u.gameProfiles.length === 0 ? (
              <p className="text-sm text-ink-disabled">{t('users.detail.noGameProfiles')}</p>
            ) : (
              <ul className="space-y-2">
                {u.gameProfiles.map((p) => (
                  <li
                    key={p.gameId}
                    className="flex items-center justify-between rounded-xl2 border border-glass-border bg-glass-highlight px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink">{p.game.name}</p>
                      <p className="text-xs text-ink-secondary">{p.nickname}</p>
                    </div>
                    <code className="rounded-md bg-bg-card px-2 py-1 text-[11px] text-ink-secondary">
                      {p.playerId}
                    </code>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-secondary">
              {t('users.detail.recentReports')}
            </h2>
            {data.recentReportsReceived.length === 0 ? (
              <p className="text-sm text-ink-disabled">{t('users.detail.noRecentReports')}</p>
            ) : (
              <ul className="space-y-2">
                {data.recentReportsReceived.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-xl2 border border-glass-border bg-glass-highlight px-3 py-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink">
                          {t(`reports.category.${r.category}`)}
                        </p>
                        <p className="mt-0.5 text-xs text-ink-secondary">
                          {t('reports.columns.reporter')}:{' '}
                          <Link href={`/users/${r.reporter.id}`} className="underline">
                            {r.reporter.name}
                          </Link>
                        </p>
                        {r.details ? (
                          <p className="mt-1 text-xs text-ink-secondary">{r.details}</p>
                        ) : null}
                      </div>
                      <Badge
                        tone={
                          r.status === 'open' ? 'warn' : r.status === 'reviewed' ? 'info' : 'neutral'
                        }
                      >
                        {t(`reports.status.${r.status}`)}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      <Modal
        open={showBan}
        onClose={() => setShowBan(false)}
        title={t('users.ban.title')}
        subtitle={u.name}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowBan(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="danger" onClick={ban} loading={submitting}>
              {t('users.ban.confirm')}
            </Button>
          </>
        }
      >
        <p className="mb-4 text-sm text-ink-secondary">{t('users.ban.subtitle')}</p>
        <Input
          label={t('users.ban.reason')}
          placeholder={t('users.ban.reasonPlaceholder')}
          value={banReason}
          onChange={(e) => setBanReason(e.target.value)}
        />
      </Modal>

      <Modal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title={t('users.delete.title')}
        subtitle={u.name}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowDelete(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="danger" onClick={deleteUser} loading={submitting}>
              {t('users.delete.confirm')}
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-secondary">{t('users.delete.subtitle')}</p>
      </Modal>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-disabled">{label}</p>
      <div className="mt-1 text-sm text-ink">{value}</div>
    </div>
  );
}
