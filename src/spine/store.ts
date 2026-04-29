import {
  SpineState, Mission, MissionStatus, Chamber, Note, Task, TaskState, TaskSource,
  LogEvent, Principle, Artifact, normalizeChamberKey,
  TruthDistillation, ProjectContract, ArtifactStatus, ArtifactFailureMode,
  SurfaceSeed, TerminalSeed, HandoffRecord, HandoffStatus,
  normalizeMissionStatus,
} from "./types";

// Wave-0 rename: signal:spine:v1 is canonical. ruberra:spine:v1 is still
// read as a silent legacy fallback so existing users keep their missions,
// tasks, notes, artifacts and principles across the rename. Writes always
// target the new key; the legacy key is left in place until Wave 8.
const KEY = "signal:spine:v1";
const LEGACY_KEY = "ruberra:spine:v1";
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

// Wave 6a — normalizers for the new Mission fields. Without these,
// `truthDistillations` and `projectContract` round-trip through
// `normalizeMission` as undefined and rehydration silently drops them
// (localStorage load + /spine fetch both pass through normalize).

const VALID_ARTIFACT_STATUS: ReadonlySet<ArtifactStatus> = new Set([
  "draft", "review", "approved", "stale", "superseded",
  "invalidated", "blocked", "failed",
]);
const VALID_FAILURE_MODE: ReadonlySet<ArtifactFailureMode> = new Set([
  "missing_context", "low_confidence", "contradiction", "stale_dependency",
  "schema_invalid", "tool_unavailable", "backend_unreachable",
  "user_rejected", "gate_failed",
]);
const VALID_CONFIDENCE = new Set(["low", "medium", "high"] as const);
const VALID_FIDELITY = new Set(["wireframe", "hi-fi"] as const);
const VALID_RISK = new Set(["low", "medium", "high"] as const);
const VALID_GATE = new Set(["typecheck", "build", "test"] as const);

function normalizeStringList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((v): v is string => typeof v === "string");
}

function normalizeSurfaceSeed(v: unknown): SurfaceSeed | null {
  if (!v || typeof v !== "object") return null;
  const r = v as Record<string, unknown>;
  if (typeof r.question !== "string") return null;
  const seed: SurfaceSeed = { question: r.question };
  if (typeof r.designSystemSuggestion === "string") {
    seed.designSystemSuggestion = r.designSystemSuggestion;
  }
  if (typeof r.screenCountEstimate === "number") {
    seed.screenCountEstimate = r.screenCountEstimate;
  }
  if (typeof r.fidelityHint === "string" && VALID_FIDELITY.has(r.fidelityHint as "wireframe" | "hi-fi")) {
    seed.fidelityHint = r.fidelityHint as "wireframe" | "hi-fi";
  }
  return seed;
}

function normalizeTerminalSeed(v: unknown): TerminalSeed | null {
  if (!v || typeof v !== "object") return null;
  const r = v as Record<string, unknown>;
  if (typeof r.task !== "string") return null;
  const seed: TerminalSeed = { task: r.task };
  if (Array.isArray(r.fileTargets)) {
    seed.fileTargets = normalizeStringList(r.fileTargets);
  }
  if (typeof r.riskLevel === "string" && VALID_RISK.has(r.riskLevel as "low" | "medium" | "high")) {
    seed.riskLevel = r.riskLevel as "low" | "medium" | "high";
  }
  if (Array.isArray(r.requiresGate)) {
    seed.requiresGate = r.requiresGate.filter(
      (g: unknown): g is "typecheck" | "build" | "test" =>
        typeof g === "string" && VALID_GATE.has(g as "typecheck" | "build" | "test"),
    );
  }
  return seed;
}

