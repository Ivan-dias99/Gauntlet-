export type Chamber = "Lab" | "Creation" | "Memory" | "School";
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
    | "artifact_accepted";
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
