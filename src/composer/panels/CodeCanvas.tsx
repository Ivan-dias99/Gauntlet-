// Wave 3 — Code Mode canvas. Uses the shared useComposeFlow pipeline
// but specialises the surface for code-class artifacts:
//   - Input placeholder framed for code intent ("describe the change…")
//   - Tabs reflect code-shaped action verbs (refactor, debug, generate,
//     test, doc) that map to backend chamber_hint / tools_needed in
//     Wave 4+. Wave 3 keeps them as decorative routing hints.
//   - Output: artifact rendered through DiffRenderer (handles unified
//     diff and plain code blocks). Files-impacted listed as pills above
//     the renderer.

import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { useComposeFlow } from "../useComposeFlow";
import type { ComposeState, IntentResult, PreviewResult } from "../types";
import DiffRenderer from "./DiffRenderer";
import Pill from "../../components/atoms/Pill";

const CODE_TABS = [
  { id: "refactor", label: "refactor" },
  { id: "debug",    label: "debug"    },
  { id: "generate", label: "generate" },
  { id: "test",     label: "test"     },
  { id: "doc",      label: "doc"      },
] as const;

type CodeTabId = (typeof CODE_TABS)[number]["id"];

const inputStyle: CSSProperties = {
  width: "100%",
  background: "var(--bg-elevated, #161b24)",
  color: "var(--text-primary)",
  border: "1px solid var(--border, rgba(255,255,255,0.13))",
  borderRadius: "var(--radius-md, 8px)",
  padding: "14px 16px",
  fontFamily: "var(--mono)",
  fontSize: 14,
  resize: "vertical",
  minHeight: 96,
  boxSizing: "border-box",
};

const tabBase: CSSProperties = {
  padding: "6px 12px",
  borderRadius: "999px",
  border: "var(--border-soft)",
  background: "transparent",
  color: "var(--text-muted)",
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta)",
  letterSpacing: "var(--track-meta)",
  textTransform: "uppercase",
  cursor: "pointer",
};

const tabActive: CSSProperties = {
  ...tabBase,
  background: "color-mix(in oklab, var(--accent, #4a7cff) 18%, transparent)",
  color: "var(--text-primary)",
  borderColor: "color-mix(in oklab, var(--accent, #4a7cff) 50%, transparent)",
};

const actionPrimary: CSSProperties = {
  background: "var(--accent, #4a7cff)",
  color: "#fff",
  border: "none",
  borderRadius: "var(--radius-md, 8px)",
  padding: "10px 22px",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};

const actionGhost: CSSProperties = {
  background: "transparent",
  color: "var(--text-secondary, var(--text-muted))",
  border: "var(--border-soft)",
  borderRadius: "var(--radius-md, 8px)",
  padding: "10px 18px",
  fontSize: 14,
  cursor: "pointer",
};

export default function CodeCanvas() {
  const [input, setInput] = useState("");
  const [tab, setTab] = useState<CodeTabId>("generate");
  const { state, compose, apply } = useComposeFlow();

  async function onCompose(e: FormEvent) {
    e.preventDefault();
    await compose(input);
  }

  const submitting = state.kind === "submitting";

  return (
    <section
      style={{
        background: "var(--bg-surface)",
        border: "1px solid color-mix(in oklab, var(--accent, #4a7cff) 35%, var(--border, rgba(255,255,255,0.13)))",
        borderRadius: "var(--radius-lg, 10px)",
        padding: "28px 28px 24px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
      data-code-canvas
    >
      <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "var(--accent, #4a7cff)",
            boxShadow: "0 0 12px var(--accent, #4a7cff)",
          }}
        />
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--serif)",
            fontWeight: 400,
            fontSize: 22,
            color: "var(--text-primary)",
          }}
        >
          Code Mode
        </h2>
        <Pill tone="ok">live</Pill>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)", letterSpacing: "var(--track-meta)" }}>
          IDE-STYLE · DIFF + FILES-IMPACTED
        </span>
      </header>

      <form onSubmit={onCompose} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <textarea
          placeholder="Describe the code change you want — e.g. 'add a /healthz endpoint that returns 200 with timestamp'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={submitting}
          style={inputStyle}
          rows={3}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {CODE_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              style={t.id === tab ? tabActive : tabBase}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <button type="button" style={actionGhost} disabled={submitting}>
            Preview
          </button>
          <button type="submit" style={actionPrimary} disabled={submitting || !input.trim()}>
            {submitting ? "Generating…" : "Generate"}
          </button>
          <button type="button" style={actionGhost} disabled={submitting || state.kind !== "preview_ready"}>
            Save
          </button>
        </div>
      </form>

      <CodeOutput state={state} onApply={apply} />
    </section>
  );
}

