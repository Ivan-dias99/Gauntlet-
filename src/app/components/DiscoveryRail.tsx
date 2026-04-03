/**
 * RUBERRA Discovery Rail
 * Horizontal scrollable content rail with label + optional CTA.
 * The browsing unit of Ruberra's content universe.
 */

import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { R } from "./tokens";
import { RLabel } from "./shared";

// ─── Action button with proper CSS-var hover ─────────────────────────────────

function ActionBtn({ label, onClick }: { label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "3px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontSize: "10px",
        color: hovered ? "var(--r-text)" : "var(--r-subtext)",
        fontFamily: "'Inter', sans-serif",
        outline: "none",
        padding: "2px 0",
        transition: "color 0.12s ease",
        letterSpacing: "0",
      }}
    >
      {label}
      <ChevronRight size={10} strokeWidth={1.75} />
    </button>
  );
}

interface DiscoveryRailProps {
  label: string;
  sublabel?: string;
  action?: { label: string; onClick: () => void };
  children: React.ReactNode;
  gap?: number;
}

export function DiscoveryRail({
  label,
  sublabel,
  action,
  children,
  gap = 10,
}: DiscoveryRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ marginBottom: "36px" }}>
      {/* Rail header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "28px",
          paddingRight: "28px",
          marginBottom: "13px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "-0.005em",
              color: R.ink2,
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            {label}
          </span>
          {sublabel && (
            <span
              style={{
                fontSize: "10px",
                color: R.ink5,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0",
              }}
            >
              {sublabel}
            </span>
          )}
        </div>
        {action && (
          <ActionBtn label={action.label} onClick={action.onClick} />
        )}
      </div>

      {/* Scrollable rail */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: `${gap}px`,
          overflowX: "auto",
          paddingLeft: "28px",
          paddingRight: "28px",
          paddingBottom: "6px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="hide-scrollbar"
      >
        {children}
      </div>
    </div>
  );
}

// ─── Secondary Button (theme-aware hover) ────────────────────────────────────

function SecondaryBtn({ label, onClick }: { label: string; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "8px 14px",
        borderRadius: R.r.lg,
        border: `1px solid var(--r-border)`,
        background: hov ? "var(--r-elevated)" : "transparent",
        fontSize: "12px",
        fontWeight: 400,
        letterSpacing: "0.01em",
        color: "var(--r-subtext)",
        cursor: "pointer",
        fontFamily: "'Inter', sans-serif",
        outline: "none",
        transition: "background 0.12s ease, color 0.12s ease",
      }}
    >
      {label}
    </button>
  );
}

// ─── Featured Hero Card ────────────────────────────────────────────────────────
// Large featured content block at the top of each discovery home.

interface FeaturedHeroProps {
  label: string;
  title: string;
  description: string;
  meta: string;
  accent: string;
  accentLight: string;
  ctaLabel: string;
  onCta: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  badge?: string;
  stats?: { label: string; value: string }[];
}

export function FeaturedHero({
  label,
  title,
  description,
  meta,
  accent,
  accentLight,
  ctaLabel,
  onCta,
  secondaryLabel,
  onSecondary,
  badge,
  stats,
}: FeaturedHeroProps) {
  return (
    <div
      style={{
        margin: "0 28px 32px",
        borderRadius: "2px",
        border: "1px solid var(--r-border-soft)",
        background: "var(--r-surface)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 8px color-mix(in srgb, var(--r-text) 6%, transparent), 0 0 0 1px color-mix(in srgb, var(--r-text) 4%, transparent)",
      }}
    >
      {/* Visual band */}
      <div
        style={{
          height: "120px",
          background: accentLight,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Geometric background pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(color-mix(in srgb, ${accent} 10%, transparent) 1px, transparent 1px),
              linear-gradient(90deg, color-mix(in srgb, ${accent} 10%, transparent) 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px",
          }}
        />
        {/* Large accent circle — structural, not decorative */}
        <div
          style={{
            position: "absolute",
            right: "-40px",
            top: "-40px",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: `color-mix(in srgb, ${accent} 8%, transparent)`,
            border: `1px solid color-mix(in srgb, ${accent} 16%, var(--r-border))`,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "20px",
            top: "20px",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: `color-mix(in srgb, ${accent} 12%, transparent)`,
            border: `1px solid color-mix(in srgb, ${accent} 20%, var(--r-border))`,
          }}
        />

        {/* Badge */}
        {badge && (
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "18px",
              padding: "3px 9px",
              borderRadius: R.r.pill,
              background: `color-mix(in srgb, ${accent} 14%, var(--r-surface))`,
              border: `1px solid color-mix(in srgb, ${accent} 26%, var(--r-border))`,
              ...R.t.label,
              color: accent,
              fontFamily: "'Inter', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <motion.span
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: "4px", height: "4px", borderRadius: "50%", background: accent, display: "inline-block", flexShrink: 0 }}
            />
            {badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "18px 22px 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                ...R.t.label,
                color: accent,
                fontFamily: "'Inter', sans-serif",
                marginBottom: "5px",
              }}
            >
              {label}
            </p>
            <h3
              style={{
                ...R.t.title,
                color: "var(--r-text)",
                fontFamily: "'Inter', sans-serif",
                marginBottom: "6px",
                fontWeight: 500,
              }}
            >
              {title}
            </h3>
            <p
              style={{
                ...R.t.meta,
                color: R.ink4,
                fontFamily: "'Inter', sans-serif",
                lineHeight: "1.55",
                marginBottom: "14px",
                maxWidth: "480px",
              }}
            >
              {description}
            </p>
            <p
              style={{
                ...R.t.micro,
                color: R.ink5,
                fontFamily: "'Inter', sans-serif",
                marginBottom: "14px",
              }}
            >
              {meta}
            </p>

            {/* Actions */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                onClick={onCta}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: R.r.lg,
                  border: "none",
                  background: "var(--r-text)",
                  color: "var(--r-bg)",
                  ...R.t.uiMed,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  outline: "none",
                  transition: "opacity 0.12s ease",
                }}
                className="hover:opacity-80"
              >
                {ctaLabel}
                <ChevronRight size={12} strokeWidth={2} />
              </button>
              {secondaryLabel && onSecondary && (
                <SecondaryBtn label={secondaryLabel} onClick={onSecondary} />
              )}
            </div>
          </div>

          {/* Stats cluster */}
          {stats && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                flexShrink: 0,
                paddingLeft: "20px",
                borderLeft: `1px solid ${R.hairline}`,
              }}
            >
              {stats.map((s) => (
                <div key={s.label} style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "var(--r-text)",
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1,
                      marginBottom: "2px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {s.value}
                  </p>
                  <p
                    style={{
                      ...R.t.micro,
                      color: R.ink4,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
