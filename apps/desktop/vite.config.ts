import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

// Tauri reads from `dist/` by default and serves on a fixed port during
// dev. Match its expectations so `tauri dev` and `tauri build` find the
// frontend without extra config. Two HTML entries — one per Tauri window
// (main = cápsula, pill = resting surface).
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 5179,
    strictPort: true,
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: true,
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(fileURLToPath(new URL(".", import.meta.url)), "index.html"),
        pill: resolve(fileURLToPath(new URL(".", import.meta.url)), "pill.html"),
      },
    },
  },
  resolve: {
    alias: {
      // Single Composer — resolves @gauntlet/composer to the shared
      // package without needing npm workspaces. Mirrors the TS path
      // mapping in tsconfig.json.
      "@gauntlet/composer": fileURLToPath(
        new URL("../../packages/composer/src/index.ts", import.meta.url),
      ),
    },
  },
});
