import { useState, useCallback } from "react";
import {
  signalFetch,
  isBackendUnreachable,
  parseBackendError,
  BackendError,
  type BackendErrorEnvelope,
} from "../lib/signalApi";

// Client for the Python backend (signal-backend/) via the /api/signal
// proxy. The legacy /api/ruberra alias still routes during the compat
// window — the shell reaches both with the same contract.
//
// Endpoints:
//   POST /api/signal/route        → { route: "agent" | "triad", result: {...} }
//   POST /api/signal/dev          → agent loop with tool-use (AgentResponse)
//   POST /api/signal/dev/stream   → SSE stream of agent events
//   POST /api/signal/ask          → triad + judge (SignalResponse)
//   POST /api/signal/crew/stream  → SSE stream of multi-agent crew events
//   POST /api/signal/route/stream → SSE router (forks to Surface mock on chamber=surface)

export interface SignalQueryBody {
  question: string;
  context?: string;
  force_cautious?: boolean;
  mission_id?: string;
  principles?: string[];
  // Wave-1: optional canonical chamber key.
  chamber?: "insight" | "surface" | "terminal" | "archive" | "core";
  // Wave-3: optional Surface-chamber brief. Consumed server-side only
  // when chamber === "surface".
  surface?: SurfaceBriefPayload;
}

export interface SurfaceBriefPayload {
  mode: "prototype" | "slide_deck" | "from_template" | "other";
  fidelity: "wireframe" | "hi-fi";
  design_system?: string | null;
}

export interface SurfaceScreenPayload {
  name: string;
  purpose: string;
}

export interface SurfaceComponentPayload {
  screen: string;
  name: string;
  kind: string;
}

export interface SurfacePlanPayload {
  mode: SurfaceBriefPayload["mode"];
  fidelity: SurfaceBriefPayload["fidelity"];
  design_system_binding: string | null;
  screens: SurfaceScreenPayload[];
  components: SurfaceComponentPayload[];
  notes: string[];
  mock: boolean;
}

// Wave 6a — Truth Distillation streaming events. Same envelope shape
// as the Surface generator (start → typed payload → done | error) so
// the chamber consumer reuses the openStream helper without a parallel
// SSE code path.
export interface DistillProjectContractPayload {
  version: number;
  concept?: string;
  mission?: string;
  targetUser?: string;
  problem?: string;
  scope?: string;
  nonGoals: string[];
  principles: string[];
  knownRisks: string[];
  qualityGates: string[];
  definitionOfDone?: string;
  riskPolicy?: string;
  derivedFromSpine: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface DistillTruthPayload {
  id: string;
  version: number;
  status: string;
  sourceMissionId: string;
  summary: string;
  validatedDirection: string;
  coreDecisions: string[];
  unknowns: string[];
  risks: string[];
  surfaceSeed: {
    question: string;
    designSystemSuggestion?: string | null;
    screenCountEstimate?: number | null;
    fidelityHint?: "wireframe" | "hi-fi" | null;
  } | null;
  terminalSeed: {
    task: string;
    fileTargets?: string[];
    riskLevel?: "low" | "medium" | "high" | null;
    requiresGate?: ("typecheck" | "build" | "test")[];
  } | null;
  confidence: "low" | "medium" | "high";
  createdAt: number;
  updatedAt: number;
  supersedesVersion?: number | null;
  staleSince?: number | null;
  staleReason?: string | null;
  failureState?: string | null;
}

export type DistillEvent =
  | { type: "start" }
  | { type: "project_contract"; contract: DistillProjectContractPayload }
  | { type: "truth_distillation"; distillation: DistillTruthPayload }
  | {
      type: "done";
      distillation: DistillTruthPayload;
      mock: boolean;
      processing_time_ms: number;
      input_tokens: number;
      output_tokens: number;
    }
  | { type: "error"; message: string; error?: string; reason?: string };

export type SurfaceEvent =
  | { type: "start" }
  | { type: "route"; path: "surface" }
  | { type: "surface_plan"; plan: SurfacePlanPayload }
  | {
      type: "done";
      answer: string;
      plan: SurfacePlanPayload;
      mock: boolean;
      chamber: "surface";
      processing_time_ms: number;
      input_tokens: number;
      output_tokens: number;
      terminated_early: boolean;
      termination_reason: string | null;
    }
  | { type: "error"; message: string; error?: string; reason?: string };

// T085: structured gate/diff frames. Replace the legacy regex-on-preview
// derivation in Terminal — the backend now emits typed signals after each
// tool_result. `gate` carries pass|fail|unavailable for typecheck/build/test.
// `diff` carries file-level numeric stats. Both are advisory: a chamber can
// ignore them without breaking the run.
export type GateName = "typecheck" | "build" | "test";
export type GateState = "pass" | "fail" | "unavailable";

export type AgentEvent =
  | { type: "start" }
  | { type: "iteration"; n: number }
  | { type: "assistant_text"; text: string; iteration: number }
  | { type: "tool_use"; id: string; name: string; input: unknown; iteration: number }
  | { type: "tool_result"; id: string; ok: boolean; preview: string; iteration: number }
  | { type: "gate"; name: GateName; state: GateState; iteration: number; source?: string }
  | { type: "diff"; files: number; added: number; removed: number; iteration: number; source?: string }
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
      // Wave 6a — refusal substitute. Null on accept; carries a
      // smaller / sharper version of the question the judge could
      // have answered with high confidence on refusal.
      nearest_answerable_question: string | null;
    }
  | { type: "done"; result: Record<string, unknown> }
  // agent sub-events (when route: "agent")
  | { type: "iteration"; n: number }
  | { type: "assistant_text"; text: string; iteration: number }
  | { type: "tool_use"; id: string; name: string; input: unknown; iteration: number }
  | { type: "tool_result"; id: string; ok: boolean; preview: string; iteration: number }
  | { type: "gate"; name: GateName; state: GateState; iteration: number; source?: string }
  | { type: "diff"; files: number; added: number; removed: number; iteration: number; source?: string }
  | { type: "error"; message: string; error?: string; reason?: string };

