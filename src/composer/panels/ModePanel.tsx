// Wave 8b — side panel card with mini-mockup. Each panel renders a
// thumbnail of its mode's UI so the canonical surface reads as "every
// panel is already a product" instead of empty cards. Layout:
//
//   ┌──────────────────────────┐
//   │ ① TITLE       [icon]     │
//   │   subtitle               │
//   │ ┌────────────────────┐   │
//   │ │   mini-mockup      │   │
//   │ └────────────────────┘   │
//   │ blurb                     [live]
//   └──────────────────────────┘

import type { CSSProperties } from "react";
import type { ComposerMode, ModeDescriptor } from "../types";
import Pill from "../../components/atoms/Pill";
import Icon, { MODE_ICON } from "../visual/Icons";
import PanelMockup from "../visual/PanelMockups";

interface Props {
  mode: ModeDescriptor;
  active: ComposerMode;
  onSelect: (id: ComposerMode) => void;
  /** Extra style merged onto the card — used by ComposerLayout to set
   *  grid-area / gridColumn / gridRow per panel. */
  cellStyle?: CSSProperties;
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
  padding: "12px 14px 10px",
  textAlign: "left",
  cursor: "pointer",
  background: "transparent",
  display: "flex",
  flexDirection: "column",
  gap: 8,
  position: "relative",
  height: "100%",
  minHeight: 0,
  width: "auto",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--mono)",
  fontSize: 12,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--text-primary)",
  fontWeight: 600,
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--sans)",
  fontSize: 10,
  color: "var(--text-muted)",
  lineHeight: 1.3,
};

const blurbStyle: CSSProperties = {
  margin: 0,
  fontSize: 11,
  color: "var(--text-secondary)",
  lineHeight: 1.4,
};

export default function ModePanel({ mode, active, onSelect, cellStyle }: Props) {
  const isActive = mode.id === active;
  const meta = MODE_ICON[mode.id];

  return (
    <button
      type="button"
      onClick={() => onSelect(mode.id)}
      data-glow-panel
      data-active={isActive}
      data-mode={mode.id}
      style={{ ...cardStyle, ...cellStyle }}
    >
      <span data-glow-badge aria-hidden>
        {meta?.n ?? "·"}
      </span>

      <header
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 }}>
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
            filter: isActive ? "drop-shadow(0 0 6px rgba(94,165,255,0.55))" : "none",
          }}
        >
          {meta && <Icon name={meta.icon} size={18} />}
        </span>
      </header>

      <PanelMockup mode={mode.id} />

      <footer
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
          marginTop: "auto",
        }}
      >
        <p style={blurbStyle}>{mode.blurb}</p>
        {mode.live ? <Pill tone="ok">live</Pill> : <Pill tone="ghost">Wave 2+</Pill>}
      </footer>
    </button>
  );
}
