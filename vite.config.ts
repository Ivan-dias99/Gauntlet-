import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf-8"),
) as { version?: string };
const APP_VERSION = typeof pkg.version === "string" ? pkg.version : "dev";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Env precedence: SIGNAL_BACKEND_URL (preferred) → RUBERRA_BACKEND_URL
  // (legacy, honored during the Wave-0 → Wave-8 compatibility window).
  const backendUrl =
    env.SIGNAL_BACKEND_URL ??
    env.RUBERRA_BACKEND_URL ??
    "http://127.0.0.1:3002";
  return {
    plugins: [react()],
    define: {
      // Surfaced to the studio status bar (src/composer/shell/StatusBar.tsx).
      // JSON.stringify so the value lands as a string literal in the bundle.
      __APP_VERSION__: JSON.stringify(APP_VERSION),
    },
    server: {
      // Bridge to the Python backend (signal-backend/).
      //
      // The UI calls apiUrl(path) from src/lib/signalApi. By default that
      // resolves to /api/signal/* and hits the first proxy below. The
      // /api/ruberra/* proxy is kept as a legacy alias during compat.
      // Setting VITE_SIGNAL_API_BASE (or legacy VITE_RUBERRA_API_BASE)
      // overrides the default with a direct URL — in that case these
      // proxies are BYPASSED and the browser talks to the backend
      // directly (CORS must allow the dev origin). Use the proxy for
      // same-origin dev; use the override only for testing against a
      // remote backend.
      proxy: {
        "/api/signal": {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/signal/, ""),
        },
        "/api/ruberra": {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/ruberra/, ""),
        },
      },
    },
  };
});
