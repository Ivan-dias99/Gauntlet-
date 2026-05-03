// Fase 1 — Studio status bar.
//
// Minimal by doctrine: only signals backed by a real source appear.
//   * Connection — useBackendStatus.reachable / readiness / unreachableReason
//   * Version    — package.json#version, injected at build time via Vite
//
// System Load, Memory Usage, Time, Model Router (the rest of the mockup's
// status bar) are intentionally absent. They had no honest source in V0.

import type { CSSProperties } from "react";
import { useBackendStatus } from "../../hooks/useBackendStatus";
import Pill from "../../components/atoms/Pill";

// Injected by vite.config.ts `define` from package.json#version (see
// src/vite-env.d.ts for the ambient declaration). Falls back to "dev"
// only when the constant is absent — better an honest label than a
// fake number.
const APP_VERSION =
  typeof __APP_VERSION__ === "string" && __APP_VERSION__.length > 0
    ? __APP_VERSION__
    : "dev";

const barStyle: CSSProperties = {
  borderTop: "var(--border-soft)",
  background: "var(--bg-surface)",
  padding: "10px 24px",
  display: "flex",
  alignItems: "center",
  gap: 16,
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-meta, 0.12em)",
  textTransform: "uppercase",
  color: "var(--text-muted)",
};

const groupStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

export default function StatusBar() {
  const status = useBackendStatus();

  let connectionLabel = "checking";
  let connectionTone: "ok" | "warn" | "danger" = "warn";
  if (!status.reachable) {
    connectionLabel = status.unreachableReason ?? "unreachable";
    connectionTone = "danger";
  } else if (status.readiness === "ready") {
    connectionLabel = "secure";
    connectionTone = "ok";
  } else if (status.readiness === "degraded") {
    connectionLabel = "degraded";
    connectionTone = "warn";
  }

  return (
    <footer style={barStyle} role="status" aria-label="Studio status">
      <span style={groupStyle}>
        <span>connection</span>
        <Pill tone={connectionTone}>{connectionLabel}</Pill>
      </span>
      <span style={groupStyle}>
        <span>version</span>
        <span style={{ color: "var(--text-secondary)" }}>{APP_VERSION}</span>
      </span>
    </footer>
  );
}
