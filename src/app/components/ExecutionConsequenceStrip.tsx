/**
 * RUBERRA — Unified execution identity + consequence (chat / terminal / profile)
 * Same language everywhere; no badge spam.
 */

import { useState } from "react";
import { motion } from "motion/react";
import { type MessageExecutionTrace } from "./shell-types";

const STATE_LABEL: Record<MessageExecutionTrace["executionState"], string> = {
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

const IS_LIVE_STATE = new Set(["streaming", "live"]);

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
  missionName,
  artifactDiff,
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
  /** Mission binding — renders mission context line at top of strip */
  missionName?:       string;
  artifactDiff?: {
    summary: string;
    beforeSnippet?: string;
    afterSnippet?: string;
  };
}) {
  const [diffOpen, setDiffOpen] = useState(false);
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
      {/* Mission binding line */}
      {missionName && (
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "7px",
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: "var(--r-dim)",
            marginBottom: "6px",
          }}
        >
          <span style={{ color: "var(--r-border)" }}>mission · </span>
          <span style={{ color: "var(--r-subtext)", letterSpacing: "0.04em", textTransform: "none" }}>{missionName}</span>
        </div>
      )}
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
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
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
          {IS_LIVE_STATE.has(trace.executionState) && (
            <motion.span
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: stateColor(trace.executionState),
                display: "inline-block",
                flexShrink: 0,
              }}
            />
          )}
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

      {artifactDiff && (
        <div style={{ marginTop: "7px", borderTop: "1px solid var(--r-border-soft)", paddingTop: "6px" }}>
          <button
            onClick={() => setDiffOpen((v) => !v)}
            style={{
              border: "1px solid var(--r-border)",
              background: "var(--r-surface)",
              color: "var(--r-subtext)",
              borderRadius: "4px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "7.5px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "2px 6px",
              cursor: "pointer",
            }}
          >
            artifact diff {diffOpen ? "−" : "+"}
          </button>
          <p style={{ margin: "5px 0 0", fontSize: "9px", color: "var(--r-subtext)" }}>{artifactDiff.summary}</p>
          {diffOpen && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginTop: "5px" }}>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: "8px", color: "var(--r-dim)", border: "1px solid var(--r-border-soft)", borderRadius: "5px", padding: "5px" }}>
                {artifactDiff.beforeSnippet ?? "before unavailable"}
              </pre>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: "8px", color: "var(--r-subtext)", border: "1px solid var(--r-border-soft)", borderRadius: "5px", padding: "5px" }}>
                {artifactDiff.afterSnippet ?? "after unavailable"}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
