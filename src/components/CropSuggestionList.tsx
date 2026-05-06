import type { CropSuggestion } from "@/lib/types";
import { CropIcon } from "@/components/CropIcon";

function statusLabel(daysUntil: number | null, waterOnDate: string | null): string {
  if (daysUntil === null) return "Fine for now";
  if (daysUntil === 0) return "Water today";
  if (daysUntil === 1) return "Water tomorrow";
  const day = new Date(waterOnDate! + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "long" });
  return `Water on ${day}`;
}

function statusFlavour(daysUntil: number | null): string {
  if (daysUntil === null) return "happy in the moist layer";
  if (daysUntil === 0) return "roots reaching past the wet front";
  if (daysUntil === 1) return "drying out — water tomorrow";
  return "comfortable but watchful";
}

const STATUS_DOT: { color: string; fill: number }[] = [
  { color: "var(--color-glow)",      fill: 1.00 }, // today
  { color: "var(--color-drop)",      fill: 0.66 }, // tomorrow
  { color: "var(--color-drop)",      fill: 0.40 }, // later
  { color: "var(--color-root-live)", fill: 0.20 }, // fine
];

function statusStyle(daysUntil: number | null): { color: string; fill: number } {
  if (daysUntil === null) return STATUS_DOT[3];
  if (daysUntil === 0)    return STATUS_DOT[0];
  if (daysUntil <= 2)     return STATUS_DOT[1];
  return STATUS_DOT[2];
}

export default function CropSuggestionList({ suggestions }: { suggestions: CropSuggestion[] }) {
  if (suggestions.length === 0) return null;

  const sorted = [...suggestions].sort((a, b) => {
    if (a.daysUntil === null && b.daysUntil === null) return 0;
    if (a.daysUntil === null) return 1;
    if (b.daysUntil === null) return -1;
    return a.daysUntil - b.daysUntil;
  });

  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-moss)] mb-3">
        Feel the rows
      </p>
      <div className="grid grid-cols-2 gap-2">
        {sorted.map((s) => {
          const { color, fill } = statusStyle(s.daysUntil);
          return (
            <div
              key={s.cropId}
              className="rounded-xl px-3 py-3 flex flex-col gap-2 border border-[var(--color-cream)]/10 bg-[var(--color-cream)]/[0.05]"
            >
              <div className="flex items-center gap-2">
                <CropIcon name={s.cropName} size={24} />
                <span className="flex-1 font-serif text-[15px] text-[var(--color-cream)] font-medium leading-none truncate">
                  {s.cropName}
                </span>
              </div>
              {/* Simple fill bar — no numbers, just visual weight */}
              <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${fill * 100}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-sans text-[12px] font-medium" style={{ color }}>
                  {statusLabel(s.daysUntil, s.waterOnDate)}
                </span>
                <span className="font-sans text-[11px] italic text-[var(--color-moss)] leading-snug">
                  {statusFlavour(s.daysUntil)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 font-mono text-[9px] tracking-[0.18em] uppercase text-[var(--color-moss)]/60">
        Based on forecast — use your judgement.
      </p>
    </div>
  );
}
