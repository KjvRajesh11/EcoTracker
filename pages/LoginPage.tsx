
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    // Simple mock authentication for privacy-first approach
    onLogin(username);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center p-8 animate-pop">
      <div className="max-w-xs mx-auto w-full">
        <div className="mb-12">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-emerald-100 mb-6">
            🌱
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">
            EcoTracker<br/><span className="text-emerald-600">Secure Access</span>
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-4">
            Privacy-First • Local Storage Only
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 block">
              Eco Identifier
            </label>
            <input 
              type="text" 
              placeholder="e.g. green_warrior" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 focus:border-emerald-500 focus:bg-white outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 block">
              Secure Pin (Optional)
            </label>
            <input 
              type="password" 
              placeholder="••••" 
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 focus:border-emerald-500 focus:bg-white outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          {error && <p className="text-[10px] font-bold text-red-500 uppercase px-1">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-gray-900 text-white p-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all mt-4 hover:bg-emerald-700"
          >
            Authorize Session
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-[9px] font-bold text-gray-400 leading-relaxed uppercase">
            No data leaves your device.<br/>
            Session is cleared when you reset local storage.
          </p>
        </div>
      </div>
    </div>
  );
};