function normalizeTruthDistillation(v: unknown): TruthDistillation | null {
  if (!v || typeof v !== "object") return null;
  const r = v as Record<string, unknown>;
  if (typeof r.id !== "string") return null;
  if (typeof r.sourceMissionId !== "string") return null;
  const status = typeof r.status === "string" && VALID_ARTIFACT_STATUS.has(r.status as ArtifactStatus)
    ? r.status as ArtifactStatus
    : "draft";
  const confidence = typeof r.confidence === "string" && VALID_CONFIDENCE.has(r.confidence as "low" | "medium" | "high")
    ? r.confidence as "low" | "medium" | "high"
    : "medium";
  const failureState = typeof r.failureState === "string" && VALID_FAILURE_MODE.has(r.failureState as ArtifactFailureMode)
    ? r.failureState as ArtifactFailureMode
    : undefined;
  const out: TruthDistillation = {
    id: r.id,
    version: typeof r.version === "number" ? r.version : 1,
    status,
    sourceMissionId: r.sourceMissionId,
    summary: typeof r.summary === "string" ? r.summary : "",
    validatedDirection: typeof r.validatedDirection === "string" ? r.validatedDirection : "",
    coreDecisions: normalizeStringList(r.coreDecisions),
    unknowns: normalizeStringList(r.unknowns),
    risks: normalizeStringList(r.risks),
    surfaceSeed: normalizeSurfaceSeed(r.surfaceSeed),
    terminalSeed: normalizeTerminalSeed(r.terminalSeed),
    confidence,
    createdAt: typeof r.createdAt === "number" ? r.createdAt : Date.now(),
    updatedAt: typeof r.updatedAt === "number" ? r.updatedAt : Date.now(),
  };
  if (typeof r.supersedesVersion === "number") out.supersedesVersion = r.supersedesVersion;
  if (typeof r.staleSince === "number") out.staleSince = r.staleSince;
  if (typeof r.staleReason === "string") out.staleReason = r.staleReason;
  if (failureState) out.failureState = failureState;
  return out;
}

function normalizeProjectContract(v: unknown): ProjectContract | null {
  if (!v || typeof v !== "object") return null;
  const r = v as Record<string, unknown>;
  return {
    version: typeof r.version === "number" ? r.version : 1,
    concept: typeof r.concept === "string" ? r.concept : undefined,
    mission: typeof r.mission === "string" ? r.mission : undefined,
    targetUser: typeof r.targetUser === "string" ? r.targetUser : undefined,
    problem: typeof r.problem === "string" ? r.problem : undefined,
    scope: typeof r.scope === "string" ? r.scope : undefined,
    nonGoals: normalizeStringList(r.nonGoals),
    principles: normalizeStringList(r.principles),
    knownRisks: normalizeStringList(r.knownRisks),
    qualityGates: normalizeStringList(r.qualityGates),
    definitionOfDone: typeof r.definitionOfDone === "string" ? r.definitionOfDone : undefined,
    riskPolicy: typeof r.riskPolicy === "string" ? r.riskPolicy : undefined,
    derivedFromSpine: r.derivedFromSpine !== false,
    createdAt: typeof r.createdAt === "number" ? r.createdAt : Date.now(),
    updatedAt: typeof r.updatedAt === "number" ? r.updatedAt : Date.now(),
  };
}

const VALID_CHAMBER: ReadonlySet<Chamber> = new Set([
  "insight", "surface", "terminal", "archive", "core",
]);
const VALID_HANDOFF_STATUS: ReadonlySet<HandoffStatus> = new Set([
  "pending", "consumed", "rejected", "deferred",
]);
const VALID_ARTIFACT_TYPES = new Set([
  "project_contract", "truth_distillation", "build_specification",
  "delivery_ledger", "note",
] as const);

