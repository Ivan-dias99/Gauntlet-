// Ruberra — Event-log continuity proof
//
// Proves the full cycle:
//   1. Events appended → written to IndexedDB
//   2. In-memory state reset (simulates JS module re-init on browser reload)
//   3. hydrate() reads from IndexedDB → memory rebuilt from real IDB data
//   4. project(all()) produces identical projection
//   5. Truth-state is preserved: retained memory, hardened canon, causal parents
//   6. No silent loss: every appended event id is present after hydration
//
// Uses fake-indexeddb: each test gets a fresh IDBFactory instance (fresh
// in-memory store) so tests are fully isolated with no blocking delete ops.
// _resetForTest() resets the module's in-memory state to simulate reload.

import { describe, it, expect, beforeEach } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { append, hydrate, all, isHydrated, _resetForTest } from "../eventLog";
import { project } from "../projections";

beforeEach(() => {
  // Fresh IDB factory = isolated in-memory store per test, no blocking.
  (globalThis as any).indexedDB = new IDBFactory();
  // Reset module in-memory state so hydrate() runs fresh against new factory.
  _resetForTest();
});

describe("event-log continuity: append → IndexedDB → reset → hydrate → project", () => {
  it("appended events survive a simulated reload and reconstruct projection correctly", async () => {
    // ── Phase A: append ───────────────────────────────────────────────────
    await hydrate();
    const e1 = await append("repo.bound", { name: "cont-repo", id: "cont-repo" }, { repo: "cont-repo" });
    const e2 = await append("thread.opened", { intent: "continuity check" }, { repo: "cont-repo" });
    await append(
      "directive.accepted",
      { text: "ship it", scope: "src/**", risk: "reversible", acceptance: "build green" },
      { thread: e2.id, repo: "cont-repo" },
    );

    const pBefore = project(all());
    expect(pBefore.activeRepo).toBe("cont-repo");
    expect(pBefore.threads).toHaveLength(1);
    // Snapshot state before reload to compare post-hydration
    const stateBefore = pBefore.threads[0].state;

    // ── Phase B: reset (simulate reload), keep same IDBFactory ────────────
    // We do NOT replace globalThis.indexedDB — same factory, same data.
    _resetForTest();
    expect(isHydrated()).toBe(false);
    expect(all()).toHaveLength(0);

    await hydrate(); // re-read from the same IDB store

    const events = all();
    expect(events.length).toBeGreaterThanOrEqual(3);
    expect(events.map((e) => e.id)).toContain(e1.id);
    expect(events.map((e) => e.id)).toContain(e2.id);

    const pAfter = project(events);
    expect(pAfter.activeRepo).toBe("cont-repo");
    expect(pAfter.threads).toHaveLength(1);
    // Thread state must match what was observed before reload
    expect(pAfter.threads[0].state).toBe(stateBefore);
    expect(pAfter.threads[0].intent).toBe("continuity check");
  });

  it("null.consequence events persist and do not corrupt projection", async () => {
    await hydrate();
    await append("repo.bound", { name: "r2", id: "r2" }, { repo: "r2" });
    const nc = await append("null.consequence", { action: "test", reason: "continuity null" });

    _resetForTest();
    await hydrate();

    const events = all();
    expect(events.map((e) => e.id)).toContain(nc.id);

    const p = project(events);
    expect(p.threads).toHaveLength(0);
    expect(p.canon).toHaveLength(0);
    expect(p.activeRepo).toBe("r2");
  });

  it("causal parent chain is preserved across hydration", async () => {
    await hydrate();
    await append("repo.bound", { name: "r3", id: "r3" }, { repo: "r3" });
    const t = await append("thread.opened", { intent: "chain" }, { repo: "r3" });
    const d = await append(
      "directive.accepted",
      { text: "do", scope: "src", risk: "reversible", acceptance: "pass" },
      { thread: t.id, repo: "r3" },
    );
    const x = await append(
      "execution.started",
      { label: "run", directiveId: d.id },
      { thread: t.id, repo: "r3", parent: d.id },
    );

    _resetForTest();
    await hydrate();

    const events = all();
    const exec = events.find((e) => e.id === x.id);
    expect(exec).toBeDefined();
    expect(exec!.parent).toBe(d.id); // causal chain survives IDB round-trip

    const p = project(events);
    expect(p.threads[0].state).toBe("executing");
  });

  it("truth-state survives reload: retained memory, hardened canon, mission framed", async () => {
    await hydrate();
    await append("repo.bound", { name: "r4", id: "r4" }, { repo: "r4" });
    await append("memory.captured", { text: "observed fact" }, { repo: "r4" });
    await append("canon.hardened", { text: "the law", scope: "mission" }, { repo: "r4" });

    _resetForTest();
    await hydrate();

    const p = project(all());
    expect(p.memory[0].state).toBe("retained");
    expect(p.memory[0].text).toBe("observed fact");
    expect(p.canon[0].state).toBe("hardened");
    expect(p.canon[0].text).toBe("the law");
    expect(p.missionFramed).toBe(true);
  });

  it("no silent loss: every appended event id is present after hydration", async () => {
    await hydrate();
    await append("repo.bound", { name: "r5", id: "r5" }, { repo: "r5" });
    const t = await append("thread.opened", { intent: "loss check" }, { repo: "r5" });
    const m = await append("memory.captured", { text: "truth" }, { repo: "r5" });
    const nc = await append("null.consequence", { action: "x", reason: "y" });

    const idsBefore = all().map((e) => e.id);

    _resetForTest();
    await hydrate();

    const idsAfter = all().map((e) => e.id);
    for (const id of idsBefore) {
      expect(idsAfter).toContain(id);
    }
    expect(idsAfter).toContain(t.id);
    expect(idsAfter).toContain(m.id);
    expect(idsAfter).toContain(nc.id);
  });
});
