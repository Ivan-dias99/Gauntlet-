"""
Ruberra — Data Models
Pydantic models for request/response contracts and internal state.
Confidence is binary: HIGH or LOW. No medium tier, no caveats.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field

from chambers.profiles import ChamberKey
from chambers.surface import SurfaceBrief


# ── Enums ───────────────────────────────────────────────────────────────────

class ConfidenceLevel(str, Enum):
    """
    Two-tier confidence system (V2).
    
    HIGH   — All 3 triad responses are semantically identical.
             Ruberra delivers the answer with full conviction.
    LOW    — Any differences detected between responses.
             Ruberra refuses to answer.
    """
    HIGH = "high"
    LOW = "low"


class RefusalReason(str, Enum):
    """Why Ruberra refused to answer."""
    INCONSISTENCY = "inconsistency"
    PRIOR_FAILURE = "prior_failure"
    JUDGE_REJECTION = "judge_rejection"
    SAFETY = "safety"
    INSUFFICIENT_KNOWLEDGE = "insufficient_knowledge"


# ── Request Models ──────────────────────────────────────────────────────────

class RuberraQuery(BaseModel):
    """Incoming question from the user."""
    question: str = Field(..., min_length=1, max_length=10000, description="The question to answer")
    context: Optional[str] = Field(None, max_length=5000, description="Optional additional context")
    force_cautious: bool = Field(False, description="Force maximum caution mode")
    mission_id: Optional[str] = Field(None, max_length=128, description="Optional mission UUID for run tagging")
    principles: Optional[list[str]] = Field(
        None,
        max_length=64,
        description="User-defined doctrine principles appended to the system prompt",
    )
    # Wave-1 addition — optional canonical chamber key. When present the
    # auto-router dispatches by chamber profile instead of is_dev_intent.
    # Kept optional so pre-Wave-1 clients keep working unchanged; becomes
    # mandatory in Wave 5 once profile behavior diverges.
    chamber: Optional[ChamberKey] = Field(
        None,
        description="Optional chamber key (insight|surface|terminal|archive|core). "
                    "When set, auto-routing uses the chamber profile; otherwise "
                    "falls back to the is_dev_intent heuristic.",
    )
    # Wave-3 Surface chamber brief. Carried inside the shared RuberraQuery
    # so /route/stream does not fragment into per-chamber endpoints. All
    # sub-fields are optional; defaults are applied server-side when the
    # surface chamber runs without an explicit brief.
    surface: Optional[SurfaceBrief] = Field(
        None,
        description="Surface-chamber brief (mode, fidelity, design_system). "
                    "Consumed only when chamber == 'surface'.",
    )


# ── Internal Models ─────────────────────────────────────────────────────────

class TriadResponse(BaseModel):
    """A single response from one of the 3 parallel calls."""
    index: int
    content: str
    model: str
    stop_reason: Optional[str] = None
    input_tokens: int = 0
    output_tokens: int = 0


class JudgeVerdict(BaseModel):
    """The judge's assessment of the triad responses."""
    confidence: ConfidenceLevel
    reasoning: str = Field(..., description="Judge's reasoning for the verdict")
    consensus_answer: Optional[str] = Field(None, description="The merged/best answer if confidence == HIGH")
    divergence_points: list[str] = Field(default_factory=list, description="Where responses diverged")
    should_refuse: bool = Field(False, description="Whether Ruberra should refuse to answer")
    refusal_reason: Optional[RefusalReason] = None


# ── Response Models ─────────────────────────────────────────────────────────

