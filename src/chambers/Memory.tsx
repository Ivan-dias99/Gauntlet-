import { useEffect, useMemo, useState } from "react";
import { useSpine } from "../spine/SpineContext";
import { useTweaks } from "../tweaks/TweaksContext";
import { useCopy } from "../i18n/copy";

interface RunRecord {
  id: string;
  timestamp: string;
  route: string;
  mission_id: string | null;
  question: string;
  answer: string | null;
  refused: boolean;
  confidence: string | null;
  iterations: number | null;
  tool_calls: Array<{ name: string; ok: boolean }>;
  processing_time_ms: number;
  input_tokens: number;
  output_tokens: number;
  terminated_early: boolean;
  termination_reason: string | null;
}

interface RunsResponse {
  count: number;
  mission_id: string | null;
  records: RunRecord[];
}

interface ServerStats {
  total: number;
  mission_id: string | null;
  by_route: Record<string, number>;
  refused: number;
  refusal_rate: number;
  avg_latency_ms: number;
  total_input_tokens: number;
  total_output_tokens: number;
  tool_calls: number;
}

const ROUTE_COLOR: Record<string, string> = {
  agent: "var(--terminal-warn)",
  triad: "var(--accent)",
  dev: "var(--terminal-warn)",
  ask: "var(--accent)",
};

interface Stats {
  total: number;
  refused: number;
  refusalRate: number;
  avgLatencyMs: number;
  totalInput: number;
  totalOutput: number;
  toolCalls: number;
  byRoute: Record<string, number>;
}

function computeStats(runs: RunRecord[]): Stats {
  if (runs.length === 0) {
    return {
      total: 0, refused: 0, refusalRate: 0, avgLatencyMs: 0,
      totalInput: 0, totalOutput: 0, toolCalls: 0, byRoute: {},
    };
  }
  let refused = 0;
  let latencySum = 0;
  let totalInput = 0;
  let totalOutput = 0;
  let toolCalls = 0;
  const byRoute: Record<string, number> = {};
  for (const r of runs) {
    if (r.refused) refused++;
    latencySum += r.processing_time_ms ?? 0;
    totalInput += r.input_tokens ?? 0;
    totalOutput += r.output_tokens ?? 0;
    toolCalls += r.tool_calls?.length ?? 0;
    byRoute[r.route] = (byRoute[r.route] ?? 0) + 1;
  }
  return {
    total: runs.length,
    refused,
    refusalRate: refused / runs.length,
    avgLatencyMs: Math.round(latencySum / runs.length),
    totalInput,
    totalOutput,
    toolCalls,
    byRoute,
  };
}

type MemoryTab = "runs" | "evals";