type Route = "route" | "dev" | "ask";

export function useSignal() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorEnvelope, setErrorEnvelope] = useState<BackendErrorEnvelope | null>(null);
  const [unreachable, setUnreachable] = useState(false);

  const call = useCallback(async (route: Route, body: SignalQueryBody) => {
    setPending(true);
    setError(null);
    setErrorEnvelope(null);
    setUnreachable(false);
    try {
      const res = await signalFetch(route, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const envelope = await parseBackendError(res);
        throw new BackendError(
          res.status,
          envelope,
          `signal ${route} ${res.status}`,
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

  const openStream = useCallback(async <E, B = SignalQueryBody>(
    path: string,
    body: B,
    onEvent: (ev: E) => void,
    signal?: AbortSignal,
  ) => {
    setPending(true);
    setError(null);
    setErrorEnvelope(null);
    setUnreachable(false);
    try {
      const res = await signalFetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal,
      });
      if (!res.ok || !res.body) {
        const envelope = res.body ? await parseBackendError(res) : null;
        throw new BackendError(res.status, envelope, `signal ${path} ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      // Track whether the stream produced a terminal event (done|error). If
      // the read loop exits without one, the connection died mid-stream
      // (proxy timeout, network drop, upstream crash) — the chamber must
      // be told instead of silently going idle.
      let sawTerminal = false;
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
            const parsed = JSON.parse(payload) as E;
            const t = (parsed as { type?: string } | null)?.type;
            if (t === "done" || t === "error") sawTerminal = true;
            // Backend-emitted error frames (T063/T076 contract) carry
            // `{type:"error", message, error?, reason?}`. Promote them
            // to the hook's error state so every chamber's existing
            // ErrorPanel gate fires instead of showing a one-frame
            // label and silently going idle.
            if (
              parsed !== null &&
              typeof parsed === "object" &&
              (parsed as { type?: string }).type === "error"
            ) {
              const ef = parsed as {
                message?: string;
                error?: string;
                reason?: string;
              };
              const msg = ef.message ?? "stream error";
              setError(msg);
              if (ef.error && ef.reason) {
                setErrorEnvelope({
                  error: ef.error,
                  reason: ef.reason,
                  message: msg,
                });
              }
            }
            onEvent(parsed);
          } catch {
            // malformed frame — skip
          }
        }
      }
      if (!sawTerminal) {
        // Stream closed cleanly without firing done/error. Almost always a
        // proxy/upstream timeout that severed the connection mid-event.
        // Surface honestly instead of letting the chamber go quiet.
        const msg = "stream interrompida sem conclusão";
        setError(msg);
        onEvent({
          type: "error",
          message: msg,
          error: "stream_truncated",
          reason: "NoTerminalEvent",
        } as E);
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
    (body: SignalQueryBody, onEvent: (ev: AgentEvent) => void, signal?: AbortSignal) =>
      openStream<AgentEvent>("dev/stream", body, onEvent, signal),
    [openStream],
  );

  const streamRoute = useCallback(
    (body: SignalQueryBody, onEvent: (ev: RouteEvent) => void, signal?: AbortSignal) =>
      openStream<RouteEvent>("route/stream", body, onEvent, signal),
    [openStream],
  );

  const streamCrew = useCallback(
    (body: SignalQueryBody, onEvent: (ev: CrewEvent) => void, signal?: AbortSignal) =>
      openStream<CrewEvent>("crew/stream", body, onEvent, signal),
    [openStream],
  );

  // Wave-3: Surface streams through /route/stream with chamber="surface".
  // The backend forks to the mock handler before reaching agent/triad.
  const streamSurface = useCallback(
    (body: SignalQueryBody & { chamber: "surface"; surface: SurfaceBriefPayload },
     onEvent: (ev: SurfaceEvent) => void,
     signal?: AbortSignal) =>
      openStream<SurfaceEvent>("route/stream", body, onEvent, signal),
    [openStream],
  );

  // Wave 6a — Truth Distillation. Body carries only mission_id; the
  // backend reads notes + principles + auto-derives the ProjectContract
  // from the spine snapshot. Streaming envelope mirrors Surface.
  // Wave 6a — Distill request body. `mission_id` is required; the
  // remaining fields are optional inline overrides of mission state
  // sent to defend against the 500ms debounced spine-push race.
  // Backend falls back to the persisted snapshot when a field is
  // omitted (back-compat).
  type DistillBody = {
    mission_id: string;
    notes?: Array<{ text: string; role?: string; createdAt?: number }>;
    principles?: string[];
    // version + status of every existing distillation on this mission,
    // so the version increment helper picks max+1 from the latest
    // client-side view (not the stale snapshot).
    existing_distillations?: Array<{ version: number; status?: string }>;
  };
  const streamDistill = useCallback(
    (body: DistillBody,
     onEvent: (ev: DistillEvent) => void,
     signal?: AbortSignal) =>
      openStream<DistillEvent, DistillBody>("insight/distill/stream", body, onEvent, signal),
    [openStream],
  );

  return {
    call,
    streamDev,
    streamRoute,
    streamCrew,
    streamSurface,
    streamDistill,
    pending,
    error,
    errorEnvelope,
    unreachable,
  };
}
