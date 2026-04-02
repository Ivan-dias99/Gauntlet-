/**
 * RUBERRA STACK 03 — Sovereign Intelligence
 * Mission-bound intelligence substrate.
 *
 * All 8 layers of sovereign intelligence are defined here.
 * Every layer is mission-bound — not generic-assistant-bound.
 *
 * The existing intelligence-foundation.ts, model-orchestration.ts,
 * and routing-contracts.ts are preserved as-is. This file does not
 * replace them — it elevates them by binding intelligence to missions.
 *
 * DO NOT treat this as a chatbot AI layer.
 * Sovereign intelligence serves the mission — not the session.
 */

import { assertStackOrder } from "./canon-sovereignty";
import { type MissionId, type MissionChamberLead, type MissionStatus } from "./mission-substrate";
import { type Tab } from "../components/shell-types";

// ─── Stack order guard ────────────────────────────────────────────────────────

const _orderGuard = assertStackOrder("intelligence", ["canon", "mission"]);
if (!_orderGuard.valid) {
  console.warn("[Ruberra Sovereign Intelligence] Stack order violation:", _orderGuard.reason);
}

// ─── LAYER A — REASONING ──────────────────────────────────────────────────────

export type ReasoningMode =
  | "synthesis"      // Combine multiple inputs into one coherent output
  | "decomposition"  // Break a complex problem into tractable parts
  | "comparison"     // Evaluate options against each other
  | "critique"       // Identify flaws, gaps, and contradictions
  | "planning"       // Generate ordered execution steps
  | "verification"   // Confirm a claim, output, or decision against truth
  | "expansion"      // Generate possibilities not yet considered
  | "compression";   // Reduce without losing essential truth

export type ReasoningDepth = "shallow" | "standard" | "deep" | "exhaustive";

export interface MissionReasoningRequest {
  missionId:     MissionId;
  mode:          ReasoningMode;
  depth:         ReasoningDepth;
  inputText:     string;
  constraints:   string[];      // From mission policy + memory constraints
  priorContext?: string;        // Compressed context from previous reasoning
  outputFormat:  "structured" | "prose" | "chain_of_thought" | "verdict";
}

export interface ReasoningStep {
  id:        string;
  at:        number;
  operation: string;
  input:     string;
  output:    string;
  confidence: "low" | "medium" | "high";
}

export interface MissionReasoningResult {
  requestId:   string;
  missionId:   MissionId;
  mode:        ReasoningMode;
  steps:       ReasoningStep[];
  conclusion:  string;
  confidence:  "low" | "medium" | "high";
  nextActions: string[];
  producedAt:  number;
}

// ─── LAYER B — ROUTING ────────────────────────────────────────────────────────

export type RouteDepth = "fast" | "standard" | "deep";

export interface MissionRouteRequest {
  missionId:        MissionId;
  missionStatus:    MissionStatus;
  chamberLead:      MissionChamberLead;
  requestText:      string;
  preferredPioneer?: string;
  depth:            RouteDepth;
  sessionChamber:   Tab;
}

export interface MissionRouteResult {
  missionId:      MissionId;
  chamber:        Tab;
  pioneerId:      string;
  giId:           string;
  supportChain:   string[];
  fallbackChain:  string[];
  workflowId?:    string;
  modelId:        string;
  reason:         string;
  missionReason:  string;    // Why this route serves THIS mission specifically
  depth:          RouteDepth;
  resolvedAt:     number;
}

/**
 * Resolve a mission-bound route.
 * Wraps existing intent/chamber routing with mission-first context.
 * Does not replace routing-contracts.ts — calls through it.
 */
