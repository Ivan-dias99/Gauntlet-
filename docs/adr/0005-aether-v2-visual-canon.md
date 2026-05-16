# ADR-0005 · Aether v2 as the visual canon

**Status**: Accepted (retroactive)
**Date**: 2026-05-11
**Deciders**: Ivan Fernandes
**Tags**: design-system, frontend, doctrine
**Supersedes**: Aether v1 (informal, never ADR-codified)
**Builds on**: ADR-0001 (Composer pillar), ADR-0004 (Capsule + Pill rules)

---

## Context

The Composer surface (cápsula + pill) had iterated through several visual languages: an early "Signal" dark-mode aesthetic, a generic shadcn/ui template phase, a custom-token attempt without enforcement, an **Aether v1** that established the cream + ember palette as canonical, and now **Aether v2** — landed via PR #367 ("Aether v2 port + UX polish wave (composer surface)") and documented in PR #368 ("docs(design-system): AETHER.md + 4 hex tokens").

**Aether v2 is the current canon.** It is documented in three places that stay aligned:

1. `docs/canon/COMPOSER_SURFACE_SPEC.md` — authoritative visual spec (329 linhas)
2. `docs/design-system/AETHER.md` — operational design system reference (363 linhas)
3. `packages/composer/src/capsule.css.ts` — implementation tokens

This ADR cristalizes Aether v2 as the constitution. Subsequent visual decisions reference this ADR by number. **Aether v1 is now archive** — no remaining writes use it; some legacy comments may reference it during migration.

## Decision

Aether v2 is the visual canon for the Composer surface. Its components:

### Surfaces — cream, not white

```
--gx-bg          #f4efe6   (page background)
--gx-bg-sunken   #ece5d8   (left-panel context background)
--gx-bg-surface  #fbf7ef   (capsule surface)
--gx-bg-elevated #ffffff   (chips, cards, elevated panels)
--gx-bg-input    #fbf7ef   (input fields)
```

Default theme is `[data-gx-theme="light"]` (also `:root`). Pure white reserved for the elevated tier — never page or capsule background. Dark variant `[data-gx-theme="dark"]` exists; both themes are part of the canon.

### Single brand accent — ember

```
--gx-ember      #d07a5a   (active dot, primary button, slash bullets, focus halo)
--gx-ember-2    #b8542a   (hover, sensitive label, ember-button hover)
--gx-peach      #f4c4ad   (pill highlight, halo)
--gx-ember-glow color-mix(in oklab, #d07a5a 32%, transparent)
```

**One brand accent. No second.** Color in chrome is regression — color belongs in *data*. Semantic states get their own pairs:

```
--gx-ok        #2a6a40
--gx-warn      #a8742a
--gx-err       #b04428
--gx-info      #2a6a8a
```

Sensitive actions: `--gx-danger-bg #fbeae3`, `--gx-danger-bd #d07a5a`.

### Type — three families, six sizes

```
--gx-font-display "Fraunces", Georgia, serif        ← titles, capsule brand
--gx-font-sans    "Inter", system-ui, sans-serif    ← body, input, answer
--gx-font-mono    "JetBrains Mono", monospace       ← labels, plan steps, kbd
```

Inter is named here despite the upstream `frontend-design` ban. The combination with Fraunces (display) and JetBrains Mono (mono) escapes the generic SaaS feel the upstream rule guards against. **This combination is the canon. Substitutions are forbidden.**

```
--gx-t-micro    10px      kbd · kickers (uppercase, tracked 0.26em)
--gx-t-meta     11px      section labels (uppercase, tracked 0.12em)
--gx-t-body     13px      plan steps · chips · secondary
--gx-t-prom     15px      input · answer body
--gx-t-title    20px      empty-state question
--gx-t-display  28px      "Composer Surface" headline
```

### Motion — three durations, three easings

