// Ruberra — Memory chamber. Persistent layer. Recall, not storage theater.
// Memory is the substrate — observations retained by the organism.
// Operations: browse all, filter by thread, filter by truth-state,
// search text, promote to canon proposal, capture new observation.
// No fake pagination. No decorative cards. Dense, scannable, operational.

import { useState, useMemo } from "react";
import { useProjection, emit } from "../spine/store";
import type { TruthState } from "../spine/projections";

type FilterState = "all" | TruthState;
type ThreadFilter = "all" | string;

const STATE_ORDER: Record<TruthState, number> = {
  draft: 0,
  observed: 1,
  retained: 2,
  hardened: 3,
  revoked: 4,
};

const STATE_CLASS: Record<TruthState, string> = {
  draft: "",
  observed: "",
  retained: "ok",
  hardened: "gold",
  revoked: "bad",
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function MemoryChamber() {
  const p = useProjection();
  const [stateFilter, setStateFilter] = useState<FilterState>("all");
  const [threadFilter, setThreadFilter] = useState<ThreadFilter>("all");
  const [search, setSearch] = useState("");
  const [captureText, setCaptureText] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Repo-scoped memory only.
  const repoMemory = useMemo(
    () => p.memory.filter((m) => m.repo === p.activeRepo),
    [p.memory, p.activeRepo],
  );

  // Available threads for filter (only those that have memory).
  const threadIds = useMemo(() => {
    const ids = new Set<string>();
    for (const m of repoMemory) {
      if (m.thread) ids.add(m.thread);
    }
    return Array.from(ids);
  }, [repoMemory]);

  const threadMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of p.threads) {
      map.set(t.id, t.intent.length > 32 ? t.intent.slice(0, 32) + "…" : t.intent);
    }
    return map;
  }, [p.threads]);

  // Filtered + searched memory.
  const filtered = useMemo(() => {
    let list = repoMemory;
    if (stateFilter !== "all") {
      list = list.filter((m) => m.state === stateFilter);
    }
    if (threadFilter !== "all") {
      list = list.filter((m) => m.thread === threadFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((m) => m.text.toLowerCase().includes(q));
    }
    // Sort: most recent first, then by truth-state weight.
    return list.slice().sort((a, b) => {
      const tsDiff = b.ts - a.ts;
      if (tsDiff !== 0) return tsDiff;
      return STATE_ORDER[b.state] - STATE_ORDER[a.state];
    });
  }, [repoMemory, stateFilter, threadFilter, search]);

  // Truth-state distribution — ambient context.
  const stateCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of repoMemory) {
      counts[m.state] = (counts[m.state] || 0) + 1;
    }
    return counts;
  }, [repoMemory]);

  const hasActiveThread = !!p.activeThread;
  const activeThread = p.threads.find((t) => t.id === p.activeThread);

  return (
    <section className="rb-chamber rb-chamber--memory">
      <header className="rb-chamber-header rb-chamber-header--consequence">
        <div className="rb-memory-sigil" aria-hidden="true" />
        <h1 className="rb-chamber-title">Memory</h1>
        <div className="rb-chamber-gravity-bar">
          <span className="rb-chamber-gravity-text rb-gravity--primary">Consequence Substrate</span>
          <span className="rb-gravity-sep">·</span>
          <span className="rb-chamber-gravity-text">What the organism retains</span>
          {repoMemory.length > 0 && (
            <>
              <span className="rb-gravity-sep">·</span>
              <span className="rb-chamber-gravity-text">{repoMemory.length} entries</span>
            </>
          )}
          {(stateCounts["hardened"] ?? 0) > 0 && (
            <>
              <span className="rb-gravity-sep">·</span>
              <span className="rb-chamber-gravity-text rb-gravity--gold">{stateCounts["hardened"]} law</span>
            </>
          )}
        </div>
        <div className="rb-chamber-accent-line" />
      </header>

      {activeThread && (
        <div className="rb-thread-context-bar">
          <span className="rb-thread-context-bar-label">thread</span>
          <span className="rb-thread-context-bar-intent">
            {activeThread.intent.length > 72
              ? activeThread.intent.slice(0, 72) + "…"
              : activeThread.intent}
          </span>
          <span className="rb-thread-context-bar-state">{activeThread.state}</span>
        </div>
      )}

      {repoMemory.length > 0 && (
        <div className="rb-memory-consolidation">
          {(["observed", "retained", "hardened", "revoked"] as const).map((state) => {
            const count = stateCounts[state] ?? 0;
            if (count === 0) return null;
            return (
              <div key={state} className={`rb-memory-consolidation-cell ${STATE_CLASS[state]}`}>
                <span className="rb-memory-consolidation-count">{count}</span>
                <span className="rb-memory-consolidation-label">{state}</span>
              </div>
            );
          })}
          <div className="rb-memory-consolidation-cell">
            <span className="rb-memory-consolidation-count">{repoMemory.length}</span>
            <span className="rb-memory-consolidation-label">total</span>
          </div>
        </div>
      )}

      {selected.size > 0 && (
        <div className="rb-memory-batch-bar">
          <span className="rb-memory-batch-count">{selected.size} selected</span>
          <button
            className="rb-btn"
            onClick={() => {
              for (const id of selected) emit.revokeMemory(id, "batch revoke");
              setSelected(new Set());
            }}
          >
            Revoke Selected
          </button>
          <button className="rb-btn" onClick={() => setSelected(new Set())}>
            Clear Selection
          </button>
        </div>
      )}

      {/* Truth-state distribution — system depth at a glance */}
      <div className="rb-memory-distribution">
        {(["retained", "hardened", "observed", "revoked"] as TruthState[]).map((s) => (
          <button
            key={s}
            className={`rb-memory-dist-cell${stateFilter === s ? " active" : ""}`}
            data-state={s}
            onClick={() => setStateFilter(stateFilter === s ? "all" : s)}
          >
            <span className="rb-memory-dist-count">{stateCounts[s] || 0}</span>
            <span className="rb-memory-dist-label">{s}</span>
          </button>
        ))}
      </div>

      {/* Filters + search — operational, not decorative */}
      <div className="rb-memory-controls">
        <input
          className="rb-memory-search"
          placeholder="search memory…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {threadIds.length > 0 && (
          <select
            className="rb-memory-thread-filter"
            value={threadFilter}
            onChange={(e) => setThreadFilter(e.target.value)}
          >
            <option value="all">all threads</option>
            {threadIds.map((id) => (
              <option key={id} value={id}>
                {threadMap.get(id) ?? id.slice(0, 12)}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Capture — direct memory creation */}
      <div className="rb-memory-capture">
        <div className="rb-memory-capture-label">capture observation</div>
        <div className="rb-row" style={{ gap: 8 }}>
          <textarea
            className="rb-textarea"
            placeholder="what was observed…"
            value={captureText}
            onChange={(e) => setCaptureText(e.target.value)}
            style={{ minHeight: 56, flex: 1 }}
          />
          <button
            className="rb-btn primary"
            disabled={!captureText.trim()}
            onClick={async () => {
              await emit.captureMemory(captureText.trim(), hasActiveThread ? p.activeThread : undefined);
              setCaptureText("");
            }}
            style={{ alignSelf: "flex-end" }}
          >
            Capture
          </button>
        </div>
      </div>

      {/* Memory ledger — the recall surface */}
      <div className="rb-memory-ledger">
        {filtered.length === 0 ? (
          <div className="rb-unavail">
            <strong>{repoMemory.length === 0 ? "no memory" : "no matches"}</strong>
            {repoMemory.length === 0
              ? "The organism has no retained observations. Capture evidence in Lab or execute directives in Creation."
              : "Adjust filters or search to find retained observations."}
          </div>
        ) : (
          filtered.map((m) => {
            const threadLabel = m.thread ? threadMap.get(m.thread) : undefined;
            const itemClass = [
              "rb-memory-item",
              m.state === "revoked" && "revoked",
              m.state === "hardened" && "rb-memory-item--hardened",
              m.state === "retained" && "rb-memory-item--retained",
            ].filter(Boolean).join(" ");
            return (
              <div key={m.id} className={itemClass}>
                <div className="rb-memory-item-header">
                  <label className="rb-memory-item-select">
                    <input
                      type="checkbox"
                      checked={selected.has(m.id)}
                      onChange={() => {
                        const next = new Set(selected);
                        if (next.has(m.id)) next.delete(m.id);
                        else next.add(m.id);
                        setSelected(next);
                      }}
                    />
                  </label>
                  <span className={`rb-badge ${STATE_CLASS[m.state]}`}>{m.state}</span>
                  {threadLabel && (
                    <span className="rb-memory-item-thread">{threadLabel}</span>
                  )}
                  <span className="rb-memory-item-time">{timeAgo(m.ts)}</span>
                </div>
                <div className="rb-memory-item-text">{m.text}</div>
                {m.state !== "revoked" && m.state !== "hardened" && (
                  <div className="rb-memory-item-actions">
                    {m.state === "retained" && !m.promoted && (
                      <button
                        className="rb-btn"
                        onClick={async () => {
                          await emit.promoteMemory(m.id);
                          await emit.proposeCanon(m.text, m.id);
                        }}
                      >
                        Promote → Canon Proposal
                      </button>
                    )}
                    {m.state === "observed" && (
                      <button className="rb-btn" onClick={() => emit.elevateMemory(m.id, "retained")}>
                        Retain
                      </button>
                    )}
                    <button className="rb-btn" onClick={() => emit.revokeMemory(m.id, "no longer relevant")}>
                      Revoke
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
