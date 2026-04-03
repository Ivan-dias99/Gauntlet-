# AGENTS.md — Ruberra Canonical Operating Reference

## Overview

Ruberra is a sovereign intelligence workstation — a single-page React application (Vite + Tailwind CSS v4) with four chambers: **Lab** (investigate), **School** (master), **Creation** (build), **Profile** (govern). The backend is a Supabase Edge Function deployed remotely.

## Running the App

- **Dev server**: `npm run dev` (Vite, port 5173; `--host 0.0.0.0` to expose externally)
- **Build**: `npm run build` — primary correctness check (TypeScript/JSX errors surface here)
- **Package manager**: `npm` (not pnpm, despite `pnpm.overrides` in `package.json`)

## Key Caveats

- No linter or test runner. Only scripts: `dev` and `build`.
- No `.env` needed locally. Supabase URL + anon key in `utils/supabase/info.tsx`.
- When `OPENAI_API_KEY` is not set server-side, the edge function returns hardcoded demo responses.
- State persistence: `localStorage` via `RuntimeFabric` — no database locally.

## Architecture

### Core Files

| File | Purpose |
|------|---------|
| `src/app/App.tsx` | Shell-level owner: routing, execution, missions, governance |
| `src/app/components/runtime-fabric.ts` | Single persisted authority for all state |
| `src/app/components/routing-contracts.ts` | Route resolution → pioneer selection |
| `src/app/components/pioneer-registry.ts` | 7 pioneers: home_chamber, model_family, strengths |
| `src/app/components/model-orchestration.ts` | MODEL_REGISTRY: provider/tier/task mapping |
| `src/app/components/HeroLanding.tsx` | Landing/entry surface |
| `src/app/components/SovereignBar.tsx` | Top navigation bar |
| `src/styles/theme.css` | Canonical design tokens |

### 20-Stack Architecture

All stacks are runtime-real and persist through `RuntimeFabric`:

1. Canon + Sovereignty · 2. Mission Substrate · 3. Sovereign Intelligence · 4. Autonomous Operations · 5. Adaptive Experience · 6. Sovereign Security · 7. Trust + Governance · 8. System Awareness · 9. Autonomous Flow · 10. Multi-Agent Civilization · 11. Living Knowledge · 12. Intelligence Analytics · 13. Collective Execution · 14. Distribution + Presence · 15. Value Exchange · 16. Ecosystem Network · 17. Platform Infrastructure · 18. Organizational Intelligence · 19. Personal Sovereign OS · 20. Compound Intelligence Network

### Identity

**Ruberra IS:** A sovereign mission operating system. Memory-bearing. Chamber-native. Consequence-driven.

**Ruberra IS NOT:** A SaaS dashboard. A generic AI wrapper. A clone of any external tool.

**Core unit:** The mission. Not the chat, not the task, not the repo.

**Four chambers:** Lab (investigate) · School (learn) · Creation (build) · Profile (govern).

### Design System

- **Tokens:** `theme.css` — `--r-bg`, `--r-text`, `--r-surface`, `--r-border`, etc.
- **Chamber accents:** Lab `#52796A`, School `#4A6B84`, Creation `#8A6238`
- **Typography:** Inter (UI), JetBrains Mono (system/code)
- **Border radius:** 2px for operational surfaces (mineral shell)
- **Visual law:** Premium, calm, consequence over decoration. Never neon, never clutter.

## Branch Law

- `main` is the only canonical trunk.
- Feature branches are temporary (< 24 hours), merged via squash/fast-forward, then deleted.
- No branch cemetery. No unmerged drift work.

## Output Law

- Podium answer first. One direction. No option menus. No preamble.
- `npm run build` must pass before any commit to main.

## Aspirational Features (Not Yet Real)

| Feature | Status |
|---------|--------|
| Live agent spawning | Pioneers tracked from continuity; no autonomous operation |
| Compound cross-mission synthesis | Nodes accumulate per run; no deep cross-mission reasoning |
| Distribution publish channels | Session-level presence only |
| Value capture billing | Value units minted; no payment integration |
| Ecosystem live sync | Connector extensions tracked; no real-time external sync |
