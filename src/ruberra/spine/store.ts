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
export const emit = {
  bindRepo: (name: string) =>
    append("repo.bound", { name, id: name }, { repo: name }),
  enterChamber: (chamber: "lab" | "school" | "creation") =>
    append("chamber.entered", { chamber }),
  openThread: (intent: string, repo?: string) =>
    append("thread.opened", { intent }, { repo }),
  closeThread: (threadId: string) =>
    append("thread.closed", {}, { thread: threadId }),
  stateIntent: (threadId: string, text: string) =>
    append("intent.stated", { text }, { thread: threadId }),
  acceptDirective: (threadId: string, text: string) =>
    append("directive.accepted", { text }, { thread: threadId }),
  rejectDirective: (threadId: string, text: string, reason: string) =>
    append("directive.rejected", { text, reason }, { thread: threadId }),
  captureMemory: (text: string, threadId?: string) =>
    append("memory.captured", { text }, { thread: threadId }),
  promoteMemory: (memoryId: string) =>
    append("memory.promoted", { memoryId }),
  hardenCanon: (text: string, memoryId?: string) =>
    append("canon.hardened", { text, memoryId }),
  startExecution: (label: string, threadId?: string) =>
    append("execution.started", { label }, { thread: threadId }),
  succeedExecution: (executionId: string) =>
    append("execution.succeeded", { executionId }),
  failExecution: (executionId: string, reason: string) =>
    append("execution.failed", { executionId, reason }),
  generateArtifact: (title: string, executionId?: string, threadId?: string) =>
    append("artifact.generated", { title, executionId }, { thread: threadId }),
  commitArtifact: (artifactId: string) =>
    append("artifact.committed", { artifactId }),
  detectContradiction: (text: string) =>
    append("contradiction.detected", { text }),
  resolveContradiction: (contradictionId: string) =>
    append("contradiction.resolved", { contradictionId }),
  raw: (type: EventType, payload: Record<string, unknown> = {}) =>
    append(type, payload),
};
