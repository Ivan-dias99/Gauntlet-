// Wave 8c — convergence INTO the composer, not below it.
//
// The eight rays now terminate at the geometric centre of the central
// canvas (NODE_Y=50). The composer's outer halo (box-shadow stacks +
// radial-gradient halo div) overpowers the visible end of each ray, so
// the eye reads the composer as the destination rather than a point
// floating in empty space underneath it.
//
// No visible <circle> node any more — the composer IS the node.

const LEFT_X_INNER = 18;
const RIGHT_X_INNER = 82;

// Y centres of the 4 panels per side. Match the 4-row stacked grid in
// ComposerLayout (each row ≈ 25% of the column).
const SIDE_Y = [12, 35, 58, 81];

// Convergence — geometric centre of the grid, where the canvas sits.
const NODE_X = 50;
const NODE_Y = 50;

// Stop short of the canvas centre by this delta (in viewBox units) so
// the rays disappear into the composer's halo rather than sticking
// out the other side.
const CANVAS_RADIUS = 16;

interface RayProps {
  x1: number;
  y1: number;
}

function Ray({ x1, y1 }: RayProps) {
  // Pull the ray's endpoint back along the vector toward the panel by
  // CANVAS_RADIUS so the line ends inside the composer's glow halo.
  const dx = NODE_X - x1;
  const dy = NODE_Y - y1;
  const len = Math.hypot(dx, dy);
  const t = (len - CANVAS_RADIUS) / len;
  const ex = x1 + dx * t;
  const ey = y1 + dy * t;

  // Cubic bezier — smooth easing toward the composer.
  const cx1 = x1 + (ex - x1) * 0.55;
  const cy1 = y1;
  const cx2 = ex - (ex - x1) * 0.25;
  const cy2 = ey;
  const path = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${ex} ${ey}`;
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
          <feGaussianBlur stdDeviation="0.7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="composer-ray-fade-l" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(94,165,255,0.10)" />
          <stop offset="50%"  stopColor="rgba(94,165,255,0.55)" />
          <stop offset="100%" stopColor="rgba(180,220,255,1)" />
        </linearGradient>
        <linearGradient id="composer-ray-fade-r" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor="rgba(94,165,255,0.10)" />
          <stop offset="50%"  stopColor="rgba(94,165,255,0.55)" />
          <stop offset="100%" stopColor="rgba(180,220,255,1)" />
        </linearGradient>
      </defs>

      <g strokeWidth="0.45" fill="none" filter="url(#composer-line-glow)">
        {SIDE_Y.map((y) => (
          <g key={`l-${y}`} stroke="url(#composer-ray-fade-l)">
            <Ray x1={LEFT_X_INNER} y1={y} />
          </g>
        ))}
        {SIDE_Y.map((y) => (
          <g key={`r-${y}`} stroke="url(#composer-ray-fade-r)">
            <Ray x1={RIGHT_X_INNER} y1={y} />
          </g>
        ))}
      </g>
    </svg>
  );
}
