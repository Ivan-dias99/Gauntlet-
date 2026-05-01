import { useCallback, useEffect, useState } from "react";
import {
  signalFetch,
  isBackendUnreachable,
  parseBackendError,
  BackendError,
} from "../../lib/signalApi";

// Archive · Failure Memory panel.
//
// Fourth pillar of the doctrine ("memory of failure") finally surfaced
// in the shell: /memory/stats + /memory/failures + /memory/clear. Sits
// between ArchiveWorkbench and ArchiveLayout so the ledger column stays
// focused on /runs and this panel narrates the refusal lineage.
//
// Visual grammar: same `term-workbench-strip` family as ArchiveWorkbench,
// but a single thin band that expands into a record list. The clear
// action is gated by an inline confirm step — the backend already
// requires `confirm:true`, the UI mirrors that with a two-press flow.
//
// Wave P-16 — promoted from collapsed list into a proper inspector:
//   * search input filters by question_fingerprint substring (also
//     matches the question text so a typed phrase narrows the list).
//   * each row click-expands inline to show judge_reasoning and
//     triad_divergence_summary, plus the full question and the
//     fingerprint hash. Closes the read-only side of the doctrine
//     loop — operator can audit why a question was refused without
//     leaving the chamber.

interface FailureRecord {
  id: string;
  timestamp: string;
  question: string;
  question_fingerprint: string;
  failure_type: string;
  triad_divergence_summary: string;
  judge_reasoning: string;
  times_failed: number;
}

interface FailuresResponse {
  count: number;
  records: FailureRecord[];
}

interface MemoryStats {
  total_records: number;
  total_failures: number;
  last_updated: string | null;
  top_repeat_offenders: Array<{ question: string; times_failed: number }>;
}

const PILL: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 10,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: "var(--text-secondary)",
  padding: "3px 8px",
  border: "1px solid var(--border)",
  borderRadius: 999,
  background: "transparent",
  cursor: "pointer",
};

