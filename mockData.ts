import { Bet, League, BetResult } from './types';
import { subDays, format } from 'date-fns';

const generateMockBets = (): Bet[] => {
  const bets: Bet[] = [];
  const now = new Date();
  
  // Historical bets (last 60 days)
  for (let i = 0; i < 60; i++) {
    const date = subDays(now, i);
    const numBets = Math.floor(Math.random() * 4); // 0-3 bets per day
    
    for (let j = 0; j < numBets; j++) {
      const isWin = Math.random() > 0.45; // ~55% win rate
      const result: BetResult = isWin ? 'win' : (Math.random() > 0.9 ? 'push' : 'loss');
      const odds = Math.floor(Math.random() * 300) - 150; // -150 to +150 approx range logic
      const adjustedOdds = odds === 0 ? 100 : (Math.abs(odds) < 100 ? (odds < 0 ? odds - 100 : odds + 100) : odds);
      
      const units = Math.random() > 0.8 ? 2 : 1;
      
      let pnl = 0;
      if (result === 'win') {
        pnl = adjustedOdds > 0 ? (adjustedOdds / 100) * units : (100 / Math.abs(adjustedOdds)) * units;
      } else if (result === 'loss') {
        pnl = -units;
      }

      bets.push({
        id: `hist-${i}-${j}`,
        date: date,
        game: getRandomMatchup(),
        selection: getRandomSelection(),
        league: getRandomLeague(),
        odds: adjustedOdds,
        units: units,
        result: result,
        pnl: Number(pnl.toFixed(2)),
        isParlay: false,
        createdAt: date,
        updatedAt: date,
      });
    }
  }

  // Active bets
  const activeBets: Bet[] = [
    {
      id: 'active-1',
      date: new Date(),
      game: 'Lakers vs Celtics',
      selection: 'OVER 217.5',
      league: 'NBA',
      odds: -110,
      units: 2.0,
      result: 'pending',
      pnl: 0,
      isParlay: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'active-2',
      date: new Date(),
      game: 'Chiefs vs Bills',
      selection: 'CHIEFS -3.5',
      league: 'NFL',
      odds: -105,
      units: 1.5,
      result: 'pending',
      pnl: 0,
      isParlay: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'active-3',
      date: subDays(new Date(), -1),
      game: 'Duke vs UNC',
      selection: 'DUKE -7',
      league: 'NCAAB',
      odds: -110,
      units: 1.0,
      result: 'pending',
      pnl: 0,
      isParlay: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  return [...activeBets, ...bets].sort((a, b) => b.date.getTime() - a.date.getTime());
};

function getRandomLeague(): League {
  const leagues: League[] = ['NBA', 'NBA', 'NFL', 'NFL', 'NHL', 'NCAAB', 'Soccer', 'MLB'];
  return leagues[Math.floor(Math.random() * leagues.length)];
}

function getRandomMatchup(): string {
  const teams = ['LAL', 'BOS', 'GSW', 'MIA', 'DEN', 'PHI', 'MIL', 'PHX', 'KC', 'BUF', 'BAL', 'CIN'];
  return `${teams[Math.floor(Math.random() * teams.length)]} vs ${teams[Math.floor(Math.random() * teams.length)]}`;
}

function getRandomSelection(): string {
  const types = ['Over', 'Under', 'ML', '-3.5', '+4.5', '-110', '+105'];
  return `${types[Math.floor(Math.random() * types.length)]}`;
}

export const MOCK_BETS = generateMockBets();