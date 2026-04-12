// Ruberra — Projections
// Derived, read-only views of the event log. Surfaces read these, never raw state.

import { RuberraEvent } from "./events";

export interface Repo {
  id: string;
  name: string;
  boundAt: number;
  verified?: boolean;
  branch?: string;
}

// Thread state machine derived from the thread's event history.
export type ThreadState =
  | "draft"
  | "open"
  | "directive-pending"
  | "executing"
  | "awaiting-review"
  | "closed";

export interface Thread {
  id: string;
  repo?: string;
  intent: string;
  openedAt: number;
  closedAt?: number;
  closeReason?: string;
  status: "open" | "closed";
  state: ThreadState;
  archived?: boolean;
  parentThread?: string; // causal lineage — the thread this was spawned from
}

// Directive composition: scope + risk + acceptance criteria.
export type DirectiveRisk = "reversible" | "consequential" | "destructive";
export type DirectiveStatus = "draft" | "accepted" | "rejected";

export interface Directive {
  id: string;
  thread: string;
  repo?: string;
  text: string;
  scope: string;
  risk: DirectiveRisk;
  acceptance: string;
  status: DirectiveStatus;
  reason?: string; // rejection reason
  ts: number;
}

// Concept — architect-first structured idea. Precedes directive commitment.
// Titles purpose, states hypothesis, carries acceptance signal.
// Promoted to directive when the architect is ready to cross the hinge.
export interface Concept {
  id: string;
  thread: string;
  repo?: string;
  title: string;
  hypothesis: string;
  ts: number;
  promoted: boolean; // true when promoted → directive
}

export interface CanonProposal {
  id: string;
  repo?: string;
  memoryId?: string;
  text: string;
  ts: number;
  hardened: boolean;
}

// Truth-State Taxonomy — every truth occupies exactly one state.
export type TruthState =
  | "draft"
  | "observed"
  | "retained"
  | "hardened"
  | "revoked";

export interface MemoryEntry {
  id: string;
  thread?: string;
  repo?: string; // memory is repo-anchored
  text: string;
  ts: number;
  promoted: boolean;
  state: TruthState; // observed | retained | hardened | revoked
}

export interface Execution {
  id: string;
  thread?: string;
  status: "running" | "succeeded" | "failed";
  startedAt: number;
  endedAt?: number;
  label: string;
  reason?: string;
  progressMessage?: string;  // W10: latest progress update
  progressValue?: number;    // W10: 0-100 progress percentage
}

export type ArtifactReview = "pending" | "accepted" | "rejected";

export interface Artifact {
  id: string;
  thread?: string;
  execution?: string;
  directive?: string;
  title: string;
  committed: boolean;
  review: ArtifactReview;
  reviewReason?: string;
  ts: number;
  files?: string[];
  diff?: string;
  commitRef?: string;
}

export interface CanonEntry {
  id: string;
  repo?: string;
  memoryId?: string;
  text: string;
  hardenedAt: number;
  state: TruthState;
  revokedAt?: number;
  revokeReason?: string;
}

export interface Contradiction {
  id: string;
  text: string;
  ts: number;
  resolved: boolean;
  repo?: string; // contradiction is repo-scoped; surfaces only within its origin repo
}

// ── Autonomous Flow (W10) ─────────────────────────────────────────────────

// Proposed directive — execution or agent suggests a follow-up step.
export type ProposalStatus = "pending" | "accepted" | "dismissed";

export interface DirectiveProposal {
  id: string;
  thread: string;
  repo?: string;
  text: string;
  scope: string;
  risk: DirectiveRisk;
  rationale: string;       // why the proposer suggests this
  proposedBy: string;      // agent name or "system"
  sourceExecutionId?: string;  // execution that generated this proposal
  status: ProposalStatus;
  dismissReason?: string;
  ts: number;
}

// Flow — a multi-step sequence of directives with branching logic.
export type FlowStatus = "active" | "completed" | "aborted";

export interface FlowStep {
  directiveText: string;
  scope: string;
  risk: DirectiveRisk;
  status: "pending" | "executing" | "succeeded" | "failed" | "skipped";
  directiveId?: string;  // populated when step is promoted to a real directive
  order: number;
}

export interface Flow {
  id: string;
  thread: string;
  repo?: string;
  name: string;
  steps: FlowStep[];
  currentStep: number;     // index into steps array
  status: FlowStatus;
  ts: number;
}

// Agent — a named participant with declared capabilities.
export type AgentCapability =
  | "execute"     // can run code / inference
  | "review"      // can review artifacts
  | "propose"     // can propose directives
  | "canon"       // can propose/harden canon
  | "observe";    // read-only telemetry

export interface Agent {
  id: string;
  name: string;
  capabilities: AgentCapability[];
  registeredAt: number;
  repo?: string;
}

// Agent assignment — links a directive to an agent.
export interface AgentAssignment {
  id: string;
  directiveId: string;
  agentId: string;
  thread: string;
  ts: number;
}

