// Wave 1 — bottom pipeline strip. Pure decoration: shows the canonical
// stages a request flows through (Context Capture → … → Execution),
// matching Foto 3's bottom strip. No state hookup yet. Wave 2+ will tint
// the active stage live as a request progresses.

import { PIPELINE_STAGES } from "./types";

export default function PipelineStrip() {
  return (
    <footer
      style={{
        borderTop: "var(--border-soft)",
        background: "var(--bg-surface)",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        overflowX: "auto",
      }}
      data-pipeline-strip
    >
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: "var(--t-meta)",
          letterSpacing: "var(--track-meta)",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          flexShrink: 0,
          marginRight: 8,
        }}
      >
        Pipeline
      </span>
      {PIPELINE_STAGES.map((stage, i) => (
        <div
          key={stage}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--sans)",
              fontSize: 12,
              color: "var(--text-secondary, var(--text-muted))",
              padding: "4px 10px",
              border: "var(--border-soft)",
              borderRadius: "999px",
              background: "var(--bg-elevated, transparent)",
              whiteSpace: "nowrap",
            }}
          >
            {stage}
          </span>
          {i < PIPELINE_STAGES.length - 1 && (
            <span aria-hidden style={{ color: "var(--text-muted)", fontSize: 14, opacity: 0.5 }}>
              →
            </span>
          )}
        </div>
      ))}
    </footer>
  );
}
