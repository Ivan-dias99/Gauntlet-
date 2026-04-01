/**
 * RUBERRA Workflow Engine
 * Canonical workflow templates with full typed runtime schema.
 * Pioneer-aware, chamber-routed, export-ready.
 */

import { type Tab } from "./shell-types";
import { type PioneerId } from "./pioneer-registry";

// ─── Types ────────────────────────────────────────────────────────────────────

export type WorkflowId =
  | "maximum-quality"
  | "build-heavy"
  | "research-heavy"
  | "learning-heavy"
  | "balanced-trinity"
  | "ivan-sovereign-loop";

export interface WorkflowStage {
  id:          string;
  label:       string;
  chamber:     Exclude<Tab, "profile">;
  pioneer:     PioneerId;
  description: string;
  output_type: string;
  optional:    boolean;
}

export interface WorkflowTemplate {
  id:                    WorkflowId;
  name:                  string;
  purpose:               string;
  lead_pioneer:          PioneerId;
  supporting_pioneers:   PioneerId[];
  home_chamber:          Exclude<Tab, "profile">;
  participating_chambers: Exclude<Tab, "profile">[];
  stages:                WorkflowStage[];
  exportable:            boolean;
  customizable:          boolean;
  version:               string;
  badge:                 string;
  badge_color:           string;
  estimated_quality:     "good" | "strong" | "elite";
}

