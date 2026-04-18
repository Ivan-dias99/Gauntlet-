import { useState, useCallback } from "react";

// Client for the Python backend (rubeira-backend/) via the /api/rubeira
// proxy.
//
// Endpoints:
//   POST /api/rubeira/route       → { route: "agent" | "triad", result: {...} }
//   POST /api/rubeira/dev         → agent loop with tool-use (AgentResponse)
//   POST /api/rubeira/dev/stream  → SSE stream of agent events
//   POST /api/rubeira/ask         → triad + judge (RubeiraResponse)

export interface RubeiraQueryBody {
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
  | { type: "error"; message: string };

type Route = "route" | "dev" | "ask";

export function useRubeira() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const call = useCallback(async (route: Route, body: RubeiraQueryBody) => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/rubeira/${route}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`rubeira ${route} ${res.status}: ${text.slice(0, 200)}`);
      }
      return await res.json();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      throw e;
    } finally {
      setPending(false);
    }
  }, []);

  const streamDev = useCallback(async (
    body: RubeiraQueryBody,
    onEvent: (ev: AgentEvent) => void,
    signal?: AbortSignal,
  ) => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/rubeira/dev/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal,
      });
      if (!res.ok || !res.body) {
        const text = res.body ? await res.text() : "";
        throw new Error(`rubeira dev/stream ${res.status}: ${text.slice(0, 200)}`);
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
            onEvent(JSON.parse(payload) as AgentEvent);
          } catch {
            // malformed frame — skip
          }
        }
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      onEvent({ type: "error", message: msg });
    } finally {
      setPending(false);
    }
  }, []);

  return { call, streamDev, pending, error };
}
