/**
 * Wave P-33 — Design Tokens (single source of truth).
 *
 * This module is the canonical data for every visual primitive in the
 * Signal shell: spacing, radius, shadow, color, motion, font and
 * letter-spacing. Anything visual that is not a chamber-specific tint
 * MUST resolve to a value that lives here.
 *
 * The file does not own CSS. It owns *data*. The data is materialised
 * into CSS custom properties by `injectCssVariables()` (see
 * `./css-vars.ts`), which is called once at app boot in `src/main.tsx`.
 *
 * Backwards compatibility: every legacy CSS variable already in
 * `src/styles/tokens.css` (e.g. `--space-1`, `--t-display`,
 * `--radius-control`) is preserved by the generator so no existing rule
 * breaks. New tokens introduced in Wave P-33 are added side-by-side.
 *
 * Themes (dark / light / sepia) only override the `color` group at
 * runtime via `[data-theme="…"]` rules — structure is invariant.
 */

// ---------------------------------------------------------------------------
// Spacing — 13-step ramp (index 0..12) used by every layout primitive.
// Indices below 7 align 1:1 with the legacy `--space-1..7` ramp; the
// extras (8..12) cover hero/landing densities introduced post Wave 6.
// ---------------------------------------------------------------------------
export const space = {
  0: 0,
  1: 2,
  2: 4,
  3: 8,
  4: 12,
  5: 16,
  6: 20,
  7: 24,
  8: 32,
  9: 40,
  10: 56,
  11: 72,
  12: 96,
} as const;
export type SpaceKey = keyof typeof space;

// ---------------------------------------------------------------------------
// Radius — four tiers. `full` is for pills.
// ---------------------------------------------------------------------------
export const radius = {
  sm: 4,
  md: 6,
  lg: 10,
  full: 9999,
} as const;
export type RadiusKey = keyof typeof radius;

// ---------------------------------------------------------------------------
// Shadow — rgba composites, dark-tuned. `focus` is the keyboard-focus
// halo; the remainder are elevation primitives.
// ---------------------------------------------------------------------------
export const shadow = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04)",
  md: "0 2px 4px rgba(0, 0, 0, 0.30), 0 10px 28px rgba(0, 0, 0, 0.35)",
  lg: "0 4px 10px rgba(0, 0, 0, 0.40), 0 22px 50px rgba(0, 0, 0, 0.45)",
  focus: "0 0 0 2px rgba(255, 255, 255, 0.18)",
} as const;
export type ShadowKey = keyof typeof shadow;

// ---------------------------------------------------------------------------
// Color — semantic, dark-theme primary. The `light` subgroup is reserved
// for the future light-theme generator; not emitted yet but kept for
// type-safety so consumers can read `color.light.bg` without breaking.
// ---------------------------------------------------------------------------
export const color = {
  bg: "#08080a",
  surface: "#131316",
  "surface-soft": "#1c1c20",
  border: "rgba(255, 255, 255, 0.13)",
  "border-soft": "rgba(255, 255, 255, 0.07)",
  "text-primary": "#ffffff",
  "text-muted": "#b0b0b8",
  "text-ghost": "#3a3a42",
  accent: "#ffffff",
  danger: "#d4785a",
  warn: "#d8b058",
  ok: "#7ab48a",
} as const;
export type ColorKey = keyof typeof color;

// ---------------------------------------------------------------------------
// Motion — three durations + three easings. Easings are CSS strings so
// they can drop into transition shorthand directly.
// ---------------------------------------------------------------------------
export const motion = {
  duration: {
    fast: 120,
    normal: 200,
    slow: 360,
  },
  easing: {
    out: "cubic-bezier(0.2, 0, 0, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;

// ---------------------------------------------------------------------------
// Font families — three stacks. `mono` is the workstation default for
// terminal/code surfaces; `sans` is product chrome; `serif` is the
// editorial display face used by `.t-display` headlines.
// ---------------------------------------------------------------------------
export const font = {
  mono: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
  sans: '"Inter", system-ui, -apple-system, sans-serif',
  serif: '"Fraunces", Georgia, "Times New Roman", serif',
} as const;
export type FontKey = keyof typeof font;

// ---------------------------------------------------------------------------
// Letter-spacing — three semantic tracks. `meta` opens labels/kickers;
// `body` tightens running text just enough; `display` pulls headlines.
// ---------------------------------------------------------------------------
export const track = {
  meta: "0.06em",
  body: "-0.005em",
  display: "-0.01em",
} as const;
export type TrackKey = keyof typeof track;

// ---------------------------------------------------------------------------
// Aggregated bundle — convenient single import for the css-vars generator
// and any consumer that wants the whole token graph at once.
// ---------------------------------------------------------------------------
export const tokens = {
  space,
  radius,
  shadow,
  color,
  motion,
  font,
  track,
} as const;

export type Tokens = typeof tokens;