```
--gx-dur-fast    120ms   hover · focus · micro-interactions
--gx-dur-normal  200ms   panel transitions · fade-in
--gx-dur-slow    360ms   capsule rise · success badge

--gx-ease-out      cubic-bezier(0.2, 0, 0, 1)
--gx-ease-in-out   cubic-bezier(0.4, 0, 0.2, 1)
--gx-ease-spring   cubic-bezier(0.5, 1.5, 0.5, 1)
```

Named keyframes: `gx-breathe` (3.2s ease-in-out), `gx-pulse-once` (600ms spring), `gx-rise` (360ms spring), `gx-aurora` (24s linear), `gx-shimmer` (1.4s linear), `gx-caret` (1s steps), `gx-success-flash` (700ms). `@media (prefers-reduced-motion: reduce)` collapses to 1ms — do not bypass.

### Phase grammar — 11 states (3 PILL + 8 CAPSULE)

The cápsula's state machine. Compared to earlier drafts that listed 7 states, the real machine has **11**:

```
PILL machine (always-on resting chrome, parallel to CAPSULE):
  idle · active · offline

CAPSULE machine (on-demand work surface):
  idle → planning → streaming → plan_ready
                                      ↓ (sensitive actions present)
                                  danger_gate → executing → executed
                                      ↓ (rejected)
                                   plan_ready

         any state ────→ error
```

**`danger_gate` is its own phase**, not a sub-state of `plan_ready`. When any plan step has `sensitive: true`, the machine MUST transition through `danger_gate` before `executing`. The `<ComputerUseGate>` component renders the gate UI.

Every state has a visible representation in the cápsula. Silent transitions are regressions.

### Shortcut bar — product surface (not chrome)

