/**
 * RUBERRA SignalsPanel — Stack 08 · System Awareness
 * Surfaces live runtime signals with severity rail, open/dismiss/mark-all-read,
 * backdrop, and Escape-to-close. Matches the full API used in App.tsx.
 */

import React, { useEffect, useRef } from "react";
import { type RuntimeSignal } from "./runtime-fabric";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SignalsPanelProps {
  open: boolean;
  onClose: () => void;
  signals: RuntimeSignal[];
  onOpen: (item: RuntimeSignal) => void;
  onDismiss: (id: string) => void;
  onMarkAllRead: () => void;
}

// ─── Severity helpers ─────────────────────────────────────────────────────────

const SEVERITY_COLOR: Record<RuntimeSignal["severity"], string> = {
  info:     "var(--r-accent, #52796A)",
  warn:     "var(--r-warn, #C68A3A)",
  critical: "var(--r-err, #B94040)",
};

const SEVERITY_LABEL: Record<RuntimeSignal["severity"], string> = {
  info:     "INFO",
  warn:     "WARN",
  critical: "CRIT",
};

function formatAge(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SignalsPanel({
  open,
  onClose,
  signals,
  onOpen,
  onDismiss,
  onMarkAllRead,
}: SignalsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const unread   = signals.filter((s) => !s.read && !s.resolved);
  const visible  = signals.filter((s) => !s.resolved).slice(0, 40);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position:   "fixed",
          inset:      0,
          zIndex:     49,
          background: "transparent",
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        style={{
          position:     "fixed",
          top:          "44px",
          right:        "12px",
          width:        "320px",
          maxHeight:    "440px",
          zIndex:       50,
          display:      "flex",
          flexDirection:"column",
          border:       "1px solid var(--r-border)",
          borderRadius: "8px",
          background:   "var(--r-surface)",
          boxShadow:    "0 8px 32px color-mix(in srgb, var(--r-text) 10%, transparent)",
          overflow:     "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            padding:        "10px 14px 9px",
            borderBottom:   "1px solid var(--r-border)",
            flexShrink:     0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize:    "11px",
                fontWeight:  600,
                color:       "var(--r-text)",
                fontFamily:  "'Inter', system-ui, sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              Signals
            </span>
            {unread.length > 0 && (
              <span
                style={{
                  fontSize:   "9px",
                  fontFamily: "'JetBrains Mono', monospace",
                  color:      "var(--r-bg)",
                  background: "var(--r-pulse, #C68A3A)",
                  borderRadius:"10px",
                  padding:    "1px 6px",
                  letterSpacing:"0.05em",
                }}
              >
                {unread.length}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {unread.length > 0 && (
              <button
                onClick={onMarkAllRead}
                style={{
                  fontSize:   "9px",
                  fontFamily: "'JetBrains Mono', monospace",
                  color:      "var(--r-dim)",
                  background: "transparent",
                  border:     "none",
                  cursor:     "pointer",
                  padding:    "2px 0",
                  outline:    "none",
                  letterSpacing: "0.04em",
                }}
              >
                mark all read
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                fontSize:   "14px",
                color:      "var(--r-dim)",
                background: "transparent",
                border:     "none",
                cursor:     "pointer",
                lineHeight: 1,
                padding:    "0 2px",
                outline:    "none",
              }}
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Signal list */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {visible.length === 0 ? (
            <div
              style={{
                padding:    "32px 20px",
                textAlign:  "center",
                fontSize:   "11px",
                color:      "var(--r-dim)",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.04em",
              }}
            >
              no active signals
            </div>
          ) : (
            visible.map((s) => (
              <div
                key={s.id}
                style={{
                  display:     "flex",
                  alignItems:  "flex-start",
                  gap:         "10px",
                  padding:     "9px 14px",
                  borderBottom:"1px solid var(--r-border)",
                  background:  s.read ? "transparent" : "color-mix(in srgb, var(--r-accent) 4%, transparent)",
                  transition:  "background 0.1s ease",
                }}
              >
                {/* Severity rail */}
                <div
                  style={{
                    width:       "2px",
                    height:      "100%",
                    minHeight:   "34px",
                    borderRadius:"2px",
                    background:  SEVERITY_COLOR[s.severity],
                    flexShrink:  0,
                    marginTop:   "2px",
                  }}
                />

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display:    "flex",
                      alignItems: "center",
                      gap:        "6px",
                      marginBottom:"3px",
                    }}
                  >
                    <span
                      style={{
                        fontSize:   "8px",
                        fontFamily: "'JetBrains Mono', monospace",
                        color:      SEVERITY_COLOR[s.severity],
                        letterSpacing:"0.08em",
                        fontWeight: 600,
                      }}
                    >
                      {SEVERITY_LABEL[s.severity]}
                    </span>
                    <span
                      style={{
                        fontSize:   "8px",
                        fontFamily: "'JetBrains Mono', monospace",
                        color:      "var(--r-dim)",
                        letterSpacing:"0.04em",
                      }}
                    >
                      {formatAge(s.createdAt)}
                    </span>
                    {!s.read && (
                      <span
                        style={{
                          width:       "4px",
                          height:      "4px",
                          borderRadius:"50%",
                          background:  "var(--r-pulse, #C68A3A)",
                          display:     "inline-block",
                        }}
                      />
                    )}
                  </div>
                  <p
                    style={{
                      fontSize:   "12px",
                      color:      "var(--r-text)",
                      fontFamily: "'Inter', system-ui, sans-serif",
                      margin:     0,
                      lineHeight: 1.45,
                      overflow:   "hidden",
                      textOverflow:"ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.label}
                  </p>
                  <div
                    style={{
                      display:    "flex",
                      gap:        "6px",
                      marginTop:  "6px",
                    }}
                  >
                    <button
                      onClick={() => onOpen(s)}
                      style={{
                        fontSize:    "9px",
                        fontFamily:  "'JetBrains Mono', monospace",
                        color:       "var(--r-text)",
                        background:  "var(--r-elevated, var(--r-surface))",
                        border:      "1px solid var(--r-border)",
                        borderRadius:"4px",
                        padding:     "3px 8px",
                        cursor:      "pointer",
                        outline:     "none",
                        letterSpacing:"0.04em",
                      }}
                    >
                      Open →
                    </button>
                    <button
                      onClick={() => onDismiss(s.id)}
                      style={{
                        fontSize:    "9px",
                        fontFamily:  "'JetBrains Mono', monospace",
                        color:       "var(--r-dim)",
                        background:  "transparent",
                        border:      "1px solid var(--r-border)",
                        borderRadius:"4px",
                        padding:     "3px 8px",
                        cursor:      "pointer",
                        outline:     "none",
                        letterSpacing:"0.04em",
                      }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default SignalsPanel;
