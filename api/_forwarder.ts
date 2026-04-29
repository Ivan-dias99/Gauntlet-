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

const NEW_HEADER = "x-signal-backend";
const LEGACY_HEADER = "x-ruberra-backend";
const UNREACHABLE_VALUE = "unreachable";

export function unreachable(reason: string, status = 503, message?: string): Response {
  // `message` carries the raw edge-runtime error text when fetch threw an
  // unclassified exception (the residual `upstream_fetch_failed` bucket).
  // Surfacing it lets the chip render the actionable cause instead of just
  // the bucket name. Omitted from the body when absent so the contract stays
  // identical for the named buckets (`backend_url_not_configured`, etc.).
  const body: Record<string, string> = { error: "backend_unreachable", reason };
  if (message) body.message = message;
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      [NEW_HEADER]: UNREACHABLE_VALUE,
      [LEGACY_HEADER]: UNREACHABLE_VALUE,
    },
  });
}

// Hop-by-hop headers (RFC 7230 §6.1) plus the Vercel-managed ones that the
// Edge runtime refuses to set on outbound fetch — passing them through
// raises an opaque error that surfaces as `upstream_fetch_failed`. Stripping
// them before forwarding keeps the request honest end-to-end.
const FORBIDDEN_FORWARD_HEADERS = new Set([
  "host",
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "content-length",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-forwarded-for",
  "x-real-ip",
]);

function buildForwardHeaders(src: Headers): Headers {
  const out = new Headers();
  src.forEach((value, key) => {
    if (!FORBIDDEN_FORWARD_HEADERS.has(key.toLowerCase())) out.append(key, value);
  });
  return out;
}

export function resolveBackendUrl(): string | null {
  const env =
    typeof process !== "undefined" && process.env
      ? process.env
      : undefined;
  return (
    env?.SIGNAL_BACKEND_URL ??
    env?.RUBERRA_BACKEND_URL ??
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
    headers: buildForwardHeaders(req.headers),
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
    const message = err instanceof Error ? err.message : String(err);
    return unreachable(kind, 503, message);
  }
}