function normalizeHandoff(v: unknown): HandoffRecord | null {
  if (!v || typeof v !== "object") return null;
  const r = v as Record<string, unknown>;
  if (typeof r.id !== "string") return null;
  const fromChamber = typeof r.fromChamber === "string" && VALID_CHAMBER.has(r.fromChamber as Chamber)
    ? r.fromChamber as Chamber
    : null;
  const toChamber = typeof r.toChamber === "string" && VALID_CHAMBER.has(r.toChamber as Chamber)
    ? r.toChamber as Chamber
    : null;
  if (!fromChamber || !toChamber) return null;
  const artifactType = typeof r.artifactType === "string" && VALID_ARTIFACT_TYPES.has(r.artifactType as never)
    ? r.artifactType as HandoffRecord["artifactType"]
    : "note";
  const status = typeof r.status === "string" && VALID_HANDOFF_STATUS.has(r.status as HandoffStatus)
    ? r.status as HandoffStatus
    : "pending";
  return {
    id: r.id,
    fromChamber,
    toChamber,
    artifactType,
    artifactRef: typeof r.artifactRef === "string" ? r.artifactRef : undefined,
    summary: typeof r.summary === "string" ? r.summary : "",
    risks: normalizeStringList(r.risks),
    nextAction: typeof r.nextAction === "string" ? r.nextAction : "",
    createdAt: typeof r.createdAt === "number" ? r.createdAt : Date.now(),
    status,
    resolvedAt: typeof r.resolvedAt === "number" ? r.resolvedAt : undefined,
    resolution: typeof r.resolution === "string" ? r.resolution : undefined,
  };
}

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

export function normalizeMission(m: unknown): Mission | null {
  if (!m || typeof m !== "object") return null;
  const r = m as Record<string, unknown>;
  if (typeof r.id !== "string" || typeof r.title !== "string") return null;
  return {
    id: r.id,
    title: r.title,
    // Wave-1 silent migration: "Lab" → "insight", "Creation" → "terminal",
    // "Memory" → "archive", "School" → "core". Unknown / malformed values
    // collapse to "insight" (the old normalizer collapsed to "Lab", which
    // is exactly what "insight" replaces).
    chamber: normalizeChamberKey(r.chamber),
    status: normalizeMissionStatus(r.status),
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
    // Wave 6a — preserve Truth Distillation ledger and auto-derived
    // ProjectContract across rehydration. Without this, both fields
    // would be silently dropped on reload / /spine fetch and Surface +
    // Terminal would lose the seeds. Versioning would also regress
    // because _next_version_for would always see an empty list.
    truthDistillations: Array.isArray(r.truthDistillations)
      ? (r.truthDistillations.map(normalizeTruthDistillation).filter(Boolean) as TruthDistillation[])
      : [],
    projectContract: normalizeProjectContract(r.projectContract),
    // Wave D — preserve handoff queue across rehydration. Same contract
    // pattern as truthDistillations: silent drop without explicit
    // normalization on the read path.
    handoffs: Array.isArray(r.handoffs)
      ? (r.handoffs.map(normalizeHandoff).filter(Boolean) as HandoffRecord[])
      : [],
  };
}

export function normalizePrinciples(raw: unknown): Principle[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((p: unknown) => {
    if (!p || typeof p !== "object") return [];
    const pr = p as Record<string, unknown>;
    if (typeof pr.id !== "string" || typeof pr.text !== "string") return [];
    return [{
      id: pr.id,
      text: pr.text,
      createdAt: typeof pr.createdAt === "number" ? pr.createdAt : Date.now(),
    }];
  });
}

// Wave C invariant: at most one mission may be "active" at a time.
// Legacy states (pre-Wave C) marked every open mission as active, so
// any rehydration path (localStorage load OR /spine fetch) must collapse
// the multi-active set to one before the state reaches the UI.
//
// Conservative on purpose: only acts when the snapshot already violates
// the invariant (>1 active). A modern Wave C snapshot with a single
// active and `activeMissionId === null` (user ran clearActiveMission
// without changing the mission's status) is left alone — otherwise we
// would silently demote that mission to "paused" on every reload and
// strip the user's resumable working thread.
export function enforceSingleActive(
  missions: Mission[],
  activeMissionId: string | null,
): Mission[] {
  const actives = missions.filter(m => m.status === "active");
  if (actives.length <= 1) return missions;
  // Multiple actives — legacy migration. Prefer the one the snapshot
  // already points at; otherwise pick the first (deterministic) and
  // demote the rest.
  const survivor =
    actives.find(m => m.id === activeMissionId)?.id ?? actives[0].id;
  return missions.map(m =>
    m.status === "active" && m.id !== survivor
      ? { ...m, status: "paused" as MissionStatus }
      : m,
  );
}

