// Ruberra — Projection reducer unit tests
// Pure function: no mocks, no React, no IndexedDB.
// Each test builds a minimal event log and asserts projection shape.

import { describe, it, expect } from "vitest";
import { project } from "../projections";
import { RuberraEvent } from "../events";

// ── helpers ────────────────────────────────────────────────────────────────

let seq = 0;
function ev(
  type: RuberraEvent["type"],
  payload: Record<string, unknown> = {},
  opts: Partial<RuberraEvent> = {},
): RuberraEvent {
  const id = `test-${++seq}`;
  return {
    id,
    ts: Date.now() + seq,
    type,
    actor: "test",
    payload,
    ...opts,
  };
}

// ── baseline ───────────────────────────────────────────────────────────────

describe("project([])", () => {
  it("returns empty projection with defaults", () => {
    const p = project([]);
    expect(p.repos).toHaveLength(0);
    expect(p.threads).toHaveLength(0);
    expect(p.directives).toHaveLength(0);
    expect(p.memory).toHaveLength(0);
    expect(p.executions).toHaveLength(0);
    expect(p.artifacts).toHaveLength(0);
    expect(p.canon).toHaveLength(0);
    expect(p.canonProposals).toHaveLength(0);
    expect(p.contradictions).toHaveLength(0);
    expect(p.chamber).toBe("creation");
    expect(p.missionFramed).toBe(false);
    expect(p.activeRepo).toBeUndefined();
  });
});

// ── repo ───────────────────────────────────────────────────────────────────

describe("repo.bound", () => {
  it("sets activeRepo and adds repo entry", () => {
    const p = project([ev("repo.bound", { name: "my-repo", id: "my-repo" }, { repo: "my-repo" })]);
    expect(p.activeRepo).toBe("my-repo");
    expect(p.repos).toHaveLength(1);
    expect(p.repos[0].name).toBe("my-repo");
  });

  it("does not duplicate on repeated bind of same id", () => {
    const e = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const p = project([e, e]);
    expect(p.repos).toHaveLength(1);
  });
});

describe("repo.verified", () => {
  it("marks repo as verified", () => {
    const bind = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const verify = ev("repo.verified", { ok: true, message: "verified", repoId: "r" }, { repo: "r" });
    const p = project([bind, verify]);
    expect(p.repos[0].verified).toBe(true);
  });
});

// ── thread lifecycle ───────────────────────────────────────────────────────

describe("thread lifecycle", () => {
  function baseEvents() {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    return [repo];
  }

  it("thread.opened → state=open, status=open", () => {
    const events = [...baseEvents()];
    const t = ev("thread.opened", { intent: "add login" }, { repo: "r" });
    events.push(t);
    const p = project(events);
    expect(p.threads).toHaveLength(1);
    expect(p.threads[0].state).toBe("open");
    expect(p.threads[0].status).toBe("open");
    expect(p.activeThread).toBe(t.id);
  });

  it("directive.accepted → state=executing", () => {
    const events = [...baseEvents()];
    const t = ev("thread.opened", { intent: "task" }, { repo: "r" });
    events.push(t);
    const d = ev(
      "directive.accepted",
      { text: "do it", scope: "src/**", risk: "reversible", acceptance: "tests pass" },
      { thread: t.id, repo: "r" },
    );
    events.push(d);
    const p = project(events);
    expect(p.threads[0].state).toBe("executing");
    expect(p.directives).toHaveLength(1);
    expect(p.directives[0].status).toBe("accepted");
  });

  it("artifact.generated → state=awaiting-review", () => {
    const events = [...baseEvents()];
    const t = ev("thread.opened", { intent: "task" }, { repo: "r" });
    events.push(t);
    const d = ev("directive.accepted", { text: "x", scope: "src", risk: "reversible", acceptance: "ok" }, { thread: t.id, repo: "r" });
    events.push(d);
    const x = ev("execution.started", { label: "run", directiveId: d.id }, { thread: t.id, repo: "r", parent: d.id });
    events.push(x);
    const a = ev("artifact.generated", { title: "file.ts", executionId: x.id }, { thread: t.id, repo: "r", parent: x.id });
    events.push(a);
    const p = project(events);
    expect(p.threads[0].state).toBe("awaiting-review");
    expect(p.artifacts[0].review).toBe("pending");
  });

  it("artifact.reviewed(accepted) → state=open, review=accepted", () => {
    const events = [...baseEvents()];
    const t = ev("thread.opened", { intent: "task" }, { repo: "r" });
    events.push(t);
    const d = ev("directive.accepted", { text: "x", scope: "src", risk: "reversible", acceptance: "ok" }, { thread: t.id, repo: "r" });
    events.push(d);
    const x = ev("execution.started", { label: "run", directiveId: d.id }, { thread: t.id, repo: "r", parent: d.id });
    events.push(x);
    const a = ev("artifact.generated", { title: "file.ts", executionId: x.id }, { thread: t.id, repo: "r", parent: x.id });
    events.push(a);
    const r = ev("artifact.reviewed", { artifactId: a.id, outcome: "accepted", reason: "looks good" }, { thread: t.id, repo: "r", parent: a.id });
    events.push(r);
    const p = project(events);
    expect(p.threads[0].state).toBe("open");
    expect(p.artifacts[0].review).toBe("accepted");
    expect(p.artifacts[0].reviewReason).toBe("looks good");
  });

  it("thread.closed → state=closed, status=closed", () => {
    const events = [...baseEvents()];
    const t = ev("thread.opened", { intent: "done" }, { repo: "r" });
    events.push(t);
    const c = ev("thread.closed", { reason: "finished" }, { thread: t.id, repo: "r" });
    events.push(c);
    const p = project(events);
    expect(p.threads[0].state).toBe("closed");
    expect(p.threads[0].status).toBe("closed");
    expect(p.threads[0].closeReason).toBe("finished");
    expect(p.activeThread).toBeUndefined();
  });
});

