/**
 * Wave P-33 — Typography scale.
 *
 * A modular type scale snapped to whole pixels for crisp rendering at
 * non-Retina densities. Seven steps cover the whole product:
 *
 *   meta(11) → kicker(12) → body(14) → prominent(16)
 *           → title(20)  → display(40) → hero(40)
 *
 * `display` and `hero` currently share 40px — `display` is the editorial
 * headline ramp (the `.t-display` class, Fraunces serif), `hero` is the
 * landing-glyph slot (`EmptyState`). They were intentionally aligned in
 * round 3 of Wave P-33 to match the canonical `.t-display` rendering
 * the stylesheet has used since pre-wave; the two semantic slots are
 * preserved for future divergence.
 *
 * Use `scale` for font-size, `weight` for font-weight, `leading` for
 * line-height. The companion CSS variables `--t-meta`, `--t-kicker`,
 * `--t-body`, `--t-prominent`, `--t-title`, `--t-display` and
 * `--t-hero` are emitted by `injectCssVariables()` and are the SINGLE
 * source of truth at runtime — `src/styles/tokens.css` no longer
 * declares baseline values for them; only its `@media` overrides
 * (e.g. `--t-display: 32px` ≤640px) layer on top via the cascade.
 * Inline JSX may use either the TS constants or the CSS vars — both
 * resolve to the same pixels.
 */

// ---------------------------------------------------------------------------
// Modular scale — pixel-snapped editorial ramp. `display` is held at the
// historical 40px (canonical .t-display rendering) so the round-3
// alignment of `tokens.ts` ↔ `tokens.css` does not regress the visual.
// ---------------------------------------------------------------------------
export const scale = {
  meta: 11,
  kicker: 12,
  body: 14,
  prominent: 16,
  title: 20,
  display: 40,
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
