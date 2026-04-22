import { useEffect, useState } from "react";
import { ruberraFetch, isBackendUnreachable } from "../lib/ruberraApi";

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

// Module-level cache. Four chambers + the shell would otherwise each fire
// their own /health on mount and re-mount, hammering the edge. Cache the
// in-flight promise + the last settled status so every subscriber shares
// one round-trip per page load. Subscribers are re-notified when the
// promise resolves.
let cached: BackendStatus | null = null;
let inflight: Promise<BackendStatus> | null = null;
const subscribers = new Set<(s: BackendStatus) => void>();

function publish(s: BackendStatus) {
  cached = s;
  subscribers.forEach((cb) => cb(s));
}

async function fetchStatus(): Promise<BackendStatus> {
  try {
    const res = await ruberraFetch("/health");
    if (!res.ok) {
      return { ...INITIAL, reachable: true, engine: "not_initialized" };
    }
    const body = (await res.json()) as HealthBody;
    return {
      reachable: true,
      mode: body.mode ?? null,
      persistenceDegraded: !!body.persistence_degraded,
      engine: body.engine ?? null,
    };
  } catch (e) {
    if (isBackendUnreachable(e)) return { ...INITIAL, reachable: false };
    return { ...INITIAL, reachable: true };
  }
}

export function useBackendStatus(): BackendStatus {
  const [status, setStatus] = useState<BackendStatus>(cached ?? INITIAL);

  useEffect(() => {
    subscribers.add(setStatus);
    if (cached) setStatus(cached);
    if (!inflight) {
      inflight = fetchStatus().then((s) => {
        publish(s);
        inflight = null;
        return s;
      });
    }
    return () => {
      subscribers.delete(setStatus);
    };
  }, []);

  return status;
}
