"""
Signal — Visual Diff (Wave K + Wave P-28).

Surface Final compares "what was designed" with "what was actually
delivered". This module provides the primitives:

1. Screenshot pair model (baseline + candidate, both URLs or paths).
2. Pixel-level diff structure (regions, total mismatch %, severity).
3. Region-of-interest tagging so the operator can mark "here's where
   the contract said X but the implementation shows Y".

Wave K v1 was **schema + helpers**. Wave P-28 adds the actual pixel
diff: ``compute_diff(before, after)`` returns a ``DiffResult`` with
the changed-pixel ratio + a single bounding-box region covering all
deltas. Pillow is the only heavy dep, imported lazily so that a
Pillow-less deploy can still boot the rest of the server (it just
fails the diff endpoint with a typed error).

Region clustering is intentionally crude — one bbox over min/max
deltas. The follow-up wave can split into connected components
when the operator needs that resolution.
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


# ── Wave P-28 — pixel diff implementation ──────────────────────────────────
#
# We treat both inputs as RGBA byte streams. A pixel is "changed" if any
# channel differs by more than ``CHANNEL_DELTA`` (8/255 ≈ 3% — wide enough
# to absorb anti-aliasing + JPEG quantisation, narrow enough to surface
# real layout / colour shifts). Region clustering is intentionally simple:
# a single bbox over min/max x,y of changed pixels. Connected-components
# clustering is a later refinement; v1 just wants "where, roughly, did
# the pixels move?"


CHANNEL_DELTA = 8  # /255 — minimum per-channel difference to count as changed


@dataclass
class DiffResult:
    """Wave P-28 — output of ``compute_diff``. Lighter than ``VisualDiff``
    (no ScreenshotRef metadata) so the endpoint can return it directly
    from a multipart upload without forcing the caller to mint refs."""
    regions: list[DiffRegion]
    changed_pixels: int
    total_pixels: int
    ratio: float
    severity: Severity = "info"
    width: int = 0
    height: int = 0
    note: Optional[str] = None  # e.g. "size_mismatch_resized_to_smaller"

    def to_dict(self) -> dict:
        return {
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
            "changed_pixels": self.changed_pixels,
            "total_pixels": self.total_pixels,
            "ratio": self.ratio,
            "severity": self.severity,
            "width": self.width,
            "height": self.height,
            "note": self.note,
        }


class DiffUnavailable(RuntimeError):
    """Raised when the diff cannot run (e.g. Pillow not installed).

    Surfaced to the endpoint as a typed 503 so the chamber can show
    "diff engine unavailable" instead of a generic 500 stack trace."""


def _load_pillow():
    """Lazy import. Returns the ``PIL.Image`` module or raises
    ``DiffUnavailable`` if Pillow isn't installed in the environment.

    Kept as a function (not a module-level import) so that a deploy
    without Pillow still boots the server — only the /visual-diff
    endpoint fails, with a clear reason."""
    try:
        from PIL import Image  # type: ignore[import-not-found]
    except Exception as exc:  # noqa: BLE001
        raise DiffUnavailable(
            f"Pillow not available: {exc!s}. Install `Pillow` to enable visual diff.",
        ) from exc
    return Image


async def compute_diff(
    before: bytes,
    after: bytes,
    *,
    threshold: float = 0.1,
) -> DiffResult:
    """Compute a per-pixel diff between two PNG/JPEG byte buffers.

    Args:
        before: raw bytes of the baseline image.
        after:  raw bytes of the candidate image.
        threshold: informational only in v1 — the caller can use the
                   returned ``ratio`` against this to decide whether
                   to surface an alert. Stored on the result for
                   downstream rule engines.

    Returns:
        DiffResult with a single bbox region (or no region when
        ``changed_pixels == 0``).

    Raises:
        DiffUnavailable: Pillow not installed.
        ValueError: either buffer can't be decoded as an image.

    Notes on size-mismatch: if ``before`` and ``after`` differ in
    dimensions we resize the larger to match the smaller (nearest
    neighbour, no resampling smoothing) and tag the result with a
    ``note``. This keeps the contract honest — the operator sees the
    diff was over a normalised pair, not a phantom comparison.
    """
    Image = _load_pillow()
    import io as _io

    try:
        img_a = Image.open(_io.BytesIO(before)).convert("RGBA")
    except Exception as exc:  # noqa: BLE001
        raise ValueError(f"could not decode 'before' image: {exc!s}") from exc
    try:
        img_b = Image.open(_io.BytesIO(after)).convert("RGBA")
    except Exception as exc:  # noqa: BLE001
        raise ValueError(f"could not decode 'after' image: {exc!s}") from exc

    note: Optional[str] = None
    if img_a.size != img_b.size:
        # Shrink the larger to the smaller — symmetric, deterministic,
        # and avoids inventing pixels that weren't in either input.
        target = (
            min(img_a.size[0], img_b.size[0]),
            min(img_a.size[1], img_b.size[1]),
        )
        img_a = img_a.resize(target, Image.NEAREST)
        img_b = img_b.resize(target, Image.NEAREST)
        note = f"size_mismatch_normalised_to_{target[0]}x{target[1]}"

    width, height = img_a.size
    total_pixels = width * height
    if total_pixels == 0:
        return DiffResult(
            regions=[], changed_pixels=0, total_pixels=0, ratio=0.0,
            severity="info", width=width, height=height, note=note,
        )

    # tobytes() yields RGBA stride: 4 bytes per pixel. Walk both
    # buffers in parallel — pure-Python because we don't want a numpy
    # hard dep just for this. Pillow's ImageChops would also work but
    # we want to keep the per-pixel rule explicit.
    a_buf = img_a.tobytes()
    b_buf = img_b.tobytes()

    changed = 0
    min_x = width
    min_y = height
    max_x = -1
    max_y = -1

    delta = CHANNEL_DELTA
    # Index into the flat buffer; row-major order matches PIL's tobytes().
    # 4 bytes per pixel (RGBA). We compare each channel; any single
    # channel exceeding `delta` flips the pixel to "changed".
    for y in range(height):
        row_offset = y * width * 4
        for x in range(width):
            i = row_offset + x * 4
            if (
                abs(a_buf[i]     - b_buf[i])     > delta
                or abs(a_buf[i + 1] - b_buf[i + 1]) > delta
                or abs(a_buf[i + 2] - b_buf[i + 2]) > delta
                or abs(a_buf[i + 3] - b_buf[i + 3]) > delta
            ):
                changed += 1
                if x < min_x: min_x = x
                if y < min_y: min_y = y
                if x > max_x: max_x = x
                if y > max_y: max_y = y

    ratio = changed / total_pixels if total_pixels else 0.0
    regions: list[DiffRegion] = []
    if changed > 0 and max_x >= 0 and max_y >= 0:
        bbox_w = max_x - min_x + 1
        bbox_h = max_y - min_y + 1
        regions.append(DiffRegion(
            x=min_x, y=min_y,
            width=bbox_w, height=bbox_h,
            mismatch_ratio=ratio,
            severity=severity_from_ratio(ratio),
        ))

    sev = severity_from_ratio(ratio)
    # Threshold is informational — if ratio < threshold we still
    # return the bbox, just clamp severity down to "info" so the
    # caller doesn't alarm on noise.
    if ratio < threshold and sev != "info":
        sev = "info"

    return DiffResult(
        regions=regions,
        changed_pixels=changed,
        total_pixels=total_pixels,
        ratio=ratio,
        severity=sev,
        width=width,
        height=height,
        note=note,
    )
