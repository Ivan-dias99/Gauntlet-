# RUBERRA — REPO SELF KNOWLEDGE
**Current Repository Truth · File Map · Architecture State · 2026-04-04**

---

## REPOSITORY IDENTITY

- **Repo:** `Ivan-star-dev/Aiinterfaceshelldesign`
- **Branch law:** `main` is canonical trunk. Feature branches are temporary.
- **Build:** `npm run build` (Vite + TypeScript). No linter. No test runner.
- **Dev server:** `npm run dev` (port 5173)
- **Package manager:** `npm` (not pnpm despite pnpm.overrides in package.json)
- **State persistence:** localStorage via `RuntimeFabric` — no database needed locally
- **Backend:** Supabase Edge Function (remote deployment)
- **Demo mode:** When `OPENAI_API_KEY` is not set server-side, hardcoded demo responses fire

---

## DIRECTORY STRUCTURE

```
/
├── AGENTS.md                               Canonical operating reference (read first)
├── RUBERRA_WORKSPACE_CONSTITUTION.md       Sovereign operating law
├── RUBERRA_MOTHER_BLUEPRINT.md             System architecture blueprint
├── RUBERRA_FOUNDER_SIGNATURE_LAW.md        Immutable laws + creator signature
├── RUBERRA_PRODUCT_TRUTH.md                What is real vs aspirational
├── RUBERRA_EXECUTION_CANON.md              Cascade discipline + task law
├── RUBERRA_REPO_SELF_KNOWLEDGE.md          This file — repo structure
├── RUBERRA_STACK_CLOSURE_TRACKER.md        Stack closure status
├── ATTRIBUTIONS.md                         License and attributions
├── README.md                               Public-facing project summary
├── guidelines/
│   ├── Guidelines.md                       Design + architecture rules
│   └── CURSOR_CASCADE_SURFACE_STATE.md     Cursor task cascade state (2026-03-31)
├── index.html                              Entry HTML
├── package.json                            Dependencies and scripts
├── vite.config.ts                          Vite configuration
├── postcss.config.mjs                      PostCSS / Tailwind config
├── vercel.json                             Deployment config
├── public/
│   └── favicon.svg
├── supabase/                               Edge Function (AI routing)
└── src/
    ├── main.tsx                            Entry point
    ├── app/
    │   ├── App.tsx                         Shell owner (3200+ lines)
    │   ├── components/                     All UI + substrate components
    │   └── dna/                            20-stack machine-readable DNA
    ├── styles/
    │   └── theme.css                       Design tokens
    └── utils/
        └── supabase/
            └── info.tsx                    Supabase URL + anon key
```

---

## KEY SOURCE FILES

### Core Shell
| File | Lines | Purpose |
|------|-------|---------|
| `src/app/App.tsx` | ~3200 | Shell-level owner: routing, execution, all state, mission dispatch |
| `src/app/components/runtime-fabric.ts` | — | Persisted state authority |
| `src/app/components/shell-types.ts` | — | Core type contracts (Tab, View, etc.) |
| `src/app/components/routing-contracts.ts` | — | Route resolution → pioneer selection |
| `src/app/components/pioneer-registry.ts` | — | 7 pioneers: ID, home_chamber, model_family, strengths |
| `src/app/components/model-orchestration.ts` | — | MODEL_REGISTRY: provider/tier/task mapping |
| `src/app/components/intelligence-foundation.ts` | — | IntelligenceFoundationState, resolveRouteDecision() |
| `src/styles/theme.css` | — | CSS custom properties: --r-bg, --r-text, --r-surface, --r-border |
| `src/app/components/tokens.ts` | — | R object: R.sp, R.t, R.c — JS token scale |

### DNA Files (20 Stacks)
| File | Stack |
|------|-------|
| `src/app/dna/stack-registry.ts` | Constitutional layer — all 20 stacks, phases, RUBERRA_IS |
| `src/app/dna/canon-sovereignty.ts` | Stack 01: runIdentityFilter(), MOTHER_LAW, assertStackOrder() |
| `src/app/dna/mission-substrate.ts` | Stack 02: Mission type system |
| `src/app/dna/sovereign-intelligence.ts` | Stack 03: Intelligence routing substrate |
| `src/app/dna/autonomous-operations.ts` | Stack 04: Operations substrate |
| `src/app/dna/sovereign-security.ts` | Stack 06: 8-layer security, evaluateAccess(), scanConnectorOutput(), deriveTrustSignal() |
| `src/app/dna/trust-governance.ts` | Stack 07: Provenance, consequence, policy |
| `src/app/dna/system-awareness.ts` | Stack 08: Health model, buildResourceSnapshot() |
| `src/app/dna/autonomous-flow.ts` | Stack 09: Flow definitions and runs |
| `src/app/dna/multi-agent.ts` | Stack 10: Agent civilization substrate |
| `src/app/dna/living-knowledge.ts` | Stack 11: Knowledge graph |
| `src/app/dna/intelligence-analytics.ts` | Stack 12: Analytics patterns |
| `src/app/dna/collective-execution.ts` | Stack 13: Collective attribution |
| `src/app/dna/distribution-presence.ts` | Stack 14: Presence + channels |
| `src/app/dna/value-exchange.ts` | Stack 15: Value units + ledger |
| `src/app/dna/ecosystem-network.ts` | Stack 16: Connector extensions |
| `src/app/dna/platform-infrastructure.ts` | Stack 17: Platform layers |
| `src/app/dna/org-intelligence.ts` | Stack 18: Org intelligence |
| `src/app/dna/personal-sovereign-os.ts` | Stack 19: Personal OS |
| `src/app/dna/compound-intelligence.ts` | Stack 20: Compound network |

