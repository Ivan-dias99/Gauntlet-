/**
 * RUBERRA — Sovereign Entry Surface
 * Five-section scrollable sales organism.
 * Pain → Resolution → Proof → Conviction → Entry.
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { type Theme } from "./shell-types";

const CHAMBERS = [
  { id: "lab",      label: "Lab",      accent: "var(--chamber-lab)",      verb: "Investigate", desc: "Evidence-grade investigation. Every query becomes a retrievable object." },
  { id: "school",   label: "School",   accent: "var(--chamber-school)",   verb: "Master",      desc: "Structured mastery. Lessons compound into knowledge graphs." },
  { id: "creation", label: "Creation", accent: "var(--chamber-creation)", verb: "Build",       desc: "Build output with execution traces. Not chat — consequence." },
  { id: "profile",  label: "Profile",  accent: "var(--r-subtext)",       verb: "Govern",      desc: "Sovereign governance. Continuity, missions, operations ledger." },
] as const;

const PAIN_CARDS = [
  {
    pain: "Context dies between sessions",
    resolution: "Continuity fabric persists everything",
    keyword: "Memory",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    pain: "Chat is shallow — no depth, no structure",
    resolution: "Three chambers: investigate · master · build",
    keyword: "Chambers",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    pain: "Output is dead text — no execution, no consequence",
    resolution: "Execution traces, mission binding, runtime telemetry",
    keyword: "Consequence",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
      </svg>
    ),
  },
] as const;

// ─── R mark ─────────────────────────────────────────────────────────────────

function RMark({ size = 22 }: { size?: number }) {
  return (
    <div
      style={{
        width:         `${size}px`,
        height:        `${size}px`,
        background:    "var(--r-text)",
        borderRadius:  `${Math.round(size * 0.24)}px`,
        display:       "flex",
        alignItems:    "center",
        justifyContent:"center",
        flexShrink:    0,
        position:      "relative",
        overflow:      "hidden",
        boxShadow:     "0 1px 3px rgba(0,0,0,0.18)",
      }}
    >
      <div style={{ position: "absolute", width: "1.5px", height: `${size * 0.46}px`, background: "rgba(255,255,255,0.92)", top: `${size * 0.24}px`, left: `${size * 0.34}px`, borderRadius: "1px" }} />
      <div style={{ position: "absolute", width: `${size * 0.24}px`, height: `${size * 0.24}px`, border: "1.5px solid rgba(255,255,255,0.92)", borderRadius: `${size * 0.1}px ${size * 0.1}px 0 0`, borderBottom: "none", top: `${size * 0.24}px`, left: `${size * 0.34}px` }} />
      <div style={{ position: "absolute", width: `${size * 0.22}px`, height: "1.5px", background: "rgba(255,255,255,0.92)", top: `${size * 0.57}px`, left: `${size * 0.44}px`, borderRadius: "1px", transform: "rotate(38deg)", transformOrigin: "0 50%" }} />
    </div>
  );
}

// ─── Animated section wrapper (scroll-driven reveal) ────────────────────────

function RevealSection({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      style={style}
    >
      {children}
    </motion.section>
  );
}

// ─── Background layers ──────────────────────────────────────────────────────

function StructuralGrid() {
  return (
    <div
      style={{
        position:     "fixed",
        inset:        0,
        backgroundImage: `
          linear-gradient(var(--r-border-soft) 1px, transparent 1px),
          linear-gradient(90deg, var(--r-border-soft) 1px, transparent 1px)
        `,
        backgroundSize: "52px 52px",
        opacity:      "var(--hero-grid-opacity)",
        pointerEvents:"none",
        zIndex:       0,
      }}
    />
  );
}

function AtmosphericGlow() {
  return (
    <>
      <div
        style={{
          position:     "fixed",
          top:          "0",
          left:         "50%",
          transform:    "translateX(-50%)",
          width:        "80vw",
          height:       "60vh",
          background:   "radial-gradient(ellipse at center, var(--r-accent-dim) 0%, transparent 72%)",
          opacity:      "var(--hero-glow-center-opacity)",
          pointerEvents:"none",
          zIndex:       1,
        }}
      />
      <div style={{ position: "fixed", top: 0, right: 0, width: "30vw", height: "30vh", background: "radial-gradient(ellipse at top right, color-mix(in srgb, var(--chamber-lab) 14%, transparent) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, width: "25vw", height: "25vh", background: "radial-gradient(ellipse at bottom left, color-mix(in srgb, var(--chamber-creation) 12%, transparent) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />
    </>
  );
}

// ─── Top nav (sticky) ───────────────────────────────────────────────────────

function TopNav({ onEnter, isNarrow }: { onEnter: (chamber?: string) => void; isNarrow: boolean }) {
  return (
    <div
      style={{
        position:     "sticky",
        top: 0,
        left: 0, right: 0,
        minHeight:    "52px",
        display:      "flex",
        alignItems:   "center",
        justifyContent:"space-between",
        flexWrap:     "wrap",
        gap:          "10px",
        padding:      "10px max(16px, 4vw)",
        zIndex:       100,
        borderBottom: "1px solid var(--r-border-soft)",
        background:   "color-mix(in srgb, var(--r-bg) 82%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <RMark size={20} />
        <span style={{
          fontSize:      "11px",
          fontWeight:    600,
          letterSpacing: "0.13em",
          color:         "var(--r-text)",
          userSelect:    "none",
          fontFamily:    "'Inter', system-ui, sans-serif",
        }}>
          RUBERRA
        </span>
      </div>

      {!isNarrow && (
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {CHAMBERS.map((c) => (
            <button
              key={c.id}
              onClick={() => onEnter(c.id)}
              style={{
                fontSize:     "11px",
                fontFamily:   "'Inter', system-ui, sans-serif",
                color:        "var(--r-subtext)",
                background:   "transparent",
                border:       "none",
                cursor:       "pointer",
                outline:      "none",
                letterSpacing:"0.01em",
                padding:      "4px 0",
                transition:   "color 0.12s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--r-text)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--r-subtext)"; }}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => onEnter()}
        style={{
          padding:      "6px 16px",
          borderRadius: "6px",
          border:       "1px solid var(--r-border)",
          background:   "var(--r-surface)",
          color:        "var(--r-text)",
          fontSize:     "11px",
          fontFamily:   "'Inter', system-ui, sans-serif",
          fontWeight:   500,
          letterSpacing:"0.02em",
          cursor:       "pointer",
          outline:      "none",
          transition:   "all 0.12s ease",
          boxShadow:    "0 1px 3px rgba(0,0,0,0.04)",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background    = "var(--r-text)";
          el.style.color         = "var(--r-bg)";
          el.style.borderColor   = "var(--r-text)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background    = "var(--r-surface)";
          el.style.color         = "var(--r-text)";
          el.style.borderColor   = "var(--r-border)";
        }}
      >
        Enter →
      </button>
    </div>
  );
}

// ─── Section 1: Hero ────────────────────────────────────────────────────────

function HeroSection({ onEnter }: { onEnter: (chamber?: string) => void }) {
  return (
    <div
      style={{
        minHeight:     "calc(100vh - 52px)",
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        justifyContent:"center",
        padding:       "max(60px, 10vh) max(16px, 4vw) max(40px, 6vh)",
        position:      "relative",
        zIndex:        10,
      }}
    >
      {/* System tag */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{
          display:       "flex",
          alignItems:    "center",
          gap:           "6px",
          marginBottom:  "20px",
        }}
      >
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--r-ok)", opacity: 0.7 }} />
        <span style={{
          fontSize:      "10px",
          fontFamily:    "'JetBrains Mono', monospace",
          color:         "var(--r-dim)",
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
        }}>
          sovereign intelligence workstation
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        style={{
          fontSize:      "clamp(28px, 5.5vw, 56px)",
          fontWeight:    600,
          color:         "var(--r-text)",
          fontFamily:    "'Inter', system-ui, sans-serif",
          textAlign:     "center",
          lineHeight:    1.12,
          letterSpacing: "-0.035em",
          margin:        "0 0 16px",
          maxWidth:      "720px",
        }}
      >
        Your AI doesn't{" "}
        <span style={{ color: "var(--r-accent)" }}>remember</span> you.
      </motion.h1>

      {/* Subline */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        style={{
          fontSize:      "clamp(14px, 1.8vw, 18px)",
          color:         "var(--r-subtext)",
          fontFamily:    "'Inter', system-ui, sans-serif",
          textAlign:     "center",
          lineHeight:    1.6,
          letterSpacing: "-0.01em",
          margin:        "0 0 36px",
          maxWidth:      "540px",
        }}
      >
        Ruberra does. One shell. Continuous memory.{" "}
        <span style={{ color: "var(--r-text)", fontWeight: 500 }}>Every session compounds.</span>
      </motion.p>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        whileHover={{ y: -1, boxShadow: "0 8px 28px rgba(0,0,0,0.12)" }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onEnter()}
        style={{
          padding:        "14px 32px",
          borderRadius:   "8px",
          border:         "1px solid color-mix(in srgb, var(--r-text) 18%, transparent)",
          background:     "var(--r-text)",
          color:          "var(--r-bg)",
          fontSize:       "14px",
          fontWeight:     500,
          fontFamily:     "'Inter', system-ui, sans-serif",
          letterSpacing:  "-0.005em",
          cursor:         "pointer",
          outline:        "none",
          display:        "flex",
          alignItems:     "center",
          gap:            "8px",
          boxShadow:      "0 2px 12px rgba(0,0,0,0.08)",
          transition:     "box-shadow 0.15s ease",
        }}
      >
        Enter Ruberra
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{
          position:    "absolute",
          bottom:      "24px",
          left:        "50%",
          transform:   "translateX(-50%)",
        }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M4 9l4 4 4-4" stroke="var(--r-dim)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Section 2: Pain Cards ──────────────────────────────────────────────────

function PainSection() {
  return (
    <RevealSection
      style={{
        padding:    "max(60px, 8vh) max(16px, 4vw)",
        maxWidth:   "960px",
        margin:     "0 auto",
        position:   "relative",
        zIndex:     10,
      }}
    >
      <p style={{
        fontSize:      "10px",
        fontFamily:    "'JetBrains Mono', monospace",
        color:         "var(--r-dim)",
        letterSpacing: "0.12em",
        textTransform: "uppercase" as const,
        marginBottom:  "12px",
      }}>
        Why this exists
      </p>
      <h2 style={{
        fontSize:      "clamp(20px, 3.2vw, 32px)",
        fontWeight:    600,
        color:         "var(--r-text)",
        fontFamily:    "'Inter', system-ui, sans-serif",
        letterSpacing: "-0.025em",
        lineHeight:    1.2,
        margin:        "0 0 40px",
      }}>
        Every AI interface forgets.{" "}
        <span style={{ color: "var(--r-subtext)", fontWeight: 400 }}>
          Context dies. Output dies. Nothing compounds.
        </span>
      </h2>

      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap:                 "16px",
      }}>
        {PAIN_CARDS.map((card, i) => (
          <RevealSection key={card.keyword} delay={i * 0.08}>
            <motion.div
              whileHover={{ y: -2, borderColor: "var(--r-border)" }}
              transition={{ duration: 0.15 }}
              style={{
                padding:      "24px 22px",
                borderRadius: "10px",
                border:       "1px solid var(--r-border-soft)",
                background:   "var(--r-surface)",
                position:     "relative",
                overflow:     "hidden",
                cursor:       "default",
              }}
            >
              {/* System label */}
              <div style={{
                display:       "flex",
                alignItems:    "center",
                gap:           "8px",
                marginBottom:  "14px",
                color:         "var(--r-accent)",
              }}>
                {card.icon}
                <span style={{
                  fontSize:      "9px",
                  fontFamily:    "'JetBrains Mono', monospace",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color:         "var(--r-accent-soft)",
                }}>
                  {card.keyword}
                </span>
              </div>

              {/* Pain */}
              <p style={{
                fontSize:      "13px",
                color:         "var(--r-text)",
                fontFamily:    "'Inter', system-ui, sans-serif",
                fontWeight:    500,
                lineHeight:    1.45,
                margin:        "0 0 10px",
              }}>
                {card.pain}
              </p>

              {/* Resolution */}
              <p style={{
                fontSize:      "12px",
                color:         "var(--r-subtext)",
                fontFamily:    "'Inter', system-ui, sans-serif",
                lineHeight:    1.5,
                margin:        0,
              }}>
                → {card.resolution}
              </p>
            </motion.div>
          </RevealSection>
        ))}
      </div>
    </RevealSection>
  );
}

