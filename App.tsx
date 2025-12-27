import React, { useState } from 'react';
import { useBets } from './hooks/useBets';
import TopNav from './components/TopNav';
import Dashboard from './components/Dashboard';
import NewEntry from './components/NewEntry';
import ActiveBets from './components/ActiveBets';
import History from './components/History';
import Settings from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { bets, stats, addBet, updateBetResult, deleteBet } = useBets();

  const pendingCount = bets.filter(b => b.result === 'pending').length;

  const handleResolve = (id: string, result: any) => {
    if (result === 'void') {
      deleteBet(id);
    } else {
      updateBetResult(id, result);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} />;
      case 'new':
        return <NewEntry onAddBet={addBet} />;
      case 'active':
        return <ActiveBets bets={bets} onResolve={handleResolve} />;
      case 'history':
        return <History bets={bets} />;
      default:
        return <Dashboard stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary font-sans antialiased selection:bg-accent selection:text-white pb-20 md:pb-0">
      <TopNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        pendingCount={pendingCount}
      />

      <main className="fade-in">
        {renderContent()}
      </main>

      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default App;