class RuberraResponse(BaseModel):
    """The final response delivered to the user."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    
    # The answer (or refusal)
    answer: Optional[str] = None
    refused: bool = False
    refusal_message: Optional[str] = None
    refusal_reason: Optional[RefusalReason] = None
    
    # Confidence metadata
    confidence: ConfidenceLevel
    confidence_explanation: str = ""
    
    # Transparency — show the user what happened internally
    triad_agreement: str = Field("", description="Summary: how the 3 responses agreed/diverged")
    judge_reasoning: str = Field("", description="The judge's reasoning (transparency)")
    
    # Diagnostics
    total_input_tokens: int = 0
    total_output_tokens: int = 0
    triad_call_count: int = 3
    processing_time_ms: int = 0
    
    # Failure memory flag
    matched_prior_failure: bool = False
    prior_failure_note: Optional[str] = None


# ── Failure Memory Models ───────────────────────────────────────────────────

class FailureRecord(BaseModel):
    """A recorded failure for the memory system."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    question: str
    question_fingerprint: str = Field("", description="Normalized lowercase fingerprint for matching")
    failure_type: RefusalReason
    triad_divergence_summary: str = ""
    judge_reasoning: str = ""
    times_failed: int = 1


class FailureMemory(BaseModel):
    """Persistent failure memory store."""
    records: list[FailureRecord] = Field(default_factory=list)
    total_failures: int = 0
    last_updated: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ── Run Log (every query that hits the engine) ──────────────────────────────

class RunRecord(BaseModel):
    """A single completed run — agent or triad — persisted to disk."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    route: str = Field(..., description="agent | triad | dev | ask")
    mission_id: Optional[str] = None
    question: str
    context: Optional[str] = None
    answer: Optional[str] = None
    refused: bool = False
    confidence: Optional[str] = None
    judge_reasoning: Optional[str] = None
    tool_calls: list[dict] = Field(default_factory=list)
    iterations: Optional[int] = None
    processing_time_ms: int = 0
    input_tokens: int = 0
    output_tokens: int = 0
    terminated_early: bool = False
    termination_reason: Optional[str] = None


class RunsLog(BaseModel):
    """Append-only run log."""
    records: list[RunRecord] = Field(default_factory=list)
    last_updated: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ── Spine (Mission workspace) ───────────────────────────────────────────────

class NoteRecord(BaseModel):
    id: str
    text: str
    createdAt: int
    role: Optional[str] = None


class TaskRecord(BaseModel):
    id: str
    title: str
    done: bool = False
    createdAt: int
    doneAt: Optional[int] = None
    # Richer operational state from the Creation work surface. Pydantic drops
    # unknown fields by default, so any field the TS client writes must be
    # declared here — otherwise it vanishes on the first push/fetch round-trip
    # and the UI crashes reading `.length` / `.state` on undefined.
    state: Optional[str] = None
    source: Optional[str] = None
    lastUpdateAt: Optional[int] = None
    artifactId: Optional[str] = None


class LogEventRecord(BaseModel):
    id: str
    type: str
    label: str
    at: int


class ArtifactRecord(BaseModel):
    id: str
    taskTitle: str
    answer: str = ""
    terminatedEarly: bool = False
    acceptedAt: int
    # Run telemetry + backlink captured at accept time. Optional for back-compat
    # with artifacts persisted before these fields existed. See TaskRecord note
    # for why every TS field must be declared on the Pydantic side.
    taskId: Optional[str] = None
    iterations: Optional[int] = None
    toolCount: Optional[int] = None
    processingTimeMs: Optional[int] = None
    terminationReason: Optional[str] = None


class MissionRecord(BaseModel):
    id: str
    title: str
    chamber: str
    status: str = "active"
    createdAt: int
    notes: list[NoteRecord] = Field(default_factory=list)
    tasks: list[TaskRecord] = Field(default_factory=list)
    events: list[LogEventRecord] = Field(default_factory=list)
    lastArtifact: Optional[ArtifactRecord] = None
    # Ledger of accepted artifacts, newest first. Without this declaration the
    # TS client's `mission.artifacts` round-trips to `undefined` and pulse.ts
    # crashes on `.length`.
    artifacts: list[ArtifactRecord] = Field(default_factory=list)


class PrincipleRecord(BaseModel):
    id: str
    text: str
    createdAt: int


class SpineSnapshot(BaseModel):
    """Full workspace state — missions, active selection, principles."""
    missions: list[MissionRecord] = Field(default_factory=list)
    activeMissionId: Optional[str] = None
    principles: list[PrincipleRecord] = Field(default_factory=list)
    last_updated: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updatedAt: Optional[int] = None
