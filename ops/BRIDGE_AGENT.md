# BRIDGE AGENT — Ruberra

## Purpose

The Ruberra Bridge Agent coordinates sovereign pioneers through the repository.
It does not replace pioneers.
It does not generate product truth.
It does:
- parse bridge handoffs from `agent/*` branches
- update `ops/BRIDGE_STATE.md`
- emit wave gates when criteria are met
- detect stalled lanes
- write `ops/NEXT_ACTION.md`

## Trigger Model

- push to `agent/**`
- manual `workflow_dispatch`
- scheduled stall check

## Inputs

- `ops/BRIDGE_QUEUE.json`
- `ops/PIONEER_MATRIX.md`
- `ops/AGENT_REPORT.md` on each agent branch

## Outputs

- `ops/BRIDGE_STATE.md`
- `ops/NEXT_ACTION.md`
- `ops/GATE_*.md`
- `ops/STALL_REPORT_*.md`

## Law

The Bridge Agent may coordinate.
It may not invent new product direction.
Canon still lives above the bridge.
