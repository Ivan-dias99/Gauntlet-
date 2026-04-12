// Ruberra — Store
// Backend-authoritative in spirit; the event log is the source of truth.
// This store is a React binding that recomputes a projection on every event.
// No domain state lives in React state or localStorage.

import { useSyncExternalStore } from "react";
import { all, subscribe, hydrate, append } from "./eventLog";
import { project, Projection } from "./projections";
import { EventType } from "./events";
import { verifyRepo } from "./gitAuthority";
import { ALL_SEEDS } from "./seeds";

let cached: Projection | null = null;
let version = 0;
const storeListeners = new Set<() => void>();

function recompute() {
  cached = project(all());
  version++;
  storeListeners.forEach((l) => l());
}

subscribe(() => recompute());

export function bootSpine(): Promise<void> {
  return hydrate().then(() => recompute());
}

function getSnapshot(): Projection {
  if (!cached) cached = project(all());
  return cached;
}

function subscribeStore(l: () => void) {
  storeListeners.add(l);
  return () => storeListeners.delete(l);
}

export function useProjection(): Projection {
  useSyncExternalStore(subscribeStore, () => version, () => 0);
  return getSnapshot();
}

function requireRepo(): string {
  const repo = (cached ?? project(all())).activeRepo;
  if (!repo) throw new Error("Repo Centrality: no repo bound — spine mutation refused");
  return repo;
}

function requireThread(threadId: string) {
  const p = cached ?? project(all());
  const t = p.threads.find((x) => x.id === threadId);
  if (!t) throw new Error("Directive Hinge: thread not found");
  if (t.status !== "open")
    throw new Error("Directive Hinge: thread is closed");
  return t;
}

