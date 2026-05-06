import type { Recommendation, UserPrefs } from "@/lib/types";
import WateredButton from "@/components/WateredButton";

const STATE_LABEL = {
  "water-today": "Today, before sundown",
  "water-soon":  "Coming up",
  "water-later": "Later this week",
  "no-watering": "All quiet",
  "heat-stress": "Heat warning · today",
} as const;

const STATE_DROP = {
  "water-today": "var(--color-drop-deep)",
  "water-soon":  "var(--color-drop-deep)",
  "water-later": "var(--color-drop-deep)",
  "no-watering": "var(--color-leaf-deep)",
  "heat-stress": "#C75D3E",
} as const;

function headline(daysUntil: number | null, waterOnDate: string | null): { lead: string; em: string } {
  if (daysUntil === null) return { lead: "The soil", em: "is content." };
  if (daysUntil === 0) return { lead: "The soil", em: "is thirsty." };
  if (daysUntil === 1) return { lead: "Water", em: "tomorrow." };
  const day = new Date(waterOnDate! + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "long" });
  return { lead: "Water on", em: `${day}.` };
}

export default function RecommendationCard({
  recommendation,
  prefs,
  wateredToday,
}: {
  recommendation: Recommendation;
  prefs: UserPrefs;
  wateredToday: boolean;
}) {
  const { state, daysUntil, waterOnDate, reason } = recommendation;
  const { lead, em } = headline(daysUntil, waterOnDate);
  const dropColor = STATE_DROP[state];

  return (
    <div
      className="rounded-[18px] border border-black/10 px-5 py-4 backdrop-blur-md shadow-[0_18px_48px_-16px_rgba(20,12,4,0.5)]"
      style={{ background: "rgba(255, 246, 229, 0.92)" }}
    >
      <div className="flex items-start gap-3.5">
        <svg width="44" height="56" viewBox="0 0 44 56" className="flex-shrink-0">
          <defs>
            <linearGradient id="verdict-drop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-drop)" />
              <stop offset="100%" stopColor={dropColor} />
            </linearGradient>
          </defs>
          <path d="M22 4 c -8 14 -14 20 -14 30 a 14 14 0 0 0 28 0 c 0 -10 -6 -16 -14 -30 z" fill="url(#verdict-drop)" />
          <ellipse cx="17" cy="28" rx="3" ry="6" fill="#fff" opacity="0.6" />
        </svg>

        <div className="flex-1 min-w-0">
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--color-leaf-deep)]">
            {STATE_LABEL[state]}
          </p>
          <h2 className="font-serif text-[26px] leading-[1.05] mt-0.5 text-[var(--color-ink)] font-medium tracking-tight">
            {lead}{" "}
            <span style={{ color: dropColor }} className="italic">
              {em}
            </span>
          </h2>
          <p className="font-sans text-[13px] text-[var(--color-ink)]/70 mt-1.5 leading-snug">
            {reason}
          </p>
        </div>
      </div>

      <div className="mt-3.5">
        <WateredButton prefs={prefs} wateredToday={wateredToday} />
      </div>
    </div>
  );
}
