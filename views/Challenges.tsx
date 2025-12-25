
import React from 'react';
import { UserData, HabitStreak } from '../types/sustainability';
import Card from '../components/Card';

interface ChallengesProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

const Challenges: React.FC<ChallengesProps> = ({ userData, setUserData }) => {
  const habits = [
    { id: 'bikeCommute', title: 'Bike Commute', icon: '🚲', impactPerDay: 1.5, type: 'CO₂' },
    { id: 'carFree', title: 'Car-Free Mode', icon: '🚌', impactPerDay: 1.5, type: 'CO₂' },
    { id: 'shortShower', title: '5-Min Shower', icon: '⏱️', impactPerDay: 45, type: 'Liters' },
    { id: 'plasticFree', title: 'Plastic-Free', icon: '🛍️', impactPerDay: 0.2, type: 'CO₂' },
  ];

  const logHabit = (id: keyof UserData['streaks']) => {
    const today = new Date().toISOString().split('T')[0];
    const streakData = userData.streaks[id];
    
    if (streakData.lastLogDate === today) return; // Already logged today

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

  const checkStreakBroken = (streakData: HabitStreak) => {
    if (!streakData.lastLogDate) return false;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    return streakData.lastLogDate !== today && streakData.lastLogDate !== yesterdayStr;
  };

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Behavior Engine</h2>
        <p className="text-sm text-gray-500">Track habits, not just numbers.</p>
      </div>

      <div className="space-y-4">
        {habits.map((habit) => {
          const streakData = userData.streaks[habit.id as keyof UserData['streaks']];
          const isDoneToday = streakData.lastLogDate === new Date().toISOString().split('T')[0];
          const isBroken = checkStreakBroken(streakData);
          const weeklyConsequence = (habit.impactPerDay * 7).toFixed(1);

          return (
            <div key={habit.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-pop">
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`text-3xl p-3 rounded-2xl ${isDoneToday ? 'bg-emerald-100' : 'bg-gray-50'}`}>
                    {habit.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800">{habit.title}</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">
                      Streak: {isBroken ? 0 : streakData.currentStreak} Days
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => logHabit(habit.id as any)}
                  disabled={isDoneToday}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    isDoneToday 
                    ? 'bg-emerald-600 text-white cursor-default' 
                    : 'bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
                >
                  {isDoneToday ? 'LOGGED' : 'I DID THIS'}
                </button>
              </div>

              {isBroken && (
                <div className="bg-red-50 p-3 border-t border-red-100 flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  <p className="text-[10px] text-red-700 font-bold leading-tight">
                    STREAK BROKEN. Habit regression adds back <span className="underline">+{weeklyConsequence} {habit.type}</span> this week compared to your baseline.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Card title="Behavior Logic" className="bg-sky-50 border-sky-100">
        <div className="space-y-3">
          <p className="text-xs text-sky-800 font-medium leading-relaxed">
            Streaks reset if you miss more than 24 hours. The "consequence" is a calculation of your environmental regression.
          </p>
          <div className="bg-white/50 p-3 rounded-xl">
             <h5 className="text-[10px] font-black text-sky-900 uppercase mb-1">Impact Baseline</h5>
             <p className="text-[10px] text-sky-700 italic">
               Calculations assume a shift back to average city consumption patterns. Maintaining habits reduces your personal "System Load".
             </p>
          </div>
        </div>
      </Card>
      
      <div className="text-center pt-4">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
          Behavior Engine v1.2 • Fully Local
        </p>
      </div>
    </div>
  );
};

export default Challenges;
