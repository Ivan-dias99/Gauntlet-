/**
 * RUBERRA — Autonomous Operations Stack (Stack 04)
 * Constitutional Layer: Stack 04 · Phase: intelligence
 *
 * This file is the machine-readable substrate of the Autonomous Operations layer.
 * It is NOT a generic task manager, PM tool, or workflow SaaS.
 *
 * Every construct here is mission-bound:
 *   - Tasks serve missions, not backlogs
 *   - Reviews are mission-aware, not generic approval chains
 *   - Approvals are constitutional, not permission dialogs
 *   - Handoffs are controlled transfers, not chat handoffs
 *   - Signals are mission-native, not notification spam
 *   - Execution governance is consequence-bearing, not deploy buttons
 *   - Operation flows are coordinated systems, not isolated actions
 *
 * Dependencies: Stack 01 (canon), Stack 02 (mission), Stack 03 (intelligence)
 */

import { assertStackOrder } from "../dna/canon-sovereignty";
import { type Tab } from "./shell-types";
import { type PioneerId } from "./pioneer-registry";
import { type WorkflowId } from "./workflow-engine";

// ─── Stack order guard ────────────────────────────────────────────────────────

const _orderGuard = assertStackOrder("operations", ["canon", "mission", "intelligence"]);
if (!_orderGuard.valid) {
  console.warn("[Ruberra Autonomous Operations] Stack order violation:", _orderGuard.reason);
}

// ─── TASK LAYER ───────────────────────────────────────────────────────────────

/**
 * Phase states for a mission-bound task.
 * Immutable transition graph enforced by TASK_PHASE_TRANSITIONS below.
 */
export type MissionTaskPhase =
  | "draft"          // task formed but not yet opened for execution
  | "active"         // task is open and being worked
  | "review"         // task output is under review
  | "approved"       // review passed; ready for execution consequence
  | "in_execution"   // actively executing (code running, models responding, handoff in flight)
  | "completed"      // task produced its output contract; consequence recorded
  | "blocked"        // progress halted by a real blocker (not paused by operator choice)
  | "archived";      // task closed permanently

export type MissionTaskPriority = "critical" | "high" | "standard" | "background";

/**
 * A mission-bound task. Not a generic PM ticket.
 * Every task must declare what mission it serves and what output it produces.
 */
export interface MissionTask {
  id:                   string;
  /** The mission this task serves — required; no orphan tasks */
  missionId:            string;
  title:                string;
  /** Intent: why this task exists in the mission — one sentence */
  intent:               string;
  phase:                MissionTaskPhase;
  priority:             MissionTaskPriority;
  ownerPioneerId:       PioneerId;
  chamber:              Exclude<Tab, "profile">;
  workflowId?:          WorkflowId;
  workflowStageId?:     string;
  linkedObjectIds:      string[];
  linkedContinuityId?:  string;
  /** Whether this task requires explicit approval before execution consequence */
  requiresApproval:     boolean;
  approvalGateId?:      string;
  /** Target of next handoff from this task, if any */
  handoffTarget?: {
    chamber:    Exclude<Tab, "profile">;
    pioneerId?: PioneerId;
  };
  /** Contract: what this task must produce to be considered complete */
  outputContract:       string;
  blockerReason?:       string;
  tags:                 string[];
  createdAt:            number;
  updatedAt:            number;
  completedAt?:         number;
}

/**
 * Valid phase transitions for a MissionTask.
 * No transition outside this graph is legal.
 */
export const TASK_PHASE_TRANSITIONS: Readonly<Record<MissionTaskPhase, MissionTaskPhase[]>> = {
  draft:        ["active", "archived"],
  active:       ["review", "in_execution", "blocked", "archived"],
  review:       ["approved", "active", "archived"],
  approved:     ["in_execution", "archived"],
  in_execution: ["completed", "blocked", "review"],
  completed:    ["archived"],
  blocked:      ["active", "archived"],
  archived:     [],
} as const;

/** Check if a phase transition is legal */
export function isLegalTaskTransition(from: MissionTaskPhase, to: MissionTaskPhase): boolean {
  return TASK_PHASE_TRANSITIONS[from].includes(to);
}

