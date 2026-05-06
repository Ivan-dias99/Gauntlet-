import { useCallback, useEffect, useState } from "react";
import { signalFetch, isBackendUnreachable } from "../lib/signalApi";
import { Panel, SurfaceHeader } from "./ControlLayout";
import Pill from "../components/atoms/Pill";

interface MemoryStats {
  total_records?: number;
  total_failures?: number;
  last_updated?: string;
}

interface FailureRecord {
  id: string;
  timestamp: string;
  question: string;
  failure_type: string;
  triad_divergence_summary?: string;
  judge_reasoning?: string;
  times_failed: number;
}

export default function MemoryPage() {
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [failures, setFailures] = useState<FailureRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    try {
      const [statsRes, failuresRes] = await Promise.all([
        signalFetch("/memory/stats"),
        signalFetch("/memory/failures"),
      ]);
      if (!statsRes.ok) throw new Error(`/memory/stats HTTP ${statsRes.status}`);
      if (!failuresRes.ok) throw new Error(`/memory/failures HTTP ${failuresRes.status}`);
      const statsBody = (await statsRes.json()) as MemoryStats;
      const fails = (await failuresRes.json()) as { records?: FailureRecord[] };
      setStats(statsBody);
      setFailures(fails.records ?? []);
      setError(null);
    } catch (err) {
      setError(isBackendUnreachable(err) ? err.message : String(err));
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const onClear = useCallback(async () => {
    if (!window.confirm("Clear failure memory? This cannot be undone.")) return;
    setBusy(true);
    try {
      const res = await signalFetch("/memory/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await reload();
    } catch (err) {
      setError(isBackendUnreachable(err) ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }, [reload]);

  const visible = filter
    ? failures.filter(
        (f) =>
          f.question.toLowerCase().includes(filter.toLowerCase()) ||
          f.failure_type.toLowerCase().includes(filter.toLowerCase()),
      )
    : failures;

  return (
    <>
      <SurfaceHeader
        eyebrow="Memory"
        title="What the brain remembers"
        subtitle="Failure memory + run search. The brain remembers what it refused so it doesn't lie next time."
        actions={
          <button
            type="button"
            onClick={onClear}
            disabled={busy || !failures.length}
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
              cursor: busy || !failures.length ? "not-allowed" : "pointer",
              opacity: busy || !failures.length ? 0.45 : 1,
              transition: "background 200ms ease, border-color 200ms ease",
            }}
          >
            {busy ? "clearing…" : "clear all"}
          </button>
        }
      />

      {error && <ErrorBlock msg={error} />}

      {/* 4-tier memory grid */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <TierCard
          kicker="failures"
          metric={stats?.total_failures ?? 0}
          label="refusals retained"
          sub="cautious recall · prior_failure"
          tone="warn"
        />
        <TierCard
          kicker="records"
          metric={stats?.total_records ?? 0}
          label="distinct entries"
          sub="dedup · oldest pruned"
          tone="neutral"
        />
        <TierCard
          kicker="spine"
          metric={"·"}
          label="workspace state"
          sub="missions · notes · principles"
          tone="ok"
        />
        <TierCard
          kicker="updated"
          metric={stats?.last_updated ? "·" : "—"}
          label="last write"
          sub={stats?.last_updated ?? "no writes yet"}
          tone="neutral"
        />
      </section>

      <MemoryRecordsPanel />

      <Panel title="Failures" hint={`${visible.length} of ${failures.length} record(s)`}>
        <div style={{ marginBottom: 14 }}>
          <input
            type="search"
            value={filter}
            placeholder="filter by question or failure_type…"
            onChange={(ev) => setFilter(ev.target.value)}
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
        </div>

        {visible.length === 0 ? (
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 12,
              margin: 0,
              padding: "14px 0",
              fontFamily: "var(--mono)",
              letterSpacing: "var(--track-meta)",
              textTransform: "uppercase",
            }}
          >
            {failures.length === 0 ? "no failures recorded yet" : "no matches for filter"}
          </p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {visible.map((f) => (
              <li
                key={f.id}
                style={{
                  position: "relative",
                  padding: "14px 16px",
                  background: "var(--bg-surface)",
                  borderRadius: 10,
                  fontSize: 13,
                  border: "var(--border-soft)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  transition: "border-color 200ms ease",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 0, top: 0, bottom: 0,
                    width: 3,
                    borderRadius: "10px 0 0 10px",
                    background: "color-mix(in oklab, var(--cc-warn) 60%, transparent)",
                  }}
                />
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <Pill tone="warn">{f.failure_type}</Pill>
                  <Pill tone="ghost">×{f.times_failed}</Pill>
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      letterSpacing: "var(--track-meta)",
                    }}
                  >
                    {f.timestamp}
                  </span>
                </div>
                <div
                  style={{
                    color: "var(--text-primary)",
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {f.question}
                </div>
                {f.judge_reasoning && (
                  <div
                    style={{
                      color: "var(--text-muted)",
                      fontSize: 12,
                      fontStyle: "italic",
                      lineHeight: 1.55,
                      paddingLeft: 12,
                      borderLeft: "var(--border-soft)",
                    }}
                  >
                    {f.judge_reasoning}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}

function TierCard({
  kicker,
  metric,
  label,
  sub,
  tone,
}: {
  kicker: string;
  metric: number | string;
  label: string;
  sub: string;
  tone: "ok" | "warn" | "err" | "neutral";
}) {
  const accent =
    tone === "ok"
      ? "var(--cc-ok)"
      : tone === "warn"
      ? "var(--cc-warn)"
      : tone === "err"
      ? "var(--cc-err)"
      : "var(--text-primary)";
  return (
    <div
      className="gx-card"
      style={{
        position: "relative",
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${accent}, transparent 80%)`,
        }}
      />
      <span
        className="gx-eyebrow"
        style={{ color: tone === "neutral" ? "var(--text-muted)" : accent }}
      >
        {kicker}
      </span>
      <span
        style={{
          fontFamily: "var(--serif)",
          fontSize: typeof metric === "number" ? 32 : 26,
          fontWeight: 400,
          lineHeight: 1,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
        }}
      >
        {metric}
      </span>
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "var(--track-meta)",
          color: "var(--text-secondary)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 11,
          color: "var(--text-muted)",
          marginTop: 2,
          lineHeight: 1.4,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {sub}
      </span>
    </div>
  );
}

function ErrorBlock({ msg }: { msg: string }) {
  return (
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
        {msg}
      </div>
    </Panel>
  );
}

// ── Sprint 7 — Memory records inspector ────────────────────────────────────

interface MemoryRecord {
  id: string;
  kind: string;
  scope: string;
  project_id: string | null;
  topic: string;
  body: string;
  created_at: string;
  updated_at: string;
  times_seen: number;
}

const MEMORY_KINDS = [
  "all",
  "note",
  "decision",
  "failure_pattern",
  "preference",
  "canon",
] as const;
type MemoryKindFilter = typeof MEMORY_KINDS[number];

const KIND_TONE: Record<string, "ok" | "warn" | "neutral" | "ghost"> = {
  canon: "ok",
  decision: "ok",
  preference: "neutral",
  note: "ghost",
  failure_pattern: "warn",
};

function MemoryRecordsPanel() {
  const [records, setRecords] = useState<MemoryRecord[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [kindFilter, setKindFilter] = useState<MemoryKindFilter>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [draftTopic, setDraftTopic] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftKind, setDraftKind] = useState<Exclude<MemoryKindFilter, "all">>(
    "note",
  );
  const [draftScope, setDraftScope] = useState<"user" | "project">("user");
  const [draftProject, setDraftProject] = useState("");

  const reload = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (kindFilter !== "all") params.set("kind", kindFilter);
      if (projectFilter !== "all") params.set("project_id", projectFilter);
      if (search.trim()) params.set("search", search.trim());
      const qs = params.toString();
      const [recsRes, projsRes] = await Promise.all([
        signalFetch(`/memory/records${qs ? "?" + qs : ""}`),
        signalFetch("/memory/projects"),
      ]);
      if (!recsRes.ok) throw new Error(`/memory/records HTTP ${recsRes.status}`);
      const recsBody = (await recsRes.json()) as { records?: MemoryRecord[] };
      const projsBody = (await projsRes.json()) as { projects?: string[] };
      setRecords(recsBody.records ?? []);
      setProjects(projsBody.projects ?? []);
      setError(null);
    } catch (err) {
      setError(isBackendUnreachable(err) ? err.message : String(err));
    }
  }, [kindFilter, projectFilter, search]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const onCreate = useCallback(async () => {
    if (!draftTopic.trim() || !draftBody.trim()) return;
    setBusy(true);
    try {
      const res = await signalFetch("/memory/records", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          topic: draftTopic.trim(),
          body: draftBody.trim(),
          kind: draftKind,
          scope: draftScope,
          project_id:
            draftScope === "project" && draftProject.trim()
              ? draftProject.trim()
              : null,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDraftTopic("");
      setDraftBody("");
      setDraftProject("");
      await reload();
    } catch (err) {
      setError(isBackendUnreachable(err) ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }, [draftTopic, draftBody, draftKind, draftScope, draftProject, reload]);

  const onDelete = useCallback(
    async (id: string) => {
      if (!window.confirm("Delete this memory record? This cannot be undone.")) {
        return;
      }
      try {
        const res = await signalFetch(`/memory/records/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await reload();
      } catch (err) {
        setError(isBackendUnreachable(err) ? err.message : String(err));
      }
    },
    [reload],
  );

  return (
    <Panel
      title="Memory records (Sprint 7)"
      hint={`user · project · canon · the composer injects relevant entries into model context`}
    >
      {/* Compose form */}
      <div
        style={{
          padding: "12px 14px",
          background: "var(--bg-elevated)",
          border: "var(--border-soft)",
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <span className="gx-eyebrow">save a new entry</span>
        <input
          type="text"
          placeholder="topic (short handle)"
          value={draftTopic}
          onChange={(ev) => setDraftTopic(ev.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="body — decision, preference, canon, note…"
          value={draftBody}
          onChange={(ev) => setDraftBody(ev.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: "vertical", minHeight: 64 }}
        />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <select
            value={draftKind}
            onChange={(ev) =>
              setDraftKind(ev.target.value as Exclude<MemoryKindFilter, "all">)
            }
            style={selectStyle}
          >
            {MEMORY_KINDS.filter((k) => k !== "all").map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          <select
            value={draftScope}
            onChange={(ev) => setDraftScope(ev.target.value as "user" | "project")}
            style={selectStyle}
          >
            <option value="user">user (global)</option>
            <option value="project">project</option>
          </select>
          {draftScope === "project" && (
            <input
              type="text"
              placeholder="project_id"
              value={draftProject}
              onChange={(ev) => setDraftProject(ev.target.value)}
              style={{ ...inputStyle, width: 200 }}
            />
          )}
          <button
            type="button"
            onClick={() => void onCreate()}
            disabled={busy || !draftTopic.trim() || !draftBody.trim()}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border:
                draftTopic.trim() && draftBody.trim()
                  ? "1px solid color-mix(in oklab, var(--ember) 50%, var(--border-color-mid))"
                  : "var(--border-soft)",
              background:
                draftTopic.trim() && draftBody.trim()
                  ? "color-mix(in oklab, var(--ember) 10%, var(--bg-elevated))"
                  : "var(--bg-elevated)",
              color:
                draftTopic.trim() && draftBody.trim()
                  ? "var(--text-primary)"
                  : "var(--text-muted)",
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "var(--track-meta)",
              textTransform: "uppercase",
              cursor: busy ? "wait" : "pointer",
              fontWeight: 600,
            }}
          >
            {busy ? "saving…" : "save record"}
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 6,
            background: "color-mix(in oklab, var(--cc-err) 8%, transparent)",
            border: "1px solid color-mix(in oklab, var(--cc-err) 28%, transparent)",
            color: "color-mix(in oklab, var(--cc-err) 86%, var(--text-primary))",
            fontFamily: "var(--mono)",
            fontSize: 12,
            marginBottom: 10,
          }}
        >
          {error}
        </div>
      )}

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        {MEMORY_KINDS.map((k) => {
          const active = kindFilter === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setKindFilter(k)}
              style={{
                padding: "5px 12px",
                borderRadius: 999,
                border: active
                  ? "1px solid color-mix(in oklab, var(--ember) 50%, var(--border-color-mid))"
                  : "var(--border-soft)",
                background: active
                  ? "color-mix(in oklab, var(--ember) 10%, var(--bg-elevated))"
                  : "var(--bg-elevated)",
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "var(--track-meta)",
                textTransform: "uppercase",
                cursor: "pointer",
                fontWeight: active ? 600 : 400,
              }}
            >
              {k}
            </button>
          );
        })}
        {projects.length > 0 && (
          <select
            value={projectFilter}
            onChange={(ev) => setProjectFilter(ev.target.value)}
            style={selectStyle}
          >
            <option value="all">all projects</option>
            {projects.map((p) => (
              <option key={p} value={p}>
                project · {p}
              </option>
            ))}
          </select>
        )}
        <input
          type="search"
          placeholder="search topic / body"
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
          style={{ ...inputStyle, flex: 1, minWidth: 200 }}
        />
      </div>

      {records.length === 0 ? (
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
          no memory records yet
        </p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {records.map((r) => (
            <li
              key={r.id}
              style={{
                padding: "12px 14px",
                background: "var(--bg-surface)",
                border: "var(--border-soft)",
                borderRadius: 10,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div
                style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}
              >
                <Pill tone={KIND_TONE[r.kind] ?? "ghost"}>{r.kind}</Pill>
                <Pill tone="ghost">{r.scope}</Pill>
                {r.project_id && <Pill tone="ghost">project · {r.project_id}</Pill>}
                {r.times_seen > 1 && <Pill tone="neutral">×{r.times_seen}</Pill>}
                <span
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    letterSpacing: "var(--track-meta)",
                  }}
                >
                  {r.updated_at.slice(0, 19).replace("T", " ")}
                </span>
                <span style={{ flex: 1 }} />
                <button
                  type="button"
                  onClick={() => void onDelete(r.id)}
                  style={{
                    padding: "3px 9px",
                    borderRadius: 6,
                    border: "var(--border-soft)",
                    background: "transparent",
                    color: "var(--text-muted)",
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    letterSpacing: "var(--track-meta)",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  delete
                </button>
              </div>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                {r.topic}
              </div>
              <div
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 12,
                  lineHeight: 1.55,
                  whiteSpace: "pre-wrap",
                }}
              >
                {r.body}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  background: "var(--bg-input)",
  border: "var(--border-soft)",
  color: "var(--text-primary)",
  fontFamily: "var(--mono)",
  fontSize: 12,
  outline: "none",
};

const selectStyle: React.CSSProperties = {
  padding: "7px 10px",
  borderRadius: 8,
  background: "var(--bg-input)",
  border: "var(--border-soft)",
  color: "var(--text-primary)",
  fontFamily: "var(--mono)",
  fontSize: 12,
  outline: "none",
};
