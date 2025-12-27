import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { DashboardStats } from '../types';
import { LEAGUE_COLORS } from '../constants';
import { motion } from 'framer-motion';

interface DashboardProps {
  stats: DashboardStats;
}

const StatCard: React.FC<{ title: string; value: string; subtext?: string; colorClass?: string; chart?: React.ReactNode }> = ({ title, value, subtext, colorClass = "text-primary", chart }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-surface border border-border p-6 rounded-xl flex flex-col justify-between h-full relative overflow-hidden"
  >
    <div className="z-10 relative">
      <h3 className="text-muted text-sm font-medium mb-1">{title}</h3>
      <div className={`text-3xl lg:text-4xl font-mono font-bold tracking-tight mb-2 ${colorClass}`}>
        {value}
      </div>
      {subtext && <div className="text-xs text-secondary font-medium">{subtext}</div>}
      {chart}
    </div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-surfaceHigh to-transparent opacity-20 rounded-bl-full pointer-events-none" />
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surfaceHigh border border-border p-3 rounded-lg shadow-xl">
        <p className="text-xs text-muted mb-1">{label}</p>
        <p className="text-sm font-mono font-bold text-accent">
          {payload[0].value > 0 ? '+' : ''}{Number(payload[0].value).toFixed(2)}u
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const pnlColor = stats.totalPnl >= 0 ? 'text-win' : 'text-loss';
  const roiColor = stats.roi >= 0 ? 'text-win' : 'text-loss';

  const chartData = useMemo(() => {
     // Ensure we have data even if empty
     if (stats.bankrollHistory.length === 0) return [];
     return stats.bankrollHistory;
  }, [stats.bankrollHistory]);

  const leagueData = useMemo(() => {
    return [...stats.byLeague].sort((a, b) => b.pnl - a.pnl);
  }, [stats.byLeague]);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total P&L" 
          value={`${stats.totalPnl > 0 ? '+' : ''}${stats.totalPnl.toFixed(2)}u`} 
          colorClass={pnlColor}
          subtext={`${stats.totalBets} bets tracked`}
        />
        <StatCard 
          title="ROI" 
          value={`${stats.roi > 0 ? '+' : ''}${stats.roi.toFixed(1)}%`} 
          colorClass={roiColor}
          subtext={`${stats.unitsRisked.toFixed(1)} units risked`}
        />
        <StatCard 
          title="Win Rate" 
          value={`${stats.winRate.toFixed(1)}%`} 
          subtext={`${stats.wins}W - ${stats.losses}L - ${stats.pushes}P`}
          chart={
            <div className="w-full h-1.5 bg-surfaceHigh rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-accent rounded-full" 
                style={{ width: `${Math.min(stats.winRate, 100)}%` }} 
              />
            </div>
          }
        />
        <StatCard 
          title="Current Streak" 
          value={`${stats.currentStreak.type === 'W' ? '🔥' : '❄️'} ${stats.currentStreak.type}${stats.currentStreak.count}`} 
          subtext={`Best: W${stats.bestStreak} • Worst: L${Math.abs(stats.worstStreak)}`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bankroll Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-surface border border-border p-6 rounded-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-display tracking-wide text-primary">Bankroll Progression</h3>
            <div className="flex gap-2">
               <span className="text-xs text-muted bg-surfaceHigh px-2 py-1 rounded cursor-pointer hover:text-white">30D</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A32" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280" 
                  tick={{fontSize: 12}} 
                  tickLine={false}
                  axisLine={false}
                  minTickGap={30}
                />
                <YAxis 
                  stroke="#6B7280" 
                  tick={{fontSize: 12, fontFamily: 'JetBrains Mono'}} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val > 0 ? '+' : ''}${val}u`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPnl)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* League Performance */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2 }}
           className="bg-surface border border-border p-6 rounded-xl"
        >
          <h3 className="text-lg font-display tracking-wide text-primary mb-6">Performance by League</h3>
          <div className="space-y-4">
             {leagueData.slice(0, 6).map((league) => (
                <div key={league.league} className="group">
                   <div className="flex justify-between text-sm mb-1">
                      <span className="text-secondary group-hover:text-primary transition-colors">{league.league}</span>
                      <div className="flex gap-3">
                         <span className="font-mono text-muted text-xs">{league.wins}-{league.losses}-{league.pushes}</span>
                         <span className={`font-mono font-bold ${league.pnl >= 0 ? 'text-win' : 'text-loss'}`}>
                           {league.pnl > 0 ? '+' : ''}{league.pnl.toFixed(1)}u
                         </span>
                      </div>
                   </div>
                   <div className="h-1.5 w-full bg-surfaceHigh rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${league.winRate}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: LEAGUE_COLORS[league.league] || '#3B82F6' }}
                      />
                   </div>
                </div>
             ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Strip */}
      <motion.div 
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.3 }}
         className="bg-surface border border-border p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between"
      >
          <div className="text-sm font-medium text-muted">Recent Form</div>
          <div className="flex gap-2">
            {stats.recentResults.slice(0, 15).map((res, i) => (
              <div 
                key={i}
                className={`w-3 h-3 rounded-full ${res === 'win' ? 'bg-win' : res === 'loss' ? 'bg-loss' : 'bg-muted'}`}
                title={res.toUpperCase()}
              />
            ))}
          </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;