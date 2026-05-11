---
name: gauntlet-release-discipline
description: Sovereign release law for the Gauntlet product. Use whenever the user is tagging a version, bumping versions across shells, editing CHANGELOG.md, modifying CI workflows under .github/workflows/, deploying to Vercel / Railway / Fly / Render, building Chrome / Firefox extension artifacts, building Tauri installers (.msi, .dmg, .AppImage, .deb), removing legacy fallbacks (SIGNAL_*, RUBERRA_*, signal:*, ruberra:*, /api/signal/*, /api/ruberra/*), walking docs/SECURITY_AUDIT.md, or planning the v1.0.0 cutover and the v1.1.0 legacy-removal cutover. Trigger this skill whenever a version string changes in any package.json, pyproject.toml, Cargo.toml, manifest.json, or tauri.conf.json; whenever a CHANGELOG entry is added; whenever a v* git tag is mentioned; whenever the conversation involves deprecation timing, backward-compatibility windows, signing keys, updater pubkey, or release artifacts. This skill enforces main-is-canon (no release tagged from a non-main branch), the version-bump-everywhere-or-nowhere rule (all shells move together — note: not currently CI-enforced; this is open work and the repo currently has drift), the pre-tag SECURITY_AUDIT walk for v1.0.0+, the deprecation timeline (SIGNAL_*/RUBERRA_* removed in v1.1.0, no extension without explicit decision), the signed-artifact obligation (no public desktop release without pinned updater pubkey + CI-signed binary; pubkey is currently pinned ✓), and the visual canon gate (no release without honoring the Aether label set — voice ban-list lint must pass). It composes with — and does not replace — gauntlet-design-system, gauntlet-backend-spine, gauntlet-tauri-shell, and CLAUDE.md.
---

# Gauntlet Release Discipline

This skill is the local constitution for release work in the Gauntlet repository. It does not re-teach semver; it does not re-litigate CI patterns Claude already knows. It encodes what is **specific to this product's release timeline** — the canonical-branch law, the multi-shell coordination, the deprecation cutover, the pre-tag audit walk, the visual canon gate, and the closure shape a release has to take before it is real.

A release is not green CI. A release is a signed, audited, multi-shell-coherent state of `main` that has survived the deprecation contract and the visual canon gate. Read this skill in full whenever you touch versioning, CI, deploys, or the legacy-fallback boundary. Most of the rules exist because branch forests, partial bumps, and unsigned binaries have already cost time or trust.

---

## When to use this skill

Trigger this skill whenever any of these are true:

- A version string is being changed in any of: `package.json` (any workspace), `backend/pyproject.toml`, `apps/desktop/src-tauri/Cargo.toml`, `apps/desktop/src-tauri/tauri.conf.json`, browser-extension manifest, `control-center/package.json`.
- `CHANGELOG.md` is being edited.
- A git tag matching `v*` is being mentioned, planned, or pushed.
- A workflow under `.github/workflows/` is being modified — especially `release.yml` or `ci.yml`.
- The conversation involves deprecating, removing, or extending the timeline for `SIGNAL_*`, `RUBERRA_*`, `signal:*`, `ruberra:*`, `/api/signal/*`, `/api/ruberra/*`, or any of the legacy folder names (`signal-backend/`, `chambers/`, `_legacy/`).
- The user mentions Vercel, Railway, Fly, Render, Chrome Web Store, Firefox AMO, Tauri signing, updater pubkey, notarization, or release artifacts.
- The user is walking `docs/SECURITY_AUDIT.md` or `docs/OPERATIONS.md` for cutover/rollback.
- The conversation is about the v1.0.0 cutover or the v1.1.0 legacy-removal cutover specifically.

When you trigger, **also obey `/CLAUDE.md`** for universal doutrina. Load any of the territory skills (`gauntlet-design-system`, `gauntlet-backend-spine`, `gauntlet-tauri-shell`) if the release work crosses into their domain.

## When NOT to use this skill

- Day-to-day code changes that do not affect a release artifact, env var canon, or the deprecation surface — those are the territory skills.
- Documentation-only edits that do not change a release gate.
- Local dev workflow questions that do not produce a published artifact.