export function loadState(): SpineState {
  try {
    const raw =
      localStorage.getItem(KEY) ??
      localStorage.getItem(LEGACY_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return EMPTY;
    const r = parsed as Record<string, unknown>;
    const rawMissions = Array.isArray(r.missions)
      ? (r.missions.map(normalizeMission).filter(Boolean) as Mission[])
      : [];
    const principles = normalizePrinciples(r.principles);
    // Explicit null is intentional under Wave C: setMissionStatus
    // clears activeMissionId when the active mission is paused or
    // archived, so the next chamber submission opens a fresh thread.
    // Falling back to the first mission would silently reactivate an
    // old selection on every reload. Only fall back when the field is
    // missing entirely (legacy snapshot) or points at a stale id.
    let activeMissionId: string | null;
    if (typeof r.activeMissionId === "string") {
      activeMissionId = rawMissions.some(m => m.id === r.activeMissionId)
        ? r.activeMissionId
        : (rawMissions[0]?.id ?? null);
    } else if (r.activeMissionId === null) {
      activeMissionId = null;
    } else {
      activeMissionId = rawMissions[0]?.id ?? null;
    }
    const missions = enforceSingleActive(rawMissions, activeMissionId);
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

export function createMission(
  state: SpineState,
  title: string,
  chamber: Chamber,
  opts: { id?: string } = {},
): SpineState {
  // Wave-2 inline new-thread: callers (notably Insight's first-send path)
  // can pre-generate the id and pass it in so the id is known before the
  // setState round-trip. The old signature still works — unspecified
  // opts keep the old "store mints the uid" behavior.
  const mission: Mission = {
    id: opts.id ?? uid(),
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
  // Wave C single-active invariant: any pre-existing "active" mission
  // must be demoted to "paused" so the new mission is the only active
  // one. enforceSingleActive does the work given the new activeMissionId.
  const missions = enforceSingleActive(
    [mission, ...state.missions],
    mission.id,
  );
  return { ...state, missions, activeMissionId: mission.id, updatedAt: now() };
}

export function clearActiveMission(state: SpineState): SpineState {
  // Wave-2 "new thread" path: deselecting the active mission returns the
  // chamber to its empty state so the next send creates a fresh mission.
  // Missions themselves are preserved — only the active pointer clears.
  if (state.activeMissionId === null) return state;
  return { ...state, activeMissionId: null, updatedAt: now() };
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
  if (!state.missions.some(m => m.id === id)) return state;
  // Wave C "current working project is active": switching the active
  // pointer must (1) promote the target to active so it matches the
  // pointer, and (2) demote any other active to paused. Without this,
  // switching back to a mission previously paused by createMission
  // would leave its status as "paused" while activeMissionId points
  // at it — an inconsistent lifecycle state any `status === "active"`
  // check would misread.
  //
  // Brainstorm is the exception: types.ts defines it as "loose ideas
  // saved without affecting any project", so selecting one is a
  // non-project navigation event — don't promote it and don't pause
  // the working project. Closed/archived/completed targets keep their
  // terminal status; the previously active mission is still demoted
  // because the pointer is moving off it.
  const target = state.missions.find(m => m.id === id);
  if (target && target.status === "brainstorm") {
    return { ...state, activeMissionId: id, updatedAt: now() };
  }
  const missions = state.missions.map(m => {
    if (m.id === id) {
      return m.status === "paused"
        ? { ...m, status: "active" as MissionStatus }
        : m;
    }
    return m.status === "active"
      ? { ...m, status: "paused" as MissionStatus }
      : m;
  });
  return { ...state, missions, activeMissionId: id, updatedAt: now() };
}
