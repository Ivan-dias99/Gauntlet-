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

// Production backend (Railway). Build-time override via VITE_BACKEND_URL.
// In dev mode (vite serve / tauri dev / wxt dev), default to the local
// FastAPI on 127.0.0.1:3002 so smoke tests work without explicit env.
const PRODUCTION_BACKEND =
  'https://ruberra-backend-jkpf-production.up.railway.app';
const DEV_BACKEND = 'http://127.0.0.1:3002';

const VITE_ENV =
  typeof import.meta !== 'undefined'
    ? (import.meta as { env?: Record<string, string | undefined | boolean> })
        .env
    : undefined;

const BUILD_TIME_BACKEND: string | undefined =
  typeof VITE_ENV?.VITE_BACKEND_URL === 'string'
    ? (VITE_ENV.VITE_BACKEND_URL as string)
    : undefined;

const IS_DEV = Boolean(VITE_ENV?.DEV);

const DEFAULT_BACKEND = (
  BUILD_TIME_BACKEND ?? (IS_DEV ? DEV_BACKEND : PRODUCTION_BACKEND)
).replace(/\/+$/, '');

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
  ): Promise<IntentResult> {
    return this.ambient.transport.fetchJson(
      'POST',
      `${this.backendUrl}/composer/intent`,
      { context_id: contextId, user_input: userInput },
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
  ): Promise<DomPlanResult> {
    return this.ambient.transport.fetchJson(
      'POST',
      `${this.backendUrl}/composer/dom_plan`,
      { context_id: contextId, user_input: userInput },
      signal,
    );
  }

  // Streaming planner — falls back gracefully when the ambient doesn't
  // support SSE. Returns an `abort` function the caller invokes to stop
  // early. Mirrors the previous extension-only API so the cápsula's
  // call site doesn't need to know which shell it's running in.
  requestDomPlanStream(
    contextId: string,
    userInput: string,
    callbacks: StreamCallbacks,
  ): () => void {
    if (!this.ambient.transport.stream) {
      callbacks.onError('streaming not supported by this ambient');
      return () => {};
    }
    return this.ambient.transport.stream(
      `${this.backendUrl}/composer/dom_plan_stream`,
      { context_id: contextId, user_input: userInput },
      callbacks,
    );
  }
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