export function resolveMissionRoute(req: MissionRouteRequest): MissionRouteResult {
  const now = Date.now();

  // Mission-first biases: honor the mission's declared chamber lead
  const chamber: Tab = req.chamberLead;

  // Pioneer selection by chamber lead
  const CHAMBER_PIONEER: Record<MissionChamberLead, string> = {
    lab:      "claude-architect",
    school:   "gemini-expansion",
    creation: "cursor-builder",
  };
  const CHAMBER_GI: Record<MissionChamberLead, string> = {
    lab:      "lab_analyst_core",
    school:   "school_tutor_core",
    creation: "creation_build_core",
  };
  const CHAMBER_WORKFLOW: Record<MissionChamberLead, string> = {
    lab:      "research-heavy",
    school:   "learning-heavy",
    creation: "build-heavy",
  };
  const CHAMBER_MODEL: Record<MissionChamberLead, string> = {
    lab:      "claude-sonnet-5.0",
    school:   "claude-opus-4.6",
    creation: "gpt-5.4-creator",
  };

  const pioneer   = req.preferredPioneer ?? CHAMBER_PIONEER[req.chamberLead];
  const gi        = CHAMBER_GI[req.chamberLead];
  const workflow  = CHAMBER_WORKFLOW[req.chamberLead];
  const model     = CHAMBER_MODEL[req.chamberLead];

  return {
    missionId:     req.missionId,
    chamber,
    pioneerId:     pioneer,
    giId:          gi,
    supportChain:  [pioneer],
    fallbackChain: [CHAMBER_PIONEER[req.chamberLead === "lab" ? "creation" : "lab"]],
    workflowId:    workflow,
    modelId:       model,
    reason:        `Mission "${req.missionId}" routes to ${chamber} — mission chamber lead`,
    missionReason: `Honoring mission chamber lead: ${req.chamberLead}. Request depth: ${req.depth}.`,
    depth:         req.depth,
    resolvedAt:    now,
  };
}

// ─── LAYER C — MEMORY INTELLIGENCE ───────────────────────────────────────────

export type MemoryPriority = "critical" | "high" | "standard" | "low" | "discard";

export interface MemoryItem {
  id:           string;
  missionId:    MissionId;
  content:      string;
  sourceType:   "decision" | "constraint" | "reasoning" | "output" | "context" | "signal";
  priority:     MemoryPriority;
  createdAt:    number;
  lastAccessAt: number;
  accessCount:  number;
  compressed:   boolean;
  compressedSummary?: string;
}

export interface MemoryRecallRequest {
  missionId:    MissionId;
  query:        string;
  maxItems:     number;
  minPriority:  MemoryPriority;
  sourceTypes?: MemoryItem["sourceType"][];
}

export interface MemoryRecallResult {
  missionId:   MissionId;
  items:       MemoryItem[];
  totalFound:  number;
  compressed:  number;         // How many items were returned in compressed form
  recalledAt:  number;
}

export type CompressionPolicy = "preserve_all" | "compress_low" | "compress_standard_and_low" | "critical_only";

export interface ContextCompressionRequest {
  missionId:  MissionId;
  items:      MemoryItem[];
  policy:     CompressionPolicy;
  maxTokenBudget: number;
}

export interface ContextCompressionResult {
  missionId:   MissionId;
  kept:        MemoryItem[];      // Items kept verbatim
  compressed:  MemoryItem[];      // Items kept in summary form
  discarded:   string[];          // IDs of discarded items
  tokenEstimate: number;
  compressedAt: number;
}

/**
 * Prioritize memory items for recall.
 * Critical and high-priority items are always included.
 * Standard items are included if budget allows.
 * Low and discard items are compressed or dropped.
 */
