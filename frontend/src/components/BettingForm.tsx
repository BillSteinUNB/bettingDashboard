"use client";
import React, { useState } from 'react';
import { Plus, Send, Trash } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {bets.map((bet, index) => (
          <div key={index} className="p-4 border rounded-lg bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Game</label>
                <input
                  type="text"
                  value={bet.game}
                  onChange={(e) => updateBet(index, 'game', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Team vs Team"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bet</label>
                <input
                  type="text"
                  value={bet.bet}
                  onChange={(e) => updateBet(index, 'bet', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g. Total over 217.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sport</label>
                <select
                  value={bet.sport}
                  onChange={(e) => updateBet(index, 'sport', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Sport</option>
                  {SPORTS.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Odds</label>
                <input
                  type="number"
                  value={bet.odds}
                  onChange={(e) => updateBet(index, 'odds', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="-110"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Units</label>
                <input
                  type="number"
                  step="0.01"
                  value={bet.units}
                  onChange={(e) => updateBet(index, 'units', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="1.0"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeBet(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                  disabled={isSubmitting}
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex gap-4">
          <button
            type="button"
            onClick={addBet}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            <Plus size={20} /> Add Bet
          </button>
          
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            <Send size={20} /> {isSubmitting ? 'Submitting...' : 'Submit All'}
          </button>
        </div>
      </form>
    </div>
  );
}