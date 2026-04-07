// Ruberra — Lab chamber. Validate truth. Evidence, contradiction, trace.

import { useState } from "react";
import { useProjection, emit } from "../spine/store";

export function LabChamber() {
  const p = useProjection();
  const [evidence, setEvidence] = useState("");
  const [contradiction, setContradiction] = useState("");

  return (
    <section className="rb-chamber">
      <h1>Lab</h1>
      <div className="gravity">Gravity: Skepticism · Validate truth</div>

      <div className="rb-panel">
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

      <div className="rb-panel">
        <h2>Contradiction Log</h2>
        <div className="rb-col" style={{ marginBottom: 12 }}>
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
          <div className="rb-empty">
            The contradiction log is clear.
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
                  <span
                    className={`rb-badge ${c.resolved ? "ok" : "bad"}`}
                  >
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

      <div className="rb-panel">
        <h2>Evidence Ledger</h2>
        {p.memory.length === 0 ? (
          <div className="rb-empty">
            The evidence ledger is clear.
          </div>
        ) : (
          <ul className="rb-list">
            {p.memory
              .slice()
              .reverse()
              .map((m) => (
                <li
                  key={m.id}
                  className="rb-row"
                  style={{ justifyContent: "space-between" }}
                >
                  <span>
                    <span
                      className={`rb-badge ${m.promoted ? "gold" : ""}`}
                    >
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
