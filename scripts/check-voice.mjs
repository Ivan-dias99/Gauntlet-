#!/usr/bin/env node
// scripts/check-voice.mjs
//
// Voice ban-list lint. Greps banned tokens in src/ and reports every hit
// with file · line · matched fragment. Exits 1 on any hit so CI fails
// before broken voice reaches main. Honours the doctrine in docs/VOICE.md.
//
// Run: node scripts/check-voice.mjs   (or  npm run check:voice)
//
// Skips:
//   - node_modules, dist, build artefacts.
//   - this script itself (declares the patterns it bans).
//   - docs/VOICE.md (documents the bans, must keep them as text).
//   - *.smoke.ts and *.test.ts fixtures (user-prompt strings under test).
//   - sourcemap files (*.map).

import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(import.meta.url), "..", "..");

// Each rule has a short name + a regex matcher. Regexes are case-insensitive
// where it does not collide with semantic glyphs.
const RULES = [
  { name: "rocket-emoji",      pattern: /🚀/g },         // U+1F680
  { name: "fire-emoji",        pattern: /🔥/g },         // U+1F525
  { name: "sparkles-emoji",    pattern: /✨/g },                // U+2728
  { name: "party-popper",      pattern: /🎉/g },         // U+1F389
  { name: "click-here",        pattern: /\bclick here\b/gi },
  { name: "please",            pattern: /\bplease\b/gi },
  { name: "loading-ellipsis",  pattern: /\bloading\.\.\./gi },     // "Loading..."
  { name: "oops",              pattern: /\boops\b/gi },
  { name: "yay",               pattern: /\byay\b/gi },
];

const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  ".git",
  ".next",
  ".vercel",
  "coverage",
]);

const SKIP_FILE_SUFFIXES = [
  ".smoke.ts",   // intent-switch fixtures contain "Please" by design
  ".smoke.tsx",
  ".test.ts",
  ".test.tsx",
  ".map",
];

// Files that document the ban-list itself — they must keep the banned
// strings as text, otherwise the doc loses its meaning.
const SKIP_PATHS = new Set([
  relative(ROOT, fileURLToPath(import.meta.url)),
  join("docs", "VOICE.md"),
]);

const SCAN_ROOTS = ["src"];

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(join(dir, entry.name));
    } else if (entry.isFile()) {
      yield join(dir, entry.name);
    }
  }
}

function isScannable(rel) {
  if (SKIP_PATHS.has(rel)) return false;
  for (const suffix of SKIP_FILE_SUFFIXES) {
    if (rel.endsWith(suffix)) return false;
  }
  // Only scan textual sources.
  return /\.(ts|tsx|js|jsx|mjs|cjs|md|html|css|json)$/.test(rel);
}

async function scanFile(absPath, relPath) {
  let raw;
  try {
    raw = await readFile(absPath, "utf8");
  } catch {
    return [];
  }
  const lines = raw.split(/\r?\n/);
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const rule of RULES) {
      rule.pattern.lastIndex = 0;
      const matches = line.match(rule.pattern);
      if (matches) {
        for (const m of matches) {
          hits.push({ rule: rule.name, line: i + 1, fragment: m, snippet: line.trim() });
        }
      }
    }
  }
  return hits.map((h) => ({ ...h, file: relPath }));
}

async function main() {
  const allHits = [];
  for (const root of SCAN_ROOTS) {
    const abs = join(ROOT, root);
    let exists = true;
    try {
      await stat(abs);
    } catch {
      exists = false;
    }
    if (!exists) continue;
    for await (const file of walk(abs)) {
      const rel = relative(ROOT, file).split(sep).join("/");
      if (!isScannable(rel)) continue;
      const hits = await scanFile(file, rel);
      allHits.push(...hits);
    }
  }

  if (allHits.length === 0) {
    console.log("voice: clean (zero banned tokens in src/)");
    process.exit(0);
  }

  console.error(`voice: ${allHits.length} ban-list hit(s) — see docs/VOICE.md`);
  for (const hit of allHits) {
    console.error(
      `  ${hit.file}:${hit.line}  [${hit.rule}]  "${hit.fragment}"  → ${hit.snippet.slice(0, 100)}`
    );
  }
  process.exit(1);
}

main().catch((err) => {
  console.error("voice: lint crashed", err);
  process.exit(2);
});
