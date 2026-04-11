// Ruberra — Projection reducer unit tests
// Pure function: no mocks, no React, no IndexedDB.
// Each test builds a minimal event log and asserts projection shape.

import { describe, it, expect } from "vitest";
import { project, threadResonance, conceptAncestry, threadSyntheses } from "../projections";
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
    expect(p.concepts).toHaveLength(0);
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

  it("sets memory chamber", () => {
    const bind = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const c = ev("chamber.entered", { chamber: "memory" }, { repo: "r" });
    const p = project([bind, c]);
    expect(p.chamber).toBe("memory");
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

// ── concept relay (W03-B02) ───────────────────────────────────────────────

describe("concept.stated", () => {
  function baseWithThread() {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t = ev("thread.opened", { intent: "build auth" }, { repo: "r" });
    return { repo, t };
  }

  it("creates concept entry with title, hypothesis, promoted=false", () => {
    const { repo, t } = baseWithThread();
    const c = ev(
      "concept.stated",
      { title: "Auth system", hypothesis: "Replace session with JWT" },
      { thread: t.id, repo: "r" },
    );
    const p = project([repo, t, c]);
    expect(p.concepts).toHaveLength(1);
    expect(p.concepts[0].title).toBe("Auth system");
    expect(p.concepts[0].hypothesis).toBe("Replace session with JWT");
    expect(p.concepts[0].thread).toBe(t.id);
    expect(p.concepts[0].promoted).toBe(false);
  });

  it("directive.accepted with matching conceptId marks concept as promoted", () => {
    const { repo, t } = baseWithThread();
    const c = ev(
      "concept.stated",
      { title: "Auth system", hypothesis: "Replace session with JWT" },
      { thread: t.id, repo: "r" },
    );
    const d = ev(
      "directive.accepted",
      { text: "Replace session with JWT", scope: "src/auth", risk: "consequential", acceptance: "tests pass", conceptId: c.id },
      { thread: t.id, repo: "r" },
    );
    const p = project([repo, t, c, d]);
    expect(p.concepts[0].promoted).toBe(true);
    expect(p.directives[0].status).toBe("accepted");
  });

  it("directive.accepted with mismatched conceptId leaves concept unpromoted", () => {
    const { repo, t } = baseWithThread();
    const t2 = ev("thread.opened", { intent: "other" }, { repo: "r" });
    const c = ev(
      "concept.stated",
      { title: "Concept A", hypothesis: "hypothesis A" },
      { thread: t.id, repo: "r" },
    );
    // directive is on t2, concept is on t — conceptId refers to concept on t
    const d = ev(
      "directive.accepted",
      { text: "do something", scope: "src", risk: "reversible", acceptance: "ok", conceptId: c.id },
      { thread: t2.id, repo: "r" },
    );
    const p = project([repo, t, t2, c, d]);
    // concept should remain unpromoted because thread mismatch
    expect(p.concepts[0].promoted).toBe(false);
  });

  it("multiple concepts in the same thread are all tracked", () => {
    const { repo, t } = baseWithThread();
    const c1 = ev("concept.stated", { title: "A", hypothesis: "hyp A" }, { thread: t.id, repo: "r" });
    const c2 = ev("concept.stated", { title: "B", hypothesis: "hyp B" }, { thread: t.id, repo: "r" });
    const p = project([repo, t, c1, c2]);
    expect(p.concepts).toHaveLength(2);
    expect(p.concepts[0].promoted).toBe(false);
    expect(p.concepts[1].promoted).toBe(false);
  });
});

// ── knowledge.synthesized (W09) ──────────────────────────────────────────

describe("knowledge.synthesized", () => {
  it("creates synthesis entry in projection", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t = ev("thread.opened", { intent: "build auth" }, { repo: "r" });
    const canon = ev("canon.hardened", { text: "security first always" }, { repo: "r" });
    const synth = ev(
      "knowledge.synthesized",
      { sourceId: canon.id, sourceType: "canon", targetThread: t.id, note: "applies to auth" },
      { thread: t.id, repo: "r", parent: canon.id },
    );
    const p = project([repo, t, canon, synth]);
    expect(p.syntheses).toHaveLength(1);
    expect(p.syntheses[0].sourceId).toBe(canon.id);
    expect(p.syntheses[0].sourceType).toBe("canon");
    expect(p.syntheses[0].targetThread).toBe(t.id);
    expect(p.syntheses[0].note).toBe("applies to auth");
  });

  it("empty event log has empty syntheses array", () => {
    const p = project([]);
    expect(p.syntheses).toHaveLength(0);
  });
});

// ── threadResonance (W09) ────────────────────────────────────────────────

describe("threadResonance", () => {
  function multiThreadSetup() {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t1 = ev("thread.opened", { intent: "implement authentication system" }, { repo: "r" });
    const t2 = ev("thread.opened", { intent: "build payment gateway" }, { repo: "r" });
    // Memory on t1 — this gives the canon a traceable thread origin.
    const m1 = ev("memory.captured", { text: "authentication requires token validation" }, { thread: t1.id, repo: "r" });
    // Canon from t1's memory — hardened as law.
    const c1 = ev("canon.hardened", { text: "authentication system must validate tokens before access", memoryId: m1.id }, { repo: "r" });
    // Canon without thread origin (repo-wide law).
    const c2 = ev("canon.hardened", { text: "every payment gateway requires authentication integration" }, { repo: "r" });
    return { repo, t1, t2, m1, c1, c2 };
  }

  it("detects canon resonance via thread intent", () => {
    const { repo, t1, t2, m1, c1, c2 } = multiThreadSetup();
    const p = project([repo, t1, t2, m1, c1, c2]);
    // t2's intent is "build payment gateway" — c2 mentions "payment gateway" + "authentication"
    const matches = threadResonance(p, t2.id);
    expect(matches.length).toBeGreaterThanOrEqual(1);
    const paymentMatch = matches.find((m) => m.canonId === c2.id);
    expect(paymentMatch).toBeDefined();
    expect(paymentMatch!.via).toBe("intent");
  });

  it("excludes canon originating from the same thread", () => {
    const { repo, t1, t2, m1, c1, c2 } = multiThreadSetup();
    // Add a directive on t1 that overlaps with c1 (which originated from t1's memory).
    const d = ev(
      "directive.accepted",
      { text: "validate tokens in authentication", scope: "src/auth", risk: "reversible", acceptance: "ok" },
      { thread: t1.id, repo: "r" },
    );
    const p = project([repo, t1, t2, m1, c1, c2, d]);
    const matches = threadResonance(p, t1.id);
    // c1 originated from t1's memory, so it should NOT appear as resonance for t1.
    const self = matches.find((m) => m.canonId === c1.id);
    expect(self).toBeUndefined();
  });

  it("detects resonance via concepts", () => {
    const { repo, t1, t2, m1, c1, c2 } = multiThreadSetup();
    // Add concept on t2 that shares exact tokens with c1.
    // c1: "authentication system must validate tokens before access"
    const concept = ev(
      "concept.stated",
      { title: "authentication module", hypothesis: "must validate tokens on every request" },
      { thread: t2.id, repo: "r" },
    );
    const p = project([repo, t1, t2, m1, c1, c2, concept]);
    const matches = threadResonance(p, t2.id);
    // c1 shares "authentication", "must", "validate", "tokens" with the concept.
    expect(matches.length).toBeGreaterThanOrEqual(1);
    const tokenMatch = matches.find((m) => m.canonId === c1.id);
    expect(tokenMatch).toBeDefined();
  });

  it("returns empty for unknown thread", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const p = project([repo]);
    expect(threadResonance(p, "nonexistent")).toHaveLength(0);
  });

  it("returns empty when no other-thread canon exists", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t = ev("thread.opened", { intent: "just a thread" }, { repo: "r" });
    const p = project([repo, t]);
    expect(threadResonance(p, t.id)).toHaveLength(0);
  });
});

