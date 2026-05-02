// Wave 5 — Memory Mode canvas. Two surfaces under one canvas:
//
//   1. Browse — combined view of run records + failure memory entries.
//      Filter by text + route + "refused only" toggle. Each row is a
//      card; click to expand and see full provenance (judge_reasoning,
//      answer, tools used, latency, tokens). Stats summary on top.
//
//   2. Compose — uses useComposeFlow with a verb that biases the brain
//      toward save / recall / search intents. Honest about state: the
//      backend currently routes save_memory as an intent class, but
//      there is no /memory/save endpoint that writes to a persistent
//      memory store. So compose returns a structured intent + summary,
//      not a write. A meta line above the output makes that explicit.
//
// No new backend endpoints — everything reads existing surface
// (/memory/stats, /memory/failures, /runs).

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useComposeFlow } from "../useComposeFlow";
import {
  listRuns,
  listFailures,
  getMemoryStats,
} from "../composerClient";
import {
  isBackendUnreachable,
  isBackendError,
} from "../../lib/signalApi";
import type {
  ComposeState,
  IntentResult,
  PreviewResult,
  RunRecord,
  FailureRecord,
  MemoryStats,
} from "../types";
import Pill from "../../components/atoms/Pill";

type Surface = "browse" | "compose";

// Combined timeline entry — runs + failures normalised so the browser
// can render them in one chronological list.
type Entry =
  | { kind: "run"; record: RunRecord }
  | { kind: "failure"; record: FailureRecord };

const VERB_TABS = [
  { id: "save",   label: "save",   blurb: "Capture this for later"  },
  { id: "recall", label: "recall", blurb: "Pull a past artifact back" },
  { id: "search", label: "search", blurb: "Find runs by topic"        },
] as const;

type VerbId = (typeof VERB_TABS)[number]["id"];

const VERB_PREFIX: Record<VerbId, string> = {
  save:   "Save the following to memory with provenance: ",
  recall: "Recall what was saved about: ",
  search: "Search past runs and failures for: ",
};

const inputBase: CSSProperties = {
  width: "100%",
  background: "var(--bg-elevated, #161b24)",
  color: "var(--text-primary)",
  border: "1px solid var(--border, rgba(255,255,255,0.13))",
  borderRadius: "var(--radius-md, 8px)",
  padding: "10px 12px",
  fontFamily: "var(--sans)",
  fontSize: 14,
  resize: "vertical",
  boxSizing: "border-box",
};

const tabBase: CSSProperties = {
  padding: "8px 14px",
  borderRadius: "999px",
  border: "var(--border-soft)",
  background: "transparent",
  color: "var(--text-muted)",
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta)",
  letterSpacing: "var(--track-meta)",
  textTransform: "uppercase",
  cursor: "pointer",
};

const tabActive: CSSProperties = {
  ...tabBase,
  background: "color-mix(in oklab, var(--accent, #4a7cff) 18%, transparent)",
  color: "var(--text-primary)",
  borderColor: "color-mix(in oklab, var(--accent, #4a7cff) 50%, transparent)",
};

const actionPrimary: CSSProperties = {
  background: "var(--accent, #4a7cff)",
  color: "#fff",
  border: "none",
  borderRadius: "var(--radius-md, 8px)",
  padding: "10px 22px",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};

const actionGhost: CSSProperties = {
  background: "transparent",
  color: "var(--text-secondary, var(--text-muted))",
  border: "var(--border-soft)",
  borderRadius: "var(--radius-md, 8px)",
  padding: "10px 18px",
  fontSize: 14,
  cursor: "pointer",
};

const chipBase: CSSProperties = {
  padding: "4px 10px",
  borderRadius: "999px",
  border: "var(--border-soft)",
  background: "transparent",
  color: "var(--text-muted)",
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: "var(--track-meta)",
  textTransform: "uppercase",
  cursor: "pointer",
};

const chipActive: CSSProperties = {
  ...chipBase,
  background: "color-mix(in oklab, var(--accent, #4a7cff) 18%, transparent)",
  color: "var(--text-primary)",
  borderColor: "color-mix(in oklab, var(--accent, #4a7cff) 50%, transparent)",
};

