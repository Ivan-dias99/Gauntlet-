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
