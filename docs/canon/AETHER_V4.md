# Aether v4 — Gauntlet canon design system

> **Status:** canonical. Replaces Aether v1 (shipped, cream + ember) and supersedes Aether v2 spec (slate + Terminal Green, never migrated). Synthesises the Gauntlet v3 mockup typography and palette into a v2-compatible phase grammar.

**Canonical path in repo:** `docs/canon/AETHER_V4.md`
**Owner surface:** `packages/composer/src/`
**Sovereign Architect:** Ivan
**Effective:** 2026-05-13

---

## 1. Lineage — what came from where, what was killed

This document is a **synthesis, not an invention**. Every decision below has a documented origin or a documented kill. There is no creative ambiguity left.

### 1.1 What v4 inherits

| Element | Origin | Note |
|---|---|---|
| Phase grammar (`gx-state-{phase}`) | Aether v2 §13 | preserved verbatim — 3 pill states, 8 capsule states |
| Motion choreography tokens | Aether v2 §5.10 | preserved verbatim — keyframes + durations |
| Token discipline (no inline hex in components) | Aether v2 §4 | preserved verbatim |
| Phase-grammar-over-component-grammar principle | Aether v2 §3.2 | preserved verbatim |
| Background (paper) | Gauntlet v3 mockup `theme.css` | `#f6f4ef`, replaces v1 cream and v2 slate |
| Ink scale | Gauntlet v3 mockup `theme.css` | `#1c1a16` primary, warm-dark |
| Accent system (multi-slot) | Gauntlet v3 mockup `theme.css` | replaces single-accent v1/v2 |
| Primary brand accent (cyan) | Gauntlet v3 mockup | `#0EA5C7`, replaces v1 ember and v2 Terminal Green |
| Typography stack (Newsreader + Inter Tight + JetBrains Mono) | Gauntlet v3 mockup | replaces v1's serif+mono and v2's sans-only |
| Italic serif accent pattern | Gauntlet v3 mockup | "Tune the *capsule.*" register preserved |
| Terracotta callback to ember | v1 shipped (transformed) | preserved as `--gx-accent-warm` for `gx-state-executed` only |

### 1.2 What v4 explicitly kills

- v1 cream `#f7f3e8` as background → killed. Paper `#f6f4ef` wins.
- v1 ember `#d07a5a` as primary brand → killed. Preserved only as terracotta in `--gx-accent-warm` semantic.
- v2 slate-50 `#F8FAFC` as background → killed. Too cold for Gauntlet's editorial register.
- v2 Terminal Green `#22C55E` as primary → killed. Lives derivatively in `--gx-accent-ok` (moss).
- Gauntlet v3's god-component `design-canvas.jsx` → not canon, archive as exploration only.
- Gauntlet v3's lack of `gx-state-{phase}` grammar → filled by v2 grammar adoption.
- AETHER v2 spec doc `docs/design-system/AETHER.md` → archived to `docs/explorations/AETHER_V2_SPEC.md`.

### 1.3 What v4 does NOT touch

- 63 `.tsx` component files in `packages/composer/src/` — no rewrite. Components consume tokens, tokens change.
- 31 test files — should pass unchanged. Any test asserting against a hex literal was already against §4 of v2 doctrine.
- `backend/composer.py` and the `/composer/{context,intent,preview,apply}` pipeline — design is frontend-only.

---

## 2. Vision (preserved from v2 §2)

> The Composer is **not a page**. It is the cursor-adjacent command surface.
> **Pill at the cursor. Capsule on demand. Plan, then execute.**

Aether is the visual and behavioural system that makes the Composer *viciante, premium, sem drift*. Each state has a purpose, each animation has a reason, each token has a single owner.

The surface must feel:

- **Real** — no "loading screens" disconnected from the work.
- **Clear** — one phase, one intent, one primary action.
- **Powerful** — shortcuts everywhere; mouse is optional.
- **Editorial premium** — terminal-grade rigor, with serif moments of warmth.

