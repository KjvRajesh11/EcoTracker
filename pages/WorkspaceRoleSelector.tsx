
import React, { useState } from 'react';
import { WorkspaceType, PerspectiveMode } from '../types/sustainability';
import { useAppSystem } from '../context/AppContext';

export const WorkspaceRoleSelector: React.FC = () => {
  const { workspace: currentWs, mode: currentMode, setContext } = useAppSystem();
  const [selectedWs, setSelectedWs] = useState<WorkspaceType>(currentWs);
  const [selectedMode, setSelectedMode] = useState<PerspectiveMode>(currentMode);

  const workspaces: { id: WorkspaceType; label: string; desc: string; icon: string }[] = [
    { 
      id: 'University', 
      label: 'University / Campus', 
      desc: 'Hostels, labs, and academic facilities', 
      icon: '🎓' 
    },
    { 
      id: 'Residential', 
      label: 'Residential Society', 
      desc: 'Apartments, clubhouses, and shared gardens', 
      icon: '🏢' 
    },
    { 
      id: 'Municipal', 
      label: 'Public / Municipal Environment', 
      desc: 'City blocks, public parks, and urban grids', 
      icon: '🏙️' 
    },
  ];

  const modes: { id: PerspectiveMode; label: string; desc: string }[] = [
    { 
      id: 'Individual', 
      label: 'Individual Mode', 
      desc: 'Track and improve personal sustainability actions.' 
    },
    { 
      id: 'Campus', 
      label: 'Campus Mode', 
      desc: 'View aggregated sustainability data at a group level.' 
    },
    { 
      id: 'Policy', 
      label: 'Policy / Admin View (Read-only)', 
      desc: 'Observe trends to guide planning and decisions.' 
    },
  ];

  const handleApply = () => {
    if (selectedWs && selectedMode) {
      setContext(selectedWs, selectedMode);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-pop max-w-md mx-auto shadow-2xl overflow-hidden">
      {/* Header Context */}
      <div className="bg-emerald-700 p-8 text-white pt-12 pb-10">
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl font-black backdrop-blur-md border border-white/20 mb-6">
          ET
        </div>
        <h1 className="text-3xl font-black mb-2 tracking-tighter leading-tight">Setup Your Context</h1>
        <p className="text-emerald-100 text-xs opacity-80 leading-relaxed font-bold uppercase tracking-widest">
          Where are you operating from?
        </p>
      </div>

      <div className="flex-1 p-6 space-y-10 bg-white rounded-t-[2.5rem] -mt-6 z-10 overflow-y-auto no-scrollbar">
        {/* Workspace Section */}
        <section>
          <header className="mb-6">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">1. Select Your Environment</h2>
          </header>
          <div className="grid grid-cols-1 gap-3">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => setSelectedWs(ws.id)}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left group ${
                  selectedWs === ws.id 
                  ? 'border-emerald-500 bg-emerald-50 shadow-sm' 
                  : 'border-gray-100 hover:border-emerald-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">{ws.icon}</div>
                <div>
                  <div className={`font-black text-sm ${selectedWs === ws.id ? 'text-emerald-900' : 'text-gray-800'}`}>
                    {ws.label}
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold mt-0.5">{ws.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Mode Section */}
        <section>
          <header className="mb-6">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">2. Choose Your Perspective</h2>
          </header>
          <div className="space-y-3">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMode(m.id)}
                className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                  selectedMode === m.id 
                  ? 'border-emerald-500 bg-emerald-50 shadow-sm' 
                  : 'border-gray-100 hover:border-emerald-200 hover:bg-gray-50'
                }`}
              >
                <div className={`font-black text-xs mb-1 uppercase tracking-tighter ${selectedMode === m.id ? 'text-emerald-700' : 'text-gray-700'}`}>
                  {m.label}
                </div>
                <div className="text-[10px] text-gray-400 font-bold leading-relaxed">{m.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Footer Action */}
        <div className="pt-4 pb-8">
          <button
            disabled={!selectedWs || !selectedMode}
            onClick={handleApply}
            className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${
              selectedWs && selectedMode 
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200' 
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            Enter Dashboard
          </button>
          <p className="text-center text-[9px] text-gray-300 font-black mt-6 uppercase tracking-widest">
            Privacy Guaranteed • Zero Cloud Data
          </p>
        </div>
      </div>
    </div>
  );
};
