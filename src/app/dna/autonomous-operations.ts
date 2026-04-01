/**
 * RUBERRA STACK 04 — Autonomous Operations
 * The first true operational execution layer.
 *
 * All 8 layers of autonomous operations are defined here.
 * Every operation is mission-bound, constitution-governed,
 * and intelligence-aware.
 *
 * Operations are NOT PM tickets. They are NOT admin workflows.
 * An operation is a consequence-bearing unit of sovereign execution.
 *
 * DO NOT introduce generic project management patterns here.
 * DO NOT allow operations to detach from their mission.
 */

import { assertStackOrder } from "./canon-sovereignty";
import { type MissionId, type MissionChamberLead, type MissionStatus } from "./mission-substrate";
import { type AutonomyDecision, type RiskLevel } from "./sovereign-intelligence";

// ─── Stack order guard ────────────────────────────────────────────────────────

const _orderGuard = assertStackOrder("operations", ["canon", "mission", "intelligence"]);
if (!_orderGuard.valid) {
  console.warn("[Ruberra Autonomous Operations] Stack order violation:", _orderGuard.reason);
}

// ─── Shared primitives ────────────────────────────────────────────────────────

export type OperationId = string;
export type TaskId      = string;
export type ReviewId    = string;
export type HandoffId   = string;
export type SignalId    = string;
export type ReleaseId   = string;
export type FlowId      = string;

// ─── LAYER A — TASK SUBSTRATE ─────────────────────────────────────────────────

export type TaskStatus =
  | "pending"     // Created, not yet started
  | "active"      // Pioneer is executing
  | "blocked"     // Cannot proceed without resolution
  | "review"      // Awaiting review gate
  | "approved"    // Passed review, cleared to continue
  | "completed"   // Done — outcome produced
  | "cancelled";  // Explicitly cancelled, not failed

export type TaskPriority = "critical" | "high" | "standard" | "low";

export type TaskClass =
  | "investigation"  // Lab-led discovery and research
  | "mastery"        // School-led learning and synthesis
  | "construction"   // Creation-led building and shipping
  | "governance"     // Cross-chamber decision / approval unit
  | "handoff";       // Controlled transfer task

/**
 * A mission-bound task is the smallest actionable unit of sovereign work.
 * Not a ticket. Not a todo. A governed execution unit.
 */
export interface MissionTask {
  id:           TaskId;
  missionId:    MissionId;
  class:        TaskClass;
  chamberLead:  MissionChamberLead;
  pioneerId?:   string;
  title:        string;
  objective:    string;   // What success looks like for this task
  notThis:      string;   // Out-of-scope law for this task
  priority:     TaskPriority;
  status:       TaskStatus;
  dependencies: TaskId[]; // Must complete before this task can become active
  blockedBy?:   string;   // Human-readable blocker description
  riskLevel:    RiskLevel;
  autonomy:     AutonomyDecision;
  createdAt:    number;
  updatedAt:    number;
  completedAt?: number;
  outputDigest?: string;  // Brief description of what was produced
}

export function createTask(
  missionId: MissionId,
  opts: Pick<MissionTask, "title" | "objective" | "notThis" | "class" | "chamberLead"> &
    Partial<Pick<MissionTask, "priority" | "riskLevel" | "pioneerId" | "dependencies">>
): MissionTask {
  const now = Date.now();
  return {
    id:           `task_${now}_${Math.random().toString(36).slice(2, 8)}`,
    missionId,
    class:        opts.class,
    chamberLead:  opts.chamberLead,
    pioneerId:    opts.pioneerId,
    title:        opts.title,
    objective:    opts.objective,
    notThis:      opts.notThis,
    priority:     opts.priority     ?? "standard",
    status:       "pending",
    dependencies: opts.dependencies ?? [],
    riskLevel:    opts.riskLevel    ?? "low",
    autonomy:     "continue",
    createdAt:    now,
    updatedAt:    now,
  };
}

export function transitionTask(
  task: MissionTask,
  to: TaskStatus,
  opts?: { blockedBy?: string; outputDigest?: string }
): MissionTask {
  return {
    ...task,
    status:       to,
    blockedBy:    opts?.blockedBy   ?? task.blockedBy,
    outputDigest: opts?.outputDigest ?? task.outputDigest,
    completedAt:  to === "completed" ? Date.now() : task.completedAt,
    updatedAt:    Date.now(),
  };
}

