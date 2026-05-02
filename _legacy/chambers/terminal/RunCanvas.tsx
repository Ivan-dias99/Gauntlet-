import { ROLE_COLOR, type Copy, type CrewState, type DoneSummary, type LiveTool, type ToolPhase } from "./helpers";

// RunCanvas — the execution theatre. Output is printed directly on the
// chamber canvas, anchored only by a thin chamber-DNA left rail. The
// old .exec-shell window (traffic-lights, path header, heavy wrapper)
// is gone; its chrome has migrated into the single terminal command
// surface at the bottom of the chamber (ExecutionComposer). This keeps
// one dominant command surface and lets agent progress breathe.

interface Props {
  copy: Copy;
  mode: "agent" | "crew";
  pending: boolean;
  iteration: number;
  elapsed: number;
  liveText: string;
  liveTools: LiveTool[];
  done: DoneSummary | null;
  accepted: boolean;
  crew: CrewState;
  activeTaskTitle: string | null;
  lastTask: string;
  canAccept: boolean;
  onAccept: () => void;
}

export default function RunCanvas({
  copy, mode, pending, iteration, elapsed,
  liveText, liveTools, done, accepted, crew,
  activeTaskTitle, lastTask, canAccept, onAccept,
}: Props) {
  const showCrewCard = mode === "crew" && (crew.steps.length > 0 || crew.verdict || pending);
  const showExec = pending || liveTools.length > 0 || liveText || done;

  if (!showCrewCard && !showExec) return null;

  const label = activeTaskTitle || lastTask || "signal";
  const stateTone: "info" | "ok" | "muted" =
    pending ? "info" : done ? "ok" : "muted";
  const stateLabel = pending ? "exec" : done ? "done" : "idle";

  return (
    <>
      {showCrewCard && <CrewStrip crew={crew} pending={pending} />}

      {showExec && (
        <section className="term-canvas fadeIn" data-state={pending ? "pending" : done ? "done" : "idle"}>
          <header className="term-canvas-header">
            <span className="term-canvas-header-state" data-tone={stateTone}>
              <span
                className="status-dot"
                data-tone={stateTone}
                data-pulse={pending ? "true" : undefined}
              />
              {stateLabel}
            </span>
            <span className="term-canvas-header-target" title={label}>
              › {label}
            </span>
            {pending && (
              <span className="term-canvas-header-meta">
                iter {iteration} · {elapsed.toFixed(1)}s
              </span>
            )}
            {!pending && done && (
              <span className="term-canvas-header-meta">
                exit 0 · {done.iterations} iter · {done.tool_count} tools · {done.processing_time_ms}ms
              </span>
            )}
          </header>

          {liveTools.length > 0 && (
            <div className="term-canvas-tools">
              {liveTools.map((tc) => (
                <ToolLine
                  key={tc.id}
                  name={tc.name}
                  input={tc.input}
                  phase={tc.ok === undefined ? "running" : tc.ok ? "ok" : "err"}
                />
              ))}
            </div>
          )}

          {(liveText || done) && (
            <div className="term-canvas-answer">
              <span className="term-canvas-answer-prompt">⏺</span>
              {done
                ? (done.answer.trim()
                    ? done.answer
                    : <span style={{ color: "var(--text-ghost)", fontStyle: "italic" }}>— sem resposta gerada —</span>)
                : liveText}
              {pending && <span className="cc-cursor working" />}
            </div>
          )}

          {done?.terminated_early && (
            <div className="kicker" data-tone="warn" style={{ letterSpacing: "var(--track-meta)" }}>
              ⚠ terminado cedo: {done.termination_reason}
            </div>
          )}

          {done && canAccept && (
            <div className="term-canvas-foot">
              {!accepted ? (
                <>
                  <button onClick={onAccept} className="btn-chip" data-variant="ok">
                    {copy.acceptArtifact}
                  </button>
                  <span className="kicker" data-tone="ghost">{copy.acceptHint}</span>
                </>
              ) : (
                <span className="state-pill" data-tone="ok">
                  <span className="state-pill-dot" />
                  {copy.artifactSealed}
                </span>
              )}
            </div>
          )}
        </section>
      )}
    </>
  );
}

