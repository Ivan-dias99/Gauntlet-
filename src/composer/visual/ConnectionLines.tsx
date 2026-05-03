// Wave 8 — connection lines layer.
//
// SVG positioned absolutely behind the grid. Draws 8 glow curves from
// the inner edge of each side panel to the central composer, plus a
// node at the centre. The viewBox is unitless (0 0 100 100) and
// preserveAspectRatio="none" so the paths scale with whatever grid
// size the layout decides.
//
// preserveAspectRatio="none" means strokes get distorted when the grid
// is non-square — that is acceptable for these decorative paths
// because the curve shape is approximate, not load-bearing. If the
// distortion ever becomes ugly we switch to per-side positioning.

const LEFT_X_INNER = 18;   // inner edge of left column panels
const RIGHT_X_INNER = 82;  // inner edge of right column panels
const CENTER_X = 50;
const CENTER_Y = 50;

// Y centres of the 4 panels per side (matches the grid: 4 stacked
// equal-height rows). The numbers are eyeballed for the canonical
// Foto 3 mockup; minor drift is fine because the lines fade toward
// both endpoints.
const SIDE_Y = [16, 38, 62, 84];

interface CurveProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function Curve({ x1, y1, x2, y2 }: CurveProps) {
  // Cubic bezier — bulge horizontally toward the centre, easing in
  // vertically so the line approaches the composer with a gentle
  // upward / downward arc.
  const cx1 = x1 + (x2 - x1) * 0.55;
  const cx2 = x2 - (x2 - x1) * 0.45;
  const path = `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
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
        <filter id="composer-line-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="composer-node-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(255,255,255,1)" />
          <stop offset="40%"  stopColor="rgba(94,165,255,0.85)" />
          <stop offset="100%" stopColor="rgba(94,165,255,0)" />
        </radialGradient>
      </defs>

      <g filter="url(#composer-line-glow)">
        {SIDE_Y.map((y) => (
          <Curve
            key={`l-${y}`}
            x1={LEFT_X_INNER}
            y1={y}
            x2={CENTER_X}
            y2={CENTER_Y}
          />
        ))}
        {SIDE_Y.map((y) => (
          <Curve
            key={`r-${y}`}
            x1={RIGHT_X_INNER}
            y1={y}
            x2={CENTER_X}
            y2={CENTER_Y}
          />
        ))}
      </g>

      {/* Centre node — soft glow disc behind the canvas frame. */}
      <circle cx={CENTER_X} cy={CENTER_Y} r="3" fill="url(#composer-node-glow)" />
      <circle cx={CENTER_X} cy={CENTER_Y} r="0.7" fill="#ffffff" />
    </svg>
  );
}
