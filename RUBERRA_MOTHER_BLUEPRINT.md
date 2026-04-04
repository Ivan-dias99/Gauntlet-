# RUBERRA — MOTHER BLUEPRINT
**Architectural DNA · System Truth · Installed 2026-04-01**

---

## THE MOTHER LAW

| Dimension | Law |
|-----------|-----|
| **Organism** | One sovereign mission operating system |
| **Spine** | One neural spine — no disconnected sub-products |
| **Unit** | Mission is the atomic unit — not feature, not task, not notification |
| **Chambers** | lab · school · creation (three operational chambers) |
| **Profile** | The sovereign ledger — not a settings page, not a dashboard |
| **Surface law** | Everything visible must produce consequence or be removed |
| **Memory law** | The system remembers — it does not reset between sessions |
| **Fragmentation law** | No surface exists as an island — all things connect |
| **Premium law** | The interface is a workstation, not a consumer app |
| **Calm law** | Mineral and warm stone — never neon, never clutter |

---

## SYSTEM ARCHITECTURE

### Runtime Stack

```
Browser (React + Vite + Tailwind CSS v4)
  ├── src/app/App.tsx                     Shell-level owner: routing, execution, missions, governance
  ├── src/app/components/                 All chamber and strip components
  │   ├── runtime-fabric.ts               Single persisted authority for all state (localStorage)
  │   ├── routing-contracts.ts            Route resolution → pioneer selection
  │   ├── pioneer-registry.ts             7 pioneers: home_chamber, model_family, strengths
  │   ├── model-orchestration.ts          MODEL_REGISTRY: provider/tier/task mapping
  │   ├── intelligence-foundation.ts      Sovereign intelligence routing substrate
  │   ├── SovereignBar.tsx                Top navigation bar
  │   ├── HeroLanding.tsx                 Landing/entry surface
  │   └── shell-types.ts                  Core type contracts
  ├── src/app/dna/                        20-stack machine-readable DNA
  │   ├── stack-registry.ts               Constitutional layer — immutable stack order
  │   ├── canon-sovereignty.ts            Stack 01: identity filter, MOTHER_LAW
  │   ├── mission-substrate.ts            Stack 02: Mission type system
  │   ├── sovereign-intelligence.ts       Stack 03: Intelligence routing
  │   ├── autonomous-operations.ts        Stack 04: Operations substrate
  │   ├── sovereign-security.ts           Stack 06: Security 8-layer system
  │   ├── trust-governance.ts             Stack 07: Provenance + consequence
  │   ├── system-awareness.ts             Stack 08: Health + monitoring
  │   └── ...                             Stacks 09–20
  ├── src/styles/theme.css                Canonical design tokens
  └── supabase/                           Edge Function (AI model routing)
```

### State Architecture

All state flows through `RuntimeFabric` (persisted to localStorage). No database required locally.

```
RuntimeFabric
  ├── continuity[]        Mission continuity items
  ├── missions[]          Full mission objects (Stack 02)
  ├── systemHealth        Awareness substrate (Stack 08)
  ├── knowledgeGraph      Living knowledge (Stack 11)
  ├── presenceManifest    Distribution presence (Stack 14)
  ├── valueExchange       Value units + ledger (Stack 15)
  ├── ecosystemState      Connector extensions (Stack 16)
  ├── platformState       Infrastructure layers (Stack 17)
  └── compoundNetwork     Compound intelligence nodes (Stack 20)
```

App.tsx additionally holds ephemeral state:
- `securityState` (Stack 06) — session integrity, trust signal
- `trustGovState` (Stack 07) — audit trail, consequence ledger
- `flowState` (Stack 09) — flow definitions and runs
- `knowledgeGraph` — computed from RuntimeFabric

---

## FOUR SOVEREIGN ORGANS

