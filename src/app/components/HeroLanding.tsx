/**
 * RUBERRA — Sovereign Entry Surface
 * Transfigured: Living organism hero, sharp pain strips, ignition bridge.
 * Pain → Resolution → Trinity → Conviction → Entry.
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

const PAIN_ITEMS = [
  { pain: "Context dies between sessions", resolution: "Continuity fabric persists everything across sessions", keyword: "Memory" },
  { pain: "Chat is shallow — no structure, no depth", resolution: "Three specialized chambers sharing one runtime", keyword: "Chambers" },
  { pain: "Output is dead text — no trace, no consequence", resolution: "Execution traces, mission binding, runtime telemetry", keyword: "Consequence" },
  { pain: "No mission gravity — everything resets", resolution: "Missions as sovereign operational substrate", keyword: "Mission" },
  { pain: "Fragmented tools — nothing coheres", resolution: "One organism: memory · pioneers · workflows · signals", keyword: "Organism" },
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
        boxShadow: "none",
      }}
    >
      <div style={{ position: "absolute", width: "1.5px", height: `${size * 0.46}px`, background: "rgba(255,255,255,0.92)", top: `${size * 0.24}px`, left: `${size * 0.34}px`, borderRadius: "1px" }} />
      <div style={{ position: "absolute", width: `${size * 0.24}px`, height: `${size * 0.24}px`, border: "1.5px solid rgba(255,255,255,0.92)", borderRadius: `${size * 0.1}px ${size * 0.1}px 0 0`, borderBottom: "none", top: `${size * 0.24}px`, left: `${size * 0.34}px` }} />
      <div style={{ position: "absolute", width: `${size * 0.22}px`, height: "1.5px", background: "rgba(255,255,255,0.92)", top: `${size * 0.57}px`, left: `${size * 0.44}px`, borderRadius: "1px", transform: "rotate(38deg)", transformOrigin: "0 50%" }} />
    </div>
  );
}

// ─── Scroll-driven reveal ────────────────────────────────────────────────────

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

// ─── Background layers ───────────────────────────────────────────────────────

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
      {/* Primary center glow — much stronger */}
      <div
        style={{
          position:     "fixed",
          top:          "-10%",
          left:         "50%",
          transform:    "translateX(-50%)",
          width:        "100vw",
          height:       "80vh",
          background:   "radial-gradient(ellipse at 50% 10%, color-mix(in srgb, var(--r-accent) 22%, transparent) 0%, color-mix(in srgb, var(--r-accent-dim) 18%, transparent) 30%, transparent 70%)",
          opacity:      "var(--hero-glow-center-opacity)",
          pointerEvents:"none",
          zIndex:       1,
        }}
      />
      {/* Lab corner — deep green */}
      <div style={{
        position: "fixed", top: 0, right: 0,
        width: "40vw", height: "45vh",
        background: "radial-gradient(ellipse at top right, color-mix(in srgb, var(--chamber-lab) 28%, transparent) 0%, transparent 65%)",
        opacity: 0.18,
        pointerEvents: "none", zIndex: 1,
      }} />
      {/* Creation corner — warm amber */}
      <div style={{
        position: "fixed", bottom: "10%", left: 0,
        width: "35vw", height: "40vh",
        background: "radial-gradient(ellipse at bottom left, color-mix(in srgb, var(--chamber-creation) 24%, transparent) 0%, transparent 65%)",
        opacity: 0.16,
        pointerEvents: "none", zIndex: 1,
      }} />
      {/* School bottom-right — blue */}
      <div style={{
        position: "fixed", bottom: 0, right: "10%",
        width: "30vw", height: "30vh",
        background: "radial-gradient(ellipse at bottom right, color-mix(in srgb, var(--chamber-school) 20%, transparent) 0%, transparent 65%)",
        opacity: 0.12,
        pointerEvents: "none", zIndex: 1,
      }} />
    </>
  );
}

