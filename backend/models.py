"""
Gauntlet — Data Models
Pydantic models for request/response contracts and internal state.
Confidence is binary: HIGH or LOW. No medium tier, no caveats.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Any, Literal, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


# ── Enums ───────────────────────────────────────────────────────────────────

class ConfidenceLevel(str, Enum):
    """
    Two-tier confidence system (V2).
    
    HIGH   — All 3 triad responses are semantically identical.
             Signal delivers the answer with full conviction.
    LOW    — Any differences detected between responses.
             Signal refuses to answer.
    """
    HIGH = "high"
    LOW = "low"


class RefusalReason(str, Enum):
    """Why Signal refused to answer."""
    INCONSISTENCY = "inconsistency"
    PRIOR_FAILURE = "prior_failure"
    JUDGE_REJECTION = "judge_rejection"
    SAFETY = "safety"
    INSUFFICIENT_KNOWLEDGE = "insufficient_knowledge"


# ── Request Models ──────────────────────────────────────────────────────────

class SignalQuery(BaseModel):
    """Incoming question from the user."""
    question: str = Field(..., min_length=1, max_length=10000, description="The question to answer")
    context: Optional[str] = Field(None, max_length=5000, description="Optional additional context")
    force_cautious: bool = Field(False, description="Force maximum caution mode")
    mission_id: Optional[str] = Field(None, max_length=128, description="Optional mission UUID for run tagging")
    task_id: Optional[str] = Field(None, max_length=128, description="Optional task UUID for evidence provenance (Wave E)")
    principles: Optional[list[str]] = Field(
        None,
        max_length=64,
        description="User-defined doctrine principles appended to the system prompt",
    )
    # Optional free-form mode hint kept as a string for the composer flow
    # (e.g. "agent", "triad"). Legacy clients still send chamber names
    # (insight/surface/terminal/archive/core); they are accepted but no
    # longer drive any chamber-specific dispatch.
    chamber: Optional[str] = Field(
        None,
        description="Optional dispatch hint. Legacy alias kept for compat.",
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
    should_refuse: bool = Field(False, description="Whether Signal should refuse to answer")
    refusal_reason: Optional[RefusalReason] = None
    # Wave 6a Tier-1 Addition #2 — refusal with substitute.
    # When the judge refuses, this carries a smaller / more concrete
    # version of the question that could have been answered with high
    # confidence. Null on accept, or when the judge truly cannot offer
    # any narrower form. The frontend renders it as "I can't answer X
    # but I can answer Y →" with a reformulate button.
    nearest_answerable_question: Optional[str] = None


# ── Response Models ─────────────────────────────────────────────────────────

class SignalResponse(BaseModel):
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


class HandoffRecord(BaseModel):
    """Wave D — chamber-to-chamber transfer.

    Mirrors the TS HandoffRecord in src/spine/types.ts. Declared here so
    pydantic does not silently drop the queue on the spine round-trip
    (MissionRecord lives behind FastAPI's request parser; any field that
    is not declared is dropped before it reaches the JSON store or the
    Postgres mirror).
    """
    id: str
    fromChamber: str
    toChamber: str
    artifactType: str  # project_contract|truth_distillation|build_specification|delivery_ledger|note
    artifactRef: Optional[str] = None
    summary: str
    risks: list[str] = Field(default_factory=list)
    nextAction: str = ""
    status: str = "pending"  # pending|consumed|rejected|deferred
    createdAt: int
    resolvedAt: Optional[int] = None
    resolution: Optional[str] = None


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
    # Wave 6a — Truth Distillation versioned ledger per mission.
    # Auto-derived ProjectContract v0 lives here too. Both optional for
    # back-compat with missions persisted before Wave 6a.
    projectContract: Optional["ProjectContractRecord"] = None
    truthDistillations: list["TruthDistillationRecord"] = Field(default_factory=list)
    # Wave D — Handoff queue per mission. Optional for back-compat with
    # snapshots persisted before Wave D (MissionRecord defaults to empty).
    handoffs: list[HandoffRecord] = Field(default_factory=list)


# ── Wave 6a — Project Contract + Truth Distillation ────────────────────────

class SurfaceSeedRecord(BaseModel):
    """Hint passed from Insight to Surface — pre-populates the brief."""
    question: str
    designSystemSuggestion: Optional[str] = None
    screenCountEstimate: Optional[int] = None
    fidelityHint: Optional[str] = None  # "wireframe" | "hi-fi"


class TerminalSeedRecord(BaseModel):
    """Hint passed from Insight to Terminal — pre-populates first task."""
    task: str
    fileTargets: list[str] = Field(default_factory=list)
    riskLevel: Optional[str] = None  # "low" | "medium" | "high"
    requiresGate: list[str] = Field(default_factory=list)  # typecheck|build|test


class ProjectContractRecord(BaseModel):
    """Wave 6a ProjectContract — auto-derived v0 from mission spine.

    Kept intentionally permissive: every field optional. Operator edits
    inline in Insight or Core when they want richer specificity. The
    derivation happens server-side at distill time so Truth Distillation
    always has a base to build from.
    """
    version: int = 1
    concept: Optional[str] = None
    mission: Optional[str] = None
    targetUser: Optional[str] = None
    problem: Optional[str] = None
    scope: Optional[str] = None
    nonGoals: list[str] = Field(default_factory=list)
    principles: list[str] = Field(default_factory=list)
    knownRisks: list[str] = Field(default_factory=list)
    qualityGates: list[str] = Field(default_factory=list)
    definitionOfDone: Optional[str] = None
    riskPolicy: Optional[str] = None
    derivedFromSpine: bool = True
    createdAt: int
    updatedAt: int


class TruthDistillationRecord(BaseModel):
    """Insight's primary artefact — versioned, status-tagged, seedable.

    Status enum (string): draft | review | approved | stale | superseded |
    invalidated | blocked | failed. Validation is at the consumer side
    (frontend / backend handlers); we keep it as `str` here so old
    snapshots load even if the enum gains members later.
    """
    id: str
    version: int = 1
    status: str = "draft"
    sourceMissionId: str
    summary: str
    validatedDirection: str
    coreDecisions: list[str] = Field(default_factory=list)
    unknowns: list[str] = Field(default_factory=list)
    risks: list[str] = Field(default_factory=list)
    surfaceSeed: Optional[SurfaceSeedRecord] = None
    terminalSeed: Optional[TerminalSeedRecord] = None
    confidence: str = "medium"  # "low" | "medium" | "high"
    createdAt: int
    updatedAt: int
    supersedesVersion: Optional[int] = None
    staleSince: Optional[int] = None
    staleReason: Optional[str] = None
    failureState: Optional[str] = None  # 9 canonical codes from V3.1


# Forward-ref resolution for MissionRecord (uses ProjectContractRecord and
# TruthDistillationRecord declared below it).
MissionRecord.model_rebuild()


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


# ── Composer (Wave V0) — context · intent · preview · apply ────────────────
#
# The Composer surface wraps the existing brain (engine + agent + runs)
# without rewriting it. Four canonical stages, each carrying a typed id
# the next stage references — so payload is never resent.

class ContextSource(str, Enum):
    browser = "browser"
    desktop = "desktop"
    ide = "ide"
    terminal = "terminal"
    file = "file"
    image = "image"
    clipboard = "clipboard"


class ContextPackage(BaseModel):
    """Canonical context object captured at the cursor.

    Lives in an in-memory TTL cache (composer.py) and is referenced by
    `context_id` in subsequent calls so payload is never resent.
    """
    context_id: UUID = Field(default_factory=uuid4)
    source: ContextSource
    url: Optional[str] = None
    page_title: Optional[str] = None
    app_name: Optional[str] = None
    window_title: Optional[str] = None
    selection: Optional[str] = None
    clipboard: Optional[str] = None
    screenshot_ref: Optional[str] = None
    files: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
    permission_scope: list[str] = Field(default_factory=list)
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContextCaptureRequest(BaseModel):
    source: ContextSource
    url: Optional[str] = None
    page_title: Optional[str] = None
    app_name: Optional[str] = None
    window_title: Optional[str] = None
    selection: Optional[str] = Field(default=None, max_length=50_000)
    clipboard: Optional[str] = Field(default=None, max_length=50_000)
    screenshot_ref: Optional[str] = None
    files: list[str] = Field(default_factory=list, max_length=32)
    metadata: dict[str, Any] = Field(default_factory=dict)
    permission_scope: list[str] = Field(default_factory=list)


class ContextCaptureResponse(BaseModel):
    context_id: UUID
    confidence: float
    expires_at: datetime


# Open enum — backend may extend without breaking the wire.
IntentKind = Literal[
    "summarize", "rewrite", "extract", "analyze",
    "generate_code", "debug_code",
    "generate_image", "create_report", "create_design",
    "save_memory", "search_memory",
    "execute_plan", "automate_flow",
    "ambiguous",
    "unsupported",
]


class RiskLevel(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class ModelRoute(BaseModel):
    primary_model: str
    fallback_models: list[str] = Field(default_factory=list)
    reason: str
    expected_cost_usd: Optional[float] = None
    expected_latency_ms: Optional[int] = None
    quality_score: Optional[float] = None
    tool_requirements: list[str] = Field(default_factory=list)


class SuggestedAction(BaseModel):
    id: str
    label: str
    intent: IntentKind
    risk: RiskLevel = RiskLevel.low


class ComposerIntentRequest(BaseModel):
    context_id: UUID
    user_input: str = Field(..., min_length=1, max_length=10_000)
    chamber_hint: Optional[str] = None


class IntentResult(BaseModel):
    intent_id: UUID = Field(default_factory=uuid4)
    context_id: UUID
    intent: IntentKind
    confidence: float = Field(ge=0.0, le=1.0)
    summary: str
    user_input: str = Field(default="", max_length=10_000)
    suggested_actions: list[SuggestedAction] = Field(default_factory=list)
    model_route: ModelRoute
    tools_needed: list[str] = Field(default_factory=list)
    risk_estimate: RiskLevel
    requires_approval: bool
    clarifying_questions: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


ArtifactKind = Literal[
    "code_patch", "code_file", "text", "report",
    "image_prompt", "plan", "summary", "diff",
]


class ComposerArtifact(BaseModel):
    artifact_id: UUID = Field(default_factory=uuid4)
    kind: ArtifactKind
    content: str
    files_impacted: list[str] = Field(default_factory=list)
    diff: Optional[str] = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class ComposerPreviewRequest(BaseModel):
    intent_id: UUID
    overrides: dict[str, Any] = Field(default_factory=dict)


class PreviewResult(BaseModel):
    preview_id: UUID = Field(default_factory=uuid4)
    intent_id: UUID
    context_id: UUID
    artifact: ComposerArtifact
    risk: RiskLevel
    requires_approval: bool
    model_used: str
    tools_used: list[str] = Field(default_factory=list)
    latency_ms: int
    judge_verdict: Optional[Literal["high", "low"]] = None
    refused: bool = False
    refusal_reason: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ComposerApplyRequest(BaseModel):
    preview_id: UUID
    approved: bool
    approval_reason: Optional[str] = None


class ApplyResult(BaseModel):
    run_id: UUID
    preview_id: UUID
    status: Literal["applied", "rejected", "failed", "skipped"]
    artifacts: list[ComposerArtifact] = Field(default_factory=list)
    ledger_event_id: Optional[str] = None
    error: Optional[str] = None
    completed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ── DOM Actuator (Wave: ponta do cursor executa) ────────────────────────────
#
# The browser content script can manipulate the live page DOM. The model
# emits a typed list of actions; the content script executes them after
# user approval. Types are kept narrow on purpose — adding a new action
# requires touching this discriminated union and the matching TS executor
# in apps/browser-extension/lib/dom-actions.ts.

class DomActionFill(BaseModel):
    type: Literal["fill"] = "fill"
    selector: str = Field(min_length=1, max_length=500)
    value: str = Field(max_length=10_000)


class DomActionClick(BaseModel):
    type: Literal["click"] = "click"
    selector: str = Field(min_length=1, max_length=500)


class DomActionHighlight(BaseModel):
    type: Literal["highlight"] = "highlight"
    selector: str = Field(min_length=1, max_length=500)
    duration_ms: int = Field(default=1500, ge=100, le=10_000)


class DomActionScrollTo(BaseModel):
    type: Literal["scroll_to"] = "scroll_to"
    selector: str = Field(min_length=1, max_length=500)


# Discriminated union — pydantic uses the `type` field to pick the right
# subclass during validation. Wire format on JSON:
#   {"type":"fill","selector":"#email","value":"x@y.com"}
DomAction = DomActionFill | DomActionClick | DomActionHighlight | DomActionScrollTo


class DomPlanRequest(BaseModel):
    context_id: UUID
    user_input: str = Field(min_length=1, max_length=4000)


class DomPlanResult(BaseModel):
    plan_id: UUID = Field(default_factory=uuid4)
    context_id: UUID
    actions: list[DomAction] = Field(default_factory=list)
    # Inline text answer when the user's input is a question / request
    # for explanation rather than an action on the page. Mutually
    # exclusive with `actions` in practice — the capsule renders one
    # surface or the other based on which is non-empty.
    compose: Optional[str] = None
    reason: Optional[str] = None
    model_used: str
    latency_ms: int
    raw_response: Optional[str] = None  # kept for debugging when both empty
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ── Execution Contract (Sprint 3) ──────────────────────────────────────────
#
# After the cápsula runs the planner's actions on the live page, it
# reports the outcome back to the backend. The backend records each
# execution as a ledger event (route="composer:execution") so the
# Control Center can show the full lifecycle:
#   context → plan → approval → execution → result
#
# Status:
#   executed — user approved, executor ran. Per-action ok/err is in
#              `results`; "executed" is the envelope status, not a
#              guarantee that every step succeeded.
#   rejected — user dismissed the cápsula with an action plan visible
#              without executing. Records the *intent* to reject so the
#              Control Center can show the lifecycle even when the user
#              backed out.
#   failed   — the executor itself threw before/across steps. `error`
#              carries the message; `results` may be empty or partial.

ExecutionStatus = Literal["executed", "rejected", "failed"]


class ExecutedActionRecord(BaseModel):
    """One DOM action and its outcome — wire shape used by the
    /composer/execution endpoint and stored verbatim in the ledger."""
    action: DomAction
    ok: bool
    error: Optional[str] = Field(default=None, max_length=2000)
    danger: bool = False
    danger_reason: Optional[str] = Field(default=None, max_length=500)


class ExecutionReportRequest(BaseModel):
    """Cápsula → backend payload after executeDomActions resolves
    (or after user rejection of an action plan)."""
    plan_id: Optional[UUID] = None
    context_id: Optional[UUID] = None
    url: Optional[str] = Field(default=None, max_length=2000)
    page_title: Optional[str] = Field(default=None, max_length=500)
    status: ExecutionStatus
    results: list[ExecutedActionRecord] = Field(default_factory=list, max_length=64)
    has_danger: bool = False
    sequence_danger_reason: Optional[str] = Field(default=None, max_length=500)
    danger_acknowledged: bool = False
    error: Optional[str] = Field(default=None, max_length=2000)
    model_used: Optional[str] = Field(default=None, max_length=200)
    plan_latency_ms: Optional[int] = None
    user_input: Optional[str] = Field(default=None, max_length=10_000)


class ExecutionReportResponse(BaseModel):
    run_id: UUID
    ledger_event_id: Optional[str] = None
    received_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ── Governance Lock (Sprint 4) — Composer Settings ─────────────────────────
#
# Single source of truth for how the Composer captures context, executes
# actions, and requires approval. Persisted server-side so the Control
# Center can edit and the cápsula can read on every summon. Defaults are
# permissive (everything allowed, sane caps) so an empty settings file
# still produces a working Composer.

class DomainPolicy(BaseModel):
    """Per-hostname rule. Hostname is the matrix key.

    `allowed` is the hard gate — when false, no DOM action runs on this
    domain regardless of type. `require_danger_ack` is opt-in stricter
    behavior: when true, the cápsula forces the danger acknowledgement
    even on plans that wouldn't otherwise trigger it. Default false so
    Sprint 3 ergonomics survive the upgrade; operators tighten per-domain
    via the Control Center matrix."""
    allowed: bool = True
    require_danger_ack: bool = False


class ActionPolicy(BaseModel):
    """Per-DomAction.type rule. Type ('click', 'fill', 'highlight',
    'scroll_to') is the matrix key. Same semantics as DomainPolicy."""
    allowed: bool = True
    require_danger_ack: bool = False


class ToolPolicy(BaseModel):
    """Sprint 5 — per-tool governance gate. Lookup key is the tool name
    (Tool.name). Missing entries default to allowed; the operator opts
    OUT per-tool via the Control Center matrix. require_approval is
    advisory in Sprint 5 — the agent loop currently honours `allowed`
    only; the approval gate ships in Sprint 7."""
    allowed: bool = True
    require_approval: bool = False


class ComposerSettings(BaseModel):
    """The full governance contract. Everything optional in the Update
    counterpart — this model is the canonical replace-payload form
    used by GET / PUT /composer/settings."""
    # Per-domain matrix. Lookup by hostname; missing → default_domain_policy.
    domains: dict[str, DomainPolicy] = Field(default_factory=dict)
    # Per-action matrix. Lookup by DomAction.type; missing → default_action_policy.
    actions: dict[str, ActionPolicy] = Field(default_factory=dict)
    # Defaults for unmatched keys.
    default_domain_policy: DomainPolicy = Field(default_factory=DomainPolicy)
    default_action_policy: ActionPolicy = Field(default_factory=ActionPolicy)
    # Sprint 5 — per-tool matrix. Lookup by Tool.name. Missing tools default
    # to allowed=true; agent dispatcher consults this before each tool call.
    tool_policies: dict[str, ToolPolicy] = Field(default_factory=dict)
    # Context caps applied at /composer/context to keep payloads bounded.
    # Char-based for honesty: backend can only count chars, not "DOM
    # elements" — the extension also pre-truncates and the server cap is
    # defense-in-depth.
    max_page_text_chars: int = Field(default=6000, ge=500, le=50_000)
    max_dom_skeleton_chars: int = Field(default=4000, ge=500, le=20_000)
    # Defaults the cápsula honors at mount time.
    screenshot_default: bool = False
    # When true, the cápsula awaits reportExecution and surfaces failure
    # as an inline error — the lifecycle is mandatory, not best-effort.
    execution_reporting_required: bool = False
    updated_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


class ToolManifest(BaseModel):
    """Sprint 5 — declarative governance shape for a tool. Returned by
    GET /tools/manifests and rendered in the Control Center matrix."""
    name: str
    description: str
    mode: str  # read | draft | preview | execute_with_approval
    risk: str  # low | medium | high
    version: str
    scopes: list[str] = Field(default_factory=list)
    rollback_policy: str = "n/a"
    timeout_s: float


# ── Memory / Canon Lock (Sprint 7) ─────────────────────────────────────────
#
# Three memory namespaces, one store. The cápsula's memory_save tool
# writes into `note` by default; the composer pipeline injects relevant
# prior records into the model context on every preview/dom_plan call so
# the system carries continuity instead of starting from zero.
#
# kinds:
#   note            — operator-saved free-form prose
#   decision        — a decision made + the rationale (becomes canon
#                     when ratified; until then it's just a note)
#   failure_pattern — a known failure mode the operator wants surfaced
#                     when similar topics come up
#   preference      — user preference (style, tone, libraries to favour)
#   canon           — ratified decision; treated as authoritative when
#                     surfaced in context
#
# scope:
#   user            — visible to all projects
#   project         — scoped to project_id; only surfaces when that
#                     project is the active context

MemoryKind = Literal["note", "decision", "failure_pattern", "preference", "canon"]
MemoryScope = Literal["user", "project"]


class MemoryRecord(BaseModel):
    """One entry in the operator-callable memory store."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    kind: MemoryKind = "note"
    scope: MemoryScope = "user"
    project_id: Optional[str] = Field(default=None, max_length=128)
    topic: str = Field(..., min_length=1, max_length=500)
    body: str = Field(..., min_length=1, max_length=8000)
    fingerprint: str = Field(default="")
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    updated_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    times_seen: int = 1


class MemoryStoreSnapshot(BaseModel):
    """On-disk shape for the JSON-backed store."""
    records: list[MemoryRecord] = Field(default_factory=list)
    last_updated: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


class MemoryRecordCreate(BaseModel):
    """POST /memory/records body."""
    kind: MemoryKind = "note"
    scope: MemoryScope = "user"
    project_id: Optional[str] = Field(default=None, max_length=128)
    topic: str = Field(..., min_length=1, max_length=500)
    body: str = Field(..., min_length=1, max_length=8000)


class MemoryRecoverRequest(BaseModel):
    """POST /memory/recover body."""
    query: str = Field(..., min_length=1, max_length=500)
    project_id: Optional[str] = Field(default=None, max_length=128)
    max_results: int = Field(default=5, ge=1, le=20)


class MemoryRecoverResponse(BaseModel):
    matches: list[MemoryRecord] = Field(default_factory=list)
    query: str
    project_id: Optional[str] = None
