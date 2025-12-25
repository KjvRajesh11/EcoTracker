
import { UserData } from '../types/sustainability';
import { EMISSION_FACTORS, WATER_FACTORS, CITY_BENCHMARKS, SOLAR_FACTORS } from '../constants/appConfig';

/**
 * Calculates daily carbon footprint based on transport and utility usage.
 */
export const calculateDailyCarbon = (data: UserData): number => {
  const carKm = data.transport.carKm || 0;
  const busKm = data.transport.busKm || 0;
  const elecKwh = data.utilities.electricityKwh || 0;
  const lpgKg = data.utilities.lpgKg || 0;

  const trans = (carKm * EMISSION_FACTORS.CAR) + (busKm * EMISSION_FACTORS.BUS);
  const utils = (elecKwh * EMISSION_FACTORS.ELECTRICITY / 30) + (lpgKg * EMISSION_FACTORS.LPG / 30);
  
  return trans + utils;
};

// Aliasing for backward compatibility
export const calcCarbon = calculateDailyCarbon;

/**
 * Calculates daily water usage based on household activity categories.
 */
export const calculateDailyWater = (data: UserData): number => {
  const showers = data.water.showersMinutes || 0;
  const flushes = data.water.flushes || 0;
  const dishes = data.water.dishwashingLoads || 0;
  const laundry = data.water.laundryLoads || 0;
  const cooking = data.water.cookingLiters || 0;

  return (showers * WATER_FACTORS.SHOWER) +
         (flushes * WATER_FACTORS.FLUSH) +
         (dishes * WATER_FACTORS.DISHWASH) +
         (laundry * WATER_FACTORS.LAUNDRY) +
         cooking;
};

// Aliasing for backward compatibility
export const calcWater = calculateDailyWater;

/**
 * Calculates the Eco Score (0-100).
 */
export const calculateEcoScore = (carbon: number, water: number, challengesCount: number): number => {
  let score = 70;
  
  if (carbon < CITY_BENCHMARKS.CARBON_DAILY * 0.8) score += 10;
  if (water < CITY_BENCHMARKS.WATER_DAILY * 0.8) score += 10;
  score += (challengesCount * 5);
  
  return Math.min(100, Math.max(0, score));
};

/**
 * Eco Score calculation using UserData object.
 */
export const calcEcoScore = (data: UserData): number => {
  const carbon = calculateDailyCarbon(data);
  const water = calculateDailyWater(data);
  return calculateEcoScore(carbon, water, data.challenges.length);
};

/**
 * Determines water usage stress level.
 */
export const getWaterStress = (liters: number): 'Low' | 'Medium' | 'High' => {
  if (liters < 100) return 'Low';
  if (liters < 180) return 'Medium';
  return 'High';
};

/**
 * Determines carbon footprint stress level.
 */
export const getCarbonStress = (kg: number): 'Low' | 'Medium' | 'High' => {
  if (kg < 4) return 'Low';
  if (kg < 8) return 'Medium';
  return 'High';
};

/**
 * Estimates solar potential and savings.
 */
export const getSolarSavings = (rooftopSize: number) => {
  const capacityKW = rooftopSize * SOLAR_FACTORS.PANEL_EFFICIENCY;
  const generationMonth = capacityKW * SOLAR_FACTORS.AVG_SUNLIGHT_HOURS * 30;
  const co2SavedMonth = generationMonth * EMISSION_FACTORS.ELECTRICITY;
  
  return {
    capacityKW: Number(capacityKW.toFixed(1)),
    generationMonth: Math.round(generationMonth),
    co2SavedMonth: Math.round(co2SavedMonth)
  };
};
