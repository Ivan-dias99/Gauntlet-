"""Smoke test — Surface chamber real-provider path (Wave 5).

Exercises ``chambers.surface.process_surface_streaming`` with a real
brief that includes a ``design_system`` so the design-system gate
doesn't refuse before reaching the model. Reads ``ANTHROPIC_API_KEY``
from ``signal-backend/.env`` (or the process env, if already set).

Honesty rules:
  - The key is read once and pushed into ``os.environ`` BEFORE
    importing anything from chambers.surface. The script never prints
    the key, never echoes the env line that carries it, and never
    writes it to disk.
  - SSE frames are printed as they arrive. Each frame's ``type`` is
    shown verbatim; large content fields (``plan``, ``answer``) are
    truncated to a short summary so the terminal stays readable.
  - Exit code is meaningful:
        0 → real path succeeded, ``done.mock == False``
        2 → fell back to mock unexpectedly (env or key issue)
        3 → backend emitted an ``error`` frame
        4 → no ``done`` frame received (stream broke)

Run from the repo root:

    python ops/smoke_surface_real.py
"""

from __future__ import annotations

import asyncio
import os
import sys
from pathlib import Path

# ── Locate the repo and load .env ──────────────────────────────────────────

REPO_ROOT = Path(__file__).resolve().parent.parent
BACKEND_DIR = REPO_ROOT / "signal-backend"
ENV_FILE = BACKEND_DIR / ".env"


def load_env() -> None:
    """Hydrate os.environ from signal-backend/.env without printing it."""
    if "ANTHROPIC_API_KEY" in os.environ and os.environ["ANTHROPIC_API_KEY"]:
        return  # already provided by the shell
    if not ENV_FILE.exists():
        sys.stderr.write(
            f"FAIL: {ENV_FILE} not found. Copy signal-backend/.env.example "
            "and fill ANTHROPIC_API_KEY before running this smoke.\n"
        )
        sys.exit(2)
    for raw in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        key = key.strip()
        val = val.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = val


def truncate(value: object, limit: int = 80) -> str:
    s = str(value)
    return s if len(s) <= limit else s[: limit - 1] + "…"


async def main() -> int:
    load_env()

    if not os.environ.get("ANTHROPIC_API_KEY", "").startswith("sk-ant-"):
        sys.stderr.write(
            "FAIL: ANTHROPIC_API_KEY not set or not in expected sk-ant-… format.\n"
        )
        return 2
    if os.environ.get("SIGNAL_SURFACE_MOCK"):
        sys.stderr.write(
            "FAIL: SIGNAL_SURFACE_MOCK is set. This smoke targets the real "
            "path; unset SIGNAL_SURFACE_MOCK and retry.\n"
        )
        return 2
    if os.environ.get("SIGNAL_MOCK") or os.environ.get("RUBERRA_MOCK"):
        sys.stderr.write(
            "FAIL: SIGNAL_MOCK / RUBERRA_MOCK is set. Real path requires a "
            "real provider. Unset both and retry.\n"
        )
        return 2

    # Late imports — config + chambers must read os.environ as we set it.
    sys.path.insert(0, str(BACKEND_DIR))
    from chambers.surface import (  # type: ignore[import-not-found]
        SurfaceBrief,
        process_surface_streaming,
    )

    brief = SurfaceBrief(
        mode="prototype",
        fidelity="hi-fi",
        design_system="Signal Canon",
    )
    question = "Onboarding em 3 telas para um operador novo de Signal."

    print(f"→ brief: mode={brief.mode}, fidelity={brief.fidelity}, "
          f"design_system={brief.design_system}")
    print(f"→ question: {question}")
    print("─" * 60)

    final = None
    saw_error: dict | None = None
    frame_count = 0

    async for frame in process_surface_streaming(question, brief):
        frame_count += 1
        ftype = frame.get("type", "?")
        if ftype == "start":
            print(f"[{frame_count:02d}] start")
        elif ftype == "surface_plan":
            plan = frame.get("plan", {})
            screens = plan.get("screens", [])
            components = plan.get("components", [])
            notes = plan.get("notes", [])
            print(f"[{frame_count:02d}] surface_plan · "
                  f"{len(screens)} screens, {len(components)} components, "
                  f"{len(notes)} notes, mock={plan.get('mock')}")
            for s in screens:
                print(f"      · {s.get('name')}: {truncate(s.get('purpose'), 60)}")
        elif ftype == "done":
            final = frame
            print(f"[{frame_count:02d}] done · "
                  f"mock={frame.get('mock')}, "
                  f"in_tokens={frame.get('input_tokens')}, "
                  f"out_tokens={frame.get('output_tokens')}, "
                  f"latency_ms={frame.get('processing_time_ms')}")
        elif ftype == "error":
            saw_error = frame
            print(f"[{frame_count:02d}] error · "
                  f"code={frame.get('error')}, "
                  f"reason={frame.get('reason')}")
            print(f"      message: {truncate(frame.get('message'), 200)}")
        else:
            print(f"[{frame_count:02d}] {ftype} · {truncate(frame, 100)}")

    print("─" * 60)

    if saw_error:
        print(f"RESULT: error frame received ({saw_error.get('error')}). "
              "Real path did not reach a valid plan.")
        return 3
    if final is None:
        print("RESULT: stream ended without a done frame.")
        return 4
    if final.get("mock", True) is not False:
        print("RESULT: done frame carried mock=True — real path was skipped. "
              "Check env vars and key.")
        return 2
    print(f"RESULT: ok · real path produced a validated SurfacePlan in "
          f"{final.get('processing_time_ms')}ms with "
          f"{final.get('input_tokens')}+{final.get('output_tokens')} tokens.")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
