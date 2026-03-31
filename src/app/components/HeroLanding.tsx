import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export function HeroLanding({ onEnter }: { onEnter: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--r-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        overflow: "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Dynamic Background Mesh */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.05, background: "radial-gradient(circle at 50% 40%, var(--r-accent) 0%, transparent 60%)" }} />

      <AnimatePresence>
        {mounted && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ maxWidth: "800px", textAlign: "center", position: "relative", zIndex: 10, padding: "0 24px" }}
          >
            {/* Minimal Pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{
                display: "inline-block",
                marginBottom: "24px",
                padding: "4px 12px",
                borderRadius: "999px",
                border: "1px solid var(--r-border)",
                background: "var(--r-surface)",
                fontSize: "11px",
                fontFamily: "'JetBrains Mono', monospace",
                color: "var(--r-subtext)",
                letterSpacing: "0.06em",
                textTransform: "uppercase"
              }}
            >
              System Online · V10 podium canon
            </motion.div>

            {/* Title */}
            <h1
              style={{
                fontSize: "clamp(48px, 8vw, 82px)",
                fontWeight: 600,
                color: "var(--r-text)",
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
                marginBottom: "24px"
              }}
            >
              The AI-Native <br />
              <span style={{ color: "var(--r-accent-soft)" }}>Operating Organism.</span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: "18px",
                color: "var(--r-subtext)",
                maxWidth: "600px",
                margin: "0 auto 48px",
                lineHeight: 1.6,
                letterSpacing: "-0.01em"
              }}
            >
              Ruberra is not a workspace. It is a living machine. Three unified chambers—Lab, School, Creation—governed by one continuity ledger. No decorative truth. Only runtime reality.
            </p>

            {/* Enter Action */}
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEnter}
              style={{
                padding: "16px 36px",
                borderRadius: "12px",
                background: "var(--r-text)",
                color: "var(--r-bg)",
                border: "none",
                fontSize: "15px",
                fontWeight: 500,
                letterSpacing: "0.01em",
                cursor: "pointer",
                boxShadow: "0 12px 24px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                margin: "0 auto",
                outline: "none"
              }}
            >
              Initialize Neural Mesh
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        style={{
          position: "absolute",
          bottom: "32px",
          display: "flex",
          gap: "32px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
          color: "var(--r-dim)",
          letterSpacing: "0.05em",
          textTransform: "uppercase"
        }}
      >
        <span>Lab</span>
        <span>School</span>
        <span>Creation</span>
        <span>Profile</span>
      </motion.div>
    </div>
  );
}
