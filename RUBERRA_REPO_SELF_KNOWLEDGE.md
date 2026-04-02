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

**Active Stack: 07**
Stack 1 (Canon + Sovereignty): CLOSED
Stack 2 (Mission Substrate): CLOSED
Stack 3 (Sovereign Intelligence): CLOSED 2026-04-02
Stack 4 (Autonomous Operations): CLOSED 2026-04-02
Stack 5 (Adaptive Experience): CLOSED 2026-04-02
Stack 6 (Sovereign Security): CLOSED 2026-04-02

Stack 3 closure (2026-04-02):
- `resolveMissionRoute()` called at every dispatch when mission active.
- Mission pioneer stack honored: `activeMission.workflow.pioneerStack[0]` as `preferredPioneerId`.
- `routeDigest` mission-bound: `[contract] · [mission name] · [missionReason]`.
- `buildMissionSystemContext()` — mission identity (name, objective, scope, notThis, chamber, success criteria) injected as system[0].
- `buildMissionMemoryContext()` — prior mission continuity items (last 4, filtered by mission ID/name) injected alongside identity.
- Intelligence now serves mission identity AND mission memory — not generic session.
- detectPatterns ingests signals + continuity events (mission-linked via workflowId/title).

Stack 4 closure (2026-04-02 — real):
- Pre-dispatch: `createTask()` → `transitionTask("in_progress")` BEFORE execution starts.
- Pre-dispatch: `createOperationFlow()` + `advanceFlow()` — OperationFlow in "running" state at dispatch.
- Pre-dispatch: `evaluateApprovalTrigger("external_effect", policy)` — approval gate evaluated for connector actions; `escalate_sovereign` creates real `ApprovalRequest`.
- Pre-dispatch: `generatedMissionTaskRef.current.add(assistantId)` — deduplication, prevents useEffect double-emit.
- Post-dispatch (finally): `transitionTask(t, "completed"|"failed", {outputDigest})` — real lifecycle close.
- Post-dispatch (finally): `advanceFlow(advanceFlow(flow))` — Execute + Settle steps done → flow "complete".
- Post-dispatch (finally): `emitSignal()` — `task_complete` MissionSignal from real runtime event with content digest.
- Post-dispatch (finally): `RunObservation` appended with pioneerId + digest.
- Mutations: signal dismiss + approval approve/reject — all real setActiveMissionOps mutations.
- `MissionOperationsPanel` wired with real callbacks.

Stack 5 closure (2026-04-02):
- `setMissionState("blocked")` injects `unexpected_state` anomaly into SystemModel → SystemHealthBand renders organically at "degraded" health.
- `setMissionState("idle"/"running")` resolves mission-blocked anomaly — health recovers.
- Mission ledger → awareness sync effect: `useEffect` on `activeMission.ledger.currentState` calls `setMissionState` — ledger transitions propagate to SystemModel outside dispatch cycle.
- Terminal mission dispatch gate: `handleSend` checks `ledger.currentState === "completed" | "archived"` → pushes critical recommendation signal + returns early. No execution on terminal missions.
- Ghost-safe activation: `handleMissionActivate` aborts all in-flight requests + resets loading/signals before binding new mission.
- `ChamberChat` receives `missionStatus` prop — terminal states render consequence notice bar + lock composer textarea.
- `missionStatus` threaded: App.tsx → LabMode / SchoolMode / CreationMode → ChamberChat.

Stack 6 closure (2026-04-02) — QA freeze gate passed 2026-04-02:
- `SovereignSecurityState` instantiated in App.tsx — single source of security truth.
- Operator session started on mount: `createSession(buildFingerprint())` — identity integrity substrate active.
- Session identity re-verified at EVERY dispatch: `verifyFingerprint(session, buildFingerprint())` — fingerprint mismatch emits `session_anomaly` SecurityEvent (critical severity) before governance gate fires.
- Permission lattice enforced at dispatch: `evaluateAccess("mission_execute", pioneerId, defaultAccessPolicy(missionId))` — deny blocks execution + emits SecurityEvent; require_approval emits SecurityEvent.
- Connector output scanned on every AI response completion: `scanConnectorOutput(assistantContent)` — injection/escalation/exfiltration patterns → SecurityEvent → trust signal update.
- Storage safety check periodic (60s): `checkStorageSafety(DEFAULT_RUNTIME_SAFETY_POLICY)` → overflow → SecurityEvent.
- `deriveTrustSignal(securityState.events)` — live trust signal derived from real security state.
- `SecurityTrustSignal` in SovereignBar fed live `trustSignal` prop — silent when healthy, dot when warn, dot + "breach" when critical/breach.
- `handleSecurityAcknowledge` — acknowledges all active events, re-derives signal to "healthy".
- `dna/sovereign-security.ts` — all 8 layers typed and referenced: identity, secrets, access, isolation, connector, runtime, recovery, event ledger.
- governance-fabric.ts bug fixed: `gate?.name` → `gate?.id ?? gate?.label` (TrustGate has no `.name` property; gateName was always undefined).

