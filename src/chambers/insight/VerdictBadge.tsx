import { useState } from "react";
import type { VerdictState } from "./helpers";

// Verdict badge — appears after each query, clears on the next submit.
// Route + confidence + divergence + prior-failure + judge reasoning +
// pressure hint. Stays compact; Insight is conversation-first, not a
// dashboard of verdicts.

interface Props {
  verdict: VerdictState;
}

export default function VerdictBadge({ verdict }: Props) {
  const [reasoningExpanded, setReasoningExpanded] = useState(false);
  const isAgent = verdict.routePath === "agent";
  const isHigh = verdict.confidence === "high";
  const isRefused = verdict.refused;

  const routeColor = isRefused
    ? "var(--cc-err)"
    : isAgent
    ? "var(--cc-warn)"
    : "var(--chamber-dna, var(--accent))";
  const leftAccent = isRefused
    ? "var(--cc-err)"
    : isHigh
    ? "var(--cc-ok)"
    : "color-mix(in oklab, var(--chamber-dna, var(--accent-dim)) 70%, transparent)";
  const confidenceColor = isRefused
    ? "var(--cc-err)"
    : isHigh
    ? "var(--cc-ok)"
    : "var(--cc-warn)";
  const kickerColor = isRefused ? "var(--cc-err)" : "var(--text-ghost)";

  const shortQ = verdict.question.length > 90
    ? verdict.question.slice(0, 90).trimEnd() + "…"
    : verdict.question;

  const isLowConfidence = verdict.confidence === "low" && !isAgent;
  const hasPressureSignal = isRefused || verdict.divergenceCount > 0 || isLowConfidence || verdict.priorFailure;
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
      className="fadeUp"
      data-insight-verdict
      style={{
        margin: "0 clamp(20px, 5vw, 64px) 8px",
        background: "var(--bg-elevated)",
        border: "var(--border-soft)",
        borderLeft: `2px solid ${leftAccent}`,
        borderRadius: "var(--radius-control)",
        padding: "10px 14px 12px",
        fontFamily: "var(--mono)",
      }}
    >
      <div
        style={{
          fontSize: 9.5,
          letterSpacing: "var(--track-meta)",
          textTransform: "uppercase",
          color: kickerColor,
          marginBottom: 4,
        }}
      >
        — VEREDICTO
      </div>

      {verdict.question && (
        <div
          style={{
            fontSize: "var(--t-body-sec)",
            color: "var(--text-muted)",
            fontFamily: "var(--sans)",
            fontStyle: "italic",
            marginBottom: 8,
            lineHeight: 1.45,
          }}
        >
          sobre: «{shortQ}»
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: 10,
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
            color: routeColor,
          }}
        >
          {verdict.routePath}
        </span>
        {!isAgent && verdict.confidence && (
          <span
            style={{
              fontSize: 10,
              letterSpacing: "var(--track-meta)",
              textTransform: "uppercase",
              color: confidenceColor,
            }}
          >
            {verdict.confidence}
          </span>
        )}
        {isAgent && (
          <span style={{ fontSize: 10, color: "var(--text-ghost)" }}>
            {verdict.agentIter} iter · {verdict.agentToolCount} tools
          </span>
        )}
        {verdict.divergenceCount > 0 && (
          <span style={{ fontSize: 10, color: "var(--cc-warn)", letterSpacing: 1 }}>
            ⊘ {verdict.divergenceCount} divergência{verdict.divergenceCount !== 1 ? "s" : ""}
          </span>
        )}
        {verdict.priorFailure && (
          <span style={{ fontSize: 10, color: "var(--cc-warn)" }}>⚠ falha prévia</span>
        )}
        {isRefused && (
          <span
            style={{
              fontSize: 10,
              letterSpacing: "var(--track-meta)",
              color: "var(--cc-err)",
              textTransform: "uppercase",
              marginLeft: "auto",
            }}
          >
            recusado
          </span>
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
              marginTop: 5,
              fontSize: "var(--t-body-sec)",
              color: "var(--text-muted)",
              lineHeight: 1.5,
              fontFamily: "var(--sans)",
            }}
          >
            {displayed}
            {overflows && (
              <button
                onClick={() => setReasoningExpanded((v) => !v)}
                style={{
                  marginLeft: 8,
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "var(--accent)",
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "var(--track-meta)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {reasoningExpanded ? "menos" : "mais"}
              </button>
            )}
          </div>
        );
      })()}

      {hasPressureSignal && hint && (
        <div
          style={{
            marginTop: 6,
            fontSize: 10,
            color: "var(--text-ghost)",
            letterSpacing: 0.5,
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}
