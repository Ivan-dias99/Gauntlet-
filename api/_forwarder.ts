// Shared edge-forwarder logic for api/signal.ts and api/ruberra.ts.
//
// Underscore-prefixed file: Vercel's file-system routing excludes it from
// the public /api/* surface, so it is safe to import from sibling route
// files without exposing a duplicate endpoint.
//
// Contract (identical for both routes during the Wave-0 → Wave-8 window):
//   - status: 503 on unreachable
//   - headers: BOTH x-signal-backend: unreachable AND x-ruberra-backend:
//     unreachable, so clients written against either contract keep working.
//   - body: { error: "backend_unreachable", reason: "<kind>" }
//
// Env precedence for the upstream URL:
//   SIGNAL_BACKEND_URL   (preferred)
//   RUBERRA_BACKEND_URL  (legacy, honored during compat)

// Scoped declaration of `process.env` for the Vercel edge runtime so
// this file typechecks without pulling @types/node into the whole
// project. The frontend tsconfig (tsconfig.json) intentionally does
// not include "node" in lib/types to keep the browser bundle honest.
declare const process: { env: Record<string, string | undefined> };

const NEW_HEADER = "x-signal-backend";
const LEGACY_HEADER = "x-ruberra-backend";
const UNREACHABLE_VALUE = "unreachable";

export function unreachable(reason: string, status = 503): Response {
  return new Response(
    JSON.stringify({ error: "backend_unreachable", reason }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        [NEW_HEADER]: UNREACHABLE_VALUE,
        [LEGACY_HEADER]: UNREACHABLE_VALUE,
      },
    },
  );
}

export function resolveBackendUrl(): string | null {
  return (
    process.env.SIGNAL_BACKEND_URL ??
    process.env.RUBERRA_BACKEND_URL ??
    null
  );
}

export async function forward(
  req: Request,
  stripPrefix: RegExp,
): Promise<Response> {
  const backend = resolveBackendUrl();
  if (!backend) return unreachable("backend_url_not_configured");

  const url = new URL(req.url);
  const tail = url.pathname.replace(stripPrefix, "");
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
