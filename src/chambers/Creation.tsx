import { useRef, useState, useEffect, useMemo } from "react";
import { useSpine } from "../spine/SpineContext";
import { useRuberra, AgentEvent, CrewEvent, CrewRole, CrewPlanStep } from "../hooks/useRuberra";
import { useBackendStatus } from "../hooks/useBackendStatus";
import { useTweaks } from "../tweaks/TweaksContext";
import { useCopy } from "../i18n/copy";
import { Artifact, Task, TaskState } from "../spine/types";
import ErrorPanel from "../shell/ErrorPanel";
import DormantPanel from "../shell/DormantPanel";

type RunMode = "agent" | "crew";

// A running task that hasn't received an event in this long is treated as
// stale: the stream almost certainly died (reload, crash, network) even if
// the persisted state still says "running". The bancada flags it so the user
// sees the jam instead of staring at a silent ● forever.
const STALE_RUNNING_MS = 120_000;

// Short, operational relative-time string. The goal is "is this fresh or
// rotting?" at a glance — not a precise timestamp.
function relTime(ms: number, lang: "pt" | "en"): string {
  const diff = Math.max(0, Date.now() - ms);
  if (diff < 45_000) return lang === "en" ? "just now" : "agora";
  const min = Math.round(diff / 60_000);
  if (min < 60) return lang === "en" ? `${min}m ago` : `há ${min}m`;
  const hr = Math.round(min / 60);
  if (hr < 24) return lang === "en" ? `${hr}h ago` : `há ${hr}h`;
  const d = Math.round(hr / 24);
  return lang === "en" ? `${d}d ago` : `há ${d}d`;
}

function isStaleRunning(task: Task): boolean {
  return task.state === "running" && (Date.now() - task.lastUpdateAt) > STALE_RUNNING_MS;
}

interface LiveTool {
  id: string;
  name: string;
  input?: unknown;
  iteration: number;
  ok?: boolean;
  preview?: string;
  role?: CrewRole;
}

interface DoneSummary {
  answer: string;
  iterations: number;
  tool_count: number;
  processing_time_ms: number;
  terminated_early: boolean;
  termination_reason: string | null;
}

interface CrewState {
  analysis: string;
  steps: CrewPlanStep[];
  currentRole: CrewRole | null;
  rolesRun: CrewRole[];
  verdict: { accept: boolean; issues: string[]; summary: string; refinement: number } | null;
  refinements: number;
}

const EMPTY_CREW: CrewState = {
  analysis: "",
  steps: [],
  currentRole: null,
  rolesRun: [],
  verdict: null,
  refinements: 0,
};

