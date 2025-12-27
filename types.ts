export type League = 'NFL' | 'NBA' | 'NHL' | 'NCAAB' | 'Soccer' | 'MLB' | 'Tennis' | 'MMA' | 'Other';

export type BetResult = 'win' | 'loss' | 'push' | 'pending' | 'void';

export interface ParlayLeg {
  game: string;
  selection: string;
  league: League;
  odds: number;
}

export interface Bet {
  id: string;
  date: Date;
  game: string;
  selection: string;
  league: League;
  odds: number;
  units: number;
  result: BetResult;
  pnl: number;
  isParlay: boolean;
  parlayLegs?: ParlayLeg[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalPnl: number;
  roi: number;
  winRate: number;
  totalBets: number;
  wins: number;
  losses: number;
  pushes: number;
  currentStreak: {
    type: 'W' | 'L';
    count: number;
  };
  bestStreak: number;
  worstStreak: number;
  unitsRisked: number;
  byLeague: LeagueStats[];
  recentResults: BetResult[];
  bankrollHistory: { date: string; balance: number }[];
}

export interface LeagueStats {
  league: League;
  wins: number;
  losses: number;
  pushes: number;
  pnl: number;
  winRate: number;
  count: number;
}