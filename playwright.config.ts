import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
    // Real IndexedDB is available in Chromium
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Start the Vite dev server before running tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    env: {
      VITE_RUBERRA_EXEC_URL: "http://localhost:3001/exec",
    },
  },
  snapshotDir: "./tests/e2e/__screenshots__",
});