// ── System Awareness (W11) ────────────────────────────────────────────────

export type AnomalyKind =
  | "execution-failure-spike"
  | "contradiction-unresolved"
  | "memory-stagnation"
  | "canon-coverage-low"
  | "agent-idle";

export interface SystemAnomaly {
  id: string;
  kind: AnomalyKind;
  message: string;
  ts: number;
  resolved: boolean;
  repo?: string;
}

export interface HealthSnapshot {
  id: string;
  ts: number;
  repo?: string;
  executionSuccessRate: number;   // 0-1
  contradictionResolutionRate: number; // 0-1
  memoryPromotionVelocity: number;    // promoted / total
  canonCoverage: number;              // hardened / (hardened + proposed)
  activeAnomalies: number;
}

// ── Intelligence Compounding (W09) ────────────────────────────────────────

// Manual cross-thread knowledge link. The architect binds a canon entry or
// memory from one context to another thread, creating an explicit synthesis.
export interface KnowledgeSynthesis {
  id: string;
  sourceId: string;      // canon or memory id being linked
  sourceType: "canon" | "memory";
  targetThread: string;  // thread receiving the knowledge
  note: string;          // architect's reason for the link
  ts: number;
}

// Automatic resonance match — a hardened canon entry from another thread
// that shares significant token overlap with the current thread's work.
export type ResonanceVia = "intent" | "concept" | "directive" | "memory";

export interface ResonanceMatch {
  canonId: string;
  canonText: string;
  sourceThread?: string;  // thread where the canon was hardened (if known)
  targetThread: string;   // thread where resonance is detected
  overlap: number;        // match strength (shared token count)
  via: ResonanceVia;      // what surface matched
}

export interface Projection {
  repos: Repo[];
  activeRepo?: string;
  threads: Thread[];
  activeThread?: string;
  concepts: Concept[];
  directives: Directive[];
  memory: MemoryEntry[];
  executions: Execution[];
  artifacts: Artifact[];
  canon: CanonEntry[];
  canonProposals: CanonProposal[];
  contradictions: Contradiction[];
  syntheses: KnowledgeSynthesis[];
  proposals: DirectiveProposal[];
  flows: Flow[];
  agents: Agent[];
  assignments: AgentAssignment[];
  anomalies: SystemAnomaly[];
  healthSnapshots: HealthSnapshot[];
  chamber: "lab" | "school" | "creation" | "memory";
  missionFramed: boolean;
  lastEventId?: string;
}

const empty = (): Projection => ({
  repos: [],
  threads: [],
  concepts: [],
  directives: [],
  memory: [],
  executions: [],
  artifacts: [],
  canon: [],
  canonProposals: [],
  contradictions: [],
  syntheses: [],
  proposals: [],
  flows: [],
  agents: [],
  assignments: [],
  anomalies: [],
  healthSnapshots: [],
  chamber: "creation",
  missionFramed: false,
});

