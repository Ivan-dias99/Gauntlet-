// Wave 6 — Analysis Mode canvas. Specialised compose surface for
// long-form report generation. The brain already routes "create_report"
// when the prompt mentions report / executive / summary / relatório
// (composer.py:148); this surface adds:
//
//   - A prominent prompt textarea framed for analytical work
//   - A collapsible "data context" textarea (CSV / JSON paste). The
//     text is sent as ContextCaptureRequest.selection (50k char cap),
//     so the brain receives it alongside the prompt — extends what the
//     existing /composer/context already supports without any backend
//     change.
//   - Five verb tabs (report / summary / kpi / trend / forecast)
//     prefixed onto the user prompt to bias intent classification.
//   - Output rendered through ReportRenderer: markdown blocks +
//     auto-detected KPI tiles + bar charts inferred from 2-column
//     numeric tables.

import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { useComposeFlow } from "../useComposeFlow";
import type { ComposeState, IntentResult, PreviewResult } from "../types";
import ReportRenderer from "./ReportRenderer";
import Pill from "../../components/atoms/Pill";

const VERB_TABS = [
  { id: "report",   label: "report",   blurb: "Full-form analytical report" },
  { id: "summary",  label: "summary",  blurb: "Executive summary, ≤ 1 page"  },
  { id: "kpi",      label: "kpi",      blurb: "KPI tiles, no narrative"      },
  { id: "trend",    label: "trend",    blurb: "Time-series trend with chart" },
  { id: "forecast", label: "forecast", blurb: "Forecast + scenarios"         },
] as const;

type VerbId = (typeof VERB_TABS)[number]["id"];

const VERB_PREFIX: Record<VerbId, string> = {
  report:   "Write a full analytical report covering: ",
  summary:  "Write an executive summary (one page max) of: ",
  kpi:      "List the key KPIs as a heading + value pair for each metric on: ",
  trend:    "Describe the trend with a markdown table of time-series points for: ",
  forecast: "Forecast the next four periods with assumptions and a markdown table for: ",
};

const inputBase: CSSProperties = {
  width: "100%",
  background: "var(--bg-elevated, #161b24)",
  color: "var(--text-primary)",
  border: "1px solid var(--border, rgba(255,255,255,0.13))",
  borderRadius: "var(--radius-md, 8px)",
  padding: "12px 14px",
  fontFamily: "var(--sans)",
  fontSize: 16,
  resize: "vertical",
  boxSizing: "border-box",
};

const dataInputStyle: CSSProperties = {
  ...inputBase,
  fontFamily: "var(--mono)",
  fontSize: 12,
  minHeight: 96,
  whiteSpace: "pre",
  overflowWrap: "normal",
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

const linkStyle: CSSProperties = {
  background: "transparent",
  border: "none",
  color: "var(--text-muted)",
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: "var(--track-meta)",
  textTransform: "uppercase",
  cursor: "pointer",
  padding: 0,
};

const SAMPLE_DATA = `quarter,revenue,gross_margin
Q1,21.4,52.1
Q2,24.8,56.3
Q3,28.1,58.7
Q4,30.6,60.2`;

export default function AnalysisCanvas() {
  const [input, setInput] = useState("");
  const [verb, setVerb] = useState<VerbId>("report");
  const [data, setData] = useState("");
  const [showData, setShowData] = useState(false);
  const { state, compose, apply } = useComposeFlow();

  async function onCompose(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    const prompt = `${VERB_PREFIX[verb]}${trimmed}`;
    await compose(prompt, {
      selection: data.trim() || undefined,
    });
  }

  function loadSample() {
    setInput("quarterly performance for the last fiscal year");
    setData(SAMPLE_DATA);
    setShowData(true);
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
      data-analysis-canvas
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
          Analysis Mode
        </h2>
        <Pill tone="ok">live</Pill>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)", letterSpacing: "var(--track-meta)" }}>
          MARKDOWN · KPI TILES · BAR CHARTS
        </span>
      </header>

      <form onSubmit={onCompose} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <textarea
          placeholder="What do you want analysed? — e.g. 'quarterly revenue trend with margin breakdown'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={submitting}
          style={{ ...inputBase, minHeight: 80 }}
          rows={2}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          {VERB_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setVerb(t.id)}
              style={t.id === verb ? tabActive : tabBase}
              title={t.blurb}
            >
              {t.label}
            </button>
          ))}
          <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 8 }}>
            {VERB_TABS.find((t) => t.id === verb)?.blurb}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            style={linkStyle}
            onClick={() => setShowData((v) => !v)}
          >
            {showData ? "− hide data context" : "+ data context (optional)"}
          </button>
          {data && (
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
              {data.length} chars · {data.split("\n").length} lines
            </span>
          )}
          <button type="button" style={{ ...linkStyle, marginLeft: "auto" }} onClick={loadSample}>
            load sample
          </button>
        </div>

        {showData && (
          <textarea
            placeholder="Paste CSV, JSON, SQL result, or any tabular data — sent as context with the prompt (50k char cap)"
            value={data}
            onChange={(e) => setData(e.target.value)}
            disabled={submitting}
            style={dataInputStyle}
            spellCheck={false}
            rows={6}
          />
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <button type="button" style={actionGhost} disabled={submitting}>
            Preview
          </button>
          <button type="submit" style={actionPrimary} disabled={submitting || !input.trim()}>
            {submitting ? "Analysing…" : "Compose"}
          </button>
          <button type="button" style={actionGhost} disabled={submitting || state.kind !== "preview_ready"}>
            Save
          </button>
        </div>
      </form>

      <AnalysisOutput state={state} onApply={apply} />
    </section>
  );
}

function AnalysisOutput({
  state,
  onApply,
}: {
  state: ComposeState;
  onApply: (approved: boolean) => void;
}) {
  if (state.kind === "idle") {
    return (
      <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 12, fontFamily: "var(--mono)" }}>
        no analysis yet — describe what to analyse, optionally paste data, then compose
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
      <ReportBlock preview={state.preview} onApply={onApply} />
    </>
  );
}

function IntentBlock({ intent }: { intent: IntentResult }) {
  const isReport =
    intent.intent === "create_report" ||
    intent.intent === "analyze" ||
    intent.intent === "summarize";
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
        <Pill tone={isReport ? "ok" : "warn"}>{intent.intent}</Pill>
        <Pill tone={intent.risk_estimate === "high" ? "danger" : intent.risk_estimate === "medium" ? "warn" : "ghost"}>
          risk · {intent.risk_estimate}
        </Pill>
        <span style={{ marginLeft: "auto", color: "var(--text-muted)", fontSize: 11, fontFamily: "var(--mono)" }}>
          {intent.model_route.primary_model}
        </span>
      </header>
      {!isReport && (
        <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>
          The brain routed this as <code>{intent.intent}</code>; report-class rendering still
          applies if the artifact comes back as markdown.
        </p>
      )}
      <p style={{ margin: 0, fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5 }}>
        {intent.summary}
      </p>
    </div>
  );
}

function ReportBlock({
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

      <ReportRenderer content={preview.artifact.content} />

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
