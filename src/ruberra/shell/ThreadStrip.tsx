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
            await emit.openThread(intent.trim(), p.activeRepo);
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
                  <span className={`rb-badge ${t.status === "open" ? "ok" : ""}`}>
                    {t.status}
                  </span>
                  {new Date(t.openedAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
        </div>
      )}
    </aside>
  );
}
