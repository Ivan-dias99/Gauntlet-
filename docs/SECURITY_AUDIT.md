# Gauntlet — Security audit checklist (v1.0.0-rc.1)

This is the manual checklist to run **before** tagging `v1.0.0`. Each
section is a guard the operator must walk through with eyes open. Items
marked `[automated]` already have test coverage; items marked `[manual]`
require a human to drive.

## 1. `run_shell` Tauri command (apps/desktop/src-tauri/src/lib.rs:493)

- [ ] **Env gate** — confirm `GAUNTLET_ALLOW_CODE_EXEC=1` is required;
      attempts without the env var return a typed error envelope
      (not silently allowed). [manual: Tauri dev session]
- [ ] **Allowlist** — verify every entry in the binary allowlist. Every
      command outside it must hard-reject with a clear message. [manual]
- [ ] **No stdin pipe** — confirm `Command::stdin(Stdio::null())` so a
      compromised cápsula cannot feed bytes into the spawned process. [grep]
- [ ] **Output cap** — stdout / stderr capped at 256 KiB; no
      unbounded buffer growth. [grep]
- [ ] **No shell expansion** — `Command::new(cmd).args(args)` is direct
      argv, never `bash -c "$cmd"`. [grep]
- [ ] **Working directory** — when `cwd` is supplied, confirm it is
      resolved + canonicalised before use; reject `..` traversal. [manual]

## 2. Filesystem commands (read_text_file_at / write_text_file_at)

- [ ] **Operator-driven only** — every read/write path was returned by
      `pick_file` / `pick_save_path` (the dialog is the consent gate).
      No backend tool can synthesise a path. [manual: agent loop trace]
- [ ] **Size caps** — `MAX_TEXT_BYTES` (1 MiB), `MAX_BINARY_BYTES`
      (4 MiB) enforced; head fragment + marker on overflow. [grep]
- [ ] **Symlink safety** — large symlinked files do not bypass the cap;
      follow + check size on the target. [manual]

## 3. Composer routes (`backend/composer.py`)

- [ ] **Body cap** — every POST honours `GAUNTLET_MAX_BODY_BYTES`
      (default 1 MiB). Test by POSTing a 2 MiB body → 413. [manual]
- [ ] **Rate limit** — `/composer/dom_plan_stream` rate-limited per
      IP / per API-key (when set). [automated: test_security.py]
- [ ] **Auth gate** — when `GAUNTLET_API_KEY` is set, every endpoint
      except `/health`, `/health/ready` requires `Bearer`. [automated]
- [ ] **Log redaction** — `GAUNTLET_LOG_REDACT=1` masks model API keys
      and Authorization headers in stdout / stderr. [automated]
- [ ] **Settings governance** — `/composer/settings` PUT requires
      schema-valid payload; corrupt JSON quarantined, not crashed.
      [automated: test_composer.py]

## 4. Compat window closed (v1.0.0-rc.1)

- [ ] No client / forwarder / env still references `SIGNAL_*` or
      `RUBERRA_*` outside CHANGELOG. `grep -ri 'SIGNAL_\|RUBERRA_' .`
      should only hit docs.
- [ ] `api/signal.ts` and `api/ruberra.ts` files removed.
- [ ] `LEGACY_UNREACHABLE_HEADER` exports gone from
      `control-center/lib/signalApi.ts`.

## 5. Updater chain (Tauri 2) — **HARD-BLOCKER for v1.0.0**

`tauri.conf.json` ships with `plugins.updater.pubkey: ""`. Until that field
holds the production public key, the installed app will accept **any**
payload served by the updater endpoint — a remote-code-execution vector.
Release builds are blocked in CI by the `assert updater pubkey is present`
step in `.github/workflows/release.yml`; do not bypass it.

### Recipe (one-time, ~10 min)

```bash
# 1. Generate the key pair locally. The CLI prompts for a password;
#    use a strong one and store it in your password manager.
cd apps/desktop
npx @tauri-apps/cli signer generate -w ~/.tauri/gauntlet.key

# 2. Show the public key (single line, base64).
cat ~/.tauri/gauntlet.key.pub

# 3. Paste the public key string into apps/desktop/src-tauri/tauri.conf.json
#    at plugins.updater.pubkey. Commit that change.

# 4. Show the private key (multi-line, base64-armoured).
cat ~/.tauri/gauntlet.key

# 5. In GitHub → repo Settings → Secrets and variables → Actions, add:
#      TAURI_SIGNING_PRIVATE_KEY            ← paste the private key contents
#      TAURI_SIGNING_PRIVATE_KEY_PASSWORD   ← paste the password from step 1
```

### Verification

- [ ] **Public key set** — `tauri.conf.json` `plugins.updater.pubkey`
      contains the production public key (NOT empty). The CI guard fails
      the build when empty. [automated: release.yml]
- [ ] **Private key in CI secret** — `TAURI_SIGNING_PRIVATE_KEY` /
      `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` are set as GitHub secrets,
      never committed. [manual: GitHub repo secrets page]
- [ ] **Endpoint reachable** — `https://github.com/.../releases/latest/download/latest.json`
      returns a valid latest.json after the first signed release. [manual]
- [ ] **Tampering rejected** — install a signed release, hand-edit the
      `latest.json` to point at a payload signed with a different key,
      confirm the updater refuses to apply it. [manual]

## 6. Browser extension

- [ ] **MV3 manifest** — `host_permissions` scoped to what the cápsula
      needs in production, not `<all_urls>` if avoidable. [manual]
- [ ] **Content script CSP** — shadow root injection works on pages
      with strict CSP (e.g. github.com, mail.google.com). [manual: walk]
- [ ] **Background fetch** — only the canonical `/api/gauntlet/*` is
      used; no chrome-extension origin leakage. [grep]

## 7. Production smoke

- [ ] Vercel deploy responds on `https://<host>/api/gauntlet/health`.
- [ ] Railway backend `https://<backend>/health/ready` returns 200.
- [ ] `POST /composer/context` from a deployed extension returns a
      typed snapshot end-to-end (no 503, no CORS). [manual]
- [ ] Telemetry: 24h after rollout, refusal rate + error rate are below
      the pre-cutover baseline. [manual: /runs/stats]

When every box is ticked, ship `v1.0.0` and tag the release.
