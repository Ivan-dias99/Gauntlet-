> # ARCHIVED · ANCESTOR · NOT CANON
>
> This document is the **Aether v2 spec**, archived. It is preserved as the direct ancestor of Aether v4 — it is the source of v4's phase grammar, motion choreography, and token discipline.
>
> **Active canon:** `/docs/canon/AETHER_V4.md`
> **Active CSS tokens:** `/packages/composer/src/aether-v4.css`
>
> Do not migrate code from this document. Everything in it that survived into canon is reflected in `AETHER_V4.md` §1 (Lineage). Everything not reflected there was deliberately killed during the v4 synthesis — see §1.2 of v4 for the kill-list and reasons.
>
> Reasons to consult this archive:
>
> - **Understanding why a phase exists.** v2 defined the original 8-state grammar; v4 inherits it verbatim. The reasoning for `danger_gate` as a separate state from `error` is here.
> - **Understanding why we have a motion vocabulary instead of ad-hoc `transition` calls.** v2 §5.10 is the original argument for nominated keyframes; v4 inherits the rule and its keyframe set.
> - **Reading the original v1 → v2 migration table.** v4's §8 (Migration from v1 shipped) follows the same pattern; cross-reference here for the v2-era rationale.
>
> Reasons **not** to consult this archive:
>
> - **Picking colors, accents, or fonts.** v2's palette (slate + Terminal Green) was rejected during the v4 synthesis. Use `AETHER_V4.md` §4 instead.
> - **Defining new visual states.** New phases pass through Ivan as Sovereign Architect via PR against `AETHER_V4.md`. This archive is read-only.
> - **Implementing components.** This document predates the v3 mockup; it does not reflect the typography or accent system v4 actually uses.
>
> Archived: 2026-05-13
> Archived by: Claude Code session (branch `claude/archive-aether-v2-spec-0U4W0`)
> Move command applied: `git mv docs/design-system/AETHER.md docs/explorations/AETHER_V2_SPEC.md`
>
> ---

[Original AETHER.md content begins below]

# Aether — Gauntlet Composer Design System