function CodeOutput({
  state,
  onApply,
}: {
  state: ComposeState;
  onApply: (approved: boolean) => void;
}) {
  if (state.kind === "idle") {
    return (
      <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 12, fontFamily: "var(--mono)" }}>
        no run yet — submit a prompt to see the diff
      </p>
    );
  }

  if (state.kind === "submitting") {
    return (
      <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 13, fontFamily: "var(--mono)" }}>
        contacting brain…
      </p>
    );
  }

  if (state.kind === "error") {
    return (
      <div
        style={{
          background: "color-mix(in oklab, var(--danger, #d04a4a) 14%, transparent)",
          border: "1px solid color-mix(in oklab, var(--danger, #d04a4a) 50%, transparent)",
          color: "var(--danger, #d04a4a)",
          borderRadius: "var(--radius-md, 8px)",
          padding: "10px 12px",
          fontSize: 13,
        }}
        data-error
      >
        <strong>error:</strong> {state.reason ? `${state.reason} — ` : ""}{state.message}
      </div>
    );
  }

  if (state.kind === "applied") {
    return (
      <div
        style={{
          background: "color-mix(in oklab, var(--ok, #4a8c5d) 14%, transparent)",
          border: "1px solid color-mix(in oklab, var(--ok, #4a8c5d) 50%, transparent)",
          borderRadius: "var(--radius-md, 8px)",
          padding: "10px 12px",
          fontSize: 13,
        }}
      >
        <strong>applied · run {state.apply.run_id.slice(0, 8)}</strong>
      </div>
    );
  }

  if (state.kind === "intent_ready") {
    return <IntentBlock intent={state.intent} />;
  }

  // preview_ready
  return (
    <>
      <IntentBlock intent={state.intent} />
      <PreviewBlock preview={state.preview} onApply={onApply} />
    </>
  );
}

function IntentBlock({ intent }: { intent: IntentResult }) {
  return (
    <div
      style={{
        background: "var(--bg-elevated, #131316)",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-md, 8px)",
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Pill tone="ok">{intent.intent}</Pill>
        <Pill tone={intent.risk_estimate === "high" ? "danger" : intent.risk_estimate === "medium" ? "warn" : "ghost"}>
          risk · {intent.risk_estimate}
        </Pill>
        <span style={{ marginLeft: "auto", color: "var(--text-muted)", fontSize: 11, fontFamily: "var(--mono)" }}>
          {intent.model_route.primary_model}
        </span>
      </header>
      <p style={{ margin: 0, fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5 }}>
        {intent.summary}
      </p>
    </div>
  );
}

function PreviewBlock({
  preview,
  onApply,
}: {
  preview: PreviewResult;
  onApply: (approved: boolean) => void;
}) {
  if (preview.refused) {
    return (
      <div
        style={{
          background: "color-mix(in oklab, var(--danger, #d04a4a) 14%, transparent)",
          border: "1px solid color-mix(in oklab, var(--danger, #d04a4a) 50%, transparent)",
          color: "var(--danger, #d04a4a)",
          borderRadius: "var(--radius-md, 8px)",
          padding: "10px 12px",
          fontSize: 13,
        }}
      >
        <strong>refused:</strong> {preview.refusal_reason ?? "no reason given"}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <Pill tone="ok">{preview.artifact.kind}</Pill>
        {preview.judge_verdict && (
          <Pill tone={preview.judge_verdict === "high" ? "ok" : "warn"}>
            judge · {preview.judge_verdict}
          </Pill>
        )}
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
          {preview.model_used} · {preview.latency_ms}ms
        </span>
      </header>

      {preview.artifact.files_impacted.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: "var(--track-meta)", textTransform: "uppercase", marginRight: 4 }}>
            files
          </span>
          {preview.artifact.files_impacted.map((f) => (
            <Pill key={f} tone="neutral">{f}</Pill>
          ))}
        </div>
      )}

      <DiffRenderer content={preview.artifact.content} diff={preview.artifact.diff} />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button type="button" style={actionGhost} onClick={() => onApply(false)}>
          Reject
        </button>
        <button type="button" style={actionPrimary} onClick={() => onApply(true)}>
          Approve & apply
        </button>
      </div>
    </div>
  );
}
