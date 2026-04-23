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

// NextStepBar — inline cluster of operational actions after a run lands.
// Each button is a .btn-chip; tone flows via data-variant tokens on the
// shared chip primitive so the bar reads as the same vocabulary as
// every other chip in the product.
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
      <div className="kicker" data-tone="ok" style={{ marginTop: "var(--space-2)", maxWidth: 860 }}>
        {copy.actionAllDone}
      </div>
    );
  }

  return (
    <div
      className="fadeIn"
      style={{
        marginTop: "var(--space-2)",
        maxWidth: 860,
        display: "flex",
        gap: "var(--space-2)",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <span className="kicker">{copy.nextStep}</span>
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
