// Ruberra — Event log unit tests
// Tests the in-memory append/subscribe/all functions.
// IndexedDB is absent in node test environment; the log gracefully degrades
// to memory-only (the openDb() call resolves to null when indexedDB is undefined).

import { describe, it, expect, beforeEach } from "vitest";

// We import the module fresh each test by re-importing after resetting state.
// Since vitest isolates module state per file by default, we import once here.
import { append, all, subscribe } from "../eventLog";

describe("eventLog in-memory path", () => {
  it("append → event appears in all()", async () => {
    const before = all().length;
    await append("null.consequence", { action: "test", reason: "unit test" });
    expect(all().length).toBe(before + 1);
    const last = all()[all().length - 1];
    expect(last.type).toBe("null.consequence");
  });

  it("appended event has required fields", async () => {
    const ev = await append("repo.bound", { name: "test-repo", id: "test-repo" }, { repo: "test-repo" });
    expect(ev.id).toBeTruthy();
    expect(ev.ts).toBeGreaterThan(0);
    expect(ev.type).toBe("repo.bound");
    expect(ev.actor).toBe("local");
    expect(ev.repo).toBe("test-repo");
  });

  it("subscribe fires listener on append", async () => {
    const received: string[] = [];
    const unsub = subscribe((ev) => received.push(ev.type));
    await append("null.consequence", { action: "sub-test", reason: "unit test" });
    unsub();
    await append("null.consequence", { action: "after-unsub", reason: "should not appear" });
    expect(received).toContain("null.consequence");
    expect(received).toHaveLength(1);
  });

  it("multiple subscribes all fire", async () => {
    const a: string[] = [];
    const b: string[] = [];
    const u1 = subscribe(() => a.push("x"));
    const u2 = subscribe(() => b.push("y"));
    await append("null.consequence", { action: "multi", reason: "unit test" });
    u1();
    u2();
    expect(a).toHaveLength(1);
    expect(b).toHaveLength(1);
  });

  it("causal parent propagates", async () => {
    const parent = await append("repo.bound", { name: "p", id: "p" }, { repo: "p" });
    const child = await append("thread.opened", { intent: "work" }, { repo: "p", parent: parent.id });
    expect(child.parent).toBe(parent.id);
  });
});