// ── canon lifecycle ────────────────────────────────────────────────────────

describe("canon lifecycle", () => {
  it("canon.proposed → canonProposals entry", () => {
    const bind = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const prop = ev("canon.proposed", { text: "we ship fast" }, { repo: "r" });
    const p = project([bind, prop]);
    expect(p.canonProposals).toHaveLength(1);
    expect(p.canonProposals[0].text).toBe("we ship fast");
    expect(p.canonProposals[0].hardened).toBe(false);
  });

  it("canon.hardened → canon entry, state=hardened", () => {
    const bind = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const hard = ev("canon.hardened", { text: "law one" }, { repo: "r" });
    const p = project([bind, hard]);
    expect(p.canon).toHaveLength(1);
    expect(p.canon[0].state).toBe("hardened");
    expect(p.missionFramed).toBe(false);
  });

  it("canon.hardened with scope=mission → missionFramed=true", () => {
    const bind = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const hard = ev("canon.hardened", { text: "mission", scope: "mission" }, { repo: "r" });
    const p = project([bind, hard]);
    expect(p.missionFramed).toBe(true);
  });

  it("canon.revoked → state=revoked", () => {
    const bind = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const hard = ev("canon.hardened", { text: "law one" }, { repo: "r" });
    const rev = ev("canon.revoked", { canonId: hard.id, reason: "outdated" }, { repo: "r", parent: hard.id });
    const p = project([bind, hard, rev]);
    expect(p.canon[0].state).toBe("revoked");
    expect(p.canon[0].revokeReason).toBe("outdated");
  });
});

// ── contradiction lifecycle ────────────────────────────────────────────────

describe("contradiction lifecycle", () => {
  it("contradiction.detected → unresolved entry", () => {
    const bind = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const c = ev("contradiction.detected", { text: "conflict found" }, { repo: "r" });
    const p = project([bind, c]);
    expect(p.contradictions).toHaveLength(1);
    expect(p.contradictions[0].resolved).toBe(false);
  });

  it("contradiction.resolved → resolved=true", () => {
    const bind = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const c = ev("contradiction.detected", { text: "conflict found" }, { repo: "r" });
    const r = ev("contradiction.resolved", { contradictionId: c.id }, { repo: "r", parent: c.id });
    const p = project([bind, c, r]);
    expect(p.contradictions[0].resolved).toBe(true);
  });
});

// ── artifact consequence payload ───────────────────────────────────────────

