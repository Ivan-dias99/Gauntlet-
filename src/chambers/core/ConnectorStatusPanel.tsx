// Wave P-12 — Connector status panel.
//
// The Signal doctrine map names 10 inevitable connectors (GitHub,
// Vercel, Railway, Database, Web/Research, Model Gateway, Browser
// Runtime, Design Source, Issue Tracker, Observability). Foundations
// + integrations have shipped most of them; what was missing was a
// surface that tells the operator at a glance which are wired vs
// dormant.
//
// v1 reads the live endpoints we already expose (/health,
// /observability/snapshot, /gateway/summary) and tags each connector
// with a tone (ok / warn / danger / ghost). Static-known connectors
// (GitHub MCP, Browser Runtime) carry a hard-coded label that
// future probes can replace.

import { useEffect, useState } from "react";
import { signalFetch, isBackendUnreachable } from "../../lib/signalApi";

type Tone = "ok" | "warn" | "danger" | "ghost";

interface Row {
  key: string;
  label: string;
  // Effective state at probe time.
  tone: Tone;
  status: string;
  // Static description of what this connector resolves.
  resolves: string;
}

const STATIC_BASE: Array<Pick<Row, "key" | "label" | "resolves">> = [
  { key: "github",       label: "GitHub",        resolves: "code, branches, commits, PRs, diffs, issues" },
  { key: "vercel",       label: "Vercel",        resolves: "preview, deploy, build logs, visual validation" },
  { key: "railway",      label: "Railway",       resolves: "backend Python runtime, env, logs, volume" },
  { key: "database",     label: "Database",      resolves: "missions, artefacts, runs, versions" },
  { key: "web",          label: "Web/Research",  resolves: "external search + URL fetch" },
  { key: "gateway",      label: "Model Gateway", resolves: "model routing, fallback, cost ledger" },
  { key: "browser",      label: "Browser Runtime", resolves: "iframe preview, screenshot, select-element" },
  { key: "design",       label: "Design Source", resolves: "Figma tokens import" },
  { key: "issues",       label: "Issue Tracker", resolves: "GitHub/Linear issue drafts" },
  { key: "observability", label: "Observability", resolves: "per-route p50/p95/error metrics ring" },
];

interface HealthBody {
  engine?: string;
  mode?: string;
  persistence_ephemeral?: boolean;
  persistence_degraded?: boolean;
}

interface GatewaySummary {
  total_calls?: number;
  failure_count?: number;
  total_cost_usd_estimate?: number;
}

interface ObservabilitySnapshot {
  routes?: Record<string, unknown>;
}

