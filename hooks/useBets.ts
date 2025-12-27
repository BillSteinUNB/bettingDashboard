import { useState, useMemo, useEffect } from 'react';
import { Bet, DashboardStats, BetResult, LeagueStats } from '../types';
import { MOCK_BETS } from '../mockData';
import { calculatePnl } from '../utils';

export const useBets = () => {
  // Load initial bets from localStorage or fallback to Mock Data
  const [bets, setBets] = useState<Bet[]>(() => {
    const saved = localStorage.getItem('bettracker_bets');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Revive dates
        return parsed.map((b: any) => ({ ...b, date: new Date(b.date), createdAt: new Date(b.createdAt), updatedAt: new Date(b.updatedAt) }));
      } catch (e) {
        return MOCK_BETS;
      }
    }
    return MOCK_BETS;
  });

  useEffect(() => {
    localStorage.setItem('bettracker_bets', JSON.stringify(bets));
  }, [bets]);

  const addBet = (newBetData: Partial<Bet>) => {
    const newBet: Bet = {
      id: `bet-${Date.now()}`,
      date: new Date(),
      game: '',
      selection: '',
      league: 'Other',
      odds: -110,
      units: 1,
      result: 'pending',
      pnl: 0,
      isParlay: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...newBetData,
    };
    setBets(prev => [newBet, ...prev]);
  };

  const updateBetResult = (id: string, result: BetResult) => {
    setBets(prev => prev.map(bet => {
      if (bet.id !== id) return bet;
      
      const pnl = calculatePnl(bet.odds, bet.units, result);
      return { ...bet, result, pnl, updatedAt: new Date() };
    }));
  };

  const deleteBet = (id: string) => {
    setBets(prev => prev.filter(b => b.id !== id));
  };

  const stats: DashboardStats = useMemo(() => {
    const resolved = bets.filter(b => b.result !== 'pending');
    
    // Basic Counts
    const wins = resolved.filter(b => b.result === 'win').length;
    const losses = resolved.filter(b => b.result === 'loss').length;
    const pushes = resolved.filter(b => b.result === 'push').length;
    const totalBets = resolved.length;

    // Financials
    const totalPnl = resolved.reduce((acc, b) => acc + b.pnl, 0);
    const unitsRisked = resolved.reduce((acc, b) => acc + b.units, 0);
    const roi = unitsRisked > 0 ? (totalPnl / unitsRisked) * 100 : 0;
    const winRate = totalBets > 0 ? (wins / (wins + losses)) * 100 : 0;

    // Streak
    let currentStreakCount = 0;
    let currentStreakType: 'W' | 'L' | null = null;
    // Sort by date descending for streak calc (most recent first)
    const sortedResolved = [...resolved].sort((a, b) => b.date.getTime() - a.date.getTime());
    
    for (const bet of sortedResolved) {
      if (bet.result === 'push') continue;
      const type = bet.result === 'win' ? 'W' : 'L';
      if (currentStreakType === null) {
        currentStreakType = type;
        currentStreakCount = 1;
      } else if (currentStreakType === type) {
        currentStreakCount++;
      } else {
        break;
      }
    }

    // Bankroll History (Cumulative PnL over time)
    // Sort ascending for chart
    const sortedForChart = [...resolved].sort((a, b) => a.date.getTime() - b.date.getTime());
    let runningBalance = 0;
    const bankrollHistory = sortedForChart.map(b => {
      runningBalance += b.pnl;
      return {
        date: b.date.toISOString().split('T')[0], // Simplified date
        balance: Number(runningBalance.toFixed(2))
      };
    });

    // League Stats
    const leagueMap: Record<string, LeagueStats> = {};
    resolved.forEach(bet => {
      if (!leagueMap[bet.league]) {
        leagueMap[bet.league] = { league: bet.league, wins: 0, losses: 0, pushes: 0, pnl: 0, winRate: 0, count: 0 };
      }
      const s = leagueMap[bet.league];
      s.count++;
      s.pnl += bet.pnl;
      if (bet.result === 'win') s.wins++;
      else if (bet.result === 'loss') s.losses++;
      else if (bet.result === 'push') s.pushes++;
    });

    const byLeague = Object.values(leagueMap).map(l => ({
      ...l,
      winRate: (l.wins / (l.wins + l.losses)) * 100 || 0
    }));

    return {
      totalPnl,
      roi,
      winRate,
      totalBets,
      wins,
      losses,
      pushes,
      currentStreak: { type: currentStreakType || 'W', count: currentStreakCount },
      bestStreak: 8, // Mocked for now complexity
      worstStreak: -6,
      unitsRisked,
      byLeague,
      recentResults: sortedResolved.slice(0, 10).map(b => b.result),
      bankrollHistory
    };
  }, [bets]);

  return {
    bets,
    stats,
    addBet,
    updateBetResult,
    deleteBet
  };
};