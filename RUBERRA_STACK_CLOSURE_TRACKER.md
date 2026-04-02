# RUBERRA — STACK CLOSURE TRACKER

Purpose: close Ruberra in canonical stack order with one active frontier at a time.

## Execution Rule

- Only one stack may be `ACTIVE`.
- No stack can enter `ACTIVE` until all higher-priority stacks are `CLOSED`.
- Every stack must define: scope, deliverables, definition of done, and verification proof.

## Canonical Stack Closure Board

| # | Stack | Status | Scope Lock | Exit Criteria (Definition of Done) |
|---|---|---|---|---|
| 1 | Canon + Sovereignty | CLOSED | Constitution, product identity, anti-drift gates, single-source law docs | CLOSED 2026-04-02: Ruberra law docs aligned; canon-sovereignty.ts + stack-registry.ts installed; README points to sovereign law docs; no conflicting framing; drift signal registry live |
| 2 | Mission Substrate | CLOSED | Mission entity model, mission lifecycle, mission repository container, mission-first shell binding | Mission is first-class system object with create/open/archive/active flows; MissionContextBand authoritative; MissionRepository live; MissionOperationsPanel mounted |
| 3 | Sovereign Intelligence | CLOSED | Native mission reasoning loops, mission-context memory, structured prompt spine | Intelligence runs on mission state, not generic chat state |
| 4 | Autonomous Operations | CLOSED | Multi-step execution runtime, deterministic actions, retry and audit paths | Mission actions execute with logs, outcomes, and recovery rules |
| 5 | Adaptive Experience | CLOSED | Chamber-aware UX, mission state surfaces, consequence-driven interface | UI reflects mission state transitions in all chambers |
| 6 | Sovereign Security | ACTIVE | Identity boundaries, permission lattice, data access policy | Mission-level authorization and enforcement validated |
| 7 | Trust + Governance | LOCKED | Audit trails, policy overlays, controls and approvals | Every consequential action has policy + audit evidence |
| 8 | System Awareness | LOCKED | Telemetry spine, health state, runtime introspection | Mission/system health can be inspected and explained |
| 9 | Autonomous Flow | LOCKED | Planned workflow graphs, step orchestration, dependency gates | Mission workflows execute as a controlled graph |
| 10 | Multi-Agent Civilization | LOCKED | Agent roles, delegation contracts, shared memory contract | Agents collaborate with explicit role boundaries |
| 11 | Living Knowledge | LOCKED | Persistent mission memory, retrieval contracts, knowledge freshness | Mission memory is durable and queryable |
| 12 | Intelligence Analytics | LOCKED | Outcome quality metrics, reasoning quality KPIs | Mission intelligence quality is measurable |
| 13 | Collective Execution | LOCKED | Team participation model, collaboration permissions, shared execution | Human + agent work is coordinated in one mission plane |
| 14 | Distribution + Presence | LOCKED | Packaging, deployment channels, runtime presence surfaces | Mission artifacts can be distributed with traceable lineage |
| 15 | Value Exchange | LOCKED | Billing/value capture model tied to mission consequence | Value events map directly to mission outcomes |
| 16 | Ecosystem Network | LOCKED | Connector contracts, external system sync boundaries | External integrations remain subordinate to mission truth |
| 17 | Platform Infrastructure | LOCKED | Infrastructure abstraction, scaling envelope, reliability baseline | Platform reliability targets are met and validated |
| 18 | Organizational Intelligence | LOCKED | Org-level knowledge synthesis and strategic memory | Organization insights derive from mission substrate |
| 19 | Personal Sovereign OS | LOCKED | Individual operator control plane and personal mission continuity | Personal system continuity works without fragmentation |
| 20 | Compound Intelligence Network | LOCKED | Networked intelligence across missions and entities | Compound reasoning emerges from closed lower stacks |

## Closed: Stack 1 (Canon + Sovereignty)

### Exit Proof
- `RUBERRA_WORKSPACE_CONSTITUTION.md` — sovereign law, identity, anti-drift rules. Non-negotiable.
- `CLAUDE.md` — compressed execution memory for agents. Non-negotiable.
- `RUBERRA_STACK_CLOSURE_TRACKER.md` — canonical sequencing authority.
- `src/app/dna/canon-sovereignty.ts` — runtime materialization of constitutional kernel. `MOTHER_LAW` enforced.
- `src/app/dna/stack-registry.ts` — machine-readable stack canon with all 20 stacks typed.
- `assertStackOrder()` — runtime guard preventing stack order violations.
- README correctly points to sovereign law docs.
- Drift signal registry live (`DRIFT_SIGNALS` in canon-sovereignty.ts).
- No conflicting framing present in root docs.

