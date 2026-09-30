/**
 * A pair of Tunisian (Sidi Bou Saïd style) studded arched doors, drawn as one symbol in a 300×580 box.
 * Each leaf renders the symbol and clips to its own half, so studs and carvings
 * stay perfectly continuous across the seam when closed.
 */

export const DOOR_W = 300;
export const DOOR_H = 580;
const R = 150; // arch radius (round arch over the pair)
const CX = 150;
const CY = 150;
const SEAM_GAP = 9; // no studs this close to the seam

type Pt = [number, number];
const round = (n: number) => Math.round(n * 10) / 10;

function arcPoints(cx: number, cy: number, r: number, from: number, to: number, step: number): Pt[] {
  const len = Math.abs(to - from) * r;
  const n = Math.max(1, Math.round(len / step));
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = from + ((to - from) * i) / n;
    pts.push([round(cx + r * Math.cos(a)), round(cy + r * Math.sin(a))]);
  }
  return pts;
}

function linePoints(a: Pt, b: Pt, step: number, skipFirst = false): Pt[] {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.max(1, Math.round(len / step));
  const pts: Pt[] = [];
  for (let i = skipFirst ? 1 : 0; i <= n; i++) {
    pts.push([round(a[0] + ((b[0] - a[0]) * i) / n), round(a[1] + ((b[1] - a[1]) * i) / n)]);
  }
  return pts;
}

function diamond(cx: number, cy: number, rx: number, ry: number, perSide: number): Pt[] {
  const c: Pt[] = [
    [cx, cy - ry],
    [cx + rx, cy],
    [cx, cy + ry],
    [cx - rx, cy],
  ];
  const pts: Pt[] = [];
  for (let i = 0; i < 4; i++) {
    const a = c[i];
    const b = c[(i + 1) % 4];
    for (let k = 0; k < perSide; k++) {
      pts.push([round(a[0] + ((b[0] - a[0]) * k) / perSide), round(a[1] + ((b[1] - a[1]) * k) / perSide)]);
    }
  }
  return pts;
}

function ring(cx: number, cy: number, r: number, n: number, offset = -Math.PI / 2): Pt[] {
  return Array.from({ length: n }, (_, i) => {
    const a = offset + (i / n) * Math.PI * 2;
    return [round(cx + r * Math.cos(a)), round(cy + r * Math.sin(a))] as Pt;
  });
}

const mirror = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [round(DOOR_W - x), y]);

// ── Stud layout ──────────────────────────────────────────
const inset = 11;
const outerArc = arcPoints(CX, CY, R - inset, Math.PI, 2 * Math.PI, 13);
const outerSides = [
  ...linePoints([inset, CY], [inset, DOOR_H - inset], 13, true),
  ...mirror(linePoints([inset, CY], [inset, DOOR_H - inset], 13, true)),
];
const bottomRow = linePoints([inset, DOOR_H - inset], [DOOR_W - inset, DOOR_H - inset], 13, true);
const seamCols = [
  ...linePoints([CX - 11, 40], [CX - 11, DOOR_H - inset], 13),
  ...linePoints([CX + 11, 40], [CX + 11, DOOR_H - inset], 13),
];

// inner arch (a "door within the door")
const IR = 102;
const ICY = 196;
const IBOTTOM = 420;
const innerArc = arcPoints(CX, ICY, IR, Math.PI, 2 * Math.PI, 12);
const innerSides = [
  ...linePoints([CX - IR, ICY], [CX - IR, IBOTTOM], 12, true),
  ...mirror(linePoints([CX - IR, ICY], [CX - IR, IBOTTOM], 12, true)),
];
const midRow = linePoints([inset, 436], [DOOR_W - inset, 436], 13, true);

// motifs
const rosetteL = ring(96, 176, 13, 8);
const rosetteR = mirror(rosetteL);
const lowerL = diamond(78, 500, 20, 34, 4);
const lowerR = mirror(lowerL);

const allStuds: Pt[] = [
  ...outerArc,
  ...outerSides,
  ...bottomRow,
  ...seamCols,
  ...innerArc,
  ...innerSides,
  ...midRow,
  ...rosetteL,
  ...rosetteR,
  ...lowerL,
  ...lowerR,
].filter(([x]) => Math.abs(x - CX) > SEAM_GAP);

// bigger "boss" studs at key points
const bosses: Pt[] = [
  [96, 176],
  [204, 176],
  [78, 500],
  [222, 500],
];

// One stud drawn once (shadow, dome, rim, highlight, specular), placed with <use>.
const STUD = `<g id="s"><circle cx=".6" cy=".9" r="2.2" fill="#2B2118" fill-opacity=".16"/><circle r="2.1" fill="#B8924A"/><circle cx=".6" cy=".63" r="1.5" fill="#8C6A2E" fill-opacity=".55"/><circle cx="-.46" cy="-.52" r="1.22" fill="#E6CF95"/><circle cx="-.74" cy="-.84" r=".5" fill="#FFFDF7"/></g>`;
const studUses =
  allStuds.map(([x, y]) => `<use href="#s" x="${x}" y="${y}"/>`).join("") +
  bosses.map(([x, y]) => `<use href="#s" transform="translate(${x} ${y}) scale(1.62)"/>`).join("");

