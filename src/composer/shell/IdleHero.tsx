// Fase 1 — Idle Hero.
//
// Visual centrepiece of the studio's Home surface. The orb communicates
// dormancy: Composer is awake but not acting. The subtitle is doctrine —
// the studio waits for context, the studio respects permissions.
//
// No data dependencies — pure presentation. Every honest data tile lives
// elsewhere (RecentCommands, LastUsedTools, ReadinessStatus).

import type { CSSProperties } from "react";

const wrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: 24,
  padding: "48px 24px 32px",
};

const orbStyle: CSSProperties = {
  width: 120,
  height: 120,
  borderRadius: "50%",
  background: "radial-gradient(circle at 50% 45%, color-mix(in oklab, var(--accent, #4a7cff) 70%, transparent) 0%, color-mix(in oklab, var(--accent, #4a7cff) 25%, transparent) 35%, transparent 70%)",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const orbCoreStyle: CSSProperties = {
  width: 14,
  height: 14,
  borderRadius: "50%",
  background: "var(--accent, #4a7cff)",
  boxShadow: "0 0 24px var(--accent, #4a7cff)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--serif)",
  fontWeight: 400,
  fontSize: "var(--t-section, 32px)",
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

export default function IdleHero() {
  return (
    <section style={wrapStyle} data-studio-idle-hero>
      <div style={orbStyle} aria-hidden>
        <span style={orbCoreStyle} />
      </div>
      <h1 style={titleStyle}>Idle / Dormant Mode</h1>
      <p style={subtitleStyle}>
        Composer is waiting quietly in the background, listening for context and
        ready when you are. The cursor capsule is the primary surface; the studio
        is here to inspect, configure, and operate Composer when no host app
        carries you.
      </p>
    </section>
  );
}
