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
   - `ops/RELAY_STATE.md`
   - `brain/00_index/BRAIN_MAP.md`
   - `brain/00_index/QUERY_INDEX.md`
   - `brain/07_agent_interfaces/PIONEER_BRAIN_ENTRY.md`

2. Work only on your branch:
   - `agent-claude`
   - `agent-copilot`
   - `agent-codex`
   - `agent-antigravity`

3. Take only the first eligible task assigned to your lane.

4. Before any high-consequence or ambiguous move:
   - read the relevant Ivan Brain nodes
   - do not improvise founder intent if the brain already defines it

5. When a task is completed, do all of this in sequence:
   - write `ops/AGENT_REPORT.md`
   - name the next pioneer if your completion unlocks one
   - enter rescan mode

6. Rescan mode is mandatory while your session is alive:
   - re-read `ops/NEXT_ACTION.md`
   - re-read `ops/BRIDGE_QUEUE.json`
   - re-read `ops/RELAY_STATE.md`
   - if no eligible task exists for your lane, wait 30 seconds and scan again
   - continue until a real blocker is hit or no further eligible task appears during the live session

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
  TARGET_PIONEER: <claude | copilot | codex | antigravity | none>
  TARGET_TASK: <task id | none>
  TARGET_NOTE: <one line | none>
```

## Hard Rules

- work only inside your lane
- do not change canon unless the task explicitly requires it
- do not touch `src/app/`
- do not take a blocked task before its dependencies are done
- if no task is eligible for you, remain in rescan mode instead of inventing theater
- do not bypass the Ivan Brain on founder-intent, security, authority, or structural questions
