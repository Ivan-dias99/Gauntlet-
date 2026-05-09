# Security Policy

Gauntlet is the AI cápsula at the cursor's tip. The desktop shell
controls the operator's mouse + keyboard via `cu_*` Tauri primitives;
the backend holds the model gateway + memory store. Both surfaces are
in scope.

## Supported Versions

| Version | Supported |
|---------|-----------|
| v1.x    | Yes       |
| < v1.0  | No        |

## Reporting a Vulnerability

**Please do NOT open a public GitHub issue for security findings.**

Email the maintainer at the address on the GitHub profile
(`https://github.com/Ivan-dias99`), or open a private security
advisory via GitHub:

  `https://github.com/Ivan-dias99/Aiinterfaceshelldesign/security/advisories/new`

Include:

* a description of the vulnerability and the impact (read auth bypass,
  RCE on the desktop shell, secret exfil from the backend, etc.);
* steps to reproduce or a proof-of-concept;
* the affected version (`v1.0.0`, `v1.0.1`, or a commit SHA on `main`);
* whether you would like a CVE coordinated.

We aim to acknowledge within 5 business days and ship a fix or
mitigation in a patch release within 30 days for high-severity
findings. Lower-severity issues land in the next minor release.

## Surfaces of particular interest

* **Auth gate** (`backend/auth.py`). Fail-closed by default; missing
  `GAUNTLET_API_KEY` without `GAUNTLET_AUTH_DISABLED=1` returns 503 on
  every gated route. Probe for any path that bypasses the gate.
* **CSP / CORS** (`backend/server.py`,
  `apps/desktop/src-tauri/tauri.conf.json`). CSP `connect-src` is
  pinned to the canonical Railway hostname; CORS regex matches
  `tauri://localhost` exactly and extension UUIDs only.
* **Computer-use commands** (`apps/desktop/src-tauri/src/lib.rs`).
  `cu_mouse_move`, `cu_mouse_click`, `cu_type`, `cu_press` drive the
  operator's input devices. `cu_assert_main_webview` rejects calls
  from any webview other than `main`; probe for ways to invoke from
  another webview / iframe / external page.
* **Shell allowlist** (`apps/desktop/src-tauri/src/lib.rs`). v1
  polish removed generic interpreters (npm, npx, node, python, pip)
  from the cápsula allowlist; the agent flow's separate allowlist
  in `backend/tools.py` still gates them behind
  `AGENT_ALLOW_CODE_EXEC`.
* **Updater pubkey** (`apps/desktop/src-tauri/tauri.conf.json` +
  `release.yml`). The release workflow refuses to ship an unsigned
  build (asserts pubkey is non-empty). If you find a way to bypass
  the assertion, that's a release-supply-chain finding — high
  priority.

## Out of scope

* Issues that require local access to a developer's already-trusted
  machine (e.g. you can run arbitrary code on the operator's box and
  thus invoke `cu_*` — yes, that is what `cu_*` exists for).
* Findings in dependencies (`anthropic`, `enigo`, `fastapi`, etc.)
  unless they are exploitable through Gauntlet's surface specifically.
* DoS / rate-limit exhaustion against the public probe routes
  `/health` + `/health/ready` (they are deliberately public).

## Hall of fame

Reporters who follow responsible disclosure are credited in
`CHANGELOG.md` for the release that ships the fix. Drop a note in
your report if you'd prefer a handle.
