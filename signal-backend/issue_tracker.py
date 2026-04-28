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
