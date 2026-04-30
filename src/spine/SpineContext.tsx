import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import {
  SpineState, Mission, Principle, Chamber, Artifact, TaskState, TaskSource,
  TruthDistillation, ArtifactStatus, ProjectContract,
  HandoffRecord, HandoffStatus,
} from "./types";
import {
  loadState, saveState, emptyState,
  createMission as mkMission,
  addNote as addNoteFn,
  addNoteToMission as addNoteToMissionFn,
  addTask as addTaskFn,
  completeTask as completeTaskFn,
  setTaskState as setTaskStateFn,
  addPrinciple as addPrincipleFn,
  logDoctrineApplied as logDoctrineAppliedFn,
  switchMission as switchFn,
  clearActiveMission as clearActiveMissionFn,
  acceptArtifact as acceptArtifactFn,
} from "./store";
import { fetchSpine, pushSpine } from "./client";
import {
  isBackendUnreachable,
  isBackendError,
  type BackendErrorEnvelope,
} from "../lib/signalApi";

export type SpineSyncState = "synced" | "syncing" | "unsynced";

function uid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

interface SpineCtx {
  state: SpineState;
  activeMission: Mission | null;
  principles: Principle[];
  syncState: SpineSyncState;
  // Whether the initial /spine fetch came back with a parseable body. Null
  // while in flight; true once the backend responded (regardless of which
  // side won the updatedAt race); false if the fetch failed or was aborted
  // before responding. Chambers like School use this to tell the user
  // whether the doctrine they see has any backend confirmation at all.
  hydratedFromBackend: boolean | null;
  // Last sync-push failure detail. Cleared on the next successful push.
  // `kind` distinguishes a network/edge unreachable from a typed backend
  // error so the UI can show the right copy without regex-ing strings.
  syncError: { kind: "unreachable" | "backend"; envelope: BackendErrorEnvelope | null; message: string } | null;
  // Wave-2: createMission returns the new mission id so callers (Insight's
  // inline new-thread path) can build HTTP bodies in the same tick without
  // waiting for the React setState round-trip to expose activeMission.
  createMission: (title: string, chamber: Chamber) => string;
  switchMission: (id: string) => void;
  // Wave C — mission lifecycle. Setting status to "active" on a paused
  // or archived mission resumes it; setting to "paused" on the active
  // one pauses + clears activeMissionId. "brainstorm" / "archived" /
  // "completed" are terminal/intermediate states the UI can move
  // missions through without losing their content.
  setMissionStatus: (id: string, status: import("./types").MissionStatus) => void;
  // Wave-2 "new thread" trigger. Clears activeMissionId so the next send
  // from a chamber composer creates a fresh mission. Missions themselves
  // stay persisted.
  clearActiveMission: () => void;
  addNote: (text: string, role?: "user" | "ai") => void;
  addNoteToMission: (missionId: string, text: string, role?: "user" | "ai") => void;
  // addTask returns the id of the newly-created task so callers can track
  // its state transitions (running → done / blocked) through the run.
  addTask: (title: string, source?: TaskSource) => string;
  completeTask: (taskId: string) => void;
  // Wave P-29 — `options` carries pause metadata (reason, paused_at)
  // when entering "paused". Optional for back-compat with every other
  // call site.
  setTaskState: (
    taskId: string,
    state: TaskState,
    options?: { pauseReason?: string | null; pausedAt?: number },
  ) => void;
  addPrinciple: (text: string) => void;
  logDoctrineApplied: (count: number) => void;
  acceptArtifact: (missionId: string, artifact: Omit<Artifact, "id">, taskId?: string) => void;
  // Wave 6a — Truth Distillation lifecycle.
  // `addTruthDistillation` lands a freshly-generated draft from the
  // /insight/distill/stream endpoint. Versioning is server-side
  // bookkeeping; the client just pushes whatever the backend produced.
  // `updateTruthDistillationStatus` flips an existing version's status
  // (typically draft → approved on accept, or approved → stale on
  // upstream change). `setMissionProjectContract` lands the auto-derived
  // v0 from the same endpoint.
  addTruthDistillation: (missionId: string, distillation: TruthDistillation) => void;
  updateTruthDistillationStatus: (
    missionId: string,
    distillationId: string,
    status: ArtifactStatus,
    options?: { staleReason?: string },
  ) => void;
  setMissionProjectContract: (missionId: string, contract: ProjectContract) => void;
  // Wave D — Handoff Queue. Enqueue an actionable transfer from one
  // chamber to another. The receiving chamber renders pending entries
  // as suggestions; resolveHandoff stamps the audit trail.
  enqueueHandoff: (missionId: string, handoff: Omit<HandoffRecord, "id" | "createdAt" | "status">) => string;
  resolveHandoff: (
    missionId: string,
    handoffId: string,
    status: HandoffStatus,
    options?: { resolution?: string },
  ) => void;
  resetAll: () => void;
}

