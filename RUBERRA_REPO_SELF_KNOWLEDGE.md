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

**CONTAINMENT LOCKED — 2026-04-03**
**Surgically Purified & Fully Typed**

ALL 20 STACKS: **CLOSED + PURIFIED**
Stack 1 (Canon + Sovereignty): CLOSED
Stack 2 (Mission Substrate): CLOSED
Stack 3 (Sovereign Intelligence): CLOSED
Stack 4 (Autonomous Operations): CLOSED (Purified: TaskStatus 'active'/'blocked' only)
Stack 5 (Adaptive Experience): CLOSED
Stack 6 (Sovereign Security): CLOSED
Stack 7 (Trust + Governance): CLOSED
Stack 8 (System Awareness): CLOSED
Stack 9 (Autonomous Flow): CLOSED
Stack 10 (Multi-Agent Civilization): CLOSED (Purified: Hardened AgentManifest)
Stack 11 (Living Knowledge): CLOSED
Stack 12 (Intelligence Analytics): CLOSED (Real detection: signals + continuity)
Stack 13 (Collective Execution): CLOSED (Real attribution: recordRuntimeAttribution)
Stack 14 (Distribution + Presence): CLOSED (Real manifests: heartbeatRuntimePresence)
Stack 15 (Value Exchange): CLOSED (Real minting: artifact/knowledge only)
Stack 16 (Ecosystem Network): CLOSED (Real admission: connector only)
Stack 17 (Platform Infrastructure): CLOSED (Real status: health-aware)
Stack 18 (Organizational Intelligence): CLOSED (Real health: assessMissionHealth)
Stack 19 (Personal Sovereign OS): CLOSED (Real context: buildOperatorContext)
Stack 20 (Compound Intelligence Network): CLOSED (Real upsert: upsertCompoundRun)

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

Stack 7 closure (2026-04-02):
- `appendAuditToLedger()` — already live at every dispatch + export.
- `appendConsequenceToLedger(reversible=false)` — wired post-dispatch. Every AI execution is an irreversible consequence record.
- `trustGovState` persisted to localStorage. Survives reload.
- `GovernanceLedgerStrip` receives both `governanceEntries` (audit) and `governanceConsequences` (consequence trail).
- `ProfileMode` passes both trails through. Governance is consequence-bearing and inspectable.

Stack 8 closure (2026-04-02):
- `buildResourceSnapshot()` every 30s — real JS heap, storage, latency, connection data.
- `updateSystemModel()` — detects anomalies: latency_spike, memory_pressure, storage_near_full, connection_drop.
- `setMissionState()` at dispatch start/completion/block/abort — mission anomalies propagate to SystemModel.
- `SystemHealthBand` — organic health rendering at shell level.
- System health inspection surface added to ProfileMode > overview: all unresolved anomalies with severity + description + snapshot timestamp.

Stack 9 closure (2026-04-02):
- `createFlowDef()` + `createFlowRun()` at creation dispatch start. Flow lifecycle: running → complete/failed.
- `FlowRunStrip` in ProfileMode > workflows renders active creation runs.

