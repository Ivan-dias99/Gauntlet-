import { useState } from "react";
import {
  STATE_COLOR, STATE_GLYPH, isStaleRunning, relTime, sourceLabel, stateLabel,
  type Copy, type Task, type TaskState,
} from "./helpers";

// Task bench — WorkbenchCard (the current work target) + task list
// (pending / done / blocked). Pure renderer: props in, callbacks out.
// Geometry flows through the canonical .workbench, .state-pill,
// .kicker and .ledger-row primitives so Terminal reads as part of the
// same organism as Insight / Surface / Archive.

const STATE_TONE: Record<TaskState, "info" | "ok" | "err" | "ghost" | "warn"> = {
  open: "ghost",
  running: "info",
  // Wave P-29 — paused renders with the warn tone so the row stays
  // visible without escalating to err (blocked).
  paused: "warn",
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
  // Wave P-29 — pause/resume callbacks. Optional so existing call sites
  // that render the bench without the controls (read-only views) don't
  // need to thread no-op handlers.
  onPause?: (taskId: string) => void;
  onResume?: (taskId: string) => void;
}

export function WorkbenchCard({
  missionTitle, task, resumed, copy, lang, pending, iteration, elapsed,
  openCount, runningCount, doneCount, blockedCount, staleCount, onReopen,
  onPause, onResume,
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

      {/* Wave P-29 — pause control surfaces on the active running row.
          Pause is iteration-boundary; the in-flight tool finishes,
          the next iteration sees the flag and the agent emits a
          `paused` event before bailing. */}
      {task.state === "running" && onPause && (
        <button
          onClick={() => onPause(task.id)}
          className="btn-chip"
          style={{
            color: "var(--cc-warn)",
            borderColor: "color-mix(in oklab, var(--cc-warn) 40%, transparent)",
          }}
          title={copy.actionPause}
        >
          {copy.actionPause}
        </button>
      )}

      {task.state === "paused" && onResume && (
        <button
          onClick={() => onResume(task.id)}
          className="btn-chip"
          style={{
            color: "var(--cc-info)",
            borderColor: "color-mix(in oklab, var(--cc-info) 40%, transparent)",
          }}
          title={copy.actionResume}
        >
          {copy.actionResume}
        </button>
      )}

      {task.state === "paused" && task.pauseReason && (
        <span
          className="kicker"
          data-tone="warn"
          title={task.pauseReason}
          style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          · {task.pauseReason}
        </span>
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
  // Wave P-29 — optional pause/resume row controls.
  onPause?: (taskId: string) => void;
  onResume?: (taskId: string) => void;
}

export function TaskList({ tasks, activeTaskId, duplicateTitles, copy, onSelect, onPause, onResume }: ListProps) {
  // Pause is a non-terminal "warm idle" state — it stays in the open
  // section so the operator sees the task they paused next to the
  // others, instead of getting buried below a collapsed banner.
  const open = tasks.filter((t) => t.state !== "done" && t.state !== "blocked");
  const blocked = tasks.filter((t) => t.state === "blocked");
  const done = tasks.filter((t) => t.state === "done");

  // Auto-collapse law: when there is active work (open/running tasks),
  // the eye must stay on what matters. Done and blocked sections start
  // collapsed behind a ghost chip; user expands if needed. When there
  // are no open tasks, both sections expand (the user has nothing else
  // to do anyway).
  const activeWork = open.length > 0;
  const [showDone, setShowDone] = useState(!activeWork);
  const [showBlocked, setShowBlocked] = useState(!activeWork);

  if (tasks.length === 0) return null;

  return (
    <div style={{ maxWidth: 860, marginBottom: "var(--space-4)" }}>
      {open.map((t) => (
        <TaskRow
          key={t.id}
          task={t}
          copy={copy}
          active={t.id === activeTaskId}
          duplicate={duplicateTitles.has(t.title)}
          onSelect={() => onSelect(t.id)}
          onPause={onPause}
          onResume={onResume}
        />
      ))}

      {done.length > 0 && open.length > 0 && (
        <div style={{ borderTop: "1px solid var(--border-color-soft)", margin: "var(--space-3) 0", opacity: 0.6 }} />
      )}

      {blocked.length > 0 && (
        <>
          <CollapseHeader
            tone="err"
            glyph="✕"
            label={copy.blockedSection}
            count={blocked.length}
            expanded={showBlocked}
            onToggle={() => setShowBlocked((v) => !v)}
          />
          {showBlocked && blocked.map((t) => (
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
          <CollapseHeader
            tone="ok"
            glyph="✓"
            label={copy.doneSection}
            count={done.length}
            expanded={showDone}
            onToggle={() => setShowDone((v) => !v)}
          />
          {showDone && done.map((t) => (
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

function CollapseHeader({
  tone, glyph, label, count, expanded, onToggle,
}: {
  tone: "ok" | "err";
  glyph: string;
  label: string;
  count: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="kicker"
      data-tone={tone}
      style={{
        background: "transparent",
        border: 0,
        padding: "var(--space-2) 0 var(--space-1)",
        margin: "var(--space-3) 0 0",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        textAlign: "left",
      }}
      aria-expanded={expanded}
    >
      <span style={{ opacity: 0.8 }}>{expanded ? "▾" : "▸"}</span>
      <span>{glyph} {label}</span>
      <span data-tone="ghost" style={{ color: "var(--text-ghost)" }}>· {count}</span>
    </button>
  );
}

interface RowProps {
  task: Task;
  onSelect: () => void;
  copy: Copy;
  active?: boolean;
  duplicate?: boolean;
  // Wave P-29 — passed through from TaskList. When undefined, the
  // controls don't render (back-compat for the blocked / done sections
  // that don't expose pause).
  onPause?: (taskId: string) => void;
  onResume?: (taskId: string) => void;
}

function TaskRow({ task, onSelect, copy, active = false, duplicate = false, onPause, onResume }: RowProps) {
  const isDone = task.state === "done";
  const tone = STATE_TONE[task.state];
  const displayState = task.state === "done" && task.artifactId ? "sealed" : stateLabel(task.state, copy);
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
      {/* Wave P-29 — inline pause/resume buttons. They never render on
          done / blocked rows because the parent only threads handlers
          to the open section. Keep them small (kicker class) so a long
          row doesn't reflow when state flips. */}
      {task.state === "running" && onPause && (
        <button
          onClick={(e) => { e.stopPropagation(); onPause(task.id); }}
          className="kicker"
          data-tone="warn"
          style={{
            background: "transparent",
            border: 0,
            cursor: "pointer",
            padding: "2px 6px",
            color: "var(--cc-warn)",
          }}
          title={copy.actionPause}
        >
          {copy.actionPause}
        </button>
      )}
      {task.state === "paused" && onResume && (
        <button
          onClick={(e) => { e.stopPropagation(); onResume(task.id); }}
          className="kicker"
          data-tone="info"
          style={{
            background: "transparent",
            border: 0,
            cursor: "pointer",
            padding: "2px 6px",
            color: "var(--cc-info)",
          }}
          title={copy.actionResume}
        >
          {copy.actionResume}
        </button>
      )}
      {!active && <StatePill state={task.state} copy={copy} labelOverride={displayState} />}
    </div>
  );
}

function StatePill({ state, copy, labelOverride }: { state: TaskState; copy: Copy; labelOverride?: string }) {
  return (
    <span
      title={labelOverride ?? stateLabel(state, copy)}
      className="state-pill"
      data-tone={STATE_TONE[state]}
    >
      {STATE_GLYPH[state]} {labelOverride ?? stateLabel(state, copy)}
    </span>
  );
}
