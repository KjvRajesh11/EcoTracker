
import React, { useMemo } from 'react';
import { SIMULATED_LEADERBOARD } from '../constants/appConfig';
import { calculateDailyCarbon, calculateDailyWater, calculateEcoScore } from '../utils/calculations';
import { UserData } from '../types/sustainability';

interface LeaderboardViewProps {
  userData: UserData;
  onBack: () => void;
}

const LeaderboardView: React.FC<LeaderboardViewProps> = ({ userData, onBack }) => {
  const currentCarbon = calculateDailyCarbon(userData);
  const currentWater = calculateDailyWater(userData);
  const userScore = calculateEcoScore(currentCarbon, currentWater, userData.challenges.length);

  const players = useMemo(() => {
    const list = [
      ...SIMULATED_LEADERBOARD.map(p => ({ ...p, isUser: false })),
      { name: 'YOU', score: userScore, avatar: '👤', isUser: true }
    ];
    return list.sort((a, b) => b.score - a.score);
  }, [userScore]);

  return (
    <div className="p-4 space-y-6 animate-pop pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-xl active:scale-90 transition-transform"
        >
          ←
        </button>
        <div>
          <h2 className="text-2xl font-black text-gray-800 leading-tight">Global Ranking</h2>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Neighborhood Context</p>
        </div>
      </div>

      <div className="bg-emerald-600 rounded-[2.5rem] p-6 text-white shadow-xl flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Your Current Rank</p>
          <p className="text-4xl font-black mt-1">#{players.findIndex(p => p.isUser) + 1}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Planetary Score</p>
          <p className="text-4xl font-black mt-1">{userScore}</p>
        </div>
      </div>

      <div className="space-y-3">
        {players.map((player, idx) => (
          <div 
            key={`${player.name}-${idx}`}
            className={`flex justify-between items-center p-5 rounded-[2rem] transition-all ${
              player.isUser 
                ? 'bg-white border-2 border-emerald-500 shadow-emerald-100 shadow-xl scale-[1.02] z-10' 
                : 'bg-white border-2 border-transparent hover:border-gray-100 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={`text-sm font-black w-6 ${idx < 3 ? 'text-amber-500' : 'text-gray-300'}`}>
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
              </span>
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl">
                {player.avatar}
              </div>
              <div>
                <p className={`font-black text-sm ${player.isUser ? 'text-emerald-700' : 'text-gray-800'}`}>
                  {player.name}
                  {player.isUser && <span className="ml-2 text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">YOU</span>}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Verified Eco Citizen</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-gray-800">{player.score}</p>
              <p className="text-[8px] font-black text-gray-400 uppercase">Points</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-sky-50 p-6 rounded-[2rem] border border-sky-100 text-center">
        <p className="text-[10px] font-black text-sky-600 uppercase tracking-[0.2em] mb-2">Community Growth</p>
        <p className="text-xs font-bold text-sky-800 leading-relaxed">
          The rankings are updated every 24 hours based on localized collective action logs. Keep logging to climb the tiers!
        </p>
      </div>
    </div>
  );
};

export default LeaderboardView;
