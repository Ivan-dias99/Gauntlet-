// Sprint 1 — Idle / Dormant Hero with full visual identity.
//
// Pillar icons (clock / ear / shield / lightning), connection lines
// with L-shaped joints (not diagonals), Expand button on the chip
// with scroll-to-tiles behaviour, and a tip line beneath the chip.
//
// Pillars are static descriptive copy. Tip line is static copy.
// Neither carries data, neither is mock — both are design language.

import type { CSSProperties, ReactNode } from "react";
import {
  ClockIcon,
  EarIcon,
  ShieldIcon,
  LightningIcon,
  ChevronDownIcon,
} from "./icons";

interface Pillar {
  number: string;
  title: string;
  body: string;
  icon: ReactNode;
}

const PILLARS: Pillar[] = [
  {
    number: "1",
    title: "Waiting",
    body: "Composer remains dormant until you call it.",
    icon: <ClockIcon size={14} />,
  },
  {
    number: "2",
    title: "Listening for context",
    body: "Continuously monitors active context to provide relevant, proactive assistance.",
    icon: <EarIcon size={14} />,
  },
  {
    number: "3",
    title: "Respecting permissions",
    body: "Operates only within the boundaries you've defined.",
    icon: <ShieldIcon size={14} />,
  },
  {
    number: "4",
    title: "Instant summon",
    body: "Ready to expand and help in a fraction of a second.",
    icon: <LightningIcon size={14} />,
  },
];

interface Props {
  // Provided by StudioHome — fires when the operator clicks Expand on
  // the chip. Scrolls the tile grid into view; never navigates away.
  onExpand?: () => void;
}

const wrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 24,
  padding: "32px 16px 8px",
};

const titleBlockStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: 8,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--serif)",
  fontWeight: 400,
  fontSize: "clamp(28px, 3vw, 36px)",
  color: "var(--text-primary)",
  letterSpacing: "var(--track-tight, -0.015em)",
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 14,
  color: "var(--text-secondary)",
  lineHeight: 1.55,
  maxWidth: 520,
};

// Diamond stage: 5 columns × 3 rows. Pillars in corner cells, orb in
// the centre cell. The SVG connection layer covers the entire stage.
const stageStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: 880,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.1fr) minmax(0, 1fr) minmax(0, 1fr)",
  gridTemplateRows: "auto 220px auto",
  rowGap: 28,
  alignItems: "center",
  padding: "16px 8px",
};

const pillarStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  padding: "14px 16px",
  background: "color-mix(in oklab, var(--bg-surface) 86%, transparent)",
  border: "1px solid var(--border-color-soft)",
  borderRadius: "var(--radius-md, 8px)",
  backdropFilter: "blur(2px)",
  position: "relative",
  zIndex: 2,
};

const pillarHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const pillarBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
  padding: "2px 7px",
  borderRadius: "999px",
  border: "1px solid var(--accent)",
  color: "var(--accent)",
  fontFamily: "var(--mono)",
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "var(--track-meta, 0.12em)",
};

const pillarTitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: "var(--track-meta, 0.12em)",
  textTransform: "uppercase",
  color: "var(--accent)",
};

const pillarBodyStyle: CSSProperties = {
  margin: 0,
  fontSize: 12.5,
  lineHeight: 1.5,
  color: "var(--text-secondary)",
};

const orbCellStyle: CSSProperties = {
  gridColumn: "3",
  gridRow: "2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  zIndex: 2,
};

// Multi-layer orb — base ring + outer aura + mid aura + bright core.
// Pure CSS (no SVG) keeps token-driven theming intact.
const orbBaseStyle: CSSProperties = {
  position: "relative",
  width: 200,
  height: 200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const orbRingStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: "50%",
  border: "1px solid color-mix(in oklab, var(--accent) 28%, transparent)",
  boxShadow: "inset 0 0 32px rgba(79, 184, 217, 0.12)",
};

