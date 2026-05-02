// Composer Wave 1 — backend client.
//
// Thin wrappers around the four /composer/* endpoints. Reuses
// signalFetch from src/lib/signalApi so the unreachable contract,
// auth header, and BackendError envelope are honoured consistently.
//
// Wave 2+: streaming previews land here as a separate transport
// (SSE through /composer/preview/stream).

import {
  signalFetch,
  parseBackendError,
  BackendError,
} from "../lib/signalApi";
import type {
  ContextCaptureRequest,
  ContextCaptureResponse,
  IntentResult,
  PreviewResult,
  ApplyResult,
  FigmaImportRequest,
  TokenSet,
  RunRecord,
  FailureRecord,
  MemoryStats,
} from "./types";

async function postJson<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
  const res = await signalFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const env = await parseBackendError(res);
    throw new BackendError(res.status, env, `HTTP ${res.status} from ${path}`);
  }
  return (await res.json()) as TRes;
}

async function getJson<TRes>(path: string): Promise<TRes> {
  const res = await signalFetch(path);
  if (!res.ok) {
    const env = await parseBackendError(res);
    throw new BackendError(res.status, env, `HTTP ${res.status} from ${path}`);
  }
  return (await res.json()) as TRes;
}

export function captureContext(
  req: ContextCaptureRequest,
): Promise<ContextCaptureResponse> {
  return postJson("/composer/context", req);
}

export interface IntentRequest {
  context_id: string;
  user_input: string;
  chamber_hint?: string;
}

export function detectIntent(req: IntentRequest): Promise<IntentResult> {
  return postJson("/composer/intent", req);
}

export interface PreviewRequest {
  intent_id: string;
  overrides?: Record<string, unknown>;
}

export function generatePreview(req: PreviewRequest): Promise<PreviewResult> {
  return postJson("/composer/preview", req);
}

export interface ApplyRequest {
  preview_id: string;
  approved: boolean;
  approval_reason?: string;
}

export function applyPreview(req: ApplyRequest): Promise<ApplyResult> {
  return postJson("/composer/apply", req);
}

// Run the full pipeline from raw user input → context → intent → preview.
// Wave 1 consolidates the three calls so the central Compose surface only
// needs one hook. The orchestration intentionally stops at preview;
// approving + applying is a separate explicit step driven by the operator.
export interface RunComposeArgs {
  userInput: string;
  source?: ContextCaptureRequest["source"];
  url?: string;
  pageTitle?: string;
  selection?: string;
}

export interface ComposeRunResult {
  context: ContextCaptureResponse;
  intent: IntentResult;
  preview: PreviewResult;
}

export async function runCompose(
  args: RunComposeArgs,
): Promise<ComposeRunResult> {
  const context = await captureContext({
    source: args.source ?? "control_center",
    url: args.url,
    page_title: args.pageTitle,
    selection: args.selection,
  });

  const intent = await detectIntent({
    context_id: context.context_id,
    user_input: args.userInput,
  });

  const preview = await generatePreview({
    intent_id: intent.intent_id,
  });

  return { context, intent, preview };
}

// ── Wave 7 — design tokens import ─────────────────────────────────────
//
// Calls POST /design/figma/import with the operator-pasted Figma file
// body. Backend walks styles + Variables API and returns a normalised
// TokenSet (colors / spacings / types / radii + warnings). The endpoint
// is pure compute — no PAT required because the body is supplied
// directly (operator fetches via curl / browser dev tools).

export function importFigmaTokens(req: FigmaImportRequest): Promise<TokenSet> {
  return postJson("/design/figma/import", req);
}

// ── Wave 5 — memory (runs + failures) ─────────────────────────────────

export interface RunsList {
  count: number;
  mission_id: string | null;
  records: RunRecord[];
}

export interface FailuresList {
  count: number;
  records: FailureRecord[];
}

export function listRuns(opts?: { limit?: number; missionId?: string }): Promise<RunsList> {
  const params = new URLSearchParams();
  if (opts?.limit) params.set("limit", String(opts.limit));
  if (opts?.missionId) params.set("mission_id", opts.missionId);
  const qs = params.toString();
  return getJson(`/runs${qs ? `?${qs}` : ""}`);
}

export function listFailures(limit = 50): Promise<FailuresList> {
  return getJson(`/memory/failures?limit=${limit}`);
}

export function getMemoryStats(): Promise<MemoryStats> {
  return getJson("/memory/stats");
}
