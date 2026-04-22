import { ROLE_COLOR, type Copy, type CrewState, type DoneSummary, type LiveTool, type ToolPhase } from "./helpers";

// RunCanvas — the exec panel (assistant text + tool stream + accept
// action) and the Crew plan/verdict panel. Pure renderer: state in,
// callbacks out.

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
              <span className="t-kicker">exec</span>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
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
              <span className="xc-pill xc-pill-running">
                <span aria-hidden className="xc-pill-dot breathe" />
                running · iter {iteration} · {elapsed.toFixed(1)}s
              </span>
            )}
            {!pending && done && (
              <span className="xc-pill xc-pill-ok">
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
              <div style={{ fontSize: 10, color: "var(--cc-warn)", marginTop: 8, fontFamily: "var(--mono)" }}>
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
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--text-ghost)",
                        fontFamily: "var(--mono)",
                      }}
                    >
                      {copy.acceptHint}
                    </span>
                  </>
                ) : (
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--cc-ok)",
                      fontFamily: "var(--mono)",
                      letterSpacing: "var(--track-meta)",
                    }}
                  >
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
        fontSize: 12,
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
      <span
        style={{
          color,
          fontSize: 10,
          letterSpacing: "var(--track-meta)",
          textTransform: "uppercase",
        }}
      >
        {phase === "running" ? "…" : phase === "ok" ? "ok" : "err"}
      </span>
    </div>
  );
}

function CrewCard({ crew, pending }: { crew: CrewState; pending: boolean }) {
  return (
    <div
      className="toolRise"
      style={{
        maxWidth: 820,
        marginBottom: 14,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-soft)",
        borderLeft: "2px solid var(--accent-dim)",
        borderRadius: "var(--radius-panel)",
        padding: "14px 18px",
        fontFamily: "var(--mono)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "var(--text-ghost)",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ color: "var(--accent)" }}>crew</span>
        {crew.refinements > 0 && (
          <span style={{ color: "var(--cc-warn)" }}>refine ×{crew.refinements}</span>
        )}
        {crew.currentRole && pending && (
          <span style={{ color: ROLE_COLOR[crew.currentRole] }}>▶ {crew.currentRole}</span>
        )}
      </div>

      {crew.analysis && (
        <div
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            marginBottom: 12,
            lineHeight: 1.5,
            fontFamily: "var(--sans)",
            fontStyle: "italic",
          }}
        >
          {crew.analysis}
        </div>
      )}

      {crew.steps.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
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
                  fontSize: 11,
                  opacity: ran || active ? 1 : 0.55,
                }}
              >
                <span style={{ color }}>{active ? "◐" : ran ? "●" : "○"}</span>
                <span style={{ color, letterSpacing: ".04em" }}>{s.role}</span>
                <span style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
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
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px dashed var(--border-soft)",
            fontSize: 11,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: crew.verdict.accept ? "var(--cc-ok)" : "var(--cc-err)",
              letterSpacing: 2,
              textTransform: "uppercase",
              fontSize: 10,
              marginBottom: 6,
            }}
          >
            <span>{crew.verdict.accept ? "✓ critic accepted" : "✗ critic rejected"}</span>
          </div>
          <div
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--sans)",
              lineHeight: 1.5,
            }}
          >
            {crew.verdict.summary}
          </div>
          {crew.verdict.issues.length > 0 && (
            <ul
              style={{
                margin: "8px 0 0 0",
                padding: "0 0 0 16px",
                color: "var(--cc-warn)",
                fontSize: 10,
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