// ─── Section 3: Chambers ────────────────────────────────────────────────────

function ChambersSection({ onEnter }: { onEnter: (chamber?: string) => void }) {
  return (
    <RevealSection
      style={{
        padding:    "max(60px, 8vh) max(16px, 4vw)",
        maxWidth:   "960px",
        margin:     "0 auto",
        position:   "relative",
        zIndex:     10,
      }}
    >
      <p style={{
        fontSize:      "10px",
        fontFamily:    "'JetBrains Mono', monospace",
        color:         "var(--r-dim)",
        letterSpacing: "0.12em",
        textTransform: "uppercase" as const,
        marginBottom:  "12px",
      }}>
        Four chambers · one runtime
      </p>
      <h2 style={{
        fontSize:      "clamp(20px, 3.2vw, 32px)",
        fontWeight:    600,
        color:         "var(--r-text)",
        fontFamily:    "'Inter', system-ui, sans-serif",
        letterSpacing: "-0.025em",
        lineHeight:    1.2,
        margin:        "0 0 40px",
      }}>
        Not tabs.{" "}
        <span style={{ color: "var(--r-subtext)", fontWeight: 400 }}>
          Specialized operating environments that share memory, context, and consequence.
        </span>
      </h2>

      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap:                 "12px",
      }}>
        {CHAMBERS.map((c, i) => (
          <RevealSection key={c.id} delay={i * 0.06}>
            <motion.button
              whileHover={{ y: -2, borderColor: c.accent }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.15 }}
              onClick={() => onEnter(c.id)}
              style={{
                width:         "100%",
                padding:       "20px 18px",
                borderRadius:  "8px",
                border:        "1px solid var(--r-border-soft)",
                background:    "var(--r-surface)",
                textAlign:     "left" as const,
                cursor:        "pointer",
                outline:       "none",
                position:      "relative",
              }}
            >
              {/* Accent dot + label */}
              <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
                <div style={{
                  width:        "6px",
                  height:       "6px",
                  borderRadius: "50%",
                  background:   c.accent,
                  opacity:      0.8,
                }} />
                <span style={{
                  fontSize:      "12px",
                  fontWeight:    600,
                  color:         "var(--r-text)",
                  fontFamily:    "'Inter', system-ui, sans-serif",
                  letterSpacing: "-0.01em",
                }}>
                  {c.label}
                </span>
                <span style={{
                  fontSize:      "9px",
                  fontFamily:    "'JetBrains Mono', monospace",
                  color:         "var(--r-dim)",
                  letterSpacing: "0.06em",
                  textTransform: "lowercase" as const,
                }}>
                  {c.verb}
                </span>
              </div>

              {/* Description */}
              <p style={{
                fontSize:      "12px",
                color:         "var(--r-subtext)",
                fontFamily:    "'Inter', system-ui, sans-serif",
                lineHeight:    1.55,
                margin:        0,
              }}>
                {c.desc}
              </p>
            </motion.button>
          </RevealSection>
        ))}
      </div>
    </RevealSection>
  );
}

