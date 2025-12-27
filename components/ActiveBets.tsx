import React from 'react';
import { Bet, BetResult } from '../types';
import { formatOdds, calculatePotentialPayout, getResultColor } from '../utils';
import { LEAGUE_ICONS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Minus, Trash2 } from 'lucide-react';

interface ActiveBetsProps {
  bets: Bet[];
  onResolve: (id: string, result: BetResult) => void;
}

const ActiveBets: React.FC<ActiveBetsProps> = ({ bets, onResolve }) => {
  const pendingBets = bets.filter(b => b.result === 'pending');
  const potentialWin = pendingBets.reduce((acc, b) => acc + calculatePotentialPayout(b.odds, b.units), 0);
  const totalRisk = pendingBets.reduce((acc, b) => acc + b.units, 0);

  if (pendingBets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        <div className="w-20 h-20 bg-surfaceHigh rounded-full flex items-center justify-center mb-6 border border-border">
          <span className="text-4xl">🎯</span>
        </div>
        <h2 className="text-2xl font-display text-primary mb-2">No active bets</h2>
        <p className="text-muted max-w-sm">All caught up! The board is clear. Ready for your next play?</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 lg:p-8 space-y-6">
      
      {/* Header Summary */}
      <div className="flex justify-between items-end border-b border-border pb-4">
        <div>
           <h2 className="text-xl font-display text-primary tracking-wide">Active Action</h2>
           <p className="text-sm text-muted">{pendingBets.length} pending</p>
        </div>
        <div className="text-right">
           <div className="text-xs text-muted uppercase tracking-wider">Total Risk / Pot. Win</div>
           <div className="font-mono text-primary font-bold">
              {totalRisk.toFixed(1)}u <span className="text-muted mx-1">/</span> <span className="text-win">+{potentialWin.toFixed(2)}u</span>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {pendingBets.map((bet) => (
            <motion.div
              key={bet.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="bg-surface border border-border border-l-4 border-l-pending rounded-r-xl overflow-hidden shadow-lg relative group"
            >
               {/* Pending Pulse Overlay */}
               <div className="absolute inset-0 bg-pending/5 animate-[pulse_3s_ease-in-out_infinite] pointer-events-none" />

               <div className="p-5 relative z-10">
                 {/* Header Row */}
                 <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                       <span className="text-lg">{LEAGUE_ICONS[bet.league]}</span>
                       <span className="text-xs font-bold text-secondary uppercase">{bet.league}</span>
                       <span className="text-xs text-muted">• Today</span>
                    </div>
                    <div className="font-mono font-bold text-lg text-primary">{bet.units.toFixed(1)}u</div>
                 </div>

                 {/* Matchup & Selection */}
                 <div className="mb-4">
                    <h3 className="text-base text-primary mb-1">{bet.game}</h3>
                    <div className="flex items-baseline gap-3">
                       <span className="text-xl font-bold text-white uppercase tracking-tight">{bet.selection}</span>
                       <span className="font-mono text-secondary">{formatOdds(bet.odds)}</span>
                    </div>
                    <div className="text-xs text-win mt-1 font-mono">
                       To Win: +{calculatePotentialPayout(bet.odds, bet.units).toFixed(2)}u
                    </div>
                 </div>

                 {/* Actions */}
                 <div className="flex gap-2 pt-3 border-t border-border/50">
                    <button 
                      onClick={() => onResolve(bet.id, 'win')}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-surfaceHigh hover:bg-win/20 hover:text-win hover:border-win/50 border border-transparent rounded py-2 text-sm font-medium text-muted transition-all group/btn"
                    >
                      <Check className="w-4 h-4" /> Win
                    </button>
                    <button 
                      onClick={() => onResolve(bet.id, 'loss')}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-surfaceHigh hover:bg-loss/20 hover:text-loss hover:border-loss/50 border border-transparent rounded py-2 text-sm font-medium text-muted transition-all"
                    >
                      <X className="w-4 h-4" /> Loss
                    </button>
                    <button 
                      onClick={() => onResolve(bet.id, 'push')}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-surfaceHigh hover:bg-muted/20 hover:text-white border border-transparent rounded py-2 text-sm font-medium text-muted transition-all"
                    >
                      <Minus className="w-4 h-4" /> Push
                    </button>
                    <button 
                      onClick={() => onResolve(bet.id, 'void')}
                      className="px-3 bg-surfaceHigh hover:bg-red-900/20 hover:text-red-400 border border-transparent rounded py-2 text-muted transition-all"
                      title="Void / Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ActiveBets;