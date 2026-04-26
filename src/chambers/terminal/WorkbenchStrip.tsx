import type { Copy, Task } from "./helpers";

// Terminal workbench strip — thin paper bar under the chamber head.
// Grammar: [icon] LABEL · mission (when present) · italic status ·
// right-side utility actions with unified SVG icon set. Copy flows
// from the catalog so the strip speaks one language.

interface Props {
  copy: Copy;
  missionTitle: string | null;
  activeTask: Task | null;
  onMissionMenu?: () => void;
  onContext?: () => void;
  onDocs?: () => void;
}

export default function WorkbenchStrip({
  copy, missionTitle, activeTask, onMissionMenu, onContext, onDocs,
}: Props) {
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

  return (
    <div className="term-workbench-strip" data-term-workbench>
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
              {copy.termStripMissionLabel}
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
            {copy.termStripMissionNull}
          </span>
        </>
      )}

      <span className="term-workbench-sep" aria-hidden />
      <span className="term-workbench-status" title={statusText}>
        {statusText}
      </span>

      <div className="term-workbench-actions">
        <button
          type="button"
          className="term-workbench-action"
          onClick={onContext}
          disabled={!onContext}
          title={
            onContext
              ? copy.termStripContext
              : `${copy.termStripContext} · indisponível neste contexto`
          }
        >
          <IconContext />
          <span>{copy.termStripContext}</span>
        </button>
        <button
          type="button"
          className="term-workbench-action"
          onClick={onDocs}
          disabled={!onDocs}
          title={
            onDocs
              ? copy.termStripDocs
              : `${copy.termStripDocs} · indisponível neste contexto`
          }
        >
          <IconDocs />
          <span>{copy.termStripDocs}</span>
        </button>
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
function IconContext() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IconDocs() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}
