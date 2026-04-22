import { useEffect, useState } from "react";
import { signalFetch, isBackendUnreachable } from "../lib/signalApi";

// Honest surface for the two backend truths every chamber cares about:
//   - mode: "mock" | "real"  (is the brain running canned responses?)
//   - persistence_degraded    (did any store boot from a quarantined sidecar?)
//
// Reads /health, which returns 200 even when the engine is degraded —
// the body carries the real signal. A backend-unreachable throw collapses
// to `{reachable:false}` so chambers can render their dormant state
// without refetching on their own.

export interface BackendStatus {
  reachable: boolean;
  mode: "mock" | "real" | null;
  persistenceDegraded: boolean;
  engine: "ready" | "not_initialized" | null;
}

const INITIAL: BackendStatus = {
  reachable: true,
  mode: null,
  persistenceDegraded: false,
  engine: null,
};

interface HealthBody {
  status?: string;
  engine?: "ready" | "not_initialized";
  mode?: "mock" | "real";
  persistence_degraded?: boolean;
}

export function useBackendStatus(): BackendStatus {
  const [status, setStatus] = useState<BackendStatus>(INITIAL);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await signalFetch("/health", { signal: ac.signal });
        if (!res.ok) {
          setStatus({ ...INITIAL, reachable: true, engine: "not_initialized" });
          return;
        }
        const body = (await res.json()) as HealthBody;
        setStatus({
          reachable: true,
          mode: body.mode ?? null,
          persistenceDegraded: !!body.persistence_degraded,
          engine: body.engine ?? null,
        });
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (isBackendUnreachable(e)) {
          setStatus({ ...INITIAL, reachable: false });
          return;
        }
        setStatus({ ...INITIAL, reachable: true });
      }
    })();
    return () => ac.abort();
  }, []);

  return status;
}
