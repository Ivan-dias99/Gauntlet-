import { motion } from "motion/react";
import { CHAMBER_ACCENT } from "../dna/chamber-accent";
import { type ExecutionState } from "./shell-types";

export interface GlobalExecutionSnapshot {
  state: ExecutionState;
  modelId?: string;
  chamber: "lab" | "school" | "creation";
  providerId?: string;
  latencyMs?: number;
}

const STATE_LABEL: Record<ExecutionState, string> = {
  streaming: "streaming",
  live: "live",
  completed: "completed",
  degraded: "degraded",
  aborted: "aborted",
  error: "error",
  blocked: "blocked",
  scaffold_only: "scaffold",
  provider_unavailable: "provider unavailable",
};

  /** EI / agent display name */
  eiName?: string;
}

const STATE_LABEL: Record<ExecutionState, string> = {
  streaming:            "STREAMING",
  live:                 "LIVE",
  completed:            "SETTLED",
  degraded:             "DEGRADED",
  aborted:              "ABORTED",
  error:                "ERROR",
  blocked:              "BLOCKED",
  scaffold_only:        "SCAFFOLD",
  provider_unavailable: "PROVIDER OFF",
};

const IS_LIVE = new Set<ExecutionState>(["streaming", "live"]);

const stateColor = (state: ExecutionState) => {
  if (state === "completed") return "var(--r-ok)";
  if (state === "error" || state === "blocked" || state === "provider_unavailable") return "var(--r-err)";
  if (state === "degraded" || state === "scaffold_only") return "var(--r-warn)";
  if (state === "aborted") return "var(--r-dim)";
  return "var(--r-accent)";
};

export function GlobalExecutionBand({
  snapshot,
  missionName,
  providerHealth,
}: {
  snapshot: GlobalExecutionSnapshot | null;
  missionName?: string;
  providerHealth?: "healthy" | "degraded" | "unavailable" | "unknown";
}) {
  if (!snapshot) return null;
  const accent = CHAMBER_ACCENT[snapshot.chamber];
  const isLive = IS_LIVE.has(snapshot.state);
  const healthColor =
    providerHealth === "healthy"
      ? "var(--r-ok)"
      : providerHealth === "degraded"
      ? "var(--r-warn)"
      : providerHealth === "unavailable"
      ? "var(--r-err)"
      : "var(--r-dim)";

  return (
    <div
      style={{
        height: "28px",
        borderTop: "1px solid var(--r-border)",
        background: "var(--r-surface)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "0 12px",
        flexShrink: 0,
      }}
    >
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: stateColor(snapshot.state), letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {STATE_LABEL[snapshot.state]}
      </span>
      <span style={{ width: "1px", height: "10px", background: "var(--r-border)" }} />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "var(--r-subtext)", letterSpacing: "0.05em" }}>
        {snapshot.modelId ?? "—"}
      </span>
      {snapshot.latencyMs != null && (
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "var(--r-dim)", letterSpacing: "0.05em" }}>
          {snapshot.latencyMs}ms
        </span>
      )}
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: accent, letterSpacing: "0.07em", textTransform: "uppercase" }}>
        {snapshot.chamber}
      </span>
      {missionName && (
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "var(--r-subtext)", letterSpacing: "0.04em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "280px" }}>
          mission · {missionName}
        </span>
      )}
      <div style={{ flex: 1 }} />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "var(--r-dim)", letterSpacing: "0.05em" }}>
        {snapshot.providerId ?? "provider · —"}
      </span>
      {/* State — with live pulse when active */}
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: stateColor(snapshot.state), letterSpacing: "0.09em", textTransform: "uppercase" }}>
        {isLive && (
          <motion.span
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: "4px", height: "4px", borderRadius: "50%", background: stateColor(snapshot.state), display: "inline-block" }}
          />
        )}
        {STATE_LABEL[snapshot.state]}
      </span>
      <span style={{ width: "1px", height: "10px", background: "var(--r-border)" }} />

      {/* Chamber anchor */}
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: accent, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
        {snapshot.chamber}
      </span>

      {/* EI name — if known */}
      {snapshot.eiName && (
        <>
          <span style={{ color: "var(--r-border)", fontSize: "9px" }}>·</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "var(--r-subtext)", letterSpacing: "0.03em" }}>
            {snapshot.eiName}
          </span>
        </>
      )}

      {/* Model / provider */}
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "var(--r-dim)", letterSpacing: "0.04em" }}>
        {snapshot.modelId ?? "—"}{snapshot.providerId ? ` · ${snapshot.providerId}` : ""}
      </span>

      {snapshot.latencyMs != null && (
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "var(--r-dim)", letterSpacing: "0.04em" }}>
          {snapshot.latencyMs}ms
        </span>
      )}

      {/* Mission */}
      {missionName && (
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "var(--r-subtext)", letterSpacing: "0.03em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "260px" }}>
          {missionName}
        </span>
      )}
      <div style={{ flex: 1 }} />
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: healthColor }} />
    </div>
  );
}
