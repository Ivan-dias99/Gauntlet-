"""
Gauntlet — in-memory token-bucket rate limiter (Wave P-31, Layer 2).

Per ``(client_ip, route_class)`` token bucket. Each bucket has a burst
capacity and a refill rate (tokens/second). Every request costs one
token; an empty bucket emits a typed 429 with ``retry_after_ms`` so the
frontend can pace itself without parsing prose.

Route classes (matched against the request path prefix):

  ``agent``   — /ask, /route, /route/stream, /dev, /dev/stream,
                /crew/stream, /insight/*, /surface/*
                burst 10, refill 2/s. Heavy AI calls; cheap to DoS by
                repetition because each one fans out to Anthropic.

  ``spine``   — /spine GET/POST
                burst 60, refill 30/s. Chamber autosave hits this every
                500ms while the operator types — must absorb that
                without throttling honest writes.

  ``read``    — /runs*, /memory*, /diagnostics, /observability*, /git/*
                burst 30, refill 10/s. Cheap reads; still bounded so a
                misbehaving dashboard can't pin the worker.

  ``external``— /figma/*, /vercel/*, /railway/*, /issues/*
                burst 10, refill 2/s. Each call hits a third-party API
                that has its own quota — protect both us and them.

  ``auth``    — reserved for future /auth/* endpoints; same shape as
                ``external`` for now.

  ``default`` — anything else. burst 20, refill 5/s.

Disable globally via ``GAUNTLET_RATE_LIMIT_DISABLED=1`` (dev escape hatch;
legacy ``SIGNAL_RATE_LIMIT_DISABLED`` still honoured as fallback, removed
in v1.1.0). ``GAUNTLET_TRUST_PROXY=1`` switches the IP source from
``request.client.host`` to the leftmost ``X-Forwarded-For`` entry — only
flip this on when the deploy actually sits behind a trusted proxy
(Vercel edge, Railway router), otherwise any client can spoof itself
into someone else's bucket.

State is process-local. Multiple workers will each have their own
buckets; for a hard global cap a Redis-backed limiter would replace this
module without changing the middleware contract.

Bucket dimensions:

  * ``(ip, route_class)`` — always evaluated. Cheap baseline that bounds
    abuse from a single source even when no auth is in play.
  * ``(api_key_hash, route_class)`` — evaluated when the request carries
    a Bearer token. A leaked key would otherwise let a single attacker
    cycle through residential IPs and stay under the per-IP cap; the
    per-key bucket caps the key itself regardless of source IP. The key
    is sha256'd before use so the bucket map never holds the raw secret
    (logs, core dumps, ``RateLimiter.reset`` test paths).

When both dimensions apply, BOTH must permit the request. The 429
response reports the dimension that tripped (``ip`` or ``api_key``) on
``detail.scope`` so the frontend can tell the operator which surface to
back off.
"""

from __future__ import annotations

import hashlib
import logging
import threading
import time
from dataclasses import dataclass
from typing import Callable, Optional

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

logger = logging.getLogger("gauntlet.rate_limit")


@dataclass(frozen=True)
class BucketSpec:
    """Capacity (max tokens) + refill rate (tokens/second)."""
    burst: int
    refill_per_sec: float


# Class table — order matters only for readability.
ROUTE_CLASSES: dict[str, BucketSpec] = {
    "agent": BucketSpec(burst=10, refill_per_sec=2.0),
    "spine": BucketSpec(burst=60, refill_per_sec=30.0),
    "read": BucketSpec(burst=30, refill_per_sec=10.0),
    "external": BucketSpec(burst=10, refill_per_sec=2.0),
    "auth": BucketSpec(burst=10, refill_per_sec=2.0),
    "default": BucketSpec(burst=20, refill_per_sec=5.0),
}

# Public probes are never rate limited — they must answer for the
# orchestrator regardless of upstream load.
EXEMPT_PATHS: frozenset[str] = frozenset({"/health", "/health/ready"})


def classify(path: str) -> str:
    """Return the route class for a request path. Longest-match-first."""
    # Spine — most specific (single root + autosave hot path).
    if path == "/spine" or path.startswith("/spine/"):
        return "spine"

    # External integrations — third-party calls.
    if (
        path.startswith("/figma/")
        or path.startswith("/design/figma/")
        or path.startswith("/vercel/")
        or path.startswith("/railway/")
        or path.startswith("/issues/")
    ):
        return "external"

    # Read endpoints (cheap GETs).
    if (
        path.startswith("/runs")
        or path.startswith("/memory")
        or path == "/diagnostics"
        or path.startswith("/observability")
        or path.startswith("/gateway")
        or path.startswith("/git/")
    ):
        return "read"

    # Agent / triad / chamber — heavy AI calls.
    if (
        path == "/ask"
        or path.startswith("/ask/")
        or path == "/route"
        or path.startswith("/route/")
        or path == "/dev"
        or path.startswith("/dev/")
        or path.startswith("/crew/")
        or path.startswith("/insight/")
        or path.startswith("/surface/")
    ):
        return "agent"

    return "default"


