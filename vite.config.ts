import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.RUBERRA_BACKEND_URL ?? "http://127.0.0.1:3002";
  return {
    plugins: [react()],
    server: {
      // Bridge to the Python backend (ruberra-backend/).
      //
      // The UI calls apiUrl(path) from src/lib/ruberraApi. By default that
      // resolves to /api/ruberra/* and hits this proxy. Setting
      // VITE_RUBERRA_API_BASE overrides the default with a direct URL — in
      // that case this proxy is BYPASSED and the browser talks to the
      // backend directly (CORS must allow the dev origin). Use the proxy
      // for same-origin dev; use the override only for testing against a
      // remote backend.
      proxy: {
        "/api/ruberra": {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/ruberra/, ""),
        },
      },
    },
  };
});