export default function MemoryCanvas() {
  const [surface, setSurface] = useState<Surface>("browse");

  return (
    <section
      style={{
        background: "var(--bg-surface)",
        border: "1px solid color-mix(in oklab, var(--accent, #4a7cff) 35%, var(--border, rgba(255,255,255,0.13)))",
        borderRadius: "var(--radius-lg, 10px)",
        padding: "28px 28px 24px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
      data-memory-canvas
    >
      <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "var(--accent, #4a7cff)",
            boxShadow: "0 0 12px var(--accent, #4a7cff)",
          }}
        />
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--serif)",
            fontWeight: 400,
            fontSize: 22,
            color: "var(--text-primary)",
          }}
        >
          Memory Mode
        </h2>
        <Pill tone="ok">live</Pill>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)", letterSpacing: "var(--track-meta)" }}>
          RUNS · FAILURES · COMPOSE
        </span>
      </header>

      <div style={{ display: "flex", gap: 6 }}>
        <button
          type="button"
          onClick={() => setSurface("browse")}
          style={surface === "browse" ? tabActive : tabBase}
        >
          Browse
        </button>
        <button
          type="button"
          onClick={() => setSurface("compose")}
          style={surface === "compose" ? tabActive : tabBase}
        >
          Compose
        </button>
      </div>

      {surface === "browse" ? <BrowseSurface /> : <ComposeSurface />}
    </section>
  );
}

// ─── Browse surface ─────────────────────────────────────────────────────

function BrowseSurface() {
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [failures, setFailures] = useState<FailureRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [route, setRoute] = useState<string>("all");
  const [refusedOnly, setRefusedOnly] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [s, r, f] = await Promise.all([
        getMemoryStats().catch(() => null),
        listRuns({ limit: 100 }),
        listFailures(50),
      ]);
      setStats(s);
      setRuns(r.records ?? []);
      setFailures(f.records ?? []);
      setError(null);
    } catch (err) {
      if (isBackendUnreachable(err)) {
        setError(`${err.reason} — ${err.message}`);
      } else if (isBackendError(err)) {
        setError(err.envelope?.message ?? err.message);
      } else {
        setError(err instanceof Error ? err.message : String(err));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const routes = useMemo(() => {
    const set = new Set<string>();
    runs.forEach((r) => set.add(r.route));
    return ["all", ...Array.from(set).sort()];
  }, [runs]);

  const entries = useMemo<Entry[]>(() => {
    const all: Entry[] = [
      ...runs.map((r): Entry => ({ kind: "run", record: r })),
      ...failures.map((f): Entry => ({ kind: "failure", record: f })),
    ];
    return all.sort((a, b) => {
      const ta = a.kind === "run" ? a.record.timestamp : a.record.timestamp;
      const tb = b.kind === "run" ? b.record.timestamp : b.record.timestamp;
      return tb.localeCompare(ta);
    });
  }, [runs, failures]);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (e.kind === "run") {
        if (route !== "all" && e.record.route !== route) return false;
        if (refusedOnly && !e.record.refused) return false;
        if (text) {
          const q = text.toLowerCase();
          const haystack = `${e.record.question} ${e.record.context ?? ""} ${e.record.answer ?? ""}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      }
      if (route !== "all") return false;
      // refusedOnly is implicit for failures (every failure is a refusal)
      if (text) {
        const q = text.toLowerCase();
        const haystack = `${e.record.question} ${e.record.failure_type} ${e.record.judge_reasoning ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [entries, route, text, refusedOnly]);

  const stripRoute = route !== "all";

  return (
    <>
      <StatsRow stats={stats} runCount={runs.length} failureCount={failures.length} />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="filter by question, context, answer, judge reasoning…"
          style={{ ...inputBase, fontFamily: "var(--mono)", fontSize: 12, padding: "8px 10px" }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          {routes.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoute(r)}
              style={r === route ? chipActive : chipBase}
              title={r === "all" ? "show all routes (and failures)" : `route: ${r}`}
            >
              {r}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setRefusedOnly((v) => !v)}
            style={refusedOnly ? chipActive : chipBase}
            disabled={stripRoute}
            title={stripRoute ? "route filter overrides refused filter" : "show only refused runs"}
          >
            refused only
          </button>
          <button
            type="button"
            onClick={() => void reload()}
            style={{ ...chipBase, marginLeft: "auto" }}
            disabled={loading}
            title="reload from backend"
          >
            {loading ? "loading…" : "↻ reload"}
          </button>
        </div>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--text-muted)",
          }}
        >
          {filtered.length} of {entries.length} record{entries.length === 1 ? "" : "s"}
          {stats?.last_updated && <> · last update {stats.last_updated}</>}
        </p>
      </div>

      {error && (
        <div
          style={{
            background: "color-mix(in oklab, var(--danger, #d04a4a) 14%, transparent)",
            border: "1px solid color-mix(in oklab, var(--danger, #d04a4a) 50%, transparent)",
            color: "var(--danger, #d04a4a)",
            borderRadius: "var(--radius-md, 8px)",
            padding: "10px 12px",
            fontSize: 13,
          }}
        >
          <strong>error:</strong> {error}
        </div>
      )}

      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxHeight: 540,
          overflow: "auto",
        }}
      >
        {filtered.length === 0 && !error && (
          <li style={{ color: "var(--text-muted)", fontSize: 12, fontFamily: "var(--mono)" }}>
            {entries.length === 0 ? "no records yet — submit a run anywhere in the composer first" : "no matches for current filter"}
          </li>
        )}
        {filtered.map((e) => {
          const id = e.kind === "run" ? e.record.id : e.record.id;
          const isExpanded = expanded === id;
          return (
            <li key={`${e.kind}-${id}`}>
              <EntryCard
                entry={e}
                expanded={isExpanded}
                onToggle={() => setExpanded(isExpanded ? null : id)}
              />
            </li>
          );
        })}
      </ul>

      <p
        style={{
          margin: "4px 0 0",
          fontSize: 11,
          color: "var(--text-muted)",
          fontFamily: "var(--mono)",
        }}
      >
        Drill into a single run on the{" "}
        <Link to="/control/ledger" style={{ color: "var(--text-secondary, var(--text-muted))" }}>
          ledger
        </Link>{" "}
        or manage failures on the{" "}
        <Link to="/control/memory" style={{ color: "var(--text-secondary, var(--text-muted))" }}>
          memory page
        </Link>.
      </p>
    </>
  );
}

