import React from 'react';
import { X, RefreshCw, Save } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-surface border border-border w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-border bg-surfaceHigh">
          <h2 className="text-lg font-display tracking-wide text-primary">Settings</h2>
          <button onClick={onClose} className="text-muted hover:text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Display Settings */}
          <div>
            <h3 className="text-xs uppercase text-secondary font-bold mb-3">Display</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm text-primary">Theme</label>
                <select className="bg-background border border-border rounded px-2 py-1 text-sm text-primary outline-none focus:border-accent">
                  <option>Dark Mode</option>
                  <option>Light Mode (Coming Soon)</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <label className="text-sm text-primary">Default Units</label>
                <select className="bg-background border border-border rounded px-2 py-1 text-sm text-primary outline-none focus:border-accent">
                   <option>1.0u</option>
                   <option>2.0u</option>
                   <option>5.0u</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Data Settings */}
          <div>
            <h3 className="text-xs uppercase text-secondary font-bold mb-3">Data Management</h3>
            <div className="space-y-3">
               <div>
                  <label className="text-sm text-primary block mb-1">Google Sheet ID</label>
                  <input type="text" placeholder="Spreadsheet ID..." className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-muted focus:text-primary outline-none focus:border-accent" />
               </div>
               
               <button className="w-full flex items-center justify-center gap-2 bg-surfaceHigh hover:bg-surfaceHigh/80 border border-border rounded-lg py-2 text-sm font-medium transition-colors">
                  <RefreshCw className="w-4 h-4" /> Sync Data
               </button>

               <div className="flex gap-2">
                 <button className="flex-1 bg-surfaceHigh hover:bg-surfaceHigh/80 border border-border rounded-lg py-2 text-sm font-medium transition-colors">
                    Export CSV
                 </button>
                 <button className="flex-1 bg-surfaceHigh hover:bg-surfaceHigh/80 border border-border rounded-lg py-2 text-sm font-medium transition-colors">
                    Import Data
                 </button>
               </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-surfaceHigh border-t border-border flex justify-end">
          <button 
             onClick={onClose}
             className="flex items-center gap-2 bg-accent hover:bg-accentGlow text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
             <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;