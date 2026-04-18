import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";

function devApiPlugin(apiKey: string): Plugin {
  return {
    name: "dev-api-chat",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/chat", async (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405);
          res.end("Method Not Allowed");
          return;
        }

        if (!apiKey) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "ANTHROPIC_API_KEY not set in .env" }));
          return;
        }

        let body = "";
        req.on("data", (chunk: Buffer) => { body += chunk.toString(); });
        req.on("end", async () => {
          try {
            const { systemPrompt = "", messages = [] } = JSON.parse(body || "{}");

            const upstream = await fetch("https://api.anthropic.com/v1/messages", {
              method: "POST",
              headers: {
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
              },
              body: JSON.stringify({
                model: "claude-sonnet-4-6",
                max_tokens: 2048,
                system: systemPrompt,
                messages,
                stream: true,
              }),
            });

            if (!upstream.ok || !upstream.body) {
              const err = await upstream.text();
              res.writeHead(502, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: err }));
              return;
            }

            res.writeHead(200, {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
            });

            const reader = upstream.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() ?? "";

              for (const line of lines) {
                if (!line.startsWith("data: ")) continue;
                const data = line.slice(6).trim();
                if (data === "[DONE]") continue;
                try {
                  const event = JSON.parse(data);
                  if (
                    event.type === "content_block_delta" &&
                    event.delta?.type === "text_delta"
                  ) {
                    res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
                  }
                } catch {}
              }
            }

            res.write("data: [DONE]\n\n");
            res.end();
          } catch (e) {
            res.write(`data: ${JSON.stringify({ error: String(e) })}\n\n`);
            res.end();
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // loadEnv reads .env, .env.local, .env.[mode] etc. — populates apiKey in dev
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.RUBEIRA_BACKEND_URL ?? "http://127.0.0.1:3002";
  return {
    plugins: [react(), devApiPlugin(env.ANTHROPIC_API_KEY ?? "")],
    server: {
      // Bridge to the Python backend (rubeira-backend/).
      // UI calls /api/rubeira/route, /api/rubeira/dev, /api/rubeira/ask …
      // which get rewritten to /route, /dev, /ask on the FastAPI server.
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
