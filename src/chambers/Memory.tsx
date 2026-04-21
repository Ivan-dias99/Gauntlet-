import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSpine } from "../spine/SpineContext";
import { useTweaks } from "../tweaks/TweaksContext";
import { useCopy } from "../i18n/copy";
import ErrorPanel from "../shell/ErrorPanel";
import type { Artifact, Chamber } from "../spine/types";

interface RunRecord {
  id: string;
  timestamp: string;
  route: string;
  mission_id: string | null;
  question: string;
  answer: string | null;
  refused: boolean;
  confidence: string | null;
  judge_reasoning: string | null;
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
  crew: "var(--terminal-ok)",
};

// Memory is a timeline of what happened; telling the user *where* each thing
// happened turns a flat run list into governance story.
const ROUTE_ORIGIN: Record<string, Chamber> = {
  agent: "Lab",
  dev:   "Creation",
  crew:  "Creation",
  triad: "School",
  ask:   "Lab",
};

function originFor(route: string): Chamber | null {
  return ROUTE_ORIGIN[route] ?? null;
}

// Heuristic link between a run and an accepted artifact: same mission, and
// the artifact was accepted within a short window after the run finished.
const ARTIFACT_MATCH_WINDOW_MS = 5 * 60 * 1000;

function linkArtifact(run: RunRecord, artifact: Artifact | null | undefined): Artifact | null {
  if (!artifact) return null;
  const runMs = Date.parse(run.timestamp);
  if (!Number.isFinite(runMs)) return null;
  const delta = artifact.acceptedAt - runMs;
  if (delta < 0 || delta > ARTIFACT_MATCH_WINDOW_MS) return null;
  return artifact;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function formatDayLabel(d: Date, now: Date): string {
  if (sameDay(d, now)) return "HOJE";
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (sameDay(d, y)) return "ONTEM";
  return d.toLocaleDateString("pt-PT", { weekday: "short", day: "2-digit", month: "short" })
    .toUpperCase().replace(/\./g, "");
}

function tokenize(text: string): string[] {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(w => w.length >= 5);
}

function isLinked(question: string, active: Set<string>): boolean {
  if (active.size === 0) return false;
  for (const t of tokenize(question)) {
    if (active.has(t)) return true;
  }
  return false;
}

function groupByDay(runs: RunRecord[]): Array<{ key: string; label: string; runs: RunRecord[] }> {
  const now = new Date();
  const groups: Array<{ key: string; label: string; runs: RunRecord[] }> = [];
  const idx = new Map<string, number>();
  for (const r of runs) {
    const d = new Date(r.timestamp);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!idx.has(key)) {
      idx.set(key, groups.length);
      groups.push({ key, label: formatDayLabel(d, now), runs: [] });
    }
    groups[idx.get(key)!].runs.push(r);
  }
  return groups;
}

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

