import { useRef, useState, useEffect, useMemo } from "react";
import { useSpine } from "../../spine/SpineContext";
import { activeTruthDistillation } from "../../spine/types";
import { fireTelemetry } from "../../lib/telemetry";
import {
  useSignal, AgentEvent, CrewEvent,
  type CrewRole, type GateName, type GateState,
  type EvidenceRecordPayload,
} from "../../hooks/useSignal";
import { useBackendStatus } from "../../hooks/useBackendStatus";
import { useGitStatus } from "../../hooks/useGitStatus";
import { useCopy } from "../../i18n/copy";
import type { Artifact } from "../../spine/types";
import DormantPanel from "../../shell/DormantPanel";
import {
  EMPTY_CREW, isStaleRunning,
  type RunMode, type LiveTool, type DoneSummary, type CrewState,
  type Task,
} from "./helpers";
import ContextStrip from "./ContextStrip";
import WorkbenchStrip from "./WorkbenchStrip";
import OutputCanvas from "./OutputCanvas";
import NextStepBar from "./NextStepBar";
import ExecutionComposer from "./ExecutionComposer";
import { TaskList } from "./TaskBench";
import HandoffInbox from "../../shell/HandoffInbox";
import EvidencePanel from "./EvidencePanel";

// Terminal — execution environment. State, effects, submit, accept,
// task state transitions and SSE event reduction stay here; every
// visual concern lives in a primitive under ./*. The chamber shell
// carries data-chamber="terminal" so every descendant resolves
// --chamber-dna from the tokens.css chamber-DNA pack.
//
// Layout (editorial):
//   · ChamberHead (identity)
//   · WorkbenchStrip (thin paper row — workbench · mission · status · actions)
//   · OutputCanvas (editorial column — brief / pending / done / error)
//   · NextStepBar (only when the run has landed and there is a next step)
//   · ExecutionComposer (floating command dock at the bottom)

// Initial state for the structured gate signals — reused on every
// task transition so a switch to a different task never inherits the
// previous run's gates/diff.
const INITIAL_GATES: Record<GateName, GateState> = {
  typecheck: "unavailable",
  build: "unavailable",
  test: "unavailable",
};

