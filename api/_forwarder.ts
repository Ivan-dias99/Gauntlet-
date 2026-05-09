// Shared edge-forwarder logic for api/gauntlet.ts.
//
// Underscore-prefixed file: Vercel's file-system routing excludes it from
// the public /api/* surface, so it is safe to import from sibling route
// files without exposing a duplicate endpoint.
//
// Contract:
//   - status: 503 on unreachable
//   - header: x-gauntlet-backend: unreachable
//   - body: { error: "backend_unreachable", reason: "<kind>" }
//
// Env: GAUNTLET_BACKEND_URL.

const HEADER_GAUNTLET = "x-gauntlet-backend";
const UNREACHABLE_VALUE = "unreachable";

export function unreachable(reason: string, status = 503, message?: string): Response {
  const body: Record<string, string> = { error: "backend_unreachable", reason };
  if (message) body.message = message;
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      [HEADER_GAUNTLET]: UNREACHABLE_VALUE,
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

// 25 MB ceiling on the request body the edge will forward. The backend
// has its own GAUNTLET_MAX_BODY_BYTES (default 1 MB), but the edge sits
// in front and bills for streamed bytes regardless of what the backend
// later rejects. Pre-rejecting at the edge keeps the wallet honest.
const MAX_FORWARD_BODY_BYTES = 25 * 1024 * 1024;

// Default fetch timeout — non-streaming requests hang the edge function
// at most 25 s before the AbortController fires. SSE responses extend
// the timeout to 120 s so a long triad stream isn't cut off mid-token.
const FETCH_TIMEOUT_MS = 25_000;
const STREAM_TIMEOUT_MS = 120_000;

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
  return env?.GAUNTLET_BACKEND_URL ?? null;
}

function envPresenceMessage(): string {
  return (
    "No GAUNTLET_BACKEND_URL env var found. Set it in your Vercel " +
    "project settings and redeploy."
  );
}

export async function forward(
  req: Request,
  stripPrefix: RegExp,
): Promise<Response> {
  const backend = resolveBackendUrl();
  if (!backend) {
    return unreachable("backend_url_not_configured", 503, envPresenceMessage());
  }

  // Pre-reject oversized request bodies before opening the upstream
  // socket. The edge bills for forwarded bytes; rejecting here saves
  // both the bill and the backend round-trip. Missing Content-Length
  // (chunked uploads) falls through — the backend's body cap is the
  // backstop in that case.
  const cl = req.headers.get("content-length");
  if (cl !== null) {
    const length = Number.parseInt(cl, 10);
    if (Number.isFinite(length) && length > MAX_FORWARD_BODY_BYTES) {
      return new Response(
        JSON.stringify({
          error: "request_too_large",
          reason: "ContentLengthExceeded",
          message: `body of ${length} bytes exceeds edge limit ${MAX_FORWARD_BODY_BYTES}`,
          limit: MAX_FORWARD_BODY_BYTES,
        }),
        { status: 413, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  const url = new URL(req.url);
  const tail = url.pathname.replace(stripPrefix, "");
  const target = backend.replace(/\/+$/, "") + tail + url.search;

  // SSE replies need a longer ceiling than a single triad call. We can't
  // know the response shape before opening the socket, so we look at the
  // client's Accept header — every cápsula stream sends
  // `Accept: text/event-stream`. False negatives degrade to the shorter
  // timeout, which still completes any non-streaming round-trip.
  const accept = (req.headers.get("accept") ?? "").toLowerCase();
  const isStream = accept.includes("text/event-stream");
  const timeoutMs = isStream ? STREAM_TIMEOUT_MS : FETCH_TIMEOUT_MS;

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);

  const init: RequestInit = {
    method: req.method,
    headers: buildForwardHeaders(req.headers),
    body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
    // @ts-expect-error — required by the edge runtime when forwarding streams
    duplex: "half",
    redirect: "manual",
    signal: ac.signal,
  };

  try {
    const upstream = await fetch(target, init);
    // Streaming responses outlive this function call — let the body
    // settle clear of the timer or the AbortController will cancel
    // mid-stream. clearTimeout is idempotent so a non-streaming reply
    // also benefits.
    clearTimeout(timer);
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: upstream.headers,
    });
  } catch (err) {
    clearTimeout(timer);
    const kind =
      err instanceof TypeError ? "network_error" :
      err instanceof Error && err.name === "AbortError" ? "timeout" :
      "upstream_fetch_failed";
    const message = err instanceof Error ? err.message : String(err);
    return unreachable(kind, 503, message);
  }
}