export default function Memory() {
  const { activeMission } = useSpine();
  const { values } = useTweaks();
  const copy = useCopy();
  const layout = values.memoryLayout;
  const [tab, setTab] = useState<MemoryTab>("runs");
  const [runs, setRuns] = useState<RunRecord[] | null>(null);
  const [serverStats, setServerStats] = useState<ServerStats | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const fallbackStats = useMemo(() => computeStats(runs ?? []), [runs]);
  const stats: Stats = serverStats ? {
    total: serverStats.total,
    refused: serverStats.refused,
    refusalRate: serverStats.refusal_rate,
    avgLatencyMs: serverStats.avg_latency_ms,
    totalInput: serverStats.total_input_tokens,
    totalOutput: serverStats.total_output_tokens,
    toolCalls: serverStats.tool_calls,
    byRoute: serverStats.by_route,
  } : fallbackStats;

  useEffect(() => {
    if (!activeMission?.id) {
      setRuns([]);
      setServerStats(null);
      return;
    }
    setRuns(null);
    setServerStats(null);
    setErr(null);
    const ac = new AbortController();
    const mid = encodeURIComponent(activeMission.id);
    Promise.all([
      fetch(`/api/ruberra/runs?mission_id=${mid}&limit=100`, { signal: ac.signal })
        .then(async (r) => {
          if (!r.ok) throw new Error(`runs ${r.status}`);
          return (await r.json()) as RunsResponse;
        }),
      fetch(`/api/ruberra/runs/stats?mission_id=${mid}`, { signal: ac.signal })
        .then(async (r) => {
          if (!r.ok) throw new Error(`stats ${r.status}`);
          return (await r.json()) as ServerStats;
        }),
    ])
      .then(([runsData, statsData]) => {
        setRuns(runsData.records);
        setServerStats(statsData);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setErr(e.message ?? String(e));
      });
    return () => ac.abort();
  }, [activeMission?.id]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>

      <div style={{
        padding: "20px 40px 14px",
        borderBottom: "1px solid var(--border-subtle)",
      }}>
        <div style={{
          display: "flex", alignItems: "baseline", gap: 12,
        }}>
          <span style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-ghost)" }}>
            Memory
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Runs · Verdicts · Tool Trace
          </span>
          <div
            role="tablist"
            style={{
              display: "flex",
              border: "1px solid var(--border-subtle)",
              borderRadius: 999,
              overflow: "hidden",
              marginLeft: 12,
            }}
          >
            {(["runs", "evals"] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                style={{
                  background: tab === t ? "var(--accent-glow)" : "transparent",
                  border: "none",
                  color: tab === t ? "var(--accent)" : "var(--text-ghost)",
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  padding: "5px 12px",
                  cursor: "pointer",
                }}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === "runs" && stats.total > 0 && (
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-ghost)", fontFamily: "var(--mono)" }}>
              {renderRouteBreakdown(stats.byRoute)}
            </span>
          )}
        </div>

        {tab === "runs" && stats.total > 0 && (
          <div style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: 16,
            fontFamily: "var(--mono)",
            maxWidth: 820,
          }}>
            <StatCell label="runs" value={`${stats.total}`} />
            <StatCell
              label="refused"
              value={`${(stats.refusalRate * 100).toFixed(0)}%`}
              sub={`${stats.refused}/${stats.total}`}
              warn={stats.refusalRate >= 0.5}
            />
            <StatCell label="avg latency" value={`${stats.avgLatencyMs} ms`} />
            <StatCell
              label="tokens"
              value={formatTokens(stats.totalInput + stats.totalOutput)}
              sub={`${formatTokens(stats.totalInput)} in · ${formatTokens(stats.totalOutput)} out`}
            />
            <StatCell label="tool calls" value={`${stats.toolCalls}`} />
          </div>
        )}
      </div>

      <div style={{
        flex: 1, overflow: "auto",
        padding: "calc(24px * var(--density, 1)) calc(40px * var(--density, 1))",
        fontFamily: layout === "timeline" ? "var(--sans)" : "var(--mono)",
      }}>

        {tab === "evals" && <EvalsPanel />}
        {tab === "runs" && err && (
          <div style={{
            fontSize: 11, color: "var(--cc-err)",
            border: "1px solid var(--border-subtle)",
            borderLeft: "2px solid var(--cc-err)",
            padding: "10px 14px", maxWidth: 720,
            whiteSpace: "pre-wrap",
          }}>
            backend off? {err}
          </div>
        )}

        {tab === "runs" && runs === null && !err && (
          <div style={{ fontSize: 12, color: "var(--text-ghost)" }}>— a carregar —</div>
        )}

        {tab === "runs" && runs && runs.length === 0 && !err && (
          <div style={{ fontSize: 12, color: "var(--text-ghost)" }}>
            {copy.memoryEmpty}
          </div>
        )}

        {tab === "runs" && layout === "timeline" && runs && runs.length > 0 && (
          <div style={{ position: "relative", paddingLeft: 120, maxWidth: 760 }}>
            <div style={{
              position: "absolute", left: 80, top: 6, bottom: 6,
              width: 1, background: "var(--border-subtle)",
            }} />
            {runs.map((r, i) => {
              const color = ROUTE_COLOR[r.route] ?? "var(--text-muted)";
              return (
                <div
                  key={r.id}
                  className="fadeUp"
                  style={{
                    animationDelay: `${i * 16}ms`,
                    position: "relative",
                    marginBottom: 18,
                  }}
                >
                  <span style={{
                    position: "absolute", left: -46, top: 8,
                    width: 8, height: 8, borderRadius: "50%",
                    background: color, boxShadow: "0 0 0 3px var(--bg)",
                  }} />
                  <span style={{
                    position: "absolute", left: -120, top: 4, width: 62, textAlign: "right",
                    fontSize: 9, letterSpacing: 1.5,
                    color, fontFamily: "var(--mono)", textTransform: "uppercase",
                  }}>{r.route}</span>
                  <div style={{
                    fontSize: 13,
                    color: r.refused ? "var(--terminal-warn)" : "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}>
                    {r.refused ? "✗ " : ""}{r.question}
                  </div>
                  <div style={{
                    fontSize: 10, color: "var(--text-ghost)",
                    fontFamily: "var(--mono)", marginTop: 2,
                  }}>
                    {new Date(r.timestamp).toLocaleString([], {
                      hour: "2-digit", minute: "2-digit", second: "2-digit",
                    })} · {r.processing_time_ms}ms · {r.tool_calls.length} tools
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "runs" && layout === "log" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 820 }}>
          {runs?.map((r) => {
            const isOpen = expanded === r.id;
            return (
              <div key={r.id} style={{
                borderBottom: "1px solid var(--border-subtle)",
                padding: "10px 0",
              }}>
                <div
                  onClick={() => setExpanded(isOpen ? null : r.id)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "58px 1fr auto",
                    gap: "0 16px",
                    alignItems: "baseline",
                    cursor: "pointer",
                  }}
                >
                  <span style={{
                    fontSize: 9,
                    letterSpacing: 1.5,
                    color: ROUTE_COLOR[r.route] ?? "var(--text-muted)",
                    textTransform: "uppercase",
                  }}>
                    {r.route}
                  </span>
                  <span style={{
                    fontSize: 12,
                    color: r.refused ? "var(--terminal-warn)" : "var(--text-secondary)",
                    lineHeight: 1.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {r.refused ? "✗ " : ""}{r.question}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-ghost)", whiteSpace: "nowrap" }}>
                    {new Date(r.timestamp).toLocaleTimeString([], {
                      hour: "2-digit", minute: "2-digit", second: "2-digit",
                    })}
                  </span>
                </div>

                {isOpen && (
                  <div style={{
                    marginTop: 10, marginLeft: 74,
                    fontSize: 11, color: "var(--text-secondary)",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius)",
                    padding: "10px 14px",
                  }}>
                    <MetaRow label="confidence" value={r.confidence ?? "—"} />
                    <MetaRow label="iterations" value={r.iterations?.toString() ?? "—"} />
                    <MetaRow label="tools" value={`${r.tool_calls.length}`} />
                    <MetaRow
                      label="tokens"
                      value={`${r.input_tokens} in · ${r.output_tokens} out`}
                    />
                    <MetaRow label="latency" value={`${r.processing_time_ms} ms`} />
                    {r.terminated_early && (
                      <MetaRow label="terminated" value={r.termination_reason ?? "early"} />
                    )}
                    {r.tool_calls.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        {r.tool_calls.map((tc, i) => (
                          <div key={i} style={{ fontSize: 10, color: "var(--text-ghost)" }}>
                            <span style={{ color: tc.ok ? "var(--cc-ok)" : "var(--cc-err)" }}>
                              {tc.ok ? "✓" : "✗"}
                            </span>
                            {" "}{tc.name}
                          </div>
                        ))}
                      </div>
                    )}
                    {r.answer && (
                      <div style={{
                        marginTop: 10, padding: "8px 0 0",
                        borderTop: "1px solid var(--border-subtle)",
                        fontSize: 11, color: "var(--text-secondary)",
                        whiteSpace: "pre-wrap", lineHeight: 1.6,
                        fontFamily: "var(--sans)",
                      }}>
                        {r.answer}
                      </div>
                    )}
                    <FeedbackButtons run={r} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}

function FeedbackButtons({ run }: { run: RunRecord }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "err">("idle");
  const [detail, setDetail] = useState<string | null>(null);

  async function send(kind: "false_answer" | "false_refusal") {
    setState("sending");
    setDetail(null);
    try {
      const res = await fetch("/api/ruberra/evals/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ run_id: run.id, kind }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`${res.status}: ${body.slice(0, 120)}`);
      }
      const data = (await res.json()) as { case_id: string; duplicate: boolean };
      setState("done");
      setDetail(data.duplicate ? `already tracked · ${data.case_id}` : `added · ${data.case_id}`);
    } catch (e) {
      setState("err");
      setDetail(e instanceof Error ? e.message : String(e));
    }
  }

  const refused = run.refused;

  return (
    <div style={{
      marginTop: 10,
      paddingTop: 8,
      borderTop: "1px dashed var(--border-subtle)",
      display: "flex",
      gap: 8,
      alignItems: "center",
      flexWrap: "wrap",
    }}>
      <span style={{
        fontSize: 9,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        color: "var(--text-ghost)",
        fontFamily: "var(--mono)",
      }}>
        flag as eval
      </span>
      {!refused && (
        <button
          disabled={state === "sending" || state === "done"}
          onClick={() => send("false_answer")}
          style={{
            background: "transparent",
            border: "1px solid var(--cc-err)",
            color: "var(--cc-err)",
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            padding: "4px 10px",
            borderRadius: 999,
            cursor: state === "sending" || state === "done" ? "default" : "pointer",
            opacity: state === "sending" || state === "done" ? 0.5 : 1,
          }}
        >
          this answer was wrong
        </button>
      )}
      {refused && (
        <button
          disabled={state === "sending" || state === "done"}
          onClick={() => send("false_refusal")}
          style={{
            background: "transparent",
            border: "1px solid var(--terminal-warn)",
            color: "var(--terminal-warn)",
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            padding: "4px 10px",
            borderRadius: 999,
            cursor: state === "sending" || state === "done" ? "default" : "pointer",
            opacity: state === "sending" || state === "done" ? 0.5 : 1,
          }}
        >
          should not have refused
        </button>
      )}
      {detail && (
        <span style={{
          fontSize: 9,
          color: state === "err" ? "var(--cc-err)" : "var(--cc-ok)",
          fontFamily: "var(--mono)",
        }}>
          {detail}
        </span>
      )}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", fontSize: 10 }}>
      <span style={{ color: "var(--text-ghost)", letterSpacing: 1, textTransform: "uppercase" }}>{label}</span>
      <span style={{ color: "var(--text-muted)" }}>{value}</span>
    </div>
  );
}

function StatCell({
  label, value, sub, warn,
}: { label: string; value: string; sub?: string; warn?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
      <span style={{
        fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase",
        color: "var(--text-ghost)",
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 15,
        color: warn ? "var(--terminal-warn)" : "var(--text-primary)",
        lineHeight: 1.2,
      }}>
        {value}
      </span>
      {sub && (
        <span style={{ fontSize: 9, color: "var(--text-ghost)" }}>{sub}</span>
      )}
    </div>
  );
}

function renderRouteBreakdown(byRoute: Record<string, number>): string {
  const entries = Object.entries(byRoute);
  if (entries.length === 0) return "";
  return entries.map(([r, n]) => `${n} ${r}`).join(" · ");
}

function formatTokens(n: number): string {
  if (n < 1000) return `${n}`;
  if (n < 1_000_000) return `${(n / 1000).toFixed(1)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}


// ── Evals ───────────────────────────────────────────────────────────────────


interface EvalOutcome {
  id: string;
  category: string;
  expect: string;
  question: string;
  verdict: string;
  answered: boolean;
  refused: boolean;
  answer: string;
  elapsed_ms: number;
  error: string | null;
  input_tokens: number;
  output_tokens: number;
  route_path: string | null;
}

interface EvalSummary {
  timestamp: string;
  endpoint: string;
  backend: string;
  model: string | null;
  total: number;
  factual_total: number;
  bait_total: number;
  passed: number;
  false_answer: number;
  false_refusal: number;
  missing: number;
  errors: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_elapsed_ms: number;
  false_answer_rate: number;
  false_refusal_rate: number;
}

interface EvalLatest {
  available: boolean;
  summary?: EvalSummary;
  outcomes?: EvalOutcome[];
}

const VERDICT_COLOR: Record<string, string> = {
  pass: "var(--cc-ok)",
  false_answer: "var(--cc-err)",
  false_refusal: "var(--terminal-warn)",
  missing: "var(--cc-dim)",
  error: "var(--cc-err)",
};

function EvalsPanel() {
  const [latest, setLatest] = useState<EvalLatest | null>(null);
  const [baseline, setBaseline] = useState<EvalLatest | null>(null);
  const [history, setHistory] = useState<EvalSummary[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    Promise.all([
      fetch("/api/ruberra/evals/latest", { signal: ac.signal })
        .then((r) => r.json() as Promise<EvalLatest>),
      fetch("/api/ruberra/evals/latest?endpoint=baseline", { signal: ac.signal })
        .then((r) => r.json() as Promise<EvalLatest>),
      fetch("/api/ruberra/evals/history?limit=50", { signal: ac.signal })
        .then((r) => r.json() as Promise<{ rows: EvalSummary[] }>),
    ])
      .then(([l, b, h]) => {
        setLatest(l);
        setBaseline(b);
        setHistory(h.rows);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setErr(e.message ?? String(e));
      });
    return () => ac.abort();
  }, []);

  if (err) {
    return (
      <div style={{
        fontSize: 11, color: "var(--cc-err)",
        border: "1px solid var(--border-subtle)",
        borderLeft: "2px solid var(--cc-err)",
        padding: "10px 14px", maxWidth: 720,
      }}>
        evals unavailable: {err}
      </div>
    );
  }
  if (!latest) {
    return <div style={{ fontSize: 12, color: "var(--text-ghost)" }}>— a carregar evals —</div>;
  }
  if (!latest.available) {
    return (
      <div style={{ maxWidth: 640 }}>
        <div style={{
          fontSize: 10,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "var(--text-ghost)",
          marginBottom: 8,
          fontFamily: "var(--mono)",
        }}>
          Evals · sem runs ainda
        </div>
        <div style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontStyle: "italic",
          fontSize: 16,
          lineHeight: 1.5,
          color: "var(--text-muted)",
        }}>
          Nenhum eval corrido ainda. Corre <code
            style={{ fontFamily: "var(--mono)", background: "var(--bg-input)", padding: "1px 6px", borderRadius: 4 }}
          >python evals/run.py</code> no backend ou dispara o workflow no GitHub.
        </div>
      </div>
    );
  }

  const s = latest.summary!;
  const outcomes = latest.outcomes ?? [];
  const hardFail = s.false_answer > 0;

  return (
    <div style={{ maxWidth: 960, display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Headline KPI cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 12,
        fontFamily: "var(--mono)",
      }}>
        <KpiCard
          label="false_answer"
          value={`${s.false_answer}/${s.bait_total}`}
          sub={`${(s.false_answer_rate * 100).toFixed(0)}% · hallucination`}
          tone={hardFail ? "err" : "ok"}
        />
        <KpiCard
          label="false_refusal"
          value={`${s.false_refusal}/${s.factual_total}`}
          sub={`${(s.false_refusal_rate * 100).toFixed(0)}% · over-caution`}
          tone={s.false_refusal_rate > 0.4 ? "warn" : "ok"}
        />
        <KpiCard
          label="pass rate"
          value={`${s.total ? Math.round((s.passed / s.total) * 100) : 0}%`}
          sub={`${s.passed}/${s.total} cases`}
          tone={s.passed === s.total ? "ok" : "muted"}
        />
        <KpiCard
          label="tokens"
          value={formatTokens(s.total_input_tokens + s.total_output_tokens)}
          sub={`${formatTokens(s.total_input_tokens)} in · ${formatTokens(s.total_output_tokens)} out`}
        />
      </div>

      {/* Baseline delta — only shown when a baseline artifact exists */}
      {baseline?.available && baseline.summary && (
        <BaselineDelta primary={s} baseline={baseline.summary} />
      )}

      {/* Run meta */}
      <div style={{
        fontFamily: "var(--mono)",
        fontSize: 10,
        color: "var(--text-ghost)",
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
        letterSpacing: 1,
      }}>
        <span>endpoint · {s.endpoint}</span>
        <span>model · {s.model ?? "default"}</span>
        <span>elapsed · {(s.total_elapsed_ms / 1000).toFixed(1)}s</span>
        <span>
          {new Date(s.timestamp).toLocaleString([], {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit",
          })}
        </span>
      </div>

      {/* History spark — recent runs as a mini table */}
      {history && history.length > 1 && (
        <div style={{
          border: "1px solid var(--border-subtle)",
          borderRadius: 8,
          overflow: "hidden",
        }}>
          <div style={{
            fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
            color: "var(--text-ghost)",
            padding: "8px 12px",
            borderBottom: "1px solid var(--border-subtle)",
            fontFamily: "var(--mono)",
          }}>
            history · last {Math.min(history.length, 20)} runs
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "120px 60px 80px 80px 80px 1fr",
            fontFamily: "var(--mono)",
            fontSize: 10,
            background: "var(--bg-input)",
          }}>
            {["when", "route", "false_ans", "false_ref", "pass", "model"].map((h) => (
              <div key={h} style={{
                padding: "6px 10px",
                color: "var(--text-ghost)",
                letterSpacing: 1,
                textTransform: "uppercase",
                borderBottom: "1px solid var(--border-subtle)",
              }}>{h}</div>
            ))}
            {[...history].slice(-20).reverse().map((row, i) => (
              <>
                <div key={`w${i}`} style={{ padding: "4px 10px", color: "var(--text-muted)" }}>
                  {new Date(row.timestamp).toLocaleString([], {
                    month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
                  })}
                </div>
                <div key={`r${i}`} style={{ padding: "4px 10px", color: "var(--text-secondary)" }}>
                  {row.endpoint}
                </div>
                <div key={`fa${i}`} style={{
                  padding: "4px 10px",
                  color: row.false_answer > 0 ? "var(--cc-err)" : "var(--cc-ok)",
                }}>
                  {row.false_answer}
                </div>
                <div key={`fr${i}`} style={{
                  padding: "4px 10px",
                  color: row.false_refusal_rate > 0.4 ? "var(--terminal-warn)" : "var(--text-muted)",
                }}>
                  {row.false_refusal}
                </div>
                <div key={`p${i}`} style={{ padding: "4px 10px", color: "var(--text-secondary)" }}>
                  {row.passed}/{row.total}
                </div>
                <div key={`m${i}`} style={{
                  padding: "4px 10px", color: "var(--text-ghost)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {row.model ?? "—"}
                </div>
              </>
            ))}
          </div>
        </div>
      )}

      {/* Per-case outcomes */}
      <div style={{
        border: "1px solid var(--border-subtle)",
        borderRadius: 8,
        overflow: "hidden",
      }}>
        <div style={{
          fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
          color: "var(--text-ghost)",
          padding: "8px 12px",
          borderBottom: "1px solid var(--border-subtle)",
          fontFamily: "var(--mono)",
        }}>
          cases · {outcomes.length}
        </div>
        {outcomes.map((o) => (
          <div key={o.id} style={{
            display: "grid",
            gridTemplateColumns: "110px 60px 1fr 70px",
            gap: 10,
            padding: "8px 12px",
            borderBottom: "1px solid var(--border-subtle)",
            fontFamily: "var(--mono)",
            fontSize: 11,
            alignItems: "baseline",
          }}>
            <span style={{
              color: VERDICT_COLOR[o.verdict] ?? "var(--text-muted)",
              letterSpacing: 1,
              textTransform: "uppercase",
              fontSize: 9,
            }}>
              {o.verdict}
            </span>
            <span style={{ color: "var(--text-ghost)" }}>{o.category}</span>
            <div>
              <div style={{ color: "var(--text-secondary)", lineHeight: 1.4 }}>
                {o.question}
              </div>
              {o.answer && (
                <div style={{
                  color: "var(--text-muted)",
                  fontSize: 10,
                  marginTop: 3,
                  maxHeight: 40,
                  overflow: "hidden",
                }}>
                  → {o.answer.slice(0, 160)}
                </div>
              )}
              {o.error && (
                <div style={{ color: "var(--cc-err)", fontSize: 10, marginTop: 3 }}>
                  {o.error}
                </div>
              )}
            </div>
            <span style={{ color: "var(--text-ghost)", textAlign: "right", fontSize: 10 }}>
              {o.elapsed_ms}ms
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BaselineDelta({
  primary, baseline,
}: { primary: EvalSummary; baseline: EvalSummary }) {
  // Baseline (raw Claude) has no refusal surface so false_refusal is
  // not meaningful for it — we only compare false_answer (hallucination)
  // and pass rate. This is the whole point of the Ruberra thesis: does
  // the doctrine buy anything over a naked model?
  const primaryHall = primary.false_answer;
  const baselineHall = baseline.false_answer;
  const hallDelta = primaryHall - baselineHall;  // negative = Ruberra wins
  const primaryPass = primary.total ? primary.passed / primary.total : 0;
  const baselinePass = baseline.total ? baseline.passed / baseline.total : 0;
  const passDelta = primaryPass - baselinePass;  // positive = Ruberra wins

  const verdict =
    hallDelta < 0 ? "ruberra < claude raw"
    : hallDelta > 0 ? "ruberra > claude raw (regression)"
    : "tie";
  const verdictColor =
    hallDelta < 0 ? "var(--cc-ok)"
    : hallDelta > 0 ? "var(--cc-err)"
    : "var(--text-muted)";

  return (
    <div style={{
      border: "1px solid var(--border-subtle)",
      borderLeft: "2px solid var(--accent-dim)",
      borderRadius: 10,
      padding: "12px 16px",
      fontFamily: "var(--mono)",
    }}>
      <div style={{
        fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
        color: "var(--text-ghost)", marginBottom: 10,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span>vs raw claude baseline</span>
        <span style={{ color: verdictColor }}>· {verdict}</span>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 10,
      }}>
        <DeltaRow
          label="hallucinations"
          ruberra={`${primaryHall}/${primary.bait_total}`}
          baselineValue={`${baselineHall}/${baseline.bait_total}`}
          delta={hallDelta}
          betterLow
        />
        <DeltaRow
          label="pass rate"
          ruberra={`${Math.round(primaryPass * 100)}%`}
          baselineValue={`${Math.round(baselinePass * 100)}%`}
          delta={passDelta}
          betterLow={false}
        />
        <DeltaRow
          label="tokens (in+out)"
          ruberra={formatTokens(primary.total_input_tokens + primary.total_output_tokens)}
          baselineValue={formatTokens(baseline.total_input_tokens + baseline.total_output_tokens)}
          delta={
            (primary.total_input_tokens + primary.total_output_tokens)
            - (baseline.total_input_tokens + baseline.total_output_tokens)
          }
          betterLow
          absolute
        />
      </div>
    </div>
  );
}

function DeltaRow({
  label, ruberra, baselineValue, delta, betterLow, absolute,
}: {
  label: string;
  ruberra: string;
  baselineValue: string;
  delta: number;
  betterLow: boolean;
  absolute?: boolean;
}) {
  const better = betterLow ? delta < 0 : delta > 0;
  const equal = delta === 0;
  const color = equal ? "var(--text-muted)" : better ? "var(--cc-ok)" : "var(--cc-err)";
  const arrow = equal ? "=" : delta > 0 ? "▲" : "▼";
  const deltaStr = absolute
    ? `${arrow} ${Math.abs(delta).toLocaleString()}`
    : typeof delta === "number" && Math.abs(delta) < 1
      ? `${arrow} ${Math.abs(Math.round(delta * 100))}pp`
      : `${arrow} ${Math.abs(delta)}`;
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 3,
      padding: "6px 0",
    }}>
      <span style={{
        fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase",
        color: "var(--text-ghost)",
      }}>
        {label}
      </span>
      <div style={{
        display: "flex", alignItems: "baseline", gap: 8, fontSize: 12,
      }}>
        <span style={{ color: "var(--text-primary)" }}>{ruberra}</span>
        <span style={{ color: "var(--text-ghost)" }}>vs</span>
        <span style={{ color: "var(--text-muted)" }}>{baselineValue}</span>
      </div>
      <span style={{ fontSize: 10, color }}>{deltaStr}</span>
    </div>
  );
}

function KpiCard({
  label, value, sub, tone = "muted",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "ok" | "err" | "warn" | "muted";
}) {
  const color =
    tone === "ok" ? "var(--cc-ok)"
    : tone === "err" ? "var(--cc-err)"
    : tone === "warn" ? "var(--terminal-warn)"
    : "var(--text-primary)";
  return (
    <div style={{
      border: "1px solid var(--border-subtle)",
      borderRadius: 10,
      padding: "10px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 4,
    }}>
      <span style={{
        fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase",
        color: "var(--text-ghost)",
      }}>
        {label}
      </span>
      <span style={{ fontSize: 18, color, lineHeight: 1.1 }}>
        {value}
      </span>
      {sub && (
        <span style={{ fontSize: 9, color: "var(--text-ghost)" }}>{sub}</span>
      )}
    </div>
  );
}
