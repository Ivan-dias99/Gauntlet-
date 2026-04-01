import { type FlowRun, type FlowDef } from "../dna/autonomous-flow";

interface FlowRunStripProps {
  run: FlowRun;
  def: FlowDef;
}

const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "8px",
  letterSpacing: "0.04em",
};

function statusLabel(
  stepIdx: number,
  currentIdx: number,
  runState: FlowRun["state"],
  stepResults: FlowRun["stepResults"],
  stepId: string
): string {
  const result = stepResults.find((r) => r.stepId === stepId);

  if (result) {
    if (result.outcome === "failed") return "blocked";
    if (result.outcome === "success" || result.outcome === "partial") return "done   ";
  }

  if (stepIdx === currentIdx) {
    if (runState === "running" || runState === "recovering") return "running";
    if (runState === "pending") return "pending";
  }

  if (stepIdx < currentIdx) return "done   ";
  return "pending";
}

function stepColor(
  label: string,
  stepIdx: number,
  currentIdx: number
): string {
  if (label === "blocked") return "var(--r-err)";
  if (label === "done   ") return "var(--r-dim)";
  if (stepIdx === currentIdx) return "var(--r-text)";
  return "var(--r-dim)";
}

export function FlowRunStrip({ run, def }: FlowRunStripProps) {
  return (
    <div style={{ background: "transparent" }}>
      {/* Header */}
      <div
        style={{
          ...MONO,
          textTransform: "uppercase",
          color: "var(--r-dim)",
          paddingBottom: "4px",
        }}
      >
        flow · {def.label}
      </div>

      {/* Steps */}
      {def.steps.map((step, idx) => {
        const label = statusLabel(
          idx,
          run.currentStepIdx,
          run.state,
          run.stepResults,
          step.id
        );
        const color = stepColor(label, idx, run.currentStepIdx);
        const isDone = label === "done   ";

        return (
          <div
            key={step.id}
            style={{
              ...MONO,
              color,
              display: "flex",
              gap: "4px",
              padding: "3px 0",
              textDecoration: isDone ? "line-through" : "none",
            }}
          >
            <span style={{ minWidth: "7ch", display: "inline-block" }}>
              {label}
            </span>
            <span>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
