import { useState } from "react";
import type { VerdictState } from "./helpers";

// Verdict badge — compact verdict summary after each query. Built on
// the canonical .panel + .meta-grid primitives so its geometry matches
// the Insight cards and every other panel across chambers. Accent
// resolves from verdict outcome via data-tone.

interface Props {
  verdict: VerdictState;
}

export default function VerdictBadge({ verdict }: Props) {
  const [reasoningExpanded, setReasoningExpanded] = useState(false);
  const isAgent = verdict.routePath === "agent";
  const isHigh = verdict.confidence === "high";
  const isRefused = verdict.refused;

  const panelTone: "err" | "ok" | "accent" =
    isRefused ? "err" : isHigh ? "ok" : "accent";
  const routeTone: "err" | "warn" | "accent" =
    isRefused ? "err" : isAgent ? "warn" : "accent";
  const confidenceTone: "err" | "ok" | "warn" | "muted" =
    isRefused ? "err" : isHigh ? "ok" : verdict.confidence === "low" ? "warn" : "muted";

  const shortQ = verdict.question.length > 90
    ? verdict.question.slice(0, 90).trimEnd() + "…"
    : verdict.question;

  const isLowConfidence = verdict.confidence === "low" && !isAgent;
  const hasPressureSignal =
    isRefused || verdict.divergenceCount > 0 || isLowConfidence || verdict.priorFailure;
  const hint = isRefused
    ? "→ reformula · fractura a questão · adiciona contexto específico"
    : verdict.divergenceCount > 0
    ? "→ pressiona onde divergiu · pede clarificação · verifica a premissa"
    : isLowConfidence
    ? "→ confiança baixa · exige evidência · fractura a questão"
    : verdict.priorFailure
    ? "→ falha prévia registada · muda o ângulo · evita a mesma premissa"
    : null;

  return (
    <div
      className="fadeUp panel"
      data-insight-verdict
      data-refused={isRefused ? "true" : undefined}
      data-tone={panelTone}
    >
      <div className="panel-head">
        <span className="kicker" data-tone={isRefused ? "err" : "ghost"}>
          — veredicto
        </span>
        {isRefused && (
          <span className="state-pill" data-tone="err" style={{ marginLeft: "auto" }}>
            <span className="state-pill-dot" />
            recusado
          </span>
        )}
      </div>

      {verdict.question && (
        <div
          style={{
            fontFamily: "var(--sans)",
            fontSize: "var(--t-body-sec)",
            color: "var(--text-muted)",
            fontStyle: "italic",
            lineHeight: 1.45,
          }}
        >
          sobre: «{shortQ}»
        </div>
      )}

      <div className="meta-grid">
        <span className="meta-label">rota</span>
        <span className="meta-value" data-tone={routeTone}>{verdict.routePath}</span>

        {!isAgent && verdict.confidence && (
          <>
            <span className="meta-label">confiança</span>
            <span className="meta-value" data-tone={confidenceTone}>{verdict.confidence}</span>
          </>
        )}
        {isAgent && (
          <>
            <span className="meta-label">execução</span>
            <span className="meta-value">
              {verdict.agentIter} iter · {verdict.agentToolCount} tools
            </span>
          </>
        )}
        {verdict.divergenceCount > 0 && (
          <>
            <span className="meta-label">divergência</span>
            <span className="meta-value" data-tone="warn">⊘ {verdict.divergenceCount}</span>
          </>
        )}
        {verdict.priorFailure && (
          <>
            <span className="meta-label">histórico</span>
            <span className="meta-value" data-tone="warn">⚠ falha prévia</span>
          </>
        )}
      </div>

      {verdict.reasoning && (() => {
        const overflows = verdict.reasoning.length > 200;
        const displayed = !overflows || reasoningExpanded
          ? verdict.reasoning
          : verdict.reasoning.slice(0, 200) + "…";
        return (
          <div
            style={{
              fontFamily: "var(--sans)",
              fontSize: "var(--t-body-sec)",
              color: "var(--text-secondary)",
              lineHeight: 1.55,
              paddingTop: "var(--space-1)",
              borderTop: "1px dashed var(--border-color-soft)",
            }}
          >
            {displayed}
            {overflows && (
              <button
                onClick={() => setReasoningExpanded((v) => !v)}
                className="btn-ghost"
                style={{
                  marginLeft: 8,
                  fontFamily: "var(--mono)",
                  fontSize: "var(--t-micro)",
                  letterSpacing: "var(--track-label)",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                }}
              >
                {reasoningExpanded ? "menos" : "mais"}
              </button>
            )}
          </div>
        );
      })()}

      {hasPressureSignal && hint && (
        <div className="kicker" data-tone="ghost" style={{ lineHeight: 1.5 }}>
          {hint}
        </div>
      )}
    </div>
  );
}