// ─── REVIEW LAYER ─────────────────────────────────────────────────────────────

export type ReviewVerdict =
  | "approved"        // output meets the mission contract; proceed
  | "rejected"        // output fails the mission contract; do not proceed
  | "needs_revision"  // output is partially correct; revise and re-review
  | "escalated"       // review authority exceeded; escalate to higher layer
  | "deferred";       // review deferred by policy (time-gate, dependency gate)

export type ReviewInterventionType =
  | "correction"    // specific correction to the output
  | "clarification" // request for clarification before re-attempt
  | "escalation"    // escalate to a higher authority
  | "redirect"      // redirect the task to a different path/pioneer
  | "rollback";     // revert to a prior state

export interface ReviewIntervention {
  id:            string;
  type:          ReviewInterventionType;
  /** What the intervention targets (field, section, object ID, etc.) */
  target:        string;
  instruction:   string;
  resolvedAt?:   number;
}

/**
 * A mission-aware review record.
 * Produced when a task enters the review phase.
 * Not a generic code review or PR review — scoped to mission output validation.
 */
export interface TaskReview {
  id:             string;
  taskId:         string;
  missionId:      string;
  /** "system" for automated reviews; pioneer ID for pioneer-led reviews; "operator" for manual */
  reviewerId:     string;
  verdict:        ReviewVerdict;
  /** One clear rationale tied to the output contract */
  rationale:      string;
  interventions:  ReviewIntervention[];
  createdAt:      number;
  updatedAt:      number;
}

// ─── APPROVAL LAYER ───────────────────────────────────────────────────────────

export type ApprovalMode =
  | "auto"                  // system approves automatically when conditions pass
  | "requires_confirmation" // operator must confirm before proceeding
  | "escalate";             // elevate to a higher-authority approval layer

export type ApprovalTrigger =
  | "task_phase_change"  // a task moves to a new phase
  | "execution_start"    // a pioneer begins executing
  | "handoff"            // a handoff packet is about to be sent
  | "deployment"         // a deploy action is triggered
  | "release"            // a release gate is triggered
  | "rollback";          // a rollback is requested

export type ApprovalFallback = "auto_approve" | "auto_reject" | "escalate";

export interface ApprovalCondition {
  field:    string;
  operator: "equals" | "in" | "not_in" | "gt" | "lt" | "exists";
  value:    unknown;
}

/**
 * An approval gate.
 * Constitutional approval logic — not a permission dialog.
 * Gates govern what can proceed automatically vs what requires human confirmation.
 */
export interface ApprovalGate {
  id:                string;
  label:             string;
  trigger:           ApprovalTrigger;
  mode:              ApprovalMode;
  /** Conditions that must ALL pass for auto-approval (mode = "auto") */
  conditions:        ApprovalCondition[];
  /** Who receives escalations */
  escalateTo?:       "operator" | "lead_pioneer" | "system";
  /** Timeout in ms before fallback fires; 0 = no timeout */
  timeout:           number;
  fallbackOnTimeout: ApprovalFallback;
  createdAt:         number;
}

export type ApprovalDecision = "approved" | "rejected" | "escalated" | "timed_out";

export interface ApprovalRecord {
  id:             string;
  gateId:         string;
  missionId:      string;
  taskId?:        string;
  handoffId?:     string;
  governanceId?:  string;
  decision:       ApprovalDecision;
  decidedBy:      "auto" | "operator" | "pioneer" | "system";
  decidedAt:      number;
  rationale?:     string;
}

/**
 * Default approval gates for standard operation triggers.
 * These are the baseline gates active at Stack 04 launch.
 * Override via ApprovalGate definitions in runtime state.
 */
