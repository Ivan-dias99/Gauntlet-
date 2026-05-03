// Wave P-45 — central tool registry.
//
// Single source of truth for the tool catalog every chamber can opt
// into. Before P-45 the canonical list lived inside
// `terminal/ExecutionComposer.tsx` (TERMINAL_TOOLS); other chambers
// either re-derived their own list or did not surface tools at all.
// This module decouples the catalog from any one chamber so the
// upcoming Insight tool inspector + Surface custom tools can read the
// same authoritative grammar.
//
// Tool kinds:
//   fs   — filesystem read / introspection
//   cmd  — shell-class execution (gated)
//   vcs  — version-control read/write
//   net  — outbound HTTP / search
//
// `gated: true` declares the tool requires Core/Permissions sign-off
// at runtime even when ticked in the chamber allowlist. The badge is a
// reminder; enforcement lives server-side.

export type ToolKind = "fs" | "cmd" | "vcs" | "net";

export interface ToolDef {
  name: string;
  kind: ToolKind;
  gated?: boolean;
  /** Short editorial label shown in chamber pickers. */
  label?: string;
  /** One-line description shown in the inspector / settings. */
  blurb?: string;
}

// Terminal-class tools — file ops, command execution, vcs, net.
export const TERMINAL_TOOLS: ReadonlyArray<ToolDef> = [
  { name: "read_file",      kind: "fs",  label: "Read",      blurb: "lê um ficheiro do workspace" },
  { name: "list_directory", kind: "fs",  label: "List",      blurb: "lista o conteúdo de um directório" },
  { name: "run_command",    kind: "cmd", gated: true, label: "Run",       blurb: "executa um comando shell" },
  { name: "execute_python", kind: "cmd", gated: true, label: "Execute",   blurb: "corre código Python isolado" },
  { name: "git",            kind: "vcs", label: "Git",       blurb: "operações de controlo de versão" },
  { name: "web_fetch",      kind: "net", label: "Fetch",     blurb: "GET de uma URL com headers configuráveis" },
  { name: "web_search",     kind: "net", label: "Search",    blurb: "consulta de motor de pesquisa" },
];

// Insight-class tools — research grounding (fetch + search) by
// default. Distillation/validate are chamber-internal verbs, not
// agent-loop tools, so they do not appear here.
export const INSIGHT_TOOLS: ReadonlyArray<ToolDef> = [
  { name: "web_fetch",  kind: "net", label: "Fetch",  blurb: "GET de uma URL para grounding" },
  { name: "web_search", kind: "net", label: "Search", blurb: "consulta de motor de pesquisa" },
  { name: "read_file",  kind: "fs",  label: "Read",   blurb: "lê um ficheiro do workspace" },
];

export const TERMINAL_TOOL_NAMES: ReadonlyArray<string> =
  TERMINAL_TOOLS.map((t) => t.name);

export const INSIGHT_TOOL_NAMES: ReadonlyArray<string> =
  INSIGHT_TOOLS.map((t) => t.name);

/**
 * Lookup table by canonical tool name (across both chambers).
 *
 * Codex review #289 (P1) — the previous form did `all[t.name] = t` for
 * every entry, so when the same name appeared in both lists with
 * different metadata (e.g. `web_fetch` carries chamber-specific blurbs)
 * the second list silently overwrote the first. Now we keep the first
 * definition seen (TERMINAL is canonical), and warn in dev when a later
 * list redefines an existing name with conflicting fields. Consumers
 * that need chamber-specific copy should read TERMINAL_TOOLS or
 * INSIGHT_TOOLS directly — TOOL_BY_NAME is the canonical lookup.
 */
export const TOOL_BY_NAME: Readonly<Record<string, ToolDef>> = (() => {
  const all: Record<string, ToolDef> = {};
  for (const t of [...TERMINAL_TOOLS, ...INSIGHT_TOOLS]) {
    const existing = all[t.name];
    if (!existing) {
      all[t.name] = t;
      continue;
    }
    const conflict =
      existing.kind !== t.kind ||
      Boolean(existing.gated) !== Boolean(t.gated) ||
      (existing.label ?? null) !== (t.label ?? null) ||
      (existing.blurb ?? null) !== (t.blurb ?? null);
    if (conflict && import.meta.env?.DEV) {
      console.warn(
        `[tools/registry] duplicate tool "${t.name}" with conflicting metadata; keeping first definition`,
        { kept: existing, dropped: t },
      );
    }
  }
  return Object.freeze(all);
})();
