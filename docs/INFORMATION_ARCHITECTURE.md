# Signal — Information Architecture

Wave P-39 (a/b/c). Single source of truth for routes, pages, and the
component hierarchy that renders them.

## Route table

```
/                          ─→  redirect /landing
/landing                   ─→  LandingPage           hero · pitch · CTA (P-40)
/chambers                  ─→  redirect /chambers/insight
/chambers/:tab             ─→  ChambersPage          5 chambers + Surface Final
/settings                  ─→  redirect /settings/preferences
/settings/:section         ─→  SettingsPage          preferences | api-keys
                                                     connectors | language (P-43)
/profile                   ─→  ProfilePage           operador · stats (P-43)
/connectors                ─→  ConnectorsPage        10 cards · status (P-44)
/connectors/:id            ─→  ConnectorsPage        detail + setup wizard
/plugins                   ─→  PluginsPage           catálogo + custom (P-44)
/docs                      ─→  DocsPage              RUNBOOK · VOICE · etc
*                          ─→  NotFoundPage          404 com link voltar
```

## IA tree

```
Signal
├── Landing            sales · doctrine pitch · 5-chamber preview
├── Chambers           operator workspace
│   ├── Insight         research · distillation · validation
│   ├── Surface         design · BuildSpec · plan generator
│   ├── Surface Final   preview iframe · element pick · visual diff
│   ├── Terminal        agent loop · tools · gates · runs
│   ├── Archive         runs · failures · audit
│   └── Core            system · doctrine telemetry · spine snapshot
├── Connectors         10 integrations
│   ├── GitHub
│   ├── Vercel
│   ├── Railway
│   ├── Postgres
│   ├── Web · Research
│   ├── Model Gateway
│   ├── Browser Runtime
│   ├── Figma
│   ├── Issue Tracker
│   └── Observability
├── Plugins            extensibility · custom tools
├── Settings
│   ├── Preferences    theme · density · language
│   ├── API Keys       Anthropic · GitHub · Vercel · Railway · Figma
│   ├── Connectors     status + connect/disconnect/test
│   └── Language       pt-PT · en
├── Profile            operador · estatísticas · histórico
└── Docs               RUNBOOK · FIRST_MISSION · VOICE · etc
```

## Layout shells

Two top-level shells:

1. **`PageShell`** (P-39b) — wraps every non-chamber page.
   - `<TopNav>` brand · primary nav · ⌘K · avatar dropdown
   - `<main>` page content rendered by router
   - `<Footer>` version · build · status · legal links

2. **`ChambersPage`** keeps its own layout (the existing `Shell.tsx`
   internals — ribbon · main · drawer · CommandPalette). Reason: the
   chamber workspace has a distinct top-bar (CanonRibbon with mission
   pill) that doesn't belong on marketing/settings pages.

## Component hierarchy

```
src/
├── pages/                page-level routes (this wave)
├── shell/                cross-page layout primitives
│   ├── PageShell.tsx     (P-39b)
│   ├── TopNav.tsx        (P-39b)
│   ├── Footer.tsx        (P-39b)
│   ├── AvatarDropdown.tsx (P-39b)
│   ├── Shell.tsx         legacy chamber shell — refactored P-39c
│   ├── CanonRibbon.tsx
│   ├── CommandPalette.tsx
│   ├── HandoffInbox.tsx
│   ├── states/           Empty · Error · Loading primitives (P-36)
│   └── ChamberErrorBoundary.tsx
├── chambers/             per-chamber implementations
│   ├── insight/
│   ├── surface/
│   ├── surface-final/
│   ├── terminal/
│   ├── archive/
│   └── core/
├── design/               tokens · typography · css-vars (P-33)
├── lib/                  motion · signalApi · etc
├── spine/                state · types · context
├── tweaks/               theme · density · language preferences
├── trust/                ErrorBoundary
└── i18n/                 copy.ts (P-38)
```

## Wave plan

| Wave  | Scope                                                | Status |
|-------|------------------------------------------------------|--------|
| P-39a | Router + 8 page scaffolds + main.tsx wiring          | this PR |
| P-39b | PageShell + TopNav + Footer + AvatarDropdown         | next   |
| P-39c | Refactor Shell.tsx → ChambersPage.tsx (move logic)   | last   |
| P-40  | Landpage flagship hero + scroll choreography         | after  |
| P-41  | Composer real (Insight · Surface · Terminal)         | after  |
| P-42  | Workbench funcional (live SSE + tool inspector)      | after  |
| P-43  | Settings + Profile real content                      | after  |
| P-44  | Connectors + Plugins real content                    | after  |
| P-45  | Tools picker + component hierarchy refactor          | after  |

## Doctrine notes

- `<PageShell>` is opt-in per page. Chambers don't use it. Marketing
  pages do. Settings/profile use it. This keeps the chamber workspace
  immersive (no top nav competing with CanonRibbon).
- Direct links to chamber sub-tabs: `/chambers/terminal` deep-linkable.
  P-39c collapsed the `signal:chamber` bridge — the URL param is now
  the direct driver of the Shell switcher; the CustomEvent no longer
  exists in code (audit drift fix, 2026-05-09).
- 404 must be navigable; never blank. Skip-link + visible nav so
  keyboard users can bail out.
- Settings sections are stable URLs. Operators bookmark them.
