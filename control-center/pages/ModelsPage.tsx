import { useEffect, useState } from "react";
import { gauntletFetch, isBackendUnreachable } from "../lib/gauntletApi";
import { Panel, SurfaceHeader } from "./ControlLayout";
import Pill from "../components/atoms/Pill";

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

export default function ModelsPage() {
  const [data, setData] = useState<GatewaySummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await gauntletFetch("/gateway/summary");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = (await res.json()) as GatewaySummary;
        if (!cancelled) setData(body);
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

  return (
    <>
      <SurfaceHeader
        eyebrow="Models"
        title="Gateway · routing & cost"
        subtitle="Live routing + cost summary from the multimodel gateway. Read-only in V0."
      />

      {error && <ErrorPanel msg={error} />}

      {/* Hero — total cost / calls */}
      <section
        className="gx-card"
        data-tone="hero"
        style={{
          marginBottom: 16,
          padding: "28px 30px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.4fr)",
          gap: 32,
          alignItems: "center",
        }}
      >
        <div>
          <span className="gx-eyebrow">total cost · estimate</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
            <span className="gx-metric">
              ${(data?.total_cost_usd_estimate ?? 0).toFixed(4)}
            </span>
            <span className="gx-metric-unit">usd · since boot</span>
          </div>
          <p
            style={{
              margin: "12px 0 0",
              color: "var(--text-secondary)",
              fontSize: 13,
              lineHeight: 1.55,
              maxWidth: 480,
            }}
          >
            {data
              ? `${data.total_calls ?? 0} calls processed · ${(data.fallback_count ?? 0)} fallback${(data.fallback_count ?? 0) === 1 ? "" : "s"} · ${(data.failure_count ?? 0)} failure${(data.failure_count ?? 0) === 1 ? "" : "s"}.`
              : "Awaiting first call. The gateway aggregates per-model and per-role stats once traffic flows."}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <StatTile
            label="calls"
            value={String(data?.total_calls ?? 0)}
            sub="across all routes"
          />
          <StatTile
            label="in tok"
            value={fmt(data?.total_input_tokens ?? 0)}
            sub="prompt sum"
          />
          <StatTile
            label="out tok"
            value={fmt(data?.total_output_tokens ?? 0)}
            sub="completion sum"
          />
          <StatTile
            label="errors"
            value={String((data?.fallback_count ?? 0) + (data?.failure_count ?? 0))}
            sub={`${data?.fallback_count ?? 0} fallback · ${data?.failure_count ?? 0} fail`}
            tone={(data?.failure_count ?? 0) > 0 ? "warn" : undefined}
          />
        </div>
      </section>

      <Panel title="By role" hint="triad / judge / agent — call counts and cost per role">
        {data?.by_role && Object.keys(data.by_role).length > 0 ? (
          <RoleDistribution rows={data.by_role} totalCalls={data.total_calls ?? 0} />
        ) : (
          !error && <Empty msg="no role activity yet" />
        )}
      </Panel>

      <Panel title="By model" hint="actual model_id × call distribution">
        {data?.by_model && Object.keys(data.by_model).length > 0 ? (
          <ModelTable rows={data.by_model} />
        ) : (
          !error && <Empty msg="no calls yet" />
        )}
      </Panel>
    </>
  );
}

function StatTile({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "warn" | "err";
}) {
  const accent =
    tone === "warn"
      ? "var(--cc-warn)"
      : tone === "err"
      ? "var(--cc-err)"
      : "var(--text-primary)";
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: 10,
        background: "var(--bg-elevated)",
        border: "var(--border-soft)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 9,
          letterSpacing: "var(--track-meta)",
          color: "var(--text-muted)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--serif)",
          fontSize: 24,
          fontWeight: 400,
          color: accent,
          lineHeight: 1,
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </span>
      {sub && (
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--text-muted)",
            marginTop: 2,
          }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}

