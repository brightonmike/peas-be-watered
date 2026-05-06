export interface Crop {
  id: string;
  name: string;
  waterNeed: number;       // 1–10: daily moisture demand
  droughtTolerance: number; // 1–10: resilience before stress
}

export interface UserPrefs {
  postcode: string;
  crops: string[]; // crop ids
  rootsLocationId?: string; // optional Roots Allotments site
  lastWateredDate?: string; // ISO date string (YYYY-MM-DD)
}

export interface WeatherDay {
  date: string;        // ISO date string
  rainMm: number;
  tempMaxC: number;
  windKph: number;
  humidityPct: number;
}

export interface WeatherData {
  today: WeatherDay;
  forecast: WeatherDay[]; // next 3–5 days
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
  reason: string;
  cropSuggestions: CropSuggestion[];
}
