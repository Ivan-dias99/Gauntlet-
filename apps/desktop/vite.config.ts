import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Tauri reads from `dist/` by default and serves on a fixed port during
// dev. Match its expectations so `tauri dev` and `tauri build` find the
// frontend without extra config.
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
  },
});
