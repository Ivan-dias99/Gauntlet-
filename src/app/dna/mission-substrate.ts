/**
 * RUBERRA STACK 02 — Mission Substrate
 * The mission is the root object of work in Ruberra.
 * Not chat. Not a raw repo. Not fragmented tasks.
 *
 * Every run, every output, every artifact, every decision
 * is bound to a mission. The mission is the atomic unit.
 *
 * This file defines the canonical Mission type system.
 * It is imported by runtime surfaces and the visible repository shell.
 *
 * DO NOT treat missions as tasks. DO NOT treat them as projects in the
 * SaaS sense. A mission is a consequence-bearing unit of sovereign work.
 */

import { assertStackOrder } from "./canon-sovereignty";
import { MISSION_CHAMBER_ACCENT } from "./chamber-accent";

// ─── Guard: Stack 01 must be installed before this module is active ──────────
const _orderGuard = assertStackOrder("mission", ["canon"]);
if (!_orderGuard.valid) {
  console.warn("[Ruberra Mission] Stack order violation:", _orderGuard.reason);
}

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type MissionId = string;

export type MissionStatus =
  | "birth"      // Mission defined but not yet active
  | "active"     // Mission is being executed
  | "paused"     // Mission paused with intent to resume
  | "blocked"    // Mission cannot advance without resolution
  | "completed"  // Mission outcome achieved
  | "archived";  // Mission closed and ledgerized

export type MissionChamberLead = "lab" | "school" | "creation";

export type MissionExecutionStyle =
  | "focused"      // Single pioneer, deep on one path
  | "parallel"     // Multiple pioneers simultaneously
  | "sequential"   // Ordered pioneer handoff
  | "exploratory"; // Open-ended discovery before convergence

export type MissionArtifactType =
  | "output"
  | "build"
  | "draft"
  | "package"
  | "asset"
  | "exportable";

// ─── MISSION IDENTITY ─────────────────────────────────────────────────────────

/**
 * The identity of a mission — what it is, what it is not,
 * which chamber leads it, and what counts as done.
 */
export interface MissionIdentity {
  /** Human-readable name of the mission */
  name: string;
  /** One to three sentences describing what this mission is */
  description: string;
  /** What this mission explicitly is NOT — the out-of-scope law */
  notThis: string;
  /** Which chamber owns execution lead */
  chamberLead: MissionChamberLead;
  /** Single sentence: what success looks like */
  outcomeStatement: string;
  /** Measurable success criteria */
  successCriteria: string[];
  /** The owned frontier — scope boundary in one line */
  scope: string;
  /** Searchable tags */
  tags: string[];
}

// ─── MISSION WORKFLOW ─────────────────────────────────────────────────────────

/**
 * The operational intelligence of a mission.
 * Determines how pioneers are stacked, how routing is biased,
 * and what execution style governs the run.
 */
export interface MissionWorkflow {
  /** Ordered pioneer IDs for this mission */
  pioneerStack: string[];
  /** Primary chamber for routing decisions */
  routingBias: MissionChamberLead;
  /** Chamber to fall back to when primary is unavailable */
  fallbackBias: MissionChamberLead;
  /** How execution is orchestrated */
  executionStyle: MissionExecutionStyle;
  /** Optional workflow template that governs this mission */
  workflowTemplateId?: string;
  /** ContinuityItem IDs bound to this mission */
  continuityRefs: string[];
}

// ─── MISSION MEMORY ───────────────────────────────────────────────────────────

export interface MissionDecision {
  id: string;
  at: number;
  statement: string;
  rationale: string;
  reversible: boolean;
}

/**
 * The memory layer of a mission.
 * Preserves decisions, context, constraints, and prior reasoning
 * across all sessions and runs. Never resets.
 */
export interface MissionMemory {
  /** Explicit decisions recorded against this mission */
  decisions: MissionDecision[];
  /** Free-form context block — what the operator knows */
  context: string;
  /** Hard constraints the mission must operate within */
  constraints: string[];
  /** Preserved reasoning threads from prior runs */
  priorReasoning: string[];
  /** ContinuityItem IDs whose memory belongs to this mission */
  continuityRefs: string[];
  lastUpdated: number;
}

