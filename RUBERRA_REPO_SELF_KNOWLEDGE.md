# RUBERRA — REPO SELF-KNOWLEDGE
**Living document. Updated at each major frontier advance.**
**Read this before any session. It tells you where reality is.**

---

## WHAT RUBERRA IS

A sovereign mission operating system. Not a SaaS dashboard. Not a generic AI wrapper. Not a chat product with plugins.

The core unit is the **mission**. Every run, every output, every decision is bound to a mission.

Four sovereign organs: **Lab** (investigate) · **School** (learn) · **Creation** (build) · **Profile** (govern).

---

## CURRENT SOVEREIGN FRONTIER

**Active Stack: 02 — Mission Substrate**

Stack 1 closed 2026-04-02. Stack 2 is open.

Stack 2 open residue:
- `MissionOperationsPanel` is built (`src/app/components/MissionOperationsPanel.tsx`) but not yet mounted. Must appear in ProfileMode when a mission is active.
- `activeMissionOps` state not yet in App.tsx. Needs `defaultMissionOperationsState(activeMissionId)` on mission activation.
- Mission-to-operations binding (task creation from execution events) not yet wired.

---

## STACK STATUS BOARD

| # | Stack | Status | Runtime Truth |
|---|---|---|---|
| 01 | Canon + Sovereignty | CLOSED | `dna/canon-sovereignty.ts`, `dna/stack-registry.ts`, `assertStackOrder()` live |
| 02 | Mission Substrate | ACTIVE | `dna/mission-substrate.ts`, `MissionContextBand`, `MissionRepository`, `mcp-client.ts` wired |
| 03 | Sovereign Intelligence | PARTIAL | `dna/sovereign-intelligence.ts` typed; routing-contracts.ts + pioneer-registry.ts live; EI name surfaces in LiveHeaderRail and GlobalExecutionBand |
| 04 | Autonomous Operations | PARTIAL | `dna/autonomous-operations.ts` canonical; `components/autonomous-operations.ts` legacy (OperationsPanel uses it); MissionOperationsPanel uses dna/ version |
| 05 | Adaptive Experience | PARTIAL | ChamberChat + RuberraTerminal fully reconstituted; LiveHeaderRail with cycling state; MissionContextBand authoritative; chamber accent wiring solid |
| 06 | Sovereign Security | PARTIAL | SecurityTrustSignal in SovereignBar; RUBERRA_TRUST_GATES active; `governance-fabric.ts` live |
| 07 | Trust + Governance | PARTIAL | `enforceExecutionGate()` on every dispatch; audit entry in trustGovState; GovernanceLedgerStrip in ProfileMode |
| 08 | System Awareness | PARTIAL | `SystemHealthBand` live; `GlobalExecutionBand` live with eiName + live pulse; `awareness-substrate.ts` typed |
| 09 | Autonomous Flow | PARTIAL | `dna/autonomous-flow.ts` typed; FlowRunStrip in ProfileMode |
| 10 | Multi-Agent Civilization | PARTIAL | `dna/multi-agent.ts` typed; AgentCivilizationStrip in ProfileMode; no live agent spawning |
| 11 | Living Knowledge | PARTIAL | `dna/living-knowledge.ts` typed; KnowledgeGraphStrip in ProfileMode |
| 12 | Intelligence Analytics | PARTIAL | `dna/intelligence-analytics.ts` typed; AnalyticsPatternStrip in ProfileMode |
| 13 | Collective Execution | PARTIAL | `dna/collective-execution.ts` typed; CollectiveExecutionStrip in ProfileMode |
| 14 | Distribution + Presence | PARTIAL | `dna/distribution-presence.ts` typed; DistributionPresenceStrip in ProfileMode |
| 15 | Value Exchange | PARTIAL | `dna/value-exchange.ts` typed; ValueExchangeStrip in ProfileMode |
| 16 | Ecosystem Network | PARTIAL | `dna/ecosystem-network.ts` typed; EcosystemNetworkStrip in ProfileMode; connector-registry.ts live |
| 17 | Platform Infrastructure | PARTIAL | `dna/platform-infrastructure.ts` typed; PlatformInfraStrip in ProfileMode; sovereign-runtime.ts live |
| 18 | Organizational Intelligence | PARTIAL | `dna/org-intelligence.ts` typed; OrgIntelligenceStrip in ProfileMode |
| 19 | Personal Sovereign OS | PARTIAL | `dna/personal-sovereign-os.ts` typed; PersonalSovereignOSStrip in ProfileMode |
| 20 | Compound Intelligence Network | PARTIAL | `dna/compound-intelligence.ts` typed; CompoundNetworkStrip in ProfileMode |