// ─── Living Organism Visual ──────────────────────────────────────────────────
// A sovereign constellation that feels like a living AI substrate

function OrganismVisual() {
  const nodes = [
    { x: 50, y: 46, r: 5,   color: "var(--r-text)",          delay: 0,    label: "CORE",     isPrimary: true },
    { x: 50, y: 14, r: 3.5, color: "var(--chamber-lab)",     delay: 0.18, label: "LAB",      isPrimary: false },
    { x: 77, y: 30, r: 3.5, color: "var(--chamber-creation)",delay: 0.30, label: "CREATION", isPrimary: false },
    { x: 23, y: 30, r: 3.5, color: "var(--chamber-school)",  delay: 0.42, label: "SCHOOL",   isPrimary: false },
    { x: 50, y: 78, r: 2.8, color: "var(--r-subtext)",       delay: 0.55, label: "PROFILE",  isPrimary: false },
    { x: 82, y: 60, r: 2,   color: "var(--r-accent)",        delay: 0.68, label: "MEMORY",   isPrimary: false },
    { x: 18, y: 60, r: 2,   color: "var(--r-accent)",        delay: 0.80, label: "SIGNAL",   isPrimary: false },
    { x: 66, y: 84, r: 1.6, color: "var(--r-dim)",           delay: 0.90, label: "FLOW",     isPrimary: false },
    { x: 34, y: 84, r: 1.6, color: "var(--r-dim)",           delay: 0.98, label: "VALUE",    isPrimary: false },
  ];
  const edges = [
    [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
    [1,2],[1,3],[2,5],[3,6],[4,7],[4,8],[5,7],[6,8],
  ];

  return (
    <div style={{ width: "100%", maxWidth: "460px", aspectRatio: "1/1", position: "relative", margin: "0 auto" }}>
      {/* Outer ambient glow */}
      <div style={{
        position: "absolute",
        inset: "-20%",
        background: "radial-gradient(ellipse at center, color-mix(in srgb, var(--r-accent-dim) 60%, transparent) 0%, transparent 65%)",
        opacity: 0.45,
        pointerEvents: "none",
      }} />
      <svg
        viewBox="0 0 100 100"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        {/* Orbit ring around core */}
        <motion.circle
          cx={nodes[0].x} cy={nodes[0].y} r={18}
          fill="none"
          stroke="var(--r-border)"
          strokeWidth="0.35"
          strokeDasharray="2 4"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.12, 0.26, 0.12] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <motion.circle
          cx={nodes[0].x} cy={nodes[0].y} r={32}
          fill="none"
          stroke="var(--r-border-soft)"
          strokeWidth="0.25"
          strokeDasharray="1 6"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.06, 0.15, 0.06] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Edges — animated draw-in */}
        {edges.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            stroke={i < 6 ? "var(--r-border)" : "var(--r-border-soft)"}
            strokeWidth={i < 6 ? "0.55" : "0.35"}
            strokeDasharray={i < 6 ? "none" : "1 3"}
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: i < 6 ? 0.7 : 0.4, pathLength: 1 }}
            transition={{ duration: 0.9, delay: 0.4 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}

        {/* Deep pulse rings on primary nodes */}
        {[0, 1, 2, 3].map((idx) => {
          const node = nodes[idx];
          const pulseRadiusScale = idx === 0 ? 1.6 : 1.4;
          const rBase = node.r * pulseRadiusScale;
          return (
            <motion.circle
              key={`pulse-outer-${idx}`}
              cx={node.x} cy={node.y}
              fill="none"
              stroke={node.color}
              strokeWidth="0.35"
              initial={{ r: rBase, opacity: 0.04 }}
              animate={{ opacity: [0.04, 0.22, 0.04], r: [rBase, rBase + 7, rBase] }}
              transition={{ duration: 4 + idx * 0.7, delay: idx * 0.5, repeat: Infinity, ease: "easeInOut" }}
            />
          );
        })}
        {/* Inner pulse rings */}
        {[0, 1, 2, 3].map((idx) => {
          const node = nodes[idx];
          const rBase = node.r + 1;
          return (
            <motion.circle
              key={`pulse-inner-${idx}`}
              cx={node.x} cy={node.y}
              fill="none"
              stroke={node.color}
              strokeWidth="0.5"
              initial={{ r: rBase, opacity: 0.08 }}
              animate={{ opacity: [0.08, 0.35, 0.08], r: [rBase, rBase + 3, rBase] }}
              transition={{ duration: 3 + idx * 0.6, delay: 0.3 + idx * 0.4, repeat: Infinity, ease: "easeInOut" }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.circle
            key={i}
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill={node.color}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: node.isPrimary ? [0.75, 1, 0.75] : 0.9,
              scale: 1,
            }}
            transition={node.isPrimary
              ? { scale: { duration: 0.5, delay: node.delay, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 } }
              : { duration: 0.5, delay: node.delay, ease: [0.16, 1, 0.3, 1] }
            }
          />
        ))}

        {/* Node labels */}
        {nodes.slice(1).map((node, i) => (
          <motion.text
            key={`label-${i}`}
            x={node.x}
            y={node.y + node.r + 5}
            textAnchor="middle"
            fontSize="2.9"
            fill={node.color}
            fontFamily="'JetBrains Mono', monospace"
            letterSpacing="0.10em"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.72 }}
            transition={{ duration: 0.6, delay: node.delay + 0.35 }}
          >
            {node.label}
          </motion.text>
        ))}

        {/* Flow particles along primary edges */}
        {[[0,1],[0,2],[0,3],[0,4]].map(([a, b], i) => (
          <motion.circle
            key={`flow-${i}`}
            r={1.1}
            fill={nodes[b].color}
            opacity={0.75}
            initial={{ cx: nodes[a].x, cy: nodes[a].y }}
            animate={{
              cx: [nodes[a].x, nodes[b].x, nodes[a].x],
              cy: [nodes[a].y, nodes[b].y, nodes[a].y],
            }}
            transition={{ duration: 2.8 + i * 0.5, delay: 2 + i * 0.7, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Secondary flow particles */}
        {[[2,5],[3,6],[4,7]].map(([a, b], i) => (
          <motion.circle
            key={`flow2-${i}`}
            r={0.7}
            fill={nodes[b].color}
            opacity={0.5}
            initial={{ cx: nodes[a].x, cy: nodes[a].y }}
            animate={{
              cx: [nodes[a].x, nodes[b].x, nodes[a].x],
              cy: [nodes[a].y, nodes[b].y, nodes[a].y],
            }}
            transition={{ duration: 3.5 + i * 0.6, delay: 3 + i * 0.8, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
    </div>
  );
}

// ─── Top nav ─────────────────────────────────────────────────────────────────

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
          padding:      "6px 18px",
          borderRadius: "2px",
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
          boxShadow: "none",
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

// ─── Section 1: Hero ─────────────────────────────────────────────────────────

function HeroSection({ onEnter }: { onEnter: (chamber?: string) => void }) {
  return (
    <div
      style={{
        minHeight:     "calc(100vh - 52px)",
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        justifyContent:"center",
        padding:       "max(60px, 8vh) max(16px, 4vw) max(40px, 6vh)",
        position:      "relative",
        zIndex:        10,
        gap:           "0",
      }}
    >
      {/* Two-column layout: text left, organism right */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "1fr 1fr",
        gap:                 "clamp(32px, 5vw, 80px)",
        maxWidth:            "1100px",
        width:               "100%",
        alignItems:          "center",
      }}>
        {/* Left: Copy */}
        <div>
          {/* System tag */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{
              display:       "flex",
              alignItems:    "center",
              gap:           "6px",
              marginBottom:  "24px",
            }}
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--r-ok)" }}
            />
            <span style={{
              fontSize:      "10px",
              fontFamily:    "'JetBrains Mono', monospace",
              color:         "var(--r-subtext)",
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
            }}>
              sovereign intelligence workstation
            </span>
          </motion.div>

          {/* Headline — the attack */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{
              fontSize:      "clamp(34px, 5vw, 62px)",
              fontWeight:    700,
              color:         "var(--r-text)",
              fontFamily:    "'Inter', system-ui, sans-serif",
              lineHeight:    1.06,
              letterSpacing: "-0.045em",
              margin:        "0 0 22px",
            }}
          >
            Your AI doesn't{" "}
            <span style={{
              background: "linear-gradient(135deg, var(--r-accent) 0%, var(--chamber-school) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>remember</span>,{" "}
            doesn't{" "}
            <span style={{
              background: "linear-gradient(135deg, var(--chamber-lab) 0%, var(--r-accent) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>compound</span>,{" "}
            doesn't work with you.
          </motion.h1>

          {/* Subline — the answer */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            style={{
              fontSize:      "clamp(15px, 1.6vw, 18px)",
              color:         "var(--r-subtext)",
              fontFamily:    "'Inter', system-ui, sans-serif",
              lineHeight:    1.65,
              letterSpacing: "-0.01em",
              margin:        "0 0 36px",
              maxWidth:      "480px",
            }}
          >
            Ruberra is a <span style={{ color: "var(--r-text)", fontWeight: 600 }}>sovereign workstation</span> — one shell, continuous memory, consequence-bearing execution. Every session compounds. Nothing resets. Nothing fragments.
          </motion.p>

          {/* CTA group */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}
          >
            <motion.button
              whileHover={{ y: -2, boxShadow: "none" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onEnter()}
              style={{
                padding:        "15px 34px",
                borderRadius:   "2px",
                border:         "1px solid color-mix(in srgb, var(--r-text) 22%, transparent)",
                background:     "var(--r-text)",
                color:          "var(--r-bg)",
                fontSize:       "13px",
                fontWeight:     600,
                fontFamily:     "'Inter', system-ui, sans-serif",
                letterSpacing:  "0.01em",
                cursor:         "pointer",
                outline:        "none",
                display:        "flex",
                alignItems:     "center",
                gap:            "8px",
                boxShadow: "none",
                transition:     "box-shadow 0.15s ease",
              }}
            >
              Enter Ruberra
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>

            <span style={{
              fontSize:     "10px",
              fontFamily:   "'JetBrains Mono', monospace",
              color:        "var(--r-dim)",
              letterSpacing:"0.06em",
              userSelect:   "none",
            }}>
              or press ↵
            </span>
          </motion.div>

          {/* Feature signal strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "28px" }}
          >
            {[
              { label: "Mission-bound",     color: "var(--r-accent)" },
              { label: "Memory-bearing",    color: "var(--chamber-lab)" },
              { label: "Consequence-driven",color: "var(--chamber-creation)" },
              { label: "Chamber-native",    color: "var(--chamber-school)" },
            ].map(({ label, color }) => (
              <span
                key={label}
                style={{
                  padding:       "4px 10px",
                  borderRadius:  "2px",
                  border:        `1px solid color-mix(in srgb, ${color} 28%, var(--r-border))`,
                  background:    `color-mix(in srgb, ${color} 6%, var(--r-surface))`,
                  fontSize:      "9px",
                  fontFamily:    "'JetBrains Mono', monospace",
                  color:         color,
                  letterSpacing: "0.05em",
                }}
              >
                {label}
              </span>
            ))}
          </motion.div>

          {/* Living telemetry strip — system heartbeat */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          "16px",
              marginTop:    "24px",
              padding:      "10px 14px",
              borderRadius: "2px",
              border:       "1px solid var(--r-border-soft)",
              background:   "color-mix(in srgb, var(--r-surface) 50%, var(--r-bg))",
            }}
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--r-ok)", flexShrink: 0 }}
            />
            <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.06em" }}>
              Runtime ready
            </span>
            <span style={{ width: "1px", height: "10px", background: "var(--r-border-soft)", flexShrink: 0 }} />
            <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.06em" }}>
              4 chambers
            </span>
            <span style={{ width: "1px", height: "10px", background: "var(--r-border-soft)", flexShrink: 0 }} />
            <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.06em" }}>
              7 pioneers
            </span>
            <span style={{ width: "1px", height: "10px", background: "var(--r-border-soft)", flexShrink: 0 }} />
            <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.06em" }}>
              local memory
            </span>
          </motion.div>
        </div>

        {/* Right: Living organism — larger, more dramatic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Multi-layer organism glow */}
          <div style={{
            position:    "absolute",
            inset:       "-60px",
            background:  "radial-gradient(ellipse at center, color-mix(in srgb, var(--chamber-lab) 18%, transparent) 0%, color-mix(in srgb, var(--r-accent-dim) 35%, transparent) 40%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position:    "absolute",
            inset:       "-30px",
            background:  "radial-gradient(ellipse at 60% 40%, color-mix(in srgb, var(--chamber-creation) 12%, transparent) 0%, transparent 60%)",
            pointerEvents: "none",
          }} />
          <OrganismVisual />
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.8, duration: 1 }}
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

// ─── Section 2: Pain Strip ───────────────────────────────────────────────────

function PainSection() {
  return (
    <RevealSection
      style={{
        padding:    "max(60px, 8vh) max(16px, 4vw)",
        maxWidth:   "1040px",
        margin:     "0 auto",
        position:   "relative",
        zIndex:     10,
        width:      "100%",
      }}
    >
      <p style={{
        fontSize:      "10px",
        fontFamily:    "'JetBrains Mono', monospace",
        color:         "var(--r-dim)",
        letterSpacing: "0.12em",
        textTransform: "uppercase" as const,
        marginBottom:  "14px",
      }}>
        Why this exists
      </p>
      <h2 style={{
        fontSize:      "clamp(20px, 3vw, 30px)",
        fontWeight:    600,
        color:         "var(--r-text)",
        fontFamily:    "'Inter', system-ui, sans-serif",
        letterSpacing: "-0.025em",
        lineHeight:    1.2,
        margin:        "0 0 36px",
        maxWidth:      "560px",
      }}>
        Every AI interface you've used fragments, forgets, and resets.{" "}
        <span style={{ color: "var(--r-subtext)", fontWeight: 400 }}>
          Ruberra is the first that doesn't.
        </span>
      </h2>

      {/* Pain table — flat, precise, scannable */}
      <div style={{
        display:       "flex",
        flexDirection: "column",
        border:        "1px solid var(--r-border-soft)",
        borderRadius:  "2px",
        overflow:      "hidden",
        background:    "var(--r-surface)",
      }}>
        {PAIN_ITEMS.map((item, i) => (
          <RevealSection key={item.keyword} delay={i * 0.06}>
            <div style={{
              display:       "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems:    "center",
              gap:           "clamp(12px, 2vw, 32px)",
              padding:       "16px 24px",
              borderBottom:  i < PAIN_ITEMS.length - 1 ? "1px solid var(--r-border-soft)" : "none",
              transition:    "background 0.1s ease",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--r-elevated)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {/* Pain */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--r-err)", flexShrink: 0, opacity: 0.7 }} />
                <span style={{
                  fontSize:   "12px",
                  color:      "var(--r-text)",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  lineHeight: 1.45,
                }}>
                  {item.pain}
                </span>
              </div>
              {/* Arrow */}
              <span style={{
                fontSize:   "11px",
                color:      "var(--r-dim)",
                fontFamily: "'JetBrains Mono', monospace",
                flexShrink: 0,
                userSelect: "none",
              }}>
                →
              </span>
              {/* Resolution */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--r-ok)", flexShrink: 0, opacity: 0.7 }} />
                <div>
                  <span style={{
                    fontSize:      "9px",
                    fontFamily:    "'JetBrains Mono', monospace",
                    color:         "var(--r-accent-soft)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    display:       "block",
                    marginBottom:  "2px",
                  }}>
                    {item.keyword}
                  </span>
                  <span style={{
                    fontSize:   "12px",
                    color:      "var(--r-subtext)",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    lineHeight: 1.45,
                    display:    "block",
                  }}>
                    {item.resolution}
                  </span>
                </div>
              </div>
            </div>
          </RevealSection>
        ))}
      </div>
    </RevealSection>
  );
}

// ─── Section 3: Trinity Revelation ──────────────────────────────────────────

function ChambersSection({ onEnter }: { onEnter: (chamber?: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <RevealSection
      style={{
        padding:    "max(60px, 8vh) max(16px, 4vw)",
        maxWidth:   "1040px",
        margin:     "0 auto",
        position:   "relative",
        zIndex:     10,
        width:      "100%",
      }}
    >
      <p style={{
        fontSize:      "10px",
        fontFamily:    "'JetBrains Mono', monospace",
        color:         "var(--r-dim)",
        letterSpacing: "0.12em",
        textTransform: "uppercase" as const,
        marginBottom:  "14px",
      }}>
        Operational trinity
      </p>
      <h2 style={{
        fontSize:      "clamp(20px, 3vw, 30px)",
        fontWeight:    600,
        color:         "var(--r-text)",
        fontFamily:    "'Inter', system-ui, sans-serif",
        letterSpacing: "-0.025em",
        lineHeight:    1.2,
        margin:        "0 0 12px",
      }}>
        Not tabs.{" "}
        <span style={{ color: "var(--r-subtext)", fontWeight: 400 }}>
          Specialized operating environments that share memory, context, and consequence.
        </span>
      </h2>
      <p style={{
        fontSize:   "12px",
        color:      "var(--r-dim)",
        fontFamily: "'Inter', system-ui, sans-serif",
        margin:     "0 0 36px",
        lineHeight: 1.55,
      }}>
        Every session in Lab informs Creation. Every mastery in School informs Lab. The trinity compounds — it never resets.
      </p>

      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
        gap:                 "10px",
      }}>
        {CHAMBERS.map((c, i) => (
          <RevealSection key={c.id} delay={i * 0.07}>
            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.15 }}
              onClick={() => onEnter(c.id)}
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width:         "100%",
                padding:       "26px 22px 22px",
                borderRadius:  "2px",
                border:        `1px solid ${hovered === c.id ? c.accent : "var(--r-border-soft)"}`,
                background:    hovered === c.id
                  ? `color-mix(in srgb, ${c.accent} 6%, var(--r-surface))`
                  : "var(--r-surface)",
                textAlign:     "left" as const,
                cursor:        "pointer",
                outline:       "none",
                position:      "relative",
                transition:    "border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease",
                overflow:      "hidden",
                boxShadow:     hovered === c.id
                  ? `0 8px 32px color-mix(in srgb, ${c.accent} 12%, transparent), 0 2px 8px color-mix(in srgb, var(--r-text) 6%, transparent)`
                  : "0 1px 4px color-mix(in srgb, var(--r-text) 4%, transparent)",
              }}
            >
              {/* Strong accent bar at top */}
              <div style={{
                position:     "absolute",
                top:          0, left: 0, right: 0,
                height:       "3px",
                background:   `linear-gradient(90deg, ${c.accent} 0%, color-mix(in srgb, ${c.accent} 40%, transparent) 100%)`,
                opacity:      hovered === c.id ? 1 : 0.5,
                transition:   "opacity 0.18s ease",
              }} />

              {/* Ambient chamber glow */}
              <div style={{
                position:     "absolute",
                top:          0, right: 0,
                width:        "60%",
                height:       "50%",
                background:   `radial-gradient(ellipse at top right, color-mix(in srgb, ${c.accent} 14%, transparent) 0%, transparent 70%)`,
                opacity:      hovered === c.id ? 1 : 0.3,
                transition:   "opacity 0.18s ease",
                pointerEvents:"none",
              }} />

              {/* Label row */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", position: "relative" }}>
                <div style={{
                  width:        "8px",
                  height:       "8px",
                  borderRadius: "50%",
                  background:   c.accent,
                  opacity:      0.9,
                  flexShrink:   0,
                  boxShadow: "none",
                }} />
                <span style={{
                  fontSize:      "13px",
                  fontWeight:    700,
                  color:         "var(--r-text)",
                  fontFamily:    "'Inter', system-ui, sans-serif",
                  letterSpacing: "-0.02em",
                }}>
                  {c.label}
                </span>
                <span style={{
                  fontSize:      "9px",
                  fontFamily:    "'JetBrains Mono', monospace",
                  color:         c.accent,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  opacity:       0.85,
                }}>
                  {c.verb}
                </span>
              </div>

              {/* Description */}
              <p style={{
                fontSize:   "12.5px",
                color:      "var(--r-subtext)",
                fontFamily: "'Inter', system-ui, sans-serif",
                lineHeight: 1.55,
                margin:     0,
                position:   "relative",
              }}>
                {c.desc}
              </p>

              {/* Enter arrow */}
              <div style={{
                display:    "flex",
                alignItems: "center",
                gap:        "4px",
                marginTop:  "18px",
                position:   "relative",
              }}>
                <span style={{
                  fontSize:      "8px",
                  fontFamily:    "'JetBrains Mono', monospace",
                  color:         hovered === c.id ? c.accent : "var(--r-dim)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  transition:    "color 0.15s ease",
                  fontWeight:    hovered === c.id ? 600 : 400,
                }}>
                  Enter {c.label} →
                </span>
              </div>
            </motion.button>
          </RevealSection>
        ))}
      </div>
    </RevealSection>
  );
}

// ─── Section 4: Conviction + Memory ─────────────────────────────────────────

function ConvictionSection({ onEnter }: { onEnter: (chamber?: string) => void }) {
  return (
    <RevealSection
      style={{
        padding:       "max(80px, 10vh) max(16px, 4vw)",
        maxWidth:      "1040px",
        margin:        "0 auto",
        position:      "relative",
        zIndex:        10,
        width:         "100%",
      }}
    >
      {/* Two-column: conviction left, memory proof right */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "1fr 1fr",
        gap:                 "clamp(32px, 5vw, 80px)",
        alignItems:          "start",
      }}>
        {/* Left: Identity statement */}
        <div>
          <p style={{
            fontSize:      "10px",
            fontFamily:    "'JetBrains Mono', monospace",
            color:         "var(--r-dim)",
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            marginBottom:  "14px",
          }}>
            Not a wrapper
          </p>
          <h2 style={{
            fontSize:      "clamp(24px, 3.5vw, 36px)",
            fontWeight:    600,
            color:         "var(--r-text)",
            fontFamily:    "'Inter', system-ui, sans-serif",
            letterSpacing: "-0.03em",
            lineHeight:    1.15,
            margin:        "0 0 20px",
          }}>
            A new mode of work.
          </h2>
          <p style={{
            fontSize:      "clamp(14px, 1.5vw, 16px)",
            color:         "var(--r-subtext)",
            fontFamily:    "'Inter', system-ui, sans-serif",
            lineHeight:    1.65,
            letterSpacing: "-0.01em",
            margin:        "0 0 32px",
          }}>
            Not a wrapper around GPT. Not another IDE chat panel. A sovereign workstation where your AI remembers, your work compounds, and your sessions never die.
          </p>
          <motion.button
            whileHover={{ y: -1, boxShadow: "none" }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onEnter()}
            style={{
              padding:        "14px 36px",
              borderRadius:   "2px",
              border:         "1px solid color-mix(in srgb, var(--r-text) 18%, transparent)",
              background:     "var(--r-text)",
              color:          "var(--r-bg)",
              fontSize:       "13px",
              fontWeight:     600,
              fontFamily:     "'Inter', system-ui, sans-serif",
              letterSpacing:  "0.01em",
              cursor:         "pointer",
              outline:        "none",
              display:        "inline-flex",
              alignItems:     "center",
              gap:            "8px",
              boxShadow: "none",
              transition:     "box-shadow 0.15s ease",
            }}
          >
            Enter Ruberra
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </div>

        {/* Right: Continuity / memory proof */}
        <div style={{
          border:       "1px solid var(--r-border-soft)",
          borderRadius: "2px",
          background:   "var(--r-surface)",
          overflow:     "hidden",
        }}>
          <div style={{
            padding:      "12px 18px",
            borderBottom: "1px solid var(--r-border-soft)",
            background:   "var(--r-elevated)",
            display:      "flex",
            alignItems:   "center",
            gap:          "8px",
          }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--r-ok)", opacity: 0.8 }} />
            <span style={{
              fontFamily:    "'JetBrains Mono', monospace",
              fontSize:      "9px",
              letterSpacing: "0.1em",
              color:         "var(--r-dim)",
              textTransform: "uppercase" as const,
            }}>
              Continuity fabric · live
            </span>
          </div>
          {[
            { label: "Mission context", value: "Architecture research mission · active", color: "var(--chamber-lab)" },
            { label: "Last run", value: "Lab · evidence synthesis · 47 exchanges", color: "var(--r-ok)" },
            { label: "Memory objects", value: "12 investigations · 8 lessons · 3 artifacts", color: "var(--chamber-school)" },
            { label: "Continuity state", value: "Persistent across sessions · not reset", color: "var(--r-accent-soft)" },
            { label: "Pioneer stack", value: "Lab sovereignty · School mastery · Creation forge", color: "var(--chamber-creation)" },
          ].map((row, i) => (
            <div key={i} style={{
              display:      "flex",
              alignItems:   "center",
              gap:          "12px",
              padding:      "11px 18px",
              borderBottom: i < 4 ? "1px solid var(--r-border-soft)" : "none",
            }}>
              <span style={{
                fontFamily:    "'JetBrains Mono', monospace",
                fontSize:      "9px",
                color:         "var(--r-dim)",
                letterSpacing: "0.05em",
                minWidth:      "100px",
                flexShrink:    0,
              }}>
                {row.label}
              </span>
              <span style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize:   "11px",
                color:      "var(--r-subtext)",
                lineHeight: 1.4,
              }}>
                <span style={{ color: row.color, marginRight: "6px" }}>·</span>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}

// ─── Section 5: Footer ───────────────────────────────────────────────────────

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

// ─── Main ────────────────────────────────────────────────────────────────────

export function HeroLanding({ onEnter, theme }: { onEnter: (chamber?: string) => void; theme: Theme }) {
  const [isNarrow, setIsNarrow] = useState(() => typeof window !== "undefined" ? window.innerWidth < 640 : false);

  useEffect(() => {
    if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
  }, [theme]);

  useEffect(() => {
    const handler = () => setIsNarrow(window.innerWidth < 640);
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

        {/* S2: Pain table */}
        <PainSection />

        {/* S3: Trinity */}
        <ChambersSection onEnter={onEnter} />

        {/* S4: Conviction + Memory */}
        <ConvictionSection onEnter={onEnter} />

        {/* S5: Footer */}
        <LandingFooter onEnter={onEnter} isNarrow={isNarrow} />
      </div>
    </div>
  );
}
