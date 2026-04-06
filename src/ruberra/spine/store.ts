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

  closeThread: (threadId: string) => {
    const t = requireThread(threadId);
    return append("thread.closed", {}, { thread: t.id, repo: t.repo });
  },

  stateIntent: (threadId: string, text: string) => {
    const t = requireThread(threadId);
    return append("intent.stated", { text }, { thread: t.id, repo: t.repo });
  },

  // DIRECTIVE HINGE — the single crossing from desire to consequence.
  // Accepting a directive authorizes exactly one execution and nothing else.
  acceptDirective: async (threadId: string, text: string) => {
    const t = requireThread(threadId);
    const directive = await append(
      "directive.accepted",
      { text },
      { thread: t.id, repo: t.repo },
    );
    return directive;
  },

  rejectDirective: (threadId: string, text: string, reason: string) => {
    const t = requireThread(threadId);
    return append(
      "directive.rejected",
      { text, reason },
      { thread: t.id, repo: t.repo },
    );
  },

  captureMemory: (text: string, threadId?: string) => {
    const repo = requireRepo();
    return append("memory.captured", { text }, { thread: threadId, repo });
  },

  promoteMemory: (memoryId: string) =>
    append("memory.promoted", { memoryId }, { repo: requireRepo() }),

  proposeCanon: (text: string, memoryId?: string) =>
    append("canon.proposed", { text, memoryId }, { repo: requireRepo() }),

  hardenCanon: (text: string, memoryId?: string) =>
    append("canon.hardened", { text, memoryId }, { repo: requireRepo() }),

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

  generateArtifact: (title: string, executionId: string, threadId: string) => {
    const t = requireThread(threadId);
    return append(
      "artifact.generated",
      { title, executionId },
      { thread: t.id, repo: t.repo, parent: executionId },
    );
  },

  commitArtifact: (artifactId: string) =>
    append("artifact.committed", { artifactId }, { parent: artifactId }),

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
