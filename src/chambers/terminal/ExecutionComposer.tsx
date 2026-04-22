import { useState } from "react";
import type { Copy } from "./helpers";

// Terminal command input. Prompt grammar (`signal @ready/exec $`) is
// kept — the chamber still reads as an execution environment. Chamber-
// DNA tints the prompt glyph and the submit chip border so the
// command surface inherits the Terminal identity.

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
      style={{ margin: "0 clamp(20px, 5vw, 64px) 18px" }}
    >
      <div
        data-architect-voice
        style={{
          fontFamily: "var(--mono)",
          fontSize: 9,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: focused ? "var(--chamber-dna, var(--accent))" : "var(--text-ghost)",
          marginBottom: 8,
          paddingLeft: 4,
          transition: "color 0.15s",
        }}
      >
        {copy.creationInputVoice}
      </div>
      <div
        className="glass"
        style={{
          borderRadius: "var(--radius-control)",
          padding: "12px 16px",
          fontFamily: "var(--mono)",
          display: "grid",
          gridTemplateColumns: "auto auto 1fr auto auto",
          gap: 10,
          alignItems: "center",
        }}
      >
        <span style={{ color: "var(--cc-ok)", fontSize: 12 }}>signal</span>
        <span style={{ color: "var(--cc-dim)", fontSize: 12 }}>
          @{pending ? "exec" : "ready"}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--chamber-dna, var(--cc-prompt))", fontSize: 13 }}>$</span>
          <input
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            placeholder={pending ? copy.creationRunning : copy.creationPlaceholder}
            disabled={pending}
            style={{
              flex: 1,
              fontSize: 13,
              color: "var(--cc-fg)",
              fontFamily: "var(--mono)",
              opacity: pending ? 0.55 : 1,
              padding: "6px 0",
            }}
          />
          {!pending && <span className="cc-cursor" style={{ opacity: value ? 0 : 1 }} />}
        </span>
        <span
          style={{
            fontSize: 10,
            color: "var(--text-ghost)",
            letterSpacing: ".2em",
            textTransform: "uppercase",
          }}
        >
          {value.length ? `${value.length}c` : ""}
        </span>
        {value.trim() && !pending && (
          <button
            onClick={onSubmit}
            className="fadeIn"
            style={{
              background: "none",
              border: "1px solid var(--chamber-dna, var(--cc-ok))",
              color: "var(--chamber-dna, var(--cc-ok))",
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              padding: "7px 14px",
              borderRadius: "var(--radius-pill)",
              fontFamily: "var(--mono)",
              transition: "all .2s var(--ease-swift)",
              cursor: "pointer",
            }}
          >
            ↵ run
          </button>
        )}
      </div>
    </div>
  );
}
