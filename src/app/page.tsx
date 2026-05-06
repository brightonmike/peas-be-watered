import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getPrefsFromCookie } from "@/lib/cookies.server";
import { getCropsByIds } from "@/lib/crops";
import { ROOTS_LOCATION_MAP } from "@/lib/roots-locations";
import { getWeather } from "@/lib/weather";
import { recommend } from "@/lib/engine";
import RecommendationCard from "@/components/RecommendationCard";
import RefreshButton from "@/components/RefreshButton";
import ExplainerModal from "@/components/ExplainerModal";

async function Recommendation() {
  const prefs = await getPrefsFromCookie();
  if (!prefs) redirect("/setup");

  const crops = getCropsByIds(prefs.crops);
  const rootsLocation = prefs.rootsLocationId
    ? ROOTS_LOCATION_MAP.get(prefs.rootsLocationId)
    : undefined;

  const today = new Date().toISOString().slice(0, 10);
  const wateredToday = prefs.lastWateredDate === today;

  let weather;
  try {
    weather = await getWeather(prefs.postcode);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8">
        <p className="font-semibold text-red-800">Couldn&apos;t load weather data</p>
        <p className="mt-1 text-sm text-red-600">{message}</p>
        <a
          href="/setup"
          className="mt-4 inline-block text-sm font-medium text-red-700 underline underline-offset-2"
        >
          Check your postcode in settings →
        </a>
      </div>
    );
  }

  const recommendation = recommend(crops, weather, wateredToday);

  return (
    <RecommendationCard
      recommendation={recommendation}
      weather={weather}
      postcode={prefs.postcode}
      cropCount={crops.length}
      rootsLocation={rootsLocation}
      prefs={prefs}
      wateredToday={wateredToday}
    />
  );
}

function RecommendationSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-100 bg-zinc-50 p-8">
      <div className="mb-6 h-12 w-12 rounded-full bg-zinc-200" />
      <div className="h-7 w-48 rounded bg-zinc-200" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-full rounded bg-zinc-200" />
        <div className="h-4 w-3/4 rounded bg-zinc-200" />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-lg px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Peas be Watered
        </h1>
        <p className="mt-1 text-zinc-500">When should you next water your crops?</p>
      </div>

      <Suspense fallback={<RecommendationSkeleton />}>
        <Recommendation />
      </Suspense>

      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span>Weather updates every 3 hours</span>
          <span>·</span>
          <RefreshButton />
          <span>·</span>
          <Link href="/setup" className="underline underline-offset-2 hover:text-zinc-600">
            Change crops
          </Link>
        </div>
        <ExplainerModal />
      </div>
    </main>
  );
}
