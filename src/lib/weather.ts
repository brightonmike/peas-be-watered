import type { WeatherData, WeatherDay } from "@/lib/types";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

// postcodes.io is a free, purpose-built UK postcode API — more reliable than
// OpenWeather's geocoding for UK postcodes, and requires no API key.
async function geocodePostcode(postcode: string): Promise<{ lat: number; lon: number }> {
  const encoded = encodeURIComponent(postcode.replace(/\s+/g, "").toUpperCase());
  const res = await fetch(
    `https://api.postcodes.io/postcodes/${encoded}`,
    { next: { revalidate: 86400 } }, // postcodes don't move; cache 24h
  );
  if (res.status === 404) throw new Error(`Postcode not found: "${postcode}". Please check it and try again.`);
  if (!res.ok) throw new Error(`Postcode lookup failed (${res.status}). Please try again.`);
  const data = await res.json();
  return { lat: data.result.latitude, lon: data.result.longitude };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseDay(entry: any): WeatherDay {
  return {
    date: entry.dt_txt?.split(" ")[0] ?? "",
    rainMm: entry.rain?.["3h"] ?? 0,
    tempMaxC: entry.main?.temp_max - 273.15, // Kelvin → Celsius
    windKph: (entry.wind?.speed ?? 0) * 3.6, // m/s → km/h
    humidityPct: entry.main?.humidity ?? 50,
  };
}

export async function getWeather(postcode: string): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error("OPENWEATHER_API_KEY is not set");

  const { lat, lon } = await geocodePostcode(postcode);

  const res = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&cnt=40`,
    { next: { revalidate: 10800 } }, // 3-hour cache
  );
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);

  const data = await res.json();
  const entries: WeatherDay[] = data.list.map(parseDay);

  // Group by date; take the worst-case (max rain, max temp) per day
  const byDate = new Map<string, WeatherDay>();
  for (const entry of entries) {
    const existing = byDate.get(entry.date);
    if (!existing) {
      byDate.set(entry.date, entry);
    } else {
      byDate.set(entry.date, {
        ...existing,
        rainMm: existing.rainMm + entry.rainMm,
        tempMaxC: Math.max(existing.tempMaxC, entry.tempMaxC),
        windKph: Math.max(existing.windKph, entry.windKph),
        humidityPct: Math.min(existing.humidityPct, entry.humidityPct),
      });
    }
  }

  const days = Array.from(byDate.values());
  const [today, ...forecast] = days;

  return { today, forecast };
}
