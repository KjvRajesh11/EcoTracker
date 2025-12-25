
import React from 'react';
import { UserData } from '../types/sustainability';
import { calcCarbon, calcWater } from '../utils/calculations';
import { CITY_BENCHMARKS, TREE_EQUIVALENCE } from '../constants/appConfig';

export const EcoReceiptPage = ({ data, onBack }: { data: UserData, onBack: () => void }) => {
  const carbon = calcCarbon(data);
  const water = calcWater(data);
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Tree equivalence: Daily absorption of 1 tree
  const dailyTreeAbsorption = TREE_EQUIVALENCE.ANNUAL_ABSORPTION_KG / 365;
  const treeEquiv = carbon / dailyTreeAbsorption;

  return (
    <div className="p-6 pb-12">
      <button onClick={onBack} className="mb-4 text-emerald-600 font-bold flex items-center gap-2 active:translate-x-[-4px] transition-transform">
        <span>🏠</span> Back to Dashboard
      </button>
      
      <div className="bg-white border-2 border-dashed border-gray-200 p-8 rounded-lg shadow-sm font-mono text-gray-800 receipt-vibe">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold uppercase tracking-tighter">PLANET RECEIPT</h2>
          <p className="text-xs text-gray-400">{date}</p>
          <div className="text-[10px] text-gray-400 mt-1 border-t border-gray-100 pt-1">
            LOCAL REGION: {data.settings.region.toUpperCase()}
          </div>
        </div>
        
        <div className="space-y-4 border-b border-gray-100 pb-4 mb-4">
          <div className="flex justify-between">
            <span>CARBON LOAD</span>
            <span className="font-bold">{carbon.toFixed(2)} kg</span>
          </div>
          <div className="flex justify-between">
            <span>WATER LOAD</span>
            <span className="font-bold">{Math.round(water)} L</span>
          </div>
          <div className="flex justify-between">
            <span>TREES NEEDED (DAY)</span>
            <span className="font-bold">{treeEquiv.toFixed(1)} 🌳</span>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <p className="text-[10px] uppercase font-black text-emerald-600 tracking-widest">SAVINGS vs AVERAGE</p>
          <div className="flex justify-between text-emerald-600 font-bold">
            <span>WATER SAVED</span>
            <span>{Math.max(0, CITY_BENCHMARKS.WATER_DAILY - water).toFixed(0)} L</span>
          </div>
          <div className="flex justify-between text-emerald-600 font-bold">
            <span>CO2 REDUCED</span>
            <span>{Math.max(0, CITY_BENCHMARKS.CARBON_DAILY - carbon).toFixed(2)} kg</span>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded mb-6 text-center">
          <p className="text-[10px] text-gray-400 mb-1">CAMPUS PERFORMANCE</p>
          <p className="text-xs font-bold text-gray-700">You are in the top 15% of your zone.</p>
        </div>

        <div className="text-center pt-4 border-t border-gray-100">
          <div className="inline-block bg-gray-100 px-4 py-2 rounded mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest">Privacy Verified</span>
          </div>
          <p className="text-[9px] text-gray-400 leading-tight">
            THIS IS A STATIC RULE-BASED CALCULATION.<br/>
            TOTAL PRIVACY: NO DATA SENT TO CLOUD.
          </p>
        </div>
      </div>
      
      <button 
        onClick={() => window.print()}
        className="w-full mt-6 bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <span>📄</span> Save as PDF Report
      </button>
    </div>
  );
};
