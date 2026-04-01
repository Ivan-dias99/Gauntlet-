import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type SystemHealthModel, type HealthSignal } from "./awareness-substrate";

interface ProfileLedgerProps {
  isOpen: boolean;
  onClose: () => void;
  onManageMatrix?: () => void;
  /** Stack 08 — live model from runtime fabric (optional until hydrated) */
  systemHealth?: SystemHealthModel | null;
  workspaceOwner?: string;
  workspaceSubtitle?: string;
}

function aggregateColor(signal: HealthSignal): string {
  if (signal === "critical") return "var(--r-err)";
  if (signal === "degraded") return "var(--r-warn)";
  if (signal === "nominal") return "var(--r-ok)";
  return "var(--r-dim)";
}

export function ProfileLedger({
  isOpen, onClose, onManageMatrix,
  systemHealth,
  workspaceOwner = "Sovereign operator",
  workspaceSubtitle = "ruberra · profile ledger",
}: ProfileLedgerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            top: "100%",
            right: "0",
            marginTop: "6px",
            width: "320px",
            background: "var(--r-surface)",
            border: "1px solid var(--r-border)",
            borderRadius: "12px",
            boxShadow: "0 16px 48px color-mix(in srgb, var(--r-text) 12%, transparent), 0 0 0 1px color-mix(in srgb, var(--r-text) 6%, transparent)",
            zIndex: 100,
            overflow: "hidden",
            fontFamily: "'Inter', system-ui, sans-serif",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div style={{ padding: "16px", borderBottom: "1px solid var(--r-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "10px",
                  background: "linear-gradient(145deg, var(--r-border) 0%, var(--r-muted) 100%)",
                  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.08), 0 2px 4px rgba(0,0,0,0.08)",
                  flexShrink: 0,
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--r-text)", letterSpacing: "-0.01em" }}>
                  {workspaceOwner}
                </span>
                <span style={{ fontSize: "11px", color: "var(--r-dim)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.02em" }}>
                  {workspaceSubtitle}
                </span>
              </div>
            </div>

            {/* Tokens */}
            <div style={{ marginTop: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "10px", color: "var(--r-subtext)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
                  Network Allocation
                </span>
                <span style={{ fontSize: "10px", color: "var(--r-accent)", fontFamily: "'JetBrains Mono', monospace" }}>
                  82% used
                </span>
              </div>
              <div style={{ height: "4px", background: "var(--r-rail)", borderRadius: "2px", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "82%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ height: "100%", background: "var(--r-accent)", borderRadius: "2px" }}
                />
              </div>
            </div>
          </div>

          {/* Stack 08 — system awareness (consequence, not a dashboard) */}
          {systemHealth && (
            <div style={{ padding: "12px 16px", borderTop: "1px solid var(--r-border-soft)", borderBottom: "1px solid var(--r-border-soft)", background: "color-mix(in srgb, var(--r-elevated) 55%, transparent)" }}>
              <span style={{ display: "block", fontSize: "10px", color: "var(--r-dim)", textTransform: "uppercase", letterSpacing: "0.09em", fontWeight: 600, marginBottom: "8px" }}>
                System awareness
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: aggregateColor(systemHealth.aggregate), flexShrink: 0 }} />
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--r-text)", letterSpacing: "-0.01em", textTransform: "capitalize" }}>
                  {systemHealth.aggregate}
                </span>
                <span style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-subtext)", marginLeft: "auto" }}>
                  {Math.round(Math.min(1, Math.max(0, systemHealth.aggregateScore)) * 100)}% composite
                </span>
              </div>
              <p style={{ margin: "0 0 8px", fontSize: "10px", color: "var(--r-dim)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.03em" }}>
                snapshot {new Date(systemHealth.snapshotAt).toLocaleString(undefined, { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" })}
              </p>
              {systemHealth.dimensions.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: systemHealth.openAnomalies.length ? "8px" : 0 }}>
                  {systemHealth.dimensions.slice(0, 4).map((d) => (
                    <div key={d.dimension} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <span style={{ fontSize: "10px", color: "var(--r-subtext)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>{d.dimension}</span>
                      <span style={{ fontSize: "10px", color: aggregateColor(d.signal), fontFamily: "'JetBrains Mono', monospace", textTransform: "capitalize" }}>{d.signal}</span>
                    </div>
                  ))}
                </div>
              )}
              {systemHealth.openAnomalies.length > 0 && (
                <div style={{ paddingTop: "6px", borderTop: "1px solid var(--r-border-soft)" }}>
                  <span style={{ fontSize: "9px", color: "var(--r-warn)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>
                    {systemHealth.openAnomalies.length} open {systemHealth.openAnomalies.length !== 1 ? "anomalies" : "anomaly"}
                  </span>
                  <p style={{ margin: "4px 0 0", fontSize: "10px", color: "var(--r-subtext)", lineHeight: 1.4 }}>
                    {systemHealth.openAnomalies[0]?.description.slice(0, 120)}
                    {(systemHealth.openAnomalies[0]?.description.length ?? 0) > 120 ? "…" : ""}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Connectors */}
          <div style={{ padding: "12px" }}>
            <span style={{ display: "block", fontSize: "10px", color: "var(--r-dim)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, padding: "4px 8px 8px" }}>
              Active Connectors
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <ConnectorItem name="GitHub" status="connected" detail="ivan-star-dev" />
              <ConnectorItem name="Supabase" status="connected" detail="eu-west-1" />
              <ConnectorItem name="Vercel" status="disconnected" detail="Unlinked" />
            </div>
          </div>

          {/* Governance Trail */}
          <div style={{ padding: "12px", borderTop: "1px solid var(--r-border)" }}>
            <span style={{ display: "block", fontSize: "10px", color: "var(--r-dim)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, padding: "4px 8px 8px" }}>
              Governance Trail
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <GovernanceTrailItem action="connector.write" verdict="deferred" ts="just now" />
              <GovernanceTrailItem action="pioneer.spawn" verdict="allowed" ts="2m ago" />
              <GovernanceTrailItem action="mission.create" verdict="allowed" ts="5m ago" />
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ padding: "10px", borderTop: "1px solid var(--r-border)", background: "var(--r-rail)", display: "flex", gap: "4px" }}>
            <button
              style={actionButtonStyle}
              onClick={() => { onManageMatrix?.(); onClose(); }}
            >
              Manage Matrix
            </button>
            <button
              style={{ ...actionButtonStyle, background: "color-mix(in srgb, var(--r-err) 10%, transparent)", color: "var(--r-err)" }}
              onClick={onClose}
            >
              Disconnect
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ConnectorItem({ name, status, detail }: { name: string; status: "connected" | "disconnected", detail: string }) {
  const isConnected = status === "connected";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px",
        borderRadius: "6px",
        background: "transparent",
        transition: "background 0.1s ease",
        cursor: "default"
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "var(--r-rail)" }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: isConnected ? "var(--r-ok)" : "var(--r-border)", opacity: isConnected ? 1 : 0.5 }} />
        <span style={{ fontSize: "12px", color: isConnected ? "var(--r-text)" : "var(--r-subtext)", fontWeight: 500 }}>
          {name}
        </span>
      </div>
      <span style={{ fontSize: "10px", color: "var(--r-dim)", fontFamily: "'JetBrains Mono', monospace" }}>
        {detail}
      </span>
    </div>
  );
}

function GovernanceTrailItem({ action, verdict, ts }: { action: string; verdict: "allowed" | "blocked" | "deferred"; ts: string }) {
  const verdictColor = verdict === "allowed" ? "var(--r-ok)" : verdict === "blocked" ? "var(--r-err)" : "var(--r-warn)";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 8px",
        borderRadius: "5px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: verdictColor, flexShrink: 0 }} />
        <span style={{ fontSize: "11px", color: "var(--r-subtext)", fontFamily: "'JetBrains Mono', monospace" }}>
          {action}
        </span>
      </div>
      <span style={{ fontSize: "10px", color: "var(--r-dim)" }}>{ts}</span>
    </div>
  );
}

const actionButtonStyle = {
  flex: 1,
  padding: "8px",
  background: "var(--r-surface)",
  border: "1px solid var(--r-border-soft)",
  borderRadius: "6px",
  fontSize: "11px",
  fontWeight: 500,
  color: "var(--r-text)",
  cursor: "pointer",
  outline: "none",
  transition: "all 0.1s ease",
  textAlign: "center" as const,
};
