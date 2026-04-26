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

export type MissionStatusBadge = "running" | "blocked" | "idle" | "closed" | "fresh";

export function missionStatusBadge(m: Mission): MissionStatusBadge {
  if (m.status === "closed") return "closed";
  if (m.tasks.some((t) => t.state === "running")) return "running";
  if (m.tasks.some((t) => t.state === "blocked")) return "blocked";
  if (m.tasks.length > 0 || m.notes.length > 0 || m.artifacts.length > 0) return "idle";
  return "fresh";
}

// Resolves the most recent activity timestamp on a mission. Falls back
// to createdAt when no notes/tasks/artifacts have been touched. Used to
// sort the recent-missions surface and label "last activity".
export function lastActivityAt(m: Mission): number {
  let ts = m.createdAt;
  for (const n of m.notes) if (n.createdAt > ts) ts = n.createdAt;
  for (const t of m.tasks) {
    const candidate = t.lastUpdateAt ?? t.doneAt ?? t.createdAt;
    if (candidate > ts) ts = candidate;
  }
  for (const a of m.artifacts) if (a.acceptedAt > ts) ts = a.acceptedAt;
  if (m.lastArtifact && m.lastArtifact.acceptedAt > ts) ts = m.lastArtifact.acceptedAt;
  return ts;
}

export function relativeFromNow(ts: number, now: number = Date.now()): string {
  const diffMs = Math.max(0, now - ts);
  const s = Math.floor(diffMs / 1000);
  if (s < 45) return "agora";
  const m = Math.floor(s / 60);
  if (m < 60) return `há ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `há ${d} d`;
  return new Date(ts).toLocaleDateString([], { day: "2-digit", month: "2-digit" });
}
