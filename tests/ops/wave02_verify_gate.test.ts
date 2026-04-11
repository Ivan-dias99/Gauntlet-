import { describe, it, expect } from "vitest";
import {
  mkdtempSync,
  writeFileSync,
  mkdirSync,
  chmodSync,
  readFileSync,
  existsSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

function makeTempWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "ruberra-wave02-"));
  mkdirSync(path.join(root, "ops"), { recursive: true });
  return root;
}

const REPORT_HEADER = "# AGENT REPORT\n\nAdd the newest block at the top.\n\n";
const DEFAULT_QUEUE = {
  tasks: [
    { id: "W02-B01", owner: "claude", depends_on: [] },
    { id: "W02-B02", owner: "claude", depends_on: ["W02-B01"] },
    { id: "W02-B03", owner: "claude", depends_on: ["W02-B02"] },
    { id: "W02-B04", owner: "antigravity", depends_on: ["W02-B03"] },
    { id: "W02-B05", owner: "codex", depends_on: ["W02-B01", "W02-B02", "W02-B03", "W02-B04"] },
  ],
};

describe("wave02_verify_gate.mjs", () => {
  it("returns blocked when required upstream tasks are not done", () => {
    const root = makeTempWorkspace();
    writeFileSync(
      path.join(root, "ops", "BRIDGE_QUEUE.json"),
      JSON.stringify(DEFAULT_QUEUE, null, 2),
    );
    writeFileSync(
      path.join(root, "ops", "AGENT_REPORT.md"),
      REPORT_HEADER +
        [
          "BRIDGE_HANDOFF",
          "  TASK_ID: W02-B01",
          "  PIONEER: claude",
          "  STATUS: done",
          "  SUMMARY: complete",
          "  FILES: src/ruberra/",
          "  NEXT_MOVE: continue",
          "  ACCEPTANCE: met",
          "",
        ].join("\n"),
    );

    const script = path.resolve("ops/wave02_verify_gate.mjs");
    const run = spawnSync("node", [script], { cwd: root, encoding: "utf8" });
    expect(run.status).toBe(2);
    const parsed = JSON.parse(run.stdout) as {
      task_id: string;
      state: string;
      blocked_by: string[];
    };
    expect(parsed.task_id).toBe("W02-B05");
    expect(parsed.state).toBe("blocked");
    expect(parsed.blocked_by).toEqual(["W02-B02", "W02-B03", "W02-B04"]);
  });

  it("emits gate and prepends handoff when prerequisites are done", () => {
    const root = makeTempWorkspace();
    writeFileSync(
      path.join(root, "ops", "BRIDGE_QUEUE.json"),
      JSON.stringify(DEFAULT_QUEUE, null, 2),
    );
    writeFileSync(
      path.join(root, "ops", "AGENT_REPORT.md"),
      REPORT_HEADER +
        [
          "BRIDGE_HANDOFF",
          "  TASK_ID: W02-B04",
          "  PIONEER: antigravity",
          "  STATUS: done",
          "  SUMMARY: complete",
          "  FILES: src/ruberra/",
          "  NEXT_MOVE: continue",
          "  ACCEPTANCE: met",
          "",
          "BRIDGE_HANDOFF",
          "  TASK_ID: W02-B03",
          "  PIONEER: claude",
          "  STATUS: done",
          "  SUMMARY: complete",
          "  FILES: src/ruberra/",
          "  NEXT_MOVE: continue",
          "  ACCEPTANCE: met",
          "",
          "BRIDGE_HANDOFF",
          "  TASK_ID: W02-B02",
          "  PIONEER: claude",
          "  STATUS: done",
          "  SUMMARY: complete",
          "  FILES: src/ruberra/",
          "  NEXT_MOVE: continue",
          "  ACCEPTANCE: met",
          "",
          "BRIDGE_HANDOFF",
          "  TASK_ID: W02-B01",
          "  PIONEER: claude",
          "  STATUS: done",
          "  SUMMARY: complete",
          "  FILES: src/ruberra/",
          "  NEXT_MOVE: continue",
          "  ACCEPTANCE: met",
          "",
        ].join("\n"),
    );

    const binDir = path.join(root, "bin");
    mkdirSync(binDir, { recursive: true });
    const npmStub = path.join(binDir, "npm");
    writeFileSync(
      npmStub,
      [
        "#!/usr/bin/env bash",
        "echo \"$@\" >> \"$PWD/ops/npm_calls.log\"",
        "exit 0",
        "",
      ].join("\n"),
      "utf8",
    );
    chmodSync(npmStub, 0o755);

    const script = path.resolve("ops/wave02_verify_gate.mjs");
    const run = spawnSync("node", [script], {
      cwd: root,
      encoding: "utf8",
      env: { ...process.env, PATH: `${binDir}:${process.env.PATH ?? ""}` },
    });

    expect(run.status).toBe(0);
    const parsed = JSON.parse(run.stdout) as { state: string; gate: string };
    expect(parsed.state).toBe("done");
    expect(parsed.gate).toBe("GATE_W03_OPEN");

    const gateFile = path.join(root, "ops", "GATE_W03_OPEN.md");
    expect(existsSync(gateFile)).toBe(true);

    const calls = readFileSync(path.join(root, "ops", "npm_calls.log"), "utf8");
    expect(calls).toContain("test");
    expect(calls).toContain("run build");

    const report = readFileSync(path.join(root, "ops", "AGENT_REPORT.md"), "utf8");
    expect(report).toContain("TASK_ID: W02-B05");
    expect(report).toContain("STATUS: done");
  });

  it("accepts 'met' statuses as satisfied prerequisites", () => {
    const root = makeTempWorkspace();
    writeFileSync(
      path.join(root, "ops", "BRIDGE_QUEUE.json"),
      JSON.stringify(DEFAULT_QUEUE, null, 2),
    );
    writeFileSync(
      path.join(root, "ops", "AGENT_REPORT.md"),
      REPORT_HEADER +
        [
          "BRIDGE_HANDOFF",
          "  TASK_ID: W02-B04",
          "  PIONEER: antigravity",
          "  STATUS: met",
          "  SUMMARY: complete",
          "  FILES: src/ruberra/",
          "  NEXT_MOVE: continue",
          "  ACCEPTANCE: met",
          "",
          "BRIDGE_HANDOFF",
          "  TASK_ID: W02-B03",
          "  PIONEER: claude",
          "  STATUS: met",
          "  SUMMARY: complete",
          "  FILES: src/ruberra/",
          "  NEXT_MOVE: continue",
          "  ACCEPTANCE: met",
          "",
          "BRIDGE_HANDOFF",
          "  TASK_ID: W02-B02",
          "  PIONEER: claude",
          "  STATUS: met",
          "  SUMMARY: complete",
          "  FILES: src/ruberra/",
          "  NEXT_MOVE: continue",
          "  ACCEPTANCE: met",
          "",
          "BRIDGE_HANDOFF",
          "  TASK_ID: W02-B01",
          "  PIONEER: claude",
          "  STATUS: met",
          "  SUMMARY: complete",
          "  FILES: src/ruberra/",
          "  NEXT_MOVE: continue",
          "  ACCEPTANCE: met",
          "",
        ].join("\n"),
    );

    const binDir = path.join(root, "bin");
    mkdirSync(binDir, { recursive: true });
    const npmStub = path.join(binDir, "npm");
    writeFileSync(
      npmStub,
      "#!/usr/bin/env bash\nexit 0\n",
      "utf8",
    );
    chmodSync(npmStub, 0o755);

    const script = path.resolve("ops/wave02_verify_gate.mjs");
    const run = spawnSync("node", [script], {
      cwd: root,
      encoding: "utf8",
      env: { ...process.env, PATH: `${binDir}:${process.env.PATH ?? ""}` },
    });

    expect(run.status).toBe(0);
    const parsed = JSON.parse(run.stdout) as { state: string; gate: string };
    expect(parsed.state).toBe("done");
    expect(parsed.gate).toBe("GATE_W03_OPEN");
  });

  it("fails with clear error when target task is missing in BRIDGE_QUEUE", () => {
    const root = makeTempWorkspace();
    writeFileSync(
      path.join(root, "ops", "BRIDGE_QUEUE.json"),
      JSON.stringify({ tasks: [{ id: "W02-B01", owner: "claude", depends_on: [] }] }, null, 2),
    );
    writeFileSync(path.join(root, "ops", "AGENT_REPORT.md"), REPORT_HEADER);

    const script = path.resolve("ops/wave02_verify_gate.mjs");
    const run = spawnSync("node", [script], { cwd: root, encoding: "utf8" });
    expect(run.status).toBe(1);
    expect(run.stderr).toContain("Target task W02-B05 not found in BRIDGE_QUEUE.");
  });
});
