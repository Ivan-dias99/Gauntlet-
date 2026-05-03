// Fase 1.5 — Studio status bar with 5 honest columns.
//
//   * STATUS      — derived from useBackendStatus.readiness
//   * CONNECTION  — derived from useBackendStatus.reachable + readiness
//   * MODE        — useBackendStatus.mode (mock | real)
//   * TIME        — formatted Date.now() (locale HH:MM)
//   * VERSION     — package.json#version, injected via vite define
//
// System Load and Memory Usage (from the mockup) stay absent: there is
// no honest source. Time is a fact of the local clock — not invented,
// not a backend signal either. Treated as a real, honest column.

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useBackendStatus } from "../../hooks/useBackendStatus";

// Injected by vite.config.ts `define` from package.json#version (see
// src/vite-env.d.ts for the ambient declaration).
const APP_VERSION =
  typeof __APP_VERSION__ === "string" && __APP_VERSION__.length > 0
    ? __APP_VERSION__
    : "dev";

const barStyle: CSSProperties = {
  borderTop: "1px solid var(--border-color-soft)",
  background: "color-mix(in oklab, var(--bg-surface) 90%, transparent)",
  backdropFilter: "blur(6px)",
  padding: "10px 24px",
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
  gap: 16,
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-meta, 0.12em)",
  textTransform: "uppercase",
  color: "var(--text-muted)",
};

const cellStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
  minWidth: 0,
};

const labelStyle: CSSProperties = {
  color: "var(--text-muted)",
  fontSize: "var(--t-micro, 9px)",
  letterSpacing: "var(--track-kicker, 0.26em)",
};

const valueStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12,
  color: "var(--text-primary)",
  textTransform: "none",
  letterSpacing: "var(--track-normal, 0)",
  fontFamily: "var(--sans)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

type Tone = "ok" | "warn" | "danger" | "muted";

const TONE_DOT: Record<Tone, string> = {
  ok: "color-mix(in oklab, var(--accent) 70%, #6aa882)",
  warn: "var(--terminal-warn, #d8b058)",
  danger: "var(--cc-err, #d4785a)",
  muted: "var(--text-muted)",
};

function Dot({ tone }: { tone: Tone }) {
  return (
    <span
      aria-hidden
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: TONE_DOT[tone],
        boxShadow: tone === "ok" || tone === "warn" || tone === "danger"
          ? `0 0 6px ${TONE_DOT[tone]}`
          : "none",
        flexShrink: 0,
      }}
    />
  );
}

// Live clock — re-renders every 30s, plenty for HH:MM precision and
// gentle on React reconciliation. Locale-aware via toLocaleTimeString.
function useLocalClock(): string {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function StatusBar() {
  const status = useBackendStatus();
  const time = useLocalClock();

  // STATUS — single-pass mapping from readiness state.
  let statusText = "checking";
  let statusTone: Tone = "muted";
  if (!status.reachable) {
    statusText = "offline";
    statusTone = "danger";
  } else if (status.readiness === "ready") {
    statusText = "idle / dormant";
    statusTone = "ok";
  } else if (status.readiness === "degraded") {
    statusText = "degraded";
    statusTone = "warn";
  }

  // CONNECTION — surfaces the actionable cause when unreachable.
  let connText = "checking";
  let connTone: Tone = "muted";
  if (!status.reachable) {
    connText = status.unreachableReason ?? "unreachable";
    connTone = "danger";
  } else if (status.readiness === "ready") {
    connText = "secure";
    connTone = "ok";
  } else {
    connText = "degraded";
    connTone = "warn";
  }

  // MODE — mock vs real, only meaningful when reachable.
  const modeText = status.reachable && status.mode ? status.mode : "—";
  const modeTone: Tone =
    !status.reachable || !status.mode
      ? "muted"
      : status.mode === "real"
        ? "ok"
        : "warn";

  return (
    <footer style={barStyle} role="status" aria-label="Studio status">
      <div style={cellStyle}>
        <span style={labelStyle}>Status</span>
        <span style={valueStyle}>
          <Dot tone={statusTone} />
          {statusText}
        </span>
      </div>
      <div style={cellStyle}>
        <span style={labelStyle}>Connection</span>
        <span style={valueStyle}>
          <Dot tone={connTone} />
          {connText}
        </span>
      </div>
      <div style={cellStyle}>
        <span style={labelStyle}>Mode</span>
        <span style={valueStyle}>
          <Dot tone={modeTone} />
          {modeText}
        </span>
      </div>
      <div style={cellStyle}>
        <span style={labelStyle}>Time</span>
        <span style={valueStyle}>{time}</span>
      </div>
      <div style={cellStyle}>
        <span style={labelStyle}>Version</span>
        <span style={valueStyle}>{APP_VERSION}</span>
      </div>
    </footer>
  );
}