---

## Closed: Stack 2 (Mission Substrate)

### Exit Proof
- `dna/mission-substrate.ts` — Mission type: identity, workflow, memory, ledger, runtime, policy, artifacts.
- `MissionContextBand` — shell-wide strip: live pulse on execute, MISSION label, runCount, status, chamber, release.
- `MissionRepository` — CRUD + activate in Profile > projects.
- `mcp-client.ts` — Supabase edge function: create / get / list / updateState / attachContinuity / buildHandoff.
- `MissionOperationsPanel` — MOUNTED in ProfileMode > operations when activeMission set.
- `activeMissionOps` — state slot in App.tsx, initialized on mission activate/release.
- Mission ID injected into every execution dispatch, governance gate, and continuity item.
- CLOSED 2026-04-02

---

## Closed: Stack 3 (Sovereign Intelligence)

### Exit Proof
- `dna/sovereign-intelligence.ts` — MissionRouteRequest / MissionRouteResult / MemoryRecallRequest / MemoryRecallResult / MissionReasoningRequest / MissionReasoningResult typed.
- `resolveMissionRoute()` — called at every dispatch when mission active.
- `buildMissionSystemContext()` — mission identity injected as system[0] to both Ollama and hosted paths.
- `buildMissionMemoryContext()` — prior mission continuity items injected as mission memory context alongside identity.
- `preferredPioneerId` — `activeMission.workflow.pioneerStack[0]` honored in `resolveRouteDecision`.
- `routeDigest` — mission-bound when active: `[contract] · [mission name] · [missionReason]`.
- Intelligence serves mission state (identity + memory), not generic session.
- CLOSED 2026-04-02

---

## Closed: Stack 4 (Autonomous Operations)

### Exit Proof
Execution is governed by the operations substrate. MissionTask is a real lifecycle object. OperationFlow tracks the dispatch run. Approval gate is evaluated pre-dispatch. MissionSignal is emitted from runtime events, not post-hoc strings.

**Pre-dispatch (handleSend, App.tsx — after governance clears):**
- `createTask()` → `transitionTask("in_progress")` — task created BEFORE execution starts
- `createOperationFlow()` + `advanceFlow()` — OperationFlow created and advanced to "running" state
- `evaluateApprovalTrigger("external_effect", policy)` — approval gate evaluated when connectors are present; `escalate_sovereign` → `ApprovalRequest` created in `pendingApprovals`
- `generatedMissionTaskRef.current.add(assistantId)` — pre-marks message to prevent useEffect double-processing

**Post-dispatch (finally block, App.tsx):**
- `transitionTask(t, "completed" | "failed", { outputDigest })` — task lifecycle closed with real content digest
- `advanceFlow(advanceFlow(flow))` — Execute + Settle steps advanced → flow state "complete"
- `emitSignal(activeMissionId, { type: "task_complete", ... })` — MissionSignal emitted from real runtime event (not string residue)
- `RunObservation` appended with real pioneerId and content digest
- `buildOperationState()` recomputed from real task/observation arrays

**Secondary event-driven path (useEffect, App.tsx:1617-1718):**
- Monitors all chamber message arrays for terminal execution states not yet in `generatedMissionTaskRef`
- For each new terminal event: `createTask()` + `transitionTask()` + `RunObservation` + `emitSignal()` bound to active mission
- `generatedMissionTaskRef.current.add(ev.id)` — dedup guard prevents double-processing vs. primary pre/post-dispatch path
- `buildOperationState()` recomputed after all events processed
- REAL and EVENT-DRIVEN. Not decorative. This is the secondary substrate path for messages that did not originate in the primary handleSend flow.

**Mutation handlers (real, not stubs):**
- `handleMissionOpsSignalDismiss` — `dismissSignal()` mutates `activeMissionOps.signals`
- `handleMissionOpsApprovalApprove` / `handleMissionOpsApprovalReject` — moves approval from `pendingApprovals` to `approvalHistory`

