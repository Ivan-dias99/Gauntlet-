"""
Signal — Issue Tracker (Wave N).

Bridges Surface Final's "click → fix this here" + Terminal's known
issues into a structured tracker. Wave N v1 supports a single
provider (GitHub Issues) since the GitHub MCP is already wired in
the Claude Code session — but the schema is provider-agnostic so
Linear/Jira can be added without changing chamber code.

Provider-agnostic shape; provider-specific clients sit behind it.
The actual GitHub call uses the existing MCP (no new network code in
this file). This file ships:
  - IssueDraft (what a chamber emits when a user clicks "report this")
  - IssueRecord (what the tracker returns after creation)
  - format_for_github (markdown body for the GitHub MCP create call)
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Literal, Optional


IssueProvider = Literal["github", "linear", "jira"]
IssueStatus = Literal["open", "in_progress", "resolved", "closed"]
IssueKind = Literal["bug", "polish", "feature", "regression", "design", "perf"]


@dataclass
class IssueDraft:
    """What the chamber assembles before posting. Provider-agnostic."""
    title: str
    body: str
    kind: IssueKind = "bug"
    severity: Literal["low", "medium", "high"] = "medium"
    chamber: Optional[str] = None  # which chamber emitted (insight/surface/terminal/...)
    mission_id: Optional[str] = None
    artifact_ref: Optional[str] = None  # e.g. truth_distillation:v3 or build_specification:abc
    selector: Optional[str] = None  # CSS selector when from preview click-to-issue (Wave L)
    screenshot_url: Optional[str] = None  # CDN URL when attached
    file_path: Optional[str] = None  # source file when known
    line_number: Optional[int] = None
    labels: list[str] = field(default_factory=list)


@dataclass
class IssueRecord:
    """What the tracker returns after the issue exists. Includes the
    provider-specific id + the canonical URL the operator can click."""
    provider: IssueProvider
    external_id: str  # github issue number, linear id, jira key
    url: str
    title: str
    status: IssueStatus = "open"
    created_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    draft_ref: Optional[str] = None  # back-link to the IssueDraft id when persisted


# ── Formatters ──────────────────────────────────────────────────────────────


def _kind_emoji(kind: IssueKind) -> str:
    return {
        "bug": "🐛",
        "regression": "↩",
        "polish": "✦",
        "feature": "+",
        "design": "□",
        "perf": "⚡",
    }.get(kind, "·")


def _label_set(draft: IssueDraft) -> list[str]:
    """Default label set from kind + severity. Operator can extend."""
    out = [f"signal:{draft.kind}", f"severity:{draft.severity}"]
    if draft.chamber:
        out.append(f"chamber:{draft.chamber}")
    out.extend(l for l in draft.labels if l not in out)
    return out


def format_for_github(draft: IssueDraft) -> dict:
    """Build the kwargs dict for `mcp__github__issue_write` (or the
    REST POST /issues body). The Claude Code session passes this
    directly to the GitHub MCP create call when the operator confirms.
    """
    title = f"{_kind_emoji(draft.kind)} {draft.title}".strip()

    lines: list[str] = []
    lines.append(draft.body.strip() if draft.body else "_(no body)_")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("**Signal context**")
    if draft.chamber:
        lines.append(f"- chamber: `{draft.chamber}`")
    if draft.mission_id:
        lines.append(f"- mission: `{draft.mission_id}`")
    if draft.artifact_ref:
        lines.append(f"- artefact: `{draft.artifact_ref}`")
    if draft.selector:
        lines.append(f"- selector: `{draft.selector}`")
    if draft.file_path:
        loc = f"{draft.file_path}"
        if draft.line_number is not None:
            loc += f":{draft.line_number}"
        lines.append(f"- source: `{loc}`")
    if draft.screenshot_url:
        lines.append("")
        lines.append(f"![screenshot]({draft.screenshot_url})")

    body = "\n".join(lines)

    return {
        "title": title,
        "body": body,
        "labels": _label_set(draft),
    }


def format_for_linear(draft: IssueDraft) -> dict:
    """Linear has its own field set. Sketch only — actual Linear MCP
    would consume `title`, `description`, `labelIds` (resolved
    elsewhere)."""
    return {
        "title": f"{_kind_emoji(draft.kind)} {draft.title}",
        "description": draft.body,
        "labels": _label_set(draft),
    }


# ── GitHub REST client (Wave P-23) ──────────────────────────────────────────
#
# Until P-23, issue creation was MCP-only — the Claude Code session passed
# `format_for_github(draft)` to `mcp__github__issue_write`. P-23 adds a
# direct REST path so the running backend can post issues without an MCP
# session in the loop. The chamber calls /issues/create; this function does
# the actual HTTP. httpx is already a dependency (see requirements.txt).


GITHUB_ISSUES_TIMEOUT_SECONDS = 10.0
_GITHUB_API_BASE = "https://api.github.com"


async def create_github_issue(
    draft: IssueDraft,
    *,
    token: str,
    repo: str | None = None,
) -> dict:
    """POST a formatted IssueDraft to GitHub REST `/repos/{repo}/issues`.

    Args:
        draft: assembled IssueDraft (chamber-side).
        token: GitHub PAT or fine-grained token with `issues:write` on repo.
        repo: `owner/repo`. When omitted, falls back to `config.GITHUB_REPO`.

    Returns:
        `{"number": int, "html_url": str}` from the GitHub response.

    Raises:
        RuntimeError: non-2xx response from GitHub. Message embeds status
            and raw body so the operator/log can diagnose without re-querying.
        ValueError: when no repo can be resolved (caller bug).
    """
    if not repo:
        # Lazy import — keeps issue_tracker.py importable in environments
        # where config isn't fully wired (tests, scripts).
        import config as _config  # local to avoid import cycle on cold paths
        repo = _config.GITHUB_REPO
    if not repo:
        raise ValueError("create_github_issue: repo not provided and config.GITHUB_REPO is empty")
    if not token:
        raise ValueError("create_github_issue: token is required")

    payload = format_for_github(draft)
    body = {
        "title": payload["title"],
        "body": payload["body"],
        "labels": payload["labels"],
    }

    # httpx is in requirements.txt; import is lazy to keep cold-start cheap
    # for callers that never hit the issue path.
    import httpx  # type: ignore

    url = f"{_GITHUB_API_BASE}/repos/{repo}/issues"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    async with httpx.AsyncClient(timeout=GITHUB_ISSUES_TIMEOUT_SECONDS) as client:
        resp = await client.post(url, json=body, headers=headers)

    if resp.status_code < 200 or resp.status_code >= 300:
        # Trim the body so we don't dump a multi-KB error page into a
        # RuntimeError message; preserve enough to diagnose 401/422.
        text = resp.text[:500] if resp.text else ""
        raise RuntimeError(f"github issues api: {resp.status_code} {text}")

    data = resp.json()
    return {
        "number": data.get("number"),
        "html_url": data.get("html_url"),
    }