export const DEFAULT_APPROVAL_GATES: Readonly<ApprovalGate[]> = [
  {
    id:                "gate-deployment",
    label:             "Deployment Approval",
    trigger:           "deployment",
    mode:              "requires_confirmation",
    conditions:        [],
    escalateTo:        "operator",
    timeout:           0,
    fallbackOnTimeout: "auto_reject",
    createdAt:         0,
  },
  {
    id:                "gate-rollback",
    label:             "Rollback Approval",
    trigger:           "rollback",
    mode:              "requires_confirmation",
    conditions:        [],
    escalateTo:        "operator",
    timeout:           0,
    fallbackOnTimeout: "auto_reject",
    createdAt:         0,
  },
  {
    id:                "gate-handoff-cross-chamber",
    label:             "Cross-Chamber Handoff",
    trigger:           "handoff",
    mode:              "auto",
    conditions:        [
      { field: "state", operator: "equals", value: "pending" },
    ],
    escalateTo:        undefined,
    timeout:           30_000,
    fallbackOnTimeout: "escalate",
    createdAt:         0,
  },
  {
    id:                "gate-release",
    label:             "Release Gate",
    trigger:           "release",
    mode:              "requires_confirmation",
    conditions:        [],
    escalateTo:        "operator",
    timeout:           0,
    fallbackOnTimeout: "auto_reject",
    createdAt:         0,
  },
] as const;

// ─── HANDOFF LAYER ────────────────────────────────────────────────────────────

export type HandoffReason =
  | "phase_complete"           // current phase work is done; next phase requires different chamber/pioneer
  | "specialization_required"  // task needs a pioneer with different strengths
  | "chamber_boundary"         // work must cross from one chamber to another
  | "mission_escalation"       // mission priority escalated; requires senior pioneer
  | "pioneer_limit_reached"    // pioneer has completed its contracted scope; transfers continuation
  | "operator_redirect";       // operator explicitly redirected the work

export type HandoffState =
  | "pending"     // handoff packet formed; awaiting acceptance
  | "accepted"    // receiving pioneer has acknowledged
  | "in_transfer" // context and objects are being transferred
  | "completed"   // handoff fully resolved; receiving pioneer owns the work
  | "rejected";   // receiving pioneer or gate rejected the handoff

/**
 * A controlled handoff packet.
 * The formal mechanism for transferring work between chambers and pioneers.
 * Not a chat mention. Not an ad hoc switch. A governed transfer.
 */
export interface HandoffPacket {
  id:              string;
  missionId:       string;
  taskId?:         string;
  fromChamber:     Exclude<Tab, "profile">;
  toChamber:       Exclude<Tab, "profile">;
  fromPioneerId:   PioneerId;
  toPioneerId?:    PioneerId;
  reason:          HandoffReason;
  /** What the sending pioneer accomplished — what the receiving pioneer must know */
  context:         string;
  /** Object IDs being transferred with this handoff */
  linkedObjects:   string[];
  state:           HandoffState;
  approvalGateId?: string;
  approvalRecordId?: string;
  createdAt:       number;
  acceptedAt?:     number;
  completedAt?:    number;
  rejectionReason?: string;
}

// ─── SIGNAL LAYER ─────────────────────────────────────────────────────────────

/**
 * Mission-native signal kinds.
 * These are operational truth events — not generic notifications.
 * Each kind maps to a specific transition in the operations lifecycle.
 */
export type OperationSignalKind =
  // Task signals
  | "task_ready"           // task has moved to active and is ready for execution
  | "task_blocked"         // task has entered the blocked phase; blocker reason attached
  | "review_required"      // task needs a review pass before proceeding
  | "approval_required"    // approval gate is waiting for operator or pioneer confirmation
  // Handoff signals
  | "handoff_ready"        // handoff packet formed; receiving pioneer notified
  | "handoff_accepted"     // receiving pioneer accepted the handoff
  | "handoff_rejected"     // receiving pioneer or gate rejected the handoff
  // Execution signals
  | "execution_started"    // an operation has begun executing
  | "execution_completed"  // an operation completed its output contract
  | "execution_failed"     // an operation failed; consequence attached
  // Mission signals
  | "mission_phase_advanced" // mission moved to next operational phase
  | "mission_phase_blocked"  // mission cannot advance due to unresolved blocker
  // Deployment and release signals
  | "deployment_ready"     // deploy artifact is ready and approval gate passed
  | "deployment_live"      // deployment is live and verified
  | "rollback_triggered"   // rollback was triggered; prior state being restored
  // Flow signals
  | "flow_started"         // operation flow initialized and active
  | "flow_completed"       // operation flow completed all phases
  | "flow_blocked";        // operation flow halted by a phase blocker

