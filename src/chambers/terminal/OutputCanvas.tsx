import type { Artifact, Mission } from "../../spine/types";
import {
  ROLE_COLOR,
  type Copy,
  type CrewState,
  type DoneSummary,
  type LiveTool,
  type RunMode,
  type Task,
  type ToolPhase,
} from "./helpers";

// Editorial output canvas. Zero wrapper cards. Content flows onto the
// chamber body as a typographic column (max 820px) with serif display
// titles, sans body, mono micro section labels, mono execution rows.
// Five states: ready · brief · pending · done · error.
// Every string flows through the copy catalog so i18n stays clean.

interface Props {
  copy: Copy;
  mission: Mission | null;
  activeTask: Task | null;
  lastTask: string;
  pending: boolean;
  iteration: number;
  elapsed: number;
  liveText: string;
  liveTools: LiveTool[];
  done: DoneSummary | null;
  accepted: boolean;
  err: string | null;
  crew: CrewState;
  mode: RunMode;
  artifacts: Artifact[];
  onAccept: () => void;
  onReplayArtifact: (a: Artifact) => void;
  canAccept: boolean;
}

export default function OutputCanvas({
  copy, mission, activeTask, lastTask, pending, iteration, elapsed,
  liveText, liveTools, done, accepted, err, crew, mode,
  artifacts, onAccept, onReplayArtifact, canAccept,
}: Props) {
  if (err) {
    return <ErrorState copy={copy} message={err} activeTaskTitle={activeTask?.title ?? lastTask} />;
  }
  if (pending) {
    return (
      <PendingState
        copy={copy}
        activeTask={activeTask}
        lastTask={lastTask}
        iteration={iteration}
        elapsed={elapsed}
        liveText={liveText}
        liveTools={liveTools}
        crew={crew}
        mode={mode}
      />
    );
  }
  if (done) {
    return (
      <DoneState
        copy={copy}
        activeTask={activeTask}
        lastTask={lastTask}
        done={done}
        liveTools={liveTools}
        crew={crew}
        accepted={accepted}
        canAccept={canAccept}
        onAccept={onAccept}
      />
    );
  }
  if (!mission) {
    return <ReadyState copy={copy} artifacts={artifacts} onReplay={onReplayArtifact} />;
  }
  return <BriefState copy={copy} mission={mission} artifacts={artifacts} onReplay={onReplayArtifact} />;
}

// ——— Ready (no mission) ———
// Densified: serif title + lead + three quick-tip rows + recent artifacts.
// No big empty space between Ready and the composer.
function ReadyState({
  copy, artifacts, onReplay,
}: {
  copy: Copy;
  artifacts: Artifact[];
  onReplay: (a: Artifact) => void;
}) {
  return (
    <div className="term-output">
      <div className="term-output-head">
        <h1 className="term-output-title">{copy.termReadyTitle}</h1>
      </div>
      <p className="term-output-lead">{copy.termReadyLead}</p>
      <section className="term-output-section">
        <span className="term-output-section-label">{copy.nextStep}</span>
        <ul className="term-output-list">
          <li>{copy.termReadyTipDeclare}</li>
          <li>{copy.termReadyTipMission}</li>
          <li>{copy.termReadyTipDoctrine}</li>
        </ul>
      </section>
      <PreviousArtifacts copy={copy} artifacts={artifacts} onReplay={onReplay} />
    </div>
  );
}

// ——— Brief (mission active, no task yet) ———
function BriefState({
  copy, mission, artifacts, onReplay,
}: {
  copy: Copy;
  mission: Mission;
  artifacts: Artifact[];
  onReplay: (a: Artifact) => void;
}) {
  const done = mission.tasks?.filter((t) => t.state === "done").length ?? 0;
  const total = mission.tasks?.length ?? 0;
  const pending = total - done;

  return (
    <div className="term-output">
      <div className="term-output-head">
        <h1 className="term-output-title-mono">
          {copy.termBriefKicker}:{" "}
          <span style={{ color: "var(--chamber-dna, var(--ember))" }}>{mission.title}</span>
        </h1>
      </div>
      <p className="term-output-lead">{copy.termBriefLead}</p>

      {total > 0 && (
        <section className="term-output-section">
          <span className="term-output-section-label">{copy.workbench}</span>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: "var(--t-body-sec)",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
            }}
          >
            {copy.termBriefTasks(done, pending, total)}
          </div>
        </section>
      )}
      <PreviousArtifacts copy={copy} artifacts={artifacts} onReplay={onReplay} />
    </div>
  );
}

