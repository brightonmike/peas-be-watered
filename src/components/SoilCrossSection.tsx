import type { CategorisedCrop } from "@/lib/crops";
import type { CropSuggestion } from "@/lib/types";
import { CropSprite } from "@/components/CropSprite";

const W = 402;
const SKY_H = 280;
const SOIL_H = 360;
const TOTAL_H = SKY_H + SOIL_H;

function deterministicRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function Roots({ x, vigor, alive }: { x: number; vigor: number; alive: boolean }) {
  const r = deterministicRng(Math.round(x * 137));
  const stroke = alive ? "var(--color-root)" : "#5a3e22";
  const branches: React.ReactNode[] = [];

  let path = `M ${x} ${SKY_H} `;
  for (let i = 0; i < 8; i++) {
    const dx = (r() - 0.5) * 6;
    const dy = 140 / 8;
    path += `q ${dx} ${dy / 2} ${dx * 0.5} ${dy} `;
  }
  branches.push(<path key="main" d={path} stroke={stroke} strokeWidth="2" fill="none" strokeLinecap="round" opacity={vigor} />);

  for (let i = 0; i < 6; i++) {
    const sy = SKY_H + 12 + (140 * (i + 1)) / 8;
    const dir = i % 2 === 0 ? -1 : 1;
    const len = 18 + r() * 24;
    branches.push(
      <path
        key={`b${i}`}
        d={`M ${x + dir * 2} ${sy} q ${dir * len * 0.4} ${4 + r() * 8} ${dir * len * 0.7} ${10 + r() * 6} t ${dir * len * 0.3} ${6 + r() * 6}`}
        stroke={stroke}
        strokeWidth={1.2 - i * 0.1}
        fill="none"
        strokeLinecap="round"
        opacity={vigor * (0.9 - i * 0.1)}
      />,
    );
    if (alive && i < 4) {
      branches.push(
        <circle key={`h${i}`} cx={x + dir * (len * 0.7 + 4)} cy={sy + 14} r="1.4" fill="var(--color-root-live)" opacity={vigor} />,
      );
    }
  }
  return <g>{branches}</g>;
}

