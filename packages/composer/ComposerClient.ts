// Composer client — talks to /composer/{context,intent,preview,apply,dom_plan,
// dom_plan_stream,settings,execution} and /memory/records.
//
// Ambient-agnostic: all transport (regular JSON requests + SSE streaming)
// flows through `AmbientTransport`. Web ambients implement transport over
// chrome.runtime.sendMessage / chrome.runtime.connect (extension origin
// bypasses CORS). Desktop ambient implements it with direct fetch (Tauri's
// webview honours the capability allow-list).
//
// The wire contract is identical across runtimes — only the transport
// differs.

import type { AmbientTransport, SseCallbacks } from "./ambient";
import type { DomAction } from "./dom-actions";

export type ContextSource =
  | "browser"
  | "desktop"
  | "ide"
  | "terminal"
  | "file"
  | "image"
  | "clipboard";

export interface ContextCaptureRequest {
  source: ContextSource;
  url?: string;
  page_title?: string;
  selection?: string;
  clipboard?: string;
  app_name?: string;
  window_title?: string;
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
  risk_estimate: "low" | "medium" | "high";
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
  judge_verdict: "high" | "low" | null;
  refused: boolean;
  refusal_reason: string | null;
}

export interface ApplyResult {
  run_id: string;
  preview_id: string;
  status: "applied" | "rejected" | "failed" | "skipped";
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

export type ExecutionStatus = "executed" | "rejected" | "failed";

export interface ExecutedActionRecord {
  action: DomAction;
  ok: boolean;
  error?: string | null;
  danger?: boolean;
  danger_reason?: string | null;
}

export interface ExecutionReportRequest {
  plan_id?: string | null;
  context_id?: string | null;
  url?: string | null;
  page_title?: string | null;
  status: ExecutionStatus;
  results: ExecutedActionRecord[];
  has_danger?: boolean;
  sequence_danger_reason?: string | null;
  danger_acknowledged?: boolean;
  error?: string | null;
  model_used?: string | null;
  plan_latency_ms?: number | null;
  user_input?: string | null;
}

export interface ExecutionReportResponse {
  run_id: string;
  ledger_event_id: string | null;
  received_at?: string;
}

export interface DomainPolicy {
  allowed: boolean;
  require_danger_ack: boolean;
}

export interface ActionPolicy {
  allowed: boolean;
  require_danger_ack: boolean;
}

export interface ToolPolicy {
  allowed: boolean;
  require_approval: boolean;
}

export interface ComposerSettings {
  domains: Record<string, DomainPolicy>;
  actions: Record<string, ActionPolicy>;
  default_domain_policy: DomainPolicy;
  default_action_policy: ActionPolicy;
  tool_policies?: Record<string, ToolPolicy>;
  max_page_text_chars: number;
  max_dom_skeleton_chars: number;
  screenshot_default: boolean;
  execution_reporting_required: boolean;
  updated_at: string;
}

export const DEFAULT_COMPOSER_SETTINGS: ComposerSettings = {
  domains: {},
  actions: {},
  default_domain_policy: { allowed: true, require_danger_ack: false },
  default_action_policy: { allowed: true, require_danger_ack: false },
  tool_policies: {},
  max_page_text_chars: 6000,
  max_dom_skeleton_chars: 4000,
  screenshot_default: false,
  execution_reporting_required: false,
  updated_at: "",
};

export interface ComposerClientOptions {
  backendUrl: string;
  transport: AmbientTransport;
}

export class ComposerError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ComposerError";
    this.status = status;
    this.body = body;
  }
}

export class ComposerClient {
  readonly backendUrl: string;
  readonly transport: AmbientTransport;

  constructor(opts: ComposerClientOptions) {
    this.backendUrl = opts.backendUrl.replace(/\/+$/, "");
    this.transport = opts.transport;
  }

  captureContext(
    req: ContextCaptureRequest,
    signal?: AbortSignal,
  ): Promise<ContextCaptureResponse> {
    return this.transport.requestJson(
      "POST",
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
    return this.transport.requestJson(
      "POST",
      `${this.backendUrl}/composer/intent`,
      { context_id: contextId, user_input: userInput },
      signal,
    );
  }

  generatePreview(
    intentId: string,
    signal?: AbortSignal,
  ): Promise<PreviewResult> {
    return this.transport.requestJson(
      "POST",
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
    return this.transport.requestJson(
      "POST",
      `${this.backendUrl}/composer/apply`,
      {
        preview_id: previewId,
        approved,
        approval_reason: approvalReason ?? null,
      },
      signal,
    );
  }

  getSettings(signal?: AbortSignal): Promise<ComposerSettings> {
    return this.transport.requestJson(
      "GET",
      `${this.backendUrl}/composer/settings`,
      undefined,
      signal,
    );
  }

  updateSettings(
    settings: ComposerSettings,
    signal?: AbortSignal,
  ): Promise<ComposerSettings> {
    return this.transport.requestJson(
      "PUT",
      `${this.backendUrl}/composer/settings`,
      settings,
      signal,
    );
  }

  reportExecution(
    payload: ExecutionReportRequest,
    signal?: AbortSignal,
  ): Promise<ExecutionReportResponse> {
    return this.transport.requestJson(
      "POST",
      `${this.backendUrl}/composer/execution`,
      payload,
      signal,
    );
  }

  requestDomPlan(
    contextId: string,
    userInput: string,
    signal?: AbortSignal,
  ): Promise<DomPlanResult> {
    return this.transport.requestJson(
      "POST",
      `${this.backendUrl}/composer/dom_plan`,
      { context_id: contextId, user_input: userInput },
      signal,
    );
  }

  // Streaming dom_plan. When the ambient transport doesn't implement
  // streamSse (e.g. desktop without a Rust-side SSE helper), we fall
  // back to the non-streaming endpoint and emit one synthetic done event.
  // The cápsula's UI handles both paths transparently — the operator
  // only sees per-token streaming on web for now.
  requestDomPlanStream(
    contextId: string,
    userInput: string,
    callbacks: {
      onDelta: (text: string) => void;
      onDone: (result: DomPlanResult) => void;
      onError: (err: string) => void;
    },
  ): () => void {
    const url = `${this.backendUrl}/composer/dom_plan_stream`;
    const body = { context_id: contextId, user_input: userInput };

    if (this.transport.streamSse) {
      const wrapped: SseCallbacks = {
        onDelta: (text) => callbacks.onDelta(text),
        onDone: (data) => {
          const d = (data ?? {}) as Partial<DomPlanResult>;
          callbacks.onDone({
            plan_id: d.plan_id ?? "",
            context_id: d.context_id ?? contextId,
            actions: d.actions ?? [],
            compose: d.compose ?? null,
            reason: d.reason ?? null,
            model_used: d.model_used ?? "",
            latency_ms: d.latency_ms ?? 0,
            raw_response: null,
          });
        },
        onError: (err) => callbacks.onError(err),
      };
      return this.transport.streamSse(url, body, wrapped);
    }

    let aborted = false;
    const ac = new AbortController();
    this.requestDomPlan(contextId, userInput, ac.signal)
      .then((result) => {
        if (aborted) return;
        callbacks.onDone(result);
      })
      .catch((err: unknown) => {
        if (aborted) return;
        callbacks.onError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      if (aborted) return;
      aborted = true;
      try {
        ac.abort();
      } catch {
        // ignore
      }
    };
  }
}

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