// ——— Pending (streaming) ———
function PendingState({
  copy, activeTask, lastTask, iteration, elapsed,
  liveText, liveTools, crew, mode,
}: {
  copy: Copy;
  activeTask: Task | null;
  lastTask: string;
  iteration: number;
  elapsed: number;
  liveText: string;
  liveTools: LiveTool[];
  crew: CrewState;
  mode: RunMode;
}) {
  const title = activeTask?.title || lastTask || copy.termPendingTitleFallback;

  return (
    <div className="term-output">
      <div className="term-output-head">
        <h1 className="term-output-title-mono">{title}</h1>
        <span className="term-output-pill" data-tone="info">
          <span className="term-output-pill-glyph">●</span>
          {copy.taskStateRunning} · iter {iteration} · {elapsed.toFixed(1)}s
        </span>
      </div>

      {mode === "crew" && crew.steps.length > 0 && (
        <section className="term-output-section">
          <span className="term-output-section-label">{copy.termSectionPlan}</span>
          <ul className="term-output-list">
            {crew.steps.map((s, i) => (
              <li
                key={i}
                style={{
                  opacity: crew.rolesRun.includes(s.role) || crew.currentRole === s.role ? 1 : 0.55,
                }}
              >
                <span
                  style={{
                    color: ROLE_COLOR[s.role],
                    fontFamily: "var(--mono)",
                    fontSize: "var(--t-micro)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {s.role}
                </span>{" "}
                — {s.goal}
              </li>
            ))}
          </ul>
        </section>
      )}

      {liveTools.length > 0 && (
        <section className="term-output-section">
          <span className="term-output-section-label">{copy.termSectionExecLog}</span>
          <div className="term-output-log">
            {liveTools.map((tc) => (
              <LogRow
                key={tc.id}
                name={tc.name}
                input={tc.input}
                phase={tc.ok === undefined ? "running" : tc.ok ? "ok" : "err"}
                preview={tc.preview}
              />
            ))}
          </div>
        </section>
      )}

      {liveText && (
        <section className="term-output-section">
          <span className="term-output-section-label">{copy.termSectionStreaming}</span>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 13,
              lineHeight: 1.7,
              color: "var(--cc-fg)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {liveText}
            <span className="cc-cursor working" />
          </div>
        </section>
      )}
    </div>
  );
}

// ——— Done ———
function DoneState({
  copy, activeTask, lastTask, done, liveTools, crew,
  accepted, canAccept, onAccept,
}: {
  copy: Copy;
  activeTask: Task | null;
  lastTask: string;
  done: DoneSummary;
  liveTools: LiveTool[];
  crew: CrewState;
  accepted: boolean;
  canAccept: boolean;
  onAccept: () => void;
}) {
  const title = activeTask?.title || lastTask || copy.termDoneTitleFallback;
  const leadFromAnswer = (() => {
    const trimmed = done.answer.trim();
    if (!trimmed) return null;
    const firstBlock = trimmed.split(/\n\n+/)[0];
    return firstBlock.length > 320 ? firstBlock.slice(0, 317).trimEnd() + "…" : firstBlock;
  })();
  const remainingAnswer = (() => {
    const trimmed = done.answer.trim();
    if (!trimmed || !leadFromAnswer) return null;
    const remainder = trimmed.slice(leadFromAnswer.length).trim();
    return remainder || null;
  })();

  const pillTone = done.terminated_early ? "warn" : "ok";
  const pillLabel = done.terminated_early ? copy.termPartialPill : copy.termLivePill;

  return (
    <div className="term-output">
      <div className="term-output-head">
        <h1 className="term-output-title-mono">{title}</h1>
        <span className="term-output-pill" data-tone={pillTone}>
          <span className="term-output-pill-glyph">{done.terminated_early ? "⚠" : "✓"}</span>
          {pillLabel}
        </span>
      </div>

      {leadFromAnswer && <p className="term-output-lead">{leadFromAnswer}</p>}

      {crew.steps.length > 0 && (
        <section className="term-output-section">
          <span className="term-output-section-label">{copy.termSectionPlan}</span>
          <ul className="term-output-list">
            {crew.steps.map((s, i) => (
              <li key={i}>
                <span
                  style={{
                    color: ROLE_COLOR[s.role],
                    fontFamily: "var(--mono)",
                    fontSize: "var(--t-micro)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {s.role}
                </span>{" "}
                — {s.goal}
              </li>
            ))}
          </ul>
        </section>
      )}

      {liveTools.length > 0 && (
        <section className="term-output-section">
          <span className="term-output-section-label">{copy.termSectionExecLog}</span>
          <div className="term-output-log">
            {liveTools.map((tc) => (
              <LogRow
                key={tc.id}
                name={tc.name}
                input={tc.input}
                phase={tc.ok === undefined ? "running" : tc.ok ? "ok" : "err"}
                preview={tc.preview}
              />
            ))}
            <div
              style={{
                paddingTop: 4,
                fontFamily: "var(--mono)",
                fontSize: "var(--t-micro)",
                letterSpacing: "var(--track-meta)",
                color: "var(--text-ghost)",
              }}
            >
              {copy.termRunSummary(done.iterations, done.tool_count, done.processing_time_ms)}
            </div>
          </div>
        </section>
      )}

      {remainingAnswer && (
        <section className="term-output-section">
          <span className="term-output-section-label">{copy.termSectionNotes}</span>
          <div
            style={{
              fontFamily: "var(--sans)",
              fontSize: "var(--t-body-sec)",
              lineHeight: 1.65,
              color: "var(--text-secondary)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {remainingAnswer}
          </div>
        </section>
      )}

      <section className="term-output-section">
        <span className="term-output-section-label">{copy.termSectionResult}</span>
        <div className="term-output-result">
          <div className="term-output-result-body">
            {done.terminated_early
              ? copy.termResultPartial(done.termination_reason)
              : accepted
              ? copy.termResultSealed
              : copy.termResultReady}
          </div>
          {canAccept && !accepted && (
            <button className="term-output-result-link" onClick={onAccept}>
              {copy.acceptArtifact} ↗
            </button>
          )}
          {accepted && (
            <span className="term-output-result-link" aria-disabled>
              {copy.artifactSealed}
            </span>
          )}
        </div>
      </section>
    </div>
  );
}

// ——— Error ———
function ErrorState({
  copy, message, activeTaskTitle,
}: {
  copy: Copy;
  message: string;
  activeTaskTitle: string;
}) {
  return (
    <div className="term-output">
      <div className="term-output-head">
        <h1 className="term-output-title-mono">
          {activeTaskTitle || copy.termErrorTitleFallback}
        </h1>
        <span className="term-output-pill" data-tone="warn">
          <span className="term-output-pill-glyph">⚠</span>
          {copy.termErrorPill}
        </span>
      </div>
      <p className="term-output-lead">{copy.termErrorLead}</p>
      <section className="term-output-section">
        <span className="term-output-section-label">{copy.termSectionMessage}</span>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 12.5,
            lineHeight: 1.6,
            color: "var(--cc-err)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {message}
        </div>
      </section>
    </div>
  );
}

// ——— Previous artifacts footer ———
function PreviousArtifacts({
  copy, artifacts, onReplay,
}: {
  copy: Copy;
  artifacts: Artifact[];
  onReplay: (a: Artifact) => void;
}) {
  if (artifacts.length === 0) return null;
  const shown = artifacts.slice(0, 4);
  return (
    <section className="term-output-section">
      <span className="term-output-section-label">{copy.termSectionRecent}</span>
      <div className="term-output-log">
        {shown.map((a) => {
          const preview = a.answer
            ? a.answer.length > 80 ? a.answer.slice(0, 77).trimEnd() + "…" : a.answer
            : "—";
          return (
            <button
              key={a.id}
              onClick={() => a.taskId && onReplay(a)}
              disabled={!a.taskId}
              className="term-output-log-row"
              style={{
                background: "transparent",
                border: 0,
                padding: "4px 0",
                cursor: a.taskId ? "pointer" : "default",
                textAlign: "left",
              }}
              data-phase={a.terminatedEarly ? "err" : "ok"}
            >
              <span className="term-output-log-time">{fmtRelShort(a.acceptedAt)}</span>
              <span className="term-output-log-cmd">{a.taskTitle}</span>
              <span className="term-output-log-sep">|</span>
              <span className="term-output-log-meta">{preview}</span>
              <span className="term-output-log-status">
                {a.terminatedEarly ? copy.termArtifactPartial : copy.termArtifactSealedShort}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ——— Log row ———
// Chooses a layout variant based on the tool kind:
//   · read_file / list_directory → file variant (icon + action + path + count)
//   · anything else              → todo variant (icon + one-line action)
// Both keep the same grid framework so rows align cleanly.
function LogRow({
  name, input, phase, preview,
}: {
  name: string;
  input?: unknown;
  phase: ToolPhase;
  preview?: string;
}) {
  const inputObj = (input && typeof input === "object") ? (input as Record<string, unknown>) : {};
  const rawPath = typeof inputObj.path === "string" ? inputObj.path
                : typeof inputObj.file === "string" ? inputObj.file
                : typeof inputObj.file_path === "string" ? inputObj.file_path
                : null;
  const isFileOp = Boolean(rawPath);

  // Line count: prefer explicit line count preview, else fall back to
  // string length indicator. Display-only.
  const countLabel = (() => {
    if (!preview) return null;
    const match = /(\d+)\s*(lines?|linhas?)/i.exec(preview);
    if (match) return `${match[1]} linhas`;
    if (preview.length > 0) return null;
    return null;
  })();

  if (isFileOp && rawPath) {
    const displayName = humanizeToolName(name);
    return (
      <div className="term-output-log-row" data-variant="file" data-phase={phase}>
        <span className="term-output-log-icon" aria-hidden><IconFile /></span>
        <span className="term-output-log-action">{displayName}</span>
        <span className="term-output-log-path" title={rawPath}>{rawPath}</span>
        <span className="term-output-log-count">
          {countLabel ?? (phase === "ok" ? "✓" : phase === "err" ? "✕" : "…")}
        </span>
      </div>
    );
  }

  // Fallback — compact todo-style row
  const displayName = humanizeToolName(name);
  const childLines = extractChildLines(inputObj);
  return (
    <>
      <div className="term-output-log-row" data-variant="todo" data-phase={phase}>
        <span className="term-output-log-icon" aria-hidden><IconCheck /></span>
        <span className="term-output-log-action">{displayName}</span>
      </div>
      {childLines.length > 0 && (
        <ul className="term-output-log-children">
          {childLines.map((ln, i) => <li key={i}>{ln}</li>)}
        </ul>
      )}
    </>
  );
}

// Humanize tool_use names into editorial verbs.
function humanizeToolName(name: string): string {
  const map: Record<string, string> = {
    read_file: "Read",
    list_directory: "List",
    run_command: "Run",
    execute_python: "Execute",
    web_fetch: "Fetch",
    web_search: "Search",
    git: "Git",
    update_todos: "Update Todos",
  };
  return map[name] ?? name;
}

function extractChildLines(input: Record<string, unknown>): string[] {
  const raw = input.todos ?? input.items ?? input.steps;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x) => typeof x === "string" ? x : (x as { title?: string; text?: string }).title ?? (x as { text?: string }).text ?? "")
    .filter(Boolean)
    .slice(0, 4);
}

// ——— Inline SVG icon set (canvas) ———
// Same family as WorkbenchStrip/Composer: viewBox 24, stroke 1.75,
// currentColor. Ensures a single iconographic language inside Terminal.
const SVG_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};
function IconFile() {
  return (
    <svg width={16} height={16} {...SVG_PROPS}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width={16} height={16} {...SVG_PROPS}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
// ——— helpers ———
function fmtRelShort(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "now";
  const m = Math.round(diff / 60_000);
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}