// ── conceptAncestry (W09) ────────────────────────────────────────────────

describe("conceptAncestry", () => {
  it("finds canon entries related to a concept via token overlap", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t = ev("thread.opened", { intent: "build auth" }, { repo: "r" });
    const c1 = ev("canon.hardened", { text: "authentication requires secure token validation" }, { repo: "r" });
    const c2 = ev("canon.hardened", { text: "payments need secure processing" }, { repo: "r" });
    const concept = ev(
      "concept.stated",
      { title: "Token validation module", hypothesis: "authentication tokens should expire after validation" },
      { thread: t.id, repo: "r" },
    );
    const p = project([repo, t, c1, c2, concept]);
    const ancestors = conceptAncestry(p, concept.id);
    // c1 shares "authentication", "token", "validation" — should match.
    expect(ancestors.some((a) => a.id === c1.id)).toBe(true);
  });

  it("includes explicitly synthesized canon as ancestor", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t = ev("thread.opened", { intent: "optimize cache" }, { repo: "r" });
    const canon = ev("canon.hardened", { text: "database queries must be idempotent" }, { repo: "r" });
    const concept = ev(
      "concept.stated",
      { title: "Cache layer", hypothesis: "add redis for hot paths" },
      { thread: t.id, repo: "r" },
    );
    // Explicit synthesis link — architect manually linked this canon.
    const synth = ev(
      "knowledge.synthesized",
      { sourceId: canon.id, sourceType: "canon", targetThread: t.id, note: "idempotency applies to cache" },
      { thread: t.id, repo: "r", parent: canon.id },
    );
    const p = project([repo, t, canon, concept, synth]);
    const ancestors = conceptAncestry(p, concept.id);
    expect(ancestors.some((a) => a.id === canon.id)).toBe(true);
  });

  it("returns empty for unknown concept", () => {
    const p = project([]);
    expect(conceptAncestry(p, "nope")).toHaveLength(0);
  });
});

