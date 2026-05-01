// Wave P-14 — Observability snapshot dashboard.
//
// Wave I (#228) shipped the in-process metrics ring; PR #229 wired
// observability.start/end into the engine and exposed
// /observability/snapshot. The schema + endpoint were live in main
// but no surface rendered them. Operators had to hit the URL
// directly with curl.
//
// Polls /observability/snapshot every 5 seconds and renders the
// per-route table (count / errors / error_rate / p50 / p95 / max /
// in_flight) so the operator can see triage signals at a glance
// without DevTools.
//
// Wave P-36 — error / loading / empty paths migrated to the shared
// state primitives. Raw `(e as Error).message` is gone; the panel
// branches on a typed FetchError so backend-unreachable lands in the
// dedicated banner with cause+fix copy and a retry button.

import { useEffect, useState } from "react";
import {
  signalFetch,
  isBackendUnreachable,
  BackendUnreachableError,
} from "../../lib/signalApi";
import {
  BackendUnreachableState,
  EmptyState,
  ErrorState,
  SkeletonPanel,
} from "../../shell/states";

interface RouteStats {
  count: number;
  errors: number;
  error_rate: number;
  p50_ms: number;
  p95_ms: number;
  max_ms: number;
  in_flight: number;
  error_kinds?: Record<string, number>;
}

interface Snapshot {
  ring_size: number;
  routes: Record<string, RouteStats>;
  captured_at: number;
}

const POLL_INTERVAL_MS = 5000;

// Wave P-36 — typed bucket so the UI can pick the right state primitive
// (BackendUnreachableState vs ErrorState) instead of formatting the
// message inline.
type FetchError =
  | { kind: "unreachable"; error: BackendUnreachableError }
  | { kind: "http"; status: number }
  | { kind: "other"; message: string };

export default function ObservabilityPanel() {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [err, setErr] = useState<FetchError | null>(null);
  const [pending, setPending] = useState(false);
  // Bumped by the retry button to re-trigger the polling effect on demand.
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const ac = new AbortController();
    // Codex round-2 (#254): recursive setTimeout instead of setInterval
    // so we never overlap an in-flight /observability/snapshot fetch.
    // A slow backend would otherwise stack concurrent requests and let
    // an older response overwrite a newer one (out-of-order regression).
    async function fetchOnce() {
      if (!alive) return;
      setPending(true);
      try {
        const res = await signalFetch("/observability/snapshot", { signal: ac.signal });
        if (!res.ok) {
          if (alive) setErr({ kind: "http", status: res.status });
          return;
        }
        const body = (await res.json()) as Snapshot;
        if (!alive) return;
        setSnap(body);
        setErr(null);
      } catch (e) {
        if (!alive) return;
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (isBackendUnreachable(e)) {
          setErr({ kind: "unreachable", error: e });
        } else {
          const message = e instanceof Error ? e.message : String(e);
          setErr({ kind: "other", message });
        }
      } finally {
        if (alive) setPending(false);
        if (alive) timer = setTimeout(fetchOnce, POLL_INTERVAL_MS);
      }
    }
    void fetchOnce();
    return () => {
      alive = false;
      if (timer !== null) clearTimeout(timer);
      ac.abort();
    };
  }, [retryNonce]);

  const retry = () => setRetryNonce((n) => n + 1);
  const routes = snap ? Object.entries(snap.routes) : [];

  return (
    <section
      data-observability-panel
      style={{
        margin: "var(--space-3) 0",
        padding: "var(--space-3)",
        borderRadius: 6,
        border: "1px solid currentColor",
        opacity: 0.92,
      }}
      aria-label="observability"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontWeight: 600,
            fontSize: "0.8em",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          observability · ring
        </span>
        <span style={{ fontSize: "0.75em", opacity: 0.6 }}>
          {pending && !snap ? "" : ""}
          {snap && `actualizado às ${new Date(snap.captured_at * 1000).toLocaleTimeString()}`}
        </span>
      </div>
      {/* Wave P-36 — error / loading / empty states via state primitives. */}
      {err?.kind === "unreachable" && (
        <BackendUnreachableState
          error={err.error}
          severity="banner"
          onRetry={retry}
          style={{ marginBottom: "var(--space-2)" }}
        />
      )}
      {err?.kind === "http" && (
        <ErrorState
          severity="banner"
          title="observability"
          message={`Backend devolveu HTTP ${err.status}.`}
          onRetry={retry}
          style={{ marginBottom: "var(--space-2)" }}
        />
      )}
      {err?.kind === "other" && (
        <ErrorState
          severity="banner"
          title="observability"
          message="Falha a ler a snapshot do anel."
          detail={err.message}
          onRetry={retry}
          style={{ marginBottom: "var(--space-2)" }}
        />
      )}
      {snap === null && !err && (
        <SkeletonPanel bodyLines={4} ariaLabel="a ler primeira amostra do anel" />
      )}
      {routes.length === 0 && snap && (
        <EmptyState
          glyph="·"
          message="nenhuma rota registou tráfego no anel ainda"
        />
      )}
      {routes.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "var(--mono)",
            fontSize: "0.8em",
          }}
        >
          <thead>
            <tr style={{ opacity: 0.6, textAlign: "right" }}>
              <th style={{ textAlign: "left", padding: "2px 4px" }}>route</th>
              <th style={cellHead}>n</th>
              <th style={cellHead}>err</th>
              <th style={cellHead}>err%</th>
              <th style={cellHead}>p50</th>
              <th style={cellHead}>p95</th>
              <th style={cellHead}>max</th>
              <th style={cellHead}>inflight</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(([route, s]) => (
              <tr key={route} data-route={route}>
                <td style={{ padding: "2px 4px" }}>{route}</td>
                <td style={cell}>{s.count}</td>
                <td style={{ ...cell, color: s.errors > 0 ? "var(--cc-err, currentColor)" : undefined }}>
                  {s.errors}
                </td>
                <td style={cell}>{(s.error_rate * 100).toFixed(1)}%</td>
                <td style={cell}>{s.p50_ms}</td>
                <td style={cell}>{s.p95_ms}</td>
                <td style={cell}>{s.max_ms}</td>
                <td style={{ ...cell, opacity: s.in_flight > 0 ? 1 : 0.4 }}>{s.in_flight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

const cellHead: React.CSSProperties = {
  textAlign: "right",
  padding: "2px 4px",
  fontWeight: 400,
};

const cell: React.CSSProperties = {
  textAlign: "right",
  padding: "2px 4px",
  fontVariantNumeric: "tabular-nums",
};