function StatsRow({
  stats,
  runCount,
  failureCount,
}: {
  stats: MemoryStats | null;
  runCount: number;
  failureCount: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: 10,
      }}
    >
      <StatTile label="runs loaded"     value={String(runCount)} />
      <StatTile label="failures loaded" value={String(failureCount)} />
      <StatTile label="total records"   value={String(stats?.total_records ?? "—")} />
      <StatTile label="total failures"  value={String(stats?.total_failures ?? "—")} />
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "var(--bg-elevated, #131316)",
        border: "var(--border-soft)",
        borderRadius: 8,
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: "var(--t-micro)",
          letterSpacing: "var(--track-meta)",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </span>
      <span style={{ fontFamily: "var(--mono)", fontSize: 18, color: "var(--text-primary)" }}>
        {value}
      </span>
    </div>
  );
}

function EntryCard({
  entry,
  expanded,
  onToggle,
}: {
  entry: Entry;
  expanded: boolean;
  onToggle: () => void;
}) {
  if (entry.kind === "run") {
    return <RunCard record={entry.record} expanded={expanded} onToggle={onToggle} />;
  }
  return <FailureCard record={entry.record} expanded={expanded} onToggle={onToggle} />;
}

function RunCard({
  record,
  expanded,
  onToggle,
}: {
  record: RunRecord;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      style={{
        background: "var(--bg-elevated, #131316)",
        border: "var(--border-soft)",
        borderRadius: 8,
        padding: "12px 14px",
        cursor: "pointer",
      }}
      onClick={onToggle}
      data-entry="run"
    >
      <header style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <Pill tone="neutral">run</Pill>
        <Pill tone="ghost">{record.route}</Pill>
        {record.refused && <Pill tone="danger">refused</Pill>}
        {record.terminated_early && <Pill tone="warn">terminated · {record.termination_reason ?? "early"}</Pill>}
        {record.confidence && <Pill tone="ghost">conf · {record.confidence}</Pill>}
        {record.mission_id && (
          <Pill tone="ghost">mission · {record.mission_id.slice(0, 8)}</Pill>
        )}
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
          {record.timestamp}
        </span>
      </header>
      <p
        style={{
          margin: "8px 0 0",
          fontSize: 13,
          color: "var(--text-primary)",
          lineHeight: 1.5,
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: expanded ? "unset" : 2,
          overflow: "hidden",
        }}
      >
        {record.question}
      </p>
      {expanded && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          {record.judge_reasoning && (
            <Field label="Judge reasoning">{record.judge_reasoning}</Field>
          )}
          {record.context && <Field label="Context" mono>{record.context}</Field>}
          {record.answer && <Field label="Answer">{record.answer}</Field>}
          {record.tool_calls && record.tool_calls.length > 0 && (
            <Field label="Tools">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {record.tool_calls.map((t, i) => (
                  <Pill key={i} tone={t.ok === false ? "danger" : "neutral"}>
                    {t.name}
                    {t.ok === false ? " ✗" : ""}
                  </Pill>
                ))}
              </div>
            </Field>
          )}
          <Field label="Telemetry" mono>
            {`id: ${record.id}\n` +
              `iter: ${record.iterations ?? "—"} · ` +
              `proc_ms: ${record.processing_time_ms ?? "—"} · ` +
              `in_tok: ${record.input_tokens ?? "—"} · ` +
              `out_tok: ${record.output_tokens ?? "—"}`}
          </Field>
        </div>
      )}
    </article>
  );
}