export default function FailureMemoryPanel() {
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [records, setRecords] = useState<FailureRecord[] | null>(null);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [busy, setBusy] = useState(false);
  // Wave P-16 — inspector state. `query` filters the visible list by
  // fingerprint (or question substring); `expandedId` is the single
  // row currently inflated to show judge_reasoning + triad divergence.
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setErr(null);
    setOffline(false);
    try {
      const [statsRes, listRes] = await Promise.all([
        signalFetch("/memory/stats", { signal }),
        signalFetch("/memory/failures?limit=50", { signal }),
      ]);
      if (!statsRes.ok) {
        const env = await parseBackendError(statsRes);
        throw new BackendError(statsRes.status, env, `memory/stats ${statsRes.status}`);
      }
      if (!listRes.ok) {
        const env = await parseBackendError(listRes);
        throw new BackendError(listRes.status, env, `memory/failures ${listRes.status}`);
      }
      const s = (await statsRes.json()) as MemoryStats;
      const f = (await listRes.json()) as FailuresResponse;
      setStats(s);
      setRecords(f.records);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      if (isBackendUnreachable(e)) {
        setOffline(true);
        setErr(e.message);
        return;
      }
      setErr(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    load(ac.signal);
    return () => ac.abort();
  }, [load]);

  async function clearMemory() {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    setBusy(true);
    try {
      const res = await signalFetch("/memory/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });
      if (!res.ok) {
        const env = await parseBackendError(res);
        throw new BackendError(res.status, env, `memory/clear ${res.status}`);
      }
      setConfirmClear(false);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  // Headline numbers narrate the doctrine pillar in one line.
  // record count = how many distinct questions ever failed
  // total failures = same questions counted by repeat
  const headline = stats
    ? `${stats.total_records} record${stats.total_records === 1 ? "" : "s"} · ${stats.total_failures} total failures`
    : offline
      ? "memory unavailable · backend dormant"
      : err
        ? "memory unavailable"
        : "loading failure memory…";

  return (
    <div
      data-archive-region="failure-memory"
      style={{
        margin: "0 var(--space-4)",
        padding: "var(--space-2) var(--space-3)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-2)",
        background: "var(--surface-1, transparent)",
        fontFamily: "var(--mono)",
        fontSize: 11,
        letterSpacing: "var(--track-meta)",
        color: "var(--text-secondary)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-3)",
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          disabled={!records || records.length === 0}
          style={{
            ...PILL,
            border: "none",
            padding: 0,
            background: "transparent",
            color: "var(--text)",
            cursor: records && records.length ? "pointer" : "default",
            textAlign: "left",
          }}
        >
          <span style={{ marginRight: 8, opacity: 0.7 }}>
            {records && records.length ? (open ? "▾" : "▸") : "·"}
          </span>
          failure memory
          <span style={{ marginLeft: 12, color: "var(--text-ghost)", textTransform: "none" }}>
            {headline}
          </span>
        </button>

        <div style={{ display: "flex", gap: 8 }}>
          {stats && stats.total_records > 0 && (
            <button
              type="button"
              onClick={clearMemory}
              disabled={busy}
              style={{
                ...PILL,
                color: confirmClear ? "var(--cc-warn, var(--terminal-warn))" : "var(--text-secondary)",
                borderColor: confirmClear ? "var(--cc-warn, var(--terminal-warn))" : "var(--border)",
              }}
            >
              {busy ? "clearing…" : confirmClear ? "confirm clear" : "clear"}
            </button>
          )}
        </div>
      </div>

      {err && !offline && (
        <div style={{ marginTop: 8, color: "var(--terminal-err, var(--text-ghost))" }}>
          memory error · {err}
        </div>
      )}

      {open && records && records.length > 0 && (
        <div style={{ marginTop: "var(--space-3)" }}>
          {/* Wave P-16 — search input. Filters by fingerprint substring,
              and also matches into the question text so a phrase like
              "tax" still narrows even when the operator does not have
              a hash on hand. Case-insensitive on both sides. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <span style={{ color: "var(--text-ghost)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2 }}>
              filter
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="question fingerprint or substring…"
              aria-label="filter failure memory by fingerprint"
              spellCheck={false}
              style={{
                flex: 1,
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: 0,
                color: "var(--text)",
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-1, 4px)",
                padding: "3px 8px",
                // Wave P-35 — outline removed; global :focus-visible in
                // tokens.css now paints the keyboard ring. Hardcoded
                // `outline: none` killed it for screen-reader/keyboard
                // users without giving anything in return.
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="clear filter"
                style={{ ...PILL, padding: "2px 6px", fontSize: 9 }}
              >
                clear
              </button>
            )}
          </div>

          {(() => {
            const q = query.trim().toLowerCase();
            const filtered = records
              .slice()
              .reverse()
              .filter((r) => {
                if (!q) return true;
                return (
                  r.question_fingerprint.toLowerCase().includes(q) ||
                  r.question.toLowerCase().includes(q)
                );
              });

            if (filtered.length === 0) {
              return (
                <div
                  style={{
                    color: "var(--text-ghost)",
                    fontSize: 10,
                    padding: "8px 0",
                    textTransform: "uppercase",
                    letterSpacing: 1.2,
                  }}
                >
                  no records match
                </div>
              );
            }

            return (
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  maxHeight: 320,
                  overflowY: "auto",
                }}
              >
                {filtered.map((r) => {
                  const isExpanded = expandedId === r.id;
                  const ts = (() => {
                    try {
                      return new Date(r.timestamp).toISOString().slice(0, 19).replace("T", " ");
                    } catch {
                      return r.timestamp;
                    }
                  })();
                  return (
                    <li
                      key={r.id}
                      style={{
                        borderTop: "1px solid var(--border-soft, var(--border))",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : r.id)}
                        aria-expanded={isExpanded}
                        style={{
                          width: "100%",
                          display: "grid",
                          gridTemplateColumns: "auto 1fr auto auto",
                          gap: 10,
                          alignItems: "baseline",
                          padding: "6px 0",
                          background: "transparent",
                          border: "none",
                          color: "inherit",
                          fontFamily: "inherit",
                          fontSize: "inherit",
                          letterSpacing: "inherit",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <span style={{ color: "var(--text-ghost)", fontSize: 10 }}>
                          {r.failure_type}
                        </span>
                        <span style={{ color: "var(--text)", textTransform: "none", letterSpacing: 0 }}>
                          {r.question.length > 120 ? r.question.slice(0, 117) + "…" : r.question}
                        </span>
                        <span style={{ color: "var(--text-ghost)", fontSize: 10 }}>
                          {ts}
                        </span>
                        <span style={{ color: "var(--text-ghost)", fontSize: 10 }}>
                          ×{r.times_failed}
                        </span>
                      </button>
                      {isExpanded && (
                        <div
                          data-archive-region="failure-memory-detail"
                          style={{
                            padding: "6px 0 12px 0",
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            color: "var(--text-secondary)",
                          }}
                        >
                          <DetailField label="fingerprint" mono value={r.question_fingerprint} />
                          <DetailField label="question" value={r.question} />
                          <DetailField
                            label="judge reasoning"
                            value={r.judge_reasoning || "(empty)"}
                          />
                          <DetailField
                            label="triad divergence"
                            value={r.triad_divergence_summary || "(empty)"}
                          />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// DetailField — small inline-styled label/value pair for the expanded
// failure record. Keeps the same mono kicker + body pattern used by
// ArchiveWorkbench so the inspector reads as one piece with the rest
// of the chamber instead of a different visual island.
function DetailField({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span
        style={{
          color: "var(--text-ghost)",
          fontSize: 9,
          letterSpacing: 1.5,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: "var(--text)",
          fontFamily: mono ? "var(--mono)" : "inherit",
          fontSize: 11,
          letterSpacing: 0,
          textTransform: "none",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {value}
      </span>
    </div>
  );
}
