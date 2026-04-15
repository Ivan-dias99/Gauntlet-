import { SpineState, Mission, Chamber } from "./types";

const KEY = "ruberra:spine:v1";

export function loadState(): SpineState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { missions: [], activeMissionId: null };
    return JSON.parse(raw) as SpineState;
  } catch {
    return { missions: [], activeMissionId: null };
  }
}

export function saveState(state: SpineState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function createMission(
  state: SpineState,
  title: string,
  chamber: Chamber
): SpineState {
  const mission: Mission = {
    id: crypto.randomUUID(),
    title: title.trim(),
    chamber,
    status: "active",
    createdAt: Date.now(),
  };
  return {
    missions: [mission, ...state.missions],
    activeMissionId: mission.id,
  };
}
