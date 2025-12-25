
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkspaceType, PerspectiveMode } from '../types/sustainability';

interface AppContextType {
  workspace: WorkspaceType;
  mode: PerspectiveMode;
  setContext: (ws: WorkspaceType, m: PerspectiveMode) => void;
  resetContext: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspace, setWorkspace] = useState<WorkspaceType>(null);
  const [mode, setMode] = useState<PerspectiveMode>(null);

  useEffect(() => {
    const savedWs = localStorage.getItem('et_workspace') as WorkspaceType;
    const savedMode = localStorage.getItem('et_mode') as PerspectiveMode;
    if (savedWs) setWorkspace(savedWs);
    if (savedMode) setMode(savedMode);
  }, []);

  const setContext = (ws: WorkspaceType, m: PerspectiveMode) => {
    setWorkspace(ws);
    setMode(m);
    if (ws) localStorage.setItem('et_workspace', ws);
    if (m) localStorage.setItem('et_mode', m);
  };

  const resetContext = () => {
    setWorkspace(null);
    setMode(null);
    localStorage.removeItem('et_workspace');
    localStorage.removeItem('et_mode');
  };

  return (
    <AppContext.Provider value={{ workspace, mode, setContext, resetContext }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppSystem = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppSystem must be used within AppProvider');
  return context;
};
