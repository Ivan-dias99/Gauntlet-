// Wave 8b — connection lines with a true convergence point.
//
// Eight rays radiate from a luminous node anchored at the bottom-
// centre of the central composer toward the inner edge of each side
// panel. The convergence point is rendered as a radial-gradient halo
// + bright core so the geometry reads as "everything flows into this
// point", matching the canonical Foto 3 mockup.
//
// viewBox is 0..100 unitless and preserveAspectRatio="none" so the
// paths scale with whatever grid size the layout decides.

const LEFT_X_INNER = 18;   // inner edge of left column panels
const RIGHT_X_INNER = 82;  // inner edge of right column panels

// Y centres of the 4 panels per side (matches the 4-row grid in
// ComposerLayout).
const SIDE_Y = [13, 35, 57, 79];

// Convergence — bottom-centre of the central composer. The composer
// occupies roughly y=20..70 in the grid; we anchor the node just below
// to make the rays read as "flowing into" the canvas.
const NODE_X = 50;
const NODE_Y = 78;

interface RayProps {
  x1: number;
  y1: number;
}

function Ray({ x1, y1 }: RayProps) {
  // Cubic bezier — control points pulled toward the convergence node
  // so the curve eases into it cleanly.
  const cx1 = x1 + (NODE_X - x1) * 0.45;
  const cy1 = y1;
  const cx2 = NODE_X + (x1 - NODE_X) * 0.15;
  const cy2 = NODE_Y - 5;
  const path = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${NODE_X} ${NODE_Y}`;
  return <path d={path} />;
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
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="composer-ray-fade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"  stopColor="rgba(94,165,255,0.15)" />
          <stop offset="60%" stopColor="rgba(94,165,255,0.55)" />
          <stop offset="100%" stopColor="rgba(140,200,255,0.95)" />
        </linearGradient>

        <radialGradient id="composer-node-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(255,255,255,1)" />
          <stop offset="20%"  stopColor="rgba(180,220,255,0.95)" />
          <stop offset="55%"  stopColor="rgba(94,165,255,0.6)" />
          <stop offset="100%" stopColor="rgba(94,165,255,0)" />
        </radialGradient>

        <radialGradient id="composer-node-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(255,255,255,1)" />
          <stop offset="60%"  stopColor="rgba(220,235,255,0.95)" />
          <stop offset="100%" stopColor="rgba(160,200,255,0)" />
        </radialGradient>
      </defs>

      {/* Rays — drawn first so the node sits on top. Stroke uses the
          fade gradient so each ray is dim near the panel and bright
          near the convergence. Filter applies the glow halo. */}
      <g
        stroke="url(#composer-ray-fade)"
        strokeWidth="0.45"
        fill="none"
        filter="url(#composer-line-glow)"
      >
        {SIDE_Y.map((y) => (
          <Ray key={`l-${y}`} x1={LEFT_X_INNER} y1={y} />
        ))}
        {SIDE_Y.map((y) => (
          <Ray key={`r-${y}`} x1={RIGHT_X_INNER} y1={y} />
        ))}
      </g>

      {/* Convergence node — wide soft halo behind, brighter core in
          front, hot white pixel at the dead centre. */}
      <circle cx={NODE_X} cy={NODE_Y} r="9"   fill="url(#composer-node-halo)" />
      <circle cx={NODE_X} cy={NODE_Y} r="3.2" fill="url(#composer-node-core)" />
      <circle cx={NODE_X} cy={NODE_Y} r="0.6" fill="#ffffff" />
    </svg>
  );
}
