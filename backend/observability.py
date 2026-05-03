"""
Gauntlet — Observability surface (Wave I).

Today the run log captures completed runs and failure_memory captures
explicit refusals. What's missing: a per-route operational view that
shows real-time + recent metrics (latency p50/p95, error rates,
in-flight) without scraping JSON. Wave I adds an in-process metrics
ring buffer + a snapshot helper that /diagnostics can expose.

Wave I v1 is **in-process only**. It survives in-server restarts
(losing data on bounce); a future iteration can ship records to an
external APM (Sentry, Datadog, etc.) but the in-process surface
already gives the operator a fast read on health without pulling
runs.json.
"""

from __future__ import annotations

import time
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from dataclasses import dataclass, field
from typing import AsyncIterator, Optional


@dataclass
class RouteMetric:
    """A single route observation."""
    route: str  # "triad" | "agent" | "crew" | "surface" | "distill" | "validate"
    duration_ms: int
    succeeded: bool
    error_kind: Optional[str] = None
    timestamp: float = field(default_factory=time.time)


# ── Storage ─────────────────────────────────────────────────────────────────
#
# Per-route ring buffer. Kept tight (last 200 per route) because the
# run log is the durable record; this surface is for live dashboards.

_RING_SIZE = 200
_metrics: dict[str, "deque[RouteMetric]"] = defaultdict(lambda: deque(maxlen=_RING_SIZE))

# In-flight counter per route. Incremented on start, decremented on
# end (success or failure). Survives concurrent calls.
_inflight: dict[str, int] = defaultdict(int)


# ── Public API ──────────────────────────────────────────────────────────────


def record(metric: RouteMetric) -> None:
    """Append a metric to the per-route ring."""
    _metrics[metric.route].append(metric)


def start(route: str) -> None:
    """Mark the start of an in-flight call."""
    _inflight[route] = _inflight.get(route, 0) + 1


def end(
    route: str,
    *,
    duration_ms: int,
    succeeded: Optional[bool] = None,
    error_kind: Optional[str] = None,
) -> None:
    """Mark the end of an in-flight call and record the metric.

    `succeeded` defaults to inferred-from-error_kind: if the caller
    passed an error_kind without explicitly setting succeeded, the
    sample is treated as a failure. This avoids the inconsistency
    where a route showed up in error_kinds but errors/error_rate
    undercounted because the default `succeeded=True` won."""
    if succeeded is None:
        succeeded = error_kind is None
    _inflight[route] = max(0, _inflight.get(route, 0) - 1)
    record(RouteMetric(
        route=route,
        duration_ms=duration_ms,
        succeeded=succeeded,
        error_kind=error_kind,
    ))


def _percentile(values: list[int], pct: float) -> int:
    """Compute a percentile from a sorted-able list. No numpy dep."""
    if not values:
        return 0
    s = sorted(values)
    if len(s) == 1:
        return s[0]
    k = (len(s) - 1) * pct
    f = int(k)
    c = min(f + 1, len(s) - 1)
    if f == c:
        return s[f]
    # Linear interpolation
    return int(s[f] + (s[c] - s[f]) * (k - f))


def snapshot() -> dict:
    """Build the full observability snapshot for /diagnostics or a
    Core/System panel. Per-route stats: count, p50, p95, error_rate,
    in_flight."""
    out: dict[str, dict] = {}
    # Iterate the union so routes with active in-flight calls but no
    # completed samples (long-running / first request after boot) still
    # surface in the dashboard instead of vanishing until end() fires.
    routes = set(_metrics.keys()) | set(_inflight.keys())
    for route in routes:
        rows = list(_metrics.get(route, ()))
        in_flight = _inflight.get(route, 0)
        if not rows and in_flight <= 0:
            continue
        durations = [r.duration_ms for r in rows]
        errors = sum(1 for r in rows if not r.succeeded)
        total = len(rows)
        out[route] = {
            "count": total,
            "errors": errors,
            "error_rate": round(errors / total, 4) if total else 0.0,
            "p50_ms": _percentile(durations, 0.5),
            "p95_ms": _percentile(durations, 0.95),
            "max_ms": max(durations) if durations else 0,
            "in_flight": in_flight,
        }
        # Top error kinds
        kinds: dict[str, int] = {}
        for r in rows:
            if r.error_kind:
                kinds[r.error_kind] = kinds.get(r.error_kind, 0) + 1
        if kinds:
            out[route]["error_kinds"] = dict(sorted(kinds.items(), key=lambda kv: kv[1], reverse=True)[:5])

    return {
        "ring_size": _RING_SIZE,
        "routes": out,
        "captured_at": time.time(),
    }


def reset() -> None:
    """Clear all metrics and in-flight counters (tests / explicit ops)."""
    global _metrics, _inflight
    _metrics = defaultdict(lambda: deque(maxlen=_RING_SIZE))
    _inflight = defaultdict(int)


@asynccontextmanager
async def record_route(route: str) -> AsyncIterator[None]:
    """Async context manager wrapping `start`/`end` for a route.

    Wave P-23 introduced this so endpoint handlers can wrap a block
    once instead of pairing start/end manually. Engine paths still use
    the explicit start/end primitives because they record extra
    intermediate state; this is for thin endpoint wrappers.

    Increments in-flight on enter, decrements + records duration and
    success on exit. Re-raises any exception so callers still see the
    failure; the metric carries `error_kind` set to the exception class
    name.

    Usage:
        async with record_route("railway.services"):
            return await list_services(...)
    """
    started = time.monotonic()
    start(route)
    error_kind: Optional[str] = None
    try:
        yield
    except BaseException as exc:  # noqa: BLE001 — preserve all failure kinds
        error_kind = type(exc).__name__
        raise
    finally:
        end(
            route,
            duration_ms=int((time.monotonic() - started) * 1000),
            succeeded=error_kind is None,
            error_kind=error_kind,
        )
