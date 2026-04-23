import type { Copy, Task } from "./helpers";

// Terminal workbench strip — thin paper-like bar under the chamber
// head. Single row: icon · WORKBENCH · mission dropdown · italic
// status · right-side utility actions (CONTEXT / DOCS). Never the
// loudest thing on the page — subtle, elegant, operational.

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
      if (activeTask.state === "running") return "Task running — streaming execution.";
      if (activeTask.state === "blocked") return "Task blocked — reopen or next.";
      if (activeTask.state === "done") return "Task complete — result sealed.";
      return activeTask.title;
    }
    return copy.noActiveTask;
  })();

  const missionLabel = missionTitle
    ? missionTitle.length > 24 ? missionTitle.slice(0, 21).trimEnd() + "…" : missionTitle
    : "—";

  return (
    <div className="term-workbench-strip" data-term-workbench>
      <span className="term-workbench-icon" aria-hidden>&gt;_</span>
      <span className="term-workbench-label">{copy.workbench}</span>
      <span className="term-workbench-sep" aria-hidden />
      <button
        type="button"
        className="term-workbench-mission"
        onClick={onMissionMenu}
        title="trocar missão"
      >
        <span className="term-workbench-mission-label">missão</span>
        <span className="term-workbench-mission-value">{missionLabel}</span>
        <span className="term-workbench-mission-caret" aria-hidden>▾</span>
      </button>
      <span className="term-workbench-sep" aria-hidden />
      <span className="term-workbench-status" title={statusText}>
        {statusText}
      </span>
      <div className="term-workbench-actions">
        <button
          type="button"
          className="term-workbench-action"
          onClick={onContext}
          title="contexto ativo da missão"
        >
          <span className="term-workbench-action-glyph" aria-hidden>⚑</span>
          context
        </button>
        <button
          type="button"
          className="term-workbench-action"
          onClick={onDocs}
          title="documentação desta câmara"
        >
          <span className="term-workbench-action-glyph" aria-hidden>⌘</span>
          docs
        </button>
      </div>
    </div>
  );
}
