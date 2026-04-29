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

import { useEffect, useState } from "react";
import { signalFetch, isBackendUnreachable } from "../../lib/signalApi";

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

export default function ObservabilityPanel() {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let alive = true;
    const ac = new AbortController();
    async function fetchOnce() {
      if (!alive) return;
      setPending(true);
      try {
        const res = await signalFetch("/observability/snapshot", { signal: ac.signal });
        if (!res.ok) {
          if (alive) setErr(`HTTP ${res.status}`);
          return;
        }
        const body = (await res.json()) as Snapshot;
        if (!alive) return;
        setSnap(body);
        setErr(null);
      } catch (e) {
        if (!alive) return;
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (isBackendUnreachable(e)) setErr("backend unreachable");
        else setErr((e as Error).message);
      } finally {
        if (alive) setPending(false);
      }
    }
    void fetchOnce();
    const id = setInterval(fetchOnce, POLL_INTERVAL_MS);
    return () => {
      alive = false;
      clearInterval(id);
      ac.abort();
    };
  }, []);

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
          {pending && !snap ? "a probar..." : ""}
          {snap && `actualizado às ${new Date(snap.captured_at * 1000).toLocaleTimeString()}`}
          {err && <span data-tone="danger" style={{ marginLeft: 6 }}>{err}</span>}
        </span>
      </div>
      {snap === null && !err && (
        <div style={{ opacity: 0.6, fontStyle: "italic", fontSize: "0.85em" }}>
          a ler a primeira amostra do anel...
        </div>
      )}
      {routes.length === 0 && snap && (
        <div style={{ opacity: 0.6, fontStyle: "italic", fontSize: "0.85em" }}>
          nenhuma rota registou tráfego no anel ainda
        </div>
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
