import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.SIGNAL_BACKEND_URL ?? "http://127.0.0.1:3002";
  return {
    plugins: [react()],
    server: {
      // Bridge to the Python backend (signal-backend/). The UI calls
      // apiUrl(path) from src/lib/signalApi which resolves to /api/signal/*
      // and hits the proxy below. Setting VITE_SIGNAL_API_BASE overrides
      // the default with a direct URL — in that case this proxy is BYPASSED
      // and the browser talks to the backend directly (CORS must allow the
      // dev origin). Use the proxy for same-origin dev; use the override
      // only for testing against a remote backend.
      proxy: {
        "/api/signal": {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/signal/, ""),
        },
      },
    },
  };
});
