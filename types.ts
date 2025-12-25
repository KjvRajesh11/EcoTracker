
export interface UserData {
  transport: {
    carKm: number;
    busKm: number;
    bikeKm: number;
    walkKm: number;
  };
  utilities: {
    electricityKwh: number;
    lpgKg: number;
  };
  water: {
    showersMinutes: number;
    flushes: number;
    dishwashingLoads: number;
    laundryLoads: number;
    cookingLiters: number;
  };
  challenges: string[];
  waste: {
    plasticAvoided: number;
    reusablesUsed: number;
  };
  solar: {
    rooftopSize: number;
    hasChecked: boolean;
  };
  logs: ImpactLog[];
}

export interface ImpactLog {
  date: string;
  carbonKg: number;
  waterLiters: number;
  ecoScore: number;
}

export enum Tab {
  Dashboard = 'dashboard',
  Track = 'track',
  Waste = 'waste',
  Challenges = 'challenges',
  Profile = 'profile'
}

export interface WasteItem {
  name: string;
  category: 'Dry' | 'Wet' | 'E-waste' | 'Hazardous';
  guide: string;
}
