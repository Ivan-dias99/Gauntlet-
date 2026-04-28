import { useCallback, useState } from "react";
import { useSpine } from "../../spine/SpineContext";
import { useSignal, type RouteEvent } from "../../hooks/useSignal";
import { fireTelemetry } from "../../lib/telemetry";

// Wave 6c — On-demand triad+judge validation of the Insight conversation.
//
// Insight switched its default operating mode to a conversational agent
// loop (research lab). The doctrine #1 "refuse before guessing" no
// longer fires on every turn — it would be hostile to exploration.
// This panel puts triad+judge back on the table when the operator
// explicitly asks for a confidence verdict on where the conversation
// has landed. Refusal carries `nearest_answerable_question` so the
// chamber can offer a sharp reformulate path instead of dead-ending.
//
// Lifecycle:
//   idle → click "↳ validar direcção" → pending (3 triad calls + judge)
//        → verdict (high → green; low → orange + reformulate substitute)

interface VerdictState {
  confidence: string | null;
  refused: boolean;
  reasoning: string;
  divergenceCount: number;
  nearestAnswerableQuestion: string | null;
}

interface Props {
  onReformulate: (text: string) => void;
}

export default function ValidationPanel({ onReformulate }: Props) {
  const { activeMission, principles } = useSpine();
  const { streamValidate, pending, unreachable } = useSignal();
  const [verdict, setVerdict] = useState<VerdictState | null>(null);
  const [running, setRunning] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const validate = useCallback(async () => {
    if (!activeMission) return;
    setErr(null);
    setRunning(true);
    setVerdict(null);
    try {
      const inlineNotes = activeMission.notes.map((n) => ({
        text: n.text,
        role: n.role,
        createdAt: n.createdAt,
      }));
      const inlinePrinciples = principles.map((p) => p.text);
      let captured: VerdictState | null = null;
      await streamValidate(
        {
          mission_id: activeMission.id,
          notes: inlineNotes,
          principles: inlinePrinciples,
        },
        (ev: RouteEvent) => {
          if (ev.type === "error") {
            setErr(ev.message);
            return;
          }
          if (ev.type === "judge_done") {
            captured = {
              confidence: ev.confidence,
              refused: ev.should_refuse,
              reasoning: ev.reasoning,
              divergenceCount: ev.divergence_count,
              nearestAnswerableQuestion: ev.nearest_answerable_question,
            };
            setVerdict(captured);
          }
        },
      );
      if (captured) {
        fireTelemetry("insight_validate_done", activeMission.id, {
          confidence: captured.confidence,
          refused: captured.refused,
          divergence: captured.divergenceCount,
        });
      }
    } finally {
      setRunning(false);
    }
  }, [activeMission, streamValidate, principles]);

  if (!activeMission) return null;

  // Empty state — show only the trigger button.
  if (!verdict && !running && !err) {
    return (
      <div data-insight-validate="empty" style={shellEmpty}>
        <button
          type="button"
          onClick={validate}
          disabled={pending || unreachable}
          style={primaryBtn}
        >
          ↳ validar direcção
        </button>
        <span style={hintStyle}>
          dispara triad + judge sobre a conversa para confiança honesta
        </span>
      </div>
    );
  }

  const tone =
    verdict?.refused ? "var(--cc-warn, #c08040)" :
    verdict?.confidence === "high" ? "var(--cc-ok, #2e9c5e)" :
    "var(--accent)";

  return (
    <div data-insight-validate="active" style={shellActive(tone)}>
      <div style={headerRow}>
        <span style={kicker(tone)}>
          {running ? "validar · em curso" : verdict?.refused ? "validar · recusado" : "validar · confirmado"}
        </span>
        {verdict && !running && (
          <span style={confidenceBadge(verdict.confidence, tone)}>
            confidence {verdict.confidence ?? "?"} · divergência {verdict.divergenceCount}
          </span>
        )}
      </div>

      {running && <p style={runningBody}>3 análises em paralelo + juiz a comparar…</p>}

      {verdict && !running && (
        <>
          <p style={reasoningBody}>{verdict.reasoning}</p>
          {verdict.refused && verdict.nearestAnswerableQuestion && (
            <div style={substituteBlock}>
              <span style={substituteKicker}>posso responder a:</span>
              <button
                type="button"
                onClick={() => onReformulate(verdict.nearestAnswerableQuestion ?? "")}
                style={substituteBtn}
              >
                {verdict.nearestAnswerableQuestion}
              </button>
            </div>
          )}
          <div style={actionsRow}>
            <button
              type="button"
              onClick={validate}
              disabled={pending}
              style={secondaryBtn}
            >
              re-validar
            </button>
          </div>
        </>
      )}

      {err && <p style={errorStyle}>{err}</p>}
    </div>
  );
}

