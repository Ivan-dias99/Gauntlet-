// Gauntlet — canonical backend client.
//
// Public paths (canonical):  /api/gauntlet/*
//
// Env: VITE_GAUNTLET_API_BASE overrides the base URL; default is
// "/api/gauntlet" (Vite proxy in dev, Vercel edge forwarder in prod).
//
// Backend-unreachable is a first-class state — NOT a regex on error text.
// The edge forwarder signals it with:
//   status: 503
//   header: x-gauntlet-backend: unreachable
//   body:   { error: "backend_unreachable", reason: <kind> }
// A network-level throw (edge dead, CORS, offline) also counts as
// unreachable. Every other non-2xx is a real upstream response.

const RAW_BASE =
  (import.meta.env.VITE_GAUNTLET_API_BASE as string | undefined) ??
  "/api/gauntlet";

const BASE = RAW_BASE.replace(/\/+$/, "");

export const GAUNTLET_API_BASE = BASE;
export const UNREACHABLE_HEADER = "x-gauntlet-backend";
export const UNREACHABLE_VALUE = "unreachable";

// Opt-in API key. Build-time env (Vite inlines at build).
// When set, gauntletFetch automatically attaches `Authorization: Bearer <key>`
// to every backend call. When unset, no header is added — local dev /
// unsecured deploys keep working unchanged.
const RAW_API_KEY =
  (import.meta.env.VITE_GAUNTLET_API_KEY as string | undefined) ?? "";
const API_KEY = RAW_API_KEY.trim();

export const GAUNTLET_API_KEY_PRESENT = API_KEY.length > 0;

export function apiUrl(path: string): string {
  const tail = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${tail}`;
}

// Merge `Authorization: Bearer <API_KEY>` into a RequestInit's headers
// when the build env carries a key. Existing Authorization headers in
// `init` win — callers that hand-roll their own auth (none today) are
// not stomped. FormData / multipart bodies are untouched (we only add
// a header, never change Content-Type).
function withAuthHeaders(init?: RequestInit): RequestInit | undefined {
  if (!API_KEY) return init;
  const headers = new Headers(init?.headers);
  if (!headers.has("Authorization") && !headers.has("authorization")) {
    headers.set("Authorization", `Bearer ${API_KEY}`);
  }
  return { ...(init ?? {}), headers };
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
  const headerHit = res.headers.get(UNREACHABLE_HEADER) === UNREACHABLE_VALUE;
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
export async function gauntletFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(apiUrl(path), withAuthHeaders(init));
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
// backend/pause_registry.py.

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
  const res = await gauntletFetch("/dev/pause", {
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
  const res = await gauntletFetch("/dev/resume", {
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
  const res = await gauntletFetch("/dev/paused");
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
// /visual-diff and returns the typed DiffResult. The shape is
// declared inline here because the chamber only needs the response
// shape, not the full
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
 *
 * Wave P-30: when ``opts.selector`` is supplied, it is sent as a
 * multipart form field so the backend can stamp the resulting
 * ``RunRecord.context`` with the picked element's CSS path. The
 * response shape is unchanged (a multi-region ``DiffResult``); the
 * selector is purely metadata for the Archive.
 */
export async function compareScreenshots(
  before: Blob | string,
  after: Blob | string,
  opts?: { threshold?: number; selector?: string | null },
): Promise<DiffResult> {
  const beforeBlob = typeof before === "string" ? dataUrlToBlob(before) : before;
  const afterBlob = typeof after === "string" ? dataUrlToBlob(after) : after;
  const fd = new FormData();
  fd.append("before", beforeBlob, "before.png");
  fd.append("after", afterBlob, "after.png");
  const selector = opts?.selector?.trim();
  if (selector) {
    // Backend caps `selector` at 512 chars; clip locally so a deeply
    // nested CSS path doesn't get rejected with a 422 the operator
    // doesn't understand.
    fd.append("selector", selector.slice(0, 512));
  }
  const threshold = opts?.threshold;
  const path = typeof threshold === "number"
    ? `/visual-diff?threshold=${encodeURIComponent(String(threshold))}`
    : "/visual-diff";
  const res = await gauntletFetch(path, { method: "POST", body: fd });
  if (!res.ok) {
    const env = await parseBackendError(res);
    throw new BackendError(res.status, env, `HTTP ${res.status} from /visual-diff`);
  }
  return (await res.json()) as DiffResult;
}

/**
 * Wave P-30 — element-scoped variant. Same multipart POST as
 * ``compareScreenshots`` but tagged with the element's CSS selector
 * so the resulting RunRecord lands in the Archive as
 * ``diff over body > main > div`` instead of a bare ``visual_diff``
 * blob. The chamber's element-pick → capture flow uses this so
 * component-level QA is grep-able after the fact.
 */
export async function compareElement(
  elementSelector: string,
  before: Blob | string,
  after: Blob | string,
  opts?: { threshold?: number },
): Promise<DiffResult> {
  return compareScreenshots(before, after, {
    threshold: opts?.threshold,
    selector: elementSelector,
  });
}