export function project(events: RuberraEvent[]): Projection {
  const p = empty();
  for (const ev of events) {
    p.lastEventId = ev.id;
    switch (ev.type) {
      case "repo.created":
      case "repo.bound": {
        const name = String(ev.payload.name ?? "repo");
        const id = String(ev.payload.id ?? ev.repo ?? ev.id);
        if (!p.repos.find((r) => r.id === id))
          p.repos.push({ id, name, boundAt: ev.ts });
        p.activeRepo = id;
        break;
      }
      case "thread.opened": {
        const intent = String(ev.payload.intent ?? "untitled intent");
        p.threads.push({
          id: ev.id,
          repo: ev.repo,
          intent,
          openedAt: ev.ts,
          status: "open",
          state: "open",
          parentThread: ev.payload.parentThread as string | undefined,
        });
        p.activeThread = ev.id;
        break;
      }
      case "thread.activated": {
        const target = p.threads.find((t) => t.id === ev.thread);
        if (target && target.status === "open") {
          p.activeThread = target.id;
        }
        break;
      }
      case "thread.closed": {
        const t = p.threads.find((t) => t.id === ev.thread);
        if (t) {
          t.status = "closed";
          t.state = "closed";
          t.closedAt = ev.ts;
          t.closeReason = ev.payload.reason as string | undefined;
        }
        if (p.activeThread === ev.thread) p.activeThread = undefined;
        break;
      }
      case "thread.archived": {
        const t = p.threads.find((t) => t.id === ev.payload.threadId);
        if (t) t.archived = true;
        break;
      }
      case "concept.stated": {
        p.concepts.push({
          id: ev.id,
          thread: String(ev.thread),
          repo: ev.repo,
          title: String(ev.payload.title ?? ""),
          hypothesis: String(ev.payload.hypothesis ?? ""),
          ts: ev.ts,
          promoted: false,
        });
        break;
      }
      case "directive.accepted": {
        const t = p.threads.find((t) => t.id === ev.thread);
        if (t && t.state !== "closed") t.state = "executing";
        if (ev.payload.conceptId) {
          const c = p.concepts.find(
            (c) => c.id === ev.payload.conceptId && c.thread === ev.thread,
          );
          if (c) c.promoted = true;
        }
        p.directives.push({
          id: ev.id,
          thread: String(ev.thread),
          repo: ev.repo,
          text: String(ev.payload.text ?? ""),
          scope: String(ev.payload.scope ?? "unscoped"),
          risk: (ev.payload.risk as Directive["risk"]) ?? "reversible",
          acceptance: String(ev.payload.acceptance ?? ""),
          status: "accepted",
          ts: ev.ts,
        });
        break;
      }
      case "directive.rejected": {
        p.directives.push({
          id: ev.id,
          thread: String(ev.thread),
          repo: ev.repo,
          text: String(ev.payload.text ?? ""),
          scope: String(ev.payload.scope ?? "unscoped"),
          risk: (ev.payload.risk as Directive["risk"]) ?? "reversible",
          acceptance: String(ev.payload.acceptance ?? ""),
          status: "rejected",
          reason: String(ev.payload.reason ?? ""),
          ts: ev.ts,
        });
        break;
      }
      case "chamber.entered": {
        const c = ev.payload.chamber as Projection["chamber"];
        if (c === "lab" || c === "school" || c === "creation" || c === "memory") p.chamber = c;
        break;
      }
      case "memory.captured": {
        p.memory.push({
          id: ev.id,
          thread: ev.thread,
          repo: ev.repo,
          text: String(ev.payload.text ?? ""),
          ts: ev.ts,
          promoted: false,
          state: "retained",
        });
        break;
      }
      case "memory.promoted": {
        const m = p.memory.find((m) => m.id === ev.payload.memoryId);
        if (m) {
          m.promoted = true;
          m.state = "hardened";
        }
        break;
      }
      case "memory.elevated": {
        const m = p.memory.find((m) => m.id === ev.payload.memoryId);
        if (m) {
          const to = ev.payload.to as TruthState | undefined;
          if (to && to !== "revoked") m.state = to;
        }
        break;
      }
      case "memory.revoked": {
        const m = p.memory.find((m) => m.id === ev.payload.memoryId);
        if (m) m.state = "revoked";
        break;
      }
      case "execution.started": {
        const t = p.threads.find((t) => t.id === ev.thread);
        if (t && t.state !== "closed") t.state = "executing";
        p.executions.push({
          id: ev.id,
          thread: ev.thread,
          status: "running",
          startedAt: ev.ts,
          label: String(ev.payload.label ?? "execution"),
        });
        break;
      }
      case "execution.progressed": {
        const x = p.executions.find((x) => x.id === ev.payload.executionId);
        if (x) {
          x.progressMessage = String(ev.payload.message ?? "");
          x.progressValue = ev.payload.progress as number | undefined;
        }
        break;
      }
      case "execution.succeeded":
      case "execution.failed": {
        const x = p.executions.find((x) => x.id === ev.payload.executionId);
        if (x) {
          x.status = ev.type === "execution.succeeded" ? "succeeded" : "failed";
          x.endedAt = ev.ts;
          x.reason = ev.payload.reason as string | undefined;
        }
        const t = p.threads.find((t) => t.id === ev.thread);
        if (t && t.state !== "closed") {
          const pendingArtifacts = p.artifacts.some(
            (a) => a.thread === t.id && a.review === "pending",
          );
          t.state = pendingArtifacts ? "awaiting-review" : "open";
        }
        break;
      }
      case "artifact.generated": {
        p.artifacts.push({
          id: ev.id,
          thread: ev.thread,
          execution: ev.payload.executionId as string | undefined,
          directive: ev.payload.directiveId as string | undefined,
          title: String(ev.payload.title ?? "artifact"),
          committed: false,
          review: "pending",
          ts: ev.ts,
          files: ev.payload.files as string[] | undefined,
          diff: ev.payload.diff as string | undefined,
          commitRef: ev.payload.commitRef as string | undefined,
        });
        const t = p.threads.find((t) => t.id === ev.thread);
        if (t && t.state !== "closed") t.state = "awaiting-review";
        break;
      }
      case "artifact.reviewed":
      case "artifact.rejected": {
        const a = p.artifacts.find((x) => x.id === ev.payload.artifactId);
        if (a) {
          const outcome =
            ev.type === "artifact.rejected"
              ? "rejected"
              : (ev.payload.outcome as ArtifactReview) ?? "accepted";
          a.review = outcome;
          a.reviewReason = ev.payload.reason as string | undefined;
        }
        const t = p.threads.find((t) => t.id === ev.thread);
        if (t && t.state !== "closed") {
          const stillPending = p.artifacts.some(
            (x) => x.thread === t.id && x.review === "pending",
          );
          if (!stillPending) t.state = "open";
        }
        break;
      }
      case "artifact.committed": {
        const a = p.artifacts.find((a) => a.id === ev.payload.artifactId);
        if (a) a.committed = true;
        break;
      }
      case "canon.proposed": {
        p.canonProposals.push({
          id: ev.id,
          repo: ev.repo,
          memoryId: ev.payload.memoryId as string | undefined,
          text: String(ev.payload.text ?? ""),
          ts: ev.ts,
          hardened: false,
        });
        break;
      }
      case "canon.hardened": {
        p.canon.push({
          id: ev.id,
          repo: ev.repo,
          memoryId: ev.payload.memoryId as string | undefined,
          text: String(ev.payload.text ?? ""),
          hardenedAt: ev.ts,
          state: "hardened",
        });
        const prop = p.canonProposals.find(
          (q) => q.id === ev.payload.proposalId,
        );
        if (prop) prop.hardened = true;
        if (ev.payload.scope === "mission") p.missionFramed = true;
        break;
      }
      case "canon.revoked": {
        const c = p.canon.find((c) => c.id === ev.payload.canonId);
        if (c) {
          c.state = "revoked";
          c.revokedAt = ev.ts;
          c.revokeReason = String(ev.payload.reason ?? "unstated");
        }
        break;
      }
      case "repo.verified": {
        const r = p.repos.find(
          (x) => x.id === ev.repo || x.id === ev.payload.repoId,
        );
        if (r) {
          r.verified = Boolean(ev.payload.ok);
          r.branch = ev.payload.branch as string | undefined;
        }
        break;
      }
      case "null.consequence":
        break;
      case "contradiction.detected": {
        p.contradictions.push({
          id: ev.id,
          text: String(ev.payload.text ?? ""),
          ts: ev.ts,
          resolved: false,
          ...(ev.repo ? { repo: ev.repo } : {}),
        });
        break;
      }
      case "contradiction.resolved": {
        const c = p.contradictions.find(
          (c) => c.id === ev.payload.contradictionId,
        );
        if (c) c.resolved = true;
        break;
      }
      case "knowledge.synthesized": {
        p.syntheses.push({
          id: ev.id,
          sourceId: String(ev.payload.sourceId ?? ""),
          sourceType: (ev.payload.sourceType as "canon" | "memory") ?? "canon",
          targetThread: String(ev.payload.targetThread ?? ev.thread ?? ""),
          note: String(ev.payload.note ?? ""),
          ts: ev.ts,
        });
        break;
      }
      // ── W10: Autonomous Flow ────────────────────────────────────────────
      case "directive.proposed": {
        p.proposals.push({
          id: ev.id,
          thread: String(ev.thread ?? ""),
          repo: ev.repo,
          text: String(ev.payload.text ?? ""),
          scope: String(ev.payload.scope ?? ""),
          risk: (ev.payload.risk as DirectiveRisk) ?? "reversible",
          rationale: String(ev.payload.rationale ?? ""),
          proposedBy: String(ev.payload.proposedBy ?? "system"),
          sourceExecutionId: ev.payload.sourceExecutionId as string | undefined,
          status: "pending",
          ts: ev.ts,
        });
        break;
      }
      case "proposal.accepted": {
        const prop = p.proposals.find((x) => x.id === ev.payload.proposalId);
        if (prop) prop.status = "accepted";
        break;
      }
      case "proposal.dismissed": {
        const prop = p.proposals.find((x) => x.id === ev.payload.proposalId);
        if (prop) {
          prop.status = "dismissed";
          prop.dismissReason = String(ev.payload.reason ?? "");
        }
        break;
      }
      case "flow.defined": {
        const steps = (ev.payload.steps as Array<Record<string, unknown>> | undefined) ?? [];
        p.flows.push({
          id: ev.id,
          thread: String(ev.thread ?? ""),
          repo: ev.repo,
          name: String(ev.payload.name ?? "unnamed flow"),
          steps: steps.map((s, i) => ({
            directiveText: String(s.directiveText ?? ""),
            scope: String(s.scope ?? ""),
            risk: (s.risk as DirectiveRisk) ?? "reversible",
            status: "pending" as const,
            order: i,
          })),
          currentStep: 0,
          status: "active",
          ts: ev.ts,
        });
        break;
      }
      case "flow.step.completed": {
        const flow = p.flows.find((f) => f.id === ev.payload.flowId);
        if (flow) {
          const stepIndex = ev.payload.stepIndex as number | undefined;
          const idx = stepIndex ?? flow.currentStep;
          if (flow.steps[idx]) {
            const outcome = String(ev.payload.outcome ?? "succeeded");
            flow.steps[idx].status = outcome === "failed" ? "failed" : "succeeded";
            flow.steps[idx].directiveId = ev.payload.directiveId as string | undefined;
          }
          flow.currentStep = idx + 1;
        }
        break;
      }
      case "flow.completed": {
        const flow = p.flows.find((f) => f.id === ev.payload.flowId);
        if (flow) {
          flow.status = (ev.payload.outcome as "completed" | "aborted") ?? "completed";
        }
        break;
      }
      case "agent.registered": {
        p.agents.push({
          id: ev.id,
          name: String(ev.payload.name ?? ""),
          capabilities: (ev.payload.capabilities as AgentCapability[]) ?? [],
          registeredAt: ev.ts,
          repo: ev.repo,
        });
        break;
      }
      case "agent.assigned": {
        p.assignments.push({
          id: ev.id,
          directiveId: String(ev.payload.directiveId ?? ""),
          agentId: String(ev.payload.agentId ?? ""),
          thread: String(ev.thread ?? ""),
          ts: ev.ts,
        });
        break;
      }
      // ── W11: System Awareness ─────────────────────────────────────────
      case "system.health.snapshot": {
        p.healthSnapshots.push({
          id: ev.id,
          ts: ev.ts,
          repo: ev.repo,
          executionSuccessRate: (ev.payload.executionSuccessRate as number) ?? 0,
          contradictionResolutionRate: (ev.payload.contradictionResolutionRate as number) ?? 0,
          memoryPromotionVelocity: (ev.payload.memoryPromotionVelocity as number) ?? 0,
          canonCoverage: (ev.payload.canonCoverage as number) ?? 0,
          activeAnomalies: (ev.payload.activeAnomalies as number) ?? 0,
        });
        break;
      }
      case "anomaly.detected": {
        p.anomalies.push({
          id: ev.id,
          kind: (ev.payload.kind as AnomalyKind) ?? "execution-failure-spike",
          message: String(ev.payload.message ?? ""),
          ts: ev.ts,
          resolved: false,
          repo: ev.repo,
        });
        break;
      }
      case "anomaly.resolved": {
        const a = p.anomalies.find((x) => x.id === ev.payload.anomalyId);
        if (a) a.resolved = true;
        break;
      }
    }
  }
  return p;
}

