// Ruberra — Store
// Backend-authoritative in spirit; the event log is the source of truth.
// This store is a React binding that recomputes a projection on every event.
// No domain state lives in React state or localStorage.

import { useSyncExternalStore } from "react";
import { all, subscribe, hydrate, append } from "./eventLog";
import { project, Projection } from "./projections";
import { EventType } from "./events";

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

// Typed emitters — the only sanctioned way to mutate the organism.
//
// Structural laws enforced here:
//   - Repo Centrality: no spine mutation without a bound repo (except repo.bound itself).
//   - Directive Hinge: no execution without an accepted directive; directives
//     exist only inside threads; threads exist only inside repos.
//   - Law of Consequence: every meaningful action yields one of {artifact,
//     memory mutation, contradiction, canon proposal, null.consequence}.
//     Silent no-ops are forbidden — violations emit null.consequence with reason.

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
  bindRepo: (name: string) =>
    append("repo.bound", { name, id: name }, { repo: name }),

  enterChamber: (chamber: "lab" | "school" | "creation") =>
    append("chamber.entered", { chamber }, { repo: requireRepo() }),

  openThread: (intent: string) => {
    const repo = requireRepo();
    if (!intent.trim())
      return append("null.consequence", {
        action: "thread.open",
        reason: "empty intent",
      });
    return append("thread.opened", { intent }, { repo });
  },

  closeThread: (threadId: string, reason: string) => {
    const t = requireThread(threadId);
    if (!reason.trim())
      throw new Error("Thread close refused: reason required");
    return append("thread.closed", { reason }, { thread: t.id, repo: t.repo });
  },

  stateIntent: (threadId: string, text: string) => {
    const t = requireThread(threadId);
    return append("intent.stated", { text }, { thread: t.id, repo: t.repo });
  },

  // DIRECTIVE HINGE — the single crossing from desire to consequence.
  // Composition: text + scope + risk + acceptance. All required.
  // Ambiguity check: any unresolved {{placeholder}} blocks acceptance.
  acceptDirective: async (
    threadId: string,
    compose: {
      text: string;
      scope: string;
      risk: "reversible" | "consequential" | "destructive";
      acceptance: string;
    },
  ) => {
    const t = requireThread(threadId);
    const { text, scope, risk, acceptance } = compose;
    if (!text.trim() || !scope.trim() || !acceptance.trim()) {
      throw new Error(
        "Directive refused: text, scope, and acceptance are required",
      );
    }
    if (/\{\{[^}]+\}\}/.test(text)) {
      throw new Error("Directive refused: unresolved ambiguity in text");
    }
    return append(
      "directive.accepted",
      { text, scope, risk, acceptance },
      { thread: t.id, repo: t.repo },
    );
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
    // Automatic contradiction detection: any hardened canon whose text
    // contains a negating token against this memory emits a contradiction.
    // Minimal heuristic: substring overlap + negation keyword.
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

  proposeCanon: (text: string, memoryId?: string) => {
    if (!text.trim()) throw new Error("Proposal refused: empty text");
    return append("canon.proposed", { text, memoryId }, { repo: requireRepo() });
  },

  // Two-step promotion: propose then harden. Direct hardening is permitted
  // only for the mission canon (first-run) and explicit School overrides.
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

  // Mission canon — the first-run framing. Idempotent at the organism level:
  // the projection's missionFramed flag gates the UI from asking again.
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

  // Execution requires a parent directive id — enforcing the hinge.
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

  generateArtifact: (
    title: string,
    executionId: string,
    threadId: string,
    directiveId?: string,
  ) => {
    const t = requireThread(threadId);
    return append(
      "artifact.generated",
      { title, executionId, directiveId },
      { thread: t.id, repo: t.repo, parent: executionId },
    );
  },

  // Review layer: accept or reject an artifact against its directive.
  // On accept, auto-capture memory linking artifact → retained truth.
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
    if (outcome === "accepted") {
      // Artifact → memory bridge: retained truth produced by consequence.
      await append(
        "memory.captured",
        { text: `artifact accepted: ${a.title} — ${reason}`, artifactId },
        { thread: a.thread, repo: requireRepo(), parent: artifactId },
      );
    }
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

  // Law of Consequence — explicit null outcome, never silent.
  nullConsequence: (action: string, reason: string) =>
    append("null.consequence", { action, reason }),

  raw: (type: EventType, payload: Record<string, unknown> = {}) =>
    append(type, payload),
};
