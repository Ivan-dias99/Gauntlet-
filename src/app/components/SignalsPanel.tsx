import { motion, AnimatePresence } from "motion/react";

interface RuntimeSignalItem {
  id: string;
  label: string;
  severity: "info" | "warn" | "critical";
  read: boolean;
  destination: { tab: "lab" | "school" | "creation" | "profile"; view: string; id?: string };
}

interface SignalsPanelProps {
  open: boolean;
  onClose: () => void;
  signals: RuntimeSignalItem[];
  onOpen: (item: RuntimeSignalItem) => void;
  onDismiss: (id: string) => void;
  onMarkAllRead: () => void;
}

const severityColor: Record<RuntimeSignalItem["severity"], string> = {
  info: "var(--r-accent)",
  warn: "var(--r-warn)",
  critical: "var(--r-err)",
};

const mono8 = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "7.5px",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
};

export function SignalsPanel({ open, onClose, signals, onOpen, onDismiss, onMarkAllRead }: SignalsPanelProps) {
  const unread = signals.filter((s) => !s.read);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, zIndex: 210, background: "rgba(26,23,20,0.18)" }}
          />
          <motion.aside
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "fixed",
              right: "14px",
              top: "62px",
              zIndex: 211,
              width: "340px",
              maxHeight: "calc(100vh - 88px)",
              overflow: "hidden",
              border: "1px solid var(--r-border)",
              borderRadius: "4px",
              background: "var(--r-surface)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div style={{
              height: "34px",
              padding: "0 10px",
              borderBottom: "1px solid var(--r-border-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <span style={{ ...mono8, color: "var(--r-subtext)" }}>
                signals{unread.length > 0 ? ` · ${unread.length}` : ""}
              </span>
              {unread.length > 0 && (
                <button
                  onClick={onMarkAllRead}
                  style={{
                    ...mono8,
                    border: "none",
                    background: "transparent",
                    color: "var(--r-dim)",
                    cursor: "pointer",
                    padding: "2px 4px",
                  }}
                >
                  ack all
                </button>
              )}
            </div>

            {/* Signal ledger */}
            <div style={{ overflowY: "auto", padding: "0" }}>
              {signals.length === 0 && (
                <div style={{ ...mono8, color: "var(--r-dim)", textAlign: "center", padding: "12px 0" }}>
                  — idle —
                </div>
              )}
              {signals.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "5px 10px",
                    borderBottom: "1px solid var(--r-border-soft)",
                    opacity: s.read ? 0.5 : 1,
                  }}
                >
                  <span style={{
                    ...mono8,
                    color: severityColor[s.severity],
                    minWidth: "48px",
                    flexShrink: 0,
                  }}>
                    {s.severity}
                  </span>
                  <span style={{
                    fontSize: "11px",
                    color: "var(--r-text)",
                    flex: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: 1.4,
                  }}>
                    {s.label}
                  </span>
                  <span style={{ ...mono8, color: "var(--r-dim)", flexShrink: 0 }}>
                    {s.destination.tab}
                  </span>
                  <button
                    onClick={() => onOpen(s)}
                    style={{
                      ...mono8,
                      border: "1px solid var(--r-border)",
                      borderRadius: "3px",
                      background: "transparent",
                      color: "var(--r-accent)",
                      padding: "2px 5px",
                      cursor: "pointer",
                    }}
                  >
                    go
                  </button>
                  <button
                    onClick={() => onDismiss(s.id)}
                    style={{
                      ...mono8,
                      border: "1px solid var(--r-border)",
                      borderRadius: "3px",
                      background: "transparent",
                      color: "var(--r-dim)",
                      padding: "2px 5px",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default SignalsPanel;
