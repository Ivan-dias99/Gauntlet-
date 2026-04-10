// Ruberra — Lab chamber. Validate truth. Evidence, contradiction, trace.

import { useState } from "react";
import { useProjection, emit } from "../spine/store";

export function LabChamber() {
  const p = useProjection();
  const [evidence, setEvidence] = useState("");
  const [contradiction, setContradiction] = useState("");

  const openContradictions = p.contradictions.filter((c) => !c.resolved);
  const repoMemory = p.memory.filter((m) => m.repo === p.activeRepo);
  const activeThread = p.threads.find((t) => t.id === p.activeThread);

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
          {repoMemory.length > 0 && openContradictions.length === 0 && (
            <>
              <span className="rb-gravity-sep">·</span>
              <span className="rb-chamber-gravity-text rb-gravity--validation">{repoMemory.length} observations</span>
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

      <div className={`rb-trace${openContradictions.length > 0 ? " rb-trace--warn" : ""}`}>
        <h2>Contradiction Log</h2>
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
        <h2>Capture Evidence</h2>
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
        <h2>Evidence Ledger</h2>
        {repoMemory.length === 0 ? (
          <div className="rb-unavail">
            <strong>no evidence</strong>
          </div>
        ) : (
          <ul className="rb-list">
            {repoMemory
              .slice()
              .reverse()
              .map((m) => (
                <li
                  key={m.id}
                  className="rb-row"
                  style={{ justifyContent: "space-between" }}
                >
                  <span>
                    <span className={`rb-badge ${m.promoted ? "gold" : ""}`}>
                      {m.promoted ? "promoted" : "raw"}
                    </span>
                    {m.text}
                  </span>
                  {!m.promoted && (
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
