"use client";

import { useRef } from "react";

function MoistureScaleSVG() {
  // Visualises the 4 output zones on a 0–100 moisture scale.
  // Threshold example: tomatoes = 40. Light watering buffer = +20.
  const W = 400;
  const H = 90;
  const barY = 32;
  const barH = 20;

  const zones = [
    { from: 0,  to: 40,  color: "#bfdbfe", label: "" },          // deep watering
    { from: 40, to: 60,  color: "#7dd3fc", label: "" },          // light watering
    { from: 60, to: 100, color: "#bbf7d0", label: "" },          // no watering
  ];

  const labels = [
    { x: 20,  text: "🚿 Deep",  sub: "watering" },
    { x: 167, text: "💧 Light", sub: "watering" },
    { x: 310, text: "✅ No",    sub: "watering" },
  ];

  function xPos(val: number) {
    return (val / 100) * W;
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
      {/* Zone bars */}
      {zones.map((z, i) => (
        <rect
          key={i}
          x={xPos(z.from)}
          y={barY}
          width={xPos(z.to) - xPos(z.from)}
          height={barH}
          fill={z.color}
          rx={i === 0 ? 6 : 0}
          style={{ borderRadius: i === zones.length - 1 ? "0 6px 6px 0" : undefined }}
        />
      ))}
      {/* Right cap radius */}
      <rect x={xPos(100) - 6} y={barY} width={6} height={barH} fill="#bbf7d0" rx={0} />
      <rect x={xPos(100) - 6} y={barY} width={6} height={barH / 2} fill="#bbf7d0" />
      <rect x={xPos(100) - 6} y={barY + barH / 2} width={6} height={barH / 2} fill="#bbf7d0" rx={3} />

      {/* Threshold marker */}
      <line x1={xPos(40)} y1={barY - 4} x2={xPos(40)} y2={barY + barH + 4} stroke="#64748b" strokeWidth={1.5} strokeDasharray="3 2" />
      <text x={xPos(40)} y={barY - 8} textAnchor="middle" fontSize={9} fill="#64748b">threshold</text>

      {/* Buffer marker */}
      <line x1={xPos(60)} y1={barY - 4} x2={xPos(60)} y2={barY + barH + 4} stroke="#64748b" strokeWidth={1.5} strokeDasharray="3 2" />
      <text x={xPos(60)} y={barY - 8} textAnchor="middle" fontSize={9} fill="#64748b">+buffer</text>

      {/* Zone labels */}
      {labels.map((l, i) => (
        <g key={i}>
          <text x={l.x + (i === 0 ? 40 : i === 1 ? 33 : 30)} y={barY + barH + 16} textAnchor="middle" fontSize={10} fill="#374151">{l.text}</text>
          <text x={l.x + (i === 0 ? 40 : i === 1 ? 33 : 30)} y={barY + barH + 27} textAnchor="middle" fontSize={10} fill="#6b7280">{l.sub}</text>
        </g>
      ))}

      {/* Axis labels */}
      <text x={0} y={barY + barH + 44} fontSize={9} fill="#9ca3af">Dry (0)</text>
      <text x={W} y={barY + barH + 44} textAnchor="end" fontSize={9} fill="#9ca3af">Saturated (100)</text>
    </svg>
  );
}

