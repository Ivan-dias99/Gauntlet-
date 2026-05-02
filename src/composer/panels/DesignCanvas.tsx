// Wave 7 — Design Mode canvas. Two surfaces in one canvas:
//
//   1. Tokens import — operator pastes a Figma file_id + REST API body
//      (the JSON returned by GET /v1/files/{file_key} or the variables
//      endpoint). Backend's /design/figma/import walks the body via
//      figma_tokens.tokens_from_figma_json and returns a normalised
//      TokenSet (colors, spacings, types, radii). TokensRenderer paints
//      it as swatches + specimens + rulers.
//
//   2. Compose — same useComposeFlow as the rest of the surfaces; when
//      the brain returns an artifact for a "create_design" intent, the
//      content is rendered as a styled spec card. Wave 8+ will detect
//      structured token JSON in artifact.content and render it through
//      the same TokensRenderer so the loop closes (compose → tokens).
//
// No new backend endpoint this wave — both surfaces consume routes that
// already exist on signal-backend.

import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { useComposeFlow } from "../useComposeFlow";
import { importFigmaTokens } from "../composerClient";
import {
  isBackendUnreachable,
  isBackendError,
} from "../../lib/signalApi";
import type { ComposeState, IntentResult, PreviewResult, TokenSet } from "../types";
import TokensRenderer from "./TokensRenderer";
import Pill from "../../components/atoms/Pill";

type SurfaceKind = "tokens" | "compose";

const inputStyle: CSSProperties = {
  width: "100%",
  background: "var(--bg-elevated, #161b24)",
  color: "var(--text-primary)",
  border: "1px solid var(--border, rgba(255,255,255,0.13))",
  borderRadius: "var(--radius-md, 8px)",
  padding: "10px 12px",
  fontFamily: "var(--mono)",
  fontSize: 13,
  boxSizing: "border-box",
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  minHeight: 140,
  resize: "vertical",
  whiteSpace: "pre",
  overflowWrap: "normal",
  fontSize: 12,
};

const promptStyle: CSSProperties = {
  ...inputStyle,
  minHeight: 96,
  fontFamily: "var(--sans)",
  fontSize: 16,
  resize: "vertical",
};

const tabBase: CSSProperties = {
  padding: "8px 14px",
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

const SAMPLE_BODY = JSON.stringify(
  {
    name: "Sample Design System",
    styles: {
      "abc": { name: "Brand/Primary", styleType: "FILL", description: "" },
      "xyz": { name: "Body/Default",  styleType: "TEXT", description: "" },
    },
    meta: {
      variables: {
        "v1": { name: "color/primary", resolvedType: "COLOR", valuesByMode: { "1:1": { r: 0.29, g: 0.49, b: 1, a: 1 } }, variableCollectionId: "c1" },
        "v2": { name: "spacing/md",    resolvedType: "FLOAT", valuesByMode: { "1:1": 16 }, variableCollectionId: "c1" },
        "v3": { name: "radius/md",     resolvedType: "FLOAT", valuesByMode: { "1:1": 8 },  variableCollectionId: "c1" },
      },
      variableCollections: {
        "c1": { defaultModeId: "1:1" },
      },
    },
  },
  null,
  2,
);

export default function DesignCanvas() {
  const [surface, setSurface] = useState<SurfaceKind>("tokens");

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
      data-design-canvas
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
          Design Mode
        </h2>
        <Pill tone="ok">live</Pill>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)", letterSpacing: "var(--track-meta)" }}>
          FIGMA TOKENS · COMPOSE
        </span>
      </header>

      <div style={{ display: "flex", gap: 6 }}>
        <button
          type="button"
          onClick={() => setSurface("tokens")}
          style={surface === "tokens" ? tabActive : tabBase}
        >
          Tokens import
        </button>
        <button
          type="button"
          onClick={() => setSurface("compose")}
          style={surface === "compose" ? tabActive : tabBase}
        >
          Compose
        </button>
      </div>

      {surface === "tokens" ? <TokensImportSurface /> : <ComposeSurface />}
    </section>
  );
}

// ─── Tokens import surface ──────────────────────────────────────────────

type ImportState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "ready"; tokens: TokenSet }
  | { kind: "error"; message: string };

