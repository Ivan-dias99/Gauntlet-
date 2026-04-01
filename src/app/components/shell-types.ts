/**
 * RUBERRA Shell Types — canonical type definitions
 */

export type Tab = "lab" | "school" | "creation" | "profile";

export type BlockType =
  | "verdict" | "execution" | "lesson" | "creation" | "report" | "signal"
  | "audit" | "matrix" | "tree" | "timeline" | "evidence" | "dossier" | "blueprint";

export type StatusFlag =
  | "pass" | "partial" | "fail" | "live" | "done"
  | "warn" | "skip" | "running" | "pending" | "locked" | "current"
  | "draft" | "review" | "active" | "blocked" | "error" | "verified";

export interface BlockItem  { label: string; value?: string; status?: StatusFlag; }
export interface BlockSection { heading: string; items: BlockItem[]; }
export interface MessageBlock {
  type:     BlockType;
  title?:   string;
  status?:  StatusFlag;
  sections: BlockSection[];
  meta?: { next?: string; tags?: string[]; progress?: string; };
}

export interface MessageExecutionTruth {
  tier:        "A" | "B" | "C";
  tier_label:  string;
  model_label: string;
  pioneer?:    string;
  chamber:     Exclude<Tab, "profile">;
}

/** Visible runtime consequence — populated by the mother shell after routing + stream */
export type ExecutionState =
  | "streaming"
  | "live"
  | "completed"
  | "degraded"
  | "aborted"
  | "error";

export interface ExecutionResultEntry {
  phase:   string;
  summary: string;
  at:      number;
}

export interface ConnectorActionEntry {
  id:    string;
  label: string;
}

export interface MessageExecutionTrace {
  executionState:    ExecutionState;
  providerId?:       string;
  modelId?:          string;
  supportChain?:     string[];
  workflowId?:       string;
  hostingLevel?:     "hosted" | "wrapped" | "proxy";
  executionResults: ExecutionResultEntry[];
  connectorActions: ConnectorActionEntry[];
  /** Model requested before routing fallback */
  fallbackFromModelId?: string;
}

export interface Message {
  id:        string;
  role:      "user" | "assistant";
  content:   string;
  tab:       Tab;
  timestamp: number;
  blocks?:   MessageBlock[];
  meta?: {
    routeReason?: string;
    pioneerId?: string;
    giId?: string;
    workflowId?: string;
    hostingLevel?: "hosted" | "wrapped" | "proxy";
    connectorRefs?: string[];
    providerId?: string;
    modelId?: string;
    supportChain?: string[];
  };
  execution_truth?: MessageExecutionTruth;
  execution_trace?: MessageExecutionTrace;
}

/* ── Extended view types — all navigable states per chamber ── */
export type LabView      = "home" | "chat" | "analysis" | "code" | "archive" | "domain" | "experiment";
export type SchoolView   = "home" | "chat" | "library"  | "archive" | "track"  | "lesson" | "role" | "browse";
export type CreationView = "home" | "chat" | "terminal" | "archive" | "blueprint" | "engine" | "artifact";
export type ProfileView  = "overview" | "projects" | "memory" | "pioneers" | "connectors" | "workflows" | "settings" | "exports";

/** Navigation function — the core of the product connectivity system */
export type NavFn = (tab: Tab, view: string, id?: string) => void;

/* ── Floating notes ── */
export interface FloatingNote {
  id: string; content: string; tab: Tab;
  pinned: boolean; x: number; y: number; timestamp: number;
}

export type SignalStatus = "idle" | "streaming" | "completed" | "error";
export type Theme = "dark" | "light";
