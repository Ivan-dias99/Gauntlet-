# Your First Mission — 5-Minute Walkthrough

```
╔══════════════════════════════════════════════════════════════╗
║   FIVE CHAMBERS · ONE QUESTION · ONE ARTIFACT                ║
║   Insight → Surface → Terminal → Archive → Core              ║
╚══════════════════════════════════════════════════════════════╝
```

> **Pre-flight**: backend is up (`/health` returns 200), frontend is open
> in the browser, and you can see the welcome ribbon.

## 1 · Open Insight (≈60s)

```
┌─ INSIGHT ────────────────────────────────────────────────────┐
│  [composer at top]  ┌─────────────────────────────────────┐   │
│                     │  ask the triad…                     │   │
│                     └─────────────────────────────────────┘   │
│  [triad lane]       reply A · reply B · reply C   ▶ judge    │
│  [verdict pill]     ✓ accept   |   ✗ refuse                  │
└──────────────────────────────────────────────────────────────┘
```

Action:
1. Click the **Insight** tab in the top ribbon.
2. Type a real question, e.g. `What's the smallest API surface for a
   note-taking app?`
3. Press **Send**.

Expect:
- Three response cards stream in parallel (the triad).
- A **judge** pill resolves to either ✓ accept or ✗ refuse with reasoning.
- A new mission appears in the ribbon dropdown — Insight created it.

```
            ▼ if judge refuses, that IS the answer.
            ▼ Ruberra's prime directive: prefer silence to a wrong claim.
```

## 2 · Switch to Surface (≈60s)

```
┌─ SURFACE ────────────────────────────────────────────────────┐
│  [brief panel]      ───  the validated direction from Insight │
│  [plan canvas]      step 1 → step 2 → step 3                  │
│  [seed → terminal]  [send to Terminal] button                 │
└──────────────────────────────────────────────────────────────┘
```

Action:
1. Click **Surface**.
2. Press **Request plan**. Surface reads the latest Insight distillation
   and produces a `surfaceSeed` plus a step list.
3. Inspect each step. If one is wrong, edit it in place.

Expect:
- A short list (3–7 steps) tagged with chamber routing.
- A `seed → Terminal` arrow at the bottom (handoff queue).

## 3 · Switch to Terminal (≈90s)

```
┌─ TERMINAL ───────────────────────────────────────────────────┐
│  [composer]                              mode: [agent|crew]   │
│  [run canvas]                                                 │
│    ▶ tool calls stream in     [read_file] [git] [run_command] │
│    ▶ artifact diff            +/- lines                       │
│  [accept | reject]                                            │
└──────────────────────────────────────────────────────────────┘
```

Action:
1. Click **Terminal**.
2. The handoff banner shows the seed from Surface — click **Pick up**.
3. Toggle the mode pill (bottom-right):
   - **agent** → single iterative loop
   - **crew** → planner → researcher → coder → critic
4. Watch the run canvas — tool calls stream live.
5. Click **Accept** when the artifact looks right (or **Reject** to stop).

Expect:
- A diff or new file in the artifact pane.
- A green "accepted" pill in the timeline.
- The mission state advances; the chamber pill turns dim.

## 4 · Switch to Archive (≈45s)

```
┌─ ARCHIVE ────────────────────────────────────────────────────┐
│  [run ledger]      sealed runs, newest first                  │
│   ├ 2026-05-01 14:31 · insight · accept                       │
│   ├ 2026-05-01 14:33 · surface · plan                         │
│   └ 2026-05-01 14:35 · terminal · agent · accepted            │
│  [drill-down]      tool calls · tokens · judge reasoning      │
└──────────────────────────────────────────────────────────────┘
```

Action:
1. Click **Archive**.
2. Find your run from the last few minutes.
3. Click it — the right panel shows tool calls, token counts, judge
   reasoning, and the final artifact.

Expect:
- Three rows for your mission (Insight · Surface · Terminal).
- Token totals and processing time per row.

## 5 · Switch to Core (≈45s)

```
┌─ CORE ───────────────────────────────────────────────────────┐
│  [spine snapshot]   missions · principles · activeMissionId   │
│   {                                                          │
│     "missions": [ { id, title, chamber, notes, tasks, … } ], │
│     "principles": [ … ],                                     │
│     "activeMissionId": "abc-123",                            │
│     "updatedAt": 1714566915000                               │
│   }                                                          │
│  [download json]    [diagnostics link]                       │
└──────────────────────────────────────────────────────────────┘
```

Action:
1. Click **Core**.
2. Read your mission entry — every action you took is here.
3. Click **/diagnostics** to verify boot honesty (mock vs. real, persistence).

Expect:
- Your mission ID matches the Archive rows.
- `chamber` field shows where you left off (probably `terminal`).
- `notes`/`tasks`/`events` arrays carry the full breadcrumb trail.

```
╔══════════════════════════════════════════════════════════════╗
║   You drove a question through every chamber and back to     ║
║   the spine. That round-trip IS the mission.                 ║
╚══════════════════════════════════════════════════════════════╝
```

## Where to go next

```
  ▶ /diagnostics       see boot posture, security layers, persistence
  ▶ RUNBOOK.md         operational guide (cutover, rollback, backup)
  ▶ docs/CREW_CHAMBER_STATUS.md   when to use crew mode in Terminal
```