### Lab — Investigate
- **Route:** `tab="lab"`
- **Views:** home, experiment, domain, detail
- **Chamber accent:** `#52796A` (sage)
- **Pioneer family:** research, analysis, simulation
- **Core surface:** `ChamberChat` + `DiscoveryRail` + `BlockRenderer`
- **Consequence type:** Evidence objects, retrievable queries, analysis artifacts

### School — Learn
- **Route:** `tab="school"`
- **Views:** home, lesson, track, role, detail
- **Chamber accent:** `#4A6B84` (slate)
- **Pioneer family:** curriculum, mastery, knowledge
- **Core surface:** `ChamberChat` + `DiscoveryRail` + lesson renderer
- **Consequence type:** Lesson objects, curriculum tracks, mastery records

### Creation — Build
- **Route:** `tab="creation"`
- **Views:** home, blueprint, engine, terminal, detail
- **Chamber accent:** `#8A6238` (amber-earth)
- **Pioneer family:** build, execute, ship
- **Core surface:** `ChamberChat` + `RuberraTerminal` + `BlockRenderer`
- **Consequence type:** Build artifacts, execution traces, deployment packages

### Profile — Govern
- **Route:** `tab="profile"`
- **Views:** overview, continuity, missions, signals, ledger
- **Chamber accent:** neutral (sovereign)
- **Pioneer family:** governance, memory, orchestration
- **Core surface:** `ProfileLedger` + `MissionOperationsPanel` + `SignalsPanel`
- **Consequence type:** Mission ledger, continuity records, signal history

---

## PIONEER SYSTEM

7 canonical pioneers are registered in `pioneer-registry.ts`:

| ID | Home Chamber | Model Family | Role |
|----|-------------|--------------|------|
| `lab_analyst` | lab | research | Deep investigation and analysis |
| `lab_auditor` | lab | audit | Evidence-grade audit |
| `school_instructor` | school | curriculum | Structured teaching |
| `school_researcher` | school | research | Knowledge synthesis |
| `creation_architect` | creation | architecture | System design |
| `creation_builder` | creation | engineering | Build execution |
| `creation_terminal` | creation | execution | Terminal operations |

Routing: `routing-contracts.ts` → `resolveRouteDecision()` → pioneer selected per mission context.

---

## MODEL ORCHESTRATION

`model-orchestration.ts` contains `MODEL_REGISTRY` — the canonical provider/tier/task mapping.

Execution path:
1. Task type resolved from chamber + query context
2. Pioneer selected via routing contracts
3. Model resolved via `resolveExecutionPlan()`
4. Supabase Edge Function called with selected model
5. Response streamed and parsed by `BlockRenderer`

---

## DESIGN SYSTEM

Tokens in `src/styles/theme.css` and `src/app/components/tokens.ts` (the `R` object).

| Token | Value |
|-------|-------|
| `--r-bg` | Shell background |
| `--r-surface` | Surface layer |
| `--r-border` | Border |
| `--r-text` | Primary text |
| `--r-hover` | Hover state |
| `--r-selected` | Selected/active state |
| `R.sp.xs` | 4px |
| `R.sp.sm` | 8px |
| `R.sp.md` | 12px |
| `R.sp.lg` | 16px |
| `R.sp.xl` | 24px |
| `R.sp.xxl` | 32px |

Never hard-code visual values that duplicate tokens.

---

## WHAT IS PRESERVED

1. **Mineral Shell aesthetic** — warm pale stone surfaces, restrained semantic colors, breathable spacing
2. **Four-chamber routing** — Lab / School / Creation / Profile
3. **Mission binding** — every action binds to a mission
4. **RuntimeFabric persistence** — everything survives page reload
5. **Stack order** — 01 before 02, 02 before 03, always
6. **Identity filter** — `runIdentityFilter()` enforced in canon-sovereignty.ts
7. **BlockRenderer metamorphic blocks** — chamber-aware rendering
8. **SovereignBar authority** — top navigation, trust signal, mission context

---

*This document encodes the mother blueprint. Read it before designing any surface.*
*Last updated: 2026-04-04*
