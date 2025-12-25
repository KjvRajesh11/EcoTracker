
import React, { useState, useMemo } from 'react';
import { UserData, ImpactLog } from '../types/sustainability';
import Card from '../components/Card';
import { 
  calculateDailyCarbon, 
  calculateDailyWater, 
  getWaterStress, 
  getCarbonStress,
  getSolarSavings
} from '../utils/calculations';
import { EMISSION_FACTORS, WATER_FACTORS } from '../constants/appConfig';

interface TrackerProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

/**
 * Animated Stress Badge component
 * Pulses if stress level is Medium or High to grab user attention.
 */
const StressBadge = ({ level }: { level: 'Low' | 'Medium' | 'High' }) => {
  const colors = {
    Low: 'bg-emerald-100 text-emerald-700',
    Medium: 'bg-amber-100 text-amber-700',
    High: 'bg-red-100 text-red-700'
  };
  
  // Animate if Medium or High stress using custom pulse-soft defined in index.html
  const animationClass = level !== 'Low' ? 'animate-pulse-soft shadow-lg' : '';

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all duration-300 ${colors[level]} ${animationClass}`}>
      {level} STRESS
    </span>
  );
};

const CarbonTracker: React.FC<TrackerProps> = ({ userData, setUserData }) => {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [inputSearch, setInputSearch] = useState('');
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [historySearch, setHistorySearch] = useState('');

  // Range multiplier for predictions/estimates
  const rangeMultiplier = timeRange === 'daily' ? 1 : timeRange === 'weekly' ? 7 : 30;
  
  const dailyCarbon = calculateDailyCarbon(userData);
  const dailyWater = calculateDailyWater(userData);
  
  // Calculate footprint scaled by selected range
  const currentCarbon = dailyCarbon * rangeMultiplier;
  const currentWater = dailyWater * rangeMultiplier;

  // Stress levels remain based on Daily intensities for benchmark accuracy
  const waterStress = getWaterStress(dailyWater);
  const carbonStress = getCarbonStress(dailyCarbon);

  const solarResults = getSolarSavings(userData.solar.rooftopSize);

  const updateField = (category: keyof UserData, field: string, val: string) => {
    const num = Math.max(0, parseFloat(val) || 0);
    setUserData(prev => {
      const categoryData = prev[category] as any;
      return {
        ...prev,
        [category]: { ...categoryData, [field]: num }
      };
    });
  };

  const updateSolar = (val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    setUserData(prev => ({
      ...prev,
      solar: { ...prev.solar, rooftopSize: num }
    }));
  };

  const saveToHistory = () => {
    const activeActivities = [];
    if (userData.transport.carKm > 0) activeActivities.push('Car Travel');
    if (userData.transport.busKm > 0) activeActivities.push('Bus Travel');
    if (userData.water.showersMinutes > 0) activeActivities.push('Bathing');
    if (userData.utilities.electricityKwh > 0) activeActivities.push('Electricity');
    if (userData.utilities.lpgKg > 0) activeActivities.push('Cooking Fuel');

    const newLog: ImpactLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      carbonKg: dailyCarbon,
      waterLiters: dailyWater,
      activities: activeActivities
    } as any;

    setUserData(prev => ({
      ...prev,
      logs: [newLog, ...(prev.logs || [])].slice(0, 50) as any
    }));
    alert('Impact Logged Successfully!');
  };

  const transportFields = [
    { label: 'Car Distance', key: 'carKm', category: 'transport', unit: 'KM', factor: `${EMISSION_FACTORS.CAR}kg/km` },
    { label: 'Bus Distance', key: 'busKm', category: 'transport', unit: 'KM', factor: `${EMISSION_FACTORS.BUS}kg/km` },
    { label: 'Electricity Use', key: 'electricityKwh', category: 'utilities', unit: 'kWh', factor: `${EMISSION_FACTORS.ELECTRICITY}kg/kWh` },
    { label: 'LPG Usage', key: 'lpgKg', category: 'utilities', unit: 'kg', factor: `${EMISSION_FACTORS.LPG}kg/kg` },
  ].filter(f => f.label.toLowerCase().includes(inputSearch.toLowerCase()));

  const waterFields = [
    { label: 'Bathing Time', key: 'showersMinutes', unit: 'Mins', info: `${WATER_FACTORS.SHOWER} Liters / Min` },
    { label: 'Laundry Loads', key: 'laundryLoads', unit: 'Loads', info: `${WATER_FACTORS.LAUNDRY} Liters / Load` },
    { label: 'Dishwashing', key: 'dishwashingLoads', unit: 'Loads', info: `${WATER_FACTORS.DISHWASH} Liters / Load` },
    { label: 'Cooking Intake', key: 'cookingLiters', unit: 'L', info: `Direct Input (1:1)` },
  ].filter(f => f.label.toLowerCase().includes(inputSearch.toLowerCase()));

  /**
   * Filter history logs by activity name, specific keyword, or date string
   */
  const filteredHistory = useMemo(() => {
    const logs = (userData.logs as any) || [];
    if (!historySearch.trim()) return logs;
    
    const term = historySearch.toLowerCase();
    return logs.filter((log: any) => 
      (log.activities || []).some((act: string) => act.toLowerCase().includes(term)) ||
      new Date(log.date).toLocaleDateString().includes(term) ||
      new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toLowerCase().includes(term)
    );
  }, [userData.logs, historySearch]);

  return (
    <div className="p-4 space-y-4 pb-24 max-w-md mx-auto">
      {/* Date Range Selection & Input Search */}
      <div className="bg-white p-5 rounded-[2.5rem] border-2 border-emerald-50 shadow-xl space-y-4 animate-pop">
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          {(['daily', 'weekly', 'monthly'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                timeRange === range ? 'bg-white shadow-md text-emerald-600 scale-105' : 'text-gray-400'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search input fields..." 
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 pl-12 text-sm font-black text-gray-800 focus:bg-white focus:border-emerald-500 transition-all outline-none"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-30">🔍</span>
        </div>
      </div>

      {/* Main Filtered Footprint Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-6 rounded-[2.5rem] border-2 transition-all duration-500 hover:scale-[1.05] hover:shadow-lg ${activeField ? 'blur-[1px] opacity-40' : 'bg-emerald-600 text-white shadow-lg border-emerald-500'}`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{timeRange === 'daily' ? 'Day' : timeRange === 'weekly' ? 'Week' : 'Month'} CO₂</span>
            <StressBadge level={carbonStress} />
          </div>
          <div className="text-4xl font-black">
            {currentCarbon.toFixed(1)}
            <span className="text-xs font-normal ml-1 opacity-70">kg</span>
          </div>
        </div>
        <div className={`p-6 rounded-[2.5rem] border-2 transition-all duration-500 hover:scale-[1.05] hover:shadow-lg ${activeField ? 'blur-[1px] opacity-40' : 'bg-sky-600 text-white shadow-lg border-sky-500'}`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{timeRange === 'daily' ? 'Day' : timeRange === 'weekly' ? 'Week' : 'Month'} Water</span>
            <StressBadge level={waterStress} />
          </div>
          <div className="text-4xl font-black">
            {Math.round(currentWater)}
            <span className="text-xs font-normal ml-1 opacity-70">L</span>
          </div>
        </div>
      </div>

      {/* Input Sections */}
      <div className="space-y-4">
        {transportFields.length > 0 && (
          <Card title="🚗 Transport & Energy" subtitle="Monthly utility data + travel distance" className="rounded-[2.5rem]">
            <div className="space-y-3">
              {transportFields.map((item) => (
                <div 
                  key={item.key} 
                  className={`flex justify-between items-center p-3 rounded-2xl transition-all duration-300 border-2 ${activeField === item.key ? 'bg-emerald-50 border-emerald-500 shadow-md translate-x-1' : 'bg-transparent border-transparent hover:bg-gray-50'}`}
                >
                  <div className="flex flex-col">
                    <span className={`text-sm font-black transition-all ${activeField === item.key ? 'text-emerald-700' : 'text-gray-800'}`}>
                      {item.label}
                    </span>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{item.factor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={(userData[item.category as keyof UserData] as any)[item.key] || ''} 
                      onFocus={() => setActiveField(item.key)}
                      onBlur={() => setActiveField(null)}
                      onChange={(e) => updateField(item.category as any, item.key, e.target.value)} 
                      className={`w-24 bg-gray-100 border-none rounded-xl p-3 text-right font-black transition-all outline-none ${activeField === item.key ? 'bg-white text-emerald-700 ring-2 ring-emerald-500' : 'text-gray-900'}`} 
                    />
                    <span className="text-[10px] font-black text-gray-400 w-8">{item.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {waterFields.length > 0 && (
          <Card title="💧 Water Usage" subtitle="Daily household activities" className="rounded-[2.5rem]">
            <div className="space-y-3">
              {waterFields.map((item) => (
                <div key={item.key} className="flex flex-col gap-1">
                  <div 
                    className={`flex justify-between items-center p-3 rounded-2xl transition-all duration-300 border-2 ${activeField === item.key ? 'bg-sky-50 border-sky-500 shadow-md translate-x-1' : 'bg-transparent border-transparent hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-black transition-all ${activeField === item.key ? 'text-sky-700' : 'text-gray-800'}`}>
                        {item.label}
                      </span>
                      <button 
                        onClick={() => setShowInfo(showInfo === item.key ? null : item.key)}
                        className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black transition-all ${showInfo === item.key ? 'bg-sky-500 text-white' : 'bg-sky-100 text-sky-500'}`}
                      >
                        ?
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={(userData.water as any)[item.key] || ''} 
                        onFocus={() => setActiveField(item.key)}
                        onBlur={() => setActiveField(null)}
                        onChange={(e) => updateField('water', item.key, e.target.value)} 
                        className={`w-24 bg-gray-100 border-none rounded-xl p-3 text-right font-black transition-all outline-none ${activeField === item.key ? 'bg-white text-sky-700 ring-2 ring-sky-500' : 'text-gray-900'}`} 
                      />
                      <span className="text-[10px] font-black text-gray-400 w-8">{item.unit}</span>
                    </div>
                  </div>
                  {showInfo === item.key && (
                    <div className="px-4 py-2 bg-sky-50 border border-sky-100 rounded-xl mx-2 animate-pop">
                      <p className="text-[10px] font-black text-sky-700 uppercase tracking-widest flex items-center gap-2">
                        <span>📝 Calculation Rule:</span>
                        <span>{item.info}</span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Solar Section */}
        <Card title="🔆 Solar Potential" subtitle="Estimate rooftop impact" className="rounded-[2.5rem]">
           <div className="space-y-4">
              <div className="flex items-center gap-4 group">
                <input 
                  type="number" 
                  value={userData.solar.rooftopSize || ''}
                  onChange={(e) => updateSolar(e.target.value)}
                  className="flex-1 bg-gray-100 border-2 border-transparent rounded-xl p-4 text-gray-900 font-black text-xl focus:bg-white focus:border-amber-500 outline-none"
                  placeholder="Rooftop m²"
                />
                <span className="text-gray-500 font-black">m²</span>
              </div>
              {userData.solar.rooftopSize > 0 && (
                <div className="grid grid-cols-2 gap-3 animate-pop">
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-center">
                    <p className="text-2xl font-black text-amber-600">{solarResults.capacityKW}kW</p>
                    <p className="text-[9px] font-black text-amber-400 uppercase">Capacity</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                    <p className="text-2xl font-black text-emerald-600">{solarResults.co2SavedMonth}kg</p>
                    <p className="text-[9px] font-black text-emerald-400 uppercase">CO₂ Offset/mo</p>
                  </div>
                </div>
              )}
           </div>
        </Card>

        <button 
          onClick={saveToHistory}
          className="w-full bg-gray-900 text-white p-5 rounded-[2rem] font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-emerald-700"
        >
          <span>📥</span> ARCHIVE CURRENT PROGRESS
        </button>

        {/* Impact History Section with Refined Search */}
        <div className="mt-12 animate-pop">
          <div className="flex flex-col gap-4 mb-6 px-2">
            <div>
              <h3 className="text-2xl font-black text-gray-800">Impact History</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Review activity streaks</p>
            </div>
            
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search logs (e.g. 'Car', 'Bathing', 'Oct')..." 
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full bg-white border-2 border-gray-100 rounded-2xl p-4 pl-12 text-sm font-bold focus:border-emerald-300 outline-none group-hover:border-gray-200 transition-all shadow-sm"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-lg">🔎</span>
              {historySearch && (
                <button 
                  onClick={() => setHistorySearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase hover:text-red-500"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredHistory.length > 0 ? filteredHistory.map((log: any) => (
              <div key={log.id} className="bg-white border-2 border-emerald-50 p-5 rounded-[2rem] shadow-sm flex justify-between items-center group hover:border-emerald-500 transition-all hover:shadow-lg hover:scale-[1.02]">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    {new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(log.activities || []).map((act: string, i: number) => (
                      <span key={i} className="bg-emerald-50 text-emerald-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                        {act}
                      </span>
                    ))}
                    {(log.activities || []).length === 0 && (
                      <span className="text-[8px] font-bold text-gray-300 italic">No activity tags</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-gray-800">{log.carbonKg.toFixed(1)}<span className="text-[10px] font-bold text-gray-400 ml-0.5">kg</span></p>
                  <p className="text-sm font-bold text-sky-600">{Math.round(log.waterLiters)}<span className="text-[8px] ml-0.5">L</span></p>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                <div className="text-4xl mb-2 opacity-20">🍃</div>
                <p className="text-xs text-gray-400 font-black uppercase tracking-widest">
                  {historySearch ? 'No matching logs found' : 'Your history is clear'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonTracker;
