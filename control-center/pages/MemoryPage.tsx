import { useCallback, useEffect, useState } from "react";
import { signalFetch, isBackendUnreachable } from "../lib/signalApi";
import { Kv, Panel, SurfaceHeader } from "./ControlLayout";
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
      const res = await signalFetch("/memory/clear", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await reload();
    } catch (err) {
      setError(isBackendUnreachable(err) ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }, [reload]);

  const visible = filter
    ? failures.filter((f) =>
        f.question.toLowerCase().includes(filter.toLowerCase()) ||
        f.failure_type.toLowerCase().includes(filter.toLowerCase()),
      )
    : failures;

  return (
    <>
      <SurfaceHeader
        title="Memory"
        subtitle="Failure memory + run search. The brain remembers what it refused so it doesn't lie next time."
        actions={
          <button
            type="button"
            onClick={onClear}
            disabled={busy || !failures.length}
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
              cursor: busy || !failures.length ? "not-allowed" : "pointer",
              opacity: busy || !failures.length ? 0.5 : 1,
            }}
          >
            {busy ? "clearing…" : "clear all"}
          </button>
        }
      />

      {error && (
        <Panel>
          <p style={{ color: "var(--danger, #d04a4a)", fontSize: 12, margin: 0 }}>{error}</p>
        </Panel>
      )}

      <Panel title="Failure memory · stats" hint="from /memory/stats">
        {stats ? (
          <Kv
            rows={[
              ["total_records", String(stats.total_records ?? 0)],
              ["total_failures", String(stats.total_failures ?? 0)],
              ["last_updated", stats.last_updated ?? "—"],
            ]}
          />
        ) : (
          !error && <p style={{ color: "var(--text-muted)", fontSize: 12 }}>loading…</p>
        )}
      </Panel>

      <Panel title="Failures" hint={`${visible.length} of ${failures.length} record(s)`}>
        <div style={{ marginBottom: 12 }}>
          <input
            type="search"
            value={filter}
            placeholder="filter by question or failure type…"
            onChange={(ev) => setFilter(ev.target.value)}
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
        </div>

        {visible.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: 12, margin: 0 }}>
            {failures.length === 0 ? "no failures recorded yet" : "no matches for filter"}
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {visible.map((f) => (
              <li
                key={f.id}
                style={{
                  padding: "10px 12px",
                  background: "var(--bg-elevated)",
                  borderRadius: "var(--radius-sm, 4px)",
                  fontSize: 12,
                  border: "var(--border-soft)",
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <Pill tone="warn">{f.failure_type}</Pill>
                  <Pill tone="ghost">×{f.times_failed}</Pill>
                  <span style={{ color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
                    {f.timestamp}
                  </span>
                </div>
                <div style={{ color: "var(--text-primary)", marginBottom: 4 }}>{f.question}</div>
                {f.judge_reasoning && (
                  <div style={{ color: "var(--text-muted)", fontSize: 11, fontStyle: "italic" }}>
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
