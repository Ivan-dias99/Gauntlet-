/**
 * RUBERRA FLOW ENGINE SUBSTRATE — Stack 09: Autonomous Flow
 * Constitutional Layer · Substrate · Installed 2026-04-01
 *
 * Autonomous multi-step flows execute, recover from failure, and learn
 * from outcomes. No human loop required for routine execution.
 *
 * Anti-patterns rejected:
 *   — flows that break silently
 *   — flows requiring constant operator supervision
 *   — flows with no memory of prior runs
 *   — brittle automation chains
 *
 * Dependencies: intelligence, operations, awareness
 */

// ─── FLOW DEFINITION ─────────────────────────────────────────────────────────

export type FlowTriggerKind =
  | "manual"          // operator-initiated
  | "schedule"        // cron-style scheduled
  | "event"           // triggered by a system event
  | "mission-gate"    // triggered when a mission reaches a lifecycle gate
  | "anomaly"         // triggered by an awareness anomaly
  | "chained";        // triggered as output of a prior flow step

export type FlowStepKind =
  | "intelligence"    // invoke an intelligence routing step
  | "operation"       // invoke an autonomous operation
  | "connector"       // invoke an external connector
  | "knowledge-read"  // read from the knowledge graph
  | "knowledge-write" // write to the knowledge graph
  | "agent-spawn"     // spawn a pioneer or subagent
  | "condition"       // evaluate a condition — routes to next/alt step
  | "wait"            // hold until a condition is true or timeout
  | "audit"           // emit an audit record
  | "notify"          // surface a signal to the operator
  | "transform"       // transform data between steps
  | "terminal";       // explicit flow terminal (success or failure)

export type FlowStepStatus =
  | "pending"
  | "running"
  | "succeeded"
  | "failed"
  | "skipped"
  | "waiting"
  | "recovered"
  | "cancelled";

export interface FlowStep {
  id:           string;
  kind:         FlowStepKind;
  label:        string;
  /** Next step ID on success — undefined = terminal */
  onSuccess?:   string;
  /** Alternate step ID on condition false or partial failure */
  onAlt?:       string;
  /** Step ID to route to on unrecoverable failure */
  onFailure?:   string;
  /** Maximum retries before entering recovery */
  maxRetries:   number;
  /** Timeout in ms before step is considered stalled */
  timeoutMs:    number;
  /** Idempotency key — allows safe retry */
  idempotencyKey?: string;
  /** Typed input contract for this step */
  inputSchema:  Record<string, string>;
  /** Typed output contract this step produces */
  outputSchema: Record<string, string>;
}

export interface FlowDefinition {
  id:           string;
  label:        string;
  version:      string;
  trigger:      FlowTriggerKind;
  missionBound: boolean;         // true = must run within an active mission context
  steps:        FlowStep[];
  /** ID of the initial step */
  entryStepId:  string;
  /** Whether this flow can recover automatically from partial failure */
  recoverable:  boolean;
  /** Whether runs of this flow produce learnable outcome records */
  learnable:    boolean;
  /** Maximum total execution time before the flow is aborted */
  maxDurationMs: number;
  tags:         string[];
}

// ─── FLOW RUN ─────────────────────────────────────────────────────────────────

export type FlowRunStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "recovering"
  | "stalled"
  | "cancelled"
  | "learned";

export interface FlowStepExecution {
  stepId:     string;
  status:     FlowStepStatus;
  startedAt:  number;
  endedAt?:   number;
  retryCount: number;
  output?:    Record<string, unknown>;
  error?:     string;
  auditId?:   string;
}

export interface FlowRun {
  id:           string;
  flowId:       string;
  flowVersion:  string;
  missionId?:   string;
  triggeredBy:  string;           // actor ID
  triggerKind:  FlowTriggerKind;
  status:       FlowRunStatus;
  queuedAt:     number;
  startedAt?:   number;
  endedAt?:     number;
  stepRuns:     FlowStepExecution[];
  /** Recovery attempts taken during this run */
  recoveryAttempts: number;
  /** Audit record IDs emitted during this run */
  auditIds:     string[];
  /** Outcome record if this run produced a learnable outcome */
  outcomeId?:   string;
}