export function getActiveTasks(tasks: MissionTask[]): MissionTask[] {
  return tasks.filter((t) => t.status === "active" || t.status === "review");
}

export function getBlockedTasks(tasks: MissionTask[]): MissionTask[] {
  return tasks.filter((t) => t.status === "blocked");
}

export function getReadyTasks(tasks: MissionTask[], completedIds: Set<TaskId>): MissionTask[] {
  return tasks.filter(
    (t) => t.status === "pending" && t.dependencies.every((d) => completedIds.has(d))
  );
}

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  pending:   "pending",
  active:    "active",
  blocked:   "blocked",
  review:    "review",
  approved:  "approved",
  completed: "done",
  cancelled: "cancelled",
};

// ─── LAYER B — REVIEW SUBSTRATE ───────────────────────────────────────────────

export type ReviewType =
  | "output_quality"     // Is the output correct and consequential?
  | "scope_compliance"   // Did execution stay within mission scope?
  | "policy_compliance"  // Were mission policies respected?
  | "artifact_integrity" // Is the produced artifact trustworthy?
  | "handoff_readiness"; // Is the unit ready for transfer?

export type ReviewVerdict = "pass" | "fail" | "pass_with_notes" | "escalate";

export interface ReviewRequest {
  id:            ReviewId;
  missionId:     MissionId;
  taskId?:       TaskId;
  type:          ReviewType;
  reviewedBy:    string;   // pioneerId or "sovereign"
  subject:       string;   // What is being reviewed
  criteria:      string[]; // Explicit review criteria from mission
  createdAt:     number;
}

export interface ReviewResult {
  requestId:     ReviewId;
  missionId:     MissionId;
  verdict:       ReviewVerdict;
  notes:         string;
  blockers:      string[];  // Specific items that caused fail/escalate
  resolvedAt:    number;
}

