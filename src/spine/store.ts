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

export function emptyState(): SpineState {
  return { missions: [], activeMissionId: null, principles: [] };
}

function normalizeMission(m: unknown): Mission | null {
  if (!m || typeof m !== "object") return null;
  const r = m as Record<string, unknown>;
  if (typeof r.id !== "string" || typeof r.title !== "string") return null;
  return {
    id: r.id,
    title: r.title,
    chamber: (["Lab", "Creation", "Memory", "School"].includes(r.chamber as string)
      ? r.chamber : "Lab") as Mission["chamber"],
    status: r.status === "closed" ? "closed" : "active",
    createdAt: typeof r.createdAt === "number" ? r.createdAt : Date.now(),
    notes: Array.isArray(r.notes) ? r.notes.flatMap((n: unknown) => {
      if (!n || typeof n !== "object") return [];
      const nr = n as Record<string, unknown>;
      if (typeof nr.id !== "string" || typeof nr.text !== "string") return [];
      return [{
        id: nr.id,
        text: nr.text,
        createdAt: typeof nr.createdAt === "number" ? nr.createdAt : Date.now(),
        role: (nr.role === "user" || nr.role === "ai") ? nr.role : "user",
      }] as Note[];
    }) : [],
    tasks: Array.isArray(r.tasks) ? r.tasks.flatMap((t: unknown) => {
      if (!t || typeof t !== "object") return [];
      const tr = t as Record<string, unknown>;
      if (typeof tr.id !== "string" || typeof tr.title !== "string") return [];
      return [{
        id: tr.id,
        title: tr.title,
        done: tr.done === true,
        createdAt: typeof tr.createdAt === "number" ? tr.createdAt : Date.now(),
        ...(typeof tr.doneAt === "number" ? { doneAt: tr.doneAt } : {}),
      }] as Task[];
    }) : [],
    events: Array.isArray(r.events) ? r.events.flatMap((e: unknown) => {
      if (!e || typeof e !== "object") return [];
      const er = e as Record<string, unknown>;
      if (typeof er.id !== "string" || typeof er.label !== "string") return [];
      const validTypes = ["mission_created", "note_added", "task_added", "task_done", "ai_response"];
      if (!validTypes.includes(er.type as string)) return [];
      return [{
        id: er.id,
        type: er.type as LogEvent["type"],
        label: er.label,
        at: typeof er.at === "number" ? er.at : Date.now(),
      }] as LogEvent[];
    }) : [],
  };
}

export function loadState(): SpineState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return EMPTY;
    const r = parsed as Record<string, unknown>;
    const missions = Array.isArray(r.missions)
      ? (r.missions.map(normalizeMission).filter(Boolean) as Mission[])
      : [];
    const principles = Array.isArray(r.principles)
      ? r.principles.flatMap((p: unknown) => {
          if (!p || typeof p !== "object") return [];
          const pr = p as Record<string, unknown>;
          if (typeof pr.id !== "string" || typeof pr.text !== "string") return [];
          return [{ id: pr.id, text: pr.text, createdAt: typeof pr.createdAt === "number" ? pr.createdAt : Date.now() }];
        })
      : [];
    const activeMissionId =
      typeof r.activeMissionId === "string" &&
      missions.some(m => m.id === r.activeMissionId)
        ? r.activeMissionId
        : (missions[0]?.id ?? null);
    return { missions, activeMissionId, principles };
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

export function addNote(state: SpineState, text: string, role: Note["role"] = "user"): SpineState {
  return addNoteToMission(state, state.activeMissionId ?? "", text, role);
}

export function addNoteToMission(
  state: SpineState,
  missionId: string,
  text: string,
  role: Note["role"] = "user",
): SpineState {
  if (!missionId) return state;
  const note: Note = { id: uid(), text: text.trim(), createdAt: now(), role };
  return {
    ...state,
    missions: state.missions.map(m =>
      m.id === missionId ? {
        ...m,
        notes: [note, ...m.notes],
        events: role === "ai"
          ? [log("ai_response", `IA: ${text.trim().slice(0, 48)}`), ...m.events]
          : [log("note_added", `Nota: ${text.trim().slice(0, 48)}`), ...m.events],
      } : m
    ),
  };
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
