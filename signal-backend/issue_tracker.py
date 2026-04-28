"""Signal — Issue Tracker. IssueDraft → provider-specific kwargs."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Literal, Optional


IssueProvider = Literal["github", "linear", "jira"]
IssueStatus = Literal["open", "in_progress", "resolved", "closed"]
IssueKind = Literal["bug", "polish", "feature", "regression", "design", "perf"]


@dataclass
class IssueDraft:
    title: str
    body: str
    kind: IssueKind = "bug"
    severity: Literal["low", "medium", "high"] = "medium"
    chamber: Optional[str] = None
    mission_id: Optional[str] = None
    artifact_ref: Optional[str] = None
    selector: Optional[str] = None
    screenshot_url: Optional[str] = None
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    labels: list[str] = field(default_factory=list)


def _kind_emoji(kind: IssueKind) -> str:
    return {"bug": "🐛", "regression": "↩", "polish": "✦", "feature": "+", "design": "□", "perf": "⚡"}.get(kind, "·")


def _label_set(draft: IssueDraft) -> list[str]:
    out = [f"signal:{draft.kind}", f"severity:{draft.severity}"]
    if draft.chamber:
        out.append(f"chamber:{draft.chamber}")
    out.extend(l for l in draft.labels if l not in out)
    return out


def format_for_github(draft: IssueDraft) -> dict:
    title = f"{_kind_emoji(draft.kind)} {draft.title}".strip()
    lines: list[str] = [draft.body.strip() if draft.body else "_(no body)_", "", "---", "", "**Signal context**"]
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
    return {"title": title, "body": "\n".join(lines), "labels": _label_set(draft)}


def format_for_linear(draft: IssueDraft) -> dict:
    return {
        "title": f"{_kind_emoji(draft.kind)} {draft.title}",
        "description": draft.body,
        "labels": _label_set(draft),
    }
