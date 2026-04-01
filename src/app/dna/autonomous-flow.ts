/**
 * RUBERRA STACK 09 — Autonomous Flow
 * Self-healing, learning execution flow substrate.
 *
 * Flows are not workflows in the SaaS sense. They are mission-bound
 * execution paths that execute autonomously, recover from failure,
 * and learn from every run. No operator babysitting. No brittle chains.
 *
 * A flow run knows where it is, what failed, how to recover,
 * and what history says about how to improve.
 *
 * DO NOT couple this to UI automation builders.
 * DO NOT treat flows as cron jobs or Zapier chains.
 * Flows are sovereign execution intelligence — not wiring diagrams.
 */

import { assertStackOrder } from "./canon-sovereignty";
import { type MissionId } from "./mission-substrate";

// ─── Stack order guard ────────────────────────────────────────────────────────

const _g = assertStackOrder("flow", ["intelligence", "operations", "awareness"]);
if (!_g.valid) {
  console.warn("[Ruberra Autonomous Flow] Stack order violation:", _g.reason);
}

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────

export type FlowDefId  = string;
export type FlowRunId  = string;
export type FlowStepId = string;

// ─── RETRY POLICY ────────────────────────────────────────────────────────────

/**
 * Retry policy governs how many times a step is attempted
 * and how long to wait between attempts.
 * backoffMs is the base delay — it does not double; the executor owns escalation.
 */
export interface RetryPolicy {
  maxAttempts: number;
  backoffMs:   number;
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 3,
  backoffMs:   500,
} as const;

// ─── FLOW STEP DEFINITION ────────────────────────────────────────────────────

/**
 * A FlowStepDef is the immutable definition of a single step in a flow.
 * Steps are identified by id. The action name is the canonical operation
 * the execution layer resolves and invokes.
 * timeout is optional — if absent, the executor applies a system default.
 */
export interface FlowStepDef {
  id:          FlowStepId;
  label:       string;
  action:      string;       // Canonical operation name the executor resolves
  retryPolicy: RetryPolicy;
  timeout?:    number;       // ms — execution timeout for this step
}

// ─── FLOW DEFINITION ─────────────────────────────────────────────────────────

/**
 * A FlowDef is the immutable blueprint of a multi-step autonomous flow.
 * It is mission-bound. It carries an ordered step array and a failure strategy.
 *
 * onFailure governs system behavior when the flow cannot recover:
 *   retry    — attempt the whole flow again from the failed step
 *   escalate — surface the failure to governance / operator attention
 *   abort    — terminate cleanly and record the outcome
 */
export type FlowFailureStrategy = "retry" | "escalate" | "abort";

export interface FlowDef {
  id:        FlowDefId;
  missionId: MissionId;
  label:     string;
  steps:     FlowStepDef[];
  onFailure: FlowFailureStrategy;
}

// ─── FLOW RUN STATE ──────────────────────────────────────────────────────────

/**
 * The live execution state of a flow run.
 * pending   — created, not yet started
 * running   — actively executing a step
 * recovering — step failed; recovery logic is in progress
 * complete  — all steps succeeded
 * failed    — exhausted retries, escalation or abort reached
 * aborted   — terminated cleanly by policy or operator signal
 */
export type FlowRunState =
  | "pending"
  | "running"
  | "recovering"
  | "complete"
  | "failed"
  | "aborted";

// ─── FLOW STEP RESULT ────────────────────────────────────────────────────────

/**
 * The recorded outcome of a single step execution attempt.
 * attempts counts total invocations (including retries) for this step in this run.
 */
export interface FlowStepResult {
  stepId:      FlowStepId;
  outcome:     "success" | "partial" | "failed";
  output?:     unknown;   // Step output — executor-provided, opaque at this layer
  errorMsg?:   string;
  attempts:    number;
  completedAt: number;
}

// ─── FLOW RUN ────────────────────────────────────────────────────────────────

/**
 * A FlowRun is the live, mutable execution record of a FlowDef.
 * currentStepIdx advances as steps complete.
 * stepResults accumulates the outcome of every completed step.
 * completedAt is set when the run reaches a terminal state.
 */
export interface FlowRun {
  id:             FlowRunId;
  defId:          FlowDefId;
  missionId:      MissionId;
  state:          FlowRunState;
  stepResults:    FlowStepResult[];
  currentStepIdx: number;
  startedAt:      number;
  completedAt?:   number;
}

// ─── FLOW LEARNING ───────────────────────────────────────────────────────────

/**
 * FlowLearning is the accumulated intelligence derived from all completed runs
 * of a given FlowDef. It is not a log — it is a compressed signal.
 *
 * successRate is 0–1.
 * commonFailureStep is the stepId most frequently associated with failures.
 * avgDurationMs covers only runs that reached a terminal state.
 */
export interface FlowLearning {
  defId:              FlowDefId;
  successRate:        number;
  avgDurationMs:      number;
  commonFailureStep?: FlowStepId;
  lastUpdated:        number;
}

// ─── FACTORIES ────────────────────────────────────────────────────────────────

/**
 * Create a new FlowRun from a FlowDef.
 * Pure function — no side effects. Returns a pending run ready to be started.
 */