// ─── MISSION LEDGER ───────────────────────────────────────────────────────────

export interface MissionRunRecord {
  id: string;
  at: number;
  chamber: MissionChamberLead;
  continuityId?: string;
  outcome: "success" | "partial" | "blocked" | "failed";
  digest: string;
}

export interface MissionStateTransition {
  from: MissionStatus;
  to: MissionStatus;
  at: number;
  reason: string;
}

/**
 * The ledger of a mission.
 * Authoritative record of every run, every state transition,
 * and every artifact export. The mission's audit trail.
 */
export interface MissionLedger {
  runHistory: MissionRunRecord[];
  transitions: MissionStateTransition[];
  currentState: MissionStatus;
  lastRunAt?: number;
  lastRunDigest?: string;
}

// ─── MISSION RUNTIME ─────────────────────────────────────────────────────────

/**
 * The executable state of a mission.
 * Tracks whether the mission can be tested, previewed, or deployed,
 * and what the current execution state is.
 */
export interface MissionRuntime {
  testable: boolean;
  previewable: boolean;
  deployable: boolean;
  lastTestedAt?: number;
  lastPreviewedAt?: number;
  lastDeployedAt?: number;
  executionState: "idle" | "running" | "completed" | "blocked" | "error";
}

// ─── MISSION ARTIFACTS ────────────────────────────────────────────────────────

export interface MissionArtifactRecord {
  id: string;
  label: string;
  type: MissionArtifactType;
  chamber: MissionChamberLead;
  linkedObjectId?: string;
  createdAt: number;
  exportPath?: string;
}

/**
 * The artifact layer of a mission.
 * All outputs, builds, drafts, packages, assets, and exportables
 * produced by this mission across all runs.
 */
export interface MissionArtifactLayer {
  artifacts: MissionArtifactRecord[];
  exportHistory: Array<{
    id: string;
    at: number;
    destination: string;
    artifactId: string;
  }>;
}

// ─── MISSION POLICY ───────────────────────────────────────────────────────────

/**
 * The policy layer of a mission.
 * Governs what is allowed, what is forbidden, what can automate,
 * what requires approval, and which connectors and models are permitted.
 */
export interface MissionPolicy {
  /** Actions / integrations permitted for this mission */
  allowed: string[];
  /** Actions / integrations explicitly forbidden */
  forbidden: string[];
  /** Actions that can execute without operator approval */
  automate: string[];
  /** Actions that require explicit operator approval before execution */
  requiresApproval: string[];
  /** Connector IDs permitted for use in this mission (empty = all permitted) */
  connectorAllowlist: string[];
  /** Model IDs permitted for this mission (empty = routing default) */
  modelAllowlist: string[];
}

// ─── MISSION ROOT OBJECT ─────────────────────────────────────────────────────

/**
 * The Mission — the root object of work in Ruberra.
 *
 * Every run, output, artifact, decision, and route
 * is bound to a mission. The mission is the atomic unit.
 */
export interface Mission {
  id: MissionId;
  identity: MissionIdentity;
  workflow: MissionWorkflow;
  memory: MissionMemory;
  ledger: MissionLedger;
  runtime: MissionRuntime;
  artifacts: MissionArtifactLayer;
  policy: MissionPolicy;
  createdAt: number;
  updatedAt: number;
}

// ─── FACTORY ─────────────────────────────────────────────────────────────────

/**
 * Create a new Mission with required identity fields.
 * All other layers are initialized to their empty default state.
 */
