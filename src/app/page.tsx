import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getPrefsFromCookie } from "@/lib/cookies.server";
import { getCropsByIds } from "@/lib/crops";
import { ROOTS_LOCATION_MAP } from "@/lib/roots-locations";
import { getWeather } from "@/lib/weather";
import { recommend, computeCurrentMoisture, pickHeroCrop, BASELINE_MOISTURE } from "@/lib/engine";
import RecommendationCard from "@/components/RecommendationCard";
import RefreshButton from "@/components/RefreshButton";
import ExplainerModal from "@/components/ExplainerModal";
import SoilCrossSection from "@/components/SoilCrossSection";
import CropSuggestionList from "@/components/CropSuggestionList";
import RainForecast from "@/components/RainForecast";

async function Scene() {
  const prefs = await getPrefsFromCookie();
  if (!prefs) redirect("/setup");

  const crops = getCropsByIds(prefs.crops);
  const rootsLocation = prefs.rootsLocationId ? ROOTS_LOCATION_MAP.get(prefs.rootsLocationId) : undefined;

  const today = new Date().toISOString().slice(0, 10);

  let weather;
  try {
    weather = await getWeather(prefs.postcode);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return (
      <div className="px-6 py-16">
        <div className="mx-auto max-w-lg rounded-2xl border border-red-200/50 bg-[var(--color-cream)] p-8">
          <p className="font-serif text-xl text-red-900">Couldn&apos;t load weather data</p>
          <p className="mt-1 font-sans text-sm text-red-700">{message}</p>
          <Link href="/setup" className="mt-4 inline-block font-mono text-[10px] tracking-widest uppercase text-red-800 underline underline-offset-4">
            Check postcode →
          </Link>
        </div>
      </div>
    );
  }

  // Derive today's moisture from real historical weather + watering events.
  // No state to advance — the cookie just holds dates the user said they watered.
  const wateringDates = new Set(prefs.soil?.wateringDates ?? []);
  const wateredToday = wateringDates.has(today);
  const hero = crops.length > 0 ? pickHeroCrop(crops) : null;
  const currentMoisture = hero
    ? computeCurrentMoisture(weather.historical, weather.today, hero, wateringDates)
    : BASELINE_MOISTURE;

  const recommendation = recommend(crops, weather, currentMoisture, wateredToday);

  const locLabel = rootsLocation
    ? `${rootsLocation.siteName} · ${rootsLocation.city}`
    : prefs.postcode;
  const timeLabel = new Date().toLocaleString("en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="relative">

      {/* ── Layer 1: Sticky soil backdrop (full width) ─────────────────────
          Container height = SVG's actual rendered height (width × 640/402),
          so CSS gradient stops at 43.75% line up exactly with the SVG's
          internal sky/soil boundary at viewBox y=280. */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{
          height: "calc(min(100vw, 32rem) * 640 / 402)",
          background: `linear-gradient(180deg,
            var(--color-sky-top)   0%,
            var(--color-sky-mid)   30.6%,
            var(--color-horizon)   43.75%,
            var(--color-soil-top)  43.75%,
            var(--color-soil-mid)  71.9%,
            var(--color-soil-deep) 100%)`,
        }}
      >
        {/* SVG constrained to max-w-lg — plants, roots, labels at correct scale */}
        <div className="mx-auto max-w-lg">
          <SoilCrossSection
            crops={crops}
            suggestions={recommendation.cropSuggestions}
            moisture={recommendation.currentMoisture}
            tempMaxC={weather.today.tempMaxC}
          />
        </div>

        {/* Header — top of sky */}
        <div className="absolute inset-x-0 top-0 pointer-events-none">
          <div className="mx-auto max-w-lg px-5 pt-10 pointer-events-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink)]/55">
                  {timeLabel} · {locLabel}
                </p>
                <h1 className="font-serif text-[34px] leading-[0.95] mt-1.5 font-medium tracking-tight text-[var(--color-ink)]">
                  Peas be<br />
                  <em className="text-[var(--color-leaf-deep)]">Watered.</em>
                </h1>
              </div>
              <span className="font-mono text-[9px] tracking-widest uppercase text-[var(--color-ink)] rounded-full px-2.5 py-1.5 border border-black/15 bg-black/5 backdrop-blur-sm whitespace-nowrap mt-1">
                {Math.round(weather.today.tempMaxC)}° · {weather.today.rainMm < 1 ? "clear" : "rain"}
              </span>
            </div>
          </div>
        </div>

        {/* Rain forecast strip — lower sky, comfortably above the plant tops
            (plant tops sit at ~38% of container; SKY_H/640 = 43.75%). */}
        <div className="absolute inset-x-0 pointer-events-none" style={{ top: "22%" }}>
          <div className="mx-auto max-w-lg px-5 pointer-events-auto">
            <RainForecast weather={weather} />
          </div>
        </div>
      </div>

      {/* ── Layer 2: Cards scroll over the soil ──────────────────────────── */}
      {/* Pull-up = a fraction of the soil's actual rendered height (same
          expression as the sticky container above), so cards consistently
          overlap the lower portion of the soil regardless of viewport. */}
      <div
        className="relative z-10"
        style={{ marginTop: "calc(200px + min(100vw, 32rem) * 640 / 402 * -0.4)" }}
      >
        <div className="mx-auto max-w-lg px-4">

          {/* Verdict card */}
          <RecommendationCard
            recommendation={recommendation}
            prefs={prefs}
            wateredToday={wateredToday}
          />

          {/* Underground content */}
          <div
            className="mt-3 rounded-2xl px-5 pt-6 pb-6 flex flex-col gap-7"
            style={{ background: "rgba(27,19,12,0.92)", backdropFilter: "blur(8px)" }}
          >
            <CropSuggestionList suggestions={recommendation.cropSuggestions} />

            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-moss)] pt-3 border-t border-[var(--color-cream)]/10">
              {locLabel}
            </p>
          </div>

        </div>
      </div>

      {/* Sticky footer — Edit beds primary + Refresh / How this works */}
      <div
        className="sticky bottom-0 z-30 w-full"
        style={{
          background: "linear-gradient(180deg, rgba(27,19,12,0) 0%, rgba(27,19,12,0.92) 30%, rgba(27,19,12,1) 100%)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="mx-auto max-w-lg px-5 pt-6 pb-5 flex flex-col gap-3">
          <Link
            href="/setup"
            className="block text-center rounded-2xl bg-[var(--color-leaf-deep)] px-6 py-4 font-sans text-[15px] font-medium text-[var(--color-cream)] hover:opacity-90 active:opacity-90"
          >
            Edit beds →
          </Link>
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-moss)]">
            <RefreshButton />
            <ExplainerModal />
          </div>
        </div>
      </div>

    </div>
  );
}

function SceneSkeleton() {
  return (
    <div
      className="h-screen w-full"
      style={{ background: `linear-gradient(180deg, var(--color-sky-top) 0%, var(--color-sky-mid) 55%, var(--color-soil-top) 100%)` }}
    />
  );
}

export default function HomePage() {
  return (
    <main className="flex-1">
      <Suspense fallback={<SceneSkeleton />}>
        <Scene />
      </Suspense>
    </main>
  );
}
