// Ruberra — Left work navigation: threads access, continue-where-you-left-off,
// chamber regime switches. Complements ThreadStrip (ledger) as operator rail.

import { useProjection, emit } from "../spine/store";

const CHAMBERS: Array<{
  id: "lab" | "school" | "creation" | "memory";
  label: string;
  short: string;
  gravity: string;
}> = [
  { id: "creation", label: "Creation", short: "Forge", gravity: "forge" },
  { id: "lab", label: "Lab", short: "Lab", gravity: "validation" },
  { id: "school", label: "School", short: "School", gravity: "truth" },
  { id: "memory", label: "Memory", short: "Memory", gravity: "substrate" },
];

export function WorkNavRail({ onOpenThreads }: { onOpenThreads: () => void }) {
  const p = useProjection();
  const activeThread = p.threads.find((t) => t.id === p.activeThread);
  const repoThreads = p.threads.filter((t) => t.repo === p.activeRepo);
  const openThreads = repoThreads.filter((t) => t.status === "open" && !t.archived);
  const pendingReview = p.artifacts.filter(
    (a) =>
      a.review === "pending" &&
      (!p.activeThread || a.thread === p.activeThread) &&
      p.threads.some((t) => t.id === a.thread && t.status === "open"),
  ).length;

  return (
    <aside className="rb-work-nav" aria-label="Work navigation">
      <div className="rb-work-nav-head">
        <span className="rb-work-nav-kicker">Workstation</span>
        <span className="rb-work-nav-repo" title={p.activeRepo ?? ""}>
          {p.activeRepo ? p.activeRepo.split("/").pop() ?? p.activeRepo : "unbound"}
        </span>
      </div>

      <button type="button" className="rb-work-nav-threads-btn" onClick={onOpenThreads}>
        <span className="rb-work-nav-threads-label">Threads</span>
        <span className="rb-work-nav-threads-count">{openThreads.length}</span>
      </button>

      {activeThread ? (
        <div className="rb-work-nav-continue">
          <div className="rb-work-nav-continue-label">Continue</div>
          <div className="rb-work-nav-thread-line">
            <span className={`rb-work-nav-pulse${activeThread.state === "executing" ? " rb-work-nav-pulse--live" : ""}`} aria-hidden />
            <p className="rb-work-nav-intent">
              {activeThread.intent.length > 120 ? activeThread.intent.slice(0, 120) + "…" : activeThread.intent}
            </p>
          </div>
          <div className="rb-work-nav-meta">
            <span className="rb-work-nav-state">{activeThread.state}</span>
            {pendingReview > 0 && (
              <span className="rb-work-nav-pending">{pendingReview} review</span>
            )}
          </div>
        </div>
      ) : (
        <div className="rb-work-nav-idle">
          <span className="rb-work-nav-idle-title">No active thread</span>
          <span className="rb-work-nav-idle-hint">Open the thread rail and start or resume work.</span>
        </div>
      )}

      <nav className="rb-work-nav-regimes" aria-label="Chamber regimes">
        {CHAMBERS.map((c) => (
          <button
            key={c.id}
            type="button"
            data-chamber={c.id}
            data-gravity={c.gravity}
            className={`rb-work-nav-regime${p.chamber === c.id ? " active" : ""}`}
            onClick={() => emit.enterChamber(c.id)}
          >
            <span className="rb-work-nav-regime-short">{c.short}</span>
            <span className="rb-work-nav-regime-label">{c.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