export function nextMove(p: Projection): string {
  if (!p.activeRepo) return "no repo";
  if (!p.missionFramed) return "no mission";
  if (!p.activeThread) return "no thread";
  const t = p.threads.find((x) => x.id === p.activeThread);
  if (!t) return "no thread";
  switch (t.state) {
    case "draft":
      return "draft";
    case "open":
      return "ready";
    case "directive-pending":
      return "pending";
    case "executing":
      return "executing";
    case "awaiting-review":
      return "review";
    case "closed":
      return "closed";
  }
}

export type RelayPhase =
  | "concept"
  | "directive"
  | "execution"
  | "artifact"
  | "review"
  | "committed"
  | "closed";

export interface RelayState {
  phase: RelayPhase;
  directiveCount: number;
  executionCount: number;
  artifactCount: number;
  committedCount: number;
  pendingReviewCount: number;
  cycleComplete: boolean;
}

const RELAY_PHASES: RelayPhase[] = [
  "concept", "directive", "execution", "artifact", "review", "committed",
];

export function threadRelay(p: Projection, threadId?: string): RelayState | null {
  if (!threadId) return null;
  const t = p.threads.find((x) => x.id === threadId);
  if (!t) return null;

  const directives = p.directives.filter((d) => d.thread === threadId);
  const executions = p.executions.filter((x) => x.thread === threadId);
  const artifacts = p.artifacts.filter((a) => a.thread === threadId);
  const committed = artifacts.filter((a) => a.committed);
  const pendingReview = artifacts.filter((a) => a.review === "pending");
  const running = executions.filter((x) => x.status === "running");

  let phase: RelayPhase;
  if (t.state === "closed") {
    phase = "closed";
  } else if (committed.length > 0 && pendingReview.length === 0 && running.length === 0) {
    phase = "committed";
  } else if (pendingReview.length > 0) {
    phase = "review";
  } else if (artifacts.length > 0 && running.length === 0) {
    phase = "artifact";
  } else if (running.length > 0) {
    phase = "execution";
  } else if (directives.length > 0) {
    phase = "directive";
  } else {
    phase = "concept";
  }

  return {
    phase,
    directiveCount: directives.length,
    executionCount: executions.length,
    artifactCount: artifacts.length,
    committedCount: committed.length,
    pendingReviewCount: pendingReview.length,
    cycleComplete: committed.length > 0 && pendingReview.length === 0 && running.length === 0,
  };
}

