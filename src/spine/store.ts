import { SpineState, Mission, Chamber, Note, Task, TaskState, TaskSource, LogEvent, Principle, Artifact } from "./types";

const KEY = "ruberra:spine:v1";
const ARTIFACT_LEDGER_CAP = 12;

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
    updatedAt: now(),
    missions: state.missions.map(m =>
      m.id === state.activeMissionId ? fn(m) : m
    ),
  };
}

const EMPTY: SpineState = { missions: [], activeMissionId: null, principles: [], updatedAt: 0 };

export function emptyState(): SpineState {
  return { missions: [], activeMissionId: null, principles: [], updatedAt: 0 };
}

function normalizeArtifact(v: unknown): Artifact | null {
  if (!v || typeof v !== "object") return null;
  const a = v as Record<string, unknown>;
  if (typeof a.id !== "string" || typeof a.taskTitle !== "string") return null;
  return {
    id: a.id,
    taskTitle: a.taskTitle,
    answer: typeof a.answer === "string" ? a.answer : "",
    terminatedEarly: a.terminatedEarly === true,
    acceptedAt: typeof a.acceptedAt === "number" ? a.acceptedAt : Date.now(),
    ...(typeof a.taskId === "string" ? { taskId: a.taskId } : {}),
    ...(typeof a.iterations === "number" ? { iterations: a.iterations } : {}),
    ...(typeof a.toolCount === "number" ? { toolCount: a.toolCount } : {}),
    ...(typeof a.processingTimeMs === "number" ? { processingTimeMs: a.processingTimeMs } : {}),
    ...(typeof a.terminationReason === "string" ? { terminationReason: a.terminationReason } : {}),
  };
}

const VALID_TASK_STATES: ReadonlySet<TaskState> = new Set(["open", "running", "done", "blocked"]);
const VALID_TASK_SOURCES: ReadonlySet<TaskSource> = new Set(["manual", "lab", "crew", "other"]);

function normalizeTaskState(raw: unknown, done: boolean): TaskState {
  if (typeof raw === "string" && VALID_TASK_STATES.has(raw as TaskState)) {
    return raw as TaskState;
  }
  return done ? "done" : "open";
}

function normalizeTaskSource(raw: unknown): TaskSource {
  if (typeof raw === "string" && VALID_TASK_SOURCES.has(raw as TaskSource)) {
    return raw as TaskSource;
  }
  return "manual";
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
      const done = tr.done === true;
      const createdAt = typeof tr.createdAt === "number" ? tr.createdAt : Date.now();
      const doneAt = typeof tr.doneAt === "number" ? tr.doneAt : undefined;
      return [{
        id: tr.id,
        title: tr.title,
        done,
        createdAt,
        ...(doneAt !== undefined ? { doneAt } : {}),
        state: normalizeTaskState(tr.state, done),
        source: normalizeTaskSource(tr.source),
        lastUpdateAt: typeof tr.lastUpdateAt === "number" ? tr.lastUpdateAt : (doneAt ?? createdAt),
        ...(typeof tr.artifactId === "string" ? { artifactId: tr.artifactId } : {}),
      }] as Task[];
    }) : [],
    events: Array.isArray(r.events) ? r.events.flatMap((e: unknown) => {
      if (!e || typeof e !== "object") return [];
      const er = e as Record<string, unknown>;
      if (typeof er.id !== "string" || typeof er.label !== "string") return [];
      const validTypes = [
        "mission_created", "note_added", "task_added", "task_done",
        "task_state", "ai_response", "artifact_accepted",
        "doctrine_added", "doctrine_applied",
      ];
      if (!validTypes.includes(er.type as string)) return [];
      return [{
        id: er.id,
        type: er.type as LogEvent["type"],
        label: er.label,
        at: typeof er.at === "number" ? er.at : Date.now(),
      }] as LogEvent[];
    }) : [],
    lastArtifact: normalizeArtifact(r.lastArtifact),
    artifacts: (() => {
      const list = Array.isArray(r.artifacts)
        ? (r.artifacts.map(normalizeArtifact).filter(Boolean) as Artifact[])
        : [];
      if (list.length > 0) return list.slice(0, ARTIFACT_LEDGER_CAP);
      // Back-compat: older persisted missions only had `lastArtifact`. Seed
      // the ledger from it so the UI has something to resume from.
      const legacy = normalizeArtifact(r.lastArtifact);
      return legacy ? [legacy] : [];
    })(),
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
    const updatedAt = typeof r.updatedAt === "number" ? r.updatedAt : 0;
    return { missions, activeMissionId, principles, updatedAt };
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
    lastArtifact: null,
    artifacts: [],
  };
  return { ...state, missions: [mission, ...state.missions], activeMissionId: mission.id, updatedAt: now() };
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
    updatedAt: now(),
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

