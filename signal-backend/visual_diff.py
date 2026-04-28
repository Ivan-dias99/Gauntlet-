"""
Signal — Visual Diff (Wave K).

Surface Final compares "what was designed" with "what was actually
delivered". This module provides the primitives:

1. Screenshot pair model (baseline + candidate, both URLs or paths).
2. Pixel-level diff structure (regions, total mismatch %, severity).
3. Region-of-interest tagging so the operator can mark "here's where
   the contract said X but the implementation shows Y".

Wave K v1 is **schema + helpers**. The actual screenshot capture +
pixel-by-pixel pipeline lives in the Browser Runtime (Wave L) which
needs an iframe / headless browser. This file is the data contract
that both sides commit to.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Literal, Optional


Severity = Literal["info", "minor", "moderate", "critical"]


@dataclass
class ScreenshotRef:
    """A reference to a screenshot. Either an HTTPS URL (CDN) or a
    relative path inside the project's `static/screenshots/` tree."""
    kind: Literal["url", "path"]
    location: str
    width: int = 0
    height: int = 0
    captured_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


@dataclass
class DiffRegion:
    """A bounding box where baseline and candidate disagreed."""
    x: int
    y: int
    width: int
    height: int
    mismatch_ratio: float  # 0..1, fraction of pixels different in this region
    severity: Severity = "minor"
    note: Optional[str] = None  # operator-attached annotation


@dataclass
class VisualDiff:
    """Result of comparing baseline vs candidate. Wave K's contract."""
    baseline: ScreenshotRef
    candidate: ScreenshotRef
    overall_mismatch_ratio: float = 0.0
    regions: list[DiffRegion] = field(default_factory=list)
    total_pixels: int = 0
    diff_pixels: int = 0
    severity: Severity = "info"  # rolled up from regions
    captured_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )

    def to_dict(self) -> dict:
        return {
            "baseline": {
                "kind": self.baseline.kind,
                "location": self.baseline.location,
                "width": self.baseline.width,
                "height": self.baseline.height,
                "captured_at": self.baseline.captured_at,
            },
            "candidate": {
                "kind": self.candidate.kind,
                "location": self.candidate.location,
                "width": self.candidate.width,
                "height": self.candidate.height,
                "captured_at": self.candidate.captured_at,
            },
            "overall_mismatch_ratio": self.overall_mismatch_ratio,
            "total_pixels": self.total_pixels,
            "diff_pixels": self.diff_pixels,
            "severity": self.severity,
            "regions": [
                {
                    "x": r.x, "y": r.y,
                    "width": r.width, "height": r.height,
                    "mismatch_ratio": r.mismatch_ratio,
                    "severity": r.severity,
                    "note": r.note,
                }
                for r in self.regions
            ],
            "captured_at": self.captured_at,
        }


# ── Severity rules ──────────────────────────────────────────────────────────


def severity_from_ratio(ratio: float) -> Severity:
    """Map a mismatch ratio to a severity bucket. The thresholds are
    intentionally conservative — small visual drift is normal under
    anti-aliasing + font rendering differences."""
    if ratio < 0.005:
        return "info"
    if ratio < 0.05:
        return "minor"
    if ratio < 0.20:
        return "moderate"
    return "critical"


def rollup_severity(regions: list[DiffRegion]) -> Severity:
    """Worst-region wins, with 'critical' if any region is critical."""
    rank = {"info": 0, "minor": 1, "moderate": 2, "critical": 3}
    if not regions:
        return "info"
    worst = max(rank[r.severity] for r in regions)
    inv = {v: k for k, v in rank.items()}
    return inv[worst]  # type: ignore[return-value]


def empty_diff(baseline: ScreenshotRef, candidate: ScreenshotRef) -> VisualDiff:
    """Build a diff with no regions — used when the pixel pipeline is
    not yet wired (Wave L) or when the comparison was skipped."""
    return VisualDiff(
        baseline=baseline,
        candidate=candidate,
        overall_mismatch_ratio=0.0,
        regions=[],
        total_pixels=0,
        diff_pixels=0,
        severity="info",
    )
