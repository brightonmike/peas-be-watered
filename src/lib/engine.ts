import type { Crop, CropSuggestion, WeatherData, Recommendation, RecommendationState } from "@/lib/types";

const BASELINE_MOISTURE = 50;
const WATERED_MOISTURE = 90;   // starting moisture when user just watered
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

function projectWaterDate(
  crop: Crop,
  weather: WeatherData,
  startMoisture: number,
): { daysUntil: number | null; waterOnDate: string | null } {
  const allDays = [weather.today, ...weather.forecast];
  const threshold = thresholdForCrop(crop);
  const drain = crop.waterNeed * DAILY_DRAIN_FACTOR;
  let moisture = startMoisture;

  for (let i = 0; i < allDays.length; i++) {
    const day = allDays[i];
    moisture += rainScore(day.rainMm) - evaporationLoss(day.tempMaxC, day.windKph, day.humidityPct) - drain;
    if (moisture <= threshold) {
      return { daysUntil: i, waterOnDate: day.date };
    }
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

function formatReason(state: RecommendationState, daysUntil: number | null, waterOnDate: string | null, forecastDays: number, wateredToday: boolean): string {
  const prefix = wateredToday ? "You watered today. " : "";
  if (state === "no-watering") {
    return `${prefix}No watering needed in the next ${forecastDays} days.`;
  }
  if (state === "heat-stress") {
    return `${prefix}Dry and hot — water now to prevent heat stress.`;
  }
  if (state === "water-today") {
    return `${prefix}Soil is running low. Water today.`;
  }
  if (daysUntil === 1) {
    return `${prefix}Water tomorrow — soil will be getting dry.`;
  }
  const label = waterOnDate
    ? new Date(waterOnDate + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "long" })
    : `in ${daysUntil} days`;
  return `${prefix}Next watering needed on ${label}.`;
}

export function recommend(crops: Crop[], weather: WeatherData, wateredToday = false): Recommendation {
  if (crops.length === 0) {
    return { state: "no-watering", daysUntil: null, waterOnDate: null, forecastDays: 0, reason: "No crops selected.", cropSuggestions: [] };
  }

  const startMoisture = wateredToday ? WATERED_MOISTURE : BASELINE_MOISTURE;
  const isHotToday = weather.today.tempMaxC > HEAT_STRESS_TEMP_C;
  const forecastDays = 1 + weather.forecast.length;

  const cropSuggestions: CropSuggestion[] = crops.map((crop) => {
    const { daysUntil, waterOnDate } = projectWaterDate(crop, weather, startMoisture);
    return { cropId: crop.id, cropName: crop.name, daysUntil, waterOnDate };
  });

  // Most urgent crop = smallest daysUntil (nulls last)
  const urgentSuggestion = cropSuggestions.reduce((worst, s) => {
    if (s.daysUntil === null) return worst;
    if (worst.daysUntil === null || s.daysUntil < worst.daysUntil) return s;
    return worst;
  }, cropSuggestions[0]);

  const { daysUntil, waterOnDate } = urgentSuggestion.daysUntil !== null
    ? urgentSuggestion
    : { daysUntil: null, waterOnDate: null };

  const state = stateFromDays(daysUntil, isHotToday);
  const reason = formatReason(state, daysUntil, waterOnDate, forecastDays, wateredToday);

  return { state, daysUntil, waterOnDate, forecastDays, reason, cropSuggestions };
}