// ── threadSyntheses (W09) ────────────────────────────────────────────────

describe("threadSyntheses", () => {
  it("resolves synthesis links to source text", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t = ev("thread.opened", { intent: "work" }, { repo: "r" });
    const canon = ev("canon.hardened", { text: "the law of consequence" }, { repo: "r" });
    const synth = ev(
      "knowledge.synthesized",
      { sourceId: canon.id, sourceType: "canon", targetThread: t.id, note: "relevant" },
      { thread: t.id, repo: "r" },
    );
    const p = project([repo, t, canon, synth]);
    const resolved = threadSyntheses(p, t.id);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].sourceText).toBe("the law of consequence");
    expect(resolved[0].note).toBe("relevant");
  });

  it("resolves memory-type synthesis links", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t = ev("thread.opened", { intent: "work" }, { repo: "r" });
    const mem = ev("memory.captured", { text: "observed: latency spikes at 3am" }, { thread: t.id, repo: "r" });
    const t2 = ev("thread.opened", { intent: "fix latency" }, { repo: "r" });
    const synth = ev(
      "knowledge.synthesized",
      { sourceId: mem.id, sourceType: "memory", targetThread: t2.id, note: "relates to latency fix" },
      { thread: t2.id, repo: "r" },
    );
    const p = project([repo, t, mem, t2, synth]);
    const resolved = threadSyntheses(p, t2.id);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].sourceText).toBe("observed: latency spikes at 3am");
    expect(resolved[0].sourceType).toBe("memory");
  });

  it("filters out syntheses with missing source", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t = ev("thread.opened", { intent: "work" }, { repo: "r" });
    const synth = ev(
      "knowledge.synthesized",
      { sourceId: "deleted-canon", sourceType: "canon", targetThread: t.id, note: "orphan" },
      { thread: t.id, repo: "r" },
    );
    const p = project([repo, t, synth]);
    const resolved = threadSyntheses(p, t.id);
    expect(resolved).toHaveLength(0);
  });

  it("returns empty for thread with no syntheses", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t = ev("thread.opened", { intent: "work" }, { repo: "r" });
    const p = project([repo, t]);
    expect(threadSyntheses(p, t.id)).toHaveLength(0);
  });
});

// ── W10: Autonomous Flow ──────────────────────────────────────────────────

import {
  directiveDrafts,
  suggestSyntheses,
  activePioneers,
  pioneerLoad,
} from "../projections";

describe("directive.drafted event", () => {
  it("projects a draft directive from concept", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t = ev("thread.opened", { intent: "build sovereign shell" }, { repo: "r" });
    const concept = ev(
      "concept.stated",
      { title: "Sovereign Surface", hypothesis: "the shell carries command gravity" },
      { thread: t.id, repo: "r" },
    );
    const draft = ev(
      "directive.drafted",
      {
        conceptId: concept.id,
        text: "implement sovereign surface",
        scope: "shell",
        risk: "reversible",
        acceptance: "surface renders in shell",
        canonSources: ["c1"],
      },
      { thread: t.id, repo: "r" },
    );
    const p = project([repo, t, concept, draft]);
    expect(p.drafts).toHaveLength(1);
    expect(p.drafts[0].conceptId).toBe(concept.id);
    expect(p.drafts[0].text).toBe("implement sovereign surface");
    expect(p.drafts[0].status).toBe("pending");
    expect(p.drafts[0].canonSources).toEqual(["c1"]);
  });
});

