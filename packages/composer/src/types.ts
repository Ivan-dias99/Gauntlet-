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
