// Wave 2 — Route canvas. Read-only visualisation of the brain's
// roteamento: which tools are registered, which models the gateway has
// seen, and the live cost / call distribution. Source data:
//   - src/tools/registry.ts (TERMINAL_TOOLS, INSIGHT_TOOLS) — frontend
//     authoritative tool grammar.
//   - GET /gateway/summary — same endpoint Models page consumes; returns
//     by_model / by_role rolling counters since process start.
//
// No new backend endpoints. No mutation. Wave 2+ adds an interactive
// "preview routing decision" path; this wave is pure transparency.

import { useEffect, useState } from "react";
import { signalFetch, isBackendUnreachable } from "../../lib/signalApi";
import {
  TERMINAL_TOOLS,
  INSIGHT_TOOLS,
  type ToolDef,
  type ToolKind,
} from "../../tools/registry";
import Pill from "../../components/atoms/Pill";

interface RoleStats {
  calls?: number;
  input_tokens?: number;
  output_tokens?: number;
  cost_usd_estimate?: number;
  fallback_count?: number;
  failure_count?: number;
}

interface ModelStats extends RoleStats {
  provider?: string;
}

interface GatewaySummary {
  total_calls?: number;
  total_input_tokens?: number;
  total_output_tokens?: number;
  total_cost_usd_estimate?: number;
  fallback_count?: number;
  failure_count?: number;
  by_model?: Record<string, ModelStats>;
  by_role?: Record<string, RoleStats>;
}

const KIND_TONE: Record<ToolKind, "ok" | "warn" | "danger" | "ghost"> = {
  fs:  "ok",
  net: "ok",
  vcs: "warn",
  cmd: "danger",
};

const KIND_LABEL: Record<ToolKind, string> = {
  fs:  "filesystem",
  net: "network",
  vcs: "version-control",
  cmd: "shell · gated",
};

export default function RouteCanvas() {
  const [summary, setSummary] = useState<GatewaySummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await signalFetch("/gateway/summary");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = (await res.json()) as GatewaySummary;
        if (!cancelled) setSummary(body);
      } catch (err) {
        if (!cancelled) {
          setError(isBackendUnreachable(err) ? err.message : String(err));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Merge tools, keeping the first definition per name (TERMINAL is
  // canonical per registry.ts contract).
  const merged: ToolDef[] = (() => {
    const seen = new Set<string>();
    const out: ToolDef[] = [];
    for (const t of [...TERMINAL_TOOLS, ...INSIGHT_TOOLS]) {
      if (seen.has(t.name)) continue;
      seen.add(t.name);
      out.push(t);
    }
    return out;
  })();

  return (
    <section
      style={{
        background: "var(--bg-surface)",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-lg, 10px)",
        padding: "28px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        minHeight: 360,
      }}
      data-route-canvas
    >
      <header style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--serif)",
            fontWeight: 400,
            fontSize: 22,
            color: "var(--text-primary)",
          }}
        >
          Route Mode
        </h2>
        <Pill tone="ok">live</Pill>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)", letterSpacing: "var(--track-meta)" }}>
          read-only · /gateway/summary + tools registry
        </span>
      </header>

      <Section title="Tools registry" hint="frontend authoritative — TERMINAL + INSIGHT chambers">
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 8 }}>
          {merged.map((t) => (
            <ToolRow key={t.name} tool={t} />
          ))}
        </div>
      </Section>

      <Section title="Models seen" hint="rolling counters from process start">
        {error ? (
          <p style={{ margin: 0, color: "var(--danger, #d04a4a)", fontSize: 12 }}>
            {error}
          </p>
        ) : summary ? (
          <ModelsBlock summary={summary} />
        ) : (
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 12 }}>loading…</p>
        )}
      </Section>

      <Section title="Roles" hint="triad / judge / agent / surface call distribution">
        {summary?.by_role && Object.keys(summary.by_role).length > 0 ? (
          <RolesBlock rows={summary.by_role} />
        ) : (
          !error && (
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 12 }}>
              no role activity yet
            </p>
          )
        )}
      </Section>
    </section>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <header style={{ marginBottom: 8 }}>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--mono)",
            fontSize: "var(--t-meta)",
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
            color: "var(--text-primary)",
          }}
        >
          {title}
        </p>
        {hint && (
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--text-muted)" }}>{hint}</p>
        )}
      </header>
      {children}
    </div>
  );
}

function ToolRow({ tool }: { tool: ToolDef }) {
  return (
    <div
      style={{
        background: "var(--bg-elevated, #131316)",
        border: "var(--border-soft)",
        borderRadius: 6,
        padding: "8px 10px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-primary)" }}>
        {tool.name}
      </span>
      <Pill tone={KIND_TONE[tool.kind]}>{KIND_LABEL[tool.kind]}</Pill>
      {tool.gated && <Pill tone="warn">gated</Pill>}
      <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", textAlign: "right" }}>
        {tool.blurb}
      </span>
    </div>
  );
}

function ModelsBlock({ summary }: { summary: GatewaySummary }) {
  const rows = summary.by_model ?? {};
  const entries = Object.entries(rows);
  if (entries.length === 0) {
    return <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 12 }}>no calls yet</p>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {entries.map(([model, s]) => (
        <div
          key={model}
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)",
            gap: 8,
            padding: "8px 10px",
            background: "var(--bg-elevated, #131316)",
            borderRadius: 6,
            fontSize: 12,
            fontFamily: "var(--mono)",
            alignItems: "center",
          }}
        >
          <span style={{ color: "var(--text-primary)" }}>{model}</span>
          <span style={{ color: "var(--text-muted)" }}>{s.provider ?? "—"}</span>
          <span style={{ color: "var(--text-secondary, var(--text-muted))" }}>
            {s.calls ?? 0} calls
          </span>
          <span style={{ color: "var(--text-secondary, var(--text-muted))", textAlign: "right" }}>
            ${(s.cost_usd_estimate ?? 0).toFixed(4)}
          </span>
        </div>
      ))}
    </div>
  );
}

function RolesBlock({ rows }: { rows: Record<string, RoleStats> }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {Object.entries(rows).map(([role, s]) => (
        <div
          key={role}
          style={{
            background: "var(--bg-elevated, #131316)",
            border: "var(--border-soft)",
            borderRadius: 6,
            padding: "8px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: 120,
          }}
        >
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "var(--track-meta)", textTransform: "uppercase", color: "var(--text-muted)" }}>
            {role}
          </span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 18, color: "var(--text-primary)" }}>
            {s.calls ?? 0}
          </span>
          {(s.fallback_count ?? 0) > 0 && <Pill tone="warn">{s.fallback_count} fallback</Pill>}
          {(s.failure_count ?? 0) > 0 && <Pill tone="danger">{s.failure_count} failure</Pill>}
        </div>
      ))}
    </div>
  );
}
