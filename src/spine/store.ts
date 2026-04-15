import { SpineState, Mission, Chamber, Note, Task, LogEvent, Principle } from "./types";

const KEY = "ruberra:spine:v1";

function uid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback for non-secure contexts (http LAN, older browsers)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
function now(): number { return Date.now(); }

function log(type: LogEvent["type"], label: string): LogEvent {
  return { id: uid(), type, label, at: now() };
}

function onActive(state: SpineState, fn: (m: Mission) => Mission): SpineState {
  if (!state.activeMissionId) return state;
  return {
    ...state,
    missions: state.missions.map(m =>
      m.id === state.activeMissionId ? fn(m) : m
    ),
  };
}

const EMPTY: SpineState = { missions: [], activeMissionId: null, principles: [] };

function isValidState(s: unknown): s is SpineState {
  return (
    s !== null &&
    typeof s === "object" &&
    Array.isArray((s as SpineState).missions) &&
    Array.isArray((s as SpineState).principles)
  );
}

export function loadState(): SpineState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidState(parsed)) return EMPTY;
    return parsed;
  } catch {
    return EMPTY;
  }
}

export function saveState(state: SpineState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage unavailable — state lives in memory only
  }
}

export function createMission(state: SpineState, title: string, chamber: Chamber): SpineState {
  const mission: Mission = {
    id: uid(),
    title: title.trim(),
    chamber,
    status: "active",
    createdAt: now(),
    notes: [],
    tasks: [],
    events: [log("mission_created", `Missão criada: ${title.trim()}`)],
  };
  return { ...state, missions: [mission, ...state.missions], activeMissionId: mission.id };
}

export function addNote(state: SpineState, text: string): SpineState {
  const note: Note = { id: uid(), text: text.trim(), createdAt: now() };
  return onActive(state, m => ({
    ...m,
    notes: [note, ...m.notes],
    events: [log("note_added", `Nota: ${text.trim().slice(0, 48)}`), ...m.events],
  }));
}

export function addTask(state: SpineState, title: string): SpineState {
  const task: Task = { id: uid(), title: title.trim(), done: false, createdAt: now() };
  return onActive(state, m => ({
    ...m,
    tasks: [...m.tasks, task],
    events: [log("task_added", `Tarefa: ${title.trim().slice(0, 48)}`), ...m.events],
  }));
}

export function completeTask(state: SpineState, taskId: string): SpineState {
  return onActive(state, m => {
    const task = m.tasks.find(t => t.id === taskId);
    if (!task) return m;
    const toggled = !task.done;
    return {
      ...m,
      tasks: m.tasks.map(t =>
        t.id === taskId
          ? { ...t, done: toggled, doneAt: toggled ? now() : undefined }
          : t
      ),
      events: toggled
        ? [log("task_done", `Concluída: ${task.title.slice(0, 48)}`), ...m.events]
        : m.events,
    };
  });
}

export function addPrinciple(state: SpineState, text: string): SpineState {
  const p: Principle = { id: uid(), text: text.trim(), createdAt: now() };
  return { ...state, principles: [p, ...state.principles] };
}

export function switchMission(state: SpineState, id: string): SpineState {
  return { ...state, activeMissionId: id };
}
