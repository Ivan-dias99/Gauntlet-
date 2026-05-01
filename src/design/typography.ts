/**
 * Wave P-33 — Typography scale.
 *
 * A modular type scale derived from a Major Second (1.125) ratio,
 * snapped to whole pixels for crisp rendering at non-Retina densities.
 * Six steps cover the whole product:
 *
 *   meta(11) → kicker(12) → body(14) → prominent(16)
 *           → title(20)  → display(28) → hero(40)
 *
 * Use `scale` for font-size, `weight` for font-weight, `leading` for
 * line-height. The companion CSS variables `--t-meta`, `--t-kicker`,
 * `--t-body`, `--t-prominent`, `--t-title`, `--t-display` and
 * `--t-hero` are emitted by `injectCssVariables()`. Inline JSX may use
 * either the TS constants or the CSS vars — both resolve to the same
 * pixels.
 */

// ---------------------------------------------------------------------------
// Modular scale — Major Second (1.125). Each step roughly 1.125x the
// previous, rounded to the nearest pixel that still reads.
// ---------------------------------------------------------------------------
export const scale = {
  meta: 11,
  kicker: 12,
  body: 14,
  prominent: 16,
  title: 20,
  display: 28,
  hero: 40,
} as const;
export type ScaleKey = keyof typeof scale;

// ---------------------------------------------------------------------------
// Weight — only two. The shell is monochrome; emphasis is reserved.
// ---------------------------------------------------------------------------
export const weight = {
  regular: 400,
  medium: 500,
} as const;
export type WeightKey = keyof typeof weight;

// ---------------------------------------------------------------------------
// Leading — three semantic line-heights.
//   tight  → display headlines, kickers, single-line meta
//   normal → body copy, control labels
//   loose  → long-form reads, archive lists, run notes
// ---------------------------------------------------------------------------
export const leading = {
  tight: 1.2,
  normal: 1.5,
  loose: 1.7,
} as const;
export type LeadingKey = keyof typeof leading;

export const typography = {
  scale,
  weight,
  leading,
} as const;
export type Typography = typeof typography;
