// Ruberra Operational Gate — full 16-step consequence-bearing gate
// Runs against the live backend (port 3001) + live Vite dev server (port 5173)
//
// Selectors grounded in the real embodied UI (v1.0.0-ruberra-core):
//   RitualEntry: placeholder="bind repo identifier", button="Enter Chamber"
//   ThreadStrip: textarea placeholder="state intent...", button="Open thread", items=.rb-thread
//   Shell topbar: .rb-topbar, .rb-repo, chamber glyph buttons with text Lab/School/Creation
//   Creation: textarea placeholder="what changes in the repo?...", scope/acceptance inputs,
//             button "Accept · Execute" (literal middle dot)
//   EventPulse: footer.rb-pulse showing <b>event.type</b> spans
//   Artifacts: panel heading "Artifacts — Review & Commit", items in ul.rb-list
//   Narrow-width: aria-label="Toggle threads panel" / "Toggle canon panel"
//
// Isolation: each test run uses browser.newContext() so IndexedDB starts fresh.
// This prevents leftover IDB state from a prior run causing bindRepo to skip
// the ritual (see: Inner's "already in shell" early return).

import { test, expect, Page, BrowserContext } from "@playwright/test";

const REPO = process.env.RUBERRA_GATE_REPO ?? "/home/user/Aiinterfaceshelldesign";
const BACKEND = "http://localhost:3001";
const FRONTEND = "http://localhost:5173";

// ── helpers ──────────────────────────────────────────────────────────────────

/** Wait past the "hydrating event log…" boot screen, then bind repo. */
async function bindRepo(page: Page, repoPath: string) {
  // Wait for hydration to finish: either the ritual input or the shell topbar appears
  await page.waitForFunction(
    () =>
      document.querySelector(".rb-ritual .rb-input") !== null ||
      document.querySelector(".rb-topbar") !== null,
    { timeout: 15000 },
  );

  // If already in shell (fresh context should not happen; defensive guard)
  if (await page.locator(".rb-topbar").isVisible()) return;

  const input = page.getByPlaceholder("bind repo identifier");
  await input.click();
  await input.fill(repoPath);

  // Explicitly wait for the button to become enabled before clicking.
  // React controlled-input fill must have triggered onChange and setName().
  const enterBtn = page.getByRole("button", { name: "Enter Chamber" });
  await expect(enterBtn).toBeEnabled({ timeout: 5000 });
  await enterBtn.click();

  // Shell (topbar) must appear after the async onClick resolves and React re-renders
  await expect(page.locator(".rb-topbar")).toBeVisible({ timeout: 15000 });
}

/** Open a thread by filling the intent textarea and clicking Open thread */
async function openThread(page: Page, intent: string) {
  const intentTextarea = page.getByPlaceholder("state intent...");
  await intentTextarea.fill(intent);
  await expect(page.getByRole("button", { name: "Open thread" })).toBeEnabled({ timeout: 3000 });
  await page.getByRole("button", { name: "Open thread" }).click();
  await expect(page.locator(".rb-thread").first()).toBeVisible({ timeout: 6000 });
}

// ── Gate Tests ────────────────────────────────────────────────────────────────

