// Composer client — talks to /composer/{context,intent,preview,apply,dom_plan}.
// V0 scope: deterministic HTTP, no streaming, no retries beyond a single
// transport-level catch. Auth header wiring lands in Operação 4 with the
// Control Center settings.

import type { DomAction } from './dom-actions';

const DEFAULT_BACKEND = 'https://ruberra-backend-jkpf-production.up.railway.app';

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
