import {
  STATE_COLOR, STATE_GLYPH, isStaleRunning, relTime, sourceLabel, stateLabel,
  type Copy, type Task, type TaskState,
} from "./helpers";

// Task bench — WorkbenchCard (the current work target) + task list
// (pending / done / blocked). Pure renderer: props in, callbacks out.
// Geometry flows through the canonical .workbench, .state-pill,
// .kicker and .ledger-row primitives so Terminal reads as part of the
// same organism as Insight / Surface / Archive.

const STATE_TONE: Record<TaskState, "info" | "ok" | "err" | "ghost"> = {
  open: "ghost",
  running: "info",
  done: "ok",
  blocked: "err",
};

interface WorkbenchProps {
  missionTitle: string;
  task: Task | null;
  resumed: boolean;
  copy: Copy;
  lang: "pt" | "en";
  pending: boolean;
  iteration: number;
  elapsed: number;
  openCount: number;
  runningCount: number;
  doneCount: number;
  blockedCount: number;
  staleCount: number;
  onReopen: () => void;
}

export function WorkbenchCard({
  missionTitle, task, resumed, copy, lang, pending, iteration, elapsed,
  openCount, runningCount, doneCount, blockedCount, staleCount, onReopen,
}: WorkbenchProps) {
  // Slim bench bar — replaces the fat .workbench card. One compact row
  // with hairlines above and below; no panel surface. The heavy lifting
  // has moved to the ContextStrip head + term-command input below.
  const stale = task ? isStaleRunning(task) : false;
  const bottleneckBits: string[] = [];
  if (blockedCount > 0) {
    bottleneckBits.push(
      lang === "en"
        ? `${blockedCount} blocked`
        : `${blockedCount} bloqueada${blockedCount === 1 ? "" : "s"}`,
    );
  }
  if (staleCount > 0) {
    bottleneckBits.push(
      lang === "en"
        ? `${staleCount} stale`
        : `${staleCount} parada${staleCount === 1 ? "" : "s"}`,
    );
  }
  const bottleneck = bottleneckBits.length > 0 ? bottleneckBits.join(" · ") : null;

  // Silence unused-prop lint noise while preserving the call signature.
  void missionTitle;

  if (!task) {
    return (
      <div className="fadeIn term-bench" data-empty="true">
        <span className="kicker">{copy.workbench}</span>
        <span className="term-bench-empty">{copy.noActiveTask}</span>
      </div>
    );
  }

  return (
    <div className="fadeIn term-bench">
      <span className="kicker" data-tone="ghost">{copy.workbench}</span>
      <span
        className="status-dot"
        data-tone={STATE_TONE[task.state]}
        data-pulse={pending || task.state === "running" ? "true" : undefined}
      />
      <span
        className="term-bench-title"
        data-done={task.state === "done" ? "true" : undefined}
        title={task.title}
      >
        {task.title}
      </span>

      <StatePill state={task.state} copy={copy} />

      <span className="term-bench-sep">·</span>
      <span
        className="kicker"
        data-tone={stale ? "warn" : "ghost"}
        title={new Date(task.lastUpdateAt).toLocaleString()}
      >
        {relTime(task.lastUpdateAt, lang)}
      </span>

      {pending && (
        <>
          <span className="term-bench-sep">·</span>
          <span className="term-bench-counter">
            <span className="term-bench-counter-label">iter</span>
            <span className="term-bench-counter-value" data-tone="info">{iteration}</span>
          </span>
          <span className="term-bench-counter">
            <span className="term-bench-counter-label">t</span>
            <span className="term-bench-counter-value" data-tone="info">{elapsed.toFixed(1)}s</span>
          </span>
        </>
      )}

      <span className="term-bench-counter" style={{ marginLeft: "auto" }}>
        <span className="term-bench-counter-label">tasks</span>
        <span
          className="term-bench-counter-value"
          data-tone={
            blockedCount > 0 ? "err" :
            runningCount > 0 ? "info" :
            doneCount > 0 ? "ok" : undefined
          }
        >
          {doneCount}/{openCount + runningCount + doneCount + blockedCount}
        </span>
      </span>

      {bottleneck && (
        <span
          className="kicker"
          data-tone="warn"
          title={`⚠ ${bottleneck}`}
        >
          ⚠ {bottleneck}
        </span>
      )}

      {task.state === "blocked" && !pending && (
        <button
          onClick={onReopen}
          className="btn-chip"
          style={{
            color: "var(--cc-warn)",
            borderColor: "color-mix(in oklab, var(--cc-warn) 40%, transparent)",
          }}
        >
          {copy.actionUnblock}
        </button>
      )}

      {resumed && (
        <span className="kicker" data-tone="info" style={{ marginLeft: "auto" }}>
          ↺ {copy.resumeHint}
        </span>
      )}
    </div>
  );
}