// ── Styles (inline; one chamber affordance) ────────────────────────────────

const shellEmpty: React.CSSProperties = {
  margin: "var(--space-2) auto",
  maxWidth: 780,
  display: "flex",
  alignItems: "center",
  gap: 12,
  fontFamily: "var(--mono)",
  fontSize: 11,
  color: "var(--text-secondary)",
};

function shellActive(tone: string): React.CSSProperties {
  return {
    margin: "var(--space-3) auto",
    padding: "var(--space-3) var(--space-4)",
    border: `1px solid color-mix(in oklab, ${tone} 36%, transparent)`,
    borderRadius: "var(--radius-2)",
    background: `color-mix(in oklab, ${tone} 5%, transparent)`,
    maxWidth: 780,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };
}

const headerRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  justifyContent: "space-between",
};

function kicker(tone: string): React.CSSProperties {
  return {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: tone,
  };
}

function confidenceBadge(confidence: string | null, tone: string): React.CSSProperties {
  return {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    padding: "3px 10px",
    borderRadius: 999,
    border: `1px solid ${tone}`,
    color: tone,
  };
}

const runningBody: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--sans)",
  fontSize: 13,
  color: "var(--text-secondary)",
  fontStyle: "italic",
};

const reasoningBody: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--sans)",
  fontSize: 14,
  lineHeight: 1.5,
  color: "var(--text)",
};

const substituteBlock: React.CSSProperties = {
  marginTop: 4,
  padding: "var(--space-2) var(--space-3)",
  border: "1px solid color-mix(in oklab, var(--accent) 28%, transparent)",
  borderRadius: "var(--radius-2)",
  background: "color-mix(in oklab, var(--accent) 6%, transparent)",
  display: "flex",
  flexDirection: "column",
  gap: 6,
};
const substituteKicker: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 10,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: "var(--accent)",
};
const substituteBtn: React.CSSProperties = {
  textAlign: "left",
  padding: "6px 0",
  border: 0,
  background: "transparent",
  color: "var(--text)",
  fontFamily: "var(--sans)",
  fontSize: 13.5,
  lineHeight: 1.4,
  cursor: "pointer",
};

const actionsRow: React.CSSProperties = {
  display: "flex",
  gap: 8,
};

const primaryBtn: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  padding: "6px 14px",
  border: "1px solid var(--accent)",
  borderRadius: 999,
  background: "color-mix(in oklab, var(--accent) 14%, transparent)",
  color: "var(--accent)",
  cursor: "pointer",
};
const secondaryBtn: React.CSSProperties = {
  ...primaryBtn,
  border: "1px solid var(--border)",
  background: "transparent",
  color: "var(--text-secondary)",
};

const hintStyle: React.CSSProperties = {
  fontFamily: "var(--sans)",
  fontStyle: "italic",
  fontSize: 12,
  color: "var(--text-ghost)",
};

const errorStyle: React.CSSProperties = {
  margin: 0,
  padding: "6px 10px",
  border: "1px solid color-mix(in oklab, var(--cc-err) 36%, transparent)",
  borderRadius: "var(--radius-control)",
  background: "color-mix(in oklab, var(--cc-err) 8%, transparent)",
  color: "var(--cc-err)",
  fontFamily: "var(--mono)",
  fontSize: 11,
};
