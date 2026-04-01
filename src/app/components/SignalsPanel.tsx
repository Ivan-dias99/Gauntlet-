/**
 * RUBERRA SignalsPanel — Stack 08 · System Awareness
 * Surfaces live runtime signals with severity rail, open/dismiss/mark-all-read,
 * backdrop, and Escape-to-close. Matches the full API used in App.tsx.
 */

import React, { useEffect, useRef } from "react";
 * Floating notification panel: severity rail, Open / Dismiss / Mark all read.
 * Positioned below SovereignBar, slide-in from right, backdrop + click-outside close.
 */

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { type RuntimeSignal } from "./runtime-fabric";

// ─── Severity → visual tokens ────────────────────────────────────────────────

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
const SEVERITY_RAIL: Record<RuntimeSignal["severity"], string> = {
  info:     "var(--r-ok)",
  warn:     "var(--r-warn)",
  critical: "var(--r-err)",
};

const SEVERITY_LABEL: Record<RuntimeSignal["severity"], string> = {
  info:     "INFO",
  warn:     "WARN",
  critical: "CRIT",
};

const SEVERITY_LABEL_COLOR: Record<RuntimeSignal["severity"], string> = {
  info:     "var(--r-ok)",
  warn:     "var(--r-warn)",
  critical: "var(--r-err)",
};

