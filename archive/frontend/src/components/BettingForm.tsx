"use client";
import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Bet {
  game: string;
  bet: string;
  sport: string;
  odds: string;
  units: string;
}

const INITIAL_BET: Bet = {
  game: '',
  bet: '',
  sport: '',
  odds: '',
  units: ''
};

const SPORTS = ['NBA', 'NCAAB', 'NHL', 'Soccer', 'NFL'] as const;

export default function BettingForm() {
  const [bets, setBets] = useState<Bet[]>([{...INITIAL_BET}]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addBet = () => {
    setBets([...bets, {...INITIAL_BET}]);
  };

  const removeBet = (index: number) => {
    setBets(bets.filter((_, i) => i !== index));
  };

  const updateBet = (index: number, field: keyof Bet, value: string) => {
    const newBets = [...bets];
    newBets[index][field] = value;
    setBets(newBets);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/submit-bets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bets)
      });
      
      if (response.ok) {
        setBets([{...INITIAL_BET}]);
        alert('Bets submitted successfully!');
      } else {
        throw new Error('Failed to submit bets');
      }
    } catch (error) {
      alert('Error submitting bets');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {bets.map((bet, index) => (
            <div 
              key={index} 
              className="group relative p-5 bg-white border border-gray-200 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-gray-300 transition-all duration-200"
            >
              {bets.length > 1 && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => removeBet(index)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    disabled={isSubmitting}
                    title="Remove bet"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-4">
                {/* Game Selection */}
                <div className="md:col-span-4">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Matchup
                  </label>
                  <input
                    type="text"
                    value={bet.game}
                    onChange={(e) => updateBet(index, 'game', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
                    placeholder="Lakers vs Celtics"
                  />
                </div>

                {/* Bet Type */}
                <div className="md:col-span-4">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Selection
                  </label>
                  <input
                    type="text"
                    value={bet.bet}
                    onChange={(e) => updateBet(index, 'bet', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
                    placeholder="Over 217.5"
                  />
                </div>

                {/* Sport */}
                <div className="md:col-span-4">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    League
                  </label>
                  <div className="relative">
                    <select
                      value={bet.sport}
                      onChange={(e) => updateBet(index, 'sport', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 appearance-none transition-all cursor-pointer"
                    >
                      <option value="" className="text-gray-400">Select League</option>
                      {SPORTS.map(sport => (
                        <option key={sport} value={sport}>{sport}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Odds */}
                <div className="md:col-span-6">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Odds
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={bet.odds}
                      onChange={(e) => updateBet(index, 'odds', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all font-mono"
                      placeholder="-110"
                    />
                  </div>
                </div>

                {/* Units */}
                <div className="md:col-span-6">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Units
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={bet.units}
                      onChange={(e) => updateBet(index, 'units', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all font-mono"
                      placeholder="1.0"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs font-medium">
                      u
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
          <button
            type="button"
            onClick={addBet}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 border-dashed rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-100 flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            <Plus size={16} />
            <span>Add another bet</span>
          </button>
          
          <div className="flex-1"></div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black shadow-lg shadow-gray-900/10 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
               <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                <span>Saving...</span>
               </>
            ) : (
              <>
                <span>Save Entry</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}