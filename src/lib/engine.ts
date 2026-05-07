import type { Crop, CropSuggestion, WeatherData, WeatherDay, Recommendation, RecommendationState } from "@/lib/types";

export const BASELINE_MOISTURE = 50;
export const WATERING_BONUS = 40;
const DAILY_DRAIN_FACTOR = 0.5;
const THRESHOLD_FACTOR = 5;
const HEAT_STRESS_TEMP_C = 25;

function rainScore(mm: number): number {
  if (mm < 1) return 0;
  if (mm < 5) return 10;
  if (mm < 15) return 25;
  return 50;
}

function evaporationLoss(tempC: number, windKph: number, humidityPct: number): number {
  let loss = 0;
  if (tempC > 20) loss += (tempC - 20) * 0.5;
  if (windKph > 20) loss += (windKph - 20) * 0.1;
  if (humidityPct < 50) loss += (50 - humidityPct) * 0.1;
  return loss;
}

function thresholdForCrop(crop: Crop): number {
  return (10 - crop.droughtTolerance) * THRESHOLD_FACTOR;
}

function clamp01(m: number): number {
  return Math.max(0, Math.min(100, m));
}

export function pickHeroCrop(crops: Crop[]): Crop {
  return crops.reduce(
    (a, b) => (b.waterNeed - b.droughtTolerance > a.waterNeed - a.droughtTolerance ? b : a),
    crops[0],
  );
}

function applyDay(moisture: number, day: WeatherDay, drain: number, watered: boolean): number {
  const delta = rainScore(day.rainMm) - evaporationLoss(day.tempMaxC, day.windKph, day.humidityPct) - drain;
  let m = clamp01(moisture + delta);
  if (watered) m = Math.min(100, m + WATERING_BONUS);
  return m;
}

/**
 * Walk forward from BASELINE through the past 7 days of real observed weather +
 * today, applying watering events along the way. The result is today's
 * moisture — fully derived from real data, no estimation fudge.
 */
export function computeCurrentMoisture(
  historical: WeatherDay[],
  today: WeatherDay,
  hero: Crop,
  wateringDates: Set<string>,
): number {
  const drain = hero.waterNeed * DAILY_DRAIN_FACTOR;
  let m = BASELINE_MOISTURE;
  for (const day of historical) {
    m = applyDay(m, day, drain, wateringDates.has(day.date));
  }
  m = applyDay(m, today, drain, wateringDates.has(today.date));
  return m;
}

/**
 * Project a single crop's moisture forward through the forecast,
 * starting from `currentMoisture`. Returns the day this crop hits its threshold.
 */
function projectCrop(
  crop: Crop,
  weather: WeatherData,
  currentMoisture: number,
): { daysUntil: number | null; waterOnDate: string | null } {
  const threshold = thresholdForCrop(crop);
  if (currentMoisture <= threshold) {
    return { daysUntil: 0, waterOnDate: weather.today.date };
  }

  const drain = crop.waterNeed * DAILY_DRAIN_FACTOR;
  let m = currentMoisture;
  for (let i = 0; i < weather.forecast.length; i++) {
    const day = weather.forecast[i];
    m = clamp01(m + rainScore(day.rainMm) - evaporationLoss(day.tempMaxC, day.windKph, day.humidityPct) - drain);
    if (m <= threshold) return { daysUntil: i + 1, waterOnDate: day.date };
  }
  return { daysUntil: null, waterOnDate: null };
}

function stateFromDays(daysUntil: number | null, isHotToday: boolean): RecommendationState {
  if (daysUntil === null) return "no-watering";
  if (daysUntil === 0 && isHotToday) return "heat-stress";
  if (daysUntil === 0) return "water-today";
  if (daysUntil <= 3) return "water-soon";
  return "water-later";
}

function formatReason(
  state: RecommendationState,
  daysUntil: number | null,
  waterOnDate: string | null,
  forecastDays: number,
  wateredToday: boolean,
): string {
  const prefix = wateredToday ? "You watered today. " : "";
  if (state === "no-watering") return `${prefix}No watering needed in the next ${forecastDays} days.`;
  if (state === "heat-stress") return `${prefix}Dry and hot — water now to prevent heat stress.`;
  if (state === "water-today") return `${prefix}Soil is running low. Water today.`;
  if (daysUntil === 1) return `${prefix}Water tomorrow — soil will be getting dry.`;
  const label = waterOnDate
    ? new Date(waterOnDate + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "long" })
    : `in ${daysUntil} days`;
  return `${prefix}Next watering needed on ${label}.`;
}

