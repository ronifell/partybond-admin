'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { DISABLED_GAME_CARD_FILL, getGameAccent } from '@/lib/gameAccents';
import { getGameImageUrl } from '@/lib/gameImages';
import type { Game } from '@/lib/types';

const IMAGE_WIDTH = 96;
const CARD_RADIUS = 18;

function StatusBadge({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg width={13} height={13} viewBox="0 0 24 24" fill="white" aria-hidden>
        <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
      </svg>
    );
  }

  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function GameThumbnail({
  gameId,
  name,
  refreshKey,
  disabled,
  accentTagBg,
  accentBorder,
}: {
  gameId: string;
  name: string;
  refreshKey?: number;
  disabled: boolean;
  accentTagBg: string;
  accentBorder: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = getGameImageUrl(gameId, refreshKey);

  return (
    <div
      className="relative shrink-0 self-stretch overflow-hidden bg-[#1A1230]"
      style={{
        width: IMAGE_WIDTH,
        borderTopLeftRadius: CARD_RADIUS,
        borderBottomLeftRadius: CARD_RADIUS,
      }}
    >
      {!failed ? (
        <img
          key={src}
          src={src}
          alt={name}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full min-h-[148px] w-full items-center justify-center bg-brand-gradient">
          <span className="text-3xl font-bold text-white">{name[0]?.toUpperCase()}</span>
        </div>
      )}

      <div
        className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-[7px]"
        style={{
          backgroundColor: disabled ? 'rgba(107, 107, 128, 0.85)' : accentTagBg,
          border: disabled ? 'none' : `1px solid ${accentBorder}`,
          boxShadow: disabled ? 'none' : `0 0 6px ${accentBorder}`,
        }}
      >
        <StatusBadge active={!disabled} />
      </div>
    </div>
  );
}

interface AdminGameCardProps {
  game: Game;
  refreshKey?: number;
  onEdit: () => void;
  onDelete: () => void;
  deleteDisabled: boolean;
  deleteTitle?: string;
  labels: {
    maxPlayers: string;
    sessions: string;
    players: string;
    edit: string;
    active: string;
    soon: string;
  };
}

export function AdminGameCard({
  game,
  refreshKey,
  onEdit,
  onDelete,
  deleteDisabled,
  deleteTitle,
  labels,
}: AdminGameCardProps) {
  const disabled = game.status === 'coming_soon';
  const accent = getGameAccent(game.id);
  const sessions = game._count?.sessions ?? 0;
  const players = game._count?.gameProfiles ?? 0;

  return (
    <article
      style={{
        borderRadius: CARD_RADIUS,
        border: `1.5px solid ${disabled ? 'rgba(255,255,255,0.12)' : accent.border}`,
        backgroundColor: disabled ? DISABLED_GAME_CARD_FILL : accent.fill,
        boxShadow: disabled ? 'none' : `0 4px 10px ${accent.tagText}40`,
      }}
    >
      <div className="flex items-stretch">
        <GameThumbnail
          gameId={game.id}
          name={game.name}
          refreshKey={refreshKey}
          disabled={disabled}
          accentTagBg={accent.tagBg}
          accentBorder={accent.border}
        />

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 px-3 py-3">
          <div>
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-extrabold tracking-tight text-white">{game.name}</h3>
                <p className="mt-0.5 truncate font-mono text-[11px] font-medium text-ink-secondary">{game.id}</p>
              </div>

              <div className="mt-0.5 flex shrink-0 items-center gap-1">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: disabled ? '#6B6B80' : '#00C853',
                    boxShadow: disabled ? 'none' : '0 0 4px rgba(0, 200, 83, 0.8)',
                  }}
                />
                <span
                  className="max-w-[4.5rem] truncate text-[10px] font-bold"
                  style={{ color: disabled ? '#6B6B80' : '#00C853' }}
                >
                  {disabled ? labels.soon : labels.active}
                </span>
              </div>
            </div>

            <dl className="mt-2 grid grid-cols-3 gap-1 text-[10px]">
              <div>
                <dt className="font-medium uppercase tracking-wide text-ink-disabled">{labels.maxPlayers}</dt>
                <dd className="font-bold text-white">{game.maxPlayers}</dd>
              </div>
              <div>
                <dt className="font-medium uppercase tracking-wide text-ink-disabled">{labels.sessions}</dt>
                <dd className="font-bold text-white">{sessions}</dd>
              </div>
              <div>
                <dt className="font-medium uppercase tracking-wide text-ink-disabled">{labels.players}</dt>
                <dd className="font-bold text-white">{players}</dd>
              </div>
            </dl>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onEdit}
              className="relative flex h-8 min-h-0 flex-1 items-center justify-center gap-1 overflow-hidden rounded-[11px] bg-brand-gradient px-2.5 text-[11px] font-extrabold tracking-wide text-white transition-all hover:brightness-110 active:scale-[0.98]"
              style={{
                boxShadow: `0 4px 10px ${accent.tagText}66`,
              }}
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-white/30 to-transparent"
                aria-hidden
              />
              <Icon.Edit size={12} />
              <span>{labels.edit}</span>
            </button>
            <Button
              variant="subtle"
              size="sm"
              onClick={onDelete}
              disabled={deleteDisabled}
              title={deleteTitle}
              className="h-8 min-h-0 rounded-[11px] px-2.5"
            >
              <Icon.Trash size={12} />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