function FailureCard({
  record,
  expanded,
  onToggle,
}: {
  record: FailureRecord;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      style={{
        background: "color-mix(in oklab, var(--danger, #d04a4a) 8%, var(--bg-elevated, #131316))",
        border: "1px solid color-mix(in oklab, var(--danger, #d04a4a) 30%, var(--border, rgba(255,255,255,0.13)))",
        borderRadius: 8,
        padding: "12px 14px",
        cursor: "pointer",
      }}
      onClick={onToggle}
      data-entry="failure"
    >
      <header style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <Pill tone="danger">failure</Pill>
        <Pill tone="warn">{record.failure_type}</Pill>
        {record.times_failed > 1 && <Pill tone="ghost">×{record.times_failed}</Pill>}
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
          {record.timestamp}
        </span>
      </header>
      <p
        style={{
          margin: "8px 0 0",
          fontSize: 13,
          color: "var(--text-primary)",
          lineHeight: 1.5,
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: expanded ? "unset" : 2,
          overflow: "hidden",
        }}
      >
        {record.question}
      </p>
      {expanded && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          {record.judge_reasoning && <Field label="Judge reasoning">{record.judge_reasoning}</Field>}
          {record.triad_divergence_summary && (
            <Field label="Triad divergence">{record.triad_divergence_summary}</Field>
          )}
        </div>
      )}
    </article>
  );
}

function Field({
  label,
  children,
  mono,
}: {
  label: string;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div>
      <span
        style={{
          display: "block",
          fontFamily: "var(--mono)",
          fontSize: "var(--t-micro)",
          letterSpacing: "var(--track-meta)",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: 4,
        }}
      >
        {label}
      </span>
      <div
        style={{
          fontFamily: mono ? "var(--mono)" : "var(--sans)",
          fontSize: mono ? 11 : 13,
          color: "var(--text-primary)",
          whiteSpace: mono ? "pre-wrap" : "normal",
          wordBreak: mono ? "break-word" : "normal",
          lineHeight: 1.55,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Compose surface ───────────────────────────────────────────────────

function ComposeSurface() {
  const [input, setInput] = useState("");
  const [verb, setVerb] = useState<VerbId>("save");
  const { state, compose, apply } = useComposeFlow();

  async function onCompose(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    await compose(`${VERB_PREFIX[verb]}${trimmed}`);
  }

  const submitting = state.kind === "submitting";

  return (
    <>
      <div
        style={{
          background: "color-mix(in oklab, var(--warn, #c0922a) 10%, transparent)",
          border: "1px solid color-mix(in oklab, var(--warn, #c0922a) 35%, transparent)",
          color: "color-mix(in oklab, var(--warn, #c0922a) 95%, var(--text-primary))",
          borderRadius: "var(--radius-md, 8px)",
          padding: "10px 12px",
          fontSize: 12,
          lineHeight: 1.55,
        }}
      >
        <strong>Honest disclosure.</strong> The brain routes <code>save_memory</code> as an
        intent class today, but there is no <code>/memory/save</code> endpoint that writes
        to a persistent store. Compose returns a structured intent and a summary; nothing
        is written. True persistent save lands in a future wave once the storage contract
        is defined.
      </div>

      <form onSubmit={onCompose} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <textarea
          placeholder="Describe what to save / recall / search — e.g. 'all refused runs about Figma imports last week'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={submitting}
          style={{ ...inputBase, minHeight: 96, fontSize: 16 }}
          rows={3}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          {VERB_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setVerb(t.id)}
              style={t.id === verb ? tabActive : tabBase}
              title={t.blurb}
            >
              {t.label}
            </button>
          ))}
          <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 8 }}>
            {VERB_TABS.find((t) => t.id === verb)?.blurb}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="submit" style={actionPrimary} disabled={submitting || !input.trim()}>
            {submitting ? "Composing…" : "Compose"}
          </button>
        </div>
      </form>

      <ComposeOutput state={state} onApply={apply} />
    </>
  );
}

