import { useState } from "react";
import type { Copy } from "./helpers";

// Terminal command input — built on the shared .command-bay primitive
// with data-voice="exec" so the Terminal identity (mono typeface,
// chamber-DNA prompt glyph) is preserved while the geometry matches
// Insight's composer and Core's inscription surface.

interface Props {
  copy: Copy;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  pending: boolean;
}

export default function ExecutionComposer({
  copy, value, onChange, onSubmit, pending,
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      data-architect-input="comando"
      data-architect-input-state={focused ? "focused" : "idle"}
      style={{
        margin: "0 clamp(20px, 5vw, 64px) var(--space-3)",
      }}
    >
      <div
        className="command-bay"
        data-focused={focused ? "true" : undefined}
        data-disabled={pending ? "true" : undefined}
      >
        <div className="command-bay-voice">
          <span className="status-dot" data-tone={focused ? "accent" : pending ? "info" : "ghost"} />
          <span>{copy.creationInputVoice}</span>
          <span className="kicker" data-tone="ghost" style={{ marginLeft: "auto" }}>
            signal <span style={{ color: "var(--text-muted)" }}>@{pending ? "exec" : "ready"}</span>
          </span>
        </div>

        <div className="command-bay-row">
          <span className="command-bay-prompt">$</span>
          <input
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            placeholder={pending ? copy.creationRunning : copy.creationPlaceholder}
            disabled={pending}
            className="command-bay-input"
            data-voice="exec"
            style={{ opacity: pending ? 0.55 : 1 }}
          />
          {!pending && <span className="cc-cursor" style={{ opacity: value ? 0 : 1 }} />}
        </div>

        <div className="command-bay-actions">
          {value.trim() && !pending ? (
            <button onClick={onSubmit} className="btn-chip" data-variant="ok">
              ↵ run
            </button>
          ) : (
            <span className="command-bay-hint">
              enter envia · tarefa vira comando
            </span>
          )}
          {value.length > 0 && (
            <span className="kicker" data-tone="ghost" style={{ marginLeft: "auto" }}>
              {value.length}c
            </span>
          )}
        </div>

        {pending && <div className="thinking-strip" aria-hidden />}
      </div>
    </div>
  );
}
