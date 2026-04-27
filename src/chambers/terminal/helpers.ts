import type { Task, TaskState } from "../../spine/types";
import type { CrewPlanStep, CrewRole } from "../../hooks/useSignal";

// Shared types + pure helpers for the Terminal chamber. The aggregator
// (index.tsx) is still the home of state, effects, submit flow and
// streaming reduction — this module only houses the pure pieces. A
// deeper primitive extraction (SessionRail / RunCanvas / ContextStrip /
// ExecutionComposer / CrewModePanel) is deferred: the chamber is ~1870
// lines with stateful event handlers that are expensive to bisect
// without interactive UI tests. Landing the cascade-ready
// data-chamber="terminal" on the shell is the minimum-viable
// chamber-DNA payoff we can take safely today.

export type RunMode = "agent" | "crew";

// A running task that hasn't received an event in this long is treated
// as stale: the stream almost certainly died (reload, crash, network)
// even if the persisted state still says "running". The bench flags it
// so the user sees the jam instead of staring at a silent ● forever.
export const STALE_RUNNING_MS = 120_000;

// Short, operational relative-time string. The goal is "is this fresh
// or rotting?" at a glance — not a precise timestamp.
export function relTime(ms: number, lang: "pt" | "en"): string {
  const diff = Math.max(0, Date.now() - ms);
  if (diff < 45_000) return lang === "en" ? "just now" : "agora";
  const min = Math.round(diff / 60_000);
  if (min < 60) return lang === "en" ? `${min}m ago` : `há ${min}m`;
  const hr = Math.round(min / 60);
  if (hr < 24) return lang === "en" ? `${hr}h ago` : `há ${hr}h`;
  const d = Math.round(hr / 24);
  return lang === "en" ? `${d}d ago` : `há ${d}d`;
}

export function isStaleRunning(task: Task): boolean {
  return task.state === "running" && (Date.now() - task.lastUpdateAt) > STALE_RUNNING_MS;
}

export type ToolPhase = "running" | "ok" | "err";

// Copy is Record<string, string | fn(...)> of every localized string.
// Imported by primitives that need localized labels without piping
// them down individually. Use `import type { Copy } from "./helpers"`.
import type { useCopy } from "../../i18n/copy";
export type Copy = ReturnType<typeof useCopy>;

export function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(s < 10 ? 1 : 0)}s`;
  const m = Math.floor(s / 60);
  const rem = Math.round(s % 60);
  return `${m}m${rem ? rem + "s" : ""}`;
}

export const STATE_COLOR: Record<TaskState, string> = {
  open: "var(--text-ghost)",
  running: "var(--cc-info)",
  done: "var(--cc-ok)",
  blocked: "var(--cc-err)",
};

export const STATE_GLYPH: Record<TaskState, string> = {
  open: "›",
  running: "◐",
  done: "✓",
  blocked: "✕",
};

export const ROLE_COLOR: Record<CrewRole, string> = {
  planner: "var(--accent)",
  researcher: "var(--cc-info)",
  coder: "var(--cc-prompt)",
  critic: "var(--cc-warn)",
};

export function stateLabel(state: TaskState, copy: Copy): string {
  switch (state) {
    case "open": return copy.taskStateOpen;
    case "running": return copy.taskStateRunning;
    case "done": return copy.taskStateDone;
    case "blocked": return copy.taskStateBlocked;
  }
}

export function sourceLabel(source: Task["source"], copy: Copy): string {
  switch (source) {
    case "insight": return copy.taskSourceInsight;
    case "crew": return copy.taskSourceCrew;
    case "other": return copy.taskSourceOther;
    default: return copy.taskSourceManual;
  }
}

export interface LiveTool {
  id: string;
  name: string;
  input?: unknown;
  iteration: number;
  ok?: boolean;
  preview?: string;
  role?: CrewRole;
}

export interface DoneSummary {
  answer: string;
  iterations: number;
  tool_count: number;
  processing_time_ms: number;
  terminated_early: boolean;
  termination_reason: string | null;
}

export interface CrewState {
  analysis: string;
  steps: CrewPlanStep[];
  currentRole: CrewRole | null;
  rolesRun: CrewRole[];
  verdict: { accept: boolean; issues: string[]; summary: string; refinement: number } | null;
  refinements: number;
}

export const EMPTY_CREW: CrewState = {
  analysis: "",
  steps: [],
  currentRole: null,
  rolesRun: [],
  verdict: null,
  refinements: 0,
};

// Re-exports so the aggregator can pull task-state typing from one place.
export type { Task, TaskState } from "../../spine/types";
