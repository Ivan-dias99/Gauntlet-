// Fase 1 — Readiness Status tile.
//
// Hard rule from the doctrine: only rows backed by a real endpoint appear.
// Memory Layer / Tool Registry rows from the mockup are NOT shown — there
// is no endpoint that confirms their state honestly.
//
// Real rows (this fase):
//   * System         — useBackendStatus.reachable + readiness
//   * Engine         — useBackendStatus.engine ("ready" | "not_initialized")
//   * Mode           — useBackendStatus.mode ("mock" | "real")
//   * Persistence    — useBackendStatus.persistenceDegraded / Ephemeral
//
// All four are derived from /health + /health/ready, which the existing
// useBackendStatus hook already polls. Zero new endpoints, zero invention.

import type { CSSProperties } from "react";
import { useBackendStatus } from "../../hooks/useBackendStatus";
import type { BackendStatus } from "../../hooks/useBackendStatus";
import Pill from "../../components/atoms/Pill";
import type { PillTone } from "../../components/atoms/Pill";

const cardStyle: CSSProperties = {
  background: "var(--bg-surface)",
  border: "var(--border-soft)",
  borderRadius: "var(--radius-md, 8px)",
  padding: "14px 16px",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  minHeight: 200,
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 8,
  margin: 0,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-meta, 0.12em)",
  textTransform: "uppercase",
  color: "var(--text-muted)",
};

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 12,
  padding: "6px 0",
  borderTop: "var(--border-soft)",
  fontSize: 13,
};

const labelStyle: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 12,
  color: "var(--text-secondary)",
};

interface Row {
  label: string;
  state: { tone: PillTone; text: string };
}

function deriveRows(status: BackendStatus): Row[] {
  const rows: Row[] = [];

  // System — derived from reachable + readiness probe.
  if (!status.reachable) {
    rows.push({
      label: "system",
      state: { tone: "danger", text: status.unreachableReason ?? "unreachable" },
    });
  } else if (status.readiness === "ready") {
    rows.push({ label: "system", state: { tone: "ok", text: "ready" } });
  } else {
    rows.push({ label: "system", state: { tone: "warn", text: "degraded" } });
  }

  // Engine — only when reachable (otherwise the value is null).
  if (status.reachable) {
    if (status.engine === "ready") {
      rows.push({ label: "engine", state: { tone: "ok", text: "ready" } });
    } else if (status.engine === "not_initialized") {
      rows.push({ label: "engine", state: { tone: "warn", text: "not initialised" } });
    }
  }

  // Mode — mock vs real.
  if (status.reachable && status.mode) {
    rows.push({
      label: "mode",
      state: { tone: status.mode === "mock" ? "warn" : "ok", text: status.mode },
    });
  }

  // Persistence — surface degraded / ephemeral honestly when reachable.
  if (status.reachable) {
    if (status.persistenceDegraded) {
      rows.push({ label: "persistence", state: { tone: "warn", text: "degraded" } });
    } else if (status.persistenceEphemeral) {
      rows.push({ label: "persistence", state: { tone: "warn", text: "ephemeral" } });
    } else {
      rows.push({ label: "persistence", state: { tone: "ok", text: "durable" } });
    }
  }

  return rows;
}

export default function ReadinessStatus() {
  const status = useBackendStatus();
  const rows = deriveRows(status);

  return (
    <section style={cardStyle} data-studio-tile="readiness-status">
      <header style={headerStyle}>
        <h3 style={titleStyle}>Readiness status</h3>
        <Pill tone="ghost">/health</Pill>
      </header>
      {rows.length === 0 ? (
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", fontStyle: "italic" }}>
          loading…
        </p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {rows.map((r) => (
            <li key={r.label} style={rowStyle}>
              <span style={labelStyle}>{r.label}</span>
              <Pill tone={r.state.tone}>{r.state.text}</Pill>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
