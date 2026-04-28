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
        <ul
          style={{
            margin: "var(--space-3) 0 0",
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            maxHeight: 240,
            overflowY: "auto",
          }}
        >
          {records.slice().reverse().map((r) => (
            <li
              key={r.id}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: 10,
                alignItems: "baseline",
                padding: "4px 0",
                borderTop: "1px solid var(--border-soft, var(--border))",
              }}
            >
              <span style={{ color: "var(--text-ghost)", fontSize: 10 }}>
                {r.failure_type}
              </span>
              <span style={{ color: "var(--text)", textTransform: "none", letterSpacing: 0 }}>
                {r.question.length > 140 ? r.question.slice(0, 137) + "…" : r.question}
              </span>
              <span style={{ color: "var(--text-ghost)", fontSize: 10 }}>
                ×{r.times_failed}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