class _Bucket:
    """Single token bucket. Lock-free reads + one mutex for the refill +
    take cycle. Each bucket is touched by at most one request at a time
    in the typical case, so contention stays low."""

    __slots__ = ("tokens", "last_refill", "spec", "_lock")

    def __init__(self, spec: BucketSpec) -> None:
        self.tokens = float(spec.burst)
        self.last_refill = time.monotonic()
        self.spec = spec
        self._lock = threading.Lock()

    def take(self, cost: float = 1.0) -> tuple[bool, float]:
        """Try to consume ``cost`` tokens. Returns (allowed, retry_after_ms)."""
        with self._lock:
            now = time.monotonic()
            elapsed = now - self.last_refill
            if elapsed > 0:
                self.tokens = min(
                    float(self.spec.burst),
                    self.tokens + elapsed * self.spec.refill_per_sec,
                )
                self.last_refill = now
            if self.tokens >= cost:
                self.tokens -= cost
                return True, 0.0
            # Fractional time until enough tokens accumulate.
            deficit = cost - self.tokens
            seconds = deficit / self.spec.refill_per_sec if self.spec.refill_per_sec > 0 else 60.0
            return False, max(seconds * 1000.0, 1.0)

    def refund(self, cost: float = 1.0) -> None:
        """Return ``cost`` tokens to the bucket — used by the limiter when
        a multi-dimension check passed on this dimension but failed on a
        sibling, so the caller is not charged twice for one rejection."""
        with self._lock:
            self.tokens = min(float(self.spec.burst), self.tokens + cost)


def _hash_key(api_key: str) -> str:
    """SHA-256 of the API key — the bucket map never stores the secret
    itself, so a logged ``RateLimiter`` repr or a heap dump cannot leak
    it back. Prefix with ``k:`` to keep the key/IP namespaces disjoint
    in case an IP literal ever happens to look like a hash."""
    return "k:" + hashlib.sha256(api_key.encode("utf-8")).hexdigest()


# Maximum number of buckets the limiter holds before LRU eviction
# kicks in. Under honest load the working set is small (active IPs ×
# active keys × 6 route classes); a hard cap defends against memory
# pressure when the working set explodes (botnet IPs, key rotation,
# or attacker probing). Eviction is by last-touched, which is the
# behaviour you want — recently-active callers stay budgeted, idle
# callers re-allocate fresh buckets (full burst) on their next hit.
_DEFAULT_MAX_BUCKETS = 20_000


class RateLimiter:
    """In-memory token-bucket store keyed by
    ``(scope, identifier, route_class)``. ``scope`` is ``"ip"`` or
    ``"api_key"`` so the two dimensions never collide. LRU-evicting
    when the bucket count exceeds ``max_buckets`` so the map cannot
    grow without bound across process lifetime."""

    def __init__(self, max_buckets: int = _DEFAULT_MAX_BUCKETS) -> None:
        # OrderedDict so we can ``move_to_end`` on touch and
        # ``popitem(last=False)`` to drop the LRU entry.
        from collections import OrderedDict
        self._buckets: "OrderedDict[tuple[str, str, str], _Bucket]" = OrderedDict()
        self._max_buckets = int(max_buckets)
        self._lock = threading.Lock()

    def _bucket_for(self, scope: str, identifier: str, route_class: str) -> _Bucket:
        key = (scope, identifier, route_class)
        with self._lock:
            b = self._buckets.get(key)
            if b is not None:
                # Touch — move to MRU end so eviction targets the
                # genuinely cold callers, not the active one.
                self._buckets.move_to_end(key)
                return b
            spec = ROUTE_CLASSES.get(route_class, ROUTE_CLASSES["default"])
            b = _Bucket(spec)
            self._buckets[key] = b
            # LRU eviction when the map exceeds its budget. Drop the
            # least-recently-used entries (front of the OrderedDict).
            while len(self._buckets) > self._max_buckets:
                self._buckets.popitem(last=False)
            return b

    def check(
        self,
        ip: str,
        path: str,
        api_key: Optional[str] = None,
    ) -> tuple[bool, float, str, str]:
        """Return ``(allowed, retry_after_ms, route_class, scope)``.

        Evaluates the IP bucket first; only consults the per-key bucket
        when the IP bucket admitted the request AND ``api_key`` is
        non-empty. BOTH dimensions must permit. ``scope`` is the
        dimension that tripped on rejection, or ``"ok"`` when allowed.
        If the per-key check trips after the IP check passed, the IP
        token is refunded so a deny on one dimension does not silently
        drain the other.

        The IP-first short-circuit also closes a memory-DoS vector: a
        client whose IP bucket is already empty cannot force creation
        of new ``(api_key, route_class)`` entries by rotating bearer
        tokens — the per-key bucket is only allocated for requests we
        were going to evaluate anyway. ``_buckets`` therefore grows at
        the rate of *admitted* IPs × keys × route classes, not at the
        rate of incoming requests.
        """
        klass = classify(path)
        ip_bucket = self._bucket_for("ip", ip, klass)
        ip_allowed, ip_retry = ip_bucket.take()
        if not ip_allowed:
            # IP already over budget — do not allocate or touch the
            # per-key bucket. Scope reports "ip" because that is the
            # dimension that tripped; the caller is not being charged
            # for a key bucket that was never created.
            return False, ip_retry, klass, "ip"
        if not api_key:
            return True, 0.0, klass, "ok"
        key_bucket = self._bucket_for("api_key", _hash_key(api_key), klass)
        key_allowed, key_retry = key_bucket.take()
        if key_allowed:
            return True, 0.0, klass, "ok"
        # Key bucket tripped — refund the IP token we just consumed so
        # this one rejection only costs one bucket's worth of tokens.
        ip_bucket.refund()
        return False, key_retry, klass, "api_key"

    def reset(self) -> None:
        """Test hook — drop all buckets."""
        with self._lock:
            self._buckets.clear()


