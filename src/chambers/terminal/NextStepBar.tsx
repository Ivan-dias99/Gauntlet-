import type { Copy } from "./helpers";

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

export default function NextStepBar({
  hasNextOpen, canRefine, canBlock, isBlocked, copy,
  onNext, onRefine, onBlock, onReopen,
}: Props) {
  const buttons: Array<{ label: string; onClick: () => void; color: string }> = [];
  if (hasNextOpen) buttons.push({ label: copy.actionNextTask, onClick: onNext, color: "var(--chamber-dna, var(--accent))" });
  if (canRefine) buttons.push({ label: copy.actionRefine, onClick: onRefine, color: "var(--cc-info)" });
  if (isBlocked) {
    buttons.push({ label: copy.actionUnblock, onClick: onReopen, color: "var(--cc-warn)" });
  } else if (canBlock) {
    buttons.push({ label: copy.actionBlock, onClick: onBlock, color: "var(--cc-err)" });
  }

  if (buttons.length === 0) {
    return (
      <div
        style={{
          marginTop: 8,
          maxWidth: 820,
          fontFamily: "var(--mono)",
          fontSize: 10,
          color: "var(--cc-ok)",
          letterSpacing: "var(--track-meta)",
          textTransform: "uppercase",
        }}
      >
        {copy.actionAllDone}
      </div>
    );
  }

  return (
    <div
      className="fadeIn"
      style={{
        marginTop: 8,
        maxWidth: 820,
        display: "flex",
        gap: 10,
        alignItems: "center",
        flexWrap: "wrap",
        fontFamily: "var(--mono)",
      }}
    >
      <span
        style={{
          fontSize: 9,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "var(--text-ghost)",
        }}
      >
        {copy.nextStep}
      </span>
      {buttons.map((b, i) => (
        <button
          key={i}
          onClick={b.onClick}
          style={{
            background: "none",
            border: `1px solid ${b.color}`,
            color: b.color,
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            padding: "6px 12px",
            borderRadius: "var(--radius-pill)",
            fontFamily: "var(--mono)",
            cursor: "pointer",
            transition: "background .15s var(--ease-swift)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `color-mix(in oklab, ${b.color} 10%, transparent)`;
          }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}
