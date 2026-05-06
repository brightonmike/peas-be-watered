"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { savePrefsToClientCookie } from "@/lib/cookies.client";
import type { UserPrefs } from "@/lib/types";

export default function WateredButton({ prefs, wateredToday }: { prefs: UserPrefs; wateredToday: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (wateredToday) {
      const { lastWateredDate: _, ...rest } = prefs;
      savePrefsToClientCookie(rest);
    } else {
      const today = new Date().toISOString().slice(0, 10);
      savePrefsToClientCookie({ ...prefs, lastWateredDate: today });
    }
    startTransition(() => router.refresh());
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
        wateredToday
          ? "border-green-300 bg-green-100 text-green-800 hover:bg-green-200"
          : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
      }`}
    >
      {isPending ? "Saving…" : wateredToday ? "✓ Watered today" : "I watered today"}
    </button>
  );
}
