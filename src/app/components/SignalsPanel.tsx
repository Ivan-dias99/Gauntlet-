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
            <div style={{ height: "34px", padding: "0 10px", borderBottom: "1px solid var(--r-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", letterSpacing: "0.08em", color: "var(--r-text)", textTransform: "uppercase" }}>
                signals · {unread.length} unread
              </span>
              <button onClick={onMarkAllRead} style={{ border: "none", background: "transparent", color: "var(--r-dim)", fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em", textTransform: "uppercase", cursor: "pointer" }}>
                mark read
              </button>
            </div>
            <div style={{ overflowY: "auto", padding: "4px 6px" }}>
              {signals.length === 0 && (
                <p style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.06em", textTransform: "uppercase", margin: "10px 0" }}>no signals</p>
              )}
              {signals.map((s) => (
                <div key={s.id} style={{ borderBottom: "1px solid var(--r-border-soft)", padding: "6px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: severityColor[s.severity], flexShrink: 0 }} />
                    <span style={{ fontSize: "11px", color: s.read ? "var(--r-dim)" : "var(--r-text)", flex: 1 }}>{s.label}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "11px" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", color: "var(--r-dim)", letterSpacing: "0.06em" }}>
                      {s.destination.tab} · {s.destination.view}
                    </span>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button onClick={() => onDismiss(s.id)} style={{ border: "1px solid var(--r-border)", borderRadius: "2px", background: "transparent", color: "var(--r-dim)", fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", padding: "1px 5px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.03em" }}>dismiss</button>
                      <button onClick={() => onOpen(s)} style={{ border: "1px solid var(--r-border)", borderRadius: "2px", background: "transparent", color: "var(--r-subtext)", fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", padding: "1px 5px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.03em" }}>open</button>
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
