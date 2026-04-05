/**
 * RUBERRA — Sovereign Entry Surface
 * Transfigured: Flagship identity, Memory-bearing, Consequence-driven.
 * White Premium + Dark Premium parity. Apple-grade compression.
 */

import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { type Theme } from "./shell-types";

// ─── Shared ──────────────────────────────────────────────────────────────────

function RMark({ size = 22 }: { size?: number }) {
  return (
    <div
      style={{
        width: `${size}px`, height: `${size}px`,
        background: "var(--r-text)",
        borderRadius: `${Math.round(size * 0.24)}px`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", width: "1.5px", height: `${size * 0.46}px`, background: "var(--r-bg)", top: `${size * 0.24}px`, left: `${size * 0.34}px`, borderRadius: "1px" }} />
      <div style={{ position: "absolute", width: `${size * 0.24}px`, height: `${size * 0.24}px`, border: "1.5px solid var(--r-bg)", borderRadius: `${size * 0.1}px ${size * 0.1}px 0 0`, borderBottom: "none", top: `${size * 0.24}px`, left: `${size * 0.34}px` }} />
      <div style={{ position: "absolute", width: `${size * 0.22}px`, height: "1.5px", background: "var(--r-bg)", top: `${size * 0.57}px`, left: `${size * 0.44}px`, borderRadius: "1px", transform: "rotate(38deg)", transformOrigin: "0 50%" }} />
    </div>
  );
}

function RevealSection({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      style={style}
    >
      {children}
    </motion.section>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

function TopNav({ onEnter }: { onEnter: (chamber?: string) => void }) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px max(24px, 4vw)",
      background: "color-mix(in srgb, var(--r-bg) 85%, transparent)",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--r-border-soft)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <RMark size={20} />
        <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif" }}>
          RUBERRA
        </span>
      </div>

      <div style={{ display: "none", gap: "28px", '@media (min-width: 800px)': { display: "flex" } } as any}>
        {["Product", "Why Ruberra", "Sovereign AI", "Connectors", "Architecture"].map((item) => (
          <span key={item} style={{
            fontSize: "12px", color: "var(--r-subtext)", cursor: "pointer", fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "-0.01em",
            transition: "color 0.15s ease"
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--r-text)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--r-subtext)")}
          >{item}</span>
        ))}
      </div>

      <button onClick={() => onEnter()} style={{
        padding: "8px 20px", borderRadius: "2px", background: "var(--r-text)", color: "var(--r-bg)",
        border: "1px solid var(--r-text)", fontSize: "11px", fontWeight: 600, cursor: "pointer",
        fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "0.02em"
      }}>
        Enter Ruberra
      </button>
    </div>
  );
}

// ─── Layout Structure ─────────────────────────────────────────────────────────

export function HeroLanding({ onEnter }: { onEnter: (chamber?: string) => void }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--r-bg)", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", overflowX: "hidden" }}>
      <TopNav onEnter={onEnter} />
      
      {/* Structural Grid Background */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(var(--r-border-soft) 1px, transparent 1px), linear-gradient(90deg, var(--r-border-soft) 1px, transparent 1px)", backgroundSize: "48px 48px", opacity: 0.4, pointerEvents: "none", zIndex: 0 }} />

      {/* Hero Section */}
      <section style={{ padding: "max(120px, 15vh) max(24px, 4vw) max(80px, 10vh)", position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <span style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "24px", display: "inline-block" }}>
            The Sovereign Operational Organism
          </span>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.05, margin: "0 auto 32px", maxWidth: "900px" }}>
            Your AI doesn't remember, <br/> doesn't compound, doesn't work with you.
          </h1>
          <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "var(--r-subtext)", lineHeight: 1.6, margin: "0 auto 48px", maxWidth: "640px", letterSpacing: "-0.01em" }}>
            Ruberra is a sovereign workstation — one shell, continuous memory, consequence-bearing execution. Every session compounds. Nothing resets. Nothing fragments.
          </p>
          <button onClick={() => onEnter()} style={{
            padding: "16px 36px", background: "var(--r-text)", color: "var(--r-bg)", border: "none", borderRadius: "2px",
            fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px", letterSpacing: "0.01em"
          }}>
            Enter the Organism
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </motion.div>
      </section>

      {/* Pain Section */}
      <RevealSection style={{ padding: "100px max(24px, 4vw)", background: "var(--r-surface)", borderTop: "1px solid var(--r-border-soft)", borderBottom: "1px solid var(--r-border-soft)", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 600, letterSpacing: "-0.03em", margin: "0 0 48px" }}>
            Every AI interface you've used<br/>
            <span style={{ color: "var(--r-dim)" }}>fragments, forgets, and resets.</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", borderTop: "1px solid var(--r-border-soft)", paddingTop: "40px" }}>
            {[
              { pain: "Amnesia", desc: "Chat interfaces reset your context every session. You rebuild truth from scratch every time you sit down to work." },
              { pain: "Fragmentation", desc: "Your intelligence lives in a chat box. Your execution lives in an IDE. Your knowledge lives in a dead doc. Nothing coheres." },
              { pain: "Lack of Lineage", desc: "AI wrappers generate disposable output. There is no consequence, no structural trace of why a decision was made." }
            ].map(p => (
              <div key={p.pain}>
                <span style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-err)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{p.pain}</span>
                <p style={{ fontSize: "14px", color: "var(--r-subtext)", lineHeight: 1.6, marginTop: "12px" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Feature Entry Surface */}
      <RevealSection style={{ padding: "140px max(24px, 4vw)", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <span style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px", display: "block" }}>
            The Architecture of Truth
          </span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, letterSpacing: "-0.03em", margin: "0 0 64px", maxWidth: "600px", lineHeight: 1.1 }}>
            One single organism for memory, intelligence, and command.
          </h2>
          
          {/* Chambers */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "100px" }}>
            {[
              { id: "lab", label: "Lab", desc: "Operational research without guardrails. Every query becomes a structured object in the neural mesh. Investigation with consequence.", accent: "var(--chamber-lab)" },
              { id: "school", label: "School", desc: "Guided mastery tracks. The organism structures curriculum, monitors progress, and accumulates capability state.", accent: "var(--chamber-school)" },
              { id: "creation", label: "Creation", desc: "Direct command surface. Compile blueprints, orchestrate agents, and execute sovereign pipelines directly from the prompt.", accent: "var(--chamber-creation)" }
            ].map(c => (
              <div key={c.id} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", alignItems: "flex-start" }}>
                <div>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: c.accent, marginBottom: "16px" }} />
                  <h3 style={{ fontSize: "20px", fontWeight: 600, color: "var(--r-text)", margin: "0 0 8px" }}>Chamber: {c.label}</h3>
                  <p style={{ fontSize: "14px", color: "var(--r-subtext)", lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
                </div>
                {/* Structural mock graphic */}
                <div style={{ padding: "24px", background: "var(--r-surface)", border: "1px solid var(--r-border)", borderRadius: "2px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ width: "40%", height: "4px", background: "var(--r-border)", borderRadius: "2px" }} />
                  <div style={{ width: "80%", height: "4px", background: "var(--r-border-soft)", borderRadius: "2px" }} />
                  <div style={{ width: "60%", height: "4px", background: "var(--r-border-soft)", borderRadius: "2px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Sovereign AI & Ruberra Difference */}
      <RevealSection style={{ padding: "100px max(24px, 4vw)", background: "var(--r-surface)", borderTop: "1px solid var(--r-border-soft)", borderBottom: "1px solid var(--r-border-soft)", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 600, letterSpacing: "-0.03em", margin: "0 auto 24px", maxWidth: "600px" }}>
            Sovereign capability. Complete internalization.
          </h2>
          <p style={{ fontSize: "16px", color: "var(--r-subtext)", lineHeight: 1.6, margin: "0 auto 60px", maxWidth: "600px" }}>
            Connect open-source models, hook your Git repository, and deploy without leaving the shell. Ruberra is built to host your tools, not sit passively beside them.
          </p>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap", borderTop: "1px solid var(--r-border-soft)", paddingTop: "60px" }}>
            {[
              "Terminal Grade Seriousness", "Memory-Bearing Design", "Consequence-Driven Execution", "Canon Preserving"
            ].map(diff => (
              <div key={diff} style={{ fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-text)", textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 16px", border: "1px solid var(--r-border-soft)", background: "var(--r-bg)", borderRadius: "2px" }}>
                {diff}
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Conversion / Entrance */}
      <RevealSection style={{ padding: "140px max(24px, 4vw)", textAlign: "center", position: "relative", zIndex: 1 }}>
        <RMark size={40} />
        <h2 style={{ fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 600, letterSpacing: "-0.04em", margin: "40px 0 32px" }}>
          The shell is waiting.
        </h2>
        <button onClick={() => onEnter()} style={{
          padding: "16px 40px", background: "var(--r-text)", color: "var(--r-bg)", border: "none", borderRadius: "2px",
          fontSize: "15px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.01em"
        }}>
          Enter Ruberra
        </button>
      </RevealSection>
    </div>
  );
}
