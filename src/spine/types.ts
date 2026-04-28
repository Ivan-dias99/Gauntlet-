// Wave-1 unified chamber taxonomy (frontend + backend).
// Five canonical keys. Legacy values "Lab" | "Creation" | "Memory" |
// "School" are silently normalized at the store / snapshot read boundary
// (see normalizeChamberKey below and store.ts). Writes always emit the
// new keys. Surface has no visual tab in Wave 1 (CanonRibbon excludes it)
// and gets its real composition in Wave 3.
export type Chamber = "insight" | "surface" | "terminal" | "archive" | "core";

// Legacy chamber names persisted before Wave 1. Kept as a type so the
// read-path normalizer can discriminate without stringly-typed checks.
export type LegacyChamber = "Lab" | "Creation" | "Memory" | "School";

const LEGACY_TO_NEW: Record<LegacyChamber, Chamber> = {
  Lab: "insight",
  Creation: "terminal",
  Memory: "archive",
  School: "core",
};

const VALID_NEW_CHAMBERS: ReadonlySet<Chamber> = new Set([
  "insight", "surface", "terminal", "archive", "core",
]);

// Accept any input (unknown / string / legacy / new) and return a valid
// Chamber. Unknown / malformed values collapse to "insight" — the old
// normalizer did the same with "Lab", which is what "insight" replaces.
export function normalizeChamberKey(raw: unknown): Chamber {
  if (typeof raw !== "string") return "insight";
  if (VALID_NEW_CHAMBERS.has(raw as Chamber)) return raw as Chamber;
  const legacy = LEGACY_TO_NEW[raw as LegacyChamber];
  return legacy ?? "insight";
}

// Wave C — Project lifecycle states. Replaces the binary
// active/closed model so Signal can keep many projects without
// contaminating the active context.
//
//   active      — single one at a time; the current working project
//   paused      — saved snapshot, not the active context; can be resumed
//   brainstorm  — loose ideas saved without affecting any project
//   archived    — closed, kept for reference, read-only
//   completed   — delivered, read-only, badge of pride
//   closed      — (legacy alias for archived; silently migrated)
export type MissionStatus =
  | "active"
  | "paused"
  | "brainstorm"
  | "archived"
  | "completed"
  | "closed";

export const MISSION_STATUS_VALID: ReadonlySet<MissionStatus> = new Set([
  "active", "paused", "brainstorm", "archived", "completed", "closed",
]);

/** Convert legacy "closed" silently into "archived" on read. */
export function normalizeMissionStatus(raw: unknown): MissionStatus {
  if (typeof raw !== "string") return "active";
  if (raw === "closed") return "archived";
  return MISSION_STATUS_VALID.has(raw as MissionStatus) ? (raw as MissionStatus) : "active";
}
export type TaskState = "open" | "running" | "done" | "blocked";
export type TaskSource = "manual" | "lab" | "crew" | "other";

export interface Note {
  id: string;
  text: string;
  createdAt: number;
  role?: "user" | "ai";
}

export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
  doneAt?: number;
  // Richer operational state for the Creation work surface. `state` is the
  // source of truth for UI queueing; `done` is kept in sync for back-compat.
  state: TaskState;
  source: TaskSource;
  lastUpdateAt: number;
  // Set when a run originating from this task produced an accepted artifact.
  artifactId?: string;
}

export interface LogEvent {
  id: string;
  type:
    | "mission_created"
    | "note_added"
    | "task_added"
    | "task_done"
    | "task_state"
    | "ai_response"
    | "artifact_accepted"
    | "doctrine_added"
    | "doctrine_applied";
  label: string;
  at: number;
}

export interface Artifact {
  id: string;
  taskTitle: string;
  answer: string;
  terminatedEarly: boolean;
  acceptedAt: number;
  // Optional backlink to the task this artifact closed. Older artifacts
  // loaded from persisted state may not carry it.
  taskId?: string;
  // Run telemetry captured at accept time so the ledger can tell you what
  // actually happened — not just "something terminated early". All optional
  // for back-compat with artifacts persisted before these fields existed.
  iterations?: number;
  toolCount?: number;
  processingTimeMs?: number;
  terminationReason?: string | null;
}

// Wave 6a — Truth Distillation status enum.
// Mirrors V3.1 contract Decision 5. Kept narrow until usage data shows
// need for additional members.
export type ArtifactStatus =
  | "draft"
  | "review"
  | "approved"
  | "stale"
  | "superseded"
  | "invalidated"
  | "blocked"
  | "failed";

// Wave 6a — Failure modes for handoff. Same shape across artefacts.
export type ArtifactFailureMode =
  | "missing_context"
  | "low_confidence"
  | "contradiction"
  | "stale_dependency"
  | "schema_invalid"
  | "tool_unavailable"
  | "backend_unreachable"
  | "user_rejected"
  | "gate_failed";