export function createReviewRequest(
  missionId: MissionId,
  opts: Pick<ReviewRequest, "type" | "reviewedBy" | "subject" | "criteria"> & { taskId?: TaskId }
): ReviewRequest {
  return {
    id:        `rev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    missionId,
    taskId:    opts.taskId,
    type:      opts.type,
    reviewedBy: opts.reviewedBy,
    subject:   opts.subject,
    criteria:  opts.criteria,
    createdAt: Date.now(),
  };
}

// ─── LAYER C — OBSERVABILITY-LITE ────────────────────────────────────────────

export type ObservationClass =
  | "run_start"       // Operation began
  | "run_progress"    // Mid-run checkpoint
  | "run_complete"    // Run finished
  | "blocker_hit"     // Execution blocked
  | "retry_attempt"   // Automatic retry triggered
  | "retry_exhausted" // All retries failed
  | "state_change"    // Mission/task status changed
  | "signal_emitted"  // Signal was sent
  | "approval_needed" // Approval gate triggered
  | "handoff_sent";   // Handoff dispatched

/**
 * A lightweight operational observation — the minimal truth of what happened.
 * Not logs. Not metrics. Sovereign operational ledger entries.
 */
export interface RunObservation {
  id:           string;
  missionId:    MissionId;
  taskId?:      TaskId;
  class:        ObservationClass;
  summary:      string;   // One line — what happened
  detail?:      string;   // Optional expansion
  pioneerId?:   string;
  at:           number;
}

export interface OperationState {
  missionId:       MissionId;
  activeTasks:     number;
  blockedTasks:    number;
  completedTasks:  number;
  pendingApprovals: number;
  lastObservation?: RunObservation;
  runningPioneer?:  string;
  retryCount:       number;
  isHealthy:        boolean;
  lastUpdated:      number;
}

export function buildOperationState(
  missionId: MissionId,
  tasks: MissionTask[],
  observations: RunObservation[],
  pendingApprovals: number
): OperationState {
  const last = observations.reduce<RunObservation | undefined>(
    (best, o) => (!best || o.at > best.at ? o : best),
    undefined
  );
  const blocked   = tasks.filter((t) => t.status === "blocked").length;
  const active    = tasks.filter((t) => t.status === "active").length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  return {
    missionId,
    activeTasks:      active,
    blockedTasks:     blocked,
    completedTasks:   completed,
    pendingApprovals,
    lastObservation:  last,
    runningPioneer:   last?.pioneerId,
    retryCount:       observations.filter((o) => o.class === "retry_attempt").length,
    isHealthy:        blocked === 0,
    lastUpdated:      Date.now(),
  };
}

// ─── LAYER D — APPROVAL SUBSTRATE ────────────────────────────────────────────

export type ApprovalTrigger =
  | "irreversible_action"  // Cannot be undone
  | "high_risk_operation"  // Risk level high or critical
  | "scope_boundary_cross" // Operation near or at mission scope edge
  | "policy_exception"     // Requires deviation from mission policy
  | "external_effect"      // Affects something outside mission boundary
  | "handoff_initiation";  // Cross-chamber or cross-pioneer transfer

export type ApprovalDecision = "approved" | "rejected" | "deferred" | "escalated";

export interface ApprovalRequest {
  id:           string;
  missionId:    MissionId;
  taskId?:      TaskId;
  trigger:      ApprovalTrigger;
  requestedBy:  string;   // pioneerId
  description:  string;   // What is being requested
  consequence:  string;   // What happens if approved / rejected
  riskLevel:    RiskLevel;
  createdAt:    number;
  expiresAt?:   number;   // If set, auto-rejects after expiry
}

export interface ApprovalRecord {
  requestId:   string;
  missionId:   MissionId;
  decision:    ApprovalDecision;
  decidedBy:   string;   // pioneerId or "sovereign"
  rationale:   string;
  resolvedAt:  number;
}

export interface ApprovalPolicy {
  missionId:          MissionId;
  autoApprove:        ApprovalTrigger[];  // These triggers never block
  requireSovereign:   ApprovalTrigger[];  // These escalate to sovereign
  maxDeferCount:      number;             // After this many defers → escalate
  expiryWindowMs:     number;             // Default expiry for approval requests
}

export function defaultApprovalPolicy(missionId: MissionId): ApprovalPolicy {
  return {
    missionId,
    autoApprove:      ["scope_boundary_cross"],
    requireSovereign: ["irreversible_action", "external_effect"],
    maxDeferCount:    2,
    expiryWindowMs:   3_600_000, // 1 hour
  };
}

export function evaluateApprovalTrigger(
  trigger: ApprovalTrigger,
  policy: ApprovalPolicy
): { decision: "auto_approve" | "require_approval" | "escalate_sovereign" } {
  if (policy.autoApprove.includes(trigger))       return { decision: "auto_approve" };
  if (policy.requireSovereign.includes(trigger))  return { decision: "escalate_sovereign" };
  return { decision: "require_approval" };
}

// ─── LAYER E — HANDOFF SUBSTRATE ─────────────────────────────────────────────

export type HandoffType =
  | "chamber_transfer"    // Work moves from one chamber to another
  | "pioneer_transfer"    // Specific pioneer hand-off within same chamber
  | "phase_advance"       // Mission phase changes after handoff
  | "escalation";         // Forced handoff due to block / risk

export type HandoffStatus = "pending" | "in_transit" | "received" | "rejected";

export interface HandoffRequest {
  id:           HandoffId;
  missionId:    MissionId;
  taskId?:      TaskId;
  type:         HandoffType;
  fromChamber:  MissionChamberLead;
  toChamber:    MissionChamberLead;
  fromPioneer?: string;
  toPioneer?:   string;
  context:      string;      // What the receiving chamber needs to know
  artifacts:    string[];    // Artifact IDs being transferred
  conditions:   string[];    // Conditions the receiver must satisfy
  riskLevel:    RiskLevel;
  createdAt:    number;
}

export interface HandoffRecord {
  requestId:    HandoffId;
  missionId:    MissionId;
  status:       HandoffStatus;
  receivedBy?:  string;
  rejectReason?: string;
  resolvedAt:   number;
}

export function createHandoff(
  missionId: MissionId,
  opts: Omit<HandoffRequest, "id" | "createdAt">
): HandoffRequest {
  return {
    id:        `hoff_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    missionId,
    createdAt: Date.now(),
    ...opts,
  };
}

// ─── LAYER F — SIGNAL / NOTIFICATION SUBSTRATE ───────────────────────────────

export type SignalType =
  | "blocker"          // Something is blocking progress
  | "approval_needed"  // Operator input required
  | "task_complete"    // Unit of work finished
  | "mission_advance"  // Mission moved to next status
  | "drift_detected"   // Intelligence detected scope drift
  | "retry_needed"     // Automatic action failed, retry warranted
  | "handoff_ready"    // A handoff is staged and waiting
  | "insight";         // Intelligence-generated observation worth surfacing

