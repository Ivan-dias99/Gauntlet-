import {
  STATE_COLOR, STATE_GLYPH, isStaleRunning, relTime, sourceLabel, stateLabel,
  type Copy, type Task, type TaskState,
} from "./helpers";

// Task bench — WorkbenchCard (the current work target) + task list
// (pending / done / blocked). Pure renderer: props in, callbacks out.
// The kanban variant was dropped when TweaksPanel went away in Wave 2;
// this is the operational view and the only one we ship.

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
  const isLive = pending || (task !== null && task.state === "running");
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
  return (
    <div
      className="fadeIn surface-flagship"
      style={{
        maxWidth: 820,
        marginBottom: "var(--space-3)",
        borderLeft: `2px solid ${task ? STATE_COLOR[task.state] : "var(--border-soft)"}`,
        padding: "var(--space-4) var(--space-4)",
        fontFamily: "var(--mono)",
        boxShadow: isLive ? "var(--shadow-panel)" : "var(--shadow-soft)",
        transition: "box-shadow .3s var(--ease-swift), border-color .2s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
          fontSize: 9,
          letterSpacing: "var(--track-meta)",
          textTransform: "uppercase",
          color: "var(--text-ghost)",
        }}
      >
        <span>{copy.workbench}</span>
        <span style={{ color: "var(--border-soft)" }}>/</span>
        <span
          style={{
            color: "var(--text-secondary)",
            letterSpacing: 1,
            textTransform: "none",
            maxWidth: 260,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {missionTitle}
        </span>
        {resumed && task && (
          <span style={{ marginLeft: "auto", color: "var(--cc-info)", letterSpacing: "var(--track-meta)" }}>
            ↺ {copy.resumeHint}
          </span>
        )}
      </div>

      {task ? (
        <>
          <div
            style={{
              fontSize: 17,
              fontFamily: "var(--sans)",
              fontWeight: task.state === "done" ? 400 : 500,
              color: task.state === "done" ? "var(--text-muted)" : "var(--text-primary)",
              lineHeight: 1.4,
              marginBottom: 12,
              letterSpacing: "-0.005em",
              textDecoration: task.state === "done" ? "line-through" : "none",
            }}
          >
            {task.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <StateChip state={task.state} copy={copy} />
            <span style={{ fontSize: 9, letterSpacing: "var(--track-meta)", color: "var(--text-ghost)", textTransform: "uppercase" }}>
              {sourceLabel(task.source, copy)}
            </span>
            <span
              title={new Date(task.lastUpdateAt).toLocaleString()}
              style={{ fontSize: 10, color: stale ? "var(--cc-warn)" : "var(--text-ghost)" }}
            >
              · {relTime(task.lastUpdateAt, lang)}
            </span>
            {stale && (
              <span style={{ fontSize: 9, letterSpacing: "var(--track-meta)", color: "var(--cc-warn)", textTransform: "uppercase" }}>
                ⚠ {lang === "en" ? "stalled" : "parada"}
              </span>
            )}
            {task.artifactId && (
              <span style={{ fontSize: 10, color: "var(--cc-ok)", letterSpacing: "var(--track-meta)", textTransform: "uppercase" }}>
                {copy.artifactChip}
              </span>
            )}
            {pending && (
              <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--cc-info)" }}>
                ● iter {iteration} · {elapsed.toFixed(1)}s
              </span>
            )}
            {task.state === "blocked" && !pending && (
              <button
                onClick={onReopen}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "1px solid var(--cc-warn)",
                  color: "var(--cc-warn)",
                  fontSize: 9,
                  letterSpacing: "var(--track-meta)",
                  textTransform: "uppercase",
                  padding: "3px 10px",
                  borderRadius: "var(--radius-pill)",
                  fontFamily: "var(--mono)",
                  cursor: "pointer",
                }}
              >
                {copy.actionUnblock}
              </button>
            )}
          </div>
        </>
      ) : (
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic", fontFamily: "var(--sans)" }}>
          {copy.noActiveTask}
        </div>
      )}

      <div
        style={{
          marginTop: "var(--space-2)",
          paddingTop: "var(--space-2)",
          borderTop: "1px solid var(--border-soft)",
          display: "flex",
          gap: 14,
          fontSize: 9,
          letterSpacing: "var(--track-meta)",
          textTransform: "uppercase",
          color: "var(--text-ghost)",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span>{copy.taskStateOpen}: {openCount}</span>
        <span style={{ color: runningCount > 0 ? "var(--cc-info)" : undefined }}>
          {copy.taskStateRunning}: {runningCount}
        </span>
        <span style={{ color: doneCount > 0 ? "var(--cc-ok)" : undefined }}>
          {copy.taskStateDone}: {doneCount}
        </span>
        <span style={{ color: blockedCount > 0 ? "var(--cc-err)" : undefined }}>
          {copy.taskStateBlocked}: {blockedCount}
        </span>
        {bottleneck && (
          <span
            style={{
              marginLeft: "auto",
              color: "var(--cc-warn)",
              letterSpacing: "var(--track-meta)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>⚠</span>
            <span>{lang === "en" ? "bottleneck" : "gargalo"}: {bottleneck}</span>
          </span>
        )}
      </div>
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
    <div style={{ maxWidth: 820, marginBottom: 20 }}>
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
        <div style={{ borderTop: "1px solid var(--border)", margin: "14px 0", opacity: 0.4 }} />
      )}

      {blocked.length > 0 && (
        <>
          <SectionLabel color="var(--cc-err)">✕ {copy.blockedSection} · {blocked.length}</SectionLabel>
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
          <SectionLabel color="var(--cc-ok)">✓ {copy.doneSection} · {done.length}</SectionLabel>
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

function SectionLabel({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 9,
        letterSpacing: "var(--track-meta)",
        color,
        fontFamily: "var(--mono)",
        margin: "14px 0 6px",
        textTransform: "uppercase",
        opacity: 0.7,
      }}
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
  const isBlocked = task.state === "blocked";
  return (
    <div
      onClick={onSelect}
      className="fadeUp"
      aria-current={active ? "true" : undefined}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "11px 0 11px 12px",
        borderBottom: "1px solid var(--border-soft)",
        borderLeft: active
          ? "2px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 85%, transparent)"
          : "2px solid transparent",
        background: active
          ? "color-mix(in oklab, var(--chamber-dna, var(--accent)) 8%, transparent)"
          : "transparent",
        cursor: "pointer",
        fontFamily: "var(--mono)",
        opacity: isDone ? 0.55 : isBlocked ? 0.75 : 1,
        transition: "padding-left .28s var(--ease-swift), opacity .2s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = active ? "16px" : "18px"; }}
      onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = "12px"; }}
    >
      <span style={{ fontSize: 13, color: STATE_COLOR[task.state], width: 14, marginTop: 1 }}>
        {STATE_GLYPH[task.state]}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: 13,
          color: isDone ? "var(--cc-dim)" : "var(--cc-fg)",
          textDecoration: isDone ? "line-through" : "none",
          lineHeight: 1.55,
          fontWeight: active ? 500 : 400,
        }}
      >
        {task.title}
        {duplicate && (
          <span
            title={`task id · ${task.id}`}
            style={{ marginLeft: 8, fontSize: 11, color: "var(--text-ghost)", letterSpacing: 1 }}
          >
            #{task.id.slice(0, 4)}
          </span>
        )}
      </span>
      {active && (
        <span
          style={{
            fontSize: 9,
            letterSpacing: "var(--track-meta)",
            color: "var(--chamber-dna, var(--accent))",
            textTransform: "uppercase",
            marginTop: 3,
          }}
        >
          ◉ {copy.onBench}
        </span>
      )}
      {task.artifactId && (
        <span title={copy.artifactTooltip} style={{ color: "var(--cc-ok)", fontSize: 11, marginTop: 2 }}>◆</span>
      )}
      {task.source !== "manual" && (
        <span
          style={{
            fontSize: 9,
            letterSpacing: "var(--track-meta)",
            color: "var(--accent-dim)",
            textTransform: "uppercase",
            marginTop: 3,
          }}
        >
          {sourceLabel(task.source, copy)}
        </span>
      )}
      {!active && <StateChip state={task.state} copy={copy} />}
    </div>
  );
}

function StateChip({ state, copy }: { state: TaskState; copy: Copy }) {
  return (
    <span
      title={stateLabel(state, copy)}
      style={{
        fontSize: 9,
        letterSpacing: "var(--track-meta)",
        textTransform: "uppercase",
        color: STATE_COLOR[state],
        border: `1px solid ${STATE_COLOR[state]}`,
        padding: "1px 6px",
        borderRadius: "var(--radius-pill)",
        fontFamily: "var(--mono)",
        whiteSpace: "nowrap",
      }}
    >
      {STATE_GLYPH[state]} {stateLabel(state, copy)}
    </span>
  );
}
