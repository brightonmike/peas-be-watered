import Link from "next/link";
import { getPrefsFromCookie } from "@/lib/cookies.server";
import SetupForm from "@/components/SetupForm";

export const metadata = {
  title: "Setup — Peas be Watered",
  description: "Enter your postcode and choose your crops.",
};

function Sun() {
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">
      <circle cx="42" cy="42" r="20" fill="#FFE9BE" opacity="0.95" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r1 = 26;
        const r2 = 38;
        return (
          <line
            key={i}
            x1={42 + Math.cos(a) * r1}
            y1={42 + Math.sin(a) * r1}
            x2={42 + Math.cos(a) * r2}
            y2={42 + Math.sin(a) * r2}
            stroke="#FFD27A"
            strokeWidth="1.6"
            opacity="0.6"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

export default async function SetupPage() {
  const prefs = await getPrefsFromCookie();
  const dateLabel = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <main className="flex-1 bg-[var(--color-soil-deep)]">
      {/* Sky header */}
      <div
        className="relative"
        style={{
          background: `linear-gradient(180deg, var(--color-sky-top) 0%, var(--color-sky-mid) 100%)`,
        }}
      >
        <div className="absolute top-8 right-6 pointer-events-none">
          <Sun />
        </div>

        <div className="mx-auto max-w-lg px-5 pt-12 pb-10 relative">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink)]/55 hover:text-[var(--color-ink)]"
            >
              ← Back
            </Link>
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink)]/55">
              Setup
            </span>
          </div>

          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink)]/55">
            A new plot · {dateLabel}
          </p>
          <h1 className="font-serif text-[44px] leading-[0.95] mt-2 font-medium tracking-tight text-[var(--color-ink)]">
            Plant your<br />
            <em className="text-[var(--color-leaf-deep)]">bed.</em>
          </h1>
        </div>
      </div>

      <SetupForm initial={prefs ?? undefined} />
    </main>
  );
}
