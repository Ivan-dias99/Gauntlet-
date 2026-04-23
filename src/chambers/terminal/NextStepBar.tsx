import type { Copy } from "./helpers";

type Tone = "accent" | "info" | "warn" | "err";

interface Props {
  hasNextOpen: boolean;
  canRefine: boolean;
  canBlock: boolean;
  isBlocked: boolean;
  copy: Copy;
  onNext: () => void;
  onRefine: () => void;
  onBlock: () => void;
  onReopen: () => void;
}

// NextStepBar — inline actions after a run lands. Renders on the same
// canvas rhythm as RunCanvas so the eye doesn't jump to a separate
// block. Uses the .term-canvas-foot geometry (hairline above, chips
// inline) already defined in tokens.css.
export default function NextStepBar({
  hasNextOpen, canRefine, canBlock, isBlocked, copy,
  onNext, onRefine, onBlock, onReopen,
}: Props) {
  const buttons: Array<{ label: string; onClick: () => void; tone: Tone }> = [];
  if (hasNextOpen) buttons.push({ label: copy.actionNextTask, onClick: onNext, tone: "accent" });
  if (canRefine) buttons.push({ label: copy.actionRefine, onClick: onRefine, tone: "info" });
  if (isBlocked) {
    buttons.push({ label: copy.actionUnblock, onClick: onReopen, tone: "warn" });
  } else if (canBlock) {
    buttons.push({ label: copy.actionBlock, onClick: onBlock, tone: "err" });
  }

  if (buttons.length === 0) {
    return (
      <div
        className="term-canvas-foot"
        style={{
          maxWidth: 860,
          margin: "0 auto",
          borderTop: "1px dashed var(--border-color-soft)",
          paddingTop: 10,
        }}
      >
        <span className="kicker" data-tone="ok">{copy.actionAllDone}</span>
      </div>
    );
  }

  return (
    <div
      className="fadeIn term-canvas-foot"
      style={{
        maxWidth: 860,
        margin: "0 auto",
        borderTop: "1px dashed var(--border-color-soft)",
        paddingTop: 10,
      }}
    >
      <span className="kicker" data-tone="ghost">{copy.nextStep}</span>
      {buttons.map((b, i) => {
        const color =
          b.tone === "accent" ? "var(--chamber-dna, var(--accent))" :
          b.tone === "info" ? "var(--cc-info)" :
          b.tone === "warn" ? "var(--cc-warn)" : "var(--cc-err)";
        return (
          <button
            key={i}
            onClick={b.onClick}
            className="btn-chip"
            style={{
              color,
              borderColor: `color-mix(in oklab, ${color} 40%, transparent)`,
            }}
          >
            {b.label}
          </button>
        );
      })}
    </div>
  );
}
