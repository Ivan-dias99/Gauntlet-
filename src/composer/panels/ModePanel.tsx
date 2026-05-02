// Wave 1 — generic mode card used for the 8 panels surrounding the
// central Compose canvas. Each card carries the mode label, a single-line
// blurb, and a tone-coded badge: "live" when wired in this wave,
// "Wave 2+" when the mode is visual-only.
//
// Clicking a card switches the active mode in ComposerLayout. For non-live
// modes, the central canvas swaps to a placeholder explaining what lands
// when the mode ships.

import type { CSSProperties, ReactNode } from "react";
import type { ComposerMode, ModeDescriptor } from "../types";
import Pill from "../../components/atoms/Pill";

interface Props {
  mode: ModeDescriptor;
  active: ComposerMode;
  onSelect: (id: ComposerMode) => void;
  glyph?: ReactNode;
}

const cardStyle = (isActive: boolean, isLive: boolean): CSSProperties => ({
  background: isActive
    ? "color-mix(in oklab, var(--accent, #4a7cff) 14%, var(--bg-surface))"
    : "var(--bg-surface)",
  border: isActive
    ? "1px solid color-mix(in oklab, var(--accent, #4a7cff) 60%, transparent)"
    : "var(--border-soft)",
  borderRadius: "var(--radius-md, 8px)",
  padding: "14px 16px",
  textAlign: "left",
  width: "100%",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  gap: 8,
  color: "var(--text-primary)",
  fontFamily: "var(--sans)",
  transition: "background var(--motion-duration-fast, 120ms), border-color var(--motion-duration-fast, 120ms)",
  opacity: isLive ? 1 : 0.85,
});

export default function ModePanel({ mode, active, onSelect, glyph }: Props) {
  const isActive = mode.id === active;
  return (
    <button
      type="button"
      onClick={() => onSelect(mode.id)}
      style={cardStyle(isActive, mode.live)}
      data-mode={mode.id}
      data-active={isActive}
    >
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-meta)",
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          {mode.label}
        </span>
        {mode.live ? (
          <Pill tone="ok">live</Pill>
        ) : (
          <Pill tone="ghost">Wave 2+</Pill>
        )}
      </header>
      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: "var(--text-secondary, var(--text-muted))",
          lineHeight: 1.4,
        }}
      >
        {mode.blurb}
      </p>
      {glyph && (
        <div
          aria-hidden
          style={{ marginTop: "auto", fontSize: 22, color: "var(--text-muted)", opacity: 0.5 }}
        >
          {glyph}
        </div>
      )}
    </button>
  );
}
