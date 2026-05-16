# ADR-0004 · Capsule shared, Pill divergent — by design

**Status**: Accepted (retroactive)
**Date**: 2026-05-11
**Deciders**: Ivan Fernandes
**Tags**: frontend, dual-shell, design, doctrine
**Builds on**: ADR-0001 (three pillars, cursor-edge)

---

## Context

The Composer (per ADR-0001) is mounted in two shells:

- **Browser extension** — `apps/browser-extension/components/App.tsx` mounts `@gauntlet/composer`'s `<Capsule>` and `<Pill>` into a shadow DOM injected per page.
- **Tauri desktop** — `apps/desktop/src/App.tsx` mounts `@gauntlet/composer`'s `<Capsule>` in a transparent decoration-less window. A separate small window (`pill.html`) is a slim resting-state surface.

By default, dual-shell parity is law: both shells should mount the same components from the same package. Any visual or behavioral divergence in the Capsule between the two shells is regression.

**Exception**: the Pill.

In the desktop shell, `apps/desktop/src/PillApp.tsx` does **not** mount the shared `@gauntlet/composer`'s `<Pill>`. It re-implements a slim pill component locally. The file carries this comment at the top:

> "We intentionally do NOT reuse the shared `<Pill />` from `@gauntlet/composer` here: that component owns viewport-magnetism, drag, and per-domain dismiss, all of which are page-DOM concepts. On desktop the WINDOW is the pill; the OS handles drag (via `data-tauri-drag-region`) and there is no domain to dismiss against."

Early readings of the `gauntlet-design-system` skill v1.0 incorrectly flagged this divergence as a single-source-of-truth violation. It is not. The divergence is deliberate and structurally correct. This ADR makes the rule explicit and binding.

## Decision

### The Capsule is shared. The Pill is intentionally divergent in desktop.

Specifically:

| Component | Shared from `@gauntlet/composer` | Browser shell | Desktop shell |
|---|---|---|---|
| `<Capsule>` | ✅ single source of truth | ✅ mounts from package | ✅ mounts from package |
| `<Pill>` | ✅ exists in package | ✅ mounts from package (web context) | ❌ NOT mounted; replaced by local `PillApp.tsx` (OS-window context) |

### Why the Pill diverges

The shared `<Pill>` component owns abstractions that exist only in a page-DOM context:

- **Viewport-magnetism** — pill drifts toward the cursor when cursor approaches the pill's vicinity inside a web page's viewport
- **Drag-from-pill repositioning** — user drags pill around inside the page, position saved per-domain in `chrome.storage`
- **Per-domain dismiss** — right-click → flag the host domain → pill won't appear on that domain again
- **`mode: 'corner' | 'cursor'`** — in cursor mode, the OS pointer is hidden and the pill becomes the visual cursor
- **Phase mirror via `window.dispatchEvent`** — listens to `gauntlet:phase` CustomEvent broadcast from the Capsule
- **Idle fade after 30s** — page-level pointer inactivity timer

**None of these abstractions transfer to a Tauri window.** The OS, not a page, owns the pill window's position. Tauri's `data-tauri-drag-region` handles drag via the OS. There is no host page, no domain, no DOM-level pointer event semantics. Forcing the shared component would require fake page-DOM scaffolding to satisfy the abstractions, which is worse than re-implementing slim.

### What MUST stay aligned

The **visual identity** of the pill is shared between the two shells. Both pills:

- Use Aether v1 ember palette (see ADR-0005) — same color, same gradient, same halo
- Use the same breath animation (`gx-breathe` keyframe at 3.2s ease-in-out)
- Use the same 56px size and pill border-radius
- Use the same 3 states (`idle` / `active` / `offline`) with identical visual semantics

If the desktop pill's color, size, breath, or state semantics drift from the browser pill's, **that** is a regression. The container differs (page-DOM vs OS window); the identity does not.

### How `<Capsule>` differs from the Pill

The Capsule abstractions DO transfer between shells:

- Header, left panel, main panel, action row, shortcut bar — all DOM
- State machine (phase grammar, see ADR-0005) — same state, same rendering
- Capability gating — done via `ambient.capabilities.*` injected per shell (browser-ambient vs desktop-ambient)

