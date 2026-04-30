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
  // Edge-runtime error text from the catch-all `upstream_fetch_failed`
  // bucket (e.g. "Headers.append: 'host' is forbidden header name").
  // Null for the named buckets where the bucket name IS the diagnosis.
  readonly detail: string | null;
  constructor(reason: string, detail: string | null = null) {
    super(detail ? `backend_unreachable: ${reason} — ${detail}` : `backend_unreachable: ${reason}`);
    this.name = "BackendUnreachableError";
    this.reason = reason;
    this.detail = detail;
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

  // Forwarder body is `{ error: "backend_unreachable", reason: "<kind>",
  // message?: "<edge error text>" }`. The reason names the failure bucket;
  // message carries the raw edge-runtime detail when fetch threw an
  // unclassified exception. Both are surfaced so the chip can render the
  // actionable cause instead of an opaque "edge:503". Body is read from a
  // clone so the caller's downstream parse path stays available.
  let bodyReason: string | null = null;
  let bodyMessage: string | null = null;
  try {
    const body = (await res.clone().json()) as { reason?: unknown; message?: unknown };
    if (typeof body.reason === "string" && body.reason.length > 0) bodyReason = body.reason;
    if (typeof body.message === "string" && body.message.length > 0) bodyMessage = body.message;
  } catch {
    // Non-JSON or empty body — fall back to the edge status.
  }
  return new BackendUnreachableError(bodyReason ?? `edge:${res.status}`, bodyMessage);
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
      "network_error",
      err instanceof Error ? err.message : String(err),
    );
  }
  const unreachable = await unreachableFromResponse(res);
  if (unreachable) throw unreachable;
  return res;
}

// ── Pause / Resume (Wave P-29, Tool 7) ─────────────────────────────────────
//
// Thin wrappers around POST /dev/pause, POST /dev/resume, GET /dev/paused.
// The agent loop checks the registry at every iteration boundary; flipping
// pause mid-stream lets the next iteration emit `paused` and bail with
// `terminated_early=true, termination_reason="paused"` — partial tool work
// is preserved, the run record still closes honestly. See server.py and
// signal-backend/pause_registry.py.

export interface PauseEntry {
  task_id: string;
  paused_at: number;
  reason: string | null;
  mission_id: string | null;
}

export interface PauseAck {
  ok: boolean;
  task_id: string;
  paused_at: number;
  reason: string | null;
  mission_id: string | null;
}

export interface ResumeAck {
  ok: boolean;
  task_id: string;
  resumed_at: number;
  was_paused: boolean;
}

export async function pauseTask(
  taskId: string,
  opts?: { reason?: string | null; missionId?: string | null },
): Promise<PauseAck> {
  const res = await signalFetch("/dev/pause", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      task_id: taskId,
      reason: opts?.reason ?? undefined,
      mission_id: opts?.missionId ?? undefined,
    }),
  });
  if (!res.ok) {
    const env = await parseBackendError(res);
    throw new BackendError(res.status, env, `HTTP ${res.status} from /dev/pause`);
  }
  return (await res.json()) as PauseAck;
}

export async function resumeTask(taskId: string): Promise<ResumeAck> {
  const res = await signalFetch("/dev/resume", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task_id: taskId }),
  });
  if (!res.ok) {
    const env = await parseBackendError(res);
    throw new BackendError(res.status, env, `HTTP ${res.status} from /dev/resume`);
  }
  return (await res.json()) as ResumeAck;
}

export async function listPausedTasks(): Promise<PauseEntry[]> {
  const res = await signalFetch("/dev/paused");
  if (!res.ok) {
    const env = await parseBackendError(res);
    throw new BackendError(res.status, env, `HTTP ${res.status} from /dev/paused`);
  }
  const body = (await res.json()) as { count: number; entries: PauseEntry[] };
  return Array.isArray(body.entries) ? body.entries : [];
}


// ── Visual diff (Wave P-28) ────────────────────────────────────────────────
//
// Posts two image buffers (PNG/JPEG) as multipart form-data to
// /visual-diff and returns the typed DiffResult. Mirrors the backend
// dataclass in signal-backend/visual_diff.py — kept inline here
// because the chamber only needs the response shape, not the full
// VisualDiff schema.

export interface DiffRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  mismatch_ratio: number;
  severity: "info" | "minor" | "moderate" | "critical";
  note?: string | null;
}

export interface DiffResult {
  regions: DiffRegion[];
  changed_pixels: number;
  total_pixels: number;
  ratio: number;
  severity: "info" | "minor" | "moderate" | "critical";
  width: number;
  height: number;
  note?: string | null;
}

/**
 * Convert a `data:image/...;base64,...` URL into a Blob. Used so the
 * chamber can take the iframe's html2canvas dataUrl output and POST
 * it as multipart without round-tripping through canvas again.
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const [head, b64] = dataUrl.split(",", 2);
  if (!head || !b64) throw new Error("malformed data URL");
  const mimeMatch = head.match(/^data:([^;]+)/);
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/**
 * POST `/visual-diff` with two image references. Each input is
 * either a Blob (already in memory) or a string `data:image/...`
 * URL — we normalise to Blob before posting so the multipart body
 * is consistent.
 */
export async function compareScreenshots(
  before: Blob | string,
  after: Blob | string,
  opts?: { threshold?: number },
): Promise<DiffResult> {
  const beforeBlob = typeof before === "string" ? dataUrlToBlob(before) : before;
  const afterBlob = typeof after === "string" ? dataUrlToBlob(after) : after;
  const fd = new FormData();
  fd.append("before", beforeBlob, "before.png");
  fd.append("after", afterBlob, "after.png");
  const threshold = opts?.threshold;
  const path = typeof threshold === "number"
    ? `/visual-diff?threshold=${encodeURIComponent(String(threshold))}`
    : "/visual-diff";
  const res = await signalFetch(path, { method: "POST", body: fd });
  if (!res.ok) {
    const env = await parseBackendError(res);
    throw new BackendError(res.status, env, `HTTP ${res.status} from /visual-diff`);
  }
  return (await res.json()) as DiffResult;
}
