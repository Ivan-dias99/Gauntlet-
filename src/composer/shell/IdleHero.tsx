// Fase 1.5 — Idle / Dormant Hero, recalibrated.
//
// Composes the full Idle visual identity (per the target mock):
//   * orb: multi-layer aura + bright core + ambient base ring
//   * 4 numbered pillars (UX copy, not data) arranged in a diamond
//   * SVG connection lines from orb to each pillar
//   * status chip below ("Composer is idle / Listening for context…")
//
// Pillars are static copy describing what Idle means. They are not
// mock data — they are design language. Same for the connection lines.
//
// Token consumption only: every colour comes from the studio palette
// scoped under [data-composer-studio] (src/styles/tokens.css).

import type { CSSProperties } from "react";

interface Pillar {
  number: string;
  title: string;
  body: string;
}

const PILLARS: Pillar[] = [
  {
    number: "1",
    title: "Waiting",
    body: "Composer remains dormant until you call it.",
  },
  {
    number: "2",
    title: "Listening for context",
    body: "Continuously monitors active context to provide relevant, proactive assistance.",
  },
  {
    number: "3",
    title: "Respecting permissions",
    body: "Operates only within the boundaries you've defined.",
  },
  {
    number: "4",
    title: "Instant summon",
    body: "Ready to expand and help in a fraction of a second.",
  },
];

const wrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 28,
  padding: "32px 16px 16px",
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

// The diamond stage: 5 columns × 3 rows so the orb has horizontal
// breathing room from the pillars. Pillars sit in the corner cells.
const stageStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: 880,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.1fr) minmax(0, 1fr) minmax(0, 1fr)",
  gridTemplateRows: "auto 200px auto",
  rowGap: 24,
  alignItems: "center",
  padding: "16px 8px",
};

// Pillar cards — used in the 4 corner cells of the diamond stage.
const pillarStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  padding: "14px 16px",
  background: "color-mix(in oklab, var(--bg-surface) 86%, transparent)",
  border: "1px solid var(--border-color-soft)",
  borderRadius: "var(--radius-md, 8px)",
  backdropFilter: "blur(2px)",
  // Pillars sit above the SVG connection layer.
  position: "relative",
  zIndex: 2,
};

const pillarHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const pillarNumberStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 22,
  height: 22,
  borderRadius: "50%",
  border: "1px solid var(--accent)",
  color: "var(--accent)",
  fontFamily: "var(--mono)",
  fontSize: 11,
  fontWeight: 600,
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

// Orb container — center cell, vertical center of the stage.
const orbCellStyle: CSSProperties = {
  gridColumn: "3",
  gridRow: "2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  zIndex: 2,
};

// Multi-layer orb — base ring (subtle), outer aura, mid aura, core.
// CSS-only, no SVG. Each layer is a positioned div with a radial-gradient
// or solid background. Box-shadow on the core supplies the bright glow.
const orbBaseStyle: CSSProperties = {
  position: "relative",
  width: 180,
  height: 180,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const orbRingStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: "50%",
  border: "1px solid color-mix(in oklab, var(--accent) 24%, transparent)",
  boxShadow: "inset 0 0 24px rgba(79, 184, 217, 0.10)",
};

const orbOuterAuraStyle: CSSProperties = {
  position: "absolute",
  width: 160,
  height: 160,
  borderRadius: "50%",
  background: "radial-gradient(circle, color-mix(in oklab, var(--accent) 22%, transparent) 0%, color-mix(in oklab, var(--accent) 8%, transparent) 50%, transparent 75%)",
};

const orbMidAuraStyle: CSSProperties = {
  position: "absolute",
  width: 90,
  height: 90,
  borderRadius: "50%",
  background: "radial-gradient(circle, color-mix(in oklab, var(--accent) 60%, transparent) 0%, color-mix(in oklab, var(--accent) 18%, transparent) 60%, transparent 90%)",
};

