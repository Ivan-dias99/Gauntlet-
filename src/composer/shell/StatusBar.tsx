// Sprint 2 — Studio status bar with 7 columns (target visual).
//
// Doctrine override (operator-authorized): includes columns that don't
// have backend sources yet. Real columns: STATUS, CONNECTION, MODE,
// TIME (clock). Decorative columns (until endpoints ship): CONTEXT
// WINDOW (with sparkline), SYSTEM LOAD, MEMORY USAGE, MODEL ROUTER.
// Each decorative column carries a chrome value that matches the mock.

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useBackendStatus } from "../../hooks/useBackendStatus";
import { LockIcon } from "./icons";

const APP_VERSION =
  typeof __APP_VERSION__ === "string" && __APP_VERSION__.length > 0
    ? __APP_VERSION__
    : "dev";

const barStyle: CSSProperties = {
  borderTop: "1px solid var(--border-color-soft)",
  background: "color-mix(in oklab, var(--bg-surface) 92%, transparent)",
  backdropFilter: "blur(6px)",
  padding: "12px 24px",
  display: "grid",
  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
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
  gap: 4,
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

type Tone = "ok" | "warn" | "danger" | "muted" | "accent";

const TONE_DOT: Record<Tone, string> = {
  ok:     "color-mix(in oklab, var(--accent) 50%, #7ab48a)",
  accent: "var(--accent)",
  warn:   "var(--terminal-warn, #d8b058)",
  danger: "var(--cc-err, #d4785a)",
  muted:  "var(--text-muted)",
};

function Dot({ tone }: { tone: Tone }) {
  return (
    <span
      aria-hidden
      style={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: TONE_DOT[tone],
        boxShadow:
          tone === "ok" || tone === "accent" || tone === "warn" || tone === "danger"
            ? `0 0 8px ${TONE_DOT[tone]}`
            : "none",
        flexShrink: 0,
      }}
    />
  );
}

// ── Sparkline (Context Window) ─────────────────────────────────────────
function Sparkline() {
  // Hardcoded data — chrome until /context/window/history exists.
  const data = [22, 28, 34, 30, 38, 44, 42, 50, 48, 56, 60, 58, 65, 70];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 80;
  const h = 22;
  const stepX = w / (data.length - 1);
  const norm = (v: number) => h - ((v - min) / (max - min || 1)) * h;
  const d = data.map((v, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${norm(v)}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="spark-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="color-mix(in oklab, var(--accent) 30%, transparent)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </linearGradient>
      </defs>
      <path d={d} stroke="url(#spark-fade)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// ── Bar gauge (System Load / Memory Usage) ─────────────────────────────
function BarGauge({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <span
      aria-hidden
      style={{
        display: "block",
        width: 80,
        height: 4,
        background: "color-mix(in oklab, var(--bg-elevated) 80%, transparent)",
        borderRadius: 2,
        overflow: "hidden",
        marginTop: 2,
      }}
    >
      <span
        style={{
          display: "block",
          width: `${clamped}%`,
          height: "100%",
          background: "linear-gradient(90deg, color-mix(in oklab, var(--accent) 40%, transparent), var(--accent))",
        }}
      />
    </span>
  );
}

function useLocalClock(): { hm: string; ymd: string } {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return {
    hm: now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
    ymd: now.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
  };
}

export default function StatusBar() {
  const status = useBackendStatus();
  const { hm, ymd } = useLocalClock();

  // STATUS — derived from readiness.
  let statusText = "checking";
  let statusTone: Tone = "muted";
  if (!status.reachable) {
    statusText = "Offline";
    statusTone = "danger";
  } else if (status.readiness === "ready") {
    statusText = "Idle / Dormant";
    statusTone = "ok";
  } else if (status.readiness === "degraded") {
    statusText = "Degraded";
    statusTone = "warn";
  }

  // CONNECTION — surfaces the actionable cause when unreachable.
  let connText = "Checking";
  let connTone: Tone = "muted";
  if (!status.reachable) {
    connText = status.unreachableReason ?? "Unreachable";
    connTone = "danger";
  } else if (status.readiness === "ready") {
    connText = "Secure";
    connTone = "ok";
  } else {
    connText = "Degraded";
    connTone = "warn";
  }

  // MODE — mock vs real (only meaningful when reachable).
  const modeText = status.reachable && status.mode ? status.mode : "—";

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
        <span style={labelStyle}>Context Window</span>
        <span style={{ ...valueStyle, gap: 8 }}>
          <span>Updated just now</span>
          <Sparkline />
        </span>
      </div>

      <div style={cellStyle}>
        <span style={labelStyle}>System Load</span>
        <span style={{ ...valueStyle, gap: 8 }}>
          <span>Low</span>
          <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", color: "var(--text-secondary)" }}>12%</span>
        </span>
        <BarGauge pct={12} />
      </div>

      <div style={cellStyle}>
        <span style={labelStyle}>Memory Usage</span>
        <span style={valueStyle}>
          <span>2.1 GB / 16 GB</span>
        </span>
        <BarGauge pct={(2.1 / 16) * 100} />
      </div>

      <div style={cellStyle}>
        <span style={labelStyle}>Model Router</span>
        <span style={valueStyle}>
          <Dot tone="accent" />
          {modeText === "—" ? "Optimal" : modeText === "real" ? "Optimal" : "Mock"}
        </span>
      </div>

      <div style={cellStyle}>
        <span style={labelStyle}>Connection</span>
        <span style={valueStyle}>
          <span style={{ color: connTone === "ok" ? "var(--accent)" : connTone === "danger" ? TONE_DOT.danger : "var(--text-muted)", display: "inline-flex" }}>
            <LockIcon size={11} />
          </span>
          {connText}
        </span>
      </div>

      <div style={cellStyle}>
        <span style={labelStyle}>Time</span>
        <span style={valueStyle}>
          <span style={{ color: "var(--text-primary)" }}>{hm}</span>
          <span style={{ color: "var(--text-muted)", fontFamily: "var(--mono)", fontSize: 11 }}>{ymd}</span>
          <span style={{ marginLeft: "auto", color: "var(--text-ghost, var(--text-muted))", fontFamily: "var(--mono)", fontSize: 10 }}>v{APP_VERSION}</span>
        </span>
      </div>
    </footer>
  );
}