If a change is "not yet a release but will become one", the right move is to load this skill *now* — releases are easier to discipline at the diff level than at the tag level.

---

## How this skill composes with others

| Concern | Owner | What this skill adds |
|---|---|---|
| Universal doutrina | `/CLAUDE.md` | Always-on. Not duplicated. |
| Aether visual canon, canonical labels, voice ban-list | `gauntlet-design-system` | This skill **gates** release on canon compliance (voice lint passes). |
| Backend canonical naming on write (`GAUNTLET_*`) | `gauntlet-backend-spine` | This skill owns the **timeline** for removing `SIGNAL_*` / `RUBERRA_*`. |
| UI canonical naming on write (`gauntlet:*`) | `gauntlet-design-system` | This skill owns the **timeline** for removing `signal:*` / `ruberra:*`. |
| Tauri signing, updater pubkey, capability allowlist | `gauntlet-tauri-shell` | This skill owns the **gate**: no public release without pubkey (currently pinned ✓). |

Conflict-resolution rule: if a territory skill says "you may still write to `signal:*` for now" and this skill says "removed in v1.1.0", both are right at different versions. The territory skill describes the migration window; this skill describes the timeline that ends it.

---

## Product law (release lens)

### 1. Main is canon

Every release tag is cut from `main` — never from a feature branch, a release branch, an RC branch, or a fork. If `main` does not contain the state to release, the state is not ready. Branches are temporary; main is truth.

This is the cleanest possible expression of the Ruberra law "repo truth beats narrative". A "release branch" is narrative; the commit hash on main is truth.

### 2. Version-bump everywhere or nowhere

Gauntlet has multiple shells with their own version strings:

- `package.json` (root workspace)
- `packages/composer/package.json` (shared composer)
- `apps/browser-extension/package.json` and the manifest version
- `apps/desktop/package.json`, `apps/desktop/src-tauri/Cargo.toml`, `apps/desktop/src-tauri/tauri.conf.json`
- `control-center/package.json` (if present and versioned separately)
- `backend/pyproject.toml`

For any release, **all of them move together**, or none of them do. A partial bump produces a state where the browser cápsula reports v1.0.0 and the desktop cápsula reports v0.9.3 — the dual-shell parity law (`gauntlet-design-system`) is broken at runtime.

**Open work, current state**: there is an active partial-bump on main right now — `apps/browser-extension/` is at `1.0.2` while the rest is at `1.0.1`. CI does **not** currently grep for alignment. Add a `version-align` step to `ci.yml` as part of the next release-prep pass (see "Closure check" below for the pseudo-script).

### 3. Deprecation timeline is law, not preference

The contract is fixed:

- **Now (between v1.0.0-rc.1 and v1.1.0)**: `/api/signal/*` and `/api/ruberra/*` were deleted from the canonical backend in v1.0.0-rc.1, but legacy aliases live in `api/signal.ts` and `api/ruberra.ts` (Vercel edge forwarders) so old install bases keep working. `SIGNAL_*`, `RUBERRA_*`, `signal:*`, `ruberra:*` are read-only fallback with deprecation warning. New code writes only canonical.
- **v1.0.0**: cutover. Public release. Same fallback rules. Updater pubkey pinned (it is).
- **v1.1.0**: **legacy fallback removed**. Reading `SIGNAL_*` returns nothing. Reading `signal:*` returns nothing. The Vercel `api/signal.ts` and `api/ruberra.ts` aliases are deleted. Code that depended on the fallback breaks.

The window between v1.0.0 and v1.1.0 exists so that operators can migrate. Extending it requires explicit operator decision and `CHANGELOG.md` entry. Shortening it without warning is a regression.

### 4. Signed-or-internal

A binary that is not signed is not a release. It is an internal artifact. Public distribution requires:

- Tauri updater pubkey pinned in `tauri.conf.json` (✓ currently pinned — keep it that way).
- `TAURI_SIGNING_PRIVATE_KEY` set as a GitHub Secret (not in repo, not in `.env`, not in docs).
- Notarization credentials (macOS) set as GitHub Secret.
- `npm run tauri:build` runs in CI from `release.yml`, not on a developer laptop.

