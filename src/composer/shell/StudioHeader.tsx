// Sprint 2 — Studio header (top bar).
//
// Per the target mock: brand logo on the left, Quick Summon pill +
// notification bell + window controls (minimize / maximize / close)
// on the right. The QuickSummonPopover hangs off the Quick Summon
// pill via a dotted connector line.
//
// Doctrine override (operator-authorized): some elements here are
// chrome — they don't bind to backend signals (Quick Summon shortcut
// is decorative until the desktop bridge ships, window controls are
// decorative inside a browser tab). Marked clearly in comments.

import type { CSSProperties } from "react";
import { BellIcon, MinimizeIcon, MaximizeIcon, CloseIcon } from "./icons";
import QuickSummonPopover from "./QuickSummonPopover";

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 22px",
  borderBottom: "1px solid var(--border-color-soft)",
  background: "color-mix(in oklab, var(--bg-surface) 86%, transparent)",
  backdropFilter: "blur(8px)",
  position: "relative",
  zIndex: 10,
};

const brandStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const brandMarkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: 6,
  background: "color-mix(in oklab, var(--accent) 18%, transparent)",
  border: "1px solid color-mix(in oklab, var(--accent) 38%, transparent)",
  color: "var(--accent)",
  fontSize: 14,
  flexShrink: 0,
};

const brandTextStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--mono)",
  fontSize: 13,
  letterSpacing: "var(--track-kicker, 0.26em)",
  textTransform: "uppercase",
  color: "var(--text-primary)",
  fontWeight: 500,
};

const rightStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  position: "relative",
};

const summonPillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 10px 6px 12px",
  background: "color-mix(in oklab, var(--bg-elevated) 70%, transparent)",
  border: "1px solid var(--border-color-soft)",
  borderRadius: "999px",
  color: "var(--text-secondary)",
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-meta, 0.12em)",
};

const summonDotStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 16,
  height: 16,
  borderRadius: "50%",
  background: "color-mix(in oklab, var(--accent) 22%, transparent)",
  color: "var(--accent)",
  fontSize: 10,
  flexShrink: 0,
};

const kbdStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "1px 5px",
  background: "color-mix(in oklab, var(--bg-input) 80%, transparent)",
  border: "1px solid var(--border-color-soft)",
  borderRadius: 3,
  fontFamily: "var(--mono)",
  fontSize: 10,
  color: "var(--text-secondary)",
};

const iconButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  borderRadius: 6,
  background: "transparent",
  border: "none",
  color: "var(--text-muted)",
  cursor: "pointer",
};

const windowControlsStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  marginLeft: 8,
  paddingLeft: 12,
  borderLeft: "1px solid var(--border-color-soft)",
};

export default function StudioHeader() {
  return (
    <header style={headerStyle} data-studio-header>
      <div style={brandStyle}>
        <span style={brandMarkStyle} aria-hidden>◇</span>
        <p style={brandTextStyle}>Composer</p>
      </div>

      <div style={rightStyle}>
        <span style={summonPillStyle}>
          <span style={summonDotStyle} aria-hidden>⚡</span>
          <span>Quick Summon</span>
          <span style={{ display: "inline-flex", gap: 3, marginLeft: 4 }}>
            <span style={kbdStyle}>⌥</span>
            <span style={kbdStyle}>Space</span>
          </span>
        </span>

        <button type="button" style={iconButtonStyle} aria-label="Notifications">
          <BellIcon size={16} />
        </button>

        <div style={windowControlsStyle} aria-hidden>
          <button type="button" style={iconButtonStyle} aria-label="Minimize">
            <MinimizeIcon size={14} />
          </button>
          <button type="button" style={iconButtonStyle} aria-label="Maximize">
            <MaximizeIcon size={12} />
          </button>
          <button type="button" style={iconButtonStyle} aria-label="Close">
            <CloseIcon size={14} />
          </button>
        </div>

        <QuickSummonPopover />
      </div>
    </header>
  );
}
