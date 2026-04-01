/**
 * RUBERRA — Unified execution identity + consequence (chat / terminal / profile)
 * Same language everywhere; no badge spam.
 */

import { type MessageExecutionTrace } from "./shell-types";

const STATE_LABEL: Record<MessageExecutionTrace["executionState"], string> = {
  streaming:            "routing",
  live:                 "live",
  completed:              "settled",
  degraded:               "degraded",
  aborted:                "aborted",
  error:                  "error",
  blocked:                "blocked",
  scaffold_only:          "scaffold",
  provider_unavailable:   "provider off",
};

function stateColor(state: MessageExecutionTrace["executionState"]): string {
  if (state === "error" || state === "blocked") return "var(--r-err)";
  if (state === "degraded" || state === "provider_unavailable") return "var(--r-warn)";
  if (state === "aborted" || state === "scaffold_only") return "var(--r-dim)";
  if (state === "streaming" || state === "live") return "var(--r-accent)";
  return "var(--r-ok)";
}

export function ExecutionConsequenceStrip({
  trace,
  accent,
  compact,
  showResultDepth = 2,
  leadPioneerShort,
  giName,
  routeDigest,
  tierLabel,
  tierColor,
  modelTruthLabel,
}: {
  trace:              MessageExecutionTrace;
  accent:             string;
  compact?:           boolean;
  /** How many executionResults lines to show (terminal uses more) */
  showResultDepth?:   number;
  leadPioneerShort?:  string;
  giName?:            string;
  routeDigest?:       string;
  tierLabel?:         string;
  tierColor?:         string;
  modelTruthLabel?:   string;
}) {
  const chain = trace.supportChain?.filter(Boolean) ?? [];
  const connectors = trace.connectorActions ?? [];
  const results = trace.executionResults ?? [];
  const tail = results.slice(-showResultDepth);
  const digest = trace.routeDigest ?? routeDigest;
  const modelLine = modelTruthLabel && trace.modelId
    ? `${modelTruthLabel} · ${trace.modelId}`
    : modelTruthLabel ?? trace.modelId ?? "—";

  return (
    <div
      style={{
        marginBottom: compact ? "6px" : "10px",
        padding: compact ? "7px 9px" : "10px 12px",
        borderRadius: compact ? "6px" : "9px",
        border: "1px solid var(--r-border-soft)",
        background: "color-mix(in srgb, var(--r-elevated) 92%, transparent)",
      }}
    >
      {/* Identity spine — routed sovereign surface */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "6px 10px",
          marginBottom: "6px",
          paddingBottom: "6px",
          borderBottom: "1px solid var(--r-border-soft)",
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "7.5px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: stateColor(trace.executionState),
            border: `1px solid color-mix(in srgb, ${stateColor(trace.executionState)} 32%, var(--r-border))`,
            borderRadius: "3px",
            padding: "2px 6px",
          }}
        >
          {STATE_LABEL[trace.executionState]}
        </span>
        {tierLabel && (
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "7.5px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: tierColor ?? "var(--r-dim)",
              border: `1px solid color-mix(in srgb, ${tierColor ?? "var(--r-dim)"} 28%, var(--r-border))`,
              borderRadius: "3px",
              padding: "2px 5px",
            }}
          >
            {tierLabel}
          </span>
        )}
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "var(--r-subtext)", letterSpacing: "0.02em" }}>
          {modelLine}
          {trace.providerId ? ` · ${trace.providerId}` : ""}
        </span>
        {trace.hostingLevel && (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", color: "var(--r-dim)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            host {trace.hostingLevel}
          </span>
        )}
        {trace.fallbackFromModelId && (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", color: "var(--r-warn)", letterSpacing: "0.03em" }}>
            fallback from {trace.fallbackFromModelId}
          </span>
        )}
      </div>

      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", color: "var(--r-dim)", letterSpacing: "0.04em", marginBottom: digest ? "5px" : chain.length ? "4px" : 0 }}>
        {leadPioneerShort && (
          <span>
            <span style={{ color: "var(--r-dim)", textTransform: "uppercase", letterSpacing: "0.08em" }}>lead </span>
            <span style={{ color: accent }}>{leadPioneerShort}</span>
          </span>
        )}
        {leadPioneerShort && (giName || trace.workflowId) && <span style={{ margin: "0 6px", color: "var(--r-border)" }}>·</span>}
        {giName && (
          <span>
            <span style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>gi </span>
            <span style={{ color: "var(--r-subtext)" }}>{giName}</span>
          </span>
        )}
        {giName && trace.workflowId && <span style={{ margin: "0 6px", color: "var(--r-border)" }}>·</span>}
        {trace.workflowId && (
          <span>
            <span style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>workflow </span>
            <span style={{ color: "var(--r-subtext)" }}>{trace.workflowId}</span>
          </span>
        )}
      </div>

      {digest && (
        <p style={{ margin: "0 0 6px", fontSize: "10px", lineHeight: 1.45, color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "-0.01em" }}>
          {digest.length > 200 ? `${digest.slice(0, 197)}…` : digest}
        </p>
      )}

      {chain.length > 0 && (
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", color: "var(--r-dim)", letterSpacing: "0.03em", marginBottom: connectors.length ? "4px" : tail.length ? "4px" : 0 }}>
          mesh <span style={{ color: accent }}>{chain.join(" → ")}</span>
        </div>
      )}

      {connectors.length > 0 && (
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", color: "var(--r-dim)", letterSpacing: "0.02em", marginBottom: tail.length ? "5px" : 0 }}>
          fabric {connectors.map((c) => c.label).join(" · ")}
        </div>
      )}

      {tail.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          {tail.map((r, i) => (
            <div key={`${r.phase}-${r.at}-${i}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: compact ? "7.5px" : "8px", color: "var(--r-subtext)" }}>
              <span style={{ color: accent, textTransform: "uppercase", letterSpacing: "0.07em", marginRight: "6px" }}>{r.phase}</span>
              {r.summary}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
