import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.RUBEIRA_BACKEND_URL ?? "http://127.0.0.1:3002";
  return {
    plugins: [react()],
    server: {
      // Bridge to the Python backend (rubeira-backend/).
      // UI calls /api/rubeira/{route,dev,ask,memory/...} — rewritten to /*
      // on the FastAPI server.
      proxy: {
        "/api/rubeira": {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/rubeira/, ""),
        },
      },
    },
  };
});
