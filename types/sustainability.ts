
export type WorkspaceType = 'University' | 'Residential' | 'Municipal' | null;
export type PerspectiveMode = 'Individual' | 'Campus' | 'Policy' | null;

export interface TransportData {
  carKm: number;
  busKm: number;
  bikeKm: number;
  walkKm: number;
}

export interface UtilityData {
  electricityKwh: number;
  lpgKg: number;
}

export interface WaterData {
  showersMinutes: number;
  flushes: number;
  dishwashingLoads: number;
  laundryLoads: number;
  cookingLiters: number;
}

export interface WasteData {
  plasticAvoided: number;
  reusablesUsed: number;
  segregationScore: number;
}

export interface HabitStreak {
  currentStreak: number;
  lastLogDate: string; // ISO String
}

export interface ImpactLog {
  id: string;
  date: string;
  carbonKg: number;
  waterLiters: number;
  activities: string[]; 
}

export interface UserData {
  userProfile: {
    username: string;
    isLoggedIn: boolean;
  };
  transport: TransportData;
  utilities: UtilityData;
  water: WaterData;
  waste: WasteData;
  challenges: string[];
  streaks: {
    carFree: HabitStreak;
    shortShower: HabitStreak;
    plasticFree: HabitStreak;
    bikeCommute: HabitStreak;
  };
  solar: {
    rooftopSize: number;
    hasChecked: boolean;
  };
  settings: {
    lowPowerMode: boolean;
    region: string;
    workspace: WorkspaceType;
    mode: PerspectiveMode;
  };
  logs: ImpactLog[];
}

export enum AppRoute {
  Login = 'login',
  Landing = 'landing',
  WorkspaceSelector = 'workspace-selector',
  Dashboard = 'dashboard',
  Carbon = 'carbon',
  Water = 'water',
  Waste = 'waste',
  Energy = 'energy',
  Solar = 'solar',
  Community = 'community',
  Challenges = 'challenges',
  Receipt = 'receipt',
  Campus = 'campus',
  Leaderboard = 'leaderboard',
  Streaks = 'streaks'
}
