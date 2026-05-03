import { useCallback, useEffect, useMemo, useState } from "react";
import { signalFetch, isBackendUnreachable } from "../lib/signalApi";
import { Panel, SurfaceHeader } from "./ControlLayout";
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
        if (
          !r.question.toLowerCase().includes(q) &&
          !(r.context ?? "").toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [runs, routeFilter, text]);

  return (
    <>
      <SurfaceHeader
        eyebrow="Ledger"
        title="Run provenance"
        subtitle="Every run that hit the engine — composer envelopes plus the underlying agent / triad rows."
        actions={
          <button
            type="button"
            onClick={() => void load()}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "var(--border-soft)",
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "var(--track-meta)",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            ↻ reload
          </button>
        }
      />

      {error && (
        <Panel>
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
            {error}
          </div>
        </Panel>
      )}

      <Panel title="Filters" hint={`${visible.length} of ${runs.length} record(s)`}>
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          {routes.map((r) => {
            const active = routeFilter === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRouteFilter(r)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: active
                    ? "1px solid color-mix(in oklab, var(--ember) 50%, var(--border-color-mid))"
                    : "var(--border-soft)",
                  background: active
                    ? "color-mix(in oklab, var(--ember) 10%, var(--bg-elevated))"
                    : "var(--bg-elevated)",
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  letterSpacing: "var(--track-meta)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 180ms var(--motion-easing-out)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {r}
              </button>
            );
          })}
        </div>
        <input
          type="search"
          placeholder="filter by question or context…"
          value={text}
          onChange={(ev) => setText(ev.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            background: "var(--bg-input)",
            border: "var(--border-soft)",
            color: "var(--text-primary)",
            fontFamily: "var(--mono)",
            fontSize: 12,
            outline: "none",
            transition: "border-color 200ms ease, box-shadow 200ms ease",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor =
              "color-mix(in oklab, var(--ember) 50%, var(--border-color-mid))";
            e.currentTarget.style.boxShadow =
              "0 0 0 1px color-mix(in oklab, var(--ember) 30%, transparent), 0 0 18px color-mix(in oklab, var(--ember) 15%, transparent)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "";
            e.currentTarget.style.boxShadow = "";
          }}
        />
      </Panel>

      <Panel title="Runs">
        {visible.length === 0 ? (
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 12,
              margin: 0,
              padding: "12px 0",
              fontFamily: "var(--mono)",
              letterSpacing: "var(--track-meta)",
              textTransform: "uppercase",
            }}
          >
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
              <tr style={{ textAlign: "left" }}>
                <Th>route</Th>
                <Th>timestamp</Th>
                <Th>question</Th>
                <Th align="right">tools</Th>
                <Th align="right">ms</Th>
                <Th>state</Th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => {
                const active = selected?.id === r.id;
                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    style={{
                      borderTop: "var(--border-soft)",
                      cursor: "pointer",
                      background: active ? "var(--bg-elevated)" : "transparent",
                      transition: "background 140ms ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!active)
                        e.currentTarget.style.background =
                          "color-mix(in oklab, var(--text-primary) 3%, transparent)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Td>
                      <Pill tone={ROUTE_TONES[r.route] ?? "ghost"}>{r.route}</Pill>
                    </Td>
                    <Td>
                      <span style={{ color: "var(--text-muted)" }}>
                        {r.timestamp.slice(0, 19).replace("T", " ")}
                      </span>
                    </Td>
                    <Td>
                      <span
                        style={{
                          color: "var(--text-primary)",
                          fontFamily: "var(--sans)",
                          maxWidth: 360,
                          display: "inline-block",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          verticalAlign: "middle",
                        }}
                      >
                        {r.question.split("\n")[0]}
                      </span>
                    </Td>
                    <Td align="right">{r.tool_calls?.length ?? 0}</Td>
                    <Td align="right">{r.processing_time_ms ?? 0}</Td>
                    <Td>
                      {r.refused ? (
                        <Pill tone="warn">refused</Pill>
                      ) : r.terminated_early ? (
                        <Pill tone="warn">early</Pill>
                      ) : (
                        <Pill tone="ok">ok</Pill>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Panel>

      {selected && (
        <Panel title="Run detail" hint={selected.id}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <DetailStat label="route" value={selected.route} />
            <DetailStat label="iterations" value={String(selected.iterations ?? "—")} />
            <DetailStat
              label="tokens"
              value={`${selected.input_tokens ?? 0} / ${selected.output_tokens ?? 0}`}
            />
            <DetailStat label="latency" value={`${selected.processing_time_ms ?? 0} ms`} />
            <DetailStat label="confidence" value={selected.confidence ?? "—"} />
            <DetailStat label="mission" value={selected.mission_id ?? "—"} />
            <DetailStat
              label="refused"
              value={selected.refused ? "true" : "false"}
              tone={selected.refused ? "warn" : "ok"}
            />
            <DetailStat
              label="terminated"
              value={selected.termination_reason ?? "—"}
            />
          </div>

          <DetailBlock kicker="question" body={selected.question} mono />
          {selected.context && <DetailBlock kicker="context" body={selected.context} mono dim />}
          {selected.answer && <DetailBlock kicker="answer" body={selected.answer} mono />}
        </Panel>
      )}
    </>
  );
}

function Th({
  children,
  align,
}: {
  children: React.ReactNode;
  align?: "right";
}) {
  return (
    <th
      style={{
        padding: "10px 12px",
        fontWeight: 500,
        fontSize: 10,
        letterSpacing: "var(--track-meta)",
        textTransform: "uppercase",
        textAlign: align ?? "left",
        color: "var(--text-muted)",
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align,
}: {
  children: React.ReactNode;
  align?: "right";
}) {
  return (
    <td
      style={{
        padding: "12px 12px",
        color: "var(--text-secondary)",
        textAlign: align ?? "left",
        verticalAlign: "middle",
      }}
    >
      {children}
    </td>
  );
}

function DetailStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "ok" | "warn";
}) {
  const accent =
    tone === "ok"
      ? "var(--cc-ok)"
      : tone === "warn"
      ? "var(--cc-warn)"
      : "var(--text-primary)";
  return (
    <div
      style={{
        padding: "10px 12px",
        background: "var(--bg-elevated)",
        border: "var(--border-soft)",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minWidth: 0,
      }}
    >
      <span className="gx-eyebrow">{label}</span>
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 13,
          color: accent,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function DetailBlock({
  kicker,
  body,
  mono,
  dim,
}: {
  kicker: string;
  body: string;
  mono?: boolean;
  dim?: boolean;
}) {
  return (
    <div style={{ marginTop: 16 }}>
      <span className="gx-eyebrow">{kicker}</span>
      <pre
        style={{
          margin: "8px 0 0",
          background: "var(--bg-sunken)",
          padding: "12px 14px",
          borderRadius: 8,
          color: dim ? "var(--text-secondary)" : "var(--text-primary)",
          fontFamily: mono ? "var(--mono)" : "var(--sans)",
          fontSize: 12,
          whiteSpace: "pre-wrap",
          maxHeight: 320,
          overflow: "auto",
          lineHeight: 1.55,
          border: "var(--border-soft)",
        }}
      >
        {body}
      </pre>
    </div>
  );
}
