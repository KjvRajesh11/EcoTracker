
export const EMISSION_FACTORS = {
  CAR: 0.17, // kg CO2 per km
  BUS: 0.04, // kg CO2 per km
  ELECTRICITY: 0.82, // kg CO2 per kWh
  LPG: 2.9, // kg CO2 per kg
};

export const WATER_FACTORS = {
  SHOWER: 9, // Liters per min
  FLUSH: 6, // Liters per flush
  DISHWASH: 12, // Liters per load
  LAUNDRY: 50, // Liters per load
};

export const CITY_BENCHMARKS = {
  WATER_DAILY: 135, // Liters
  CARBON_DAILY: 6.6, // kg CO2
};

export const SOLAR_FACTORS = {
  PANEL_EFFICIENCY: 0.15,
  AVG_SUNLIGHT_HOURS: 4,
};

export const TREE_EQUIVALENCE = {
  ANNUAL_ABSORPTION_KG: 21, // 1 tree absorbs ~21kg CO2/year
};

// SIMULATION CONSTANTS (Daily savings per person)
export const SIM_FACTORS = {
  CYCLE_INSTEAD_CAR: 0.85, // 5km daily car trip replaced (5 * 0.17)
  SHORT_SHOWER: 45,       // 5 mins saved (5 * 9L)
  SOLAR_ADOPTION: 0.33,   // Avg daily CO2 reduction from residential solar
  AC_TEMPERATURE: 0.59,   // 1 degree increase saves ~6% energy (approx 0.7kWh * 0.82)
};

export const REGIONAL_DATA: Record<string, any> = {
  'Hyderabad': {
    currentSeason: 'Summer',
    seasonalTip: 'Heatwave expected. Run AC at 24°C to save 20% energy.',
    localAdvice: 'Rainwater harvesting pits are mandatory in plots > 300sq yards here.'
  }
};

export const LIMITATIONS = [
  "Indirect emissions from the food you eat (Scope 3).",
  "The lifecycle carbon cost of manufacturing your devices.",
  "Public infrastructure (roads, streetlights) impact.",
  "Global supply chain shipping routes."
];

export const SIMULATED_LEADERBOARD = [
  { name: 'EcoWarrior_99', score: 98, avatar: '🥑' },
  { name: 'GreenLeaf_JH', score: 94, avatar: '🌿' },
  { name: 'SolarPioneer', score: 91, avatar: '☀️' },
  { name: 'CycleChamp', score: 87, avatar: '🚲' },
  { name: 'WaterSaver_01', score: 82, avatar: '💧' },
  { name: 'EarthFriend_22', score: 79, avatar: '🌳' },
  { name: 'BioQueen', score: 76, avatar: '🌸' },
  { name: 'ZeroWaste_Max', score: 74, avatar: '♻️' },
  { name: 'WindRider', score: 71, avatar: '🪁' },
  { name: 'SunGazer', score: 68, avatar: '🌻' },
  { name: 'NatureBoy_XT', score: 65, avatar: '🍄' },
  { name: 'GreenSpirit', score: 62, avatar: '🧚' },
  { name: 'OceanGuardian', score: 58, avatar: '🌊' },
  { name: 'CompostKing', score: 55, avatar: '🍂' },
  { name: 'BusRider_Prime', score: 52, avatar: '🚌' },
];

export const COMMUNITY_SPOTS = [
  { 
    id: 'solar-spot', 
    x: 15, y: 25, 
    type: 'Solar', 
    action: 'Rooftop Solar', 
    impact: 88, 
    icon: '🔆',
    insight: '60% of homes here use Solar. You haven\'t estimated your rooftop potential yet!' 
  },
  { 
    id: 'water-spot', 
    x: 75, y: 15, 
    type: 'Water', 
    action: 'Greywater Recycle', 
    impact: 72, 
    icon: '💧',
    insight: 'Neighbors save 200L daily using greywater. Check your water logs to find saving gaps.'
  },
  { 
    id: 'waste-spot', 
    x: 35, y: 60, 
    type: 'Waste', 
    action: 'Zero Waste Home', 
    impact: 95, 
    icon: '🗑️',
    insight: 'The 3-bin system is standard here. Your segregation score can be improved in the Sort tab.'
  },
  { 
    id: 'transport-spot', 
    x: 85, y: 80, 
    type: 'Transport', 
    action: 'Cycle Commute', 
    impact: 82, 
    icon: '🚲',
    insight: 'Cycling is up 40% in this sector. Try swapping 1 car trip for a bike ride.'
  },
];
