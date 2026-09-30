/**
 * Irregular wax seal with a gilded "O & S" impression.
 * Rendered as an SVG in a 120×120 box. Deterministic geometry (safe for SSR).
 */
import { siteConfig } from "@/site.config";

const C = 60;

function blobPath(): string {
  const n = 40;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r =
      50 +
      2.6 * Math.sin(3 * a + 0.7) +
      1.7 * Math.sin(5 * a + 2.1) +
      1.1 * Math.sin(8 * a + 0.3) +
      0.8 * Math.cos(11 * a + 1.3);
    pts.push([C + r * Math.cos(a), C + r * Math.sin(a)]);
  }
  // Catmull-Rom → cubic Bézier for a smooth, organic outline
  let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d + "Z";
}

const BLOB = blobPath();

export function WaxSealSvg({ idPrefix = "seal" }: { idPrefix?: string }) {
  const { first, second } = siteConfig.couple.monogram;
  const g = (s: string) => `${idPrefix}-${s}`;
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false" className="block h-full w-full overflow-visible">
      <defs>
        <radialGradient id={g("wax")} cx="38%" cy="32%" r="78%">
          <stop offset="0%" stopColor="#9E2B2B" />
          <stop offset="55%" stopColor="#8A2424" />
          <stop offset="100%" stopColor="#7A1F1F" />
        </radialGradient>
        <radialGradient id={g("well")} cx="60%" cy="65%" r="70%">
          <stop offset="0%" stopColor="#9E2B2B" />
          <stop offset="100%" stopColor="#7A1F1F" />
        </radialGradient>
        <linearGradient id={g("gilt")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8C6A2E" />
          <stop offset="40%" stopColor="#E6CF95" />
          <stop offset="70%" stopColor="#B8924A" />
          <stop offset="100%" stopColor="#8C6A2E" />
        </linearGradient>
        <filter id={g("soft")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>
      {/* cast shadow on the door */}
      <path d={BLOB} fill="#2B2118" opacity="0.28" transform="translate(1.5 3)" filter={`url(#${g("soft")})`} />
      <path d={BLOB} fill={`url(#${g("wax")})`} />
      {/* raised rim highlight */}
      <path d={BLOB} fill="none" stroke="#FFFDF7" strokeOpacity="0.14" strokeWidth="1.2" transform="translate(-0.6 -0.8)" />
      {/* the pressed well */}
      <circle cx={C} cy={C} r="35" fill={`url(#${g("well")})`} />
      <circle cx={C} cy={C} r="35" fill="none" stroke="#2B2118" strokeOpacity="0.35" strokeWidth="1.4" transform="translate(-0.5 -0.7)" />
      <circle cx={C} cy={C} r="35" fill="none" stroke="#FFFDF7" strokeOpacity="0.18" strokeWidth="1" transform="translate(0.6 0.8)" />
      <circle cx={C} cy={C} r="30.5" fill="none" stroke={`url(#${g("gilt")})`} strokeWidth="0.7" strokeDasharray="0.2 2.4" strokeLinecap="round" />
      {/* monogram, gilded */}
      <g fill={`url(#${g("gilt")})`} fontFamily="var(--font-cormorant), 'Cormorant Garamond', serif" fontStyle="italic">
        <text x="44" y="67" fontSize="28" textAnchor="middle" fontWeight="500">
          {first}
        </text>
        <text x="60" y="71" fontSize="15" textAnchor="middle" fontWeight="400">
          &amp;
        </text>
        <text x="76" y="67" fontSize="28" textAnchor="middle" fontWeight="500">
          {second}
        </text>
      </g>
    </svg>
  );
}

/** Jagged crack line through the seal, as clip-path polygons for the two halves (percent of the box). */
const CRACK = [
  [52, 0],
  [49, 14],
  [54, 27],
  [47, 41],
  [53, 55],
  [48, 68],
  [53, 82],
  [50, 100],
];
export const sealHalfLeft = `polygon(0% 0%, ${CRACK.map(([x, y]) => `${x}% ${y}%`).join(", ")}, 0% 100%)`;
export const sealHalfRight = `polygon(100% 0%, ${CRACK.map(([x, y]) => `${x}% ${y}%`).join(", ")}, 100% 100%)`;