So the Capsule is shared. Same component file, same import, both shells mount it. Capability differences are surfaced through the Ambient adapter, not through component branching.

## Consequences

**Positive:**

- The structural asymmetry between page-DOM and OS window is honored. No fake scaffolding to force shared abstractions across runtimes.
- The visual identity remains rigorously shared (same Aether tokens, same animations). Divergence is only at the abstraction level, not at the surface level.
- Future contributors who try to "unify" by mounting the shared `<Pill>` in desktop will hit the documented intent in this ADR and `PillApp.tsx`'s top comment.

**Negative:**

- Two pill implementations exist, not one. Visual identity drift is possible — only catchable by visual diff or by `aether-guardian` agent review (see `.claude/agents/aether-guardian.md`). The risk is mitigated but not zero.
- Behavior fixes (e.g. accessibility improvements to the pill) must be applied to both implementations. The shared `<Pill>` has co-located tests; `PillApp.tsx` needs its own test surface.
- Documentation cost: every new Claude session reading the codebase has to learn this rule. This ADR is the canonical reference; the skill `gauntlet-design-system` v1.1 mirrors it.

**Neutral:**

- The shared `<Pill>` will not need to grow toward desktop concerns. It can be optimized for web context exclusively.
- `PillApp.tsx` stays slim by mandate. Adding viewport-magnetism or per-domain dismiss to the desktop pill would be a re-introduction of the abstractions this ADR explicitly rejects for that runtime.

## Alternatives considered

- **Force shared `<Pill>` in desktop** with shimmed page-DOM. Rejected: shimming the viewport / domain / DOM event surface inside Tauri is more complex than re-implementing slim. And it would leak page-DOM assumptions into the desktop ambient adapter.
- **Make the shared `<Pill>` runtime-aware** via an `ambient.context` flag (`web` vs `os`). Rejected: every page-DOM abstraction would need a sibling OS-window branch. The component would fork internally, defeating the point of sharing.
- **Drop the resting-state pill entirely on desktop** — use the global shortcut (`Ctrl+Shift+Space`) instead, with no always-visible surface. Rejected: the pill provides discoverability. Without it, new users wouldn't know the cápsula exists.
- **Two completely separate Pill packages** (`@gauntlet/pill-web`, `@gauntlet/pill-desktop`). Rejected: over-fragmentation. The visual identity is genuinely shared; only the container abstraction differs. Two implementations under different directories within the same monorepo is enough.

## References

- `apps/desktop/src/PillApp.tsx` — desktop pill, documented at the top with the same rationale
- `packages/composer/src/Pill.tsx` — shared pill (browser-mounted)
- `apps/desktop/src/App.tsx` — desktop Capsule mount (uses shared `<Capsule>`)
- `apps/browser-extension/components/App.tsx` — browser shell mount (uses shared `<Capsule>` and `<Pill>`)
- `apps/desktop/src/ambient.ts` — `createDesktopAmbient` (desktop capability surface)
- `apps/browser-extension/lib/ambient.ts` — `createBrowserAmbient` (web capability surface)
- ADR-0001 — three pillars (Composer is the shared work surface)
- ADR-0005 — Aether v1 visual canon (the shared identity both pills honor)
- Skill `gauntlet-design-system` v1.1 — captures this ADR
- Skill `gauntlet-tauri-shell` v1.1 — captures the desktop-side rule

## Notes

When in doubt about whether a new behavior belongs in the shared `<Pill>` or in `PillApp.tsx`, ask three questions:

1. Does this behavior assume a page-DOM context (viewport, host page events, per-domain state)? → Shared `<Pill>` only.
2. Is this about visual identity (color, size, breath, halo, state appearance)? → Shared identity; both pills update together.
3. Is this about OS / window concerns (multi-monitor, OS notifications, tray, global shortcut behavior)? → `PillApp.tsx` only.

If a behavior crosses categories, split it: visual part shared (extracted to a sub-component if needed), behavior part in the appropriate runtime.
