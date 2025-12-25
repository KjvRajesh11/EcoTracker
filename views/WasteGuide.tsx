
import React, { useState } from 'react';
import { WASTE_GUIDE } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";

const WasteGuide: React.FC = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ name: string; category: string; guide: string } | null>(null);

  const localItems = WASTE_GUIDE.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const queryEcoExpert = async () => {
    if (!search.trim()) return;
    
    setLoading(true);
    setAiResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `How should I dispose of "${search}"? Categorize it precisely as 'Wet', 'Dry', 'E-waste', or 'Hazardous' and provide a short, actionable guide.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { 
                type: Type.STRING, 
                description: "Must be exactly one of: 'Wet', 'Dry', 'E-waste', 'Hazardous'" 
              },
              guide: { type: Type.STRING, description: "Max 15 words on how to dispose of it." }
            },
            required: ["name", "category", "guide"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      setAiResult({
        name: data.name || search,
        category: data.category || 'Hazardous',
        guide: data.guide || 'Check local municipal guidelines for this specific item.'
      });
    } catch (error) {
      console.error("AI Sort Error:", error);
      alert("Eco-Expert is currently offline. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 animate-pop">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Waste Sorter</h2>
        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Circular Economy Engine</p>
      </div>

      {/* Search Input */}
      <div className="relative mb-8">
        <input 
          type="text" 
          placeholder="Search item (e.g. Pizza Box, LED)" 
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setAiResult(null);
          }}
          className="w-full bg-white border-2 border-gray-100 rounded-[1.5rem] p-5 pr-14 text-lg font-bold text-gray-900 placeholder:text-gray-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none shadow-sm transition-all"
        />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl opacity-30 pointer-events-none">
          {loading ? '⏳' : search ? '✨' : '🔍'}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Results</h3>
        
        {/* Local Results */}
        {localItems.map((item, idx) => (
          <div key={idx} className="bg-white rounded-[2rem] p-5 border-2 border-transparent hover:border-emerald-50 shadow-sm flex items-start gap-4 transition-all group hover:scale-[1.02] hover:shadow-lg">
            <div className={`w-3 h-14 rounded-full flex-shrink-0 shadow-inner ${
              item.category === 'Wet' ? 'bg-emerald-500' :
              item.category === 'Dry' ? 'bg-sky-500' :
              item.category === 'E-waste' ? 'bg-amber-500' : 'bg-red-500'
            }`} />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-black text-gray-800 text-lg group-hover:text-emerald-700 transition-colors">{item.name}</h4>
                <div className="flex items-center gap-2">
                   <span className="text-[8px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded tracking-widest">Local</span>
                   <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
                    item.category === 'Wet' ? 'bg-emerald-50 text-emerald-600' :
                    item.category === 'Dry' ? 'bg-sky-50 text-sky-600' :
                    item.category === 'E-waste' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {item.category}
                  </span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 leading-snug">{item.guide}</p>
            </div>
          </div>
        ))}

        {/* AI Result */}
        {aiResult && (
          <div className="bg-emerald-950 rounded-[2rem] p-6 border-2 border-emerald-500/30 shadow-2xl flex items-start gap-4 animate-pop">
            <div className={`w-3 h-16 rounded-full flex-shrink-0 shadow-inner ${
              aiResult.category === 'Wet' ? 'bg-emerald-400' :
              aiResult.category === 'Dry' ? 'bg-sky-400' :
              aiResult.category === 'E-waste' ? 'bg-amber-400' : 'bg-red-400'
            }`} />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-black text-white text-xl">{aiResult.name}</h4>
                <div className="flex items-center gap-2">
                   <span className="text-[8px] font-black text-emerald-400 uppercase bg-white/10 px-2 py-0.5 rounded tracking-widest animate-pulse">AI Expert</span>
                   <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full bg-white/10 text-white`}>
                    {aiResult.category}
                  </span>
                </div>
              </div>
              <p className="text-sm font-bold text-emerald-100/80 leading-snug">{aiResult.guide}</p>
            </div>
          </div>
        )}

        {/* Fallback / AI CTA */}
        {localItems.length === 0 && !aiResult && !loading && search.length > 2 && (
          <div className="text-center py-12 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
            <div className="text-4xl mb-4 opacity-20">❔</div>
            <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-6 px-8 leading-tight">
              "{search}" is not in our local database.
            </p>
            <button 
              onClick={queryEcoExpert}
              className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all"
            >
              Ask Eco-Expert AI
            </button>
            <p className="text-[8px] text-gray-400 font-bold mt-4 opacity-40">Privacy: Only the item name is sent for analysis.</p>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-[2rem] p-6 border-2 border-emerald-100 shadow-sm animate-pulse flex items-center gap-4">
             <div className="w-3 h-14 bg-gray-100 rounded-full" />
             <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-50 rounded w-full" />
                <div className="h-3 bg-gray-50 rounded w-2/3" />
             </div>
          </div>
        )}
      </div>

      {/* Protocols Legend */}
      <div className="mt-12 space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Quick Protocol Legend</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <p className="text-xs font-black text-emerald-700 uppercase mb-1">Green Bin</p>
            <p className="text-[10px] font-bold text-emerald-600 leading-tight">Wet / Organic / Compostable</p>
          </div>
          <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100">
            <p className="text-xs font-black text-sky-700 uppercase mb-1">Blue Bin</p>
            <p className="text-[10px] font-bold text-sky-600 leading-tight">Dry / Recyclable Solids</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
            <p className="text-xs font-black text-amber-700 uppercase mb-1">Orange</p>
            <p className="text-[10px] font-bold text-amber-600 leading-tight">Electronic Waste (E-Waste)</p>
          </div>
          <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
            <p className="text-xs font-black text-red-700 uppercase mb-1">Red</p>
            <p className="text-[10px] font-bold text-red-600 leading-tight">Hazardous / Bio-Medical</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteGuide;
