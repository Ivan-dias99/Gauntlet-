import { useEffect, useRef, useState } from "react";
import type { Copy, Task } from "./helpers";

// Terminal Workbench strip — five lenses on the execution territory.
//
// Grammar: [icon] LABEL · MISSION ▾ · italic status      [Repo] [Diff] [Gates] [Deploy] [Queue]
//
// The five lenses (Repo, Diff, Gates, Deploy, Queue) live here, above
// the composer. Composer keeps the live affordances that drive the
// next execution (Context, Tools, Mode, Send). No tool is owned by
// both surfaces — Workbench narrates territory, Composer drives action.
//
// Each lens carries: icon · label · value (real if wired, "—" if not)
// and opens a flyout naming the backend contract pending. Run Queue is
// partially wired (reads mission.tasks); the others are honest "not
// wired" until the backend lands.

interface Props {
  copy: Copy;
  missionTitle: string | null;
  activeTask: Task | null;
  /** Mission tasks for Run Queue counts (real, not faked). */
  tasks?: Task[];
  onMissionMenu?: () => void;
}

type Lens = null | "repo" | "diff" | "gates" | "deploy" | "queue";

export default function WorkbenchStrip({
  copy, missionTitle, activeTask, tasks = [], onMissionMenu,
}: Props) {
  const [lens, setLens] = useState<Lens>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lens) return;
    function onDoc(e: MouseEvent) {
      const el = stripRef.current;
      if (el && !el.contains(e.target as Node)) setLens(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [lens]);

  const statusText = (() => {
    if (activeTask) {
      if (activeTask.state === "running") return copy.termStripStatusRunning;
      if (activeTask.state === "blocked") return copy.termStripStatusBlocked;
      if (activeTask.state === "done")    return copy.termStripStatusDone;
      return activeTask.title;
    }
    return copy.noActiveTask;
  })();

  const hasMission = !!missionTitle;
  const missionLabel = hasMission && missionTitle
    ? missionTitle.length > 24 ? missionTitle.slice(0, 21).trimEnd() + "…" : missionTitle
    : null;

  // Run Queue is the one wired lens — it reads real mission tasks.
  const queueCounts = (() => {
    if (!tasks.length) return { active: 0, total: 0 };
    const active = tasks.filter((t) => t.state !== "done").length;
    return { active, total: tasks.length };
  })();
  const queueValue = tasks.length
    ? `${queueCounts.active}/${queueCounts.total}`
    : copy.termWbValueIdle;

  return (
    <div ref={stripRef} className="term-workbench-strip" data-term-workbench>
      <span className="term-workbench-icon" aria-hidden>
        <IconTerminal />
      </span>
      <span className="term-workbench-label">{copy.termStripLabel}</span>

      {hasMission ? (
        <>
          <span className="term-workbench-sep" aria-hidden />
          <button
            type="button"
            className="term-workbench-mission"
            onClick={onMissionMenu}
            title={copy.switchMission}
          >
            <span className="term-workbench-mission-label">
              {copy.wbMissionLabel}
            </span>
            <span className="term-workbench-mission-value">{missionLabel}</span>
            <span className="term-workbench-mission-caret" aria-hidden>
              <IconCaret />
            </span>
          </button>
        </>
      ) : (
        <>
          <span className="term-workbench-sep" aria-hidden />
          <span className="term-workbench-mission-null">
            {copy.wbMissionNull}
          </span>
        </>
      )}

      <span className="term-workbench-sep" aria-hidden />
      <span className="term-workbench-status" title={statusText}>
        {statusText}
      </span>

      {/* Five lenses on the execution territory. Each shows
          [icon LABEL · value] — value is real when wired, idle dash
          when not. Click opens a flyout naming the backend contract. */}
      <div className="term-workbench-lenses">
        <LensButton
          icon={<IconRepo />}
          label={copy.termWbRepoLabel}
          value={copy.termWbValueIdle}
          active={lens === "repo"}
          wired={false}
          onClick={() => setLens(lens === "repo" ? null : "repo")}
        />
        <LensButton
          icon={<IconDiff />}
          label={copy.termWbDiffLabel}
          value={copy.termWbValueIdle}
          active={lens === "diff"}
          wired={false}
          onClick={() => setLens(lens === "diff" ? null : "diff")}
        />
        <LensButton
          icon={<IconGates />}
          label={copy.termWbGatesLabel}
          value={copy.termWbValueIdle}
          active={lens === "gates"}
          wired={false}
          onClick={() => setLens(lens === "gates" ? null : "gates")}
        />
        <LensButton
          icon={<IconDeploy />}
          label={copy.termWbDeployLabel}
          value={copy.termWbValueIdle}
          active={lens === "deploy"}
          wired={false}
          onClick={() => setLens(lens === "deploy" ? null : "deploy")}
        />
        <LensButton
          icon={<IconQueue />}
          label={copy.termWbQueueLabel}
          value={queueValue}
          active={lens === "queue"}
          wired={true}
          onClick={() => setLens(lens === "queue" ? null : "queue")}
        />
      </div>

      {/* Flyouts — anchored below the strip. Each carries the
          contract pending (or, for Queue, the wired posture). */}
      {lens && (
        <div className="term-workbench-flyout-anchor">
          {lens === "repo" && (
            <LensFlyout
              title={copy.termWbRepoLabel}
              body={copy.termWbRepoBody}
              contract={copy.termWbRepoContract}
              wired={false}
            />
          )}
          {lens === "diff" && (
            <LensFlyout
              title={copy.termWbDiffLabel}
              body={copy.termWbDiffBody}
              contract={copy.termWbDiffContract}
              wired={false}
            />
          )}
          {lens === "gates" && (
            <LensFlyout
              title={copy.termWbGatesLabel}
              body={copy.termWbGatesBody}
              contract={copy.termWbGatesContract}
              wired={false}
            />
          )}
          {lens === "deploy" && (
            <LensFlyout
              title={copy.termWbDeployLabel}
              body={copy.termWbDeployBody}
              contract={copy.termWbDeployContract}
              wired={false}
            />
          )}
          {lens === "queue" && (
            <LensFlyout
              title={copy.termWbQueueLabel}
              body={copy.termWbQueueBody}
              contract={copy.termWbQueueContract}
              wired={true}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ——— Lens button ———

function LensButton({
  icon, label, value, active, wired, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  active: boolean;
  wired: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="term-wb-lens"
      data-active={active ? "true" : undefined}
      data-wired={wired ? "true" : "false"}
      onClick={onClick}
      title={label}
    >
      <span className="term-wb-lens-icon" aria-hidden>{icon}</span>
      <span className="term-wb-lens-label">{label}</span>
      <span className="term-wb-lens-value">{value}</span>
    </button>
  );
}

// ——— Lens flyout ———

function LensFlyout({
  title, body, contract, wired,
}: {
  title: string;
  body: string;
  contract: string;
  wired: boolean;
}) {
  return (
    <div className="term-flyout" data-tone={wired ? undefined : "not-wired"} role="menu">
      <div className="term-flyout-head">
        <span>{title}{wired ? " · wired" : " · not wired"}</span>
      </div>
      <div className="term-flyout-body">
        <p className="term-flyout-prose">{body}</p>
        <p className="term-flyout-contract" aria-label="backend contract">
          <span className="term-flyout-contract-label">{wired ? "source" : "contract"}</span>
          <code>{contract}</code>
        </p>
      </div>
    </div>
  );
}

// ——— Unified icon set ———
// Single stroke weight, single viewbox, currentColor. Every icon used
// in this file comes from here so the glyph family is coherent.

const SVG_PROPS = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function IconTerminal() {
  return (
    <svg {...SVG_PROPS}>
      <path d="m4 9 3 3-3 3" />
      <path d="M10 15h10" />
    </svg>
  );
}
function IconCaret() {
  return (
    <svg {...SVG_PROPS} width={10} height={10}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
// Repo — git-style branch fork (sibling of the composer's IconRepo).
function IconRepo() {
  return (
    <svg {...SVG_PROPS}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="12" r="2.5" />
      <path d="M6 8.5v7" />
      <path d="M8.5 6h3a4 4 0 0 1 4 4v0" />
    </svg>
  );
}
// Diff — two stacked horizontal bars with a +/- mark; reads as
// "lines changed" without committing to a specific tool.
function IconDiff() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M5 7h10" />
      <path d="M5 12h6" />
      <path d="M5 17h10" />
      <path d="M19 9v6" />
      <path d="M16 12h6" />
    </svg>
  );
}
// Gates — checklist with a check; reads as "passes/fails".
function IconGates() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M9 11l2 2 4-4" />
      <rect x="3" y="4" width="18" height="16" rx="2" />
    </svg>
  );
}
// Deploy — upward chevron over a base line; "ship".
function IconDeploy() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M12 18V8" />
      <path d="m7 13 5-5 5 5" />
      <path d="M5 21h14" />
    </svg>
  );
}
// Queue — three stacked horizontal lines decreasing; "list of things".
function IconQueue() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M5 7h14" />
      <path d="M5 12h10" />
      <path d="M5 17h6" />
    </svg>
  );
}