export function addTask(
  state: SpineState,
  title: string,
  opts: { id?: string; source?: TaskSource } = {},
): SpineState {
  const ts = now();
  const task: Task = {
    id: opts.id ?? uid(),
    title: title.trim(),
    done: false,
    createdAt: ts,
    state: "open",
    source: opts.source ?? "manual",
    lastUpdateAt: ts,
  };
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
    const ts = now();
    return {
      ...m,
      tasks: m.tasks.map(t =>
        t.id === taskId
          ? {
              ...t,
              done: toggled,
              doneAt: toggled ? ts : undefined,
              state: toggled ? "done" : "open",
              lastUpdateAt: ts,
            }
          : t
      ),
      events: toggled
        ? [log("task_done", `Concluída: ${task.title.slice(0, 48)}`), ...m.events]
        : m.events,
    };
  });
}

export function setTaskState(
  state: SpineState,
  taskId: string,
  next: TaskState,
): SpineState {
  return onActive(state, m => {
    const task = m.tasks.find(t => t.id === taskId);
    if (!task) return m;
    if (task.state === next) return m;
    const ts = now();
    const done = next === "done";
    return {
      ...m,
      tasks: m.tasks.map(t =>
        t.id === taskId
          ? {
              ...t,
              state: next,
              done,
              doneAt: done ? (t.doneAt ?? ts) : undefined,
              lastUpdateAt: ts,
            }
          : t,
      ),
      events: [
        log("task_state", `${next}: ${task.title.slice(0, 42)}`),
        ...m.events,
      ],
    };
  });
}

export function addPrinciple(state: SpineState, text: string): SpineState {
  const p: Principle = { id: uid(), text: text.trim(), createdAt: now() };
  const withPrinciple = { ...state, principles: [p, ...state.principles], updatedAt: now() };
  // Leave a trail in the active mission: principles are global but they only
  // matter because missions exist. Recording the inscription inside the
  // mission's event log is what makes doctrine a governance act, not just a
  // list entry.
  return onActive(withPrinciple, m => ({
    ...m,
    events: [log("doctrine_added", `Doutrina: ${p.text.slice(0, 48)}`), ...m.events],
  }));
}

// Recorded when Lab/Creation fires a request WITH principles attached. Proves
// the doctrine reached the brain for this mission at this moment — the
// difference between "doctrine exists" and "doctrine governs".
export function logDoctrineApplied(state: SpineState, count: number): SpineState {
  if (count <= 0 || !state.activeMissionId) return state;
  const label = `Doutrina aplicada: ${count} princípio${count === 1 ? "" : "s"}`;
  return onActive(state, m => ({
    ...m,
    events: [log("doctrine_applied", label), ...m.events],
  }));
}

export function acceptArtifact(
  state: SpineState,
  missionId: string,
  artifact: Omit<Artifact, "id">,
  taskId?: string,
): SpineState {
  const full: Artifact = { id: uid(), ...artifact, ...(taskId ? { taskId } : {}) };
  const ts = now();
  return {
    ...state,
    updatedAt: ts,
    missions: state.missions.map(m => {
      if (m.id !== missionId) return m;
      const ledger = [full, ...(m.artifacts ?? [])].slice(0, ARTIFACT_LEDGER_CAP);
      const tasks = taskId
        ? m.tasks.map(t =>
            t.id === taskId
              ? {
                  ...t,
                  artifactId: full.id,
                  state: "done" as TaskState,
                  done: true,
                  doneAt: t.doneAt ?? ts,
                  lastUpdateAt: ts,
                }
              : t,
          )
        : m.tasks;
      return {
        ...m,
        lastArtifact: full,
        artifacts: ledger,
        tasks,
        events: [
          log("artifact_accepted", `Aceite: ${full.taskTitle.slice(0, 42)}`),
          ...m.events,
        ],
      };
    }),
  };
}

export function switchMission(state: SpineState, id: string): SpineState {
  return { ...state, activeMissionId: id, updatedAt: now() };
}