**PARTIAL** = DNA typed + strip component mounted in ProfileMode but data hydration is not live.
**CLOSED** = Constitutionally complete with runtime materialization.
**ACTIVE** = Currently being worked to closure.

---

## WHAT IS REAL (VERIFIED LIVE)

### Execution core
- `App.tsx` — ~1630 lines. Shell-level owner of all state. Routing, execution, MCP, mission, governance gate all here.
- `runtime-fabric.ts` — single persisted authority for continuity, signals, connectors, intelligence, workspace.
- `routing-contracts.ts` — real route resolution: resolveRoute() → leads pioneer selection → feeds leadPioneerId into trace.
- `pioneer-registry.ts` — 7 pioneers typed with home_chamber, allowed_crossings, model_family, strengths.
- `model-orchestration.ts` — MODEL_REGISTRY with provider/tier/task mapping.
- Every chat dispatch goes through: `resolveRouteDecision → resolveRoute → execution → trace → surface`.

### Mission surface
- `dna/mission-substrate.ts` — Mission type: identity, workflow, memory, ledger, runtime, policy, artifacts.
- `MissionContextBand` — shell-wide strip with live pulse when executing, MISSION label, runCount, status, chamber, release.
- `MissionRepository` — full CRUD + activate in Profile > projects.
- `mcp-client.ts` — wired to Supabase edge function: create / get / list / updateState / attachContinuity / buildHandoff.
- Mission ID injected into every execution dispatch, governance gate, and continuity item.

### Chat surface
- `ChamberChat.tsx` — fully reconstituted: LiveHeaderRail (EI name + cycling ROUTING→ANALYZING→THINKING), ConsequenceTypeTag, MutableFooter, ProvenanceTrace (suppressed when ExecutionConsequenceStrip covers it), AgentLabel (role chip only — no manifesto).
- `ExecutionConsequenceStrip.tsx` — ALL-CAPS state labels; debug phases filtered; ROUTE badge on routeDigest.
- `GlobalExecutionBand.tsx` — bottom strip: eiName from leadPioneerId, chamber accent, live pulse.

### Terminal surface
- `RuberraTerminal.tsx` — fully reconstituted: command strip (chamber·model·mission·state), TerminalLayerBadge (TRACE/ARTIFACT/DIFF/RESULT/WARN/HANDOFF), layer inference on text blocks, mission-aware empty state.

### Governance
- `governance-fabric.ts` — `enforceExecutionGate()` active on every `chamber.*.dispatch`.
- `dna/trust-governance.ts` — audit trail appended per dispatch.
- `GovernanceLedgerStrip` mounted in ProfileMode > operations.

---

## WHAT IS ASPIRATIONAL (NOT YET REAL)

| Feature | Status | File |
|---|---|---|
| MissionOperationsPanel mounted | NOT DONE | `components/MissionOperationsPanel.tsx` — orphaned |
| activeMissionOps state in App.tsx | NOT DONE | No slot, no defaultMissionOperationsState wiring |
| Task creation from execution events | NOT DONE | Operations substrate not yet event-driven |
| Live agent spawning (multi-agent) | NOT DONE | dna/multi-agent.ts typed, no runtime spawn |
| Knowledge retrieval from missions | NOT DONE | dna/living-knowledge.ts typed, no retrieval |
| Flow graph execution | NOT DONE | dna/autonomous-flow.ts typed, no actual execution |
| Distribution channels | NOT DONE | dna/distribution-presence.ts typed, no real channels |
| Value capture events | NOT DONE | dna/value-exchange.ts typed, no real value events |
| Compound reasoning | NOT DONE | dna/compound-intelligence.ts typed, no cross-mission synthesis |

