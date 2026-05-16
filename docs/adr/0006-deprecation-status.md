# ADR-0006 · Deprecation status · v1.0.0 cutover snapshot

**Status**: Accepted (retroactive)
**Date**: 2026-05-12
**Deciders**: Ivan Fernandes
**Tags**: release, naming, migration, doctrine
**Builds on**: ADR-0001 (three pillars supersedes earlier framings)

---

## Context

Gauntlet's canonical naming is `GAUNTLET_*`. The repo carried legacy aliases from earlier framings:

- `SIGNAL_*` env vars (from the "Signal" branding phase)
- `RUBERRA_*` env vars (from when Ruberra-as-parent overlapped with Ruberra-as-product)
- `signal:*` and `ruberra:*` storage keys (frontend)
- `/api/signal/*` and `/api/ruberra/*` routes (backend, served as Vercel edge aliases)
- Folder names `signal-backend/`, `chambers/`, `_legacy/`

**This ADR is a snapshot taken on 2026-05-12 reflecting what actually exists in main**, not what is planned. Earlier drafts of this ADR (and earlier versions of the `gauntlet-tauri-shell` skill) made claims about open blockers that were already resolved.

## Decision · current state of the deprecation timeline

### Legacy `SIGNAL_*` / `RUBERRA_*` env vars — essentially removed

Scan of main at commit `7ea3b20`:

```bash
grep -rE "SIGNAL_[A-Z_]+\s*=" backend/ packages/ apps/ control-center/
# → 1 line · backend/mock_client.py · in a docstring/comment, not an assignment

grep -rE "RUBERRA_[A-Z_]+\s*=" backend/ packages/ apps/ control-center/
# → 0 lines
```

Status: **migration substantially complete**. The 1 remaining mention is a comment in `mock_client.py` explaining that `GAUNTLET_MOCK=1` is canonical while `SIGNAL_MOCK=1` is honored as fallback. Comment is documentation of compatibility intent, not active legacy writing.

### Legacy `/api/signal/*` and `/api/ruberra/*` Vercel edge forwarders — already removed

Scan of `api/` folder:

```
api/
├── _forwarder.ts
└── gauntlet.ts
```

Only the canonical forwarder remains. `api/signal.ts` and `api/ruberra.ts` were deleted in earlier work. Legacy URLs returning `/api/signal/...` from old clients will hit 404, not silent failure.

Status: **cutover complete on these routes**. Anyone updating from older client versions has to switch to `/api/gauntlet/*` paths.

### Storage keys (`signal:*`, `ruberra:*`)

Frontend storage migration was scheduled earlier — verify current state by scanning shells for `chrome.storage.{local,sync}.{get,set}` calls. The skill `gauntlet-design-system` v1.1 § "Canonical naming" lists `gauntlet:*` as canonical with legacy keys as read-only fallback. Closure check on this: not formally verified by an audit pass this turn — operator can run `grep -rE "(signal|ruberra):" packages/composer/src/` to confirm.

### Tauri updater pubkey

Status check via direct file read on 2026-05-12:

```json
// apps/desktop/src-tauri/tauri.conf.json
{
  "updater": {
    "dialog": true,
    "pubkey": "dW50cnVzdGVkIGNvbW1lbnQ6IG1pbmlzaWduIHB1YmxpYyBrZXk6IDEwRTQ0NzY5N0JCNTQ1NjcKUldSblJiVjdhVWZrRU1tay9ibjlVNkRKa3gwcGx3MGp2M0Y4VUJYdkpsUnFDT0E5TWc3eXl4ZE0K"
  }
}
```

**Status: PINNED.** 248 chars base64-encoded minisign public key. The earlier `gauntlet-tauri-shell` skill v1.0 incorrectly stated the pubkey was not pinned. That claim was wrong. **The pubkey is pinned today.**

This ADR corrects the earlier mistake. The skill v1.1 (this pack) restates the correction.

## What changed since the earlier draft

The previous draft of this ADR (in the agentic-spine v1 pack) claimed three open blockers for v1.0.0:

| Claim in v1 draft | Reality on main (2026-05-12) |
|---|---|
| "Tauri updater pubkey NOT pinned" | **PINNED** · 248 chars base64 |
| "`/api/signal/*` and `/api/ruberra/*` forwarders still exist" | **REMOVED** · only `api/gauntlet.ts` and `api/_forwarder.ts` |
| "SIGNAL_* / RUBERRA_* writes still present in code" | **1 comment line · zero actual writes** |

The earlier claims came from an audit handed to me. That audit was stale relative to where the codebase actually was. Repo truth beats narrative.

## Remaining open items for v1.0.0 cutover

Even with the corrections above, there are **two real open items** that block public tag v1.0.0:

1. **Version drift unresolved**: `apps/browser-extension/package.json` is at `1.0.2` while the rest of the workspace is at `1.0.1`. CI does not currently gate on this. Manual resolution before next tag.

2. **Manual end-to-end validation pending**: 5 pytest suites + e2e Playwright + Control Center 9 pages + Tauri desktop are all unvalidated by the operator according to the audit. This is what `cowork-tester` agent + `/release-prep` command (in this pack) address.

`docs/SECURITY_AUDIT.md` walk: status unverified this turn. Operator runs through it pre-tag.

## Consequences

**Positive:**

- Doctrine now matches code. New contributors reading this ADR get accurate status, not stale claims.
- Two real items remain (version drift + manual validation) — both resolvable in operator-driven work, not blocking ADR cristallization.

**Negative:**

- Two previous claims must be unlearned by anyone who internalized them from the v1 draft. The skill `gauntlet-tauri-shell` v1.1 in this pack restates the correction.
- The migration cost of legacy alias removal was already paid — there's nothing left to deprecate in this round.

**Neutral:**

- A future v1.1.0 cutover may still need an ADR for whatever new deprecations land in that release. This ADR covers May 2026 state only.

## Alternatives considered

- **Leave the legacy fallback comment in `mock_client.py`**. Accepted: it's documentation, not active code. Removing it would mislead readers about the migration history.
- **Add CI step that fails if `SIGNAL_*` appears anywhere outside `mock_client.py`**. Rejected at this time: only 1 mention exists; the risk of regression is low; budget the CI complexity elsewhere.
- **Re-introduce `api/signal.ts` as 410 Gone with structured response**. Rejected: 404 is honest. Clients should have migrated.

## References

- `backend/config.py` — reads `GAUNTLET_*` env first
- `backend/mock_client.py` — single legacy reference (comment)
- `api/_forwarder.ts`, `api/gauntlet.ts` — canonical edge routes
- `apps/desktop/src-tauri/tauri.conf.json` — pubkey pinned
- `CHANGELOG.md` — documents each version's deprecation state
- `docs/SECURITY_AUDIT.md` — pre-tag walk required for v1.0.0+
- ADR-0001 — three pillars (canonical identity supersedes legacy framings)
- Skill `gauntlet-release-discipline` v1.1 — operational rules built on this ADR
- Skill `gauntlet-tauri-shell` v1.1 — corrects pubkey claim

## Notes

The current state on main (2026-05-12) is `1.0.0-rc.1` with the version drift noted above. Open operational items (also flagged in `gauntlet-release-discipline` skill):

1. Resolve `apps/browser-extension/` version drift (1.0.2 → 1.0.1, or bump everything else to 1.0.2)
2. SECURITY_AUDIT walk (operator-driven)
3. Manual end-to-end validation via `cowork-tester` agent

These are operational items tracked by the release discipline skill, not ADR-level decisions. This ADR cristalizes only the deprecation contract.
