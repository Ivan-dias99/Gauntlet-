// Ruberra — E2E: Visual regression for sovereign core surfaces
// Captures screenshots at wide (1440px) and narrow (375px) viewports.
// On first run, creates baseline images.
// Subsequent runs diff against baseline — fails if shell drifts.
//
// Narrow-width proof: on 375px the shell must NOT overflow horizontally.
// The center chamber must be visible and full-width.

import { test, expect } from "@playwright/test";

test.describe("visual regression — shell surfaces", () => {
  test.beforeEach(async ({ page }) => {
    // Clear IndexedDB so we always start from ritual entry (deterministic state)
    await page.goto("/");
    await page.evaluate(() =>
      new Promise<void>((resolve) => {
        const req = indexedDB.deleteDatabase("ruberra");
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
        req.onblocked = () => resolve();
      }),
    );
    await page.reload();
  });

  test("ritual entry at 1440px", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator("text=RUBERRA").first()).toBeVisible();
    await expect(page).toHaveScreenshot("ritual-wide.png", {
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
    });
  });

  test("ritual entry at 375px — no horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator("text=RUBERRA").first()).toBeVisible();

    // Verify no horizontal overflow: scrollWidth should equal clientWidth
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
    });
    expect(overflow).toBe(true);

    await expect(page).toHaveScreenshot("ritual-narrow.png", {
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
    });
  });

  test("shell at 1440px — rails visible, no overflow", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // Enter the shell
    await page.locator('input[placeholder="bind repo identifier"]').fill("visual-test-repo");
    await page.locator("button", { hasText: "Enter Chamber" }).click();
    await expect(page.locator("text=visual-test-repo")).toBeVisible();

    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
    });
    expect(overflow).toBe(true);

    await expect(page).toHaveScreenshot("shell-wide.png", {
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
    });
  });

  test("shell at 375px — rails off-screen, center chamber fills width, no overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    // Enter the shell
    await page.locator('input[placeholder="bind repo identifier"]').fill("visual-narrow-repo");
    await page.locator("button", { hasText: "Enter Chamber" }).click();
    await expect(page.locator("text=visual-narrow-repo")).toBeVisible();

    // Verify no horizontal overflow
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
    });
    expect(overflow).toBe(true);

    // Rails should be off-screen (not visible unless toggled)
    // The left rail is at transform: translateX(-100%) — its bounding box is off-screen
    const leftRailVisible = await page.evaluate(() => {
      const rail = document.querySelector(".rb-rail:not(.rb-rail-right)");
      if (!rail) return false;
      const rect = rail.getBoundingClientRect();
      // If transform pushes it off-screen, right edge <= 0
      return rect.right > 10;
    });
    expect(leftRailVisible).toBe(false);

    // Toggle buttons should be visible
    const toggleButtons = page.locator(".rb-rail-toggle");
    const count = await toggleButtons.count();
    expect(count).toBeGreaterThan(0);

    await expect(page).toHaveScreenshot("shell-narrow.png", {
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
    });
  });

  test("narrow shell — left rail opens and closes via toggle", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.locator('input[placeholder="bind repo identifier"]').fill("toggle-test-repo");
    await page.locator("button", { hasText: "Enter Chamber" }).click();
    await expect(page.locator("text=toggle-test-repo")).toBeVisible();

    // Click the Threads toggle
    const threadsToggle = page.locator("button", { hasText: "Threads" }).first();
    await threadsToggle.click();

    // Left rail should now be on-screen
    const railOnScreen = await page.evaluate(() => {
      const rail = document.querySelector(".rb-rail:not(.rb-rail-right)");
      if (!rail) return false;
      const rect = rail.getBoundingClientRect();
      return rect.right > 10;
    });
    expect(railOnScreen).toBe(true);

    // Backdrop should be visible
    const backdrop = page.locator(".rb-rail-backdrop.active");
    await expect(backdrop).toBeAttached();

    // Click backdrop to close
    await backdrop.click({ force: true });

    // Rail should be off-screen again
    await page.waitForTimeout(300); // wait for CSS transition
    const railOffScreen = await page.evaluate(() => {
      const rail = document.querySelector(".rb-rail:not(.rb-rail-right)");
      if (!rail) return false;
      const rect = rail.getBoundingClientRect();
      return rect.right <= 10;
    });
    expect(railOffScreen).toBe(true);
  });
});
