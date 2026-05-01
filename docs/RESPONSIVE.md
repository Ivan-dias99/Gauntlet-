# Responsive layout & density (Wave P-37)

Signal targets every operator viewport between a phone in portrait
(360 px) and a 32" 4K monitor (2560 px+). One organism, one visual
grammar — only spacing, font scale and chrome topology change.

## Density

Three densities. Default is comfortable.

| key           | `--density-scale` | when to pick                                    |
| ------------- | ----------------- | ----------------------------------------------- |
| `cosy`        | `1.000`           | reading-heavy sessions, large monitors, low DPI |
| `comfortable` | `0.875` (default) | day-to-day operator                             |
| `compact`     | `0.750`           | dense ledgers, dashboards, small laptops        |

The active density is written as `:root[data-density="..."]` by
`TweaksContext` (`src/tweaks/TweaksContext.tsx`). It is persisted to
`localStorage` under `signal:tweaks` and read on boot. Legacy values
(`spacious`, `compact`, `comfortable`) are migrated transparently:
`spacious → cosy`, the others map by name.

The toggle lives in the canon ribbon as a small icon button
(`CanonRibbon.tsx` → `.canon-ribbon-density`). Clicking cycles
`cosy → comfortable → compact → cosy`. The button glyph mirrors the
active density (taller stack on cosy, shorter on compact).

### What scales vs. what stays absolute

Scaled by `--density-scale`:

- Body and section typography (`--t-body`, `--lh-body`, …)
- Container padding (`.chamber-body`, `.panel`)
- Conversation turn padding (`.turn`)

Intentionally NOT scaled:

- Border widths (1 px hairlines stay 1 px)
- Icon glyphs (semantic chrome)
- Radii (visual identity)
- Touch-target minimums (see below)

## Breakpoints

Two breakpoint families. Viewport-level breakpoints control the shell
topology (drawer vs. ribbon). Container-level breakpoints control how
each chamber lays out its inside.

### Viewport breakpoints

| viewport            | width        | what changes                                                  |
| ------------------- | ------------ | ------------------------------------------------------------- |
| Mobile portrait     | ≤ 380 px     | extra-tight ribbon padding, mission pill capped at 120 px     |
| Mobile              | ≤ 640 px     | ribbon shortens, doctrine line hidden, `--space-4..7` shrink  |
| Mobile + drawer     | ≤ 720 px     | top tab bar replaced with hamburger drawer (`Shell.tsx`)      |
| Tablet portrait     | 721–1024 px  | desktop ribbon, default density                               |
| Desktop             | 1025–1440 px | full ribbon + chamber rails                                   |
| Wide desktop        | 1441–2560 px | same chrome, more chamber breathing room                      |
| 4K / operator       | ≥ 2561 px    | unchanged chrome — chamber-body `clamp()` grows the gutter    |

### Container queries (`.chamber-shell`)

Each chamber is a `container-type: inline-size` container. Sub-panels
inside a chamber answer to the chamber's *own* width, not the viewport.

| condition                  | applies to    | effect                              |
| -------------------------- | ------------- | ----------------------------------- |
| `(max-width: 640px)`       | `.panel`      | padding shrinks to `--space-2`      |
| `(max-width: 640px)`       | `.grid-2col`  | collapses to single column          |
| `(max-width: 640px)`       | `.chamber-body` | horizontal padding shrinks         |
| `(max-width: 420px)`       | `.panel-head` | wraps; sub-label loses left margin  |

### Touch-target safety

`@media (pointer: coarse)` enforces a 44×44 px minimum on `.btn`,
`.btn-icon`, `.btn-chip`, `.tab`, the density toggle, hamburger,
drawer items, and any `[role="button"]`. The CSS lives at the bottom of
`src/styles/tokens.css` so it always wins over chamber-local overrides.

## Mobile drawer

Below 720 px the canon ribbon hides the chamber tab bar and shows a
hamburger button. Tapping it opens a left-anchored drawer
(`.mobile-drawer`) containing:

1. The five chamber buttons (Insight, Surface, Terminal, Archive, Core).
2. A density segment (cosy / comfortable / compact) so density can be
   set without going to Core → System.

Drawer keyboard contract:

- **Esc** closes and returns focus to the hamburger.
- The first chamber item receives focus on open (`[data-drawer-first]`).
- Existing global shortcuts (Alt+1..5 for chambers, ⌘K palette) keep
  working — the drawer is layered above, not a replacement.

## Test viewports

Manual smoke list before merging shell-level changes:

- 360 × 800 (mobile portrait)
- 768 × 1024 (tablet portrait)
- 1024 × 768 (tablet landscape)
- 1440 × 900 (standard desktop)
- 2560 × 1440 (4K monitor)

Each viewport should:

- Show all chamber chrome without horizontal scroll.
- Keep ≥ 44 px touch targets when emulated as a touch device.
- Cycle through the three densities without text overlap or clipping.