function CropSensitivitySVG() {
  const crops = [
    { name: "Celery",    threshold: 45, color: "#7dd3fc" },
    { name: "Tomatoes",  threshold: 40, color: "#6ee7b7" },
    { name: "Potatoes",  threshold: 30, color: "#fde68a" },
    { name: "Carrots",   threshold: 25, color: "#fed7aa" },
    { name: "Rosemary",  threshold: 5,  color: "#d9f99d" },
  ];

  const W = 400;
  const rowH = 28;
  const labelW = 72;
  const barMaxW = W - labelW - 60;
  const maxThreshold = 50;

  return (
    <svg viewBox={`0 0 ${W} ${crops.length * rowH + 16}`} className="w-full" aria-hidden="true">
      {crops.map((c, i) => {
        const barW = (c.threshold / maxThreshold) * barMaxW;
        const y = i * rowH + 8;
        return (
          <g key={c.name}>
            <text x={labelW - 6} y={y + 14} textAnchor="end" fontSize={11} fill="#374151">{c.name}</text>
            <rect x={labelW} y={y + 4} width={barW} height={16} fill={c.color} rx={4} />
            <text x={labelW + barW + 6} y={y + 14} fontSize={10} fill="#6b7280">
              water when moisture &lt; {c.threshold}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ExplainerModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function open() {
    dialogRef.current?.showModal();
  }
  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        onClick={open}
        className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-moss)] underline underline-offset-[3px] hover:text-[var(--color-cream)]"
      >
        How this works
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => { if (e.target === dialogRef.current) close(); }}
        className="m-auto w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-0 shadow-xl backdrop:bg-black/40 open:flex open:flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <h2 className="text-base font-semibold text-zinc-900">How watering suggestions work</h2>
          <button onClick={close} aria-label="Close" className="text-zinc-400 hover:text-zinc-600 text-xl leading-none">×</button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-6 text-sm text-zinc-600 leading-relaxed">

          {/* Step 1 */}
          <section className="flex flex-col gap-2">
            <h3 className="font-semibold text-zinc-800">1. We estimate a soil moisture score</h3>
            <p>
              We calculate a score from 0–100 representing how moist the soil likely is, based on today&apos;s weather conditions.
            </p>
            <p>
              The score goes <strong className="text-zinc-700">up</strong> with recent and forecast rain, and <strong className="text-zinc-700">down</strong> with heat, wind, low humidity, and the water demands of your crops.
            </p>
          </section>

          {/* Step 2 — zones diagram */}
          <section className="flex flex-col gap-2">
            <h3 className="font-semibold text-zinc-800">2. That score maps to an output state</h3>
            <p>
              Each crop has a <em>watering threshold</em> — the moisture level below which it becomes stressed. We compare the score against that threshold to determine what to recommend.
            </p>
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 px-4 pt-4 pb-2">
              <MoistureScaleSVG />
            </div>
            <p className="text-xs text-zinc-400">
              A heat stress warning is triggered when the score falls below the threshold <em>and</em> temperatures exceed 25°C.
            </p>
          </section>

          {/* Step 3 — crop sensitivity */}
          <section className="flex flex-col gap-2">
            <h3 className="font-semibold text-zinc-800">3. Different crops have different thresholds</h3>
            <p>
              Each crop has two values: <strong className="text-zinc-700">water need</strong> (how fast it drains moisture) and <strong className="text-zinc-700">drought tolerance</strong> (how low moisture can fall before it&apos;s stressed). Together they set the threshold.
            </p>
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 px-4 pt-4 pb-2">
              <CropSensitivitySVG />
            </div>
            <p className="text-xs text-zinc-400">
              Celery is sensitive — it needs water well before the soil dries out. Rosemary can tolerate much drier conditions.
            </p>
          </section>

          {/* Step 4 — multiple crops */}
          <section className="flex flex-col gap-2">
            <h3 className="font-semibold text-zinc-800">4. We use your most demanding crop</h3>
            <p>
              When you have multiple crops, the overall recommendation is driven by whichever crop is closest to stress. The per-crop list below the main card shows how each individual crop is faring.
            </p>
          </section>

          {/* Step 5 — forecast rule */}
          <section className="flex flex-col gap-2">
            <h3 className="font-semibold text-zinc-800">5. Forecast rain always wins</h3>
            <p>
              If significant rain (&gt;10mm) is expected within 48 hours, we never recommend watering — regardless of moisture levels. No point watering before the sky does it for you.
            </p>
          </section>

          {/* Disclaimer */}
          <p className="rounded-xl bg-zinc-50 px-4 py-3 text-xs text-zinc-500">
            The crop values and formula constants are starting-point estimates based on general horticultural guidance. They will be refined over time. Use your own judgement alongside these suggestions.
          </p>

        </div>
      </dialog>
    </>
  );
}
