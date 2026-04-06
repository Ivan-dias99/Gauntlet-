// Ruberra — Creation chamber. Forge artifacts. Execution is primary.
// No fake terminal. If execution is unbound, we say so.

import { useState } from "react";
import { useProjection, emit } from "../spine/store";
import { Unavailable } from "../trust/Unavailable";

// Execution backend binding. In first shipping cut, none is wired.
// Set VITE_RUBERRA_EXEC_URL in the environment to bind a real backend.
const EXEC_BACKEND = (import.meta as any).env?.VITE_RUBERRA_EXEC_URL as
  | string
  | undefined;

export function CreationChamber() {
  const p = useProjection();
  const [directive, setDirective] = useState("");
  const activeThread = p.threads.find((t) => t.id === p.activeThread);
  const artifacts = p.artifacts.filter(
    (a) => !activeThread || a.thread === activeThread.id,
  );
  const executions = p.executions.filter(
    (x) => !activeThread || x.thread === activeThread.id,
  );

  async function runDirective() {
    if (!directive.trim() || !activeThread) return;
    const text = directive.trim();
    await emit.acceptDirective(activeThread.id, text);
    const ex = await emit.startExecution(text, activeThread.id);
    // Honest behavior: without a bound backend, we do not pretend to execute.
    if (!EXEC_BACKEND) {
      await emit.failExecution(ex.id, "execution backend unbound");
      return;
    }
    try {
      const res = await fetch(EXEC_BACKEND, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          repo: activeThread.repo,
          thread: activeThread.id,
          directive: text,
        }),
      });
      if (!res.ok) throw new Error(`backend ${res.status}`);
      const data = (await res.json()) as {
        artifacts?: { title: string }[];
        ok?: boolean;
      };
      for (const a of data.artifacts ?? []) {
        await emit.generateArtifact(a.title, ex.id, activeThread.id);
      }
      if (data.ok === false) await emit.failExecution(ex.id, "backend reported failure");
      else await emit.succeedExecution(ex.id);
    } catch (err) {
      await emit.failExecution(ex.id, (err as Error).message);
    }
    setDirective("");
  }

  return (
    <section className="rb-chamber">
      <h1>Creation</h1>
      <div className="gravity">Gravity: Consequence · Forge artifacts</div>

      {!activeThread ? (
        <Unavailable
          title="no active thread"
          reason="Creation forges through a thread. Open one from the left rail."
          remediation="State an intent to begin the loop."
        />
      ) : (
        <>
          <div className="rb-panel">
            <h2>Directive</h2>
            <div className="rb-col">
              <textarea
                className="rb-textarea"
                placeholder="author directive against the repo..."
                value={directive}
                onChange={(e) => setDirective(e.target.value)}
              />
              <div className="rb-row">
                <button
                  className="rb-btn primary"
                  disabled={!directive.trim()}
                  onClick={runDirective}
                >
                  Accept · Execute
                </button>
                <button
                  className="rb-btn"
                  disabled={!directive.trim()}
                  onClick={() =>
                    emit.rejectDirective(
                      activeThread.id,
                      directive.trim(),
                      "manual rejection",
                    )
                  }
                >
                  Reject
                </button>
              </div>
              {!EXEC_BACKEND && (
                <Unavailable
                  title="execution unbound"
                  reason="No execution backend is bound to this shell."
                  remediation="Set VITE_RUBERRA_EXEC_URL and reload to enable forging."
                />
              )}
            </div>
          </div>

          <div className="rb-panel">
            <h2>Executions</h2>
            {executions.length === 0 ? (
              <div className="rb-unavail">
                <strong>no executions</strong>
                Accept a directive to produce consequence.
              </div>
            ) : (
              <ul className="rb-list">
                {executions
                  .slice()
                  .reverse()
                  .map((x) => (
                    <li key={x.id}>
                      <span
                        className={`rb-badge ${
                          x.status === "succeeded"
                            ? "ok"
                            : x.status === "failed"
                              ? "bad"
                              : "warn"
                        }`}
                      >
                        {x.status}
                      </span>
                      {x.label}
                      {x.reason ? ` — ${x.reason}` : ""}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="rb-panel">
            <h2>Artifacts</h2>
            {artifacts.length === 0 ? (
              <div className="rb-unavail">
                <strong>no artifacts</strong>
                Executions will yield artifacts or an explicit null-artifact.
              </div>
            ) : (
              <ul className="rb-list">
                {artifacts
                  .slice()
                  .reverse()
                  .map((a) => (
                    <li
                      key={a.id}
                      className="rb-row"
                      style={{ justifyContent: "space-between" }}
                    >
                      <span>
                        <span
                          className={`rb-badge ${a.committed ? "ok" : ""}`}
                        >
                          {a.committed ? "committed" : "draft"}
                        </span>
                        {a.title}
                      </span>
                      {!a.committed && (
                        <button
                          className="rb-btn"
                          onClick={() => emit.commitArtifact(a.id)}
                        >
                          Commit
                        </button>
                      )}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  );
}