const Ctx = createContext<SpineCtx | null>(null);

export function SpineProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SpineState>(() => loadState());
  const [syncState, setSyncState] = useState<SpineSyncState>("synced");
  const [syncError, setSyncError] = useState<SpineCtx["syncError"]>(null);
  const [hydratedFromBackend, setHydratedFromBackend] = useState<boolean | null>(null);
  const hasHydrated = useRef(false);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from server on mount. Remote wins only if its updatedAt is newer
  // than the local snapshot — prevents an offline client with stale data from
  // overwriting a more recent server state when it reconnects.
  useEffect(() => {
    const ac = new AbortController();
    fetchSpine(ac.signal).then((remote) => {
      if (remote) {
        setState(prev => {
          const remoteNewer = (remote.updatedAt ?? 0) > (prev.updatedAt ?? 0);
          return remoteNewer ? remote : prev;
        });
        setHydratedFromBackend(true);
      } else if (!ac.signal.aborted) {
        // null with no abort means the fetch failed (unreachable, non-OK,
        // or other) — surface that the user is on local-only state.
        setHydratedFromBackend(false);
      }
      hasHydrated.current = true;
    });
    return () => ac.abort();
  }, []);

  // Persist locally immediately, push to server debounced once hydrated.
  // Track the real sync state so the UI can surface it — never silent.
  useEffect(() => {
    saveState(state);
    if (!hasHydrated.current) return;
    if (pushTimer.current) clearTimeout(pushTimer.current);
    setSyncState("syncing");
    pushTimer.current = setTimeout(async () => {
      try {
        await pushSpine(state);
        setSyncState("synced");
        setSyncError(null);
        // A successful push proves the backend is reachable — promote
        // `hydratedFromBackend` so chambers stop showing the
        // "carregada da cache" warning. The mount-time false was honest
        // for that moment; it's not honest after we have proof of life.
        setHydratedFromBackend((prev) => (prev === false ? true : prev));
      } catch (err) {
        // Capture the typed reason so the UI can distinguish unreachable
        // edge from a backend-side rejection (e.g. spine_persist_failed
        // when the volume is read-only) instead of showing one opaque
        // "unsynced" pill that hides the cause.
        if (isBackendUnreachable(err)) {
          setSyncError({
            kind: "unreachable",
            envelope: null,
            message: err.message,
          });
        } else if (isBackendError(err)) {
          setSyncError({
            kind: "backend",
            envelope: err.envelope,
            message: err.message,
          });
        } else {
          setSyncError({
            kind: "backend",
            envelope: null,
            message: err instanceof Error ? err.message : String(err),
          });
        }
        setSyncState("unsynced");
      }
    }, 500);
    return () => { if (pushTimer.current) clearTimeout(pushTimer.current); };
  }, [state]);

  const dispatch = (fn: (s: SpineState) => SpineState) => setState(fn);

  const activeMission =
    state.missions.find((m) => m.id === state.activeMissionId) ?? null;

  return (
    <Ctx.Provider value={{
      state,
      activeMission,
      principles: state.principles,
      syncState,
      hydratedFromBackend,
      syncError,
      createMission: (t, c) => {
        const id = uid();
        dispatch(s => mkMission(s, t, c, { id }));
        return id;
      },
      switchMission: (id) => dispatch(s => switchFn(s, id)),
      setMissionStatus: (id, status) => dispatch(s => {
        const target = s.missions.find((m) => m.id === id);
        if (!target) return s;
        // Activating a different mission implicitly pauses any other
        // currently active one (single-active rule). Activating means
        // also setting it as activeMissionId.
        let nextActiveId = s.activeMissionId;
        const missions = s.missions.map((m) => {
          if (m.id === id) return { ...m, status };
          if (status === "active" && m.status === "active" && m.id !== id) {
            // Demote the previous active to paused so user doesn't lose
            // it. They can re-activate via the same callable.
            return { ...m, status: "paused" as const };
          }
          return m;
        });
        if (status === "active") {
          nextActiveId = id;
        } else if (s.activeMissionId === id) {
          // Pausing/archiving the currently active mission clears
          // activeMissionId so the next composer submit creates fresh
          // (or the user picks another via switchMission).
          nextActiveId = null;
        }
        return { ...s, missions, activeMissionId: nextActiveId, updatedAt: Date.now() };
      }),
      clearActiveMission: () => dispatch(s => clearActiveMissionFn(s)),
      addNote: (text, role) => dispatch(s => addNoteFn(s, text, role)),
      addNoteToMission: (id, text, role) => dispatch(s => addNoteToMissionFn(s, id, text, role)),
      addTask: (title, source) => {
        const newId = uid();
        dispatch(s => addTaskFn(s, title, { id: newId, source }));
        return newId;
      },
      completeTask: (id) => dispatch(s => completeTaskFn(s, id)),
      setTaskState: (id, next, options) => dispatch(s => setTaskStateFn(s, id, next, options)),
      addPrinciple: (text) => dispatch(s => addPrincipleFn(s, text)),
      logDoctrineApplied: (count) => dispatch(s => logDoctrineAppliedFn(s, count)),
      acceptArtifact: (id, artifact, taskId) => dispatch(s => acceptArtifactFn(s, id, artifact, taskId)),
      addTruthDistillation: (missionId, distillation) => dispatch(s => ({
        ...s,
        missions: s.missions.map((m) => {
          if (m.id !== missionId) return m;
          // Wave 6a — append the new draft without touching prior
          // approved versions. Supersede happens at accept time
          // (updateTruthDistillationStatus → "approved"), not at
          // generation. Otherwise an unaccepted draft would silently
          // become the active seed source for Surface/Terminal because
          // the prior approved would be flipped to `superseded` and
          // the draft would win the activeTruthDistillation fallback.
          return {
            ...m,
            truthDistillations: [...(m.truthDistillations ?? []), distillation],
          };
        }),
        updatedAt: Date.now(),
      })),
      updateTruthDistillationStatus: (missionId, distillationId, status, options) => dispatch(s => ({
        ...s,
        missions: s.missions.map((m) => {
          if (m.id !== missionId) return m;
          return {
            ...m,
            truthDistillations: (m.truthDistillations ?? []).map((d) => {
              // The artefact being mutated: flip status + telemetry
              // bookkeeping. When the new status is "approved", any
              // OTHER approved version on the same mission becomes
              // `superseded` — that's the V3.1 rule, finally enforced
              // at the right moment (accept, not generate).
              if (d.id === distillationId) {
                const next: TruthDistillation = {
                  ...d,
                  status,
                  updatedAt: Date.now(),
                };
                if (status === "stale") {
                  next.staleSince = Date.now();
                  next.staleReason = options?.staleReason ?? "manual";
                }
                return next;
              }
              if (status === "approved" && d.status === "approved") {
                return {
                  ...d,
                  status: "superseded" as const,
                  updatedAt: Date.now(),
                };
              }
              return d;
            }),
          };
        }),
        updatedAt: Date.now(),
      })),
      setMissionProjectContract: (missionId, contract) => dispatch(s => ({
        ...s,
        missions: s.missions.map((m) =>
          m.id === missionId ? { ...m, projectContract: contract } : m,
        ),
        updatedAt: Date.now(),
      })),
      enqueueHandoff: (missionId, partial) => {
        const newId = uid();
        dispatch(s => ({
          ...s,
          missions: s.missions.map((m) => {
            if (m.id !== missionId) return m;
            const handoff: HandoffRecord = {
              id: newId,
              createdAt: Date.now(),
              status: "pending",
              ...partial,
            };
            return { ...m, handoffs: [...(m.handoffs ?? []), handoff] };
          }),
          updatedAt: Date.now(),
        }));
        return newId;
      },
      resolveHandoff: (missionId, handoffId, status, options) => dispatch(s => ({
        ...s,
        missions: s.missions.map((m) => {
          if (m.id !== missionId) return m;
          return {
            ...m,
            handoffs: (m.handoffs ?? []).map((h) =>
              h.id === handoffId
                ? { ...h, status, resolvedAt: Date.now(), resolution: options?.resolution }
                : h,
            ),
          };
        }),
        updatedAt: Date.now(),
      })),
      resetAll: () => setState(emptyState()),
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSpine() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSpine: missing SpineProvider");
  return ctx;
}
