
import React from 'react';
import { Tab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  lowPowerMode: boolean;
  onTogglePower: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, lowPowerMode, onTogglePower }) => {
  const tabs = [
    { id: Tab.Dashboard, label: 'Home', icon: '🏠' },
    { id: Tab.Track, label: 'Impact', icon: '🌱' },
    { id: Tab.Challenges, label: 'Hero', icon: '⚡' },
    { id: Tab.Waste, label: 'Sort', icon: '♻️' },
    { id: Tab.Profile, label: 'Profile', icon: '👤' },
  ];

  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto relative shadow-xl transition-colors ${lowPowerMode ? 'grayscale-[0.2]' : ''}`}>
      <header className="bg-emerald-600 text-white p-4 sticky top-0 z-20 flex justify-between items-center shadow-md">
        <div className="hover:scale-105 transition-transform cursor-pointer">
          <h1 className="text-xl font-bold tracking-tight leading-none">EcoTracker</h1>
          <p className="text-[10px] text-emerald-200 mt-1 font-bold uppercase">Sustainability OS</p>
        </div>
        <button 
          onClick={onTogglePower}
          className={`px-3 py-1 rounded-full text-[10px] font-black border transition-all hover:bg-white hover:text-emerald-700 ${lowPowerMode ? 'bg-white text-emerald-600 border-white' : 'bg-emerald-500/30 text-white border-white/20'}`}
        >
          {lowPowerMode ? '🌱 LOW POWER ON' : '🌱 NORMAL POWER'}
        </button>
      </header>

      <main className={`flex-1 overflow-y-auto pb-24 no-scrollbar ${lowPowerMode ? 'animate-none' : ''}`}>
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 max-w-md mx-auto z-20 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all hover:bg-emerald-50/50 ${
              activeTab === tab.id ? 'text-emerald-600 bg-emerald-50/50 scale-105' : 'text-gray-400'
            }`}
          >
            <span className="text-xl mb-1">{tab.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;