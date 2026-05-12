---
name: gauntlet-tauri-shell
description: Sovereign desktop-shell law for the Gauntlet product (Tauri 2 binary at apps/desktop/). Use whenever the user is editing, reviewing, designing, or refactoring desktop-shell code — including any file under apps/desktop/, src-tauri/, tauri.conf.json, capabilities/default.json, the Rust binary (lib.rs, main.rs, smoke.rs), TS adapters in src/adapters/, the desktop ambient at src/ambient.ts, the desktop App.tsx (mounts shared Capsule), the desktop PillApp.tsx (intentionally divergent per ADR-0004 — does NOT mount shared Pill), the two-window entries (index.html / pill.html), or the Tauri-side build / signing / updater pipeline. Trigger this skill whenever a .rs file is touched, whenever Cargo.toml or capabilities/*.json is modified, whenever a Tauri command (24 in catalogue below) is added or invoked, whenever global shortcut / clipboard / window-decoration / OS-integration is discussed, whenever the desktop installer (.msi, .dmg, .AppImage, .deb), TAURI_SIGNING_PRIVATE_KEY, or updater pubkey appears (currently pinned in tauri.conf.json — 248 chars base64, verified 2026-05-12), and whenever the conversation crosses the desktop ↔ shared-composer boundary. This skill enforces capability-grant discipline (plugin permissions in capabilities/; dangerous custom commands need explicit scoping; computer-use commands are the highest-risk surface), the two-window pattern (cápsula window mounts shared Capsule via DesktopAmbient; pill window mounts custom PillApp because page-DOM abstractions don't translate to OS windows — see ADR-0004), the signing + updater law (pubkey IS pinned today; release requires signed binary from CI), the OS-leak rule (no Tauri-specific imports inside packages/composer/src/), and the capabilities matrix (which Composer features ship desktop vs browser). Composes with gauntlet-design-system (shared Capsule + Pill divergence rationale), gauntlet-backend-spine (the desktop shell talks to the backend), gauntlet-release-discipline (signing assets gate), and references ADRs 0001, 0004, 0006.
---

# Gauntlet Tauri Shell

Local constitution for desktop-shell work. Does not re-teach Tauri 2; does not duplicate `/CLAUDE.md`. Encodes what is **specific to this desktop shell** — capability-grant model, two-window pattern, OS-integration boundary, signing/updater law, computer-use surface, and closure shape.

The desktop shell is **not the Composer**. It is one of two runtimes hosting `@gauntlet/composer`. Visual or behavioral divergence in the **Capsule** between shells is regression. Divergence in the **Pill** is intentional and documented (ADR-0004).

---

## When to use

- File under `apps/desktop/` or `src-tauri/` is touched
- A `.rs` file or `Cargo.toml` is edited
- `tauri.conf.json` or `capabilities/default.json` is modified
- A Tauri command (24 in catalogue) is added, modified, or invoked
- Global shortcut, clipboard, window decoration, transparency, multi-window orchestration, file pickers, OS integration
- `TAURI_SIGNING_PRIVATE_KEY`, updater pubkey, signing keys, code signing, installer artifacts (`.msi`, `.dmg`, `.AppImage`, `.deb`)
- Desktop ambient (`apps/desktop/src/ambient.ts`) or Tauri adapters touched
- Computer use (`cu_*` commands) — mouse/keyboard automation
- Debugging parity issue between browser-extension and desktop (load both this skill and `gauntlet-design-system`)
- User asks why desktop pill differs from browser pill (see Pill divergence section)

Always also obey `/CLAUDE.md`; load `gauntlet-design-system` if change crosses into shared composer.

## When NOT to use

- Browser-extension shell (`apps/browser-extension/`) — no Tauri
- UI work inside shared composer → `gauntlet-design-system`
- Backend Python → `gauntlet-backend-spine`
- Documentation-only edits to `docs/`

---

## How this skill composes

| Concern | Owner | Adds |
|---|---|---|
| Universal doctrine | `/CLAUDE.md` | Always-on |
| Shared Capsule, Aether canon, Pill divergence rationale | `gauntlet-design-system` | Defers fully on Capsule body; owns desktop adapter + PillApp |
| Backend Python, gateway, endpoints | `gauntlet-backend-spine` | Desktop shell **calls** backend (autostart via `start_backend`) |
| Release tagging, signing | `gauntlet-release-discipline` | This skill enforces **how** to sign / verify pubkey; release owns **when** |

---

## Product law

### 1. Two windows, one Composer (ADR-0001)

Desktop shell runs **two windows**:

- **Cápsula** (main window, identifier `main`) — `index.html`, decoration-less, transparent. Mounts **shared** `@gauntlet/composer` Capsule.
- **Pill** (small bottom-right, identifier `pill`) — `pill.html`. Mounts **custom** `PillApp.tsx` (intentional per ADR-0004).

Cápsula window IS the Composer surface. Pill window IS the resting-state magnet. OS handles drag/position/always-on-top — not JavaScript.

### 2. Capability discipline — calibrated to Tauri 2

Tauri 2 permission model has two layers:

1. **Plugin permissions** (`capabilities/default.json`) — grant plugin operations to specific windows. Current capability file declares plugin permission groups scoped to `["main", "pill"]`.
2. **Custom command access** — every `#[tauri::command]` registered in invoke handler is **callable from any window by default** (ambient), unless additionally restricted via custom permission scope.

"Every command needs a capability entry" is **not** how Tauri 2 works. The real rule: **dangerous custom commands must have their access narrowed deliberately, because default is ambient.**

### 3. OS leaks belong in the adapter

Shared composer (`packages/composer/src/`) must remain shell-agnostic. `import { invoke } from "@tauri-apps/api"` inside `packages/composer/src/` = OS leak. Belongs in `apps/desktop/src/adapters/tauri.ts`, surfaced via `ambient.capabilities.*`.

### 4. Computer use is highest-risk surface

`cu_*` commands (`cu_mouse_move`, `cu_mouse_click`, `cu_type`, `cu_press`) let the agent drive user's actual mouse and keyboard. Qualitatively different from in-page DOM actions — desktop shell can interact with **any application on the user's OS**.

- **Operator gate** — computer-use sequence must pass through `ComputerUseGate` (`packages/composer/src/ComputerUseGate.tsx`). Bypass = regression.
- **Ambient consent is not consent** — user must affirm computer-use intent each time, not once-per-session.
- **`backend/test_computer_use_tool.py` is canonical** — `cu_*` changes update or extend that test in same PR.
- **No new `cu_*` command without ADR.** Surface is small on purpose.

---

## Pill divergence — read this before flagging PillApp.tsx as regression (ADR-0004)

Desktop shell does **not** mount shared `<Pill>` from `@gauntlet/composer`. Has its own `apps/desktop/src/PillApp.tsx`, with this comment at top:

> "We intentionally do NOT reuse the shared `<Pill />` from `@gauntlet/composer` here: that component owns viewport-magnetism, drag, and per-domain dismiss, all of which are page-DOM concepts. On desktop the WINDOW is the pill; the OS handles drag (via `data-tauri-drag-region`) and there is no domain to dismiss against."

This is correct. Shared `<Pill>` owns page-DOM abstractions (viewport-magnetism, drag-from-pill, per-domain dismiss, `mode: 'corner' | 'cursor'`, page-level pointer events, idle fade after 30s) that don't transfer to Tauri windows.

Reject any change that tries to "unify" by re-binding desktop pill to shared component. Right move is opposite: keep `PillApp.tsx` slim, route window orchestration through Tauri commands, let OS handle what OS handles.

**Visual identity** of the pill is shared: both pills are same warm-ember magnetic dot (Aether v2 tokens per ADR-0005). Color/size/halo/breath must match. Container differs; identity doesn't.

---

## 3 risk tiers for the 24 custom commands

| Tier | Commands | Default access | Ideal access |
|---|---|---|---|
| **Low** (window/pill ergo) | `show_capsule`, `hide_capsule`, `show_pill`, `hide_pill`, `toggle_pill`, `move_window_to_cursor`, `set_pill_follow_cursor`, `get_pill_follow_cursor`, `get_active_window` | ambient (both windows) | acceptable; ambient OK |
| **Medium** (fs read, screenshot, backend control) | `pick_file`, `pick_save_path`, `read_text_file_at`, `read_file_base64_at`, `capture_screen_full`, `capture_screen_region`, `start_backend`, `stop_backend` | ambient | scope to `main` only via explicit permission |
| **High** (fs write, shell exec, computer use) | `write_text_file_at`, `write_file_base64_at`, `run_shell`, `cu_mouse_move`, `cu_mouse_click`, `cu_type`, `cu_press` | ambient | **must** scope to `main` only; operator confirmation in UI |

**Adding a new high-risk command without scoping plan = regression.** Pill window should not invoke `run_shell`, `cu_*`, or filesystem writes. Today the codebase doesn't enforce this — it's an open hardening item (P1).

---

## Architectural truth

```
apps/desktop/
  index.html                 ← cápsula entry (main, decoration-less, transparent)
  pill.html                  ← pill entry (small bottom-right)
  src/
    main.tsx · pill-main.tsx ← React entries per window
    App.tsx                  ← mounts shared @gauntlet/composer Capsule
    PillApp.tsx              ← custom slim pill (intentional per ADR-0004)
    ambient.ts               ← createDesktopAmbient (Tauri adapters + SSE)
    adapters/                ← clipboard, window title, global shortcut, updater, etc.
  src-tauri/                 ← Rust binary
    src/
      lib.rs                 ← 24 commands (catalogue below) · verified count
      main.rs                ← entry
    tests/                   ← cargo tests (no webview required)
    tauri.conf.json          ← window flags + updater config + pubkey PINNED (248 chars)
    capabilities/
      default.json           ← plugin permissions scoped to ["main", "pill"]
    Cargo.toml
  tests/                     ← desktop integration tests (webview-driven)
```

Two non-obvious rules:
- **Smoke tests are webview-free.** `src-tauri/tests/` (cargo tests) covers pure Rust helpers, runs in `desktop-smoke` CI job. Tests needing webview belong in `apps/desktop/tests/`, not smoke gate.
- **`backend_health` and `start_backend` probe localhost from Rust.** Desktop shell autostarts backend via `start_backend`, pings `/health/ready`, stops via `stop_backend`. New reachable domain → `tauri.conf.json` allowlist, not shared composer.

---

## Tauri command catalogue (canonical 24)

If you add a 25th, add it here in same PR.

| # | Command | Tier | Notes |
|---|---|---|---|
| 1 | `get_active_window` | Low | Returns active window info |
| 2 | `capture_screen_region` | Medium | Screenshot of region |
| 3 | `capture_screen_full` | Medium | Full-screen screenshot |
| 4 | `start_backend` | Medium | Spawn Python backend process |
| 5 | `stop_backend` | Medium | Terminate Python backend |
| 6 | `pick_file` | Medium | Open file dialog |
| 7 | `pick_save_path` | Medium | Save-as dialog |
| 8 | `read_text_file_at` | Medium | Read file as UTF-8 |
| 9 | `read_file_base64_at` | Medium | Read file as base64 |
| 10 | `write_text_file_at` | **High** | Write file |
| 11 | `write_file_base64_at` | **High** | Write base64 file |
| 12 | `run_shell` | **High** | Execute shell (allowlisted bins; validate args in handler) |
| 13 | `move_window_to_cursor` | Low | Reposition cápsula |
| 14 | `show_capsule` | Low | Show main window |
| 15 | `hide_capsule` | Low | Hide main window |
| 16 | `show_pill` | Low | Show pill window |
| 17 | `hide_pill` | Low | Hide pill window |
| 18 | `toggle_pill` | Low | Toggle pill window |
| 19 | `set_pill_follow_cursor` | Low | Pill ergo |
| 20 | `get_pill_follow_cursor` | Low | Pill ergo |
| 21 | `cu_mouse_move` | **High** | Computer use — move mouse |
| 22 | `cu_mouse_click` | **High** | Computer use — click |
| 23 | `cu_type` | **High** | Computer use — type text |
| 24 | `cu_press` | **High** | Computer use — key press |

---

## Two-window contract

| Window | Entry HTML | Entry TSX | Mounts | Tier-allowed |
|---|---|---|---|---|
| Cápsula | `index.html` | `src/main.tsx` → `App.tsx` | shared `@gauntlet/composer` Capsule | Low + Medium + High (with operator gate) |
| Pill | `pill.html` | `src/pill-main.tsx` → `PillApp.tsx` (custom) | slim local component | Low only |

Rules:
- Capsule mounts shared from `@gauntlet/composer`. Re-implementing in `apps/desktop/src/` = regression.
- PillApp does NOT mount shared `<Pill>`. Intentional per ADR-0004.
- Window orchestration in Rust, not TS. Show/hide via Tauri command; TS never manipulates window via DOM tricks.
- Global shortcut shell-side. `Ctrl+Shift+Space` registration in `lib.rs`, surfaced via ambient.
- No third window without documented reason. Settings/logs/debug → Control Center. Desktop binary owns exactly two windows.

---

## Capabilities matrix (desktop vs browser)

Canonical source: `docs/canon/COMPOSER_SURFACE_SPEC.md`.

| Capability | Browser | Desktop | Implementation |
|---|---|---|---|
| `domExecution` | ✅ | ❌ | DOM exists in pages only |
| `screenshot` | ✅ | ✅ | tab-capture · `capture_screen_full`/`_region` |
| `screenCapture` | ✅ | ✅ | same shape `{base64, path}` |
| `filesystemRead` | ✅ | ✅ | File API · `read_text_file_at`/`read_file_base64_at` |
| `filesystemWrite` | ❌ | ✅ | desktop only: `write_text_file_at`/`write_file_base64_at` |
| `voice` | ✅ | ✅ | Web Speech API |
| `remoteVoice` | ✅ | ✅ | backend `/voice/transcribe` |
| `streaming` | ✅ | ✅ | SSE · ReadableStream |
| `shellExecute` | ❌ | ✅ | desktop only · allowlist via `run_shell` |
| `notifications` | ❌ | ✅ | tauri-plugin-notification |
| `computerUse` | ❌ | ✅ | desktop only · `cu_*` behind ComputerUseGate |

Missing capability → button does not appear. Action row stays visually identical (`ANEXAR · ECRÃ · VOZ · ENVIAR`). SHELL reachable only via `/shell` slash command on desktop, never as a button.

This matrix is the contract between this shell and `gauntlet-design-system`. New capability added → update this table in same PR.

---

## Signing and updater law

| Asset | Where it lives | Where it does NOT live |
|---|---|---|
| `TAURI_SIGNING_PRIVATE_KEY` | GitHub Secret only | Repo. Local `.env`. Documentation. Slack. |
| Updater pubkey | **Pinned in `tauri.conf.json`** · 248 chars base64 minisign · verified 2026-05-12 | Loose, "we'll add it later" |
| Notarization credentials (macOS) | GitHub Secret | Repo |

Hard rules:

- **Updater pubkey IS pinned today.** Earlier audit suggested it wasn't; that audit was stale. The canonical statement is now: pubkey pinned, format verified. Skill v1.0 said "NOT pinned" — that was wrong. This v1.2 corrects.
- **`grep -rE "PRIVATE KEY" src-tauri/ apps/desktop/`** must return nothing.
- **Signing happens in CI, not on a laptop.** `.github/workflows/release.yml` runs `npm run tauri:build` with secret from GitHub. Local `tauri:build` produces unsigned dev artifacts only — never publish those.
- **Auto-updater respects user trust.** No silent updates without signature verification. Tauri 2's updater enforces this when pubkey is pinned (it is).

---

## Closure check

Not closed until all true:

1. **Builder landed** — `npm run tauri:dev` starts dev binary; both windows appear; no Rust panic
2. **Smoke tests pass** — `cargo test --tests` in `apps/desktop/src-tauri` green
3. **Capability discipline** — new `#[tauri::command]` has risk tier decided; Medium/High have scoping plan documented
4. **Catalogue updated** — new command appears in catalogue table in this skill, with tier
5. **Capabilities matrix updated** — new capability in `createDesktopAmbient()` reflected in matrix table in same PR
6. **Adapter wrapper present** — typed wrapper in `apps/desktop/src/adapters/` + capability in `src/ambient.ts`. No raw `invoke(...)` outside adapter
7. **No OS leak in shared Composer** — `grep -rE "@tauri-apps|invoke\\(" packages/composer/src/` returns no new matches
8. **Capsule mount unchanged** — `apps/desktop/src/App.tsx` still imports `Capsule` from `@gauntlet/composer`
9. **Pill divergence respected** — `apps/desktop/src/PillApp.tsx` remains custom slim; visual identity matches shared `<Pill>`
10. **No private key in repo** — `grep -rE "PRIVATE KEY|BEGIN OPENSSH" src-tauri/ apps/desktop/` returns nothing
11. **Computer-use changes pair with test** — `backend/test_computer_use_tool.py` updated for any `cu_*` change
12. **If desktop release implied** — pubkey verified pinned (it is); signing secret in CI; `npm run tauri:build` produces signed artifact
13. **Browser-extension parity check** — user-visible Capsule behavior → browser shell has matching ambient capability or documented reason it cannot
14. **Owned residue closed** — no `// TODO`, no `println!("debug")`

If any fails: `não tenho evidência suficiente`.

---

## Anti-patterns (reject on sight)

| Anti-pattern | Correct shape |
|---|---|
| New High-risk `#[tauri::command]` without scoping plan | Document scoping in PR; explicit permission scoped to `main` |
| `run_shell(cmd: String)` accepting arbitrary strings | Pin binary in capability or whitelist; validate args in Rust handler |
| `import { invoke } from "@tauri-apps/api"` in `packages/composer/src/` | Move to `apps/desktop/src/adapters/`; surface via ambient |
| `if (Platform.isDesktop)` inside shared Composer | Capability via `ambient.capabilities.*` |
| Re-implemented Capsule in `apps/desktop/src/` | Mount from `@gauntlet/composer` |
| `import Pill from '@gauntlet/composer'` in `apps/desktop/src/PillApp.tsx` | Keep custom; ADR-0004 |
| Desktop pill visual drifts from browser pill | Identity shared (ember + breath); only behavior diverges |
| URL allowlist with `*` glob | Exact origins only |
| `TAURI_SIGNING_PRIVATE_KEY` in `.env`, repo, or docs | GitHub Secret only |
| Unpinning the updater pubkey "for testing" | Pubkey stays pinned; use dev profile for testing |
| Local `tauri:build` artifact published | CI workflow with secret |
| New window for "settings" or "logs" | Control Center, not desktop binary |
| New `cu_*` command without ComputerUseGate path | Route through gate |
| Smoke test requiring webview | Move to integration suite (`apps/desktop/tests/`) |
| New capability in ambient without updating matrix in this skill | Update table in same PR |

---

## Example invocations

- "Add Tauri command to open user's default browser at a URL"
- "Global shortcut not firing on Linux"
- "Wire cápsula to read clipboard on `move_window_to_cursor`"
- "Add new allowed origin so shell can fetch from staging"
- "Why does pill window flicker on Windows?"
- "Tighten capability scope on `run_shell`"
- "Cápsula transparent on macOS but solid on Linux — debug"
- "Move all `invoke(...)` calls out of shared composer"
- "Add new `cu_*` capability for scrolling"
- "Why is desktop pill different from browser pill?" (see ADR-0004)
- "Make desktop pill use shared `<Pill>` component" ← reject, explain ADR-0004
- "Is the pubkey pinned?" → yes (verified 2026-05-12)

---

## Reference

- ADR-0001 — three pillars (Composer is shared work surface)
- ADR-0004 — Capsule shared / Pill divergent (authoritative)
- ADR-0006 — deprecation status (pubkey verified pinned)
- `/CLAUDE.md` — universal doctrine
- `/README.md` § "Layout", § "Releases"
- `/docs/OPERATIONS.md`
- `/docs/SECURITY_AUDIT.md` (operator-driven walk)
- `/docs/canon/COMPOSER_SURFACE_SPEC.md` — capabilities matrix authoritative
- `apps/desktop/src-tauri/capabilities/default.json`
- `apps/desktop/src-tauri/src/lib.rs` — command source
- `apps/desktop/src-tauri/tauri.conf.json` — pubkey pinned (248 chars)
- `backend/test_computer_use_tool.py` — `cu_*` test
- `packages/composer/src/ComputerUseGate.tsx` — gate UI
- Companion skills: `gauntlet-design-system`, `gauntlet-backend-spine`, `gauntlet-release-discipline`

When skill conflicts with `/CLAUDE.md`, ADRs, or actual code on main: **code wins**.

## Changelog

- **v1.0** (initial pack) — claimed pubkey not pinned. **Incorrect**.
- **v1.1** — kept the v1.0 claim. **Still incorrect**.
- **v1.2** (this version) — verified pubkey IS pinned on main at 2026-05-12. Skill corrected. ADR-0006 updated alongside.
