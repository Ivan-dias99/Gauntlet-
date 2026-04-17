// Ruberra — In-repo execution backend
// Zero external dependencies. Node.js built-ins only.
//
// Endpoints:
//   POST /exec           — resolve files matching scope glob in repoPath
//   GET  /git/status     — run `git status --short` in repoPath
//   POST /git/verify     — check repoPath exists and contains a .git directory
//   POST /git/diff       — get git diff for staged/unstaged changes
//   POST /git/commit     — commit staged changes with a message
//   POST /git/stage      — stage files by path
//   POST /file/read      — read file contents from repo
//   POST /file/write     — write file contents to repo
//
// CORS: allows http://localhost:5173 (Vite dev port)
// Execution failure: returns { ok: false, error }

import http from "http";
import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);
const PORT = process.env.RUBERRA_EXEC_PORT ? Number(process.env.RUBERRA_EXEC_PORT) : 3001;
const ALLOWED_ORIGIN = process.env.RUBERRA_ORIGIN ?? "http://localhost:5173";

// ── path guard ─────────────────────────────────────────────────────────────
function sanitizePath(raw) {
  if (!raw || typeof raw !== "string") return null;
  if (raw.includes("\0")) return null;
  const resolved = path.resolve(raw);
  if (!path.isAbsolute(resolved)) return null;
  return resolved;
}

// Ensure a file path stays within the repo directory (no traversal escape)
function safeFilePath(repoPath, filePath) {
  if (!filePath || typeof filePath !== "string") return null;
  if (filePath.includes("\0")) return null;
  const full = path.resolve(repoPath, filePath);
  if (!full.startsWith(repoPath + path.sep) && full !== repoPath) return null;
  return full;
}

// ── helpers ────────────────────────────────────────────────────────────────

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function json(res, status, data) {
  cors(res);
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const BODY_LIMIT = 256 * 1024; // 256 KB — increased for file writes

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let buf = "";
    let size = 0;
    req.on("data", (chunk) => {
      size += Buffer.byteLength(chunk);
      if (size > BODY_LIMIT) {
        req.destroy();
        return reject(new Error("request body too large"));
      }
      buf += chunk;
    });
    req.on("end", () => {
      try { resolve(JSON.parse(buf || "{}")); }
      catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

async function resolveFiles(repoPath, scope) {
  const trimmed = (scope ?? "").trim();
  if (!trimmed) return [];

  let allFiles = [];
  try {
    const { stdout } = await execAsync("git ls-files", { cwd: repoPath });
    allFiles = stdout.trim().split("\n").filter(Boolean);
  } catch {
    allFiles = await walkDir(repoPath, repoPath);
  }

  const regex = globToRegex(trimmed);
  const matched = allFiles.filter((f) => regex.test(f));
  return matched.slice(0, 20);
}

function globToRegex(pattern) {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "__GLOBSTAR__")
    .replace(/\*/g, "[^/]*")
    .replace(/__GLOBSTAR__\//g, "(?:.*/)?")
    .replace(/__GLOBSTAR__/g, ".*");
  return new RegExp(`^${escaped}$`, "i");
}

async function walkDir(base, dir) {
  const results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith(".") || e.name === "node_modules") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      results.push(...(await walkDir(base, full)));
    } else {
      results.push(path.relative(base, full));
    }
  }
  return results;
}

// ── Verify repo helper ────────────────────────────────────────────────────

async function verifyGitRepo(repoPath) {
  try { await fs.access(repoPath); }
  catch { return { ok: false, error: "repoPath not found" }; }
  try { await fs.access(path.join(repoPath, ".git")); }
  catch { return { ok: false, error: "repoPath is not a git repository" }; }
  return { ok: true };
}

// ── Route handlers ─────────────────────────────────────────────────────────

async function handleExec(req, res) {
  let body;
  try { body = await readBody(req); }
  catch { return json(res, 400, { ok: false, error: "invalid JSON body" }); }

  const { repoPath: rp, repo, directive } = body;
  const repoPath = sanitizePath(rp ?? repo);
  if (!repoPath) return json(res, 400, { ok: false, error: "repoPath required" });
  if (!directive?.scope) return json(res, 400, { ok: false, error: "directive.scope required" });

  const check = await verifyGitRepo(repoPath);
  if (!check.ok) return json(res, 400, check);

  let files;
  try {
    files = await resolveFiles(repoPath, directive.scope);
  } catch (e) {
    return json(res, 500, { ok: false, error: e.message });
  }

  const artifacts = files.map((f) => ({ title: f }));
  console.log(`[exec] scope=${directive.scope} → ${artifacts.length} artifacts`);
  return json(res, 200, { ok: true, artifacts });
}

