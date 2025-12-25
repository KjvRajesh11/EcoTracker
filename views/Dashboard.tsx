
import React, { useMemo, useState } from 'react';
import { Tab } from '../types';
import { UserData, AppRoute } from '../types/sustainability';
import Card from '../components/Card';
import { calculateDailyCarbon, calculateDailyWater, calculateEcoScore } from '../utils/calculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CITY_AVERAGES } from '../constants';
import { COMMUNITY_SPOTS, SIMULATED_LEADERBOARD } from '../constants/appConfig';

interface NeighborhoodMapProps {
  userScore: number;
  userData: UserData;
}

const NeighborhoodMap: React.FC<NeighborhoodMapProps> = ({ userScore, userData }) => {
  const [selectedSpot, setSelectedSpot] = useState<typeof COMMUNITY_SPOTS[0] | null>(null);

  const getGapAnalysis = (spot: typeof COMMUNITY_SPOTS[0]) => {
    switch (spot.type) {
      case 'Solar':
        return userData.solar.rooftopSize > 0 
          ? "You have estimated your roof, but community adoption is 15% higher. Consider actual installation."
          : "You haven't estimated your rooftop potential yet. Most neighbors here use 5kW+ systems.";
      case 'Water':
        return userData.water.cookingLiters > 10 
          ? "Your greywater reuse is currently 0L. Neighbors recycle 25% of shower water for gardening."
          : "Your water stress is higher than average. Neighbors are using aerated taps which you haven't logged.";
      case 'Waste':
        return userData.waste.segregationScore < 80 
          ? "Your segregation score is 15 points lower than this sector. Most homes here use 3-bin systems."
          : "Great job on waste! neighbors are now focusing on home composting to reach zero-waste.";
      case 'Transport':
        return userData.transport.carKm > 0 
          ? "Neighbors have swapped 40% of short trips to bikes. You're still relying on car for trips < 2km."
          : "You're doing great! Consider joining the local weekend 'Cycle to Market' collective.";
      default:
        return "You're lagging in localized collective action. Tap more nodes to explore.";
    }
  };

  return (
    <div className="mt-2 space-y-4 animate-pop">
      <div className="relative w-full h-72 bg-emerald-50 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-inner transition-transform hover:shadow-2xl duration-500">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%"><defs><pattern id="gridHome" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#065f46" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#gridHome)" /></svg>
        </div>

        {COMMUNITY_SPOTS.map((spot) => (
          <button 
            key={spot.id} 
            onClick={() => setSelectedSpot(spot)}
            className="absolute group transition-all hover:scale-150 z-10 cursor-pointer" 
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          >
            <div className={`w-8 h-8 rounded-full border-2 border-white shadow-md animate-pulse flex items-center justify-center overflow-hidden transition-all ${
              selectedSpot?.id === spot.id ? 'scale-125 ring-4 ring-white' : ''
            } ${
              spot.impact > 90 ? 'bg-emerald-500' : spot.impact > 80 ? 'bg-sky-500' : 'bg-amber-400'
            }`}>
              <span className="text-sm">{spot.icon}</span>
            </div>
          </button>
        ))}

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-emerald-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center animate-bounce">
              <span className="text-[10px] text-white font-black tracking-tighter">YOU</span>
            </div>
          </div>
        </div>

        {selectedSpot && (
          <div className="absolute inset-0 z-30 bg-emerald-900/95 backdrop-blur-md p-6 flex flex-col justify-between animate-pop">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{selectedSpot.icon}</div>
                  <div>
                    <h4 className="text-white font-black text-xl leading-tight">{selectedSpot.type} Gap Analysis</h4>
                    <p className="text-emerald-300 text-[10px] font-black uppercase tracking-widest">Neighborhood Context</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSpot(null)}
                  className="text-white/40 hover:text-white text-2xl font-black p-2"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">The Community Advantage</p>
                  <p className="text-emerald-50 text-sm font-bold leading-snug">
                    {selectedSpot.insight}
                  </p>
                </div>

                <div className="bg-amber-500/20 rounded-2xl p-4 border border-amber-500/30">
                  <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-2">What you're missing</p>
                  <p className="text-amber-50 text-sm font-bold leading-snug">
                    {getGapAnalysis(selectedSpot)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/40 uppercase">Action Impact</span>
                <span className="text-white font-black">+{selectedSpot.impact} Eco Points</span>
              </div>
              <button 
                onClick={() => setSelectedSpot(null)}
                className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-900/50"
              >
                GOT IT
              </button>
            </div>
          </div>
        )}
      </div>
      
      {!selectedSpot && (
        <div className="bg-white p-5 rounded-[2rem] border-2 border-emerald-50 flex items-center gap-4 shadow-sm hover:scale-[1.02] hover:shadow-lg transition-all">
          <div className="bg-emerald-100 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🏘️</div>
          <div className="flex-1">
            <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-0.5">Community Pulse</h4>
            <p className="text-xs font-bold text-gray-700 leading-snug">
              Tap a <span className="text-emerald-500 font-black">Pulse Node</span> to reveal exactly what neighbors are doing that you haven't started.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const MiniLeaderboard: React.FC<{ userScore: number, onSeeMore: () => void }> = ({ userScore, onSeeMore }) => {
  const topPlayers = useMemo(() => {
    const list = [
      ...SIMULATED_LEADERBOARD.map(p => ({ ...p, isUser: false })),
      { name: 'YOU', score: userScore, avatar: '👤', isUser: true }
    ];
    return list.sort((a, b) => b.score - a.score).slice(0, 3);
  }, [userScore]);

  return (
    <div className="w-full mt-6 space-y-2">
      <div className="flex justify-between items-center mb-2">
        <p className="text-[8px] font-black text-emerald-100/50 uppercase tracking-[0.3em]">
          Neighborhood Top 3
        </p>
        <button 
          onClick={onSeeMore}
          className="text-[8px] font-black text-emerald-200 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1"
        >
          See Full Rank <span className="text-[10px]">→</span>
        </button>
      </div>
      
      <div className="space-y-2">
        {topPlayers.map((player, idx) => (
          <div 
            key={`${player.name}-${idx}`} 
            className={`flex justify-between items-center px-4 py-2 rounded-xl transition-all animate-pop ${
              player.isUser 
                ? 'bg-white/20 backdrop-blur-md border border-white/20 scale-105' 
                : 'bg-emerald-800/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black opacity-40">#{idx + 1}</span>
              <span className="text-xs">{player.avatar}</span>
              <span className={`text-[10px] font-black ${player.isUser ? 'text-white' : 'text-emerald-100'}`}>
                {player.name}
              </span>
            </div>
            <span className="text-[10px] font-black text-emerald-200">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface DashboardProps {
  userData: UserData;
  onNavigate: (tab: Tab) => void;
  onGoToLeaderboard: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userData, onNavigate, onGoToLeaderboard }) => {
  const currentCarbon = calculateDailyCarbon(userData);
  const currentWater = calculateDailyWater(userData);
  const score = calculateEcoScore(currentCarbon, currentWater, userData.challenges.length);

  const chartData = useMemo(() => [
    { name: 'Carbon (kg)', current: currentCarbon, avg: CITY_AVERAGES.CARBON_DAILY },
    { name: 'Water (10L)', current: currentWater / 10, avg: CITY_AVERAGES.WATER_DAILY / 10 },
  ], [currentCarbon, currentWater]);

  return (
    <div className="p-4 space-y-6 pb-12">
      {/* Hero Section with Score & Integrated Leaderboard */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[2.5rem] p-8 text-white shadow-2xl animate-pop hover:shadow-emerald-200 transition-all duration-500 group">
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 opacity-60">Planetary Score</span>
            <div className="text-9xl font-black mb-1 tracking-tighter drop-shadow-2xl transition-transform duration-700 group-hover:scale-105">
              {score}
            </div>
            <p className="text-emerald-50 text-[10px] font-bold max-w-[200px] leading-relaxed opacity-90 mx-auto">
              {score > 80 ? "Master Tier. You are outperforming the local sector." : 
               score > 50 ? "Steady Growth. Keep swapping habits to gain rank." : 
               "Getting Started. Tap 'Hero' to see simulation impacts."}
            </p>
          </div>

          <MiniLeaderboard userScore={score} onSeeMore={onGoToLeaderboard} />
        </div>
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
      </div>

      <Card title="📍 Impact Map" subtitle="Tap nodes to find neighborhood gaps" className="rounded-[2.5rem] border-2 border-emerald-50 shadow-sm">
        <NeighborhoodMap userScore={score} userData={userData} />
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <div 
          className="bg-white p-6 rounded-[2.5rem] border-2 border-sky-50 shadow-sm active:scale-95 hover:scale-[1.05] hover:shadow-xl transition-all cursor-pointer group" 
          onClick={() => onNavigate(Tab.Track)}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-sky-500 text-[10px] font-black uppercase tracking-widest">Carbon</span>
            <span className="text-lg group-hover:rotate-12 transition-transform">👣</span>
          </div>
          <div className="text-4xl font-black text-gray-800">{currentCarbon.toFixed(1)}<span className="text-xs ml-1 font-bold text-gray-400 uppercase">kg</span></div>
          <p className="text-[9px] text-sky-400 font-bold mt-2 uppercase tracking-widest">Today's Footprint</p>
        </div>
        
        <div 
          className="bg-white p-6 rounded-[2.5rem] border-2 border-amber-50 shadow-sm active:scale-95 hover:scale-[1.05] hover:shadow-xl transition-all cursor-pointer group" 
          onClick={() => onNavigate(Tab.Track)}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Water</span>
            <span className="text-lg group-hover:rotate-12 transition-transform">💧</span>
          </div>
          <div className="text-4xl font-black text-gray-800">{Math.round(currentWater)}<span className="text-xs ml-1 font-bold text-gray-400 uppercase">L</span></div>
          <p className="text-[9px] text-amber-400 font-bold mt-2 uppercase tracking-widest">Daily Intake</p>
        </div>
      </div>

      <Card title="City Comparison" subtitle="Personal vs Global Averages" className="rounded-[2.5rem] hover:scale-[1.02] transition-all">
        <div className="h-56 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{fontWeight: 'black', fill: '#9ca3af'}} />
              <YAxis hide />
              <Tooltip 
                cursor={{fill: '#f9fafb', radius: 10}} 
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 15px 30px -5px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
              />
              <Bar dataKey="avg" fill="#f3f4f6" radius={[10, 10, 0, 0]} name="City Average" />
              <Bar dataKey="current" radius={[10, 10, 0, 0]} name="Your Activity">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#0ea5e9' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="pb-12 space-y-4">
        <button 
          onClick={() => onNavigate(Tab.Challenges)}
          className="w-full bg-emerald-600 text-white p-6 rounded-[2.5rem] flex justify-between items-center group active:scale-[0.98] hover:shadow-emerald-200 hover:shadow-2xl transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm group-hover:scale-110 transition-transform">⚡</div>
            <div className="text-left">
              <span className="font-black text-white text-md uppercase tracking-tight block">Launch Hero Simulator</span>
              <span className="text-[10px] text-emerald-100 font-bold uppercase tracking-widest opacity-80">What-If Collective Impact</span>
            </div>
          </div>
          <span className="text-emerald-200 text-2xl group-hover:translate-x-2 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
