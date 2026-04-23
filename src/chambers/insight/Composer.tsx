import { useEffect, useRef, useState } from "react";

// Insight composer — command-bay primitive variant "ask". Auto-grows the
// textarea so the thread above keeps its reading width. Chamber-DNA
// cascades through the shared .command-bay rule; no local tint logic.

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
          data-variant="sans"
          style={{ opacity: canSubmit ? 1 : 0.45 }}
        >
          {pending ? "a processar…" : "perguntar ↵"}
        </button>
        <span className="command-bay-hint">
          enter envia · shift+enter nova linha
        </span>
      </div>
      {pending && <div className="thinking-strip" aria-hidden />}
    </div>
  );
}
