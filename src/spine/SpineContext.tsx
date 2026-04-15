import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SpineState, Mission, Principle, Chamber } from "./types";
import {
  loadState, saveState,
  createMission as mkMission,
  addNote as addNoteFn,
  addTask as addTaskFn,
  completeTask as completeTaskFn,
  addPrinciple as addPrincipleFn,
  switchMission as switchFn,
} from "./store";

interface SpineCtx {
  state: SpineState;
  activeMission: Mission | null;
  principles: Principle[];
  createMission: (title: string, chamber: Chamber) => void;
  switchMission: (id: string) => void;
  addNote: (text: string) => void;
  addTask: (title: string) => void;
  completeTask: (taskId: string) => void;
  addPrinciple: (text: string) => void;
}

const Ctx = createContext<SpineCtx | null>(null);

export function SpineProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SpineState>(() => loadState());

  useEffect(() => { saveState(state); }, [state]);

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
      addNote: (text) => dispatch(s => addNoteFn(s, text)),
      addTask: (title) => dispatch(s => addTaskFn(s, title)),
      completeTask: (id) => dispatch(s => completeTaskFn(s, id)),
      addPrinciple: (text) => dispatch(s => addPrincipleFn(s, text)),
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
