"""
Signal — Visual Diff (Wave K + Wave P-28 + Wave P-30).

Surface Final compares "what was designed" with "what was actually
delivered". This module provides the primitives:

1. Screenshot pair model (baseline + candidate, both URLs or paths).
2. Pixel-level diff structure (regions, total mismatch %, severity).
3. Region-of-interest tagging so the operator can mark "here's where
   the contract said X but the implementation shows Y".

Wave K v1 was **schema + helpers**. Wave P-28 added the per-pixel
diff with a single bbox covering all deltas. Wave P-30 splits that
single bbox into **connected-component regions** so the panel can
highlight every distinct cluster of changed pixels independently —
useful when the change is several small edits scattered across the
page rather than one localised block.

Pillow is the only heavy dep, imported lazily so that a Pillow-less
deploy can still boot the rest of the server (it just fails the diff
endpoint with a typed error). Clustering is pure-Python (iterative
flood-fill, 4-connectivity) — no scipy/numpy.
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

# Wave P-30 — clustering knobs.
#
# MAX_REGIONS caps the number of bboxes returned to the client so a
# scattered diff (every other pixel different) cannot blow up the
# payload to thousands of entries. We keep the N largest by changed-
# pixel count; everything else gets folded into a synthetic
# "remainder" region so the operator still sees a roll-up of "and the
# rest". The cap is generous — 10 distinct hotspots is well above
# what a UI panel can render readably.
#
# MIN_REGION_PIXELS suppresses single-pixel speckle (anti-aliasing
# residue, JPEG quantisation). Anything smaller is dropped from the
# region list but still counts in the global ``changed_pixels`` /
# ``ratio`` so the rolled-up severity isn't dishonest.
MAX_REGIONS = 10
MIN_REGION_PIXELS = 4


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

    Codex re-review (#270 round 2): the body is CPU-bound — a pure
    Python nested loop over every pixel — so awaiting it directly
    inside an async route handler stalls the event loop until the
    diff completes, blocking unrelated requests on that worker.
    Run the work on a thread via ``asyncio.to_thread`` so async
    request handling stays responsive even under larger images or
    concurrent calls. The thin async shell is preserved so callers
    don't have to change.

    Args, returns, raises, size-mismatch notes: see ``_compute_diff_sync``.
    """
    import asyncio
    return await asyncio.to_thread(
        _compute_diff_sync, before, after, threshold=threshold
    )