export const RELAY_PHASE_ORDER = RELAY_PHASES;

// ── Canon Dependency Surface ───────────────────────────────────────────────

export function significantTokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s,.;:!?()\[\]{}"'`]+/)
    .filter((w) => w.length > 3);
}

export interface CanonDependency {
  canonId: string;
  canonText: string;
  directiveId: string;
  directiveText: string;
  threadId: string;
  overlap: number;
}

export function canonDependents(
  p: Projection,
  canonId: string,
): CanonDependency[] {
  const c = p.canon.find((x) => x.id === canonId);
  if (!c) return [];
  const canonTokens = new Set(significantTokens(c.text));
  if (canonTokens.size === 0) return [];
  const results: CanonDependency[] = [];
  for (const d of p.directives) {
    const dTokens = significantTokens(`${d.text} ${d.scope}`);
    const overlap = dTokens.filter((t) => canonTokens.has(t)).length;
    if (overlap >= 2) {
      results.push({
        canonId: c.id,
        canonText: c.text,
        directiveId: d.id,
        directiveText: d.text,
        threadId: d.thread,
        overlap,
      });
    }
  }
  return results.sort((a, b) => b.overlap - a.overlap);
}

export function revokedCanonWithDependents(p: Projection): CanonDependency[] {
  const revoked = p.canon.filter((c) => c.state === "revoked");
  const all: CanonDependency[] = [];
  for (const c of revoked) {
    all.push(...canonDependents(p, c.id));
  }
  return all;
}

