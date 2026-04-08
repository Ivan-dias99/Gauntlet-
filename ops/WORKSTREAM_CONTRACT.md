# Workstream Contract Format

Every active workstream in this repo must have a contract that satisfies this format.  
No workstream may begin execution without a confirmed contract.

---

## Contract Schema

```
# WS[N] — [Workstream Name]

**Status:** OPEN | ACTIVE | CLOSED | BLOCKED  
**Owner:** [operator / agent / unassigned]  
**Scope locked:** [date]  
**Target close:** [milestone or date]

---

## Objective

One sentence. What this workstream delivers.

## Inputs

- What must exist before this workstream can start

## Outputs

- What must exist when this workstream closes

## Constraints

- What this workstream must NOT do
- Any hard limits (file scope, no runtime changes, etc.)

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blocking dependencies

- None | List of WS numbers or external items
```

---

## Rules

1. **One objective per contract.** If two objectives exist, split into two workstreams.
2. **Constraints are mandatory.** A contract with no constraints section is not valid.
3. **Acceptance criteria are binary.** Each item is checkable as pass/fail.
4. **Status must be kept current.** A stale status is treated as BLOCKED.
5. **Closed contracts are immutable.** Do not reopen; create a new workstream.

---

## Active workstreams

See `ops/MILESTONE_TRACKER.md` for milestone-level status.  
Workstream detail files live in `guidelines/` or inline in agent session context.
