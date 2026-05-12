---
name: gauntlet-design-system
description: Sovereign visual + UX law for the Gauntlet Composer surface (packages/composer/ and both shells consuming it). Use whenever the user is editing, reviewing, designing, or refactoring any pixel, motion, label, slash command, keyboard shortcut, capability surface, slot, or copy on the Composer — including the Capsule, the Pill, the Onboarding ritual, the ShortcutBar, the LeftPanel, the ActionsRow, the SlashMenu, the SlashMenuRender, the PlanRenderer, the AnswerPanel, the StreamingState, the EmptyState, the ThemeToggle, the SettingsDrawer, the CommandPalette, the ComputerUseGate, the AttachmentChips, or any of the 18 sub-components of the Composer. Trigger this skill when any .tsx file under packages/composer/src/ is opened, when capsule.css.ts (the Aether token registry) is touched, when shell adapters under apps/browser-extension/ or apps/desktop/src/ are wired to ambient capabilities (because the Capsule surface contract depends on capability shape), when docs/canon/COMPOSER_SURFACE_SPEC.md is referenced, when docs/design-system/AETHER.md is touched (operational design system reference), when slash commands, slash voice, prompt placeholders, or any user-facing string is added or modified, when phase states (3 PILL + 8 CAPSULE = 11 total) are debugged, when the 7-step phase loop is discussed, when accessibility (kbd, aria-live, focus order, motion-reduction) is the topic, when the 778-line Capsule.tsx CI budget is mentioned or risked, and whenever the conversation crosses the boundary between shared composer and shell adapter. This skill enforces the Aether v2 visual canon (cream surfaces, single ember accent, Fraunces/Inter/JetBrains Mono trio, named keyframes, 6-step type scale), the 11-state phase grammar (PILL machine: idle/active/offline + CAPSULE machine: idle/planning/streaming/plan_ready/danger_gate/executing/executed/error), the dual-shell parity 1:1 (browser-extension and desktop must render the Capsule identically, divergence is regression), the BUDGET=778 CI gate on Capsule.tsx, the voice ban-list (Compor, Acionar, Submit, Run, Magic, Assistant, Preview banned; Enviar, Resposta, Plano, Executar canonical), and the Pill divergence rule (Capsule shared, Pill divergent on desktop per ADR-0004). Composes with gauntlet-backend-spine (capability shape contract), gauntlet-tauri-shell (desktop adapter), and gauntlet-release-discipline (visual regression as release gate), and references ADRs 0001, 0004, 0005, 0006.
---

# Gauntlet Design System

Local constitution for Composer UI work. Does not re-teach React, CSS, or accessibility fundamentals; encodes **what is specific to the Composer surface** — the Aether v2 visual canon, the 11-state phase grammar, dual-shell parity, the voice ban-list, and closure shape.

The Composer is **the product**. Anything else (Control Center, backend, browser ext shell, desktop shell) is staging. Visual or behavioural divergence in the Capsule between shells = regression. Divergence in the Pill is intentional (ADR-0004).

---

## When to use

- File under `packages/composer/src/` touched
- `capsule.css.ts` (token registry) modified
- New component added to `packages/composer/src/`
- Slash command, slash voice, prompt placeholder, or user-facing string changed
- Phase state debugged (3 PILL + 8 CAPSULE = 11 total)
- 7-step phase loop discussed (idle → planning → streaming → plan_ready → [danger_gate] → executing → executed)
- Accessibility (kbd hints, aria-live, focus order, motion-reduction)
- Capsule.tsx BUDGET=778 risked (CI gate)
- Shell adapter wired to ambient capability (browser-extension/, desktop/src/)
- Reviewing PR that touches any of the above

Always also obey `/CLAUDE.md`. Load `gauntlet-tauri-shell` if change crosses into Tauri shell. Load `gauntlet-backend-spine` if capability shape changes.

## When NOT to use

- Pure backend Python edits → `gauntlet-backend-spine`
- Tauri/desktop shell internals → `gauntlet-tauri-shell`
- Control Center work (`control-center/`) — not Composer
- Release tagging, versioning, signing → `gauntlet-release-discipline`

