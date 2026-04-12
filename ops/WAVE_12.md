# WAVE 12 — Autonomous Scheduling & Sovereign Security

## Vision
The organism observes itself (W11), proposes its own next steps (W10), and now must
**act on its own schedule** without losing **sovereign authority over what may run**.
W12 closes the loop between awareness and consequence: anomalies and proposals stop
being passive signals and become scheduled work, while every scheduled action is gated
by an explicit, event-sourced security posture.

## Primary Objective
- Advance **Stack 04 (Autonomous Operations)** from PARTIAL → CLOSED.
- Open **Stack 06 (Sovereign Security)** from OPEN → PARTIAL with at least one
  observable surface.
- Lift **Stack 09 (Autonomous Flow)** from PARTIAL → CLOSED via a visible Creation
  surface that ties scheduled flows back to architect oversight.

## Gate Entry
GATE_W12_OPEN — emitted by W11-B05 (System Awareness & Intelligence Analytics
verified, 152/152 tests passing, build clean).

## Brain-Routed Authority
Per `ops/NEXT_ACTION.md` brain routing rule, W12 design is anchored against:
- `brain/05_security/SECURITY_POSTURE.md` — security is structural, not auth-only.
- `brain/05_security/EXECUTION_PERMISSIONS.md` — no execution without explicit scope;
  destructive actions require justification + confirmation path.
- `brain/05_security/TRUST_BOUNDARIES.md` — sovereign main, lane ownership, and
  destructive-change boundaries.
- `brain/05_security/AGENT_ISOLATION.md` — agents share truth, not uncontrolled authority.
- `brain/06_protocols/ANTI_DRIFT.md` and `brain/06_protocols/MERGE_DISCIPLINE.md` —
  no silent mutation, no fake completion.

W12 must NOT introduce any execution path that bypasses these laws. Every scheduled
or auto-promoted action MUST emit a real event and be visible in a chamber surface.

## Key Targets
1. **Scheduling spine**: directives can carry a schedule (`runAt`, `recurrence`,
   `triggerCondition`) and the spine emits real `schedule.*` events when work becomes
   eligible. No silent ticks — every fire is in the event log.
2. **Security posture spine**: a `SecurityPosture` projection enforces explicit
   permissions per actor/lane/scope; every execution start consults the posture and
   either proceeds, downgrades to `null.consequence`, or emits `security.denied`.
3. **Autonomous loop**: anomalies (W11) and directive proposals (W10) can be promoted
   to scheduled directives automatically when the security posture allows it; otherwise
   they queue for explicit architect acceptance.
4. **Visible consequence**: a Creation surface shows the autonomous flow queue,
   pending schedules, denied actions, and the trust boundary that gated each one.

## Role Lancets

### Claude (Builder — Spine Logic)

**W12-B01 — Scheduling Spine**
- New event types in `src/ruberra/spine/events.ts`:
  - `schedule.defined` — directive given a schedule
  - `schedule.fired` — schedule eligibility evaluated to true
  - `schedule.cancelled` — schedule withdrawn (with reason)
  - `schedule.skipped` — schedule fire blocked by security posture (with reason)
- New types in `src/ruberra/spine/projections.ts`:
  - `Schedule { id, directiveId, runAt?, recurrence?, triggerCondition?, status }`
  - `ScheduleStatus = "armed" | "fired" | "cancelled" | "skipped"`
- New emitters in `src/ruberra/spine/store.ts`:
  - `emit.scheduleDirective(directiveId, schedule)`
  - `emit.fireSchedule(scheduleId)` — must consult security posture before firing
  - `emit.cancelSchedule(scheduleId, reason)` — reason required (Law of Consequence)
- New projections:
  - `armedSchedules(repo)` — schedules eligible for fire
  - `scheduleHistory(repo)` — append-only fire/skip/cancel ledger
- Rule: a `schedule.fired` event MUST be the parent of any resulting
  `execution.started`. The causal chain stays in the event log.

**W12-B02 — Sovereign Security Spine**
- New event types in `src/ruberra/spine/events.ts`:
  - `security.posture.set` — actor declares scope/permissions for a lane
  - `security.permission.granted` — explicit grant for a destructive scope
  - `security.permission.revoked` — grant withdrawn (with reason)
  - `security.denied` — execution or schedule fire blocked, with reason and source rule
- New types:
  - `SecurityScope = "reversible" | "consequential" | "destructive"`
  - `SecurityRule { actor, lane, scope, allowed, justification }`
  - `SecurityPosture { rules: SecurityRule[], grants: SecurityGrant[] }`
- New emitters:
  - `emit.setSecurityPosture(rules)`
  - `emit.grantPermission(actor, scope, justification)`
  - `emit.revokePermission(grantId, reason)`
  - `emit.denySecurity(targetEventId, rule, reason)` — used by spine when an
    execution or schedule.fire is rejected
- New projection: `securityPosture(repo)` returns the active rule set + active grants.
- Wired into `emit.startExecution()` and `emit.fireSchedule()`: any consequential
  or destructive scope without an active grant emits `security.denied` and a
  paired `null.consequence` instead of starting work.
- Tests must prove: (a) a `destructive` execution without a grant is denied,
  (b) the deny event is in the event log, (c) the projection reflects the deny.

**W12-B03 — Autonomous Promotion Loop**
- New emitter `emit.promoteAnomaly(anomalyId)` — promotes a W11 anomaly into a
  scheduled directive when allowed by posture; emits `security.denied` otherwise.