// ── Cross-Thread Resonance Detection (W09) ────────────────────────────────

// For a given thread, find hardened canon entries from *other* threads
// that share significant token overlap with the thread's work surfaces
// (intent, concepts, directives, memory). Returns matches sorted by strength.

function matchTokenOverlap(
  canonTokens: Set<string>,
  text: string,
): number {
  const tokens = significantTokens(text);
  return tokens.filter((t) => canonTokens.has(t)).length;
}

export function threadResonance(
  p: Projection,
  threadId: string,
): ResonanceMatch[] {
  const thread = p.threads.find((t) => t.id === threadId);
  if (!thread) return [];

  // Collect all text surfaces for this thread.
  const threadConcepts = p.concepts.filter((c) => c.thread === threadId);
  const threadDirectives = p.directives.filter((d) => d.thread === threadId);
  const threadMemory = p.memory.filter((m) => m.thread === threadId);

  // Hardened canon from other threads (or repo-wide canon without a thread).
  const memoryThreadMap = new Map<string, string>();
  for (const m of p.memory) {
    if (m.thread) memoryThreadMap.set(m.id, m.thread);
  }

  const otherCanon = p.canon.filter((c) => {
    if (c.state !== "hardened") return false;
    if (c.repo && thread.repo && c.repo !== thread.repo) return false;
    // If canon has a traceable thread origin and it's the same thread, exclude.
    if (c.memoryId) {
      const originThread = memoryThreadMap.get(c.memoryId);
      if (originThread === threadId) return false;
    }
    return true;
  });

  const results: ResonanceMatch[] = [];
  const seen = new Set<string>(); // deduplicate: canonId per best via

  for (const c of otherCanon) {
    const canonTokens = new Set(significantTokens(c.text));
    if (canonTokens.size === 0) continue;

    const sourceThread = c.memoryId
      ? memoryThreadMap.get(c.memoryId)
      : undefined;

    // Check intent.
    const intentOverlap = matchTokenOverlap(canonTokens, thread.intent);
    if (intentOverlap >= 2) {
      results.push({
        canonId: c.id,
        canonText: c.text,
        sourceThread,
        targetThread: threadId,
        overlap: intentOverlap,
        via: "intent",
      });
      seen.add(c.id);
    }

    // Check concepts.
    for (const concept of threadConcepts) {
      const overlap = matchTokenOverlap(
        canonTokens,
        `${concept.title} ${concept.hypothesis}`,
      );
      if (overlap >= 2 && !seen.has(c.id)) {
        results.push({
          canonId: c.id,
          canonText: c.text,
          sourceThread,
          targetThread: threadId,
          overlap,
          via: "concept",
        });
        seen.add(c.id);
      }
    }

    // Check directives.
    for (const d of threadDirectives) {
      const overlap = matchTokenOverlap(
        canonTokens,
        `${d.text} ${d.scope}`,
      );
      if (overlap >= 2 && !seen.has(c.id)) {
        results.push({
          canonId: c.id,
          canonText: c.text,
          sourceThread,
          targetThread: threadId,
          overlap,
          via: "directive",
        });
        seen.add(c.id);
      }
    }

    // Check memory.
    for (const m of threadMemory) {
      const overlap = matchTokenOverlap(canonTokens, m.text);
      if (overlap >= 2 && !seen.has(c.id)) {
        results.push({
          canonId: c.id,
          canonText: c.text,
          sourceThread,
          targetThread: threadId,
          overlap,
          via: "memory",
        });
        seen.add(c.id);
      }
    }
  }

  return results.sort((a, b) => b.overlap - a.overlap);
}

// ── Concept Ancestry (W09) ────────────────────────────────────────────────

// For a given concept, find hardened canon entries that are semantically
// related — the "ancestors" that informed this concept. Includes both
// automatic token-overlap detection and explicit synthesis links.

