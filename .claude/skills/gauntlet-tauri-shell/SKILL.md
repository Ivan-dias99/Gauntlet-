---
name: gauntlet-tauri-shell
description: Sovereign desktop-shell law for the Gauntlet product (Tauri 2 binary at apps/desktop/). Use whenever the user is editing, reviewing, designing, or refactoring desktop-shell code — including any file under apps/desktop/, src-tauri/, tauri.conf.json, capabilities/default.json, the Rust binary (lib.rs, main.rs, smoke.rs), the TS adapters in src/adapters/, the desktop ambient at src/ambient.ts, the desktop App.tsx (mounts shared Capsule), the desktop PillApp.tsx (intentionally divergent — does NOT mount shared Pill), the two-window entries (index.html / pill.html), or the Tauri-side build / signing / updater pipeline. Trigger this skill whenever a .rs file is touched, whenever Cargo.toml or capabilities/*.json is modified, whenever a Tauri command (show_capsule, hide_capsule, show_pill, hide_pill, toggle_pill, move_window_to_cursor, run_shell, start_backend, stop_backend, pick_file, pick_save_path, read_text_file_at, write_text_file_at, read_file_base64_at, write_file_base64_at, capture_screen_full, capture_screen_region, get_active_window, cu_mouse_move, cu_mouse_click, cu_type, cu_press, set_pill_follow_cursor, get_pill_follow_cursor) is added or invoked, whenever global shortcut / clipboard / window-decoration / OS-integration is discussed, whenever the desktop installer (.msi, .dmg, .AppImage, .deb), TAURI_SIGNING_PRIVATE_KEY, or updater pubkey appears, and whenever the conversation crosses the desktop ↔ shared-composer boundary. This skill enforces capability-grant discipline (plugin permissions in capabilities/; dangerous custom commands need explicit scoping; computer-use commands are the highest-risk surface), the two-window pattern (cápsula window mounts shared Capsule via DesktopAmbient; pill window mounts custom PillApp because page-DOM abstractions don't translate to OS windows — this divergence is documented in PillApp.tsx and is correct), the signing + updater law (no public release without pinned pubkey — pubkey is currently pinned), the OS-leak rule (no Tauri-specific imports inside packages/composer/src/), and the capabilities matrix (which Composer features ship in the desktop shell vs the browser shell). It composes with — and does not replace — gauntlet-design-system (shared Capsule rules + Pill divergence rationale), gauntlet-backend-spine (the desktop shell talks to the backend), gauntlet-release-discipline (signing assets gate), and CLAUDE.md (universal doutrina).
---

# Gauntlet Tauri Shell

This skill is the local constitution for desktop-shell work in the Gauntlet repository. It does not re-teach Tauri 2; it does not duplicate `/CLAUDE.md`. It encodes what is **specific to this desktop shell** — the capability-grant model, the two-window pattern, the OS-integration boundary, the signing and updater law, the computer-use surface, and the closure shape a desktop change has to take before it can ship.

The desktop shell is **not the Composer**. It is one of two runtimes that **host** the shared `@gauntlet/composer`. Visual or behavioral divergence in the **Capsule** between this shell and the browser-extension shell is regression. Divergence in the **Pill** is intentional and documented. Read this skill in full whenever you touch `apps/desktop/` or `src-tauri/`. Most of the rules exist because real failures have happened — most of them security-shaped.

---

## When to use this skill

Trigger this skill whenever any of these are true:

- The change touches a file under `apps/desktop/` or `src-tauri/`.
- A `.rs` file or `Cargo.toml` is being edited.
- `tauri.conf.json` or `capabilities/default.json` is being modified.
- A Tauri command from the canonical list (24 commands; full catalogue below) is being added, modified, or invoked.
- The work involves global shortcut, clipboard, window decoration, transparency, multi-window orchestration, file pickers, or any OS integration.
- The conversation mentions `TAURI_SIGNING_PRIVATE_KEY`, the updater pubkey, signing keys, code signing, or installer artifacts (`.msi`, `.dmg`, `.AppImage`, `.deb`).
- The desktop ambient (`apps/desktop/src/ambient.ts`) or Tauri adapters are being touched.
- The user mentions computer use (`cu_*` commands) — mouse / keyboard automation surface.
- The user is debugging a parity issue between browser-extension and desktop shells (load both this skill and `gauntlet-design-system`).
- The user asks why the desktop pill is different from the browser pill (see "Pill divergence" below).

When you trigger, **also obey `/CLAUDE.md`** for universal doutrina, and load `gauntlet-design-system` if the change crosses into the shared composer.

## When NOT to use this skill

- Browser-extension shell (`apps/browser-extension/`) — no Tauri. Different shell, different ambient.
- Pure UI work inside the shared composer (`packages/composer/src/`) — `gauntlet-design-system` owns it.
- Backend Python (`backend/`) — `gauntlet-backend-spine`.
- Documentation-only edits to `docs/`.

If a change spans desktop + shared composer (e.g. wiring a Tauri capability into the cápsula UI), load both skills.

---

## How this skill composes with others

| Concern | Owner | What this skill adds |
|---|---|---|
| Universal doutrina | `/CLAUDE.md` | Always-on. Not duplicated. |
| Shared Capsule, dual-shell parity, Aether visual canon, Pill divergence rationale | `gauntlet-design-system` | Defer fully on the Capsule body. This skill owns only the desktop *adapter* and the *PillApp* implementation. |
| Backend Python, /composer endpoints, gateway | `gauntlet-backend-spine` | The desktop shell **calls** the backend (and can autostart it via `start_backend` command). Contract obligations live there. |
| Release tagging, signing, CI workflow | `gauntlet-release-discipline` | This skill enforces **how** to sign and pin pubkey; release skill owns **when**. |

---

## Product law (desktop lens)

### 1. Two windows, one Composer

The desktop shell runs **two windows**:

- **Cápsula** (main window, identifier `main`) — `index.html`, decoration-less, transparent. Mounts the **shared** `@gauntlet/composer` Capsule.
- **Pill** (small bottom-right surface, identifier `pill`) — `pill.html`. Mounts a **custom** `PillApp.tsx` (intentional divergence — see "Pill divergence" below).

The cápsula window IS the Composer surface. The pill window IS the resting-state magnet. The OS itself handles drag / positioning / always-on-top — not JavaScript.

### 2. Capability discipline — calibrated to Tauri 2

Tauri 2's permission model has two layers:

1. **Plugin permissions** (declared in `capabilities/default.json`): grant plugin operations to specific windows. Examples: `core:window:allow-show`, `clipboard-manager:allow-read-text`, `dialog:allow-open`, `updater:allow-check`. The current capability file declares 8 plugin permission groups scoped to `["main", "pill"]`.
2. **Custom command access**: every function annotated with `#[tauri::command]` and registered in the invoke handler is **callable from any window in the app by default** (ambient access), unless additionally restricted via a custom permission scope.

This means the simple rule "every command needs a capability entry" is not how Tauri 2 actually works. The real rule is: **dangerous custom commands must have their access narrowed deliberately, because the default is ambient.**

The 24 custom commands today fall into three risk tiers:

| Tier | Commands | Default access today | Ideal access |
|---|---|---|---|
| **Low risk** (window + pill ergonomics) | `show_capsule`, `hide_capsule`, `show_pill`, `hide_pill`, `toggle_pill`, `move_window_to_cursor`, `set_pill_follow_cursor`, `get_pill_follow_cursor`, `get_active_window` | ambient (both windows) | acceptable; ambient OK |
| **Medium risk** (filesystem read, screenshots, backend control) | `pick_file`, `pick_save_path`, `read_text_file_at`, `read_file_base64_at`, `capture_screen_full`, `capture_screen_region`, `start_backend`, `stop_backend` | ambient | scope to `main` only via explicit permission |
| **High risk** (write filesystem, shell exec, computer use) | `write_text_file_at`, `write_file_base64_at`, `run_shell`, `cu_mouse_move`, `cu_mouse_click`, `cu_type`, `cu_press` | ambient | **must** scope to `main` only with explicit permission; ideally tagged with operator confirmation in the UI |

The product law: **adding a new high-risk Tauri command without explicit scoping is a regression.** The `pill` window should not be able to invoke `run_shell`, `cu_*`, or filesystem writes. Today the codebase doesn't enforce this — it's an open hardening item (P1).

### 3. OS leaks belong in the adapter, never in the shared Composer

The shared composer (`packages/composer/src/`) must remain shell-agnostic. If you find yourself writing `import { invoke } from "@tauri-apps/api"` inside `packages/composer/src/`, stop. That import belongs in `apps/desktop/src/adapters/tauri.ts` and is surfaced to the Composer via `ambient.capabilities.*`.

The rule a `gauntlet-design-system` already states applies in this direction too: no `if (Platform.isDesktop)` inside the shared composer. Every desktop-only behavior is exposed as a capability the Composer reads, never as a branch the Composer writes.

### 4. Computer use is the highest-risk surface

The `cu_*` commands (`cu_mouse_move`, `cu_mouse_click`, `cu_type`, `cu_press`) let the agent drive the user's actual mouse and keyboard. This is qualitatively different from the in-page DOM actions the browser shell offers — the desktop shell can interact with **any application on the user's OS**.

Specific rules for computer use:

- **Operator gate**: a computer-use action sequence must pass through `ComputerUseGate` (defined in `packages/composer/src/ComputerUseGate.tsx`). The gate exists; do not add a code path that bypasses it.
- **Ambient consent is not consent**: the user must affirm computer-use intent each time, not once-per-session. The gate's UX is the contract.
- **`backend/test_computer_use_tool.py` is canonical** — when changing `cu_*` behavior, update or extend that test in the same PR.
- **No new `cu_*` command without an ADR**. Computer use surface is small on purpose.

---

## Pill divergence — read this before flagging PillApp.tsx as a regression

The desktop shell does **not** mount the shared `<Pill>` from `@gauntlet/composer`. It has its own `apps/desktop/src/PillApp.tsx`, with this comment at the top of the file:

> *"We intentionally do NOT reuse the shared `<Pill />` from `@gauntlet/composer` here: that component owns viewport-magnetism, drag, and per-domain dismiss, all of which are page-DOM concepts. On desktop the WINDOW is the pill; the OS handles drag (via `data-tauri-drag-region`) and there is no domain to dismiss against."*

This is correct. The shared `<Pill>` is built for page-DOM concepts:

- Viewport-magnetism (drift toward cursor on hover proximity inside a page)
- Drag-from-pill repositioning (saved per-domain in `chrome.storage`)
- Per-domain dismiss (right-click → flag the host domain)
- `mode: 'corner' | 'cursor'` (cursor mode hides the OS pointer)
- Phase mirror via `window.dispatchEvent` of `gauntlet:phase`
- Idle fade after 30s of no pointer movement on the page

None of these apply to an OS window:

- The desktop pill window IS the surface — Tauri positions it (220×56, transparent, always-on-top, skipTaskbar).
- Drag is OS-level via `data-tauri-drag-region`.
- There is no domain.
- There is no host page to listen for `selectionchange`.

Reject any change that tries to "unify" by re-binding the desktop pill to the shared component. The right move is the opposite: keep `PillApp.tsx` slim, route window orchestration through Tauri commands, and let the OS handle what the OS handles.

**What MUST stay aligned across shells**: the visual identity of the pill. Both pills are the same warm-ember magnetic dot (Aether tokens — see `gauntlet-design-system`). If the desktop pill's color, size, halo, or breath animation drifts from the browser pill's, *that* is regression. The visual is shared; the container differs.

---

## Architectural truth

```
apps/desktop/
  index.html                 ← cápsula entry (main, decoration-less, transparent)
  pill.html                  ← pill entry (small bottom-right surface)
  src/
    main.tsx · pill-main.tsx ← React entries per window
    App.tsx                  ← mounts shared @gauntlet/composer Capsule
    PillApp.tsx              ← slim custom pill (intentionally divergent)
    ambient.ts               ← createDesktopAmbient (Tauri adapters + SSE)
    adapters/                ← clipboard, window title, global shortcut, updater, etc.
  src-tauri/                 ← Rust binary
    src/
      lib.rs                 ← 24 commands (see catalogue below)
      main.rs                ← entry
    tests/                   ← cargo tests (no webview required)
    tauri.conf.json          ← window flags + updater endpoint config + pinned pubkey
    capabilities/
      default.json           ← plugin permissions, scoped to ["main", "pill"]
    Cargo.toml
  tests/                     ← desktop integration tests (webview-driven)
```

Two non-obvious rules:

- **Smoke tests are webview-free.** `src-tauri/tests/` (cargo tests) covers pure Rust helpers and runs in the `desktop-smoke` CI job. If a test needs a webview to run, it is not a smoke test — it is an integration test, and it does not belong in CI's smoke gate.
- **`backend_health` and `start_backend` probe localhost from Rust.** The desktop shell can autostart the backend (Python) via `start_backend`, ping it via the backend's `/health/ready`, and stop it via `stop_backend`. Adding a new domain the shell must reach goes in `tauri.conf.json` allowlists, not in the shared composer.

---

## Tauri command catalogue (current canonical list)

Track this as ground truth. If you add a 25th command, add it here in the same PR.

| # | Command | Tier | Notes |
|---|---|---|---|
| 1 | `get_active_window` | Low | Returns active window info |
| 2 | `capture_screen_region` | Medium | Screenshot of a region |
| 3 | `capture_screen_full` | Medium | Full-screen screenshot |
| 4 | `start_backend` | Medium | Spawn Python backend process |
| 5 | `stop_backend` | Medium | Terminate Python backend |
| 6 | `pick_file` | Medium | Open file dialog |
| 7 | `pick_save_path` | Medium | Save-as dialog |
| 8 | `read_text_file_at` | Medium | Read file as UTF-8 |
| 9 | `read_file_base64_at` | Medium | Read file as base64 |
| 10 | `write_text_file_at` | **High** | Write file |
| 11 | `write_file_base64_at` | **High** | Write base64 file |
| 12 | `run_shell` | **High** | Execute shell command (allowlisted bins; validate args in handler) |
| 13 | `move_window_to_cursor` | Low | Reposition cápsula |
| 14 | `show_capsule` | Low | Show main window |
| 15 | `hide_capsule` | Low | Hide main window |
| 16 | `show_pill` | Low | Show pill window |
| 17 | `hide_pill` | Low | Hide pill window |
| 18 | `toggle_pill` | Low | Toggle pill window |
| 19 | `set_pill_follow_cursor` | Low | Pill ergonomics |
| 20 | `get_pill_follow_cursor` | Low | Pill ergonomics |
| 21 | `cu_mouse_move` | **High** | Computer use — move mouse |
| 22 | `cu_mouse_click` | **High** | Computer use — click |
| 23 | `cu_type` | **High** | Computer use — type text |
| 24 | `cu_press` | **High** | Computer use — key press |

---

## Two-window contract

| Window | Entry HTML | Entry TSX | Mounts | Tier-allowed commands |
|---|---|---|---|---|
| Cápsula | `index.html` | `src/main.tsx` → `App.tsx` | shared `@gauntlet/composer` Capsule | Low + Medium + High (with operator gate for High) |
| Pill | `pill.html` | `src/pill-main.tsx` → `PillApp.tsx` (custom) | slim local component | Low only |

Rules:

- **The Capsule mounts the shared component from `@gauntlet/composer`.** Re-implementing it in `apps/desktop/src/` is regression.
- **The PillApp does NOT mount the shared `<Pill>`.** This divergence is intentional and documented (see "Pill divergence" section above).
- **Window orchestration belongs in Rust**, not in TS. Showing/hiding windows is a Tauri command; the TS side calls the command, never manipulates the window directly via DOM tricks.
- **Global shortcut is shell-side.** `Ctrl+Shift+Space` registration lives in `lib.rs`, surfaces as a capability the cápsula can react to via the ambient.
- **No third window without a documented reason.** Settings, logs, debug — those go in the Control Center, which is a separate surface (Vercel-deployed). The desktop binary owns exactly two windows.

---

## Capabilities matrix (desktop vs browser)

Which Composer features ship in the desktop shell vs the browser-extension shell. Canonical source: `docs/canon/COMPOSER_SURFACE_SPEC.md`.

| Capability | Browser | Desktop | Implementation |
|---|---|---|---|
| `domExecution` | ✅ | ❌ | DOM only exists in pages |
| `screenshot` | ✅ | ✅ | tab-capture · capture_screen_full / _region |
| `screenCapture` | ✅ | ✅ | same shape `{base64, path}` |
| `filesystemRead` | ✅ | ✅ | File API · `read_text_file_at` / `read_file_base64_at` |
| `filesystemWrite` | ❌ | ✅ | desktop only (security): `write_text_file_at` / `write_file_base64_at` |
| `voice` | ✅ | ✅ | Web Speech API |
| `remoteVoice` | ✅ | ✅ | backend `/voice/transcribe` |
| `streaming` | ✅ | ✅ | SSE · ReadableStream |
| `shellExecute` | ❌ | ✅ | desktop only · allowlist via `run_shell` |
| `notifications` | ❌ | ✅ | tauri-plugin-notification |
| `computerUse` | ❌ | ✅ | desktop only · `cu_*` commands behind `ComputerUseGate` |

Where a capability is missing, the corresponding button **does not appear** in the cápsula. The action row stays visually identical (`ANEXAR · ECRÃ · VOZ · ENVIAR`); SHELL is reachable only via `/shell` slash command on desktop, never as a button.

This matrix is the contract between this shell and `gauntlet-design-system`. When you add a new capability to the desktop shell, declare it in `createDesktopAmbient()` and update this table in the same PR.

---

## Signing and updater law

| Asset | Where it lives | Where it does NOT live |
|---|---|---|
| `TAURI_SIGNING_PRIVATE_KEY` | GitHub Secret only | Repo. Local `.env`. Documentation. Slack. |
| Updater pubkey | Pinned in `tauri.conf.json` (currently SET ✓) | Loose, "we'll add it later" |
| Notarization credentials (macOS) | GitHub Secret | Repo |

Hard rules:

- **Updater pubkey IS pinned today.** The previously-open critical from `docs/SECURITY_AUDIT.md` is closed. Don't unpinit.
- **`grep -rE "PRIVATE KEY" src-tauri/ apps/desktop/`** must return nothing. Pre-commit hook should refuse a commit that contains a key.
- **Signing happens in CI, not on a laptop.** `.github/workflows/release.yml` runs `npm run tauri:build` with the secret from GitHub. Local `tauri:build` produces unsigned dev artifacts only — never publish those.
- **Auto-updater respects user trust.** No silent updates without signature verification. Tauri 2's updater enforces this when pubkey is pinned (it is); that is why pubkey is mandatory.

---

## Closure check

A desktop change is **not closed** until all of these are true. Verify each before saying `missão concluída`.

1. **Builder landed.** `npm run tauri:dev` starts the dev binary; both cápsula and pill windows appear; no Rust panic on startup.
2. **Smoke tests pass.** `cargo test --tests` in `apps/desktop/src-tauri` is green (the `desktop-smoke` CI job).
3. **Capability discipline.** If a new `#[tauri::command]` was added to `lib.rs`, its risk tier was decided. Low-tier commands can stay ambient. Medium- and High-tier commands have an explicit scoping plan documented (even if the codebase enforcement is open work).
4. **Catalogue updated.** This skill's command catalogue table reflects the new command, including its tier.
5. **Capabilities matrix updated.** If a new capability was added to `createDesktopAmbient()`, the desktop-vs-browser table in this skill is updated in the same PR.
6. **Adapter wrapper present.** Every new command has a typed wrapper in `apps/desktop/src/adapters/` and a capability surface in `src/ambient.ts`. No raw `invoke(...)` outside the adapter.
7. **No OS leak in shared Composer.** `grep -rE "@tauri-apps|invoke\\(" packages/composer/src/` returns no new matches.
8. **Capsule mount unchanged.** `apps/desktop/src/App.tsx` still imports `Capsule` from `@gauntlet/composer`. No re-implementation in the shell.
9. **Pill divergence respected.** `apps/desktop/src/PillApp.tsx` remains a custom slim component. The visual identity still matches the shared `<Pill>` (same ember + breath + halo).
10. **No private key in repo.** `grep -rE "PRIVATE KEY|BEGIN OPENSSH" src-tauri/ apps/desktop/` returns nothing.
11. **Computer-use changes pair with `test_computer_use_tool.py`.** Any change to `cu_*` updates the matching test in `backend/test_computer_use_tool.py`.
12. **If desktop release is implied:** updater pubkey remains pinned; signing secret is in CI; `npm run tauri:build` produces a signed artifact.
13. **Browser-extension parity check.** If the change adds a user-visible Capsule behavior, the browser-extension shell has a matching ambient capability — or has an explicit reason it cannot.
14. **Owned residue closed.** No `// TODO`, `// FIXME`, no `println!("debug")` left in.

If any check fails or was not run, the correct response is `não tenho evidência suficiente`.

---

## Anti-patterns (reject on sight)

| Anti-pattern | Why it's wrong | Correct shape |
|---|---|---|
| New high-risk `#[tauri::command]` (file write, shell, cu_*) added without a scoping plan | Defaults to ambient access; pill window inherits dangerous capability | Document scoping in the PR; add explicit permission grant scoped to `main` |
| `run_shell(cmd: String)` accepting arbitrary strings | Arbitrary shell exec from the webview | Pin binary in capability or whitelist; validate args in Rust handler |
| `import { invoke } from "@tauri-apps/api"` inside `packages/composer/src/` | OS leak into shared Composer | Move to `apps/desktop/src/adapters/`; surface via ambient |
| `if (Platform.isDesktop)` inside the shared Composer | Same problem, JS shape | Capability surfaced via `ambient.capabilities.*` |
| Re-implemented Capsule in `apps/desktop/src/` | Breaks single-source-of-truth | Mount from `@gauntlet/composer` |
| `import Pill from '@gauntlet/composer'` added to `apps/desktop/src/PillApp.tsx` | Forces page-DOM abstraction onto an OS window | Keep the custom `PillApp.tsx`; this divergence is intentional |
| Desktop pill visual drifts from browser pill (different size, different breath, different color) | Visual identity must match | Identity is shared (ember + breath); only behavior diverges |
| URL allowlist with `*` glob | Network surface left open | Exact origins only |
| `TAURI_SIGNING_PRIVATE_KEY` in `.env`, repo, or docs | Key leak | GitHub Secret only |
| Tagging a public desktop release without pubkey pinned | Remote code execution path via updater | (Already pinned — keep it pinned) |
| Local `tauri:build` artifact published | Unsigned binary | Build via CI workflow with the secret |
| New window added for "settings" or "logs" | Belongs in Control Center, not desktop binary | Use the Control Center surface |
| New `cu_*` command without ComputerUseGate path | Bypasses operator consent | Route through `ComputerUseGate.tsx` |
| Smoke test that requires a webview | Breaks `desktop-smoke` CI gate | Move to integration test suite (`apps/desktop/tests/`) |
| New capability added to `createDesktopAmbient()` without updating the matrix in this skill | Documentation drift | Update the table in the same PR |

---

## Example invocations (how a user might trigger this skill)

These should reliably load this skill:

- "Add a Tauri command to open the user's default browser at a URL."
- "The global shortcut isn't firing on Linux."
- "Wire the cápsula to read clipboard on `move_window_to_cursor`."
- "Add a new allowed origin so the shell can fetch from staging."
- "Why does the pill window flicker on Windows?"
- "Tighten the capability scope on `run_shell`."
- "The cápsula looks transparent on macOS but solid on Linux — debug."
- "Move all `invoke(...)` calls out of the shared composer."
- "Add a new `cu_*` capability for scrolling."
- "Why is the desktop pill different from the browser pill?"
- "Make the desktop pill use the shared `<Pill>` component." ← reject, explain

For any of these, the skill's job is to: (a) decide the risk tier, (b) keep the change inside the appropriate scoping plan, (c) preserve the two-window pattern, (d) prevent OS leaks into the shared Composer, (e) preserve the intentional PillApp divergence, (f) verify signing / updater discipline if release is implied, (g) verify against the closure check before declaring done.

---

## Reference

- Project doutrina: `/CLAUDE.md`.
- Public README: `/README.md` (§ "Layout" for desktop tree, § "Releases" for signing law).
- Operations: `/docs/OPERATIONS.md`.
- Security audit (updater pubkey now closed): `/docs/SECURITY_AUDIT.md`.
- Composer canonical surface spec (capabilities matrix authoritative): `/docs/canon/COMPOSER_SURFACE_SPEC.md`.
- Tauri 2 capabilities reference: `apps/desktop/src-tauri/capabilities/default.json`.
- Tauri command source: `apps/desktop/src-tauri/src/lib.rs`.
- Computer-use test: `backend/test_computer_use_tool.py`.
- ComputerUseGate UI: `packages/composer/src/ComputerUseGate.tsx`.
- Companion skills: `gauntlet-design-system` (shared Capsule + Pill divergence rationale), `gauntlet-backend-spine` (the backend the shell calls), `gauntlet-release-discipline` (when and how to ship).

If something in this skill conflicts with `/CLAUDE.md` or with the actual desktop code on main, the **code wins**. Repo truth beats narrative.
