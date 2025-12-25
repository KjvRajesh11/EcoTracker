
import React from 'react';
import { AppRoute } from '../types/sustainability';

export const LandingPage = ({ onStart }: { onStart: (r: AppRoute) => void }) => {
  return (
    <div className="min-h-screen bg-emerald-600 text-white flex flex-col items-center justify-center p-8 text-center animate-pop">
      <div className="text-6xl mb-6">🌏</div>
      <h1 className="text-4xl font-black mb-4 tracking-tighter">EcoTracker</h1>
      <p className="text-emerald-100 mb-12 max-w-xs text-lg font-medium">
        The ultimate toolkit for tracking and reducing your environmental footprint. No accounts. Total privacy.
      </p>
      <button 
        onClick={() => onStart(AppRoute.WorkspaceSelector)}
        className="bg-white text-emerald-600 px-10 py-5 rounded-[2rem] font-black text-xl shadow-2xl active:scale-95 transition-all hover:bg-emerald-50"
      >
        Get Started
      </button>
      <div className="mt-12 flex flex-col gap-2">
        <p className="text-[10px] text-emerald-200 uppercase tracking-[0.3em] font-black">Institutional Grade • Rule-Based</p>
        <p className="text-[10px] text-emerald-300/50 font-bold">IIT-Level Sustainability OS</p>
      </div>
    </div>
  );
};