function ComposeOutput({
  state,
  onApply,
}: {
  state: ComposeState;
  onApply: (approved: boolean) => void;
}) {
  if (state.kind === "idle") {
    return (
      <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 12, fontFamily: "var(--mono)" }}>
        no run yet
      </p>
    );
  }
  if (state.kind === "submitting") {
    return (
      <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 13, fontFamily: "var(--mono)" }}>
        contacting brain…
      </p>
    );
  }
  if (state.kind === "error") {
    return (
      <div
        style={{
          background: "color-mix(in oklab, var(--danger, #d04a4a) 14%, transparent)",
          border: "1px solid color-mix(in oklab, var(--danger, #d04a4a) 50%, transparent)",
          color: "var(--danger, #d04a4a)",
          borderRadius: "var(--radius-md, 8px)",
          padding: "10px 12px",
          fontSize: 13,
        }}
      >
        <strong>error:</strong> {state.reason ? `${state.reason} — ` : ""}{state.message}
      </div>
    );
  }
  if (state.kind === "applied") {
    return (
      <div
        style={{
          background: "color-mix(in oklab, var(--ok, #4a8c5d) 14%, transparent)",
          border: "1px solid color-mix(in oklab, var(--ok, #4a8c5d) 50%, transparent)",
          borderRadius: "var(--radius-md, 8px)",
          padding: "10px 12px",
          fontSize: 13,
        }}
      >
        <strong>applied · run {state.apply.run_id.slice(0, 8)}</strong>
      </div>
    );
  }
  if (state.kind === "intent_ready") return <IntentBlock intent={state.intent} />;
  return (
    <>
      <IntentBlock intent={state.intent} />
      <PreviewBlock preview={state.preview} onApply={onApply} />
    </>
  );
}

function IntentBlock({ intent }: { intent: IntentResult }) {
  const isMemory = intent.intent === "save_memory" || intent.intent === "search_memory";
  return (
    <div
      style={{
        background: "var(--bg-elevated, #131316)",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-md, 8px)",
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Pill tone={isMemory ? "ok" : "warn"}>{intent.intent}</Pill>
        <Pill tone={intent.risk_estimate === "high" ? "danger" : intent.risk_estimate === "medium" ? "warn" : "ghost"}>
          risk · {intent.risk_estimate}
        </Pill>
        <span style={{ marginLeft: "auto", color: "var(--text-muted)", fontSize: 11, fontFamily: "var(--mono)" }}>
          {intent.model_route.primary_model}
        </span>
      </header>
      <p style={{ margin: 0, fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5 }}>
        {intent.summary}
      </p>
    </div>
  );
}

function PreviewBlock({
  preview,
  onApply,
}: {
  preview: PreviewResult;
  onApply: (approved: boolean) => void;
}) {
  if (preview.refused) {
    return (
      <div
        style={{
          background: "color-mix(in oklab, var(--danger, #d04a4a) 14%, transparent)",
          border: "1px solid color-mix(in oklab, var(--danger, #d04a4a) 50%, transparent)",
          color: "var(--danger, #d04a4a)",
          borderRadius: "var(--radius-md, 8px)",
          padding: "10px 12px",
          fontSize: 13,
        }}
      >
        <strong>refused:</strong> {preview.refusal_reason ?? "no reason given"}
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <header style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Pill tone="ok">{preview.artifact.kind}</Pill>
        {preview.judge_verdict && (
          <Pill tone={preview.judge_verdict === "high" ? "ok" : "warn"}>
            judge · {preview.judge_verdict}
          </Pill>
        )}
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
          {preview.model_used} · {preview.latency_ms}ms
        </span>
      </header>
      <pre
        style={{
          margin: 0,
          background: "var(--bg, #08080a)",
          border: "var(--border-soft)",
          padding: 12,
          borderRadius: 6,
          fontFamily: "var(--mono)",
          fontSize: 12,
          color: "var(--text-primary)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          maxHeight: 320,
          overflow: "auto",
          lineHeight: 1.55,
        }}
      >
        {preview.artifact.content}
      </pre>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button type="button" style={actionGhost} onClick={() => onApply(false)}>
          Reject
        </button>
        <button type="button" style={actionPrimary} onClick={() => onApply(true)}>
          Approve & apply
        </button>
      </div>
    </div>
  );
}