const orbOuterAuraStyle: CSSProperties = {
  position: "absolute",
  width: 180,
  height: 180,
  borderRadius: "50%",
  background: "radial-gradient(circle, color-mix(in oklab, var(--accent) 26%, transparent) 0%, color-mix(in oklab, var(--accent) 10%, transparent) 50%, transparent 78%)",
};

const orbMidAuraStyle: CSSProperties = {
  position: "absolute",
  width: 110,
  height: 110,
  borderRadius: "50%",
  background: "radial-gradient(circle, color-mix(in oklab, var(--accent) 65%, transparent) 0%, color-mix(in oklab, var(--accent) 24%, transparent) 55%, transparent 90%)",
};

const orbCoreStyle: CSSProperties = {
  position: "relative",
  width: 16,
  height: 16,
  borderRadius: "50%",
  background: "var(--accent)",
  boxShadow:
    "0 0 8px var(--accent), 0 0 22px color-mix(in oklab, var(--accent) 75%, transparent), 0 0 44px color-mix(in oklab, var(--accent) 40%, transparent)",
};

// Status chip below the stage — orb dot + label + sub-label + Expand
// button. The Expand button scrolls the tile grid into view; never
// navigates.
const chipStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 12,
  padding: "10px 14px 10px 16px",
  background: "color-mix(in oklab, var(--bg-surface) 70%, transparent)",
  border: "1px solid var(--border-color-mid)",
  borderRadius: "999px",
  boxShadow: "0 0 0 1px color-mix(in oklab, var(--accent) 18%, transparent), 0 0 32px color-mix(in oklab, var(--accent) 14%, transparent)",
};

const chipDotStyle: CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "var(--accent)",
  boxShadow: "0 0 10px var(--accent)",
};

const chipLabelStyle: CSSProperties = {
  fontSize: 13,
  color: "var(--text-primary)",
};

const chipSubLabelStyle: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-meta, 0.12em)",
  textTransform: "lowercase",
  color: "var(--text-muted)",
};

const expandButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "4px 10px",
  background: "transparent",
  border: "1px solid var(--border-color-mid)",
  borderRadius: "999px",
  color: "var(--text-secondary)",
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-meta, 0.12em)",
  textTransform: "uppercase",
  cursor: "pointer",
  marginLeft: 4,
};

const tipStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-meta, 0.12em)",
  color: "var(--text-muted)",
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
  justifyContent: "center",
};

const kbdStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "1px 6px",
  background: "color-mix(in oklab, var(--bg-elevated) 80%, transparent)",
  border: "1px solid var(--border-color-soft)",
  borderRadius: "var(--radius-sm, 4px)",
  fontFamily: "var(--mono)",
  fontSize: 10,
  color: "var(--text-secondary)",
};

// Connection lines — single SVG covering the stage. Each path is an
// L-shape (orb edge → horizontal-ish segment → diagonal to pillar)
// matching the joint look of the target mock instead of straight
// diagonals.
function ConnectionLines() {
  const lineColor = "color-mix(in oklab, var(--accent) 38%, transparent)";
  const lineColorDim = "color-mix(in oklab, var(--accent) 18%, transparent)";
  const dotColor = "var(--accent)";

  // viewBox 1000×400; orb at (500, 200) with visual radius ≈ 60.
  // Pillar anchors chosen near each pillar's inner corner.
  const orb = { cx: 500, cy: 200, r: 62 };

  // Each line: orb-edge entry, midpoint corner, pillar landing dot.
  // Direction angle from orb centre defines the edge entry point.
  const lines = [
    { angle: 200, mid: { x: 320, y: 160 }, end: { x: 200, y: 90 } },   // top-left
    { angle: 340, mid: { x: 680, y: 160 }, end: { x: 800, y: 90 } },   // top-right
    { angle: 160, mid: { x: 320, y: 240 }, end: { x: 200, y: 310 } },  // bottom-left
    { angle: 20,  mid: { x: 680, y: 240 }, end: { x: 800, y: 310 } },  // bottom-right
  ];

  function entryFromAngle(angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: orb.cx + orb.r * Math.cos(rad), y: orb.cy + orb.r * Math.sin(rad) };
  }

  return (
    <svg
      viewBox="0 0 1000 400"
      preserveAspectRatio="none"
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <defs>
        {/* Soft fade — line is brighter near the orb, softer at the pillar. */}
        <linearGradient id="lineFadeLR" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={lineColor} />
          <stop offset="100%" stopColor={lineColorDim} />
        </linearGradient>
        <linearGradient id="lineFadeRL" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor={lineColor} />
          <stop offset="100%" stopColor={lineColorDim} />
        </linearGradient>
      </defs>
      {lines.map((l, i) => {
        const start = entryFromAngle(l.angle);
        const goingRight = l.end.x > orb.cx;
        const grad = goingRight ? "url(#lineFadeLR)" : "url(#lineFadeRL)";
        // Path: entry → corner (midpoint) → landing dot.
        const d = `M ${start.x} ${start.y} L ${l.mid.x} ${l.mid.y} L ${l.end.x} ${l.end.y}`;
        return (
          <g key={i}>
            <path
              d={d}
              stroke={grad}
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Tiny corner joint dot */}
            <circle cx={l.mid.x} cy={l.mid.y} r={1.8} fill={lineColorDim} />
            {/* Pillar landing dot */}
            <circle cx={l.end.x} cy={l.end.y} r={3} fill={dotColor} opacity={0.85} />
          </g>
        );
      })}
    </svg>
  );
}

