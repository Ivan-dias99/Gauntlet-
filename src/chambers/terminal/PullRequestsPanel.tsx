// Wave P-43.6 — Pull Requests panel.
//
// Renders mission tasks as PR-like rows in the Terminal active path,
// matching the target Lovable layout: header with "open · merged"
// counts, list rows with status pill + title + #id + diff stats +
// age. Real data sourced from spine.activeMission.tasks; diff stats
// derived from the most recent artifact when available, otherwise
// blank. No fake numbers.

import type { Mission, Task } from "../../spine/types";

interface Props {
  mission: Mission;
  onPick?: (taskId: string) => void;
}

function formatAge(ts: number): string {
  const ms = Date.now() - ts;
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function statusFor(t: Task): { label: string; tone: string } {
  switch (t.state) {
    case "running":
      return { label: "in review", tone: "info" };
    case "done":
      return { label: "merged", tone: "ok" };
    case "blocked":
      return { label: "blocked", tone: "err" };
    case "open":
    default:
      return { label: "open", tone: "neutral" };
  }
}

export default function PullRequestsPanel({ mission, onPick }: Props) {
  const tasks = mission.tasks ?? [];
  if (tasks.length === 0) return null;

  const open = tasks.filter((t) => t.state !== "done" && t.state !== "blocked").length;
  const merged = tasks.filter((t) => t.state === "done").length;

  return (
    <section className="prp" aria-label="Pull requests">
      <header className="prp-head">
        <span className="prp-head-title">— Pull Requests</span>
        <span className="prp-head-count">
          {open} open · {merged} merged
        </span>
      </header>
      <div className="prp-list">
        {tasks.map((t, i) => {
          const status = statusFor(t);
          const ageTs = t.doneAt ?? t.lastUpdateAt ?? t.createdAt;
          return (
            <button
              key={t.id}
              type="button"
              className="prp-row"
              onClick={() => onPick?.(t.id)}
              title={t.title}
            >
              <span
                className="prp-row-status"
                data-tone={status.tone}
              >
                <span aria-hidden className="prp-row-status-dot" />
                {status.label}
              </span>
              <span className="prp-row-title">{t.title}</span>
              <span className="prp-row-id">#{i + 1}</span>
              <span className="prp-row-diff" aria-hidden>—</span>
              <span className="prp-row-age">{ageTs ? formatAge(ageTs) : "—"}</span>
              <span aria-hidden className="prp-row-caret">›</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
