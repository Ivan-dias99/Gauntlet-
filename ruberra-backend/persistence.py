"""
Ruberra — Persistence Primitives

Atomic text write: write to a sibling ``.tmp`` file then ``os.replace`` onto
the final path. POSIX guarantees the rename is atomic; on Windows, NTFS
gives the same guarantee. A crash mid-write leaves the previous file
intact — never a half-written snapshot.

Exceptions propagate. Callers that cannot afford to crash (engine
side-effects like the run log) must catch explicitly and decide how to
surface the failure — silently swallowing would lie about persistence.
"""

from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path


def atomic_write_text(path: Path, content: str, encoding: str = "utf-8") -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    try:
        tmp.write_text(content, encoding=encoding)
        os.replace(tmp, path)
    except Exception:
        try:
            tmp.unlink(missing_ok=True)
        except OSError:
            pass
        raise


def quarantine_corrupt_file(path: Path) -> Path | None:
    """Rename a corrupt file to a timestamped sidecar, return the new path.

    Called when a store file exists but cannot be parsed/validated. Moving
    it aside ensures the next write does not overwrite and destroy the
    only evidence of corruption — an operator can inspect the sidecar to
    recover state or diagnose the cause.

    Returns None if the file is not present at the expected path, or the
    rename itself fails (caller keeps going on an empty store either way).
    """
    if not path.exists():
        return None
    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    sidecar = path.with_suffix(path.suffix + f".corrupt-{ts}")
    try:
        os.replace(path, sidecar)
        return sidecar
    except OSError:
        return None
