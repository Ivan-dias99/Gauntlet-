import { useState, useCallback } from "react";
import {
  ruberraFetch,
  isBackendUnreachable,
  parseBackendError,
  BackendError,
  type BackendErrorEnvelope,
} from "../lib/ruberraApi";

// Client for the Python backend (ruberra-backend/) via the /api/ruberra
// proxy.
//
// Endpoints:
//   POST /api/ruberra/route        → { route: "agent" | "triad", result: {...} }
//   POST /api/ruberra/dev          → agent loop with tool-use (AgentResponse)
//   POST /api/ruberra/dev/stream   → SSE stream of agent events
//   POST /api/ruberra/ask          → triad + judge (RuberraResponse)
//   POST /api/ruberra/crew/stream  → SSE stream of multi-agent crew events

export interface RuberraQueryBody {
  question: string;
  context?: string;
  force_cautious?: boolean;
  mission_id?: string;
  principles?: string[];
}

export type AgentEvent =
  | { type: "start" }
  | { type: "iteration"; n: number }
  | { type: "assistant_text"; text: string; iteration: number }
  | { type: "tool_use"; id: string; name: string; input: unknown; iteration: number }
  | { type: "tool_result"; id: string; ok: boolean; preview: string; iteration: number }
  | {
      type: "done";
      answer: string;
      tool_calls: Array<{ name: string; input?: unknown; ok: boolean; content_preview?: string }>;
      iterations: number;
      stop_reason: string;
      input_tokens: number;
      output_tokens: number;
      processing_time_ms: number;
      terminated_early: boolean;
      termination_reason: string | null;
    }
  | { type: "error"; message: string; error?: string; reason?: string };

export type CrewRole = "planner" | "researcher" | "coder" | "critic";

export interface CrewPlanStep {
  role: "researcher" | "coder";
  goal: string;
}

export type CrewEvent =
  | { type: "crew_start"; task: string }
  | {
      type: "plan";
      analysis: string;
      steps: CrewPlanStep[];
    }
  | { type: "role_start"; role: CrewRole; goal: string; iteration: number }
  | { type: "role_event"; role: CrewRole; event: AgentEvent }
  | {
      type: "role_done";
      role: CrewRole;
      summary: string;
      tool_calls: number;
      input_tokens: number;
      output_tokens: number;
    }
  | {
      type: "critic_verdict";
      accept: boolean;
      issues: string[];
      summary: string;
      refinement: number;
    }
  | {
      type: "done";
      answer: string;
      plan: { analysis: string; steps: CrewPlanStep[] };
      roles_run: CrewRole[];
      refinements: number;
      input_tokens: number;
      output_tokens: number;
      processing_time_ms: number;
      accepted: boolean;
    }
  | { type: "error"; message: string; error?: string; reason?: string };

export type RouteEvent =
  | { type: "route"; path: "agent" | "triad" }
  | { type: "start" }
  | { type: "triad_start"; count: number; has_prior_failure: boolean }
  | {
      type: "triad_done";
      index: number;
      length: number;
      input_tokens: number;
      output_tokens: number;
      stop_reason: string;
      completed: number;
      total: number;
    }
  | { type: "judge_start" }
  | {
      type: "judge_done";
      confidence: string;
      should_refuse: boolean;
      reasoning: string;
      divergence_count: number;
    }
  | { type: "done"; result: Record<string, unknown> }
  // agent sub-events (when route: "agent")
  | { type: "iteration"; n: number }
  | { type: "assistant_text"; text: string; iteration: number }
  | { type: "tool_use"; id: string; name: string; input: unknown; iteration: number }
  | { type: "tool_result"; id: string; ok: boolean; preview: string; iteration: number }
  | { type: "error"; message: string; error?: string; reason?: string };

type Route = "route" | "dev" | "ask";

export function useRuberra() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorEnvelope, setErrorEnvelope] = useState<BackendErrorEnvelope | null>(null);
  const [unreachable, setUnreachable] = useState(false);

  const call = useCallback(async (route: Route, body: RuberraQueryBody) => {
    setPending(true);
    setError(null);
    setErrorEnvelope(null);
    setUnreachable(false);
    try {
      const res = await ruberraFetch(route, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const envelope = await parseBackendError(res);
        throw new BackendError(
          res.status,
          envelope,
          `ruberra ${route} ${res.status}`,
        );
      }
      return await res.json();
    } catch (e) {
      if (isBackendUnreachable(e)) {
        setUnreachable(true);
        setError(e.message);
        throw e;
      }
      if (e instanceof BackendError) {
        setErrorEnvelope(e.envelope);
      }
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      throw e;
    } finally {
      setPending(false);
    }
  }, []);

  const openStream = useCallback(async <E,>(
    path: string,
    body: RuberraQueryBody,
    onEvent: (ev: E) => void,
    signal?: AbortSignal,
  ) => {
    setPending(true);
    setError(null);
    setErrorEnvelope(null);
    setUnreachable(false);
    try {
      const res = await ruberraFetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal,
      });
      if (!res.ok || !res.body) {
        const envelope = res.body ? await parseBackendError(res) : null;
        throw new BackendError(res.status, envelope, `ruberra ${path} ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";
        for (const frame of frames) {
          const line = frame.trim();
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload) continue;
          try {
            onEvent(JSON.parse(payload) as E);
          } catch {
            // malformed frame — skip
          }
        }
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      if (isBackendUnreachable(e)) {
        setUnreachable(true);
        setError(e.message);
        onEvent({ type: "error", message: e.message } as E);
        return;
      }
      if (e instanceof BackendError) {
        setErrorEnvelope(e.envelope);
        setError(e.message);
        onEvent({
          type: "error",
          message: e.message,
          error: e.envelope?.error,
          reason: e.envelope?.reason,
        } as E);
        return;
      }
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      onEvent({ type: "error", message: msg } as E);
    } finally {
      setPending(false);
    }
  }, []);

  const streamDev = useCallback(
    (body: RuberraQueryBody, onEvent: (ev: AgentEvent) => void, signal?: AbortSignal) =>
      openStream<AgentEvent>("dev/stream", body, onEvent, signal),
    [openStream],
  );

  const streamRoute = useCallback(
    (body: RuberraQueryBody, onEvent: (ev: RouteEvent) => void, signal?: AbortSignal) =>
      openStream<RouteEvent>("route/stream", body, onEvent, signal),
    [openStream],
  );

  const streamCrew = useCallback(
    (body: RuberraQueryBody, onEvent: (ev: CrewEvent) => void, signal?: AbortSignal) =>
      openStream<CrewEvent>("crew/stream", body, onEvent, signal),
    [openStream],
  );

  return {
    call,
    streamDev,
    streamRoute,
    streamCrew,
    pending,
    error,
    errorEnvelope,
    unreachable,
  };
}
