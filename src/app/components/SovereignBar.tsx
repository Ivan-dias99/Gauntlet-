/**
 * RUBERRA Sovereign Bar — polished topbar
 * Precision header. Chamber-authentic colors. Quiet authority.
 */

import { motion } from "motion/react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { type Tab, type Theme } from "./shell-types";
import { ProfileLedger } from "./ProfileLedger";
import { CONSTITUTIONAL_TRUTH } from "../dna/canon-sovereignty";
import { SecurityTrustSignal } from "./SecurityTrustSignal";
import { type TrustSignal } from "../dna/sovereign-security";
import { useState } from "react";

// Chamber dot colors — authentic per-chamber tokens
const CHAMBER_DOTS: Record<Tab, string> = {
  lab:      "var(--chamber-lab)",
  school:   "var(--chamber-school)",
  creation: "var(--chamber-creation)",
  profile:  "var(--r-subtext)",
};

interface SovereignBarProps {
  activeTab:      Tab;
  onTabChange:    (tab: Tab) => void;
  onHomeClick?:   () => void;
  isLive?:        boolean;
  theme?:         Theme;
  onThemeToggle?: () => void;
  onSearchToggle?: () => void;
  onSignalsToggle?: () => void;
  hasSignals?:    boolean;
  onManageMatrix?: () => void;
  trustSignal?:   TrustSignal;
  onSecurityAcknowledge?: () => void;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "lab",      label: "Lab"      },
  { id: "school",   label: "School"   },
  { id: "creation", label: "Creation" },
  { id: "profile",  label: "Profile"  },
];

function RubMark() {
  return (
    <div
      style={{
        width: "20px",
        height: "20px",
        background: "var(--r-text)",
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.14)",
      }}
    >
      {/* R letterform — vertical stroke */}
      <div style={{ position: "absolute", width: "1.5px", height: "10px", background: "rgba(255,255,255,0.90)", top: "5px", left: "7px", borderRadius: "1px" }} />
      {/* R letterform — upper bowl */}
      <div style={{ position: "absolute", width: "5px", height: "5px", border: "1.5px solid rgba(255,255,255,0.90)", borderRadius: "2px 2px 0 0", borderBottom: "none", top: "5px", left: "7px" }} />
      {/* R letterform — leg */}
      <div style={{ position: "absolute", width: "4px", height: "1.5px", background: "rgba(255,255,255,0.90)", top: "12px", left: "9px", borderRadius: "1px", transform: "rotate(38deg)", transformOrigin: "0 50%" }} />
    </div>
  );
}

function IconBtn({
  children, title, onClick,
}: {
  children: React.ReactNode;
  title?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: "28px",
        height: "28px",
        borderRadius: "5px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        outline: "none",
        color: "var(--r-subtext)",
        transition: "background 0.12s ease, color 0.12s ease",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--r-rail)";
        (e.currentTarget as HTMLElement).style.color = "var(--r-text)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
        (e.currentTarget as HTMLElement).style.color = "var(--r-subtext)";
      }}
    >
      {children}
    </button>
  );
}

