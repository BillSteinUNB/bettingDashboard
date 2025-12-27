import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Bet, League } from '../types';
import { LEAGUES, LEAGUE_ICONS } from '../constants';
import { Calendar, CheckCircle2 } from 'lucide-react';

interface NewEntryProps {
  onAddBet: (bet: Partial<Bet>) => void;
}

type FormData = {
  game: string;
  selection: string;
  league: League;
  odds: string;
  units: string;
  date: string;
};

const NewEntry: React.FC<NewEntryProps> = ({ onAddBet }) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      units: '1.0',
      league: 'NBA',
      date: new Date().toISOString().split('T')[0]
    }
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const unitsValue = watch('units');

  const onSubmit = (data: FormData) => {
    onAddBet({
      game: data.game,
      selection: data.selection,
      league: data.league,
      odds: parseInt(data.odds),
      units: parseFloat(data.units),
      date: new Date(data.date),
      result: 'pending',
      isParlay: false,
    });

    setIsSuccess(true);
    reset({
        game: '',
        selection: '',
        odds: '',
        units: '1.0',
        league: 'NBA',
        date: new Date().toISOString().split('T')[0]
    });
    
    setTimeout(() => setIsSuccess(false), 2000);
  };

  const setPresetUnits = (val: string) => setValue('units', val);

  return (
    <div className="max-w-2xl mx-auto p-4 lg:p-8">
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-border bg-surfaceHigh/50">
          <h2 className="text-xl font-display tracking-wide text-primary">Log New Bet</h2>
          <p className="text-sm text-muted">Enter wager details below. Odds format: American (-110).</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          
          {/* Game & League Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="md:col-span-2 space-y-2">
               <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Game / Matchup</label>
               <input 
                 {...register('game', { required: true })}
                 placeholder="e.g. Lakers vs Celtics"
                 className="w-full bg-background border border-border rounded-lg p-3 text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted/50"
                 autoFocus
               />
               {errors.game && <span className="text-xs text-loss">Required</span>}
             </div>
             <div className="space-y-2">
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">League</label>
                <div className="relative">
                   <select 
                     {...register('league')}
                     className="w-full bg-background border border-border rounded-lg p-3 text-primary appearance-none focus:border-accent outline-none"
                   >
                     {LEAGUES.map(l => (
                       <option key={l} value={l}>{LEAGUE_ICONS[l]} {l}</option>
                     ))}
                   </select>
                   <div className="absolute right-3 top-3.5 pointer-events-none text-muted text-xs">▼</div>
                </div>
             </div>
          </div>

          {/* Selection */}
          <div className="space-y-2">
             <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Selection</label>
             <input 
               {...register('selection', { required: true })}
               placeholder="e.g. OVER 217.5"
               className="w-full bg-background border border-border rounded-lg p-3 text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none font-medium"
             />
             {errors.selection && <span className="text-xs text-loss">Required</span>}
          </div>

          {/* Odds & Units */}
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Odds (American)</label>
                <input 
                  type="number"
                  {...register('odds', { required: true })}
                  placeholder="-110"
                  className="w-full bg-background border border-border rounded-lg p-3 text-primary font-mono focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                />
                {errors.odds && <span className="text-xs text-loss">Required</span>}
             </div>
             <div className="space-y-2">
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Units</label>
                <input 
                   type="number" step="0.1"
                   {...register('units', { required: true })}
                   className="w-full bg-background border border-border rounded-lg p-3 text-primary font-mono focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                />
             </div>
          </div>

          {/* Unit Quick Select */}
          <div className="flex gap-2 overflow-x-auto pb-2">
             {['0.5', '1.0', '1.5', '2.0', '3.0', '5.0'].map(val => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setPresetUnits(val)}
                  className={`px-3 py-1 text-xs font-mono rounded border transition-colors ${
                     unitsValue === val 
                     ? 'bg-accent border-accent text-white' 
                     : 'bg-surfaceHigh border-border text-muted hover:border-accent/50'
                  }`}
                >
                  {val}u
                </button>
             ))}
          </div>

          {/* Date */}
          <div className="space-y-2">
             <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Date</label>
             <div className="relative">
                <input 
                   type="date"
                   {...register('date')}
                   className="w-full bg-background border border-border rounded-lg p-3 text-primary focus:border-accent outline-none pl-10"
                />
                <Calendar className="absolute left-3 top-3 text-muted w-5 h-5" />
             </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
             <button
               type="submit"
               className="w-full bg-accent hover:bg-accentGlow text-white font-bold py-4 rounded-lg shadow-lg shadow-accent/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
             >
               {isSuccess ? (
                  <>
                     <CheckCircle2 className="w-5 h-5" />
                     <span>BET LOGGED!</span>
                  </>
               ) : (
                  'LOG BET'
               )}
             </button>
          </div>

        </form>
      </div>
      
      {/* Quick Stats Footer */}
      <div className="mt-6 text-center">
         <p className="text-xs text-muted">
            Today: <span className="text-primary font-mono">2-1 (+1.8u)</span> · 
            Week: <span className="text-primary font-mono">8-5 (+4.2u)</span>
         </p>
      </div>

      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
             <div className="bg-win/20 backdrop-blur-sm border border-win text-win px-8 py-4 rounded-full font-bold text-xl shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                BET CONFIRMED
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewEntry;