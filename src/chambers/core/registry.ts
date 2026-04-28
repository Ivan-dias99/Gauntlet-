import { useEffect, useState } from "react";
import { signalFetch, isBackendUnreachable } from "../../lib/signalApi";

// Live mirror of signal-backend/chambers/profiles.py + tools.py + agent.py
// budgets, served by GET /system/registry. The three Core sub-tabs
// (Routing, Permissions, Orchestration) used to hand-maintain these
// values in TS constants — that mirror drifted the moment anyone
// touched the backend. This hook is the single fetch + module-level
// cache so all three tabs share the same payload.

export interface RegistryChamber {
  key: "insight" | "surface" | "terminal" | "archive" | "core";
  dispatch: "agent" | "triad" | "surface_mock";
  temperature: number | null;
  allowed_tools: string[] | null;
}

export interface RegistryTool {
  name: string;
  description: string;
  gated: boolean;
}

export interface RegistryBudgets {
  agent: {
    max_iterations: number;
    max_tool_calls: number;
    max_repeats: number;
    temperature: number;
    wall_clock_s: number;
  };
  triad: {
    count: number;
    temperature: number;
    judge_temperature: number;
    model: string;
  };
}

export interface SystemRegistry {
  chambers: RegistryChamber[];
  tools: RegistryTool[];
  budgets: RegistryBudgets;
}

export type RegistryState =
  | { status: "loading" }
  | { status: "ready"; data: SystemRegistry }
  | { status: "unreachable" }
  | { status: "error"; message: string };

let cache: SystemRegistry | null = null;
let inFlight: Promise<SystemRegistry | null> | null = null;
let lastError: string | null = null;
let lastUnreachable = false;

async function loadRegistry(signal?: AbortSignal): Promise<SystemRegistry | null> {
  if (cache) return cache;
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      const res = await signalFetch("/system/registry", { signal });
      if (!res.ok) {
        lastError = `registry ${res.status}`;
        return null;
      }
      const body = (await res.json()) as SystemRegistry;
      cache = body;
      lastError = null;
      lastUnreachable = false;
      return body;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return null;
      if (isBackendUnreachable(err)) {
        lastUnreachable = true;
        lastError = err.message;
        return null;
      }
      lastError = err instanceof Error ? err.message : String(err);
      return null;
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
}

export function useRegistry(): RegistryState {
  const [state, setState] = useState<RegistryState>(() =>
    cache ? { status: "ready", data: cache } : { status: "loading" },
  );

  useEffect(() => {
    if (cache) {
      setState({ status: "ready", data: cache });
      return;
    }
    const ac = new AbortController();
    loadRegistry(ac.signal).then((data) => {
      if (ac.signal.aborted) return;
      if (data) {
        setState({ status: "ready", data });
      } else if (lastUnreachable) {
        setState({ status: "unreachable" });
      } else {
        setState({ status: "error", message: lastError ?? "unknown" });
      }
    });
    return () => ac.abort();
  }, []);

  return state;
}
