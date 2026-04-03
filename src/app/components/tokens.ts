/**
 * RUBERRA Design Tokens — Mineral Shell
 * One source of truth for all surfaces, ink, type, and chamber identity.
 *
 * Surface/ink values use CSS custom properties so dark mode works everywhere.
 * Chamber accent hex values remain static — they are used for alpha-suffix
 * interpolation (e.g. `${R.lab}18`) and have separate --chamber-* CSS overrides.
 */

export const R = {
  // ─── Surfaces — CSS vars (theme-aware) ─────────────────────────────────────
  shell:    "var(--r-rail)",      // sidebar, topbar, lateral rail
  ground:   "var(--r-bg)",        // operational background, main content area
  surface:  "var(--r-surface)",   // reading surface, output, composer
  lifted:   "var(--r-elevated)",  // slightly elevated card/panel surface

  // ─── Selection & Interaction ─────────────────────────────────────────────────
  selected: "var(--r-elevated)",  // active nav item, selected chip
  hover:    "var(--r-elevated)",  // hover state
  pressed:  "var(--r-border)",    // pressed state

  // ─── Borders — CSS vars ───────────────────────────────────────────────────────
  hairline: "var(--r-border-soft)",  // most divisions — barely there
  line:     "var(--r-border)",       // standard structural line
  strong:   "var(--r-border)",       // stronger border when needed

  // ─── Ink Scale — CSS vars ────────────────────────────────────────────────────
  ink:  "var(--r-text)",     // primary — headings, active labels, icons
  ink2: "var(--r-text)",     // secondary — body text, default text
  ink3: "var(--r-subtext)",  // tertiary — descriptions, meta labels
  ink4: "var(--r-subtext)",  // muted — timestamps, status, helper text
  ink5: "var(--r-muted)",    // disabled — empty placeholders

  // ─── Chamber Accents — hex (used for alpha-suffix string interpolation) ──────
  lab:         "#52796A",   // sage — investigative, analytical, deep
  labLight:    "#EEF4F1",   // sage field / background tint (light mode)
  school:      "#4A6B84",   // slate — scholarly, structured, future
  schoolLight: "#EEF2F6",   // slate field / background tint (light mode)
  creation:    "#8A6238",   // amber-earth — generative, making, craft
  creationLight: "#F5EFE7", // amber field / background tint (light mode)

  // ─── Semantic ────────────────────────────────────────────────────────────────
  live:    "var(--r-pulse)",  // live pulse indicator
  success: "var(--r-ok)",     // success / complete state

  // ─── Typography Scale ─────────────────────────────────────────────────────────
  t: {
    label:   { fontSize: "10px", fontWeight: 500, letterSpacing: "0.09em",  lineHeight: 1    } as React.CSSProperties,
    micro:   { fontSize: "10px", fontWeight: 400, letterSpacing: "0.03em",  lineHeight: 1.4  } as React.CSSProperties,
    meta:    { fontSize: "11px", fontWeight: 400, letterSpacing: "0.015em", lineHeight: 1.45 } as React.CSSProperties,
    ui:      { fontSize: "12px", fontWeight: 400, letterSpacing: "0.01em",  lineHeight: 1.5  } as React.CSSProperties,
    uiMed:   { fontSize: "12px", fontWeight: 500, letterSpacing: "0.01em",  lineHeight: 1.5  } as React.CSSProperties,
    body:    { fontSize: "13.5px", fontWeight: 400, letterSpacing: "0",     lineHeight: 1.65 } as React.CSSProperties,
    reading: { fontSize: "14px",   fontWeight: 400, letterSpacing: "0",     lineHeight: 1.84 } as React.CSSProperties,
    title:   { fontSize: "15px",   fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.4 } as React.CSSProperties,
    display: { fontSize: "17px",   fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.3 } as React.CSSProperties,
  },

  // ─── Spacing ─────────────────────────────────────────────────────────────────
  sp: {
    xs:    "4px",
    sm:    "8px",
    md:    "12px",
    lg:    "16px",
    xl:    "24px",
    xxl:   "32px",
    "3xl": "48px",
  },

  // ─── Radius — Mineral Shell Law ────────────────────────────────────────────
  r: {
    sm:   "2px",
    md:   "2px",
    lg:   "2px",
    xl:   "2px",
    pill: "2px",
  },

  // ─── Shadows ─────────────────────────────────────────────────────────────────
  shadow: {
    xs: "0 1px 2px rgba(0,0,0,0.06)",
    sm: "0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)",
    md: "0 2px 8px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.05)",
  },
} satisfies Record<string, unknown>;

// ─── Import for type annotation ───────────────────────────────────────────────
import type React from "react";

// Chamber-specific accents mapped by mode
export const chamberAccent = {
  lab:      { primary: R.lab,      light: R.labLight      },
  school:   { primary: R.school,   light: R.schoolLight   },
  creation: { primary: R.creation, light: R.creationLight },
} as const;

export type Mode = "lab" | "school" | "creation";