export interface DayStep {
  date: string;
  rainMm: number;
  tempMaxC: number;
  windKph: number;
  humidityPct: number;
  rainScore: number;
  evapLoss: number;
  drain: number;
  watered: boolean;
  moistureAfter: number;
}

export interface MoistureTrace {
  hero: Crop;
  threshold: number;
  baseline: number;
  history: DayStep[];   // includes today as the last entry
  forecast: DayStep[];  // future days, projected moisture
  forecastCrossesThreshold: boolean;
  daysUntilThreshold: number | null;
}

/**
 * Walk through the same model `recommend()` uses, but capture every day's
 * intermediate values so the rationale modal can render the full reasoning.
 */
export function buildMoistureTrace(
  crops: Crop[],
  weather: WeatherData,
  wateringDates: Set<string>,
): MoistureTrace | null {
  if (crops.length === 0) return null;
  const hero = pickHeroCrop(crops);
  const threshold = thresholdForCrop(hero);
  const drain = hero.waterNeed * DAILY_DRAIN_FACTOR;

  function step(day: WeatherDay, prevMoisture: number, allowWater: boolean): DayStep {
    const r = rainScore(day.rainMm);
    const e = evaporationLoss(day.tempMaxC, day.windKph, day.humidityPct);
    let m = clamp01(prevMoisture + r - e - drain);
    const watered = allowWater && wateringDates.has(day.date);
    if (watered) m = Math.min(100, m + WATERING_BONUS);
    return {
      date: day.date,
      rainMm: day.rainMm,
      tempMaxC: day.tempMaxC,
      windKph: day.windKph,
      humidityPct: day.humidityPct,
      rainScore: r,
      evapLoss: e,
      drain,
      watered,
      moistureAfter: m,
    };
  }

  // History = past + today
  const history: DayStep[] = [];
  let m = BASELINE_MOISTURE;
  for (const d of weather.historical) {
    const s = step(d, m, true);
    history.push(s);
    m = s.moistureAfter;
  }
  const todayStep = step(weather.today, m, true);
  history.push(todayStep);
  m = todayStep.moistureAfter;

  // Forecast = projection from today's value forward
  const forecast: DayStep[] = [];
  let crossed = false;
  let daysUntil: number | null = null;
  for (let i = 0; i < weather.forecast.length; i++) {
    const s = step(weather.forecast[i], m, false);
    forecast.push(s);
    m = s.moistureAfter;
    if (!crossed && s.moistureAfter <= threshold) {
      crossed = true;
      daysUntil = i + 1;
    }
  }
  if (todayStep.moistureAfter <= threshold) {
    crossed = true;
    daysUntil = 0;
  }

  return {
    hero,
    threshold,
    baseline: BASELINE_MOISTURE,
    history,
    forecast,
    forecastCrossesThreshold: crossed,
    daysUntilThreshold: daysUntil,
  };
}

export function recommend(
  crops: Crop[],
  weather: WeatherData,
  currentMoisture: number,
  wateredToday: boolean,
): Recommendation {
  if (crops.length === 0) {
    return {
      state: "no-watering",
      daysUntil: null,
      waterOnDate: null,
      forecastDays: 0,
      currentMoisture,
      reason: "No crops selected.",
      cropSuggestions: [],
    };
  }

  const isHotToday = weather.today.tempMaxC > HEAT_STRESS_TEMP_C;
  const forecastDays = 1 + weather.forecast.length;

  const cropSuggestions: CropSuggestion[] = crops.map((crop) => {
    const { daysUntil, waterOnDate } = projectCrop(crop, weather, currentMoisture);
    return { cropId: crop.id, cropName: crop.name, daysUntil, waterOnDate };
  });

  const urgent = cropSuggestions.reduce((worst, s) => {
    if (s.daysUntil === null) return worst;
    if (worst.daysUntil === null || s.daysUntil < worst.daysUntil) return s;
    return worst;
  }, cropSuggestions[0]);

  const { daysUntil, waterOnDate } =
    urgent.daysUntil !== null ? urgent : { daysUntil: null, waterOnDate: null };

  const state = stateFromDays(daysUntil, isHotToday);
  const reason = formatReason(state, daysUntil, waterOnDate, forecastDays, wateredToday);

  return { state, daysUntil, waterOnDate, forecastDays, currentMoisture, reason, cropSuggestions };
}
