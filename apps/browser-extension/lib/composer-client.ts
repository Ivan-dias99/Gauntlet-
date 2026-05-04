// Composer client — talks to /composer/{context,intent,preview,apply,dom_plan}.
// V0 scope: deterministic HTTP, no streaming, no retries beyond a single
// transport-level catch. Auth header wiring lands in Operação 4 with the
// Control Center settings.

import type { DomAction } from './dom-actions';

// Production backend (Railway). For local dev against the FastAPI server
// on http://localhost:3002, build the extension with:
//
//     VITE_BACKEND_URL=http://localhost:3002 npm run build
//
// host_permissions in wxt.config.ts already covers both URLs, so a build
// override is enough — no manifest edit required.
const PRODUCTION_BACKEND =
  'https://ruberra-backend-jkpf-production.up.railway.app';

const BUILD_TIME_BACKEND: string | undefined =
  typeof import.meta !== 'undefined'
    ? (import.meta as { env?: Record<string, string | undefined> }).env
        ?.VITE_BACKEND_URL
    : undefined;

const DEFAULT_BACKEND = (BUILD_TIME_BACKEND ?? PRODUCTION_BACKEND).replace(
  /\/+$/,
  '',
);

export type ContextSource =
  | 'browser'
  | 'desktop'
  | 'ide'
  | 'terminal'
  | 'file'
  | 'image'
  | 'clipboard';

export interface ContextCaptureRequest {
  source: ContextSource;
  url?: string;
  page_title?: string;
  selection?: string;
  clipboard?: string;
  metadata?: Record<string, unknown>;
}

export interface ContextCaptureResponse {
  context_id: string;
  confidence: number;
  expires_at: string;
}

export interface IntentResult {
  intent_id: string;
  context_id: string;
  intent: string;
  confidence: number;
  summary: string;
  clarifying_questions: string[];
  requires_approval: boolean;
  risk_estimate: 'low' | 'medium' | 'high';
  model_route: { primary_model: string };
}

export interface ComposerArtifact {
  artifact_id: string;
  kind: string;
  content: string;
  files_impacted: string[];
}

export interface PreviewResult {
  preview_id: string;
  intent_id: string;
  context_id: string;
  artifact: ComposerArtifact;
  model_used: string;
  latency_ms: number;
  judge_verdict: 'high' | 'low' | null;
  refused: boolean;
  refusal_reason: string | null;
}

export interface ApplyResult {
  run_id: string;
  preview_id: string;
  status: 'applied' | 'rejected' | 'failed' | 'skipped';
  ledger_event_id: string | null;
  error: string | null;
}

export interface DomPlanResult {
  plan_id: string;
  context_id: string;
  actions: DomAction[];
  compose: string | null;
  reason: string | null;
  model_used: string;
  latency_ms: number;
  raw_response: string | null;
}

export interface ComposerClientOptions {
  backendUrl?: string;
  signal?: AbortSignal;
}

export class ComposerError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ComposerError';
    this.status = status;
    this.body = body;
  }
}

// When this client runs inside the extension (popup or content script),
// route HTTP calls through the background service worker. Background
// fetches use the chrome-extension:// origin which is on the backend's
// CORS allow-list; direct fetches from a content script would carry
// the host page's origin (e.g. https://*.vercel.app) and be rejected.
function inExtensionContext(): boolean {
  return (
    typeof chrome !== 'undefined' &&
    typeof chrome.runtime !== 'undefined' &&
    typeof chrome.runtime.id === 'string'
  );
}

interface BackgroundFetchResponse {
  ok: boolean;
  status?: number;
  statusText?: string;
  body?: string;
  headers?: Record<string, string>;
  error?: string;
}

