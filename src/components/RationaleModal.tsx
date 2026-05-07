"use client";

import { useRef } from "react";
import type { MoistureTrace, DayStep } from "@/lib/engine";

function dayLabel(iso: string, todayIso: string): string {
  if (iso === todayIso) return "Today";
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function changeLabel(step: DayStep): string {
  const delta = step.rainScore - step.evapLoss - step.drain;
  const sign = delta >= 0 ? "+" : "−";
  return `${sign}${Math.abs(delta).toFixed(1)}`;
}

function MoistureBar({ value, threshold }: { value: number; threshold: number }) {
  return (
    <div className="relative h-1.5 w-full rounded-full bg-black/10 overflow-hidden">
      <div
        className="absolute left-0 top-0 h-full rounded-full"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: "var(--color-drop-deep)" }}
      />
      <div
        className="absolute top-[-2px] h-[10px] w-[1.5px] bg-[var(--color-leaf-deep)]/50"
        style={{ left: `${threshold}%` }}
      />
    </div>
  );
}

function DayRow({
  step,
  threshold,
  todayIso,
  highlight,
}: {
  step: DayStep;
  threshold: number;
  todayIso: string;
  highlight?: boolean;
}) {
  const stressed = step.moistureAfter <= threshold;
  return (
    <div
      className={`grid grid-cols-[80px_1fr_auto_50px] gap-2 items-center py-1.5 text-[12px] ${
        highlight ? "font-medium text-[var(--color-ink)]" : "text-[var(--color-ink)]/80"
      }`}
    >
      <span className="font-mono text-[10px] tracking-wider uppercase text-[var(--color-ink)]/55">
        {dayLabel(step.date, todayIso)}
      </span>
      <span className="font-sans text-[11px] text-[var(--color-ink)]/55">
        {step.rainMm >= 1 ? `${step.rainMm.toFixed(1)}mm rain` : "no rain"}
        {step.watered ? " · watered" : ""}
      </span>
      <span className="font-mono text-[10px] tabular-nums text-[var(--color-ink)]/55 text-right">
        {step.watered ? `+${(step.rainScore - step.evapLoss - step.drain + 40).toFixed(1)}` : changeLabel(step)}
      </span>
      <span
        className={`font-mono text-[12px] tabular-nums text-right ${stressed ? "text-[#C75D3E]" : "text-[var(--color-ink)]"}`}
      >
        {Math.round(step.moistureAfter)}%
      </span>
    </div>
  );
}

export default function RationaleModal({
  trace,
  reason,
}: {
  trace: MoistureTrace | null;
  reason: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function open() {
    dialogRef.current?.showModal();
  }
  function close() {
    dialogRef.current?.close();
  }

  if (!trace) return null;

  const todayStep = trace.history[trace.history.length - 1];
  const todayIso = todayStep.date;
  const currentMoisture = todayStep.moistureAfter;

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="font-sans text-[13px] italic underline underline-offset-2 text-[var(--color-leaf-deep)] hover:text-[var(--color-ink)] align-baseline"
      >
        Why?
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="m-auto w-full max-w-lg rounded-2xl border border-black/10 bg-[var(--color-cream)] p-0 shadow-xl backdrop:bg-black/50 open:flex open:flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-black/10 px-6 py-4">
          <div>
            <p className="font-serif italic text-[14px] text-[var(--color-ink)]/55">
              How we got here
            </p>
            <h2 className="font-serif text-[22px] font-medium leading-tight text-[var(--color-ink)] mt-0.5">
              The rationale.
            </h2>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            className="text-[var(--color-ink)]/40 hover:text-[var(--color-ink)] text-2xl leading-none -mr-2 -mt-1 px-2"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-6 text-[13px] text-[var(--color-ink)]/80 leading-relaxed">

          {/* Verdict + headline number */}
          <section>
            <p className="font-serif italic text-[15px] text-[var(--color-ink)]">{reason}</p>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-serif text-[40px] leading-none font-medium text-[var(--color-ink)]">
                {Math.round(currentMoisture)}%
              </span>
              <span className="font-sans text-[12px] text-[var(--color-ink)]/55">
                today&apos;s estimated soil moisture
              </span>
            </div>
            <div className="mt-3">
              <MoistureBar value={currentMoisture} threshold={trace.threshold} />
              <div className="mt-1.5 flex justify-between font-mono text-[10px] text-[var(--color-ink)]/45">
                <span>0% dry</span>
                <span>threshold {trace.threshold}%</span>
                <span>100% saturated</span>
              </div>
            </div>
          </section>

          {/* Driving crop */}
          <section>
            <p className="font-serif italic text-[15px] text-[var(--color-leaf-deep)] mb-1">
              Driving crop
            </p>
            <p>
              <span className="font-serif text-[16px] text-[var(--color-ink)] font-medium">{trace.hero.name}</span>
              {" "}is the most demanding in your bed. It needs water before the soil drops below{" "}
              <span className="font-mono text-[var(--color-ink)]">{trace.threshold}%</span>
              {" — "}so that&apos;s the line we&apos;re watching.
            </p>
            <p className="mt-1.5 text-[12px] text-[var(--color-ink)]/60">
              Water need {trace.hero.waterNeed}/10 · drought tolerance {trace.hero.droughtTolerance}/10
            </p>
          </section>

          {/* Past week trace */}
          <section>
            <p className="font-serif italic text-[15px] text-[var(--color-leaf-deep)] mb-1.5">
              How we reached today
            </p>
            <p className="text-[12px] text-[var(--color-ink)]/65 mb-2">
              We started 7 days ago at <span className="font-mono">{trace.baseline}%</span> and walked through real Met Office observations, day by day.
            </p>
            <div className="rounded-xl border border-black/10 bg-white px-3 py-2 divide-y divide-black/5">
              {trace.history.map((step, i) => (
                <DayRow
                  key={step.date}
                  step={step}
                  threshold={trace.threshold}
                  todayIso={todayIso}
                  highlight={i === trace.history.length - 1}
                />
              ))}
            </div>
          </section>

          {/* Forecast trace */}
          <section>
            <p className="font-serif italic text-[15px] text-[var(--color-leaf-deep)] mb-1.5">
              Looking ahead
            </p>
            <p className="text-[12px] text-[var(--color-ink)]/65 mb-2">
              Projecting forward through the next {trace.forecast.length} forecast days.{" "}
              {trace.forecastCrossesThreshold
                ? `Soil drops to ${trace.threshold}% on day ${trace.daysUntilThreshold ?? "—"}.`
                : `Stays above the ${trace.threshold}% threshold throughout.`}
            </p>
            <div className="rounded-xl border border-black/10 bg-white px-3 py-2 divide-y divide-black/5">
              {trace.forecast.map((step) => (
                <DayRow key={step.date} step={step} threshold={trace.threshold} todayIso={todayIso} />
              ))}
            </div>
          </section>

          <p className="rounded-xl bg-black/[0.04] px-4 py-3 text-[11px] text-[var(--color-ink)]/55 leading-relaxed">
            Numbers are model estimates, not soil sensors. Daily change ={" "}
            <span className="font-mono">rain − evaporation − crop drain</span>, plus{" "}
            <span className="font-mono">+40</span> when you log a watering. Capped to 0–100%.
          </p>
        </div>
      </dialog>
    </>
  );
}
