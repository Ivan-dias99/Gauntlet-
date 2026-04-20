import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { SpineState, Mission, Principle, Chamber } from "./types";
import {
  loadState, saveState, emptyState,
  createMission as mkMission,
  addNote as addNoteFn,
  addNoteToMission as addNoteToMissionFn,
  addTask as addTaskFn,
  completeTask as completeTaskFn,
  addPrinciple as addPrincipleFn,
  switchMission as switchFn,
} from "./store";
import { fetchSpine, pushSpine } from "./client";

interface SpineCtx {
  state: SpineState;
  activeMission: Mission | null;
  principles: Principle[];
  createMission: (title: string, chamber: Chamber) => void;
  switchMission: (id: string) => void;
  addNote: (text: string, role?: "user" | "ai") => void;
  addNoteToMission: (missionId: string, text: string, role?: "user" | "ai") => void;
  addTask: (title: string) => void;
  completeTask: (taskId: string) => void;
  addPrinciple: (text: string) => void;
  resetAll: () => void;
}

const Ctx = createContext<SpineCtx | null>(null);

export function SpineProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SpineState>(() => loadState());
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
  useEffect(() => {
    saveState(state);
    if (!hasHydrated.current) return;
    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => { pushSpine(state); }, 500);
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
      createMission: (t, c) => dispatch(s => mkMission(s, t, c)),
      switchMission: (id) => dispatch(s => switchFn(s, id)),
      addNote: (text, role) => dispatch(s => addNoteFn(s, text, role)),
      addNoteToMission: (id, text, role) => dispatch(s => addNoteToMissionFn(s, id, text, role)),
      addTask: (title) => dispatch(s => addTaskFn(s, title)),
      completeTask: (id) => dispatch(s => completeTaskFn(s, id)),
      addPrinciple: (text) => dispatch(s => addPrincipleFn(s, text)),
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
