import { useEffect, useRef, useState } from "react";

// Insight composer — single-line pressure input with submit chip.
// Stays near the bottom of the chamber; calm, no verdict theatre here.
// Disable state honest when no active mission AND first-send is not
// configured to bootstrap one (in Signal first-send always creates a
// mission, so activeMission is informational only).

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!pending) inputRef.current?.focus();
  }, [pending]);

  return (
    <div
      data-insight-composer
      data-focused={focused ? "true" : undefined}
      style={{ margin: "0 clamp(20px, 5vw, 64px) 18px" }}
    >
      <div
        data-insight-voice
        style={{
          fontFamily: "var(--mono)",
          fontSize: 9,
          letterSpacing: "var(--track-meta)",
          textTransform: "uppercase",
          color: focused ? "var(--chamber-dna, var(--accent))" : "var(--text-ghost)",
          marginBottom: 8,
          paddingLeft: 4,
          transition: "color .15s var(--ease-swift)",
        }}
      >
        {voiceLabel}
      </div>
      <div
        className="glass"
        style={{
          borderRadius: "var(--radius-control)",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
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
          }}
        />
        <input
          ref={inputRef}
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) onSubmit();
          }}
          placeholder={placeholder}
          disabled={pending}
          style={{
            flex: 1,
            fontSize: "var(--t-body)",
            color: "var(--text-primary)",
            fontFamily: "var(--sans)",
            opacity: pending ? 0.55 : 1,
            padding: "6px 0",
          }}
        />
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--text-ghost)",
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
          }}
        >
          {value.length > 0 ? `${value.length}` : ""}
        </span>
        {value.trim() && !pending && (
          <button
            onClick={onSubmit}
            className="fadeIn"
            style={{
              background: "none",
              border: "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent-dim)) 60%, transparent)",
              color: "var(--chamber-dna, var(--accent))",
              fontSize: 10,
              letterSpacing: "var(--track-meta)",
              textTransform: "uppercase",
              padding: "7px 14px",
              borderRadius: "var(--radius-pill)",
              fontFamily: "var(--mono)",
              transition: "all .2s var(--ease-swift)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "color-mix(in oklab, var(--chamber-dna, var(--accent)) 14%, transparent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Enter ↵
          </button>
        )}
      </div>
    </div>
  );
}
