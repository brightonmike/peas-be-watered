import type { Recommendation, UserPrefs, WeatherData } from "@/lib/types";
import type { RootsLocation } from "@/lib/roots-locations";
import Link from "next/link";
import CropSuggestionList from "@/components/CropSuggestionList";
import WateredButton from "@/components/WateredButton";
import RainForecast from "@/components/RainForecast";

const STATE_STYLE = {
  "water-today":  { bg: "bg-orange-50",  border: "border-orange-200", text: "text-orange-900", sub: "text-orange-700", emoji: "🚿" },
  "water-soon":   { bg: "bg-sky-50",     border: "border-sky-200",    text: "text-sky-900",    sub: "text-sky-700",    emoji: "💧" },
  "water-later":  { bg: "bg-blue-50",    border: "border-blue-100",   text: "text-blue-900",   sub: "text-blue-700",   emoji: "📅" },
  "no-watering":  { bg: "bg-green-50",   border: "border-green-200",  text: "text-green-900",  sub: "text-green-700",  emoji: "✅" },
  "heat-stress":  { bg: "bg-red-50",     border: "border-red-200",    text: "text-red-900",    sub: "text-red-700",    emoji: "⚠️" },
} as const;

function headline(daysUntil: number | null, waterOnDate: string | null): string {
  if (daysUntil === null) return "No watering needed";
  if (daysUntil === 0) return "Water today";
  if (daysUntil === 1) return "Water tomorrow";
  const day = new Date(waterOnDate! + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "long" });
  return `Water on ${day}`;
}

export default function RecommendationCard({
  recommendation,
  weather,
  postcode,
  cropCount,
  rootsLocation,
  prefs,
  wateredToday,
}: {
  recommendation: Recommendation;
  weather: WeatherData;
  postcode: string;
  cropCount: number;
  rootsLocation?: RootsLocation;
  prefs: UserPrefs;
  wateredToday: boolean;
}) {
  const cfg = STATE_STYLE[recommendation.state];

  return (
    <div>
      <div className={`rounded-2xl border ${cfg.bg} ${cfg.border} p-8`}>
        <div className="mb-6">
          <span className="text-5xl">{cfg.emoji}</span>
        </div>
        <h2 className={`text-2xl font-bold ${cfg.text}`}>
          {headline(recommendation.daysUntil, recommendation.waterOnDate)}
        </h2>
        <p className={`mt-3 text-base leading-relaxed ${cfg.sub}`}>
          {recommendation.reason}
        </p>

        <RainForecast weather={weather} />

        <div className="mt-5">
          <WateredButton prefs={prefs} wateredToday={wateredToday} />
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-current/10 pt-6 text-sm text-zinc-400">
          <span>
            {rootsLocation ? (
              <>{rootsLocation.siteName}, {rootsLocation.city}</>
            ) : (
              postcode
            )}
            {" "}· {cropCount} {cropCount === 1 ? "crop" : "crops"}
          </span>
          <Link
            href="/setup"
            className="font-medium text-zinc-500 underline-offset-2 hover:underline"
          >
            Edit
          </Link>
        </div>
      </div>

      <CropSuggestionList suggestions={recommendation.cropSuggestions} />
    </div>
  );
}
