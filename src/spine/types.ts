export type Chamber = "Lab" | "Creation" | "Memory" | "School";
export type MissionStatus = "active" | "closed";

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
}

export interface LogEvent {
  id: string;
  type:
    | "mission_created"
    | "note_added"
    | "task_added"
    | "task_done"
    | "ai_response"
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
