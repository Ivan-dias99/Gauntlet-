import { useEffect, useState } from "react";
import { signalFetch, isBackendUnreachable } from "../lib/signalApi";

// Backend-owned registry of every tool the agent can dispatch. The previous
// hardcoded TS lists in Permissions.tsx and ExecutionComposer.tsx drifted
// from server.py (web_fetch vs fetch_url, missing package_info, count off
// by one). This hook is the single source of truth on the frontend.

export interface SignalToolDescriptor {
  name: string;
  kind: "filesystem" | "vcs" | "network" | "process" | "other";
  gated: boolean;
  description?: string;
  chambers: string[];
}

export interface SignalDoctrineEntry {
  id: string;
  title: string;
  summary: string;
  anchor: string;
}

export interface SignalDiagnostics {
  system: string;
  model: string;
  triad_temperature: number;
  judge_temperature: number;
  triad_count: number;
  engine_status: "ready" | "not_initialized";
  boot: {
    mode: "mock" | "real";
    anthropic_api_key_present: boolean;
    allow_code_exec: boolean;
    allowed_origins: string[];
    data_dir: string;
    host: string;
    port: number;
    uptime_seconds: number;
    start_iso: string;
  };
  tools: SignalToolDescriptor[];
  system_doctrine: SignalDoctrineEntry[];
  failure_memory: {
    total_records: number;
    total_failures: number;
    last_updated: string;
    top_repeat_offenders: Array<{ question: string; times_failed: number }>;
  };
  persistence: Record<string, string | null>;
}

export type DiagnosticsState =
  | { status: "loading"; data: null; error: null }
  | { status: "ok"; data: SignalDiagnostics; error: null }
  | { status: "unreachable"; data: null; error: string }
  | { status: "error"; data: null; error: string };

export function useDiagnostics(): DiagnosticsState {
  const [state, setState] = useState<DiagnosticsState>({
    status: "loading",
    data: null,
    error: null,
  });

  useEffect(() => {
    const ac = new AbortController();
    let cancelled = false;
    (async () => {
      try {
        const res = await signalFetch("/diagnostics", { signal: ac.signal });
        if (!res.ok) {
          if (!cancelled) {
            setState({
              status: "error",
              data: null,
              error: `diagnostics ${res.status}`,
            });
          }
          return;
        }
        const body = (await res.json()) as SignalDiagnostics;
        if (!cancelled) setState({ status: "ok", data: body, error: null });
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (cancelled) return;
        if (isBackendUnreachable(e)) {
          setState({
            status: "unreachable",
            data: null,
            error: "backend inacessível",
          });
          return;
        }
        setState({
          status: "error",
          data: null,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    })();
    return () => {
      cancelled = true;
      ac.abort();
    };
  }, []);

  return state;
}
