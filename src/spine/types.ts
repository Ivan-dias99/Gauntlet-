// Unified chamber taxonomy (frontend + backend). Five canonical keys.
export type Chamber = "insight" | "surface" | "terminal" | "archive" | "core";

const VALID_CHAMBERS: ReadonlySet<Chamber> = new Set([
  "insight", "surface", "terminal", "archive", "core",
]);

// Defensive guard at the snapshot-read boundary. Unknown / malformed
// values collapse to "insight".
export function normalizeChamberKey(raw: unknown): Chamber {
  if (typeof raw === "string" && VALID_CHAMBERS.has(raw as Chamber)) {
    return raw as Chamber;
  }
  return "insight";
}

export type MissionStatus = "active" | "closed";
export type TaskState = "open" | "running" | "done" | "blocked";
export type TaskSource = "manual" | "insight" | "crew" | "other";

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
  // Richer operational state for the Terminal work surface. `state` is the
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
