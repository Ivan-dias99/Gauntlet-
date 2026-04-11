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

type StatusFilter = "all" | "open" | "closed" | "archived";

export function ThreadStrip({ open, onClose }: Props) {
  const p = useProjection();
  const [intent, setIntent] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const isMobile = useIsMobile();
  const repoThreads = p.threads.filter((t) => t.repo === p.activeRepo);
  const activeAccent = CHAMBER_ACCENT[p.chamber] ?? "var(--rb-accent-soft)";

  // Filtered threads — search + status filter
  // Default "all" hides archived; explicit "archived" shows only archived
  const filteredThreads = repoThreads.filter((t) => {
    if (statusFilter === "all" && t.archived) return false;
    if (statusFilter === "open" && (t.status !== "open" || t.archived)) return false;
    if (statusFilter === "closed" && (t.status !== "closed" || t.archived)) return false;
    if (statusFilter === "archived" && !t.archived) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!t.intent.toLowerCase().includes(q)) return false;
    }
    return true;
  });

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
            // Auto-route: opening a thread enters Creation so the architect
            // lands directly where the first directive is composed.
            if (p.chamber !== "creation") {
              await emit.enterChamber("creation");
            }
            setIntent("");
          }}
        >
          Open Thread
        </button>
      </div>

      {/* Thread search + filter */}
      {repoThreads.length > 2 && (
        <div className="rb-threads-filter">
          <input
            className="rb-threads-search"
            placeholder="search threads…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="rb-threads-status-filter">
            {(["all", "open", "closed", "archived"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                className={`rb-threads-filter-btn${statusFilter === s ? " active" : ""}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Thread list */}
      {repoThreads.length === 0 ? (
        <div className="rb-unavail">
          <strong>no threads</strong>
        </div>
      ) : filteredThreads.length === 0 ? (
        <div className="rb-unavail">
          <strong>no matches</strong>
        </div>
      ) : (
        <div>
          {filteredThreads
            .slice()
            .reverse()
            .map((t) => {
              const dirCount = p.directives.filter((d) => d.thread === t.id).length;
              const artCount = p.artifacts.filter((a) => a.thread === t.id).length;
              const execCount = p.executions.filter((x) => x.thread === t.id).length;
              const committedCount = p.artifacts.filter((a) => a.thread === t.id && a.committed).length;
              const statParts: string[] = [
                timeAgo(t.openedAt),
                STATE_LABEL[t.state] ?? t.state,
              ];
              if (dirCount > 0) statParts.push(`${dirCount} dir`);
              if (artCount > 0) statParts.push(`${artCount} art`);

              const isActive = p.activeThread === t.id;
              const canActivate = t.status === "open" && !isActive;
              const activate = () => {
                if (canActivate) emit.activateThread(t.id);
              };

              return (
                <div
                  key={t.id}
                  className={`rb-thread${isActive ? " active" : ""}${t.status === "closed" ? " rb-thread--closed" : ""}`}
                  data-state={t.state}
                  style={
                    isActive
                      ? { borderLeftColor: activeAccent, borderLeftWidth: "3px" }
                      : undefined
                  }
                  role={canActivate ? "button" : undefined}
                  tabIndex={canActivate ? 0 : undefined}
                  aria-pressed={isActive || undefined}
                  onClick={canActivate ? activate : undefined}
                  onKeyDown={
                    canActivate
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            activate();
                          }
                        }
                      : undefined
                  }
                >
                  {/* Lineage indicator — shows parent thread if this was forked */}
                  {t.parentThread && (() => {
                    const parent = p.threads.find((pt) => pt.id === t.parentThread);
                    return parent ? (
                      <div className="rb-thread-lineage">
                        ↳ from: {parent.intent.length > 28 ? parent.intent.slice(0, 28) + "…" : parent.intent}
                      </div>
                    ) : null;
                  })()}
                  <div className="rb-thread-intent">{t.intent}</div>
                  <div className="rb-thread-meta">
                    <span className="rb-thread-state-dot" />
                    <span className="rb-thread-meta-text">
                      {statParts.join(" · ")}
                    </span>
                    {t.status === "open" && isActive && (
                      <button
                        className="rb-thread-close-btn"
                        onClick={async (e) => {
                          e.stopPropagation();
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
                    {t.status === "open" && isActive && (
                      <button
                        className="rb-thread-close-btn"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const childIntent = await RuledPrompt.ask(
                            "Child thread intent:",
                            { label: "intent" },
                          );
                          if (childIntent && childIntent.trim())
                            emit.openThread(childIntent.trim(), t.id);
                        }}
                      >
                        fork
                      </button>
                    )}
                    {t.status === "closed" && !t.archived && (
                      <button
                        className="rb-thread-close-btn"
                        onClick={() => emit.archiveThread(t.id)}
                      >
                        archive
                      </button>
                    )}
                  </div>
                  {/* Consequence density — show what this thread has produced */}
                  {(dirCount > 0 || artCount > 0 || execCount > 0) && (
                    <div className="rb-thread-consequence">
                      {dirCount > 0 && (
                        <span className="rb-thread-consequence-cell" data-kind="directive" title={`${dirCount} directives`}>
                          {dirCount} dir
                        </span>
                      )}
                      {execCount > 0 && (
                        <span className="rb-thread-consequence-cell" data-kind="execution" title={`${execCount} executions`}>
                          {execCount} exec
                        </span>
                      )}
                      {artCount > 0 && (
                        <span className="rb-thread-consequence-cell" data-kind="artifact" title={`${artCount} artifacts`}>
                          {artCount} art
                        </span>
                      )}
                      {committedCount > 0 && (
                        <span className="rb-thread-consequence-cell" data-kind="committed" title={`${committedCount} committed`}>
                          {committedCount} ✓
                        </span>
                      )}
                    </div>
                  )}
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
