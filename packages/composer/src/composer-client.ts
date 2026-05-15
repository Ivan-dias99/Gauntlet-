// Composer client — single source of truth for /composer/* HTTP calls.
//
// Transport-agnostic: the host shell injects an Ambient whose transport
// decides how the request reaches the network (chrome.runtime proxy in
// the extension, direct fetch in the desktop). The cápsula sees one
// API regardless of shell.

import type { Ambient, StreamCallbacks } from './ambient';
import {
  ComposerError,
  type ApplyResult,
  type ComposerSettings,
  type ContextCaptureRequest,
  type ContextCaptureResponse,
  type DomPlanResult,
  type ExecutionReportRequest,
  type ExecutionReportResponse,
  type IntentResult,
  type PreviewResult,
  type ToolManifest,
  type ToolManifestsResponse,
} from './types';

// Backend URL is build-time env-driven, no hardcoded production host.
//   * VITE_GAUNTLET_BACKEND_URL is canonical (aligned with the
//     server-side GAUNTLET_BACKEND_URL).
//   * VITE_BACKEND_URL is honoured as a legacy fallback so existing
//     build pipelines keep working until v1.1.0.
//   * In dev mode (vite/wxt/tauri dev) we default to localhost:3002
//     so smoke tests work without explicit env.
//   * In a production build we THROW when neither var is set —
//     a hardcoded fallback would silently ship the wrong URL once
//     the Railway service is renamed.
const DEV_BACKEND = 'http://127.0.0.1:3002';

const VITE_ENV =
  typeof import.meta !== 'undefined'
    ? (import.meta as { env?: Record<string, string | undefined | boolean> })
        .env
    : undefined;

function readEnvUrl(key: string): string | undefined {
  const raw = VITE_ENV?.[key];
  return typeof raw === 'string' && raw.length > 0 ? raw : undefined;
}

const ENV_BACKEND_URL: string | undefined =
  readEnvUrl('VITE_GAUNTLET_BACKEND_URL') ?? readEnvUrl('VITE_BACKEND_URL');

const IS_DEV = Boolean(VITE_ENV?.DEV);

function resolveDefaultBackend(): string {
  if (ENV_BACKEND_URL) return ENV_BACKEND_URL;
  if (IS_DEV) return DEV_BACKEND;
  throw new Error(
    'composer-client: VITE_GAUNTLET_BACKEND_URL is not set in this build. ' +
      'Define it in your build env (Vercel / GitHub Actions / Tauri release / wxt zip).',
  );
}

const DEFAULT_BACKEND = resolveDefaultBackend().replace(/\/+$/, '');

export interface ComposerClientOptions {
  backendUrl?: string;
}

export { ComposerError };

export class ComposerClient {
  readonly backendUrl: string;
  private readonly ambient: Ambient;

  constructor(ambient: Ambient, opts: ComposerClientOptions = {}) {
    this.ambient = ambient;
    this.backendUrl = (opts.backendUrl ?? DEFAULT_BACKEND).replace(/\/+$/, '');
  }

  captureContext(
    req: ContextCaptureRequest,
    signal?: AbortSignal,
  ): Promise<ContextCaptureResponse> {
    return this.ambient.transport.fetchJson(
      'POST',
      `${this.backendUrl}/composer/context`,
      req,
      signal,
    );
  }

  detectIntent(
    contextId: string,
    userInput: string,
    signal?: AbortSignal,
    modelOverride?: string | null,
  ): Promise<IntentResult> {
    const body: Record<string, unknown> = {
      context_id: contextId,
      user_input: userInput,
    };
    if (modelOverride) body.model_override = modelOverride;
    return this.ambient.transport.fetchJson(
      'POST',
      `${this.backendUrl}/composer/intent`,
      body,
      signal,
    );
  }

  // Read-only catalogue of models the backend gateway knows about.
  // ModelSelector consumes this to render the popover; the cápsula
  // itself does not call it.
  getModelCatalogue(signal?: AbortSignal): Promise<ModelCatalogueResponse> {
    return this.ambient.transport.fetchJson(
      'GET',
      `${this.backendUrl}/gateway/catalogue`,
      undefined,
      signal,
    );
  }

