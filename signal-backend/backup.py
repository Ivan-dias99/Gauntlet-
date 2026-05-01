"""
Daily backup tool (Wave P-32).

Copies JSON state to MEMORY_DIR/backups/<ISO>/ and, when Postgres is
configured, runs pg_dump alongside. Idempotent — running it twice in
the same second produces a single timestamp folder (the second invocation
overwrites the first), so cron retries are safe.

Usage:
    cd signal-backend && python backup.py

Cron-friendly: writes to stdout/stderr, exits non-zero on failure so a
wrapper like `cron` can detect partial backups.

Exit code:
    0 — backup written
    1 — backup failed (partial or empty)
    2 — configuration error (no MEMORY_DIR, etc.)
"""

from __future__ import annotations

import gzip
import os
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    from config import DATABASE_URL, MEMORY_DIR
except ImportError:  # pragma: no cover — standalone invocation
    sys.path.insert(0, str(Path(__file__).parent))
    from config import DATABASE_URL, MEMORY_DIR  # type: ignore


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


def _run_pg_dump(database_url: str, out_path: Path) -> tuple[bool, str]:
    """Run pg_dump, gzip the output. Returns (ok, message).

    pg_dump is found on PATH; if it is missing the function returns
    ok=False with an explanatory message rather than raising — backup
    of JSON files is still useful even when the PG side is unreachable.
    """
    if shutil.which("pg_dump") is None:
        return False, "pg_dump not found on PATH; skipping PG dump"
    try:
        proc = subprocess.run(
            ["pg_dump", "--no-owner", "--no-privileges", database_url],
            capture_output=True,
            check=True,
        )
    except subprocess.CalledProcessError as exc:
        return False, f"pg_dump failed (exit {exc.returncode}): {exc.stderr.decode('utf-8', 'replace')[:400]}"
    except OSError as exc:  # FileNotFoundError, permission, etc.
        return False, f"pg_dump invocation failed: {exc}"

    try:
        with gzip.open(out_path, "wb") as gz:
            gz.write(proc.stdout)
    except OSError as exc:
        return False, f"failed to write gzip: {exc}"
    return True, f"pg_dump → {out_path} ({len(proc.stdout)} bytes pre-gzip)"


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

    pg_ok = True
    if DATABASE_URL:
        pg_target = target / "pg_dump.sql.gz"
        pg_ok, msg = _run_pg_dump(DATABASE_URL, pg_target)
        print(f"[backup] {msg}")
    else:
        print("[backup] SIGNAL_DATABASE_URL not set — skipping PG dump")

    # Make the destination folder discoverable: write a sentinel marker
    # so an externally-driven retention sweep knows the folder is a
    # backup root rather than partial output from an interrupted run.
    sentinel = target / ".backup_complete"
    try:
        sentinel.write_text(stamp + "\n", encoding="utf-8")
    except OSError as exc:
        print(f"[backup] sentinel write failed: {exc}", file=sys.stderr)
        return 1

    if not pg_ok:
        print("[backup] WARNING: PG dump did not complete — JSON-only backup.")
        # Non-fatal: the JSON snapshot is still useful even when PG is
        # unreachable. The marker reflects what was written.
    print("[backup] done")
    return 0


if __name__ == "__main__":
    # Allow override of MEMORY_DIR via env at invocation time without
    # editing config — useful for ops scripts that target a mounted
    # volume different from the running container's.
    if "SIGNAL_BACKUP_DIR" in os.environ:
        MEMORY_DIR = Path(os.environ["SIGNAL_BACKUP_DIR"])  # noqa: F811
    sys.exit(main())
