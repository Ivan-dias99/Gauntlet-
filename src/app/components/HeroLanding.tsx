/**
 * RUBERRA — Sovereign Entry Surface
 * The mother gateway. Not a landing page. Not a marketing banner.
 * The inevitable entrance into the Ruberra intelligence organism.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const CHAMBERS = [
  { id: "lab",      label: "Lab",      accent: "#52796A", desc: "Investigate" },
  { id: "school",   label: "School",   accent: "#4A6B84", desc: "Master"      },
  { id: "creation", label: "Creation", accent: "#8A6238", desc: "Build"        },
  { id: "profile",  label: "Profile",  accent: "#7A756D", desc: "Orchestrate" },
] as const;

// ─── R mark (same geometry as SovereignBar) ────────────────────────────────

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
      {/* R vertical stroke */}
      <div style={{ position: "absolute", width: "1.5px", height: `${size * 0.46}px`, background: "rgba(255,255,255,0.92)", top: `${size * 0.24}px`, left: `${size * 0.34}px`, borderRadius: "1px" }} />
      {/* R bowl */}
      <div style={{ position: "absolute", width: `${size * 0.24}px`, height: `${size * 0.24}px`, border: "1.5px solid rgba(255,255,255,0.92)", borderRadius: `${size * 0.1}px ${size * 0.1}px 0 0`, borderBottom: "none", top: `${size * 0.24}px`, left: `${size * 0.34}px` }} />
      {/* R leg */}
      <div style={{ position: "absolute", width: `${size * 0.22}px`, height: "1.5px", background: "rgba(255,255,255,0.92)", top: `${size * 0.57}px`, left: `${size * 0.44}px`, borderRadius: "1px", transform: "rotate(38deg)", transformOrigin: "0 50%" }} />
    </div>
  );
}

// ─── Background: structural grid ───────────────────────────────────────────

function StructuralGrid() {
  return (
    <div
      style={{
        position:     "absolute",
        inset:        0,
        backgroundImage: `
          linear-gradient(var(--r-border-soft) 1px, transparent 1px),
          linear-gradient(90deg, var(--r-border-soft) 1px, transparent 1px)
        `,
        backgroundSize: "52px 52px",
        opacity:      0.45,
        pointerEvents:"none",
      }}
    />
  );
}

// ─── Background: ghosted RUBERRA wordmark ──────────────────────────────────

function GhostedWordmark() {
  return (
    <div
      style={{
        position:     "absolute",
        bottom:       "-3vw",
        left:         "50%",
        transform:    "translateX(-50%)",
        fontSize:     "clamp(80px, 19vw, 320px)",
        fontWeight:   700,
        letterSpacing:"-0.055em",
        color:        "var(--r-text)",
        opacity:      0.038,
        userSelect:   "none",
        pointerEvents:"none",
        lineHeight:   1,
        whiteSpace:   "nowrap",
        fontFamily:   "'Inter', system-ui, sans-serif",
        zIndex:       1,
      }}
    >
      RUBERRA
    </div>
  );
}

// ─── Background: ghosted R mark geometry (large) ──────────────────────────

function GhostedGeometry() {
  return (
    <div
      style={{
        position:     "absolute",
        right:        "6vw",
        bottom:       "5vw",
        width:        "22vw",
        height:       "22vw",
        maxWidth:     "320px",
        maxHeight:    "320px",
        border:       "2px solid var(--r-text)",
        borderRadius: "18%",
        opacity:      0.028,
        pointerEvents:"none",
        zIndex:       1,
        transform:    "rotate(8deg)",
      }}
    />
  );
}

// ─── Atmospheric glow ──────────────────────────────────────────────────────

function AtmosphericGlow() {
  return (
    <>
      {/* Central warm presence */}
      <motion.div
        animate={{ opacity: [0.08, 0.13, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position:     "absolute",
          top:          "10%",
          left:         "50%",
          transform:    "translateX(-50%)",
          width:        "70vw",
          height:       "60vh",
          background:   "radial-gradient(ellipse at center, var(--r-accent-dim) 0%, transparent 70%)",
          pointerEvents:"none",
          zIndex:       2,
        }}
      />
      {/* Corner ambient — lab sage */}
      <div style={{ position: "absolute", top: 0, right: 0, width: "30vw", height: "30vh", background: "radial-gradient(ellipse at top right, #52796A18 0%, transparent 70%)", pointerEvents: "none", zIndex: 2 }} />
      {/* Corner ambient — creation amber */}
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "25vw", height: "25vh", background: "radial-gradient(ellipse at bottom left, #8A623810 0%, transparent 70%)", pointerEvents: "none", zIndex: 2 }} />
    </>
  );
}

// ─── Top nav ───────────────────────────────────────────────────────────────