export type SignalPriority = "critical" | "high" | "standard" | "ambient";

/**
 * A mission signal is a consequential notification, not a notification-stream entry.
 * Signals are sparse. They only fire when sovereign attention is warranted.
 * NOT a general event log. NOT a notification bell.
 */
export interface MissionSignal {
  id:          SignalId;
  missionId:   MissionId;
  taskId?:     TaskId;
  type:        SignalType;
  priority:    SignalPriority;
  headline:    string;   // One line — what is happening
  body?:       string;   // Optional: what to do about it
  actionable:  boolean;  // Does this require operator decision?
  dismissed:   boolean;
  createdAt:   number;
  dismissedAt?: number;
}

export function emitSignal(
  missionId: MissionId,
  opts: Pick<MissionSignal, "type" | "priority" | "headline"> &
    Partial<Pick<MissionSignal, "body" | "taskId" | "actionable">>
): MissionSignal {
  return {
    id:         `sig_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    missionId,
    taskId:     opts.taskId,
    type:       opts.type,
    priority:   opts.priority,
    headline:   opts.headline,
    body:       opts.body,
    actionable: opts.actionable ?? false,
    dismissed:  false,
    createdAt:  Date.now(),
  };
}

export function dismissSignal(signal: MissionSignal): MissionSignal {
  return { ...signal, dismissed: true, dismissedAt: Date.now() };
}

export function getActiveSignals(signals: MissionSignal[]): MissionSignal[] {
  return signals
    .filter((s) => !s.dismissed)
    .sort((a, b) => {
      const rank: Record<SignalPriority, number> = { critical: 0, high: 1, standard: 2, ambient: 3 };
      return rank[a.priority] - rank[b.priority] || b.createdAt - a.createdAt;
    });
}

export const SIGNAL_TYPE_LABEL: Record<SignalType, string> = {
  blocker:         "blocked",
  approval_needed: "approval needed",
  task_complete:   "task done",
  mission_advance: "mission advanced",
  drift_detected:  "drift",
  retry_needed:    "retry",
  handoff_ready:   "handoff ready",
  insight:         "insight",
};

// ─── LAYER G — RELEASE / EXECUTION GOVERNANCE ────────────────────────────────

export type ReleaseGateStatus = "open" | "locked" | "passing" | "failing" | "bypassed";

export type GovernanceAction =
  | "execute"     // Proceed with operation
  | "preview"     // Run in preview-only mode
  | "deploy"      // Publish or ship output
  | "rollback"    // Revert to prior state
  | "retry"       // Re-attempt failed operation
  | "abort";      // Stop and record abandonment

/**
 * A release gate is a mission-defined checkpoint.
 * All deploy/publish/external actions must pass their gate before proceeding.
 * Gates are NOT CI pipelines. They are sovereign execution controls.
 */
export interface ReleaseGate {
  id:           string;
  missionId:    MissionId;
  label:        string;
  status:       ReleaseGateStatus;
  checks:       string[];     // What must be true to open the gate
  currentCheck: number;       // Index of current check (0-indexed)
  blockedBy?:   string;       // Description of what is blocking
  bypassedBy?:  string;       // pioneerId who bypassed (requires sovereign approval)
  createdAt:    number;
  resolvedAt?:  number;
}

export interface ExecutionGovernanceRecord {
  id:          string;
  missionId:   MissionId;
  taskId?:     TaskId;
  action:      GovernanceAction;
  triggeredBy: string;   // pioneerId or "sovereign"
  approved:    boolean;
  gateId?:     string;
  consequence: string;   // What this action produced or failed to produce
  at:          number;
}

export interface RollbackRecord {
  id:          string;
  missionId:   MissionId;
  triggeredBy: string;
  reason:      string;
  revertedTo:  string;   // Description of prior state restored
  at:          number;
}

export function buildReleaseGate(
  missionId: MissionId,
  label: string,
  checks: string[]
): ReleaseGate {
  return {
    id:           `gate_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    missionId,
    label,
    status:       "locked",
    checks,
    currentCheck: 0,
    createdAt:    Date.now(),
  };
}

