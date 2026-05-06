"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { savePrefsToClientCookie } from "@/lib/cookies.client";
import type { UserPrefs } from "@/lib/types";

const KEEP_DAYS = 30;

export default function WateredButton({
  prefs,
  wateredToday,
}: {
  prefs: UserPrefs;
  wateredToday: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const today = new Date().toISOString().slice(0, 10);
    const cutoff = new Date(Date.parse(today + "T00:00:00Z") - KEEP_DAYS * 86400000)
      .toISOString()
      .slice(0, 10);

    const dates = new Set(prefs.soil?.wateringDates ?? []);
    if (wateredToday) dates.delete(today);
    else dates.add(today);

    const wateringDates = Array.from(dates).filter((d) => d >= cutoff).sort();

    savePrefsToClientCookie({ ...prefs, soil: { wateringDates } });
    startTransition(() => router.refresh());
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`w-full rounded-[10px] px-3 py-2.5 font-sans text-[13px] font-medium transition-colors disabled:opacity-50 ${
        wateredToday
          ? "bg-[var(--color-leaf-deep)] text-[var(--color-cream)] hover:opacity-90"
          : "border border-black/15 text-[var(--color-ink)] hover:bg-black/5"
      }`}
    >
      {isPending ? "Saving…" : wateredToday ? "✓ Soaked — undo" : "I watered today"}
    </button>
  );
}