export default function Memory() {
  const { activeMission, principles } = useSpine();
  const { values } = useTweaks();
  const copy = useCopy();
  const layout = values.memoryLayout;
  const missionArtifact = activeMission?.lastArtifact ?? null;
  const doctrineCount = principles.length;
  const [runs, setRuns] = useState<RunRecord[] | null>(null);
  const [serverStats, setServerStats] = useState<ServerStats | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const activeTokens = useMemo<Set<string>>(() => {
    const set = new Set<string>();
    if (!activeMission) return set;
    for (const n of activeMission.notes ?? []) {
      for (const t of tokenize(n.text)) set.add(t);
    }
    for (const t of activeMission.tasks ?? []) {
      for (const tk of tokenize(t.title)) set.add(tk);
    }
    for (const a of activeMission.artifacts ?? []) {
      for (const tk of tokenize(a.taskTitle)) set.add(tk);
    }
    for (const tk of tokenize(activeMission.title)) set.add(tk);
    return set;
  }, [activeMission]);
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
          <span style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-ghost)", fontFamily: "var(--mono)" }}>
            {copy.memoryTagline}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
            {copy.memorySubtitle}
          </span>
          {stats.total > 0 && (
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-ghost)", fontFamily: "var(--mono)" }}>
              {renderRouteBreakdown(stats.byRoute)}
            </span>
          )}
        </div>

        {/* Governance chips: tell the user that this run list is scoped to one
            mission and that N doctrine principles are governing it. Without
            this framing Memory feels like "just another list". */}
        {(activeMission || doctrineCount > 0) && (
          <div style={{
            marginTop: 8,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            color: "var(--text-ghost)",
          }}>
            {activeMission && (
              <GovernanceChip label="sob missão" value={activeMission.title} />
            )}
            {doctrineCount > 0 && (
              <GovernanceChip
                label="doutrina activa"
                value={`${doctrineCount} princípio${doctrineCount === 1 ? "" : "s"}`}
              />
            )}
          </div>
        )}

        {stats.total > 0 && (
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

        {err && (
          <ErrorPanel
            severity="critical"
            title={copy.memoryErrorTitle}
            message={`${copy.memoryErrorPrefix} ${err}`}
          />
        )}

        {runs === null && !err && (
          <div style={{ fontSize: 12, color: "var(--text-ghost)" }}>{copy.memoryLoading}</div>
        )}

        {runs && runs.length === 0 && !err && (
          <div style={{ fontSize: 12, color: "var(--text-ghost)" }}>
            {copy.memoryEmpty}
          </div>
        )}

        {layout === "timeline" && runs && runs.length > 0 && (
          <div style={{ position: "relative", paddingLeft: 120, maxWidth: 760 }}>
            <div style={{
              position: "absolute", left: 80, top: 6, bottom: 6,
              width: 1, background: "var(--border-subtle)",
            }} />
            {groupByDay(runs).map((g, gi) => (
              <div key={g.key}>
                <div
                  data-day-separator={g.label}
                  style={{
                    position: "relative",
                    marginTop: gi === 0 ? 0 : 24,
                    marginBottom: 14,
                    display: "flex", alignItems: "center", gap: 12,
                  }}
                >
                  <span style={{
                    position: "absolute", left: -120, top: -2, width: 62, textAlign: "right",
                    fontSize: 9, letterSpacing: 2,
                    color: "var(--text-ghost)", fontFamily: "var(--mono)",
                  }}>{g.label}</span>
                  <div style={{
                    flex: 1, height: 1,
                    background: "var(--border-subtle)", opacity: 0.55,
                  }} />
                  <span style={{
                    fontSize: 9, letterSpacing: 1.5,
                    color: "var(--text-ghost)", fontFamily: "var(--mono)",
                  }}>
                    {copy.memoryDayEntry(g.runs.length)}
                  </span>
                </div>
                {g.runs.map((r, i) => {
                  const color = ROUTE_COLOR[r.route] ?? "var(--text-muted)";
                  const isRefused = r.refused;
                  const conf = (r.confidence || "").toLowerCase();
                  const isLowConf = conf === "low";
                  const isHighConf = conf === "high";
                  const toolHeavy = r.tool_calls.length >= 3;
                  const hasJudgment = !!(r.judge_reasoning && r.judge_reasoning.trim());
                  const hasTools = r.tool_calls.length > 0;
                  const consequence: "primary" | "secondary" | "routine" =
                    isRefused || hasJudgment ? "primary"
                    : hasTools ? "secondary"
                    : "routine";
                  const isRoutine = consequence === "routine";
                  const isPrimary = consequence === "primary";
                  const linked = isLinked(r.question, activeTokens);
                  const linkClass: "linked" | "orphan" = linked ? "linked" : "orphan";
                  const bodyColor = isRefused ? "var(--cc-err)"
                    : isRoutine ? "var(--text-ghost)"
                    : isLowConf ? "var(--text-muted)"
                    : "var(--text-secondary)";
                  const bodyStyle = isRefused ? "italic" : "normal";
                  const bodyWeight = isHighConf ? 500 : 400;
                  const bodySize = isRoutine ? 12 : 13;
                  const routeColor = isRefused ? "var(--cc-err)" : color;
                  return (
                    <div
                      key={r.id}
                      className={isRoutine ? undefined : "fadeUp"}
                      data-event-class={isRefused ? "refused" : isLowConf ? "low-conf" : isHighConf ? "high-conf" : "default"}
                      data-consequence={consequence}
                      data-link={linkClass}
                      style={{
                        animationDelay: isRoutine ? undefined : `${i * 16}ms`,
                        position: "relative",
                        marginBottom: isRoutine ? 12 : 18,
                        opacity: isRoutine ? 0.78 : 1,
                      }}
                    >
                      <span style={{
                        position: "absolute", left: -46, top: 8,
                        width: isRefused || isRoutine ? 6 : 8,
                        height: isRefused || isRoutine ? 6 : 8,
                        borderRadius: "50%",
                        background: routeColor,
                        boxShadow: isHighConf
                          ? `0 0 0 3px var(--bg), 0 0 0 4px ${color}`
                          : "0 0 0 3px var(--bg)",
                        opacity: isLowConf ? 0.55 : isRoutine ? 0.6 : 1,
                      }} />
                      <span style={{
                        position: "absolute", left: -120, top: 4, width: 62, textAlign: "right",
                        fontSize: 9, letterSpacing: 1.5,
                        color: routeColor, fontFamily: "var(--mono)", textTransform: "uppercase",
                        opacity: isLowConf ? 0.7 : isRoutine ? 0.7 : 1,
                      }}>
                        {r.route}{toolHeavy ? "·T" : ""}
                      </span>
                      {isPrimary && (
                        <span
                          data-consequence-mark="primary"
                          aria-hidden
                          style={{
                            position: "absolute",
                            right: -18, top: 6,
                            fontSize: 10,
                            color: isRefused ? "var(--cc-err)" : "var(--accent)",
                            fontFamily: "var(--mono)",
                            opacity: 0.9,
                          }}
                        >
                          ◆
                        </span>
                      )}
                      <div style={{
                        fontSize: bodySize,
                        color: bodyColor,
                        fontStyle: bodyStyle,
                        fontWeight: bodyWeight,
                        lineHeight: 1.5,
                      }}>
                        {isRefused ? "✗ " : ""}{r.question}
                      </div>
                      <div style={{
                        fontSize: 10, color: "var(--text-ghost)",
                        fontFamily: "var(--mono)", marginTop: 2,
                        opacity: isRoutine ? 0.75 : 1,
                      }}>
                        {new Date(r.timestamp).toLocaleTimeString([], {
                          hour: "2-digit", minute: "2-digit", second: "2-digit",
                        })} · {r.processing_time_ms}ms · {r.tool_calls.length} tools
                        {r.terminated_early ? " · terminado" : ""}
                        {" · "}
                        <span
                          data-link-mark={linkClass}
                          style={{
                            color: linked ? "var(--accent)" : "var(--text-ghost)",
                            opacity: linked ? 1 : 0.75,
                          }}
                        >
                          {linked ? "→ ligado" : "· solto"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {layout === "log" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 820 }}>
          {runs?.map((r) => {
            const isOpen = expanded === r.id;
            const origin = originFor(r.route);
            const linkedArtifact = linkArtifact(r, missionArtifact);
            return (
              <div key={r.id} style={{
                borderBottom: "1px solid var(--border-subtle)",
                padding: "10px 0",
                borderLeft: r.refused ? "2px solid var(--cc-err)" : "2px solid transparent",
                paddingLeft: r.refused ? 10 : 0,
                marginLeft: r.refused ? -12 : 0,
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
                    color: r.refused ? "var(--cc-err)" : ROUTE_COLOR[r.route] ?? "var(--text-muted)",
                    textTransform: "uppercase",
                  }}>
                    {r.refused ? "✗ " : ""}{r.route}
                    {origin && (
                      <span style={{
                        marginLeft: 6, color: "var(--text-ghost)",
                        letterSpacing: 1.5, textTransform: "uppercase",
                      }}>
                        · {origin}
                      </span>
                    )}
                  </span>
                  <span style={{
                    fontSize: 12,
                    color: r.refused ? "var(--terminal-warn)" : "var(--text-secondary)",
                    lineHeight: 1.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {r.question}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-ghost)", whiteSpace: "nowrap", display: "inline-flex", alignItems: "baseline", gap: 8 }}>
                    {renderOutcomeChip(r)}
                    <span>
                      {new Date(r.timestamp).toLocaleTimeString([], {
                        hour: "2-digit", minute: "2-digit", second: "2-digit",
                      })}
                    </span>
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
                    {origin && <MetaRow label="origem" value={origin} />}
                    {linkedArtifact && (
                      <MetaRow
                        label="artefacto"
                        value={`${linkedArtifact.taskTitle}${linkedArtifact.terminatedEarly ? " (parcial)" : ""}`}
                      />
                    )}
                    {doctrineCount > 0 && (
                      <MetaRow
                        label="doutrina"
                        value={`${doctrineCount} princípio${doctrineCount === 1 ? "" : "s"} em vigor`}
                      />
                    )}
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
                    {(r.judge_reasoning || r.refused) && (
                      <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border-subtle)" }}>
                        <div style={{ fontSize: 9, letterSpacing: 1.5, color: "var(--text-ghost)", textTransform: "uppercase", marginBottom: 4, fontFamily: "var(--mono)" }}>judge</div>
                        {r.judge_reasoning ? (
                          <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.55, fontFamily: "var(--sans)", whiteSpace: "pre-wrap" }}>
                            {r.judge_reasoning.length > 320 ? r.judge_reasoning.slice(0, 320) + "…" : r.judge_reasoning}
                          </div>
                        ) : (
                          <div style={{ fontSize: 11, color: "var(--text-ghost)", fontStyle: "italic", fontFamily: "var(--sans)" }}>
                            — sem motivo registado —
                          </div>
                        )}
                      </div>
                    )}
                    <div style={{
                      marginTop: 10, padding: "8px 0 0",
                      borderTop: "1px solid var(--border-subtle)",
                      fontSize: 11,
                      color: r.answer ? "var(--text-secondary)" : "var(--text-ghost)",
                      fontStyle: r.answer ? "normal" : "italic",
                      whiteSpace: "pre-wrap", lineHeight: 1.6,
                      fontFamily: "var(--sans)",
                    }}>
                      {r.answer
                        ? r.answer
                        : r.refused
                        ? "— recusada sem resposta registada —"
                        : "— sem resposta —"}
                    </div>
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

function GovernanceChip({ label, value }: { label: string; value: string }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "baseline",
      gap: 6,
      padding: "3px 9px",
      border: "1px solid var(--border-subtle)",
      borderRadius: 999,
      background: "var(--bg-input)",
      color: "var(--text-ghost)",
    }}>
      <span style={{ color: "var(--text-ghost)" }}>{label}</span>
      <span style={{ color: "var(--text-secondary)", textTransform: "none", letterSpacing: 0 }}>
        {value}
      </span>
    </span>
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

// Row-level consequence chip. Priority: refused → terminated-early → confidence.
// Returns null when the run carried no outcome-pressure signal (a clean run
// with no confidence reported). Caller wraps in the row's metadata span.
function renderOutcomeChip(r: RunRecord) {
  if (r.refused) {
    return (
      <span style={{ color: "var(--cc-err)", fontFamily: "var(--mono)", letterSpacing: 1, textTransform: "uppercase", fontSize: 9 }}>
        recusado
      </span>
    );
  }
  if (r.terminated_early) {
    return (
      <span style={{ color: "var(--cc-warn)", fontFamily: "var(--mono)", letterSpacing: 1, textTransform: "uppercase", fontSize: 9 }}>
        terminado cedo
      </span>
    );
  }
  if (r.confidence) {
    const color =
      r.confidence === "high" ? "var(--cc-ok)" :
      r.confidence === "low"  ? "var(--cc-warn)" :
      "var(--text-ghost)";
    return (
      <span style={{ color, fontFamily: "var(--mono)", letterSpacing: 1, textTransform: "uppercase", fontSize: 9 }}>
        {r.confidence}
      </span>
    );
  }
  return null;
}
