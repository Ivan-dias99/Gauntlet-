// Signal — canonical backend client.
//
// Public paths (preferred):  /api/signal/*
// Legacy paths (compat):     /api/ruberra/*   (kept until Wave 8)
//
// Env precedence for the base URL override:
//   VITE_SIGNAL_API_BASE   (preferred)
//   VITE_RUBERRA_API_BASE  (legacy, honored during compat)
//   "/api/signal"          (default — handled by the Vite proxy in dev and
//                            the Vercel edge forwarder in prod).
//
// Backend-unreachable is a first-class state — NOT a regex on error text.
// The edge forwarder (api/signal.ts and its legacy alias api/ruberra.ts,
// both forwarding to the signal-backend/ Python service) signals it with:
//   status: 503
//   header: x-signal-backend: unreachable   (and, during the compat window,
//           x-ruberra-backend: unreachable emitted alongside)
//   body:   { error: "backend_unreachable", reason: <kind> }
// A network-level throw (edge dead, CORS, offline) also counts as
// unreachable. Every other non-2xx is a real upstream response.

const RAW_BASE =
  (import.meta.env.VITE_SIGNAL_API_BASE as string | undefined) ??
  (import.meta.env.VITE_RUBERRA_API_BASE as string | undefined) ??
  "/api/signal";

const BASE = RAW_BASE.replace(/\/+$/, "");

export const SIGNAL_API_BASE = BASE;
export const UNREACHABLE_HEADER = "x-signal-backend";
export const LEGACY_UNREACHABLE_HEADER = "x-ruberra-backend";
export const UNREACHABLE_VALUE = "unreachable";

export function apiUrl(path: string): string {
  const tail = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${tail}`;
}

export class BackendUnreachableError extends Error {
  readonly kind = "backend_unreachable" as const;
  readonly reason: string;
  constructor(reason: string) {
    super(`backend_unreachable: ${reason}`);
    this.name = "BackendUnreachableError";
    this.reason = reason;
  }
}

export function isBackendUnreachable(err: unknown): err is BackendUnreachableError {
  return err instanceof BackendUnreachableError;
}

// Backend error envelope — every 4xx/5xx body from the Python backend is
// normalised to `{error, reason, message}`. FastAPI wraps that under a
// top-level `detail` key, so the on-the-wire shape is:
//   { "detail": { "error": "engine_error", "reason": "RuntimeError", "message": "..." } }
// Stream error events carry the same three fields inline alongside
// `type: "error"`. Callers that want typed failure handling should
// discriminate on `error` rather than regex the message.
export interface BackendErrorEnvelope {
  error: string;
  reason: string;
  message: string;
}

function looksLikeEnvelope(x: unknown): x is BackendErrorEnvelope {
  return (
    typeof x === "object" &&
    x !== null &&
    typeof (x as Record<string, unknown>).error === "string" &&
    typeof (x as Record<string, unknown>).reason === "string" &&
    typeof (x as Record<string, unknown>).message === "string"
  );
}

export async function parseBackendError(
  res: Response,
): Promise<BackendErrorEnvelope | null> {
  const text = await res.clone().text();
  if (!text) return null;
  try {
    const body = JSON.parse(text) as unknown;
    // FastAPI HTTPException.detail wraps the dict we control
    if (typeof body === "object" && body !== null && "detail" in body) {
      const d = (body as { detail: unknown }).detail;
      if (looksLikeEnvelope(d)) return d;
    }
    // Inline envelope (streams, /ask/batch per-item)
    if (looksLikeEnvelope(body)) return body;
  } catch {
    // Non-JSON body — fall through
  }
  return null;
}

export class BackendError extends Error {
  readonly kind = "backend_error" as const;
  readonly status: number;
  readonly envelope: BackendErrorEnvelope | null;
  constructor(status: number, envelope: BackendErrorEnvelope | null, fallback: string) {
    super(envelope ? `${envelope.error}: ${envelope.message}` : fallback);
    this.name = "BackendError";
    this.status = status;
    this.envelope = envelope;
  }
}

export function isBackendError(err: unknown): err is BackendError {
  return err instanceof BackendError;
}

async function unreachableFromResponse(res: Response): Promise<BackendUnreachableError | null> {
  // Accept the canonical header plus the legacy one emitted by the
  // forwarder during the Wave-0 → Wave-8 compatibility window.
  const headerHit =
    res.headers.get(UNREACHABLE_HEADER) === UNREACHABLE_VALUE ||
    res.headers.get(LEGACY_UNREACHABLE_HEADER) === UNREACHABLE_VALUE;
  if (!headerHit) return null;

  // Forwarder body is `{ error: "backend_unreachable", reason: "<kind>" }`.
  // The reason names the actual failure mode — "backend_url_not_configured",
  // "network_error", "timeout", "upstream_fetch_failed" — so callers can
  // surface it in the UI instead of an opaque "edge:503". Body is read from
  // a clone so the caller's downstream parse path stays available.
  let bodyReason: string | null = null;
  try {
    const body = (await res.clone().json()) as { reason?: unknown };
    if (typeof body.reason === "string" && body.reason.length > 0) {
      bodyReason = body.reason;
    }
  } catch {
    // Non-JSON or empty body — fall back to the edge status.
  }
  return new BackendUnreachableError(bodyReason ?? `edge:${res.status}`);
}

// Wraps fetch and throws BackendUnreachableError on:
//   - network-level failure (TypeError: Failed to fetch, offline, DNS…)
//   - responses carrying an unreachable header (new or legacy)
// Every other response — including normal 4xx/5xx from the upstream — is
// returned to the caller to handle with the usual error path.
export async function signalFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(apiUrl(path), init);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new BackendUnreachableError(
      err instanceof Error ? err.message : String(err),
    );
  }
  const unreachable = await unreachableFromResponse(res);
  if (unreachable) throw unreachable;
  return res;
}
