// Composer wire types — shared by every shell so the backend contract
// is single-sourced. The browser extension and desktop client both
// import from here; if you change a field, change it once.

import type { DomAction } from './dom-actions';

export type ContextSource =
  | 'browser'
  | 'desktop'
  | 'ide'
  | 'terminal'
  | 'file'
  | 'image'
  | 'clipboard';

export interface SelectionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Snapshot of "what is the user pointing at right now" — produced by
// each shell's Ambient.selection() implementation. Browser fills bbox
// + page text + DOM skeleton; desktop fills the same shape but with
// clipboard/window-derived values for the corresponding fields.
export interface SelectionSnapshot {
  text: string;
  url: string;
  pageTitle: string;
  pageText: string;
  domSkeleton: string;
  bbox: SelectionRect | null;
}

export interface ContextCaptureRequest {
  source: ContextSource;
  url?: string;
  page_title?: string;
  // Desktop-shell fields — backend accepts both shapes.
  app_name?: string;
  window_title?: string;
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

// Execution Contract (Sprint 3) -----------------------------------------------
// After a shell that supports actuation resolves the plan against the
// live surface (browser only, today), it reports the outcome here.
// Backend records one ledger row per call.

export type ExecutionStatus = 'executed' | 'rejected' | 'failed';

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

// Governance Lock (Sprint 4) --------------------------------------------------

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
  // Optional in extension's historical snapshot; required in desktop's.
  // Single canonical type carries it as optional for backward compat
  // with backends that haven't yet emitted the field.
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
  updated_at: '',
};

// Tool manifests (Sprint 5 governance shape) ----------------------------------
// Surfaced by GET /tools/manifests. The cápsula's command palette renders
// these so the operator sees every tool the agent CAN call, with risk +
// mode badges, in one keyboard surface.

export type ToolMode = 'read' | 'write' | string;
export type ToolRisk = 'low' | 'medium' | 'high' | string;

export interface ToolManifest {
  name: string;
  description: string;
  mode: ToolMode;
  risk: ToolRisk;
  version: string;
  scopes: string[];
  rollback_policy: string;
  timeout_s: number;
}

export interface ToolManifestsResponse {
  tools: ToolManifest[];
}

// Local file or screenshot the operator pulled into the cápsula via the
// desktop shell's filesystem capability. The shared Composer treats it
// as opaque payload that gets inlined into the prompt; the backend sees
// the result through `user_input` (no schema change required for A1).
//
//   kind: 'text'   — UTF-8 file contents the operator wants the agent
//                    to read or transform
//   kind: 'image'  — base64 PNG/JPEG (screen capture or picked image)
//   kind: 'binary' — base64 of arbitrary file the operator pinned
//
// `bytes` is the original file size before any base64 inflation, so
// the cápsula can render "1.4 MB" without measuring the encoded blob.
export type AttachmentKind = 'text' | 'image' | 'binary';

export interface Attachment {
  id: string;
  kind: AttachmentKind;
  name: string;
  mime: string;
  bytes: number;
  // Present iff kind === 'text'. UTF-8 content with size cap enforced
  // by the host shell (see desktop ambient's MAX_TEXT_BYTES).
  text?: string;
  // Present iff kind === 'image' | 'binary'. Raw base64 (no data: URL
  // prefix) so the cápsula composes its own preview src.
  base64?: string;
  // Filesystem path the file was read from (when picked via dialog) or
  // the screenshot was written to. Surfaced in the chip tooltip.
  path?: string;
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