describe("pioneer.assigned / pioneer.released events", () => {
  it("projects a pioneer assignment and release", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t = ev("thread.opened", { intent: "work" }, { repo: "r" });
    const assign = ev(
      "pioneer.assigned",
      { pioneer: "claude", directiveId: "d1" },
      { thread: t.id, repo: "r" },
    );
    const p1 = project([repo, t, assign]);
    expect(p1.pioneers).toHaveLength(1);
    expect(p1.pioneers[0].pioneer).toBe("claude");
    expect(p1.pioneers[0].active).toBe(true);
    expect(p1.pioneers[0].thread).toBe(t.id);

    const release = ev("pioneer.released", { assignmentId: assign.id });
    const p2 = project([repo, t, assign, release]);
    expect(p2.pioneers[0].active).toBe(false);
    expect(p2.pioneers[0].releasedAt).toBeDefined();
  });

  it("release of non-existent assignment is a no-op", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const release = ev("pioneer.released", { assignmentId: "bogus" });
    const p = project([repo, release]);
    expect(p.pioneers).toHaveLength(0);
  });
});

describe("directiveDrafts()", () => {
  it("suggests drafts for concepts with canon resonance", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t = ev("thread.opened", { intent: "build shell" }, { repo: "r" });
    const concept = ev(
      "concept.stated",
      { title: "Sovereign Architecture", hypothesis: "the sovereign shell system should carry authority and command" },
      { thread: t.id, repo: "r" },
    );
    const canon = ev(
      "canon.hardened",
      { text: "the sovereign shell carries structural authority and command gravity", scope: "architecture" },
      { repo: "r" },
    );
    const p = project([repo, t, concept, canon]);
    const drafts = directiveDrafts(p, t.id);
    expect(drafts.length).toBeGreaterThanOrEqual(1);
    expect(drafts[0].conceptId).toBe(concept.id);
    expect(drafts[0].canonSources.length).toBeGreaterThanOrEqual(1);
    expect(drafts[0].suggestedText).toContain("sovereign architecture");
  });

  it("does not suggest drafts for promoted concepts", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t = ev("thread.opened", { intent: "work" }, { repo: "r" });
    const concept = ev(
      "concept.stated",
      { title: "Authority Surface", hypothesis: "surface carries structural authority" },
      { thread: t.id, repo: "r" },
    );
    const directive = ev(
      "directive.accepted",
      { text: "build surface", scope: "shell", risk: "reversible", acceptance: "done", conceptId: concept.id },
      { thread: t.id, repo: "r" },
    );
    const canon = ev(
      "canon.hardened",
      { text: "surface carries structural authority in the system" },
      { repo: "r" },
    );
    const p = project([repo, t, concept, directive, canon]);
    const drafts = directiveDrafts(p, t.id);
    expect(drafts).toHaveLength(0);
  });

  it("returns empty for closed thread", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t = ev("thread.opened", { intent: "work" }, { repo: "r" });
    const close = ev("thread.closed", { reason: "done" }, { thread: t.id });
    const p = project([repo, t, close]);
    expect(directiveDrafts(p, t.id)).toHaveLength(0);
  });

  it("excludes concepts that already have pending drafts", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t = ev("thread.opened", { intent: "build system" }, { repo: "r" });
    const concept = ev(
      "concept.stated",
      { title: "Command System", hypothesis: "system provides sovereign command authority" },
      { thread: t.id, repo: "r" },
    );
    const canon = ev(
      "canon.hardened",
      { text: "sovereign command authority governs the system" },
      { repo: "r" },
    );
    const draft = ev(
      "directive.drafted",
      { conceptId: concept.id, text: "draft", scope: "s", risk: "reversible", acceptance: "a", canonSources: [] },
      { thread: t.id, repo: "r" },
    );
    const p = project([repo, t, concept, canon, draft]);
    const suggestions = directiveDrafts(p, t.id);
    expect(suggestions).toHaveLength(0);
  });
});