interface ListProps {
  tasks: Task[];
  activeTaskId: string | null;
  duplicateTitles: Set<string>;
  copy: Copy;
  onSelect: (id: string) => void;
}

export function TaskList({ tasks, activeTaskId, duplicateTitles, copy, onSelect }: ListProps) {
  const pending = tasks.filter((t) => t.state !== "done" && t.state !== "blocked");
  const blocked = tasks.filter((t) => t.state === "blocked");
  const done = tasks.filter((t) => t.state === "done");

  if (tasks.length === 0) return null;

  return (
    <div style={{ maxWidth: 860, marginBottom: "var(--space-4)" }}>
      {pending.map((t) => (
        <TaskRow
          key={t.id}
          task={t}
          copy={copy}
          active={t.id === activeTaskId}
          duplicate={duplicateTitles.has(t.title)}
          onSelect={() => onSelect(t.id)}
        />
      ))}

      {done.length > 0 && pending.length > 0 && (
        <div style={{ borderTop: "1px solid var(--border-color-soft)", margin: "var(--space-3) 0", opacity: 0.6 }} />
      )}

      {blocked.length > 0 && (
        <>
          <SectionLabel tone="err">✕ {copy.blockedSection} · {blocked.length}</SectionLabel>
          {blocked.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              copy={copy}
              active={t.id === activeTaskId}
              onSelect={() => onSelect(t.id)}
            />
          ))}
        </>
      )}

      {done.length > 0 && (
        <>
          <SectionLabel tone="ok">✓ {copy.doneSection} · {done.length}</SectionLabel>
          {done.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              copy={copy}
              active={t.id === activeTaskId}
              duplicate={duplicateTitles.has(t.title)}
              onSelect={() => onSelect(t.id)}
            />
          ))}
        </>
      )}
    </div>
  );
}

function SectionLabel({ tone, children }: { tone: "ok" | "err"; children: React.ReactNode }) {
  return (
    <div
      className="kicker"
      data-tone={tone}
      style={{ margin: "var(--space-3) 0 var(--space-1)" }}
    >
      {children}
    </div>
  );
}

interface RowProps {
  task: Task;
  onSelect: () => void;
  copy: Copy;
  active?: boolean;
  duplicate?: boolean;
}

function TaskRow({ task, onSelect, copy, active = false, duplicate = false }: RowProps) {
  const isDone = task.state === "done";
  const tone = STATE_TONE[task.state];
  return (
    <div
      onClick={onSelect}
      className="fadeUp ledger-row"
      aria-current={active ? "true" : undefined}
      data-active={active ? "true" : undefined}
      data-tone={tone}
      style={{
        fontFamily: "var(--mono)",
        opacity: isDone ? 0.6 : task.state === "blocked" ? 0.8 : 1,
      }}
    >
      <span style={{ color: STATE_COLOR[task.state], width: 14, marginTop: 1, flexShrink: 0 }}>
        {STATE_GLYPH[task.state]}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: "var(--t-body-sec)",
          color: isDone ? "var(--text-muted)" : "var(--text-primary)",
          textDecoration: isDone ? "line-through" : "none",
          lineHeight: 1.55,
          fontWeight: active ? 500 : 400,
          minWidth: 0,
        }}
      >
        {task.title}
        {duplicate && (
          <span
            title={`task id · ${task.id}`}
            className="kicker"
            data-tone="ghost"
            style={{ marginLeft: 8 }}
          >
            #{task.id.slice(0, 4)}
          </span>
        )}
      </span>
      {active && (
        <span className="kicker" data-tone="accent" style={{ marginTop: 3 }}>
          ◉ {copy.onBench}
        </span>
      )}
      {task.artifactId && (
        <span title={copy.artifactTooltip} style={{ color: "var(--cc-ok)", fontSize: 11, marginTop: 2 }}>◆</span>
      )}
      {task.source !== "manual" && (
        <span className="kicker" data-tone="muted" style={{ marginTop: 3 }}>
          {sourceLabel(task.source, copy)}
        </span>
      )}
      {!active && <StatePill state={task.state} copy={copy} />}
    </div>
  );
}

function StatePill({ state, copy }: { state: TaskState; copy: Copy }) {
  return (
    <span
      title={stateLabel(state, copy)}
      className="state-pill"
      data-tone={STATE_TONE[state]}
    >
      {STATE_GLYPH[state]} {stateLabel(state, copy)}
    </span>
  );
}
