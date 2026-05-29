export type GameAccent = {
  border: string;
  glow: string;
  tagBg: string;
  tagText: string;
  /** Opaque card background — no transparency. */
  fill: string;
};

export const DISABLED_GAME_CARD_FILL = '#0A0A12';

export const DEFAULT_GAME_ACCENT: GameAccent = {
  border: 'rgba(123, 63, 242, 0.45)',
  glow: 'rgba(123, 63, 242, 0.14)',
  tagBg: 'rgba(123, 63, 242, 0.22)',
  tagText: '#D4C4FF',
  fill: '#14101F',
};

export const GAME_ACCENTS: Record<string, GameAccent> = {
  cod_mobile: {
    border: 'rgba(255, 193, 7, 0.5)',
    glow: 'rgba(255, 193, 7, 0.1)',
    tagBg: 'rgba(255, 193, 7, 0.18)',
    tagText: '#FFD54F',
    fill: '#1A1608',
  },
  counter_strike_2: {
    border: 'rgba(255, 152, 0, 0.5)',
    glow: 'rgba(255, 152, 0, 0.1)',
    tagBg: 'rgba(255, 152, 0, 0.18)',
    tagText: '#FFB74D',
    fill: '#1A1208',
  },
  ea_sports_fc_26: {
    border: 'rgba(0, 180, 255, 0.5)',
    glow: 'rgba(0, 180, 255, 0.1)',
    tagBg: 'rgba(0, 180, 255, 0.18)',
    tagText: '#81D4FA',
    fill: '#081420',
  },
  elden_ring_nightreign: {
    border: 'rgba(180, 140, 255, 0.55)',
    glow: 'rgba(180, 140, 255, 0.12)',
    tagBg: 'rgba(180, 140, 255, 0.2)',
    tagText: '#CE93D8',
    fill: '#15101F',
  },
  fortnite: {
    border: 'rgba(200, 100, 255, 0.5)',
    glow: 'rgba(200, 100, 255, 0.1)',
    tagBg: 'rgba(200, 100, 255, 0.18)',
    tagText: '#E1BEE7',
    fill: '#160F1A',
  },
  free_fire: {
    border: 'rgba(255, 200, 80, 0.5)',
    glow: 'rgba(255, 200, 80, 0.1)',
    tagBg: 'rgba(255, 200, 80, 0.18)',
    tagText: '#FFE082',
    fill: '#1A160A',
  },
  league_of_legends: {
    border: 'rgba(0, 210, 220, 0.5)',
    glow: 'rgba(0, 210, 220, 0.1)',
    tagBg: 'rgba(0, 210, 220, 0.18)',
    tagText: '#80DEEA',
    fill: '#081618',
  },
  minecraft: {
    border: 'rgba(76, 200, 120, 0.5)',
    glow: 'rgba(76, 200, 120, 0.1)',
    tagBg: 'rgba(76, 200, 120, 0.18)',
    tagText: '#A5D6A7',
    fill: '#0A1610',
  },
  roblox: {
    border: 'rgba(255, 100, 120, 0.5)',
    glow: 'rgba(255, 100, 120, 0.1)',
    tagBg: 'rgba(255, 100, 120, 0.18)',
    tagText: '#F48FB1',
    fill: '#1A0E12',
  },
  valorant: {
    border: 'rgba(255, 70, 85, 0.5)',
    glow: 'rgba(255, 70, 85, 0.1)',
    tagBg: 'rgba(255, 70, 85, 0.18)',
    tagText: '#FF8A80',
    fill: '#1A0C10',
  },
  pubg_mobile: {
    border: 'rgba(255, 167, 38, 0.5)',
    glow: 'rgba(255, 167, 38, 0.1)',
    tagBg: 'rgba(255, 167, 38, 0.18)',
    tagText: '#FFCC80',
    fill: '#1A1208',
  },
  mobile_legends: {
    border: 'rgba(66, 165, 245, 0.5)',
    glow: 'rgba(66, 165, 245, 0.1)',
    tagBg: 'rgba(66, 165, 245, 0.18)',
    tagText: '#90CAF9',
    fill: '#081420',
  },
};

export function getGameAccent(gameId: string): GameAccent {
  return GAME_ACCENTS[gameId] ?? DEFAULT_GAME_ACCENT;
}
