import { defineConfig } from "vitest/config";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    // Default environment for pure TS tests (spine logic)
    environment: "node",
    include: [
      "src/**/__tests__/**/*.test.ts",
      "src/**/__tests__/**/*.test.tsx",
      "tests/**/*.test.ts",
    ],
    globals: true,
    environmentMatchGlobs: [
      // Component render tests need DOM
      ["src/**/__tests__/**/*.render.test.tsx", "jsdom"],
    ],
    setupFiles: [],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
