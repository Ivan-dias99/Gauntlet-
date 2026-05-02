// Wave 1 — central Compose canvas (the only mode wired end-to-end this
// wave). Mirrors Foto 3's central panel: input, tool tabs, three action
// buttons (Preview / Compose / Save), and a preview/error region below.
//
// The 7 tool tabs are visual-only in Wave 1: the backend's /composer/intent
// already routes by user_input alone. Tabs become real `tools_needed`
// hints in Wave 2+ when the per-mode wiring lands.

import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { runCompose, applyPreview } from "../composerClient";
import type { ComposeState, IntentResult, PreviewResult } from "../types";
import { isBackendUnreachable } from "../../lib/signalApi";
import Pill from "../../components/atoms/Pill";

const TOOL_TABS = [
  { id: "code",     label: "code"     },
  { id: "web",      label: "web"      },
  { id: "image",    label: "image"    },
  { id: "terminal", label: "terminal" },
  { id: "memory",   label: "memory"   },
  { id: "analysis", label: "analysis" },
  { id: "design",   label: "design"   },
] as const;

type ToolId = (typeof TOOL_TABS)[number]["id"];

const inputStyle: CSSProperties = {
  width: "100%",
  background: "var(--bg-elevated, #161b24)",
  color: "var(--text-primary)",
  border: "1px solid var(--border, rgba(255,255,255,0.13))",
  borderRadius: "var(--radius-md, 8px)",
  padding: "14px 16px",
  fontFamily: "var(--sans)",
  fontSize: 16,
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

export default function ComposeCanvas() {
  const [input, setInput] = useState("");
  const [tool, setTool] = useState<ToolId>("code");
  const [state, setState] = useState<ComposeState>({ kind: "idle" });

  async function onCompose(e: FormEvent) {
    e.preventDefault();
    const userInput = input.trim();
    if (!userInput) return;
    setState({ kind: "submitting" });
    try {
      const { intent, preview } = await runCompose({
        userInput,
        source: "control_center",
      });
      setState({ kind: "preview_ready", intent, preview });
    } catch (err) {
      if (isBackendUnreachable(err)) {
        setState({ kind: "error", message: err.message, reason: err.reason });
      } else {
        setState({ kind: "error", message: err instanceof Error ? err.message : String(err) });
      }
    }
  }

  async function onApply(approved: boolean) {
    if (state.kind !== "preview_ready") return;
    const preview = state.preview;
    const intent = state.intent;
    setState({ kind: "submitting" });
    try {
      const apply = await applyPreview({
        preview_id: preview.preview_id,
        approved,
        approval_reason: approved ? "operator_approved" : "operator_rejected",
      });
      if (approved) {
        setState({ kind: "applied", preview, apply });
      } else {
        setState({ kind: "intent_ready", intent });
      }
    } catch (err) {
      setState({ kind: "error", message: err instanceof Error ? err.message : String(err) });
    }
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
      data-composer-canvas
    >
      <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          aria-hidden
          style={{
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
          Ruberra Composer
        </h2>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)", letterSpacing: "var(--track-meta)" }}>
          CONTEXT · AUTO-DETECTED
        </span>
      </header>

      <form onSubmit={onCompose} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <textarea
          placeholder="What do you want to build?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={submitting}
          style={inputStyle}
          rows={3}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {TOOL_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTool(t.id)}
              style={t.id === tool ? tabActive : tabBase}
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
            {submitting ? "Composing…" : "Compose"}
          </button>
          <button type="button" style={actionGhost} disabled={submitting || state.kind !== "preview_ready"}>
            Save
          </button>
        </div>
      </form>

      <ComposeOutput state={state} onApply={onApply} />
    </section>
  );
}

function ComposeOutput({
  state,
  onApply,
}: {
  state: ComposeState;
  onApply: (approved: boolean) => void;
}) {
  if (state.kind === "idle") return null;

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

  if (state.kind === "intent_ready") {
    return <IntentBlock intent={state.intent} />;
  }

  if (state.kind === "preview_ready") {
    return (
      <>
        <IntentBlock intent={state.intent} />
        <PreviewBlock preview={state.preview} onApply={onApply} />
      </>
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
        {state.apply.status !== "applied" && (
          <span style={{ marginLeft: 8, color: "var(--text-muted)" }}>
            status: {state.apply.status}
          </span>
        )}
      </div>
    );
  }

  return null;
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
        gap: 8,
      }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Pill tone="ok">{intent.intent}</Pill>
        <Pill tone={intent.risk_estimate === "high" ? "danger" : intent.risk_estimate === "medium" ? "warn" : "ghost"}>
          risk · {intent.risk_estimate}
        </Pill>
        <span style={{ marginLeft: "auto", color: "var(--text-muted)", fontSize: 11, fontFamily: "var(--mono)" }}>
          conf · {intent.confidence.toFixed(2)} · {intent.model_route.primary_model}
        </span>
      </header>
      <p style={{ margin: 0, fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5 }}>
        {intent.summary}
      </p>
      {intent.clarifying_questions.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-muted)", fontSize: 12 }}>
          {intent.clarifying_questions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      )}
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
  return (
    <div
      style={{
        background: "var(--bg, #08080a)",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-md, 8px)",
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Pill tone={preview.refused ? "danger" : "ok"}>
          {preview.refused ? "refused" : preview.artifact.kind}
        </Pill>
        {preview.judge_verdict && (
          <Pill tone={preview.judge_verdict === "high" ? "ok" : "warn"}>
            judge · {preview.judge_verdict}
          </Pill>
        )}
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
          {preview.model_used} · {preview.latency_ms}ms
        </span>
      </header>
      {preview.refused ? (
        <p style={{ margin: 0, color: "var(--danger, #d04a4a)", fontSize: 13 }}>
          {preview.refusal_reason ?? "refused without reason"}
        </p>
      ) : (
        <pre
          style={{
            margin: 0,
            background: "var(--bg-surface)",
            padding: 12,
            borderRadius: 6,
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: "var(--text-primary)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxHeight: 320,
            overflow: "auto",
          }}
        >
          {preview.artifact.content}
        </pre>
      )}
      {!preview.refused && (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" style={actionGhost} onClick={() => onApply(false)}>
            Reject
          </button>
          <button type="button" style={actionPrimary} onClick={() => onApply(true)}>
            Approve & apply
          </button>
        </div>
      )}
    </div>
  );
}
