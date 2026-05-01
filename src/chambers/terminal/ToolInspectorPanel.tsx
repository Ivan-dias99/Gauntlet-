// Wave P-42 — tool inspector.
//
// Sits below the OutputCanvas log + EvidencePanel and gives the operator
// an explicit drill-down for every tool call the agent loop made during
// the current run. Rows are accordion-style: header shows status · name ·
// iteration · input head; clicking expands a detail block with full
// input JSON, full preview text, role, and error reasons. Closes again
// on a second click.
//
// State is local — the panel is purely presentational. The parent owns
// the LiveTool[] array and resets it on every submit, so the inspector
// always reflects the current run.

import { useState } from "react";
import type { LiveTool, ToolPhase } from "./helpers";

interface Props {
  tools: LiveTool[];
}

const PHASE_TONE: Record<ToolPhase, "info" | "ok" | "danger"> = {
  running: "info",
  ok: "ok",
  err: "danger",
};

const PHASE_GLYPH: Record<ToolPhase, string> = {
  running: "◐",
  ok: "●",
  err: "✕",
};

export default function ToolInspectorPanel({ tools }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  if (tools.length === 0) return null;

  return (
    <section
      data-tool-inspector
      style={{
        margin: "var(--space-2) auto 0",
        maxWidth: 820,
        padding: "var(--space-2) var(--space-3)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-color-soft, var(--border-soft))",
        background: "var(--bg-surface, transparent)",
        opacity: 0.96,
      }}
      aria-label="tool inspector"
    >
      <header
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "var(--space-2)",
          fontFamily: "var(--mono)",
          fontSize: "var(--t-micro)",
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: "var(--text-muted, currentColor)",
          opacity: 0.85,
          marginBottom: "var(--space-2)",
        }}
      >
        <span>tool inspector</span>
        <span style={{ marginLeft: "auto" }}>
          {tools.length} call{tools.length === 1 ? "" : "s"}
        </span>
      </header>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {tools.map((t, index) => {
          // Codex review #286 (P2): the Terminal reducer permits out-of-
          // order frames (orphan tool_result first, tool_use later), so
          // two entries can share the same `t.id` inside one run. Compose
          // a per-row key from id + index so React can distinguish them
          // and the open-state never bleeds across siblings sharing an id.
          const rowKey = `${t.id}-${index}`;
          const phase: ToolPhase = t.ok === undefined ? "running" : t.ok ? "ok" : "err";
          const isOpen = openId === rowKey;
          return (
            <li key={rowKey} data-tool-id={t.id} data-tool-phase={phase}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : rowKey)}
                aria-expanded={isOpen}
                aria-controls={`tool-detail-${rowKey}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "16px 1fr auto auto",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  width: "100%",
                  padding: "6px 8px",
                  border: 0,
                  background: isOpen
                    ? "color-mix(in oklab, var(--chamber-dna, var(--ember)) 8%, transparent)"
                    : "transparent",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--mono)",
                  fontSize: "var(--t-body-sec)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span data-tone={PHASE_TONE[phase]} aria-hidden style={{ opacity: 0.85 }}>
                  {PHASE_GLYPH[phase]}
                </span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {t.name}
                  {t.role && (
                    <span
                      style={{
                        marginLeft: 8,
                        opacity: 0.55,
                        fontSize: "var(--t-micro)",
                      }}
                    >
                      {t.role}
                    </span>
                  )}
                </span>
                <span style={{ opacity: 0.6, fontSize: "var(--t-micro)" }}>iter {t.iteration}</span>
                <span aria-hidden style={{ opacity: 0.55 }}>
                  {isOpen ? "▾" : "▸"}
                </span>
              </button>
              {isOpen && (
                <div
                  id={`tool-detail-${rowKey}`}
                  role="region"
                  style={{
                    margin: "4px 0 8px 24px",
                    padding: "var(--space-2)",
                    borderLeft: "2px solid var(--chamber-dna, var(--ember))",
                    fontFamily: "var(--mono)",
                    fontSize: "var(--t-micro)",
                    color: "var(--text-secondary)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <DetailBlock label="input">{formatInput(t.input)}</DetailBlock>
                  <DetailBlock label={phase === "running" ? "preview · pending" : "preview"}>
                    {t.preview && t.preview.length > 0
                      ? t.preview
                      : phase === "running"
                      ? "(streaming…)"
                      : "(empty)"}
                  </DetailBlock>
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--space-3)",
                      fontSize: "var(--t-micro)",
                      color: "var(--text-muted)",
                      opacity: 0.85,
                    }}
                  >
                    <span>id · <code>{t.id}</code></span>
                    <span>phase · {phase}</span>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function DetailBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: "var(--t-micro)",
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          opacity: 0.7,
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <pre
        style={{
          margin: 0,
          padding: "6px 8px",
          background: "color-mix(in oklab, var(--text-primary) 4%, transparent)",
          borderRadius: "var(--radius-sm)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          maxHeight: 240,
          overflow: "auto",
          color: "var(--text-primary)",
        }}
      >
        {children}
      </pre>
    </div>
  );
}

function formatInput(input: unknown): string {
  if (input === undefined || input === null) return "(none)";
  if (typeof input === "string") return input;
  try {
    return JSON.stringify(input, null, 2);
  } catch {
    return String(input);
  }
}