const orbCoreStyle: CSSProperties = {
  position: "relative",
  width: 14,
  height: 14,
  borderRadius: "50%",
  background: "var(--accent)",
  boxShadow:
    "0 0 6px var(--accent), 0 0 18px color-mix(in oklab, var(--accent) 70%, transparent), 0 0 36px color-mix(in oklab, var(--accent) 35%, transparent)",
};

// Status chip below the stage — anchors the orb's signal to a textual
// statement of state. Uses the same Expand metaphor as the capsule.
const chipStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 12,
  padding: "10px 14px",
  background: "color-mix(in oklab, var(--bg-surface) 70%, transparent)",
  border: "1px solid var(--border-color-mid)",
  borderRadius: "999px",
  boxShadow: "0 0 0 1px color-mix(in oklab, var(--accent) 18%, transparent), 0 0 24px color-mix(in oklab, var(--accent) 12%, transparent)",
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

// Connection lines — single SVG covering the stage, drawn behind the
// pillars and orb (zIndex stays at 1 vs the cards' zIndex 2). The
// viewBox + percentages keep it responsive as the grid resizes.
function ConnectionLines() {
  // viewBox coordinates chosen so the SVG corners roughly align with
  // the centres of the corner pillars. Tuning numbers — adjust if the
  // grid template changes.
  const lineColor = "color-mix(in oklab, var(--accent) 40%, transparent)";
  const dotColor = "color-mix(in oklab, var(--accent) 75%, transparent)";

  // Centres in viewBox space.
  const cx = 500;
  const cy = 200;
  const orbRadius = 60;
  const pillars = [
    { x: 130, y: 70 },   // top-left
    { x: 870, y: 70 },   // top-right
    { x: 130, y: 330 },  // bottom-left
    { x: 870, y: 330 },  // bottom-right
  ];

  // Helper: compute the entry point on the orb's edge along the line
  // from orb centre to a pillar — keeps lines from piercing the core.
  function orbEdge(px: number, py: number) {
    const dx = px - cx;
    const dy = py - cy;
    const len = Math.sqrt(dx * dx + dy * dy);
    return { x: cx + (dx / len) * orbRadius, y: cy + (dy / len) * orbRadius };
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
      {pillars.map((p, i) => {
        const start = orbEdge(p.x, p.y);
        return (
          <g key={i}>
            <line
              x1={start.x}
              y1={start.y}
              x2={p.x}
              y2={p.y}
              stroke={lineColor}
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeDasharray="2 4"
            />
            <circle cx={p.x} cy={p.y} r={3} fill={dotColor} />
          </g>
        );
      })}
    </svg>
  );
}

function PillarCard({ pillar, gridArea }: { pillar: Pillar; gridArea: string }) {
  return (
    <div style={{ ...pillarStyle, gridArea }}>
      <header style={pillarHeaderStyle}>
        <span style={pillarNumberStyle}>{pillar.number}</span>
        <h3 style={pillarTitleStyle}>{pillar.title}</h3>
      </header>
      <p style={pillarBodyStyle}>{pillar.body}</p>
    </div>
  );
}

export default function IdleHero() {
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
          <PillarCard pillar={PILLARS[0]} gridArea="auto" />
        </div>
        <div style={{ gridColumn: "4 / span 2", gridRow: "1" }}>
          <PillarCard pillar={PILLARS[1]} gridArea="auto" />
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
          <PillarCard pillar={PILLARS[2]} gridArea="auto" />
        </div>
        <div style={{ gridColumn: "4 / span 2", gridRow: "3" }}>
          <PillarCard pillar={PILLARS[3]} gridArea="auto" />
        </div>
      </div>

      <div style={chipStyle} role="status" aria-label="Composer state">
        <span style={chipDotStyle} aria-hidden />
        <span style={chipLabelStyle}>Composer is idle</span>
        <span style={chipSubLabelStyle}>· listening for context</span>
      </div>
    </section>
  );
}