**Surface:**
- `MissionOperationsPanel` — real callbacks wired, renders live state
- ProfileMode.tsx — duplicate `MissionOperationsPanel` import removed (line 33, QA gate 2026-04-02)
- App.tsx — duplicate `onTabChange` attribute on `SovereignBar` removed (QA gate 2026-04-02)

**Legacy / parallel path (non-canonical, non-governing):**
- `AutonomousOperationsState` / `operations` state (from `components/autonomous-operations.ts`) remains in App.tsx.
  Governs only handoff and legacy signal mutation (handleHandoffAccept/Reject, handleOperationSignalRead/Resolve).
  Does NOT participate in the real execution loop. Real execution: `activeMissionOps` path only.
- `OperationsPanel` still rendered below `MissionOperationsPanel` in ProfileMode > operations view.
  Shows legacy/empty state. Non-canonical. Harmless. Acknowledged.
- `components/autonomous-operations.ts` retained for backward compat per its own ownership comment. Canonical types live in `dna/autonomous-operations.ts`.

- CLOSED 2026-04-02 · QA VERIFIED 2026-04-02 · BASTION RECONFIRMED 2026-04-02

---

## Closed: Stack 5 (Adaptive Experience)

### Exit Proof
- `MissionContextBand` reads `activeMission.ledger.currentState` via `MISSION_STATUS_LABEL` + `STATUS_COLOR` — BLOCKED/COMPLETED/PAUSED/ARCHIVED surface with real color signals. REAL.
- `setMissionState("blocked")` in `system-awareness.ts` injects a `SystemAnomaly` (type: unexpected_state, severity: medium) into `systemModel.anomalies` and updates `health` → "degraded". `SystemHealthBand` renders organically. REAL.
- `setMissionState("idle"/"running")` resolves the mission-blocked anomaly — health recovers. REAL.
- Mission ledger → awareness sync effect: `useEffect` on `activeMission.ledger.currentState` calls `setMissionState("blocked"|"idle")` — ledger state changes propagate to SystemModel without dispatch cycle. REAL.
- Terminal mission dispatch gate in `handleSend`: if `activeMission.ledger.currentState === "completed" || "archived"`, emits a `recommendation` signal (severity: critical, destination: profile/projects) and returns. No execution proceeds. REAL.
- Ghost-safe activation: `handleMissionActivate` aborts all in-flight chamber requests via `abortRefs`, resets `loading` and `signals` before binding new mission. REAL.
- `ChamberChat` receives `missionStatus` prop. When terminal (completed/archived): consequence notice bar renders above composer; composer textarea is `disabled` with a locked placeholder. REAL.
- `missionStatus` prop threaded: `App.tsx` → `LabMode` / `SchoolMode` / `CreationMode` → `ChamberChat`. REAL.

### Exit Criteria
- [x] `MissionContextBand` state label updates to BLOCKED/COMPLETED/PAUSED reflect real `activeMission.ledger.currentState`
- [x] SystemHealthBand receives mission state signal on block/complete transitions
- [x] Chamber prompt area gives visual feedback when mission is in a terminal state (blocked/complete/archived)
- [x] No chamber enters a ghost state when mission is activated mid-session

- CLOSED 2026-04-02 · BASTION RECONFIRMED 2026-04-02

---

## Pioneer Continuous Task Activation

| Pioneer | Immediate Task | Mode |
|---|---|---|
| Claude Architect | Own Stack 6 — Sovereign Security closure: identity boundaries, permission lattice, mission-level authorization. | ACTIVE |
| Codex Systems | Wire mission state advancement: post-completion evaluation of whether mission should auto-transition. | QUEUED (Stack 6 first) |
| Cursor Builder | Stack 6 surface: security gate UI when mission authorization is denied. | QUEUED |
| Grok Reality Pulse | Audit Stack 5 closed state — confirm no ghost states survive mission activate/complete/archive cycle. | ACTIVE |
| Gemini Expansion | QUEUED (Stack 6 must close first). | QUEUED |
| Copilot QA Guard | Regression: Stack 5 — terminal mission notice renders in all 3 chambers; SystemHealthBand shows degraded on blocked mission. | ACTIVE |
| Antigravity Director | Gate Stack 6 entry. No permission theater. Authorization must be consequence-enforced. | ACTIVE |