export default function Creation() {
  const {
    activeMission, addTask, setTaskState, addNoteToMission,
    acceptArtifact, principles, logDoctrineApplied,
  } = useSpine();
  const { streamDev, streamCrew, pending, unreachable } = useRuberra();
  const backend = useBackendStatus();
  const { values } = useTweaks();
  const copy = useCopy();
  const layout = values.creationLayout;
  const [input, setInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [lastTask, setLastTask] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [iteration, setIteration] = useState(0);
  const [liveTools, setLiveTools] = useState<LiveTool[]>([]);
  const [liveText, setLiveText] = useState("");
  const [done, setDone] = useState<DoneSummary | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [mode, setMode] = useState<RunMode>("agent");
  const [crew, setCrew] = useState<CrewState>(EMPTY_CREW);
  // Session-only guard against double-click on the accept button inside the
  // current done panel. Persisted acceptance is on spine.activeMission.lastArtifact.
  const [accepted, setAccepted] = useState(false);
  // The task on the workbench. Resumed from spine on mount / mission switch,
  // advanced by the next-step actions.
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  // Mirror of activeTaskId in a ref. The streaming event callbacks are
  // created once per submit() and outlive the render that scheduled them;
  // reading the id through this ref defeats the stale-closure bug where an
  // error mid-run would blame the previously-active task instead of the
  // task that actually failed.
  const activeTaskIdRef = useRef<string | null>(null);
  // True when activeTaskId was picked up from persisted state (not created in
  // this session) — used to show a discreet "resume" cue.
  const [resumedFromSpine, setResumedFromSpine] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const outRef = useRef<HTMLDivElement>(null);

  useEffect(() => { activeTaskIdRef.current = activeTaskId; }, [activeTaskId]);

  useEffect(() => {
    if (!pending) return;
    const start = Date.now();
    const id = setInterval(() => setElapsed((Date.now() - start) / 1000), 100);
    return () => clearInterval(id);
  }, [pending]);

  useEffect(() => {
    outRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [liveText, liveTools.length, done]);

  // Resume: on mount or mission switch, if no active task was picked this
  // session, re-acquire one from spine — prefer a task already "running",
  // then the oldest open task (FIFO, matching → próxima tarefa). Stale
  // pointers (done/blocked, or to a task that left this mission) are dropped
  // so the workbench advances on re-entry instead of holding expired work.
  useEffect(() => {
    if (!activeMission) {
      setActiveTaskId(null);
      setResumedFromSpine(false);
      return;
    }
    // Keep the tracked task only if it still exists here and is still pending.
    const current = activeTaskId
      ? activeMission.tasks.find(t => t.id === activeTaskId)
      : null;
    if (current && (current.state === "running" || current.state === "open")) return;
    const running = activeMission.tasks.find(t => t.state === "running");
    const open = activeMission.tasks.find(t => t.state === "open");
    const pick = running ?? open ?? null;
    setActiveTaskId(pick?.id ?? null);
    setResumedFromSpine(pick !== null);
  }, [activeMission?.id]);  // eslint-disable-line react-hooks/exhaustive-deps

  function handleAgentEvent(ev: AgentEvent, role?: CrewRole) {
    switch (ev.type) {
      case "iteration":
        setIteration(ev.n);
        break;
      case "assistant_text":
        setLiveText((prev) => (prev ? prev + "\n\n" : "") + ev.text);
        break;
      case "tool_use":
        setLiveTools((prev) => [
          ...prev,
          { id: ev.id, name: ev.name, input: ev.input, iteration: ev.iteration, role },
        ]);
        break;
      case "tool_result":
        setLiveTools((prev) => {
          const hit = prev.findIndex((t) => t.id === ev.id);
          // Frame reordering on the SSE wire is rare but possible. If the
          // result arrived before its tool_use frame, a plain map() would
          // silently swallow it — honesty-law violation. Insert a
          // placeholder row instead so the user sees the orphan.
          if (hit < 0) {
            return [
              ...prev,
              { id: ev.id, name: "?", iteration: ev.iteration, ok: ev.ok, preview: ev.preview, role },
            ];
          }
          const next = prev.slice();
          next[hit] = { ...next[hit], ok: ev.ok, preview: ev.preview };
          return next;
        });
        break;
      case "done":
        setDone({
          answer: ev.answer,
          iterations: ev.iterations,
          tool_count: ev.tool_calls.length,
          processing_time_ms: ev.processing_time_ms,
          terminated_early: ev.terminated_early,
          termination_reason: ev.termination_reason,
        });
        break;
      case "error": {
        // Prefer the typed backend envelope fields (T076) over the raw
        // message when available — "engine_error · triad timed out" tells
        // the user more than "triad timed out" alone, and shields the UI
        // from interpreting an exception string as a reason.
        const tagged = ev.error
          ? `${ev.error}${ev.reason ? ` · ${ev.reason}` : ""} — ${ev.message}`
          : ev.message;
        setErr(tagged);
        if (activeTaskIdRef.current) setTaskState(activeTaskIdRef.current, "blocked");
        break;
      }
    }
  }

  function handleCrewEvent(ev: CrewEvent) {
    switch (ev.type) {
      case "crew_start":
        setCrew({ ...EMPTY_CREW });
        break;
      case "plan":
        setCrew((prev) => ({ ...prev, analysis: ev.analysis, steps: ev.steps }));
        break;
      case "role_start":
        setCrew((prev) => ({ ...prev, currentRole: ev.role }));
        break;
      case "role_event":
        // Inner agent event from a specialist — reuse the agent renderer
        handleAgentEvent(ev.event, ev.role);
        break;
      case "role_done":
        setCrew((prev) => ({
          ...prev,
          rolesRun: prev.rolesRun.includes(ev.role)
            ? prev.rolesRun
            : [...prev.rolesRun, ev.role],
          currentRole: null,
        }));
        break;
      case "critic_verdict":
        setCrew((prev) => ({
          ...prev,
          verdict: {
            accept: ev.accept,
            issues: ev.issues,
            summary: ev.summary,
            refinement: ev.refinement,
          },
          refinements: ev.refinement,
        }));
        break;
      case "done":
        setDone({
          answer: ev.answer,
          iterations: ev.refinements,
          tool_count: ev.roles_run.length,
          processing_time_ms: ev.processing_time_ms,
          terminated_early: !ev.accepted,
          termination_reason: ev.accepted ? null : "critic rejected after refinement",
        });
        setCrew((prev) => ({ ...prev, rolesRun: ev.roles_run, refinements: ev.refinements }));
        break;
      case "error": {
        // Prefer the typed backend envelope fields (T076) over the raw
        // message when available — "engine_error · triad timed out" tells
        // the user more than "triad timed out" alone, and shields the UI
        // from interpreting an exception string as a reason.
        const tagged = ev.error
          ? `${ev.error}${ev.reason ? ` · ${ev.reason}` : ""} — ${ev.message}`
          : ev.message;
        setErr(tagged);
        if (activeTaskIdRef.current) setTaskState(activeTaskIdRef.current, "blocked");
        break;
      }
    }
  }

  async function submit() {
    const v = input.trim();
    if (!v || pending) return;

    const newTaskId = addTask(v, "manual");
    // Move the task to the workbench and mark it running so the UI (and
    // future resumes) reflect the real operational state. Update the ref
    // synchronously so event callbacks created after this line blame the
    // right task if the stream fails before React commits the re-render.
    activeTaskIdRef.current = newTaskId;
    setActiveTaskId(newTaskId);
    setResumedFromSpine(false);
    setTaskState(newTaskId, "running");
    if (principles.length > 0) logDoctrineApplied(principles.length);
    setInput("");
    setLastTask(v);
    setErr(null);
    setIteration(0);
    setLiveTools([]);
    setLiveText("");
    setDone(null);
    setElapsed(0);
    setAccepted(false);
    setCrew({ ...EMPTY_CREW });

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    // Backend caps: question 10000, context 5000, principles 64 (models.py
    // RuberraQuery). Clamp before send so a valid user action never produces
    // a silent 422 the chamber can't distinguish from an engine error.
    const AGENT_PREFIX = "Task declared: ";
    const questionBudget =
      mode === "crew" ? 10000 : 10000 - AGENT_PREFIX.length;
    const clampedV = v.length > questionBudget ? v.slice(0, questionBudget) : v;
    const clampedPrinciples =
      principles.length > 64
        ? principles.slice(-64).map((p) => p.text)
        : principles.map((p) => p.text);

    const body = {
      question: mode === "crew" ? clampedV : `${AGENT_PREFIX}${clampedV}`,
      context: activeMission?.title,
      mission_id: activeMission?.id,
      principles: clampedPrinciples.length ? clampedPrinciples : undefined,
    };

    if (mode === "crew") {
      await streamCrew(body, handleCrewEvent, ac.signal);
    } else {
      await streamDev(body, (ev: AgentEvent) => handleAgentEvent(ev), ac.signal);
    }
  }

  function accept() {
    if (!done || !activeMission || accepted) return;
    // Strictly id-based: the workbench task is the accepted run's owner.
    // The title-based fallback is gone — with duplicate titles it would
    // backlink to the wrong task. If activeTaskId is unresolvable the
    // artifact still persists, just without a taskId reference.
    const task = activeMission.tasks.find(t => t.id === activeTaskId) ?? null;
    const answerText = done.answer.trim();
    if (answerText) {
      addNoteToMission(activeMission.id, answerText, "ai");
    }
    acceptArtifact(
      activeMission.id,
      {
        taskTitle: task?.title ?? lastTask,
        answer: answerText,
        terminatedEarly: done.terminated_early,
        acceptedAt: Date.now(),
        iterations: done.iterations,
        toolCount: done.tool_count,
        processingTimeMs: done.processing_time_ms,
        terminationReason: done.termination_reason,
      },
      task?.id,
    );
    setAccepted(true);
  }

  // Prefill the command input so the user sees what they are about to run.
  // Operational, not fluff — the refine still goes through submit().
  function handleRefine() {
    if (pending) return;
    const base = activeTask?.title ?? lastTask;
    if (!base) return;
    setInput(copy.refinePrefix + base);
  }

  function handleBlock() {
    if (!activeTaskId) return;
    setTaskState(activeTaskId, "blocked");
  }

  function handleReopen() {
    if (!activeTaskId) return;
    setTaskState(activeTaskId, "open");
  }

  function handleNextTask() {
    if (!activeMission) return;
    // Prefer the oldest still-open task so FIFO ordering is obvious.
    const next = activeMission.tasks.find(
      t => t.state === "open" && t.id !== activeTaskId,
    );
    if (!next) return;
    setActiveTaskId(next.id);
    setResumedFromSpine(true);
    setDone(null);
    setErr(null);
    setLiveTools([]);
    setLiveText("");
    setAccepted(false);
  }

  const tasks = activeMission?.tasks ?? [];
  const doneTasks = tasks.filter((t) => t.state === "done");
  const pendingTasks = tasks.filter((t) => t.state !== "done" && t.state !== "blocked");
  const openTasks = tasks.filter((t) => t.state === "open");
  const runningTasks = tasks.filter((t) => t.state === "running");
  const blockedTasks = tasks.filter((t) => t.state === "blocked");
  const staleRunningTasks = runningTasks.filter(isStaleRunning);
  // Titles that appear more than once in this mission's task list.
  // Used to reveal a short #id suffix only where ambiguity exists, so the
  // common case (unique titles) stays visually clean.
  const duplicateTitles = useMemo<Set<string>>(() => {
    const counts = new Map<string, number>();
    for (const t of tasks) counts.set(t.title, (counts.get(t.title) ?? 0) + 1);
    const dupes = new Set<string>();
    counts.forEach((n, title) => { if (n > 1) dupes.add(title); });
    return dupes;
  }, [tasks]);
  const exitCode = done ? 0 : err ? 1 : null;

  function selectTaskFromQueue(id: string) {
    if (id === activeTaskId) return;
    setActiveTaskId(id);
    setResumedFromSpine(true);
    setDone(null);
    setErr(null);
    setLiveTools([]);
    setLiveText("");
    setAccepted(false);
  }

  const activeTask = useMemo<Task | null>(() => {
    if (!activeMission || !activeTaskId) return null;
    return activeMission.tasks.find(t => t.id === activeTaskId) ?? null;
  }, [activeMission, activeTaskId]);

  // The header still shows the current objective string — prefer the task on
  // the workbench, then the session's last submission, then the oldest
  // pending task (FIFO, so the header and → próxima tarefa agree).
  const currentObjective =
    activeTask?.title ||
    lastTask ||
    pendingTasks[0]?.title ||
    "";

  const nextOpenTask = activeMission?.tasks.find(
    t => t.state === "open" && t.id !== activeTaskId,
  ) ?? null;
  const allArtifacts = activeMission?.artifacts ?? [];
  // The next-step bar is operational: it appears once the user has something
  // to act on — a completed run, an error, a blocked task, or a stale-running
  // task (page reloaded mid-stream; spine still marks it running but no
  // stream is live).
  const staleRunning = activeTask?.state === "running" && !pending && done === null && err === null;
  const showNextStep = !pending && activeMission !== null &&
    ((done !== null) || err !== null || activeTask?.state === "blocked" || staleRunning);

  return (
    <div className="chamber-shell">
      <div
        className="chamber-head"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* Row 1: chamber label + mode toggle + status */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <span
          style={{
            fontSize: 10,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "var(--text-ghost)",
            fontFamily: "var(--mono)",
          }}
        >
          {copy.creationKicker}
        </span>
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
          {copy.creationTagline}
        </span>
        {backend.mode === "mock" && (
          <span
            data-backend-mode="mock"
            title="Backend em modo simulado — execuções são canned, não agentes reais"
            style={{
              fontSize: 9,
              letterSpacing: 1.5,
              color: "var(--cc-warn)",
              fontFamily: "var(--mono)",
              textTransform: "uppercase",
              padding: "2px 7px",
              border: "1px solid color-mix(in oklab, var(--cc-warn) 36%, transparent)",
              borderRadius: 4,
              lineHeight: 1.4,
            }}
          >
            mock
          </span>
        )}
        {principles.length > 0 && (
          <span
            data-principles-in-context
            title={copy.creationPrinciplesPresent(principles.length)}
            style={{
              fontSize: 9,
              letterSpacing: 1.5,
              color: "var(--accent)",
              fontFamily: "var(--mono)",
              textTransform: "uppercase",
              padding: "2px 7px",
              border: "1px solid color-mix(in oklab, var(--accent) 32%, transparent)",
              borderRadius: 4,
              lineHeight: 1.4,
            }}
          >
            sob § {principles.length}
          </span>
        )}
        <div
          role="tablist"
          aria-label="Execution mode"
          style={{
            display: "flex",
            border: "1px solid var(--border-soft)",
            borderRadius: 999,
            overflow: "hidden",
            marginLeft: 12,
          }}
        >
          {(["agent", "crew"] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              disabled={pending}
              onClick={() => setMode(m)}
              style={{
                background: mode === m ? "var(--accent-glow)" : "transparent",
                border: "none",
                color: mode === m ? "var(--accent)" : "var(--text-ghost)",
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: 2,
                textTransform: "uppercase",
                padding: "5px 12px",
                cursor: pending ? "not-allowed" : "pointer",
                transition: "all .15s var(--ease-swift)",
                opacity: pending && mode !== m ? 0.4 : 1,
              }}
            >
              {m}
            </button>
          ))}
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          {pending && (
            <span style={{ color: "var(--cc-info)", display: "flex", alignItems: "center", gap: 6 }}>
              <span
                className="breathe"
                style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cc-info)" }}
              />
              {elapsed.toFixed(1)}s
            </span>
          )}
          {exitCode !== null && !pending && (
            <span style={{ color: exitCode === 0 ? "var(--cc-ok)" : "var(--cc-err)" }}>
              exit {exitCode}
            </span>
          )}
          {tasks.length > 0 && (
            <span style={{ color: "var(--text-muted)" }}>
              {doneTasks.length}/{tasks.length}
            </span>
          )}
        </div>
        </div>
        {/* Row 2: active mission + current objective (condensed breadcrumb) */}
        {activeMission && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--mono)", fontSize: 11 }}>
            <span style={{ fontSize: 9, letterSpacing: 2, color: "var(--text-ghost)", textTransform: "uppercase" }}>missão</span>
            <span style={{ color: "var(--text-secondary)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {activeMission.title}
            </span>
            {currentObjective && (
              <>
                <span style={{ color: "var(--border-soft)", fontSize: 13 }}>›</span>
                <span style={{ color: "var(--accent)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {currentObjective}
                </span>
              </>
            )}
            {openTasks.length === 0 && blockedTasks.length === 0 && doneTasks.length > 0 && (
              <span style={{ color: "var(--cc-ok)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase" }}>
                · {copy.actionAllDone}
              </span>
            )}
          </div>
        )}
      </div>

      <div
        ref={outRef}
        className="chamber-body"
      >
        {activeMission && (
          <WorkbenchCard
            missionTitle={activeMission.title}
            task={activeTask}
            resumed={resumedFromSpine && !pending && !done && !err}
            copy={copy}
            lang={values.lang}
            pending={pending}
            iteration={iteration}
            elapsed={elapsed}
            openCount={openTasks.length}
            runningCount={pendingTasks.filter(t => t.state === "running").length}
            doneCount={doneTasks.length}
            blockedCount={blockedTasks.length}
            staleCount={staleRunningTasks.length}
            onReopen={handleReopen}
          />
        )}

        {tasks.length === 0 && liveTools.length === 0 && !liveText && !pending && !err && (
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 13,
              color: "var(--cc-dim)",
              marginTop: 16,
            }}
          >
            <span style={{ color: "var(--cc-ok)" }}>ruberra@local</span>
            <span style={{ color: "var(--cc-dim)" }}>:</span>
            <span style={{ color: "var(--cc-path)" }}>~/mission</span>
            <span style={{ color: "var(--cc-dim)" }}>$</span>
            <span className="cc-cursor" />
            <div
              style={{
                marginTop: 18,
                fontFamily: "'Fraunces', Georgia, serif",
                fontStyle: "italic",
                fontSize: 18,
                color: "var(--text-muted)",
              }}
            >
              {values.lang === "en"
                ? "Declare a task. It becomes a command. The command has consequence."
                : "Declare uma tarefa. Ela vira comando. O comando tem consequência."}
            </div>
          </div>
        )}

        {tasks.length > 0 && layout === "kanban" && (
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20,
            maxWidth: 820,
          }}>
            <div>
              <div style={{
                fontSize: 9, letterSpacing: 2.5, color: "var(--text-ghost)",
                fontFamily: "var(--mono)", marginBottom: 12, textTransform: "uppercase",
              }}>▲ {copy.kanbanPending} · {pendingTasks.length}</div>
              {pendingTasks.map((t) => (
                <KanbanCard
                  key={t.id} task={t} copy={copy} lang={values.lang}
                  active={t.id === activeTaskId}
                  duplicate={duplicateTitles.has(t.title)}
                  onSelect={() => setActiveTaskId(t.id)}
                />
              ))}
              {blockedTasks.length > 0 && (
                <>
                  <div style={{
                    fontSize: 9, letterSpacing: 2.5, color: "var(--cc-err)",
                    fontFamily: "var(--mono)", margin: "16px 0 10px", textTransform: "uppercase",
                    opacity: 0.7,
                  }}>✕ {copy.blockedSection} · {blockedTasks.length}</div>
                  {blockedTasks.map((t) => (
                    <KanbanCard
                      key={t.id} task={t} copy={copy} lang={values.lang}
                      active={t.id === activeTaskId}
                      onSelect={() => setActiveTaskId(t.id)}
                    />
                  ))}
                </>
              )}
            </div>
            <div>
              <div style={{
                fontSize: 9, letterSpacing: 2.5, color: "var(--cc-ok)",
                fontFamily: "var(--mono)", marginBottom: 12, textTransform: "uppercase",
              }}>✓ {copy.kanbanDone} · {doneTasks.length}</div>
              {doneTasks.map((t) => (
                <KanbanCard
                  key={t.id} task={t} copy={copy} lang={values.lang}
                  active={t.id === activeTaskId}
                  duplicate={duplicateTitles.has(t.title)}
                  onSelect={() => setActiveTaskId(t.id)}
                />
              ))}
            </div>
          </div>
        )}

        {tasks.length > 0 && layout === "terminal" && (
          <div style={{ maxWidth: 820, marginBottom: 20 }}>
            {pendingTasks.map((t) => (
              <TaskRow
                key={t.id} task={t} copy={copy}
                active={t.id === activeTaskId}
                duplicate={duplicateTitles.has(t.title)}
                onSelect={() => setActiveTaskId(t.id)}
              />
            ))}
            {doneTasks.length > 0 && pendingTasks.length > 0 && (
              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  margin: "14px 0",
                  opacity: 0.4,
                }}
              />
            )}
            {doneTasks.map((t) => (
              <TaskRow
                key={t.id} task={t} copy={copy}
                active={t.id === activeTaskId}
                duplicate={duplicateTitles.has(t.title)}
                onSelect={() => setActiveTaskId(t.id)}
              />
            ))}
            {blockedTasks.length > 0 && (
              <>
                <div style={{
                  fontSize: 9, letterSpacing: 2.5, color: "var(--cc-err)",
                  fontFamily: "var(--mono)", margin: "14px 0 6px", textTransform: "uppercase",
                  opacity: 0.7,
                }}>✕ {copy.blockedSection} · {blockedTasks.length}</div>
                {blockedTasks.map((t) => (
                  <TaskRow
                    key={t.id} task={t} copy={copy}
                    active={t.id === activeTaskId}
                    onSelect={() => setActiveTaskId(t.id)}
                  />
                ))}
              </>
            )}
            {doneTasks.length > 0 && (
              <>
                <div style={{
                  fontSize: 9, letterSpacing: 2.5, color: "var(--cc-ok)",
                  fontFamily: "var(--mono)", margin: "14px 0 6px", textTransform: "uppercase",
                  opacity: 0.7,
                }}>✓ {copy.doneSection} · {doneTasks.length}</div>
                {doneTasks.map((t) => (
                  <TaskRow
                    key={t.id} task={t} copy={copy}
                    active={t.id === activeTaskId}
                    onSelect={() => setActiveTaskId(t.id)}
                  />
                ))}
              </>
            )}
          </div>
        )}

        {mode === "crew" && (crew.steps.length > 0 || crew.verdict || pending) && (
          <CrewCard crew={crew} pending={pending} />
        )}

        {(pending || liveTools.length > 0 || liveText || done) && (
          <section
            className="toolRise xc-exec"
            data-state={pending ? "running" : done ? "done" : "idle"}
          >
            <header className="xc-exec-head">
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <span className="t-kicker">exec</span>
                <span style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {(() => {
                    const label = activeTask?.title || lastTask;
                    if (!label) return "ruberra";
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
              {done && activeMission && (
                <div className="xc-exec-foot">
                  {!accepted ? (
                    <>
                      <button
                        onClick={accept}
                        className="btn-chip"
                        data-variant="ok"
                      >
                        {copy.acceptArtifact}
                      </button>
                      <span style={{ fontSize: 10, color: "var(--text-ghost)", fontFamily: "var(--mono)" }}>
                        {copy.acceptHint}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: 10, color: "var(--cc-ok)", fontFamily: "var(--mono)", letterSpacing: 1.5 }}>
                      {copy.artifactSealed}
                    </span>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {err && (unreachable ? (
          <DormantPanel
            detail={copy.dormantCreation}
            style={{ marginTop: 20, maxWidth: 820 }}
          />
        ) : (
          <ErrorPanel
            severity="critical"
            title={copy.creationErrorTitle}
            message={err}
            style={{ marginTop: 20, maxWidth: 820 }}
          />
        ))}

        {showNextStep && (
          <NextStepBar
            hasNextOpen={nextOpenTask !== null}
            canRefine={Boolean(activeTask?.title || lastTask) && activeTask?.state !== "done"}
            isBlocked={activeTask?.state === "blocked"}
            canBlock={
              activeTask !== null &&
              (activeTask.state === "open" || activeTask.state === "running")
            }
            copy={copy}
            onNext={handleNextTask}
            onRefine={handleRefine}
            onBlock={handleBlock}
            onReopen={handleReopen}
          />
        )}

        {activeMission && (
          <ArtifactLedger
            artifacts={allArtifacts}
            copy={copy}
            lang={values.lang}
            onSelectArtifact={(a) => {
              // Replay: the artifact IS the archive of truth. Restore the
              // done panel from it so the user sees the accepted answer,
              // not a bare task title. Telemetry (iterations, tool_count,
              // processing_time_ms, termination_reason) isn't persisted on
              // artifacts, so those reset to defaults — the answer and the
              // terminatedEarly bit are what matter for replay.
              setDone({
                answer: a.answer,
                iterations: 0,
                tool_count: 0,
                processing_time_ms: 0,
                terminated_early: a.terminatedEarly,
                termination_reason: null,
              });
              setErr(null);
              setLiveTools([]);
              setLiveText("");
              setAccepted(true);
              // Rebind the workbench to the task if it still exists here.
              if (a.taskId && activeMission?.tasks.some(t => t.id === a.taskId)) {
                setActiveTaskId(a.taskId);
                setResumedFromSpine(true);
              }
            }}
          />
        )}
      </div>

      <div
        data-architect-input="comando"
        data-architect-input-state={inputFocused ? "focused" : "idle"}
        style={{ margin: "0 clamp(20px, 5vw, 64px) 18px" }}
      >
        <div
          data-architect-voice
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: inputFocused ? "var(--accent)" : "var(--text-ghost)",
            marginBottom: 8,
            paddingLeft: 4,
            transition: "color 0.15s",
          }}
        >
          {copy.creationInputVoice}
        </div>
      <div
        className="glass"
        style={{
          borderRadius: 14,
          padding: "12px 16px",
          fontFamily: "var(--mono)",
          display: "grid",
          gridTemplateColumns: "auto auto 1fr auto auto",
          gap: 10,
          alignItems: "center",
        }}
      >
        <span style={{ color: "var(--cc-ok)", fontSize: 12 }}>ruberra</span>
        <span style={{ color: "var(--cc-dim)", fontSize: 12 }}>
          @{pending ? "exec" : "ready"}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--cc-prompt)", fontSize: 13 }}>$</span>
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={pending ? copy.creationRunning : copy.creationPlaceholder}
            disabled={pending}
            style={{
              flex: 1,
              fontSize: 13,
              color: "var(--cc-fg)",
              fontFamily: "var(--mono)",
              opacity: pending ? 0.55 : 1,
              padding: "6px 0",
            }}
          />
          {!pending && <span className="cc-cursor" style={{ opacity: input ? 0 : 1 }} />}
        </span>
        <span
          style={{
            fontSize: 10,
            color: "var(--text-ghost)",
            letterSpacing: ".2em",
            textTransform: "uppercase",
          }}
        >
          {input.length ? `${input.length}c` : ""}
        </span>
        {input.trim() && !pending && (
          <button
            onClick={submit}
            className="fadeIn"
            style={{
              background: "none",
              border: "1px solid var(--cc-ok)",
              color: "var(--cc-ok)",
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              padding: "7px 14px",
              borderRadius: 999,
              fontFamily: "var(--mono)",
              transition: "all .2s var(--ease-swift)",
              cursor: "pointer",
            }}
          >
            ↵ run
          </button>
        )}
      </div>
      </div>
    </div>
  );
}

const ROLE_COLOR: Record<CrewRole, string> = {
  planner: "var(--accent)",
  researcher: "var(--cc-info)",
  coder: "var(--cc-prompt)",
  critic: "var(--cc-warn)",
};

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
        borderRadius: 14,
        padding: "14px 18px",
        fontFamily: "var(--mono)",
      }}
    >
      <div style={{
        fontSize: 10,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: "var(--text-ghost)",
        marginBottom: 10,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ color: "var(--accent)" }}>crew</span>
        {crew.refinements > 0 && (
          <span style={{ color: "var(--cc-warn)" }}>refine ×{crew.refinements}</span>
        )}
        {crew.currentRole && pending && (
          <span style={{ color: ROLE_COLOR[crew.currentRole] }}>
            ▶ {crew.currentRole}
          </span>
        )}
      </div>

      {crew.analysis && (
        <div style={{
          fontSize: 11,
          color: "var(--text-muted)",
          marginBottom: 12,
          lineHeight: 1.5,
          fontFamily: "var(--sans)",
          fontStyle: "italic",
        }}>
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
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "14px 90px 1fr",
                gap: 10,
                alignItems: "baseline",
                fontSize: 11,
                opacity: ran || active ? 1 : 0.55,
              }}>
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
        <div style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: "1px dashed var(--border-soft)",
          fontSize: 11,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            color: crew.verdict.accept ? "var(--cc-ok)" : "var(--cc-err)",
            letterSpacing: 2,
            textTransform: "uppercase",
            fontSize: 10,
            marginBottom: 6,
          }}>
            <span>{crew.verdict.accept ? "✓ critic accepted" : "✗ critic rejected"}</span>
          </div>
          <div style={{
            color: "var(--text-muted)",
            fontFamily: "var(--sans)",
            lineHeight: 1.5,
          }}>
            {crew.verdict.summary}
          </div>
          {crew.verdict.issues.length > 0 && (
            <ul style={{
              margin: "8px 0 0 0",
              padding: "0 0 0 16px",
              color: "var(--cc-warn)",
              fontSize: 10,
              lineHeight: 1.6,
            }}>
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

type ToolPhase = "running" | "ok" | "err";

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
          letterSpacing: ".2em",
          textTransform: "uppercase",
        }}
      >
        {phase === "running" ? "…" : phase === "ok" ? "ok" : "err"}
      </span>
    </div>
  );
}

