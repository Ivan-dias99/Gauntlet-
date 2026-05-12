---
name: gauntlet-release-discipline
description: Sovereign release law for the Gauntlet product (versions, tags, changelog discipline, deprecation cutovers, signing/notarization gates, distribution channels). Use whenever the user is preparing a tag, bumping versions across the monorepo (root, packages/composer, apps/browser-extension, apps/desktop, src-tauri/Cargo.toml, tauri.conf.json), drafting or editing CHANGELOG.md, walking through SECURITY_AUDIT.md as a pre-tag gate, discussing v1.0.0 cutover criteria, debating whether to retire or extend legacy aliases (SIGNAL_*, RUBERRA_* — substantially removed per ADR-0006, only 1 documentation comment remains), updating canonical naming (GAUNTLET_* env vars, gauntlet:* storage keys, /api/gauntlet/* routes — cutover complete), wiring or auditing release CI (.github/workflows/release.yml, the signing step, the artifact publishing), defining what counts as a “closed” release (the 5-condition closure check below — implementation landed, verifier checked, lead accepted, repo truth supports, owned residue closed), or considering a hotfix branch off a tag. Trigger whenever package.json version field is touched, Cargo.toml [package] version is touched, tauri.conf.json “version” is touched, anywhere SIGNAL_* / RUBERRA_* appears (essentially zero today — pending removal in v1.1.0 of the 1 doc comment), git tag is discussed, gh release is discussed, GitHub Actions release workflow is edited, code signing is discussed (TAURI_SIGNING_PRIVATE_KEY discipline — pubkey is PINNED today per ADR-0006), or the user asks “can we ship this?”. Composes with gauntlet-design-system (visual regression as release gate — Capsule.tsx within BUDGET=778; voice ban-list clean), gauntlet-backend-spine (provider precedence locked; gateway integrity verified), gauntlet-tauri-shell (signing assets present and verified — pubkey pinned), and references ADRs 0001, 0002, 0003, 0006.
---

# Gauntlet Release Discipline

Local constitution for shipping. Does not duplicate semver mechanics; encodes **what is specific to the Gauntlet product** — multi-package version coherence, the GAUNTLET_* canonical naming cutover discipline (largely complete), the SECURITY_AUDIT walk gate, and the 5-condition closure check.

Releases are **promises to users**. Visual regression, broken capability, silent legacy fallback, or unpinned signing key = breach of promise. Reject release if any closure check fails.

---

## When to use

- Preparing a tag (`git tag v1.0.0`, etc.)
- Bumping a version anywhere in the monorepo
- Editing `CHANGELOG.md`
- Walking `docs/SECURITY_AUDIT.md` as pre-tag gate
- Discussing v1.0.0 cutover
- Debating timing of legacy alias removal
- Editing `.github/workflows/release.yml`
- Code signing / notarization / installer artifacts
- User asks "can we ship?", "what's left for v1.0?", "how do we hotfix?"

Always also obey `/CLAUDE.md`. Loads `gauntlet-design-system` if change touches visual surface; `gauntlet-backend-spine` if change is backend; `gauntlet-tauri-shell` if desktop signing.

## When NOT to use

- Pure feature work, no version impact
- Doc-only edits unrelated to release
- Internal refactors with no user-visible change

---

## Product law

### 1. Canonical naming = `GAUNTLET_*` (ADR-0006)

The product is **Gauntlet**. Canonical naming is **`GAUNTLET_*`** for env vars, **`gauntlet:*`** for storage keys, **`/api/gauntlet/*`** for routes.

Status of cutover (snapshot 2026-05-12):

| Surface | State | Detail |
|---|---|---|
| `SIGNAL_*` env vars | **Essentially removed** | 1 comment line in `backend/mock_client.py` documenting that `SIGNAL_MOCK=1` is fallback for `GAUNTLET_MOCK=1` |
| `RUBERRA_*` env vars | **Zero remaining** | No active writes anywhere in code |
| `/api/signal/*` route | **Removed** | `api/signal.ts` deleted; only `api/gauntlet.ts` + `api/_forwarder.ts` |
| `/api/ruberra/*` route | **Removed** | `api/ruberra.ts` deleted |
| `signal:*` / `ruberra:*` storage keys | Not formally re-audited | Operator scans `packages/composer/src/` for legacy `chrome.storage.{local,sync}` keys if needed |

**v1.1.0 cutover for the 1 remaining comment line**: remove the docstring reference in `mock_client.py` once `GAUNTLET_MOCK=1` has been the primary path for ≥2 minor versions. Until then, the comment is documentation, not active legacy.

### 2. Multi-package version coherence

Monorepo has 6 places that carry a version. They must all agree on tag day:

```
package.json                                     1.0.1   ← root
packages/composer/package.json                   1.0.1
apps/browser-extension/package.json              1.0.2   ◀── DRIFT (2026-05-12)
apps/desktop/package.json                        1.0.1
apps/desktop/src-tauri/Cargo.toml                1.0.1
apps/desktop/src-tauri/tauri.conf.json           1.0.1
```

control-center has no package.json (single-app inside the workspace); backend has no pyproject.toml (uses `requirements.txt`).

**Status (2026-05-12)**: 5/6 at 1.0.1, but `apps/browser-extension/` at 1.0.2 — version drift. This blocks tag v1.0.0 unless resolved.

**Resolution options** (operator decides):
- Bump everything else to 1.0.2 (more recent semantic state)
- Bump browser-extension back to 1.0.1 (rollback to align with rest)

Either fix lands before tag.

### 3. SECURITY_AUDIT walk is mandatory pre-tag

`docs/SECURITY_AUDIT.md` is the walk required before any public tag (≥ v1.0.0). Status as of 2026-05-12: **not verified this turn — operator-driven walk pending**.

The walk covers:
- API key handling (env vars only, never in code; redacted in logs via `log_redaction.py`)
- Rate limit configuration (`rate_limit.py`)
- Security headers (`security_headers.py`)
- Body size caps
- Provider SDK leak check (`grep -rE "^(from anthropic|from groq|...)" backend/`)
- Signing key not in repo (`grep -rE "PRIVATE KEY|BEGIN OPENSSH" .`)
- Updater pubkey pinned (it is — ADR-0006)
- Computer use surface review (highest-risk; `cu_*` commands have ComputerUseGate path)

### 4. Tauri updater pubkey IS pinned (ADR-0006)

Verified 2026-05-12 in `apps/desktop/src-tauri/tauri.conf.json`: pubkey is 248 chars base64 minisign public key.

Earlier audit draft incorrectly stated "not pinned". That was wrong. The skill `gauntlet-tauri-shell` v1.2 and ADR-0006 both correct this.

Release CI may now proceed with signed Tauri builds without further pubkey work.

### 5. Closure check (5 conditions)

A release is **not closed** until all five conditions are simultaneously true:

```
1. implementation landed       → tag points to a commit; code compiles; CI green
2. verifier checked             → cowork-tester agent ran pytest + e2e + manual walk
3. lead accepted                → operator (Ivan) acknowledged
4. repo truth supports          → grep checks pass; version drift resolved
5. owned residue closed          → no TODO/FIXME stub; no debug println
```

Anything weaker is not closure. Don't tag.

---

## Open items for v1.0.0

```
RESOLVED                                      OPEN
────────────                                  ──────────
✓  Updater pubkey pinned                       ◐ Version drift (1.0.2 vs 1.0.1)
✓  Legacy /api/signal/* removed                ◐ SECURITY_AUDIT walk (operator)
✓  Legacy /api/ruberra/* removed               ◐ Manual e2e validation:
✓  SIGNAL_* writes essentially zero             - 5 pytest suites
✓  RUBERRA_* writes zero                        - e2e Playwright
✓  Canonical /api/gauntlet/* live               - Control Center 9 pages
✓  ADRs 0001-0006 cristalized                   - Tauri desktop binary
✓  Capsule.tsx within BUDGET=778
✓  Aether v2 shipped (PRs #367 #368)
✓  Skills v1.2 corrected
```

When the 3 open items close, v1.0.0 ships.

---

## Architectural truth

```
.github/workflows/
  ci.yml                          ← Capsule BUDGET=778 + voice check + tests
  release.yml                     ← (when present) signed Tauri build + npm publish

CHANGELOG.md                      ← user-facing release notes (per version)
README.md (root)                  ← product description for users
SECURITY.md                       ← responsible disclosure policy
docs/SECURITY_AUDIT.md            ← internal pre-tag walk

apps/desktop/src-tauri/
  tauri.conf.json                 ← "version" + "pubkey" (pinned)
  Cargo.toml                      ← [package] version
```

Tag flow (operator):

```
1. resolve version drift → bump all to same version
2. update CHANGELOG.md → entry for new version
3. walk SECURITY_AUDIT.md → check each item
4. run cowork-tester agent → pytest + e2e + manual walk
5. git tag v1.0.0
6. git push origin v1.0.0
7. release.yml workflow signs binary, publishes
8. verify download links work
9. announce
```

---

## Anti-patterns (reject on sight)

| Anti-pattern | Correct shape |
|---|---|
| Bump only 1 of 6 version files | Bump all 6 atomically |
| Tag without CHANGELOG entry | Entry per version, in canonical format |
| Tag without SECURITY_AUDIT walk | Walk first, tag after |
| Hot-add `SIGNAL_*` "for backward compat" | Use `GAUNTLET_*`; fallback only via established documented patterns |
| Sign locally with private key | CI only, via GitHub Secret |
| "It works on my machine, ship it" | Closure check is the law; not vibes |
| Tag a commit ahead of main | Tag releases ship from main, not branches |
| Hotfix without ADR amendment | Hotfix that changes contract gets minor ADR amendment |
| Use "v1.0.0-rc.1" as the final v1.0.0 | rc tags are pre-releases; final tag is `v1.0.0` distinct |
| Force-push to tag | Tags are immutable; cut a new tag |

---

## Example invocations

- "Can we ship v1.0.0?" → check 3 open items (drift + audit + e2e)
- "How do I bump the version?" → bump all 6 places atomically; CI catches mismatch
- "What's the v1.1.0 plan?" → 1.1.0 removes the `SIGNAL_MOCK` doc comment (last legacy reference)
- "Hotfix needed for v1.0.0" → branch from tag, fix, cherry-pick to main, tag v1.0.1
- "Updater not pinned, right?" → it IS pinned today (ADR-0006); skill v1.0/v1.1 said otherwise — wrong
- "What checks before tag?" → 5-condition closure check; SECURITY_AUDIT walk

---

## Reference

- ADR-0001 — three pillars (release scope)
- ADR-0002 — gateway as catalogue (provider precedence locked)
- ADR-0003 — provider precedence (MOCK > Groq > Anthropic paused > Gemini paused)
- ADR-0006 — deprecation status (canonical naming + pubkey status)
- `/CLAUDE.md` — universal doctrine
- `/CHANGELOG.md` — version log (user-facing)
- `/docs/SECURITY_AUDIT.md` — pre-tag walk
- `/.github/workflows/ci.yml` — gate checks
- `/.github/workflows/release.yml` — signing + publish (when present)
- `/apps/desktop/src-tauri/tauri.conf.json` — pubkey pinned (verified)
- Companion skills: `gauntlet-design-system`, `gauntlet-backend-spine`, `gauntlet-tauri-shell`

When skill conflicts with `/CLAUDE.md`, ADRs, or actual code on main: **code wins**.

## Changelog

- **v1.0** (PR #369) — initial pack
- **v1.1** (this pack v1) — added 5-condition closure check, claimed pubkey not pinned (wrong)
- **v1.2** (this pack v2) — corrects pubkey claim; reflects legacy cleanup substantially complete; lists 3 real open items for v1.0.0
