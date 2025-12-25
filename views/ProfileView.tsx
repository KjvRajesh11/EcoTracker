
import React from 'react';
import { UserData, AppRoute } from '../types/sustainability';
import Card from '../components/Card';
import { Badge } from '../components/common/Badge';
import { useAppSystem } from '../context/AppContext';

interface ProfileViewProps {
  userData: UserData;
  onSwitchMode: () => void;
  onTogglePower: () => void;
  onClearData: () => void;
  onNavigate: (route: AppRoute) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ userData, onSwitchMode, onTogglePower, onClearData, onNavigate }) => {
  const { workspace, mode } = useAppSystem();
  
  const totalLogs = userData.logs.length;
  const totalCarbonLogged = userData.logs.reduce((acc, log) => acc + log.carbonKg, 0);
  const totalWaterLogged = userData.logs.reduce((acc, log) => acc + log.waterLiters, 0);

  const totalStreakDays = Object.values(userData.streaks).reduce((acc, s) => acc + s.currentStreak, 0);

  return (
    <div className="p-4 space-y-6 animate-pop pb-12">
      {/* Profile Header */}
      <div className="flex flex-col items-center py-8">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mb-4 border-4 border-white shadow-lg relative">
          👤
          {totalStreakDays > 0 && (
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-white text-[10px] font-black px-2 py-1 rounded-full border-2 border-white shadow-sm animate-bounce">
              🔥 {totalStreakDays}
            </div>
          )}
        </div>
        <h2 className="text-2xl font-black text-gray-800 tracking-tighter">Eco Citizen</h2>
        <div className="flex gap-2 mt-2">
          <Badge variant="success">{workspace}</Badge>
          <Badge variant="info">{mode} View</Badge>
        </div>
      </div>

      {/* Aggregate Stats */}
      <Card title="Lifetime Impact" subtitle="Aggregated data from your logged sessions">
        <div className="grid grid-cols-3 gap-4 py-2">
          <div className="text-center">
            <p className="text-xl font-black text-gray-800">{totalLogs}</p>
            <p className="text-[9px] font-black text-gray-400 uppercase">Logs</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-emerald-600">{totalCarbonLogged.toFixed(1)}</p>
            <p className="text-[9px] font-black text-gray-400 uppercase">Total kg CO₂</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-sky-600">{Math.round(totalWaterLogged)}</p>
            <p className="text-[9px] font-black text-gray-400 uppercase">Total L Water</p>
          </div>
        </div>
      </Card>

      {/* Achievements / Streaks Link */}
      <button 
        onClick={() => onNavigate(AppRoute.Streaks)}
        className="w-full bg-white border-2 border-emerald-50 p-6 rounded-[2.5rem] flex items-center justify-between group hover:border-emerald-500 hover:shadow-xl transition-all active:scale-95"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🔥</div>
          <div className="text-left">
            <h4 className="font-black text-gray-800 text-sm">Habit Streaks</h4>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Consistency Dashboard</p>
          </div>
        </div>
        <span className="text-emerald-200 text-2xl group-hover:translate-x-2 transition-transform">→</span>
      </button>

      {/* Identity & Context */}
      <Card title="Identity & Context" subtitle="Adjust your operational environment">
        <div className="space-y-4">
          <div className="bg-gray-50 p-5 rounded-[2rem] border border-gray-100 flex justify-between items-center group">
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Workspace</p>
              <p className="text-sm font-black text-gray-800">{workspace} • {mode}</p>
            </div>
            <button 
              onClick={onSwitchMode}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black shadow-lg shadow-emerald-100 active:scale-95 transition-all"
            >
              CHANGE CONTEXT
            </button>
          </div>
        </div>
      </Card>

      {/* App Settings */}
      <Card title="App Configuration" subtitle="Customize your experience">
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-all">
            <div>
              <p className="text-sm font-bold text-gray-800">Low Power Mode</p>
              <p className="text-[10px] text-gray-400">Reduce animations & grayscale UI</p>
            </div>
            <button 
              onClick={onTogglePower}
              className={`w-12 h-6 rounded-full transition-all relative ${userData.settings.lowPowerMode ? 'bg-emerald-500' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${userData.settings.lowPowerMode ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <div className="pt-6">
        <button 
          onClick={() => {
            if (confirm("Permanently wipe all logs and reset your context selection?")) {
              onClearData();
            }
          }}
          className="w-full bg-red-50 text-red-600 p-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] border border-red-100 active:bg-red-100 transition-all"
        >
          🗑️ Reset Entire Platform
        </button>
        <p className="text-center text-[9px] text-gray-400 font-bold mt-6 uppercase tracking-[0.3em] opacity-40">
          EcoTracker • Zero Cloud Sync • Static Logic
        </p>
      </div>
    </div>
  );
};

export default ProfileView;