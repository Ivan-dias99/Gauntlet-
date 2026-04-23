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
      data-refused={isRefused ? "true" : undefined}
      style={{
        background: "var(--bg-surface)",
        border: "var(--border-soft)",
        borderLeft: `2px solid ${leftAccent}`,
        borderRadius: "var(--radius-panel)",
        padding: "var(--space-3)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "var(--space-2)",
          fontFamily: "var(--mono)",
        }}
      >
        <span
          style={{
            fontSize: "var(--t-micro)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: kickerColor,
          }}
        >
          — veredicto
        </span>
        {isRefused && (
          <span
            style={{
              fontSize: "var(--t-micro)",
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

      {verdict.question && (
        <div
          style={{
            fontSize: "var(--t-body-sec)",
            color: "var(--text-muted)",
            fontFamily: "var(--sans)",
            fontStyle: "italic",
            lineHeight: 1.45,
          }}
        >
          sobre: «{shortQ}»
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "90px 1fr",
          rowGap: 4,
          columnGap: 10,
          alignItems: "baseline",
        }}
      >
        <MetaLabel>rota</MetaLabel>
        <MetaValue color={routeColor}>{verdict.routePath}</MetaValue>

        {!isAgent && verdict.confidence && (
          <>
            <MetaLabel>confiança</MetaLabel>
            <MetaValue color={confidenceColor}>{verdict.confidence}</MetaValue>
          </>
        )}
        {isAgent && (
          <>
            <MetaLabel>execução</MetaLabel>
            <MetaValue>
              {verdict.agentIter} iter · {verdict.agentToolCount} tools
            </MetaValue>
          </>
        )}
        {verdict.divergenceCount > 0 && (
          <>
            <MetaLabel>divergência</MetaLabel>
            <MetaValue color="var(--cc-warn)">
              ⊘ {verdict.divergenceCount}
            </MetaValue>
          </>
        )}
        {verdict.priorFailure && (
          <>
            <MetaLabel>histórico</MetaLabel>
            <MetaValue color="var(--cc-warn)">⚠ falha prévia</MetaValue>
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
              fontSize: "var(--t-body-sec)",
              color: "var(--text-secondary)",
              lineHeight: 1.55,
              fontFamily: "var(--sans)",
              paddingTop: "var(--space-1)",
              borderTop: "1px dashed var(--border-soft)",
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
                  fontSize: "var(--t-micro)",
                  letterSpacing: "var(--track-label)",
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
            fontFamily: "var(--mono)",
            fontSize: "var(--t-micro)",
            color: "var(--text-ghost)",
            letterSpacing: 0.5,
            lineHeight: 1.5,
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}

function MetaLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--mono)",
        fontSize: "var(--t-micro)",
        letterSpacing: "var(--track-label)",
        textTransform: "uppercase",
        color: "var(--text-ghost)",
      }}
    >
      {children}
    </span>
  );
}

function MetaValue({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      style={{
        fontFamily: "var(--mono)",
        fontSize: "var(--t-body-sec)",
        letterSpacing: "var(--track-meta)",
        color: color ?? "var(--text-secondary)",
      }}
    >
      {children}
    </span>
  );
}