### 5. Visual canon is a release gate

A release does not ship with banned voice words leaking through, with non-Aether typefaces baked into the bundle, or with Capsule line-count over the budget. The `frontend` CI job already enforces the budget and voice lint. If they pass on the tag SHA, the canon is honored. If they fail, the tag is not ready.

---

## Release surfaces and where they go

| Surface | Build command | Deploy target | Versioned where |
|---|---|---|---|
| Control Center frontend | `npm run build` | Vercel | root or `control-center/` `package.json` |
| Vercel edge forwarders | (auto, part of Vercel deploy) | Vercel | `api/gauntlet.ts` (canonical), `api/signal.ts`, `api/ruberra.ts` (legacy aliases until v1.1.0) |
| Backend FastAPI | `pip install -r requirements.txt && python main.py` | Railway / Fly / Render / VM | `backend/pyproject.toml` |
| Browser extension (Chrome) | `npm run zip` (in `apps/browser-extension/`) | Chrome Web Store | manifest + `package.json` |
| Browser extension (Firefox) | `npm run zip:firefox` | Firefox AMO | same |
| Desktop Tauri | `npm run tauri:build` via CI `release.yml` | GitHub Release artifacts (`.msi`, `.dmg`, `.AppImage`, `.deb`) | `tauri.conf.json` + `Cargo.toml` + `package.json` |
| Shared composer | n/a (consumed by shells) | n/a | `packages/composer/package.json` |

Env var contracts at deploy time:

- **Vercel** must have `GAUNTLET_BACKEND_URL` pointing at the Railway/Fly/Render public backend URL. The edge forwarder (`api/gauntlet.ts`) uses it to forward `/api/gauntlet/*`.
- **Railway / backend host** must have `GAUNTLET_API_KEY`, `GAUNTLET_GROQ_API_KEY` (or whichever provider is active), and the security toggles per the 5-layer envelope (see `gauntlet-backend-spine`).
- **`VITE_GAUNTLET_BACKEND_URL`** is required for the browser-extension and desktop builds — these talk **directly** to the backend, not through the Vercel edge.
- **No legacy env names on production hosts.** If a deploy panel still has `SIGNAL_API_KEY`, migrate it before the next release.

---

## CI gates today (canonical inventory)

`.github/workflows/ci.yml` defines three jobs and the following gates. Knowing what is and isn't enforced prevents over- or under-trusting CI green.

### `frontend` job
- `npm ci`
- `npm run typecheck` (root)
- `npx tsc --noEmit` from `apps/desktop/` (stricter — `noUnusedLocals`, `noUnusedParameters`)
- `npm run build` with `VITE_GAUNTLET_BACKEND_URL` pinned
- `npm run test --workspace=@gauntlet/composer`
- `npm run check:voice` (voice ban-list lint — Aether canon gate)
- **Capsule size budget** (`BUDGET=778`) — fails if `Capsule.tsx` grows past it

### `backend` job
- Python 3.12, `pip install -r requirements.txt`, `pytest` and `pytest-asyncio`
- `pip-audit` (warn-only — does not block)
- `python -m compileall -q .` — syntax check across all `.py`
- Exhaustive module-import script — every module the runtime touches must import cleanly
- `pytest -q` with `GAUNTLET_MOCK=1 GAUNTLET_RATE_LIMIT_DISABLED=1`

### `desktop-smoke` job
- Rust toolchain + `Swatinem/rust-cache`
- Linux deps: `libwebkit2gtk-4.1-dev`, `libxdo-dev`, `libssl-dev`, etc.
- `cargo test --tests` in `apps/desktop/src-tauri`

### Gates NOT yet enforced (open work)
- **Version alignment across shells** — proposed CI step:
  ```bash
  versions=$(jq -r .version package.json packages/composer/package.json apps/browser-extension/package.json apps/desktop/package.json control-center/package.json 2>/dev/null | sort -u | wc -l)
  if [ "$versions" -gt 1 ]; then echo "::error::version drift across shells"; exit 1; fi
  ```