// ─── Templates ────────────────────────────────────────────────────────────────

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id:                     "ivan-sovereign-loop",
    name:                   "Ivan Canonical Sovereign Loop",
    purpose:                "Maximum quality sovereign output. The proven working method for the highest-standard production runs.",
    lead_pioneer:           "antigravity-director",
    supporting_pioneers:    ["codex-systems", "cursor-builder", "claude-architect", "copilot-qa"],
    home_chamber:           "lab",
    participating_chambers: ["lab", "school", "creation"],
    badge:                  "Sovereign",
    badge_color:            "#52796A",
    estimated_quality:      "elite",
    exportable:             true,
    customizable:           true,
    version:                "1.0",
    stages: [
      {
        id:          "audit",
        label:       "Strategic Audit",
        chamber:     "lab",
        pioneer:     "antigravity-director",
        description: "Antigravity maps the full gap set. Defines the exact work to be done. No implementation until the audit is clear.",
        output_type: "Gap map + taxonomy audit",
        optional:    false,
      },
      {
        id:          "architecture",
        label:       "Runtime Architecture",
        chamber:     "lab",
        pioneer:     "codex-systems",
        description: "Codex Systems designs the runtime schema, object graph, and orchestration contracts from the audit findings.",
        output_type: "Typed schemas + contracts",
        optional:    false,
      },
      {
        id:          "build",
        label:       "Execution Build",
        chamber:     "creation",
        pioneer:     "cursor-builder",
        description: "Cursor Builder implements the real code against the architecture. Directive-in, artifact-out.",
        output_type: "Production artifact",
        optional:    false,
      },
      {
        id:          "polish",
        label:       "Surface Polish",
        chamber:     "creation",
        pioneer:     "cursor-builder",
        description: "Cursor Builder refines visible product surfaces. Preserves strong work. Removes roughness.",
        output_type: "Polished product surface",
        optional:    false,
      },
      {
        id:          "qa",
        label:       "QA Pass",
        chamber:     "creation",
        pioneer:     "copilot-qa",
        description: "Copilot QA Guard checks consistency, edge cases, and code cleanliness. Tail pass only.",
        output_type: "QA report + fixes",
        optional:    true,
      },
      {
        id:          "audit-close",
        label:       "Final Audit",
        chamber:     "lab",
        pioneer:     "antigravity-director",
        description: "Antigravity confirms no drift, no regression. Verifies the output matches the original audit requirements.",
        output_type: "Integrity sign-off",
        optional:    false,
      },
    ],
  },

  {
    id:                     "maximum-quality",
    name:                   "Maximum Quality Pipeline",
    purpose:                "School grounds the topic. Lab validates the logic. Creation executes the final artifact at full quality.",
    lead_pioneer:           "claude-architect",
    supporting_pioneers:    ["gemini-expansion", "cursor-builder", "codex-systems"],
    home_chamber:           "school",
    participating_chambers: ["school", "lab", "creation"],
    badge:                  "Canonical",
    badge_color:            "#4A6B84",
    estimated_quality:      "elite",
    exportable:             true,
    customizable:           true,
    version:                "1.0",
    stages: [
      {
        id:          "ground",
        label:       "First Principles Grounding",
        chamber:     "school",
        pioneer:     "claude-architect",
        description: "School session establishes conceptual grounding. No execution without clear first-principles basis.",
        output_type: "Concept map + knowledge structure",
        optional:    false,
      },
      {
        id:          "validate",
        label:       "Lab Validation",
        chamber:     "lab",
        pioneer:     "claude-architect",
        description: "Lab confirms the concept holds under scrutiny. Evidence-based audit of the grounding.",
        output_type: "Audit verdict + evidence set",
        optional:    false,
      },
      {
        id:          "execute",
        label:       "Creation Execution",
        chamber:     "creation",
        pioneer:     "cursor-builder",
        description: "Creation builds the final artifact against validated specs.",
        output_type: "Production-grade artifact",
        optional:    false,
      },
    ],
  },

  {
    id:                     "build-heavy",
    name:                   "Build Heavy Workflow",
    purpose:                "Fast directive to Creation. Validate with Lab on demand. Maximum build velocity.",
    lead_pioneer:           "cursor-builder",
    supporting_pioneers:    ["codex-systems", "claude-architect"],
    home_chamber:           "creation",
    participating_chambers: ["creation", "lab"],
    badge:                  "Speed",
    badge_color:            "#8A6238",
    estimated_quality:      "strong",
    exportable:             true,
    customizable:           true,
    version:                "1.0",
    stages: [
      {
        id:          "directive",
        label:       "Directive Execution",
        chamber:     "creation",
        pioneer:     "cursor-builder",
        description: "Cursor Builder receives the directive and executes directly. No pre-analysis required.",
        output_type: "Working artifact",
        optional:    false,
      },
      {
        id:          "iterate",
        label:       "Iteration Pass",
        chamber:     "creation",
        pioneer:     "cursor-builder",
        description: "Immediate refinement cycle on the first output. Fast and directive.",
        output_type: "Refined artifact",
        optional:    false,
      },
      {
        id:          "audit",
        label:       "Lab Audit Pass",
        chamber:     "lab",
        pioneer:     "claude-architect",
        description: "Optional: Lab validates the output before final delivery.",
        output_type: "Audit verdict",
        optional:    true,
      },
    ],
  },

  {
    id:                     "research-heavy",
    name:                   "Research Heavy Workflow",
    purpose:                "Deep Lab investigation → structured synthesis → Creation publication of findings.",
    lead_pioneer:           "claude-architect",
    supporting_pioneers:    ["gemini-expansion", "grok-reality", "cursor-builder"],
    home_chamber:           "lab",
    participating_chambers: ["lab", "school", "creation"],
    badge:                  "Research",
    badge_color:            "#52796A",
    estimated_quality:      "elite",
    exportable:             true,
    customizable:           true,
    version:                "1.0",
    stages: [
      {
        id:          "investigate",
        label:       "Deep Investigation",
        chamber:     "lab",
        pioneer:     "claude-architect",
        description: "Claude Architect leads multi-source investigation. Gemini expands context window.",
        output_type: "Research findings + evidence set",
        optional:    false,
      },
      {
        id:          "reality-check",
        label:       "Reality Check",
        chamber:     "lab",
        pioneer:     "grok-reality",
        description: "Grok scores each finding for credibility and live accuracy. Fast validation pass.",
        output_type: "Credibility scores",
        optional:    true,
      },
      {
        id:          "structure",
        label:       "School Structuring",
        chamber:     "school",
        pioneer:     "claude-architect",
        description: "School session packages findings into a structured learning or reference framework.",
        output_type: "Structured knowledge framework",
        optional:    true,
      },
      {
        id:          "publish",
        label:       "Creation Publication",
        chamber:     "creation",
        pioneer:     "cursor-builder",
        description: "Creation builds the final published artifact from the research output.",
        output_type: "Published research artifact",
        optional:    false,
      },
    ],
  },

  {
    id:                     "learning-heavy",
    name:                   "Learning Heavy Workflow",
    purpose:                "School leads structured learning. Lab stress-tests understanding. Creation applies the knowledge.",
    lead_pioneer:           "claude-architect",
    supporting_pioneers:    ["gemini-expansion", "cursor-builder"],
    home_chamber:           "school",
    participating_chambers: ["school", "lab", "creation"],
    badge:                  "Learning",
    badge_color:            "#4A6B84",
    estimated_quality:      "strong",
    exportable:             true,
    customizable:           true,
    version:                "1.0",
    stages: [
      {
        id:          "acquire",
        label:       "Core Concept Acquisition",
        chamber:     "school",
        pioneer:     "claude-architect",
        description: "School session covers the topic from first principles to mastery check.",
        output_type: "Lesson record + mastery checkpoint",
        optional:    false,
      },
      {
        id:          "stress",
        label:       "Lab Stress Test",
        chamber:     "lab",
        pioneer:     "claude-architect",
        description: "Lab applies the concept to a real problem. Validates actual understanding.",
        output_type: "Application evidence",
        optional:    true,
      },
      {
        id:          "apply",
        label:       "Applied Creation",
        chamber:     "creation",
        pioneer:     "cursor-builder",
        description: "Creation builds something real using the acquired knowledge.",
        output_type: "Knowledge artifact",
        optional:    false,
      },
    ],
  },

  {
    id:                     "balanced-trinity",
    name:                   "Balanced Trinity Workflow",
    purpose:                "Equal weight across all three chambers. No chamber is skipped. Holistic sovereign output.",
    lead_pioneer:           "codex-systems",
    supporting_pioneers:    ["claude-architect", "cursor-builder", "gemini-expansion"],
    home_chamber:           "lab",
    participating_chambers: ["lab", "school", "creation"],
    badge:                  "Trinity",
    badge_color:            "#786220",
    estimated_quality:      "elite",
    exportable:             true,
    customizable:           true,
    version:                "1.0",
    stages: [
      {
        id:          "lab-phase",
        label:       "Lab Intelligence Phase",
        chamber:     "lab",
        pioneer:     "claude-architect",
        description: "Lab establishes analytical foundation. Research, evidence, structure.",
        output_type: "Analysis substrate",
        optional:    false,
      },
      {
        id:          "school-phase",
        label:       "School Curriculum Phase",
        chamber:     "school",
        pioneer:     "claude-architect",
        description: "School organizes findings into structured, learnable knowledge.",
        output_type: "Knowledge curriculum",
        optional:    false,
      },
      {
        id:          "creation-phase",
        label:       "Creation Execution Phase",
        chamber:     "creation",
        pioneer:     "cursor-builder",
        description: "Creation produces the final artifact from both Lab and School output.",
        output_type: "Final sovereign artifact",
        optional:    false,
      },
    ],
  },
];

// ─── Lookups ──────────────────────────────────────────────────────────────────

export function getWorkflow(id: WorkflowId): WorkflowTemplate | undefined {
  return WORKFLOW_TEMPLATES.find((w) => w.id === id);
}

export function getWorkflowsByChamberId(chamber: Exclude<Tab, "profile">): WorkflowTemplate[] {
  return WORKFLOW_TEMPLATES.filter((w) => w.participating_chambers.includes(chamber));
}

export function getWorkflowsByPioneer(pioneerId: PioneerId): WorkflowTemplate[] {
  return WORKFLOW_TEMPLATES.filter(
    (w) => w.lead_pioneer === pioneerId || w.supporting_pioneers.includes(pioneerId)
  );
}
