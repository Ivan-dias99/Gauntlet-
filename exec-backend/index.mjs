// Ruberra — In-repo execution backend (development-grade)
// Zero external dependencies. Node.js built-ins only.
//
// Endpoints:
//   POST /exec           — resolve files matching scope glob in repoPath, return as artifacts
//   GET  /git/status     — run `git status --short` in repoPath
//   POST /git/verify     — check repoPath exists and contains a .git directory
//
// CORS: allows http://localhost:5173 (Vite dev port)
// Execution failure: returns { ok: false, error } — frontend must handle with failExecution + nullConsequence
//
// No fake terminal. No hardcoded artifacts. Real filesystem/git operations only.

import http from "http";
import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);
const PORT = process.env.RUBERRA_EXEC_PORT ? Number(process.env.RUBERRA_EXEC_PORT) : 3001;
const ALLOWED_ORIGIN = process.env.RUBERRA_ORIGIN ?? "http://localhost:5173";

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

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let buf = "";
    req.on("data", (c) => (buf += c));
    req.on("end", () => {
      try { resolve(JSON.parse(buf || "{}")); }
      catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

// Resolve files matching a glob-like scope pattern inside a repo directory.
// Scope patterns supported:
//   - "**/*.ts"   → all .ts files
//   - "src/**"    → all files under src/
//   - "*.md"      → markdown files at repo root
//   - exact file name fragment → files whose path contains the fragment
// Returns array of relative paths (max 20).
async function resolveFiles(repoPath, scope) {
  const trimmed = (scope ?? "").trim();
  if (!trimmed) return [];

  // Use git ls-files so we only return tracked files (real repo authority).
  let allFiles = [];
  try {
    const { stdout } = await execAsync("git ls-files", { cwd: repoPath });
    allFiles = stdout.trim().split("\n").filter(Boolean);
  } catch {
    // Not a git repo or git unavailable — fall back to fs walk (still real)
    allFiles = await walkDir(repoPath, repoPath);
  }

  const pattern = trimmed;

  // Convert glob-like pattern to a simple regex
  const regex = globToRegex(pattern);
  const matched = allFiles.filter((f) => regex.test(f));

  return matched.slice(0, 20);
}

function globToRegex(pattern) {
  // Escape regex special chars except * and /
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "__GLOBSTAR__")
    .replace(/\*/g, "[^/]*")
    .replace(/__GLOBSTAR__/g, ".*");
  return new RegExp(escaped, "i");
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

// ── route handlers ─────────────────────────────────────────────────────────

async function handleExec(req, res) {
  let body;
  try { body = await readBody(req); }
  catch { return json(res, 400, { ok: false, error: "invalid JSON body" }); }

  const { repoPath, directive } = body;
  if (!repoPath) return json(res, 400, { ok: false, error: "repoPath required" });
  if (!directive?.scope) return json(res, 400, { ok: false, error: "directive.scope required" });

  // Verify path exists
  try { await fs.access(repoPath); }
  catch { return json(res, 404, { ok: false, error: `repoPath not found: ${repoPath}` }); }

  let files;
  try {
    files = await resolveFiles(repoPath, directive.scope);
  } catch (e) {
    return json(res, 500, { ok: false, error: e.message });
  }

  const artifacts = files.map((f) => ({ title: f }));
  console.log(`[exec] ${directive.scope} → ${artifacts.length} artifacts in ${repoPath}`);
  return json(res, 200, { ok: true, artifacts });
}

async function handleGitStatus(req, res, searchParams) {
  const repoPath = searchParams.get("path");
  if (!repoPath) return json(res, 400, { ok: false, error: "path query param required" });

  try { await fs.access(repoPath); }
  catch { return json(res, 404, { ok: false, error: `path not found: ${repoPath}` }); }

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

  const { repoPath } = body;
  if (!repoPath) return json(res, 400, { ok: false, message: "repoPath required" });

  try { await fs.access(repoPath); }
  catch { return json(res, 200, { ok: false, message: `path not found: ${repoPath}` }); }

  try {
    await fs.access(path.join(repoPath, ".git"));
    // Also get the remote/branch for richer surface
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

// ── server ─────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  // Parse URL
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    cors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && pathname === "/exec") {
    return handleExec(req, res);
  }
  if (req.method === "GET" && pathname === "/git/status") {
    return handleGitStatus(req, res, url.searchParams);
  }
  if (req.method === "POST" && pathname === "/git/verify") {
    return handleGitVerify(req, res);
  }

  json(res, 404, { ok: false, error: `unknown endpoint: ${req.method} ${pathname}` });
});

server.listen(PORT, () => {
  console.log(`[ruberra-exec] listening on http://localhost:${PORT}`);
  console.log(`[ruberra-exec] CORS origin: ${ALLOWED_ORIGIN}`);
  console.log(`[ruberra-exec] endpoints: POST /exec  GET /git/status  POST /git/verify`);
});
