// Wave 8 — side panel card. Visual treatment matches the canonical
// Foto 3 mockup:
//   - Numbered badge top-left (1..9, ordinal from MODE_ICON)
//   - Glow border via [data-glow-panel] (active state strengthens it)
//   - Two-line header: TITLE (mono, kicker) + subtitle (sans, body)
//   - Mode glyph (SVG icon) on the right of the header
//   - Compact blurb beneath
//   - live / Wave 2+ chip in the bottom corner
// Click swaps the active mode in ComposerLayout.

import type { CSSProperties } from "react";
import type { ComposerMode, ModeDescriptor } from "../types";
import Pill from "../../components/atoms/Pill";
import Icon, { MODE_ICON } from "../visual/Icons";

interface Props {
  mode: ModeDescriptor;
  active: ComposerMode;
  onSelect: (id: ComposerMode) => void;
}

const MODE_SUBTITLE: Record<ComposerMode, string> = {
  idle:     "Dormant · idle mode",
  context:  "Context detection mode",
  compose:  "Compose mode",
  code:     "Code mode (IDE)",
  design:   "Design mode (workspace)",
  analysis: "Analysis · report mode",
  memory:   "Memory · save mode",
  apply:    "Action · apply mode",
  route:    "Tool routing mode",
};

const cardStyle: CSSProperties = {
  padding: "14px 16px 12px",
  width: "100%",
  textAlign: "left",
  cursor: "pointer",
  background: "transparent",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  minHeight: 132,
  position: "relative",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--mono)",
  fontSize: 13,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--text-primary)",
  fontWeight: 600,
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--sans)",
  fontSize: 11,
  color: "var(--text-muted)",
  lineHeight: 1.4,
};

const blurbStyle: CSSProperties = {
  margin: "auto 0 0",
  fontSize: 12,
  color: "var(--text-secondary)",
  lineHeight: 1.5,
};

export default function ModePanel({ mode, active, onSelect }: Props) {
  const isActive = mode.id === active;
  const meta = MODE_ICON[mode.id];

  return (
    <button
      type="button"
      onClick={() => onSelect(mode.id)}
      data-glow-panel
      data-active={isActive}
      data-mode={mode.id}
      style={cardStyle}
    >
      <span data-glow-badge aria-hidden>
        {meta?.n ?? "·"}
      </span>

      <header
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          <p style={titleStyle}>{mode.label}</p>
          <p style={subtitleStyle}>{MODE_SUBTITLE[mode.id]}</p>
        </div>
        <span
          aria-hidden
          style={{
            color: isActive ? "var(--accent)" : "var(--text-muted)",
            opacity: isActive ? 1 : 0.7,
            flexShrink: 0,
            display: "inline-flex",
          }}
        >
          {meta && <Icon name={meta.icon} size={20} />}
        </span>
      </header>

      <p style={blurbStyle}>{mode.blurb}</p>

      <footer style={{ display: "flex", justifyContent: "flex-end" }}>
        {mode.live ? <Pill tone="ok">live</Pill> : <Pill tone="ghost">Wave 2+</Pill>}
      </footer>
    </button>
  );
}
