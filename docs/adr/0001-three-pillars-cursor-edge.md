# ADR-0001 · Gauntlet identity — three pillars + cursor-edge philosophy

**Status**: Accepted (retroactive)
**Date**: 2026-05-11
**Deciders**: Ivan Fernandes (Sovereign Architect, Canon Owner)
**Tags**: identity, architecture, doctrine

---

## Context

Gauntlet originated from a workspace prototype that fragmented across several framings: "Signal", "Ruberra workstation", "AI interface shell design", "chambers", "agent rooms". Each framing had partial truth, none was canonical. The repo carried multiple folder names (`signal-backend/`, `chambers/`, `_legacy/`, `src/`) that reflected sequential rebuilds, not single intent.

By 2026-05, three things became clear:

1. The product is **one organism**, not a kit of separable apps.
2. The user value lives at **a specific spatial location**: the tip of the cursor, where attention already is.
3. The fragmented folder names were noise — the structure is fundamentally three pillars with crisp roles.

This ADR cristalizes the identity. Subsequent ADRs (0002 through 0006) build on it.

## Decision

Gauntlet is **one product**, expressed through **three pillars**:

| Pillar | Folder | Role | Deploys to |
|---|---|---|---|
| **Composer** (the cápsula) | `packages/composer/`, mounted in `apps/browser-extension/` and `apps/desktop/` | Dense work surface, IDE-grade, lives at the cursor edge | Browser extension (Chrome/Firefox WebStores) + Tauri desktop binary |
| **Control Center** (the garagem) | `control-center/` | Operator console — settings, models, permissions, memory, ledger, governance | Vercel |
| **Backend** (the maestro) | `backend/` | FastAPI server, owns model routing, runs ledger, security envelope, memory | Railway / Fly / Render / VM |

The pillars are coordinated by **two contracts**:

1. The Composer surface contract — `/composer/{context,intent,preview,apply}` HTTP pipeline.
2. The cursor-edge philosophy — `point → ask → execute`. The user points at something, says what they want, the system executes where they already are. Any change that pulls the user out of their flow is regression.

This identity supersedes:

- "Signal" branding (env vars `SIGNAL_*` and routes `/api/signal/*` remain as read-only fallback until v1.1.0; see ADR-0006)
- "Ruberra workstation" framing (Ruberra is the parent corp; Gauntlet is its practical product expression)
- "Chamber" decomposition as a product surface (chambers — Lab, Creation, Memory, School — remain useful as operating doctrine, not as UI metaphor)
- Any framing that treats Composer / Control Center / Backend as separable products

## Consequences

**Positive:**

- Three folder names instead of seven. Single mental model for any new collaborator (human or AI).
- The cursor-edge test becomes a usable filter: every feature proposal has to survive the question "does this approach or retreat from the cursor edge?"
- Dual-shell parity (browser-extension ↔ Tauri) becomes a non-negotiable law, since both shells host the same Composer pillar.
- The Composer is allowed to be dense (it's the workstation); the Control Center is allowed to be calm (it's the garage). Different surfaces, different aesthetics, by design.

**Negative:**

- Three pillars must move together at release time (see ADR-0006). Partial bumps create runtime parity violations (e.g. `apps/browser-extension/` at 1.0.2 while `apps/desktop/` at 1.0.1 is currently an open P1).
- Anything that doesn't fit one of the three pillars must justify its existence loudly. There is no fourth pillar by accident.
- The cursor-edge test rejects entire classes of features (settings panels inside the Composer, large modal dialogs, multi-step wizards) that would otherwise feel "complete". The Control Center exists precisely so the Composer doesn't bloat.

**Neutral:**

- The Ruberra chamber doctrine (Lab / Creation / Memory / School) operates at a layer above product. The chambers govern how work moves; the pillars govern what the product is. Both apply.

## Alternatives considered

- **One big monolith** (`gauntlet/` containing everything). Rejected: the runtime boundaries (browser context vs OS context vs server) are real and force three deploy targets anyway.
- **Two pillars** (Composer + Backend, with Control Center inside the Composer). Rejected: cursor-edge dies if settings live in the Composer. The Composer is for doing; the Control Center is for configuring.
- **Four pillars** (Composer + Control Center + Backend + Agents). Rejected: agents are a delivery mode, not a product surface. They live inside other pillars (e.g. `engine.py` + `agent.py` in Backend), not beside them.

## References

- `CLAUDE.md` at repo root — universal doutrina
- `README.md` § "Layout" — folder tree
- `docs/canon/COMPOSER_SURFACE_SPEC.md` — authoritative visual spec of the Composer
- ADR-0002 — gateway-as-catalogue (Backend internal architecture)
- ADR-0004 — Capsule shared / Pill divergent (dual-shell rule)
- ADR-0005 — Aether v1 visual canon (Composer's visual identity)
- ADR-0006 — deprecation timeline (how legacy framings retire)

## Notes

Recovery path for anyone confused by old commits or PR descriptions referencing "signal" or "chambers" as product surfaces: those framings are archive. This ADR is present truth. Repo truth beats narrative.
