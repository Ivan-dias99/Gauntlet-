import { useCallback, useEffect, useState } from "react";
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

export interface UseBackendStatus extends BackendStatus {
  refresh: () => void;
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

// Staleness bound. The operator may toggle RUBERRA_MOCK or restart the
// pod mid-session; the previous per-mount hook at least re-fetched on
// chamber navigation, the current module-level cache would otherwise
// freeze forever. Refresh on natural triggers — focus, online, explicit
// refresh() — is safer than a timer but this TTL catches the case where
// the user stays on one chamber for an hour.
const STALE_AFTER_MS = 60_000;

// Module-level cache. Four chambers + the shell would otherwise each fire
// their own /health on mount. Cache the in-flight promise + the last
// settled status + the timestamp of the last settlement so every
// subscriber shares one round-trip per TTL window.
let cached: BackendStatus | null = null;
let cachedAt = 0;
let inflight: Promise<BackendStatus> | null = null;
const subscribers = new Set<(s: BackendStatus) => void>();

function publish(s: BackendStatus) {
  cached = s;
  cachedAt = Date.now();
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

function ensureFetch(force: boolean): void {
  if (inflight) return;
  const fresh = cached && Date.now() - cachedAt < STALE_AFTER_MS;
  if (!force && fresh) return;
  inflight = fetchStatus().then((s) => {
    publish(s);
    inflight = null;
    return s;
  });
}

export function useBackendStatus(): UseBackendStatus {
  const [status, setStatus] = useState<BackendStatus>(cached ?? INITIAL);

  useEffect(() => {
    subscribers.add(setStatus);
    if (cached) setStatus(cached);
    ensureFetch(false);

    // Re-check on focus + online transitions. These are the natural
    // moments when the operator's dashboard state might have changed
    // under us (tab returns from background, network reconnected).
    const onFocus = () => ensureFetch(false);
    const onOnline = () => ensureFetch(true);
    window.addEventListener("focus", onFocus);
    window.addEventListener("online", onOnline);
    return () => {
      subscribers.delete(setStatus);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  const refresh = useCallback(() => ensureFetch(true), []);

  return { ...status, refresh };
}
