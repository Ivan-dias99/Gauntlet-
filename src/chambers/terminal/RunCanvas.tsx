import { ROLE_COLOR, type Copy, type CrewState, type DoneSummary, type LiveTool, type ToolPhase } from "./helpers";

// RunCanvas — the exec panel (assistant text + tool stream + accept
// action) and the Crew plan/verdict panel. Pure renderer: state in,
// callbacks out. Both panels pull from the shared .panel primitive so
// their geometry matches every other panel in the product.

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

  return (
    <>
      {showCrewCard && <CrewCard crew={crew} pending={pending} />}

      {showExec && (
        <section
          className="toolRise xc-exec"
          data-state={pending ? "running" : done ? "done" : "idle"}
        >
          <header className="xc-exec-head">
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <span className="kicker">exec</span>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "var(--t-meta)",
                  color: "var(--text-muted)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {(() => {
                  const label = activeTaskTitle || lastTask;
                  if (!label) return "signal";
                  return `› ${label.slice(0, 48)}${label.length > 48 ? "…" : ""}`;
                })()}
              </span>
            </div>
            {pending && (
              <span className="state-pill" data-tone="warn">
                <span className="state-pill-dot breathe" />
                running · iter {iteration} · {elapsed.toFixed(1)}s
              </span>
            )}
            {!pending && done && (
              <span className="state-pill" data-tone="ok">
                {(() => {
                  const hasTelemetry =
                    done.iterations > 0 || done.tool_count > 0 || done.processing_time_ms > 0;
                  if (!hasTelemetry) return "exit 0";
                  return `exit 0 · ${done.iterations} iter · ${done.tool_count} tools · ${done.processing_time_ms}ms`;
                })()}
              </span>
            )}
          </header>

          <div className="xc-exec-body">
            {liveTools.length > 0 && (
              <div style={{ marginBottom: liveText || done ? 10 : 0 }}>
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
              <div
                className="xc-exec-answer"
                data-has-tools={liveTools.length > 0 ? "true" : undefined}
              >
                <span style={{ color: "var(--cc-prompt)" }}>⏺ </span>
                {done
                  ? (done.answer.trim()
                      ? done.answer
                      : (
                        <span style={{ color: "var(--text-ghost)", fontStyle: "italic" }}>
                          — sem resposta gerada —
                        </span>
                      ))
                  : liveText}
                {pending && <span className="cc-cursor working" />}
              </div>
            )}

            {done?.terminated_early && (
              <div
                className="kicker"
                data-tone="warn"
                style={{ marginTop: 8, letterSpacing: "var(--track-meta)" }}
              >
                terminado cedo: {done.termination_reason}
              </div>
            )}

            {done && canAccept && (
              <div className="xc-exec-foot">
                {!accepted ? (
                  <>
                    <button onClick={onAccept} className="btn-chip" data-variant="ok">
                      {copy.acceptArtifact}
                    </button>
                    <span className="kicker" data-tone="ghost">
                      {copy.acceptHint}
                    </span>
                  </>
                ) : (
                  <span className="state-pill" data-tone="ok">
                    <span className="state-pill-dot" />
                    {copy.artifactSealed}
                  </span>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}

function ToolLine({ name, input, phase }: { name: string; input?: unknown; phase: ToolPhase }) {
  const tone = phase === "running" ? "info" : phase === "ok" ? "ok" : "err";
  const color =
    phase === "running" ? "var(--cc-info)" : phase === "ok" ? "var(--cc-ok)" : "var(--cc-err)";
  const dot = phase === "running" ? "◐" : phase === "ok" ? "●" : "✕";
  const inputStr = input ? JSON.stringify(input).slice(0, 80) : "";
  return (
    <div
      className="toolRise"
      style={{
        display: "grid",
        gridTemplateColumns: "16px 90px 1fr auto",
        gap: 12,
        alignItems: "center",
        padding: "6px 0",
        fontFamily: "var(--mono)",
        fontSize: "var(--t-body-sec)",
      }}
    >
      <span style={{ color, transition: "color .2s" }}>{dot}</span>
      <span style={{ color: "var(--cc-tool)", letterSpacing: ".04em" }}>{name}</span>
      <span
        style={{
          color: "var(--cc-path)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {inputStr}
      </span>
      <span className="kicker" data-tone={tone}>
        {phase === "running" ? "…" : phase === "ok" ? "ok" : "err"}
      </span>
    </div>
  );
}

function CrewCard({ crew, pending }: { crew: CrewState; pending: boolean }) {
  return (
    <div
      className="toolRise panel"
      data-tone="accent"
      style={{ maxWidth: 860, marginBottom: "var(--space-3)" }}
    >
      <div className="panel-head" style={{ gap: 10 }}>
        <span className="kicker" data-tone="accent">crew</span>
        {crew.refinements > 0 && (
          <span className="kicker" data-tone="warn">refine ×{crew.refinements}</span>
        )}
        {crew.currentRole && pending && (
          <span className="kicker" style={{ color: ROLE_COLOR[crew.currentRole] }}>
            ▶ {crew.currentRole}
          </span>
        )}
      </div>

      {crew.analysis && (
        <div
          style={{
            fontSize: "var(--t-body-sec)",
            color: "var(--text-muted)",
            lineHeight: 1.5,
            fontFamily: "var(--sans)",
            fontStyle: "italic",
          }}
        >
          {crew.analysis}
        </div>
      )}

      {crew.steps.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
        <div
          style={{
            paddingTop: 10,
            borderTop: "1px dashed var(--border-color-soft)",
            fontSize: "var(--t-body-sec)",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <span
            className="state-pill"
            data-tone={crew.verdict.accept ? "ok" : "err"}
          >
            <span className="state-pill-dot" />
            {crew.verdict.accept ? "✓ critic accepted" : "✗ critic rejected"}
          </span>
          <div
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--sans)",
              lineHeight: 1.55,
            }}
          >
            {crew.verdict.summary}
          </div>
          {crew.verdict.issues.length > 0 && (
            <ul
              style={{
                margin: "4px 0 0 0",
                padding: "0 0 0 16px",
                color: "var(--cc-warn)",
                fontSize: "var(--t-meta)",
                lineHeight: 1.6,
              }}
            >
              {crew.verdict.issues.map((iss, i) => (
                <li key={i}>{iss}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