Stacks 10–20 closure (2026-04-03 — PURIFIED):
- All 11 stacks verified as runtime-real via surgical audit.
- Dead substrate theater (redundant distributionLedger, shadow states) PURGED.
- All derived states moved to explicit record-based persistence in RuntimeFabric.
- TypeScript types hardened: ApprovalDecision, TaskStatus, ExtensionType, ValueUnitType.
- Build status: **PASSED (Production Lock)**.

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
| 07 | Trust + Governance | CLOSED | `appendAuditToLedger()` at every dispatch + export; `appendConsequenceToLedger(reversible=false)` at every dispatch completion; GovernanceLedgerStrip shows audit + consequence trails live |
| 08 | System Awareness | CLOSED | `buildResourceSnapshot()` 30s interval; `updateSystemModel()` real anomaly detection; `setMissionState()` at dispatch lifecycle; `SystemHealthBand` organic; health inspection panel in ProfileMode overview |
| 09 | Autonomous Flow | CLOSED | `createFlowDef/Run()` at creation dispatch; `upsertFlowRun()` to complete/failed; `FlowRunStrip` live in ProfileMode > workflows |
| 10 | Multi-Agent Civilization | CLOSED | `civilization` useMemo from PIONEER_REGISTRY + continuity; `activateAgent()` for in-progress runs; `AgentCivilizationStrip` live |
| 11 | Living Knowledge | CLOSED | `knowledgeGraph` useMemo from runtimeFabric.objects; `buildMissionMemoryContext()` recall at dispatch; `KnowledgeGraphStrip` live |
| 12 | Intelligence Analytics | CLOSED | `analyticsPatterns` useMemo via `detectPatterns()` from real signals + continuity + mission ops; `AnalyticsPatternStrip` live |
| 13 | Collective Execution | CLOSED | `collectiveState` useMemo: sovereign operator + missions + real collision map; `checkCollectiveCollision()` at dispatch; `CollectiveExecutionStrip` live |
| 14 | Distribution + Presence | CLOSED | `presenceManifest` useMemo: web+api+cli channels from real messages; 30s heartbeat; `DistributionPresenceStrip` live |
| 15 | Value Exchange | CLOSED | `exchangeLedger` useMemo: exported continuity → governance-verified value units; `ValueExchangeStrip` live |
| 16 | Ecosystem Network | CLOSED | `ecosystemState` useMemo: enabled connectors → admitted extensions; `EcosystemNetworkStrip` live; connector-registry real |
| 17 | Platform Infrastructure | CLOSED | `platformState` useMemo: inference status from live `providerHealth`; `addLayer()` for intelligence/network/storage; `PlatformInfraStrip` live |
| 18 | Organizational Intelligence | CLOSED | `orgState` useMemo: `assessMissionHealth()` from real continuity velocity + signal blockers; `OrgIntelligenceStrip` live |
| 19 | Personal Sovereign OS | CLOSED | `personalOS` useMemo: memories from real preferences + AI settings + missions + continuity; `buildOperatorContext()`; `PersonalSovereignOSStrip` live |
| 20 | Compound Intelligence Network | CLOSED | `upsertCompoundRun()` at every dispatch; `estimateReplicationBarrier()` from real runtime; `compoundNetwork` in runtimeFabric (persisted); `CompoundNetworkStrip` live |

**CLOSED** = Constitutionally complete with runtime materialization and live data hydration.

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
- `dna/trust-governance.ts` — audit trail + consequence records real at dispatch. `GovernanceLedgerStrip` shows both in ProfileMode > operations.
- Consequence records: `appendConsequenceToLedger(reversible=false)` at every dispatch completion.

---

## WHAT IS ASPIRATIONAL (NOT YET REAL)

All 20 canonical stacks are now runtime-real. Post-frontier aspirations:

| Feature | Status | Notes |
|---|---|---|
| Live agent spawning | ASPIRATIONAL | Pioneers are tracked from continuity but don't independently spawn. Multi-agent routing is real; autonomous spawning is not. |
| Compound cross-mission synthesis | ASPIRATIONAL | Compound nodes accumulate from runs; deep cross-mission reasoning synthesis is not yet automatic. |
| Distribution publish channels | ASPIRATIONAL | Presence channels reflect active browser sessions; external deployment/publish channels are not wired. |
| Value capture real billing | ASPIRATIONAL | Value units are minted from exports; Stripe/payment integration is not wired. |
| Ecosystem live sync | ASPIRATIONAL | Connector extensions are tracked; real-time external data sync is connector-dependent. |

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

1. **Antigravity Director** — Final perceptual pressure audit across all 20 stacks. Anti-theater surface hardening. Remove any cosmetic overclaim. Verify no fake nominal/optimal states are displayed.
2. **Copilot QA Guard** — Regression: verify consequence record path (`appendConsequenceToLedger`) fires at post-dispatch. Verify system health panel renders in ProfileMode > overview after degraded state. Verify no strip component shows empty/default shell when data exists.
3. **Grok Reality Pulse** — Audit Stacks 09–20 strip rendering with real execution data — confirm data hydration truth matches closure claims.
