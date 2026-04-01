import {
  CHAMBER_TASKS,
  TASK_LABELS,
  getModelPool,
  type ChamberTab,
  type TaskType,
} from "./model-orchestration";

interface ModelSelectorProps {
  chamber: ChamberTab;
  task: TaskType;
  modelId: string;
  onTaskChange: (task: TaskType) => void;
  onModelChange: (modelId: string) => void;
  mode: "chat" | "terminal";
}

export function ModelSelector({ chamber, task, modelId, onTaskChange, onModelChange, mode }: ModelSelectorProps) {
  const pool = getModelPool(chamber);
  const tasks = CHAMBER_TASKS[chamber];
  const selectedModel = pool.find((m) => m.id === modelId);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
      <select
        value={task}
        onChange={(e) => onTaskChange(e.target.value as TaskType)}
        style={selectStyle(mode)}
      >
        {tasks.map((t) => (
          <option key={t} value={t}>{TASK_LABELS[t]}</option>
        ))}
      </select>

      <select
        value={modelId}
        onChange={(e) => onModelChange(e.target.value)}
        style={selectStyle(mode)}
      >
        {pool.map((m) => (
          <option key={m.id} value={m.id} disabled={m.unavailable}>
            {m.label}{m.unavailable ? " · unavailable" : ""}
          </option>
        ))}
      </select>

      {selectedModel && (
        <span style={badgeStyle(mode, !!selectedModel.unavailable)}>
          {selectedModel.provider}
        </span>
      )}
    </div>
  );
}

function selectStyle(mode: "chat" | "terminal") {
  return {
    height: "22px",
    borderRadius: "5px",
    border: mode === "terminal" ? "1px solid #2a2522" : "1px solid var(--r-border)",
    background: mode === "terminal" ? "#131110" : "var(--r-surface)",
    color: mode === "terminal" ? "#8b8278" : "var(--r-subtext)",
    fontFamily: "monospace",
    fontSize: "9px",
    letterSpacing: "0.04em",
    padding: "0 8px",
    outline: "none",
    maxWidth: "170px",
  } as const;
}

function badgeStyle(mode: "chat" | "terminal", unavailable: boolean) {
  return {
    fontFamily: "monospace",
    fontSize: "8px",
    letterSpacing: "0.09em",
    textTransform: "uppercase" as const,
    color: unavailable ? "var(--r-err)" : mode === "terminal" ? "#5a5450" : "var(--r-dim)",
    border: mode === "terminal" ? "1px solid #252220" : "1px solid var(--r-border)",
    borderRadius: "999px",
    padding: "2px 7px",
  };
}
