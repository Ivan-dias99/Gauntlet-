"""Live git status for the workspace — read-only by design.

Frontend composer reads repo + branch live instead of relying on
build-time env vars. The endpoint is a thin wrapper around the same
``git --no-pager`` invocation the GitTool uses, scoped to
TOOL_WORKSPACE_ROOT. Read-only by construction: only ``rev-parse``,
``symbolic-ref``, ``status --porcelain``, ``rev-list``. No subcommand
args from the request body — there is no body. If the workspace is
not a git repo (or git is missing), the endpoint returns a populated
envelope with ``repo: null``, ``branch: null``, ``error`` set. The
shell renders that as "REPO unavailable / BRANCH unavailable" — same
legacy behaviour, but now driven by reality not a missing env var.
"""

from __future__ import annotations

import asyncio as _asyncio
from pathlib import Path

from fastapi import APIRouter

from tools import TOOL_WORKSPACE_ROOT

router = APIRouter()


async def _git(args: list[str]) -> tuple[int, str, str]:
    """Run ``git --no-pager <args>`` inside TOOL_WORKSPACE_ROOT. Returns
    (exit_code, stdout, stderr)."""
    proc = await _asyncio.create_subprocess_exec(
        "git", "--no-pager", *args,
        stdout=_asyncio.subprocess.PIPE,
        stderr=_asyncio.subprocess.PIPE,
        cwd=str(TOOL_WORKSPACE_ROOT),
    )
    out, err = await proc.communicate()
    return (
        proc.returncode if proc.returncode is not None else -1,
        out.decode(errors="replace").strip(),
        err.decode(errors="replace").strip(),
    )


@router.get("/git/status")
async def git_status():
    """Live repo/branch state for the workspace. Read-only."""
    try:
        rc, _, _ = await _git(["rev-parse", "--is-inside-work-tree"])
    except FileNotFoundError as exc:
        return {
            "repo": None,
            "branch": None,
            "head": None,
            "dirty": False,
            "ahead": 0,
            "behind": 0,
            "error": "git_not_installed",
            "message": str(exc),
        }
    if rc != 0:
        return {
            "repo": None,
            "branch": None,
            "head": None,
            "dirty": False,
            "ahead": 0,
            "behind": 0,
            "error": "not_a_repository",
            "message": f"workspace at {TOOL_WORKSPACE_ROOT} is not a git work tree",
        }

    # Repo identifier: prefer remote origin URL → derive owner/name slug;
    # fall back to the workspace folder name. Branch: symbolic-ref short
    # form, falling back to "DETACHED@<sha>" when in detached HEAD.
    _, top, _ = await _git(["rev-parse", "--show-toplevel"])
    workspace_name = Path(top).name if top else TOOL_WORKSPACE_ROOT.name

    _, origin, _ = await _git(["config", "--get", "remote.origin.url"])
    repo_label = workspace_name
    if origin:
        slug = origin.rstrip("/")
        if slug.endswith(".git"):
            slug = slug[:-4]
        # Normalise SSH (git@host:owner/name) and HTTPS (https://host/owner/name)
        if "@" in slug and ":" in slug and not slug.startswith("http"):
            slug = slug.split(":", 1)[1]
        elif "://" in slug:
            slug = slug.split("://", 1)[1].split("/", 1)[1] if "/" in slug.split("://", 1)[1] else slug
        repo_label = slug or workspace_name

    rc_branch, branch, _ = await _git(["symbolic-ref", "--short", "HEAD"])
    head_sha = ""
    _, head_sha, _ = await _git(["rev-parse", "--short", "HEAD"])
    if rc_branch != 0 or not branch:
        branch = f"DETACHED@{head_sha}" if head_sha else "DETACHED"

    _, porcelain, _ = await _git(["status", "--porcelain"])
    dirty = bool(porcelain)

    ahead, behind = 0, 0
    rc_ab, ab, _ = await _git([
        "rev-list", "--left-right", "--count", "HEAD...@{upstream}",
    ])
    if rc_ab == 0 and ab:
        try:
            a_str, b_str = ab.split()
            ahead, behind = int(a_str), int(b_str)
        except ValueError:
            ahead, behind = 0, 0

    return {
        "repo": repo_label,
        "branch": branch,
        "head": head_sha or None,
        "dirty": dirty,
        "ahead": ahead,
        "behind": behind,
        "error": None,
        "message": None,
    }