describe("artifact consequence payload", () => {
  function baseWithArtifact(extraPayload: Record<string, unknown> = {}) {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t = ev("thread.opened", { intent: "task" }, { repo: "r" });
    const d = ev(
      "directive.accepted",
      { text: "do it", scope: "src/**", risk: "reversible", acceptance: "tests pass" },
      { thread: t.id, repo: "r" },
    );
    const x = ev(
      "execution.started",
      { label: "run", directiveId: d.id },
      { thread: t.id, repo: "r", parent: d.id },
    );
    const a = ev(
      "artifact.generated",
      { title: "result.ts", executionId: x.id, ...extraPayload },
      { thread: t.id, repo: "r", parent: x.id },
    );
    return { events: [repo, t, d, x, a], artifactId: a.id };
  }

  it("old artifact event (no consequence fields) replays safely — fields undefined", () => {
    const { events } = baseWithArtifact();
    const p = project(events);
    const a = p.artifacts[0];
    expect(a).toBeDefined();
    expect(a.review).toBe("pending");
    expect(a.files).toBeUndefined();
    expect(a.diff).toBeUndefined();
    expect(a.commitRef).toBeUndefined();
  });

  it("artifact with files preserved through replay", () => {
    const { events } = baseWithArtifact({ files: ["src/foo.ts", "src/bar.ts"] });
    const p = project(events);
    expect(p.artifacts[0].files).toEqual(["src/foo.ts", "src/bar.ts"]);
  });

  it("artifact with diff preserved through replay", () => {
    const { events } = baseWithArtifact({ diff: "@@ -1,3 +1,4 @@\n+line added" });
    const p = project(events);
    expect(p.artifacts[0].diff).toBe("@@ -1,3 +1,4 @@\n+line added");
  });

  it("artifact with commitRef preserved through replay", () => {
    const { events } = baseWithArtifact({ commitRef: "abc1234" });
    const p = project(events);
    expect(p.artifacts[0].commitRef).toBe("abc1234");
  });

  it("artifact with all consequence fields preserved through replay", () => {
    const { events } = baseWithArtifact({
      files: ["src/index.ts"],
      diff: "--- a\n+++ b\n+new line",
      commitRef: "deadbeef",
    });
    const p = project(events);
    const a = p.artifacts[0];
    expect(a.files).toEqual(["src/index.ts"]);
    expect(a.diff).toBe("--- a\n+++ b\n+new line");
    expect(a.commitRef).toBe("deadbeef");
  });

  it("consequence fields do not affect review lifecycle", () => {
    const { events, artifactId } = baseWithArtifact({
      files: ["src/main.ts"],
      commitRef: "cafebabe",
    });
    const repo = events[0];
    const t = events[1];
    const reviewEv = ev(
      "artifact.reviewed",
      { artifactId, outcome: "accepted", reason: "clean" },
      { thread: t.id, repo: "r", parent: artifactId },
    );
    const p = project([...events, reviewEv]);
    const a = p.artifacts[0];
    expect(a.review).toBe("accepted");
    expect(a.reviewReason).toBe("clean");
    // Consequence payload survives review event unchanged
    expect(a.files).toEqual(["src/main.ts"]);
    expect(a.commitRef).toBe("cafebabe");
    // repo used above to suppress unused warning
    void repo;
  });
});

// ── null consequence ───────────────────────────────────────────────────────

describe("null.consequence", () => {
  it("does not crash and does not add to any collection", () => {
    const nc = ev("null.consequence", { action: "test", reason: "just testing" });
    const p = project([nc]);
    expect(p.threads).toHaveLength(0);
    expect(p.memory).toHaveLength(0);
    expect(p.canon).toHaveLength(0);
  });
});

// ── chamber ────────────────────────────────────────────────────────────────

describe("chamber.entered", () => {
  it("sets active chamber", () => {
    const bind = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const c = ev("chamber.entered", { chamber: "lab" }, { repo: "r" });
    const p = project([bind, c]);
    expect(p.chamber).toBe("lab");
  });

  it("ignores unknown chamber names", () => {
    const c = ev("chamber.entered", { chamber: "invalid" });
    const p = project([c]);
    expect(p.chamber).toBe("creation"); // default unchanged
  });
});

// ── memory ────────────────────────────────────────────────────────────────

describe("memory", () => {
  it("memory.captured → retained state", () => {
    const bind = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const m = ev("memory.captured", { text: "observation" }, { repo: "r" });
    const p = project([bind, m]);
    expect(p.memory[0].state).toBe("retained");
    expect(p.memory[0].promoted).toBe(false);
  });

  it("memory.promoted → promoted=true, state=hardened", () => {
    const bind = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const m = ev("memory.captured", { text: "observation" }, { repo: "r" });
    const prom = ev("memory.promoted", { memoryId: m.id }, { repo: "r" });
    const p = project([bind, m, prom]);
    expect(p.memory[0].promoted).toBe(true);
    expect(p.memory[0].state).toBe("hardened");
  });
});
