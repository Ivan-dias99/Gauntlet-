// Wave 4 — Apply Mode canvas. Specialises the compose flow for the
// "what will hit disk" view: files-impacted as a prominent card list
// (one row per file), risk + judge verdict surfaced in a stripe at the
// top, and applied-runs linked to the Ledger by run_id.
//
// Backend contract unchanged — same /composer/intent + /composer/preview
// + /composer/apply pipeline. Wave 4 only changes the renderer.
//
// Out of scope: real working-tree diff (needs server-side patch apply,
// the artifact.diff we render in CodeCanvas is the model's proposal,
// not a confirmed staged change). Real ledger linkage UI lands when
// the existing /control/ledger gains a deep-link URL we can join on.

import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useComposeFlow } from "../useComposeFlow";
import type { ComposeState, IntentResult, PreviewResult } from "../types";
import Pill from "../../components/atoms/Pill";

const APPLY_TABS = [
  { id: "dry-run",  label: "dry-run"  },
  { id: "execute",  label: "execute"  },
  { id: "commit",   label: "commit"   },
  { id: "deploy",   label: "deploy"   },
] as const;

type ApplyTabId = (typeof APPLY_TABS)[number]["id"];

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

const actionDestructive: CSSProperties = {
  ...actionPrimary,
  background: "var(--danger, #d04a4a)",
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

export default function ApplyCanvas() {
  const [input, setInput] = useState("");
  const [tab, setTab] = useState<ApplyTabId>("dry-run");
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
      data-apply-canvas
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
          Apply Mode
        </h2>
        <Pill tone="ok">live</Pill>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)", letterSpacing: "var(--track-meta)" }}>
          FILES IMPACTED · RISK · LEDGER
        </span>
      </header>

      <form onSubmit={onCompose} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <textarea
          placeholder="Describe the action — e.g. 'add a healthz endpoint and commit the change'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={submitting}
          style={inputStyle}
          rows={3}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {APPLY_TABS.map((t) => (
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
            {submitting ? "Planning…" : "Plan"}
          </button>
          <button type="button" style={actionGhost} disabled={submitting || state.kind !== "preview_ready"}>
            Save
          </button>
        </div>
      </form>

      <ApplyOutput state={state} onApply={apply} />
    </section>
  );
}

function ApplyOutput({
  state,
  onApply,
}: {
  state: ComposeState;
  onApply: (approved: boolean) => void;
}) {
  if (state.kind === "idle") {
    return (
      <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 12, fontFamily: "var(--mono)" }}>
        no plan yet — submit a prompt to see the files-impacted preview
      </p>
    );
  }

  if (state.kind === "submitting") {
    return (
      <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 13, fontFamily: "var(--mono)" }}>
        planning…
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
      >
        <strong>error:</strong> {state.reason ? `${state.reason} — ` : ""}{state.message}
      </div>
    );
  }

  if (state.kind === "applied") {
    const status = state.apply.status;
    const tone = status === "applied" ? "ok" : status === "rejected" ? "warn" : "danger";
    return (
      <div
        style={{
          background: "color-mix(in oklab, var(--ok, #4a8c5d) 14%, transparent)",
          border: "1px solid color-mix(in oklab, var(--ok, #4a8c5d) 50%, transparent)",
          borderRadius: "var(--radius-md, 8px)",
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <Pill tone={tone}>{status}</Pill>
        <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-primary)" }}>
          run · {state.apply.run_id.slice(0, 8)}
        </span>
        {state.apply.error && (
          <span style={{ color: "var(--danger, #d04a4a)", fontSize: 12 }}>
            {state.apply.error}
          </span>
        )}
        <Link
          to="/control/ledger"
          style={{
            marginLeft: "auto",
            color: "var(--text-secondary, var(--text-muted))",
            textDecoration: "none",
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
            border: "var(--border-soft)",
            borderRadius: "var(--radius-sm, 4px)",
            padding: "4px 8px",
          }}
        >
          → ledger
        </Link>
      </div>
    );
  }

  if (state.kind === "intent_ready") {
    return <IntentStripe intent={state.intent} />;
  }

  // preview_ready
  return (
    <>
      <IntentStripe intent={state.intent} />
      <FilesImpacted preview={state.preview} />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button type="button" style={actionGhost} onClick={() => onApply(false)}>
          Reject
        </button>
        <button
          type="button"
          style={state.preview.requires_approval ? actionDestructive : actionPrimary}
          onClick={() => onApply(true)}
        >
          {state.preview.requires_approval ? "Approve & apply (requires approval)" : "Apply"}
        </button>
      </div>
    </>
  );
}

function IntentStripe({ intent }: { intent: IntentResult }) {
  return (
    <div
      style={{
        background: "var(--bg-elevated, #131316)",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-md, 8px)",
        padding: "10px 12px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      <Pill tone="ok">{intent.intent}</Pill>
      <Pill tone={intent.risk_estimate === "high" ? "danger" : intent.risk_estimate === "medium" ? "warn" : "ghost"}>
        risk · {intent.risk_estimate}
      </Pill>
      {intent.requires_approval && <Pill tone="warn">approval required</Pill>}
      <span style={{ marginLeft: "auto", color: "var(--text-muted)", fontSize: 11, fontFamily: "var(--mono)" }}>
        {intent.model_route.primary_model}
      </span>
    </div>
  );
}

function FilesImpacted({ preview }: { preview: PreviewResult }) {
  const files = preview.artifact.files_impacted;

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
        background: "var(--bg, #08080a)",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-md, 8px)",
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-meta)",
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
            color: "var(--text-primary)",
          }}
        >
          Files to {preview.artifact.kind === "code_patch" ? "modify" : "create"}
        </span>
        <Pill tone="neutral">{files.length} file{files.length === 1 ? "" : "s"}</Pill>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
          {preview.model_used} · {preview.latency_ms}ms
        </span>
      </header>

      {files.length === 0 ? (
        <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
          no files declared — artifact is text-only ({preview.artifact.kind})
        </p>
      ) : (
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
          {files.map((f) => (
            <li
              key={f}
              style={{
                background: "var(--bg-elevated, #131316)",
                border: "var(--border-soft)",
                borderRadius: 6,
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: "var(--mono)",
                fontSize: 12,
              }}
            >
              <span aria-hidden style={{ color: "var(--text-muted)" }}>·</span>
              <span style={{ color: "var(--text-primary)" }}>{f}</span>
              <span style={{ marginLeft: "auto", color: "var(--text-muted)", fontSize: 10, letterSpacing: "var(--track-meta)", textTransform: "uppercase" }}>
                {kindFor(f)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function kindFor(filename: string): string {
  const dot = filename.lastIndexOf(".");
  if (dot < 0 || dot === filename.length - 1) return "file";
  return filename.slice(dot + 1);
}
