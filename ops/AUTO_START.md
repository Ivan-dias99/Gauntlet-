# AUTO START — Sovereign Pioneers

This file is the single entrypoint for Claude, Copilot, Codex, and Antigravity.

If you are a sovereign pioneer opening this repository, do this in order:

1. Read:
   - `CURRENT_RUNTIME_AUTHORITY.md`
   - `ops/CANONICAL_TRUTH.md`
   - `ops/PIONEER_MATRIX.md`
   - `ops/WAVE_02.md`
   - `ops/DISPATCH_001.md`
   - `ops/NEXT_ACTION.md`
   - `ops/BRIDGE_QUEUE.json`

2. Work only on your branch:
   - `agent/claude`
   - `agent/copilot`
   - `agent/codex`
   - `agent/antigravity`

3. Take only the first eligible task assigned to your lane.

4. Do not invent a second direction.

5. At close, update `ops/AGENT_REPORT.md` on your agent branch using the required block below.

## Required Report Block

```text
BRIDGE_HANDOFF
  TASK_ID: <task id>
  PIONEER: <claude | copilot | codex | antigravity>
  STATUS: <done | partial | blocked>
  SUMMARY: <one paragraph>
  FILES: <comma-separated files>
  NEXT_MOVE: <one line>
  ACCEPTANCE: <met | unmet>
```

## Hard Rules

- work only inside your lane
- do not change canon unless the task explicitly requires it
- do not touch `src/app/`
- do not take a blocked task before its dependencies are done
- if no task is eligible for you, remain standby and do not create theater