export function advanceReleaseGate(gate: ReleaseGate): ReleaseGate {
  const next = gate.currentCheck + 1;
  if (next >= gate.checks.length) {
    return { ...gate, currentCheck: next, status: "passing", resolvedAt: Date.now() };
  }
  return { ...gate, currentCheck: next };
}

// ─── LAYER H — OPERATION FLOW ─────────────────────────────────────────────────

export type FlowStepStatus = "pending" | "running" | "done" | "blocked" | "skipped";
export type FlowState      = "dormant" | "initializing" | "running" | "paused" | "complete" | "failed";

/**
 * A flow step is one governed unit within a mission operation flow.
 * Flows coordinate tasks, reviews, approvals, and handoffs
 * into a coherent, sequenced operational execution.
 */
export interface FlowStep {
  id:         string;
  order:      number;
  label:      string;
  taskId?:    TaskId;
  reviewId?:  ReviewId;
  handoffId?: HandoffId;
  status:     FlowStepStatus;
  gatedBy?:   string;    // Gate ID that must pass before this step can run
  startedAt?: number;
  doneAt?:    number;
}

/**
 * An operation flow is the coordinated execution plan for a mission.
 * It is NOT a DAG tool. NOT a workflow builder.
 * It is the sovereign operational spine of a mission run.
 */
export interface OperationFlow {
  id:          FlowId;
  missionId:   MissionId;
  label:       string;
  state:       FlowState;
  steps:       FlowStep[];
  currentStep: number;    // Index into steps
  missionStatus: MissionStatus;  // Snapshot at flow creation
  createdAt:   number;
  updatedAt:   number;
  completedAt?: number;
}

export function createOperationFlow(
  missionId: MissionId,
  label: string,
  steps: Omit<FlowStep, "id" | "status" | "order">[],
  missionStatus: MissionStatus
): OperationFlow {
  const now = Date.now();
  return {
    id:           `flow_${now}_${Math.random().toString(36).slice(2, 8)}`,
    missionId,
    label,
    state:        "dormant",
    steps:        steps.map((s, i) => ({
      ...s,
      id:     `step_${now}_${i}`,
      order:  i,
      status: "pending",
    })),
    currentStep:   0,
    missionStatus,
    createdAt:     now,
    updatedAt:     now,
  };
}

export function advanceFlow(flow: OperationFlow): OperationFlow {
  const steps = [...flow.steps];
  const current = steps[flow.currentStep];
  if (!current) return flow;
  steps[flow.currentStep] = { ...current, status: "done", doneAt: Date.now() };
  const nextIdx = flow.currentStep + 1;
  const complete = nextIdx >= steps.length;
  return {
    ...flow,
    steps,
    currentStep:  complete ? flow.currentStep : nextIdx,
    state:        complete ? "complete" : "running",
    completedAt:  complete ? Date.now() : flow.completedAt,
    updatedAt:    Date.now(),
  };
}

export function getCurrentFlowStep(flow: OperationFlow): FlowStep | undefined {
  return flow.steps[flow.currentStep];
}

// ─── AUTONOMOUS OPERATIONS STATE ─────────────────────────────────────────────

/**
 * The unified per-mission autonomous operations envelope.
 * Aggregates all 8 layers into one mission-bound state object.
 */
export interface MissionOperationsState {
  missionId:        MissionId;
  tasks:            MissionTask[];
  activeFlow?:      OperationFlow;
  observations:     RunObservation[];
  pendingApprovals: ApprovalRequest[];
  approvalHistory:  ApprovalRecord[];
  signals:          MissionSignal[];
  releaseGates:     ReleaseGate[];
  governanceLog:    ExecutionGovernanceRecord[];
  rollbacks:        RollbackRecord[];
  operationState:   OperationState;
  lastUpdated:      number;
}

export function defaultMissionOperationsState(missionId: MissionId): MissionOperationsState {
  const now = Date.now();
  return {
    missionId,
    tasks:            [],
    observations:     [],
    pendingApprovals: [],
    approvalHistory:  [],
    signals:          [],
    releaseGates:     [],
    governanceLog:    [],
    rollbacks:        [],
    operationState:   {
      missionId,
      activeTasks:      0,
      blockedTasks:     0,
      completedTasks:   0,
      pendingApprovals: 0,
      retryCount:       0,
      isHealthy:        true,
      lastUpdated:      now,
    },
    lastUpdated: now,
  };
}
