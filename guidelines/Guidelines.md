# Ruberra — AI System Guidelines

## Product Identity

Ruberra is a sovereign AI intelligence environment with exactly **three chambers**:
- **Lab** — research, investigation, simulation, analysis
- **School** — learning, curriculum, mastery, future tracks
- **Creation** — build, ship, archive, monetize

Do not add new chambers, tabs, or product directions.

---

## General Guidelines

* Preserve the Mineral Shell aesthetic — warm pale stone surfaces, restrained semantic colors, breathable spacing
* Every visible element must have a real destination (clickable, expandable, navigable, or functional). Remove or wire anything that is purely decorative.
* Keep file sizes small; put helper functions and components in their own files
* Refactor as you go to keep code clean; do not leave dead code in place
* Use the design tokens from `src/app/components/tokens.ts` (the `R` object) for all colors, spacing, and typography — never hard-code visual values that duplicate tokens
* Use only absolute positioning when necessary; prefer flexbox/grid layouts

---

## Design System Guidelines

### Typography
* Primary UI font: `'Inter', sans-serif`
* Monospace / terminal surfaces: `'JetBrains Mono', monospace`
* Use the `R.t` token scale for font sizes — do not invent new size steps
* Base reading size: `14px` (`R.t.reading`)

### Color
* Shell surfaces: `var(--r-bg)`, `var(--r-surface)`, `var(--r-border)` CSS variables
* Chamber accent colors: Lab `#52796A` (sage), School `#4A6B84` (slate), Creation `#8A6238` (amber-earth)
* No neon, no cyberpunk palette, no gamer colors
* Status semantics: green = pass/live, amber = warn/pending, red = error/blocked, neutral = idle/draft

### Spacing
* Use `R.sp` token scale: `xs=4px`, `sm=8px`, `md=12px`, `lg=16px`, `xl=24px`, `xxl=32px`

### Interaction States
* Hover: `var(--r-hover)` / `R.hover`
* Selected/active: `var(--r-selected)` / `R.selected`
* All interactive elements must have visible hover and active states

---

## Architecture Rules

* All chamber-level state lives in `App.tsx` — do not lift product state into child components
* Navigation is driven by `NavFn` — all cross-chamber and cross-view transitions must use `navigate(tab, view, id?)`
* Product data lives in `product-data.ts` — seeded content must reference real object IDs that exist in that file
* The `object-graph.ts` connects product objects across chambers — keep `RUBERRA_OBJECTS` consistent with `product-data.ts`
* Model routing lives in `model-orchestration.ts` — task and model changes must go through `resolveExecutionPlan`

---

## What Not To Do

* Do not redesign the approved Ruberra root
* Do not add decorative elements with no destination
* Do not create standalone screens disconnected from the navigation graph
* Do not introduce neon colors, heavy drop shadows, or animated backgrounds
* Do not break the Mineral Shell visual regime with Entertainment or Dashboard styling
* Do not add new dependencies without checking for security advisories first
