import { describe, it, expect } from "vitest";
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

function makeTempWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "ruberra-restart-"));
  mkdirSync(path.join(root, "ops"), { recursive: true });
  return root;
}

const REPORT_HEADER = "# AGENT REPORT\n\nAdd the newest block at the top.\n\n";

describe("restart_codex_lane.mjs", () => {
  it("returns blocked when dependency is not done", () => {
    const root = makeTempWorkspace();
    writeFileSync(
      path.join(root, "ops", "BRIDGE_QUEUE.json"),
      JSON.stringify(
        {
          tasks: [
            { id: "W02-B04", owner: "antigravity", depends_on: [] },
            { id: "W02-B05", owner: "codex", depends_on: ["W02-B04"] },
          ],
        },
        null,
        2,
      ),
    );
    writeFileSync(
      path.join(root, "ops", "AGENT_REPORT.md"),
      REPORT_HEADER +
        [
          "BRIDGE_HANDOFF",
          "  TASK_ID: W02-B04",
          "  PIONEER: antigravity",
          "  STATUS: partial",
          "  SUMMARY: blocked",
          "  FILES: ops/AGENT_REPORT.md",
          "  NEXT_MOVE: continue",
          "  ACCEPTANCE: unmet",
          "",
        ].join("\n"),
    );

    const script = path.resolve("ops/restart_codex_lane.mjs");
    const run = spawnSync("node", [script], { cwd: root, encoding: "utf8" });
    expect(run.status).toBe(2);
    const parsed = JSON.parse(run.stdout);
    expect(parsed.state).toBe("blocked");
    expect(parsed.task_id).toBe("W02-B05");
    expect(parsed.blocked_by).toEqual(["W02-B04"]);
  });

  it("treats 'met' dependency status as completed", () => {
    const root = makeTempWorkspace();
    writeFileSync(
      path.join(root, "ops", "BRIDGE_QUEUE.json"),
      JSON.stringify(
        {
          tasks: [
            { id: "W02-B04", owner: "antigravity", depends_on: [] },
            { id: "W02-B05", owner: "codex", depends_on: ["W02-B04"] },
          ],
        },
        null,
        2,
      ),
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
          "  FILES: ops/AGENT_REPORT.md",
          "  NEXT_MOVE: continue",
          "  ACCEPTANCE: met",
          "",
        ].join("\n"),
    );

    const script = path.resolve("ops/restart_codex_lane.mjs");
    const run = spawnSync("node", [script], { cwd: root, encoding: "utf8" });
    expect(run.status).toBe(0);
    const parsed = JSON.parse(run.stdout);
    expect(parsed.state).toBe("eligible");
    expect(parsed.task_id).toBe("W02-B05");
    expect(parsed.restart).toBe(true);
  });

  it("writes output file when --output is set", () => {
    const root = makeTempWorkspace();
    writeFileSync(
      path.join(root, "ops", "BRIDGE_QUEUE.json"),
      JSON.stringify(
        { tasks: [{ id: "W02-B05", owner: "codex", depends_on: [] }] },
        null,
        2,
      ),
    );
    writeFileSync(path.join(root, "ops", "AGENT_REPORT.md"), REPORT_HEADER);

    const script = path.resolve("ops/restart_codex_lane.mjs");
    const outPath = path.join("ops", "CODEX_LOOP_STATE.json");
    const run = spawnSync("node", [script, `--output=${outPath}`], {
      cwd: root,
      encoding: "utf8",
    });
    expect(run.status).toBe(0);
    const payload = JSON.parse(
      run.stdout,
    ) as { state: string; task_id: string; restart: boolean };
    expect(payload.state).toBe("eligible");
    expect(payload.task_id).toBe("W02-B05");
    expect(payload.restart).toBe(true);
  });

  it("creates nested output directories when --output path does not exist", () => {
    const root = makeTempWorkspace();
    writeFileSync(
      path.join(root, "ops", "BRIDGE_QUEUE.json"),
      JSON.stringify(
        { tasks: [{ id: "W02-B05", owner: "codex", depends_on: [] }] },
        null,
        2,
      ),
    );
    writeFileSync(path.join(root, "ops", "AGENT_REPORT.md"), REPORT_HEADER);

    const script = path.resolve("ops/restart_codex_lane.mjs");
    const outPath = path.join("tmp", "states", "codex_state.json");
    const run = spawnSync("node", [script, `--output=${outPath}`], {
      cwd: root,
      encoding: "utf8",
    });
    expect(run.status).toBe(0);
    const fileContent = JSON.parse(readFileSync(path.join(root, outPath), "utf8")) as {
      state: string;
    };
    expect(fileContent.state).toBe("eligible");
  });

  it("watch mode exits blocked when max cycle is reached", () => {
    const root = makeTempWorkspace();
    writeFileSync(
      path.join(root, "ops", "BRIDGE_QUEUE.json"),
      JSON.stringify(
        {
          tasks: [
            { id: "W02-B04", owner: "antigravity", depends_on: [] },
            { id: "W02-B05", owner: "codex", depends_on: ["W02-B04"] },
          ],
        },
        null,
        2,
      ),
    );
    writeFileSync(
      path.join(root, "ops", "AGENT_REPORT.md"),
      REPORT_HEADER +
        [
          "BRIDGE_HANDOFF",
          "  TASK_ID: W02-B04",
          "  PIONEER: antigravity",
          "  STATUS: partial",
          "  SUMMARY: blocked",
          "  FILES: ops/AGENT_REPORT.md",
          "  NEXT_MOVE: continue",
          "  ACCEPTANCE: unmet",
          "",
        ].join("\n"),
    );

    const script = path.resolve("ops/restart_codex_lane.mjs");
    const run = spawnSync("node", [script, "--watch", "--interval=1", "--max-cycles=1"], {
      cwd: root,
      encoding: "utf8",
    });

    expect(run.status).toBe(2);
    const parsed = JSON.parse(run.stdout);
    expect(parsed.state).toBe("blocked");
  });
});
