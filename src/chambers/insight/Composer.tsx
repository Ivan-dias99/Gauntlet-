import { useEffect, useRef, useState } from "react";

// Insight composer — calm inscription surface, not a form. Built on the
// shared .command-bay primitive: voice kicker + textarea + minimal
// action row. No shadow lift on focus (the rail's live band carries the
// working pulse); the composer just tints its border with chamber-DNA
// and stays quiet.
//
// Enter submits; Shift+Enter inserts a newline. Auto-grow bounded so
// the thread above stays visible even with long prompts.

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

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const canSubmit = value.trim().length > 0 && !pending;

  return (
    <div
      data-insight-composer
      className="command-bay"
      data-focused={focused ? "true" : undefined}
      data-disabled={pending ? "true" : undefined}
    >
      <div className="command-bay-voice">
        <span className="status-dot" data-tone={focused ? "accent" : "ghost"} />
        <span>{voiceLabel}</span>
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
        className="command-bay-input"
      />
      <div className="command-bay-actions">
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="btn-chip"
          data-variant={canSubmit ? "ok" : "sans"}
          style={{ opacity: canSubmit ? 1 : 0.45 }}
        >
          {pending ? "a processar…" : "perguntar ↵"}
        </button>
        {focused && !pending && (
          <span
            className="command-bay-hint"
            style={{ marginLeft: "auto" }}
          >
            ⇧↵ nova linha
          </span>
        )}
      </div>
    </div>
  );
}
