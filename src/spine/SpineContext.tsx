import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { SpineState, Mission, Principle, Chamber, Artifact, TaskState, TaskSource } from "./types";
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
  acceptArtifact as acceptArtifactFn,
} from "./store";
import { fetchSpine, pushSpine } from "./client";
import { isBackendUnreachable } from "../lib/ruberraApi";

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
  createMission: (title: string, chamber: Chamber) => void;
  switchMission: (id: string) => void;
  addNote: (text: string, role?: "user" | "ai") => void;
  addNoteToMission: (missionId: string, text: string, role?: "user" | "ai") => void;
  // addTask returns the id of the newly-created task so callers can track
  // its state transitions (running → done / blocked) through the run.
  addTask: (title: string, source?: TaskSource) => string;
  completeTask: (taskId: string) => void;
  setTaskState: (taskId: string, state: TaskState) => void;
  addPrinciple: (text: string) => void;
  logDoctrineApplied: (count: number) => void;
  acceptArtifact: (missionId: string, artifact: Omit<Artifact, "id">, taskId?: string) => void;
  resetAll: () => void;
}

const Ctx = createContext<SpineCtx | null>(null);

export function SpineProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SpineState>(() => loadState());
  const [syncState, setSyncState] = useState<SpineSyncState>("synced");
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
      } catch (err) {
        // Both backend-unreachable and generic HTTP failures mean the server
        // does not have the latest snapshot. Surface it honestly.
        if (isBackendUnreachable(err) || err instanceof Error) {
          setSyncState("unsynced");
          return;
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
      createMission: (t, c) => dispatch(s => mkMission(s, t, c)),
      switchMission: (id) => dispatch(s => switchFn(s, id)),
      addNote: (text, role) => dispatch(s => addNoteFn(s, text, role)),
      addNoteToMission: (id, text, role) => dispatch(s => addNoteToMissionFn(s, id, text, role)),
      addTask: (title, source) => {
        const newId = uid();
        dispatch(s => addTaskFn(s, title, { id: newId, source }));
        return newId;
      },
      completeTask: (id) => dispatch(s => completeTaskFn(s, id)),
      setTaskState: (id, next) => dispatch(s => setTaskStateFn(s, id, next)),
      addPrinciple: (text) => dispatch(s => addPrincipleFn(s, text)),
      logDoctrineApplied: (count) => dispatch(s => logDoctrineAppliedFn(s, count)),
      acceptArtifact: (id, artifact, taskId) => dispatch(s => acceptArtifactFn(s, id, artifact, taskId)),
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