export default function Terminal() {
  const {
    activeMission, addTask, setTaskState, addNoteToMission,
    acceptArtifact, principles, logDoctrineApplied,
  } = useSpine();
  const { streamDev, streamCrew, pending, unreachable } = useSignal();
  const backend = useBackendStatus();
  const git = useGitStatus();
  const copy = useCopy();

  // useBackendStatus only checks /health on mount, so a backend that
  // goes down mid-session would leave backend.reachable=true and the
  // banner would never appear. Re-check whenever a runtime request
  // marks the backend unreachable so reason/detail and the
  // BackendUnreachableBanner reflect live state.
  useEffect(() => {
    if (unreachable) backend.refresh();
  }, [unreachable, backend.refresh]);

  const [input, setInput] = useState("");
  const [lastTask, setLastTask] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [iteration, setIteration] = useState(0);
  const [liveTools, setLiveTools] = useState<LiveTool[]>([]);
  const [liveText, setLiveText] = useState("");
  const [done, setDone] = useState<DoneSummary | null>(null);
  const [elapsed, setElapsed] = useState(0);
  // Structured gates + diff arrive as typed events from the agent loop
  // (agent.py _extract_signals). These replace the regex-on-tool-preview
  // derivation that used to live in the chamber. Reset on each submit.
  const [liveGates, setLiveGates] = useState<Record<GateName, GateState>>(INITIAL_GATES);
  const [liveDiff, setLiveDiff] = useState<{ files: number; added: number; removed: number } | null>(null);
  // P-9 — typed evidence trail collected from the agent loop. Resets
  // on every submit alongside gates/diff so the panel reflects only
  // the current run.
  const [liveEvidence, setLiveEvidence] = useState<EvidenceRecordPayload[]>([]);
  const [mode, setMode] = useState<RunMode>("agent");
  const [crew, setCrew] = useState<CrewState>(EMPTY_CREW);
  // Session-only guard against double-click on the accept button.
  // Persisted acceptance is on spine.activeMission.lastArtifact.
  const [accepted, setAccepted] = useState(false);
  // The task on the workbench. Resumed from spine on mount / mission
  // switch; advanced by the next-step actions.
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  // Ref mirror — stream callbacks outlive the render that scheduled
  // them; reading through the ref defeats stale-closure bugs when an
  // error arrives after the task pointer has moved.
  const activeTaskIdRef = useRef<string | null>(null);
  // True when activeTaskId was picked up from persisted state (not
  // created in this session) — used to show a discreet "resume" cue.
  const [resumedFromSpine, setResumedFromSpine] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => { activeTaskIdRef.current = activeTaskId; }, [activeTaskId]);

  useEffect(() => {
    if (!pending) return;
    const start = Date.now();
    const id = setInterval(() => setElapsed((Date.now() - start) / 1000), 100);
    return () => clearInterval(id);
  }, [pending]);

  // Resume: on mount or mission switch, if no active task was picked
  // this session, re-acquire one from spine — prefer a task already
  // "running", then the oldest open task (FIFO). Stale pointers
  // (done / blocked / gone from this mission) are dropped so the
  // workbench advances on re-entry instead of holding expired work.
  useEffect(() => {
    if (!activeMission) {
      setActiveTaskId(null);
      setResumedFromSpine(false);
      return;
    }
    const current = activeTaskId
      ? activeMission.tasks.find((t) => t.id === activeTaskId)
      : null;
    if (current && (current.state === "running" || current.state === "open")) return;
    const running = activeMission.tasks.find((t) => t.state === "running");
    const open = activeMission.tasks.find((t) => t.state === "open");
    const pick = running ?? open ?? null;
    setActiveTaskId(pick?.id ?? null);
    setResumedFromSpine(pick !== null);
  }, [activeMission?.id]);  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Event handlers ─────────────────────────────────────────────────

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
          // Frame reordering on the SSE wire is rare but possible. If
          // the result arrived before its tool_use, a plain map() would
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
      case "gate":
        setLiveGates((prev) => ({ ...prev, [ev.name]: ev.state }));
        break;
      case "diff":
        setLiveDiff({ files: ev.files, added: ev.added, removed: ev.removed });
        break;
      case "evidence":
        // P-9 — append the typed EvidenceRecord to the run trail.
        // Reset is owned by the submit handler so a new run starts
        // with an empty list (same lifecycle as gates/diff).
        setLiveEvidence((prev) => [...prev, ev.record]);
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
        // message when available — "engine_error · triad timed out"
        // tells the user more than "triad timed out" alone.
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
    setLiveGates(INITIAL_GATES);
    setLiveDiff(null);
    setLiveEvidence([]);

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    // Backend caps: question 10000, principles 64. Clamp before send
    // so a valid user action never produces a silent 422 the chamber
    // can't distinguish from an engine error.
    const AGENT_PREFIX = "Task declared: ";
    const questionBudget = mode === "crew" ? 10000 : 10000 - AGENT_PREFIX.length;
    const clampedV = v.length > questionBudget ? v.slice(0, questionBudget) : v;
    const clampedPrinciples = principles.length > 64
      ? principles.slice(-64).map((p) => p.text)
      : principles.map((p) => p.text);

    const body = {
      question: mode === "crew" ? clampedV : `${AGENT_PREFIX}${clampedV}`,
      context: activeMission?.title,
      mission_id: activeMission?.id,
      principles: clampedPrinciples.length ? clampedPrinciples : undefined,
      chamber: "terminal" as const,
    };

    if (mode === "crew") {
      await streamCrew(body, handleCrewEvent, ac.signal);
    } else {
      await streamDev(body, (ev: AgentEvent) => handleAgentEvent(ev), ac.signal);
    }
  }

  function accept() {
    if (!done || !activeMission || accepted) return;
    const task = activeMission.tasks.find((t) => t.id === activeTaskId) ?? null;
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
    const next = activeMission.tasks.find(
      (t) => t.state === "open" && t.id !== activeTaskId,
    );
    if (!next) return;
    setActiveTaskId(next.id);
    setResumedFromSpine(true);
    setDone(null);
    setErr(null);
    setLiveTools([]);
    setLiveText("");
    setLiveGates(INITIAL_GATES);
    setLiveDiff(null);
    setLiveEvidence([]);
    setAccepted(false);
  }

  function selectTaskFromQueue(id: string) {
    if (id === activeTaskId) return;
    setActiveTaskId(id);
    setResumedFromSpine(true);
    setDone(null);
    setErr(null);
    setLiveTools([]);
    setLiveText("");
    setLiveGates(INITIAL_GATES);
    setLiveDiff(null);
    setLiveEvidence([]);
    setAccepted(false);
  }

  function replayArtifact(a: Artifact) {
    // The artifact IS the archive of truth. Restore the done panel so
    // the user sees the accepted answer, not a bare task title.
    // Telemetry (iterations, tool_count, ms, termination_reason) isn't
    // persisted on artifacts; those reset to defaults. The answer +
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
    setLiveGates(INITIAL_GATES);
    setLiveDiff(null);
    setLiveEvidence([]);
    setAccepted(true);
    if (a.taskId && activeMission?.tasks.some((t) => t.id === a.taskId)) {
      setActiveTaskId(a.taskId);
      setResumedFromSpine(true);
    }
  }

  // ── Derived state ──────────────────────────────────────────────────

  const tasks = activeMission?.tasks ?? [];
  const doneTasks = tasks.filter((t) => t.state === "done");
  const pendingTasks = tasks.filter((t) => t.state !== "done" && t.state !== "blocked");
  const openTasks = tasks.filter((t) => t.state === "open");
  const runningTasks = tasks.filter((t) => t.state === "running");
  const blockedTasks = tasks.filter((t) => t.state === "blocked");
  const staleRunningTasks = runningTasks.filter(isStaleRunning);
  const exitCode = done ? 0 : err ? 1 : null;

  const duplicateTitles = useMemo<Set<string>>(() => {
    const counts = new Map<string, number>();
    for (const t of tasks) counts.set(t.title, (counts.get(t.title) ?? 0) + 1);
    const dupes = new Set<string>();
    counts.forEach((n, title) => { if (n > 1) dupes.add(title); });
    return dupes;
  }, [tasks]);

  const activeTask = useMemo<Task | null>(() => {
    if (!activeMission || !activeTaskId) return null;
    return activeMission.tasks.find((t) => t.id === activeTaskId) ?? null;
  }, [activeMission, activeTaskId]);

  const currentObjective =
    activeTask?.title || lastTask || pendingTasks[0]?.title || "";

  // Wave 6a — Terminal seed consumer. When the active mission has a
  // Truth Distillation with a terminalSeed AND there are no open tasks
  // yet, surface the seed as a one-click "apply" suggestion. Once the
  // user applies (creates a task) or types something else, the
  // suggestion stops fighting them.
  const terminalSeed = useMemo(() => {
    const distillation = activeTruthDistillation(activeMission);
    return distillation?.terminalSeed ?? null;
  }, [activeMission]);
  const showTerminalSeed = Boolean(
    terminalSeed && tasks.length === 0 && !pending && input.trim().length === 0,
  );

  const nextOpenTask = activeMission?.tasks.find(
    (t) => t.state === "open" && t.id !== activeTaskId,
  ) ?? null;

  const allArtifacts = activeMission?.artifacts ?? [];

  const staleRunning =
    activeTask?.state === "running" && !pending && done === null && err === null;
  const showNextStep = !pending && activeMission !== null &&
    ((done !== null) || err !== null || activeTask?.state === "blocked" || staleRunning);
  const allDone =
    tasks.length > 0 && openTasks.length === 0 && blockedTasks.length === 0 && doneTasks.length > 0;

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <div className="chamber-shell" data-chamber="terminal">
      <ContextStrip
        copy={copy}
        backendMode={backend.mode}
        principlesCount={principles.length}
        pending={pending}
        elapsed={elapsed}
        exitCode={exitCode}
        taskCount={tasks.length}
        doneCount={doneTasks.length}
        activeMissionTitle={activeMission?.title ?? null}
        currentObjective={currentObjective}
        allDone={allDone}
        allDoneLabel={copy.actionAllDone}
      />

      <div className="chamber-body" style={{ paddingTop: 0 }}>
        {(!backend.reachable || unreachable) && (
          // Show the banner on either initial-mount unreachable OR a
          // runtime request that just hit unreachable — the refresh()
          // effect above will repopulate reason/detail momentarily.
          <BackendUnreachableBanner
            reason={backend.unreachableReason}
            detail={backend.unreachableDetail}
          />
        )}
        <WorkbenchStrip
          copy={copy}
          missionTitle={activeMission?.title ?? null}
          activeTask={activeTask}
          tasks={activeMission?.tasks ?? []}
        />
        <HandoffInbox chamber="terminal" />
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 var(--space-4)" }}>
          <TaskList
            tasks={tasks}
            activeTaskId={activeTaskId}
            duplicateTitles={duplicateTitles}
            copy={copy}
            onSelect={selectTaskFromQueue}
          />
        </div>

        {unreachable && err ? (
          <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 var(--space-4)" }}>
            <DormantPanel detail={copy.dormantCreation} />
          </div>
        ) : (
          <>
          <OutputCanvas
            copy={copy}
            mission={activeMission}
            activeTask={activeTask}
            lastTask={lastTask}
            pending={pending}
            iteration={iteration}
            elapsed={elapsed}
            liveText={liveText}
            liveTools={liveTools}
            done={done}
            accepted={accepted}
            err={err}
            crew={crew}
            mode={mode}
            artifacts={allArtifacts}
            onAccept={accept}
            onReplayArtifact={replayArtifact}
            canAccept={Boolean(activeMission)}
          />
          <EvidencePanel records={liveEvidence} />
          </>
        )}

        {showNextStep && (
          <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 var(--space-4) var(--space-5)" }}>
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
          </div>
        )}
      </div>

      <ExecutionComposer
        copy={copy}
        value={input}
        onChange={setInput}
        onSubmit={submit}
        pending={pending}
        missionTitle={activeMission?.title ?? null}
        mode={mode}
        onModeChange={setMode}
        recentTasks={tasks.slice(0, 8)}
        onPickTask={(title) => setInput(title)}
        principlesCount={principles.length}
        priorTurns={activeMission?.notes?.length ?? 0}
        mockMode={backend.mode === "mock"}
        backendReadiness={backend.readiness}
        backendReasons={backend.readinessReasons}
        backendUnreachableReason={backend.unreachableReason}
        backendUnreachableDetail={backend.unreachableDetail}
        persistenceEphemeral={backend.persistenceEphemeral}
        onAttachContext={(kind) => {
          if (!activeMission) return;
          if (kind === "note") {
            addNoteToMission(activeMission.id, "context attached from terminal composer", "user");
            return;
          }
          if (kind === "prior-run") {
            const last = activeMission.artifacts[0];
            if (last) setInput(`continue from prior run: ${last.taskTitle}`);
            return;
          }
          const last = activeMission.artifacts[0];
          if (last) setInput(`reuse artifact: ${last.taskTitle}`);
        }}
        hasArtifacts={allArtifacts.length > 0}
      />
    </div>
  );
}