def _cluster_regions(
    mask: bytearray,
    width: int,
    height: int,
) -> list[DiffRegion]:
    """Wave P-30 — flood-fill over the changed-pixel mask, returning a
    list of ``DiffRegion`` (one per connected component) capped at
    ``MAX_REGIONS``.

    The mask is a flat bytearray of length ``width * height``: 1 means
    "this pixel changed", 0 means "untouched". We walk it once, and for
    each unvisited "1" pixel run an iterative 4-connectivity flood-fill
    via an explicit stack — recursive flood-fill blows the Python stack
    on large diffs. Each visited pixel is rewritten to 2 (visited) so
    the outer scan never re-enters the same component. The whole pass
    is O(W·H) — every pixel is touched at most twice (outer scan + one
    flood-fill membership check).

    Returned regions:
      - ``mismatch_ratio`` — fraction of the bbox that is changed. We
        use the *bbox* denominator (not the global frame) because
        operators want "how dense is this hotspot?", not "how much of
        the page is it?".
      - ``severity`` — derived from ``mismatch_ratio`` via
        ``severity_from_ratio`` so dense hotspots show up as
        critical/moderate even when the global ratio is small.

    If clustering produces more than ``MAX_REGIONS`` regions we keep
    the N with the most changed pixels and roll the remainder into
    one synthetic bbox covering all dropped components, tagged with
    ``note="aggregated_remainder"`` so the UI can label it differently.

    Suppression rule: components smaller than ``MIN_REGION_PIXELS`` are
    dropped from the region list (single-pixel anti-alias speckle would
    otherwise dominate when the user actually changed a small icon).
    Their changed-pixel count still flows into the global ``ratio`` —
    that count is the caller's, not ours, this only filters the bbox
    list.
    """
    components: list[tuple[int, int, int, int, int]] = []
    # tuple shape: (count, min_x, min_y, max_x, max_y)
    # Iterative scan — outer y/x walk picks seed pixels; flood-fill
    # marks every visited pixel as 2 so the outer scan skips them.
    for y in range(height):
        row_off = y * width
        for x in range(width):
            if mask[row_off + x] != 1:
                continue
            # Seed found — flood-fill its component, accumulating the
            # bbox + pixel count as we go.
            stack: list[tuple[int, int]] = [(x, y)]
            mask[row_off + x] = 2
            comp_count = 0
            comp_min_x = x
            comp_min_y = y
            comp_max_x = x
            comp_max_y = y
            while stack:
                cx, cy = stack.pop()
                comp_count += 1
                if cx < comp_min_x: comp_min_x = cx
                if cy < comp_min_y: comp_min_y = cy
                if cx > comp_max_x: comp_max_x = cx
                if cy > comp_max_y: comp_max_y = cy
                # 4-connectivity (N/S/E/W). Diagonal connectivity would
                # merge near-misses across an antialiased edge — that
                # is precisely what we DON'T want; the goal is to keep
                # distinct hotspots distinct.
                # West
                if cx > 0:
                    ni = cy * width + (cx - 1)
                    if mask[ni] == 1:
                        mask[ni] = 2
                        stack.append((cx - 1, cy))
                # East
                if cx + 1 < width:
                    ni = cy * width + (cx + 1)
                    if mask[ni] == 1:
                        mask[ni] = 2
                        stack.append((cx + 1, cy))
                # North
                if cy > 0:
                    ni = (cy - 1) * width + cx
                    if mask[ni] == 1:
                        mask[ni] = 2
                        stack.append((cx, cy - 1))
                # South
                if cy + 1 < height:
                    ni = (cy + 1) * width + cx
                    if mask[ni] == 1:
                        mask[ni] = 2
                        stack.append((cx, cy + 1))
            components.append((
                comp_count, comp_min_x, comp_min_y, comp_max_x, comp_max_y,
            ))

    if not components:
        return []

    # Drop tiny speckle components from the region list (they still
    # count toward the global ratio). Sort by changed-pixel count
    # descending so MAX_REGIONS keeps the meaningful clusters.
    sized = [c for c in components if c[0] >= MIN_REGION_PIXELS]
    if not sized:
        # Everything is speckle — surface a single bbox covering the
        # union so the operator still sees *something* on the panel.
        union_min_x = min(c[1] for c in components)
        union_min_y = min(c[2] for c in components)
        union_max_x = max(c[3] for c in components)
        union_max_y = max(c[4] for c in components)
        union_count = sum(c[0] for c in components)
        bbox_w = union_max_x - union_min_x + 1
        bbox_h = union_max_y - union_min_y + 1
        bbox_area = max(bbox_w * bbox_h, 1)
        speckle_ratio = union_count / bbox_area
        return [DiffRegion(
            x=union_min_x, y=union_min_y,
            width=bbox_w, height=bbox_h,
            mismatch_ratio=speckle_ratio,
            severity=severity_from_ratio(speckle_ratio),
            note="aggregated_speckle",
        )]

    sized.sort(key=lambda c: c[0], reverse=True)

    keep = sized[:MAX_REGIONS]
    overflow = sized[MAX_REGIONS:]

    out: list[DiffRegion] = []
    for count, min_x, min_y, max_x, max_y in keep:
        bbox_w = max_x - min_x + 1
        bbox_h = max_y - min_y + 1
        bbox_area = max(bbox_w * bbox_h, 1)
        region_ratio = count / bbox_area
        out.append(DiffRegion(
            x=min_x, y=min_y,
            width=bbox_w, height=bbox_h,
            mismatch_ratio=region_ratio,
            severity=severity_from_ratio(region_ratio),
        ))

    if overflow:
        # Roll the dropped components into one bbox + count so the
        # operator at least sees "and N more clusters covering this
        # area". Tagged so the UI can render it muted vs the keepers.
        ov_min_x = min(c[1] for c in overflow)
        ov_min_y = min(c[2] for c in overflow)
        ov_max_x = max(c[3] for c in overflow)
        ov_max_y = max(c[4] for c in overflow)
        ov_count = sum(c[0] for c in overflow)
        bbox_w = ov_max_x - ov_min_x + 1
        bbox_h = ov_max_y - ov_min_y + 1
        bbox_area = max(bbox_w * bbox_h, 1)
        ov_ratio = ov_count / bbox_area
        out.append(DiffRegion(
            x=ov_min_x, y=ov_min_y,
            width=bbox_w, height=bbox_h,
            mismatch_ratio=ov_ratio,
            severity=severity_from_ratio(ov_ratio),
            note=f"aggregated_remainder:{len(overflow)}",
        ))

    return out


def _compute_diff_sync(
    before: bytes,
    after: bytes,
    *,
    threshold: float = 0.1,
) -> DiffResult:
    """Sync core of compute_diff. Runs in a worker thread so the event
    loop is free to service other requests during long pixel passes.

    Args:
        before: raw bytes of the baseline image.
        after:  raw bytes of the candidate image.
        threshold: informational only in v1 — the caller can use the
                   returned ``ratio`` against this to decide whether
                   to surface an alert. Stored on the result for
                   downstream rule engines.

    Returns:
        DiffResult with one bbox per connected component of changed
        pixels (Wave P-30), capped at ``MAX_REGIONS`` and sorted by
        component size — the largest hotspots first. No region when
        ``changed_pixels == 0``.

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

    delta = CHANNEL_DELTA

    # Wave P-30 — track every changed pixel as a bit in a flat bytearray
    # mask (1 byte/pixel; bool would round to the same memory). We need
    # the mask so the connected-component pass below can flood-fill
    # without re-reading the RGBA buffers. Two passes total: O(W·H) for
    # this scan, O(W·H) for flood-fill = O(W·H) overall.
    mask = bytearray(total_pixels)
    changed = 0

    # Index into the flat buffer; row-major order matches PIL's tobytes().
    # 4 bytes per pixel (RGBA). We compare each channel; any single
    # channel exceeding `delta` flips the pixel to "changed".
    for y in range(height):
        row_offset = y * width * 4
        mask_row_offset = y * width
        for x in range(width):
            i = row_offset + x * 4
            if (
                abs(a_buf[i]     - b_buf[i])     > delta
                or abs(a_buf[i + 1] - b_buf[i + 1]) > delta
                or abs(a_buf[i + 2] - b_buf[i + 2]) > delta
                or abs(a_buf[i + 3] - b_buf[i + 3]) > delta
            ):
                changed += 1
                mask[mask_row_offset + x] = 1

    ratio = changed / total_pixels if total_pixels else 0.0
    regions = _cluster_regions(mask, width, height) if changed > 0 else []

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
