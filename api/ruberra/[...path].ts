// Vercel edge catchall — forwards /api/ruberra/* to the Python backend
// (typically deployed on Railway / Fly / Render). Mirrors the dev-mode
// vite proxy in vite.config.ts.
//
// Env:
//   RUBERRA_BACKEND_URL — base URL of the FastAPI instance (no trailing slash)

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  const backend = process.env.RUBERRA_BACKEND_URL;
  if (!backend) {
    return new Response(
      JSON.stringify({ error: "RUBERRA_BACKEND_URL_not_configured" }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  }

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
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: "backend_unreachable", detail: message }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
