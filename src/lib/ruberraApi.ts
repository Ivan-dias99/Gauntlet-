// Ruberra backend base URL + explicit unreachable contract.
//
// Dev & same-origin prod → "/api/ruberra" (handled by Vite proxy /
// Vercel edge forwarder). Override with VITE_RUBERRA_API_BASE when the
// frontend needs to reach the backend directly (preview deploys, local
// dev against a remote backend).
//
// Backend-unreachable is a first-class state — NOT a regex on error text.
// The Vercel edge forwarder (api/ruberra/[...path].ts) signals it with:
//   status: 503
//   header: x-ruberra-backend: unreachable
//   body:   { error: "backend_unreachable", reason: <kind> }
// A network-level throw (backend URL dead, CORS, offline) also counts as
// unreachable. Every other non-2xx is a real upstream response.

const RAW_BASE =
  (import.meta.env.VITE_RUBERRA_API_BASE as string | undefined) ??
  "/api/ruberra";

const BASE = RAW_BASE.replace(/\/+$/, "");

export const RUBERRA_API_BASE = BASE;
export const UNREACHABLE_HEADER = "x-ruberra-backend";
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

function unreachableFromResponse(res: Response): BackendUnreachableError | null {
  if (res.headers.get(UNREACHABLE_HEADER) === UNREACHABLE_VALUE) {
    return new BackendUnreachableError(`edge:${res.status}`);
  }
  return null;
}

// Wraps fetch and throws BackendUnreachableError on:
//   - network-level failure (TypeError: Failed to fetch, offline, DNS…)
//   - responses carrying the x-ruberra-backend: unreachable header
// Every other response — including normal 4xx/5xx from the upstream — is
// returned to the caller to handle with the usual error path.
export async function ruberraFetch(
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
  const unreachable = unreachableFromResponse(res);
  if (unreachable) throw unreachable;
  return res;
}
