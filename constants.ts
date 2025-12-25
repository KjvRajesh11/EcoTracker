
import { WasteItem } from './types';

export const EMISSION_FACTORS = {
  CAR: 0.17, // kg CO2 per km (average petrol car)
  BUS: 0.04, // kg CO2 per passenger km
  ELECTRICITY: 0.82, // kg CO2 per kWh (global/coal-heavy mix)
  LPG: 2.9, // kg CO2 per kg of LPG
};

export const WATER_FACTORS = {
  SHOWER: 9, // Liters per minute
  FLUSH: 6, // Liters per flush
  DISHWASH: 12, // Liters per load
  LAUNDRY: 50, // Liters per load (average machine)
};

export const CITY_AVERAGES = {
  WATER_DAILY: 135, // Liters per person
  CARBON_DAILY: 6.6, // ~200kg per month / 30
};

export const WASTE_GUIDE: WasteItem[] = [
  { name: 'Apple Core', category: 'Wet', guide: 'Compostable. Place in green bin.' },
  { name: 'Cardboard Box', category: 'Dry', guide: 'Recyclable. Flatten and place in blue bin.' },
  { name: 'Plastic Bottle', category: 'Dry', guide: 'Recyclable. Wash and remove cap.' },
  { name: 'Battery', category: 'E-waste', guide: 'Toxic. Take to designated collection point.' },
  { name: 'Smartphone', category: 'E-waste', guide: 'Recycle at e-waste centers only.' },
  { name: 'Vegetable Scraps', category: 'Wet', guide: 'Organic waste. Great for home composting.' },
  { name: 'Aluminum Can', category: 'Dry', guide: 'Infinite recyclability. Rinse and recycle.' },
  { name: 'Expired Medicine', category: 'Hazardous', guide: 'Do not flush. Hand over to pharmacy or clinic.' },
];

export const APP_COLOR = {
  primary: 'emerald-600',
  secondary: 'sky-500',
  accent: 'amber-500',
  neutral: 'gray-100'
};
