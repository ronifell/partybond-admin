'use client';

import { useEffect, useState, useCallback, useRef, type FormEvent, type ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Icon } from '@/components/ui/Icon';
import { AdminGameCard } from '@/components/games/AdminGameCard';
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
  const [refreshKey, setRefreshKey] = useState(0);

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

      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[152px] w-full rounded-2xl" />
          ))}
        </div>
      ) : games.length === 0 ? (
        <Card className="overflow-hidden">
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
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {games.map((g) => (
            <AdminGameCard
              key={`${g.id}-${refreshKey}`}
              game={g}
              refreshKey={refreshKey}
              onEdit={() => setEditing(g)}
              onDelete={() => setDeleting(g)}
              deleteDisabled={(g._count?.sessions ?? 0) > 0 || (g._count?.gameProfiles ?? 0) > 0}
              deleteTitle={
                (g._count?.sessions ?? 0) > 0 || (g._count?.gameProfiles ?? 0) > 0
                  ? t('games.deleteSubtitle')
                  : undefined
              }
              labels={{
                maxPlayers: t('games.columns.maxPlayers'),
                sessions: t('games.columns.sessions'),
                players: t('games.columns.players'),
                edit: t('common.edit'),
                active: t('games.status.active'),
                soon: t('games.status.coming_soon'),
              }}
            />
          ))}
        </div>
      )}

      {creating ? (
        <GameFormModal
          onClose={() => setCreating(false)}
          onDone={() => {
            setCreating(false);
            setRefreshKey((k) => k + 1);
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
            setRefreshKey((k) => k + 1);
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

/* ── Create / Edit modal ── */
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

  /* image upload */
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageError, setExistingImageError] = useState(false);

  const existingImageSrc = isEdit ? `/games/${game!.id}.png?v=${Date.now()}` : null;

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  }

  async function uploadImage(gameId: string): Promise<void> {
    if (!imageFile) return;
    const form = new FormData();
    form.append('image', imageFile);
    const res = await fetch(`/api/games/${gameId}/image`, { method: 'POST', body: form });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(body.error ?? t('games.form.imageUploadError'));
    }
  }

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
      const savedId = isEdit ? game!.id : id;

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

      if (imageFile) {
        await uploadImage(savedId);
      }

      onDone();
    } catch (err) {
      toast.error(getApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  }

  const previewSrc = imagePreview ?? (isEdit && !existingImageError ? existingImageSrc : null);

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
        {/* Image upload */}
        <div>
          <label className="label-base">{t('games.form.image')}</label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl2 border border-dashed border-glass-border bg-black/40 transition-colors hover:border-brand-purple/60 hover:bg-brand-purple/5"
            style={{ minHeight: previewSrc ? '120px' : '84px' }}
          >
            {previewSrc ? (
              <>
                <img
                  src={previewSrc}
                  alt=""
                  onError={() => setExistingImageError(true)}
                  className="max-h-[160px] w-full rounded-xl object-contain py-2"
                />
                <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <Icon.Edit size={13} />
                    {t('games.form.imageChange')}
                  </span>
                </span>
              </>
            ) : (
              <span className="flex flex-col items-center gap-1 py-5 text-ink-disabled">
                <Icon.Upload size={20} />
                <span className="text-xs">{t('games.form.imagePlaceholder')}</span>
                <span className="text-[10px] text-ink-disabled/60">{t('games.form.imageHint')}</span>
              </span>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

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
