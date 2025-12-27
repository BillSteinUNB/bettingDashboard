import { BetResult, Bet } from './types';

export function calculatePnl(odds: number, units: number, result: BetResult): number {
  if (result === 'push' || result === 'pending' || result === 'void') return 0;
  if (result === 'loss') return -units;
  
  if (odds > 0) {
    return (odds / 100) * units;
  } else {
    return (100 / Math.abs(odds)) * units;
  }
}

export function calculatePotentialPayout(odds: number, units: number): number {
  if (odds > 0) {
    return (odds / 100) * units;
  } else {
    return (100 / Math.abs(odds)) * units;
  }
}

export function formatOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`;
}

export function formatMoney(amount: number, showSign = true): string {
  const abs = Math.abs(amount).toFixed(2);
  const sign = amount >= 0 ? '+' : '-';
  if (!showSign) return abs;
  return `${sign}${abs}`;
}

export function getResultColor(result: BetResult) {
  switch (result) {
    case 'win': return 'text-win';
    case 'loss': return 'text-loss';
    case 'push': return 'text-muted';
    case 'pending': return 'text-pending';
    case 'void': return 'text-muted';
    default: return 'text-primary';
  }
}

export function getResultBg(result: BetResult) {
  switch (result) {
    case 'win': return 'bg-win/10 border-win/20';
    case 'loss': return 'bg-loss/10 border-loss/20';
    case 'push': return 'bg-muted/10 border-muted/20';
    case 'pending': return 'bg-pending/10 border-pending/20';
    default: return 'bg-surface border-border';
  }
}