---

## 3. Design principles

1. **Cursor-adjacent, never centred.** The Pill anchors to the cursor. The Capsule rises from it. Nothing floats arbitrarily.
2. **Phase grammar over component grammar.** The UI changes by phase (`gx-state-{phase}`), not by internal React flag.
3. **Plan before execute.** Sensitive action requires explicit Gate. Never hide consequence behind a button.
4. **Tokens are the contract.** Components never contain hex literals, durations, or easings. Only `--gx-*`.
5. **Motion as feedback, not decoration.** Every keyframe responds to a real state transition. Reduced-motion respected.
6. **Italic serif moments earn their place.** Newsreader italic marks editorial weight — never decorative.

---

## 4. Foundations / Tokens

All tokens live in CSS custom properties prefixed `--gx-*`. Components consume tokens — never declare colour, radius, duration, or easing inline.

### 4.1 Surface

```css
--gx-bg:           #f6f4ef; /* paper, app canvas */
--gx-bg-sunken:    #efece4; /* paper-2, behind cards */
--gx-bg-surface:   #fbfaf6; /* card, capsule shell */
--gx-bg-elevated:  #fefdfa; /* palette, drawers */
--gx-bg-input:     #f6f4ef; /* textarea, fields */
--gx-bg-terminal:  #14130f; /* graphite, ledger background only */
```

### 4.2 Ink

```css
--gx-text:        #1c1a16; /* primary */
--gx-text-2:      #2a261f; /* secondary */
--gx-text-muted:  #6b6358; /* meta */
--gx-text-ghost:  #9b9285; /* placeholder */
```

### 4.3 Border

```css
--gx-border-soft:    rgba(28, 26, 22, 0.06);
--gx-border-mid:     rgba(28, 26, 22, 0.10);
--gx-border-strong:  rgba(28, 26, 22, 0.18);
--gx-border-focus:   #0EA5C7;
```

### 4.4 Accent system (multi-slot, semantic)

Brand cyan is primary. Other slots have semantic ownership. **Components never pick an accent — they reference the slot.**

```css
--gx-accent:        #0EA5C7; /* cyan, brand primary, focus, links */
--gx-accent-hover:  #0c93b3;
--gx-accent-glow:   color-mix(in srgb, #0EA5C7 32%, transparent);

--gx-accent-ok:     #5d8c5a; /* moss, success states */
--gx-accent-warn:   #c98c42; /* amber, caution */
--gx-accent-danger: #b85a5a; /* red, error + danger_gate */
--gx-accent-warm:   #c96442; /* terracotta, success warmth — preserves v1 ember soul */
--gx-accent-mark:   #b85a9b; /* magenta, phase highlights, attention */
```

### 4.5 Graphite (dark) variant

Opt-in via `data-gx-theme="graphite"`. Tokens mirrored, accents unchanged.

```css
[data-gx-theme="graphite"] {
  --gx-bg:           #14130f;
  --gx-bg-sunken:    #1a1813;
  --gx-bg-surface:   #1d1b15;
  --gx-bg-elevated:  #232017;
  --gx-bg-input:     #14130f;
  --gx-text:         #efece4;
  --gx-text-2:       #d8d3c6;
  --gx-text-muted:   #8f877a;
  --gx-text-ghost:   #5e574c;
  --gx-border-soft:  rgba(239, 236, 228, 0.05);
  --gx-border-mid:   rgba(239, 236, 228, 0.10);
  --gx-border-strong:rgba(239, 236, 228, 0.20);
}
```

### 4.6 Radii

```css
--gx-radius-sm:   6px;   /* chips, controls */
--gx-radius:      10px;  /* cards, capsule body */
--gx-radius-lg:   16px;  /* drawers, large surfaces */
--gx-radius-pill: 999px;
```

### 4.7 Spacing

8px base grid. `--gx-space-{n}` where n ∈ {1..12} ≡ {4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96}px.

### 4.8 Shadow

