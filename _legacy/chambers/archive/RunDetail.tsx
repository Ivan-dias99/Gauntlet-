import type { Artifact } from "../../spine/types";
import type { RunRecord } from "./helpers";
import { originFor, linkArtifact } from "./helpers";
import { useCopy } from "../../i18n/copy";

// prettyQuestion — fallback when the run question is empty or reads
// as gibberish. Mirrors RunList.prettyTitle so the detail pane never
// shows demo residue when the list shows "—".
function prettyQuestion(raw: string | null | undefined): string {
  const v = (raw ?? "").trim();
  if (!v) return "(sem pergunta registada)";
  if (v.length <= 2) return "(sem pergunta registada)";
  const letters = v.replace(/[^a-zA-ZÀ-ÿ]/g, "");
  if (letters.length === 0) return "(sem pergunta registada)";
  return v;
}

// Right-pane detail view for the selected run. Shows provenance first
// (chamber-of-origin, linked artifact, doctrine in effect at query
// time), then the envelope metadata, then the answer. The section
// primitives pull from the shared .panel + .meta-grid grammar so the
// detail pane reads as part of the same organism as every other panel.

interface Props {
  run: RunRecord | null;
  missionArtifact: Artifact | null;
  doctrineCount: number;
}

export default function RunDetail({ run, missionArtifact, doctrineCount }: Props) {
  const copy = useCopy();
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
          border: "1px solid var(--border-color-soft)",
          borderRadius: "var(--radius-panel)",
          background: "var(--bg-surface)",
          padding: "var(--space-4)",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <div className="kicker" style={{ marginBottom: 10 }}>
            {copy.archiveDetailEmptyKicker}
          </div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: "var(--t-section)",
              lineHeight: 1.45,
              color: "var(--text-muted)",
            }}
          >
            {copy.archiveDetailEmptyBody}
          </div>
        </div>
      </div>
    );
  }

  const origin = originFor(run.route);
  const linked = linkArtifact(run, missionArtifact);
  const routeTone: "err" | "info" | "warn" | "accent" | "muted" =
    run.refused ? "err" :
    run.route === "agent" ? "warn" :
    run.route === "triad" ? "accent" : "muted";

  const toneBorder =
    run.refused ? "var(--cc-err)" :
    run.terminated_early ? "var(--cc-warn)" :
    run.route === "agent" ? "var(--cc-warn)" :
    "color-mix(in oklab, var(--chamber-dna, var(--text-muted)) 70%, transparent)";

  return (
    <div
      data-archive-detail
      data-tone={run.refused ? "err" : run.terminated_early ? "warn" : undefined}
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--border-color-soft)",
        borderRadius: "var(--radius-panel)",
        background: "var(--bg-surface)",
        overflow: "hidden",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <div
        data-chamber={origin ?? undefined}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "var(--space-3) var(--space-4)",
          borderBottom: "1px solid var(--border-color-soft)",
          background: "var(--bg-elevated)",
          borderLeft: `2px solid ${toneBorder}`,
        }}
      >
        <span className="state-pill" data-tone={routeTone}>
          <span className="state-pill-dot" />
          {run.refused ? "✗ " : ""}{run.route}
        </span>
        {origin && (
          <span className="kicker" data-tone="ghost">· {origin}</span>
        )}
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--mono)",
            fontSize: "var(--t-meta)",
            color: "var(--text-muted)",
          }}
        >
          {new Date(run.timestamp).toLocaleString([], {
            hour: "2-digit", minute: "2-digit", second: "2-digit",
            day: "2-digit", month: "2-digit",
          })}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "var(--space-3) var(--space-4)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        <Section title="Pergunta">
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: "var(--t-section)",
              color: "var(--text-primary)",
              lineHeight: 1.45,
              letterSpacing: "-0.005em",
            }}
          >
            {prettyQuestion(run.question)}
          </div>
        </Section>

        <Section title="Proveniência">
          <div className="meta-grid">
            <span className="meta-label">origem</span>
            <span className="meta-value">{origin ?? "(ambígua)"}</span>
            {linked && (
              <>
                <span className="meta-label">artefacto</span>
                <span className="meta-value" data-wrap="true">
                  {linked.taskTitle}
                  {linked.terminatedEarly ? " (parcial)" : ""}
                </span>
              </>
            )}
            {doctrineCount > 0 && (
              <>
                <span className="meta-label">doutrina</span>
                <span className="meta-value">
                  {doctrineCount} princípio{doctrineCount === 1 ? "" : "s"} em vigor
                </span>
              </>
            )}
          </div>
          {!linked && !origin && doctrineCount === 0 && (
            <span
              className="kicker"
              data-tone="ghost"
              style={{ fontStyle: "italic" }}
            >
              — sem cadeia registada —
            </span>
          )}
        </Section>

        <Section title="Envelope">
          <div className="meta-grid">
            <span className="meta-label">confidence</span>
            <span className="meta-value">{run.confidence ?? "—"}</span>
            <span className="meta-label">iterations</span>
            <span className="meta-value">{run.iterations?.toString() ?? "—"}</span>
            <span className="meta-label">tools</span>
            <span className="meta-value">{run.tool_calls.length}</span>
            <span className="meta-label">tokens</span>
            <span className="meta-value">{run.input_tokens} in · {run.output_tokens} out</span>
            <span className="meta-label">latency</span>
            <span className="meta-value">{run.processing_time_ms} ms</span>
            {run.terminated_early && (
              <>
                <span className="meta-label">terminated</span>
                <span className="meta-value" data-tone="warn">
                  {run.termination_reason ?? "early"}
                </span>
              </>
            )}
          </div>
        </Section>

        {run.tool_calls.length > 0 && (
          <Section title="Tool calls">
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {run.tool_calls.map((tc, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "16px 1fr",
                    gap: 6,
                    fontFamily: "var(--mono)",
                    fontSize: "var(--t-body-sec)",
                    color: "var(--text-muted)",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{ color: tc.ok ? "var(--cc-ok)" : "var(--cc-err)" }}
                    aria-hidden
                  >
                    {tc.ok ? "✓" : "✗"}
                  </span>
                  <span>{tc.name}</span>
                </div>
              ))}
            </div>
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
              <span
                className="kicker"
                data-tone="ghost"
                style={{ fontStyle: "italic" }}
              >
                — sem motivo registado —
              </span>
            )}
          </Section>
        )}

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
      <span className="kicker">— {title}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {children}
      </div>
    </section>
  );
}

