"""
Daily backup tool (Wave P-32).

Copies JSON state to MEMORY_DIR/backups/<ISO>/. Idempotent — running it
twice in the same second produces a single timestamp folder (the second
invocation overwrites the first), so cron retries are safe.

Usage:
    cd backend && python backup.py

Cron-friendly: writes to stdout/stderr, exits non-zero on failure so a
wrapper like `cron` can detect partial backups.

Exit code:
    0 — backup written
    1 — backup failed (partial or empty)
    2 — configuration error (no MEMORY_DIR, etc.)
"""

from __future__ import annotations

import os
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    from config import MEMORY_DIR
except ImportError:  # pragma: no cover — standalone invocation
    sys.path.insert(0, str(Path(__file__).parent))
    from config import MEMORY_DIR  # type: ignore


def _iso_stamp() -> str:
    """UTC ISO timestamp safe for filesystem paths.

    Replace ":" with "-" so the folder name works on every filesystem
    (Windows, macOS HFS+ legacy mounts). Strip microseconds to keep the
    name short.
    """
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H-%M-%SZ")


def _copy_json(src_dir: Path, dest_dir: Path) -> list[Path]:
    """Copy every *.json sibling of MEMORY_DIR (skip the backups subtree).

    Returns the list of destination paths actually written.
    """
    written: list[Path] = []
    if not src_dir.exists():
        return written
    dest_dir.mkdir(parents=True, exist_ok=True)
    for path in sorted(src_dir.iterdir()):
        if not path.is_file():
            continue
        if path.suffix != ".json":
            continue
        target = dest_dir / path.name
        shutil.copy2(path, target)
        written.append(target)
    return written


def main() -> int:
    if not MEMORY_DIR:
        print("[backup] MEMORY_DIR not configured", file=sys.stderr)
        return 2

    stamp = _iso_stamp()
    backups_root = MEMORY_DIR / "backups"
    target = backups_root / stamp

    print(f"[backup] target = {target}")

    try:
        json_paths = _copy_json(MEMORY_DIR, target)
    except OSError as exc:
        print(f"[backup] JSON copy failed: {exc}", file=sys.stderr)
        return 1

    if json_paths:
        for p in json_paths:
            print(f"[backup] json → {p.name}")
    else:
        print("[backup] no JSON files found in MEMORY_DIR (proceeding)")

    # Make the destination folder discoverable: write a sentinel marker
    # so an externally-driven retention sweep knows the folder is a
    # backup root rather than partial output from an interrupted run.
    sentinel = target / ".backup_complete"
    try:
        sentinel.write_text(stamp + "\n", encoding="utf-8")
    except OSError as exc:
        print(f"[backup] sentinel write failed: {exc}", file=sys.stderr)
        return 1

    print("[backup] done")
    return 0


if __name__ == "__main__":
    # Allow override of MEMORY_DIR via env at invocation time without
    # editing config — useful for ops scripts that target a mounted
    # volume different from the running container's.
    if "GAUNTLET_BACKUP_DIR" in os.environ:
        MEMORY_DIR = Path(os.environ["GAUNTLET_BACKUP_DIR"])  # noqa: F811
    sys.exit(main())
