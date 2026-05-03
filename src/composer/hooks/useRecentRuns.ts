// Fase 1 — Studio Idle hook for recent runs.
//
// Reads /runs?limit=N. Returns a typed slice of RunRecord with only the
// fields the Idle tiles render (timestamp, route, question, tool_calls).
// Backend-unreachable collapses to an empty list with `unreachable=true`
// so the tiles can render their honest empty state instead of throwing.

import { useEffect, useState } from "react";
import { signalFetch, isBackendUnreachable } from "../../lib/signalApi";

// Mirror of signal-backend/models.py::RunRecord (only fields the Studio
// tiles consume — adding more is fine, removing breaks the wire shape).
export interface StudioRun {
  id: string;
  timestamp: string;
  route: string;
  question: string;
  refused: boolean;
  processing_time_ms: number;
  tool_calls: Array<{ name?: string; input?: unknown }>;
}

interface RunsListResponse {
  count: number;
  records: StudioRun[];
}

export type RunsState =
  | { kind: "loading" }
  | { kind: "ready"; runs: StudioRun[] }
  | { kind: "unreachable"; reason: string }
  | { kind: "error"; message: string };

export function useRecentRuns(limit: number = 5): RunsState {
  const [state, setState] = useState<RunsState>({ kind: "loading" });

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await signalFetch(`/runs?limit=${limit}`, { signal: ac.signal });
        if (!res.ok) {
          setState({ kind: "error", message: `HTTP ${res.status}` });
          return;
        }
        const body = (await res.json()) as RunsListResponse;
        setState({ kind: "ready", runs: Array.isArray(body.records) ? body.records : [] });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (isBackendUnreachable(err)) {
          setState({ kind: "unreachable", reason: err.reason });
          return;
        }
        setState({ kind: "error", message: err instanceof Error ? err.message : String(err) });
      }
    })();
    return () => ac.abort();
  }, [limit]);

  return state;
}

// Aggregate distinct tool names from a run list, ordered by most-recent
// first (run order is already newest-first per /runs contract). Returns
// at most `cap` entries — tile design prefers a small set.
export function deriveLastUsedTools(runs: StudioRun[], cap: number = 6): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of runs) {
    for (const tc of r.tool_calls) {
      const name = typeof tc.name === "string" ? tc.name : null;
      if (!name || seen.has(name)) continue;
      seen.add(name);
      out.push(name);
      if (out.length >= cap) return out;
    }
  }
  return out;
}
