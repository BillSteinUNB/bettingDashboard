import React from 'react';
import { Target, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSettings: () => void;
  pendingCount: number;
}

const TopNav: React.FC<TopNavProps> = ({ activeTab, setActiveTab, onOpenSettings, pendingCount }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'new', label: 'New Entry' },
    { id: 'active', label: 'Active', badge: pendingCount > 0 ? pendingCount : null },
    { id: 'history', label: 'History' },
  ];

  return (
    <nav className="sticky top-0 z-50 h-[60px] bg-background/95 backdrop-blur-md border-b border-border flex items-center justify-between px-4 lg:px-8">
      {/* Brand */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
        <Target className="w-6 h-6 text-accent" strokeWidth={2} />
        <span className="font-display text-2xl tracking-wide text-primary mt-1">BETTRACKER</span>
      </div>

      {/* Tabs */}
      <div className="hidden md:flex items-center bg-surface p-1 rounded-full border border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'text-white' : 'text-muted hover:text-secondary'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-surfaceHigh rounded-full border border-border"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative flex items-center gap-2 z-10">
              {tab.label}
              {tab.badge && (
                <span className="bg-pending text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile Nav Placeholder (Simple) */}
      <div className="md:hidden flex items-center bg-surface p-1 rounded-full border border-border overflow-x-auto max-w-[200px]">
         {/* Simplified mobile nav could go here, or rely on bottom bar. For now, mirroring desktop but smaller. */}
         {tabs.map((tab) => (
            <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`px-3 py-1 rounded-full text-xs font-medium ${activeTab === tab.id ? 'bg-surfaceHigh text-white' : 'text-muted'}`}
            >
             {tab.label === 'Active' && tab.badge ? `Active (${tab.badge})` : tab.label}
            </button>
         ))}
      </div>

      {/* Settings */}
      <button 
        onClick={onOpenSettings}
        className="p-2 text-muted hover:text-primary transition-colors rounded-full hover:bg-surface"
      >
        <SettingsIcon className="w-5 h-5" />
      </button>
    </nav>
  );
};

export default TopNav;