const TYPE_LABEL: Record<RuntimeSignal["type"], string> = {
  lifecycle:      "Lifecycle",
  transfer:       "Transfer",
  connector:      "Connector",
  reward:         "Reward",
  recommendation: "Action",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface SignalsPanelProps {
  open:          boolean;
  onClose:       () => void;
  signals:       RuntimeSignal[];
  onOpen:        (signal: RuntimeSignal) => void;
  onDismiss:     (id: string) => void;
  onMarkAllRead: () => void;
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

  // Click-outside closes panel
  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: PointerEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, onClose]);

  // Sorted: critical first, then warn, then info; unread first within group
  const sorted = [...signals].sort((a, b) => {
    const sev = { critical: 0, warn: 1, info: 2 };
    const sevDiff = sev[a.severity] - sev[b.severity];
    if (sevDiff !== 0) return sevDiff;
    return (a.read ? 1 : 0) - (b.read ? 1 : 0);
  });

  const unreadCount = signals.filter((s) => !s.read).length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          key="signals-panel"
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position:     "fixed",
            top:          "50px",
            right:        "14px",
            width:        "340px",
            maxHeight:    "480px",
            background:   "var(--r-surface)",
            border:       "1px solid var(--r-border)",
            borderRadius: "10px",
            boxShadow:    "0 8px 32px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)",
            display:      "flex",
            flexDirection:"column",
            overflow:     "hidden",
            zIndex:       200,
          }}
        >
          {/* ── Header ── */}
          <div
            style={{
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "space-between",
              padding:         "10px 14px 9px",
              borderBottom:    "1px solid var(--r-border-soft)",
              flexShrink:      0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <span
                style={{
                  fontSize:      "11px",
                  fontWeight:    600,
                  color:         "var(--r-text)",
                  fontFamily:    "'Inter', system-ui, sans-serif",
                  letterSpacing: "-0.01em",
                }}
              >
                Signals
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    fontSize:    "9px",
                    fontFamily:  "'JetBrains Mono', monospace",
                    color:       "var(--r-pulse)",
                    background:  "color-mix(in srgb, var(--r-pulse) 12%, transparent)",
                    padding:     "1px 5px",
                    borderRadius:"3px",
                    letterSpacing:"0.04em",
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  style={{
                    fontSize:    "9px",
                    fontFamily:  "'Inter', system-ui, sans-serif",
                    color:       "var(--r-subtext)",
                    background:  "transparent",
                    border:      "none",
                    cursor:      "pointer",
                    padding:     "2px 6px",
                    borderRadius:"4px",
                    outline:     "none",
                    transition:  "color 0.1s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--r-text)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--r-subtext)"; }}
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                style={{
                  width:       "22px",
                  height:      "22px",
                  borderRadius:"4px",
                  border:      "none",
                  background:  "transparent",
                  cursor:      "pointer",
                  display:     "flex",
                  alignItems:  "center",
                  justifyContent:"center",
                  color:       "var(--r-subtext)",
                  outline:     "none",
                  transition:  "background 0.1s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--r-rail)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <X size={11} strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {/* ── Signals list ── */}
          <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
            {sorted.length === 0 ? (
              <div
                style={{
                  padding:   "28px 14px",
                  textAlign: "center",
                  fontSize:  "11px",
                  color:     "var(--r-dim)",
                  fontFamily:"'Inter', system-ui, sans-serif",
                }}
              >
                No signals
              </div>
            ) : (
              sorted.map((signal) => (
                <div
                  key={signal.id}
                  style={{
                    display:        "flex",
                    alignItems:     "stretch",
                    borderBottom:   "1px solid var(--r-border-soft)",
                    background:     signal.read
                      ? "transparent"
                      : "color-mix(in srgb, var(--r-elevated) 60%, transparent)",
                    transition:     "background 0.1s ease",
                  }}
                >
                  {/* Severity rail */}
                  <div
                    style={{
                      width:        "2px",
                      flexShrink:   0,
                      background:   SEVERITY_RAIL[signal.severity],
                      opacity:      signal.read ? 0.3 : 1,
                    }}
                  />

                  {/* Body */}
                  <div style={{ flex: 1, padding: "9px 12px 9px 10px", minWidth: 0 }}>
                    {/* Top row: type + severity + dest */}
                    <div
                      style={{
                        display:       "flex",
                        alignItems:    "center",
                        gap:           "5px",
                        marginBottom:  "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize:      "8px",
                          fontFamily:    "'JetBrains Mono', monospace",
                          letterSpacing: "0.08em",
                          color:         SEVERITY_LABEL_COLOR[signal.severity],
                          opacity:       signal.read ? 0.55 : 1,
                        }}
                      >
                        {SEVERITY_LABEL[signal.severity]}
                      </span>
                      <span style={{ fontSize: "8px", color: "var(--r-dim)", fontFamily: "monospace" }}>·</span>
                      <span
                        style={{
                          fontSize:   "8px",
                          fontFamily: "'JetBrains Mono', monospace",
                          color:      "var(--r-dim)",
                          letterSpacing:"0.06em",
                          textTransform:"uppercase",
                        }}
                      >
                        {TYPE_LABEL[signal.type]}
                      </span>
                      {!signal.read && (
                        <span
                          style={{
                            marginLeft:   "auto",
                            width:        "4px",
                            height:       "4px",
                            borderRadius: "50%",
                            background:   "var(--r-pulse)",
                            flexShrink:   0,
                          }}
                        />
                      )}
                    </div>

                    {/* Label */}
                    <p
                      style={{
                        fontSize:    "12px",
                        color:       signal.read ? "var(--r-subtext)" : "var(--r-text)",
                        fontFamily:  "'Inter', system-ui, sans-serif",
                        lineHeight:  "1.45",
                        margin:      "0 0 7px",
                      }}
                    >
                      {signal.label}
                    </p>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "5px" }}>
                      <button
                        onClick={() => onOpen(signal)}
                        style={{
                          fontSize:    "9px",
                          fontFamily:  "'Inter', system-ui, sans-serif",
                          color:       "var(--r-text)",
                          background:  "var(--r-rail)",
                          border:      "1px solid var(--r-border)",
                          borderRadius:"4px",
                          padding:     "2px 8px",
                          cursor:      "pointer",
                          outline:     "none",
                          transition:  "background 0.1s ease",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--r-border)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--r-rail)"; }}
                      >
                        Open →
                      </button>
                      {!signal.read && (
                        <button
                          onClick={() => onDismiss(signal.id)}
                          style={{
                            fontSize:    "9px",
                            fontFamily:  "'Inter', system-ui, sans-serif",
                            color:       "var(--r-subtext)",
                            background:  "transparent",
                            border:      "1px solid var(--r-border-soft)",
                            borderRadius:"4px",
                            padding:     "2px 8px",
                            cursor:      "pointer",
                            outline:     "none",
                            transition:  "color 0.1s ease",
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--r-text)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--r-subtext)"; }}
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SignalsPanel;
