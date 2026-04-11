#!/usr/bin/env node
/**
 * W02-B05 Verification Gate Executor.
 *
 * Runs only when Wave 02 upstream tasks are marked done.
 * If checks pass, emits GATE_W03_OPEN and appends a bridge handoff block.
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const reportPath = path.join(root, "ops", "AGENT_REPORT.md");
const gatePath = path.join(root, "ops", "GATE_W03_OPEN.md");
const queuePath = path.join(root, "ops", "BRIDGE_QUEUE.json");

const TARGET_TASK = "W02-B05";

function doneLike(status) {
  return status === "done" || status === "completed" || status === "met";
}

function parseTaskStatuses(reportText) {
  const statuses = new Map();
  const blocks = reportText.split(/\n(?=BRIDGE_HANDOFF)/g);
  for (const block of blocks) {
    if (!block.startsWith("BRIDGE_HANDOFF")) continue;
    const taskId = block.match(/^\s*TASK_ID:\s*(.+)$/m)?.[1]?.trim();
    const status = block.match(/^\s*STATUS:\s*(.+)$/m)?.[1]?.trim().toLowerCase();
    if (!taskId || !status) continue;
    if (!statuses.has(taskId)) statuses.set(taskId, status);
  }
  return statuses;
}

function prependHandoff(block) {
  const head = "# AGENT REPORT\n\nAdd the newest block at the top.\n\n";
  const current = fs.readFileSync(reportPath, "utf8");
  if (!current.startsWith(head)) {
    throw new Error("AGENT_REPORT header mismatch");
  }
  const rest = current.slice(head.length);
  fs.writeFileSync(reportPath, head + block + "\n" + rest, "utf8");
}

function run(cmd) {
  execSync(cmd, { stdio: "inherit", cwd: root });
}

function readRequiredDependencies() {
  const queueRaw = fs.readFileSync(queuePath, "utf8");
  const queue = JSON.parse(queueRaw);
  const tasks = Array.isArray(queue?.tasks) ? queue.tasks : [];
  const target = tasks.find((task) => task?.id === TARGET_TASK);
  if (!target) {
    throw new Error(`Target task ${TARGET_TASK} not found in BRIDGE_QUEUE.`);
  }
  if (!Array.isArray(target.depends_on)) {
    throw new Error(`Task ${TARGET_TASK} has invalid depends_on field.`);
  }
  return target.depends_on;
}

function main() {
  const report = fs.readFileSync(reportPath, "utf8");
  const statuses = parseTaskStatuses(report);
  const required = readRequiredDependencies();
  const unmet = required.filter((id) => !doneLike(statuses.get(id)));

  if (unmet.length > 0) {
    console.log(
      JSON.stringify(
        {
          task_id: TARGET_TASK,
          state: "blocked",
          blocked_by: unmet,
        },
        null,
        2,
      ),
    );
    process.exit(2);
  }

  run("npm test");
  run("npm run build");

  const now = new Date().toISOString();
  fs.writeFileSync(
    gatePath,
    [
      "# GATE_W03_OPEN",
      "",
      `Emitted: ${now}`,
      "",
      "Wave 02 verification gate passed.",
      "",
      "Evidence:",
      "- npm test",
      "- npm run build",
      "",
      "Next wave may open.",
      "",
    ].join("\n"),
    "utf8",
  );

  prependHandoff(
    [
      "BRIDGE_HANDOFF",
      `  TASK_ID: ${TARGET_TASK}`,
      "  PIONEER: codex",
      "  STATUS: done",
      "  SUMMARY: Executed Wave 02 verification gate; tests/build passed and GATE_W03_OPEN was emitted.",
      "  FILES: ops/GATE_W03_OPEN.md, ops/AGENT_REPORT.md",
      "  NEXT_MOVE: Open W03-B01 owner lane.",
      "  ACCEPTANCE: met",
    ].join("\n"),
  );

  console.log(
    JSON.stringify(
      {
        task_id: TARGET_TASK,
        state: "done",
        gate: "GATE_W03_OPEN",
      },
      null,
      2,
    ),
  );
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
