import type { Artifact } from "../../spine/types";
import type { RunRecord } from "./helpers";
import { ROUTE_COLOR, originFor, linkArtifact } from "./helpers";

// Right-pane detail view for the selected run. Shows provenance first
// (chamber-of-origin, linked artifact, doctrine in effect at query
// time), then the envelope metadata, then the answer. Empty state when
// no run selected — the chamber reads as retrieval-first.

interface Props {
  run: RunRecord | null;
  missionArtifact: Artifact | null;
  doctrineCount: number;
}

export default function RunDetail({ run, missionArtifact, doctrineCount }: Props) {
  if (!run) {
    return (
      <div
        data-archive-empty
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "var(--border-soft)",
          borderRadius: "var(--radius-panel)",
          background: "var(--bg-surface)",
          padding: "var(--space-4)",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center", color: "var(--text-muted)" }}>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: "var(--t-micro)",
              letterSpacing: "var(--track-label)",
              textTransform: "uppercase",
              color: "var(--text-ghost)",
              marginBottom: 10,
            }}
          >
            — Proveniência
          </div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 18, lineHeight: 1.45 }}>
            Seleciona uma entrada do ledger para ver a origem, o artefacto ligado,
            e a cadeia que a produziu.
          </div>
        </div>
      </div>
    );
  }

  const origin = originFor(run.route);
  const linked = linkArtifact(run, missionArtifact);
  const routeColor = run.refused ? "var(--cc-err)" : ROUTE_COLOR[run.route] ?? "var(--text-muted)";

  return (
    <div
      data-archive-detail
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-panel)",
        background: "var(--bg-surface)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        data-chamber={origin ?? undefined}
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          padding: "var(--space-3)",
          borderBottom: "var(--border-soft)",
          background: "var(--bg-elevated)",
          borderLeft: "2px solid color-mix(in oklab, var(--chamber-dna, var(--text-muted)) 70%, transparent)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-micro)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: routeColor,
          }}
        >
          {run.refused ? "✗ " : ""}{run.route}
        </span>
        {origin && (
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "var(--t-micro)",
              letterSpacing: "var(--track-meta)",
              color: "var(--text-ghost)",
              textTransform: "uppercase",
            }}
          >
            · {origin}
          </span>
        )}
        <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-muted)" }}>
          {new Date(run.timestamp).toLocaleString([], {
            hour: "2-digit", minute: "2-digit", second: "2-digit",
            day: "2-digit", month: "2-digit",
          })}
        </span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: "auto", padding: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>

        {/* Question */}
        <Section title="Pergunta">
          <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--text-primary)", lineHeight: 1.5 }}>
            {run.question}
          </div>
        </Section>

        {/* Provenance */}
        <Section title="Proveniência">
          <Meta k="origem" v={origin ?? "(ambígua)"} />
          {linked && (
            <Meta
              k="artefacto"
              v={`${linked.taskTitle}${linked.terminatedEarly ? " (parcial)" : ""}`}
            />
          )}
          {doctrineCount > 0 && (
            <Meta
              k="doutrina"
              v={`${doctrineCount} princípio${doctrineCount === 1 ? "" : "s"} em vigor`}
            />
          )}
          {!linked && !origin && doctrineCount === 0 && (
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--text-ghost)",
                fontStyle: "italic",
              }}
            >
              — sem cadeia registada —
            </div>
          )}
        </Section>

        {/* Envelope */}
        <Section title="Envelope">
          <Meta k="confidence" v={run.confidence ?? "—"} />
          <Meta k="iterations" v={run.iterations?.toString() ?? "—"} />
          <Meta k="tools" v={`${run.tool_calls.length}`} />
          <Meta k="tokens" v={`${run.input_tokens} in · ${run.output_tokens} out`} />
          <Meta k="latency" v={`${run.processing_time_ms} ms`} />
          {run.terminated_early && (
            <Meta k="terminated" v={run.termination_reason ?? "early"} tone="warn" />
          )}
        </Section>

        {run.tool_calls.length > 0 && (
          <Section title="Tool calls">
            {run.tool_calls.map((tc, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "16px 1fr",
                  gap: 6,
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--text-muted)",
                }}
              >
                <span style={{ color: tc.ok ? "var(--cc-ok)" : "var(--cc-err)" }}>
                  {tc.ok ? "✓" : "✗"}
                </span>
                <span>{tc.name}</span>
              </div>
            ))}
          </Section>
        )}

        {(run.judge_reasoning || run.refused) && (
          <Section title="Juízo">
            {run.judge_reasoning ? (
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: "var(--t-body-sec)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.55,
                  whiteSpace: "pre-wrap",
                }}
              >
                {run.judge_reasoning.length > 600
                  ? run.judge_reasoning.slice(0, 600) + "…"
                  : run.judge_reasoning}
              </div>
            ) : (
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: "var(--t-body-sec)",
                  color: "var(--text-ghost)",
                  fontStyle: "italic",
                }}
              >
                — sem motivo registado —
              </div>
            )}
          </Section>
        )}

        {/* Answer */}
        <Section title="Resposta">
          <div
            style={{
              fontFamily: "var(--sans)",
              fontSize: "var(--t-body)",
              color: run.answer ? "var(--text-primary)" : "var(--text-ghost)",
              fontStyle: run.answer ? "normal" : "italic",
              lineHeight: "var(--lh-body)",
              whiteSpace: "pre-wrap",
            }}
          >
            {run.answer
              ? run.answer
              : run.refused
              ? "— recusada sem resposta registada —"
              : "— sem resposta —"}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: "var(--t-micro)",
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: "var(--text-ghost)",
        }}
      >
        — {title}
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {children}
      </div>
    </section>
  );
}

function Meta({ k, v, tone }: { k: string; v: string; tone?: "warn" }) {
  const color = tone === "warn" ? "var(--cc-warn)" : "var(--text-secondary)";
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "90px 1fr",
        gap: 10,
        alignItems: "baseline",
        fontSize: "var(--t-body-sec)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "var(--track-meta)",
          textTransform: "uppercase",
          color: "var(--text-ghost)",
        }}
      >
        {k}
      </span>
      <span style={{ color, fontFamily: "var(--mono)", fontSize: 11 }}>{v}</span>
    </div>
  );
}
