
import React from 'react';
import { UserData, HabitStreak } from '../types/sustainability';
import Card from '../components/Card';

interface StreaksViewProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  onBack: () => void;
}

const StreaksView: React.FC<StreaksViewProps> = ({ userData, setUserData, onBack }) => {
  const habits = [
    { id: 'bikeCommute', title: 'Bike Commute', icon: '🚲', impact: '1.5kg CO₂/day', color: 'emerald' },
    { id: 'carFree', title: 'Car-Free Commute', icon: '🚌', impact: '1.5kg CO₂/day', color: 'emerald' },
    { id: 'shortShower', title: '5-Minute Shower', icon: '🚿', impact: '45L Water/day', color: 'sky' },
    { id: 'plasticFree', title: 'Zero Plastic Use', icon: '🛍️', impact: '0.2kg CO₂/day', color: 'amber' },
  ];

  const logHabit = (id: keyof UserData['streaks']) => {
    const today = new Date().toISOString().split('T')[0];
    const streakData = userData.streaks[id];
    
    if (streakData.lastLogDate === today) return;

    let newStreak = 1;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (streakData.lastLogDate === yesterdayStr) {
      newStreak = streakData.currentStreak + 1;
    }

    setUserData(prev => ({
      ...prev,
      streaks: {
        ...prev.streaks,
        [id]: { currentStreak: newStreak, lastLogDate: today }
      }
    }));
  };

  const isBroken = (streakData: HabitStreak) => {
    if (!streakData.lastLogDate) return false;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    return streakData.lastLogDate !== today && streakData.lastLogDate !== yesterdayStr;
  };

  const totalStreakPoints = Object.values(userData.streaks).reduce((acc, s) => acc + s.currentStreak, 0);
  const ecoLevel = totalStreakPoints > 50 ? 'Planetary Guardian' : totalStreakPoints > 20 ? 'Eco Warrior' : totalStreakPoints > 5 ? 'Green Seedling' : 'Observer';

  return (
    <div className="p-4 space-y-6 animate-pop pb-20">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-xl active:scale-90 transition-transform">
          ←
        </button>
        <div>
          <h2 className="text-2xl font-black text-gray-800 leading-tight">Habit Streaks</h2>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Daily Consistency Engine</p>
        </div>
      </div>

      {/* Eco Maturity Level */}
      <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Current Standing</span>
          <h3 className="text-3xl font-black mt-1 mb-4">{ecoLevel}</h3>
          
          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mb-2">
            <div 
              className="bg-emerald-400 h-full transition-all duration-1000" 
              style={{ width: `${Math.min(100, (totalStreakPoints / 100) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
            {totalStreakPoints} Total Streak Points • Next Level at 100
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 rotate-12">🌳</div>
      </div>

      {/* Habit Cards */}
      <div className="space-y-4">
        {habits.map((habit) => {
          const streak = userData.streaks[habit.id as keyof UserData['streaks']];
          const active = streak.lastLogDate === new Date().toISOString().split('T')[0];
          const broken = isBroken(streak);

          return (
            <div key={habit.id} className="bg-white rounded-[2rem] border-2 border-gray-50 p-6 flex items-center justify-between group hover:border-emerald-100 transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner transition-transform group-hover:scale-110 ${
                  active ? 'bg-emerald-100' : broken ? 'bg-red-50' : 'bg-gray-50'
                }`}>
                  {habit.icon}
                </div>
                <div>
                  <h4 className="font-black text-gray-800 leading-tight">{habit.title}</h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mt-0.5">
                    Impact: {habit.impact}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                      active ? 'bg-emerald-500 text-white' : broken ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {broken ? '0' : streak.currentStreak} DAY STREAK
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => logHabit(habit.id as any)}
                disabled={active}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all active:scale-90 ${
                  active 
                    ? 'bg-emerald-500 text-white cursor-default' 
                    : 'bg-gray-100 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600'
                }`}
              >
                {active ? '✓' : '+'}
              </button>
            </div>
          );
        })}
      </div>

      <Card title="Streak Logic" className="bg-amber-50 border-amber-100">
        <ul className="space-y-2">
          <li className="flex gap-2 text-xs font-bold text-amber-900 leading-tight">
            <span>⚡</span> Miss a single day and your streak resets to zero.
          </li>
          <li className="flex gap-2 text-xs font-bold text-amber-900 leading-tight">
            <span>📈</span> Streaks provide a 'Consistency Bonus' to your Eco Score.
          </li>
          <li className="flex gap-2 text-xs font-bold text-amber-900 leading-tight">
            <span>🛡️</span> All habit data is stored locally in your browser.
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default StreaksView;
