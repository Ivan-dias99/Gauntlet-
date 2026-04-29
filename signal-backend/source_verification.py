"""
Signal — Source Verification (Wave G).

Wave 6c gave Insight access to web_search + web_fetch. The Wave 6c
plan flagged "no source verification yet — citations appear in
tool_result content but aren't ranked or scored". This module fixes
that.

Two layers:

1. **Citation extraction.** Parse tool_result content from web_search
   / web_fetch into a structured `Citation` list (url, title,
   snippet, retrieved_at). The LLM tends to mention URLs in prose
   already — we extract them.

2. **Trust scoring.** Heuristic per-domain trust score so the chamber
   can render a confidence badge alongside each citation. Known
   high-trust roots (.gov, .edu, official org domains) score high;
   unknown/unrecognised roots score medium; known low-trust signals
   (URL shorteners, content farms) score low.

Wave G is read-only: it never blocks a tool call. Insight's agent
loop sees the score in the tool_result preview, the operator sees
it in the chamber UI when the panel renders.
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Literal
from urllib.parse import urlparse

logger = logging.getLogger("signal.source_verification")


TrustScore = Literal["high", "medium", "low", "unknown"]


@dataclass
class Citation:
    """A single citation extracted from a tool_result."""
    url: str
    title: str = ""
    snippet: str = ""
    domain: str = ""
    trust: TrustScore = "unknown"
    retrieved_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )

    def to_dict(self) -> dict:
        return {
            "url": self.url,
            "title": self.title,
            "snippet": self.snippet,
            "domain": self.domain,
            "trust": self.trust,
            "retrieved_at": self.retrieved_at,
        }


# ── Trust heuristics ────────────────────────────────────────────────────────

# High-trust top-level domains and known reference sources.
_HIGH_TRUST_TLDS = {".gov", ".edu", ".gov.uk", ".gov.pt", ".eu"}
_HIGH_TRUST_HOSTS = {
    "wikipedia.org", "developer.mozilla.org", "rfc-editor.org",
    "ietf.org", "w3.org", "iana.org", "iso.org",
    "npmjs.com", "pypi.org", "crates.io",
    "react.dev", "nodejs.org", "python.org",
    "github.com", "gitlab.com",
    "anthropic.com", "openai.com", "vercel.com", "railway.com",
}

# Low-trust signals — URL shorteners, link aggregators with no
# editorial control, scraper farms.
_LOW_TRUST_HOSTS = {
    "bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly",
    "buff.ly", "is.gd", "lnkd.in",
}

# URL regex — matches http(s)://... reasonable-looking URLs.
#   Host: `[...]` IPv6 literal (so https://[2001:db8::1]/docs survives)
#   OR a normal host without `/`, whitespace, quotes, or `]`.
#   Rest (optional path/query/fragment): anything except whitespace,
#   quote, `<>`, `]` — `]` is excluded outside the IPv6 brackets so the
#   regex can't bleed into markdown wrappers like `[label](url)`.
# Wikipedia-style slugs (`/wiki/Function_(mathematics)`) survive because
# `(` and `)` are allowed; trailing unbalanced `)` from prose wrappers
# is stripped by _strip_trailing_unbalanced_parens after the match.
_URL_RE = re.compile(
    r"https?://"
    r"(?:\[[0-9a-fA-F:.%]+\]|[^/\s\"\'<>\]]+)"
    r"(?:[:/?#][^\s\"\'<>\]]*)?",
    flags=re.IGNORECASE,
)


def _strip_trailing_unbalanced_parens(url: str) -> str:
    """Remove trailing `)` chars that don't have a matching `(` in the URL."""
    while url.endswith(")") and url.count(")") > url.count("("):
        url = url[:-1]
    return url


def score_domain(host: str) -> TrustScore:
    """Score a hostname via heuristic. No network calls, no DB."""
    if not host:
        return "unknown"
    host = host.lower().strip(".")
    if host in _LOW_TRUST_HOSTS:
        return "low"
    # Subdomain match against low-trust hosts (www.bit.ly → bit.ly)
    for known in _LOW_TRUST_HOSTS:
        if host.endswith("." + known):
            return "low"
    if host in _HIGH_TRUST_HOSTS:
        return "high"
    # Subdomain match against high-trust hosts (api.github.com → github.com)
    for known in _HIGH_TRUST_HOSTS:
        if host.endswith("." + known):
            return "high"
    # TLD match
    for tld in _HIGH_TRUST_TLDS:
        if host.endswith(tld):
            return "high"
    return "medium"


def extract_citations(tool_result_content: str, *, max_citations: int = 12) -> list[Citation]:
    """Extract URL-bearing citations from a tool_result content blob.

    Pure text parsing. Doesn't fetch, doesn't validate the URLs are
    live — Wave G v1 is heuristic-only. A future iteration can add
    live validation (HEAD probe with HTTPS-only + size cap).
    """
    if not tool_result_content or max_citations <= 0:
        return []

    seen: set[str] = set()
    out: list[Citation] = []

    for match in _URL_RE.finditer(tool_result_content):
        url = match.group(0).rstrip(".,;:!?")
        url = _strip_trailing_unbalanced_parens(url)
        if url in seen:
            continue
        seen.add(url)
        try:
            parsed = urlparse(url)
        except Exception:  # noqa: BLE001
            continue
        host = (parsed.hostname or "").lower()
        if not host:
            continue
        # Pull a short title-ish snippet — the 80 chars before/after the URL.
        start = max(0, match.start() - 80)
        end = min(len(tool_result_content), match.end() + 80)
        context_snippet = tool_result_content[start:end].replace("\n", " ").strip()
        out.append(Citation(
            url=url,
            title="",
            snippet=context_snippet[:240],
            domain=host,
            trust=score_domain(host),
        ))
        if len(out) >= max_citations:
            break

    return out


def trust_summary(citations: list[Citation]) -> dict:
    """Aggregate trust counts for a UI badge."""
    counts = {"high": 0, "medium": 0, "low": 0, "unknown": 0}
    for c in citations:
        counts[c.trust] = counts.get(c.trust, 0) + 1
    return {
        "total": len(citations),
        "by_trust": counts,
        "any_low": counts["low"] > 0,
        "majority_high": counts["high"] > sum(counts[k] for k in ("medium", "low", "unknown")),
    }