async function backgroundFetchJson<T>(
  url: string,
  body: unknown,
): Promise<T> {
  const reply: BackgroundFetchResponse = await chrome.runtime.sendMessage({
    type: 'gauntlet:fetch',
    url,
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!reply || !reply.ok) {
    throw new ComposerError(
      `composer: background fetch failed — ${reply?.error ?? 'unknown error'}`,
      0,
      reply ?? null,
    );
  }
  let parsed: unknown = null;
  if (reply.body != null && reply.body !== '') {
    try {
      parsed = JSON.parse(reply.body);
    } catch {
      parsed = reply.body;
    }
  }
  const status = reply.status ?? 0;
  if (status < 200 || status >= 300) {
    throw new ComposerError(
      `composer: ${status} ${reply.statusText ?? ''}`.trim(),
      status,
      parsed,
    );
  }
  return parsed as T;
}

async function postJson<T>(
  url: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<T> {
  if (inExtensionContext()) {
    return backgroundFetchJson<T>(url, body);
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
  let parsed: unknown = null;
  try {
    parsed = await res.json();
  } catch {
    parsed = await res.text().catch(() => null);
  }
  if (!res.ok) {
    throw new ComposerError(
      `composer: ${res.status} ${res.statusText}`,
      res.status,
      parsed,
    );
  }
  return parsed as T;
}

export class ComposerClient {
  readonly backendUrl: string;
  constructor(opts: ComposerClientOptions = {}) {
    this.backendUrl = (opts.backendUrl ?? DEFAULT_BACKEND).replace(/\/+$/, '');
  }

  captureContext(
    req: ContextCaptureRequest,
    signal?: AbortSignal,
  ): Promise<ContextCaptureResponse> {
    return postJson(`${this.backendUrl}/composer/context`, req, signal);
  }

  detectIntent(
    contextId: string,
    userInput: string,
    signal?: AbortSignal,
  ): Promise<IntentResult> {
    return postJson(
      `${this.backendUrl}/composer/intent`,
      { context_id: contextId, user_input: userInput },
      signal,
    );
  }

  generatePreview(
    intentId: string,
    signal?: AbortSignal,
  ): Promise<PreviewResult> {
    return postJson(
      `${this.backendUrl}/composer/preview`,
      { intent_id: intentId },
      signal,
    );
  }

  applyPreview(
    previewId: string,
    approved: boolean,
    approvalReason?: string,
    signal?: AbortSignal,
  ): Promise<ApplyResult> {
    return postJson(
      `${this.backendUrl}/composer/apply`,
      {
        preview_id: previewId,
        approved,
        approval_reason: approvalReason ?? null,
      },
      signal,
    );
  }

  // DOM-action planner — natural language → typed list of DOM actions
  // the content script will execute on approval. The route does not go
  // through the triad/agent loop; it's a single-shot strict-JSON call.
  requestDomPlan(
    contextId: string,
    userInput: string,
    signal?: AbortSignal,
  ): Promise<DomPlanResult> {
    return postJson(
      `${this.backendUrl}/composer/dom_plan`,
      { context_id: contextId, user_input: userInput },
      signal,
    );
  }

  // Streaming version of requestDomPlan. Uses a port-based bridge to
  // background.ts which forwards the SSE chunks. Callbacks are
  // intentionally narrow:
  //   onDelta  — raw text fragment from the model. The capsule
  //              maintains its own buffer + regex-extracts a partial
  //              `compose` value to render token-by-token.
  //   onDone   — final parsed DomPlanResult (or whatever the server
  //              could salvage from a malformed response).
  //   onError  — string description; transport error or model error.
  // Returns an `abort` function the caller invokes to stop early.
  requestDomPlanStream(
    contextId: string,
    userInput: string,
    callbacks: {
      onDelta: (text: string) => void;
      onDone: (result: DomPlanResult) => void;
      onError: (err: string) => void;
    },
  ): () => void {
    if (!inExtensionContext()) {
      // Direct fetch streaming from a non-extension context isn't
      // wired up — surface the limitation rather than silently fall
      // back to one-shot. Callers should use requestDomPlan in those
      // contexts.
      callbacks.onError('streaming requires extension context');
      return () => {};
    }

    const port = chrome.runtime.connect({ name: 'gauntlet:stream' });
    let settled = false;

    function settle() {
      if (settled) return;
      settled = true;
      try {
        port.disconnect();
      } catch {
        // already disconnected
      }
    }

    port.onMessage.addListener((rawMsg: unknown) => {
      if (!rawMsg || typeof rawMsg !== 'object') return;
      const msg = rawMsg as {
        type?: string;
        event?: string;
        data?: string;
        error?: string;
      };
      if (msg.type === 'sse' && typeof msg.data === 'string') {
        let parsed: unknown = null;
        try {
          parsed = JSON.parse(msg.data);
        } catch {
          // The server JSON-encodes every event payload, so a parse
          // failure here is an upstream protocol bug — surface it.
          callbacks.onError('malformed SSE payload');
          settle();
          return;
        }
        if (msg.event === 'delta') {
          const text = (parsed as { text?: string }).text ?? '';
          callbacks.onDelta(text);
        } else if (msg.event === 'done') {
          const d = parsed as Partial<DomPlanResult>;
          callbacks.onDone({
            plan_id: d.plan_id ?? '',
            context_id: d.context_id ?? contextId,
            actions: d.actions ?? [],
            compose: d.compose ?? null,
            reason: d.reason ?? null,
            model_used: d.model_used ?? '',
            latency_ms: d.latency_ms ?? 0,
            raw_response: null,
          });
          settle();
        } else if (msg.event === 'error') {
          const err = (parsed as { error?: string }).error ?? 'model error';
          callbacks.onError(err);
          settle();
        }
      } else if (msg.type === 'error') {
        callbacks.onError(msg.error ?? 'transport error');
        settle();
      } else if (msg.type === 'closed') {
        // Stream closed cleanly without a `done` event — treat as
        // an empty refusal rather than a hard error.
        if (!settled) {
          callbacks.onDone({
            plan_id: '',
            context_id: contextId,
            actions: [],
            compose: null,
            reason: 'stream ended without result',
            model_used: '',
            latency_ms: 0,
            raw_response: null,
          });
          settled = true;
        }
      }
    });

    port.onDisconnect.addListener(() => {
      if (!settled) {
        const lastError = chrome.runtime.lastError?.message;
        callbacks.onError(lastError ?? 'disconnected');
        settled = true;
      }
    });

    port.postMessage({
      type: 'start',
      url: `${this.backendUrl}/composer/dom_plan_stream`,
      body: { context_id: contextId, user_input: userInput },
    });

    return () => {
      if (settled) return;
      try {
        port.postMessage({ type: 'abort' });
      } catch {
        // ignore — port may already be down
      }
      settle();
    };
  }
}

// Convenience: end-to-end one-shot. Used by the Capsule component so the
// UI doesn't have to thread three ids through component state.
export interface ComposeResult {
  intent: IntentResult;
  preview: PreviewResult;
  contextId: string;
}

export async function composeOnce(
  client: ComposerClient,
  capture: ContextCaptureRequest,
  userInput: string,
  signal?: AbortSignal,
): Promise<ComposeResult> {
  const ctx = await client.captureContext(capture, signal);
  const intent = await client.detectIntent(ctx.context_id, userInput, signal);
  const preview = await client.generatePreview(intent.intent_id, signal);
  return { intent, preview, contextId: ctx.context_id };
}
