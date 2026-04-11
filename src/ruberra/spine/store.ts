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
