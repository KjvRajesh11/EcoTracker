
import React, { useState, useEffect } from 'react';
import { UserData, AppRoute } from './types/sustainability';
import { Tab } from './types';
import Layout from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';
import { WorkspaceRoleSelector } from './pages/WorkspaceRoleSelector';
import Dashboard from './views/Dashboard';
import CarbonTracker from './views/CarbonTracker';
import WasteGuide from './views/WasteGuide';
import ImpactSimulator from './views/ImpactSimulator';
import ProfileView from './views/ProfileView';
import LeaderboardView from './views/LeaderboardView';
import StreaksView from './views/StreaksView';
import { EcoReceiptPage } from './pages/EcoReceiptPage';
import { CampusModePage } from './pages/CampusModePage';
import { AppProvider, useAppSystem } from './context/AppContext';

const STORAGE_KEY = 'ecotracker_v3_data';

const emptyStreak = { currentStreak: 0, lastLogDate: '' };

const initialData: UserData = {
  userProfile: {
    username: '',
    isLoggedIn: false
  },
  transport: { carKm: 5, busKm: 5, bikeKm: 0, walkKm: 0 },
  utilities: { electricityKwh: 10, lpgKg: 10 },
  water: { showersMinutes: 5, flushes: 4, dishwashingLoads: 1, laundryLoads: 0, cookingLiters: 5 },
  waste: { plasticAvoided: 0, reusablesUsed: 0, segregationScore: 0 },
  challenges: [],
  streaks: {
    carFree: { ...emptyStreak },
    shortShower: { ...emptyStreak },
    plasticFree: { ...emptyStreak },
    bikeCommute: { ...emptyStreak }
  },
  solar: { rooftopSize: 0, hasChecked: false },
  settings: { 
    lowPowerMode: false, 
    region: 'Hyderabad',
    workspace: null,
    mode: null
  },
  logs: []
};

const AppContent: React.FC = () => {
  const { workspace, mode } = useAppSystem();
  const [route, setRoute] = useState<AppRoute>(AppRoute.Login);
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    // If user is already logged in, skip Login and Landing
    if (userData.userProfile.isLoggedIn) {
      if (workspace && mode) {
        if (route === AppRoute.Login || route === AppRoute.Landing || route === AppRoute.WorkspaceSelector) {
          setRoute(AppRoute.Dashboard);
        }
      } else {
        setRoute(AppRoute.WorkspaceSelector);
      }
    }
  }, [workspace, mode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }, [userData]);

  const handleLoginSuccess = (username: string) => {
    setUserData(prev => ({
      ...prev,
      userProfile: { username, isLoggedIn: true }
    }));
    setRoute(AppRoute.Landing);
  };

  const toggleLowPower = () => {
    setUserData(prev => ({
      ...prev,
      settings: { ...prev.settings, lowPowerMode: !prev.settings.lowPowerMode }
    }));
  };

  const clearAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('et_workspace');
    localStorage.removeItem('et_mode');
    window.location.reload();
  };

  const navigateToTab = (t: Tab) => {
    switch(t) {
      case Tab.Dashboard: setRoute(AppRoute.Dashboard); break;
      case Tab.Track: setRoute(AppRoute.Carbon); break;
      case Tab.Challenges: setRoute(AppRoute.Challenges); break;
      case Tab.Waste: setRoute(AppRoute.Waste); break;
      case Tab.Profile: setRoute(AppRoute.Community); break;
    }
  };

  // 1. Initial State: Login
  if (!userData.userProfile.isLoggedIn && route === AppRoute.Login) {
    return <LoginPage onLogin={handleLoginSuccess} />;
  }

  // 2. Second State: Landing
  if (userData.userProfile.isLoggedIn && route === AppRoute.Landing && !workspace) {
    return <LandingPage onStart={(r) => setRoute(r)} />;
  }

  // 3. Third State: Workspace Selector
  if (!workspace || !mode || route === AppRoute.WorkspaceSelector) {
    return <WorkspaceRoleSelector />;
  }

  // 4. Main App Content
  const renderContent = () => {
    if (mode === 'Policy') {
      return <CampusModePage onBack={() => navigateToTab(Tab.Dashboard)} />;
    }

    switch (route) {
      case AppRoute.Dashboard:
        return (
          <Dashboard 
            userData={userData} 
            onNavigate={(tab) => navigateToTab(tab)} 
            onGoToLeaderboard={() => setRoute(AppRoute.Leaderboard)}
          />
        );
      case AppRoute.Carbon:
      case AppRoute.Water:
        return <CarbonTracker userData={userData} setUserData={setUserData} />;
      case AppRoute.Waste:
        return <WasteGuide />;
      case AppRoute.Challenges:
        return <ImpactSimulator />;
      case AppRoute.Community:
        return (
          <ProfileView 
            userData={userData} 
            onSwitchMode={() => setRoute(AppRoute.WorkspaceSelector)}
            onTogglePower={toggleLowPower}
            onClearData={clearAllData}
            onNavigate={(r) => setRoute(r)}
          />
        );
      case AppRoute.Receipt:
        return <EcoReceiptPage data={userData} onBack={() => setRoute(AppRoute.Dashboard)} />;
      case AppRoute.Leaderboard:
        return <LeaderboardView userData={userData} onBack={() => setRoute(AppRoute.Dashboard)} />;
      case AppRoute.Streaks:
        return (
          <StreaksView 
            userData={userData} 
            setUserData={setUserData} 
            onBack={() => setRoute(AppRoute.Community)} 
          />
        );
      default:
        return (
          <Dashboard 
            userData={userData} 
            onNavigate={(tab) => navigateToTab(tab)} 
            onGoToLeaderboard={() => setRoute(AppRoute.Leaderboard)}
          />
        );
    }
  };

  const mapRouteToTab = (r: AppRoute): Tab => {
    if (r === AppRoute.Dashboard || r === AppRoute.Leaderboard) return Tab.Dashboard;
    if (r === AppRoute.Carbon || r === AppRoute.Water) return Tab.Track;
    if (r === AppRoute.Waste) return Tab.Waste;
    if (r === AppRoute.Challenges) return Tab.Challenges;
    if (r === AppRoute.Community || r === AppRoute.Streaks) return Tab.Profile;
    return Tab.Dashboard;
  };

  return (
    <Layout 
      activeTab={mapRouteToTab(route)} 
      setActiveTab={navigateToTab}
      lowPowerMode={userData.settings.lowPowerMode}
      onTogglePower={toggleLowPower}
    >
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;