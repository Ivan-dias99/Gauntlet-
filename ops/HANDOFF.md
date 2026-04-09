# HANDOFF PROTOCOL

Every meaningful transfer of work inside Ruberra must use this structure.

## Required Fields

- Agent
- Task
- Objective
- Scope
- What was decided
- What was produced
- Files / artifacts affected
- What remains unresolved
- Risks
- Canon dependencies
- Recommended next move
- Suggested receiving agent
- Acceptance condition

## Required Close

Every material handoff closes with **two blocks** in sequence:

1. **Handoff block** — the required fields above
2. **Channelization block** — current continuity state for the next operator

Without both, the closure is incomplete.

## Channelization Block

Use this exact structure after the handoff:

```text
CHANNELIZATION:
CHAT: same | new
BRANCH: same | changed
SURFACE: product | ops | visual | architecture | audit
ACTIVE ORGANISM: src/ruberra/
STATE: done | partial | blocked
NEXT OWNER: Ivan | Architect | Visual | Builder | Audit
NEXT MOVE: one-line continuation
```

## Hard Rules

1. No handoff without concrete artifact or concrete decision.
2. No acceptance condition = incomplete handoff.
3. Naming drift must be stated explicitly.
4. If the handoff changes canon, it must say so.
5. If the handoff only speculates and produces no executable pressure, it is weak.
6. Channelization must reflect the real next continuity state, not ceremonial wording.

## Severity Reminder

A handoff can advance work, but it can also spread ambiguity.
Write only what the next role actually needs to move.