async function handleGitStatus(req, res, searchParams) {
  const repoPath = sanitizePath(searchParams.get("path"));
  if (!repoPath) return json(res, 400, { ok: false, error: "path query param required" });

  try { await fs.access(repoPath); }
  catch { return json(res, 404, { ok: false, error: "path not found" }); }

  try {
    const { stdout } = await execAsync("git status --short", { cwd: repoPath });
    return json(res, 200, { ok: true, output: stdout });
  } catch (e) {
    return json(res, 200, { ok: false, error: e.message, output: "" });
  }
}

async function handleGitVerify(req, res) {
  let body;
  try { body = await readBody(req); }
  catch { return json(res, 400, { ok: false, message: "invalid JSON body" }); }

  const repoPath = sanitizePath(body.repoPath);
  if (!repoPath) return json(res, 400, { ok: false, message: "repoPath required" });

  try { await fs.access(repoPath); }
  catch { return json(res, 200, { ok: false, message: "path not found" }); }

  try {
    await fs.access(path.join(repoPath, ".git"));
    let branch = "";
    try {
      const { stdout } = await execAsync("git rev-parse --abbrev-ref HEAD", { cwd: repoPath });
      branch = stdout.trim();
    } catch {}
    return json(res, 200, { ok: true, message: `verified git repo${branch ? ` · ${branch}` : ""}`, branch });
  } catch {
    return json(res, 200, { ok: false, message: `${repoPath} exists but is not a git repository` });
  }
}

// ── NEW: Git Diff ─────────────────────────────────────────────────────────

async function handleGitDiff(req, res) {
  let body;
  try { body = await readBody(req); }
  catch { return json(res, 400, { ok: false, error: "invalid JSON body" }); }

  const repoPath = sanitizePath(body.repoPath);
  if (!repoPath) return json(res, 400, { ok: false, error: "repoPath required" });

  const check = await verifyGitRepo(repoPath);
  if (!check.ok) return json(res, 400, check);

  const staged = body.staged !== false; // default to showing staged + unstaged
  const cmd = staged ? "git diff HEAD" : "git diff";

  try {
    const { stdout } = await execAsync(cmd, { cwd: repoPath, maxBuffer: 1024 * 1024 });
    return json(res, 200, { ok: true, diff: stdout });
  } catch (e) {
    return json(res, 500, { ok: false, error: e.message });
  }
}

// ── NEW: Git Stage Files ──────────────────────────────────────────────────

async function handleGitStage(req, res) {
  let body;
  try { body = await readBody(req); }
  catch { return json(res, 400, { ok: false, error: "invalid JSON body" }); }

  const repoPath = sanitizePath(body.repoPath);
  if (!repoPath) return json(res, 400, { ok: false, error: "repoPath required" });

  const check = await verifyGitRepo(repoPath);
  if (!check.ok) return json(res, 400, check);

  const files = body.files;
  if (!Array.isArray(files) || files.length === 0) {
    return json(res, 400, { ok: false, error: "files array required" });
  }

  // Validate each file path stays within repo
  for (const f of files) {
    if (!safeFilePath(repoPath, f)) {
      return json(res, 400, { ok: false, error: `invalid file path: ${f}` });
    }
  }

  try {
    const escaped = files.map(f => `"${f.replace(/"/g, '\\"')}"`).join(" ");
    await execAsync(`git add ${escaped}`, { cwd: repoPath });
    return json(res, 200, { ok: true, staged: files });
  } catch (e) {
    return json(res, 500, { ok: false, error: e.message });
  }
}

// ── NEW: Git Commit ───────────────────────────────────────────────────────