---

## Product law

### 1. The Composer is the work surface (ADR-0001)

The Capsule + Pill are the product. Everything else exists to serve them. Visual or behavioural divergence between the browser-extension Capsule and the desktop Capsule is **regression**. They mount the same `@gauntlet/composer` package.

The Pill diverges intentionally on desktop (ADR-0004): the browser Pill is a page-DOM component with viewport magnetism and per-domain dismiss; the desktop Pill is a Tauri window with OS-handled drag. Visual identity (ember dot, breath, halo) is shared. Container differs; identity doesn't.

### 2. Aether v2 is the canon (ADR-0005)

Cream surfaces. Single ember accent. Fraunces (display) + Inter (sans) + JetBrains Mono (mono). Three motion durations × three easings. 11-state phase grammar.

**Aether v2 shipped via PR #367 + #368.** It is documented in three places that stay aligned:

- `docs/canon/COMPOSER_SURFACE_SPEC.md` — authoritative visual spec (329 linhas)
- `docs/design-system/AETHER.md` — operational design system reference (363 linhas, status: operational)
- `packages/composer/src/capsule.css.ts` — implementation tokens

Don't restate the values here — ADR-0005 is the source. This skill enforces compliance.

### 3. The 11-state phase grammar (ADR-0005)

The phase grammar is **11 states across 2 parallel machines**:

```
PILL machine (always-on resting chrome):
  idle · active · offline

CAPSULE machine (on-demand work surface):
  idle → planning → streaming → plan_ready
                                      ↓ (sensitive actions present)
                                  danger_gate → executing → executed
                                      ↓ (rejected)
                                   plan_ready

         any state ────→ error
```

Each state has visible representation. Silent transitions = regression.

**`danger_gate` is its own phase**, not a sub-state of `plan_ready`. Reject any code path that proceeds from `plan_ready` to `executing` without passing through `danger_gate` when sensitive actions are present.

### 4. ShortcutBar is product surface (ADR-0005)

The bottom shortcut bar is product, not decoration. It always reflects current phase. 8 distinct tonal states map 1:1 to capsule phase (see ADR-0005 table). Implementation: `packages/composer/src/ShortcutBar.tsx`.

### 5. Capsule.tsx BUDGET = 778 (CI gate)

```yaml
# .github/workflows/ci.yml
BUDGET=778
LINES=$(wc -l < packages/composer/src/Capsule.tsx)
if [ "$LINES" -gt "$BUDGET" ]; then
  echo "::error::Capsule.tsx grew past budget"
fi
```

Capsule.tsx is currently **at the exact budget (778)**. Any net addition without extraction triggers CI failure. Adding rendering logic? Extract a sub-component first (`PlanRenderer`, `AnswerPanel`, `StreamingState`, `EmptyState` are the existing pattern). 24 `.test.*` files in `packages/composer/src/` show the extraction pattern works.

### 6. Dual-shell parity 1:1 (ADR-0001)

The Capsule in `apps/browser-extension/` and `apps/desktop/` must render identically. The `ambient.capabilities.*` shape decides which buttons render (e.g. `filesystemWrite` is desktop-only, `domExecution` is browser-only). The action row stays visually identical: `ANEXAR · ECRÃ · VOZ · ENVIAR`. Missing capability → button does not appear.

If you find a visual divergence between shells: **fix the shell, not the Capsule.**

---

## Voice ban-list (ADR-0005)

Canonical labels (write these):

```
Enviar · Resposta · Plano · Executar · Executar com cuidado ·
Executado · Anexar · Ecrã · Voz · Copy · Save · Re-read · Erro ·
Confirmo, executar mesmo assim · Rejeitar · Cancelar · Pronto ·
A planear · A responder · A executar · Concluído · Novo prompt ·
Tentar de novo · Comandos · Último prompt · Palette · Recolher · Fechar
```

Banned labels (never write these):