- **`pip-audit` blocking** (currently warn-only)
- **Generated Tauri schema files (`gen/`)** are committed but not validated — diff against `tauri.conf.json` not enforced

---

## The pre-tag walk (mandatory for v1.0.0+)

Before any tag `v1.0.0` or later is pushed, walk `docs/SECURITY_AUDIT.md` end to end. Every open critical must be either resolved or explicitly accepted by the canon owner with a written justification in the CHANGELOG.

**Status today**: previously the open critical was the unpinned Tauri updater pubkey. **It is now pinned.** Re-read `docs/SECURITY_AUDIT.md` before tagging to confirm no new open criticals appeared.

Pre-tag walk template:

1. Read `docs/SECURITY_AUDIT.md` top to bottom. List every item marked open / critical / high.
2. For each: resolved (link the commit), accepted (link the CHANGELOG line), or **block the tag**.
3. Run the closure check below.
4. Only then push the tag.

---

## Closure check (release)

A release is **not closed** until all of these are true. Verify each before pushing the `v*` tag.

1. **Main is canon.** `git rev-parse HEAD` matches `git rev-parse origin/main`. Branch is `main`. No uncommitted changes.
2. **CI green on the exact commit.** Not a similar commit. Not "should pass". The exact SHA being tagged.
3. **Versions aligned.** Manually (CI doesn't enforce this yet) verify every shell reports the same version. Use the pseudo-script in "Gates NOT yet enforced" above. **Known drift today: browser-extension `1.0.2` vs rest `1.0.1`. Resolve before any tag.**
4. **CHANGELOG updated.** This version has an entry. Entry lists what changed, what is deprecated, what is removed, what is broken. Convert `[Unreleased]` to the new version heading.
5. **Deprecation timeline honored.** If this is `v1.1.0` or later, legacy fallbacks are removed: `api/signal.ts` and `api/ruberra.ts` deleted; `SIGNAL_*` / `RUBERRA_*` reads stripped from `config.py`; `signal:*` / `ruberra:*` reads stripped from frontend storage migration code. If this is between `v1.0.0` and `v1.1.0`, fallbacks still read, write only canonical.
6. **No legacy writes in code.** `grep -rE "(SIGNAL_|RUBERRA_)" packages/ apps/ control-center/ backend/` returns no new write paths. Reads with deprecation warning are OK in the fallback window.
7. **Visual canon honored.** `npm run check:voice` passes on the tag SHA. No banned label leaking. Capsule budget honored. No new typefaces in the bundle (only Fraunces, Inter, JetBrains Mono — see `gauntlet-design-system`).
8. **Pre-tag walk done** (for `v1.0.0+`). Every open critical in `SECURITY_AUDIT.md` is resolved or accepted.
9. **Signing assets in place** (for desktop release). Updater pubkey pinned in `tauri.conf.json` (currently pinned ✓). `TAURI_SIGNING_PRIVATE_KEY` in GitHub Secrets. macOS notarization credentials in GitHub Secrets if Mac is included.
10. **Deploy env vars canonical** on every host. Vercel has `GAUNTLET_BACKEND_URL`. Backend host has `GAUNTLET_*` env vars. No `SIGNAL_*` / `RUBERRA_*` on production deploy panels.
11. **Tag pushed and workflow green.** `git tag vX.Y.Z && git push origin vX.Y.Z`. The `release.yml` workflow runs, builds, signs, attaches artifacts to the GitHub Release.
12. **Manual smoke on signed artifact.** Install the signed desktop binary on at least one OS. Load the browser extension from the published zip. Hit the deployed backend's `/health/ready` and confirm honest yes.
13. **Owned residue closed.** No `# TODO` or `# FIXME` in the CHANGELOG entry. No "we'll fix in a patch" written into the release notes.

If any check fails or was not run, the correct response is `não tenho evidência suficiente — não tagar`.

---

## Anti-patterns (reject on sight)

| Anti-pattern | Why it's wrong | Correct shape |
|---|---|---|
| Tag pushed from a non-main branch | Breaks main-is-canon | Merge to main first; tag from main |
| Bumping `apps/desktop/package.json` to v1.0.0 but leaving `apps/browser-extension/` at v0.9.3 | Partial bump; runtime parity broken | All shells together, or none |
| Removing `SIGNAL_*` fallback in v1.0.x | Deprecation timeline not yet at v1.1.0 | Wait for v1.1.0 cutover |
| Extending the deprecation window past v1.1.0 silently | Timeline is law | Explicit canon-owner decision + CHANGELOG entry |
| Tagging v1.0.0 with updater pubkey unpinned | RCE path via auto-updater | (Already resolved — keep pinned) |
| `TAURI_SIGNING_PRIVATE_KEY` in `.env`, repo, or pasted in Slack | Key leak | GitHub Secret only |
| Local `tauri:build` artifact uploaded to GitHub Release | Unsigned binary | Use CI workflow with the secret |
| Vercel deploy panel still has `SIGNAL_BACKEND_URL` | Legacy name on production | Migrate to `GAUNTLET_BACKEND_URL` before tag |
| Release branch lingering for weeks | Branch forest growth | Cut the tag from main; close the branch |
| "We'll fix in v1.0.1" written into CHANGELOG for v1.0.0 | Pre-shipped technical debt as marketing | Either fix before tag or accept explicitly with audit entry |
| CI green but on a similar commit, not the tagged commit | "Should pass" is not "did pass" | Re-run CI on the exact tag SHA |
| Hot-fix branch merged directly to v1.0.0 tag without going through main | Bypasses canon | Hotfix → main → re-tag (or tag a v1.0.1 from main) |
| Adding a new backend module without listing it in `ci.yml`'s exhaustive `mods` tuple | Syntax errors slip through CI | Append to the list in same PR (cross-listed in `gauntlet-backend-spine`) |
| Tagging while `npm run check:voice` is failing | Banned label leaking into release | Fix the copy; canon gate must pass |
| Tagging while Capsule.tsx exceeds budget | Capsule Law violated | Extract first; budget descends only |

---

## Example invocations (how a user might trigger this skill)

These should reliably load this skill:

- "Bump everything to v1.0.0-rc.2."
- "Walk the security audit so we can tag v1.0.0."
- "Remove the SIGNAL_* fallback — we're cutting v1.1.0."
- "Why is browser-extension at 1.0.2 and the rest at 1.0.1?"
- "Add a CI step that catches version drift."
- "Set up the Tauri signing key in GitHub Secrets."
- "Add Firefox AMO to the release workflow."
- "Migrate the Vercel env from SIGNAL_BACKEND_URL to GAUNTLET_BACKEND_URL."
- "Write the CHANGELOG entry for the v1.0.0 cutover."
- "Should we extend the deprecation window past v1.1.0?"
- "Tag v1.0.0-rc.2."

For any of these, the skill's job is to: (a) keep the cut on main, (b) keep all shells aligned, (c) honor the deprecation timeline, (d) gate on the pre-tag walk, (e) gate on the visual canon (voice lint, Capsule budget), (f) refuse to ship unsigned, (g) verify against the closure check before declaring the tag pushed.

---

## Reference

- Project doutrina: `/CLAUDE.md`.
- Public README: `/README.md` (§ "Releases" for the canonical-vs-legacy table, § "Deploy" for surface mapping).
- Operations runbook: `/docs/OPERATIONS.md` (boot · cutover · rollback · backup · deploy).
- Security audit: `/docs/SECURITY_AUDIT.md`.
- Composer canonical surface spec: `/docs/canon/COMPOSER_SURFACE_SPEC.md`.
- CI workflow: `.github/workflows/ci.yml`.
- Release workflow: `.github/workflows/release.yml`.
- CODEOWNERS: `.github/CODEOWNERS`.
- Dependabot: `.github/dependabot.yml`.
- Companion skills: `gauntlet-design-system` (`gauntlet:*` storage migration + visual canon), `gauntlet-backend-spine` (`GAUNTLET_*` env var migration), `gauntlet-tauri-shell` (signing assets, updater pubkey gate).

If something in this skill conflicts with `/CLAUDE.md` or with the actual code on main, the **code wins**. Repo truth beats narrative.
