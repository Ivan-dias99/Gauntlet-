/**
 * RUBERRA SignalsPanel — Stack 08 · System Awareness
 * Surfaces live signals and critical anomaly sentinels.
 */

import React from "react";
import { type AnomalyRecord } from "./awareness-substrate";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SignalRecord {
  id: string;
  label: string;
  value?: string;
  meta?: string;
}

interface SignalsPanelProps {
  signals?: SignalRecord[];
  anomalies?: AnomalyRecord[];
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SignalsPanel({ signals = [], anomalies }: SignalsPanelProps) {
  const criticalOpen = (anomalies ?? []).filter(
    (a) => a.severity === "critical" && a.state === "open"
  );

  const hasSignals = signals.length > 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        width: "100%",
      }}
    >
      {/* ── Critical Anomaly Sentinels ── */}
      {criticalOpen.map((a) => (
        <div
          key={a.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            background: "color-mix(in srgb, var(--r-err) 8%, transparent)",
            borderLeft: "2px solid var(--r-err)",
            marginBottom: "2px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              color: "var(--r-err)",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
            }}
          >
            CRITICAL
          </span>
          <span
            style={{
              fontSize: "11px",
              color: "var(--r-subtext)",
              flex: 1,
            }}
          >
            {a.description}
          </span>
        </div>
      ))}

      {/* ── Signals List ── */}
      {hasSignals ? (
        signals.map((s) => (
          <div
            key={s.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 12px",
              borderBottom: "1px solid var(--r-border-soft)",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "var(--r-text)",
              }}
            >
              {s.label}
            </span>
            {s.value != null && (
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--r-subtext)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {s.value}
              </span>
            )}
          </div>
        ))
      ) : (
        <div
          style={{
            padding: "12px",
            fontSize: "11px",
            color: "var(--r-muted)",
            textAlign: "center",
          }}
        >
          No signals
        </div>
      )}
    </div>
  );
}

export default SignalsPanel;
