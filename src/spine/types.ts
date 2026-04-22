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

export type MissionStatus = "active" | "closed";
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
