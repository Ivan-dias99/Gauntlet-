import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.GAUNTLET_BACKEND_URL ?? "http://127.0.0.1:3002";
  return {
    plugins: [react()],
    server: {
      // Bridge to the Python backend (backend/). The UI calls apiUrl(path)
      // from control-center/lib/, which resolves to /api/gauntlet/*.
      // Setting VITE_GAUNTLET_API_BASE overrides this proxy with a direct
      // URL — in that case the browser talks to the backend directly
      // (CORS must allow the dev origin).
      proxy: {
        "/api/gauntlet": {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/gauntlet/, ""),
        },
      },
    },
  };
});
