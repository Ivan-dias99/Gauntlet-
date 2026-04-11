// Ruberra — Lab chamber. Validation forge. Skepticism substrate.
// Evidence, contradiction detection, execution trace.
// Thread-scoped: evidence ledger shows active thread's observations.

import { useState, useMemo } from "react";
import { useProjection, emit } from "../spine/store";
import type { TruthState } from "../spine/projections";

const STATE_CLASS: Record<TruthState, string> = {
  draft: "",
  observed: "",
  retained: "ok",
  hardened: "gold",
  revoked: "bad",
};

export function LabChamber() {
  const p = useProjection();
  const [evidence, setEvidence] = useState("");
  const [contradiction, setContradiction] = useState("");

  const activeThread = p.threads.find((t) => t.id === p.activeThread);
  const openContradictions = p.contradictions.filter((c) => !c.resolved);

  // Thread-scoped evidence — shows active thread's observations when a thread is
  // active; falls back to all repo memory when no thread is active.
  const repoMemory = useMemo(
    () => p.memory.filter((m) => m.repo === p.activeRepo),
    [p.memory, p.activeRepo],
  );
  const threadEvidence = useMemo(
    () =>
      activeThread
        ? repoMemory.filter((m) => m.thread === activeThread.id)
        : repoMemory,
    [repoMemory, activeThread],
  );

  // Execution trace — thread-scoped execution record.
  // Shows what has run, what succeeded, what failed.
  const threadExecutions = useMemo(
    () =>
      activeThread
        ? p.executions.filter((x) => x.thread === activeThread.id)
        : [],
    [p.executions, activeThread],
  );
  const runningCount   = threadExecutions.filter((x) => x.status === "running").length;
  const succeededCount = threadExecutions.filter((x) => x.status === "succeeded").length;
  const failedCount    = threadExecutions.filter((x) => x.status === "failed").length;

  return (
    <section className="rb-chamber rb-chamber--lab">
      <header className="rb-chamber-header rb-chamber-header--validation">
        <div className="rb-lab-sigil" aria-hidden="true" />
        <h1 className="rb-chamber-title">Lab</h1>
        <div className="rb-chamber-gravity-bar">
          <span className="rb-chamber-gravity-text rb-gravity--primary">Validation</span>
          <span className="rb-gravity-sep">·</span>
          <span className="rb-chamber-gravity-text">Skepticism · Evidence pressure</span>
          {openContradictions.length > 0 && (
            <>
              <span className="rb-gravity-sep">·</span>
              <span className="rb-chamber-gravity-text rb-gravity--bad">{openContradictions.length} open tension</span>
            </>
          )}
          {threadExecutions.length > 0 && (
            <>
              <span className="rb-gravity-sep">·</span>
              <span className="rb-chamber-gravity-text rb-gravity--validation">{threadExecutions.length} executions</span>
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

      {/* Execution Trace — thread-scoped validation record.
          Shows what ran, what succeeded, what failed. Empty when no thread. */}
      {activeThread && (
        <div className={`rb-trace rb-trace--exec${failedCount > 0 ? " rb-trace--warn" : ""}`}>
          <div className="rb-lab-section-header">
            <span className="rb-lab-section-title">Execution Trace</span>
            {threadExecutions.length > 0 && (
              <div className="rb-lab-exec-summary">
                {runningCount > 0 && (
                  <span className="rb-lab-exec-cell running">{runningCount} running</span>
                )}
                {succeededCount > 0 && (
                  <span className="rb-lab-exec-cell ok">{succeededCount} succeeded</span>
                )}
                {failedCount > 0 && (
                  <span className="rb-lab-exec-cell bad">{failedCount} failed</span>
                )}
              </div>
            )}
          </div>
          {threadExecutions.length === 0 ? (
            <div className="rb-unavail">
              <strong>no executions</strong>
              Execution trace appears here when directives are accepted and run.
            </div>
          ) : (
            <ul className="rb-list">
              {threadExecutions
                .slice()
                .reverse()
                .map((x) => (
                  <li key={x.id} className="rb-row" style={{ justifyContent: "space-between" }}>
                    <span>
                      <span className={`rb-badge ${
                        x.status === "succeeded" ? "ok"
                        : x.status === "failed" ? "bad"
                        : x.status === "running" ? "warn"
                        : ""
                      }`}>
                        {x.status}
                      </span>
                      {x.label.length > 60 ? x.label.slice(0, 60) + "…" : x.label}
                    </span>
                    {x.status === "failed" && (
                      <button
                        className="rb-btn"
                        onClick={() => emit.retryExecution(x.id)}
                      >
                        Retry
                      </button>
                    )}
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}

      <div className={`rb-trace${openContradictions.length > 0 ? " rb-trace--warn" : ""}`}>
        <div className="rb-lab-section-header">
          <span className="rb-lab-section-title">Contradiction Log</span>
        </div>
        <div className="rb-col" style={{ marginBottom: openContradictions.length > 0 || p.contradictions.length > 0 ? 12 : 0 }}>
          <input
            className="rb-input"
            placeholder="a contradiction between two claims..."
            value={contradiction}
            onChange={(e) => setContradiction(e.target.value)}
          />
          <button
            className="rb-btn"
            disabled={!contradiction.trim()}
            onClick={async () => {
              await emit.detectContradiction(contradiction.trim());
              setContradiction("");
            }}
          >
            Detect
          </button>
        </div>
        {p.contradictions.length === 0 ? (
          <div className="rb-unavail">
            <strong>no contradictions</strong>
          </div>
        ) : (
          <ul className="rb-list">
            {p.contradictions.map((c) => (
              <li
                key={c.id}
                className="rb-row"
                style={{ justifyContent: "space-between" }}
              >
                <span>
                  <span className={`rb-badge ${c.resolved ? "ok" : "bad"}`}>
                    {c.resolved ? "resolved" : "open"}
                  </span>
                  {c.text}
                </span>
                {!c.resolved && (
                  <button
                    className="rb-btn"
                    onClick={() => emit.resolveContradiction(c.id)}
                  >
                    Resolve
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rb-trace">
        <div className="rb-lab-section-header">
          <span className="rb-lab-section-title">Capture Evidence</span>
        </div>
        <div className="rb-col">
          <textarea
            className="rb-textarea"
            placeholder="evidence observed from execution..."
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
          />
          <button
            className="rb-btn primary"
            disabled={!evidence.trim()}
            onClick={async () => {
              await emit.captureMemory(evidence.trim(), p.activeThread);
              setEvidence("");
            }}
          >
            Capture → Memory
          </button>
        </div>
      </div>

      <div className="rb-trace">
        <div className="rb-lab-section-header">
          <span className="rb-lab-section-title">Evidence Ledger</span>
          {activeThread && (
            <span className="rb-lab-section-scope">
              {activeThread.intent.length > 28
                ? activeThread.intent.slice(0, 28) + "…"
                : activeThread.intent}
            </span>
          )}
        </div>
        {threadEvidence.length === 0 ? (
          <div className="rb-unavail">
            <strong>{repoMemory.length === 0 ? "no evidence" : "no observations in this thread"}</strong>
            Observation precedes memory.
          </div>
        ) : (
          <ul className="rb-list">
            {threadEvidence
              .slice()
              .reverse()
              .map((m) => (
                <li
                  key={m.id}
                  className="rb-row"
                  style={{ justifyContent: "space-between" }}
                >
                  <span>
                    <span className={`rb-badge ${STATE_CLASS[m.state]}`}>
                      {m.state}
                    </span>
                    {m.text}
                  </span>
                  {!m.promoted && m.state !== "revoked" && (
                    <button
                      className="rb-btn"
                      onClick={() => emit.promoteMemory(m.id)}
                    >
                      Promote
                    </button>
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>
    </section>
  );
}
