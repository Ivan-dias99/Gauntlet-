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
  persistenceEphemeral: boolean;
  engine: "ready" | "not_initialized" | null;
  readiness: "ready" | "degraded" | "unreachable";
  readinessReasons: string[];
  // Populated when reachable === false. Names the forwarder failure mode:
  // "backend_url_not_configured" (Vercel env missing), "network_error",
  // "timeout", "upstream_fetch_failed", or the raw network message. Lets
  // the chip render the actionable cause instead of "unreachable".
  unreachableReason: string | null;
  // Edge-runtime error text when the reason is the catch-all bucket
  // ("upstream_fetch_failed"). Surfaces the literal cause (forbidden
  // header, TLS error, malformed URL) into the chip tooltip.
  unreachableDetail: string | null;
}

const INITIAL: BackendStatus = {
  reachable: true,
  mode: null,
  persistenceDegraded: false,
  persistenceEphemeral: false,
  engine: null,
  readiness: "degraded",
  readinessReasons: [],
  unreachableReason: null,
  unreachableDetail: null,
};

interface HealthBody {
  status?: string;
  engine?: "ready" | "not_initialized";
  mode?: "mock" | "real";
  persistence_degraded?: boolean;
  persistence_ephemeral?: boolean;
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
        let readiness: BackendStatus["readiness"] = "degraded";
        let readinessReasons: string[] = [];
        try {
          const readyRes = await signalFetch("/health/ready", { signal: ac.signal });
          if (readyRes.ok) {
            readiness = "ready";
          } else {
            readiness = "degraded";
            const raw = await readyRes.json() as {
              detail?: { reasons?: string[] };
              reasons?: string[];
            };
            readinessReasons = raw.detail?.reasons ?? raw.reasons ?? [];
          }
        } catch (readyErr) {
          if (isBackendUnreachable(readyErr)) {
            setStatus({
              ...INITIAL,
              reachable: false,
              readiness: "unreachable",
              unreachableReason: readyErr.reason,
              unreachableDetail: readyErr.detail,
            });
            return;
          }
        }
        setStatus({
          reachable: true,
          mode: body.mode ?? null,
          persistenceDegraded: !!body.persistence_degraded,
          persistenceEphemeral: !!body.persistence_ephemeral,
          engine: body.engine ?? null,
          readiness,
          readinessReasons,
          unreachableReason: null,
          unreachableDetail: null,
        });
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (isBackendUnreachable(e)) {
          setStatus({
            ...INITIAL,
            reachable: false,
            readiness: "unreachable",
            unreachableReason: e.reason,
            unreachableDetail: e.detail,
          });
          return;
        }
        setStatus({ ...INITIAL, reachable: true });
      }
    })();
    return () => ac.abort();
  }, []);

  return status;
}