// ── Carved lines (drawn twice: shadow + gold) ────────────
const leafL = `M0 ${DOOR_H} V${CY} A${R} ${R} 0 0 1 ${CX} 0 V${DOOR_H} Z`;
const leafR = `M${DOOR_W} ${DOOR_H} V${CY} A${R} ${R} 0 0 0 ${CX} 0 V${DOOR_H} Z`;
const carve = [
  // leaf border, inset 20
  `M20 ${DOOR_H - 20} V${CY} A${R - 20} ${R - 20} 0 0 1 ${CX - 20} ${CY - Math.sqrt((R - 20) ** 2 - 20 ** 2)}`,
  `M${CX - 20} ${CY - Math.sqrt((R - 20) ** 2 - 20 ** 2)} V${DOOR_H - 20} H20`,
  // inner arch
  `M${CX - IR} ${IBOTTOM} V${ICY} A${IR} ${IR} 0 0 1 ${CX + IR} ${ICY} V${IBOTTOM} Z`,
  // lower panels
  `M32 452 H${CX - 26} V${DOOR_H - 26} H32 Z`,
];
const carveMirrored = [
  `M${DOOR_W - 20} ${DOOR_H - 20} V${CY} A${R - 20} ${R - 20} 0 0 0 ${CX + 20} ${CY - Math.sqrt((R - 20) ** 2 - 20 ** 2)}`,
  `M${CX + 20} ${CY - Math.sqrt((R - 20) ** 2 - 20 ** 2)} V${DOOR_H - 20} H${DOOR_W - 20}`,
  `M${DOOR_W - 32} 452 H${CX + 26} V${DOOR_H - 26} H${DOOR_W - 32} Z`,
];

/**
 * The door pair as a standalone SVG document. Served as a static file (/doors.svg) so it is
 * cached, stays out of the DOM, and paints as an image as soon as it arrives.
 */
export function doorPairSvg(): string {
  const carveAll = [...carve, ...carveMirrored];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${DOOR_W} ${DOOR_H}" width="${DOOR_W * 2}" height="${DOOR_H * 2}">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8C6A2E"/><stop offset=".45" stop-color="#E6CF95"/><stop offset="1" stop-color="#B8924A"/></linearGradient>
<linearGradient id="l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8C6A2E" stop-opacity=".1"/><stop offset=".7" stop-color="#8C6A2E" stop-opacity="0"/><stop offset="1" stop-color="#FFFDF7" stop-opacity=".35"/></linearGradient>
<linearGradient id="r" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#8C6A2E" stop-opacity=".1"/><stop offset=".7" stop-color="#8C6A2E" stop-opacity="0"/><stop offset="1" stop-color="#FFFDF7" stop-opacity=".35"/></linearGradient>
${STUD}
</defs>
<path d="${leafL}" fill="#EFE6D4"/><path d="${leafR}" fill="#EFE6D4"/>
<path d="${leafL}" fill="url(#l)"/><path d="${leafR}" fill="url(#r)"/>
<g fill="none" stroke="#2B2118" stroke-opacity=".13" transform="translate(.7 .9)">${carveAll.map((d) => `<path d="${d}"/>`).join("")}</g>
<g fill="none" stroke="url(#g)" stroke-width=".9">${carveAll.map((d) => `<path d="${d}"/>`).join("")}</g>
<line x1="${CX}" y1="0" x2="${CX}" y2="${DOOR_H}" stroke="#2B2118" stroke-opacity=".28"/>
${studUses}
</svg>`;
}

/** Shared gold gradient for the inline door frame. */
export function DoorDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8C6A2E" />
          <stop offset="45%" stopColor="#E6CF95" />
          <stop offset="100%" stopColor="#B8924A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** The carved stone surround and threshold, drawn in a larger box around the doors. */
export const FRAME_PAD = { x: 44, top: 46, bottom: 14 };
export function DoorFrame() {
  const W = DOOR_W + FRAME_PAD.x * 2;
  const H = DOOR_H + FRAME_PAD.top + FRAME_PAD.bottom;
  const ox = FRAME_PAD.x;
  const oy = FRAME_PAD.top;
  // horseshoe outer line: circle pinches back in below its centre
  const RO = 176;
  const pinch = (15 * Math.PI) / 180;
  const px = round(RO * Math.cos(pinch));
  const py = round(RO * Math.sin(pinch));
  const RI = 158;
  const dots = arcPoints(CX, CY, 167, Math.PI - 0.12, 2 * Math.PI + 0.12, 9);
  return (
    <svg
      viewBox={`${-ox} ${-oy} ${W} ${H}`}
      className="door-frame"
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <path
        d={`M${CX - px} ${DOOR_H} V${CY + py} A${RO} ${RO} 0 1 1 ${CX + px} ${CY + py} V${DOOR_H}`}
        stroke="url(#goldLine)"
        strokeWidth="1"
      />
      <path
        d={`M${CX - RI} ${DOOR_H} V${CY} A${RI} ${RI} 0 0 1 ${CX + RI} ${CY} V${DOOR_H}`}
        stroke="url(#goldLine)"
        strokeWidth="0.8"
      />
      <path
        d={`M-3 ${DOOR_H} V${CY} A${R + 3} ${R + 3} 0 0 1 ${DOOR_W + 3} ${CY} V${DOOR_H}`}
        stroke="#2B2118"
        strokeOpacity="0.18"
        strokeWidth="1"
      />
      <g fill="#B8924A">
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 2 ? 0.9 : 1.4} />
        ))}
      </g>
      {/* keystone diamond */}
      <path
        d={`M${CX} ${CY - RO - 12} l7 12 l-7 12 l-7 -12 Z`}
        fill="#EFE6D4"
        stroke="url(#goldLine)"
        strokeWidth="0.9"
      />
      {/* threshold */}
      <path d={`M${-ox + 6} ${DOOR_H + 0.5} H${DOOR_W + ox - 6}`} stroke="url(#goldLine)" strokeWidth="1" />
      <path d={`M${-ox + 18} ${DOOR_H + 6} H${DOOR_W + ox - 18}`} stroke="url(#goldLine)" strokeWidth="0.6" />
    </svg>
  );
}
