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
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: healthColor }} />
    </div>
  );
}