# Module-level limiter so multiple middleware instances (re-imports under
# tests) share state cleanly. Re-bound when ``RateLimitMiddleware`` is
# instantiated with a fresh limiter.
_default_limiter = RateLimiter()


def _client_ip(request: Request, trust_proxy: bool) -> str:
    """Resolve a client IP for bucketing.

    Direct: ``request.client.host``. Behind a proxy: leftmost
    ``X-Forwarded-For`` entry. ``trust_proxy`` MUST be operator-confirmed
    because any client can send their own XFF; trusting it on a public
    deploy lets attackers cycle synthetic IPs and bypass the limiter.
    """
    if trust_proxy:
        xff = request.headers.get("x-forwarded-for") or request.headers.get("X-Forwarded-For")
        if xff:
            first = xff.split(",", 1)[0].strip()
            if first:
                return first
    if request.client and request.client.host:
        return request.client.host
    # TestClient sometimes leaves client unset; bucket all such requests
    # under a stable sentinel so the limiter still applies (and tests
    # remain deterministic).
    return "anonymous"


def _bearer_token(request: Request) -> Optional[str]:
    """Extract the Bearer token from the Authorization header for
    per-key bucketing. Returns ``None`` if the header is absent or
    malformed — the auth middleware will reject malformed headers
    further down the pipeline, this is just opportunistic identification
    for the limiter."""
    header = request.headers.get("authorization") or request.headers.get("Authorization")
    if not header:
        return None
    scheme, _, token = header.partition(" ")
    if scheme.strip().lower() != "bearer":
        return None
    token = token.strip()
    return token or None


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Drop-in middleware. Inactive when ``disabled=True``."""

    def __init__(
        self,
        app,
        disabled: bool = False,
        trust_proxy: bool = False,
        limiter: Optional[RateLimiter] = None,
    ) -> None:
        super().__init__(app)
        self._disabled = bool(disabled)
        self._trust_proxy = bool(trust_proxy)
        self._limiter = limiter or _default_limiter

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if self._disabled:
            return await call_next(request)
        if request.method == "OPTIONS":
            return await call_next(request)
        if request.url.path in EXEMPT_PATHS:
            return await call_next(request)

        ip = _client_ip(request, self._trust_proxy)
        api_key = _bearer_token(request)
        allowed, retry_ms, klass, scope = self._limiter.check(
            ip, request.url.path, api_key=api_key,
        )
        if not allowed:
            retry_int = int(retry_ms)
            return JSONResponse(
                status_code=429,
                content={
                    "detail": {
                        "error": "rate_limit_exceeded",
                        "reason": klass,
                        "scope": scope,
                        "message": (
                            f"Too many requests on the '{klass}' bucket "
                            f"(scope={scope}). Retry in ~{retry_int} ms."
                        ),
                        "retry_after_ms": retry_int,
                    }
                },
                headers={
                    "Retry-After": str(max(1, int(retry_ms / 1000))),
                    "X-RateLimit-Class": klass,
                    "X-RateLimit-Scope": scope,
                },
            )
        return await call_next(request)
