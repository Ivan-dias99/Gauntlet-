# Crew Chamber Status

```
╔════════════════════════════════════════════════════════════╗
║   CREW SUBSYSTEM AUDIT — Wave P-32                         ║
╚════════════════════════════════════════════════════════════╝
```

## TL;DR

Crew is **WIRED but as a Terminal sub-mode, not a standalone chamber**.
Backend endpoint exists, frontend toggles into it, no dedicated chamber UI.

```
Backend endpoint   /crew/stream            EXISTS         ok
CrewOrchestrator   signal-backend/crew.py  IMPLEMENTED    ok
Engine adapter     process_crew_query_…    WIRED          ok
Frontend hook      openSignalCrewStream    WIRED          ok
Standalone chamber src/chambers/crew/      NOT PRESENT    n/a
Terminal sub-mode  RunMode="crew"          WIRED          ok
End-to-end tested  pytest + smoke          NOT VERIFIED   TODO
```

## Findings

### 1. Backend — `/crew/stream` exists

`signal-backend/server.py:475` registers:

```
@app.post("/crew/stream")
async def ask_ruberra_crew_stream(query: SignalQuery): ...
```

It calls `engine.process_crew_query_streaming` (`engine.py:455`), which
delegates to `CrewOrchestrator` (`crew.py:81`). Streamed events:
`crew_start`, `plan`, `role_start`, `role_event`, `role_end`, `verdict`,
`done`.

### 2. Backend — orchestrator implementation

`signal-backend/crew.py` defines `CrewOrchestrator` with the
**planner → researcher → coder → critic** pipeline. Owns its own
`ToolRegistry` (line 98), shares the agent loop machinery via
`agent.py`.

### 3. Frontend — no `src/chambers/crew/` folder

```
src/chambers/
├── archive/
├── core/
├── insight/
├── surface/
├── surface-final/
└── terminal/      <-- crew lives here as RunMode
```

There is **no dedicated Crew chamber**. The five canonical chambers in
`ChamberKey` (`chambers/profiles.py`) remain Insight, Surface, Terminal,
Archive, Core. Crew is intentionally folded into Terminal as a richer
execution mode.

### 4. Frontend — Terminal wires crew

- `src/hooks/useSignal.ts:486` — `openStream<CrewEvent>("crew/stream", …)`
- `src/chambers/terminal/helpers.ts:14` — `RunMode = "agent" | "crew"`
- `src/chambers/terminal/RunCanvas.tsx:143` — `<CrewStrip>` renders
  the streamed plan + role events + critic verdict.
- `src/chambers/terminal/ExecutionComposer.tsx:281` — toggle UI:
  `"agent: loop iterativo · crew: planner → coder → critic"`.

### 5. End-to-end status

- Backend route: **ok** (FastAPI registers it; smoke would require
  running server with a valid Anthropic key).
- Frontend hook: **ok** (TypeScript types align with
  emitted SSE event shapes).
- Live integration: **NOT VERIFIED** in this audit — Wave P-32 is
  cleanup, not regression testing.

## Verdict

```
┌────────────────────────────────────────────────────┐
│  CREW IS WIRED — TERMINAL SUB-MODE, NOT A CHAMBER  │
│  END-TO-END SMOKE TEST: TODO                       │
└────────────────────────────────────────────────────┘
```

Operator action: run `POST /crew/stream` against a deployed backend with
a real prompt and confirm the Terminal `<CrewStrip>` renders the four
roles in order. Mark this doc updated when smoke passes.
