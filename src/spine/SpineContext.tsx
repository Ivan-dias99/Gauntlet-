import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SpineState, Mission, Chamber } from "./types";
import { loadState, saveState, createMission as mkMission } from "./store";

interface SpineCtx {
  state: SpineState;
  activeMission: Mission | null;
  createMission: (title: string, chamber: Chamber) => void;
  setActiveMission: (id: string) => void;
}

const Ctx = createContext<SpineCtx | null>(null);

export function SpineProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SpineState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeMission =
    state.missions.find((m) => m.id === state.activeMissionId) ?? null;

  function createMission(title: string, chamber: Chamber) {
    setState((s) => mkMission(s, title, chamber));
  }

  function setActiveMission(id: string) {
    setState((s) => ({ ...s, activeMissionId: id }));
  }

  return (
    <Ctx.Provider value={{ state, activeMission, createMission, setActiveMission }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSpine() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSpine: missing SpineProvider");
  return ctx;
}