  generatePreview(
    intentId: string,
    signal?: AbortSignal,
  ): Promise<PreviewResult> {
    return this.ambient.transport.fetchJson(
      'POST',
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
    return this.ambient.transport.fetchJson(
      'POST',
      `${this.backendUrl}/composer/apply`,
      {
        preview_id: previewId,
        approved,
        approval_reason: approvalReason ?? null,
      },
      signal,
    );
  }

  // Tool manifests — used by the command palette to surface every tool
  // the agent CAN call, with mode/risk/version metadata. Static endpoint;
  // backend computes it at startup. Cached by the cápsula on mount.
  async getToolManifests(signal?: AbortSignal): Promise<ToolManifest[]> {
    const reply = await this.ambient.transport.fetchJson<ToolManifestsResponse>(
      'GET',
      `${this.backendUrl}/tools/manifests`,
      undefined,
      signal,
    );
    return reply.tools ?? [];
  }

  getSettings(signal?: AbortSignal): Promise<ComposerSettings> {
    return this.ambient.transport.fetchJson(
      'GET',
      `${this.backendUrl}/composer/settings`,
      undefined,
      signal,
    );
  }

  updateSettings(
    settings: ComposerSettings,
    signal?: AbortSignal,
  ): Promise<ComposerSettings> {
    return this.ambient.transport.fetchJson(
      'PUT',
      `${this.backendUrl}/composer/settings`,
      settings,
      signal,
    );
  }

  reportExecution(
    payload: ExecutionReportRequest,
    signal?: AbortSignal,
  ): Promise<ExecutionReportResponse> {
    return this.ambient.transport.fetchJson(
      'POST',
      `${this.backendUrl}/composer/execution`,
      payload,
      signal,
    );
  }

  // Voice — A1. We carry audio over the same JSON pipe so the in-page
  // overlay (which can only fetch via the service-worker proxy that
  // serializes bodies as strings) and the desktop webview share one
  // path. Base64 inflation (~33%) is the cost of that uniformity.
  transcribeAudio(
    audioBase64: string,
    mime: string,
    language?: string,
    signal?: AbortSignal,
  ): Promise<{ text: string; model_used: string; duration_ms: number }> {
    return this.ambient.transport.fetchJson(
      'POST',
      `${this.backendUrl}/voice/transcribe`,
      { audio_base64: audioBase64, mime, language },
      signal,
    );
  }

  synthesizeSpeech(
    text: string,
    voice?: string,
    signal?: AbortSignal,
  ): Promise<{ audio_base64: string; mime: string }> {
    return this.ambient.transport.fetchJson(
      'POST',
      `${this.backendUrl}/voice/synthesize`,
      { text, voice },
      signal,
    );
  }

  requestDomPlan(
    contextId: string,
    userInput: string,
    signal?: AbortSignal,
    modelOverride?: string | null,
  ): Promise<DomPlanResult> {
    const body: Record<string, unknown> = {
      context_id: contextId,
      user_input: userInput,
    };
    if (modelOverride) body.model_override = modelOverride;
    return this.ambient.transport.fetchJson(
      'POST',
      `${this.backendUrl}/composer/dom_plan`,
      body,
      signal,
    );
  }

  // Streaming planner — falls back gracefully when the ambient doesn't
  // support SSE. Returns an `abort` function the caller invokes to stop
  // early. Mirrors the previous extension-only API so the cápsula's
  // call site doesn't need to know which shell it's running in.
  // `modelOverride` (when set + valid in the gateway catalogue) forces
  // the backend to bypass gateway.select for this single request; the
  // cápsula's ModelSelector is the primary caller.
  requestDomPlanStream(
    contextId: string,
    userInput: string,
    callbacks: StreamCallbacks,
    modelOverride?: string | null,
  ): () => void {
    if (!this.ambient.transport.stream) {
      callbacks.onError('streaming not supported by this ambient');
      return () => {};
    }
    const body: Record<string, unknown> = {
      context_id: contextId,
      user_input: userInput,
    };
    if (modelOverride) body.model_override = modelOverride;
    return this.ambient.transport.stream(
      `${this.backendUrl}/composer/dom_plan_stream`,
      body,
      callbacks,
    );
  }
}

// Gateway catalogue surface — consumed by the cápsula's ModelSelector.
// Mirrors backend/routers/observability.py::gateway_catalogue.
export interface ModelCatalogueEntry {
  model_id: string;
  provider: string;
  cost_per_1m_input_usd: number;
  cost_per_1m_output_usd: number;
  notes: string;
  available: boolean;
}

export interface ModelCatalogueResponse {
  active_provider: string;
  models: ModelCatalogueEntry[];
}

// Convenience: end-to-end one-shot.
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