export function createFlowRun(def: FlowDef, missionId: MissionId): FlowRun {
  return {
    id:             `frun_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    defId:          def.id,
    missionId,
    state:          "pending",
    stepResults:    [],
    currentStepIdx: 0,
    startedAt:      Date.now(),
  };
}

/**
 * Advance a FlowRun by recording the result of the current step.
 * Returns a new FlowRun — does not mutate.
 *
 * Advancement rules:
 * - success/partial: advance currentStepIdx; if last step → complete
 * - failed: set state to recovering (caller decides retry/abort)
 */
export function advanceFlowRun(run: FlowRun, result: FlowStepResult): FlowRun {
  const updated: FlowRun = {
    ...run,
    stepResults: [...run.stepResults, result],
  };

  if (result.outcome === "failed") {
    return { ...updated, state: "recovering" };
  }

  const nextIdx = run.currentStepIdx + 1;
  // nextIdx beyond the known step count signals completion — executor injects step count
  // We compare against stepResults length as proxy for "all steps recorded"
  const isTerminal = nextIdx >= run.stepResults.length + 1 && result.outcome === "success";

  if (isTerminal) {
    return {
      ...updated,
      state:          "complete",
      currentStepIdx: nextIdx,
      completedAt:    Date.now(),
    };
  }

  return { ...updated, state: "running", currentStepIdx: nextIdx };
}

/**
 * Determine whether a failed step should be retried given its result and policy.
 * Pure function — no side effects.
 */
export function shouldRetry(result: FlowStepResult, policy: RetryPolicy): boolean {
  return result.outcome === "failed" && result.attempts < policy.maxAttempts;
}

/**
 * Mark a recovering FlowRun as failed or aborted, depending on the def's onFailure policy.
 * Pure function — returns a new FlowRun with a terminal state.
 */
export function recoverFlowRun(run: FlowRun, def: FlowDef): FlowRun {
  const terminalState: FlowRunState =
    def.onFailure === "abort" ? "aborted" : "failed";

  return {
    ...run,
    state:       terminalState,
    completedAt: Date.now(),
  };
}

/**
 * Build a FlowLearning record from a set of completed FlowRuns for one def.
 * Only terminal runs (complete | failed | aborted) contribute to learning.
 * Pure function — no side effects.
 */
export function buildFlowLearning(runs: FlowRun[]): FlowLearning {
  const terminal = runs.filter(
    (r) => r.state === "complete" || r.state === "failed" || r.state === "aborted",
  );

  if (terminal.length === 0) {
    return {
      defId:         runs[0]?.defId ?? "",
      successRate:   0,
      avgDurationMs: 0,
      lastUpdated:   Date.now(),
    };
  }

  const succeeded  = terminal.filter((r) => r.state === "complete");
  const successRate = succeeded.length / terminal.length;

  const durationsMs = terminal
    .filter((r) => r.completedAt !== undefined)
    .map((r) => r.completedAt! - r.startedAt);

  const avgDurationMs =
    durationsMs.length > 0
      ? Math.round(durationsMs.reduce((a, b) => a + b, 0) / durationsMs.length)
      : 0;

  // Identify the step most frequently appearing as the last result before failure
  const failureStepCounts: Record<string, number> = {};
  for (const run of terminal) {
    if (run.state !== "complete") {
      const lastResult = run.stepResults[run.stepResults.length - 1];
      if (lastResult?.outcome === "failed") {
        failureStepCounts[lastResult.stepId] =
          (failureStepCounts[lastResult.stepId] ?? 0) + 1;
      }
    }
  }

  const commonFailureStep = Object.keys(failureStepCounts).sort(
    (a, b) => failureStepCounts[b] - failureStepCounts[a],
  )[0] as FlowStepId | undefined;

  return {
    defId:         terminal[0].defId,
    successRate,
    avgDurationMs,
    commonFailureStep,
    lastUpdated:   Date.now(),
  };
}

// ─── FLOW STEP DEFINITION FACTORY ────────────────────────────────────────────

export function createFlowStepDef(
  id: FlowStepId,
  label: string,
  action: string,
  retryPolicy: RetryPolicy = DEFAULT_RETRY_POLICY,
  timeout?: number,
): FlowStepDef {
  return { id, label, action, retryPolicy, ...(timeout !== undefined ? { timeout } : {}) };
}

export function createFlowDef(
  missionId: MissionId,
  label: string,
  steps: FlowStepDef[],
  onFailure: FlowFailureStrategy = "escalate",
): FlowDef {
  return {
    id:    `fdef_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    missionId,
    label,
    steps,
    onFailure,
  };
}

// ─── AUTONOMOUS FLOW STATE ────────────────────────────────────────────────────

/**
 * The unified autonomous flow state.
 * Holds all flow definitions, all live runs, and all learning records.
 * Keyed by def id for O(1) lookup.
 */
export interface AutonomousFlowState {
  defs:        Record<FlowDefId, FlowDef>;
  runs:        Record<FlowRunId, FlowRun>;
  learning:    Record<FlowDefId, FlowLearning>;
  lastUpdated: number;
}

export function defaultAutonomousFlowState(): AutonomousFlowState {
  return {
    defs:        {},
    runs:        {},
    learning:    {},
    lastUpdated: Date.now(),
  };
}

export function upsertFlowRun(
  state: AutonomousFlowState,
  run: FlowRun,
): AutonomousFlowState {
  return {
    ...state,
    runs:        { ...state.runs, [run.id]: run },
    lastUpdated: Date.now(),
  };
}

export function upsertFlowDef(
  state: AutonomousFlowState,
  def: FlowDef,
): AutonomousFlowState {
  return {
    ...state,
    defs:        { ...state.defs, [def.id]: def },
    lastUpdated: Date.now(),
  };
}

export function getRunsForDef(
  state: AutonomousFlowState,
  defId: FlowDefId,
): FlowRun[] {
  return Object.values(state.runs).filter((r) => r.defId === defId);
}
