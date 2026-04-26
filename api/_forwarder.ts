// Vercel edge forwarder helper.
//
// Single canonical contract: /api/signal/* → SIGNAL_BACKEND_URL.
//
// Status: 503 on unreachable upstream.
// Header: x-signal-backend: unreachable
// Body  : { error: "backend_unreachable", reason: "<kind>" }

const UNREACHABLE_HEADER = "x-signal-backend";
const UNREACHABLE_VALUE = "unreachable";

export function unreachable(reason: string, status = 503): Response {
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
