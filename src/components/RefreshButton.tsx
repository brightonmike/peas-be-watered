"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

function RefreshIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 14 14"
      aria-hidden="true"
      className={spinning ? "animate-spin" : undefined}
    >
      <path
        d="M2 7 a 5 5 0 0 1 9 -3 M12 7 a 5 5 0 0 1 -9 3"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M11 1.5 L 11 4 L 8.5 4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12.5 L 3 10 L 5.5 10" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-moss)] underline underline-offset-[3px] hover:text-[var(--color-cream)] disabled:opacity-50"
    >
      <RefreshIcon spinning={isPending} />
      {isPending ? "Refreshing" : "Refresh"}
    </button>
  );
}
