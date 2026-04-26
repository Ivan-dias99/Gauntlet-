import { useEffect, useState } from "react";
import { signalFetch, isBackendUnreachable } from "../lib/signalApi";

// Honest readiness surface for the shell.
//
//   ready_real   — /health/ready returned 200; engine ready, real provider,
//                  no persistence quarantine.
//   mock         — backend reachable but running canned responses
//                  (SIGNAL_MOCK=1); answers are not real.
//   degraded     — backend reachable but unsafe to trust: engine not
//                  initialised, persistence quarantined, or a load error.
//   unreachable  — no backend response at all (edge dead, CORS, offline).
//
// The previous version polled /health (liveness — always 200) and
// surfaced a "live" state purely from intent. /health/ready is the only
// honest yes/no.

export type BackendReadiness = "ready_real" | "mock" | "degraded" | "unreachable";

export interface BackendStatus {
  readiness: BackendReadiness;
  reasons: string[];
  mode: "mock" | "real" | null;
  engine: "ready" | "not_initialized" | null;
  loadErrors: Array<{ store: string; error: string }>;
}

const INITIAL: BackendStatus = {
  readiness: "unreachable",
  reasons: [],
  mode: null,
  engine: null,
  loadErrors: [],
};

interface ReadyBody {
  ready?: boolean;
  reasons?: string[];
  engine?: "ready" | "not_initialized";
  mode?: "mock" | "real";
  load_errors?: Array<{ store: string; error: string }>;
}

function classify(body: ReadyBody | null, status: number): BackendReadiness {
  if (!body) return "unreachable";
  if (body.ready) return "ready_real";
  const reasons = body.reasons ?? [];
  if (reasons.includes("mock_mode") && reasons.length === 1) return "mock";
  if (reasons.length === 0 && status === 200) return "ready_real";
  return "degraded";
}

export function useBackendStatus(): BackendStatus {
  const [status, setStatus] = useState<BackendStatus>(INITIAL);

  useEffect(() => {
    const ac = new AbortController();
    let cancelled = false;

    async function probe() {
      try {
        // /health/ready returns 200 when truly ready, 503 with the same
        // body shape otherwise. Both paths are informational.
        const res = await signalFetch("/health/ready", { signal: ac.signal });
        let body: ReadyBody | null = null;
        try {
          body = (await res.clone().json()) as ReadyBody;
        } catch {
          // FastAPI wraps 503 bodies under `detail`.
          try {
            const wrapped = (await res.json()) as { detail?: ReadyBody };
            body = wrapped?.detail ?? null;
          } catch {
            body = null;
          }
        }
        if (cancelled) return;
        setStatus({
          readiness: classify(body, res.status),
          reasons: body?.reasons ?? [],
          mode: body?.mode ?? null,
          engine: body?.engine ?? null,
          loadErrors: body?.load_errors ?? [],
        });
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (cancelled) return;
        if (isBackendUnreachable(e)) {
          setStatus({ ...INITIAL, readiness: "unreachable" });
          return;
        }
        // Anything else: treat as degraded so the UI doesn't claim live.
        setStatus({ ...INITIAL, readiness: "degraded", reasons: ["probe_failed"] });
      }
    }

    probe();
    const id = window.setInterval(probe, 30_000);
    return () => {
      cancelled = true;
      ac.abort();
      window.clearInterval(id);
    };
  }, []);

  return status;
}
