// Ruberra — Thread ledger, repo-scoped. Always resident in the shell.

import { useState } from "react";
import { useProjection, emit } from "../spine/store";

export function ThreadStrip() {
  const p = useProjection();
  const [intent, setIntent] = useState("");
  const repoThreads = p.threads.filter((t) => t.repo === p.activeRepo);

  return (
    <aside className="rb-rail">
      <h3 className="rb-section-title">Threads</h3>
      <div className="rb-col" style={{ marginBottom: 14 }}>
        <textarea
          className="rb-textarea"
          placeholder="state intent..."
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
        />
        <button
          className="rb-btn primary"
          disabled={!intent.trim()}
          onClick={async () => {
            await emit.openThread(intent.trim());
            setIntent("");
          }}
        >
          Open thread
        </button>
      </div>
      {repoThreads.length === 0 ? (
        <div className="rb-unavail">
          <strong>no threads</strong>
          Open one to begin the loop.
        </div>
      ) : (
        <div>
          {repoThreads
            .slice()
            .reverse()
            .map((t) => (
              <div
                key={t.id}
                className={`rb-thread ${p.activeThread === t.id ? "active" : ""}`}
              >
                <div className="intent">{t.intent}</div>
                <div className="meta">
                  <span
                    className={`rb-badge ${
                      t.state === "closed"
                        ? "bad"
                        : t.state === "awaiting-review"
                          ? "warn"
                          : t.state === "executing"
                            ? "warn"
                            : "ok"
                    }`}
                  >
                    {t.state}
                  </span>
                  {new Date(t.openedAt).toLocaleTimeString()}
                  {t.status === "open" && p.activeThread === t.id && (
                    <button
                      className="rb-btn"
                      style={{ marginLeft: 8, padding: "2px 8px", fontSize: 9 }}
                      onClick={() => {
                        const reason = prompt("Close reason (required):");
                        if (reason && reason.trim())
                          emit.closeThread(t.id, reason.trim());
                      }}
                    >
                      Close
                    </button>
                  )}
                  {t.closeReason && (
                    <div
                      style={{
                        fontSize: 9,
                        color: "var(--rb-ink-mute)",
                        marginTop: 4,
                      }}
                    >
                      reason: {t.closeReason}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </aside>
  );
}
