// Sprint 3 — Studio header (top bar) with live behaviour.
//
// Brand mark navigates Home. Quick Summon pill toggles the popover
// (no longer always-visible). Bell opens a tiny notifications panel.
// Configure Shortcut button (inside popover) navigates to Settings.
// Window controls remain decorative inside a browser tab — clicking
// them shows a transient toast explaining they belong to the Tauri
// shell. The brand keeps the operator oriented at all times.

import { useState, useRef, useEffect } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
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

const brandButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "4px 8px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  color: "inherit",
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
  cursor: "pointer",
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

const dropdownStyle: CSSProperties = {
  position: "absolute",
  top: "calc(100% + 8px)",
  right: 0,
  width: 280,
  background: "color-mix(in oklab, var(--bg-surface) 96%, transparent)",
  border: "1px solid var(--border-color-mid)",
  borderRadius: "var(--radius-md, 8px)",
  boxShadow:
    "0 0 0 1px color-mix(in oklab, var(--accent) 14%, transparent), 0 18px 50px rgba(0, 0, 0, 0.45)",
  padding: "12px 14px",
  zIndex: 30,
};

const toastStyle: CSSProperties = {
  position: "fixed",
  bottom: 80,
  right: 32,
  padding: "10px 14px",
  background: "color-mix(in oklab, var(--bg-surface) 96%, transparent)",
  border: "1px solid var(--border-color-mid)",
  borderRadius: "var(--radius-md, 8px)",
  boxShadow: "0 10px 28px rgba(0, 0, 0, 0.40)",
  fontSize: 12.5,
  color: "var(--text-secondary)",
  zIndex: 40,
};

export default function StudioHeader() {
  const navigate = useNavigate();
  const [summonOpen, setSummonOpen] = useState(true);
  const [bellOpen, setBellOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Click-outside collapses the popovers.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Auto-dismiss toast after 2.4s.
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(id);
  }, [toast]);

  function handleConfigureShortcut() {
    setSummonOpen(false);
    navigate("/composer/settings");
  }

  function handleWindowControl(label: string) {
    setToast(`${label} is part of the desktop shell — decorative inside a browser tab.`);
  }

  return (
    <header style={headerStyle} data-studio-header>
      <button
        type="button"
        style={brandButtonStyle}
        onClick={() => navigate("/composer")}
        aria-label="Composer home"
      >
        <span style={brandMarkStyle} aria-hidden>◇</span>
        <p style={brandTextStyle}>Composer</p>
      </button>

      <div style={rightStyle} ref={wrapRef}>
        <button
          type="button"
          style={summonPillStyle}
          onClick={() => setSummonOpen((v) => !v)}
          aria-expanded={summonOpen}
          aria-label="Toggle Quick Summon"
        >
          <span style={summonDotStyle} aria-hidden>⚡</span>
          <span>Quick Summon</span>
          <span style={{ display: "inline-flex", gap: 3, marginLeft: 4 }}>
            <span style={kbdStyle}>⌥</span>
            <span style={kbdStyle}>Space</span>
          </span>
        </button>

        <button
          type="button"
          style={iconButtonStyle}
          onClick={() => setBellOpen((v) => !v)}
          aria-label="Notifications"
          aria-expanded={bellOpen}
        >
          <BellIcon size={16} />
        </button>

        <div style={windowControlsStyle} aria-hidden>
          <button
            type="button"
            style={iconButtonStyle}
            aria-label="Minimize"
            onClick={() => handleWindowControl("Minimize")}
          >
            <MinimizeIcon size={14} />
          </button>
          <button
            type="button"
            style={iconButtonStyle}
            aria-label="Maximize"
            onClick={() => handleWindowControl("Maximize")}
          >
            <MaximizeIcon size={12} />
          </button>
          <button
            type="button"
            style={iconButtonStyle}
            aria-label="Close"
            onClick={() => handleWindowControl("Close")}
          >
            <CloseIcon size={14} />
          </button>
        </div>

        {summonOpen && (
          <QuickSummonPopover onConfigure={handleConfigureShortcut} />
        )}

        {bellOpen && (
          <div style={dropdownStyle} role="dialog" aria-label="Notifications">
            <p
              style={{
                margin: 0,
                fontFamily: "var(--mono)",
                fontSize: "var(--t-meta, 11px)",
                letterSpacing: "var(--track-kicker, 0.26em)",
                textTransform: "uppercase",
                color: "var(--accent)",
              }}
            >
              Notifications
            </p>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              No new notifications. The studio surfaces alerts here when
              the brain emits warnings or when a run requires attention.
            </p>
          </div>
        )}
      </div>

      {toast && (
        <div style={toastStyle} role="status">{toast}</div>
      )}
    </header>
  );
}
