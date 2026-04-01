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

export interface Message {
  id:        string;
  role:      "user" | "assistant";
  content:   string;
  tab:       Tab;
  timestamp: number;
  blocks?:   MessageBlock[];
  meta?: {
    routeReason?: string;
    chamberRoute?: Tab;
    pioneerId?: string;
    giId?: string;
    supportChain?: string[];
    workflowId?: string;
    hostingLevel?: "hosted" | "wrapped" | "proxy";
    providerId?: string;
    providerLane?: "open_source_local" | "free_provider" | "wrapped_external" | "premium_hosted_future";
    modelId?: string;
    executionState?: "live" | "completed" | "degraded" | "blocked" | "failed" | "fallback_used" | "provider_unavailable" | "connector_unavailable" | "scaffold_only";
    connectorRefs?: string[];
  };
}

/* ── Extended view types — all navigable states per chamber ── */
export type LabView      = "home" | "chat" | "analysis" | "code" | "archive" | "domain" | "experiment";
export type SchoolView   = "home" | "chat" | "library"  | "archive" | "track"  | "lesson" | "role" | "browse";
export type CreationView = "home" | "chat" | "terminal" | "archive" | "blueprint" | "engine" | "artifact";
export type ProfileView  = "overview" | "projects" | "memory" | "settings" | "exports";

/** Navigation function — the core of the product connectivity system */
export type NavFn = (tab: Tab, view: string, id?: string) => void;

/* ── Floating notes ── */
export interface FloatingNote {
  id: string; content: string; tab: Tab;
  pinned: boolean; x: number; y: number; timestamp: number;
}

export type SignalStatus = "idle" | "streaming" | "completed" | "error";
export type Theme = "dark" | "light";
