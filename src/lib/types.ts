export interface Crop {
  id: string;
  name: string;
  waterNeed: number;       // 1–10: daily moisture demand
  droughtTolerance: number; // 1–10: resilience before stress
}

export interface SoilState {
  // Dates the user pressed "I watered today". Each adds +40 (capped at 100)
  // when the simulation walks past that date. Trimmed to last 30 days client-side.
  wateringDates: string[];
}

export interface UserPrefs {
  postcode: string;
  crops: string[]; // crop ids
  rootsLocationId?: string; // optional Roots Allotments site
  soil?: SoilState;
}

export interface WeatherDay {
  date: string;        // ISO date string
  rainMm: number;
  tempMaxC: number;
  windKph: number;
  humidityPct: number;
}

export interface WeatherData {
  historical: WeatherDay[]; // past ~7 days, oldest first, real observed weather
  today: WeatherDay;
  forecast: WeatherDay[];   // next ~5 days, model forecast
}

export type RecommendationState =
  | "water-today"
  | "water-soon"
  | "water-later"
  | "no-watering"
  | "heat-stress";

export interface CropSuggestion {
  cropId: string;
  cropName: string;
  daysUntil: number | null;   // null = fine within forecast window
  waterOnDate: string | null; // ISO date string
}

export interface Recommendation {
  state: RecommendationState;
  daysUntil: number | null;
  waterOnDate: string | null;
  forecastDays: number;
  currentMoisture: number; // 0-100, today's snapshot for the most demanding crop
  reason: string;
  cropSuggestions: CropSuggestion[];
}