function ToolLine({ name, input, phase }: { name: string; input?: unknown; phase: ToolPhase }) {
  const dot = phase === "running" ? "◐" : phase === "ok" ? "●" : "✕";
  const inputStr = input ? JSON.stringify(input).slice(0, 80) : "";
  const statusLabel = phase === "running" ? "run" : phase === "ok" ? "ok" : "err";
  return (
    <div className="tool-call toolRise" data-phase={phase}>
      <span className="tool-call-dot" aria-hidden>{dot}</span>
      <span className="tool-call-name">{name}</span>
      <span className="tool-call-args">{inputStr}</span>
      <span className="tool-call-status">{statusLabel}</span>
    </div>
  );
}

// CrewStrip — compact inline plan, not a card. Prints onto canvas with
// a top-bottom hairline. Accept / reject verdict sits at the bottom
// inline with the steps.
function CrewStrip({ crew, pending }: { crew: CrewState; pending: boolean }) {
  return (
    <section
      className="term-canvas fadeIn"
      data-crew="true"
      style={{ marginBottom: "var(--space-2)" }}
    >
      <header className="term-canvas-header">
        <span className="term-canvas-header-state" data-tone="info">
          <span className="status-dot" data-tone="info" data-pulse={pending ? "true" : undefined} />
          crew
        </span>
        {crew.currentRole && pending && (
          <span
            className="term-canvas-header-target"
            style={{ color: ROLE_COLOR[crew.currentRole] }}
          >
            ▶ {crew.currentRole}
          </span>
        )}
        {crew.refinements > 0 && (
          <span className="term-canvas-header-meta" style={{ color: "var(--cc-warn)" }}>
            refine ×{crew.refinements}
          </span>
        )}
      </header>

      {crew.analysis && (
        <div
          style={{
            fontFamily: "var(--serif)",
            fontSize: "var(--t-body-sec)",
            fontStyle: "italic",
            lineHeight: 1.55,
            color: "var(--text-muted)",
            letterSpacing: "-0.003em",
            paddingLeft: "var(--space-3)",
            borderLeft: "1px solid var(--border-color-soft)",
          }}
        >
          {crew.analysis}
        </div>
      )}

      {crew.steps.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            paddingLeft: "var(--space-3)",
            borderLeft: "1px solid color-mix(in oklab, var(--chamber-dna, var(--ember)) 30%, var(--border-color-soft))",
          }}
        >
          {crew.steps.map((s, i) => {
            const ran = crew.rolesRun.includes(s.role);
            const active = crew.currentRole === s.role;
            const color = ROLE_COLOR[s.role];
            return (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "14px 90px 1fr",
                  gap: 10,
                  alignItems: "baseline",
                  fontSize: "var(--t-body-sec)",
                  opacity: ran || active ? 1 : 0.55,
                }}
              >
                <span style={{ color }}>{active ? "◐" : ran ? "●" : "○"}</span>
                <span style={{ color, letterSpacing: ".04em", fontFamily: "var(--mono)" }}>
                  {s.role}
                </span>
                <span style={{ color: "var(--text-secondary)", lineHeight: 1.5, fontFamily: "var(--sans)" }}>
                  {s.goal}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {crew.verdict && (
        <div className="term-canvas-foot">
          <span className="state-pill" data-tone={crew.verdict.accept ? "ok" : "err"}>
            <span className="state-pill-dot" />
            {crew.verdict.accept ? "critic accepted" : "critic rejected"}
          </span>
          <span
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--sans)",
              fontSize: "var(--t-body-sec)",
              lineHeight: 1.5,
              flex: "1 1 260px",
            }}
          >
            {crew.verdict.summary}
          </span>
        </div>
      )}
    </section>
  );
}