describe("suggestSyntheses()", () => {
  it("suggests unlinked resonance matches", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t1 = ev("thread.opened", { intent: "sovereign architecture system" }, { repo: "r" });
    const mem1 = ev("memory.captured", { text: "sovereign system architecture" }, { thread: t1.id, repo: "r" });
    const hardenedWithMem = ev(
      "canon.hardened",
      { text: "sovereign system architecture requires structural authority", memoryId: mem1.id },
      { repo: "r" },
    );

    const t2 = ev("thread.opened", { intent: "build sovereign authority architecture system" }, { repo: "r" });
    const p = project([repo, t1, mem1, hardenedWithMem, t2]);
    const suggestions = suggestSyntheses(p, t2.id);
    // Should find the canon from t1 as a suggestion for t2.
    expect(suggestions.length).toBeGreaterThanOrEqual(1);
  });

  it("excludes already-linked canon", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t1 = ev("thread.opened", { intent: "sovereign architecture system" }, { repo: "r" });
    const mem1 = ev("memory.captured", { text: "sovereign system architecture" }, { thread: t1.id, repo: "r" });
    const canon = ev(
      "canon.hardened",
      { text: "sovereign system architecture requires structural authority", memoryId: mem1.id },
      { repo: "r" },
    );
    const t2 = ev("thread.opened", { intent: "build sovereign authority architecture system" }, { repo: "r" });
    // Explicit synthesis link already created.
    const synth = ev(
      "knowledge.synthesized",
      { sourceId: canon.id, sourceType: "canon", targetThread: t2.id, note: "linked" },
      { thread: t2.id, repo: "r" },
    );
    const p = project([repo, t1, mem1, canon, t2, synth]);
    const suggestions = suggestSyntheses(p, t2.id);
    const hasLinked = suggestions.some((s) => s.canonId === canon.id);
    expect(hasLinked).toBe(false);
  });
});

describe("activePioneers()", () => {
  it("returns only active assignments", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t = ev("thread.opened", { intent: "work" }, { repo: "r" });
    const a1 = ev("pioneer.assigned", { pioneer: "claude" }, { thread: t.id, repo: "r" });
    const a2 = ev("pioneer.assigned", { pioneer: "codex" }, { thread: t.id, repo: "r" });
    const release = ev("pioneer.released", { assignmentId: a1.id });
    const p = project([repo, t, a1, a2, release]);
    const active = activePioneers(p);
    expect(active).toHaveLength(1);
    expect(active[0].pioneer).toBe("codex");
  });

  it("filters by threadId", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t1 = ev("thread.opened", { intent: "work1" }, { repo: "r" });
    const t2 = ev("thread.opened", { intent: "work2" }, { repo: "r" });
    const a1 = ev("pioneer.assigned", { pioneer: "claude" }, { thread: t1.id, repo: "r" });
    const a2 = ev("pioneer.assigned", { pioneer: "codex" }, { thread: t2.id, repo: "r" });
    const p = project([repo, t1, t2, a1, a2]);
    expect(activePioneers(p, { threadId: t1.id })).toHaveLength(1);
    expect(activePioneers(p, { threadId: t2.id })).toHaveLength(1);
  });
});

describe("pioneerLoad()", () => {
  it("counts active assignments per pioneer", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t1 = ev("thread.opened", { intent: "work1" }, { repo: "r" });
    const t2 = ev("thread.opened", { intent: "work2" }, { repo: "r" });
    const a1 = ev("pioneer.assigned", { pioneer: "claude" }, { thread: t1.id, repo: "r" });
    const a2 = ev("pioneer.assigned", { pioneer: "claude" }, { thread: t2.id, repo: "r" });
    const a3 = ev("pioneer.assigned", { pioneer: "codex" }, { thread: t1.id, repo: "r" });
    const p = project([repo, t1, t2, a1, a2, a3]);
    const load = pioneerLoad(p);
    expect(load.get("claude")).toBe(2);
    expect(load.get("codex")).toBe(1);
  });

  it("excludes released assignments", () => {
    const repo = ev("repo.bound", { name: "r", id: "r" }, { repo: "r" });
    const t = ev("thread.opened", { intent: "work" }, { repo: "r" });
    const a1 = ev("pioneer.assigned", { pioneer: "claude" }, { thread: t.id, repo: "r" });
    const release = ev("pioneer.released", { assignmentId: a1.id });
    const p = project([repo, t, a1, release]);
    const load = pioneerLoad(p);
    expect(load.get("claude")).toBeUndefined();
  });
});
