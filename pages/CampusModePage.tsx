
import React from 'react';
import Card from '../components/Card';
import { Badge } from '../components/common/Badge';

export const CampusModePage = ({ onBack }: { onBack: () => void }) => {
  const campusStats = [
    { name: 'Hostel A (North)', energy: 'High', waterStress: 'Critical', compliance: 88, pop: 450 },
    { name: 'Hostel B (South)', energy: 'Med', waterStress: 'Normal', compliance: 92, pop: 380 },
    { name: 'Academic Block', energy: 'Peak', waterStress: 'Normal', compliance: 95, pop: 1200 },
    { name: 'Society Park', energy: 'Low', waterStress: 'Low', compliance: 100, pop: 50 },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-emerald-600 font-bold flex items-center gap-2 active:translate-x-[-4px] transition-transform">
          <span>🏠</span> Back
        </button>
        <Badge variant="info">Policy View</Badge>
      </div>

      <div>
        <h2 className="text-2xl font-black text-gray-800 leading-none">Campus Policy Guidance</h2>
        <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-widest">Admin Dashboard (Read-Only)</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl">
          <p className="text-[9px] font-black text-red-600 uppercase">Energy Hotspot</p>
          <p className="text-sm font-bold text-red-900 mt-1">Academic Block</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
          <p className="text-[9px] font-black text-amber-600 uppercase">Avg Compliance</p>
          <p className="text-sm font-bold text-amber-900 mt-1">93.7%</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Zone-wise Analysis</h3>
        {campusStats.map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-gray-800 text-lg">{item.name}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Estimated Pop: {item.pop}</p>
              </div>
              <div className="text-right">
                <Badge variant={item.compliance > 90 ? 'success' : 'warning'}>{item.compliance}% Segregation</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Energy Load</p>
                <span className={`text-xs font-bold ${item.energy === 'Peak' ? 'text-red-600' : 'text-emerald-600'}`}>{item.energy}</span>
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Water Stress</p>
                <span className={`text-xs font-bold ${item.waterStress === 'Critical' ? 'text-red-600' : 'text-gray-600'}`}>{item.waterStress}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Card className="bg-sky-900 text-white border-none shadow-xl">
        <div className="flex gap-4 items-center">
          <span className="text-3xl">🛡️</span>
          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-widest">Privacy Guardrail</h4>
            <p className="text-[11px] text-sky-200 leading-snug mt-1 italic">
              Individual tracking is strictly disabled. This view aggregates zone data based on rule-based flow sensors and occupancy estimates.
            </p>
          </div>
        </div>
      </Card>
      
      <p className="text-center text-[10px] text-gray-400 uppercase font-black tracking-widest pb-8">
        Policy Guidance View v1.0 • No User Accounts
      </p>
    </div>
  );
};
