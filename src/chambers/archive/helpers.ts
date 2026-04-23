import type { Artifact, Chamber } from "../../spine/types";

// Shared types / constants / pure helpers for the Archive chamber.
// Kept in a dedicated module so the visual primitives (RunList, RunDetail,
// StatsBar) do not import from each other — the aggregator wires them.

export interface RunRecord {
  id: string;
  timestamp: string;
  route: string;
  mission_id: string | null;
  question: string;
  answer: string | null;
  refused: boolean;
  confidence: string | null;
  judge_reasoning: string | null;
  iterations: number | null;
  tool_calls: Array<{ name: string; ok: boolean }>;
  processing_time_ms: number;
  input_tokens: number;
  output_tokens: number;
  terminated_early: boolean;
  termination_reason: string | null;
}

export interface RunsResponse {
  count: number;
  mission_id: string | null;
  records: RunRecord[];
}

export interface ServerStats {
  total: number;
  mission_id: string | null;
  by_route: Record<string, number>;
  refused: number;
  refusal_rate: number;
  avg_latency_ms: number;
  total_input_tokens: number;
  total_output_tokens: number;
  tool_calls: number;
}

export interface Stats {
  total: number;
  refused: number;
  refusalRate: number;
  avgLatencyMs: number;
  totalInput: number;
  totalOutput: number;
  toolCalls: number;
  byRoute: Record<string, number>;
}

export const ROUTE_COLOR: Record<string, string> = {
  agent:   "var(--terminal-warn)",
  triad:   "var(--accent)",
  crew:    "var(--terminal-ok)",
  surface: "var(--ch-surface, var(--accent))",
};

// Backend reality (engine.py): four route strings are ever written —
// "agent" | "crew" | "triad" | "surface". `agent` is ambiguous (Insight
// auto-router OR Terminal /dev) so we deliberately omit it instead of
// half-lying. `crew` is Terminal-only; `triad` is Insight-dominant
// (Archive / Core also dispatch triad — disambiguated by mission
// metadata, not route). `surface` is Surface-only.
export const ROUTE_ORIGIN: Partial<Record<string, Chamber>> = {
  crew:    "terminal",
  triad:   "insight",
  surface: "surface",
};

export function originFor(route: string): Chamber | null {
  return ROUTE_ORIGIN[route] ?? null;
}

// Heuristic link between a run and an accepted artifact: same mission,
// accepted within a short window after the run finished.
const ARTIFACT_MATCH_WINDOW_MS = 5 * 60 * 1000;

export function linkArtifact(
  run: RunRecord,
  artifact: Artifact | null | undefined,
): Artifact | null {
  if (!artifact) return null;
  const runMs = Date.parse(run.timestamp);
  if (!Number.isFinite(runMs)) return null;
  const delta = artifact.acceptedAt - runMs;
  if (delta < 0 || delta > ARTIFACT_MATCH_WINDOW_MS) return null;
  return artifact;
}

export function tokenize(text: string): string[] {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 5);
}

export function isLinked(question: string, active: Set<string>): boolean {
  if (active.size === 0) return false;
  for (const t of tokenize(question)) {
    if (active.has(t)) return true;
  }
  return false;
}

export function computeStats(runs: RunRecord[]): Stats {
  if (runs.length === 0) {
    return {
      total: 0, refused: 0, refusalRate: 0, avgLatencyMs: 0,
      totalInput: 0, totalOutput: 0, toolCalls: 0, byRoute: {},
    };
  }
  let refused = 0;
  let latencySum = 0;
  let totalInput = 0;
  let totalOutput = 0;
  let toolCalls = 0;
  const byRoute: Record<string, number> = {};
  for (const r of runs) {
    if (r.refused) refused++;
    latencySum += r.processing_time_ms ?? 0;
    totalInput += r.input_tokens ?? 0;
    totalOutput += r.output_tokens ?? 0;
    toolCalls += r.tool_calls?.length ?? 0;
    byRoute[r.route] = (byRoute[r.route] ?? 0) + 1;
  }
  return {
    total: runs.length,
    refused,
    refusalRate: refused / runs.length,
    avgLatencyMs: Math.round(latencySum / runs.length),
    totalInput,
    totalOutput,
    toolCalls,
    byRoute,
  };
}

export function formatTokens(n: number): string {
  if (n < 1000) return `${n}`;
  if (n < 1_000_000) return `${(n / 1000).toFixed(1)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}