export function createMission(
  identity: Pick<MissionIdentity, "name" | "chamberLead"> &
    Partial<Omit<MissionIdentity, "name" | "chamberLead">>,
): Mission {
  const id = `mission-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = Date.now();

  return {
    id,
    identity: {
      name:             identity.name,
      description:      identity.description      ?? "",
      notThis:          identity.notThis           ?? "",
      chamberLead:      identity.chamberLead,
      outcomeStatement: identity.outcomeStatement  ?? "",
      successCriteria:  identity.successCriteria   ?? [],
      scope:            identity.scope             ?? "",
      tags:             identity.tags              ?? [],
    },
    workflow: {
      pioneerStack:        [],
      routingBias:         identity.chamberLead,
      fallbackBias:        identity.chamberLead === "lab" ? "creation" : "lab",
      executionStyle:      "focused",
      continuityRefs:      [],
    },
    memory: {
      decisions:      [],
      context:        "",
      constraints:    [],
      priorReasoning: [],
      continuityRefs: [],
      lastUpdated:    now,
    },
    ledger: {
      runHistory:  [],
      transitions: [{ from: "birth", to: "birth", at: now, reason: "Mission born" }],
      currentState: "birth",
    },
    runtime: {
      testable:       false,
      previewable:    false,
      deployable:     false,
      executionState: "idle",
    },
    artifacts: {
      artifacts:     [],
      exportHistory: [],
    },
    policy: {
      allowed:           [],
      forbidden:         [],
      automate:          [],
      requiresApproval:  [],
      connectorAllowlist:[],
      modelAllowlist:    [],
    },
    createdAt: now,
    updatedAt: now,
  };
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function getMission(missions: Mission[], id: MissionId): Mission | undefined {
  return missions.find((m) => m.id === id);
}

export function getMissionsByStatus(missions: Mission[], status: MissionStatus): Mission[] {
  return missions.filter((m) => m.ledger.currentState === status);
}

export function getActiveMissions(missions: Mission[]): Mission[] {
  return missions.filter((m) =>
    m.ledger.currentState === "birth" ||
    m.ledger.currentState === "active" ||
    m.ledger.currentState === "paused" ||
    m.ledger.currentState === "blocked",
  );
}

/**
 * Transition a mission to a new status.
 * Returns a new Mission — does not mutate.
 */
export function transitionMission(
  mission: Mission,
  to: MissionStatus,
  reason: string,
): Mission {
  const now = Date.now();
  return {
    ...mission,
    ledger: {
      ...mission.ledger,
      currentState: to,
      transitions: [
        ...mission.ledger.transitions,
        { from: mission.ledger.currentState, to, at: now, reason },
      ],
    },
    updatedAt: now,
  };
}

/**
 * Upsert a mission into the repository (create or update by id).
 * Returns a new array — does not mutate.
 */
export function upsertMission(missions: Mission[], mission: Mission): Mission[] {
  const idx = missions.findIndex((m) => m.id === mission.id);
  if (idx === -1) return [...missions, mission];
  return missions.map((m) => (m.id === mission.id ? { ...mission, updatedAt: Date.now() } : m));
}

/**
 * Link a ContinuityItem to a mission's workflow and memory layers.
 * Returns a new Mission — does not mutate.
 */
export function linkContinuityToMission(mission: Mission, continuityId: string): Mission {
  if (mission.workflow.continuityRefs.includes(continuityId)) return mission;
  return {
    ...mission,
    workflow: {
      ...mission.workflow,
      continuityRefs: [...mission.workflow.continuityRefs, continuityId],
    },
    memory: {
      ...mission.memory,
      continuityRefs: [...mission.memory.continuityRefs, continuityId],
      lastUpdated: Date.now(),
    },
    updatedAt: Date.now(),
  };
}

// ─── STATUS DISPLAY ───────────────────────────────────────────────────────────

export const MISSION_STATUS_LABEL: Record<MissionStatus, string> = {
  birth:     "birth",
  active:    "active",
  paused:    "paused",
  blocked:   "blocked",
  completed: "completed",
  archived:  "archived",
};

export const MISSION_STATUS_COLOR: Record<MissionStatus, string> = {
  birth:     "var(--r-subtext)",
  active:    "var(--r-ok)",
  paused:    "var(--r-warn)",
  blocked:   "var(--r-pulse)",
  completed: "var(--r-accent)",
  archived:  "var(--r-dim)",
};

export const CHAMBER_ACCENT: Record<MissionChamberLead, string> = MISSION_CHAMBER_ACCENT;

// ─── MISSION STORAGE KEY ─────────────────────────────────────────────────────

export const MISSIONS_STORAGE_KEY = "ruberra_missions_v1";

export function loadMissions(): Mission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MISSIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Mission[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* corrupt storage */ }
  return [];
}

export function saveMissions(missions: Mission[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MISSIONS_STORAGE_KEY, JSON.stringify(missions));
  } catch { /* storage full */ }
}
