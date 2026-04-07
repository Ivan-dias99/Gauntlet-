/**
 * RUBERRA — Session Awareness Band
 * Operational strip. Data only. No narrative.
 */

import { useState, useEffect } from "react";
import { type Tab } from "./shell-types";

const CHAMBER_ACCENT: Record<string, string> = {
  lab:      "var(--chamber-lab)",
  school:   "var(--chamber-school)",
  creation: "var(--chamber-creation)",
  profile:  "var(--r-subtext)",
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
  const mono = "'JetBrains Mono', monospace";

  return (
    <div
      style={{
        height: "24px",
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        gap: "10px",
        borderBottom: "1px solid var(--r-border-soft)",
        background: "var(--r-bg)",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Status dot */}
      <div
        style={{
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: accent,
          flexShrink: 0,
          opacity: directiveCount > 0 ? 1 : 0.5,
        }}
      />

      <span style={{ fontFamily: mono, fontSize: "8px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--r-dim)", flexShrink: 0, userSelect: "none" }}>
        Session
      </span>

      <span style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "0.04em", color: "var(--r-subtext)", flexShrink: 0 }}>
        {formatElapsed(elapsed)}
      </span>

      <span style={{ width: "1px", height: "8px", background: "var(--r-border-soft)", flexShrink: 0 }} />

      <span style={{ fontFamily: mono, fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", color: accent, opacity: 0.8, flexShrink: 0, userSelect: "none" }}>
        {activeTab}
      </span>

      <div style={{ flex: 1 }} />

      <span style={{ fontFamily: mono, fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--r-dim)", userSelect: "none" }}>
        {directiveCount}
      </span>
    </div>
  );
}
