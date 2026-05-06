import type { WeatherData, WeatherDay } from "@/lib/types";

const PAST_DAYS = 7;
const FORECAST_DAYS = 5;

// Primary: postcodes.io is a free, purpose-built UK postcode API and is more
// reliable than general geocoders for UK postcodes.
async function geocodeViaPostcodesIo(postcode: string): Promise<{ lat: number; lon: number }> {
  const encoded = encodeURIComponent(postcode.replace(/\s+/g, "").toUpperCase());
  const res = await fetch(`https://api.postcodes.io/postcodes/${encoded}`, {
    next: { revalidate: 86400 }, // postcodes don't move; cache 24h
  });
  if (res.status === 404) {
    const err = new Error(`Postcode not found: "${postcode}". Please check it and try again.`);
    (err as Error & { notFound?: boolean }).notFound = true;
    throw err;
  }
  if (!res.ok) throw new Error(`Postcode lookup failed (${res.status}).`);
  const data = await res.json();
  return { lat: data.result.latitude, lon: data.result.longitude };
}

// Fallback: Open-Meteo's geocoding API. Note: this geocoder doesn't index UK
// postcodes specifically (e.g. "BN13 3UF" returns no hits, "SW16" matches
// places in other countries) — its `country` query param is non-binding, so
// we strictly filter the returned results by country_code === "GB". Best
// useful for town names ("Worthing") rather than full postcodes; serves as a
// safety net when postcodes.io is unreachable.
async function geocodeViaOpenMeteo(postcode: string): Promise<{ lat: number; lon: number }> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", postcode.toUpperCase());
  url.searchParams.set("count", "5");
  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Fallback geocoder failed (${res.status}).`);
  const data = await res.json();
  const ukHit = (data?.results ?? []).find(
    (r: { country_code?: string }) => r.country_code === "GB",
  );
  if (!ukHit) throw new Error(`Postcode not found: "${postcode}".`);
  return { lat: ukHit.latitude, lon: ukHit.longitude };
}

async function geocodePostcode(postcode: string): Promise<{ lat: number; lon: number }> {
  try {
    return await geocodeViaPostcodesIo(postcode);
  } catch (err) {
    // If postcodes.io says "not found" we trust it (UK-specific source of truth).
    // Only fall back to Open-Meteo for transient/network failures.
    if ((err as Error & { notFound?: boolean }).notFound) throw err;
    return await geocodeViaOpenMeteo(postcode);
  }
}

interface OpenMeteoResponse {
  hourly: {
    time: string[];                    // "2026-05-06T00:00", local time when timezone set
    precipitation: number[];           // mm
    temperature_2m: number[];          // °C
    wind_speed_10m: number[];          // km/h
    relative_humidity_2m: number[];    // %
  };
}

function aggregateToDays(hourly: OpenMeteoResponse["hourly"]): WeatherDay[] {
  const byDate = new Map<string, WeatherDay>();
  for (let i = 0; i < hourly.time.length; i++) {
    const date = hourly.time[i].split("T")[0];
    const rain = hourly.precipitation[i] ?? 0;
    const temp = hourly.temperature_2m[i] ?? 15;
    const wind = hourly.wind_speed_10m[i] ?? 0;
    const humidity = hourly.relative_humidity_2m[i] ?? 60;

    const existing = byDate.get(date);
    if (!existing) {
      byDate.set(date, { date, rainMm: rain, tempMaxC: temp, windKph: wind, humidityPct: humidity });
    } else {
      byDate.set(date, {
        date,
        rainMm: existing.rainMm + rain,
        tempMaxC: Math.max(existing.tempMaxC, temp),
        windKph: Math.max(existing.windKph, wind),
        humidityPct: Math.min(existing.humidityPct, humidity),
      });
    }
  }
  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export async function getWeather(postcode: string): Promise<WeatherData> {
  const { lat, lon } = await geocodePostcode(postcode);

  // Round to 2 decimal places (~1km grid). Two postcodes in the same
  // neighbourhood will share a cache entry, multiplying our effective free-tier
  // headroom and keeping us well under the 10k/day limit.
  const cacheLat = Math.round(lat * 100) / 100;
  const cacheLon = Math.round(lon * 100) / 100;

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", cacheLat.toString());
  url.searchParams.set("longitude", cacheLon.toString());
  url.searchParams.set("hourly", "precipitation,temperature_2m,wind_speed_10m,relative_humidity_2m");
  url.searchParams.set("past_days", PAST_DAYS.toString());
  url.searchParams.set("forecast_days", FORECAST_DAYS.toString());
  url.searchParams.set("timezone", "Europe/London");
  // Use the UK Met Office's seamless model for best UK accuracy
  url.searchParams.set("models", "ukmo_seamless");

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } }); // 1 hour
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);

  const data = (await res.json()) as OpenMeteoResponse;
  const days = aggregateToDays(data.hourly);

  // Today's date in the same timezone we requested (Europe/London).
  // Open-Meteo returns local-time strings, so we match by local date.
  const todayIso = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" }); // YYYY-MM-DD
  const todayIdx = days.findIndex((d) => d.date === todayIso);

  if (todayIdx === -1) {
    // Fallback if the API didn't include today (shouldn't happen) — split at midpoint
    return { historical: days.slice(0, PAST_DAYS), today: days[PAST_DAYS], forecast: days.slice(PAST_DAYS + 1) };
  }

  return {
    historical: days.slice(0, todayIdx),
    today: days[todayIdx],
    forecast: days.slice(todayIdx + 1),
  };
}
