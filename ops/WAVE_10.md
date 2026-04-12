# WAVE 10 — Autonomous Flow & Agent Civilization

## Vision
The organism can now compound intelligence across threads. The next frontier: the organism must be able to *propose its own next steps*, *chain directives autonomously*, and *coordinate multiple agents* working on the same mission.

## Primary Objective
Advance **Stack 09 (Autonomous Flow)** from OPEN to PARTIAL and **Stack 10 (Multi-Agent Civilization)** from OPEN to PARTIAL. Advance **Stack 04 (Autonomous Operations)** from PARTIAL toward CLOSED.

## Key Targets
1. **Directive Proposal**: Executions can propose follow-up directives. The organism drafts its own next steps.
2. **Flow Engine**: Directives can be chained into multi-step flows with branching logic (retry, fallback).
3. **Agent Registry**: Named agents with capabilities can be registered, assigned directives, and tracked.

## Role Lancets

### Claude (Builder — Spine Logic)
- **W10-B01: Autonomous Directive Proposal**: Add `directive.proposed` event type, `emit.proposeDirective()` emitter, projection logic for pending proposals, and `emit.acceptProposal()` to promote a proposal to a real directive.
- **W10-B02: Flow Engine Spine**: Add `Flow` type, `flow.defined`/`flow.step.completed`/`flow.completed` events, flow projection, and `emit.defineFlow()`/`emit.completeFlowStep()` emitters.
- **W10-B03: Agent Registry**: Add `Agent` type, `agent.registered`/`agent.assigned` events, agent projection, and `emit.registerAgent()`/`emit.assignDirective()` emitters. Wire `execution.progressed` event (already defined, never emitted).

### Antigravity (Visual Owner)
- **W10-B04: Autonomous Flow Surface**: Wire flow and agent data into Creation chamber. Show pending proposals, active flows, and agent assignment badges.

### Codex (Audit)
- **W10-B05: Wave 10 Verification Gate**: Verify autonomous flow spine logic, agent registry, and flow engine pass five-proof test.

## Acceptance Condition
The organism can propose its own directives, chain them into multi-step flows, and register agents that can be assigned work. All new logic is event-sourced, append-only, and projection-driven.
