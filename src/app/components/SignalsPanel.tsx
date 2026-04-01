/**
 * RUBERRA — Signals / notifications panel (SovereignBar bell)
 * Anchored under the top bar; matches shell tokens and motion language.
 */

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type RuntimeSignal } from "./runtime-fabric";

interface SignalsPanelProps {
  open:       boolean;
  onClose:    () => void;
  signals:    RuntimeSignal[];
  onOpen:     (signal: RuntimeSignal) => void;
  onDismiss:  (id: string) => void;
  onMarkAllRead: () => void;
}

function severityColor(sev: RuntimeSignal["severity"]): string {
  if (sev === "critical") return "var(--r-err)";
  if (sev === "warn") return "var(--r-warn)";
  return "var(--r-accent)";
}

export function SignalsPanel({
  open,
  onClose,
  signals,
  onOpen,
  onDismiss,
  onMarkAllRead,
}: SignalsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const unread = signals.filter((s) => !s.read && !s.resolved);
  const readOrResolved = signals.filter((s) => s.read || s.resolved);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  const ordered = [...unread.sort((a, b) => b.createdAt - a.createdAt), ...readOrResolved.sort((a, b) => b.createdAt - a.createdAt)].slice(0, 40);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 140,
              background: "transparent",
            }}
          />
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: "48px",
              right: "14px",
              width: "min(380px, calc(100vw - 28px))",
              maxHeight: "min(420px, calc(100vh - 80px))",
              background: "var(--r-surface)",
              border: "1px solid var(--r-border)",
              borderRadius: "12px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.04)",
              zIndex: 141,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                borderBottom: "1px solid var(--r-border-soft)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", color: "var(--r-text)", textTransform: "uppercase" }}>
                  Signals
                </div>
                <div style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", marginTop: "2px" }}>
                  {unread.length} unread · {signals.length} total
                </div>
              </div>
              <button
                type="button"
                disabled={unread.length === 0}
                onClick={() => {
                  onMarkAllRead();
                }}
                style={{
                  fontSize: "10px",
                  fontFamily: "'JetBrains Mono', monospace",
                  padding: "5px 10px",
                  borderRadius: "6px",
                  border: "1px solid var(--r-border)",
                  background: unread.length === 0 ? "var(--r-rail)" : "var(--r-bg)",
                  color: unread.length === 0 ? "var(--r-dim)" : "var(--r-text)",
                  cursor: unread.length === 0 ? "default" : "pointer",
                }}
              >
                Mark all read
              </button>
            </div>

            <div style={{ overflowY: "auto", flex: 1, padding: "8px" }}>
              {ordered.length === 0 ? (
                <p style={{ margin: "20px 12px", fontSize: "12px", color: "var(--r-subtext)", textAlign: "center" }}>
                  No signals yet. Connector and continuity events appear here.
                </p>
              ) : (
                ordered.map((s) => {
                  const isUnread = !s.read && !s.resolved;
                  return (
                    <div
                      key={s.id}
                      style={{
                        borderRadius: "8px",
                        border: "1px solid var(--r-border-soft)",
                        background: isUnread ? "var(--r-elevated)" : "var(--r-bg)",
                        marginBottom: "6px",
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "stretch" }}>
                        <div style={{ width: "3px", flexShrink: 0, background: severityColor(s.severity) }} />
                        <div style={{ flex: 1, padding: "10px 10px 8px", minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "flex-start" }}>
                            <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--r-text)", lineHeight: 1.35 }}>
                              {s.label}
                            </span>
                            {isUnread && (
                              <span
                                style={{
                                  fontSize: "8px",
                                  fontFamily: "'JetBrains Mono', monospace",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.06em",
                                  color: "var(--r-accent)",
                                  flexShrink: 0,
                                }}
                              >
                                New
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", marginTop: "4px" }}>
                            {s.type} · {s.destinationChamber} → {s.destination.tab}/{s.destination.view}
                          </div>
                          <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                            <button
                              type="button"
                              onClick={() => onOpen(s)}
                              style={{
                                fontSize: "10px",
                                padding: "4px 10px",
                                borderRadius: "5px",
                                border: "none",
                                background: "var(--r-accent)",
                                color: "#fff",
                                cursor: "pointer",
                                fontWeight: 500,
                              }}
                            >
                              Open
                            </button>
                            {isUnread && (
                              <button
                                type="button"
                                onClick={() => onDismiss(s.id)}
                                style={{
                                  fontSize: "10px",
                                  padding: "4px 10px",
                                  borderRadius: "5px",
                                  border: "1px solid var(--r-border)",
                                  background: "transparent",
                                  color: "var(--r-subtext)",
                                  cursor: "pointer",
                                }}
                              >
                                Dismiss
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
