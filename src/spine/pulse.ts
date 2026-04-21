import { Mission } from "./types";

export interface PulseSignal {
  openTasks: number;
  doneTasks: number;
  notes: number;
  artifacts: number;
  closed: boolean;
  empty: boolean;
}

export function computePulse(m: Mission): PulseSignal {
  const openTasks = m.tasks.reduce((n, t) => n + (t.state !== "done" ? 1 : 0), 0);
  const doneTasks = m.tasks.length - openTasks;
  const notes = m.notes.length;
  const artifacts = m.artifacts.length;
  const closed = m.status === "closed";
  const empty = openTasks === 0 && doneTasks === 0 && notes === 0 && artifacts === 0;
  return { openTasks, doneTasks, notes, artifacts, closed, empty };
}

export function formatPulse(m: Mission): string {
  const p = computePulse(m);
  const parts: string[] = [];
  if (p.openTasks > 0) parts.push(`${p.openTasks}t`);
  if (p.notes > 0) parts.push(`${p.notes}n`);
  if (p.artifacts > 0) parts.push(`${p.artifacts}a`);
  if (p.closed) parts.push("fechada");
  if (p.empty) parts.push("vazia");
  return parts.join(" · ");
}
