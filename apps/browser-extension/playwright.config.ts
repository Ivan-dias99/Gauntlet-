// Playwright config — Sprint 8 smoke scaffold for the browser extension.
//
// Doctrine: extension testing is its own special kind of pain — you load
// an unpacked build into a real Chromium with --disable-extensions-except
// and --load-extension flags, then drive a normal page that the content
// script attaches to. Playwright's persistentContext is the right primitive.
//
// To run locally:
//
//   cd apps/browser-extension
//   npm i -D @playwright/test            # if not already installed
//   npx playwright install chromium      # one-time browser pull
//   npm run build                        # produce .output/chrome-mv3
//   npx playwright test                  # uses this config
//
// Tests live in tests/e2e/. The first one (capsule.spec.ts) verifies
// that loading the extension into a real Chromium and pressing
// Ctrl+Shift+Space on a regular page mounts the cápsula in the page's
// shadow root. That single signal protects against the most common
// regression — content script not injected — without trying to assert
// the full streaming flow (which depends on a running backend).

import { defineConfig } from "@playwright/test";
import { resolve } from "node:path";

const EXTENSION_PATH = resolve(__dirname, ".output", "chrome-mv3");

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,            // single Chromium instance per run
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,                      // extensions can't share a context
  reporter: process.env.CI ? "github" : "list",
  use: {
    headless: false,               // extensions need a real GUI in MV3
    baseURL: "https://example.com",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium-extension",
      use: {
        // launchOptions consumed by tests via the chromium.launchPersistentContext
        // helper. We surface them here so the recipe is in one place.
        launchOptions: {
          args: [
            `--disable-extensions-except=${EXTENSION_PATH}`,
            `--load-extension=${EXTENSION_PATH}`,
            "--no-first-run",
            "--no-default-browser-check",
          ],
        },
      },
    },
  ],
});