/**
 * A mission-native operation signal.
 * Distinct from the generic RuntimeSignal in runtime-fabric.ts.
 * OperationSignals are tied to Stack 04 operation lifecycle events.
 */
export interface OperationSignal {
  id:            string;
  kind:          OperationSignalKind;
  missionId?:    string;
  taskId?:       string;
  handoffId?:    string;
  flowId?:       string;
  chamber:       Tab;
  severity:      "info" | "warn" | "critical";
  title:         string;
  /** One-paragraph operational truth — no noise, no filler */
  body:          string;
  /** Where the operator should navigate to address this signal */
  actionRoute?:  { tab: Tab; view: string; id?: string };
  createdAt:     number;
  read:          boolean;
  resolved:      boolean;
  resolvedAt?:   number;
  /** After this timestamp the signal is auto-expired; 0 = no expiry */
  expiresAt:     number;
}

/** Severity map for each signal kind */
export const SIGNAL_KIND_SEVERITY: Readonly<Record<OperationSignalKind, OperationSignal["severity"]>> = {
  task_ready:             "info",
  task_blocked:           "warn",
  review_required:        "info",
  approval_required:      "warn",
  handoff_ready:          "info",
  handoff_accepted:       "info",
  handoff_rejected:       "warn",
  execution_started:      "info",
  execution_completed:    "info",
  execution_failed:       "critical",
  mission_phase_advanced: "info",
  mission_phase_blocked:  "critical",
  deployment_ready:       "warn",
  deployment_live:        "info",
  rollback_triggered:     "critical",
  flow_started:           "info",
  flow_completed:         "info",
  flow_blocked:           "critical",
} as const;

/** Human-readable label for each signal kind */
export const SIGNAL_KIND_LABEL: Readonly<Record<OperationSignalKind, string>> = {
  task_ready:             "Task Ready",
  task_blocked:           "Task Blocked",
  review_required:        "Review Required",
  approval_required:      "Approval Required",
  handoff_ready:          "Handoff Ready",
  handoff_accepted:       "Handoff Accepted",
  handoff_rejected:       "Handoff Rejected",
  execution_started:      "Execution Started",
  execution_completed:    "Execution Completed",
  execution_failed:       "Execution Failed",
  mission_phase_advanced: "Mission Phase Advanced",
  mission_phase_blocked:  "Mission Phase Blocked",
  deployment_ready:       "Deployment Ready",
  deployment_live:        "Deployment Live",
  rollback_triggered:     "Rollback Triggered",
  flow_started:           "Flow Started",
  flow_completed:         "Flow Completed",
  flow_blocked:           "Flow Blocked",
} as const;

// ─── EXECUTION GOVERNANCE LAYER ───────────────────────────────────────────────

export type GovernanceAction =
  | "release"  // publish / ship an artifact or state
  | "preview"  // create a non-live preview of the output
  | "deploy"   // push to live target
  | "retry"    // retry a failed operation
  | "rollback" // revert to a prior verified state
  | "abort"    // terminate an in-flight operation
  | "pause"    // pause an active flow (not abort)
  | "resume";  // resume a paused flow

export type GovernanceResult =
  | "success"     // action completed; consequence is live
  | "partial"     // action partially completed; consequence is mixed
  | "failed"      // action failed; no consequence applied
  | "rolled_back" // state reverted to pre-action snapshot
  | "aborted";    // action was aborted before completion

/**
 * An execution governance record.
 * The audit trail for every consequential action in the operations layer.
 * Every deploy, rollback, release, and retry is a record — not just a log line.
 */