const STATE_COLOR: Record<TaskState, string> = {
  open: "var(--text-ghost)",
  running: "var(--cc-info)",
  done: "var(--cc-ok)",
  blocked: "var(--cc-err)",
};

const STATE_GLYPH: Record<TaskState, string> = {
  open: "›",
  running: "◐",
  done: "✓",
  blocked: "✕",
};

type Copy = ReturnType<typeof useCopy>;

function stateLabel(state: TaskState, copy: Copy): string {
  switch (state) {
    case "open": return copy.taskStateOpen;
    case "running": return copy.taskStateRunning;
    case "done": return copy.taskStateDone;
    case "blocked": return copy.taskStateBlocked;
  }
}

function sourceLabel(source: Task["source"], copy: Copy): string {
  switch (source) {
    case "lab": return copy.taskSourceLab;
    case "crew": return copy.taskSourceCrew;
    case "other": return copy.taskSourceOther;
    default: return copy.taskSourceManual;
  }
}

function StateChip({ state, copy }: { state: TaskState; copy: Copy }) {
  return (
    <span
      title={stateLabel(state, copy)}
      style={{
        fontSize: 9,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        color: STATE_COLOR[state],
        border: `1px solid ${STATE_COLOR[state]}`,
        padding: "1px 6px",
        borderRadius: 999,
        fontFamily: "var(--mono)",
        whiteSpace: "nowrap",
      }}
    >
      {STATE_GLYPH[state]} {stateLabel(state, copy)}
    </span>
  );
}

