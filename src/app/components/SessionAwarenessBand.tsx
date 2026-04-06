/**
 * RUBERRA — Session Awareness Band
 * The organism's heartbeat. Visible from the first second.
 * Shows session duration, active chamber, directive count.
 * The system is counting — the user knows they are inside something alive.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type Tab } from "./shell-types";

const CHAMBER_ACCENT: Record<string, string> = {
  lab:      "var(--chamber-lab)",
  school:   "var(--chamber-school)",
  creation: "var(--chamber-creation)",
  profile:  "var(--r-subtext)",
};

const CHAMBER_VERB: Record<string, string> = {
  lab:      "investigating",
  school:   "mastering",
  creation: "building",
  profile:  "governing",
};

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m`;
  if (m > 0) return `${m}m ${s.toString().padStart(2, "0")}s`;
  return `${s}s`;
}

export function SessionAwarenessBand({
  sessionStartedAt,
  activeTab,
  directiveCount,
}: {
  sessionStartedAt: number;
  activeTab: Tab;
  directiveCount: number;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const tick = () => setElapsed(Date.now() - sessionStartedAt);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [sessionStartedAt]);

  const accent = CHAMBER_ACCENT[activeTab] ?? "var(--r-subtext)";
  const verb = CHAMBER_VERB[activeTab] ?? "operating";

  return (
    <div
      style={{
        height: "24px",
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        gap: "12px",
        borderBottom: "1px solid var(--r-border-soft)",
        background: "var(--r-bg)",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Breathing dot — accelerates when directives are active */}
      <motion.div
        key={directiveCount > 0 ? "active" : "idle"}
        animate={
          directiveCount > 0
            ? { opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }
            : { opacity: [0.3, 0.8, 0.3] }
        }
        transition={{
          duration: directiveCount > 0 ? 1.5 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: accent,
          flexShrink: 0,
        }}
      />

      {/* SESSION label */}
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "8px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--r-dim)",
          flexShrink: 0,
          userSelect: "none",
        }}
      >
        {directiveCount > 0 ? "Session · Active" : "Session"}
      </span>

      {/* Elapsed time */}
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "9px",
          letterSpacing: "0.04em",
          color: "var(--r-subtext)",
          flexShrink: 0,
        }}
      >
        {formatElapsed(elapsed)}
      </span>

      {/* Divider */}
      <span style={{ width: "1px", height: "8px", background: "var(--r-border-soft)", flexShrink: 0 }} />

      {/* Chamber verb */}
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "8px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: accent,
          opacity: 0.7,
          flexShrink: 0,
          userSelect: "none",
        }}
      >
        {verb}
      </span>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Directive count — flashes on increment */}
      <AnimatePresence mode="wait">
        <motion.div
          key={directiveCount}
          initial={{ opacity: 0, y: -4, background: directiveCount > 0 ? `color-mix(in srgb, ${accent} 15%, transparent)` : "transparent" }}
          animate={{ opacity: 1, y: 0, background: "transparent" }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "2px 6px",
            borderRadius: "2px",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "8px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--r-dim)",
              userSelect: "none",
            }}
          >
            Directives
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              fontWeight: 600,
              color: directiveCount > 0 ? "var(--r-text)" : "var(--r-dim)",
              minWidth: "14px",
              textAlign: "right",
            }}
          >
            {directiveCount}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
