import { League } from './types';

export const LEAGUES: League[] = ['NFL', 'NBA', 'NHL', 'NCAAB', 'Soccer', 'MLB', 'Tennis', 'MMA', 'Other'];

export const LEAGUE_COLORS: Record<League, string> = {
  NFL: '#013369',
  NBA: '#C9082A',
  NHL: '#A5ACAF',
  NCAAB: '#FF6B00',
  Soccer: '#38003C',
  MLB: '#002D72',
  Tennis: '#F59E0B',
  MMA: '#EF4444',
  Other: '#6B7280',
};

export const LEAGUE_ICONS: Record<League, string> = {
  NFL: '🏈',
  NBA: '🏀',
  NHL: '🏒',
  NCAAB: '🏀',
  Soccer: '⚽',
  MLB: '⚾',
  Tennis: '🎾',
  MMA: '🥊',
  Other: '🎯',
};