// Wave 6a — Surface seed: hint passed from Insight to Surface.
// `question` always present; hints optional and additive.
export interface SurfaceSeed {
  question: string;
  designSystemSuggestion?: string;
  screenCountEstimate?: number;
  fidelityHint?: "wireframe" | "hi-fi";
}

// Wave 6a — Terminal seed: hint passed from Insight to Terminal.
export interface TerminalSeed {
  task: string;
  fileTargets?: string[];
  riskLevel?: "low" | "medium" | "high";
  requiresGate?: ("typecheck" | "build" | "test")[];
}

// Wave 6a — Project Contract auto-derived from spine state.
// Operator edits inline when they want more specificity.
export interface ProjectContract {
  version: number;
  concept?: string;
  mission?: string;
  targetUser?: string;
  problem?: string;
  scope?: string;
  nonGoals: string[];
  principles: string[];
  knownRisks: string[];
  qualityGates: string[];
  definitionOfDone?: string;
  riskPolicy?: string;
  derivedFromSpine: boolean;
  createdAt: number;
  updatedAt: number;
}

// Wave 6a — Truth Distillation, the primary Insight artefact.
// Versioned. Surface and Terminal read the latest `approved` version
// linked to the active mission as their starting context.
export interface TruthDistillation {
  id: string;
  version: number;
  status: ArtifactStatus;
  sourceMissionId: string;
  summary: string;
  validatedDirection: string;
  coreDecisions: string[];
  unknowns: string[];
  risks: string[];
  surfaceSeed: SurfaceSeed | null;
  terminalSeed: TerminalSeed | null;
  confidence: "low" | "medium" | "high";
  createdAt: number;
  updatedAt: number;
  supersedesVersion?: number;
  staleSince?: number;
  staleReason?: string;
  failureState?: ArtifactFailureMode;
}

export interface Mission {
  id: string;
  title: string;
  chamber: Chamber;
  status: MissionStatus;
  createdAt: number;
  notes: Note[];
  tasks: Task[];
  events: LogEvent[];
  lastArtifact: Artifact | null;
  // Ledger of accepted artifacts, newest first. Capped by the store so the
  // workshop surface stays operational — not a giant archive.
  artifacts: Artifact[];
  // Wave 6a — Project Contract auto-derived; Truth Distillation versioned.
  // Both optional for back-compat with missions persisted before Wave 6a.
  projectContract?: ProjectContract | null;
  truthDistillations?: TruthDistillation[];
  // Wave D — Handoff Queue. Pending entries surface in the receiving
  // chamber's UI as actionable suggestions. Resolved entries kept as
  // audit trail.
  handoffs?: HandoffRecord[];
}

export interface Principle {
  id: string;
  text: string;
  createdAt: number;
}

export interface SpineState {
  missions: Mission[];
  activeMissionId: string | null;
  principles: Principle[];
  updatedAt: number;
}

// Wave D — Handoff record. Captures a chamber-to-chamber transfer:
// who initiated, what artefact, what the next chamber should do.
// Lives on the mission so the receiving chamber can read it on mount
// and propose to act on it. Resolved when the receiving chamber
// consumes (accepts, rejects, defers).
export type HandoffStatus = "pending" | "consumed" | "rejected" | "deferred";

export interface HandoffRecord {
  id: string;
  fromChamber: Chamber;
  toChamber: Chamber;
  artifactType:
    | "project_contract"
    | "truth_distillation"
    | "build_specification"
    | "delivery_ledger"
    | "note";
  artifactRef?: string; // distillation id, contract version, etc.
  summary: string;
  risks: string[];
  nextAction: string;
  createdAt: number;
  status: HandoffStatus;
  resolvedAt?: number;
  resolution?: string;
}

// Wave 6a — Helper: find the active Truth Distillation for a mission.
// "Active" rule (Default 6 of V3.1): last `approved` linked to the
// mission. If none, last `draft`. If none, null.
// Used by Surface and Terminal to read seeds.
export function activeTruthDistillation(
  mission: Mission | null,
): TruthDistillation | null {
  if (!mission) return null;
  const list = mission.truthDistillations ?? [];
  if (list.length === 0) return null;
  // Newest first: walk from highest version down.
  const sorted = [...list].sort((a, b) => b.version - a.version);
  const approved = sorted.find((d) => d.status === "approved");
  if (approved) return approved;
  const draft = sorted.find((d) => d.status === "draft");
  return draft ?? null;
}

// Wave D — Helper: list pending handoffs for a chamber so the chamber
// can render an "incoming" banner. Filters by `toChamber` and `pending`.
export function pendingHandoffsFor(
  mission: Mission | null,
  chamber: Chamber,
): HandoffRecord[] {
  if (!mission) return [];
  return (mission.handoffs ?? [])
    .filter((h) => h.toChamber === chamber && h.status === "pending")
    .sort((a, b) => b.createdAt - a.createdAt);
}
