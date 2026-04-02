/**
 * RUBERRA — Mission Context Band
 * Stack 05 · Adaptive Experience · Global Mission Binding
 *
 * One authoritative band. Mission is the center.
 * Live pulse when execution is happening inside this mission.
 * Silent when no mission is active.
 */

import { motion } from "motion/react";
import { type Mission, CHAMBER_ACCENT, MISSION_STATUS_LABEL } from "../dna/mission-substrate";

const STATUS_COLOR: Record<string, string> = {
  active:    "var(--r-ok)",
  running:   "var(--r-accent)",
  planning:  "var(--r-subtext)",
  blocked:   "var(--r-err)",
  paused:    "var(--r-warn)",
  completed: "var(--r-ok)",
  archived:  "var(--r-dim)",
};

export function MissionContextBand({
  mission,
  onRelease,
  isExecuting = false,
  runCount = 0,
  runtimeState,
}: {
  mission:      Mission;
  onRelease:    () => void;
  /** True when the AI is actively executing in any chamber bound to this mission */
  isExecuting?: boolean;
  /** Number of completed continuity runs attributed to this mission */
  runCount?:    number;
  /** Runtime awareness state derived from live system events */
  runtimeState?: "running" | "idle" | "blocked" | "planning" | "active" | "paused" | "completed" | "archived";
}) {
  const accent     = CHAMBER_ACCENT[mission.identity.chamberLead];
  const statusKey  = isExecuting ? "running" : (runtimeState ?? mission.ledger.currentState);
  const status     = MISSION_STATUS_LABEL[statusKey] ?? statusKey;
  const statusColor = STATUS_COLOR[statusKey] ?? "var(--r-dim)";

  return (
    <div
      style={{
        height:       "30px",
        display:      "flex",
        alignItems:   "center",
        padding:      "0 16px",
        gap:          "8px",
        borderBottom: "1px solid var(--r-border-soft)",
        background:   `color-mix(in srgb, ${accent} 6%, var(--r-surface))`,
        flexShrink:   0,
      }}
    >
      {/* Live dot — pulses when executing */}
      {isExecuting ? (
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "5px", height: "5px", borderRadius: "50%", background: accent, flexShrink: 0 }}
        />
      ) : (
        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: accent, flexShrink: 0, opacity: 0.7 }} />
      )}

      {/* MISSION label */}
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7px", letterSpacing: "0.12em", textTransform: "uppercase", color: accent, flexShrink: 0, userSelect: "none", fontWeight: 600 }}>
        MISSION
      </span>

      {/* Mission name */}
      <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "var(--r-text)", fontWeight: 500, letterSpacing: "-0.01em", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {mission.identity.name}
      </span>

      {/* Run count — only when there are runs */}
      {runCount > 0 && (
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", color: "var(--r-dim)", letterSpacing: "0.05em", flexShrink: 0 }}>
          {runCount} {runCount === 1 ? "run" : "runs"}
        </span>
      )}

      {/* Execution state or status */}
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", letterSpacing: "0.09em", textTransform: "uppercase", color: statusColor, flexShrink: 0 }}>
        {status}
      </span>

      {/* Chamber lead */}
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", letterSpacing: "0.07em", textTransform: "uppercase", color: accent, flexShrink: 0, opacity: 0.8 }}>
        {mission.identity.chamberLead}
      </span>

      {/* Release */}
      <button
        onClick={onRelease}
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--r-dim)", background: "transparent", border: "none", cursor: "pointer", padding: "0", flexShrink: 0, outline: "none", transition: "color 0.1s ease" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--r-subtext)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--r-dim)"; }}
        title="Release mission context"
      >
        release
      </button>
    </div>
  );
}
