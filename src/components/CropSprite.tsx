const LEAF = "var(--color-leaf)";
const LEAF_DEEP = "var(--color-leaf-deep)";

type SpriteProps = { name: string; x: number; y: number; scale?: number };

const sprites: Record<string, React.ReactNode> = {
  Broccoli: (
    <>
      <path d="M0 0 v -22" stroke={LEAF_DEEP} strokeWidth="2" />
      <ellipse cx="0" cy="-26" rx="11" ry="9" fill={LEAF_DEEP} />
      <ellipse cx="-6" cy="-30" rx="5" ry="5" fill={LEAF} />
      <ellipse cx="6" cy="-30" rx="6" ry="5" fill={LEAF} />
      <ellipse cx="0" cy="-34" rx="6" ry="5" fill={LEAF} />
    </>
  ),
  Potatoes: (
    <>
      <path d="M-6 0 q -2 -16 4 -22 M3 0 q 4 -14 8 -22" stroke={LEAF_DEEP} strokeWidth="1.6" fill="none" />
      <ellipse cx="-2" cy="-22" rx="5" ry="3" fill={LEAF} />
      <ellipse cx="11" cy="-22" rx="4" ry="3" fill={LEAF} />
      <ellipse cx="3" cy="-26" rx="6" ry="4" fill={LEAF_DEEP} />
    </>
  ),
  Onions: (
    <path d="M-3 0 q -2 -18 -1 -28 M0 0 v -32 M3 0 q 2 -18 1 -26" stroke={LEAF} strokeWidth="2" fill="none" strokeLinecap="round" />
  ),
  Beetroot: (
    <>
      <path d="M-4 0 q -3 -10 0 -18 M0 0 v -22 M4 0 q 3 -10 0 -18" stroke={LEAF_DEEP} strokeWidth="1.6" fill="none" />
      <ellipse cx="-5" cy="-20" rx="4" ry="6" fill={LEAF} />
      <ellipse cx="0" cy="-24" rx="5" ry="7" fill={LEAF} />
      <ellipse cx="5" cy="-20" rx="4" ry="6" fill={LEAF} />
    </>
  ),
  Fennel: (
    <>
      <path d="M0 0 v -28" stroke={LEAF_DEEP} strokeWidth="1.6" />
      <circle cx="-4" cy="-26" r="1.4" fill={LEAF} />
      <circle cx="4" cy="-28" r="1.4" fill={LEAF} />
      <circle cx="0" cy="-32" r="1.4" fill={LEAF} />
      <circle cx="-6" cy="-30" r="1.2" fill={LEAF} />
      <circle cx="6" cy="-32" r="1.2" fill={LEAF} />
      <ellipse cx="0" cy="-2" rx="4" ry="2" fill="#E8DCB8" />
    </>
  ),
  Cabbage: (
    <>
      <ellipse cx="0" cy="-10" rx="13" ry="11" fill={LEAF_DEEP} />
      <ellipse cx="0" cy="-12" rx="9" ry="8" fill={LEAF} />
    </>
  ),
  Kale: (
    <>
      <path d="M0 0 v -10" stroke={LEAF_DEEP} strokeWidth="1.6" />
      <path d="M-12 -12 q 6 -16 12 -10 q 6 -6 12 10 q -6 4 -12 4 q -6 0 -12 -4 z" fill={LEAF_DEEP} />
      <path d="M-8 -14 q 4 -8 8 -4 q 4 -4 8 4" stroke={LEAF} strokeWidth="0.8" fill="none" />
    </>
  ),
  Tomatoes: (
    <>
      <path d="M0 0 v -28" stroke={LEAF_DEEP} strokeWidth="2" />
      <ellipse cx="-7" cy="-12" rx="4" ry="3" fill={LEAF} />
      <ellipse cx="7" cy="-18" rx="4" ry="3" fill={LEAF} />
      <ellipse cx="-5" cy="-26" rx="3" ry="2.5" fill={LEAF} />
      <circle cx="3" cy="-10" r="3" fill="#E0584F" />
      <circle cx="-2" cy="-22" r="2.5" fill="#E0584F" />
    </>
  ),
  "Runner Beans": (
    <>
      <path d="M0 0 v -36" stroke={LEAF_DEEP} strokeWidth="1.5" />
      <path d="M0 -8 q -8 -2 -10 -10 M0 -16 q 8 -2 10 -10 M0 -24 q -8 -2 -10 -10" stroke={LEAF} strokeWidth="1.5" fill="none" />
      <ellipse cx="-10" cy="-18" rx="3.5" ry="2" fill={LEAF} />
      <ellipse cx="10" cy="-26" rx="3.5" ry="2" fill={LEAF} />
    </>
  ),
  "Broad Beans": (
    <>
      <path d="M0 0 v -28" stroke={LEAF_DEEP} strokeWidth="1.8" />
      <ellipse cx="-6" cy="-12" rx="5" ry="3" fill={LEAF} />
      <ellipse cx="6" cy="-20" rx="5" ry="3" fill={LEAF} />
      <ellipse cx="-4" cy="-26" rx="3" ry="2" fill={LEAF} />
    </>
  ),
};

export function CropSprite({ name, x, y, scale = 1 }: SpriteProps) {
  const sprite = sprites[name] ?? (
    <>
      <path d="M0 0 v -16" stroke={LEAF_DEEP} strokeWidth="1.6" />
      <ellipse cx="-5" cy="-14" rx="5" ry="4" fill={LEAF} />
      <ellipse cx="5" cy="-16" rx="5" ry="4" fill={LEAF} />
      <ellipse cx="0" cy="-20" rx="5" ry="4" fill={LEAF_DEEP} />
    </>
  );
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>{sprite}</g>;
}
