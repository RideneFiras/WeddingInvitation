/**
 * Hand-authored line ornaments. All strokes use currentColor (set gold via CSS)
 * at a consistent 1–1.5px weight. Symmetric pieces are drawn as one half + mirror.
 */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

/** Horseshoe arch outline in a 200×300 box (used as background silhouette and card cap). */
export const ARCH_D = "M10 300 V118 A92 92 0 1 1 190 118 V300";
export function ArchOutline({ double = true, ...p }: P & { double?: boolean }) {
  return (
    <svg viewBox="0 0 200 300" {...base} {...p}>
      <path d={ARCH_D} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      {double && (
        <path d="M20 300 V118 A82 82 0 1 1 180 118 V300" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.55" />
      )}
    </svg>
  );
}

/** One five-petal jasmine flower centred on 0,0 (radius ≈ 9). */
function JasmineFlower({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  const petal = "M0 -1.6 C 2.6 -3.4, 3.4 -7.6, 0 -9.4 C -3.4 -7.6, -2.6 -3.4, 0 -1.6 Z";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} d={petal} transform={`rotate(${a})`} />
      ))}
      <circle r="1.1" />
    </g>
  );
}

/** A jasmine sprig (machmoum): stem, two flowers, a bud, two leaves. 90×60 box. */
export function JasmineSprig({ leaf = "var(--sage)", ...p }: P & { leaf?: string }) {
  return (
    <svg viewBox="0 0 90 60" strokeWidth="1" {...base} {...p}>
      <path d="M6 52 C 22 46, 38 40, 52 30 C 60 24, 66 18, 70 12" />
      <path d="M40 38 C 42 30, 46 26, 52 23" />
      <path d="M30 44 C 28 36, 24 32, 18 30" />
      <g stroke={leaf}>
        <path d="M16 48 C 20 40, 30 40, 30 44 C 26 49, 20 50, 16 48 Z" />
        <path d="M48 34 C 50 42, 60 44, 62 40 C 60 35, 54 33, 48 34 Z" />
        <path d="M23 47 L 29 44" opacity="0.7" />
        <path d="M53 37 L 60 40" opacity="0.7" />
      </g>
      <JasmineFlower x={70} y={12} s={0.95} rot={8} />
      <JasmineFlower x={53} y={22} s={0.72} rot={-20} />
      <path d="M18 30 C 14 28, 12 24, 13 21 C 16 21, 19 25, 18 30 Z" />
    </svg>
  );
}

/** Small standalone jasmine (for list markers, the divider, the closing). */
export function Jasmine(p: P) {
  return (
    <svg viewBox="-12 -12 24 24" strokeWidth="1" {...base} {...p}>
      <JasmineFlower x={0} y={0} s={1.15} rot={-10} />
    </svg>
  );
}

/** Hairline — diamond — hairline, with two tiny dots. Stretches to its width. */
export function Divider({ className = "", jasmine = false }: { className?: string; jasmine?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="hairline flex-1" />
      <span className="h-[3px] w-[3px] rounded-full bg-gold" />
      {jasmine ? (
        <Jasmine className="h-4 w-4 text-gold" />
      ) : (
        <span className="h-[7px] w-[7px] rotate-45 border border-gold" />
      )}
      <span className="h-[3px] w-[3px] rounded-full bg-gold" />
      <span className="hairline flex-1" />
    </div>
  );
}

