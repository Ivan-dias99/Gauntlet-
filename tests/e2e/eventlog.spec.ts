// Ruberra — E2E: Event log continuity
// Proves events survive page reload via IndexedDB hydration.
// No mocks. Real browser IndexedDB. Real projection reconstruction.

import { test, expect } from "@playwright/test";

test.describe("event log continuity via IndexedDB hydration", () => {
  // Each test gets a fresh IndexedDB by clearing it at the start.
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Clear the IndexedDB so tests don't bleed into each other
    await page.evaluate(() =>
      new Promise<void>((resolve, reject) => {
        const req = indexedDB.deleteDatabase("ruberra");
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
        req.onblocked = () => resolve(); // still proceed
      }),
    );
    // Reload after clearing to get a fresh hydration
    await page.reload();
  });

  test("app loads without crash", async ({ page }) => {
    // Should show ritual entry (no repo bound yet)
    await expect(page.locator("text=RUBERRA").first()).toBeVisible();
  });

  test("binding a repo persists after reload", async ({ page }) => {
    // Fill ritual entry
    const input = page.locator('input[placeholder="bind repo identifier"]');
    await expect(input).toBeVisible();
    await input.fill("test-repo-persistence");
    await page.locator("button", { hasText: "Enter Chamber" }).click();

    // Should now be in the shell
    await expect(page.locator("text=test-repo-persistence")).toBeVisible();

    // Reload
    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    // Repo should still be bound (hydrated from IndexedDB)
    await expect(page.locator("text=test-repo-persistence")).toBeVisible({ timeout: 5000 });
  });

  test("opened thread persists after reload", async ({ page }) => {
    // Bind repo
    await page.locator('input[placeholder="bind repo identifier"]').fill("repo-thread-test");
    await page.locator("button", { hasText: "Enter Chamber" }).click();

    // First, frame mission (School) so we can open threads
    // Actually threads require repo only — let's open one directly
    const threadInput = page.locator('textarea[placeholder="state intent..."]');
    await expect(threadInput).toBeVisible();
    await threadInput.fill("verify thread persistence across reload");
    await page.locator("button", { hasText: "Open thread" }).click();

    // Thread should appear in thread strip
    await expect(page.locator("text=verify thread persistence across reload")).toBeVisible();

    // Reload
    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    // Thread must still be visible after reload
    await expect(page.locator("text=verify thread persistence across reload")).toBeVisible({ timeout: 5000 });
  });
});