export function conceptAncestry(
  p: Projection,
  conceptId: string,
): CanonEntry[] {
  const concept = p.concepts.find((c) => c.id === conceptId);
  if (!concept) return [];

  const conceptText = `${concept.title} ${concept.hypothesis}`;
  const hardened = p.canon.filter(
    (c) => c.state === "hardened" && (!c.repo || c.repo === concept.repo),
  );

  // Automatic: token-overlap detection.
  const matches: { entry: CanonEntry; overlap: number }[] = [];
  for (const c of hardened) {
    const canonTokens = new Set(significantTokens(c.text));
    if (canonTokens.size === 0) continue;
    const overlap = matchTokenOverlap(canonTokens, conceptText);
    if (overlap >= 2) {
      matches.push({ entry: c, overlap });
    }
  }

  // Explicit: synthesis links targeting this concept's thread.
  const explicitIds = new Set(
    p.syntheses
      .filter((s) => s.targetThread === concept.thread && s.sourceType === "canon")
      .map((s) => s.sourceId),
  );
  for (const c of hardened) {
    if (explicitIds.has(c.id) && !matches.some((m) => m.entry.id === c.id)) {
      matches.push({ entry: c, overlap: 999 }); // explicit link = max priority
    }
  }

  return matches
    .sort((a, b) => b.overlap - a.overlap)
    .map((m) => m.entry);
}

// ── Thread Synthesis Surface (W09) ────────────────────────────────────────

export interface ResolvedSynthesis {
  id: string;
  sourceId: string;
  sourceType: "canon" | "memory";
  sourceText: string;
  note: string;
  ts: number;
}

export function threadSyntheses(
  p: Projection,
  threadId: string,
): ResolvedSynthesis[] {
  return p.syntheses
    .filter((s) => s.targetThread === threadId)
    .map((s) => {
      let sourceText = "";
      if (s.sourceType === "canon") {
        const c = p.canon.find((x) => x.id === s.sourceId);
        sourceText = c?.text ?? "";
      } else {
        const m = p.memory.find((x) => x.id === s.sourceId);
        sourceText = m?.text ?? "";
      }
      return {
        id: s.id,
        sourceId: s.sourceId,
        sourceType: s.sourceType,
        sourceText,
        note: s.note,
        ts: s.ts,
      };
    })
    .filter((s) => s.sourceText.length > 0);
}

// ── Compounding Integrity Gate (W09-B03 hardening) ───────────────────────

export type CompoundingViolationCode =
  | "resonance-self-origin"
  | "synthesis-missing-source";

export interface CompoundingViolation {
  code: CompoundingViolationCode;
  threadId: string;
  detail: string;
}

export function compoundingViolations(
  p: Projection,
  threadId: string,
): CompoundingViolation[] {
  const violations: CompoundingViolation[] = [];

  for (const match of threadResonance(p, threadId)) {
    if (match.sourceThread && match.sourceThread === threadId) {
      violations.push({
        code: "resonance-self-origin",
        threadId,
        detail: `self-origin canon ${match.canonId} leaked into resonance`,
      });
    }
  }

  for (const s of p.syntheses.filter((x) => x.targetThread === threadId)) {
    if (s.sourceType === "canon") {
      const c = p.canon.find((x) => x.id === s.sourceId);
      if (!c) {
        violations.push({
          code: "synthesis-missing-source",
          threadId,
          detail: `missing canon source ${s.sourceId} for synthesis ${s.id}`,
        });
      }
    } else {
      const m = p.memory.find((x) => x.id === s.sourceId);
      if (!m) {
        violations.push({
          code: "synthesis-missing-source",
          threadId,
          detail: `missing memory source ${s.sourceId} for synthesis ${s.id}`,
        });
      }
    }
  }

  return violations;
}

// ── System Awareness Projections (W11) ──────────────────────────────────

/** Compute live system health metrics from the projection. */
export interface SystemHealthMetrics {
  executionSuccessRate: number;
  contradictionResolutionRate: number;
  memoryPromotionVelocity: number;
  canonCoverage: number;
  activeAnomalyCount: number;
  healthScore: number; // 0-100 composite
}

export function systemHealth(p: Projection, repo?: string): SystemHealthMetrics {
  const r = repo ?? p.activeRepo;

  const finished = p.executions.filter((x) => x.status !== "running");
  const succeeded = finished.filter((x) => x.status === "succeeded").length;
  const executionSuccessRate = finished.length > 0 ? succeeded / finished.length : 1;

  const repoContradictions = p.contradictions.filter((c) => !c.repo || c.repo === r);
  const resolved = repoContradictions.filter((c) => c.resolved).length;
  const contradictionResolutionRate = repoContradictions.length > 0
    ? resolved / repoContradictions.length : 1;

  const repoMemory = p.memory.filter((m) => !m.repo || m.repo === r);
  const promoted = repoMemory.filter((m) => m.promoted).length;
  const memoryPromotionVelocity = repoMemory.length > 0
    ? promoted / repoMemory.length : 0;

  const hardened = p.canon.filter((c) => c.state === "hardened" && (!c.repo || c.repo === r)).length;
  const proposed = p.canonProposals.filter((c) => !c.hardened && (!c.repo || c.repo === r)).length;
  const canonCoverage = (hardened + proposed) > 0 ? hardened / (hardened + proposed) : 0;

  const activeAnomalyCount = p.anomalies.filter((a) => !a.resolved && (!a.repo || a.repo === r)).length;

  // Composite health score: weighted average of key metrics
  const healthScore = Math.round(
    (executionSuccessRate * 30 +
     contradictionResolutionRate * 25 +
     (1 - Math.min(activeAnomalyCount, 5) / 5) * 25 +
     canonCoverage * 20) * 100 / 100,
  );

  return {
    executionSuccessRate,
    contradictionResolutionRate,
    memoryPromotionVelocity,
    canonCoverage,
    activeAnomalyCount,
    healthScore,
  };
}

