// Wave P-36 — Empty-state primitive.
//
// Every "nothing here yet" surface in the shell shares the same shape:
// one ASCII glyph (no decorative emoji, no icon font), one terse line
// of body copy, and an optional CTA. Voice rules live at
// docs/EMPTY_STATES.md — factual present, no exclamation marks, no
// apologetic interjections; the chamber background is loud enough.
//
// This is the canonical primitive for the new wave. The legacy
// `src/shell/EmptyState.tsx` (kicker/body/hint shape) is left intact
// because it has its own visual contract; new code should import from
// `src/shell/states` instead.

import type { CSSProperties } from "react";

interface Props {
  /** Single ASCII glyph (e.g. "○", "·", "↪"). Decorative; aria-hidden. */
  glyph: string;
  /** One short factual sentence. No exclamation marks, no greetings. */
  message: string;
  /** Optional CTA label — short verb phrase, lowercase. */
  actionLabel?: string;
  /** Click handler for the CTA. Required when `actionLabel` is set. */
  onAction?: () => void;
  /** Optional outer style overrides (margins, max-width). */
  style?: CSSProperties;
}

export default function EmptyState({
  glyph,
  message,
  actionLabel,
  onAction,
  style,
}: Props) {
  const hasCta = Boolean(actionLabel && onAction);
  return (
    <div
      data-state="empty"
      role="status"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: "var(--space-4)",
        textAlign: "center",
        color: "var(--text-muted)",
        ...style,
      }}
    >
      <div
        aria-hidden
        data-empty-glyph
        style={{
          fontFamily: "var(--mono)",
          fontSize: 28,
          lineHeight: 1,
          color: "var(--text-ghost)",
          userSelect: "none",
        }}
      >
        {glyph}
      </div>
      <div
        data-empty-message
        style={{
          fontFamily: "var(--serif)",
          fontSize: 14.5,
          lineHeight: 1.45,
          color: "var(--text-muted)",
          letterSpacing: "-0.005em",
          maxWidth: 480,
        }}
      >
        {message}
      </div>
      {hasCta && (
        <button
          type="button"
          data-empty-action
          onClick={onAction}
          style={{
            marginTop: 4,
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
            padding: "5px 12px",
            borderRadius: "var(--radius-pill)",
            border: "1px solid var(--border-color-mid)",
            background: "var(--bg-input)",
            color: "var(--text-primary)",
            cursor: "pointer",
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