```
Compor · Acionar · Submit · Run · Magic · Assistant · Preview
```

Enforced by `scripts/check-voice.mjs` (CI gate, `npm run check:voice`).

---

## Architectural truth

```
packages/composer/
  src/
    Capsule.tsx                ← canonical 778 lines · CI gate
    Pill.tsx                   ← shared Pill (browser only mounts this)
    Onboarding.tsx             ← 3-step ritual on first run
    
    ShortcutBar.tsx            ← 8 tonal states · landed PR #367 (Aether v2)
    ThemeToggle.tsx            ← light/dark · landed PR #367
    
    LeftPanel.tsx              ← context chips · provider · URL · selection
    ActionsRow.tsx             ← ANEXAR · ECRÃ · VOZ · ENVIAR
    SlashMenu.tsx              ← / commands list
    SlashMenuRender.tsx        ← rendering layer
    CommandPalette.tsx         ← ⌘K
    
    PlanRenderer.tsx           ← plan_ready + executing states
    AnswerPanel.tsx            ← streaming + executed states
    StreamingState.tsx         ← streaming caret + shimmer
    EmptyState.tsx             ← idle state
    ComputerUseGate.tsx        ← danger_gate UI
    AttachmentChips.tsx        ← attachments rendering
    SettingsDrawer.tsx         ← config panel
    CompactContextSummary.tsx  ← cápsula header context
    
    ShellPanel.tsx             ← optional shell view (desktop only via slash)
    
    ambient.ts                 ← Ambient type · capability contract
    composer-client.ts         ← talks to backend
    dom-actions.ts             ← DOM action plumbing (browser)
    capsule.css.ts             ← Aether v2 token registry
    
  + 24 .test.* files (test coverage of all components)
```

The Composer is a **single React tree**. Both shells (`apps/browser-extension/`, `apps/desktop/`) import this package and mount `<Capsule />` with a shell-specific `Ambient`. The `Ambient` injects transport, storage, selection, screenshot, domActions; the Capsule reads `ambient.capabilities.*` to decide what UI to render.

---

## The 7-step phase loop (canonical product ritual)

The user-facing experience flows through these 7 steps. Each renders distinctly:

```
1. point        user is on a page · cápsula is closed · Pill resting
2. invoke       user clicks Pill / Ctrl+Shift+Space / Alt+Space / "/"
3. open         cápsula appears (gx-rise spring, 360ms) · phase = idle
4. ask          user types / selects slash command · ENTER
5. plan         backend classifies intent · phase = planning → streaming OR plan_ready
6. confirm      if sensitive: danger_gate · user confirms
7. execute      side effects applied · phase = executing → executed
                runs.json appended · cápsula collapses
```

Reject any state transition that skips a step (e.g. `idle → executing` directly).

---

## Closure check

Not closed until all true:

1. **Builder landed** — change compiles; `npm run dev` shows correct rendering
2. **Capsule.tsx within budget** — `wc -l < packages/composer/src/Capsule.tsx ≤ 778`
3. **Voice check passes** — `npm run check:voice` exits 0
4. **Aether tokens compliance** — no hard-coded hex, no raw pixel values bypassing `capsule.css.ts`
5. **Phase state respected** — new UI maps to one of 11 canonical states; new state requires ADR amendment
6. **Tests landed** — `.test.tsx` covering new component; existing `.test.*` files updated if affected
7. **Dual-shell parity** — change visible in both browser and desktop, OR explicitly gated by `ambient.capabilities.X`
8. **Aria-live + kbd** — new interactive element has keyboard path + aria-live where async
9. **No motion-reduction violation** — `@media (prefers-reduced-motion: reduce)` collapses animations
10. **No Tauri/extension API leak** — `grep -rE "@tauri-apps|chrome\\." packages/composer/src/` returns nothing new
11. **Owned residue closed** — no `// TODO`, no `console.log`

If any fails: `não tenho evidência suficiente`.

---

## Anti-patterns (reject on sight)

