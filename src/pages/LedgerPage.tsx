import { useCallback, useEffect, useMemo, useState } from "react";
import { signalFetch, isBackendUnreachable } from "../lib/signalApi";
import { Kv, Panel, SurfaceHeader } from "../composer/shell/StudioPrimitives";
import Pill from "../components/atoms/Pill";

interface RunRecord {
  id: string;
  timestamp: string;
  route: string;
  mission_id?: string | null;
  question: string;
  context?: string | null;
  answer?: string | null;
  refused?: boolean;
  confidence?: string | null;
  judge_reasoning?: string | null;
  tool_calls?: Array<{ name: string; ok?: boolean }>;
  iterations?: number | null;
  processing_time_ms?: number;
  input_tokens?: number;
  output_tokens?: number;
  terminated_early?: boolean;
  termination_reason?: string | null;
}

interface RunsList {
  count: number;
  records: RunRecord[];
}

const ROUTE_TONES: Record<string, "ok" | "warn" | "neutral" | "ghost"> = {
  composer: "ok",
  agent: "neutral",
  triad: "neutral",
  crew: "neutral",
  dev: "neutral",
};

export default function LedgerPage() {
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [routeFilter, setRouteFilter] = useState<string>("all");
  const [text, setText] = useState("");
  const [selected, setSelected] = useState<RunRecord | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await signalFetch("/runs?limit=200");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as RunsList;
      setRuns(body.records ?? []);
      setError(null);
    } catch (err) {
      setError(isBackendUnreachable(err) ? err.message : String(err));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const routes = useMemo(() => {
    const set = new Set<string>();
    runs.forEach((r) => set.add(r.route));
    return ["all", ...Array.from(set)];
  }, [runs]);

  const visible = useMemo(() => {
    return runs.filter((r) => {
      if (routeFilter !== "all" && r.route !== routeFilter) return false;
      if (text) {
        const q = text.toLowerCase();
        if (!r.question.toLowerCase().includes(q) && !(r.context ?? "").toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [runs, routeFilter, text]);

  return (
    <>
      <SurfaceHeader
        title="Ledger"
        subtitle="Every run that hit the engine — composer envelopes plus the underlying agent / triad rows."
        actions={
          <button
            type="button"
            onClick={() => void load()}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-sm, 4px)",
              border: "var(--border-soft)",
              background: "transparent",
              color: "var(--text-primary)",
              fontFamily: "var(--mono)",
              fontSize: 12,
              letterSpacing: "var(--track-meta)",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            reload
          </button>
        }
      />

      {error && (
        <Panel>
          <p style={{ color: "var(--danger, #d04a4a)", fontSize: 12, margin: 0 }}>{error}</p>
        </Panel>
      )}

      <Panel>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {routes.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRouteFilter(r)}
              style={{
                padding: "4px 10px",
                borderRadius: "var(--radius-sm, 4px)",
                border: routeFilter === r ? "1px solid var(--text-primary)" : "var(--border-soft)",
                background: routeFilter === r ? "var(--bg-elevated)" : "transparent",
                color: "var(--text-secondary)",
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: "var(--track-meta)",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {r}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="filter by question or context…"
          value={text}
          onChange={(ev) => setText(ev.target.value)}
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: "var(--radius-sm, 4px)",
            background: "var(--bg-input)",
            border: "var(--border-soft)",
            color: "var(--text-primary)",
            fontFamily: "var(--mono)",
            fontSize: 12,
          }}
        />
      </Panel>

      <Panel title="Runs" hint={`${visible.length} of ${runs.length} record(s)`}>
        {visible.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: 12, margin: 0 }}>
            {runs.length === 0 ? "no runs recorded yet" : "no matches for filter"}
          </p>
        ) : (
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
                <th style={{ padding: "6px 10px", fontWeight: 500 }}>route</th>
                <th style={{ padding: "6px 10px", fontWeight: 500 }}>timestamp</th>
                <th style={{ padding: "6px 10px", fontWeight: 500 }}>question</th>
                <th style={{ padding: "6px 10px", fontWeight: 500 }}>tools</th>
                <th style={{ padding: "6px 10px", fontWeight: 500 }}>ms</th>
                <th style={{ padding: "6px 10px", fontWeight: 500 }}>state</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r)}
                  style={{
                    borderTop: "var(--border-soft)",
                    cursor: "pointer",
                    background: selected?.id === r.id ? "var(--bg-elevated)" : "transparent",
                  }}
                >
                  <td style={{ padding: "8px 10px" }}>
                    <Pill tone={ROUTE_TONES[r.route] ?? "ghost"}>{r.route}</Pill>
                  </td>
                  <td style={{ padding: "8px 10px", color: "var(--text-muted)" }}>
                    {r.timestamp.slice(0, 19).replace("T", " ")}
                  </td>
                  <td
                    style={{
                      padding: "8px 10px",
                      color: "var(--text-primary)",
                      maxWidth: 360,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {r.question.split("\n")[0]}
                  </td>
                  <td style={{ padding: "8px 10px", color: "var(--text-secondary)" }}>
                    {r.tool_calls?.length ?? 0}
                  </td>
                  <td style={{ padding: "8px 10px", color: "var(--text-secondary)" }}>
                    {r.processing_time_ms ?? 0}
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    {r.refused
                      ? <Pill tone="warn">refused</Pill>
                      : r.terminated_early
                        ? <Pill tone="warn">early</Pill>
                        : <Pill tone="ok">ok</Pill>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      {selected && (
        <Panel title="Run detail" hint={selected.id}>
          <Kv
            rows={[
              ["route", selected.route],
              ["timestamp", selected.timestamp],
              ["mission_id", selected.mission_id ?? "—"],
              ["iterations", String(selected.iterations ?? "—")],
              [
                "tokens",
                `${selected.input_tokens ?? 0} in · ${selected.output_tokens ?? 0} out`,
              ],
              ["latency_ms", String(selected.processing_time_ms ?? 0)],
              ["confidence", selected.confidence ?? "—"],
              ["refused", selected.refused ? "true" : "false"],
              ["termination_reason", selected.termination_reason ?? "—"],
            ]}
          />
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: "var(--t-micro)",
                letterSpacing: "var(--track-meta)",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 6,
              }}
            >
              question
            </div>
            <pre
              style={{
                margin: 0,
                background: "var(--bg-sunken)",
                padding: "10px 12px",
                borderRadius: "var(--radius-sm, 4px)",
                color: "var(--text-primary)",
                fontFamily: "var(--mono)",
                fontSize: 12,
                whiteSpace: "pre-wrap",
                maxHeight: 200,
                overflow: "auto",
              }}
            >
              {selected.question}
            </pre>
          </div>
          {selected.context && (
            <div style={{ marginTop: 14 }}>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "var(--t-micro)",
                  letterSpacing: "var(--track-meta)",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: 6,
                }}
              >
                context
              </div>
              <pre
                style={{
                  margin: 0,
                  background: "var(--bg-sunken)",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm, 4px)",
                  color: "var(--text-secondary)",
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  whiteSpace: "pre-wrap",
                  maxHeight: 200,
                  overflow: "auto",
                }}
              >
                {selected.context}
              </pre>
            </div>
          )}
          {selected.answer && (
            <div style={{ marginTop: 14 }}>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "var(--t-micro)",
                  letterSpacing: "var(--track-meta)",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: 6,
                }}
              >
                answer
              </div>
              <pre
                style={{
                  margin: 0,
                  background: "var(--bg-sunken)",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm, 4px)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  whiteSpace: "pre-wrap",
                  maxHeight: 320,
                  overflow: "auto",
                }}
              >
                {selected.answer}
              </pre>
            </div>
          )}
        </Panel>
      )}
    </>
  );
}
