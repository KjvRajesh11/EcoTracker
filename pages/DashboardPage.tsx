
import React from 'react';
import { UserData, AppRoute } from '../types/sustainability';
import { calcCarbon, calcWater, calcEcoScore } from '../utils/calculations';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LabelList } from 'recharts';
import { CITY_BENCHMARKS, REGIONAL_DATA, LIMITATIONS } from '../constants/appConfig';
import Card from '../components/Card';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl animate-pop">
        <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }} />
                <span className="text-[11px] font-bold text-gray-600">{entry.name}</span>
              </div>
              <span className="text-xs font-black text-gray-900">
                {entry.value.toFixed(1)}
                {label.includes('Carbon') ? ' kg' : ' L'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const DashboardPage = ({ data, navigate }: { data: UserData, navigate: (r: AppRoute) => void }) => {
  const carbon = calcCarbon(data);
  const water = calcWater(data);
  const score = calcEcoScore(data);
  const isLowPower = data.settings.lowPowerMode;
  
  const regional = REGIONAL_DATA[data.settings.region] || REGIONAL_DATA['Hyderabad'];

  const chartData = [
    { 
      name: 'Carbon (kg)', 
      current: Number(carbon.toFixed(1)), 
      benchmark: CITY_BENCHMARKS.CARBON_DAILY 
    },
    { 
      name: 'Water (10L)', 
      current: Number((water / 10).toFixed(1)), 
      benchmark: CITY_BENCHMARKS.WATER_DAILY / 10 
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 items-center">
        <span className="text-2xl">☀️</span>
        <div>
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{regional.currentSeason} IN {data.settings.region}</p>
          <p className="text-sm font-bold text-amber-900 leading-tight">{regional.seasonalTip}</p>
        </div>
      </div>

      <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-lg text-center relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-xs uppercase font-bold text-emerald-100 tracking-widest mb-1">Eco Score</p>
          <h2 className="text-6xl font-black">{score}</h2>
          <p className="mt-2 text-sm text-emerald-50 opacity-80 italic">Contextual Guidance Mode</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm active:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(AppRoute.Carbon)}>
          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Daily CO₂</p>
          <p className="text-2xl font-black text-gray-800">{carbon.toFixed(1)} <span className="text-xs font-normal text-gray-400">kg</span></p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm active:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(AppRoute.Water)}>
          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Daily Water</p>
          <p className="text-2xl font-black text-gray-800">{Math.round(water)} <span className="text-xs font-normal text-gray-400">L</span></p>
        </div>
      </div>

      <Card title="Impact Visualized" subtitle="Visible values for calculation comparison">
        <div className="h-56 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: -10, right: 35 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                fontSize={10} 
                width={80} 
                tick={{fontWeight: 'black', fill: '#4b5563'}} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{fill: '#f9fafb', radius: 8}}
                isAnimationActive={!isLowPower}
              />
              <Bar 
                dataKey="benchmark" 
                fill="#f3f4f6" 
                radius={[0, 4, 4, 0]} 
                name="City Avg" 
                isAnimationActive={!isLowPower} 
              >
                <LabelList dataKey="benchmark" position="right" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#9ca3af' }} />
              </Bar>
              <Bar 
                dataKey="current" 
                fill="#10b981" 
                radius={[0, 4, 4, 0]} 
                name="You" 
                isAnimationActive={!isLowPower} 
              >
                <LabelList dataKey="current" position="right" style={{ fontSize: '11px', fontWeight: 'black', fill: '#065f46' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="⚠️ Boundary Transparency" className="bg-gray-50 border-gray-200">
        <p className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-tighter">What This App Does NOT Measure:</p>
        <ul className="space-y-2">
          {LIMITATIONS.map((lim, i) => (
            <li key={i} className="flex gap-2 text-[11px] text-gray-500 font-medium leading-snug">
              <span className="text-gray-400">•</span> {lim}
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid grid-cols-2 gap-3 pb-8">
         <button onClick={() => navigate(AppRoute.Receipt)} className="bg-sky-50 text-sky-700 p-4 rounded-2xl font-bold text-sm border border-sky-100 flex flex-col items-center gap-2 active:scale-95 transition-all">
           <span className="text-xl">🧾</span> Eco Receipt
         </button>
         <button onClick={() => navigate(AppRoute.Campus)} className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl font-bold text-sm border border-emerald-100 flex flex-col items-center gap-2 active:scale-95 transition-all">
           <span className="text-xl">🏫</span> Policy View
         </button>
      </div>
    </div>
  );
};
