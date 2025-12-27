import React, { useState, useMemo } from 'react';
import { Bet, League, BetResult } from '../types';
import { formatOdds, getResultColor, getResultBg } from '../utils';
import { format } from 'date-fns';
import { LEAGUE_ICONS, LEAGUES } from '../constants';
import { Search, Filter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface HistoryProps {
  bets: Bet[];
}

const History: React.FC<HistoryProps> = ({ bets }) => {
  const [filterLeague, setFilterLeague] = useState<League | 'All'>('All');
  const [filterResult, setFilterResult] = useState<BetResult | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const resolvedBets = useMemo(() => bets.filter(b => b.result !== 'pending'), [bets]);

  const filteredBets = useMemo(() => {
    return resolvedBets.filter(bet => {
      const matchesLeague = filterLeague === 'All' || bet.league === filterLeague;
      const matchesResult = filterResult === 'All' || bet.result === filterResult;
      const matchesSearch = bet.game.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            bet.selection.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesLeague && matchesResult && matchesSearch;
    });
  }, [resolvedBets, filterLeague, filterResult, searchTerm]);

  const totalPages = Math.ceil(filteredBets.length / itemsPerPage);
  const paginatedBets = filteredBets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto h-[calc(100vh-60px)] flex flex-col">
      
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
         <h2 className="text-xl font-display tracking-wide text-primary">Bet History</h2>
         
         <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
               <Search className="absolute left-3 top-2.5 text-muted w-4 h-4" />
               <input 
                 type="text" 
                 placeholder="Search bets..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full md:w-64 bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-primary focus:border-accent outline-none"
               />
            </div>
            
            <div className="relative">
               <select 
                 value={filterLeague}
                 onChange={(e) => setFilterLeague(e.target.value as any)}
                 className="appearance-none bg-surface border border-border rounded-lg px-4 py-2 pr-8 text-sm text-primary focus:border-accent outline-none cursor-pointer"
               >
                 <option value="All">All Leagues</option>
                 {LEAGUES.map(l => <option key={l} value={l}>{l}</option>)}
               </select>
               <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-muted pointer-events-none" />
            </div>

            <div className="relative">
               <select 
                 value={filterResult}
                 onChange={(e) => setFilterResult(e.target.value as any)}
                 className="appearance-none bg-surface border border-border rounded-lg px-4 py-2 pr-8 text-sm text-primary focus:border-accent outline-none cursor-pointer"
               >
                 <option value="All">All Results</option>
                 <option value="win">Wins</option>
                 <option value="loss">Losses</option>
                 <option value="push">Pushes</option>
               </select>
               <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-muted pointer-events-none" />
            </div>
         </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden flex-grow flex flex-col shadow-xl">
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surfaceHigh text-xs uppercase text-secondary font-semibold sticky top-0 z-10">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Lg</th>
                <th className="p-4">Matchup</th>
                <th className="p-4">Selection</th>
                <th className="p-4 text-right">Odds</th>
                <th className="p-4 text-center">Units</th>
                <th className="p-4">Result</th>
                <th className="p-4 text-right">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {paginatedBets.map((bet) => (
                <tr key={bet.id} className="hover:bg-surfaceHigh/30 transition-colors group">
                  <td className="p-4 text-muted font-mono text-xs">{format(bet.date, 'MMM dd')}</td>
                  <td className="p-4">
                     <span title={bet.league}>{LEAGUE_ICONS[bet.league]}</span>
                  </td>
                  <td className="p-4 font-medium text-primary">{bet.game}</td>
                  <td className="p-4 text-primary/90">
                     <span className="font-semibold">{bet.selection}</span>
                  </td>
                  <td className="p-4 text-right font-mono text-secondary">{formatOdds(bet.odds)}</td>
                  <td className="p-4 text-center font-mono text-muted">{bet.units.toFixed(1)}</td>
                  <td className="p-4">
                     <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase ${getResultBg(bet.result)} ${getResultColor(bet.result)}`}>
                        {bet.result}
                     </span>
                  </td>
                  <td className={`p-4 text-right font-mono font-bold ${bet.pnl > 0 ? 'text-win' : bet.pnl < 0 ? 'text-loss' : 'text-muted'}`}>
                     {bet.pnl > 0 ? '+' : ''}{bet.pnl.toFixed(2)}
                  </td>
                </tr>
              ))}
              {paginatedBets.length === 0 && (
                 <tr>
                    <td colSpan={8} className="p-12 text-center text-muted">No bets found matching your filters.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-surfaceHigh border-t border-border p-3 flex justify-between items-center text-xs text-muted">
           <div>
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredBets.length)} of {filteredBets.length}
           </div>
           <div className="flex gap-1">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 hover:bg-surface border border-transparent hover:border-border rounded disabled:opacity-30"
              >
                 <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1 hover:bg-surface border border-transparent hover:border-border rounded disabled:opacity-30"
              >
                 <ChevronRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default History;