// Composer client — talks to /composer/{context,intent,preview,apply}.
// V0 scope: deterministic HTTP, no streaming, no retries beyond a single
// transport-level catch. Auth header wiring lands in Operação 4 with the
// Control Center settings.
//
// Backend URL precedence (build-time, inlined by Vite/WXT):
//   1. import.meta.env.VITE_RUBERRA_BACKEND_URL   (dev override)
//   2. PRODUCTION_BACKEND constant below          (Railway, default)
//
// To run against a local backend during dev, create
// apps/browser-extension/.env with:
//   VITE_RUBERRA_BACKEND_URL=http://127.0.0.1:3002

const PRODUCTION_BACKEND = 'https://ruberra-backend-jkpf-production.up.railway.app';

const ENV_BACKEND = (import.meta.env?.VITE_RUBERRA_BACKEND_URL as string | undefined)?.trim();

const DEFAULT_BACKEND = ENV_BACKEND && ENV_BACKEND.length > 0
  ? ENV_BACKEND
  : PRODUCTION_BACKEND;

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

async function postJson<T>(
  url: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<T> {
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
