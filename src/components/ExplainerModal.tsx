"use client";

import { useRef } from "react";

const SECTION_LABEL =
  "font-serif italic text-[15px] text-[var(--color-leaf-deep)] mb-1";

function ThresholdScaleSVG() {
  const W = 400;
  const H = 60;
  const barY = 22;
  const barH = 12;
  const thresholdX = 0.4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
      <defs>
        <linearGradient id="exp-scale" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C75D3E" stopOpacity="0.8" />
          <stop offset={`${thresholdX * 100}%`} stopColor="#C75D3E" stopOpacity="0.4" />
          <stop offset={`${thresholdX * 100}%`} stopColor="var(--color-root-live)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--color-root-live)" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <rect x="0" y={barY} width={W} height={barH} rx={6} fill="url(#exp-scale)" />
      <line
        x1={thresholdX * W}
        y1={barY - 5}
        x2={thresholdX * W}
        y2={barY + barH + 5}
        stroke="var(--color-ink)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
      <text x={thresholdX * W} y={barY - 8} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-ink)" opacity="0.6">
        threshold
      </text>
      <text x="2" y={barY + barH + 18} fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-ink)" opacity="0.45">
        Water needed
      </text>
      <text x={W - 2} y={barY + barH + 18} textAnchor="end" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-ink)" opacity="0.45">
        Fine
      </text>
    </svg>
  );
}

function CropThresholdsSVG() {
  const crops = [
    { name: "Tomatoes", threshold: 40 },
    { name: "Cabbage",  threshold: 30 },
    { name: "Carrots",  threshold: 25 },
    { name: "Onions",   threshold: 20 },
    { name: "Rosemary", threshold: 5 },
  ];
  const W = 400;
  const rowH = 24;
  const labelW = 92;
  const barMaxW = W - labelW - 80;

  return (
    <svg viewBox={`0 0 ${W} ${crops.length * rowH + 8}`} className="w-full" aria-hidden="true">
      {crops.map((c, i) => {
        const barW = (c.threshold / 50) * barMaxW;
        const y = i * rowH + 6;
        return (
          <g key={c.name}>
            <text
              x={labelW - 8}
              y={y + 13}
              textAnchor="end"
              fontFamily="var(--font-serif)"
              fontSize="12"
              fill="var(--color-ink)"
            >
              {c.name}
            </text>
            <rect x={labelW} y={y + 4} width={barMaxW} height="14" rx="3" fill="var(--color-ink)" opacity="0.06" />
            <rect x={labelW} y={y + 4} width={barW} height="14" rx="3" fill="var(--color-leaf-deep)" opacity="0.55" />
            <text
              x={labelW + barW + 6}
              y={y + 14}
              fontFamily="var(--font-mono)"
              fontSize="10"
              fill="var(--color-ink)"
              opacity="0.55"
            >
              water below {c.threshold}%
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
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="m-auto w-full max-w-lg rounded-2xl border border-black/10 bg-[var(--color-cream)] p-0 shadow-xl backdrop:bg-black/50 open:flex open:flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-black/10 px-6 py-4">
          <div>
            <p className="font-serif italic text-[14px] text-[var(--color-ink)]/55">
              The model
            </p>
            <h2 className="font-serif text-[22px] font-medium leading-tight text-[var(--color-ink)] mt-0.5">
              How this works.
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

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-6 text-[13px] text-[var(--color-ink)]/80 leading-relaxed">

          <section>
            <p className="font-serif italic text-[15px] text-[var(--color-ink)]">
              The question we&apos;re answering: when should I next make the trip to water?
            </p>
          </section>

          <section>
            <p className={SECTION_LABEL}>1 · Today&apos;s soil moisture</p>
            <p>
              We don&apos;t measure your soil — we estimate it. Every load, we walk forward from a{" "}
              <span className="font-mono">50%</span> baseline seven days ago, day by day, through real
              Met Office observations for your location.
            </p>
            <p className="mt-2">
              Each day, moisture changes by{" "}
              <span className="font-mono">rain − evaporation − crop drain</span>. Heavy rain pushes it
              up; heat, wind, low humidity and thirsty crops pull it down. When you log a watering,
              that day gets a <span className="font-mono">+40</span> bump — roughly the same as a
              heavy rain shower.
            </p>
          </section>

          <section>
            <p className={SECTION_LABEL}>2 · Each crop has a threshold</p>
            <p>
              The threshold is the moisture level below which a crop starts to stress. It comes from
              water need and drought tolerance: thirsty, sensitive crops have higher thresholds;
              hardy crops can take much drier soil.
            </p>
            <div className="rounded-xl border border-black/10 bg-white px-4 pt-3 pb-3 mt-3">
              <CropThresholdsSVG />
            </div>
          </section>

          <section>
            <p className={SECTION_LABEL}>3 · The most demanding crop drives the verdict</p>
            <p>
              Whichever crop hits its threshold first sets the recommendation for the whole bed —
              if your tomatoes need water, you&apos;re making the trip anyway.
            </p>
            <div className="rounded-xl border border-black/10 bg-white px-4 pt-4 pb-4 mt-3">
              <ThresholdScaleSVG />
            </div>
          </section>

          <section>
            <p className={SECTION_LABEL}>4 · Looking ahead</p>
            <p>
              From today&apos;s estimated moisture, we project five days forward through the forecast,
              applying the same daily change. The first day the projection crosses the threshold is
              when you should water. If it never crosses, we say fine for now.
            </p>
          </section>

          <section>
            <p className={SECTION_LABEL}>5 · Heat stress</p>
            <p>
              When today&apos;s soil is already at or below the threshold and the temperature exceeds
              25°C, we flag heat stress instead of a regular watering call — the urgency is higher.
            </p>
          </section>

          <p className="rounded-xl bg-black/[0.04] px-4 py-3 text-[11px] text-[var(--color-ink)]/55 leading-relaxed">
            The crop values and formula constants are starting-point estimates from general
            horticultural guidance — calibrated for UK growing conditions. The model has no soil
            sensor, no historical knowledge of your bed before you started using the app, and a
            single moisture estimate stands in for all your crops. Use your own eyes and judgement
            alongside these suggestions.
          </p>
        </div>
      </dialog>
    </>
  );
}