function TopNav({ onEnter, isNarrow }: { onEnter: (chamber?: string) => void; isNarrow: boolean }) {
  return (
    <div
      style={{
        position:     "absolute",
        top: 0, left: 0, right: 0,
        height:       "52px",
        display:      "flex",
        alignItems:   "center",
        justifyContent:"space-between",
        padding:      "0 28px",
        zIndex:       20,
        borderBottom: "1px solid var(--r-border-soft)",
        background:   "transparent",
      }}
    >
      {/* Brand */}
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

      {/* Chamber links — hidden on narrow viewports */}
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

      {/* Enter CTA */}
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

// ─── Chamber chip ─────────────────────────────────────────────────────────

function ChamberChip({
  chamber, selected, onSelect, index,
}: {
  chamber: typeof CHAMBERS[number];
  selected: boolean;
  onSelect: () => void;
  index: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.38 + index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={onSelect}
      style={{
        padding:      "10px 8px",
        borderRadius: "8px",
        border:       `1px solid ${selected ? chamber.accent + "50" : "var(--r-border)"}`,
        background:   selected ? `${chamber.accent}0e` : "transparent",
        cursor:       "pointer",
        outline:      "none",
        textAlign:    "center" as const,
        transition:   "all 0.14s ease",
        position:     "relative",
      }}
      onMouseEnter={e => {
        if (!selected) (e.currentTarget as HTMLElement).style.background = "var(--r-elevated)";
      }}
      onMouseLeave={e => {
        if (!selected) (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      <motion.div
        animate={{ opacity: selected ? 1 : 0.4, scale: selected ? 1.15 : 1 }}
        transition={{ duration: 0.16 }}
        style={{
          width:        "5px",
          height:       "5px",
          borderRadius: "50%",
          background:   chamber.accent,
          margin:       "0 auto 7px",
        }}
      />
      <p style={{
        fontSize:     "11px",
        fontWeight:   500,
        color:        selected ? "var(--r-text)" : "var(--r-subtext)",
        fontFamily:   "'Inter', system-ui, sans-serif",
        margin:       0,
        letterSpacing:"-0.005em",
        lineHeight:   1,
        transition:   "color 0.14s ease",
      }}>
        {chamber.label}
      </p>
      <p style={{
        fontSize:     "9px",
        color:        selected ? chamber.accent : "var(--r-dim)",
        fontFamily:   "'JetBrains Mono', monospace",
        margin:       "4px 0 0",
        letterSpacing:"0.04em",
        lineHeight:   1,
        textTransform:"lowercase" as const,
        transition:   "color 0.14s ease",
      }}>
        {chamber.desc}
      </p>
    </motion.button>
  );
}

// ─── Command portal ───────────────────────────────────────────────────────

function CommandPortal({
  onEnter, selected, onSelect,
}: {
  onEnter: (chamber?: string) => void;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      style={{
        width:        "100%",
        maxWidth:     "480px",
        border:       "1px solid var(--r-border)",
        borderRadius: "14px",
        background:   "var(--r-surface)",
        padding:      "22px 22px 20px",
        boxShadow:    "0 4px 28px rgba(0,0,0,0.06), 0 1px 6px rgba(0,0,0,0.04)",
        position:     "relative",
        overflow:     "hidden",
        marginBottom: "18px",
      }}
    >
      {/* Inner top glow */}
      <div style={{
        position:     "absolute",
        top: 0, left: 0, right: 0,
        height:       "60px",
        background:   "linear-gradient(to bottom, var(--r-accent-dim) 0%, transparent 100%)",
        opacity:      0.12,
        pointerEvents:"none",
        borderRadius: "14px 14px 0 0",
      }} />

      {/* Portal label */}
      <p style={{
        fontSize:     "9px",
        fontFamily:   "'JetBrains Mono', monospace",
        color:        "var(--r-dim)",
        letterSpacing:"0.12em",
        textTransform:"uppercase" as const,
        margin:       "0 0 14px",
        position:     "relative",
        zIndex:       1,
      }}>
        Select entry chamber — or enter directly
      </p>

      {/* Chamber chips */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap:                 "7px",
        marginBottom:        "16px",
        position:            "relative",
        zIndex:              1,
      }}>
        {CHAMBERS.map((c, i) => (
          <ChamberChip
            key={c.id}
            chamber={c}
            selected={selected === c.id}
            onSelect={() => onSelect(c.id)}
            index={i}
          />
        ))}
      </div>

      {/* Enter button */}
      <motion.button
        whileHover={{ y: -1, boxShadow: "0 6px 20px rgba(0,0,0,0.14)" }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onEnter(selected ?? undefined)}
        style={{
          width:          "100%",
          padding:        "13px 20px",
          borderRadius:   "9px",
          border:         "none",
          background:     "var(--r-text)",
          color:          "var(--r-bg)",
          fontSize:       "13px",
          fontWeight:     500,
          fontFamily:     "'Inter', system-ui, sans-serif",
          letterSpacing:  "-0.005em",
          cursor:         "pointer",
          outline:        "none",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          gap:            "8px",
          boxShadow:      "0 2px 8px rgba(0,0,0,0.10)",
          transition:     "box-shadow 0.15s ease",
          position:       "relative",
          zIndex:         1,
        }}
      >
        {selected
          ? `Enter ${CHAMBERS.find(c => c.id === selected)?.label ?? "Ruberra"}`
          : "Enter Ruberra"
        }
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────

export function HeroLanding({ onEnter }: { onEnter: (chamber?: string) => void }) {
  const [mounted, setMounted]   = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [isNarrow, setIsNarrow] = useState(() => typeof window !== "undefined" ? window.innerWidth < 520 : false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = () => setIsNarrow(window.innerWidth < 520);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Keyboard: Enter → proceed (only when no input is focused)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "Enter" && tag !== "INPUT" && tag !== "TEXTAREA") {
        onEnter(selected ?? undefined);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onEnter, selected]);

  const toggleChamber = (id: string) => {
    setSelected((prev) => (prev === id ? null : id));
  };

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
      {/* ── Background layers ── */}
      <StructuralGrid />
      <AtmosphericGlow />
      <GhostedWordmark />
      <GhostedGeometry />

      {/* ── Top nav ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -10 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <TopNav onEnter={onEnter} isNarrow={isNarrow} />
      </motion.div>

      {/* ── Center content ── */}
      <div
        style={{
          flex:            1,
          display:         "flex",
          flexDirection:   "column",
          alignItems:      "center",
          justifyContent:  "center",
          position:        "relative",
          zIndex:          10,
          padding:         "52px 24px 0",
        }}
      >
        <AnimatePresence>
          {mounted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              style={{
                width:     "100%",
                maxWidth:  "480px",
                display:   "flex",
                flexDirection:"column",
                alignItems:"center",
                textAlign: "center",
              }}
            >
              {/* Status pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display:       "inline-flex",
                  alignItems:    "center",
                  gap:           "6px",
                  marginBottom:  "28px",
                  padding:       "4px 13px",
                  borderRadius:  "999px",
                  border:        "1px solid var(--r-border)",
                  background:    "var(--r-surface)",
                  fontSize:      "9px",
                  fontFamily:    "'JetBrains Mono', monospace",
                  color:         "var(--r-dim)",
                  letterSpacing: "0.10em",
                  textTransform: "uppercase" as const,
                  boxShadow:     "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <motion.span
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    width:        "4px",
                    height:       "4px",
                    borderRadius: "50%",
                    background:   "#52796A",
                    display:      "inline-block",
                    flexShrink:   0,
                  }}
                />
                Sovereign System · Online
              </motion.div>

              {/* Command portal */}
              <CommandPortal
                onEnter={onEnter}
                selected={selected}
                onSelect={toggleChamber}
              />

              {/* Descriptor */}
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontSize:     "13px",
                  color:        "var(--r-subtext)",
                  fontFamily:   "'Inter', system-ui, sans-serif",
                  lineHeight:   1.65,
                  letterSpacing:"-0.005em",
                  margin:       0,
                  maxWidth:     "360px",
                }}
              >
                Not a tool. Not a workspace.<br />
                <span style={{ color: "var(--r-dim)" }}>The sovereign AI organism.</span>
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom meta bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ delay: 1.1, duration: 1 }}
        style={{
          position:      "absolute",
          bottom:        0,
          left:          0,
          right:         0,
          height:        "44px",
          display:       "flex",
          alignItems:    "center",
          justifyContent:"space-between",
          padding:       "0 28px",
          borderTop:     "1px solid var(--r-border-soft)",
          zIndex:        20,
        }}
      >
        {/* Left: chamber dots — hidden on narrow */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {!isNarrow && CHAMBERS.map((c) => (
            <span
              key={c.id}
              style={{
                fontSize:     "9px",
                fontFamily:   "'JetBrains Mono', monospace",
                color:        "var(--r-dim)",
                letterSpacing:"0.10em",
                textTransform:"uppercase" as const,
                display:      "flex",
                alignItems:   "center",
                gap:          "5px",
                cursor:       "pointer",
                transition:   "color 0.12s ease",
              }}
              onClick={() => onEnter(c.id)}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = c.accent; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--r-dim)"; }}
            >
              <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: c.accent, display: "inline-block", opacity: 0.6 }} />
              {c.label}
            </span>
          ))}
          {isNarrow && (
            <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.08em" }}>
              sovereign system · v10
            </span>
          )}
        </div>

        {/* Right: version + key hint — hidden on narrow */}
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
      </motion.div>
    </div>
  );
}