// ─── Section 4: Conviction ──────────────────────────────────────────────────

function ConvictionSection({ onEnter }: { onEnter: (chamber?: string) => void }) {
  return (
    <RevealSection
      style={{
        padding:       "max(80px, 10vh) max(16px, 4vw)",
        maxWidth:      "720px",
        margin:        "0 auto",
        textAlign:     "center" as const,
        position:      "relative",
        zIndex:        10,
      }}
    >
      <h2 style={{
        fontSize:      "clamp(22px, 3.8vw, 40px)",
        fontWeight:    600,
        color:         "var(--r-text)",
        fontFamily:    "'Inter', system-ui, sans-serif",
        letterSpacing: "-0.03em",
        lineHeight:    1.15,
        margin:        "0 0 20px",
      }}>
        Not a wrapper around GPT.
      </h2>
      <p style={{
        fontSize:      "clamp(14px, 1.6vw, 17px)",
        color:         "var(--r-subtext)",
        fontFamily:    "'Inter', system-ui, sans-serif",
        lineHeight:    1.65,
        letterSpacing: "-0.01em",
        margin:        "0 0 12px",
        maxWidth:      "560px",
        marginLeft:    "auto",
        marginRight:   "auto",
      }}>
        Not another IDE chat panel.
      </p>
      <p style={{
        fontSize:      "clamp(14px, 1.6vw, 17px)",
        color:         "var(--r-text)",
        fontFamily:    "'Inter', system-ui, sans-serif",
        fontWeight:    500,
        lineHeight:    1.65,
        letterSpacing: "-0.01em",
        margin:        "0 0 36px",
        maxWidth:      "560px",
        marginLeft:    "auto",
        marginRight:   "auto",
      }}>
        A sovereign workstation where your AI remembers, your work compounds,
        and your sessions never die.
      </p>

      {/* Features strip */}
      <div style={{
        display:       "flex",
        flexWrap:      "wrap",
        justifyContent:"center",
        gap:           "8px",
        marginBottom:  "36px",
      }}>
        {["Mission-bound", "Memory-bearing", "Consequence-driven", "Chamber-native", "20-stack architecture"].map((tag) => (
          <span
            key={tag}
            style={{
              padding:       "5px 12px",
              borderRadius:  "4px",
              border:        "1px solid var(--r-border-soft)",
              background:    "transparent",
              fontSize:      "10px",
              fontFamily:    "'JetBrains Mono', monospace",
              color:         "var(--r-subtext)",
              letterSpacing: "0.04em",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Final CTA */}
      <motion.button
        whileHover={{ y: -1, boxShadow: "0 8px 28px rgba(0,0,0,0.12)" }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onEnter()}
        style={{
          padding:        "14px 36px",
          borderRadius:   "8px",
          border:         "1px solid color-mix(in srgb, var(--r-text) 18%, transparent)",
          background:     "var(--r-text)",
          color:          "var(--r-bg)",
          fontSize:       "14px",
          fontWeight:     500,
          fontFamily:     "'Inter', system-ui, sans-serif",
          letterSpacing:  "-0.005em",
          cursor:         "pointer",
          outline:        "none",
          display:        "inline-flex",
          alignItems:     "center",
          gap:            "8px",
          boxShadow:      "0 2px 12px rgba(0,0,0,0.08)",
          transition:     "box-shadow 0.15s ease",
        }}
      >
        Enter Ruberra
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>
    </RevealSection>
  );
}

// ─── Section 5: Footer ──────────────────────────────────────────────────────

function LandingFooter({ onEnter, isNarrow }: { onEnter: (chamber?: string) => void; isNarrow: boolean }) {
  return (
    <div
      style={{
        padding:        "0 max(16px, 4vw)",
        height:         "52px",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        borderTop:      "1px solid var(--r-border-soft)",
        position:       "relative",
        zIndex:         10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        {!isNarrow ? (
          CHAMBERS.map((c) => (
            <span
              key={c.id}
              style={{
                fontSize:      "9px",
                fontFamily:    "'JetBrains Mono', monospace",
                color:         "var(--r-dim)",
                letterSpacing: "0.10em",
                textTransform: "uppercase" as const,
                display:       "flex",
                alignItems:    "center",
                gap:           "5px",
                cursor:        "pointer",
                transition:    "color 0.12s ease",
              }}
              onClick={() => onEnter(c.id)}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = c.accent; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--r-dim)"; }}
            >
              <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: c.accent, display: "inline-block", opacity: 0.6 }} />
              {c.label}
            </span>
          ))
        ) : (
          <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.06em" }}>
            4 chambers · shared runtime · local memory
          </span>
        )}
      </div>

      {!isNarrow && (
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{
            fontSize:     "9px",
            fontFamily:   "'JetBrains Mono', monospace",
            color:        "var(--r-dim)",
            letterSpacing:"0.07em",
            opacity:      0.6,
          }}>
            ↵ enter
          </span>
          <span style={{
            fontSize:     "9px",
            fontFamily:   "'JetBrains Mono', monospace",
            color:        "var(--r-dim)",
            letterSpacing:"0.07em",
            opacity:      0.6,
          }}>
            v10
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────

export function HeroLanding({ onEnter, theme }: { onEnter: (chamber?: string) => void; theme: Theme }) {
  const [isNarrow, setIsNarrow] = useState(() => typeof window !== "undefined" ? window.innerWidth < 520 : false);

  useEffect(() => {
    if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
  }, [theme]);

  useEffect(() => {
    const handler = () => setIsNarrow(window.innerWidth < 520);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Keyboard: Enter → proceed
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "Enter" && tag !== "INPUT" && tag !== "TEXTAREA") {
        onEnter();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onEnter]);

  return (
    <div
      style={{
        position:   "fixed",
        inset:      0,
        background: "var(--r-bg)",
        display:    "flex",
        flexDirection:"column",
        zIndex:     9999,
        overflow:   "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
        transition: "background 0.25s ease",
      }}
    >
      {/* Background */}
      <StructuralGrid />
      <AtmosphericGlow />

      {/* Scrollable content */}
      <div
        style={{
          flex:       1,
          overflow:   "auto",
          display:    "flex",
          flexDirection: "column",
        }}
        className="hide-scrollbar"
      >
        {/* Sticky nav */}
        <TopNav onEnter={onEnter} isNarrow={isNarrow} />

        {/* S1: Hero */}
        <HeroSection onEnter={onEnter} />

        {/* S2: Pain Cards */}
        <PainSection />

        {/* S3: Chambers */}
        <ChambersSection onEnter={onEnter} />

        {/* S4: Conviction */}
        <ConvictionSection onEnter={onEnter} />

        {/* S5: Footer */}
        <LandingFooter onEnter={onEnter} isNarrow={isNarrow} />
      </div>
    </div>
  );
}
