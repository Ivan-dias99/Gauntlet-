// Ruberra — Projections
// Derived, read-only views of the event log. Surfaces read these, never raw state.

import { RuberraEvent } from "./events";

export interface Repo {
  id: string;
  name: string;
  boundAt: number;
}

export interface Thread {
  id: string;
  repo?: string;
  intent: string;
  openedAt: number;
  closedAt?: number;
  status: "open" | "closed";
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

export interface Artifact {
  id: string;
  thread?: string;
  execution?: string;
  title: string;
  committed: boolean;
  ts: number;
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
}

export interface Projection {
  repos: Repo[];
  activeRepo?: string;
  threads: Thread[];
  activeThread?: string;
  memory: MemoryEntry[];
  executions: Execution[];
  artifacts: Artifact[];
  canon: CanonEntry[];
  contradictions: Contradiction[];
  chamber: "lab" | "school" | "creation";
  lastEventId?: string;
}

const empty = (): Projection => ({
  repos: [],
  threads: [],
  memory: [],
  executions: [],
  artifacts: [],
  canon: [],
  contradictions: [],
  chamber: "creation",
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
        });
        p.activeThread = ev.id;
        break;
      }
      case "thread.closed": {
        const t = p.threads.find((t) => t.id === ev.thread);
        if (t) {
          t.status = "closed";
          t.closedAt = ev.ts;
        }
        if (p.activeThread === ev.thread) p.activeThread = undefined;
        break;
      }
      case "chamber.entered": {
        const c = ev.payload.chamber as Projection["chamber"];
        if (c === "lab" || c === "school" || c === "creation") p.chamber = c;
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
          state: "retained", // captured memory is retained by default
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
      case "execution.started": {
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
        break;
      }
      case "artifact.generated": {
        p.artifacts.push({
          id: ev.id,
          thread: ev.thread,
          execution: ev.payload.executionId as string | undefined,
          title: String(ev.payload.title ?? "artifact"),
          committed: false,
          ts: ev.ts,
        });
        break;
      }
      case "artifact.committed": {
        const a = p.artifacts.find((a) => a.id === ev.payload.artifactId);
        if (a) a.committed = true;
        break;
      }
      case "canon.proposed":
        // Proposal is an observed state; it does not yet become law.
        break;
      case "canon.hardened": {
        p.canon.push({
          id: ev.id,
          repo: ev.repo,
          memoryId: ev.payload.memoryId as string | undefined,
          text: String(ev.payload.text ?? ""),
          hardenedAt: ev.ts,
          state: "hardened",
        });
        break;
      }
      case "canon.revoked": {
        // Canon is immutable except for revocation. Marked, never erased.
        const c = p.canon.find((c) => c.id === ev.payload.canonId);
        if (c) {
          c.state = "revoked";
          c.revokedAt = ev.ts;
          c.revokeReason = String(ev.payload.reason ?? "unstated");
        }
        break;
      }
      case "null.consequence":
        // Law of Consequence: explicit null outcome. Logged, displayed, never silent.
        break;
      case "contradiction.detected": {
        p.contradictions.push({
          id: ev.id,
          text: String(ev.payload.text ?? ""),
          ts: ev.ts,
          resolved: false,
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