export default function SoilCrossSection({
  crops,
  suggestions,
  moisture,
  tempMaxC,
}: {
  crops: CategorisedCrop[];
  suggestions: CropSuggestion[];
  moisture: number; // 0-100
  tempMaxC: number;
}) {
  const visible = crops.slice(0, 7);
  const positions = visible.map((_, i) => 40 + ((W - 80) / Math.max(1, visible.length - 1)) * i);
  const wetTopY = SKY_H + SOIL_H * (1 - moisture / 100) * 0.4;
  const sunHot = tempMaxC > 22;

  // soil texture flecks (deterministic)
  const flecks = Array.from({ length: 60 }).map((_, i) => ({
    x: (i * 41) % W,
    y: SKY_H + ((i * 67) % SOIL_H),
    r: 1 + (i % 3) * 0.4,
    alt: i % 2 === 0,
  }));

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${TOTAL_H}`} className="block">
      <defs>
        <linearGradient id="x-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-sky-top)" />
          <stop offset="70%" stopColor="var(--color-sky-mid)" />
          <stop offset="100%" stopColor="var(--color-horizon)" />
        </linearGradient>
        <radialGradient id="x-sun" cx="0.78" cy="0.28" r="0.35">
          <stop offset="0%" stopColor="#FFE5B0" stopOpacity="1" />
          <stop offset="60%" stopColor="#FFE5B0" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFE5B0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="x-soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-soil-top)" />
          <stop offset="50%" stopColor="var(--color-soil-mid)" />
          <stop offset="100%" stopColor="var(--color-soil-deep)" />
        </linearGradient>
        <linearGradient id="x-wet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-drop-deep)" stopOpacity="0" />
          <stop offset="40%" stopColor="var(--color-drop-deep)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--color-drop-deep)" stopOpacity="0.5" />
        </linearGradient>
        <pattern id="x-grain" width="3" height="3" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.4" fill="#000" opacity="0.05" />
        </pattern>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width={W} height={SKY_H} fill="url(#x-sky)" />
      <rect x="0" y="0" width={W} height={SKY_H} fill="url(#x-sun)" />
      <circle cx={W * 0.78} cy={SKY_H * 0.28} r="22" fill={sunHot ? "#FFD27A" : "#FFE9BE"} opacity="0.95" />
      {/* distant clouds */}
      <ellipse cx="80" cy="80" rx="28" ry="8" fill="var(--color-cream)" opacity="0.7" />
      <ellipse cx="100" cy="74" rx="22" ry="7" fill="var(--color-cream)" opacity="0.7" />
      {/* horizon strip */}
      <path d={`M 0 270 Q 50 264 100 268 T 200 266 T 300 268 T ${W} 266 L ${W} 280 L 0 280 z`} fill="#9FAA7A" opacity="0.35" />

      {/* Soil */}
      <rect x="0" y={SKY_H} width={W} height={SOIL_H} fill="url(#x-soil)" />
      <rect x="0" y={wetTopY} width={W} height={SKY_H + SOIL_H - wetTopY} fill="url(#x-wet)" />
      {flecks.map((f, i) => (
        <circle key={i} cx={f.x} cy={f.y} r={f.r} fill={f.alt ? "#86603a" : "#1c1208"} opacity="0.5" />
      ))}

      {/* Soil line edge */}
      <path d={`M 0 ${SKY_H} Q 100 ${SKY_H - 4} 200 ${SKY_H} T ${W} ${SKY_H}`} stroke="#52371D" strokeWidth="2" fill="none" />

      {/* Plants + roots + dry indicator */}
      {visible.map((crop, i) => {
        const x = positions[i];
        const suggestion = suggestions.find((s) => s.cropId === crop.id);
        const dry = suggestion ? (suggestion.daysUntil !== null && suggestion.daysUntil <= 1) : false;
        const vigor = dry ? 0.65 : 0.95;
        return (
          <g key={crop.id}>
            <CropSprite name={crop.name} x={x} y={SKY_H - 1} />
            <Roots x={x} vigor={vigor} alive={!dry} />
            {dry && (
              <g transform={`translate(${x} ${SKY_H - 50})`}>
                <circle cx="0" cy="0" r="9" fill="var(--color-cream)" opacity="0.95" />
                <path d="M0 -4 c -2 3 -3 4 -3 6 a 3 3 0 0 0 6 0 c 0 -2 -1 -3 -3 -6 z" fill="var(--color-drop-deep)" />
              </g>
            )}
          </g>
        );
      })}

      {/* Wet front line + label */}
      <line x1="0" y1={wetTopY} x2={W} y2={wetTopY} stroke="var(--color-drop)" strokeWidth="1" opacity="0.4" strokeDasharray="2 4" />
      <text x="14" y={wetTopY - 6} fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-drop)" letterSpacing="2" opacity="0.9">
        ◂ WET FRONT
      </text>
      <text x="14" y={SKY_H + 22} fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-cream)" letterSpacing="2" opacity="0.6">
        DRY ZONE
      </text>

      {/* Depth gauge */}
      <g>
        <line x1={W - 24} y1={SKY_H} x2={W - 24} y2={SKY_H + SOIL_H} stroke="var(--color-cream)" strokeWidth="1" opacity="0.4" />
        {[0, 25, 50, 75, 100].map((m, i) => {
          const y = SKY_H + (SOIL_H * i) / 4;
          return (
            <g key={i}>
              <line x1={W - 28} y1={y} x2={W - 20} y2={y} stroke="var(--color-cream)" strokeWidth="1" opacity="0.5" />
              <text x={W - 32} y={y + 3} textAnchor="end" fontFamily="var(--font-mono)" fontSize="8" fill="var(--color-cream)" opacity="0.6">
                {m}cm
              </text>
            </g>
          );
        })}
        <line x1={W - 30} y1={wetTopY} x2={W - 18} y2={wetTopY} stroke="var(--color-drop)" strokeWidth="2" />
        <text x={W - 14} y={wetTopY + 3} fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-drop)" fontWeight="600">
          {Math.round(moisture)}%
        </text>
      </g>

      {/* Paper grain overlay */}
      <rect x="0" y="0" width={W} height={TOTAL_H} fill="url(#x-grain)" />
    </svg>
  );
}
