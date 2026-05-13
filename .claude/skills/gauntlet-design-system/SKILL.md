---
name: gauntlet-design-system
description: Sovereign design-system law for the Gauntlet product (Composer cápsula + Pill, Control Center garagem, browser-extension shell, Tauri desktop shell). Use whenever the user is editing, reviewing, designing, refactoring, or adding UI inside this repository — including Capsule.tsx, Pill.tsx, PillApp.tsx (desktop), ComposerClient, ambient adapters, control-center pages, design tokens, capsule.css.ts, aether-v4.css, or any component under packages/composer/, apps/browser-extension/, apps/desktop/, or control-center/. Trigger this skill even when the user does not say "design system" — any change to a .tsx file, tokens.css, the typed token graph, the visual hierarchy, copy/voice, or motion is in scope. This skill enforces the Aether v4 visual canon (paper surfaces + cyan brand + Newsreader display + Inter Tight sans + JetBrains Mono + 7-step type scale + terracotta-on-executed warmth callback), dual-shell parity for the Capsule (browser ↔ desktop), the documented Pill divergence (Capsule is shared single-source-of-truth; Pill is intentionally re-implemented in apps/desktop/src/PillApp.tsx because page-DOM abstractions don't translate to OS windows), the Capsule budget law (line count must descend; current high-water-mark is 778 enforced in ci.yml), the cursor-edge philosophy (point → ask → execute), the 8-state phase grammar (idle → planning → streaming → plan_ready → danger_gate → executing → executed → error), the canonical label set (Enviar · Resposta · Plano · Executar · Executar com cuidado · Executado · Anexar · Ecrã · Voz · Copy · Save · Re-read · Erro), the banned label set (~Compor · Submit · Run · Magic · Assistant · Preview~ enforced via scripts/check-voice.mjs), and the gateway-only LLM rule on the frontend (frontend never imports provider SDKs — backend gateway only). It composes with — and does not replace — the upstream skills `frontend-design` (creative direction, anti-slop), `web-interface-guidelines` (correctness review), and `design-system-ops` (token drift, governance audits).
---

# Gauntlet Design System

This skill is the local constitution for UI work in the Gauntlet repository. It does not invent aesthetics — `frontend-design` already governs taste. It does not re-litigate WCAG — `web-interface-guidelines` covers correctness. It does not audit token drift — `design-system-ops` does that. This skill enforces the rules that are **specific to Gauntlet** and that the upstream skills cannot know: the Aether v4 visual canon, where things live, what may not split, what may not grow, what is intentionally divergent, and what shape closure has to take before a change is real.

Read this skill in full whenever you touch UI in this repo. The rules are short on purpose — every one of them maps to a concrete failure mode that has already cost time.

-----

## When to use this skill

Trigger this skill whenever any of these are true:

- The change touches a file under `packages/composer/`, `apps/browser-extension/`, `apps/desktop/src/`, or `control-center/`.
- The user is editing or reviewing `Capsule.tsx`, `Pill.tsx`, `PillApp.tsx` (desktop), `ComposerClient`, `ambient.ts` (in either shell), or any sub-component / hook in `packages/composer/src/`.
- The change involves design tokens (`packages/composer/src/aether-v4.css`, `control-center/styles/tokens.css`, `control-center/design/`, or any new `--gx-*` reference).
- The user mentions cápsula, pill, composer, control center, garagem, Aether, ember, paper, cyan, terracotta, or any chamber-equivalent surface (Memory ledger, Runs, Permissions, Models, Settings, Governance).
- The user asks to "improve the UI", "make it premium", "polish", "fix the layout", "match the Aether spec", or any visual / structural request scoped to this product.
- The user is wiring a new feature into the Composer and needs to decide where the code lives.
- Any change adds, edits, or removes user-facing copy in the Composer — labels, placeholder text, error messages, status strings.

When you trigger, **also read the body of `frontend-design`** for taste, and consult `web-interface-guidelines` before declaring closure. Those are upstream — they do not know about this product, but they are the floor.

## When NOT to use this skill

- Pure backend work in `backend/` (FastAPI), unless the change crosses into the API contract that the Composer consumes — `gauntlet-backend-spine` covers that side.
- Documentation-only edits to `docs/` (except `docs/canon/AETHER_V4.md`, which is canon and should pass through Ivan).
- CI / release workflow files, unless they touch the Capsule line-count budget gate or the voice ban-list lint.
- Generic frontend questions that are not anchored in this repo.

If in doubt, prefer to load the skill. The cost is small; the cost of missing the Capsule Law, the Pill divergence rule, or the Aether canon is large.

-----

## How this skill composes with others

|Concern|Owner skill|What this skill adds|
|---|---|---|
|Anti-AI-slop, font/color taste|`frontend-design` (Anthropic)|Defer for taste; this skill *names* the chosen typefaces (Newsreader+Inter Tight+JetBrains Mono) so they aren't relitigated.|
|WCAG, ARIA, semantic HTML, contrast|`web-interface-guidelines` (Vercel)|Defer fully.|
|Token drift, naming audit, deprecation|`design-system-ops`|Where Gauntlet's tokens live, what tier they belong to, what `--gx-*` means.|
|shadcn/ui block selection|`Shadcnblocks-Skill` (optional)|Permission to use blocks only inside `control-center/`, never inside the Composer surface.|
|Where code lives, what may not grow, parity rules, visual canon|**this skill**|Everything below.|

Conflict resolution: if `frontend-design` says "no Inter" but this skill names Inter Tight as part of the Aether v4 canon, **this skill wins** within the Gauntlet repo — the typeface choice is deliberate (Inter Tight combined with Newsreader and JetBrains Mono escapes the SaaS-template feel that the upstream rule guards against). Surface the conflict to the user once; do not relitigate it on every PR.

-----

## Product law

There are exactly three pillars. Every UI decision must survive all three.

### 1. Cursor-edge philosophy

The product lives at the tip of the cursor. The user points at something, says what they want, the system executes where the user already is. Any change that pulls the user out of their flow — a large window, an extra click, a context that lives elsewhere — is a regression. Test every change with this lens: does this approach the `point → ask → execute` arc, or does it move away from it?

### 2. Composer is the work surface; Control Center is the garage

The Composer (`packages/composer/`) is dense, complete, IDE-grade — the place the user spends most of their time. Density at the product level is a virtue. **Density at the code level is not.** Every new feature lives in its own sub-component or hook. The package today contains 60+ files: Capsule.tsx (orchestrator) + Pill.tsx (shared, browser-mounted) + ~20 panel/component files (CommandPalette, SettingsDrawer, PlanRenderer, ShellPanel, AnswerPanel, LeftPanel, ComputerUseGate, AttachmentChips, EmptyState, SlashMenu, ShortcutBar, ThemeToggle, StreamingState, …) + ~12 hooks. Capsule.tsx orchestrates and mounts; it never absorbs the implementation of a feature.

The Control Center (`control-center/`) is the garagem. It exists for configuration, history, model selection, memory inspection, governance. It must never compete with the Composer as a place the user works.

### 3. Multimodel via gateway only (frontend lens)

The frontend never imports a provider SDK. No `@anthropic-ai/sdk`, no `@google/generative-ai`, no `groq-sdk`, no `openai` anywhere in `packages/composer/`, `apps/`, or `control-center/`. The shared composer talks to the backend through `composer-client.ts`; the backend (`backend/model_gateway.py` + designated clients) handles all provider calls. If you find a frontend file importing a provider SDK, reject the change.

(Backend-side rules for who imports providers there live in `gauntlet-backend-spine`.)

-----

## Aether v4 — the visual canon

This is the visual identity Ivan has confirmed as the look-and-feel for the cápsula. The full spec is at **`/docs/canon/AETHER_V4.md`** (authoritative). The CSS tokens live in **`packages/composer/src/aether-v4.css`**. When in conflict with this skill, the spec wins.

v4 is a synthesis: phase grammar + motion + token discipline preserved verbatim from Aether v2 spec; palette + typography + accent system from the Gauntlet v3 mockup; v1's ember soul preserved as terracotta callback in the `executed` state only. See `AETHER_V4.md` §1 (Lineage) for the full kill-list and origin map.

### Surfaces — paper, not white, not slate

```
--gx-bg           #f6f4ef   (page background, warm paper)
--gx-bg-sunken    #efece4   (left-panel context background, paper-2)
--gx-bg-surface   #fbfaf6   (capsule surface, card)
--gx-bg-elevated  #fefdfa   (chips, drawers, elevated panels)
--gx-bg-input     #f6f4ef   (input fields)
--gx-bg-terminal  #14130f   (graphite, ledger background only)
```

Default is light paper. Pure white is reserved for the elevated tier — never the page or capsule background. There is also a `[data-gx-theme="graphite"]` opt-in dark mode with mirrored tokens.

### Ink

```
--gx-text       #1c1a16   (primary)
--gx-text-2     #2a261f   (secondary)
--gx-text-muted #6b6358   (metadata, kicker labels)
--gx-text-ghost #9b9285   (placeholder, idle)
```

### Multi-slot accent system — cyan primary, terracotta warmth

v4 replaces v1's single-ember rule with a semantic multi-slot system. Components never pick an accent — they reference the slot.

```
--gx-accent        #0EA5C7   (cyan · brand · focus · primary actions · links)
--gx-accent-hover  #0c93b3
--gx-accent-glow   color-mix(in srgb, #0EA5C7 32%, transparent)

--gx-accent-ok     #5d8c5a   (moss · success states)
--gx-accent-warn   #c98c42   (amber · warnings)
--gx-accent-danger #b85a5a   (red · errors + danger_gate)
--gx-accent-warm   #c96442   (terracotta · gx-state-executed ONLY · v1 ember soul)
--gx-accent-mark   #b85a9b   (magenta · phase highlights, attention)
```

**One brand accent (cyan). Other slots are semantic.** Color in chrome is regression — color belongs in *data* and in *phase*. The terracotta `--gx-accent-warm` is reserved exclusively for `gx-state-executed` warmth — using it elsewhere reintroduces the v1 "everything-is-ember" antipattern.

Sensitive actions get their own treatment via `gx-state-danger` (see Phase grammar).

### Type — three families, seven sizes

```
--gx-font-serif  "Newsreader", Source Serif Pro, Georgia, serif    ← display, h1, italic accents
--gx-font-sans   "Inter Tight", Inter, system-ui, sans-serif        ← body, controls, input
--gx-font-mono   "JetBrains Mono", IBM Plex Mono, ui-monospace      ← labels, meta, code, kbd hints

display 36px / 1.05 / 500 / -0.01em (serif)   "Tune the capsule." landing
h1      26px / 1.1  / 500             (serif)   page title, italic accent allowed
h2      22px / 1.2  / 600             (sans)    section head
h3      18px / 1.3  / 600             (sans)    subsection
h4      16px / 1.4  / 500             (sans)    card title
body    14px / 1.5  / 400             (sans)    body copy
meta    11px / 1.4  / 500 / 0.08em    (mono)    eyebrow, label, telemetry (uppercase, tracked)
code    12px / 1.4  / 400             (mono)    inline code, kbd
```

Italic serif accent pattern: `<em class="gx-display-it">word.</em>` inside a sans h2/h3 produces the signature "Tune the *capsule.*" register. Reserve for page titles, section heads, key moments. **Never inside controls, labels, or body paragraphs** — italic serif there breaks IDE-grade legibility.

Inter Tight is named here despite the upstream `frontend-design` ban because Inter Tight combined with Newsreader (display) and JetBrains Mono (mono) escapes the generic SaaS feel the upstream rule guards against. Do not substitute Inter Tight with Roboto / Space Grotesk / Poppins. Do not substitute Newsreader with Playfair / Lora / IBM Plex Serif / Fraunces (Fraunces was v1; v4 switched).

### Motion — five durations, three easings

```
--gx-dur-fast       120ms    (hover, focus, micro-interactions, chip-pop)
--gx-dur-base       240ms    (rise, fade, stagger-in)
--gx-dur-rise       360ms    (capsule entry, flash-rise success)
--gx-dur-shimmer    1400ms   (streaming skeleton, progress walk)
--gx-dur-pulse      2400ms   (pill_idle breath)
--gx-dur-pulse-slow 4000ms   (pill_offline slow breath)

--gx-ease-spring   cubic-bezier(0.34, 1.56, 0.64, 1)
--gx-ease-out      cubic-bezier(0.16, 1, 0.3, 1)
--gx-ease-linear   linear
```

Named keyframes from the canon (defined in `aether-v4.css`):

```
gauntlet-cap-pulse              pill_idle, pill_offline breath
gauntlet-cap-chip-pop           pill_active
gauntlet-cap-rise               capsule idle entry
gauntlet-cap-phase-heartbeat    planning breathing dot
gauntlet-cap-shimmer            streaming skeleton
gauntlet-cap-stagger-in         plan_ready item entry
gauntlet-cap-phase-morph        danger_gate transition
gauntlet-cap-progress-walk      executing progress
gauntlet-cap-flash-rise         executed success
```

`@media (prefers-reduced-motion: reduce)` collapses every motion to 80ms opacity fade — already in `aether-v4.css`; do not bypass.

### Phase grammar — 8 states

The cápsula state machine is canonical:

```
idle → planning → streaming → plan_ready
                                  ↓ (sensitive action)
                              danger_gate
                                  ↓ (operator approves)
                                executing → executed
                                  ↓ (rejected)
                                plan_ready

         any state ───→ error
```

v4 splits `danger_gate` from `error` — they are semantically different. `danger_gate` is the consent gate **before** sensitive execution (red-tinted block, friction, `Confirmo, executar mesmo assim` checkbox). `error` is post-failure (red border, retry CTA, no theatrics).

The Pill carries its **own** micro-states (`pill_idle / pill_active / pill_offline`) that sit *outside* the Capsule machine — the Pill is always-on chrome, the Capsule is the on-demand surface. Don't conflate them.

Every state must have a visible representation in the cápsula. Silent transitions are regressions. Each state has a base class `gx-state-{phase}` defined in `aether-v4.css` — components apply the class on the root, never decide visual treatment internally.

**v4 nuance — `gx-state-executed` is warm, not green.** Success borders + badge use `--gx-accent-warm` (terracotta). This is the only place v1's ember soul survives. Do not change it to `--gx-accent-ok` (moss) without an ADR.

### Canonical labels (write these)

```
Enviar · Resposta · Plano · Executar · Executar com cuidado ·
Executado · Anexar · Ecrã · Voz · Copy · Save · Re-read · Erro
```

### Banned labels (never write these)

```
~~Compor~~  ~~Acionar~~  ~~Submit~~  ~~Run~~
~~Magic~~  ~~Assistant~~  ~~Preview~~ (use RESPOSTA)
```

The voice ban-list is enforced by `scripts/check-voice.mjs` in CI (`npm run check:voice`). Don't reintroduce banned words anywhere — including comments, error messages, accessibility labels, button text, or analytics events.

-----

## Architectural truth

```
packages/composer/src/        ← the single shared Composer (60+ files)
  Capsule.tsx                 ← orchestrator only (budget: 778 lines, descending)
  Pill.tsx                    ← cursor-magnetic resting state (browser-mounted)
  composer-client.ts          ← transport layer (ComposerClient class + composeOnce helper)
  ambient.ts                  ← capability + adapter contract per shell
  pill-prefs.ts               ← createPillPrefs(store) factory
  voice.ts · markdown.tsx · dom-actions.ts · types.ts · helpers.ts
  CommandPalette.tsx · SettingsDrawer.tsx · PlanRenderer.tsx
  ShellPanel.tsx · AnswerPanel.tsx · LeftPanel.tsx
  ComputerUseGate.tsx · AttachmentChips.tsx · EmptyState.tsx
  SlashMenu.tsx · ShortcutBar.tsx · ThemeToggle.tsx · StreamingState.tsx
  Onboarding.tsx · CompactContextSummary.tsx
  useTTS.ts · useVoiceCapture.ts · useStreamingPlan.ts · useAttachments.ts
  useCapsuleKeyboard.ts · useCapsuleScreenshot.ts · useToolManifests.ts
  useSaveToMemory.ts · usePlanGuards.ts · usePhaseBroadcast.ts
  plan-dispatcher.ts · placement.ts
  aether-v4.css               ← v4 canon tokens + phase grammar + keyframes
  capsule.css.ts              ← stylesheet (consumes aether-v4.css tokens)
  *.test.ts · *.test.tsx      ← co-located tests for each unit

apps/browser-extension/       ← web shell
  components/App.tsx          ← mounts shared <Capsule> + shared <Pill>
  lib/ambient.ts              ← createBrowserAmbient (chrome.* adapters)
  entrypoints/content.tsx     ← shadow DOM injection per page

apps/desktop/                 ← Tauri shell
  src/App.tsx                 ← mounts shared <Capsule> (cápsula window)
  src/PillApp.tsx             ← custom desktop pill (intentionally divergent — see below)
  src/ambient.ts              ← createDesktopAmbient (Tauri adapters)
  src-tauri/                  ← Rust binary (see gauntlet-tauri-shell)

control-center/               ← garage / operator console
  pages/                      ← Overview, Settings, Models, Permissions, Memory, Ledger, Composer, Governance
  components/atoms/           ← generic atoms (Pill.tsx here is a UI atom — NOT the cápsula Pill)
  design/                     ← typed token graph
  styles/tokens.css           ← canonical CSS tokens
  i18n/copy.ts                ← PT/EN catalogue
  spine/, hooks/, lib/, tools/, trust/, tweaks/
```

**Disambiguation note**: `control-center/components/atoms/Pill.tsx` is a generic UI atom (badge / tag / status dot). It is **not** the cápsula's Pill component, which lives only at `packages/composer/src/Pill.tsx`. Don't classify the atom as a duplication violation.

-----

## The Capsule is shared. The Pill is intentionally divergent.

This is the most important nuance in the skill, because it gets misread easily.

### Capsule — single source of truth, both shells

Both shells mount the **same** `<Capsule>` from `@gauntlet/composer`:

- Browser: `apps/browser-extension/components/App.tsx` imports `Capsule` and passes `createBrowserAmbient()`.
- Desktop: `apps/desktop/src/App.tsx` imports `Capsule` and passes `createDesktopAmbient()`.

Capsule duplication anywhere outside `packages/composer/src/` is a regression. Reject any change that re-implements the cápsula in a shell.

### Pill — shared in browser, custom in desktop, by design

The browser shell mounts the shared `<Pill>` from `@gauntlet/composer`, which owns:

- Viewport-magnetism (drift toward cursor on hover proximity)
- Drag-from-pill repositioning (saved per-domain in chrome.storage)
- Per-domain dismiss (right-click → `chrome.storage` flag)
- `mode: 'corner' | 'cursor'` (cursor mode hides the OS pointer and uses the pill as the visual cursor)
- Phase mirror (listens to `gauntlet:phase` CustomEvent broadcast from Capsule)
- Idle fade after 30s of no pointer movement

The desktop shell does **not** use the shared `<Pill>`. It has its own `apps/desktop/src/PillApp.tsx`, with this comment in the file:

> *"We intentionally do NOT reuse the shared `<Pill />` from `@gauntlet/composer` here: that component owns viewport-magnetism, drag, and per-domain dismiss, all of which are page-DOM concepts. On desktop the WINDOW is the pill; the OS handles drag (via `data-tauri-drag-region`) and there is no domain to dismiss against."*

This divergence is correct. The desktop pill window (220×56 transparent always-on-top window, see `gauntlet-tauri-shell`) is itself the magnetic surface — the OS positions it, the OS handles drag, there is no per-domain concept. Re-binding to the shared `<Pill>` would force an abstraction that does not match the runtime.

**Rule**: when adding behavior to the Pill, ask first *which abstraction owns it*:

- Page-DOM behavior (selection awareness, host-page event listening, per-domain state) → shared `<Pill>` only. Desktop does not get it.
- Resting-state visual identity (cyan pulse, halo, label) → shared identity, both pills should look the same. If the desktop pill's visual drifts from the browser pill's, that **is** regression. The container differs; the visual identity does not.
- Window-level concern (resize, position, always-on-top, tray integration) → desktop only via Tauri commands. Browser does not get it.

If a new behavior crosses categories, it probably needs to live in two places — once in the shared Pill for browser, once in PillApp.tsx for desktop, with the *visual* part extracted to a shared sub-component if possible.

-----

## Dual-shell parity (Capsule)

The browser cápsula and the desktop cápsula are the **same product object** running in different environments. Visual or behavioral divergence in the **Capsule** between the two shells is a regression.

Allowed differences are environmental only — surfaced via the capabilities matrix (also documented in `docs/canon/COMPOSER_SURFACE_SPEC.md`):

|Capability|Browser|Desktop|Why|
|---|---|---|---|
|`domExecution`|✅|❌|DOM only exists in pages|
|`screenshot`|✅|✅|tab-capture · capture_screen|
|`screenCapture`|✅|✅|same shape `{base64, path}`|
|`filesystemRead`|✅|✅|File API · Tauri filesystem|
|`filesystemWrite`|❌|✅|desktop only (security)|
|`voice`|✅|✅|Web Speech API|
|`remoteVoice`|✅|✅|backend `/voice/transcribe`|
|`streaming`|✅|✅|SSE · ReadableStream|
|`shellExecute`|❌|✅|desktop only · allowlist|
|`notifications`|❌|✅|tauri-plugin-notification|

Where a capability is missing, the corresponding button **does not appear**. The action row stays visually identical (`ANEXAR · ECRÃ · VOZ · ENVIAR`); SHELL is reachable only via `/shell` slash command on desktop, never as a button.

Tactical rule: if you are about to write `if (Platform.isDesktop)` inside a Capsule sub-component in `packages/composer/src/`, stop. That branch belongs in the shell's `ambient.ts` adapter, surfaced to the Composer as `ambient.capabilities.*`.

-----

## The Capsule Law

`packages/composer/src/Capsule.tsx` has a **line-count budget that descends, never grows**. The current budget on main is `778 lines`, enforced by `.github/workflows/ci.yml` (job `frontend`, step `capsule size budget`). CI fails if the file grows past the budget.

Before any PR that touches `Capsule.tsx`:

1. Measure: `wc -l packages/composer/src/Capsule.tsx`.
2. If your change grows it, first extract a sub-component or hook that compensates the gain — or justify in the PR body why extraction is impossible.
3. If your change shrinks it, **lower `BUDGET` in `ci.yml`** to the new high-water-mark in the same PR. The ratchet is one-way down.

Extraction patterns (already practiced in this repo):

- Stateful sub-feature → its own component file (`SettingsDrawer.tsx`, `ComputerUseGate.tsx`).
- Cross-cutting concern with no UI → a hook (`useVoiceCapture.ts`, `useStreamingPlan.ts`).
- Pure formatter / parser → a utility (`markdown.tsx`, `dom-actions.ts`, `placement.ts`).
- Ambient-shaped capability that differs per shell → goes through `ambient.capabilities.*`, never branched inside the Capsule.

If you cannot place a new piece into one of those four shapes, the design is wrong — not the budget.

-----

## Canonical naming

`GAUNTLET_*` is canonical. `SIGNAL_*` and `RUBERRA_*` are aliases — read as silent fallback for migration only, removed in v1.1.0. New code writes `GAUNTLET_*` always.

|Surface|Canonical|Legacy (read-only fallback)|
|---|---|---|
|Env vars|`GAUNTLET_*`, `VITE_GAUNTLET_*`|`SIGNAL_*`, `RUBERRA_*`, `VITE_BACKEND_URL`|
|API routes|`/api/gauntlet/*`|`/api/signal/*`, `/api/ruberra/*`|
|Storage keys|`gauntlet:*`|`signal:*`, `ruberra:*`|
|CustomEvents|`gauntlet:phase`, `gauntlet:pill-mode`, `gauntlet:execute-result`|(none — these are new)|
|CSS class prefix|`gauntlet-*` (in `capsule.css.ts`), `gx-state-*` (in `aether-v4.css`)|(legacy `gx-*` from earlier Aether exports)|
|CSS token prefix|`--gx-*` (Aether v4)|(this is the canonical token vocabulary)|

When a write happens to a legacy storage key during migration, also delete the old key. Do not leave both. Reading both keeps backward compatibility; writing both creates split truth.

-----

## Design tokens

The canonical token surface is:

- **`packages/composer/src/aether-v4.css`** — v4 CSS custom properties, the **canonical source of truth** for the cápsula.
- `control-center/styles/tokens.css` — Control Center mirror; should reference the same `--gx-*` names.
- `control-center/design/` — typed token graph (TypeScript), the type-checked authority that components import.
- `docs/DESIGN_TOKENS.md` — written reference. Update when tokens change.
- **`docs/canon/AETHER_V4.md`** — the visual spec; tokens listed there are canonical.

Rules:

1. Every visual constant in a shared-composer component (color, spacing, radius, shadow, font size, z-index, motion duration) reads from a token. No hard-coded hex, no hard-coded `rem`, no hard-coded `cubic-bezier`.
2. New tokens are added to the typed token graph first, then surfaced in `aether-v4.css`. Never the other way around.
3. When you find a hard-coded value in a shared-composer component, the closure rule is: extract it to a token if used twice; document why if used once and unique.
4. Token drift between shells (the same semantic role bound to different values in browser vs desktop) is forbidden. Run `design-system-ops` token-audit before declaring closure on any token-touching change.
5. **Control Center pages have a softer rule** — they are the operator garage, density there is acceptable. Hard-coded `gap: 8` / `padding: 12` in a Control Center page is a LOW-severity cleanup item, not a doctrine violation. The shared composer is held to the strict rule.

-----

## Composer flow surfaces

The Composer pipeline is canonical:

```
context → intent → preview → apply
```

Each stage maps to one HTTP endpoint and to one visual state in the cápsula:

|Stage|Endpoint|Cápsula state|
|---|---|---|
|1. Capture authorized context (selection + URL)|`POST /composer/context`|input becomes active, context chip appears|
|2. Classify + route to model|`POST /composer/intent`|`planning` — model badge appears, route committed|
|3. Generate artifact (no side effects)|`POST /composer/preview`|`streaming` → `plan_ready` — preview renders|
|4. Apply or reject + record run|`POST /composer/apply`|`executing` → `executed` (terracotta) — Copy/Apply succeeds, run appended|

Each cycle writes two lines to `runs.json`: one with `route="composer"` (envelope), one with `route="agent"` or `route="triad"` (internal call). They correlate via `composer:intent_id`.

Preview / Result has four canonical layouts (per `docs/canon/COMPOSER_SURFACE_SPEC.md`):

- **A. Resposta texto** — header `RESPOSTA · model · Nms`, content, `[Copy] [Save] [Guardar como…]`.
- **B. Plano de DOM actions** — header `PLANO · N actions · model · Nms`, numbered steps, `[Executar] [Executar com cuidado]`. Sensitive steps tagged `[SENSÍVEL]`.
- **C. Acção sensível (danger_gate)** — danger-tinted card, ⚠️ ACÇÕES SENSÍVEIS NO PLANO, list, checkbox "Confirmo, executar mesmo assim", `[Executar com cuidado]`. Surfaces via `gx-state-danger`.
- **D. Resultado de execução (executed)** — header `RESULTADO · N ok · N falhou`, color-coded lines (✓ terracotta / ✕ red / · gray for skipped). Surfaces via `gx-state-executed`.

UI-side rules:

- A preview with side effects is a contract violation. Stage 3 is read-only.
- The cápsula must surface every stage transition visibly — no silent state changes.
- Errors at any stage produce an explicit `gx-state-error` in the cápsula. Empty / loading / error states are product surface, not afterthought. See `docs/EMPTY_STATES.md` for canonical patterns.

-----

## Anti-slop discipline (Gauntlet-specific)

Defer to `frontend-design` for the general anti-slop laws. On top of that, this product specifically rejects:

- **Decorative motion in the cápsula.** Motion exists only when it carries information (state transition, focus shift, attention anchor). A spring on hover for vibe is regression. See `docs/MOTION.md` for the motion contract.
- **Round-corner everything.** Radii follow the Aether v4 scale (`sm 6 · base 10 · lg 16 · pill 999`). The cápsula uses `base 10`; sub-surfaces step down to `sm 6`; drawers go up to `lg 16`. They do not all share the same value.
- **Toast pile-ups.** Notifications belong in the ledger / runs surface, not in floating stacks. The cápsula's job is to do the work, not to announce it.
- **Settings sprawl in the Composer.** Toggles, knobs, model selectors, permission switches — those belong in the Control Center. The Composer hosts only the controls the user needs *during* the work.
- **Banned voice words.** `npm run check:voice` is the gate. The voice contract is in `docs/VOICE.md`.
- **Multiple brand colors.** One cyan as brand. Other accents are semantic slots only — `--gx-accent-ok`, `--gx-accent-warn`, `--gx-accent-danger`, `--gx-accent-mark`. Terracotta `--gx-accent-warm` is reserved for `gx-state-executed`. Reintroducing a second brand color is regression.
- **Italic serif in body / controls.** Newsreader italic is for display + accent only. Italic serif label or italic serif body text breaks IDE-grade legibility — reject.

-----

## Closure check

A UI change is **not closed** until all of these are true. Verify each before saying `missão concluída`.

1. **Builder landed.** `npm run typecheck`, `npm run build`, `npx tsc --noEmit` from `apps/desktop/` (the strict desktop typecheck), and the relevant shell's dev server start without error.
2. **Verifier checked.** Run `web-interface-guidelines` review on the changed files. Surface any HIGH or CRITICAL findings to the user before claiming closure.
3. **Capsule budget honored.** If `Capsule.tsx` was touched, `wc -l` shows it stayed at or below the current `BUDGET` in `ci.yml`. If it shrank, the PR also lowers `BUDGET` to match.
4. **Dual-shell Capsule parity.** The change was tested or reasoned through in *both* shells. If only one was tested, say so explicitly.
5. **Pill divergence respected.** If the change touches Pill behavior, you decided correctly: page-DOM behavior → shared `<Pill>` only; visual identity → both must match; window-level concern → desktop only.
6. **Tokens, not constants** (in shared composer). No hard-coded visual values were introduced inside `packages/composer/src/`. Hex / rem / px / cubic-bezier values come from tokens.
7. **Aether v4 canon honored.** No new fonts (other than Newsreader / Inter Tight / JetBrains Mono). No new brand colors (only cyan + semantic ok/warn/danger/warm/mark). Type sizes use the 7-step scale. Motion uses the 5 named durations + 3 easings. Phase grammar uses 8 canonical states.
8. **Frontend gateway integrity.** No new direct provider imports in frontend. `grep -rE "@anthropic-ai/sdk|@google/generative-ai|groq-sdk|openai" packages/ apps/ control-center/` returns nothing new.
9. **Voice ban-list.** `npm run check:voice` passes. No banned word reintroduced anywhere — code, copy, comments, error messages.
10. **Canonical labels.** New user-facing strings use the canonical label set. No "Submit", "Run", "Magic", "Assistant", "Preview" reintroduced.
11. **Phase grammar.** New cápsula behaviors surface a visible state for every transition. No silent state change.
12. **Co-located tests updated.** If a behavior changed, the matching `*.test.ts` / `*.test.tsx` reflects it.
13. **Legacy surface untouched.** No new code wrote to `signal:*`, `ruberra:*`, `SIGNAL_*`, `RUBERRA_*`, or `/api/signal/*`, `/api/ruberra/*`.
14. **Owned residue closed.** No `// TODO`, `// FIXME`, or commented-out experimental code left behind in changed files.

If any check fails or was not run, the correct response is `não tenho evidência suficiente` — not `missão concluída`. False closure is a real failure under the Ruberra truth law.

-----

## Anti-patterns (reject on sight)

|Anti-pattern|Why it's wrong|Correct shape|
|---|---|---|
|New feature implemented inline in `Capsule.tsx`|Violates Capsule Law; god-component|Sub-component or hook in `packages/composer/src/`|
|`if (Platform.isDesktop)` inside the shared Composer|Breaks dual-shell parity; leaks shell concerns|Capability surfaced via `ambient.capabilities.*`|
|Re-implemented `Capsule` in `apps/desktop/src/`|Breaks single-source-of-truth|Mount the shared `<Capsule>` via the shell's Ambient|
|Re-implemented `<Pill>` in browser shell|Breaks single-source-of-truth|Mount the shared `<Pill>` from `@gauntlet/composer`|
|`import Pill from '@gauntlet/composer'` in `apps/desktop/src/PillApp.tsx`|Forces page-DOM abstraction onto an OS window|Keep the custom `PillApp.tsx`; divergence is intentional and documented|
|Desktop pill visual drifts from browser pill (different color, different size, different breath)|Visual identity must match across shells|Identity is shared (paper + cyan + breath); only behavior diverges|
|`import { Anthropic }` in any frontend file|Frontend gateway integrity broken|Use `composer-client.ts`; backend handles providers|
|`style={{ color: "#7c3aed" }}` in a shared-composer component|Breaks tokens; introduces non-Aether color|Token reference (`var(--gx-accent)` or appropriate semantic slot)|
|Settings toggle added to the Capsule|Composer surface bloat|Add to Control Center page; expose state via shared store|
|Toast notifying every run|Composer is for doing, not announcing|Append to `runs.json`; surface in Memory chamber|
|Hover spring "for polish"|Decorative motion, not informational|Remove. Motion only on state change.|
|Writing to both `signal:*` and `gauntlet:*` on save|Creates split truth|Read both for migration; write only `gauntlet:*`|
|Banned voice words re-introduced|Voice contract broken|`npm run check:voice` is the gate; rewrite per `docs/VOICE.md`|
|New typeface added (Roboto, Space Grotesk, Lora, Fraunces, etc.)|Aether v4 canon broken|Use Newsreader / Inter Tight / JetBrains Mono only|
|Second brand color introduced|Aether v4 canon broken|One cyan. Use semantic slots for state.|
|Terracotta `--gx-accent-warm` used outside `gx-state-executed`|Breaks the v1-ember-soul preservation rule|Restrict to executed-success surface only|
|Italic serif inside body / control / label|Breaks IDE-grade legibility|Italic serif is for display + accent only|
|Hard-coded `font-size: 14px` in a Capsule sub-component|Bypasses the 7-step type scale|Use one of `--gx-text-{display,h1,h2,h3,h4,body,meta,code}-size`|
|Custom motion duration (e.g. `transition: 250ms`)|Bypasses the 5-step motion grammar|Use `var(--gx-dur-{fast,base,rise,shimmer,pulse})`|
|Silent phase transition in the cápsula|Phase grammar violated|Every state change has a visible representation|

-----

## Example invocations (how a user might trigger this skill)

These should reliably load this skill:

- "Add a model selector dropdown to the Composer."
- "The cápsula looks different on Tauri than on the browser extension — fix it."
- "Refactor `Capsule.tsx` — it's getting close to budget."
- "Wire a new sub-feature: a /commands palette inside the Composer."
- "Audit my tokens.css for drift."
- "Add a Permissions page to the Control Center."
- "Polish the Memory ledger view."
- "Build the empty state for the runs list."
- "Why is the desktop pill different from the browser pill?"
- "Match the cápsula to the Aether v4 spec."
- "Add a new motion duration for a hover effect."

For any of these, the skill's job is to: (a) place the work in the right file, (b) keep dual-shell Capsule parity, (c) honor the documented Pill divergence, (d) honor the Aether v4 canon (paper + cyan + 3 fonts + 7 sizes + 5 motion durations + 8 phase states + terracotta-on-executed warmth), (e) honor the Capsule budget, (f) defer taste to `frontend-design`, (g) verify against `web-interface-guidelines` before closure.

-----

## Reference

- Project doutrina: `/CLAUDE.md` at repo root.
- **Aether v4 spec (authoritative)**: `/docs/canon/AETHER_V4.md`.
- **Aether v4 tokens (canonical CSS)**: `/packages/composer/src/aether-v4.css`.
- Composer surface spec: `/docs/canon/COMPOSER_SURFACE_SPEC.md`.
- Public README: `/README.md` at repo root.
- Operations: `/docs/OPERATIONS.md`.
- Composer V0 reference: `/docs/COMPOSER_V0.md`.
- Component hierarchy: `/docs/COMPONENT_HIERARCHY.md`.
- Design tokens: `/docs/DESIGN_TOKENS.md`.
- Empty states: `/docs/EMPTY_STATES.md`.
- Motion contract: `/docs/MOTION.md`.
- Voice contract: `/docs/VOICE.md`.
- Information architecture: `/docs/INFORMATION_ARCHITECTURE.md`.
- Keyboard contract: `/docs/KEYBOARD.md`.
- Responsive: `/docs/RESPONSIVE.md`.
- A11Y audit: `/docs/A11Y_AUDIT.md`.
- Aether v2 spec (archived, ancestor): `/docs/explorations/AETHER_V2_SPEC.md`.
- Gauntlet v3 mockup (archived, ancestor): `/docs/explorations/aether-v3-mockup.md`.
- Composer source: `packages/composer/src/`.
- CI budget gate + voice lint: `.github/workflows/ci.yml`.

If something in this skill conflicts with `/CLAUDE.md` or `/docs/canon/AETHER_V4.md`, those win — they are closer to the canonical doutrina. Surface the conflict to the user so the skill can be updated.