function PillarCard({ pillar }: { pillar: Pillar }) {
  return (
    <div style={pillarStyle}>
      <header style={pillarHeaderStyle}>
        <span style={pillarBadgeStyle}>
          {pillar.icon}
          {pillar.number}
        </span>
        <h3 style={pillarTitleStyle}>{pillar.title}</h3>
      </header>
      <p style={pillarBodyStyle}>{pillar.body}</p>
    </div>
  );
}

export default function IdleHero({ onExpand }: Props) {
  return (
    <section style={wrapStyle} data-studio-idle-hero>
      <div style={titleBlockStyle}>
        <h1 style={titleStyle}>Idle / Dormant Mode</h1>
        <p style={subtitleStyle}>
          Composer is waiting quietly in the background, listening for context
          and ready when you are.
        </p>
      </div>

      <div style={stageStyle}>
        <ConnectionLines />

        <div style={{ gridColumn: "1 / span 2", gridRow: "1" }}>
          <PillarCard pillar={PILLARS[0]} />
        </div>
        <div style={{ gridColumn: "4 / span 2", gridRow: "1" }}>
          <PillarCard pillar={PILLARS[1]} />
        </div>

        <div style={orbCellStyle}>
          <div style={orbBaseStyle}>
            <div style={orbRingStyle} />
            <div style={orbOuterAuraStyle} />
            <div style={orbMidAuraStyle} />
            <div style={orbCoreStyle} />
          </div>
        </div>

        <div style={{ gridColumn: "1 / span 2", gridRow: "3" }}>
          <PillarCard pillar={PILLARS[2]} />
        </div>
        <div style={{ gridColumn: "4 / span 2", gridRow: "3" }}>
          <PillarCard pillar={PILLARS[3]} />
        </div>
      </div>

      <div style={chipStyle} role="status" aria-label="Composer state">
        <span style={chipDotStyle} aria-hidden />
        <span style={chipLabelStyle}>Composer is idle</span>
        <span style={chipSubLabelStyle}>· listening for context</span>
        {onExpand && (
          <button
            type="button"
            onClick={onExpand}
            style={expandButtonStyle}
            title="Scroll to tiles below"
          >
            Expand
            <ChevronDownIcon size={12} />
          </button>
        )}
      </div>

      <p style={tipStyle}>
        <span>Tip</span>
        <span>·</span>
        <span>Press</span>
        <kbd style={kbdStyle}>⌥</kbd>
        <kbd style={kbdStyle}>⌘</kbd>
        <kbd style={kbdStyle}>Space</kbd>
        <span>to summon · click the orb · or type</span>
        <kbd style={kbdStyle}>/composer</kbd>
      </p>
    </section>
  );
}