export function prioritizeMemory(
  items: MemoryItem[],
  query: string,
  maxItems: number,
): MemoryItem[] {
  const PRIORITY_ORDER: MemoryPriority[] = ["critical", "high", "standard", "low", "discard"];
  const queryLower = query.toLowerCase();

  // Score by priority + recency + query relevance
  const scored = items.map((item) => {
    const priorityScore = (PRIORITY_ORDER.length - PRIORITY_ORDER.indexOf(item.priority)) * 100;
    const recencyScore  = Math.max(0, 50 - Math.floor((Date.now() - item.lastAccessAt) / 86_400_000));
    const relevanceScore= queryLower.split(" ").filter((w) => w.length > 3 && item.content.toLowerCase().includes(w)).length * 20;
    return { item, score: priorityScore + recencyScore + relevanceScore };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems)
    .map((s) => s.item);
}

// ─── LAYER D — AGENT / PIONEER ORCHESTRATION ─────────────────────────────────

export type PioneerRole = "lead" | "support" | "qa" | "specialist" | "subagent";

export interface MissionPioneerBinding {
  missionId:    MissionId;
  pioneerId:    string;
  role:         PioneerRole;
  chamber:      Tab;
  activeSince:  number;
  completedAt?: number;
  outputIds:    string[];   // IDs of artifacts/continuity items this pioneer produced
}

export interface SubagentSpawnDecision {
  parentPioneerId: string;
  subagentId:      string;
  missionId:       MissionId;
  reason:          string;
  spawnCondition:  string;
  chamber:         Tab;
  spawnAt:         number;
}

export interface MissionOrchestrationPlan {
  missionId:        MissionId;
  lead:             MissionPioneerBinding;
  support:          MissionPioneerBinding[];
  subagentDecisions: SubagentSpawnDecision[];
  workflowId?:      string;
  estimatedDepth:   RouteDepth;
  crossChamberPath: Tab[];
  createdAt:        number;
}

/**
 * Build a mission orchestration plan from a route and mission context.
 */
export function buildOrchestrationPlan(
  missionId: MissionId,
  route: MissionRouteResult,
  supportPioneerIds: string[],
): MissionOrchestrationPlan {
  const now = Date.now();
  const lead: MissionPioneerBinding = {
    missionId,
    pioneerId:   route.pioneerId,
    role:        "lead",
    chamber:     route.chamber as Tab,
    activeSince: now,
    outputIds:   [],
  };
  const support: MissionPioneerBinding[] = supportPioneerIds.map((id) => ({
    missionId,
    pioneerId:   id,
    role:        "support" as PioneerRole,
    chamber:     route.chamber as Tab,
    activeSince: now,
    outputIds:   [],
  }));

  return {
    missionId,
    lead,
    support,
    subagentDecisions: [],
    workflowId:        route.workflowId,
    estimatedDepth:    route.depth,
    crossChamberPath:  [route.chamber as Tab],
    createdAt:         now,
  };
}

// ─── LAYER E — TOOL INTELLIGENCE ─────────────────────────────────────────────

export type ToolDecisionOutcome = "use" | "skip" | "fallback" | "chain";

export interface ToolDecision {
  missionId:    MissionId;
  toolId:       string;
  toolLabel:    string;
  outcome:      ToolDecisionOutcome;
  reason:       string;
  fallbackToolId?: string;
  consequenceId?:  string;  // ContinuityItem or artifact ID
  decidedAt:    number;
}

export interface ToolChainStep {
  order:     number;
  toolId:    string;
  purpose:   string;
  inputFrom: "mission_context" | "prior_step" | "user_input" | "memory";
  outputTo:  "mission_artifact" | "next_step" | "consequence" | "discard";
}

export interface ToolChain {
  id:        string;
  missionId: MissionId;
  steps:     ToolChainStep[];
  createdAt: number;
}

export interface ToolConsequenceRecord {
  id:          string;
  missionId:   MissionId;
  toolId:      string;
  phase:       "requested" | "executing" | "completed" | "failed";
  outcome:     "success" | "partial" | "failed";
  outputRef?:  string;
  recordedAt:  number;
}

// ─── LAYER F — CONTEXT COMPRESSION ───────────────────────────────────────────

export type ContextFrameType =
  | "mission_identity"   // The mission's name, outcome, scope — always kept
  | "active_constraint"  // Hard constraints — always kept
  | "recent_decision"    // Last N decisions — compressed after threshold
  | "prior_reasoning"    // Archived reasoning — eligible for compression
  | "artifact_ref"       // Reference to an artifact — kept as pointer
  | "session_context"    // Current session chat context
  | "background";        // Background knowledge — eligible for discard

export interface ContextFrame {
  id:           string;
  missionId:    MissionId;
  type:         ContextFrameType;
  content:      string;
  tokenEstimate: number;
  priority:     MemoryPriority;
  compressible: boolean;
  createdAt:    number;
}

/**
 * Compression policy matrix.
 * Determines what happens to each frame type under each policy.
 */
export const COMPRESSION_POLICY_MATRIX: Record<
  CompressionPolicy,
  Record<ContextFrameType, "keep" | "compress" | "discard">
> = {
  preserve_all: {
    mission_identity:  "keep",
    active_constraint: "keep",
    recent_decision:   "keep",
    prior_reasoning:   "keep",
    artifact_ref:      "keep",
    session_context:   "keep",
    background:        "keep",
  },
  compress_low: {
    mission_identity:  "keep",
    active_constraint: "keep",
    recent_decision:   "keep",
    prior_reasoning:   "compress",
    artifact_ref:      "keep",
    session_context:   "keep",
    background:        "compress",
  },
  compress_standard_and_low: {
    mission_identity:  "keep",
    active_constraint: "keep",
    recent_decision:   "compress",
    prior_reasoning:   "compress",
    artifact_ref:      "keep",
    session_context:   "compress",
    background:        "discard",
  },
  critical_only: {
    mission_identity:  "keep",
    active_constraint: "keep",
    recent_decision:   "discard",
    prior_reasoning:   "discard",
    artifact_ref:      "keep",
    session_context:   "discard",
    background:        "discard",
  },
};

/**
 * Apply a compression policy to a set of context frames.
 * Returns frames organized by action.
 */
export function applyCompressionPolicy(
  frames:  ContextFrame[],
  policy:  CompressionPolicy,
  budget:  number,
): ContextCompressionResult {
  const matrix  = COMPRESSION_POLICY_MATRIX[policy];
  const kept: MemoryItem[]       = [];
  const compressed: MemoryItem[] = [];
  const discarded: string[]      = [];
  let tokens = 0;

  for (const frame of frames) {
    const action = matrix[frame.type];
    if (action === "discard") {
      discarded.push(frame.id);
      continue;
    }
    if (tokens + frame.tokenEstimate > budget && action !== "keep") {
      discarded.push(frame.id);
      continue;
    }

    const item: MemoryItem = {
      id:           frame.id,
      missionId:    frame.missionId,
      content:      frame.content,
      sourceType:   "context",
      priority:     frame.priority,
      createdAt:    frame.createdAt,
      lastAccessAt: Date.now(),
      accessCount:  0,
      compressed:   action === "compress",
      compressedSummary: action === "compress" ? `[compressed: ${frame.type}]` : undefined,
    };

    if (action === "compress") {
      compressed.push(item);
      tokens += Math.floor(frame.tokenEstimate * 0.3);
    } else {
      kept.push(item);
      tokens += frame.tokenEstimate;
    }
  }

  return {
    missionId:     frames[0]?.missionId ?? "",
    kept,
    compressed,
    discarded,
    tokenEstimate: tokens,
    compressedAt:  Date.now(),
  };
}

// ─── LAYER G — AUTONOMY ───────────────────────────────────────────────────────

export type AutonomyDecision = "continue" | "pause_check" | "escalate" | "stop";

export type RiskLevel = "none" | "low" | "medium" | "high" | "critical";

export interface AutonomySignal {
  missionId:   MissionId;
  decision:    AutonomyDecision;
  riskLevel:   RiskLevel;
  reason:      string;
  triggerType: "policy_violation" | "irreversible_action" | "scope_breach" | "ambiguity" | "resource_limit" | "safe_continuation";
  requiresInput: boolean;
  decidedAt:   number;
}

/**
 * Mission policy rules that govern autonomy decisions.
 */
export interface AutonomyPolicy {
  missionId:                MissionId;
  maxAutoStepsBeforeCheck:  number;
  allowIrreversibleActions: boolean;
  requireApprovalFor:       string[];   // From MissionPolicy.requiresApproval
  forbiddenActions:         string[];   // From MissionPolicy.forbidden
  scopeBoundary:            string;     // From MissionIdentity.scope
}

/**
 * Evaluate whether an action is safe to continue autonomously.
 * Returns an AutonomySignal with the decision and reason.
 */
export function evaluateAutonomy(
  action:        string,
  policy:        AutonomyPolicy,
  stepCount:     number,
): AutonomySignal {
  const now = Date.now();
  const actionLower = action.toLowerCase();

  // Check forbidden actions first
  for (const forbidden of policy.forbiddenActions) {
    if (actionLower.includes(forbidden.toLowerCase())) {
      return { missionId: policy.missionId, decision: "stop", riskLevel: "critical", reason: `Action "${action}" is forbidden by mission policy: "${forbidden}"`, triggerType: "policy_violation", requiresInput: false, decidedAt: now };
    }
  }

  // Check requires-approval list
  for (const approval of policy.requireApprovalFor) {
    if (actionLower.includes(approval.toLowerCase())) {
      return { missionId: policy.missionId, decision: "escalate", riskLevel: "high", reason: `Action "${action}" requires approval per mission policy: "${approval}"`, triggerType: "irreversible_action", requiresInput: true, decidedAt: now };
    }
  }

  // Check step count threshold
  if (stepCount >= policy.maxAutoStepsBeforeCheck) {
    return { missionId: policy.missionId, decision: "pause_check", riskLevel: "low", reason: `Reached ${stepCount} autonomous steps. Checking in before continuing.`, triggerType: "safe_continuation", requiresInput: true, decidedAt: now };
  }

  return { missionId: policy.missionId, decision: "continue", riskLevel: "none", reason: `Action "${action}" is within policy. Continuing autonomously.`, triggerType: "safe_continuation", requiresInput: false, decidedAt: now };
}

// ─── LAYER H — INSIGHT ────────────────────────────────────────────────────────

export type InsightType =
  | "bottleneck"          // Something is blocking mission progress
  | "pattern"             // A recurring behavior, success, or failure
  | "next_best_action"    // The highest-value next step
  | "drift_warning"       // Mission is drifting from its identity/scope
  | "optimization"        // A way to do the same thing better
  | "risk_forecast"       // A risk not yet materialized but likely
  | "compound_opportunity"; // A chance to compound prior mission work

export type InsightSeverity = "informational" | "actionable" | "urgent";

export interface MissionInsight {
  id:          string;
  missionId:   MissionId;
  type:        InsightType;
  severity:    InsightSeverity;
  title:       string;
  body:        string;
  evidence:    string[];       // References to decisions, runs, memory items
  suggestedAction?: string;
  generatedAt: number;
  acknowledged: boolean;
}

/**
 * Generate a drift warning insight if mission behavior contradicts its scope or identity.
 */
export function detectMissionDrift(
  missionId:     MissionId,
  missionScope:  string,
  recentActions: string[],
): MissionInsight | null {
  const scopeLower = missionScope.toLowerCase();
  const scopeKeywords = scopeLower.split(" ").filter((w) => w.length > 4);

  const driftedActions = recentActions.filter((action) => {
    const actionLower = action.toLowerCase();
    const inScope = scopeKeywords.some((kw) => actionLower.includes(kw));
    return !inScope;
  });

  if (driftedActions.length === 0) return null;

  return {
    id:              `insight-drift-${Date.now()}`,
    missionId,
    type:            "drift_warning",
    severity:        "actionable",
    title:           "Mission drift detected",
    body:            `${driftedActions.length} recent action(s) appear outside mission scope: "${missionScope}".`,
    evidence:        driftedActions.slice(0, 3),
    suggestedAction: "Review and remove or re-scope actions that contradict mission boundaries.",
    generatedAt:     Date.now(),
    acknowledged:    false,
  };
}

/**
 * Generate a next-best-action insight from mission state.
 */
export function suggestNextBestAction(
  missionId:    MissionId,
  status:       MissionStatus,
  runCount:     number,
  artifactCount: number,
  hasBlocker:   boolean,
): MissionInsight {
  let title:  string;
  let body:   string;
  let action: string;

  if (hasBlocker) {
    title  = "Mission is blocked";
    body   = "The mission cannot advance without resolving the active blocker.";
    action = "Identify and remove the blocker before continuing execution.";
  } else if (status === "birth" && runCount === 0) {
    title  = "Mission born — ready for first run";
    body   = "The mission has been created but no runs have started. Enter the lead chamber to begin.";
    action = "Enter the mission's lead chamber and start the first run.";
  } else if (status === "active" && artifactCount === 0) {
    title  = "Mission active — no artifacts yet";
    body   = "Execution is underway but no artifacts have been produced. Focus on producing the first concrete output.";
    action = "Drive the current run to produce at least one mission artifact.";
  } else if (status === "paused") {
    title  = "Mission paused — resume or transfer";
    body   = "This mission has active work that has not been continued.";
    action = "Resume from the Profile ledger or transfer to another chamber.";
  } else {
    title  = "Mission progressing";
    body   = `${runCount} run(s), ${artifactCount} artifact(s). Continue execution or advance to next phase.`;
    action = "Continue execution or close the mission when outcome is achieved.";
  }

  return {
    id:               `insight-nba-${Date.now()}`,
    missionId,
    type:             "next_best_action",
    severity:         hasBlocker ? "urgent" : status === "birth" ? "actionable" : "informational",
    title,
    body,
    suggestedAction:  action,
    evidence:         [],
    generatedAt:      Date.now(),
    acknowledged:     false,
  };
}

// ─── INTELLIGENCE STATE ───────────────────────────────────────────────────────

/**
 * The live intelligence state for a single mission.
 * Aggregates all 8 layers for a given mission at a point in time.
 */
export interface MissionIntelligenceState {
  missionId:          MissionId;
  route:              MissionRouteResult | null;
  orchestration:      MissionOrchestrationPlan | null;
  memory:             MemoryItem[];
  insights:           MissionInsight[];
  activeToolChains:   ToolChain[];
  toolConsequences:   ToolConsequenceRecord[];
  autonomySignals:    AutonomySignal[];
  lastUpdated:        number;
}

export function defaultMissionIntelligenceState(missionId: MissionId): MissionIntelligenceState {
  return {
    missionId,
    route:            null,
    orchestration:    null,
    memory:           [],
    insights:         [],
    activeToolChains: [],
    toolConsequences: [],
    autonomySignals:  [],
    lastUpdated:      Date.now(),
  };
}
