import { getApiUrl } from './api';

/** Primary URL (backend) plus local Next.js public fallback for the admin panel. */
export function getGameImageUrls(gameId: string, cacheBust?: number | string): string[] {
  const qs = cacheBust !== undefined && cacheBust !== '' ? `?v=${cacheBust}` : '';
  return [`${getApiUrl()}/game-images/${gameId}${qs}`, `/games/${gameId}.png${qs}`];
}

/** Cache-busted URL for a game's thumbnail (served by the backend API). */
export function getGameImageUrl(gameId: string, cacheBust?: number | string): string {
  return getGameImageUrls(gameId, cacheBust)[0]!;
}
