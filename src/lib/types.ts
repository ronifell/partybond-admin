export type UserState = 'idle' | 'in_queue' | 'in_match';
export type GameStatus = 'active' | 'coming_soon';
export type SessionStatus = 'open' | 'active' | 'finished';
export type MatchStatus = 'active' | 'finished' | 'expired';
export type ReportStatus = 'open' | 'reviewed' | 'dismissed';
export type ReportCategory =
  | 'spam'
  | 'harassment'
  | 'offensive_language'
  | 'inappropriate_content'
  | 'other';
export type InteractionType =
  | 'add_me'
  | 'already_added'
  | 'enter_lobby'
  | 'waiting'
  | 'did_not_work';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  age: number;
  photoUrl: string | null;
  selectedGame: string | null;
  state: UserState;
  locale: string;
  isAdmin: boolean;
  bannedAt: string | null;
  banReason: string | null;
  lastSeenAt: string | null;
  createdAt: string;
  _count?: { reportsReceived?: number; reportsFiled?: number };
}

export interface DashboardStats {
  counts: {
    users: number;
    newUsers24h: number;
    newUsers7d: number;
    bannedUsers: number;
    admins: number;
    games: number;
    activeGames: number;
    sessions: number;
    openSessions: number;
    activeMatches: number;
    finishedMatches: number;
    openReports: number;
    totalReports: number;
  };
  recentRegistrations: Array<{
    id: string;
    name: string;
    email: string;
    photoUrl: string | null;
    createdAt: string;
  }>;
  matchesChart: Array<{ day: string; matches: number; ended: number }>;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedId: string;
  category: ReportCategory;
  details: string | null;
  status: ReportStatus;
  adminNote: string | null;
  resolvedAt: string | null;
  resolvedById: string | null;
  createdAt: string;
  reporter: { id: string; name: string; email: string; photoUrl: string | null };
  reported: {
    id: string;
    name: string;
    email: string;
    photoUrl: string | null;
    bannedAt: string | null;
  };
}

export interface Game {
  id: string;
  name: string;
  status: GameStatus;
  maxPlayers: number;
  createdAt?: string;
  updatedAt?: string;
  _count?: { sessions?: number; gameProfiles?: number };
}

export interface AdminSession {
  id: string;
  gameId: string;
  title: string;
  createdById: string;
  gameMode: 'casual' | 'competitive';
  skillTier: 'beginner' | 'intermediate' | 'advanced' | 'veteran';
  playStyle: 'relaxed' | 'focused' | null;
  playersNeeded: number;
  scheduledAt: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  game: { id: string; name: string };
  createdBy: { id: string; name: string; email: string };
  _count: { queue: number; matches: number };
}

export interface AdminMatch {
  id: string;
  sessionId: string;
  userAId: string;
  userBId: string;
  status: MatchStatus;
  startedAt: string;
  endedAt: string | null;
  expiresAt: string;
  session: { id: string; title: string; gameId: string };
  userA: { id: string; name: string; email: string; photoUrl: string | null };
  userB: { id: string; name: string; email: string; photoUrl: string | null };
  _count: { interactions: number };
}

export interface MatchWithInteractions {
  id: string;
  status: MatchStatus;
  startedAt: string;
  endedAt: string | null;
  userA: { id: string; name: string; photoUrl: string | null };
  userB: { id: string; name: string; photoUrl: string | null };
  interactions: Array<{
    id: string;
    matchId: string;
    userId: string;
    type: InteractionType;
    createdAt: string;
    user: { id: string; name: string; photoUrl: string | null };
  }>;
}

export interface UserDetailResponse {
  user: AdminUser & {
    gameProfiles: Array<{
      gameId: string;
      nickname: string;
      playerId: string;
      game: { id: string; name: string };
    }>;
    _count: {
      reportsReceived: number;
      reportsFiled: number;
      matchesAsA: number;
      matchesAsB: number;
      createdSessions: number;
    };
  };
  recentReportsReceived: Array<{
    id: string;
    category: ReportCategory;
    details: string | null;
    status: ReportStatus;
    createdAt: string;
    reporter: { id: string; name: string; email: string };
  }>;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
