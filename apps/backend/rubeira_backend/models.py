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
    Three-tier confidence system.
    
    HIGH   — All 3 triad responses are semantically identical.
             Rubeira delivers the answer with full conviction.
    MEDIUM — Small acceptable variations exist between responses.
             Rubeira delivers but flags uncertainty explicitly.
    LOW    — Relevant differences detected between responses.
             Rubeira refuses to answer and explains why.
    """
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class RefusalReason(str, Enum):
    """Why Rubeira refused to answer."""
    INCONSISTENCY = "inconsistency"          # Triad responses diverged
    PRIOR_FAILURE = "prior_failure"          # Question matches a known failure pattern
    JUDGE_REJECTION = "judge_rejection"      # Judge explicitly rejected
    SAFETY = "safety"                        # Content safety
    INSUFFICIENT_KNOWLEDGE = "insufficient_knowledge"  # Model admitted ignorance
    INSUFFICIENT_CONFIDENCE = "insufficient_confidence"  # Judge flagged low confidence
    PROHIBITED_TOPIC = "prohibited_topic"    # Question touches a forbidden subject
    ULTRA_PARANOIA = "ultra_paranoia"        # Ultra-paranoia mode blocks all answers


# Alias preserved for callers that reference the newer "RefusalType" name.
RefusalType = RefusalReason


# ── Request Models ──────────────────────────────────────────────────────────

class RubeiraQuery(BaseModel):
    """Incoming question from the user."""
    question: str = Field(..., min_length=1, max_length=10000, description="The question to answer")
    context: Optional[str] = Field(None, max_length=5000, description="Optional additional context")
    force_cautious: bool = Field(False, description="Force maximum caution mode")


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
    consensus_answer: Optional[str] = Field(None, description="The merged/best answer if confidence >= MEDIUM")
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
