# Wave P-35 — accessibility audit

WCAG 2.2 AA baseline. Numbers below come from a manual relative-luminance
calculation against the design tokens declared in `src/styles/tokens.css`.
Pass thresholds: 4.5:1 for normal text, 3:1 for large text and non-text
UI.

## Method

For each theme, the contrast ratio between every text token
(`--text-primary`, `--text-secondary`, `--text-muted`, `--text-ghost`)
and every surface token (`--bg`, `--bg-surface`, `--bg-elevated`) is
computed using the WCAG formula `(L1 + 0.05) / (L2 + 0.05)`. `--accent`
is checked the same way because it doubles as a focus ring colour and
must clear 3:1 against any surface it can land on.

## Dark theme

| surface       | text-primary | text-secondary | text-muted    | text-ghost    | accent (focus ring) |
| ------------- | ------------ | -------------- | ------------- | ------------- | ------------------- |
| `--bg`        | 20.01 ✓ AA   | 9.29 ✓ AA      | 3.73 (large)  | 1.78 ✗        | 20.01 ✓             |
| `--bg-surface`| 18.54 ✓ AA   | 8.61 ✓ AA      | 3.46 (large)  | 1.65 ✗        | 18.54 ✓             |
| `--bg-elevated`| 16.99 ✓ AA  | 7.88 ✓ AA      | 3.17 (large)  | 1.51 ✗        | 16.99 ✓             |

## Light theme

| surface       | text-primary | text-secondary | text-muted    | text-ghost    | accent (focus ring) |
| ------------- | ------------ | -------------- | ------------- | ------------- | ------------------- |
| `--bg`        | 19.63 ✓ AA   | 10.57 ✓ AA     | 3.21 (large)  | 1.56 ✗        | 19.63 ✓             |
| `--bg-surface`| 21.00 ✓ AA   | 11.31 ✓ AA     | 3.43 (large)  | 1.67 ✗        | 21.00 ✓             |
| `--bg-elevated`| 21.00 ✓ AA  | 11.31 ✓ AA     | 3.43 (large)  | 1.67 ✗        | 21.00 ✓             |

## Sepia theme

| surface       | text-primary | text-secondary | text-muted    | text-ghost    | accent (focus ring) |
| ------------- | ------------ | -------------- | ------------- | ------------- | ------------------- |
| `--bg`        | 15.34 ✓ AA   | 7.17 ✓ AA      | 3.59 (large)  | 1.77 ✗        | 9.18 ✓              |
| `--bg-surface`| 14.37 ✓ AA   | 6.72 ✓ AA      | 3.37 (large)  | 1.66 ✗        | 8.61 ✓              |
| `--bg-elevated`| 12.78 ✓ AA  | 5.98 ✓ AA      | 3.00 (large)  | 1.48 ✗        | 7.65 ✓              |

## Findings

1. **Primary and secondary text pass AA on every surface, every theme.**
   No action needed.

2. **Muted text (`--text-muted`) only passes AA-Large (≥3:1) on every
   theme.** It is not safe for body copy — it should remain reserved for
   meta strings (timestamps, chip labels, footnotes) that render at the
   `--t-meta` (11px) or larger size *and* in a non-critical context. A
   sweep of `text-muted` usage in body-sized prose is the next escalation
   if a screen-reader pass flags one.

3. **Ghost text (`--text-ghost`) fails contrast on every surface,
   every theme.** This token is intentionally near-invisible — used for
   decorative placeholders, separators (`·`), and disabled glyphs. It
   must never carry information. Recommendation: add a lint rule (or a
   doc note in tokens.css) forbidding `--text-ghost` on any element
   whose semantics are not purely decorative (`aria-hidden="true"` or
   `role="presentation"`).

4. **Focus ring (`--accent`)** clears the 3:1 non-text threshold by a
   wide margin on every surface in every theme. The Wave P-35 universal
   `:focus-visible` rule is safe.

## Recommended token adjustments

None applied in this PR. The failures above are by-design (ghost is
ornamental, muted is meta-only). If a future audit decides muted should
also pass body-AA, the cheapest fix is darkening / brightening to ~50%
luminance:

- dark: `--text-muted: #8a8a92` would lift bg/text-muted to ~5.0
- light: `--text-muted: #6c6c72` would lift bg/text-muted to ~5.4
- sepia: `--text-muted: #a0865c` would lift bg/text-muted to ~5.5

These are non-trivial palette shifts (the muted/ghost gap collapses); a
dedicated wave should own that decision.

## ARIA pass — what changed

- `CommandPalette` modal — `role="dialog"`, `aria-modal="true"`,
  `aria-labelledby` to a hidden label; the listbox uses `role="listbox"`
  and items use `role="option"` with `aria-selected`. Input carries
  `aria-controls` and `aria-activedescendant` so screen readers track
  selection.
- Skip-link — anchor `<a href="#main">` paired with `id="main"` on the
  Shell's `<main>` element.
- Existing `<button>` instances in CanonRibbon already carry text
  content; no new aria-labels added because no icon-only buttons appear
  there.
- `FailureMemoryPanel` filter input retains its `aria-label`; the
  hardcoded `outline: none` was removed so the global focus-visible rule
  paints correctly.

## Out of scope (future waves)

- Full sweep of every `<button>` across every chamber for an aria-label
  on icon-only variants. Wave P-35 audited only the elements newly
  introduced or near the modified files.
- Live-region tagging on SSE outputs (`aria-live="polite"`) — the
  terminal output stream already renders into a `<pre>` block but does
  not declare a live region. A dedicated terminal-a11y wave should own
  that change to avoid noisy announcements.
- Reduced-motion review beyond the existing `prefers-reduced-motion`
  block.