| Anti-pattern | Correct shape |
|---|---|
| Hex value in component (e.g. `color: #d07a5a`) | `var(--gx-ember)` from `capsule.css.ts` |
| `font-family: "Inter"` hardcoded | `var(--gx-font-sans)` token |
| New "magic" state name like `awaiting_user` | Map to canonical 11 states or amend ADR-0005 |
| Skip danger_gate when sensitive: true | All sensitive plans pass through `<ComputerUseGate>` |
| Button "Submit" / "Send" / "Compor" | "Enviar" (canonical) |
| New component bloats Capsule.tsx past 778 | Extract sub-component first |
| `if (Platform.isDesktop)` inside Composer | Use `ambient.capabilities.X` |
| Re-implement `<Pill>` in `apps/desktop/src/PillApp.tsx` mounting shared | ADR-0004: keep PillApp custom (intentional divergence) |
| Use shared `<Pill>` in desktop App.tsx | Same: PillApp is custom; only Capsule is shared |
| Pixel values bypass scale | Use `--gx-t-{micro,meta,body,prom,title,display}` |
| New keyframe in component file | Add to canonical set in `capsule.css.ts`; rename if collision |
| Aria-live region missing on streaming output | Add `aria-live="polite"` with proper `aria-atomic` |
| `console.log` left in shipping code | Strip; use `observability.py` boundary on backend |
| Sub-component without `.test.*` | Tests land in same PR (24 .test.* coverage shows pattern) |
| Hardcoded label not in voice canonical list | Add to ADR-0005 voice section or use existing |

---

## Example invocations

- "Add a 'Save as draft' button to ActionsRow" → no, see ADR-0005 voice (only canonical 4 actions)
- "The streaming caret doesn't blink on Firefox" → debug `gx-caret` keyframe; check vendor prefix
- "Make the cápsula 20px larger" → check `clamp()` in `capsule.css.ts`; container scale, not content
- "Add a third color for 'info' states" → ADR-0005 forbids; semantic state colors (ok/warn/err/info) are bounded
- "Why does desktop pill look different from browser pill?" → ADR-0004 + visual identity is shared
- "Capsule.tsx is at 780 lines, refactor" → extract a sub-component; budget = 778 is hard CI gate
- "Add new slash command /benchmark" → update SlashMenu, SlashMenuRender, add label to ADR-0005 canonical list
- "Voice says 'Submit' on action button" → ban-list violation; use 'Enviar'
- "Theme toggle is missing on browser extension" → both shells must show ThemeToggle (parity 1:1)

---

## Reference

- ADR-0001 — three pillars (Composer is the product)
- ADR-0004 — Capsule shared / Pill divergent
- ADR-0005 — Aether v2 visual canon (authoritative)
- ADR-0006 — deprecation status
- `/CLAUDE.md` — universal doctrine
- `/docs/canon/COMPOSER_SURFACE_SPEC.md` — visual spec (329 linhas, authoritative)
- `/docs/design-system/AETHER.md` — operational reference (363 linhas, status: operational)
- `/docs/MOTION.md`, `/docs/RESPONSIVE.md`, `/docs/KEYBOARD.md`, `/docs/A11Y_AUDIT.md`, `/docs/VOICE.md`, `/docs/EMPTY_STATES.md`
- `packages/composer/src/capsule.css.ts` — token registry
- `packages/composer/src/Capsule.tsx` — canonical 778 LOC
- `scripts/check-voice.mjs` — ban-list lint
- `.github/workflows/ci.yml` — BUDGET=778 + voice gate
- Companion skills: `gauntlet-backend-spine`, `gauntlet-tauri-shell`, `gauntlet-release-discipline`

When skill conflicts with `/CLAUDE.md`, ADRs, or actual code on main: **code wins**.

## Changelog

- **v1.0** (PR #369) — initial pack, referenced Aether v1
- **v1.1** (this pack v1) — added 11-state phase grammar explicit, ShortcutBar canonical
- **v1.2** (this pack v2) — Aether v1 → v2 references; AETHER.md operational reference added; PRs #367 #368 cited as canonical landing
