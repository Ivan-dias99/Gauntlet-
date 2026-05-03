import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Env precedence: GAUNTLET_BACKEND_URL (canonical) → SIGNAL_BACKEND_URL
  // → RUBERRA_BACKEND_URL (older legacy).
  const backendUrl =
    env.GAUNTLET_BACKEND_URL ??
    env.SIGNAL_BACKEND_URL ??
    env.RUBERRA_BACKEND_URL ??
    "http://127.0.0.1:3002";
  return {
    plugins: [react()],
    server: {
      // Bridge to the Python backend (backend/).
      //
      // The UI calls apiUrl(path) from control-center/lib/. By default that
      // resolves to /api/gauntlet/* and hits the first proxy below. The
      // /api/signal/* and /api/ruberra/* proxies are kept as legacy aliases.
      // Setting VITE_GAUNTLET_API_BASE overrides the default with a direct
      // URL — in that case these proxies are BYPASSED and the browser talks
      // to the backend directly (CORS must allow the dev origin).
      proxy: {
        "/api/gauntlet": {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/gauntlet/, ""),
        },
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