The bottom shortcut bar has **8 distinct tonal states** mapped 1:1 to capsule phase. Maps to `.gx-shortcut-bar` with `status[data-tone="..."]`. Implementation: `packages/composer/src/ShortcutBar.tsx` (landed in PR #367 as part of Aether v2 port).

| Phase | Status tone | Text | Hints |
|---|---|---|---|
| `idle` | neutral | "Pronto" | `/ comandos`, `↑ último prompt`, `⌘K palette`, `esc recolher` |
| `planning` | thinking (ember pulse) | "A planear…" | `esc parar` |
| `streaming` | thinking | "A responder…" | `esc parar` |
| `plan_ready` | ok (green) | "Plano pronto" | `↩ Executar` (primary), `esc Rejeitar` |
| `danger_gate` | danger (ember pulse) | "Confirma" | `↩ Executar com cuidado` (danger), `esc Cancelar` |
| `executing` | thinking | "A executar…" | `esc Parar` |
| `executed` | ok | "Concluído" | `↩ Novo prompt`, `c Copiar` |
| `error` | err (red) | "Erro" | `↩ Tentar de novo`, `esc Fechar` |

The shortcut bar is product, not decoration. It always reflects current state.

### Theme toggle

Implementation: `packages/composer/src/ThemeToggle.tsx` (landed in PR #367). Switches `[data-gx-theme]` between `"light"` and `"dark"`. Both themes are first-class canon.

### Canonical labels (write these)

```
Enviar · Resposta · Plano · Executar · Executar com cuidado ·
Executado · Anexar · Ecrã · Voz · Copy · Save · Re-read · Erro ·
Confirmo, executar mesmo assim · Rejeitar · Cancelar · Pronto ·
A planear · A responder · A executar · Concluído · Novo prompt ·
Tentar de novo · Comandos · Último prompt · Palette · Recolher · Fechar
```

### Banned labels (never write these)

```
~~Compor~~  ~~Acionar~~  ~~Submit~~  ~~Run~~  ~~Magic~~
~~Assistant~~  ~~Preview~~ (use RESPOSTA)
```

The voice ban-list is enforced by `scripts/check-voice.mjs` (CI gate, `npm run check:voice`).

## What changed between Aether v1 and Aether v2

- ShortcutBar component formally extracted (PR #367)
- ThemeToggle component formally extracted (PR #367)
- 4 additional hex tokens documented in AETHER.md (PR #368)
- Semantic ink tokens hardened (referenced in `feat/composer-alive*` work)
- Class prefix harmonized (`gauntlet-*` in `capsule.css.ts` is canon; `gx-*` is the Aether portable export prefix)
- Voice ban-list extended; ADR-codified

The token surface remained backward-compatible. Code reading Aether v1 tokens continues to read v2 tokens (same names, refined values).

## Consequences

**Positive:**

- The visual identity is canonical. New components have one obvious set of tokens to consume.
- The 11-state phase grammar is explicit. The cápsula machine has no hidden states.
- The voice ban-list has documented intent — banned words map to canonical replacements.
- The Aether canon is portable (a Lovable export reproduces it standalone). Visual iteration can happen outside the main repo without drift.

**Negative:**

- The constraints are tight. A designer wanting a fourth typeface, second brand color, or sub-state has to negotiate against this ADR explicitly.
- Inter's reputation as "AI slop default font" means anyone applying upstream `frontend-design` rules without reading this ADR might try to swap it. This ADR is the override.
- 11 phase states is a lot to render distinctly. The cápsula must surface each one — no silent transitions, no overlapping renderings. UI complexity in `Capsule.tsx` grows with the state count.

**Neutral:**

- A future Aether v3 would supersede this ADR. Until then, this is the constitution. No "Aether v2.5" patches — the next version is named and ADR'd.

## Alternatives considered

- **Add a second brand color** (e.g. blue for "info" states). Rejected: introduces visual hierarchy competing with ember. The semantic state colors (ok/warn/err/info) are bounded and don't claim brand.
- **Drop Fraunces, use only Inter + JetBrains Mono**. Rejected: removes the editorial voice that distinguishes Gauntlet from generic SaaS.
- **Single phase machine instead of two parallel (PILL + CAPSULE)**. Rejected: PILL is always-on resting chrome; CAPSULE is on-demand work surface. They have orthogonal lifecycles. Conflating them creates impossible states (e.g. "PILL active + CAPSULE streaming" is real; a single machine can't represent it cleanly).
- **Variable type scale** (responsive sizes). Rejected: the 6-step scale is canon. Responsive cápsula sizing happens via `clamp()` on container, not type.

## References

- `docs/canon/COMPOSER_SURFACE_SPEC.md` — authoritative visual spec (329 linhas)
- `docs/design-system/AETHER.md` — operational reference (363 linhas, status: operational, Wave 1 + Wave 2 + Aether v2 shipped via PRs #366 #367)
- `packages/composer/src/capsule.css.ts` — implementation (`gauntlet-*` class prefix)
- `packages/composer/src/ShortcutBar.tsx`, `ThemeToggle.tsx` — Aether v2 extracted components
- `scripts/check-voice.mjs` — voice ban-list lint
- `.github/workflows/ci.yml` — `BUDGET=778` Capsule.tsx gate + voice check
- ADR-0001 — Composer pillar
- ADR-0004 — Capsule shared / Pill divergent (both pills honor the same Aether identity)
- Skill `gauntlet-design-system` v1.1 — operational rules built on this ADR

## Notes

The class prefix divergence (`gauntlet-*` in `capsule.css.ts` vs `gx-*` in portable Lovable exports) is real but not doctrine drift. It is implementation choice. Migration between prefixes would require a separate ADR with explicit cost/benefit. For now, both prefixes coexist — Lovable exports are for design iteration and visual reference, not direct integration into the canonical repo.

The work landed via PRs #366 ("Wave 1 + Wave 2 audit fixes") and #367 ("Aether v2 port + UX polish wave") brought the codebase to v2. PR #368 ("docs(design-system): AETHER.md + 4 hex tokens") documented it. This ADR (May 2026 retroactive) closes the doctrinal loop.
