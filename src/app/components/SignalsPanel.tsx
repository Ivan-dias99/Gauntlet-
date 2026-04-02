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
            style={{ position: "fixed", inset: 0, zIndex: 210, background: "rgba(26,23,20,0.24)" }}
          />
          <motion.aside
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.16 }}
            style={{
              position: "fixed",
              right: "14px",
              top: "62px",
              zIndex: 211,
              width: "360px",
              maxHeight: "calc(100vh - 88px)",
              overflow: "hidden",
              border: "1px solid var(--r-border)",
              borderRadius: "10px",
              background: "var(--r-surface)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ height: "40px", padding: "0 12px", borderBottom: "1px solid var(--r-border-soft)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.08em", color: "var(--r-text)", textTransform: "uppercase" }}>
                Signals · {unread.length} unread
              </span>
              <button onClick={onMarkAllRead} style={{ border: "none", background: "transparent", color: "var(--r-dim)", fontSize: "10px", cursor: "pointer" }}>
                mark all read
              </button>
            </div>
            <div style={{ overflowY: "auto", padding: "6px" }}>
              {signals.length === 0 && (
                <p style={{ fontSize: "11px", color: "var(--r-dim)", textAlign: "center", margin: "14px 0" }}>No signals</p>
              )}
              {signals.map((s) => (
                <div key={s.id} style={{ border: "1px solid var(--r-border-soft)", borderRadius: "7px", padding: "8px", marginBottom: "6px", background: s.read ? "var(--r-surface)" : "color-mix(in srgb, var(--r-elevated) 85%, transparent)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "6px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: severityColor[s.severity] }} />
                    <span style={{ fontSize: "11px", color: "var(--r-text)", flex: 1 }}>{s.label}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "var(--r-dim)", letterSpacing: "0.06em" }}>
                      {s.destination.tab} · {s.destination.view}
                    </span>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => onDismiss(s.id)} style={{ border: "1px solid var(--r-border)", borderRadius: "4px", background: "transparent", color: "var(--r-dim)", fontSize: "10px", padding: "2px 6px", cursor: "pointer" }}>dismiss</button>
                      <button onClick={() => onOpen(s)} style={{ border: "1px solid var(--r-border)", borderRadius: "4px", background: "var(--r-elevated)", color: "var(--r-subtext)", fontSize: "10px", padding: "2px 6px", cursor: "pointer" }}>open</button>
                    </div>
                  </div>
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
