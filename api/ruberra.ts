// Vercel edge forwarder — proxies /api/ruberra/* to the Python backend
// (typically deployed on Railway). Mirrors the dev-mode vite proxy in
// vite.config.ts.
//
// Routing: this file is registered at /api/ruberra. All sub-paths
// (/api/ruberra/foo, /api/ruberra/foo/bar, …) reach it via the rewrite
// declared in vercel.json. Using a flat filename + explicit rewrite is more
// reliable than the [...path].ts catch-all convention, which silently drops
// multi-segment paths on standalone (non-Next.js) Vercel projects.
//
// Env:
//   RUBERRA_BACKEND_URL — base URL of the FastAPI instance (no trailing slash)
//
// Contract for "backend unreachable":
//   - status: 503
//   - header: x-ruberra-backend: unreachable
//   - body:   { error: "backend_unreachable", reason: "<short kind>" }
//
// This is the ONLY way the forwarder signals "backend offline". The frontend
// reads the header, not the error text. Every other non-2xx is a real upstream
// response and surfaces through the normal error path.

export const config = { runtime: "edge" };

const UNREACHABLE_HEADER = "x-ruberra-backend";
const UNREACHABLE_VALUE = "unreachable";

function unreachable(reason: string, status = 503): Response {
  return new Response(
    JSON.stringify({ error: "backend_unreachable", reason }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        [UNREACHABLE_HEADER]: UNREACHABLE_VALUE,
      },
    },
  );
}

export default async function handler(req: Request): Promise<Response> {
  const backend = process.env.RUBERRA_BACKEND_URL;
  if (!backend) return unreachable("backend_url_not_configured");

  const url = new URL(req.url);
  const tail = url.pathname.replace(/^\/api\/ruberra/, "");
  const target = backend.replace(/\/+$/, "") + tail + url.search;

  const init: RequestInit = {
    method: req.method,
    headers: new Headers(req.headers),
    body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
    // @ts-expect-error — required by the edge runtime when forwarding streams
    duplex: "half",
    redirect: "manual",
  };

  try {
    const upstream = await fetch(target, init);
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: upstream.headers,
    });
  } catch (err) {
    const kind =
      err instanceof TypeError ? "network_error" :
      err instanceof Error && err.name === "AbortError" ? "timeout" :
      "upstream_fetch_failed";
    return unreachable(kind);
  }
}
