
import React, { useState } from 'react';
import Card from '../components/Card';
import { getSolarSavings } from '../utils/calculations';

const EnergyEstimator: React.FC = () => {
  const [rooftopSize, setRooftopSize] = useState<number>(0);
  const results = getSolarSavings(rooftopSize);

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Solar Potential</h2>
        <p className="text-sm text-gray-500">Estimate how much your roof can save.</p>
      </div>

      <Card title="Rooftop Area" subtitle="Available area for solar panels in square meters">
        <div className="flex items-center gap-4">
          <input 
            type="number" 
            value={rooftopSize || ''}
            onChange={(e) => setRooftopSize(parseInt(e.target.value) || 0)}
            className="flex-1 bg-white border border-gray-200 rounded-xl p-4 text-gray-900 font-black text-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-inner"
            placeholder="e.g. 50"
          />
          <span className="text-gray-500 font-bold">m²</span>
        </div>
      </Card>

      {rooftopSize > 0 ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2 text-amber-500">☀️</div>
            <h3 className="text-lg font-bold text-amber-900">Your Potential</h3>
            <div className="text-3xl font-black text-amber-600 mt-2">{results.capacityKW} kW</div>
            <p className="text-xs text-amber-700 uppercase font-bold tracking-widest mt-1">System Capacity</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm text-center">
              <div className="text-2xl font-black text-gray-800">{results.generationMonth}</div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">Units / Month</p>
            </div>
            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm text-center">
              <div className="text-2xl font-black text-emerald-600">{results.co2SavedMonth}kg</div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">CO₂ Saved / Month</p>
            </div>
          </div>

          <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-900 p-6 rounded-2xl shadow-sm">
            <h4 className="font-black text-lg mb-2 flex items-center gap-2">
              <span className="text-2xl">💡</span> Did you know?
            </h4>
            <p className="text-sm font-bold leading-relaxed opacity-90">
              Generating your own electricity with solar can pay back its cost in 4-6 years in many regions, while providing free energy for 20+ years.
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-4">🏘️</div>
          <p className="text-sm font-medium">Enter your rooftop size to see the potential savings and impact.</p>
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 tracking-tight">Appliances Check</h3>
        <div className="space-y-3">
          {[
            { name: 'LED Bulbs', consumption: 'Low', tip: 'Use instead of regular bulbs.' },
            { name: 'AC (1.5 Ton)', consumption: 'High', tip: 'Run at 24°C for efficiency.' },
            { name: 'Refrigerator', consumption: 'Med', tip: 'Keep 10cm gap from walls.' }
          ].map((app, idx) => (
            <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center">
              <div>
                <span className="font-black text-sm text-gray-800">{app.name}</span>
                <p className="text-[10px] text-gray-400 font-bold">{app.tip}</p>
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded shadow-sm ${
                app.consumption === 'High' ? 'bg-red-100 text-red-600' : 
                app.consumption === 'Med' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
              }`}>{app.consumption}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnergyEstimator;
