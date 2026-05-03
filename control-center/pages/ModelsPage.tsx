import { useEffect, useState } from "react";
import { signalFetch, isBackendUnreachable } from "../lib/signalApi";
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
        const res = await signalFetch("/gateway/summary");
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
        title="Models"
        subtitle="Live routing + cost summary from the gateway. Read-only in V0."
      />

      {error && (
        <Panel title="Error">
          <p style={{ color: "var(--danger, #d04a4a)", fontSize: 12, margin: 0 }}>{error}</p>
        </Panel>
      )}

      <Panel title="Totals" hint="rolling counters since process start">
        {data ? (
          <div style={{ display: "flex", gap: 24, fontSize: 13, flexWrap: "wrap" }}>
            <Metric label="calls" value={String(data.total_calls ?? 0)} />
            <Metric
              label="input tok"
              value={String(data.total_input_tokens ?? 0)}
            />
            <Metric
              label="output tok"
              value={String(data.total_output_tokens ?? 0)}
            />
            <Metric
              label="cost (usd est)"
              value={(data.total_cost_usd_estimate ?? 0).toFixed(4)}
            />
            <Metric label="fallbacks" value={String(data.fallback_count ?? 0)} />
            <Metric label="failures" value={String(data.failure_count ?? 0)} />
          </div>
        ) : (
          !error && <p style={{ color: "var(--text-muted)", fontSize: 12 }}>loading…</p>
        )}
      </Panel>

      <Panel title="By role" hint="triad / judge / agent / surface call counts">
        {data?.by_role && Object.keys(data.by_role).length > 0 ? (
          <RoleTable rows={data.by_role} />
        ) : (
          !error && <p style={{ color: "var(--text-muted)", fontSize: 12, margin: 0 }}>no role activity yet</p>
        )}
      </Panel>

      <Panel title="By model" hint="actual model_id × call distribution">
        {data?.by_model && Object.keys(data.by_model).length > 0 ? (
          <ModelTable rows={data.by_model} />
        ) : (
          !error && <p style={{ color: "var(--text-muted)", fontSize: 12, margin: 0 }}>no calls yet</p>
        )}
      </Panel>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: "var(--t-micro)",
          letterSpacing: "var(--track-meta)",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 22, color: "var(--text-primary)", fontFamily: "var(--mono)" }}>
        {value}
      </div>
    </div>
  );
}

function RoleTable({ rows }: { rows: Record<string, RoleStats> }) {
  return (
    <table style={tableStyle}>
      <thead>
        <tr style={{ color: "var(--text-muted)", textAlign: "left" }}>
          <Th>role</Th>
          <Th>calls</Th>
          <Th>in tok</Th>
          <Th>out tok</Th>
          <Th>cost</Th>
          <Th>fallback</Th>
          <Th>failures</Th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(rows).map(([role, s]) => (
          <tr key={role} style={{ borderTop: "var(--border-soft)" }}>
            <Td><Pill tone="ghost">{role}</Pill></Td>
            <Td>{s.calls ?? 0}</Td>
            <Td>{s.input_tokens ?? 0}</Td>
            <Td>{s.output_tokens ?? 0}</Td>
            <Td>{(s.cost_usd_estimate ?? 0).toFixed(4)}</Td>
            <Td>{(s.fallback_count ?? 0) > 0 ? <Pill tone="warn">{s.fallback_count}</Pill> : "0"}</Td>
            <Td>{(s.failure_count ?? 0) > 0 ? <Pill tone="danger">{s.failure_count}</Pill> : "0"}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ModelTable({ rows }: { rows: Record<string, ModelStats> }) {
  return (
    <table style={tableStyle}>
      <thead>
        <tr style={{ color: "var(--text-muted)", textAlign: "left" }}>
          <Th>model</Th>
          <Th>provider</Th>
          <Th>calls</Th>
          <Th>in tok</Th>
          <Th>out tok</Th>
          <Th>cost</Th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(rows).map(([model, s]) => (
          <tr key={model} style={{ borderTop: "var(--border-soft)" }}>
            <Td>{model}</Td>
            <Td>{s.provider ?? "—"}</Td>
            <Td>{s.calls ?? 0}</Td>
            <Td>{s.input_tokens ?? 0}</Td>
            <Td>{s.output_tokens ?? 0}</Td>
            <Td>{(s.cost_usd_estimate ?? 0).toFixed(4)}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 12,
  fontFamily: "var(--mono)",
};

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ padding: "6px 10px", fontWeight: 500 }}>{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "8px 10px", color: "var(--text-secondary)" }}>{children}</td>;
}