### Chamber Components
| File | Purpose |
|------|---------|
| `src/app/components/HeroLanding.tsx` | Landing/entry surface |
| `src/app/components/SovereignBar.tsx` | Top navigation: chamber switcher, mission context, trust signal |
| `src/app/components/ShellSideRail.tsx` | Left navigation rail |
| `src/app/components/ChamberChat.tsx` | AI interaction surface (all chambers) |
| `src/app/components/BlockRenderer.tsx` | Metamorphic block rendering (chamber-aware) |
| `src/app/components/DiscoveryRail.tsx` | Content discovery for Lab/School/Creation homes |
| `src/app/components/ContentCard.tsx` | Content card renderer |
| `src/app/components/RuberraTerminal.tsx` | Creation terminal surface |
| `src/app/components/ProfileLedger.tsx` | Profile governance view |
| `src/app/components/MissionOperationsPanel.tsx` | Mission operations in Profile |
| `src/app/components/MissionRepository.tsx` | Mission repository surface |
| `src/app/components/SignalsPanel.tsx` | Signals panel |
| `src/app/components/GlobalCommandPalette.tsx` | ⌘K command palette |
| `src/app/components/GlobalExecutionBand.tsx` | Global execution status band |
| `src/app/components/MissionContextBand.tsx` | Mission context display band |
| `src/app/components/SecurityTrustSignal.tsx` | Trust signal component |
| `src/app/components/SystemHealthBand.tsx` | System health status band |
| `src/app/components/FloatingNoteSystem.tsx` | Floating notes system |
| `src/app/components/ModelSelector.tsx` | Model selection UI |
| `src/app/components/OperationsPanel.tsx` | Operations panel |
| `src/app/components/ExecutionConsequenceStrip.tsx` | Stack 04 — Operations strip |
| `src/app/components/GovernanceLedgerStrip.tsx` | Stack 07 — Governance strip |
| `src/app/components/FlowRunStrip.tsx` | Stack 09 — Flow strip |
| `src/app/components/AgentCivilizationStrip.tsx` | Stack 10 — Multi-agent strip |
| `src/app/components/KnowledgeGraphStrip.tsx` | Stack 11 — Knowledge strip |
| `src/app/components/AnalyticsPatternStrip.tsx` | Stack 12 — Analytics strip |
| `src/app/components/CollectiveExecutionStrip.tsx` | Stack 13 — Collective strip |
| `src/app/components/DistributionPresenceStrip.tsx` | Stack 14 — Distribution strip |
| `src/app/components/ValueExchangeStrip.tsx` | Stack 15 — Value strip |
| `src/app/components/EcosystemNetworkStrip.tsx` | Stack 16 — Ecosystem strip |
| `src/app/components/PlatformInfraStrip.tsx` | Stack 17 — Platform strip |
| `src/app/components/OrgIntelligenceStrip.tsx` | Stack 18 — Org strip |
| `src/app/components/PersonalSovereignOSStrip.tsx` | Stack 19 — Personal OS strip |
| `src/app/components/CompoundNetworkStrip.tsx` | Stack 20 — Compound strip |

---

## NAMING CONVENTIONS

- **Pioneer IDs in DNA/runtime:** underscore (`lab_analyst`, `claude_architect`)
- **Pioneer IDs in UI registry:** kebab-case (`lab-analyst`)
- **Mapping:** `id.replace(/_/g, '-')` in `getPioneerFromRuntimeId()` (pioneer-registry.ts)
- **DNA files:** kebab-case (`sovereign-security.ts`)
- **Components:** PascalCase (`SovereignBar.tsx`)

---

## CURRENTLY ACTIVE BRANCH

`copilot/enforce-canonical-qa-standards` — canonical doc installation

---

## KNOWN CONSTRAINTS

- App.tsx is large (~3200 lines). All chamber state lives here by architecture law.
- No test runner. `npm run build` is the only automated quality gate.
- GPG signing may fail in some environments. Use `git -c commit.gpgsign=false commit` if needed.
- Supabase anon key is in source (`utils/supabase/info.tsx`) — this is intentional for the demo tier.

---

*This document reflects repo state as of 2026-04-04.*
*Update after any structural change to the repository.*
