// Sprint 2 — Readiness Status tile (target visual + 5 rows).
//
// Doctrine override (operator-authorized): tile shows the full 5-row
// readiness panel from the mock (System / Model Router / Memory Layer
// / Tool Registry / Permissions). System and (when reachable) Mode
// derive from /health honestly. The other rows are presentation
// chrome — they reflect that the subsystem ships with the brain. They
// do NOT call dedicated endpoints.

import type { CSSProperties, ReactNode } from "react";
import { useBackendStatus } from "../../hooks/useBackendStatus";
import { CheckCircleIcon, LockIcon } from "./icons";

interface Row {
  label: string;
  value: string;
  state: "ready" | "enforced" | "warn" | "danger";
  icon?: ReactNode;
}

const cardStyle: CSSProperties = {
  background: "color-mix(in oklab, var(--bg-surface) 92%, transparent)",
  border: "1px solid var(--border-color-soft)",
  borderRadius: "var(--radius-md, 10px)",
  padding: "16px 18px 12px",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  minHeight: 200,
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  margin: 0,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-kicker, 0.26em)",
  textTransform: "uppercase",
  color: "var(--accent)",
};

const sourceStyle: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 10,
  color: "var(--text-muted)",
  letterSpacing: "var(--track-meta, 0.12em)",
  textTransform: "uppercase",
};

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  padding: "5px 0",
  fontSize: 13,
};

const labelStyle: CSSProperties = {
  color: "var(--text-primary)",
};

const valueStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontFamily: "var(--sans)",
  fontSize: 12,
};

const iconStateColor: Record<Row["state"], string> = {
  ready:    "color-mix(in oklab, var(--accent) 60%, #7ab48a)",
  enforced: "var(--accent)",
  warn:     "var(--terminal-warn, #d8b058)",
  danger:   "var(--cc-err, #d4785a)",
};

const buttonStyle: CSSProperties = {
  marginTop: "auto",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  padding: "8px 12px",
  background: "color-mix(in oklab, var(--bg-elevated) 70%, transparent)",
  border: "1px solid var(--border-color-soft)",
  borderRadius: "var(--radius-sm, 6px)",
  color: "var(--text-secondary)",
  fontFamily: "var(--sans)",
  fontSize: 12,
  cursor: "pointer",
};

export default function ReadinessStatus() {
  const status = useBackendStatus();

  // System row reflects /health honestly. Other rows are static
  // because the subsystems exist as code modules in the brain — the
  // operator-authorized clone shows them as "Ready" to match the
  // mock. They flip to /diagnostics-driven when those endpoints exist.
  const systemReady = status.reachable && status.readiness === "ready";
  const rows: Row[] = [
    {
      label: "System",
      value: systemReady ? "Ready" : status.reachable ? "Degraded" : "Offline",
      state: systemReady ? "ready" : status.reachable ? "warn" : "danger",
    },
    { label: "Model Router", value: "Ready", state: "ready" },
    { label: "Memory Layer", value: "Ready", state: "ready" },
    { label: "Tool Registry", value: "Ready", state: "ready" },
    { label: "Permissions", value: "Enforced", state: "enforced" },
  ];

  return (
    <section style={cardStyle} data-studio-tile="readiness-status">
      <header style={headerStyle}>
        <h3 style={titleStyle}>Readiness Status</h3>
        <span style={sourceStyle}>/health</span>
      </header>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column" }}>
        {rows.map((r) => (
          <li key={r.label} style={rowStyle}>
            <span style={labelStyle}>{r.label}</span>
            <span style={valueStyle}>
              <span style={{ color: iconStateColor[r.state] }}>{r.value}</span>
              <span style={{ color: iconStateColor[r.state], display: "inline-flex" }}>
                {r.state === "enforced" ? <LockIcon size={12} /> : <CheckCircleIcon size={12} />}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <button type="button" style={buttonStyle}>
        View details
      </button>
    </section>
  );
}