export const emit = {
  bindRepo: async (name: string) => {
    const ev = await append("repo.bound", { name, id: name }, { repo: name });
    verifyRepo(name).then((result) =>
      append(
        "repo.verified",
        { ok: result.ok, message: result.message, branch: result.branch, repoId: name },
        { repo: name },
      ),
    );
    return ev;
  },

  enterChamber: (chamber: "lab" | "school" | "creation" | "memory") =>
    append("chamber.entered", { chamber }, { repo: requireRepo() }),

  openThread: (intent: string, parentThread?: string) => {
    const repo = requireRepo();
    if (!intent.trim())
      return append("null.consequence", {
        action: "thread.open",
        reason: "empty intent",
      });
    return append(
      "thread.opened",
      { intent, ...(parentThread ? { parentThread } : {}) },
      { repo },
    );
  },

  activateThread: (threadId: string) => {
    const t = requireThread(threadId);
    return append("thread.activated", {}, { thread: t.id, repo: t.repo });
  },

  closeThread: (threadId: string, reason: string) => {
    const t = requireThread(threadId);
    if (!reason.trim())
      throw new Error("Thread close refused: reason required");
    return append("thread.closed", { reason }, { thread: t.id, repo: t.repo });
  },

  archiveThread: (threadId: string) =>
    append("thread.archived", { threadId }, { repo: requireRepo() }),

  stateIntent: (threadId: string, text: string) => {
    const t = requireThread(threadId);
    return append("intent.stated", { text }, { thread: t.id, repo: t.repo });
  },

  stateConcept: (threadId: string, title: string, hypothesis: string) => {
    const t = requireThread(threadId);
    if (!title.trim() || !hypothesis.trim())
      throw new Error("Concept refused: title and hypothesis are required");
    return append(
      "concept.stated",
      { title, hypothesis },
      { thread: t.id, repo: t.repo },
    );
  },

  acceptDirective: async (
    threadId: string,
    compose: {
      text: string;
      scope: string;
      risk: "reversible" | "consequential" | "destructive";
      acceptance: string;
      conceptId?: string;
    },
  ) => {
    const t = requireThread(threadId);
    const { text, scope, risk, acceptance, conceptId } = compose;
    if (!text.trim() || !scope.trim() || !acceptance.trim()) {
      throw new Error(
        "Directive refused: text, scope, and acceptance are required",
      );
    }
    if (/\{\{[^}]+\}\}/.test(text)) {
      throw new Error("Directive refused: unresolved ambiguity in text");
    }

    let resolvedConceptId: string | undefined = undefined;
    if (conceptId) {
      const p = cached ?? project(all());
      const concept = p.concepts.find((c) => c.id === conceptId);
      if (concept && concept.thread === t.id) {
        resolvedConceptId = conceptId;
      }
    }

    const ev = await append(
      "directive.accepted",
      { text, scope, risk, acceptance, ...(resolvedConceptId ? { conceptId: resolvedConceptId } : {}) },
      { thread: t.id, repo: t.repo },
    );

    const snapshot = cached ?? project(all());
    const fullText = `${text} ${scope}`.toLowerCase();
    const negated = /\b(not|never|no longer|without|cannot|remove|delete|disable)\b/.test(fullText);
    if (negated) {
      for (const c of snapshot.canon) {
        if (c.state !== "hardened" || c.repo !== t.repo) continue;
        const clower = c.text.toLowerCase();
        const shared = fullText
          .split(/\s+/)
          .filter((w) => w.length > 4 && clower.includes(w));
        if (shared.length >= 2) {
          await append(
            "contradiction.detected",
            {
              text: `directive may contradict canon: "${c.text}"`,
              canonId: c.id,
              directiveId: ev.id,
            },
            { repo: t.repo, parent: c.id, thread: t.id },
          );
        }
      }
    }

    return ev;
  },

  rejectDirective: (
    threadId: string,
    compose: {
      text: string;
      scope: string;
      risk: "reversible" | "consequential" | "destructive";
      acceptance: string;
    },
    reason: string,
  ) => {
    const t = requireThread(threadId);
    if (!reason.trim())
      throw new Error("Rejection refused: reason required");
    return append(
      "directive.rejected",
      { ...compose, reason },
      { thread: t.id, repo: t.repo },
    );
  },

  captureMemory: async (text: string, threadId?: string) => {
    const repo = requireRepo();
    if (!text.trim()) throw new Error("Memory refused: empty text");
    const ev = await append(
      "memory.captured",
      { text },
      { thread: threadId, repo },
    );
    const p = cached ?? project(all());
    const lower = text.toLowerCase();
    const negated = /\b(not|never|no longer|without|cannot)\b/.test(lower);
    if (negated) {
      for (const c of p.canon) {
        if (c.state !== "hardened" || c.repo !== repo) continue;
        const clower = c.text.toLowerCase();
        const shared = lower
          .split(/\s+/)
          .filter((w) => w.length > 4 && clower.includes(w));
        if (shared.length >= 2) {
          await append(
            "contradiction.detected",
            {
              text: `observation contradicts canon: "${c.text}"`,
              canonId: c.id,
              memoryId: ev.id,
            },
            { repo, parent: c.id },
          );
        }
      }
    }
    return ev;
  },

  promoteMemory: (memoryId: string) =>
    append("memory.promoted", { memoryId }, { repo: requireRepo() }),

  elevateMemory: (memoryId: string, to: "observed" | "retained" | "hardened") =>
    append("memory.elevated", { memoryId, to }, { repo: requireRepo(), parent: memoryId }),

  revokeMemory: (memoryId: string, reason: string) => {
    if (!reason.trim()) throw new Error("Revocation refused: reason required");
    return append(
      "memory.revoked",
      { memoryId, reason },
      { repo: requireRepo(), parent: memoryId },
    );
  },

  proposeCanon: (text: string, memoryId?: string) => {
    if (!text.trim()) throw new Error("Proposal refused: empty text");
    return append("canon.proposed", { text, memoryId }, { repo: requireRepo() });
  },

  hardenCanon: (
    text: string,
    opts: { memoryId?: string; proposalId?: string; scope?: string } = {},
  ) => {
    if (!text.trim()) throw new Error("Canon refused: empty text");
    return append(
      "canon.hardened",
      { text, ...opts },
      { repo: requireRepo(), parent: opts.proposalId ?? opts.memoryId },
    );
  },

  frameMission: (text: string) => {
    if (!text.trim()) throw new Error("Mission refused: empty text");
    return append(
      "canon.hardened",
      { text, scope: "mission" },
      { repo: requireRepo() },
    );
  },

  revokeCanon: (canonId: string, reason: string) => {
    if (!reason.trim())
      throw new Error("Revocation refused: reason required");
    return append(
      "canon.revoked",
      { canonId, reason },
      { repo: requireRepo(), parent: canonId },
    );
  },

  startExecution: (label: string, directiveId: string, threadId: string) => {
    const t = requireThread(threadId);
    return append(
      "execution.started",
      { label, directiveId },
      { thread: t.id, repo: t.repo, parent: directiveId },
    );
  },

  succeedExecution: (executionId: string) =>
    append("execution.succeeded", { executionId }, { parent: executionId }),

  failExecution: (executionId: string, reason: string) =>
    append("execution.failed", { executionId, reason }, { parent: executionId }),

  retryExecution: (failedExecutionId: string) => {
    const p = cached ?? project(all());
    const failed = p.executions.find((x) => x.id === failedExecutionId);
    if (!failed) throw new Error("Execution not found");
    if (failed.status !== "failed") throw new Error("Only failed executions can be retried");
    if (!failed.thread) throw new Error("No thread on execution");
    const t = requireThread(failed.thread);
    const ev = all().find((e) => e.id === failedExecutionId);
    const directiveId = ev?.payload.directiveId as string | undefined;
    return append(
      "execution.started",
      { label: failed.label, directiveId, retryOf: failedExecutionId },
      { thread: t.id, repo: t.repo, parent: failedExecutionId },
    );
  },

  generateArtifact: (
    title: string,
    executionId: string,
    threadId: string,
    directiveId?: string,
    consequence?: { files?: string[]; diff?: string; commitRef?: string },
  ) => {
    const t = requireThread(threadId);
    return append(
      "artifact.generated",
      { title, executionId, directiveId, ...consequence },
      { thread: t.id, repo: t.repo, parent: executionId },
    );
  },

  reviewArtifact: async (
    artifactId: string,
    outcome: "accepted" | "rejected",
    reason: string,
  ) => {
    const p = cached ?? project(all());
    const a = p.artifacts.find((x) => x.id === artifactId);
    if (!a) throw new Error("Review refused: artifact not found");
    if (a.review !== "pending")
      throw new Error("Review refused: artifact already reviewed");
    if (!reason.trim())
      throw new Error("Review refused: reason required");
    const type = outcome === "accepted" ? "artifact.reviewed" : "artifact.rejected";
    const ev = await append(
      type,
      { artifactId, outcome, reason },
      { thread: a.thread, repo: requireRepo(), parent: artifactId },
    );
    await append(
      "memory.captured",
      {
        text: `artifact ${outcome}: ${a.title} — ${reason}`,
        artifactId,
      },
      { thread: a.thread, repo: requireRepo(), parent: artifactId },
    );
    return ev;
  },

  commitArtifact: (artifactId: string) => {
    const p = cached ?? project(all());
    const a = p.artifacts.find((x) => x.id === artifactId);
    if (!a) throw new Error("Commit refused: artifact not found");
    if (a.review !== "accepted")
      throw new Error("Commit refused: artifact not reviewed/accepted");
    return append("artifact.committed", { artifactId }, { parent: artifactId });
  },

  detectContradiction: (text: string) =>
    append("contradiction.detected", { text }, { repo: requireRepo() }),

  resolveContradiction: (contradictionId: string) =>
    append(
      "contradiction.resolved",
      { contradictionId },
      { parent: contradictionId, repo: requireRepo() },
    ),

  synthesizeKnowledge: (
    sourceId: string,
    sourceType: "canon" | "memory",
    targetThreadId: string,
    note: string,
  ) => {
    const repo = requireRepo();
    const p = cached ?? project(all());
    const t = p.threads.find((x) => x.id === targetThreadId);
    if (!t) throw new Error("Synthesis refused: target thread not found");
    if (sourceType === "canon") {
      const c = p.canon.find((x) => x.id === sourceId);
      if (!c) throw new Error("Synthesis refused: canon entry not found");
    } else {
      const m = p.memory.find((x) => x.id === sourceId);
      if (!m) throw new Error("Synthesis refused: memory entry not found");
    }
    if (!note.trim()) throw new Error("Synthesis refused: note required");
    return append(
      "knowledge.synthesized",
      { sourceId, sourceType, targetThread: targetThreadId, note },
      { thread: targetThreadId, repo, parent: sourceId },
    );
  },

  // ── W10: Autonomous Directive Proposal ─────────────────────────────────
  proposeDirective: (
    threadId: string,
    compose: {
      text: string;
      scope: string;
      risk: "reversible" | "consequential" | "destructive";
      rationale: string;
      proposedBy: string;
      sourceExecutionId?: string;
    },
  ) => {
    const repo = requireRepo();
    const t = (cached ?? project(all())).threads.find((x) => x.id === threadId);
    if (!t) throw new Error("Proposal refused: thread not found");
    const { text, scope, risk, rationale, proposedBy, sourceExecutionId } = compose;
    if (!text.trim() || !scope.trim())
      throw new Error("Proposal refused: text and scope are required");
    if (!rationale.trim())
      throw new Error("Proposal refused: rationale required");
    return append(
      "directive.proposed",
      { text, scope, risk, rationale, proposedBy, sourceExecutionId },
      { thread: t.id, repo },
    );
  },

  acceptProposal: async (proposalId: string) => {
    const repo = requireRepo();
    const p = cached ?? project(all());
    const prop = p.proposals.find((x) => x.id === proposalId);
    if (!prop) throw new Error("Acceptance refused: proposal not found");
    if (prop.status !== "pending")
      throw new Error("Acceptance refused: proposal already resolved");
    const t = p.threads.find((x) => x.id === prop.thread);
    if (!t || t.status !== "open")
      throw new Error("Acceptance refused: thread not open");
    // Mark proposal as accepted
    await append(
      "proposal.accepted",
      { proposalId },
      { thread: t.id, repo, parent: proposalId },
    );
    // Promote to a real directive
    return append(
      "directive.accepted",
      { text: prop.text, scope: prop.scope, risk: prop.risk, acceptance: `auto-promoted from proposal: ${prop.rationale}` },
      { thread: t.id, repo, parent: proposalId },
    );
  },

  dismissProposal: (proposalId: string, reason: string) => {
    const repo = requireRepo();
    const p = cached ?? project(all());
    const prop = p.proposals.find((x) => x.id === proposalId);
    if (!prop) throw new Error("Dismissal refused: proposal not found");
    if (prop.status !== "pending")
      throw new Error("Dismissal refused: proposal already resolved");
    if (!reason.trim())
      throw new Error("Dismissal refused: reason required");
    return append(
      "proposal.dismissed",
      { proposalId, reason },
      { thread: prop.thread, repo, parent: proposalId },
    );
  },

  // ── W10: Flow Engine ──────────────────────────────────────────────────
  defineFlow: (
    threadId: string,
    name: string,
    steps: Array<{ directiveText: string; scope: string; risk: "reversible" | "consequential" | "destructive" }>,
  ) => {
    const repo = requireRepo();
    const t = requireThread(threadId);
    if (!name.trim())
      throw new Error("Flow refused: name required");
    if (steps.length === 0)
      throw new Error("Flow refused: at least one step required");
    return append(
      "flow.defined",
      { name, steps },
      { thread: t.id, repo },
    );
  },

  completeFlowStep: (
    flowId: string,
    outcome: "succeeded" | "failed",
    directiveId?: string,
  ) => {
    const repo = requireRepo();
    const p = cached ?? project(all());
    const flow = p.flows.find((f) => f.id === flowId);
    if (!flow) throw new Error("Flow step refused: flow not found");
    if (flow.status !== "active")
      throw new Error("Flow step refused: flow not active");
    const step = flow.steps[flow.currentStep];
    if (!step) throw new Error("Flow step refused: no pending step");
    return append(
      "flow.step.completed",
      { flowId, stepIndex: flow.currentStep, outcome, directiveId },
      { thread: flow.thread, repo, parent: flowId },
    );
  },

  completeFlow: (flowId: string, outcome: "completed" | "aborted") => {
    const repo = requireRepo();
    const p = cached ?? project(all());
    const flow = p.flows.find((f) => f.id === flowId);
    if (!flow) throw new Error("Flow completion refused: flow not found");
    if (flow.status !== "active")
      throw new Error("Flow completion refused: flow not active");
    return append(
      "flow.completed",
      { flowId, outcome },
      { thread: flow.thread, repo, parent: flowId },
    );
  },

  // ── W10: Agent Registry ───────────────────────────────────────────────
  registerAgent: (
    name: string,
    capabilities: Array<"execute" | "review" | "propose" | "canon" | "observe">,
  ) => {
    const repo = requireRepo();
    if (!name.trim())
      throw new Error("Agent registration refused: name required");
    if (capabilities.length === 0)
      throw new Error("Agent registration refused: at least one capability required");
    return append(
      "agent.registered",
      { name, capabilities },
      { repo },
    );
  },

  assignDirective: (directiveId: string, agentId: string) => {
    const repo = requireRepo();
    const p = cached ?? project(all());
    const d = p.directives.find((x) => x.id === directiveId);
    if (!d) throw new Error("Assignment refused: directive not found");
    const agent = p.agents.find((x) => x.id === agentId);
    if (!agent) throw new Error("Assignment refused: agent not found");
    if (!agent.capabilities.includes("execute"))
      throw new Error("Assignment refused: agent lacks 'execute' capability");
    return append(
      "agent.assigned",
      { directiveId, agentId },
      { thread: d.thread, repo, parent: directiveId },
    );
  },

  progressExecution: (executionId: string, message: string, progress?: number) => {
    const p = cached ?? project(all());
    const x = p.executions.find((e) => e.id === executionId);
    if (!x) throw new Error("Progress refused: execution not found");
    if (x.status !== "running")
      throw new Error("Progress refused: execution not running");
    return append(
      "execution.progressed",
      { executionId, message, progress },
      { thread: x.thread, parent: executionId },
    );
  },

  nullConsequence: (action: string, reason: string) =>
    append("null.consequence", { action, reason }),

  // ── W10: Autonomous Flow ──────────────────────────────────────────────

  draftDirective: (
    conceptId: string,
    compose: {
      text: string;
      scope: string;
      risk: "reversible" | "consequential" | "destructive";
      acceptance: string;
      canonSources?: string[];
    },
  ) => {
    const p = cached ?? project(all());
    const concept = p.concepts.find((c) => c.id === conceptId);
    if (!concept) throw new Error("Draft refused: concept not found");
    if (concept.promoted) throw new Error("Draft refused: concept already promoted");
    const { text, scope, risk, acceptance, canonSources } = compose;
    if (!text.trim() || !scope.trim() || !acceptance.trim()) {
      throw new Error("Draft refused: text, scope, and acceptance are required");
    }
    return append(
      "directive.drafted",
      { conceptId, text, scope, risk, acceptance, canonSources: canonSources ?? [] },
      { thread: concept.thread, repo: concept.repo },
    );
  },

  assignPioneer: (
    pioneer: "claude" | "cursor" | "codex" | "grok" | "framer" | "architect",
    threadId: string,
    directiveId?: string,
  ) => {
    const repo = requireRepo();
    const p = cached ?? project(all());
    const t = p.threads.find((x) => x.id === threadId);
    if (!t) throw new Error("Assignment refused: thread not found");
    if (t.status !== "open") throw new Error("Assignment refused: thread not open");
    // Prevent duplicate active assignment of same pioneer to same thread.
    const existing = p.pioneers.find(
      (a) => a.active && a.pioneer === pioneer && a.thread === threadId,
    );
    if (existing) throw new Error("Assignment refused: pioneer already assigned to this thread");
    return append(
      "pioneer.assigned",
      { pioneer, ...(directiveId ? { directiveId } : {}) },
      { thread: threadId, repo },
    );
  },

  releasePioneer: (assignmentId: string) => {
    const p = cached ?? project(all());
    const a = p.pioneers.find((x) => x.id === assignmentId);
    if (!a) throw new Error("Release refused: assignment not found");
    if (!a.active) throw new Error("Release refused: assignment already released");
    return append(
      "pioneer.released",
      { assignmentId },
      { repo: requireRepo() },
    );
  },

  // ── W11: Multi-Agent Execution ──────────────────────────────────────────

  handoffExecution: (
    executionId: string,
    fromPioneer: string,
    toPioneer: string,
    note: string,
  ) => {
    const p = cached ?? project(all());
    const exec = p.executions.find((x) => x.id === executionId);
    if (!exec) throw new Error("Handoff refused: execution not found");
    if (exec.status !== "running") throw new Error("Handoff refused: execution not running");
    if (!note.trim()) throw new Error("Handoff refused: note required");
    if (fromPioneer === toPioneer) throw new Error("Handoff refused: cannot hand off to the same pioneer");
    return append(
      "execution.handoff",
      { executionId, fromPioneer, toPioneer, note: note.trim() },
      { thread: exec.thread, repo: requireRepo() },
    );
  },

  endorseCanon: (canonId: string, pioneer: string) => {
    const repo = requireRepo();
    const p = cached ?? project(all());
    const canon = p.canon.find((c) => c.id === canonId);
    if (!canon) throw new Error("Endorsement refused: canon entry not found");
    if (canon.state !== "hardened") throw new Error("Endorsement refused: canon must be hardened");
    // Prevent duplicate endorsements from the same pioneer.
    const existing = p.endorsements.find(
      (e) => e.canonId === canonId && e.pioneer === pioneer,
    );
    if (existing) throw new Error("Endorsement refused: already endorsed by this pioneer");
    return append(
      "canon.endorsed",
      { canonId, pioneer },
      { repo },
    );
  },

  raw: (type: EventType, payload: Record<string, unknown> = {}) =>
    append(type, payload),

  seedCanon: async () => {
    const p = cached ?? project(all());
    if (p.missionFramed || p.canon.length > 0) return;

    await append("canon.hardened", {
      text: "Ruberra initialization complete. Sovereignty active.",
      scope: "mission",
    });

    for (const seed of ALL_SEEDS) {
      await append("canon.hardened", {
        text: seed.text,
        scope: seed.scope,
      });
    }
  },
};