---

## OWNERSHIP MAP

| Domain | Owner | Files |
|---|---|---|
| Constitutional truth | Claude Architect | canon-sovereignty.ts, stack-registry.ts, RUBERRA_WORKSPACE_CONSTITUTION.md |
| Mission substrate | Claude Architect | dna/mission-substrate.ts, MissionContextBand.tsx, MissionRepository.tsx |
| Intelligence routing | Claude Architect | routing-contracts.ts, pioneer-registry.ts, model-orchestration.ts |
| Shell-level state | Claude Architect | App.tsx (routing, governance, EI, mission binding) |
| Chat surface | Claude Architect | ChamberChat.tsx, ExecutionConsequenceStrip.tsx, GlobalExecutionBand.tsx |
| Terminal surface | Claude Architect | RuberraTerminal.tsx |
| Operations substrate | Codex Systems | dna/autonomous-operations.ts, components/autonomous-operations.ts |
| Operation surface | Codex Systems | OperationsPanel.tsx, MissionOperationsPanel.tsx |
| Execution adapters | Codex Systems | execution-adapters.ts, runtime-fabric.ts |
| Flow engine | Codex Systems | dna/autonomous-flow.ts, workflow-engine.ts |
| Product data | Cursor Builder | product-data.ts, object-graph.ts |
| Chamber modes | Cursor Builder | modes/LabMode.tsx, SchoolMode.tsx, CreationMode.tsx, ProfileMode.tsx |
| Security gate | Copilot QA Guard | governance-fabric.ts, dna/sovereign-security.ts |
| Governance surface | Copilot QA Guard | GovernanceLedgerStrip.tsx, dna/trust-governance.ts |
| Strategic sequencing | Antigravity Director | RUBERRA_STACK_CLOSURE_TRACKER.md, ANTIGRAVITY_LEDGER.md |

---

## CANONICAL FILES — DO NOT DUPLICATE

| Purpose | Canonical File |
|---|---|
| Sovereign law | RUBERRA_WORKSPACE_CONSTITUTION.md |
| Agent memory | CLAUDE.md |
| Stack closure | RUBERRA_STACK_CLOSURE_TRACKER.md |
| Repo self-knowledge | RUBERRA_REPO_SELF_KNOWLEDGE.md (this file) |
| Mission types | src/app/dna/mission-substrate.ts |
| Operations types | src/app/dna/autonomous-operations.ts (canonical) |
| Operations types (legacy) | src/app/components/autonomous-operations.ts (for OperationsPanel only — do not extend) |
| Pioneer registry | src/app/components/pioneer-registry.ts |
| Runtime state | src/app/components/runtime-fabric.ts |
| Constitutional runtime | src/app/dna/canon-sovereignty.ts |

---

## ANTI-DRIFT SIGNALS

If you see any of these, something has drifted:
- A new surface that doesn't connect to a mission → `violates MOTHER_LAW.fragmentation_law`
- A "dashboard" with cards and progress bars → `drift signal: dashboard`
- An empty state with cheerful placeholder copy → `drift signal: theater`  
- A strip component that renders hardcoded data → `drift signal: fake data theater`
- A PR that skips stack order → `drift signal: stack order violation`
- An operation or task not bound to a mission → `drift signal: mission detachment`

---

## NEXT PIONEER ACTIONS

1. **Claude Architect** — Mount MissionOperationsPanel in ProfileMode > operations when activeMission set. Wire `activeMissionOps` in App.tsx. Close Stack 2.
2. **Codex Systems** — Wire execution completion events into dna/autonomous-operations.ts task creation. Give the operations surface real data.
3. **Cursor Builder** — Build mission-select prompt on first message when no mission is active. Make mission the first gravity.
4. **Grok Reality Pulse** — Audit routing-contracts.ts vs actual pioneer selection in App.tsx — confirm they align.
5. **Copilot QA Guard** — After Stack 2 close, regression sweep: all 4 chambers must surface mission context when active.
