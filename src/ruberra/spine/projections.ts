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
  // Consequence payload — populated when execution backend returns real output.
  // Optional and backward-compatible: absent on all pre-existing stored events.
  files?: string[];    // affected file paths
  diff?: string;       // unified diff or change summary
  commitRef?: string;  // commit SHA or equivalent token
}

export interface CanonEntry {
  id: string;
  repo?: string; // canon is repo-scoped; law has territory
  memoryId?: string;
  text: string;
  hardenedAt: number;
  state: TruthState; // hardened | revoked
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

// ── Concept-to-Build Relay ─────────────────────────────────────────────────

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

function significantTokens(text: string): string[] {
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
