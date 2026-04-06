// Ruberra — Thread ledger, repo-scoped. Always resident in the shell.
// On narrow screens: rendered as an overlay rail; open/onClose driven by Shell.

import { useState } from "react";
import { useProjection, emit } from "../spine/store";
import { RuledPrompt } from "../trust/RuledPrompt";
import { useIsMobile } from "../../app/components/ui/use-mobile";

interface Props {
  open?: boolean;
  onClose?: () => void;
}

const CHAMBER_ACCENT: Record<string, string> = {
  lab: "rgba(82, 121, 106, 0.75)",
  school: "rgba(74, 107, 132, 0.75)",
  creation: "rgba(138, 98, 56, 0.75)",
};

const STATE_LABEL: Record<string, string> = {
  open: "open",
  draft: "draft",
  "directive-pending": "pending",
  executing: "executing",
  "awaiting-review": "review",
  closed: "closed",
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

export function ThreadStrip({ open, onClose }: Props) {
  const p = useProjection();
  const [intent, setIntent] = useState("");
  const isMobile = useIsMobile();
  const repoThreads = p.threads.filter((t) => t.repo === p.activeRepo);
  const activeAccent = CHAMBER_ACCENT[p.chamber] ?? "var(--rb-accent-soft)";

  const narrowClass = open ? "rb-rail rb-rail--open" : "rb-rail";
  const closedOnNarrow = isMobile && !open;

  return (
    <aside
      className={narrowClass}
      aria-hidden={closedOnNarrow ? true : undefined}
      style={closedOnNarrow ? { pointerEvents: "none" } : undefined}
    >
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

      {/* Rail header with live thread count */}
      <div className="rb-threads-header">
        <h3 className="rb-section-title">Threads</h3>
        {repoThreads.length > 0 && (
          <span className="rb-threads-count">{repoThreads.length}</span>
        )}
      </div>

      {/* Intent form — scope-opening entrance */}
      <div style={{ marginBottom: 16 }}>
        <label className="rb-field-label" style={{ marginBottom: 6 }}>Intent</label>
        <textarea
          className="rb-intent-input"
          placeholder="state the scope of this thread..."
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
        />
        <button
          className="rb-btn primary"
          disabled={!intent.trim()}
          style={{ marginTop: 8, width: "100%", boxSizing: "border-box" }}
          onClick={async () => {
            await emit.openThread(intent.trim());
            setIntent("");
          }}
        >
          Open Thread
        </button>
      </div>

      {/* Thread list */}
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
            .map((t) => {
              const dirCount = p.directives.filter((d) => d.thread === t.id).length;
              const artCount = p.artifacts.filter((a) => a.thread === t.id).length;
              const statParts: string[] = [
                timeAgo(t.openedAt),
                STATE_LABEL[t.state] ?? t.state,
              ];
              if (dirCount > 0) statParts.push(`${dirCount} dir`);
              if (artCount > 0) statParts.push(`${artCount} art`);

              const isActive = p.activeThread === t.id;

              return (
                <div
                  key={t.id}
                  className={`rb-thread${isActive ? " active" : ""}`}
                  data-state={t.state}
                  style={
                    isActive
                      ? { borderLeftColor: activeAccent, borderLeftWidth: "3px" }
                      : undefined
                  }
                >
                  <div className="rb-thread-intent">{t.intent}</div>
                  <div className="rb-thread-meta">
                    <span className="rb-thread-state-dot" />
                    <span className="rb-thread-meta-text">
                      {statParts.join(" · ")}
                    </span>
                    {t.status === "open" && isActive && (
                      <button
                        className="rb-thread-close-btn"
                        onClick={async () => {
                          const reason = await RuledPrompt.ask(
                            "Close reason (required):",
                            { label: "reason" },
                          );
                          if (reason && reason.trim())
                            emit.closeThread(t.id, reason.trim());
                        }}
                      >
                        close
                      </button>
                    )}
                  </div>
                  {t.closeReason && (
                    <div className="rb-thread-close-reason">{t.closeReason}</div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </aside>
  );
}