function TokensImportSurface() {
  const [fileId, setFileId] = useState("");
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [state, setState] = useState<ImportState>({ kind: "idle" });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const id = fileId.trim();
    const raw = body.trim();
    if (!id || !raw) return;

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
    } catch (err) {
      setState({
        kind: "error",
        message: `body is not valid JSON: ${err instanceof Error ? err.message : String(err)}`,
      });
      return;
    }

    setState({ kind: "submitting" });
    try {
      const tokens = await importFigmaTokens({
        file_id: id,
        body: parsed,
        name: name.trim() || undefined,
      });
      setState({ kind: "ready", tokens });
    } catch (err) {
      if (isBackendUnreachable(err)) {
        setState({ kind: "error", message: `${err.reason} — ${err.message}` });
      } else if (isBackendError(err)) {
        setState({
          kind: "error",
          message: err.envelope?.message ?? err.message,
        });
      } else {
        setState({ kind: "error", message: err instanceof Error ? err.message : String(err) });
      }
    }
  }

  function loadSample() {
    setFileId("sample-001");
    setName("Sample design system");
    setBody(SAMPLE_BODY);
    setState({ kind: "idle" });
  }

  const submitting = state.kind === "submitting";

  return (
    <>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) auto", gap: 8 }}>
          <input
            type="text"
            placeholder="Figma file_id"
            value={fileId}
            onChange={(e) => setFileId(e.target.value)}
            disabled={submitting}
            style={inputStyle}
            maxLength={64}
          />
          <input
            type="text"
            placeholder="Display name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
            style={inputStyle}
            maxLength={128}
          />
          <button type="button" style={actionGhost} onClick={loadSample} disabled={submitting}>
            Load sample
          </button>
        </div>
        <textarea
          placeholder={'Paste Figma file body JSON — { "name": "...", "styles": {...}, "meta": { "variables": {...}, "variableCollections": {...} } }'}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={submitting}
          style={textareaStyle}
          spellCheck={false}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            type="submit"
            style={actionPrimary}
            disabled={submitting || !fileId.trim() || !body.trim()}
          >
            {submitting ? "Parsing…" : "Import"}
          </button>
        </div>
      </form>

      <ImportOutput state={state} />
    </>
  );
}

function ImportOutput({ state }: { state: ImportState }) {
  if (state.kind === "idle") {
    return (
      <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 12, fontFamily: "var(--mono)" }}>
        no tokens yet — paste a Figma file body and import to see swatches + specimens
      </p>
    );
  }
  if (state.kind === "submitting") {
    return (
      <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 13, fontFamily: "var(--mono)" }}>
        parsing Figma body…
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
        <strong>error:</strong> {state.message}
      </div>
    );
  }
  return <TokensRenderer tokens={state.tokens} />;
}

// ─── Compose surface ───────────────────────────────────────────────────

function ComposeSurface() {
  const [input, setInput] = useState("");
  const { state, compose, apply } = useComposeFlow();

  async function onCompose(e: FormEvent) {
    e.preventDefault();
    await compose(input);
  }

  const submitting = state.kind === "submitting";

  return (
    <>
      <form onSubmit={onCompose} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <textarea
          placeholder="Describe the design — e.g. 'a dark editorial landing for a memory archive, serif headers, generous spacing'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={submitting}
          style={promptStyle}
          rows={3}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="submit" style={actionPrimary} disabled={submitting || !input.trim()}>
            {submitting ? "Composing…" : "Compose"}
          </button>
        </div>
      </form>

      <ComposeOutput state={state} onApply={apply} />
    </>
  );
}

function ComposeOutput({
  state,
  onApply,
}: {
  state: ComposeState;
  onApply: (approved: boolean) => void;
}) {
  if (state.kind === "idle") {
    return (
      <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 12, fontFamily: "var(--mono)" }}>
        no design yet — describe one above to see the spec
      </p>
    );
  }
  if (state.kind === "submitting") {
    return (
      <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 13, fontFamily: "var(--mono)" }}>
        composing design spec…
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
  return (
    <>
      <IntentBlock intent={state.intent} />
      <DesignSpecBlock preview={state.preview} onApply={onApply} />
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
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Pill tone={intent.intent === "create_design" ? "ok" : "warn"}>{intent.intent}</Pill>
        <Pill tone={intent.risk_estimate === "high" ? "danger" : intent.risk_estimate === "medium" ? "warn" : "ghost"}>
          risk · {intent.risk_estimate}
        </Pill>
        <span style={{ marginLeft: "auto", color: "var(--text-muted)", fontSize: 11, fontFamily: "var(--mono)" }}>
          {intent.model_route.primary_model}
        </span>
      </header>
      {intent.intent !== "create_design" && (
        <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>
          The brain routed this as <code>{intent.intent}</code> instead of <code>create_design</code> —
          the prompt may be ambiguous about design intent.
        </p>
      )}
      <p style={{ margin: 0, fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5 }}>
        {intent.summary}
      </p>
    </div>
  );
}

function DesignSpecBlock({
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
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <header style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
      <pre
        style={{
          margin: 0,
          background: "var(--bg, #08080a)",
          border: "var(--border-soft)",
          padding: 14,
          borderRadius: 8,
          fontFamily: "var(--mono)",
          fontSize: 12,
          color: "var(--text-primary)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          maxHeight: 360,
          overflow: "auto",
          lineHeight: 1.6,
        }}
      >
        {preview.artifact.content}
      </pre>
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
