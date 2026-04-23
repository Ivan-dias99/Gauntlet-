import { useEffect, useRef, useState } from "react";

// Insight composer — multi-line pressure input with submit chip.
// Stays anchored at the bottom of the chamber; calm gravity, no verdict
// theatre here. Enter submits; Shift+Enter inserts a newline. Auto-grow
// bounded so the thread above stays visible even with long prompts.

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  pending: boolean;
  placeholder: string;
  voiceLabel: string;
}

export default function Composer({
  value, onChange, onSubmit, pending, placeholder, voiceLabel,
}: Props) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!pending) inputRef.current?.focus();
  }, [pending]);

  // Auto-grow the textarea within reasonable bounds — same pattern as
  // Surface's CreationPanel. Caps at 180px so the thread above stays
  // visible even with long prompts.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [value]);

  const canSubmit = value.trim().length > 0 && !pending;

  // Panel border tint: chamber-DNA on focus, soft otherwise. Keeps the
  // composer reactive to focus without relying on the textarea's own
  // outline (which we suppress for visual calm).
  const panelBorder = focused
    ? "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 55%, var(--border))"
    : "var(--border-soft)";

  return (
    <div
      data-insight-composer
      data-focused={focused ? "true" : undefined}
      style={{
        margin: "0 clamp(20px, 5vw, 64px) var(--space-3)",
        background: "var(--bg-surface)",
        border: panelBorder,
        borderRadius: "var(--radius-panel)",
        padding: "var(--space-3)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
        transition: "border-color .15s var(--ease-swift)",
      }}
    >
      <div
        data-insight-voice
        style={{
          fontFamily: "var(--mono)",
          fontSize: "var(--t-micro)",
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: focused ? "var(--chamber-dna, var(--accent))" : "var(--text-ghost)",
          transition: "color .15s var(--ease-swift)",
        }}
      >
        {voiceLabel}
      </div>
      <textarea
        ref={inputRef}
        autoFocus
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!pending) onSubmit();
          }
        }}
        placeholder={placeholder}
        disabled={pending}
        style={{
          width: "100%",
          fontSize: "var(--t-body)",
          color: "var(--text-primary)",
          fontFamily: "var(--sans)",
          lineHeight: "var(--lh-body)",
          opacity: pending ? 0.55 : 1,
          padding: "6px 0",
          minHeight: 28,
          maxHeight: 180,
          resize: "none",
          background: "transparent",
          border: "none",
          outline: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
        }}
      >
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="btn-chip"
          data-variant="sans"
          style={{ opacity: canSubmit ? 1 : 0.45 }}
        >
          {pending ? "a processar…" : "enviar ↵"}
        </button>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-micro)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          enter envia · shift+enter nova linha
        </span>
      </div>
    </div>
  );
}