export function SovereignBar({
  activeTab, onTabChange, onHomeClick, isLive, theme, onThemeToggle, onSearchToggle, onSignalsToggle, hasSignals, onManageMatrix, trustSignal = "healthy", onSecurityAcknowledge,
}: SovereignBarProps) {
  const [isLedgerOpen, setLedgerOpen] = useState(false);

  return (
    <header
      style={{
        height: "44px",
        borderBottom: "1px solid var(--r-border)",
        background: "rgba(var(--r-surface-rgb), 0.82)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        paddingLeft: "18px",
        paddingRight: "16px",
        transition: "background 0.25s ease, border-color 0.25s ease",
      }}
    >

      {/* ── Left: Brand ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "9px", minWidth: "160px" }}>
        <button
          onClick={onHomeClick ?? (() => onTabChange(activeTab))}
          title="Home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            outline: "none",
            padding: "2px",
            borderRadius: "5px",
            transition: "opacity 0.12s ease",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.75"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        >
          <RubMark />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.13em",
              color: "var(--r-text)",
              userSelect: "none",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            RUBERRA
          </span>
        </button>

        {/* Status separator + live indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginLeft: "4px",
            borderLeft: "1px solid var(--r-border)",
            paddingLeft: "10px",
          }}
        >
          <motion.div
            animate={{ opacity: isLive ? [0.4, 1, 0.4] : [0.3, 0.7, 0.3] }}
            transition={{ duration: isLive ? 0.85 : 3.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: isLive ? "var(--r-accent)" : "var(--r-pulse)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "0.10em",
              color: "var(--r-dim)",
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: "uppercase",
              userSelect: "none",
            }}
          >
            {isLive ? "Live" : "Connected"}
          </span>
        </div>
      </div>

      {/* ── Center: Chamber switcher (flagship restraint) ── */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          background: "color-mix(in srgb, var(--r-rail) 92%, var(--r-surface))",
          borderRadius: "10px",
          padding: "4px",
          display: "flex",
          gap: "2px",
          border: "1px solid var(--r-border-soft)",
          boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--r-text) 4%, transparent)",
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const dot = CHAMBER_DOTS[tab.id];
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                position: "relative",
                padding: "5px 15px",
                borderRadius: "7px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontWeight: isActive ? 600 : 450,
                color: isActive ? "var(--r-text)" : "var(--r-dim)",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "11.5px",
                letterSpacing: "-0.01em",
                transition: "color 0.18s ease",
                outline: "none",
                display: "flex",
                alignItems: "center",
                gap: "7px",
                userSelect: "none",
                whiteSpace: "nowrap",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="sovereign-tab"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "var(--r-surface)",
                    borderRadius: "7px",
                    boxShadow: "0 1px 3px color-mix(in srgb, var(--r-text) 6%, transparent), 0 0 0 1px color-mix(in srgb, var(--r-text) 5%, var(--r-border-soft))",
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 38, mass: 0.85 }}
                />
              )}
              <span
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: dot,
                  flexShrink: 0,
                  display: "inline-block",
                  opacity: isActive ? 1 : 0.4,
                  transition: "opacity 0.18s ease",
                }}
              />
              <span style={{ position: "relative", zIndex: 1, opacity: isActive ? 1 : 0.82 }}>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Right: Controls ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2px",
          minWidth: "160px",
          justifyContent: "flex-end",
        }}
      >
        {/* Theme toggle */}
        {onThemeToggle && (
          <IconBtn title={theme === "dark" ? "Light mode" : "Dark mode"} onClick={onThemeToggle}>
            {theme === "dark" ? (
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.25" />
                <path d="M7 1.5v1.25M7 11.25V12.5M1.5 7h1.25M11.25 7H12.5M3.05 3.05l.88.88M10.07 10.07l.88.88M10.07 3.93l-.88.88M3.93 10.07l-.88.88" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M11.5 8A5 5 0 016 2.5 5 5 0 1011.5 8z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
              </svg>
            )}
          </IconBtn>
        )}

        {/* Security trust signal — silent when healthy */}
        <SecurityTrustSignal signal={trustSignal} onAcknowledge={onSecurityAcknowledge} />

        {/* Divider */}
        <div style={{ width: "1px", height: "14px", background: "var(--r-border)", margin: "0 5px" }} />

        {/* Search */}
        <IconBtn title="Search" onClick={onSearchToggle}>
          <Search size={12} strokeWidth={1.6} />
        </IconBtn>

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <IconBtn title="Notifications" onClick={onSignalsToggle}>
            <Bell size={12} strokeWidth={1.6} />
          </IconBtn>
          {hasSignals && (
            <span
              style={{
                position: "absolute",
                top: "8px",
                right: "7px",
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background: "var(--r-pulse)",
                pointerEvents: "none",
              }}
            />
          )}
        </div>

        {/* Avatar Area with Ledger */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setLedgerOpen(!isLedgerOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "3px 5px 3px 3px",
              borderRadius: "6px",
              border: "none",
              background: isLedgerOpen ? "var(--r-rail)" : "transparent",
              cursor: "pointer",
              outline: "none",
              marginLeft: "2px",
              transition: "background 0.12s ease",
            }}
            onMouseEnter={(e) => { if (!isLedgerOpen) (e.currentTarget as HTMLElement).style.background = "var(--r-rail)"; }}
            onMouseLeave={(e) => { if (!isLedgerOpen) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <div
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "5px",
                background: "linear-gradient(145deg, var(--r-border) 0%, var(--r-muted) 100%)",
                flexShrink: 0,
                border: "1px solid color-mix(in srgb, var(--r-text) 8%, transparent)",
              }}
            />
            <motion.div animate={{ rotate: isLedgerOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={10} color="var(--r-dim)" strokeWidth={1.8} />
            </motion.div>
          </button>
          
          <ProfileLedger isOpen={isLedgerOpen} onClose={() => setLedgerOpen(false)} onManageMatrix={onManageMatrix} />
        </div>
      </div>

      {/* Flagship Watermark: constitutional phase + chamber — OS-level persistence */}
      <div
        style={{
          position: "absolute",
          top: "14px",
          right: "220px",
          pointerEvents: "none",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          opacity: 0.25,
        }}
      >
        <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.14em", color: "var(--r-dim)", textTransform: "uppercase" }}>{CONSTITUTIONAL_TRUTH.currentPhase}</span>
        <div style={{ width: "1px", height: "8px", background: "var(--r-border)" }} />
        <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.14em", color: CHAMBER_DOTS[activeTab === 'profile' ? 'lab' : activeTab as 'lab' | 'school' | 'creation'], textTransform: "uppercase" }}>{activeTab}</span>
      </div>
    </header>
  );
}