function RoleDistribution({
  rows,
  totalCalls,
}: {
  rows: Record<string, RoleStats>;
  totalCalls: number;
}) {
  const max = Math.max(1, ...Object.values(rows).map((r) => r.calls ?? 0));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {Object.entries(rows).map(([role, s]) => {
        const calls = s.calls ?? 0;
        const pct = totalCalls > 0 ? (calls / totalCalls) * 100 : 0;
        const fillPct = (calls / max) * 100;
        return (
          <div key={role}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  color: "var(--text-primary)",
                  letterSpacing: "var(--track-meta)",
                  textTransform: "uppercase",
                }}
              >
                {role}
              </span>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--text-muted)",
                }}
              >
                {calls} calls · ${(s.cost_usd_estimate ?? 0).toFixed(4)}{" "}
                {totalCalls > 0 && `· ${pct.toFixed(0)}%`}
              </span>
            </div>
            <div className="gx-bar-track">
              <div
                className="gx-bar-fill"
                style={{
                  transform: `scaleX(${fillPct / 100})`,
                  transition: "transform 600ms var(--motion-easing-out)",
                }}
              />
            </div>
            {((s.fallback_count ?? 0) > 0 || (s.failure_count ?? 0) > 0) && (
              <div
                style={{
                  marginTop: 5,
                  display: "flex",
                  gap: 6,
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                }}
              >
                {(s.fallback_count ?? 0) > 0 && (
                  <Pill tone="warn">{s.fallback_count} fallback</Pill>
                )}
                {(s.failure_count ?? 0) > 0 && (
                  <Pill tone="danger">{s.failure_count} fail</Pill>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ModelTable({ rows }: { rows: Record<string, ModelStats> }) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: 12,
        fontFamily: "var(--mono)",
      }}
    >
      <thead>
        <tr style={{ color: "var(--text-muted)", textAlign: "left" }}>
          <Th>model</Th>
          <Th>provider</Th>
          <Th align="right">calls</Th>
          <Th align="right">in tok</Th>
          <Th align="right">out tok</Th>
          <Th align="right">cost</Th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(rows).map(([model, s]) => (
          <tr
            key={model}
            style={{ borderTop: "var(--border-soft)" }}
          >
            <Td>
              <code style={{ color: "var(--text-primary)" }}>{model}</code>
            </Td>
            <Td>
              <Pill tone="ghost">{s.provider ?? "—"}</Pill>
            </Td>
            <Td align="right">{s.calls ?? 0}</Td>
            <Td align="right">{fmt(s.input_tokens ?? 0)}</Td>
            <Td align="right">{fmt(s.output_tokens ?? 0)}</Td>
            <Td align="right">${(s.cost_usd_estimate ?? 0).toFixed(4)}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Th({ children, align }: { children: React.ReactNode; align?: "right" }) {
  return (
    <th
      style={{
        padding: "8px 12px",
        fontWeight: 500,
        fontSize: 10,
        letterSpacing: "var(--track-meta)",
        textTransform: "uppercase",
        textAlign: align ?? "left",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, align }: { children: React.ReactNode; align?: "right" }) {
  return (
    <td
      style={{
        padding: "10px 12px",
        color: "var(--text-secondary)",
        textAlign: align ?? "left",
      }}
    >
      {children}
    </td>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <p
      style={{
        margin: 0,
        padding: "16px 0",
        color: "var(--text-muted)",
        fontSize: 12,
        fontFamily: "var(--mono)",
        letterSpacing: "var(--track-meta)",
        textTransform: "uppercase",
      }}
    >
      {msg}
    </p>
  );
}

function ErrorPanel({ msg }: { msg: string }) {
  return (
    <Panel title="Error">
      <div
        style={{
          padding: "10px 12px",
          borderRadius: 6,
          background: "color-mix(in oklab, var(--cc-err) 8%, transparent)",
          border: "1px solid color-mix(in oklab, var(--cc-err) 28%, transparent)",
          color: "color-mix(in oklab, var(--cc-err) 86%, var(--text-primary))",
          fontFamily: "var(--mono)",
          fontSize: 12,
        }}
      >
        {msg}
      </div>
    </Panel>
  );
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}
