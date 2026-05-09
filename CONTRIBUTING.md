# Contributing to Gauntlet

Thanks for considering a contribution. This file is the short version
of the doctrine in `CLAUDE.md` — read both before opening a PR if you
plan to touch composer/backend logic.

## Doutrina (the part that matters)

* **Capsule doctrine.** `packages/composer/src/Capsule.tsx` is the
  cursor-tip surface. It must shrink, never grow — Wave 2 target is
  ≤ 800 lines. CI enforces a descending budget; new features extract
  into hooks (`useCapsuleScreenshot`, `useCapsuleKeyboard`, …) or
  sub-components (`CommandPalette`, `SettingsDrawer`, `PlanRenderer`,
  …), they don't fatten Capsule.
* **Composer denso, backend gordo.** All model routing, tools,
  memory, and execution live in `backend/`. The frontend talks to
  `model_gateway` only — never directly to Anthropic / OpenAI / Groq.
* **Canonical names.** `GAUNTLET_*` env vars, `/api/gauntlet/*`
  routes, `gauntlet:*` storage keys. Legacy `SIGNAL_*` / `RUBERRA_*`
  are read-only fallbacks scheduled for removal in v1.1.0.
* **Refusal over risk.** When in doubt between an action and a text
  answer, prefer the text. The cápsula is the single shape that
  survives a future MCP migration; protect that shape.

## Local setup

```bash
git clone https://github.com/Ivan-dias99/Aiinterfaceshelldesign.git
cd Aiinterfaceshelldesign
npm ci                          # frontend monorepo
cd backend && pip install -r requirements.txt && cd ..
```

Run the backend in mock mode for local dev (no Anthropic key needed):

```bash
cd backend
GAUNTLET_MOCK=1 GAUNTLET_AUTH_DISABLED=1 python server.py
```

`GAUNTLET_AUTH_DISABLED=1` is the explicit dev opt-out — production
fails closed if `GAUNTLET_API_KEY` is empty (see `SECURITY.md`).

## Tests + checks before opening a PR

```bash
npm run typecheck                                  # workspace TS
npm run test --workspace=@gauntlet/composer        # composer suite
cd apps/desktop && npx tsc --noEmit && cd ../..    # desktop shell
cd apps/desktop/src-tauri && cargo test --tests    # Rust smoke
cd backend && pytest -q                            # backend suite
```

CI replays all four; passing locally avoids round-trips.

## Branches

Develop on `claude/<topic>` branches. `main` is the default base. PRs
that touch `release.yml`, `auth.py`, or `apps/desktop/src-tauri/`
will auto-request the maintainer via `CODEOWNERS`.

## Releases

Triggered ONLY by pushing a `vX.Y.Z` tag. The release workflow:

1. Asserts the Tauri updater pubkey is set (refuses to ship an
   unsigned build).
2. Builds the desktop bundles (Linux / Windows / macOS universal).
3. Builds the browser extension zips.
4. Runs the backend suite.
5. Uploads everything + `latest.json` for auto-update.

Do NOT push `v*` tags casually. The audit (v1 polish) flagged
restricted-tag-push as a P1; until a branch ruleset is in place, the
maintainer is the de-facto gate.

## Reporting security issues

See `SECURITY.md`. Use a private channel — do not file public issues
for vulns.

## License

By contributing you agree your changes ship under the same license as
the rest of the repo.
