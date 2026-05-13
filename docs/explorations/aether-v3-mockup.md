# Gauntlet v3 mockup — archived exploration

> **Status:** archive · not canon. Preserved as ancestor of Aether v4.
> **Active canon:** `docs/canon/AETHER_V4.md` and `packages/composer/src/aether-v4.css`.
> **Do not migrate from this file.** All elements that survived into v4 are already documented under v4's lineage section (§1).

**Canonical path in repo:** `docs/explorations/aether-v3-mockup.md`
**Archived:** 2026-05-13
**Author:** Claude Design (sealed via the Aether v4 migration pack)

---

## What this was

A standalone, high-fidelity, single-page HTML mockup produced as a parallel visual exploration of the Gauntlet surface. Delivered as a zip (`gauntlet_v3.zip`) containing:

| File | Lines | Purpose |
|---|---|---|
| `Gauntlet v3.html` | 36 | UMD entry, loads React 18 + Babel standalone, mounts artboards |
| `theme.css` | 184 | Paper + graphite themes, accent system, type primitives |
| `design-canvas.jsx` | 936 | Figma-like canvas wrapper with reorderable artboards + post-it notes |
| `gauntlet-app.jsx` | 446 | Main app: assembles artboards, includes tweaks panel |
| `composer-artboards.jsx` | 342 | Pill idle, capsule expanded, plan render, voice mockups |
| `control-center-artboards.jsx` | 545 | Dashboard, permissions, history mockups |
| `control-center-extras.jsx` | 332 | Additional control-center surfaces |
| `tweaks-panel.jsx` | 568 | Live theme tweaker (accent, density, animations toggle) |
| `gauntlet-shared.jsx` | 297 | Shared primitives: Pill, Capsule, BrowserChrome, EditorChrome, TerminalChrome |
| `gauntlet-cursor.jsx` | 57 | Cursor + arrow indicator |

Plus 3 rendered screenshots showing the assembled mockup at scroll.

Total: 3,743 lines of JSX + 184 lines of CSS, **none of which migrated as-is to the canonical repo**. The mockup was built outside `packages/composer/` with no build step, no test surface, and no integration with the v2 phase grammar.

---

## What v4 inherited from this mockup

These are the only elements that survived into canon. They are now governed by `AETHER_V4.md` — modifications happen there, not here.

| Element | Where it lives in v4 |
|---|---|
| Paper background `#f6f4ef` | `--gx-bg` in `aether-v4.css` §4.1 |
| Ink scale (`#1c1a16`, etc.) | `--gx-text*` in `aether-v4.css` §4.2 |
| Multi-slot accent system (vs single-ember) | `--gx-accent*` in `aether-v4.css` §4.4 |
| Cyan `#0EA5C7` as brand primary | `--gx-accent` in `aether-v4.css` §4.4 |
| Moss `#5d8c5a` as success | `--gx-accent-ok` in `aether-v4.css` §4.4 |
| Terracotta `#c96442` as warmth | `--gx-accent-warm` in `aether-v4.css` §4.4 (executed only) |
| Magenta `#b85a9b` as mark | `--gx-accent-mark` in `aether-v4.css` §4.4 |
| Newsreader serif (display + italic accent) | `--gx-font-serif` in `aether-v4.css` §5 |
| Inter Tight sans (body + controls) | `--gx-font-sans` in `aether-v4.css` §5 |
| JetBrains Mono (labels, meta, code) | `--gx-font-mono` in `aether-v4.css` §5 |
| Italic serif accent pattern `<em class="gx-display-it">…</em>` | `AETHER_V4.md` §5.2 |
| Graphite dark variant via `[data-gx-theme="graphite"]` | `aether-v4.css` §4.5 |

---

## What v4 explicitly killed from this mockup

Reject any PR that attempts to reintroduce these into the canonical repo:

- **`design-canvas.jsx` (936 lines).** A god-component combining Figma-canvas, post-it notes, drag-reorder, and fullscreen overlay. Not canon. Violates the Capsule Law spirit (single-purpose components). Belongs in design tools, not in `packages/composer/`.
- **`tweaks-panel.jsx` live theme tweaker.** Runtime theme mutation. The canon has exactly two themes (`paper` + `graphite`); a live mutator invites drift and gives the operator the illusion of safe customization. Settings live in Control Center.
- **No `gx-state-{phase}` grammar.** The mockup used React state internally to switch visual treatment per artboard, not phase classes on a single root. This is the antipattern v2 §3.2 names ("phase grammar over component grammar"). v4 inherits the grammar from v2 and applies it to v3's palette.
- **Babel-standalone + UMD React.** Useful for fast mockup iteration; never canonical. Production assets must build through the workspace pipeline (Vite for browser-extension, Tauri build for desktop).
- **JSX-as-script-tag entries.** `<script type="text/babel">` parsing at runtime is incompatible with Manifest V3 CSPs and Tauri's stricter web context. Not portable to either shell.
- **The four `--accent-*` slots renamed `--accent`, `--accent-2`, `--accent-3`, `--accent-warm`.** v4 promotes the semantic slot names (`--gx-accent`, `--gx-accent-ok`, `--gx-accent-mark`, `--gx-accent-warm`) so usage is auditable. The numeric suffixes invited "which accent should I use here" decisions at component level; semantic slot names answer the question structurally.
- **Mockup-specific class names** (`g-display`, `g-it`, `g-meta`, `.g-root`). v4 promotes to `gx-*` for consistency with the existing token vocabulary.

---

## What this archive is not

- **Not a usable component library.** Do not import from this directory. The JSX files are not built.
- **Not a design source of truth.** When v4 changes, this file does not. When this file changes, v4 does not.
- **Not a runnable preview.** The `Gauntlet v3.html` entry was rendered into the three screenshots in this directory; the entry itself uses Babel-standalone and a CSP that the production shells do not allow.

---

## Why preserve at all

Three reasons, in order of importance:

1. **Lineage clarity.** When someone asks "where did the cyan brand come from?" or "who decided Newsreader italic for accents?" the answer points here. Aether v4's §1 names every adoption; this file is the receipt.
2. **Anti-resurrection.** Without this archive, a future Claude session might re-explore the same direction, produce another high-fidelity mockup, and propose yet another visual canon. Having v3 archived with explicit kill-list reasons makes that recurrence visible immediately.
3. **Exploration legitimacy.** v3 was good work. Killing it without acknowledgment teaches the wrong lesson (that exploration is wasted). Archiving it with explicit "what survived into canon" recognizes the contribution while protecting the canon from drift.

---

## Reference

- Active canon: `/docs/canon/AETHER_V4.md`
- Canonical tokens: `/packages/composer/src/aether-v4.css`
- Sibling archive: `/docs/explorations/AETHER_V2_SPEC.md`
- v1 shipped (still active during migration): `/packages/composer/src/capsule.css.ts`
