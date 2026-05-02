// Composer Wave 1 — shared types.
//
// Wire shapes mirror signal-backend/models.py (ComposerIntentRequest,
// IntentResult, ComposerPreviewRequest, PreviewResult, ComposerApplyRequest,
// ApplyResult). Field names match the backend exactly so JSON deserialises
// without translation. Anything Wave 1 does not consume yet is marked
// optional with a doc-comment reason.

export type ComposerMode =
  | "idle"
  | "context"
  | "compose"
  | "code"
  | "design"
  | "analysis"
  | "memory"
  | "apply"
  | "route";

export type IntentKind =
  | "summarize"
  | "rewrite"
  | "extract"
  | "analyze"
  | "generate_code"
  | "debug_code"
  | "generate_image"
  | "create_report"
  | "create_design"
  | "save_memory"
  | "search_memory"
  | "execute_plan"
  | "automate_flow"
  | "ambiguous"
  | "unsupported";

export type RiskLevel = "low" | "medium" | "high";

export type ArtifactKind =
  | "code_patch"
  | "code_file"
  | "text"
  | "report"
  | "image_prompt"
  | "plan"
  | "summary"
  | "diff";

export type ContextSource =
  | "browser_extension"
  | "control_center"
  | "desktop_native"
  | "voice"
  | "automation";

export interface ContextCaptureRequest {
  source: ContextSource;
  url?: string;
  page_title?: string;
  app_name?: string;
  window_title?: string;
  selection?: string;
  clipboard?: string;
  files?: string[];
  metadata?: Record<string, unknown>;
  permission_scope?: string[];
}

export interface ContextCaptureResponse {
  context_id: string;
  confidence: number;
  expires_at: string;
}

export interface ModelRoute {
  primary_model: string;
  fallback_models: string[];
  reason: string;
  expected_cost_usd?: number;
  expected_latency_ms?: number;
  quality_score?: number;
  tool_requirements: string[];
}

export interface SuggestedAction {
  id: string;
  label: string;
  intent: IntentKind;
  risk: RiskLevel;
}

export interface IntentResult {
  intent_id: string;
  context_id: string;
  intent: IntentKind;
  confidence: number;
  summary: string;
  suggested_actions: SuggestedAction[];
  model_route: ModelRoute;
  tools_needed: string[];
  risk_estimate: RiskLevel;
  requires_approval: boolean;
  clarifying_questions: string[];
  created_at: string;
}

export interface ComposerArtifact {
  artifact_id: string;
  kind: ArtifactKind;
  content: string;
  files_impacted: string[];
  diff?: string;
  metadata: Record<string, unknown>;
}

export interface PreviewResult {
  preview_id: string;
  intent_id: string;
  context_id: string;
  artifact: ComposerArtifact;
  risk: RiskLevel;
  requires_approval: boolean;
  model_used: string;
  tools_used: string[];
  latency_ms: number;
  judge_verdict?: "high" | "low";
  refused: boolean;
  refusal_reason?: string;
  created_at: string;
}

export interface ApplyResult {
  run_id: string;
  preview_id: string;
  status: "applied" | "rejected" | "failed" | "skipped";
  artifacts: ComposerArtifact[];
  ledger_event_id?: string;
  error?: string;
}

// ─── Design tokens (Wave 7) ─────────────────────────────────────────────
//
// Mirrors signal-backend/figma_tokens.py TokenSet.to_dict(). The
// /design/figma/import endpoint walks a Figma REST file body and emits
// this shape. Wave 7 renders it as visual swatches/specimens; the
// underlying parser handles styles map + Variables API + alias warnings.

export interface ColorToken {
  name: string;
  value_hex: string;
  description: string | null;
}

export interface SpacingToken {
  name: string;
  value_px: number;
  description: string | null;
}

export interface TypeToken {
  name: string;
  family: string;
  weight: number;
  size_px: number;
  line_height_px: number;
  description: string | null;
}

export interface RadiusToken {
  name: string;
  value_px: number;
  description: string | null;
}

export interface TokenSet {
  name: string;
  source_file_id: string;
  imported_at: string;
  colors: ColorToken[];
  spacings: SpacingToken[];
  types: TypeToken[];
  radii: RadiusToken[];
  raw_warnings: string[];
}

export interface FigmaImportRequest {
  file_id: string;
  body: Record<string, unknown>;
  name?: string;
}

// Run-state machine for the central Compose surface (Wave 1 only consumes
// these states; richer statuses land per-mode in Wave 2+).
export type ComposeState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "intent_ready"; intent: IntentResult }
  | { kind: "preview_ready"; intent: IntentResult; preview: PreviewResult }
  | { kind: "applied"; preview: PreviewResult; apply: ApplyResult }
  | { kind: "error"; message: string; reason?: string };

// Mode descriptor for the sidebar / panel grid. Wave 1 ships visuals for
// every mode; only `compose` is wired to the backend. The remaining modes
// render a "Wave 2+" placeholder card so the UI is fiel to Foto 3 while
// being honest about state.
export interface ModeDescriptor {
  id: ComposerMode;
  label: string;
  blurb: string;
  // True when the mode has real backend wiring in this wave.
  live: boolean;
}

export const MODES: ModeDescriptor[] = [
  { id: "idle",     label: "Idle",      blurb: "Composer is dormant until you call it.",                  live: true  },
  { id: "context",  label: "Context",   blurb: "Auto-detects selection, screen, files.",                  live: true  },
  { id: "compose",  label: "Compose",   blurb: "Central canvas — input, plan, preview, apply.",           live: true  },
  { id: "code",     label: "Code",      blurb: "IDE-style diff renderer + files-impacted pills.",         live: true  },
  { id: "design",   label: "Design",    blurb: "Figma tokens import + compose flow with design intent.",  live: true  },
  { id: "analysis", label: "Analysis",  blurb: "Markdown reports + KPI tiles + bar charts from tables.",  live: true  },
  { id: "memory",   label: "Memory",    blurb: "Save canon, search by tag and provenance (Wave 2+).",     live: false },
  { id: "apply",    label: "Apply",     blurb: "Files-impacted preview + risk gate + ledger linkage.",    live: true  },
  { id: "route",    label: "Route",     blurb: "Tools registry × models gateway — read-only.",            live: true  },
];

export const PIPELINE_STAGES = [
  "Context Capture",
  "Intent Understanding",
  "Model Router",
  "Tool Registry",
  "Memory Layer",
  "Preview",
  "Approval",
  "Execution",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];