// Banner that fires when the forwarder reports the backend unreachable.
// Shows reason + raw edge-runtime detail in plain text (no truncation,
// no tooltip), so the operator sees the actionable cause without
// hovering or opening DevTools. The chip below remains as a quick
// status indicator; this banner is the diagnostic surface.
function BackendUnreachableBanner({
  reason,
  detail,
}: {
  reason: string | null;
  detail: string | null;
}) {
  const fix = reasonFix(reason);
  return (
    <div
      role="alert"
      style={{
        maxWidth: 860,
        margin: "0 auto var(--space-3)",
        padding: "var(--space-3) var(--space-4)",
        border: "1px solid var(--accent-warn, #b45309)",
        borderLeftWidth: 4,
        borderRadius: 4,
        background: "color-mix(in srgb, var(--accent-warn, #b45309) 6%, transparent)",
        font: "var(--font-mono, ui-monospace) 13px/1.5 monospace",
      }}
    >
      <div style={{ fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
        backend unreachable
      </div>
      <div style={{ marginTop: 4 }}>
        <span style={{ opacity: 0.7 }}>reason: </span>
        <span>{reason ?? "(none reported)"}</span>
      </div>
      {detail && (
        <div style={{ marginTop: 2, wordBreak: "break-word" }}>
          <span style={{ opacity: 0.7 }}>detail: </span>
          <span>{detail}</span>
        </div>
      )}
      {fix && (
        <div style={{ marginTop: 6, opacity: 0.85 }}>
          <span style={{ opacity: 0.7 }}>fix: </span>
          <span>{fix}</span>
        </div>
      )}
    </div>
  );
}

function reasonFix(reason: string | null): string | null {
  switch (reason) {
    case "backend_url_not_configured":
      return "Vercel → Settings → Environment Variables → set SIGNAL_BACKEND_URL = <railway-public-url>, redeploy.";
    case "network_error":
      return "Edge could not reach the upstream. Check the Railway service is up and the URL has no typo / trailing space.";
    case "timeout":
      return "Upstream took longer than the edge's request budget. Check Railway logs for slow boot or hung requests.";
    case "upstream_fetch_failed":
      return "Edge fetch threw an unclassified exception — the `detail` line above carries the literal cause from Vercel's runtime.";
    default:
      return null;
  }
}
