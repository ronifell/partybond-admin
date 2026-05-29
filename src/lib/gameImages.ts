import { getApiUrl } from './api';

/** Cache-busted URL for a game's thumbnail (served by the backend API). */
export function getGameImageUrl(gameId: string, cacheBust?: number | string): string {
  const base = `${getApiUrl()}/game-images/${gameId}`;
  if (cacheBust === undefined || cacheBust === '') return base;
  return `${base}?v=${cacheBust}`;
}
