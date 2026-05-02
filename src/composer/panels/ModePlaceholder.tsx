// Wave 1 — central placeholder shown when the operator selects a mode
// that has no live wiring yet (Code, Design, Analysis, Memory, Apply,
// Route, Idle, Context placeholder rendering).
//
// Honest about state: the card declares the mode is "Wave 2+" and lists
// the concrete moving parts that need to land before it becomes real.
// This keeps the surface fiel à Foto 3 without claiming functionality
// the codebase does not have.

import type { ComposerMode } from "../types";
import Pill from "../../components/atoms/Pill";

const WAVE_2_REQUIREMENTS: Record<ComposerMode, string[]> = {
  idle: [
    "ambient context capture (selection, app, url)",
    "permission prompt before any auto-action",
    "configurable summon shortcut (per-OS)",
  ],
  context: [
    "live context inspector (what was captured + confidence)",
    "permission scope viewer per source",
    "manual override / re-capture",
  ],
  compose: [],
  code: [
    "diff renderer with syntax highlighting",
    "patch apply against working tree (server-side)",
    "test-pass gate before apply succeeds",
  ],
  design: [
    "canvas rendering (frames, components, tokens)",
    "design generator endpoint (/composer/design)",
    "Figma client cutover (already scaffolded in signal-backend/figma_client.py)",
  ],
  analysis: [
    "report renderer (charts, tables, narrative blocks)",
    "data ingestion (csv, sql result, json blob)",
    "exec summary generator with extended-thinking",
  ],
  memory: [
    "tag system + provenance fields",
    "semantic search across runs",
    "save flow with redaction preview",
  ],
  apply: [
    "files-impacted preview before commit",
    "ledger event with run_id linkage",
    "dry-run vs real-run toggle",
  ],
  route: [
    "tools registry visualisation (read from registry.ts)",
    "model gateway routing reasons",
    "per-tool latency + cost summary",
  ],
};

const HUMAN_LABEL: Record<ComposerMode, string> = {
  idle: "Idle",
  context: "Context",
  compose: "Compose",
  code: "Code",
  design: "Design",
  analysis: "Analysis",
  memory: "Memory",
  apply: "Apply",
  route: "Route",
};

export default function ModePlaceholder({ mode }: { mode: ComposerMode }) {
  const reqs = WAVE_2_REQUIREMENTS[mode];

  return (
    <section
      style={{
        background: "var(--bg-surface)",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-lg, 10px)",
        padding: "28px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        minHeight: 360,
      }}
      data-mode-placeholder={mode}
    >
      <header style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--serif)",
            fontWeight: 400,
            fontSize: 22,
            color: "var(--text-primary)",
          }}
        >
          {HUMAN_LABEL[mode]} Mode
        </h2>
        <Pill tone="ghost">Wave 2+</Pill>
      </header>

      <p style={{ margin: 0, color: "var(--text-secondary, var(--text-muted))", fontSize: 14, lineHeight: 1.6, maxWidth: 540 }}>
        This mode is part of the canonical surface but is not wired in Wave 1.
        Compose is the only live mode today — switch back to it from the panel
        on the side.
      </p>

      {reqs.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <p
            style={{
              margin: "0 0 6px",
              fontFamily: "var(--mono)",
              fontSize: "var(--t-meta)",
              letterSpacing: "var(--track-meta)",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            What needs to ship for {HUMAN_LABEL[mode].toLowerCase()} to go live
          </p>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "var(--text-primary)", lineHeight: 1.7 }}>
            {reqs.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
