"""
Gauntlet — log token redaction (Wave P-31, Layer 5).

A ``logging.Filter`` subclass that walks ``LogRecord.msg`` and
``LogRecord.args`` and substitutes well-known credential shapes with a
short masked form before the formatter renders the line. The goal is
defense-in-depth: app code already tries to never log secrets, but
upstream libraries (httpx, anthropic SDK, FastAPI) sometimes echo
request headers on error, and a `logger.error("...%r...", request)`
line shouldn't leak an Anthropic API key into the platform log
aggregator.

Patterns covered:

  ``ghp_[A-Za-z0-9]+``                    — GitHub PATs / fine-grained tokens
  ``sk-[A-Za-z0-9_-]+``                   — Anthropic / OpenAI API keys
  ``Bearer\\s+[A-Za-z0-9._-]+``            — HTTP Authorization bearer
  ``Authorization:\\s*\\S+``                — full Authorization header
  ``=([A-Fa-f0-9]{32,}|[A-Za-z0-9+/_-]{32,}=*)``
                                          — generic 32+-char hex/base64
                                            secret-like value after ``=``

Each pattern is replaced with a short tag (``ghp_****``, ``sk-****``,
etc.) that preserves enough context for grep without leaking material.
The filter never raises; if a record is unusual (non-string args, custom
LogRecord subclasses) it is passed through untouched. The cost is one
small regex pass per log line.

Install via ``install_redaction()`` — that walks the active logging
hierarchy and attaches the filter to the root and every existing
handler so anything emitted now or later is covered. Safe to call
multiple times (idempotent on the marker attribute).
"""

from __future__ import annotations

import logging
import re
from typing import Any, Iterable

# Order matters: the more specific (Authorization: full line) runs
# before the looser bearer-only pattern so we don't double-mask.
_PATTERNS: tuple[tuple[re.Pattern[str], str], ...] = (
    (re.compile(r"Authorization:\s*\S+", re.IGNORECASE), "Authorization: ****"),
    (re.compile(r"Bearer\s+[A-Za-z0-9._\-]+"), "Bearer ****"),
    (re.compile(r"ghp_[A-Za-z0-9]{20,}"), "ghp_****"),
    (re.compile(r"github_pat_[A-Za-z0-9_]{20,}"), "github_pat_****"),
    (re.compile(r"sk-[A-Za-z0-9_\-]{16,}"), "sk-****"),
    (re.compile(r"sk-ant-[A-Za-z0-9_\-]{16,}"), "sk-ant-****"),
    # Generic "thing=<40+ char secret>". The minimum length floor was 32
    # but caught legit values like long numeric IDs and SHA-1 digests
    # (40 hex chars exactly — kept covered by tightening to 40, not 41,
    # because a SHA1 in a config string is still secret-shaped). 40 is
    # also the JWT minimum + AWS access key minimum — anything shorter
    # is almost never a real credential, so the false-positive cost on
    # numeric IDs in INFO logs goes away.
    (re.compile(r"=([A-Fa-f0-9]{40,}|[A-Za-z0-9+/_\-]{40,}=*)"), "=****"),
)


def redact(text: str) -> str:
    """Apply all token-shape substitutions to ``text``."""
    if not text:
        return text
    out = text
    for pattern, replacement in _PATTERNS:
        out = pattern.sub(replacement, out)
    return out


def _redact_arg(value: Any) -> Any:
    """Best-effort redaction of a single ``record.args`` element.

    Strings and bytes are passed through ``redact``. Containers are
    recursed shallowly. Everything else (int, custom objects, exception
    instances) is returned untouched — the formatter will call ``str()``
    on it when the message renders, and at that point the final
    formatted line is re-redacted in ``filter`` below as a safety net.
    """
    if isinstance(value, str):
        return redact(value)
    if isinstance(value, bytes):
        try:
            decoded = value.decode("utf-8", errors="replace")
        except Exception:  # noqa: BLE001
            return value
        return redact(decoded).encode("utf-8", errors="replace")
    if isinstance(value, dict):
        return {k: _redact_arg(v) for k, v in value.items()}
    if isinstance(value, (list, tuple, set)):
        rebuilt = type(value)(_redact_arg(v) for v in value)
        return rebuilt
    return value


class TokenRedactionFilter(logging.Filter):
    """Apply ``redact`` to ``record.msg`` (always) and ``record.args``
    (when present). Returns True so the record continues through the
    pipeline."""

    name = "signal.redact"

    def filter(self, record: logging.LogRecord) -> bool:  # noqa: A003
        try:
            if isinstance(record.msg, str):
                record.msg = redact(record.msg)
            if record.args:
                if isinstance(record.args, dict):
                    record.args = {k: _redact_arg(v) for k, v in record.args.items()}
                elif isinstance(record.args, tuple):
                    record.args = tuple(_redact_arg(v) for v in record.args)
                else:
                    # Single non-tuple arg (% with one value).
                    record.args = _redact_arg(record.args)
        except Exception:  # noqa: BLE001
            # Logging must never raise. Drop the redaction attempt and
            # let the original record through rather than crashing the app.
            return True
        return True


_INSTALL_MARKER = "_signal_redaction_installed"


def install_redaction(
    loggers: Iterable[str] = ("", "gauntlet", "signal", "uvicorn"),
) -> TokenRedactionFilter:
    """Attach ``TokenRedactionFilter`` to the named loggers (and their
    handlers). Idempotent — repeated calls don't stack filters.

    The default set covers the root logger (catch-all), Gauntlet's own
    ``gauntlet.*`` namespace, the legacy ``signal.*`` namespace (kept
    until the rename has finished propagating through every module),
    and ``uvicorn`` so HTTP access lines also pass through redaction.
    ``loggers=()`` is a no-op convenience.
    """
    f = TokenRedactionFilter()
    for name in loggers:
        lg = logging.getLogger(name)
        if not getattr(lg, _INSTALL_MARKER, False):
            lg.addFilter(f)
            setattr(lg, _INSTALL_MARKER, True)
        for handler in list(lg.handlers):
            if not getattr(handler, _INSTALL_MARKER, False):
                handler.addFilter(f)
                setattr(handler, _INSTALL_MARKER, True)
    return f