```css
--gx-shadow-pill: 0 1px 2px rgba(28,26,22,.08), 0 4px 14px rgba(28,26,22,.10);
--gx-shadow-card: 0 1px 0 rgba(255,255,255,.6) inset, 0 1px 2px rgba(28,26,22,.04), 0 8px 30px rgba(28,26,22,.06);
--gx-shadow-pop:  0 1px 0 rgba(255,255,255,.6) inset, 0 12px 40px rgba(28,26,22,.16);
--gx-shadow-key:  0 1px 0 rgba(28,26,22,.18), 0 0 0 1px rgba(28,26,22,.10) inset;
```

---

## 5. Typography

Three stacks, three roles. No fourth.

```css
--gx-font-serif: "Newsreader", "Source Serif Pro", Georgia, serif;
--gx-font-sans:  "Inter Tight", "Inter", system-ui, -apple-system, sans-serif;
--gx-font-mono:  "JetBrains Mono", "IBM Plex Mono", ui-monospace, Menlo, monospace;
```

### 5.1 Roles

| Role | Stack | Where it lives |
|---|---|---|
| Display | serif (Newsreader) | Page titles, modal headers, italic accent moments |
| Body | sans (Inter Tight) | All UI, all controls, all body copy |
| Code | mono (JetBrains Mono) | Code blocks, ledger, telemetry, shortcut keys |

### 5.2 The italic accent pattern

`<em class="gx-display-it">word.</em>` inside a sans h2/h3 produces the signature "Tune the *capsule.*" register. Reserve for: page titles, section heads, key moments in onboarding. **Never inside controls, labels, or body paragraphs.**

### 5.3 Scale

| Token | Size / line-height / weight | Stack | Use |
|---|---|---|---|
| `--gx-text-display` | 36px / 1.05 / 500 / -0.01em | serif | Hero / landing |
| `--gx-text-h1` | 26px / 1.1 / 500 | serif (italic accents allowed) | Page title |
| `--gx-text-h2` | 22px / 1.2 / 600 | sans | Section head |
| `--gx-text-h3` | 18px / 1.3 / 600 | sans | Subsection |
| `--gx-text-h4` | 16px / 1.4 / 500 | sans | Card title |
| `--gx-text-body` | 14px / 1.5 / 400 | sans | Body copy |
| `--gx-text-meta` | 11px / 1.4 / 500 / 0.08em | mono | Eyebrow, label, telemetry |
| `--gx-text-code` | 12px / 1.4 / 400 | mono | Inline code, key cap |

---

## 6. Phase grammar (preserved from Aether v2 §13)

The UI changes by phase, not by React internal flag. Phases attach to the capsule root as `gx-state-{phase}`. Each phase has a motion token and an accent reference.

### 6.1 Pill states

| Phase | Behaviour | Class | Accent ref | Motion |
|---|---|---|---|---|
| `pill_idle` | calm presence | `gx-state-pill-idle` | `--gx-accent`, `--gx-accent-glow` | `gauntlet-cap-pulse` 2.4s |
| `pill_active` | engaged, slightly warmer | `gx-state-pill-active` | `--gx-accent-hover` | `gauntlet-cap-chip-pop` 120ms |
| `pill_offline` | desaturated | `gx-state-pill-offline` | `--gx-text-ghost` | slow pulse 4s |

### 6.2 Capsule states

