import type { RouteEvent } from "../../hooks/useSignal";

// Shared types + pure helpers for the Insight chamber. Kept in a
// dedicated module so the visual primitives (Thread, Composer,
// VerdictBadge) do not cross-import from each other — the aggregator
// wires them.

export interface TriadResult {
  answer?: string | null;
  refused?: boolean;
  refusal_message?: string | null;
  confidence?: string;
  judge_reasoning?: string;
  triad_agreement?: string;
  matched_prior_failure?: boolean;
}

export interface AgentResult {
  answer?: string;
  tool_calls?: Array<{ name: string; ok: boolean }>;
  iterations?: number;
  terminated_early?: boolean;
  termination_reason?: string | null;
}

export interface VerdictState {
  routePath: "agent" | "triad";
  confidence: string | null;
  refused: boolean;
  reasoning: string;
  divergenceCount: number;
  priorFailure: boolean;
  agentIter: number;
  agentToolCount: number;
  question: string;
  // Wave 6a — refusal substitute. Null on accept; carries a smaller /
  // sharper version of the question on refusal so the chamber can
  // offer a one-click reformulate path instead of a dead end.
  nearestAnswerableQuestion?: string | null;
}

export interface LiveState {
  routePath: "agent" | "triad" | null;
  triadCompleted: number;
  triadTotal: number;
  judgeState: "pending" | "evaluating" | "done" | null;
  judgeConfidence: string | null;
  agentIter: number;
  agentToolCount: number;
  lastEventLabel: string;
}

export const EMPTY_LIVE: LiveState = {
  routePath: null,
  triadCompleted: 0,
  triadTotal: 0,
  judgeState: null,
  judgeConfidence: null,
  agentIter: 0,
  agentToolCount: 0,
  lastEventLabel: "a rotear...",
};

export function extractAnswer(
  routePath: "agent" | "triad" | null,
  result: Record<string, unknown>,
): string {
  if (routePath === "triad") {
    const r = result as TriadResult;
    if (r.refused) return r.refusal_message ?? "(refusal sem mensagem)";
    return r.answer ?? "(sem resposta)";
  }
  return (result as AgentResult).answer ?? "(sem resposta)";
}

export function inferPath(ev: Extract<RouteEvent, { type: "done" }>): "agent" | "triad" {
  const r = ev.result as Record<string, unknown>;
  return "tool_calls" in r || "iterations" in r ? "agent" : "triad";
}

export function reduceEvent(prev: LiveState, ev: RouteEvent): LiveState {
  switch (ev.type) {
    case "route":
      return { ...prev, routePath: ev.path, lastEventLabel: ev.path === "agent" ? "agent · a pensar" : "triad · 3 análises em paralelo" };
    case "triad_start":
      return { ...prev, triadTotal: ev.count, triadCompleted: 0, lastEventLabel: `triad · 0/${ev.count}${ev.has_prior_failure ? " · ⚠ falha prévia" : ""}` };
    case "triad_done":
      return { ...prev, triadCompleted: ev.completed, triadTotal: ev.total, lastEventLabel: `triad · ${ev.completed}/${ev.total} · análise ${ev.index} pronta` };
    case "judge_start":
      return { ...prev, judgeState: "evaluating", lastEventLabel: "judge · a avaliar consistência" };
    case "judge_done":
      return { ...prev, judgeState: "done", judgeConfidence: ev.confidence, lastEventLabel: `judge · ${ev.confidence}${ev.should_refuse ? " · recusar" : ""}${ev.divergence_count > 0 ? ` · ${ev.divergence_count} diverg.` : ""}` };
    case "iteration":
      return { ...prev, agentIter: ev.n, lastEventLabel: `agent · iter ${ev.n}` };
    case "tool_use":
      return { ...prev, agentToolCount: prev.agentToolCount + 1, lastEventLabel: `agent · ${ev.name}` };
    case "tool_result":
      return { ...prev, lastEventLabel: `agent · ${ev.ok ? "✓" : "✗"} ${ev.id.slice(0, 8)}` };
    case "assistant_text":
      return { ...prev, lastEventLabel: "agent · a escrever" };
    case "done":
      return { ...prev, lastEventLabel: "concluído" };
    case "error":
      return { ...prev, lastEventLabel: `erro: ${ev.message.slice(0, 60)}` };
    default:
      return prev;
  }
}
