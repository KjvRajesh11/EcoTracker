
import React, { useState } from 'react';
import Card from '../components/Card';
import { SIM_FACTORS, TREE_EQUIVALENCE } from '../constants/appConfig';

const ImpactSimulator: React.FC = () => {
  const [people, setPeople] = useState(100);
  const [days, setDays] = useState(30);
  const [actions, setActions] = useState({
    cycle: true,
    shower: true,
    solar: false,
    ac: true,
  });

  const toggleAction = (key: keyof typeof actions) => {
    setActions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Logic: Calculate total savings
  // Saving = (Daily Person Saving) * Count * Days
  const dailyCarbonSaving = 
    (actions.cycle ? SIM_FACTORS.CYCLE_INSTEAD_CAR : 0) +
    (actions.solar ? SIM_FACTORS.SOLAR_ADOPTION : 0) +
    (actions.ac ? SIM_FACTORS.AC_TEMPERATURE : 0);

  const dailyWaterSaving = 
    (actions.shower ? SIM_FACTORS.SHORT_SHOWER : 0);

  const totalCarbonSaved = dailyCarbonSaving * people * days;
  const totalWaterSaved = dailyWaterSaving * people * days;
  
  // Tree Equivalence: Annual absorption is 21kg. Daily is 21/365.
  const dailyTreeAbsorption = TREE_EQUIVALENCE.ANNUAL_ABSORPTION_KG / 365;
  const treesEffect = totalCarbonSaved / TREE_EQUIVALENCE.ANNUAL_ABSORPTION_KG;

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="text-center space-y-2 py-4">
        <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Impact Simulator</h2>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Collective Change Calculator</p>
      </div>

      <Card title="1. Define Scale" subtitle="Adjust audience and duration" className="hover:scale-[1.02] hover:shadow-xl transition-all duration-300">
        <div className="space-y-6 mt-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-black text-gray-500 uppercase">Participants</label>
              <span className="text-xl font-black text-emerald-600">{people.toLocaleString()}</span>
            </div>
            <input 
              type="range" min="1" max="10000" step="10" 
              value={people} onChange={(e) => setPeople(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-black text-gray-500 uppercase">Duration (Days)</label>
              <span className="text-xl font-black text-sky-600">{days}</span>
            </div>
            <input 
              type="range" min="1" max="365" 
              value={days} onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
          </div>
        </div>
      </Card>

      <Card title="2. Choose Green Actions" subtitle="Select habits for the community" className="hover:scale-[1.02] hover:shadow-xl transition-all duration-300">
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { id: 'cycle', label: 'Bike to Work', icon: '🚲', desc: 'Saves 0.8kg/day' },
            { id: 'shower', label: '5-Min Shower', icon: '🚿', desc: 'Saves 45L/day' },
            { id: 'solar', label: 'Solar Rooftop', icon: '🔆', desc: 'Saves 0.3kg/day' },
            { id: 'ac', label: 'AC at 24°C+', icon: '❄️', desc: 'Saves 0.6kg/day' }
          ].map((action) => (
            <button
              key={action.id}
              onClick={() => toggleAction(action.id as any)}
              className={`p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md active:scale-95 ${
                (actions as any)[action.id] 
                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm' 
                : 'bg-white border-gray-100 text-gray-400 opacity-60'
              }`}
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="text-[10px] font-black uppercase mb-1 leading-none">{action.label}</div>
              <div className="text-[8px] font-bold opacity-60 leading-tight">{action.desc}</div>
            </button>
          ))}
        </div>
      </Card>

      <div className={`p-8 rounded-[2.5rem] text-white shadow-2xl transition-all duration-500 transform hover:scale-[1.03] ${totalCarbonSaved > 5000 ? 'bg-emerald-600' : 'bg-gray-800'}`}>
        <div className="text-center space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Collective Outcome</span>
            <h3 className="text-5xl font-black tracking-tighter">
              {totalCarbonSaved >= 1000 ? `${(totalCarbonSaved/1000).toFixed(1)}t` : `${Math.round(totalCarbonSaved)}kg`}
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">CO₂ Avoided</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
            <div className="text-center">
              <div className="text-2xl font-black">{Math.round(totalWaterSaved).toLocaleString()}L</div>
              <div className="text-[9px] font-black uppercase opacity-60 tracking-widest">Water Conserved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black">{treesEffect.toFixed(1)}</div>
              <div className="text-[9px] font-black uppercase opacity-60 tracking-widest">Trees Offset (Year)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex gap-4 items-center hover:bg-amber-100 transition-colors">
        <div className="text-3xl">🗳️</div>
        <div>
          <h4 className="text-xs font-black text-amber-900 uppercase">Policy Tip</h4>
          <p className="text-[10px] font-bold text-amber-800 leading-snug">
            Small habit shifts at scale outperform massive infrastructure projects. If 5,000 residents cycle just 3 days a week, it offsets a whole district's evening peak load.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImpactSimulator;
