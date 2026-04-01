/**
 * RUBERRA — Visible runtime consequence (no dashboard clutter)
 */

import { type MessageExecutionTrace } from "./shell-types";

const STATE_LABEL: Record<MessageExecutionTrace["executionState"], string> = {
  streaming: "streaming",
  live:      "live",
  completed: "settled",
  degraded:  "degraded",
  aborted:   "aborted",
  error:     "error",
};

function stateColor(state: MessageExecutionTrace["executionState"]): string {
  if (state === "error") return "var(--r-err)";
  if (state === "degraded") return "var(--r-warn)";
  if (state === "aborted") return "var(--r-dim)";
  if (state === "streaming" || state === "live") return "var(--r-accent)";
  return "var(--r-ok)";
}

export function ExecutionConsequenceStrip({
  trace,
  accent,
  compact,
}: {
  trace:   MessageExecutionTrace;
  accent:  string;
  compact?: boolean;
}) {
  const chain = trace.supportChain?.filter(Boolean) ?? [];
  const connectors = trace.connectorActions ?? [];
  const results = trace.executionResults ?? [];
  const tail = results.slice(-2);

  return (
    <div
      style={{
        marginBottom: compact ? "8px" : "10px",
        padding: "8px 10px",
        borderRadius: "8px",
        border: "1px solid var(--r-border-soft)",
        background: "color-mix(in srgb, var(--r-elevated) 88%, transparent)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px 10px", marginBottom: tail.length || chain.length ? "6px" : 0 }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "7.5px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: stateColor(trace.executionState),
            border: `1px solid color-mix(in srgb, ${stateColor(trace.executionState)} 35%, var(--r-border))`,
            borderRadius: "3px",
            padding: "2px 6px",
          }}
        >
          {STATE_LABEL[trace.executionState]}
        </span>
        {trace.fallbackFromModelId && (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "var(--r-warn)", letterSpacing: "0.04em" }}>
            routed from {trace.fallbackFromModelId}
          </span>
        )}
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "var(--r-subtext)", letterSpacing: "0.03em" }}>
          {[trace.providerId, trace.modelId].filter(Boolean).join(" · ")}
          {trace.workflowId ? ` · ${trace.workflowId}` : ""}
        </span>
        {trace.hostingLevel && (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", color: "var(--r-dim)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            host {trace.hostingLevel}
          </span>
        )}
      </div>
      {chain.length > 0 && (
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "var(--r-dim)", letterSpacing: "0.03em", marginBottom: connectors.length ? "4px" : 0 }}>
          mesh <span style={{ color: accent }}>{chain.slice(0, 4).join(" → ")}</span>
          {chain.length > 4 ? " …" : ""}
        </div>
      )}
      {connectors.length > 0 && (
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", color: "var(--r-dim)", letterSpacing: "0.02em", marginBottom: tail.length ? "4px" : 0 }}>
          connectors: {connectors.slice(0, 3).map((c) => c.label).join(" · ")}
          {connectors.length > 3 ? " …" : ""}
        </div>
      )}
      {tail.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {tail.map((r, i) => (
            <div key={`${r.phase}-${r.at}-${i}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "var(--r-subtext)" }}>
              <span style={{ color: accent, textTransform: "uppercase", letterSpacing: "0.06em", marginRight: "6px" }}>{r.phase}</span>
              {r.summary}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
