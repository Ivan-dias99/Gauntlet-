"""
Rubeira V1 — Data Models
Pydantic models for request/response contracts and internal state.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# ── Enums ───────────────────────────────────────────────────────────────────

class ConfidenceLevel(str, Enum):
    """
    Two-tier confidence system (V2).
    
    HIGH   — All 3 triad responses are semantically identical.
             Rubeira delivers the answer with full conviction.
    LOW    — Any differences detected between responses.
             Rubeira refuses to answer.
    """
    HIGH = "high"
    LOW = "low"


class RefusalReason(str, Enum):
    """Why Rubeira refused to answer."""
    INCONSISTENCY = "inconsistency"
    PRIOR_FAILURE = "prior_failure"
    JUDGE_REJECTION = "judge_rejection"
    SAFETY = "safety"
    INSUFFICIENT_KNOWLEDGE = "insufficient_knowledge"


# ── Request Models ──────────────────────────────────────────────────────────

class RubeiraQuery(BaseModel):
    """Incoming question from the user."""
    question: str = Field(..., min_length=1, max_length=10000, description="The question to answer")
    context: Optional[str] = Field(None, max_length=5000, description="Optional additional context")
    force_cautious: bool = Field(False, description="Force maximum caution mode")
    mission_id: Optional[str] = Field(None, max_length=128, description="Optional mission UUID for run tagging")


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
    should_refuse: bool = Field(False, description="Whether Rubeira should refuse to answer")
    refusal_reason: Optional[RefusalReason] = None


# ── Response Models ─────────────────────────────────────────────────────────

class RubeiraResponse(BaseModel):
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