test.describe("Ruberra Operational Gate", () => {
  test.setTimeout(90000);

  // ── API layer (headless — no browser required) ────────────────────────────

  test("step-01: exec backend is reachable and healthy", async ({ request }) => {
    const res = await request.post(`${BACKEND}/git/verify`, {
      data: { repoPath: REPO },
    });
    expect(res.ok()).toBe(true);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(typeof body.branch).toBe("string");
    expect(body.branch.length).toBeGreaterThan(0);
  });

  test("step-02: frontend serves and EXEC_URL is injected into the bundle", async ({
    request,
  }) => {
    const html = await (await request.get(`${FRONTEND}/`)).text();
    expect(html).toContain("Ruberra");
    const module = await (
      await request.get(`${FRONTEND}/src/ruberra/chambers/Creation.tsx`)
    ).text();
    expect(module).toContain("VITE_RUBERRA_EXEC_URL");
    expect(module).toContain("http://localhost:3001/exec");
  });

  // ── Browser UI layer (requires Chromium) ─────────────────────────────────

  test.describe("UI gate", () => {
    let context: BrowserContext;
    let page: Page;

    test.beforeAll(async ({ browser }) => {
      // Fresh context = fresh IndexedDB = no leftover repo state from prior runs
      context = await browser.newContext();
      page = await context.newPage();

      // Surface console errors in test output for easier debugging
      page.on("console", (msg) => {
        if (msg.type() === "error") console.error(`[page:error] ${msg.text()}`);
      });

      await page.goto(FRONTEND);
    });

    test.afterAll(async () => {
      if (context) await context.close();
    });

    // Step 3: boot ritual
    test("step-03: boot ritual renders with repo bind input and Enter Chamber button", async () => {
      await page.waitForFunction(
        () =>
          document.querySelector(".rb-ritual .rb-input") !== null ||
          document.querySelector(".rb-topbar") !== null,
        { timeout: 15000 },
      );
      const inShell = await page.locator(".rb-topbar").isVisible();
      if (!inShell) {
        await expect(page.locator(".rb-ritual")).toBeVisible();
        await expect(page.getByPlaceholder("bind repo identifier")).toBeVisible();
        await expect(page.getByRole("button", { name: "Enter Chamber" })).toBeVisible();
      }
      await expect(page.getByText(/RUBERRA/)).toBeVisible({ timeout: 5000 });
    });

    // Step 4: repo bind + git-status chip
    test("step-04: repo bind succeeds; shell loads; git-status chip appears", async () => {
      await bindRepo(page, REPO);
      const repoShort = REPO.split("/").pop()!;
      await expect(page.locator(".rb-repo")).toContainText(repoShort, { timeout: 10000 });
      // Git status chip (· clean or · dirty) appears after async backend fetch
      const chip = page.locator(".rb-repo span");
      await expect(chip).toBeVisible({ timeout: 12000 });
      const chipText = await chip.textContent();
      expect(chipText).toMatch(/·\s*(clean|dirty)/);
    });

    // Step 5: open thread
    test("step-05: thread strip renders; intent textarea present; thread opens", async () => {
      await expect(page.locator(".rb-rail").first()).toBeVisible({ timeout: 5000 });
      await expect(page.getByPlaceholder("state intent...")).toBeVisible();
      await openThread(page, "operational gate: prove consequence");
      await expect(page.locator(".rb-thread").first()).toBeVisible({ timeout: 6000 });
    });

    // Step 6: directive composition form
    test("step-06: creation chamber shows all directive fields", async () => {
      await page.getByRole("button", { name: "Creation" }).click();
      await expect(page.locator(".rb-chamber h1")).toContainText("Creation");
      await expect(
        page.getByPlaceholder("what changes in the repo? (use no {{placeholders}})"),
      ).toBeVisible();
      await expect(
        page.getByPlaceholder("scope — file set, canon scope, or repo-wide"),
      ).toBeVisible();
      await expect(
        page.getByPlaceholder("acceptance criterion — how we know it is done"),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "reversible" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Accept · Execute" })).toBeDisabled();
    });

    // Step 7: accept guard
    test("step-07: Accept · Execute is disabled until text + scope + acceptance are filled", async () => {
      const acceptBtn = page.getByRole("button", { name: "Accept · Execute" });
      await expect(acceptBtn).toBeDisabled();

      await page
        .getByPlaceholder("what changes in the repo? (use no {{placeholders}})")
        .fill("audit sovereign spine types in the repo");
      await expect(acceptBtn).toBeDisabled();

      await page
        .getByPlaceholder("scope — file set, canon scope, or repo-wide")
        .fill("src/**/*.ts");
      await expect(acceptBtn).toBeDisabled();

      await page
        .getByPlaceholder("acceptance criterion — how we know it is done")
        .fill("all .ts files listed as artifacts");

      await expect(acceptBtn).toBeEnabled({ timeout: 3000 });
    });

    // Step 8: fires POST /exec
    test("step-08: Accept · Execute fires POST /exec with correct body", async () => {
      const execReqPromise = page.waitForRequest(
        (req) =>
          req.url().includes(":3001/exec") &&
          req.method() === "POST",
        { timeout: 10000 },
      );
      await page.getByRole("button", { name: "Accept · Execute" }).click();
      const execReq = await execReqPromise;
      const body = execReq.postDataJSON();
      expect(body.directive.scope).toBe("src/**/*.ts");
      expect(body.directive.text).toContain("audit");
    });

    // Step 9: execution events in EventPulse
    test("step-09: EventPulse shows execution.started and execution.succeeded", async () => {
      const pulse = page.locator("footer.rb-pulse");
      await expect(pulse).toBeVisible();
      await expect(pulse).toContainText("execution.started", { timeout: 12000 });
      await expect(pulse).toContainText("execution.succeeded", { timeout: 12000 });
    });

    // Step 10: real artifacts listed
    test("step-10: Artifacts panel renders real .ts file paths from git ls-files", async () => {
      const artifactsPanel = page
        .locator(".rb-panel")
        .filter({ hasText: "Artifacts — Review & Commit" });
      await expect(artifactsPanel).toBeVisible({ timeout: 10000 });
      const firstItem = artifactsPanel.locator("ul.rb-list li").first();
      await expect(firstItem).toBeVisible({ timeout: 10000 });
      const text = await firstItem.textContent();
      expect(text).toMatch(/\.ts|\.tsx/);
    });

    // Step 11: review artifact with reason via RuledPrompt
    test("step-11: Accept review opens RuledPrompt; submitting reason closes dialog", async () => {
      const artifactsPanel = page
        .locator(".rb-panel")
        .filter({ hasText: "Artifacts — Review & Commit" });
      const acceptBtn = artifactsPanel
        .getByRole("button", { name: "Accept" })
        .first();
      await expect(acceptBtn).toBeVisible({ timeout: 10000 });
      await acceptBtn.click();

      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 6000 });
      await page.getByRole("dialog").locator("input").fill("types confirmed correct");
      await page.getByRole("button", { name: "Submit" }).click();
      await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 6000 });
    });

    // Step 12: commit accepted artifact
    test("step-12: Commit button appears after acceptance; committed badge renders", async () => {
      const artifactsPanel = page
        .locator(".rb-panel")
        .filter({ hasText: "Artifacts — Review & Commit" });
      const commitBtn = artifactsPanel
        .getByRole("button", { name: "Commit" })
        .first();
      await expect(commitBtn).toBeVisible({ timeout: 6000 });
      await commitBtn.click();
      await expect(
        artifactsPanel.locator(".rb-badge.ok").filter({ hasText: "committed" }),
      ).toBeVisible({ timeout: 6000 });
    });

    // Steps 13 + 14: reload → IDB continuity
    test("step-13+14: reload preserves repo, thread, committed artifact, and truth-state", async () => {
      const repoShort = REPO.split("/").pop()!;
      await page.reload();
      await page.waitForLoadState("networkidle");

      // Hydration must complete
      await page.waitForFunction(
        () =>
          !document.querySelector(".rb-ritual p")?.textContent?.includes("hydrating"),
        { timeout: 15000 },
      );

      // Shell loads directly — repo was in IDB
      await expect(page.locator(".rb-topbar")).toBeVisible({ timeout: 12000 });
      await expect(page.locator(".rb-repo")).toContainText(repoShort, { timeout: 8000 });

      // Thread still in left rail
      await expect(page.locator(".rb-thread").first()).toBeVisible({ timeout: 6000 });

      // Navigate to Creation chamber — committed artifact persists
      await page.getByRole("button", { name: "Creation" }).click();
      const artifactsPanel = page
        .locator(".rb-panel")
        .filter({ hasText: "Artifacts — Review & Commit" });
      await expect(
        artifactsPanel.locator(".rb-badge.ok").filter({ hasText: "committed" }),
      ).toBeVisible({ timeout: 10000 });
    });

    // Step 15: degraded truth — zero-artifact scope triggers null.consequence
    // Note: .rb-thread divs have no onClick — activeThread is set via projection
    // from the thread.opened event that survives reload, so it is already active.
    test("step-15: zero-artifact scope emits null.consequence — no silent no-op", async () => {
      // Creation chamber is already active from step-13+14
      // Directive form should be visible (activeThread is set from IDB events)
      await expect(
        page.getByPlaceholder("what changes in the repo? (use no {{placeholders}})"),
      ).toBeVisible({ timeout: 6000 });

      await page
        .getByPlaceholder("what changes in the repo? (use no {{placeholders}})")
        .fill("test degraded path");
      await page
        .getByPlaceholder("scope — file set, canon scope, or repo-wide")
        .fill("__no_match_xyz___.abc");
      await page
        .getByPlaceholder("acceptance criterion — how we know it is done")
        .fill("null outcome recorded");

      await expect(
        page.getByRole("button", { name: "Accept · Execute" }),
      ).toBeEnabled({ timeout: 5000 });
      await page.getByRole("button", { name: "Accept · Execute" }).click();

      // null.consequence must appear in EventPulse — proves no silent no-op
      await expect(page.locator("footer.rb-pulse")).toContainText(
        "null.consequence",
        { timeout: 12000 },
      );
    });

    // Step 16: narrow-width drawer seal
    test("step-16: at 375px viewport, rail toggles open/close; Escape and backdrop seal", async () => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(400);

      await page.getByRole("button", { name: "Toggle threads panel" }).click();
      const leftRail = page.locator("aside.rb-rail:not(.rb-rail-right)");
      await expect(leftRail).toHaveClass(/rb-rail--open/, { timeout: 4000 });

      await page.keyboard.press("Escape");
      await expect(leftRail).not.toHaveClass(/rb-rail--open/, { timeout: 4000 });

      await page.getByRole("button", { name: "Toggle canon panel" }).click();
      const rightRail = page.locator("aside.rb-rail.rb-rail-right");
      await expect(rightRail).toHaveClass(/rb-rail--open/, { timeout: 4000 });

      const backdrop = page.locator(".rb-rail-backdrop");
      await backdrop.click({ position: { x: 10, y: 10 } });
      await expect(rightRail).not.toHaveClass(/rb-rail--open/, { timeout: 4000 });
    });
  });
});
