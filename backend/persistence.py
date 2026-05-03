"""
Signal — Persistence Primitives

Atomic text write: write to a sibling ``.tmp`` file then ``os.replace`` onto
the final path. POSIX guarantees the rename is atomic; on Windows, NTFS
gives the same guarantee. A crash mid-write leaves the previous file
intact — never a half-written snapshot.

Exceptions propagate. Callers that cannot afford to crash (engine
side-effects like the run log) must catch explicitly and decide how to
surface the failure — silently swallowing would lie about persistence.

Sync vs async: ``atomic_write_text`` keeps the blocking implementation for
non-async call sites and tests. ``atomic_write_text_async`` offloads the
write to a worker thread via ``asyncio.to_thread`` so the event loop is
not stalled on disk I/O — critical for SSE streams and concurrent
requests on a hot run log.
"""

from __future__ import annotations

import asyncio
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


async def atomic_write_text_async(
    path: Path, content: str, encoding: str = "utf-8"
) -> None:
    """Async wrapper for ``atomic_write_text`` — runs the blocking write in a
    worker thread so the asyncio event loop stays responsive while disk I/O
    completes. Same atomicity guarantees as the sync version (write to .tmp
    then os.replace). Exceptions propagate identically.

    Cancellation safety: the awaiting task may be cancelled (client
    disconnect, server timeout) while the worker thread is mid-write.
    Python threads cannot be cancelled, so the write would still complete
    on disk — but a naive ``await asyncio.to_thread(...)`` returns
    immediately on cancel, which lets the caller's surrounding asyncio
    lock release before the thread finishes. A second writer can then
    enter and race on the same ``.tmp`` filename.

    To prevent this race, we shield the inner future and, on cancel,
    drain it to completion before re-raising ``CancelledError`` so the
    caller's lock context only releases after disk state stabilises.
    """
    task = asyncio.ensure_future(
        asyncio.to_thread(atomic_write_text, path, content, encoding)
    )
    try:
        await asyncio.shield(task)
    except asyncio.CancelledError:
        # We were cancelled. The thread is still running — wait for it
        # to finish (suppressing further cancellation while we wait)
        # so the surrounding asyncio lock isn't released over a still-
        # in-flight writer. Then re-raise the CancelledError so the
        # caller's normal cancellation path runs.
        while not task.done():
            try:
                await asyncio.shield(task)
            except asyncio.CancelledError:
                continue
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
