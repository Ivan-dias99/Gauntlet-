// Sprint 2 — Quick Summon popover.
//
// Always-visible card that hangs off the Quick Summon header pill via
// a dotted vertical connector. Matches the target mock literally.
// The Configure Shortcut button is decorative in V0 — desktop-bridge
// shortcut config lands when the Tauri shell ships.

import type { CSSProperties } from "react";

const wrapStyle: CSSProperties = {
  position: "absolute",
  top: "calc(100% + 22px)",
  right: 60,
  width: 260,
  zIndex: 20,
};

const connectorStyle: CSSProperties = {
  position: "absolute",
  top: -22,
  right: 110,
  width: 0,
  height: 22,
  borderLeft: "1px dashed color-mix(in oklab, var(--accent) 38%, transparent)",
};

const cardStyle: CSSProperties = {
  background: "color-mix(in oklab, var(--bg-surface) 96%, transparent)",
  border: "1px solid var(--border-color-mid)",
  borderRadius: "var(--radius-md, 8px)",
  padding: "14px 16px 16px",
  boxShadow:
    "0 0 0 1px color-mix(in oklab, var(--accent) 16%, transparent), 0 18px 50px rgba(0, 0, 0, 0.40)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-meta, 0.12em)",
  textTransform: "uppercase",
  color: "var(--accent)",
};

const bodyStyle: CSSProperties = {
  margin: "8px 0 12px",
  fontSize: 12.5,
  lineHeight: 1.5,
  color: "var(--text-secondary)",
};

const buttonStyle: CSSProperties = {
  display: "block",
  width: "100%",
  padding: "8px 12px",
  background: "transparent",
  border: "1px solid var(--border-color-mid)",
  borderRadius: "var(--radius-sm, 4px)",
  color: "var(--text-primary)",
  fontFamily: "var(--sans)",
  fontSize: 12,
  cursor: "pointer",
};

export default function QuickSummonPopover() {
  return (
    <div style={wrapStyle} data-quick-summon-popover>
      <span style={connectorStyle} aria-hidden />
      <div style={cardStyle}>
        <h3 style={titleStyle}>Quick Summon (Configurable)</h3>
        <p style={bodyStyle}>
          Instantly summon Composer from anywhere using your shortcut.
        </p>
        <button type="button" style={buttonStyle}>
          Configure Shortcut
        </button>
      </div>
    </div>
  );
}
