"""
Signal — Evidence ledger primitives (Wave E).

Unified shape for "this happened, here's the proof". Terminal already
emits gate/diff events from agent_loop tool_results; this module adds
the structured record that lands in the Delivery Ledger when a run
completes. Archive consumes the records to render the trail of proof.

Doctrine alignment: every claim ("typecheck passed", "build green",
"3 files changed") gets a typed record with provenance — what tool
fired it, which iteration of the agent loop, which mission, which
task. No claims without provenance.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal, Optional
import uuid

from pydantic import BaseModel, Field


GateName = Literal["typecheck", "build", "test"]
GateState = Literal["pass", "fail", "unavailable"]
EvidenceKind = Literal["gate", "diff", "command", "file_change", "tool_result"]


class EvidenceRecord(BaseModel):
    """A single proof point in a Delivery Ledger entry.

    Provenance (`source`, `iteration`, `missionId`, `taskId`) is mandatory
    — every claim must be traceable to the tool, agent loop iteration,
    mission, and task that produced it. Discriminating payload fields
    stay optional so partial evidence is still honest ("we have a diff
    but no typecheck"), but the audit trail itself can never be missing.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    kind: EvidenceKind
    source: str  # tool name, e.g. "run_command"
    iteration: int  # agent loop iteration when fired
    missionId: str
    taskId: str

    # Discriminating payloads — only one is meaningful per kind, but
    # all fields stay optional so the model accepts partial records
    # without rejecting them.
    gateName: Optional[GateName] = None
    gateState: Optional[GateState] = None

    diffFiles: Optional[int] = None
    diffAdded: Optional[int] = None
    diffRemoved: Optional[int] = None

    commandLine: Optional[str] = None
    commandExitCode: Optional[int] = None

    filePath: Optional[str] = None
    fileChange: Optional[Literal["created", "modified", "deleted"]] = None

    toolName: Optional[str] = None
    toolOk: Optional[bool] = None
    toolPreview: Optional[str] = None

    note: Optional[str] = None  # human-readable context


class DeliveryLedgerEntry(BaseModel):
    """Wave E — formal Delivery Ledger entry. Terminal/Surface-Final
    write one per acceptance/closure; Archive renders them in order.

    Mirrors V3.1 Decision §4 (Delivery Ledger artefact) with the
    minimal field set the chambers actually need today. Extensions
    land here, not in scattered ad-hoc dicts.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    missionId: str
    taskId: Optional[str] = None
    createdAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    summary: str

    # Aggregated rollups for fast UI rendering. Backed by `evidence` for
    # auditability — never trust a rollup without the underlying records.
    filesRead: int = 0
    filesChanged: int = 0
    commandsRun: int = 0
    diffSummary: Optional[str] = None  # e.g. "3 files +42 -7"
    gates: dict[str, GateState] = Field(default_factory=dict)
    buildStatus: GateState = "unavailable"
    testStatus: GateState = "unavailable"

    knownIssues: list[str] = Field(default_factory=list)
    rollbackPlan: Optional[str] = None
    releaseState: Literal["draft", "ready", "released", "rolled_back"] = "draft"

    # Wave 6a Tier-1 #1 link: when the Terminal ran in "modo seguro"
    # because upstream artefacts were missing, declare assumptions here.
    assumedContext: list[dict] = Field(default_factory=list)

    evidence: list[EvidenceRecord] = Field(default_factory=list)


def gate_evidence(
    name: GateName, state: GateState, *,
    source: str,
    iteration: int,
    mission_id: str,
    task_id: str,
) -> EvidenceRecord:
    """Convenience constructor for a gate evidence record."""
    return EvidenceRecord(
        kind="gate", gateName=name, gateState=state,
        source=source, iteration=iteration,
        missionId=mission_id, taskId=task_id,
    )


def diff_evidence(
    files: int, added: int, removed: int, *,
    source: str,
    iteration: int,
    mission_id: str,
    task_id: str,
) -> EvidenceRecord:
    """Convenience constructor for a diff evidence record."""
    return EvidenceRecord(
        kind="diff", diffFiles=files, diffAdded=added, diffRemoved=removed,
        source=source, iteration=iteration,
        missionId=mission_id, taskId=task_id,
    )