**Status:** operational. Wave 1 + Wave 2 + Aether v2 port shipped on
branch `claude/complete-design-system-SooZS` (PRs #366, #367).
**Source of truth (canon):** `packages/composer/src/`. Two shells
(`apps/browser-extension/`, `apps/desktop/`) consume the same
Composer; visual or behavioural divergence between them is regression.

> The Composer is not a page. It is the cursor-adjacent command
> surface — Pill at the cursor, Capsule on demand. Plan, then execute.

---

## 1. Vision

The Composer is the **centre of experience**: dense, complete and
sophisticated when open, discreet to the point of disappearance when
closed. The operator points, says what they want, the system runs it
where they already are.

Three lenses guard every change:

1. **Cursor-edge philosophy.** Does the change shrink the
   `point → ask → execute` loop, or does it stretch it? Big windows,
   extra clicks and out-of-cursor context are red flags.
2. **Dense composer, fat backend.** All connectors, plugins, tools,
   commands and skills live inside the Composer at the cursor; LLM
   routing, memory and security live in the FastAPI backend. The
   composer is the IDE-grade interface that exposes the backend's
   power — never a god-component, always sub-components per feature.
3. **Multimodel via gateway.** Every LLM call goes through
   `model_gateway`. The frontend never calls Anthropic / Gemini /
   OpenAI directly.

---

## 2. Visual language

Light is canon (`data-theme="light"`, the default). Dark is an
operator preference, not a separate brand.

| Aspect      | Choice                                                                |
|-------------|-----------------------------------------------------------------------|
| Surface     | Cream paper (`#f7f3e8`), not pure white. Glass on top.                |
| Brand       | Single ember accent (`#d07a5a`). Colour lives in data, never chrome. |
| Type        | Inter sans (body), JetBrains mono (meta + kbd), system serif (brand). |
| Voice       | PT-PT operator labels: `Resposta · Plano · Executar com cuidado`.    |
| Motion      | Subtle. Curves over rampage; reduced-motion always honoured.         |
| Density     | Premium daylight, not noir. Quiet by default, expressive on action.  |

Banned: ~~Compor~~, ~~Submit~~, ~~Run~~, ~~Magic~~, ~~Assistant~~,
~~Preview~~. Enforced by `npm run check:voice` in CI.

---

## 3. Tokens (`--gx-*`)

All tokens are scoped under `.gauntlet-capsule`; nothing leaks to
`:root`. Theme switch via `data-theme="dark"` on the capsule root.
Components consume tokens — never hard-code colours, radii,
durations or shadows.

### 3.1 Surface

| Token                | Light                       | Dark                          |
|----------------------|------------------------------|--------------------------------|
| `--gx-bg`            | `#f7f3e8`                    | `rgba(14, 16, 22, 0.92)`       |
| `--gx-bg-solid`      | `#fbf7ee`                    | `#0e1016`                      |
| `--gx-surface`       | `rgba(255,255,255,0.78)`     | `rgba(28,30,38,0.70)`          |
| `--gx-surface-strong`| `#ffffff`                    | `#1a1d26`                      |
| `--gx-sunken`        | `rgba(15,17,22,0.04)`        | `rgba(8,9,13,0.55)`            |
| `--gx-bg-input`      | `#fbf7ef`                    | `rgba(8,9,13,0.55)`            |

Aliases (Aether v2 port, map to canon): `--gx-bg-sunken` →
`--gx-sunken`, `--gx-bg-surface` → `--gx-surface`, `--gx-bg-elevated`
→ `--gx-surface-strong`.

### 3.2 Ink

| Token             | Light       | Dark        |
|-------------------|-------------|-------------|
| `--gx-fg`         | `#1a1d24`   | `#f0f2f7`   |
| `--gx-fg-dim`     | `#4a4f5b`   | `#aab0bd`   |
| `--gx-fg-muted`   | `#646874`   | `#8b91a0`   |

Aliases: `--gx-text` → `--gx-fg`, `--gx-text-2` → `--gx-fg-dim`,
`--gx-text-muted` → `--gx-fg-muted`.

WCAG AA verified: `--gx-fg-muted` light = 4.85:1 on `--gx-bg`; dark
= 5.98:1. `--gx-fg-dim` clears AAA in both themes.

### 3.3 Border

| Token                | Light                  | Dark                   |
|----------------------|-------------------------|------------------------|
| `--gx-border`        | `rgba(15,17,22,0.08)`   | `rgba(255,255,255,0.08)` |
| `--gx-border-mid`    | `rgba(15,17,22,0.16)`   | `rgba(255,255,255,0.14)` |
| `--gx-border-strong` | `rgba(15,17,22,0.22)`   | `rgba(255,255,255,0.22)` |

Alias: `--gx-border-soft` → `--gx-border`.

### 3.4 Brand

| Token                | Light                                    | Dark        |
|----------------------|-------------------------------------------|-------------|
| `--gx-ember`         | `#d07a5a`                                  | (inherits)  |
| `--gx-ember-2`       | `#b8542a`                                  | (inherits)  |
| `--gx-peach`         | `#f4c4ad`                                  | (inherits)  |
| `--gx-ember-soft`    | `rgba(208, 122, 90, 0.14)`                 | (inherits)  |
| `--gx-ember-glow`    | `rgba(208, 122, 90, 0.32)`                 | `rgba(208, 122, 90, 0.45)` |

### 3.5 Semantic

| Token            | Light       | Use                              |
|------------------|-------------|----------------------------------|
| `--gx-ok`        | `#4a8a4a`   | Success badges, executed phase   |
| `--gx-warn`      | `#a8742a`   | Warnings (non-blocking)          |
| `--gx-err`       | `#b04428`   | Errors, error phase              |
| `--gx-info`      | `#2a6a8a`   | Informational hints              |

Plus the deprecated trio kept for legacy chrome:
`--gx-success-text`, `--gx-danger-text`, `--gx-accent-text` (used by
inline-tinted backgrounds; favour the semantic tokens above for new
work).

### 3.6 Danger gate

| Token              | Light       | Dark        |
|--------------------|-------------|-------------|
| `--gx-danger-bg`   | `#fbeae3`   | `#2a1612`   |
| `--gx-danger-bd`   | `#d07a5a`   | (inherits)  |

### 3.7 Radii / Spacing / Type

| Family   | Tokens                                                            |
|----------|-------------------------------------------------------------------|
| Radii    | `--gx-r-{xs,sm,md,lg,xl,pill}` (4 / 6 / 10 / 14 / 20 / 999 px)    |
| Spacing  | `--gx-s-{1..6}` (4 / 6 / 10 / 14 / 20 / 28 px)                    |
| Type     | `--gx-t-{micro,meta,body,prom,title,display}` (10 / 11 / 13 / 15 / 20 / 28 px) |
| Tracking | `--gx-track-kicker` (0.26em), `--gx-track-meta` (0.12em)          |

Fonts: `--gx-font-sans` (Inter), `--gx-font-mono` (JetBrains Mono),
`--gx-font-display` (Fraunces with system-serif fallback — no
`@font-face` ships yet, dedicated PR pending).

### 3.8 Motion

| Token               | Value                                  |
|---------------------|----------------------------------------|
| `--gx-dur-fast`     | `120ms`                                |
| `--gx-dur-normal`   | `200ms`                                |
| `--gx-dur-slow`     | `360ms`                                |
| `--gx-ease-out`     | `cubic-bezier(0.2, 0, 0, 1)`           |
| `--gx-ease-in-out`  | `cubic-bezier(0.4, 0, 0.2, 1)`         |
| `--gx-ease-spring`  | `cubic-bezier(0.5, 1.5, 0.5, 1)`       |

`prefers-reduced-motion: reduce` collapses every animation to 1ms
inside `.gauntlet-capsule *` (CSS guard at the bottom of
`capsule.css.ts`).

### 3.9 Shadow

| Token             | Light                                                                  |
|-------------------|------------------------------------------------------------------------|
| `--gx-shadow-soft`| `0 1px 2px rgba(60,40,20,0.06), 0 0 0 1px rgba(60,40,20,0.03)`         |
| `--gx-shadow-panel`|`0 2px 8px rgba(60,40,20,0.08), 0 18px 48px rgba(60,40,20,0.12)`        |
| `--gx-shadow-pill`| `0 1px 2px rgba(208,122,90,0.25), 0 6px 18px rgba(208,122,90,0.30)`    |

---

## 4. Phase grammar

```
idle → planning → streaming → plan_ready
                                 │
                                 ▼  (operator approves; danger gate if any sensitive)
                              executing → executed
                                 │
                                 ▼  (rejected)
                              plan_ready
```

Any state can fall to `error`. Pill carries its own micro-states
(`idle / active / offline`) outside the Capsule machine — the Pill
is always-on chrome, the Capsule is the on-demand surface.

`isBusy(phase)` (in `useStreamingPlan.ts`) returns `true` for
`planning | streaming | executing` — single source of truth for the
chrome to know "agent is mid-flight".

Phase signal lives on `.gauntlet-capsule__mark-dot`:
- **planning / streaming / executing** — ember + `gx-breathe` 1.6s.
- **executed** — `--gx-ok` + `gx-success-flash` 700ms (one shot).
- **error** — `--gx-err` + `gx-breathe` 1s (faster).
- **idle / plan_ready** — peach + `gauntlet-cap-pulse` 2.4s (resting).

---

## 5. Components

| Component              | Path                                              | Anatomy                                            |
|------------------------|---------------------------------------------------|----------------------------------------------------|
| `Pill`                 | `packages/composer/src/Pill.tsx`                  | 56×56 pill, ember radial, breath/pulse states.     |
| `Capsule`              | `packages/composer/src/Capsule.tsx`               | Floating shell, 2-column layout, phase ring.       |
| `LeftPanel`            | `packages/composer/src/LeftPanel.tsx`             | Brand header + ThemeToggle + settings + context.   |
| `ActionsRow`           | `packages/composer/src/ActionsRow.tsx`            | Anexar / Ecrã / Voz / Enviar.                      |
| `AnswerPanel`          | `packages/composer/src/AnswerPanel.tsx`           | Markdown answer + Copy / Save buttons.             |
| `StreamingState`       | `packages/composer/src/StreamingState.tsx`        | Skeleton (planning) or token-by-token (streaming). |
| `PlanRenderer`         | `packages/composer/src/PlanRenderer.tsx`          | Plan list (stagger), danger gate, success badge.   |
| `ComputerUseGate`      | `packages/composer/src/ComputerUseGate.tsx`       | Per-action confirmation overlay.                   |
| `CommandPalette`       | `packages/composer/src/CommandPalette.tsx`        | ⌘K palette over the cápsula.                       |
| `SettingsDrawer`       | `packages/composer/src/SettingsDrawer.tsx`        | Theme, dismissed domains, pill mode, screenshot.   |
| `SlashMenu`            | `packages/composer/src/SlashMenu.tsx`             | Slash actions above the input on `/`.              |
| `ShortcutBar`          | `packages/composer/src/ShortcutBar.tsx`           | Phase-aware status + contextual hint chips.        |
| `ThemeToggle`          | `packages/composer/src/ThemeToggle.tsx`           | Light / dark switch in the LeftPanel header.       |
| `EmptyState`           | `packages/composer/src/EmptyState.tsx`            | "O que queres fazer?" + 4 rituals on idle.         |

Hooks the Capsule consumes:

| Hook                  | Path                                              | Purpose                                              |
|-----------------------|---------------------------------------------------|------------------------------------------------------|
| `useStreamingPlan`    | `useStreamingPlan.ts`                              | Owns send/receive, exposes `Phase` + `isBusy`.       |
| `useToolManifests`    | `useToolManifests.ts`                              | Loads palette manifests + recents (cancel-safe).     |
| `usePhaseBroadcast`   | `usePhaseBroadcast.ts`                             | Broadcasts `gauntlet:phase` so the Pill mirrors.     |
| `useAttachments`      | `useAttachments.ts`                                | Attach / remove file + screenshot logic.             |
| `useTTS`              | `useTTS.ts`                                        | Speak responses on demand.                           |
| `useVoiceCapture`     | `useVoiceCapture.ts`                               | Hold-to-talk capture.                                |
| `useCapsuleScreenshot`| `useCapsuleScreenshot.ts`                          | Snapshot the host surface.                           |
| `useCapsuleKeyboard`  | `useCapsuleKeyboard.ts`                            | Global shortcuts (Esc, ⌘K, etc.).                   |
| `useSaveToMemory`     | `useSaveToMemory.ts`                               | Persist a response to backend memory.                |
| `usePlanGuards`       | `usePlanGuards.ts`                                 | Compute danger flags + policy-forced acks.           |

---

## 6. Motion vocabulary

Keyframes live in `capsule.css.ts`. Two namespaces:

- `gauntlet-cap-*` — original canon (pulse, aurora, rise, shimmer,
  caret, phase-heartbeat, etc.).
- `gx-*` — Aether v2 port (fade-up, pop, glide, sheen,
  success-flash, breathe, rise).

Utility classes for ad-hoc motion:

- `.gx-anim-rise` / `.gx-anim-fade` / `.gx-anim-pop` / `.gx-anim-glide`
- `.gx-stagger > *` with `:nth-child(1..6)` plus a fallback bucket
  for 7+ items so long plans still feel ordered.

Phase ring morph is wired via `transition` on
`.gauntlet-capsule--floating::before` — when `--gx-phase` swaps,
opacity + box-shadow ease into the new colour over 320 / 480ms.
There is no `@keyframes` for this — a parallel one was removed for
being dead code.

---

## 7. Accessibility

- WCAG AA on text foregrounds (see §3.2).
- Every interactive element exposes a `:focus-visible` outline
  (ember 2px, offset 2-4px).
- Live regions:
  - `ShortcutBar` — scoped to the status text only
    (`role="status" aria-live="polite"` on `.gx-shortcut-bar__status`).
    The hint chips do not re-announce on phase flips.
  - `PlanRenderer` — scoped to the success badge on `executed`. The
    danger gate keeps `role="alert"` (assertive).
  - `StreamingState` — skeleton has `role="status"` +
    `aria-live="polite"`.
- Keyboard: full keyboard reach via `useCapsuleKeyboard`. Esc
  dismisses; ⌘K opens the palette; `/` opens the slash menu.
- Voice: `aria-label` Portuguese for every interactive control.
- Reduced motion: enforced inside `.gauntlet-capsule *`.

---

## 8. Implementation rules

### 8.1 Tokens

Components read `var(--gx-*)`. Hex / rgba / px literals inside
component CSS are smell — port to a token before merging unless the
literal is genuinely one-off and contextually labelled.

### 8.2 Phase

The phase string lives in `useStreamingPlan`'s `Phase` union.
Anything reacting to phase imports the type — no stringly-typed
copies. `ShortcutBar.STATUS_BY_PHASE` is the canonical "label per
phase" map; adding a Phase variant fails compilation until the map
updates.

### 8.3 Lei do Capsule

`Capsule.tsx` is allowed to **shrink, never grow**. Each PR that
touches it ratchets the budget in `.github/workflows/ci.yml` down to
the new line count. Today: 778 lines. Target: ≤ 800 (already met).
Adding a feature means extracting a sub-component or hook first.

### 8.4 Shells never duplicate

`Pill`, `Capsule` and `ComposerClient` exist only in
`packages/composer/src/`. Shells (`apps/browser-extension/`,
`apps/desktop/`) build an `Ambient` and inject it. Visual or
behavioural divergence between shells is regression.

### 8.5 LLM via gateway

Frontend never calls Anthropic / Gemini / OpenAI directly. Every
LLM round-trip flows through `backend/model_gateway.py`. Tools live
server-side; the composer drives them via `composer-client`.

### 8.6 Naming

| Surface             | Canonical                              | Legacy aliases (read-only fallback) |
|---------------------|----------------------------------------|--------------------------------------|
| Env vars            | `GAUNTLET_*`                           | `SIGNAL_*`, `RUBERRA_*`              |
| API routes          | `/api/gauntlet/*`                      | `/api/signal/*`, `/api/ruberra/*`    |
| Storage keys (FE)   | `gauntlet:*`                           | `signal:*`, `ruberra:*`              |
| CSS tokens          | `--gx-*`                               | (none)                               |
| Folders             | `packages/composer/`, `apps/*`,        | `signal-backend/`, `_legacy/`,       |
|                     | `control-center/`, `backend/`          | `chambers/`                          |

---

## 9. Cross-references

- `docs/canon/COMPOSER_SURFACE_SPEC.md` — surface spec, the *what*.
- `docs/DESIGN_TOKENS.md` — earlier token doc (Wave P-33), pre-Aether.
- `docs/MOTION.md` — earlier motion doc (Wave P-34).
- `docs/A11Y_AUDIT.md` — accessibility checklist + audit trail.
- `docs/COMPONENT_HIERARCHY.md` — composition tree.
- `docs/INFORMATION_ARCHITECTURE.md` — operator's mental model.
- `docs/EMPTY_STATES.md` — copy + UX for zero-state.
- `docs/RESPONSIVE.md` — viewport behaviour.
- `docs/KEYBOARD.md` — every shortcut.
- `CLAUDE.md` — project doctrine (Lei do Capsule, naming, lentes).

---

## 10. Pending

Tracked here to keep the spec honest about what is not yet shipped:

1. **`gauntlet:phase` event tampering** — host-page scripts can
   forge the `gauntlet:phase` and `gauntlet:execute-result` window
   events. Impact today is purely cosmetic (pill tint). Mitigation
   needs a swap to `chrome.runtime` messaging (extension) or a
   shadow-root `EventTarget` (desktop). See PR #367 trade-off note.
2. **CSS literals** — ~600 `px`/`ms`/`rgba` literals still live in
   `capsule.css.ts` outside token defs. Tokenisation in bulk is a
   PR of its own.
3. **Fraunces** — currently only in the font-family stack as a
   first-choice with system serif fallback. Adding a real
   `@font-face` is an asset-change PR.
4. **Dark mode contrast for `--gx-text-ghost`** — token has no
   consumer today, but if any text starts using it the dark value
   (`rgba(255,255,255,0.20)` ≈ 3.3:1) fails AA.
5. **PhaseDrawer / EmptyRituals refresh** — the canon ships the new
   chrome (ShortcutBar, ThemeToggle, EmptyState). The Lovable preview
   experiments with a phase-cycling drawer for QA; deferred until
   `data-debug` exists in production paths.
