import type { CropSuggestion } from "@/lib/types";

function formatCropLabel(daysUntil: number | null, waterOnDate: string | null): string {
  if (daysUntil === null) return "Fine for now";
  if (daysUntil === 0) return "Water today";
  if (daysUntil === 1) return "Water tomorrow";
  const day = new Date(waterOnDate! + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "long" });
  return `Water on ${day}`;
}

function cropStyle(daysUntil: number | null): string {
  if (daysUntil === null) return "text-zinc-400";
  if (daysUntil === 0) return "text-orange-600 font-medium";
  if (daysUntil <= 2) return "text-sky-600 font-medium";
  return "text-zinc-500";
}

function cropEmoji(daysUntil: number | null): string {
  if (daysUntil === null) return "✅";
  if (daysUntil === 0) return "🚿";
  if (daysUntil <= 2) return "💧";
  return "📅";
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
    <div className="mt-6">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
        Per crop
      </p>
      <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-100 bg-white">
        {sorted.map((s) => (
          <li key={s.cropId} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-zinc-700">{s.cropName}</span>
            <span className={`flex items-center gap-1.5 text-sm ${cropStyle(s.daysUntil)}`}>
              <span>{cropEmoji(s.daysUntil)}</span>
              {formatCropLabel(s.daysUntil, s.waterOnDate)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-zinc-400">
        Based on forecast conditions — use your judgement.
      </p>
    </div>
  );
}
