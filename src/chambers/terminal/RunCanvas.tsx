import { ROLE_COLOR, type Copy, type CrewState, type DoneSummary, type LiveTool, type ToolPhase } from "./helpers";

// RunCanvas — the exec panel + optional Crew panel. The exec panel now
// uses the .exec-shell primitive (window chrome + body + foot) so the
// Terminal chamber finally reads as an IDE-grade output surface, not a
// floating tool tray. Crew panel rides on .panel[data-rank="primary"].

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
  const state = pending ? "running" : done ? "done" : "idle";

  return (
    <>
      {showCrewCard && <CrewCard crew={crew} pending={pending} />}

      {showExec && (
        <section className="exec-shell toolRise" data-state={state}>
          <header className="exec-shell-bar">
            <span className="exec-shell-dots" aria-hidden>
              <span /><span /><span />
            </span>
            <span className="exec-shell-title">
              <strong>signal</strong>
              <span style={{ color: "var(--text-muted)" }}> · </span>
              <span style={{ color: "var(--cc-path)" }}>~/exec</span>
              <span style={{ color: "var(--text-muted)" }}> · </span>
              {label.slice(0, 72)}{label.length > 72 ? "…" : ""}
            </span>
            {pending && (
              <span className="state-pill" data-tone="info">
                <span className="state-pill-dot breathe" />
                iter {iteration} · {elapsed.toFixed(1)}s
              </span>
            )}
            {!pending && done && (
              <span className="state-pill" data-tone="ok">
                <span className="state-pill-dot" />
                exit 0 · {done.iterations} iter · {done.tool_count} tools · {done.processing_time_ms}ms
              </span>
            )}
          </header>

          <div className="exec-shell-body">
            {liveTools.length > 0 && (
              <div style={{ marginBottom: liveText || done ? 12 : 0 }}>
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
                style={{
                  paddingTop: liveTools.length > 0 ? "var(--space-2)" : 0,
                  borderTop: liveTools.length > 0 ? "1px dashed var(--border-color-soft)" : "0",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                <span style={{ color: "var(--cc-prompt)", marginRight: 4 }}>⏺</span>
                {done
                  ? (done.answer.trim()
                      ? done.answer
                      : <span style={{ color: "var(--text-ghost)", fontStyle: "italic" }}>— sem resposta gerada —</span>)
                  : liveText}
                {pending && <span className="cc-cursor working" />}
              </div>
            )}

            {done?.terminated_early && (
              <div
                className="kicker"
                data-tone="warn"
                style={{ marginTop: 10, letterSpacing: "var(--track-meta)" }}
              >
                ⚠ terminado cedo: {done.termination_reason}
              </div>
            )}
          </div>

          {done && canAccept && (
            <div className="exec-shell-foot">
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

          {pending && <div className="thinking-strip" aria-hidden />}
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

function CrewCard({ crew, pending }: { crew: CrewState; pending: boolean }) {
  return (
    <div
      className="toolRise panel"
      data-tone="accent"
      data-rank="primary"
      style={{ maxWidth: 860, marginBottom: "var(--space-3)" }}
    >
      <div className="panel-head">
        <span className="panel-title">crew</span>
        {crew.refinements > 0 && (
          <span className="state-pill" data-tone="warn">
            <span className="state-pill-dot" />
            refine ×{crew.refinements}
          </span>
        )}
        {crew.currentRole && pending && (
          <span className="kicker" style={{ color: ROLE_COLOR[crew.currentRole], marginLeft: "auto" }}>
            ▶ {crew.currentRole}
          </span>
        )}
      </div>

      {crew.analysis && (
        <div
          style={{
            fontSize: "var(--t-body-sec)",
            color: "var(--text-muted)",
            lineHeight: 1.55,
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            letterSpacing: "-0.003em",
          }}
        >
          {crew.analysis}
        </div>
      )}

      {crew.steps.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
                  padding: "4px 0",
                  borderBottom: i === crew.steps.length - 1 ? "0" : "1px dashed var(--border-color-soft)",
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
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <span className="state-pill" data-tone={crew.verdict.accept ? "ok" : "err"}>
            <span className="state-pill-dot" />
            {crew.verdict.accept ? "✓ critic accepted" : "✗ critic rejected"}
          </span>
          <div
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--sans)",
              fontSize: "var(--t-body-sec)",
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