export default function ConnectorStatusPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loadedAt, setLoadedAt] = useState<number | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    void probe(ac.signal).then((next) => {
      if (ac.signal.aborted) return;
      setRows(next);
      setLoadedAt(Date.now());
    });
    return () => ac.abort();
  }, []);

  return (
    <section
      data-connector-status-panel
      style={{
        margin: "var(--space-3) 0",
        padding: "var(--space-3)",
        borderRadius: "var(--radius-md)",
        border: "1px solid currentColor",
        opacity: 0.92,
      }}
      aria-label="connector status"
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
          conectores
        </span>
        <span style={{ fontSize: "0.75em", opacity: 0.6 }}>
          {loadedAt
            ? `actualizado às ${new Date(loadedAt).toLocaleTimeString()}`
            : "a probar..."}
        </span>
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
        {(rows.length > 0 ? rows : STATIC_BASE.map(toLoading)).map((r) => (
          <li
            key={r.key}
            data-connector={r.key}
            data-tone={r.tone}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: "6px 8px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid currentColor",
              opacity: 0.85,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 600, fontSize: "0.85em" }}>{r.label}</span>
              <span
                data-status={r.tone}
                style={{
                  fontSize: "0.7em",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "1px 6px",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid currentColor",
                  opacity: 0.7,
                }}
              >
                {r.status}
              </span>
            </div>
            <span style={{ fontSize: "0.75em", opacity: 0.7 }}>{r.resolves}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function toLoading(base: Pick<Row, "key" | "label" | "resolves">): Row {
  return { ...base, tone: "ghost", status: "..." };
}

async function probe(signal: AbortSignal): Promise<Row[]> {
  // Run every probe in parallel; tolerate failures (we render "?"
  // rather than crash). Fetch values keep their original shape from
  // each endpoint so we don't couple this panel to a private API.
  const [health, observability, gateway] = await Promise.all([
    safeFetch<HealthBody>("/health", signal),
    safeFetch<ObservabilitySnapshot>("/observability/snapshot", signal),
    safeFetch<GatewaySummary>("/gateway/summary", signal),
  ]);

  const rows: Row[] = [];
  for (const base of STATIC_BASE) {
    rows.push(decide(base, { health, observability, gateway }));
  }
  return rows;
}

interface ProbeContext {
  health: HealthBody | null;
  observability: ObservabilitySnapshot | null;
  gateway: GatewaySummary | null;
}

function decide(
  base: Pick<Row, "key" | "label" | "resolves">,
  ctx: ProbeContext,
): Row {
  switch (base.key) {
    case "github":
      // No live probe yet — MCP is bound at the harness layer.
      return { ...base, tone: "ok", status: "wired (MCP)" };

    case "vercel":
      // The forwarder reaching the backend implies Vercel routed our
      // request — successful health probe is the live signal.
      return ctx.health
        ? { ...base, tone: "ok", status: "live" }
        : { ...base, tone: "danger", status: "unreachable" };

    case "railway":
      if (!ctx.health) return { ...base, tone: "danger", status: "unreachable" };
      if (ctx.health.engine === "ready") return { ...base, tone: "ok", status: "ready" };
      return { ...base, tone: "warn", status: ctx.health.engine ?? "?" };

    case "database":
      // Persistence flag from /health distinguishes mounted-volume
      // vs ephemeral (in-image filesystem wiped on restart).
      if (!ctx.health) return { ...base, tone: "ghost", status: "?" };
      if (ctx.health.persistence_ephemeral) return { ...base, tone: "warn", status: "ephemeral" };
      if (ctx.health.persistence_degraded) return { ...base, tone: "danger", status: "degraded" };
      return { ...base, tone: "ok", status: "persistent" };

    case "web":
      // No standalone probe; mocked vs live mode is the closest
      // signal until a connector-specific health endpoint lands.
      if (!ctx.health) return { ...base, tone: "ghost", status: "?" };
      if (ctx.health.mode === "mock") return { ...base, tone: "warn", status: "mock" };
      return { ...base, tone: "ok", status: "live" };

    case "gateway":
      if (!ctx.gateway) return { ...base, tone: "ghost", status: "no probe" };
      return {
        ...base, tone: "ok",
        status: `${ctx.gateway.total_calls ?? 0} calls`,
      };

    case "browser":
      // Wave L bridge + P-5 iframe runtime are in main; no live
      // probe yet — the iframe is mounted by the chamber that uses it.
      return { ...base, tone: "warn", status: "schema + bridge" };

    case "design":
      // /design/figma/import is reachable via the same backend; no
      // dedicated probe endpoint, so report "wired" when /health works.
      return ctx.health
        ? { ...base, tone: "ok", status: "wired" }
        : { ...base, tone: "danger", status: "unreachable" };

    case "issues":
      return ctx.health
        ? { ...base, tone: "ok", status: "wired" }
        : { ...base, tone: "danger", status: "unreachable" };

    case "observability": {
      if (!ctx.observability) return { ...base, tone: "ghost", status: "no probe" };
      const routes = ctx.observability.routes ?? {};
      const count = Object.keys(routes).length;
      return { ...base, tone: count > 0 ? "ok" : "warn", status: `${count} route${count === 1 ? "" : "s"}` };
    }

    default:
      return { ...base, tone: "ghost", status: "?" };
  }
}

async function safeFetch<T>(path: string, signal: AbortSignal): Promise<T | null> {
  try {
    const res = await signalFetch(path, { signal });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") return null;
    if (isBackendUnreachable(e)) return null;
    return null;
  }
}
