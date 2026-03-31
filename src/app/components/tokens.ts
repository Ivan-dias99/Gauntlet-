/**
 * RUBERRA Design Tokens — Mineral Shell
 * One source of truth for all surfaces, ink, type, and chamber identity.
 */

export const R = {
  // ─── Surfaces ───────────────────────────────────────────────────────────────
  shell:    "#F9F9F7",  // sidebar, topbar, lateral rail
  ground:   "#F3F2EE",  // operational background, main content area
  surface:  "#FFFFFF",  // reading surface, output, composer
  lifted:   "#FAFAF8",  // slightly elevated card/panel surface

  // ─── Selection & Interaction ─────────────────────────────────────────────────
  selected: "#EDEAE4",  // active nav item, selected chip
  hover:    "#F0EDE7",  // hover state
  pressed:  "#E8E4DD",  // pressed state

  // ─── Borders ─────────────────────────────────────────────────────────────────
  hairline: "#ECEAE4",  // most divisions — barely there
  line:     "#E2DED8",  // standard structural line
  strong:   "#CCCAC4",  // stronger border when needed

  // ─── Ink Scale ───────────────────────────────────────────────────────────────
  ink:   "#1A1A18",  // primary — headings, active labels, icons
  ink2:  "#383835",  // secondary — body text, default text
  ink3:  "#656560",  // tertiary — descriptions, meta labels
  ink4:  "#9E9E99",  // muted — timestamps, status, helper text
  ink5:  "#C0C0BB",  // disabled — empty placeholders

  // ─── Chamber Accents — semantic, restrained, natural ─────────────────────────
  lab:      "#52796A",  // sage — investigative, analytical, deep
  labLight: "#EEF4F1",  // sage field / background tint
  school:   "#4A6B84",  // slate — scholarly, structured, future
  schoolLight: "#EEF2F6", // slate field / background tint
  creation: "#8A6238",  // amber-earth — generative, making, craft
  creationLight: "#F5EFE7", // amber field / background tint

  // ─── Semantic ────────────────────────────────────────────────────────────────
  live:    "#6B9C7A",  // live pulse indicator
  success: "#5C8A6A",  // success / complete state

  // ─── Typography Scale ─────────────────────────────────────────────────────────
  // Use these as style objects: fontSize, fontWeight, letterSpacing, lineHeight
  t: {
    label:   { fontSize: "10px", fontWeight: 500, letterSpacing: "0.09em",  lineHeight: 1 },
    micro:   { fontSize: "10px", fontWeight: 400, letterSpacing: "0.03em",  lineHeight: 1.4 },
    meta:    { fontSize: "11px", fontWeight: 400, letterSpacing: "0.015em", lineHeight: 1.45 },
    ui:      { fontSize: "12px", fontWeight: 400, letterSpacing: "0.01em",  lineHeight: 1.5 },
    uiMed:   { fontSize: "12px", fontWeight: 500, letterSpacing: "0.01em",  lineHeight: 1.5 },
    body:    { fontSize: "13.5px", fontWeight: 400, letterSpacing: "0",     lineHeight: 1.65 },
    reading: { fontSize: "14px", fontWeight: 400, letterSpacing: "0",       lineHeight: 1.84 },
    title:   { fontSize: "15px", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.4 },
    display: { fontSize: "17px", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.3 },
  },

  // ─── Spacing ─────────────────────────────────────────────────────────────────
  sp: {
    xs:  "4px",
    sm:  "8px",
    md:  "12px",
    lg:  "16px",
    xl:  "24px",
    xxl: "32px",
    "3xl": "48px",
  },

  // ─── Radius ──────────────────────────────────────────────────────────────────
  r: {
    sm: "4px",
    md: "6px",
    lg: "8px",
    xl: "10px",
    pill: "100px",
  },

  // ─── Shadows ─────────────────────────────────────────────────────────────────
  shadow: {
    xs: "0 1px 2px rgba(0,0,0,0.04)",
    sm: "0 1px 4px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.03)",
    md: "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
  },
} as const;

// Chamber-specific accents mapped by mode
export const chamberAccent = {
  lab:      { primary: R.lab,      light: R.labLight      },
  school:   { primary: R.school,   light: R.schoolLight   },
  creation: { primary: R.creation, light: R.creationLight },
} as const;

export type Mode = "lab" | "school" | "creation";
