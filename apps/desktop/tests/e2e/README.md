# Desktop E2E

Two layers of testing for the Tauri shell:

## 1. Smoke (unit) — `cargo test`

Lives in `apps/desktop/src-tauri/tests/smoke.rs`. Pure helpers: clamp
maths, anchor maths, locale catalogue. No window, no webview, no
network. Runs in seconds on CI without `xvfb` or a Tauri runtime.

```bash
cd apps/desktop/src-tauri
cargo test
```

## 2. Real E2E — `tauri-driver` (deferred)

A real "open the cápsula, click the pill, type a query, see the plan
stream" test needs a live Tauri runtime + WebDriver bridge. Tauri 2's
official tool is `tauri-driver` (https://v2.tauri.app/develop/tests/webdriver/).

Setup outline (do this once when we promote E2E from smoke to full):

1. **Install** `tauri-driver` and the platform-specific driver:
   - Linux: `sudo apt install webkit2gtk-driver`
   - Windows: `Microsoft Edge Driver`
   - macOS: not yet supported by tauri-driver (May 2026)
2. **Add** a `webdriver` dev-dependency in `src-tauri/Cargo.toml`.
3. **Write** a test under `tests/e2e/*.spec.ts` driven by Playwright
   or selenium-webdriver pointing at `http://localhost:4444`
   (tauri-driver default).
4. **Wire** the CI job: `xvfb-run cargo tauri dev &` then `tauri-driver`,
   then run the spec.

Why deferred: macOS coverage is missing and the matrix becomes uneven.
The smoke tests cover the regressions we've actually hit; we'll graduate
to full E2E when a behaviour-level regression slips through smoke.