export interface ExecutionGovernanceRecord {
  id:               string;
  missionId:        string;
  taskId?:          string;
  flowId?:          string;
  action:           GovernanceAction;
  triggeredBy:      "auto" | "operator" | "pioneer" | "approval_gate";
  approvalGateId?:  string;
  approvalRecordId?: string;
  /** Serialized state snapshot before the action */
  preState:         string;
  /** Serialized state snapshot after the action */
  postState?:       string;
  result?:          GovernanceResult;
  retryCount:       number;
  maxRetries:       number;
  /** Whether a rollback is available for this record */
  rollbackAvailable: boolean;
  /** The governance record ID that this record rolled back */
  rollbackOf?:      string;
  /** One-line human-readable consequence of this action */
  consequence:      string;
  startedAt:        number;
  completedAt?:     number;
  failureReason?:   string;
}

// ─── OPERATION FLOW LAYER ─────────────────────────────────────────────────────

export type OperationFlowStatus =
  | "initializing" // flow is being set up; phases not yet active
  | "active"       // flow is running; at least one phase is in progress
  | "paused"       // flow is paused; no phases progressing
  | "completing"   // final phase in progress; flow about to close
  | "completed"    // all phases complete; consequence recorded
  | "blocked"      // flow cannot advance; blocker unresolved
  | "aborted";     // flow was terminated before natural completion

export type OperationFlowPhaseStatus =
  | "pending"   // phase not yet active
  | "active"    // phase is being executed
  | "completed" // phase output contract met
  | "skipped"   // phase was optional and skipped by policy
  | "blocked";  // phase cannot advance

/**
 * A single phase within an operation flow.
 * Each phase maps to a chamber + pioneer + set of tasks.
 */
export interface OperationFlowPhase {
  id:              string;
  label:           string;
  chamber:         Exclude<Tab, "profile">;
  pioneerId:       PioneerId;
  taskIds:         string[];
  status:          OperationFlowPhaseStatus;
  /** Condition that must be met for this phase to begin (empty = always enters) */
  entryCondition?: string;
  /** Condition that must be met for this phase to be marked complete */
  exitCondition?:  string;
  startedAt?:      number;
  completedAt?:    number;
  blockerReason?:  string;
}

/**
 * An operation flow.
 * The coordinating structure that ties multiple tasks, phases, and pioneers
 * into a single governed execution path bound to a mission.
 */
export interface OperationFlow {
  id:                 string;
  missionId:          string;
  workflowId?:        WorkflowId;
  label:              string;
  status:             OperationFlowStatus;
  phases:             OperationFlowPhase[];
  currentPhaseIndex:  number;
  activeTaskIds:      string[];
  completedTaskIds:   string[];
  /** Live blockers preventing advancement */
  blockers:           string[];
  /** IDs of handoff packets issued by this flow */
  handoffIds:         string[];
  /** IDs of governance records generated by this flow */
  governanceIds:      string[];
  startedAt:          number;
  updatedAt:          number;
  completedAt?:       number;
  abortedAt?:         number;
  abortReason?:       string;
}

// ─── STATE SUMMARY ────────────────────────────────────────────────────────────

/**
 * Point-in-time operational truth for a mission.
 * This is the observability-lite layer — the honest current state.
 * No staleness, no dashboard theater. What is actually happening right now.
 */
export interface MissionOperationState {
  missionId:           string;
  activeTasks:         MissionTask[];
  blockedTasks:        MissionTask[];
  pendingReviews:      TaskReview[];
  pendingApprovals:    ApprovalRecord[];
  pendingHandoffs:     HandoffPacket[];
  activeFlows:         OperationFlow[];
  recentSignals:       OperationSignal[];
  recentGovernance:    ExecutionGovernanceRecord[];
  /** Derived from all tasks/flows: what is the true phase of this mission operationally */
  operationalPhase:    "initializing" | "active" | "blocked" | "completing" | "idle";
  /** Whether any blocker exists that requires operator attention */
  requiresOperator:    boolean;
  lastUpdated:         number;
}

// ─── CONSTRUCTORS ─────────────────────────────────────────────────────────────

let _taskSeq = 0;
let _reviewSeq = 0;
let _handoffSeq = 0;
let _signalSeq = 0;
let _govSeq = 0;
let _flowSeq = 0;