function KanbanCard({
  task, onSelect, copy, lang, active = false, duplicate = false,
}: {
  task: Task;
  onSelect: () => void;
  copy: Copy;
  lang: "pt" | "en";
  active?: boolean;
  duplicate?: boolean;
}) {
  const isDone = task.state === "done";
  const isBlocked = task.state === "blocked";
  const stale = isStaleRunning(task);
  return (
    <div
      onClick={onSelect}
      className="fadeUp"
      aria-current={active ? "true" : undefined}
      style={{
        background: active
          ? "color-mix(in oklab, var(--accent-glow) 55%, var(--bg-elevated))"
          : "var(--bg-elevated)",
        border: "1px solid var(--border-soft)",
        borderLeft: active
          ? "3px solid var(--accent)"
          : `1px solid var(--border-soft)`,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        cursor: "pointer",
        opacity: isDone ? 0.55 : isBlocked ? 0.75 : 1,
        transition: "transform .25s var(--ease-swift), border-color .2s, opacity .2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        if (!active) e.currentTarget.style.borderColor = "var(--accent-dim)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        if (!active) e.currentTarget.style.borderColor = "var(--border-soft)";
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontFamily: "var(--sans)",
          color: isDone ? "var(--text-muted)" : "var(--text-primary)",
          textDecoration: isDone ? "line-through" : "none",
          lineHeight: 1.5,
          fontWeight: active ? 500 : 400,
        }}
      >
        {task.title}
        {duplicate && (
          <span
            title={`task id · ${task.id}`}
            style={{
              marginLeft: 8, fontSize: 10, color: "var(--text-ghost)",
              fontFamily: "var(--mono)", letterSpacing: 1, fontWeight: 400,
            }}
          >
            #{task.id.slice(0, 4)}
          </span>
        )}
      </div>
      <div
        style={{
          fontSize: 9,
          letterSpacing: 1.5,
          color: "var(--text-ghost)",
          fontFamily: "var(--mono)",
          marginTop: 8,
          textTransform: "uppercase",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span title={new Date(task.lastUpdateAt).toLocaleString()} style={{ color: stale ? "var(--cc-warn)" : undefined }}>
          {relTime(task.lastUpdateAt, lang)}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {active && (
            <span style={{ color: "var(--accent)", letterSpacing: 2 }}>◉ {copy.onBench}</span>
          )}
          {task.source !== "manual" && (
            <span style={{ color: "var(--accent-dim)" }}>· {sourceLabel(task.source, copy)}</span>
          )}
          {task.artifactId && (
            <span title={copy.artifactTooltip} style={{ color: "var(--cc-ok)" }}>◆</span>
          )}
          {!active && <StateChip state={task.state} copy={copy} />}
        </span>
      </div>
    </div>
  );
}

function TaskRow({
  task, onSelect, copy, active = false, duplicate = false,
}: {
  task: Task;
  onSelect: () => void;
  copy: Copy;
  active?: boolean;
  duplicate?: boolean;
}) {
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
        borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
        background: active
          ? "color-mix(in oklab, var(--accent-glow) 40%, transparent)"
          : "transparent",
        cursor: "pointer",
        fontFamily: "var(--mono)",
        opacity: isDone ? 0.55 : isBlocked ? 0.75 : 1,
        transition: "padding-left .28s var(--ease-swift), opacity .2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.paddingLeft = active ? "16px" : "18px";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.paddingLeft = "12px";
      }}
    >
      <span
        style={{
          fontSize: 13,
          color: STATE_COLOR[task.state],
          width: 14,
          marginTop: 1,
        }}
      >
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
            style={{
              marginLeft: 8, fontSize: 11, color: "var(--text-ghost)",
              letterSpacing: 1,
            }}
          >
            #{task.id.slice(0, 4)}
          </span>
        )}
      </span>
      {active && (
        <span style={{ fontSize: 9, letterSpacing: 2, color: "var(--accent)", textTransform: "uppercase", marginTop: 3 }}>
          ◉ {copy.onBench}
        </span>
      )}
      {task.artifactId && (
        <span title={copy.artifactTooltip} style={{ color: "var(--cc-ok)", fontSize: 11, marginTop: 2 }}>◆</span>
      )}
      {task.source !== "manual" && (
        <span style={{ fontSize: 9, letterSpacing: 1.5, color: "var(--accent-dim)", textTransform: "uppercase", marginTop: 3 }}>
          {sourceLabel(task.source, copy)}
        </span>
      )}
      {!active && <StateChip state={task.state} copy={copy} />}
    </div>
  );
}