- New emitter `emit.promoteProposal(proposalId)` — same path for W10 directive
  proposals (already accepted manually today).
- New projection: `autonomousQueue(repo)` — anomalies + proposals eligible for
  auto-promotion under the active security posture, plus reasons for any blocked.
- Rule: promotion is itself an event (`proposal.accepted` causal child of the
  anomaly/proposal). No promotion bypasses the projection or security check.

### Antigravity (Visual Owner — Creation Surface)

**W12-B04 — Autonomous Flow Surface (Creation chamber)**
- Wire `armedSchedules`, `scheduleHistory`, and `autonomousQueue` into
  `src/ruberra/chambers/Creation.tsx`.
- Render:
  - **Pending Schedules** — armed schedules with run condition + actor + scope
  - **Autonomous Queue** — anomalies/proposals eligible for promotion, with the
    posture rule that gates each one
  - **Denied Actions** — recent `security.denied` events with the rule that
    blocked them and the architect remediation path
  - **Schedule Ledger** — last N `schedule.fired` / `schedule.skipped` /
    `schedule.cancelled` lines
- Empty states must follow trust hospitality (`trust/Unavailable.tsx` patterns):
  no fake data, no mocked schedules, explicit "no autonomous activity yet" copy.
- Must close Stack 09's surface gap: scheduled flows surface in Creation alongside
  the existing flow data from W10.

### Codex (Audit)

**W12-B05 — Wave 12 Verification Gate**
- Five-proof check against `src/ruberra/`:
  1. Logic exists in `spine/store.ts`, `spine/events.ts`, `spine/projections.ts`
  2. State derived from event log via projections (no hidden useState clocks)
  3. Visible surfaces in Creation chamber + EventPulse denial badge (if added)
  4. Real events fire during a session: `schedule.defined`, `schedule.fired`,
     `security.posture.set`, `security.denied`, `proposal.accepted` (autonomous)
  5. Observable consequence: an anomaly auto-promoted to a scheduled directive,
     and a destructive action denied by posture, both visible without dev tools.
- Build: must remain clean (Vite build, 0 errors).
- Tests: existing 152 must remain green; W12 adds at minimum 12 new tests covering
  schedule lifecycle, security deny path, and autonomous promotion.
- Update `RUBERRA_STACK_CLOSURE_TRACKER.md`:
  - Stack 04 → ✅ CLOSED (with evidence block)
  - Stack 06 → 🔶 PARTIAL (with evidence block — first observable security surface)
  - Stack 09 → ✅ CLOSED (with evidence block — Creation surface now wired)
- Emit `GATE_W13_OPEN` only after all five proofs pass.

## Acceptance Condition
The organism can:
- accept a directive on a schedule and watch the scheduler fire it without architect
  click-through, with the fire visible in the event log and Creation chamber;
- refuse to fire a schedule whose actor or scope lacks a security grant, emitting
  `security.denied` and a paired `null.consequence`;
- auto-promote an anomaly into a scheduled directive when the security posture
  allows, surfacing the promotion as a normal `proposal.accepted` causal chain;
- show the architect, in Creation, exactly which scheduled work is armed, which
  was fired, which was denied, and which boundary stopped each denial.

No scheduled action may run outside the event log.
No security check may be bypassed by a faster code path.
No surface may render mocked schedule data.

## Five-Proof Verification (template for W12-B05)

### Stack 04 — Autonomous Operations
1. Logic exists in `spine/store.ts` (scheduleDirective, fireSchedule) +
   `spine/projections.ts` (armedSchedules, autonomousQueue, scheduleHistory)
2. State derived from event log via projections (Schedule list rebuilt from events)
3. Visible surface in Creation chamber (Pending Schedules + Schedule Ledger)
4. Real events fire: `schedule.defined`, `schedule.fired`, `schedule.skipped`
5. Observable: anomaly auto-promoted to scheduled directive without architect click

### Stack 06 — Sovereign Security
1. Logic exists in `spine/store.ts` (setSecurityPosture, grantPermission,
   revokePermission, denySecurity) + `spine/projections.ts` (securityPosture)
2. State derived from event log via projections (rules + grants rebuilt from events)
3. Visible surface in Creation chamber (Denied Actions panel)
4. Real events fire: `security.posture.set`, `security.denied`,
   `security.permission.granted`
5. Observable: a destructive directive without a grant is blocked with a visible reason

### Stack 09 — Autonomous Flow (closure proof)
1. Logic already exists in spine (W10) — W12 adds scheduling layer over flows
2. Flows + schedules derived from event log (no useState mirror)
3. Visible surface added in Creation chamber: scheduled flows alongside flow data
4. Real events fire: `flow.defined` + `schedule.defined` linkage
5. Observable: a multi-step flow fires its first step on a schedule, visible in
   Creation without dev tools

## Gate Emitted (on closure)
GATE_W13_OPEN — Autonomous scheduling and sovereign security operational.

## Sovereignty Note
W12 is the wave where the organism stops being a passive observer and starts
acting on its own clock. That power is only legitimate if every action is
gated by an explicit, event-sourced security posture and visible to the architect.
The whole point of routing through `brain/05_security/` is to refuse the temptation
to add a "fast path" that lets autonomous work run outside the event log. There is
no fast path. The event log is the law.
