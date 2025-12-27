import BettingForm from '@/components/BettingForm';
import { LayoutDashboard } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen pb-20">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gray-900 text-white p-1.5 rounded-md">
              <LayoutDashboard size={16} strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-gray-900 tracking-tight">BetTracker</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
            <span>Dashboard</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">New Entry</span>
          </div>
        </div>
      </header>
      
      <div className="max-w-3xl mx-auto px-6 pt-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2">
            Record Wagers
          </h1>
          <p className="text-gray-500 text-sm">
            Track your betting performance with precision. Enter your latest slips below.
          </p>
        </div>
        
        <BettingForm />
      </div>
    </main>
  );
}