interface WorkbenchCardProps {
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

function WorkbenchCard({
  missionTitle, task, resumed, copy, lang, pending, iteration, elapsed,
  openCount, runningCount, doneCount, blockedCount, staleCount, onReopen,
}: WorkbenchCardProps) {
  const isLive = pending || (task !== null && task.state === "running");
  const isActive = task !== null && task.state !== "done";
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
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 8,
        fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--text-ghost)",
      }}>
        <span>{copy.workbench}</span>
        <span style={{ color: "var(--border-soft)" }}>/</span>
        <span style={{ color: "var(--text-secondary)", letterSpacing: 1, textTransform: "none", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {missionTitle}
        </span>
        {resumed && task && (
          <span style={{ marginLeft: "auto", color: "var(--cc-info)", letterSpacing: 1.5 }}>
            ↺ {copy.resumeHint}
          </span>
        )}
      </div>
      {task ? (
        <>
          <div style={{
            fontSize: 17,
            fontFamily: "var(--sans)",
            fontWeight: task.state === "done" ? 400 : 500,
            color: task.state === "done" ? "var(--text-muted)" : "var(--text-primary)",
            lineHeight: 1.4,
            marginBottom: 12,
            letterSpacing: "-0.005em",
            textDecoration: task.state === "done" ? "line-through" : "none",
          }}>
            {task.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <StateChip state={task.state} copy={copy} />
            <span style={{ fontSize: 9, letterSpacing: 1.5, color: "var(--text-ghost)", textTransform: "uppercase" }}>
              {sourceLabel(task.source, copy)}
            </span>
            <span
              title={new Date(task.lastUpdateAt).toLocaleString()}
              style={{ fontSize: 10, color: stale ? "var(--cc-warn)" : "var(--text-ghost)" }}
            >
              · {relTime(task.lastUpdateAt, lang)}
            </span>
            {stale && (
              <span style={{ fontSize: 9, letterSpacing: 1.5, color: "var(--cc-warn)", textTransform: "uppercase" }}>
                ⚠ {lang === "en" ? "stalled" : "parada"}
              </span>
            )}
            {task.artifactId && (
              <span style={{ fontSize: 10, color: "var(--cc-ok)", letterSpacing: 1.5, textTransform: "uppercase" }}>
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
                  marginLeft: "auto", background: "none", border: "1px solid var(--cc-warn)",
                  color: "var(--cc-warn)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
                  padding: "3px 10px", borderRadius: 999, fontFamily: "var(--mono)", cursor: "pointer",
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
      <div style={{
        marginTop: "var(--space-2)", paddingTop: "var(--space-2)", borderTop: "1px solid var(--border-soft)",
        display: "flex", gap: 14, fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase",
        color: "var(--text-ghost)",
        alignItems: "center", flexWrap: "wrap",
      }}>
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
          <span style={{
            marginLeft: "auto", color: "var(--cc-warn)", letterSpacing: 1.5,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span>⚠</span>
            <span>{lang === "en" ? "bottleneck" : "gargalo"}: {bottleneck}</span>
          </span>
        )}
      </div>
    </div>
  );
}

interface NextStepBarProps {
  hasNextOpen: boolean;
  canRefine: boolean;
  canBlock: boolean;
  isBlocked: boolean;
  copy: Copy;
  onNext: () => void;
  onRefine: () => void;
  onBlock: () => void;
  onReopen: () => void;
}

function NextStepBar({
  hasNextOpen, canRefine, canBlock, isBlocked, copy,
  onNext, onRefine, onBlock, onReopen,
}: NextStepBarProps) {
  const buttons: Array<{ label: string; onClick: () => void; color: string }> = [];
  if (hasNextOpen) buttons.push({ label: copy.actionNextTask, onClick: onNext, color: "var(--accent)" });
  if (canRefine) buttons.push({ label: copy.actionRefine, onClick: onRefine, color: "var(--cc-info)" });
  if (isBlocked) {
    buttons.push({ label: copy.actionUnblock, onClick: onReopen, color: "var(--cc-warn)" });
  } else if (canBlock) {
    buttons.push({ label: copy.actionBlock, onClick: onBlock, color: "var(--cc-err)" });
  }
  if (buttons.length === 0) {
    return (
      <div style={{ marginTop: 8, maxWidth: 820, fontFamily: "var(--mono)", fontSize: 10, color: "var(--cc-ok)", letterSpacing: 1.5, textTransform: "uppercase" }}>
        {copy.actionAllDone}
      </div>
    );
  }
  return (
    <div
      className="fadeIn"
      style={{
        marginTop: 8,
        maxWidth: 820,
        display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap",
        fontFamily: "var(--mono)",
      }}
    >
      <span style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--text-ghost)" }}>
        {copy.nextStep}
      </span>
      {buttons.map((b, i) => (
        <button
          key={i}
          onClick={b.onClick}
          style={{
            background: "none",
            border: `1px solid ${b.color}`,
            color: b.color,
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            padding: "6px 12px",
            borderRadius: 999,
            fontFamily: "var(--mono)",
            cursor: "pointer",
            transition: "background .15s var(--ease-swift)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `color-mix(in oklab, ${b.color} 10%, transparent)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
          }}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}

const LEDGER_COLLAPSED_COUNT = 3;

function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(s < 10 ? 1 : 0)}s`;
  const m = Math.floor(s / 60);
  const rem = Math.round(s % 60);
  return `${m}m${rem ? rem + "s" : ""}`;
}

function ArtifactLedger({
  artifacts, copy, lang, onSelectArtifact,
}: {
  artifacts: Artifact[];
  copy: Copy;
  lang: string;
  onSelectArtifact: (a: Artifact) => void;
}) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const total = artifacts.length;
  const COLLAPSED_LIMIT = 5;
  const hasMore = total > COLLAPSED_LIMIT;
  const visible = expanded ? artifacts : artifacts.slice(0, COLLAPSED_LIMIT);
  const termEarly = artifacts.filter((a) => a.terminatedEarly).length;

  const fmtRel = (then: number) => {
    const diff = Date.now() - then;
    const en = lang === "en";
    if (diff < 60_000) return en ? "now" : "agora";
    if (diff < 3_600_000) {
      const m = Math.max(1, Math.round(diff / 60_000));
      return en ? `${m}m ago` : `há ${m}m`;
    }
    if (diff < 86_400_000) {
      const h = Math.round(diff / 3_600_000);
      return en ? `${h}h ago` : `há ${h}h`;
    }
    const d = Math.round(diff / 86_400_000);
    return en ? `${d}d ago` : `há ${d}d`;
  };

  const replayLabel = lang === "en" ? "↺ replay" : "↺ retomar";
  const interruptedLabel = lang === "en" ? "cut short" : "terminação antecipada";

  return (
    <div style={{
      marginTop: 28,
      paddingTop: 18,
      borderTop: "1px dashed var(--border-soft)",
      maxWidth: 820,
    }}>
      <div style={{
        fontSize: 9, letterSpacing: 2.5, color: "var(--text-muted)",
        fontFamily: "var(--mono)", textTransform: "uppercase", marginBottom: 12,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ color: "var(--cc-ok)", opacity: 0.7 }}>◆</span>
        <span>{copy.recentArtifacts}</span>
        {artifacts.length > 0 && (
          <span style={{ color: "var(--text-ghost)", letterSpacing: 1 }}>
            · {artifacts.length}
          </span>
        )}
        {termEarly > 0 && (
          <span
            title={lang === "en"
              ? `${termEarly} terminated early`
              : `${termEarly} terminação${termEarly === 1 ? "" : "ões"} antecipada${termEarly === 1 ? "" : "s"}`}
            style={{ color: "var(--cc-warn)", letterSpacing: 1 }}
          >
            · ⚠ {termEarly}
          </span>
        )}
        {hasMore && (
          <button
            onClick={() => setExpanded(v => !v)}
            style={{
              marginLeft: "auto", background: "none", border: "1px solid var(--border-soft)",
              color: "var(--text-ghost)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
              padding: "3px 10px", borderRadius: 999, fontFamily: "var(--mono)", cursor: "pointer",
              transition: "color .15s, border-color .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--accent)";
              e.currentTarget.style.borderColor = "var(--accent-dim)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-ghost)";
              e.currentTarget.style.borderColor = "var(--border-soft)";
            }}
          >
            {expanded
              ? (lang === "en" ? "↑ collapse" : "↑ recolher")
              : (lang === "en" ? `↓ show all (${total})` : `↓ ver todos (${total})`)}
          </button>
        )}
      </div>
      {total === 0 ? (
        <div style={{
          fontSize: 11, color: "var(--text-ghost)", fontStyle: "italic",
          fontFamily: "var(--sans)",
        }}>
          {copy.artifactEmpty}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {visible.map((a, i) => {
            const preview = a.answer
              ? (a.answer.length > 120 ? a.answer.slice(0, 120) + "…" : a.answer)
              : "—";
            const clickable = Boolean(a.taskId);
            const hovered = hoverId === a.id;
            const tier = Math.min(i, 2);
            const baseBg = [
              "color-mix(in oklab, var(--cc-ok) 10%, var(--bg-elevated))",
              "color-mix(in oklab, var(--cc-ok) 5%, var(--bg-elevated))",
              "var(--bg-elevated)",
            ][tier];
            const baseBorderLeft = [
              "3px solid var(--cc-ok)",
              "2px solid var(--cc-ok)",
              "2px solid color-mix(in oklab, var(--cc-ok) 45%, transparent)",
            ][tier];
            const bg = clickable && hovered
              ? "color-mix(in oklab, var(--cc-ok) 16%, var(--bg-elevated))"
              : baseBg;
            const borderLeft = clickable && hovered
              ? "3px solid var(--cc-ok)"
              : baseBorderLeft;

            return (
              <div
                key={a.id}
                onClick={clickable ? () => onSelectArtifact(a) : undefined}
                onMouseEnter={clickable ? () => setHoverId(a.id) : undefined}
                onMouseLeave={clickable ? () => setHoverId(null) : undefined}
                className="fadeIn"
                style={{
                  background: bg,
                  border: "1px solid var(--border-soft)",
                  borderLeft,
                  borderRadius: 12,
                  padding: "10px 14px",
                  fontFamily: "var(--mono)",
                  cursor: clickable ? "pointer" : "default",
                  transition: "background .18s var(--ease-swift), border-color .18s",
                }}
              >
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
                  color: "var(--cc-ok)", marginBottom: 6,
                }}>
                  <span>◆</span>
                  <span style={{ color: "var(--text-ghost)", letterSpacing: 1 }}>
                    {fmtRel(a.acceptedAt)}
                  </span>
                  {a.terminatedEarly && (
                    <span style={{ color: "var(--cc-warn)" }}>· {interruptedLabel}</span>
                  )}
                  {clickable && (
                    <span style={{
                      marginLeft: "auto",
                      color: hovered ? "var(--cc-ok)" : "var(--text-ghost)",
                      letterSpacing: 1.5,
                      transition: "color .18s var(--ease-swift)",
                    }}>
                      {replayLabel}
                    </span>
                  )}
                </div>
                <div style={{
                  fontSize: 13.5,
                  fontFamily: "var(--sans)",
                  color: ["var(--text-primary)", "var(--text-secondary)", "var(--text-muted)"][tier],
                  fontWeight: tier === 0 ? 500 : 400,
                  lineHeight: 1.4,
                  marginBottom: 4,
                  letterSpacing: "-0.005em",
                }}>
                  {a.taskTitle}
                </div>
                <div style={{
                  fontSize: 11,
                  color: a.terminatedEarly && !a.answer
                    ? "var(--cc-warn)"
                    : ["var(--text-muted)", "var(--text-muted)", "var(--text-ghost)"][tier],
                  fontFamily: "var(--mono)",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                }}>
                  {preview}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
