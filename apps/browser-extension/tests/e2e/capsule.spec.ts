// Sprint 8 smoke — verifies the extension loads + the cápsula can mount.
//
// Why this spec exists:
//   * Catches the "content script not injected" regression — if the
//     content script doesn't run, the cápsula host element never appears.
//   * Catches the "shadow root not attached" regression — the host
//     element exists but has no shadow root means createShadowRootUi
//     broke.
//   * Catches the "manifest invalid" regression — Chromium would refuse
//     to load the extension at all, the test fails immediately.
//
// What this spec does NOT cover (would need a running backend):
//   * Any /composer/* request flow
//   * Streaming compose responses
//   * DOM action execution against a real page
// Those land in a follow-up suite once we can run a mock backend in CI.

import { chromium, expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";

const EXTENSION_PATH = resolve(__dirname, "..", "..", ".output", "chrome-mv3");

test("loads extension and mounts capsule on summon", async () => {
  // launchPersistentContext is the only Playwright surface that supports
  // Chromium extensions. We give it a fresh user-data dir per test so
  // pill prefs and dismissed domains don't leak across runs.
  const userDataDir = mkdtempSync(`${tmpdir()}/gauntlet-pw-`);
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      "--no-first-run",
      "--no-default-browser-check",
    ],
  });

  try {
    const page = await context.newPage();
    await page.goto("https://example.com");

    // The content script mounts a shadow host with id #gauntlet-capsule-host.
    // Wait for it to attach (extension load time + content script kick-off
    // can be a couple hundred ms on a cold profile).
    const host = page.locator("#gauntlet-capsule-host");
    await expect(host).toHaveCount(1, { timeout: 5000 });

    // Press the global shortcut. WXT registers Ctrl+Shift+Space on
    // Linux/Windows and Cmd+Shift+Space on macOS. Playwright's
    // keyboard.press uses the same modifier names.
    await page.keyboard.press("Control+Shift+Space");

    // After summon, the cápsula should render its dialog inside the
    // shadow root. We can't address shadow children with the regular
    // locator API, but evaluate() reaches in.
    const capsuleMounted = await page.evaluate(() => {
      const host = document.getElementById("gauntlet-capsule-host");
      const root = host?.shadowRoot;
      return Boolean(root?.querySelector(".gauntlet-capsule"));
    });
    expect(capsuleMounted).toBe(true);
  } finally {
    await context.close();
  }
});