/** Qallaline-tile inspired: a vase with climbing vines inside an arch. 120×170 box. */
export function QallalineVase(p: P) {
  const half = (
    <>
      {/* vase body */}
      <path d="M60 60 H68 C 71 60, 71 64, 68 65 C 66 68, 66 73, 69 77 C 84 85, 89 100, 85 114 C 82 124, 73 130, 66 132 V136 C 72 137, 75 140, 75 143 H60" />
      {/* handle */}
      <path d="M68 68 C 79 64, 82 75, 75 80" />
      {/* belly band */}
      <path d="M60 101 H86" opacity="0.6" />
      {/* vine */}
      <path d="M62 60 C 70 48, 84 46, 88 34 C 90 26, 83 22, 80 28 C 78 32, 82 35, 85 33" />
      <path d="M66 52 C 74 52, 80 56, 82 62" />
      <path d="M73 49 C 75 44, 80 42, 84 43 C 82 47, 78 50, 73 49 Z" />
      <path d="M82 62 C 86 60, 90 62, 91 66 C 87 67, 83 65, 82 62 Z" />
      {/* arch */}
      <path d="M60 8 A46 46 0 0 1 106 54 V168" />
      <path d="M60 14 A40 40 0 0 1 100 54 V168" opacity="0.5" />
    </>
  );
  return (
    <svg viewBox="0 0 120 170" strokeWidth="1.1" {...base} {...p}>
      {half}
      <g transform="translate(120 0) scale(-1 1)">{half}</g>
      <path d="M60 60 V40 C 60 34, 60 30, 60 26" />
      <JasmineFlower x={60} y={20} s={0.85} />
      <path d="M8 168 H112" />
    </svg>
  );
}

/** Line chandelier with candle flames (the flames glow when lit). 140×180 box. */
export function Chandelier(p: P) {
  const half = (
    <>
      <path d="M70 84 C 52 100, 28 98, 22 78" />
      <path d="M70 90 C 60 102, 46 100, 42 88" />
      {/* candle cups + candles */}
      <path d="M16 78 C 18 82, 26 82, 28 78" />
      <path d="M20 78 V66 M24 78 V66" />
      <path d="M37 88 C 38.5 91, 45.5 91, 47 88" />
      <path d="M40 88 V78 M44 88 V78" />
      {/* crystals */}
      <path d="M22 82 V92" opacity="0.7" />
      <path d="M22 92 C 24 95, 23 98, 22 99 C 21 98, 20 95, 22 92 Z" />
      <path d="M42 91 V99" opacity="0.7" />
      <path d="M42 99 C 44 102, 43 105, 42 106 C 41 105, 40 102, 42 99 Z" />
    </>
  );
  const flames = (
    <>
      <path d="M22 65 C 25 60, 23 56, 22 53 C 21 56, 19 60, 22 65 Z" />
      <path d="M42 77 C 45 72, 43 68, 42 65 C 41 68, 39 72, 42 77 Z" />
    </>
  );
  return (
    <svg viewBox="0 0 140 180" strokeWidth="1.1" {...base} {...p}>
      {/* chain */}
      <path d="M70 0 V26" />
      {[6, 13, 20].map((y) => (
        <ellipse key={y} cx="70" cy={y} rx="1.6" ry="3" />
      ))}
      {/* crown */}
      <path d="M58 30 C 60 36, 80 36, 82 30 M60 30 H80" />
      <path d="M70 36 V64" />
      <circle cx="70" cy="72" r="8" />
      <path d="M70 80 V112" />
      <path d="M64 112 C 66 116, 74 116, 76 112 Z" />
      <path d="M70 116 C 74 124, 72 132, 70 136 C 68 132, 66 124, 70 116 Z" />
      {half}
      <g transform="translate(140 0) scale(-1 1)">{half}</g>
      {/* swag of beads */}
      <path d="M22 84 Q 70 128 118 84" strokeDasharray="0.1 4" strokeWidth="1.6" />
      <g className="chandelier-flames" fill="currentColor" stroke="none">
        {flames}
        <g transform="translate(140 0) scale(-1 1)">{flames}</g>
      </g>
    </svg>
  );
}

/** A tiny arch glyph used as a programme marker. */
export function ArchGlyph(p: P) {
  return (
    <svg viewBox="0 0 24 30" strokeWidth="1.1" {...base} {...p}>
      <path d="M3 29 V13 A9 9 0 0 1 21 13 V29" />
      <path d="M7 29 V14 A5 5 0 0 1 17 14 V29" opacity="0.6" />
    </svg>
  );
}

/** Corner flourish for frames (top-left orientation; mirror with CSS). */
export function Corner(p: P) {
  return (
    <svg viewBox="0 0 40 40" strokeWidth="1" {...base} {...p}>
      <path d="M2 38 V14 C 2 7, 7 2, 14 2 H38" />
      <path d="M8 38 V17 C 8 12, 12 8, 17 8 H38" opacity="0.5" />
      <path d="M14 14 l3 -3 l3 3 l-3 3 Z" />
    </svg>
  );
}
