// Ruberra — Thread ledger, repo-scoped. Always resident in the shell.
// On narrow screens: rendered as an overlay rail; open/onClose driven by Shell.

import { useState } from "react";
import { useProjection, emit } from "../spine/store";
import { RuledPrompt } from "../trust/RuledPrompt";
import { useIsMobile } from "./use-mobile";

interface Props {
  open?: boolean;
  onClose?: () => void;
}

export function ThreadStrip({ open, onClose }: Props) {
  const p = useProjection();
  const [intent, setIntent] = useState("");
  const isMobile = useIsMobile();
  const repoThreads = p.threads.filter((t) => t.repo === p.activeRepo);

  const narrowClass = open ? "rb-rail rb-rail--open" : "rb-rail";
  // On narrow screens, hide and block interaction when rail is closed (off-screen)
  const closedOnNarrow = isMobile && !open;

  return (
    <aside
      className={narrowClass}
      aria-hidden={closedOnNarrow ? true : undefined}
      style={closedOnNarrow ? { pointerEvents: "none" } : undefined}
    >
      {/* Close button visible when overlay is open on narrow screens */}
      {onClose && (
        <button
          className="rb-rail-toggle"
          style={{ marginBottom: 14, display: open ? "flex" : undefined }}
          onClick={onClose}
          aria-label="Close threads panel"
        >
          ✕ Close
        </button>
      )}

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
        <div className="rb-empty">
          The loop opens with a stated intent.
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
                      onClick={async () => {
                        const reason = await RuledPrompt.ask("Close reason (required):", { label: "reason" });
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
