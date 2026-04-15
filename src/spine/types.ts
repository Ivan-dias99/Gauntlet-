export type Chamber = "Lab" | "Creation" | "Memory" | "School";
export type MissionStatus = "active" | "closed";

export interface Mission {
  id: string;
  title: string;
  chamber: Chamber;
  status: MissionStatus;
  createdAt: number;
}

export interface SpineState {
  missions: Mission[];
  activeMissionId: string | null;
}