---

## STACK STATUS BOARD

| # | Stack | Status | Runtime Truth |
|---|---|---|---|
| 01 | Canon + Sovereignty | CLOSED | `dna/canon-sovereignty.ts`, `dna/stack-registry.ts`, `assertStackOrder()` live |
| 02 | Mission Substrate | CLOSED | `dna/mission-substrate.ts`, `MissionContextBand`, `MissionRepository`, `mcp-client.ts`, `MissionOperationsPanel` mounted, `activeMissionOps` in App.tsx |
| 03 | Sovereign Intelligence | CLOSED | `dna/sovereign-intelligence.ts`: `resolveMissionRoute()` at dispatch; `buildMissionSystemContext()` + `buildMissionMemoryContext()` injected as system[0]; pioneer routing from mission.workflow.pioneerStack[0]; `routeDigest` mission-bound |
| 04 | Autonomous Operations | CLOSED | Operations substrate governs dispatch: pre-dispatch task (in_progress) + OperationFlow + approval gate; post-dispatch task lifecycle close + flow advance + MissionSignal from runtime event |
| 05 | Adaptive Experience | CLOSED | MissionContextBand reads real ledger state; SystemHealthBand surfaces mission-blocked anomaly; terminal dispatch gate live; ghost-safe activation; ChamberChat missionStatus lock |
| 06 | Sovereign Security | CLOSED | `SovereignSecurityState` live; session fingerprint re-verified at every dispatch; `evaluateAccess()` gates mission_execute at dispatch; `scanConnectorOutput()` on every AI response; `deriveTrustSignal()` drives SecurityTrustSignal in SovereignBar; storage safety periodic check; governance-fabric gateName bug fixed |
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
- `App.tsx` — ~2315 lines. Shell-level owner of all state. Routing, execution, MCP, mission, governance gate all here.
- `runtime-fabric.ts` — single persisted authority for continuity, signals, connectors, intelligence, workspace.
- `routing-contracts.ts` — real route resolution: resolveRoute() → leads pioneer selection → feeds leadPioneerId into trace.
- `pioneer-registry.ts` — 7 pioneers typed with home_chamber, allowed_crossings, model_family, strengths.
- `model-orchestration.ts` — MODEL_REGISTRY with provider/tier/task mapping.
- Every chat dispatch goes through: `resolveRouteDecision → resolveRoute → execution → trace → surface`.
- **Stack 03 CLOSED**: dispatch when mission active: `resolveRouteDecision (pioneer from mission.workflow.pioneerStack[0]) → resolveMissionRoute (missionReason) → buildMissionSystemContext + buildMissionMemoryContext → contextualHistory injection → execution`.
- Mission pioneer preference: `activeMission.workflow.pioneerStack[0]` → `preferredPioneerId` in routing.
- Mission context system message: identity (name, objective, scope, notThis, chamber, success criteria) + memory (last 4 continuity items for mission) — prepended to every message array sent to both Ollama and hosted endpoints.
- routeDigest when mission active: `[contract label] · [mission name] · [missionReason from resolveMissionRoute]`.

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
| MissionOperationsPanel mounted | DONE | Mounted in ProfileMode > operations when activeMissionOps set |
| activeMissionOps state in App.tsx | DONE | State slot + defaultMissionOperationsState on mission activate |
| Mission pioneer routing | DONE | pioneerStack[0] honored in resolveRouteDecision |
| Mission context at execution time | DONE | Identity + memory system message injected to both Ollama + hosted paths |
| Mission memory recall at dispatch | DONE | buildMissionMemoryContext() injects last 4 continuity items for mission |
| Task creation from execution events | DONE | useEffect in App.tsx:1617-1718 — terminal execution states create MissionTask + RunObservation + MissionSignal; Stack 04 closed |
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

1. **Claude Architect** — Open Stack 6: Sovereign Security — identity boundaries, permission lattice, mission-level authorization enforcement.
2. **Copilot QA Guard** — Regression: Stack 5 close — terminal mission notice in all 3 chambers; SystemHealthBand "degraded" on mission block; ghost-safe activation verified.
3. **Grok Reality Pulse** — Audit Stack 5 for any fake/decorative adaptive behavior remaining. Confirm missionStatus flows correctly for all ledger transitions.
4. **Codex Systems** — Wire mission state advancement post-completion: after task_complete signal, evaluate if mission should auto-transition (Stack 6 dependency).
5. **Cursor Builder** — Stack 6 surface: security gate denial UI for mission-level authorization failures.
