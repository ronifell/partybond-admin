'use client';

import { useEffect, useState, useCallback, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Icon } from '@/components/ui/Icon';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { useI18n } from '@/i18n/I18nProvider';
import { api, getApiError } from '@/lib/api';
import type { Game, GameStatus } from '@/lib/types';

export default function GamesPage() {
  const { t } = useI18n();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Game | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Game | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ games: Game[] }>('/admin/games');
      setGames(res.data.games);
    } catch (err) {
      toast.error(getApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function deleteGame() {
    if (!deleting) return;
    try {
      await api.delete(`/admin/games/${deleting.id}`);
      toast.success(t('toasts.gameDeleted'));
      setDeleting(null);
      void load();
    } catch (err) {
      toast.error(getApiError(err).message);
    }
  }

  return (
    <>
      <PageHeader
        title={t('games.title')}
        subtitle={t('games.subtitle')}
        action={
          <Button onClick={() => setCreating(true)} leftIcon={<Icon.Plus size={14} />}>
            {t('games.addGame')}
          </Button>
        }
      />

      <Card className="overflow-hidden">
        {loading ? (
          <div className="space-y-2 p-5">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : games.length === 0 ? (
          <EmptyState
            title={t('common.empty')}
            subtitle={t('games.subtitle')}
            className="border-0 bg-transparent"
            action={
              <Button onClick={() => setCreating(true)} leftIcon={<Icon.Plus size={14} />}>
                {t('games.addGame')}
              </Button>
            }
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>{t('games.columns.game')}</TH>
                <TH className="hidden md:table-cell">{t('games.columns.id')}</TH>
                <TH>{t('games.columns.status')}</TH>
                <TH className="hidden sm:table-cell">{t('games.columns.maxPlayers')}</TH>
                <TH className="hidden md:table-cell">{t('games.columns.sessions')}</TH>
                <TH className="hidden md:table-cell">{t('games.columns.players')}</TH>
                <TH className="text-right">{t('games.columns.actions')}</TH>
              </TR>
            </THead>
            <TBody>
              {games.map((g) => (
                <TR key={g.id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient-soft text-base font-bold text-ink">
                        {g.name[0]?.toUpperCase()}
                      </span>
                      <p className="font-semibold text-ink">{g.name}</p>
                    </div>
                  </TD>
                  <TD className="hidden md:table-cell">
                    <code className="rounded-md bg-bg-card px-2 py-0.5 text-[11px] text-ink-secondary">
                      {g.id}
                    </code>
                  </TD>
                  <TD>
                    <Badge tone={g.status === 'active' ? 'success' : 'warn'}>
                      {t(`games.status.${g.status}`)}
                    </Badge>
                  </TD>
                  <TD className="hidden sm:table-cell">{g.maxPlayers}</TD>
                  <TD className="hidden md:table-cell">{g._count?.sessions ?? 0}</TD>
                  <TD className="hidden md:table-cell">{g._count?.gameProfiles ?? 0}</TD>
                  <TD>
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="ghost" size="sm" onClick={() => setEditing(g)}>
                        <Icon.Edit size={14} />
                        <span className="hidden sm:inline">{t('common.edit')}</span>
                      </Button>
                      <Button
                        variant="subtle"
                        size="sm"
                        onClick={() => setDeleting(g)}
                        disabled={(g._count?.sessions ?? 0) > 0 || (g._count?.gameProfiles ?? 0) > 0}
                        title={
                          (g._count?.sessions ?? 0) > 0 || (g._count?.gameProfiles ?? 0) > 0
                            ? t('games.deleteSubtitle')
                            : undefined
                        }
                      >
                        <Icon.Trash size={14} />
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>

      {creating ? (
        <GameFormModal
          onClose={() => setCreating(false)}
          onDone={() => {
            setCreating(false);
            void load();
          }}
        />
      ) : null}

      {editing ? (
        <GameFormModal
          game={editing}
          onClose={() => setEditing(null)}
          onDone={() => {
            setEditing(null);
            void load();
          }}
        />
      ) : null}

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title={t('games.deleteTitle')}
        subtitle={deleting?.name}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              {t('common.cancel')}
            </Button>
            <Button variant="danger" onClick={deleteGame}>
              {t('games.deleteConfirm')}
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-secondary">{t('games.deleteSubtitle')}</p>
      </Modal>
    </>
  );
}

function GameFormModal({
  game,
  onClose,
  onDone,
}: {
  game?: Game;
  onClose: () => void;
  onDone: () => void;
}) {
  const { t } = useI18n();
  const isEdit = !!game;
  const [id, setId] = useState(game?.id ?? '');
  const [name, setName] = useState(game?.name ?? '');
  const [status, setStatus] = useState<GameStatus>(game?.status ?? 'coming_soon');
  const [maxPlayers, setMaxPlayers] = useState(String(game?.maxPlayers ?? 4));
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!isEdit && !/^[a-z][a-z0-9_]{1,40}$/.test(id)) {
      next.id = t('games.form.idHint');
    }
    if (name.trim().length < 2) next.name = '!';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      if (isEdit) {
        await api.patch(`/admin/games/${game!.id}`, {
          name,
          status,
          maxPlayers: Number(maxPlayers),
        });
        toast.success(t('toasts.gameUpdated'));
      } else {
        await api.post('/admin/games', {
          id,
          name,
          status,
          maxPlayers: Number(maxPlayers),
        });
        toast.success(t('toasts.gameCreated'));
      }
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
      title={isEdit ? t('games.editGame') : t('games.addGame')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={submit} loading={submitting}>
            {isEdit ? t('games.form.update') : t('games.form.create')}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {!isEdit ? (
          <Input
            label={t('games.form.id')}
            hint={t('games.form.idHint')}
            value={id}
            onChange={(e) => setId(e.target.value.toLowerCase())}
            error={errors.id}
            required
          />
        ) : null}
        <Input
          label={t('games.form.name')}
          placeholder={t('games.form.namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <Select
            label={t('games.form.status')}
            value={status}
            onChange={(e) => setStatus(e.target.value as GameStatus)}
          >
            <option value="active">{t('games.status.active')}</option>
            <option value="coming_soon">{t('games.status.coming_soon')}</option>
          </Select>
          <Input
            label={t('games.form.maxPlayers')}
            type="number"
            min={2}
            max={50}
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
}