export function createMissionTask(
  partial: Omit<MissionTask, "id" | "createdAt" | "updatedAt"> & Partial<Pick<MissionTask, "id">>,
): MissionTask {
  return {
    ...partial,
    id:        partial.id ?? `task-${Date.now()}-${++_taskSeq}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function createTaskReview(
  partial: Omit<TaskReview, "id" | "createdAt" | "updatedAt">,
): TaskReview {
  return {
    ...partial,
    id:        `review-${Date.now()}-${++_reviewSeq}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function createHandoffPacket(
  partial: Omit<HandoffPacket, "id" | "createdAt" | "state"> & Partial<Pick<HandoffPacket, "state">>,
): HandoffPacket {
  return {
    ...partial,
    id:        `handoff-${Date.now()}-${++_handoffSeq}`,
    state:     partial.state ?? "pending",
    createdAt: Date.now(),
  };
}

export function createOperationSignal(
  partial: Omit<OperationSignal, "id" | "createdAt" | "read" | "resolved" | "expiresAt"> &
           Partial<Pick<OperationSignal, "expiresAt">>,
): OperationSignal {
  return {
    ...partial,
    id:         `sig-${Date.now()}-${++_signalSeq}`,
    severity:   partial.severity ?? SIGNAL_KIND_SEVERITY[partial.kind],
    read:       false,
    resolved:   false,
    expiresAt:  partial.expiresAt ?? 0,
    createdAt:  Date.now(),
  };
}

export function createGovernanceRecord(
  partial: Omit<ExecutionGovernanceRecord, "id" | "startedAt" | "retryCount">,
): ExecutionGovernanceRecord {
  return {
    ...partial,
    id:         `gov-${Date.now()}-${++_govSeq}`,
    retryCount: 0,
    startedAt:  Date.now(),
  };
}

export function createOperationFlow(
  partial: Omit<OperationFlow, "id" | "startedAt" | "updatedAt" | "activeTaskIds" | "completedTaskIds" | "blockers" | "handoffIds" | "governanceIds" | "currentPhaseIndex">,
): OperationFlow {
  return {
    ...partial,
    id:                `flow-${Date.now()}-${++_flowSeq}`,
    currentPhaseIndex: 0,
    activeTaskIds:     [],
    completedTaskIds:  [],
    blockers:          [],
    handoffIds:        [],
    governanceIds:     [],
    startedAt:         Date.now(),
    updatedAt:         Date.now(),
  };
}

// ─── LOOKUPS + FILTERS ────────────────────────────────────────────────────────

export function getTasksByMission(tasks: MissionTask[], missionId: string): MissionTask[] {
  return tasks.filter((t) => t.missionId === missionId);
}

export function getTasksByPhase(tasks: MissionTask[], phase: MissionTaskPhase): MissionTask[] {
  return tasks.filter((t) => t.phase === phase);
}

export function getTasksByPioneer(tasks: MissionTask[], pioneerId: PioneerId): MissionTask[] {
  return tasks.filter((t) => t.ownerPioneerId === pioneerId);
}

export function getActiveFlowsForMission(flows: OperationFlow[], missionId: string): OperationFlow[] {
  return flows.filter((f) => f.missionId === missionId && (f.status === "active" || f.status === "initializing"));
}

export function getUnreadSignals(signals: OperationSignal[]): OperationSignal[] {
  return signals.filter((s) => !s.read && !s.resolved);
}

export function getPendingApprovals(approvals: ApprovalRecord[]): ApprovalRecord[] {
  // "Pending" means the approval required a non-auto decision and has not yet been resolved
  // (decision is still at its initial state — escalated or timed_out means further action needed)
  return approvals.filter((a) => a.decision === "escalated" || a.decision === "timed_out");
}

export function getBlockedTasks(tasks: MissionTask[]): MissionTask[] {
  return tasks.filter((t) => t.phase === "blocked");
}

export function getPendingHandoffs(handoffs: HandoffPacket[]): HandoffPacket[] {
  return handoffs.filter((h) => h.state === "pending" || h.state === "accepted");
}

/** Derive the operational phase of a mission from its live state */
export function deriveMissionOperationalPhase(
  tasks: MissionTask[],
  flows: OperationFlow[],
): MissionOperationState["operationalPhase"] {
  const missionTasks  = tasks;
  const missionFlows  = flows;

  const hasBlocked    = missionTasks.some((t) => t.phase === "blocked") ||
                        missionFlows.some((f) => f.status === "blocked");
  const hasActive     = missionTasks.some((t) => t.phase === "active" || t.phase === "in_execution") ||
                        missionFlows.some((f) => f.status === "active");
  const hasCompleting = missionFlows.some((f) => f.status === "completing");
  const allDone       = missionTasks.length > 0 &&
                        missionTasks.every((t) => t.phase === "completed" || t.phase === "archived");

  if (hasBlocked)    return "blocked";
  if (hasCompleting) return "completing";
  if (hasActive)     return "active";
  if (allDone)       return "idle";
  if (missionTasks.length === 0 && missionFlows.length === 0) return "initializing";
  return "idle";
}

/** Build a full MissionOperationState snapshot */
export function buildMissionOperationState(
  missionId: string,
  allTasks:      MissionTask[],
  allReviews:    TaskReview[],
  allApprovals:  ApprovalRecord[],
  allHandoffs:   HandoffPacket[],
  allFlows:      OperationFlow[],
  allSignals:    OperationSignal[],
  allGovernance: ExecutionGovernanceRecord[],
): MissionOperationState {
  const tasks       = allTasks.filter((t) => t.missionId === missionId);
  const reviews     = allReviews.filter((r) => r.missionId === missionId);
  const approvals   = allApprovals.filter((a) => a.missionId === missionId);
  const handoffs    = allHandoffs.filter((h) => h.missionId === missionId);
  const flows       = allFlows.filter((f) => f.missionId === missionId);
  const signals     = allSignals.filter((s) => s.missionId === missionId).sort((a, b) => b.createdAt - a.createdAt).slice(0, 20);
  const governance  = allGovernance.filter((g) => g.missionId === missionId).sort((a, b) => b.startedAt - a.startedAt).slice(0, 10);

  const activeTasks    = tasks.filter((t) => t.phase === "active" || t.phase === "in_execution");
  const blockedTasks   = tasks.filter((t) => t.phase === "blocked");
  const pendingReviews = reviews.filter((r) => r.verdict === "needs_revision");
  const pendingApprovals = approvals;
  const pendingHandoffs  = handoffs.filter((h) => h.state === "pending" || h.state === "accepted");
  const activeFlows      = flows.filter((f) => f.status === "active" || f.status === "initializing");

  const operationalPhase = deriveMissionOperationalPhase(tasks, flows);
  const requiresOperator = blockedTasks.length > 0 ||
    signals.some((s) => s.severity === "critical" && !s.resolved) ||
    pendingApprovals.some((a) => a.decidedBy !== "auto");

  return {
    missionId,
    activeTasks,
    blockedTasks,
    pendingReviews,
    pendingApprovals,
    pendingHandoffs,
    activeFlows,
    recentSignals: signals,
    recentGovernance: governance,
    operationalPhase,
    requiresOperator,
    lastUpdated: Date.now(),
  };
}

// ─── RUNTIME STATE SHAPE ─────────────────────────────────────────────────────

/**
 * The Autonomous Operations runtime state block.
 * This is the shape of the operations state held by the shell.
 * Extend RuntimeFabric in runtime-fabric.ts with this when wiring into App.tsx.
 */
export interface AutonomousOperationsState {
  tasks:      MissionTask[];
  reviews:    TaskReview[];
  approvals:  ApprovalRecord[];
  handoffs:   HandoffPacket[];
  flows:      OperationFlow[];
  signals:    OperationSignal[];
  governance: ExecutionGovernanceRecord[];
  gates:      ApprovalGate[];
}

export function defaultAutonomousOperationsState(): AutonomousOperationsState {
  return {
    tasks:      [],
    reviews:    [],
    approvals:  [],
    handoffs:   [],
    flows:      [],
    signals:    [],
    governance: [],
    gates:      [...DEFAULT_APPROVAL_GATES.map((g) => ({ ...g, createdAt: Date.now() }))],
  };
}
