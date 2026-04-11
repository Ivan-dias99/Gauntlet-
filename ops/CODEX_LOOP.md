# CODEX LOOP — Autonomous Restart Runbook

## Purpose

Keep Codex lane alive without manual re-framing.

This runbook defines how Codex continuously checks eligibility and automatically executes the next owned gate when dependencies clear.

## Commands

### One-shot probe

```bash
npm run lane:codex:probe
```

Returns JSON:
- `eligible` → task can start now
- `blocked` → wait for listed dependencies
- `idle` → no remaining codex-owned task

### Continuous loop (30s)

```bash
npm run lane:codex:loop
```

Behavior:
1. scans every 30 seconds
2. writes latest machine-readable state to `ops/CODEX_LOOP_STATE.json`
3. when `eligible`, auto-dispatches mapped command (`W02-B05 -> npm run wave:w02:verify`)

## Current Gate Law

`W02-B05` is executable only when upstream dependencies are done:
- `W02-B04` from queue dependency
- verifier additionally enforces `W02-B01`, `W02-B02`, `W02-B03`, `W02-B04`

## Failure / Recovery

- If loop output is `blocked`, do not force execution.
- If output is `error`, run one-shot probe and inspect `ops/AGENT_REPORT.md` + `ops/BRIDGE_QUEUE.json`.
- Restart loop with `npm run lane:codex:loop`.

## Windows PowerShell Operator Script

Use `ops/codex_loop_windows.ps1` for start/stop/status/tail commands:

```powershell
powershell -ExecutionPolicy Bypass -File .\ops\codex_loop_windows.ps1 -Action start
powershell -ExecutionPolicy Bypass -File .\ops\codex_loop_windows.ps1 -Action status
powershell -ExecutionPolicy Bypass -File .\ops\codex_loop_windows.ps1 -Action tail
powershell -ExecutionPolicy Bypass -File .\ops\codex_loop_windows.ps1 -Action stop
```
