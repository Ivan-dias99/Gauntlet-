# Signal — Component Hierarchy

Wave P-45. Companion to `INFORMATION_ARCHITECTURE.md` (route + page
tree). This doc defines **where every component lives**, why, and how
to add new ones without sprawl.

## Layered architecture

```
src/
├── components/
│   ├── atoms/        → presentational primitives (1 concern, no state, no fetch)
│   ├── molecules/    → small compositions of atoms (limited state, no fetch)
│   └── organisms/    → page-level surfaces (orchestrate state + side effects)
├── pages/            → route-level entry points (compose organisms)
├── shell/            → cross-cutting chrome (TopNav, PageShell, Footer, AvatarDropdown,
│                       CommandPalette, CanonRibbon, ChamberHead — global UI furniture)
├── chambers/         → chamber-specific UIs (insight · surface · terminal · archive · core)
├── spine/            → mission/spine state context + types
├── tweaks/           → user preferences context (theme, density, font, accent, lang)
├── tools/            → tool registry + (future) tools context
├── hooks/            → cross-cutting React hooks (useSignal, useBackendStatus, etc.)
├── lib/              → framework-agnostic helpers (motion, telemetry, intentSwitchGuard)
├── i18n/             → copy catalog + useCopy
├── trust/            → ErrorBoundary + trust-related primitives
└── styles/           → tokens.css (single source of truth) + global resets
```

## Atom canon

A component graduates to `src/components/atoms/` when:

1. It is **presentational** (no state of its own, or only trivial UI
   state like reveal/hide).
2. It is **used in 2+ places** (or imminently will be).
3. It has **no dependency on chamber-specific or page-specific
   context** — atoms are universal.

Wave P-45 graduates three atoms:

| Atom         | Source                              | Notes                                      |
|--------------|-------------------------------------|--------------------------------------------|
| `Pill`       | extracted from inline kicker chips  | tone × size × shape variants                |
| `Segmented`  | extracted from SettingsPage         | exclusive option row (theme, density, etc) |
| `TokenInput` | extracted from SettingsPage api-keys + ConnectorsPage detail | masked input + reveal toggle |

These are documented in their own files and exported from
`src/components/atoms/<Atom>.tsx`. There is no barrel export — each
atom is imported directly to keep tree-shaking honest.

## Molecule canon

`src/components/molecules/` is reserved for compositions of atoms +
limited local state. Future candidates (not yet shipped):

- `ToolPicker` — array of toggleable tools (uses `Pill` + `Segmented`).
- `MaskedSecretCard` — provider header + `TokenInput` + reveal/remove
  actions (used in api-keys + connectors detail).
- `EmptyHero` — kicker + title + lead + CTA, used in chamber hero
  blocks.

Molecules ship when at least two consumers exist. Until then the inline
shape is fine — premature extraction is its own kind of debt.

## Organism canon

`src/components/organisms/` is reserved for page-level surfaces that
orchestrate state + side effects across several molecules. Most current
organisms still live next to their consumer (e.g.
`chambers/terminal/ToolInspectorPanel`, `pages/PluginsPage`); they
graduate to organisms when reused across pages or chambers.

## Pages

Live in `src/pages/` and compose organisms. Each page is the route's
default export and may declare a `data-page="<slug>"` data attribute on
the outermost element so global CSS hooks can target page-specific
selectors without leaking the page module name into class strings.

Current pages (P-39a route table):

- `LandingPage` — `/landing` (hero variant)
- `ChambersPage` — `/chambers/:tab` (hosts the immersive Shell)
- `SettingsPage` — `/settings/:section`
- `ProfilePage` — `/profile`
- `ConnectorsPage` — `/connectors` and `/connectors/:id`
- `PluginsPage` — `/plugins`
- `DocsPage` — `/docs`
- `NotFoundPage` — `*`

## Tools registry

`src/tools/registry.ts` is the single source of truth for the tool
catalog (Wave P-45). Chamber composers and the future global tools
picker import from here. Adding a new tool means a single export change
in this file — every chamber that surfaces tools will see it.

Tool kinds:

- `fs`  — filesystem read / introspection
- `cmd` — shell-class execution (server-side gated)
- `vcs` — version-control read/write
- `net` — outbound HTTP / search

Currently exposed sets:

- `TERMINAL_TOOLS` — full set (fs · cmd-gated · vcs · net)
- `INSIGHT_TOOLS`  — research grounding (fetch · search · read)

## Conventions

- **Inline styles vs CSS classes.** Atoms use inline styles to stay
  self-contained and dependency-free. Pages and chambers continue to
  use the named class system rooted in `tokens.css` — extending classes
  there when the visual idiom is shared, dropping inline style only
  when the same shape is reused 3+ times.
- **No barrel re-exports.** Import atoms directly; barrels make
  tree-shaking less reliable and obscure call sites.
- **Doctrine override.** When in doubt, write the inline thing. Three
  similar inline blocks is better than a premature abstraction.

## Wave plan summary (architecture)

| Wave  | Scope                                            | Status |
|-------|--------------------------------------------------|--------|
| P-39a | Router + page scaffolds                          | merged |
| P-39b | PageShell + TopNav + Footer + AvatarDropdown     | open   |
| P-39c | URL-driven Shell (collapse signal:chamber bridge)| open   |
| P-40  | Landing flagship                                 | open   |
| P-41  | Composer real (route mode + tools allowlist)     | open   |
| P-42  | Workbench tool inspector                         | open   |
| P-43  | Settings + Profile real                          | open   |
| P-44  | Connectors + Plugins real                        | open   |
| P-45  | Tools registry + atom canon + this doc           | open   |

All seven waves close the architectural gap the operator named: the
product no longer hides its connectors, tools, settings, or chambers
behind placeholder surfaces.
