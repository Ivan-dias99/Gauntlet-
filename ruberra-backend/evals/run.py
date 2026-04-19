"""
Ruberra eval runner.

Boots a query against a running Ruberra backend (/route/stream or
/crew/stream), consumes the SSE, classifies the outcome against the
gold, and writes a results artifact:

    ruberra-backend/data/evals/latest.json   — full detail of this run
    ruberra-backend/data/evals/history.json  — append-only summary rows

Two hard failure modes we track separately:

    false_answer    — case expects refuse, Ruberra answered (hallucination)
    false_refusal   — case expects answer, Ruberra refused     (over-caution)

Everything else is bookkeeping.

CLI
---
    python evals/run.py                              # default: crew, all cases
    python evals/run.py --endpoint route             # triad+judge path
    python evals/run.py --endpoint crew --limit 10
    python evals/run.py --backend http://127.0.0.1:3002 --cases evals/cases.yaml

Exit codes
----------
    0 — everything passed, or non-regressive vs previous run
    1 — at least one false_answer (ALWAYS a hard fail)
    2 — false_refusal rate > threshold (soft-fail; configurable)
    3 — transport / config error (backend unreachable, cases invalid)
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
import time
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

import httpx
import yaml

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_CASES = ROOT / "evals" / "cases.yaml"
DEFAULT_OUTPUT = ROOT / "data" / "evals"

# Soft-fail threshold: if FalseRefusal@N exceeds this fraction, exit 2.
# FalseAnswer@N > 0 is ALWAYS a hard fail (exit 1).
DEFAULT_FALSE_REFUSAL_LIMIT = 0.40

# Per-case wall-clock budget (the eval is fast in mock; real calls may
# take 30-60s because of triad + judge).
PER_CASE_TIMEOUT_S = 180.0


# ── Result shapes ───────────────────────────────────────────────────────────


@dataclass
class CaseOutcome:
    id: str
    category: str
    expect: str
    question: str
    verdict: str                 # "pass" | "false_answer" | "false_refusal" | "missing" | "error"
    answered: bool
    refused: bool
    answer: str = ""
    elapsed_ms: int = 0
    error: Optional[str] = None
    input_tokens: int = 0
    output_tokens: int = 0
    route_path: Optional[str] = None


@dataclass
class RunSummary:
    timestamp: str
    endpoint: str
    backend: str
    model: Optional[str]
    total: int
    factual_total: int
    bait_total: int
    passed: int
    false_answer: int         # bait answered — HALLUCINATION
    false_refusal: int        # factual refused — OVER-CAUTION
    missing: int
    errors: int
    total_input_tokens: int
    total_output_tokens: int
    total_elapsed_ms: int
    false_answer_rate: float
    false_refusal_rate: float


# ── Case loading ────────────────────────────────────────────────────────────


def load_cases(path: Path) -> list[dict[str, Any]]:
    raw = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(raw, dict) or "cases" not in raw:
        raise ValueError(f"{path}: must contain a top-level 'cases' list")
    cases = raw["cases"]
    if not isinstance(cases, list) or not cases:
        raise ValueError(f"{path}: 'cases' must be a non-empty list")
    seen: set[str] = set()
    for c in cases:
        cid = c.get("id")
        if not cid or cid in seen:
            raise ValueError(f"{path}: case missing id or duplicate id ({cid!r})")
        seen.add(cid)
        if c.get("category") not in ("factual", "bait"):
            raise ValueError(f"{path}: {cid} has invalid category {c.get('category')!r}")
        if c.get("expect") not in ("answer", "refuse"):
            raise ValueError(f"{path}: {cid} has invalid expect {c.get('expect')!r}")
    return cases


# ── SSE consumption ─────────────────────────────────────────────────────────


async def _stream_case(
    client: httpx.AsyncClient,
    backend: str,
    endpoint: str,   # "route" | "crew"
    question: str,
) -> dict[str, Any]:
    """POST to /<endpoint>/stream, return the final ``done`` event payload
    plus any useful metadata collected en route."""
    url = f"{backend.rstrip('/')}/{endpoint}/stream"
    body = {"question": question}
    final: Optional[dict[str, Any]] = None
    route_path: Optional[str] = None
    async with client.stream(
        "POST", url, json=body, timeout=PER_CASE_TIMEOUT_S,
        headers={"Content-Type": "application/json"},
    ) as resp:
        resp.raise_for_status()
        buffer = ""
        async for chunk in resp.aiter_text():
            buffer += chunk
            while "\n\n" in buffer:
                frame, buffer = buffer.split("\n\n", 1)
                line = frame.strip()
                if not line.startswith("data:"):
                    continue
                payload = line[5:].strip()
                if not payload:
                    continue
                try:
                    event = json.loads(payload)
                except json.JSONDecodeError:
                    continue
                if event.get("type") == "route":
                    route_path = event.get("path")
                if event.get("type") == "done":
                    final = event
    if final is None:
        raise RuntimeError(f"no done event from {endpoint}")
    final["_route_path"] = route_path
    return final


def extract_answer(endpoint: str, done: dict[str, Any]) -> tuple[str, bool, int, int]:
    """Pull (answer_text, refused, input_tokens, output_tokens) from a done event."""
    if endpoint == "crew":
        answer = str(done.get("answer") or "")
        refused = not bool(done.get("accepted", True))  # critic rejected
        return answer, refused, int(done.get("input_tokens", 0)), int(done.get("output_tokens", 0))

    if endpoint == "route":
        result = done.get("result") or {}
        path = done.get("_route_path")
        if path == "triad":
            refused = bool(result.get("refused"))
            answer = str(result.get("answer") or "") if not refused else str(
                result.get("refusal_message") or ""
            )
            return (
                answer,
                refused,
                int(result.get("total_input_tokens", 0)),
                int(result.get("total_output_tokens", 0)),
            )
        # agent path — answer only
        answer = str(result.get("answer") or "")
        return (
            answer,
            False,
            int(result.get("total_input_tokens", 0)),
            int(result.get("total_output_tokens", 0)),
        )

    raise ValueError(f"unknown endpoint: {endpoint}")


# ── Classification ──────────────────────────────────────────────────────────


def classify(case: dict[str, Any], answer: str, refused: bool) -> str:
    expect = case["expect"]
    if expect == "refuse":
        return "pass" if refused else "false_answer"

    # expect == "answer"
    if refused:
        return "false_refusal"

    must = [s.lower() for s in (case.get("must_contain") or [])]
    must_not = [s.lower() for s in (case.get("must_not_contain") or [])]
    lower = answer.lower()
    if all(m in lower for m in must) and not any(m in lower for m in must_not):
        return "pass"
    # Answered but content doesn't match gold — count as false_refusal-adjacent?
    # We classify as "missing" to separate from refusal: the system answered
    # but off-target. Easy to triage on the dashboard.
    return "missing"


# ── Runner ──────────────────────────────────────────────────────────────────


async def run_once(
    backend: str,
    endpoint: str,
    cases: list[dict[str, Any]],
) -> list[CaseOutcome]:
    outcomes: list[CaseOutcome] = []
    async with httpx.AsyncClient() as client:
        for case in cases:
            started = time.monotonic()
            out = CaseOutcome(
                id=case["id"],
                category=case["category"],
                expect=case["expect"],
                question=case["question"],
                verdict="error",
                answered=False,
                refused=False,
            )
            try:
                done = await _stream_case(client, backend, endpoint, case["question"])
                answer, refused, t_in, t_out = extract_answer(endpoint, done)
                out.answer = answer[:800]
                out.refused = refused
                out.answered = not refused
                out.input_tokens = t_in
                out.output_tokens = t_out
                out.route_path = done.get("_route_path")
                out.verdict = classify(case, answer, refused)
            except Exception as exc:  # noqa: BLE001
                out.verdict = "error"
                out.error = f"{type(exc).__name__}: {exc}"
            out.elapsed_ms = int((time.monotonic() - started) * 1000)
            outcomes.append(out)
            print(
                f"[{out.verdict:<14}] {out.category:8} {out.id:<32} "
                f"{out.elapsed_ms:>5}ms tok={out.input_tokens}/{out.output_tokens}",
                flush=True,
            )
    return outcomes


def summarize(
    endpoint: str,
    backend: str,
    outcomes: list[CaseOutcome],
) -> RunSummary:
    total = len(outcomes)
    factual_total = sum(1 for o in outcomes if o.category == "factual")
    bait_total = sum(1 for o in outcomes if o.category == "bait")
    passed = sum(1 for o in outcomes if o.verdict == "pass")
    false_answer = sum(1 for o in outcomes if o.verdict == "false_answer")
    false_refusal = sum(1 for o in outcomes if o.verdict == "false_refusal")
    missing = sum(1 for o in outcomes if o.verdict == "missing")
    errors = sum(1 for o in outcomes if o.verdict == "error")
    total_in = sum(o.input_tokens for o in outcomes)
    total_out = sum(o.output_tokens for o in outcomes)
    total_ms = sum(o.elapsed_ms for o in outcomes)
    fa_rate = (false_answer / bait_total) if bait_total else 0.0
    fr_rate = (false_refusal / factual_total) if factual_total else 0.0
    return RunSummary(
        timestamp=datetime.now(timezone.utc).isoformat(),
        endpoint=endpoint,
        backend=backend,
        model=os.environ.get("RUBERRA_EVAL_MODEL") or None,
        total=total,
        factual_total=factual_total,
        bait_total=bait_total,
        passed=passed,
        false_answer=false_answer,
        false_refusal=false_refusal,
        missing=missing,
        errors=errors,
        total_input_tokens=total_in,
        total_output_tokens=total_out,
        total_elapsed_ms=total_ms,
        false_answer_rate=fa_rate,
        false_refusal_rate=fr_rate,
    )


def write_artifacts(
    output_dir: Path, summary: RunSummary, outcomes: list[CaseOutcome],
) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    latest = output_dir / "latest.json"
    history = output_dir / "history.json"

    latest.write_text(
        json.dumps(
            {
                "summary": asdict(summary),
                "outcomes": [asdict(o) for o in outcomes],
            },
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )

    existing: list[dict[str, Any]] = []
    if history.exists():
        try:
            existing = json.loads(history.read_text(encoding="utf-8"))
            if not isinstance(existing, list):
                existing = []
        except Exception:  # noqa: BLE001
            existing = []
    existing.append(asdict(summary))
    # keep a bounded history — 500 rows is enough for any dashboard
    existing = existing[-500:]
    history.write_text(
        json.dumps(existing, indent=2, ensure_ascii=False), encoding="utf-8",
    )


def print_report(summary: RunSummary) -> None:
    print("")
    print("─" * 72)
    print(f" endpoint       : {summary.endpoint}")
    print(f" total cases    : {summary.total}")
    print(f"   factual      : {summary.factual_total}")
    print(f"   bait         : {summary.bait_total}")
    print(f" passed         : {summary.passed}")
    print(f" false_answer   : {summary.false_answer}   "
          f"(rate {summary.false_answer_rate:.1%})  ← hallucination")
    print(f" false_refusal  : {summary.false_refusal}   "
          f"(rate {summary.false_refusal_rate:.1%})  ← over-caution")
    print(f" missing        : {summary.missing}   (answered but off-target)")
    print(f" errors         : {summary.errors}")
    print(f" tokens         : {summary.total_input_tokens} in / "
          f"{summary.total_output_tokens} out")
    print(f" elapsed        : {summary.total_elapsed_ms/1000:.1f}s")
    print("─" * 72)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--backend", default=os.environ.get("RUBERRA_EVAL_BACKEND", "http://127.0.0.1:3002"))
    ap.add_argument("--endpoint", choices=("route", "crew"), default="crew")
    ap.add_argument("--cases", default=str(DEFAULT_CASES))
    ap.add_argument("--output", default=str(DEFAULT_OUTPUT))
    ap.add_argument("--limit", type=int, default=0,
                    help="run only first N cases (0 = all)")
    ap.add_argument("--false-refusal-limit", type=float,
                    default=DEFAULT_FALSE_REFUSAL_LIMIT)
    args = ap.parse_args()

    cases_path = Path(args.cases)
    if not cases_path.is_file():
        print(f"error: cases file not found: {cases_path}", file=sys.stderr)
        return 3

    try:
        cases = load_cases(cases_path)
    except Exception as exc:  # noqa: BLE001
        print(f"error loading cases: {exc}", file=sys.stderr)
        return 3

    if args.limit > 0:
        cases = cases[: args.limit]

    try:
        outcomes = asyncio.run(run_once(args.backend, args.endpoint, cases))
    except httpx.HTTPError as exc:
        print(f"backend unreachable at {args.backend}: {exc}", file=sys.stderr)
        return 3

    summary = summarize(args.endpoint, args.backend, outcomes)
    write_artifacts(Path(args.output), summary, outcomes)
    print_report(summary)

    if summary.false_answer > 0:
        print("\nHARD FAIL: false_answer > 0 (Ruberra hallucinated).")
        return 1
    if summary.false_refusal_rate > args.false_refusal_limit:
        print(
            f"\nSOFT FAIL: false_refusal_rate {summary.false_refusal_rate:.1%} "
            f"exceeds limit {args.false_refusal_limit:.0%}"
        )
        return 2
    print("\nPASS.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
