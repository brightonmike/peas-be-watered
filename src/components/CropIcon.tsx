// Self-contained 24×24 crop icons used in the setup picker, the bed preview,
// and the per-crop "feel the rows" list. Different visual style from the
// home-page soil cross-section sprites (which extend upward from a soil line).

const LEAF = "#3F7A3F";
const LEAF_DEEP = "#2A5C2A";

const SPRITES: Record<string, React.ReactNode> = {
  Broccoli: (
    <>
      <path d="M12 22 v -8" stroke={LEAF_DEEP} strokeWidth="1.6" />
      <circle cx="12" cy="12" r="5" fill={LEAF_DEEP} />
      <circle cx="9" cy="10" r="3" fill={LEAF} />
      <circle cx="15" cy="10" r="3" fill={LEAF} />
    </>
  ),
  Potatoes: (
    <>
      <ellipse cx="9" cy="14" rx="4" ry="3" fill="#A88A5C" />
      <ellipse cx="15" cy="11" rx="4" ry="3" fill="#B8966A" />
    </>
  ),
  Onions: (
    <>
      <path d="M12 5 c -3 0 -5 3 -5 8 c 0 4 2 7 5 7 s 5 -3 5 -7 c 0 -5 -2 -8 -5 -8 z" fill="#E5C089" />
      <path d="M11 5 v -3 M12 5 v -4 M13 5 v -3" stroke={LEAF} strokeWidth="1.4" />
    </>
  ),
  Beetroot: (
    <>
      <path d="M12 9 c -3 0 -5 3 -5 6 c 0 3 2 5 5 5 s 5 -2 5 -5 c 0 -3 -2 -6 -5 -6 z" fill="#7C2A4A" />
      <path d="M10 8 l -1 -3 M12 8 l 0 -4 M14 8 l 1 -3" stroke={LEAF} strokeWidth="1.4" />
    </>
  ),
  Fennel: (
    <>
      <path d="M12 22 v -10" stroke={LEAF_DEEP} strokeWidth="1.6" />
      <circle cx="9" cy="9" r="1.4" fill={LEAF} />
      <circle cx="15" cy="9" r="1.4" fill={LEAF} />
      <circle cx="12" cy="6" r="1.4" fill={LEAF} />
    </>
  ),
  Cabbage: (
    <>
      <circle cx="12" cy="13" r="6" fill={LEAF_DEEP} />
      <circle cx="12" cy="13" r="3" fill={LEAF} />
    </>
  ),
  Kale: <path d="M5 14 q 7 -10 14 0 q -3 3 -7 3 q -4 0 -7 -3 z" fill={LEAF_DEEP} />,
  Tomatoes: (
    <>
      <circle cx="12" cy="14" r="5" fill="#C7402F" />
      <path d="M9 9 l 1 -2 l 1 2 l 1 -3 l 1 3 l 1 -2" stroke={LEAF} strokeWidth="1.4" fill="none" />
    </>
  ),
  Courgettes: <path d="M5 17 q 6 -10 14 -10 q -3 7 -10 13 q -3 0 -4 -3 z" fill={LEAF} />,
  "Runner Beans": (
    <>
      <path d="M8 4 q 5 8 0 16" stroke={LEAF_DEEP} strokeWidth="2" fill="none" />
      <ellipse cx="10" cy="10" rx="2" ry="1" fill="#C7402F" />
    </>
  ),
  "French Beans": (
    <path d="M6 6 q 6 6 12 12 M6 12 q 6 6 12 6" stroke={LEAF} strokeWidth="2" fill="none" strokeLinecap="round" />
  ),
  "Broad Beans": (
    <>
      <path d="M5 8 q 7 -1 14 4 q -7 1 -14 -4 z" fill={LEAF} />
      <circle cx="9" cy="9" r="1.2" fill={LEAF_DEEP} />
      <circle cx="13" cy="10" r="1.2" fill={LEAF_DEEP} />
    </>
  ),
  Peas: (
    <>
      <path d="M5 8 q 7 -2 14 4 q -7 2 -14 -4 z" fill={LEAF} />
      <circle cx="9" cy="9" r="1.2" fill={LEAF_DEEP} />
      <circle cx="12" cy="10" r="1.2" fill={LEAF_DEEP} />
      <circle cx="15" cy="11" r="1.2" fill={LEAF_DEEP} />
    </>
  ),
};

const GENERIC = (
  <>
    <path d="M12 22 v -8" stroke={LEAF_DEEP} strokeWidth="1.6" />
    <ellipse cx="9" cy="10" rx="3" ry="4" fill={LEAF} />
    <ellipse cx="15" cy="10" rx="3" ry="4" fill={LEAF} />
    <ellipse cx="12" cy="7" rx="3" ry="4" fill={LEAF_DEEP} />
  </>
);

export function CropIcon({ name, size = 36 }: { name: string; size?: number }) {
  const sprite = SPRITES[name] ?? GENERIC;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g>{sprite}</g>
    </svg>
  );
}
