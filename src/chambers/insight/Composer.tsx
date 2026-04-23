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

  return (
    <div
      data-insight-composer
      data-focused={focused ? "true" : undefined}
      style={{
        margin: "0 clamp(20px, 5vw, 64px) var(--space-3)",
        background: "var(--bg-surface)",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-panel)",
        padding: "var(--space-3)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
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
      <div
        style={{
          borderRadius: "var(--radius-control)",
          border: "var(--border-mid)",
          background: "var(--bg-input)",
          padding: "10px 14px",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <span
          className={pending ? "breathe" : ""}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: pending
              ? "var(--cc-info)"
              : "color-mix(in oklab, var(--chamber-dna, var(--cc-prompt)) 80%, transparent)",
            boxShadow: `0 0 0 4px color-mix(in oklab, ${pending ? "var(--cc-info)" : "var(--chamber-dna, var(--cc-prompt))"} 22%, transparent)`,
            flexShrink: 0,
            marginTop: 10,
          }}
        />
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
            flex: 1,
            fontSize: "var(--t-body)",
            color: "var(--text-primary)",
            fontFamily: "var(--sans)",
            lineHeight: "var(--lh-body)",
            opacity: pending ? 0.55 : 1,
            padding: "6px 0",
            minHeight: 24,
            maxHeight: 180,
            resize: "none",
            background: "transparent",
            border: "none",
            outline: "none",
          }}
        />
        {value.length > 0 && (
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "var(--t-micro)",
              color: "var(--text-ghost)",
              letterSpacing: "var(--track-meta)",
              marginTop: 10,
              flexShrink: 0,
            }}
          >
            {value.length}
          </span>
        )}
      </div>
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
