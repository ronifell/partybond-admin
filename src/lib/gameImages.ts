/** Cache-busted URL for a game's thumbnail (served by the admin API route). */
export function getGameImageUrl(gameId: string, cacheBust?: number | string): string {
  const base = `/api/games/${gameId}/image`;
  if (cacheBust === undefined || cacheBust === '') return base;
  return `${base}?v=${cacheBust}`;
}