// ─── FLOW OUTCOME LEARNING ───────────────────────────────────────────────────

/**
 * A FlowOutcomeRecord captures the result of a completed flow run
 * in a form that the flow learning layer can use to improve future runs.
 */
export type OutcomeVerdict = "success" | "partial" | "failure" | "cancelled";

export interface FlowOutcomeRecord {
  id:              string;
  flowId:          string;
  runId:           string;
  missionId?:      string;
  verdict:         OutcomeVerdict;
  durationMs:      number;
  failedStepIds:   string[];
  recoveredStepIds: string[];
  /** What changed as a result of this run */
  consequences:    string[];
  /** Operator or system annotation on outcome quality */
  annotation?:     string;
  recordedAt:      number;
}

// ─── RECOVERY LAW ─────────────────────────────────────────────────────────────

export type RecoveryStrategy =
  | "retry-idempotent"    // retry the failed step if idempotent
  | "skip-and-continue"   // skip the failed step and proceed
  | "rollback-and-halt"   // undo prior steps and surface to operator
  | "checkpoint-resume"   // resume from last successful checkpoint
  | "escalate-to-operator"// halt and wait for operator decision
  | "abort";              // stop cleanly with failure verdict

export interface RecoveryPolicy {
  flowId:           string;
  /** Default strategy when no step-level override applies */
  defaultStrategy:  RecoveryStrategy;
  /** Per-step strategy overrides */
  stepOverrides:    Record<string, RecoveryStrategy>;
  /** Maximum recovery attempts before escalating to operator */
  maxRecoveryAttempts: number;
}

// ─── FLOW SCHEDULE ────────────────────────────────────────────────────────────

export interface FlowSchedule {
  id:         string;
  flowId:     string;
  /** Cron expression or interval */
  schedule:   string;
  enabled:    boolean;
  /** Time window within which this flow must complete */
  sla:        { warnMs: number; criticalMs: number };
  lastRunId?: string;
  nextRunAt?: number;
}

// ─── AUTONOMOUS FLOW LAWS ─────────────────────────────────────────────────────

export const FLOW_LAWS: readonly string[] = [
  "Every flow run produces an audit record — no silent flow execution.",
  "Flows are self-recovering — failure triggers recovery before operator escalation.",
  "Flows learn from outcomes — every completed run informs future execution.",
  "Flows are mission-bound when operating on mission-scoped objects.",
  "Flows with no idempotency contract may not be auto-retried — only explicit retries are safe.",
  "A stalled flow surfaces an anomaly to the awareness layer — no silent stalls.",
  "Operators are only interrupted when recovery is exhausted — not for routine failures.",
  "Flow state is durable across system restarts — partial runs resume, not restart.",
] as const;

export const FLOW_REJECTS: readonly string[] = [
  "flows that break silently",
  "flows that require operator supervision for every step",
  "flows with no memory of prior runs",
  "brittle trigger chains that cascade silently",
  "flows that restart from zero after a transient failure",
  "operator-as-glue between tool calls",
] as const;

// ─── RUNTIME HELPERS ──────────────────────────────────────────────────────────

export function buildFlowRunId(): string {
  return `frun_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildFlowOutcomeId(): string {
  return `fout_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildFlowRun(
  flowId: string,
  triggeredBy: string,
  triggerKind: FlowTriggerKind,
  missionId?: string,
): FlowRun {
  return {
    id:                buildFlowRunId(),
    flowId,
    flowVersion:       "1.0.0",
    missionId,
    triggeredBy,
    triggerKind,
    status:            "queued",
    queuedAt:          Date.now(),
    stepRuns:          [],
    recoveryAttempts:  0,
    auditIds:          [],
  };
}

export function isFlowRunTerminal(run: FlowRun): boolean {
  return ["succeeded", "failed", "cancelled", "learned"].includes(run.status);
}

export function resolveRecoveryStrategy(
  policy: RecoveryPolicy,
  stepId: string,
): RecoveryStrategy {
  return policy.stepOverrides[stepId] ?? policy.defaultStrategy;
}