/** Active (unresolved) anomalies for a repo. */
export function activeAnomalies(p: Projection, repo?: string): SystemAnomaly[] {
  const r = repo ?? p.activeRepo;
  return p.anomalies.filter((a) => !a.resolved && (!a.repo || a.repo === r));
}

// ── Intelligence Analytics Projections (W11) ─────────────────────────────

export interface IntelligenceMetrics {
  resonanceCount: number;           // total cross-thread resonance matches
  synthesisCount: number;           // explicit knowledge links created
  conceptToCanonRate: number;       // concepts that have canon ancestry / total concepts
  memoryToCanonRate: number;        // memories promoted to canon / total memories
  threadCount: number;              // total threads
  activeThreadCount: number;        // open threads
  knowledgeDensity: number;         // (canon + syntheses) / threads — knowledge per thread
  executionThroughput: number;      // completed executions / total executions
  agentCount: number;               // registered agents
  agentUtilization: number;         // assigned directives / total accepted directives
}

export function intelligenceMetrics(p: Projection, repo?: string): IntelligenceMetrics {
  const r = repo ?? p.activeRepo;

  const repoThreads = p.threads.filter((t) => !t.repo || t.repo === r);
  const threadCount = repoThreads.length;
  const activeThreadCount = repoThreads.filter((t) => t.status === "open").length;

  // Resonance: count how many matches exist across all active threads
  let resonanceCount = 0;
  for (const t of repoThreads.filter((t) => t.status === "open")) {
    resonanceCount += threadResonance(p, t.id).length;
  }

  const synthesisCount = p.syntheses.length;

  // Concept → Canon ancestry rate
  const repoConcepts = p.concepts.filter((c) => !c.repo || c.repo === r);
  let conceptsWithAncestry = 0;
  for (const c of repoConcepts) {
    if (conceptAncestry(p, c.id).length > 0) conceptsWithAncestry++;
  }
  const conceptToCanonRate = repoConcepts.length > 0
    ? conceptsWithAncestry / repoConcepts.length : 0;

  // Memory → Canon promotion
  const repoMemory = p.memory.filter((m) => !m.repo || m.repo === r);
  const memoryToCanon = repoMemory.filter((m) => m.state === "hardened").length;
  const memoryToCanonRate = repoMemory.length > 0 ? memoryToCanon / repoMemory.length : 0;

  // Knowledge density
  const canonCount = p.canon.filter((c) => c.state === "hardened" && (!c.repo || c.repo === r)).length;
  const knowledgeDensity = threadCount > 0 ? (canonCount + synthesisCount) / threadCount : 0;

  // Execution throughput
  const finished = p.executions.filter((x) => x.status !== "running");
  const executionThroughput = p.executions.length > 0 ? finished.length / p.executions.length : 0;

  // Agent utilization
  const agentCount = p.agents.filter((a) => !a.repo || a.repo === r).length;
  const acceptedDirectives = p.directives.filter((d) => d.status === "accepted" && (!d.repo || d.repo === r)).length;
  const assignedDirectives = p.assignments.length;
  const agentUtilization = acceptedDirectives > 0 ? Math.min(assignedDirectives / acceptedDirectives, 1) : 0;

  return {
    resonanceCount,
    synthesisCount,
    conceptToCanonRate,
    memoryToCanonRate,
    threadCount,
    activeThreadCount,
    knowledgeDensity,
    executionThroughput,
    agentCount,
    agentUtilization,
  };
}

/** Execution performance breakdown. */
export interface ExecutionAnalytics {
  total: number;
  running: number;
  succeeded: number;
  failed: number;
  successRate: number;
  avgDurationMs: number | null;  // null if no completed executions
}

export function executionAnalytics(p: Projection): ExecutionAnalytics {
  const total = p.executions.length;
  const running = p.executions.filter((x) => x.status === "running").length;
  const succeeded = p.executions.filter((x) => x.status === "succeeded").length;
  const failed = p.executions.filter((x) => x.status === "failed").length;
  const finished = p.executions.filter((x) => x.endedAt);
  const successRate = (succeeded + failed) > 0 ? succeeded / (succeeded + failed) : 1;

  let avgDurationMs: number | null = null;
  if (finished.length > 0) {
    const totalDuration = finished.reduce(
      (sum, x) => sum + ((x.endedAt ?? x.startedAt) - x.startedAt), 0,
    );
    avgDurationMs = totalDuration / finished.length;
  }

  return { total, running, succeeded, failed, successRate, avgDurationMs };
}
