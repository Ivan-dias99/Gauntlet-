// Wave 8d — connection lines for the canonical 4×3 layout.
//
// 9 rays: one from each mode panel toward the geometric centre of the
// canvas (cell 2/2-2/3 in the 4-col × 3-row grid). Each ray ends INSIDE
// the canvas's halo so the eye reads the canvas as the destination.
//
// Panel positions in viewBox (0..100), assuming the layout grid is
// 4 columns × 3 rows with route spanning cols 2-3 in row 3:
//
//   row 1 (top):    (12.5, 18)  (37.5, 18)  (62.5, 18)  (87.5, 18)
//   row 2 (middle): (12.5, 50)  [canvas cols 2-3]       (87.5, 50)
//   row 3 (bottom): (12.5, 82)  (50, 82, route wide)    (87.5, 82)
//
// Centre: (50, 50). Endpoints get pulled back by CANVAS_RADIUS so the
// rays disappear into the composer's glow.

interface Source {
  x: number;
  y: number;
  /** "side" — coming from left (panel on left side) or right; controls
   *  the gradient direction so the bright stop faces the centre. */
  side: "l" | "r" | "v";
}

const SOURCES: Source[] = [
  { x: 12.5, y: 18, side: "l" }, // 1 idle
  { x: 37.5, y: 18, side: "l" }, // 2 context
  { x: 62.5, y: 18, side: "r" }, // 3 compose-thumb
  { x: 87.5, y: 18, side: "r" }, // 4 code
  { x: 12.5, y: 50, side: "l" }, // 5 design
  { x: 87.5, y: 50, side: "r" }, // 6 analysis
  { x: 12.5, y: 82, side: "l" }, // 7 memory
  { x: 50,   y: 82, side: "v" }, // 9 route (wide)
  { x: 87.5, y: 82, side: "r" }, // 8 apply
];

const NODE_X = 50;
const NODE_Y = 50;
const CANVAS_RADIUS = 14;

function endpoint(s: Source): { ex: number; ey: number } {
  const dx = NODE_X - s.x;
  const dy = NODE_Y - s.y;
  const len = Math.hypot(dx, dy) || 1;
  const t = Math.max(0, (len - CANVAS_RADIUS) / len);
  return { ex: s.x + dx * t, ey: s.y + dy * t };
}

function curvePath(s: Source): string {
  const { ex, ey } = endpoint(s);
  // Control points smooth the curve so it eases into the destination.
  // For straight verticals (route panel), the curve is essentially a
  // straight line — the ease still works.
  const cx1 = s.x + (ex - s.x) * 0.55;
  const cy1 = s.y;
  const cx2 = ex - (ex - s.x) * 0.25;
  const cy2 = ey;
  return `M ${s.x} ${s.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${ex} ${ey}`;
}

export default function ConnectionLines() {
  return (
    <svg
      data-connection-lines
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="composer-line-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="ray-fade-l" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(94,165,255,0.10)" />
          <stop offset="50%"  stopColor="rgba(94,165,255,0.55)" />
          <stop offset="100%" stopColor="rgba(180,220,255,1)" />
        </linearGradient>
        <linearGradient id="ray-fade-r" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor="rgba(94,165,255,0.10)" />
          <stop offset="50%"  stopColor="rgba(94,165,255,0.55)" />
          <stop offset="100%" stopColor="rgba(180,220,255,1)" />
        </linearGradient>
        <linearGradient id="ray-fade-v" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%"   stopColor="rgba(94,165,255,0.10)" />
          <stop offset="50%"  stopColor="rgba(94,165,255,0.55)" />
          <stop offset="100%" stopColor="rgba(180,220,255,1)" />
        </linearGradient>
      </defs>

      <g strokeWidth="0.45" fill="none" filter="url(#composer-line-glow)">
        {SOURCES.map((s, i) => (
          <g key={i} stroke={`url(#ray-fade-${s.side})`}>
            <path d={curvePath(s)} />
          </g>
        ))}
      </g>
    </svg>
  );
}