| Phase | Behaviour | Class | Accent ref | Motion |
|---|---|---|---|---|
| `idle` | empty Capsule, ritual buttons | `gx-state-idle` | surface ramp | `gauntlet-cap-rise` 240ms |
| `planning` | "A pensar…" with breathing dot | `gx-state-planning` | `--gx-accent-glow` | `gauntlet-cap-phase-heartbeat` |
| `streaming` | tokens emerging or skeleton | `gx-state-streaming` | `--gx-bg-sunken` | `gauntlet-cap-shimmer` |
| `plan_ready` | ordered list + CTA | `gx-state-plan-ready` | `--gx-accent` | `gauntlet-cap-stagger-in` |
| `danger_gate` | red-tinted block, friction | `gx-state-danger` | `--gx-accent-danger` | `gauntlet-cap-phase-morph` |
| `executing` | progress walks per step | `gx-state-executing` | `--gx-accent-hover` | `gauntlet-cap-progress-walk` |
| `executed` | ✓ icons, **warm** success badge | `gx-state-executed` | **`--gx-accent-warm`** (terracotta) | `gauntlet-cap-flash-rise` |
| `error` | red border, retry CTA, no theatrics | `gx-state-error` | `--gx-accent-danger` | gentle fade 200ms |

> **v4 nuance**: `gx-state-executed` switches from v2's green to terracotta (`--gx-accent-warm`). This is deliberate. Success in Gauntlet is editorial-warm, not compiler-loud. It is also the only place where v1's ember soul survives, by design.

---

## 7. Motion (preserved from Aether v2 §5.10)

```css
--gx-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--gx-ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
--gx-ease-linear: linear;

--gx-dur-fast:    120ms;
--gx-dur-base:    240ms;
--gx-dur-rise:    360ms;
--gx-dur-shimmer: 1400ms;
--gx-dur-pulse:   2400ms;
```

All keyframes nominated under `gauntlet-cap-*` prefix. Reduced-motion (`@media (prefers-reduced-motion: reduce)`) collapses every motion to an 80ms opacity fade.

---

## 8. Migration from v1 shipped

Bounded, ordered, no big-bang rewrite. Each phase is one merge into `main` via Claude Code.

### Phase A — token plumbing (1 PR, no visual change)
1. Create `packages/composer/src/aether-v4.css` with the §4 tokens.
2. Import it from `capsule.css.ts` **before** the existing styles (so v1 still wins until Phase B).
3. CI green: no test fails.

### Phase B — `capsule.css.ts` rewrite (1 PR, visual change)
1. Replace every literal hex in `capsule.css.ts` with `var(--gx-*)`.
2. Replace every literal duration with `var(--gx-dur-*)`.
3. Add font loading for Newsreader + Inter Tight + JetBrains Mono in `apps/browser-extension/` and `apps/desktop/` shell heads.
4. Smoke test in both shells (**dual-shell parity is law**).

### Phase C — phase grammar adoption (one component per PR)
1. For each `*.tsx` in `packages/composer/src/`: replace React `useState` colour flags with `gx-state-{phase}` class on the component root.
2. Component-side stays semantic. Phase-side does all visual switching.
3. CI tracks: zero hex literals or duration literals in component files (extend `scripts/audit/audit-all.sh`).

### Phase D — close the deltas
1. Move `docs/design-system/AETHER.md` → `docs/explorations/AETHER_V2_SPEC.md` with banner: *preserved as canon ancestor; not active*.
2. Record the Gauntlet v3 mockup zip in `docs/explorations/aether-v3-mockup.md` with the same banner.
3. Drop `data-gx-theme="paper"` as default in shell heads.

### Phase E — release
Tag `aether-canon-v4.0.0` separately from product version. Product can bump independently after migration completes.

---

## 9. What's NOT in v4 (intentional omissions)

- No design tokens for Control Center separate from Capsule. They share `--gx-*`.
- No animation for purely cosmetic moments. Every motion is in §7 or doesn't exist.
- No alternative theme beyond `paper` + `graphite`. Theme proliferation kills coherence.
- No icon set as canon (yet). Lucide remains the working choice; icon canon is a separate doc.

---

## 10. Sovereignty

This document is the canonical design source for Gauntlet. Changes pass through Ivan as Sovereign Architect via a PR titled `aether-canon: <change>`. The three predecessor documents (`AETHER.md`, Gauntlet v3 `theme.css`, `capsule.css.ts` legacy block) are no longer canonical.

Failure to consult this document before introducing visual tokens or motion in `packages/composer/src/` is a structural regression and blocks merge.
