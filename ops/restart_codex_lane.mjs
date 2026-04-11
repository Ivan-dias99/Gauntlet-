#!/usr/bin/env node
/**
 * Codex lane restart probe.
 *
 * Purpose:
 * - determine whether the first codex-owned task in BRIDGE_QUEUE is unblocked
 * - produce a deterministic machine-readable result for local/manual restart
 *
 * Exit codes:
 * - 0 => restart now (task eligible)
 * - 2 => blocked (task not yet eligible)
 * - 1 => malformed inputs / runtime error
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const queuePath = path.join(root, "ops", "BRIDGE_QUEUE.json");
const reportPath = path.join(root, "ops", "AGENT_REPORT.md");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

/**
 * Parses BRIDGE_HANDOFF blocks and keeps newest status for each TASK_ID.
 * Assumes AGENT_REPORT ordering rule: newest block at top.
 */
function parseTaskStatuses(reportText) {
  const statuses = new Map();
  const blocks = reportText.split(/\n(?=BRIDGE_HANDOFF)/g);
  for (const block of blocks) {
    if (!block.startsWith("BRIDGE_HANDOFF")) continue;
    const taskId = block.match(/^\s*TASK_ID:\s*(.+)$/m)?.[1]?.trim();
    const status = block.match(/^\s*STATUS:\s*(.+)$/m)?.[1]?.trim();
    if (!taskId || !status) continue;
    if (!statuses.has(taskId)) statuses.set(taskId, status.toLowerCase());
  }
  return statuses;
}

function doneLike(status) {
  return status === "done" || status === "completed" || status === "met";
}

function evaluate() {
  const queue = readJson(queuePath);
  const report = readText(reportPath);
  const taskStatuses = parseTaskStatuses(report);

  const codexOwned = queue.tasks.filter((t) => t.owner === "codex");
  if (codexOwned.length === 0) {
    return {
      code: 1,
      body: {
        lane: "codex",
        state: "error",
        message: "No codex-owned task found in BRIDGE_QUEUE.",
      },
    };
  }

  const next = codexOwned.find((t) => !doneLike(taskStatuses.get(t.id)));
  if (!next) {
    return {
      code: 0,
      body: {
        lane: "codex",
        state: "idle",
        reason: "all codex-owned tasks are already done",
      },
    };
  }

  const unmetDeps = (next.depends_on ?? []).filter((depId) => {
    const depStatus = taskStatuses.get(depId);
    return !doneLike(depStatus);
  });

  if (unmetDeps.length > 0) {
    return {
      code: 2,
      body: {
        lane: "codex",
        state: "blocked",
        task_id: next.id,
        blocked_by: unmetDeps,
        restart: false,
      },
    };
  }

  return {
    code: 0,
    body: {
      lane: "codex",
      state: "eligible",
      task_id: next.id,
      restart: true,
    },
  };
}

function parseArgs(argv) {
  const out = {
    watch: false,
    intervalSec: 30,
    onUnblock: "",
    autoExec: false,
    outputFile: "",
    maxCycles: 0,
  };
  const parsePositiveInt = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.max(1, parsed) : fallback;
  };
  const parseNonNegativeInt = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
  };
  for (const raw of argv) {
    if (raw === "--watch") out.watch = true;
    else if (raw === "--auto-exec") out.autoExec = true;
    else if (raw.startsWith("--interval="))
      out.intervalSec = parsePositiveInt(raw.split("=")[1] ?? "30", out.intervalSec);
    else if (raw.startsWith("--on-unblock="))
      out.onUnblock = raw.slice("--on-unblock=".length);
    else if (raw.startsWith("--output="))
      out.outputFile = raw.slice("--output=".length);
    else if (raw.startsWith("--max-cycles="))
      out.maxCycles = parseNonNegativeInt(raw.split("=")[1] ?? "0", out.maxCycles);
  }
  return out;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function emit(body, outputFile = "") {
  const payload = JSON.stringify(body, null, 2);
  console.log(payload);
  if (outputFile) {
    const outputPath = path.resolve(root, outputFile);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, payload + "\n", "utf8");
  }
}

async function runWatchMode(opts) {
  const TASK_EXEC_MAP = {
    "W02-B05": "npm run wave:w02:verify",
  };

  let cycle = 0;
  for (;;) {
    cycle++;
    const result = evaluate();
    emit(
      {
        ts: new Date().toISOString(),
        cycle,
        ...result.body,
      },
      opts.outputFile,
    );

    if (result.body.state === "eligible" || result.body.state === "idle") {
      if (result.body.state === "eligible") {
        const cmd =
          opts.onUnblock ||
          (opts.autoExec ? TASK_EXEC_MAP[result.body.task_id] ?? "" : "");
        if (cmd) {
          execSync(cmd, { stdio: "inherit", cwd: root });
        }
      }
      process.exit(0);
    }

    if (result.code === 1) process.exit(1);
    if (opts.maxCycles > 0 && cycle >= opts.maxCycles) process.exit(2);

    await sleep(opts.intervalSec * 1000);
  }
}

try {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.watch) {
    await runWatchMode(opts);
  } else {
    const result = evaluate();
    emit(result.body, opts.outputFile);
    process.exit(result.code);
  }
} catch (error) {
  console.error(
    JSON.stringify(
      {
        lane: "codex",
        state: "error",
        message: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    ),
  );
  process.exit(1);
}