async function handleGitCommit(req, res) {
  let body;
  try { body = await readBody(req); }
  catch { return json(res, 400, { ok: false, error: "invalid JSON body" }); }

  const repoPath = sanitizePath(body.repoPath);
  if (!repoPath) return json(res, 400, { ok: false, error: "repoPath required" });
  if (!body.message || typeof body.message !== "string" || !body.message.trim()) {
    return json(res, 400, { ok: false, error: "commit message required" });
  }

  const check = await verifyGitRepo(repoPath);
  if (!check.ok) return json(res, 400, check);

  try {
    const msg = body.message.trim().replace(/'/g, "'\\''");
    const { stdout } = await execAsync(`git commit -m '${msg}'`, { cwd: repoPath });
    // Extract commit ref
    const refMatch = stdout.match(/\[[\w\-/]+\s+([a-f0-9]+)\]/);
    const commitRef = refMatch ? refMatch[1] : undefined;
    console.log(`[git/commit] ${commitRef ?? "unknown"}: ${body.message.slice(0, 60)}`);
    return json(res, 200, { ok: true, commitRef, output: stdout });
  } catch (e) {
    return json(res, 500, { ok: false, error: e.message });
  }
}

// ── NEW: File Read ────────────────────────────────────────────────────────

async function handleFileRead(req, res) {
  let body;
  try { body = await readBody(req); }
  catch { return json(res, 400, { ok: false, error: "invalid JSON body" }); }

  const repoPath = sanitizePath(body.repoPath);
  if (!repoPath) return json(res, 400, { ok: false, error: "repoPath required" });
  if (!body.filePath) return json(res, 400, { ok: false, error: "filePath required" });

  const full = safeFilePath(repoPath, body.filePath);
  if (!full) return json(res, 400, { ok: false, error: "invalid file path" });

  try {
    const content = await fs.readFile(full, "utf-8");
    const stat = await fs.stat(full);
    return json(res, 200, {
      ok: true,
      filePath: body.filePath,
      content,
      size: stat.size,
      modified: stat.mtimeMs,
    });
  } catch (e) {
    return json(res, 404, { ok: false, error: `file not readable: ${e.message}` });
  }
}

// ── NEW: File Write ───────────────────────────────────────────────────────

async function handleFileWrite(req, res) {
  let body;
  try { body = await readBody(req); }
  catch { return json(res, 400, { ok: false, error: "invalid JSON body" }); }

  const repoPath = sanitizePath(body.repoPath);
  if (!repoPath) return json(res, 400, { ok: false, error: "repoPath required" });
  if (!body.filePath) return json(res, 400, { ok: false, error: "filePath required" });
  if (typeof body.content !== "string") return json(res, 400, { ok: false, error: "content required" });

  const full = safeFilePath(repoPath, body.filePath);
  if (!full) return json(res, 400, { ok: false, error: "invalid file path" });

  try {
    // Ensure parent directory exists
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, body.content, "utf-8");
    console.log(`[file/write] ${body.filePath} (${body.content.length} bytes)`);
    return json(res, 200, { ok: true, filePath: body.filePath, size: body.content.length });
  } catch (e) {
    return json(res, 500, { ok: false, error: e.message });
  }
}

// ── NEW: Git Log ──────────────────────────────────────────────────────────

async function handleGitLog(req, res, searchParams) {
  const repoPath = sanitizePath(searchParams.get("path"));
  if (!repoPath) return json(res, 400, { ok: false, error: "path query param required" });

  const count = Math.min(parseInt(searchParams.get("count") ?? "10", 10), 50);

  const check = await verifyGitRepo(repoPath);
  if (!check.ok) return json(res, 400, check);

  try {
    const { stdout } = await execAsync(
      `git log --oneline -${count} --format="%H|%h|%s|%ai|%an"`,
      { cwd: repoPath }
    );
    const commits = stdout.trim().split("\n").filter(Boolean).map(line => {
      const [hash, short, subject, date, author] = line.split("|");
      return { hash, short, subject, date, author };
    });
    return json(res, 200, { ok: true, commits });
  } catch (e) {
    return json(res, 500, { ok: false, error: e.message });
  }
}

// ── Server ────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  if (req.method === "OPTIONS") {
    cors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  // Route dispatch
  if (req.method === "POST" && pathname === "/exec")        return handleExec(req, res);
  if (req.method === "GET"  && pathname === "/git/status")  return handleGitStatus(req, res, url.searchParams);
  if (req.method === "GET"  && pathname === "/git/log")     return handleGitLog(req, res, url.searchParams);
  if (req.method === "POST" && pathname === "/git/verify")  return handleGitVerify(req, res);
  if (req.method === "POST" && pathname === "/git/diff")    return handleGitDiff(req, res);
  if (req.method === "POST" && pathname === "/git/stage")   return handleGitStage(req, res);
  if (req.method === "POST" && pathname === "/git/commit")  return handleGitCommit(req, res);
  if (req.method === "POST" && pathname === "/file/read")   return handleFileRead(req, res);
  if (req.method === "POST" && pathname === "/file/write")  return handleFileWrite(req, res);

  json(res, 404, { ok: false, error: `unknown endpoint: ${req.method} ${pathname}` });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[ruberra-exec] listening on http://127.0.0.1:${PORT} (loopback only)`);
  console.log(`[ruberra-exec] CORS origin: ${ALLOWED_ORIGIN}`);
  console.log(`[ruberra-exec] endpoints:`);
  console.log(`  POST /exec         — resolve files by scope glob`);
  console.log(`  GET  /git/status   — git status --short`);
  console.log(`  GET  /git/log      — git log (recent commits)`);
  console.log(`  POST /git/verify   — verify .git exists`);
  console.log(`  POST /git/diff     — git diff`);
  console.log(`  POST /git/stage    — git add files`);
  console.log(`  POST /git/commit   — git commit -m`);
  console.log(`  POST /file/read    — read file content`);
  console.log(`  POST /file/write   — write file content`);
});
