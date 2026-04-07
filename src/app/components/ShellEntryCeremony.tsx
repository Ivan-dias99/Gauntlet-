/**
 * RUBERRA — Shell Entry Ceremony
 * Sovereign threshold crossing. Not a loading screen — a moment of arrival.
 * The organism acknowledges your presence before revealing the workspace.
 */

import { useEffect, useState } from "react";
import { motion } from "motion/react";

function formatSessionTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  const s = d.getSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function formatSessionDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function ShellEntryCeremony({
  chamber,
  onComplete,
}: {
  chamber: string;
  onComplete: () => void;
}) {
  const [sessionTs] = useState(() => Date.now());
  const [phase, setPhase] = useState<"mark" | "identity" | "dissolve">("mark");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("identity"), 300);
    const t2 = setTimeout(() => setPhase("dissolve"), 900);
    const t3 = setTimeout(() => onComplete(), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "dissolve" ? 0 : 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "var(--r-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* R Mark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "36px",
          height: "36px",
          background: "var(--r-text)",
          borderRadius: "3px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          marginBottom: "24px",
        }}
      >
        <div style={{ position: "absolute", width: "2px", height: "16px", background: "var(--r-bg)", top: "10px", left: "13px", borderRadius: "1px" }} />
        <div style={{ position: "absolute", width: "9px", height: "8px", border: "2px solid var(--r-bg)", borderRadius: "3px 3px 0 0", borderBottom: "none", top: "10px", left: "13px" }} />
        <div style={{ position: "absolute", width: "8px", height: "2px", background: "var(--r-bg)", top: "21px", left: "16px", borderRadius: "1px", transform: "rotate(38deg)", transformOrigin: "0 50%" }} />
      </motion.div>

      {/* Session identity */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: phase === "mark" ? 0 : 1, y: phase === "mark" ? 6 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            letterSpacing: "0.04em",
            color: "var(--r-text)",
            fontWeight: 500,
          }}
        >
          {formatSessionTime(sessionTs)}
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.06em",
            color: "var(--r-subtext)",
          }}
        >
          {formatSessionDate(sessionTs)}
        </span>

        {/* Chamber indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "8px",
            padding: "5px 12px",
            border: "1px solid var(--r-border-soft)",
            borderRadius: "2px",
            background: "var(--r-surface)",
          }}
        >
          <div
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background:
                chamber === "lab" ? "var(--chamber-lab)"
                : chamber === "school" ? "var(--chamber-school)"
                : chamber === "creation" ? "var(--chamber-creation)"
                : "var(--r-subtext)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--r-text)",
            }}
          >
            {chamber}
          </span>
        </div>
      </motion.div>

      {/* Structural grid — subtle presence */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(var(--r-border-soft) 1px, transparent 1px), linear-gradient(90deg, var(--r-border-soft) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.15,
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}
