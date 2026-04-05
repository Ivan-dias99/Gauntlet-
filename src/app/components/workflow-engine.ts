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
  | "ivan-sovereign-loop"
  | "rapid-prototype"
  | "audit-repair"
  | "signal-action"
  | "repo-deploy";

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
  best_use_case:         string;
  chamber_sequence:      string;
  pioneer_stack:         string;
  output_type:           string;
  quality_speed_profile: string;
  tradeoffs:             string;
  when_not_to_use:       string;
  memory_consequence_effect: string;
  user_customization_path: string;
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
    best_use_case:          "Production-grade complex outputs requiring 0 hallucination.",
    chamber_sequence:       "Lab -> Creation -> Lab",
    pioneer_stack:          "Antigravity, Codex, Cursor, Copilot",
    output_type:            "Typed schemas, validated codebase, gap map.",
    quality_speed_profile:  "Quality / Depth over Speed",
    tradeoffs:              "Slow. Requires high memory footprint. Verbose execution trail.",
    when_not_to_use:        "Quick scripts, casual brainstorming, minor UI tweaks.",
    memory_consequence_effect: "Establishes canonical Layer 3 memory. Hard to override once committed.",
    user_customization_path: "Adjust audit sensitivity in Settings -> Sovereign Runtime.",
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
    best_use_case:          "Creating large-scale educational content, whitepapers, or robust system documentation.",
    chamber_sequence:       "School -> Lab -> Creation",
    pioneer_stack:          "Claude Architect, Gemini, Cursor",
    output_type:            "Concept map, Audit evidence, Full publication.",
    quality_speed_profile:  "Quality over Speed",
    tradeoffs:              "Resource-intensive. Slower iterations.",
    when_not_to_use:        "When you already have absolute domain expertise and just need code.",
    memory_consequence_effect: "Injects heavy context into L2 active memory. Requires flush after.",
    user_customization_path: "Toggle Lab validation strictness.",
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
    best_use_case:          "Fast iterations, direct code replacement, quick script generation.",
    chamber_sequence:       "Creation -> Lab (optional)",
    pioneer_stack:          "Cursor Builder, Codex Systems",
    output_type:            "Working code artifact, deployable scripts.",
    quality_speed_profile:  "Speed over Depth",
    tradeoffs:              "Risk of regression. No deep architectural foresight.",
    when_not_to_use:        "Core structural system changes or database migrations.",
    memory_consequence_effect: "Ephemeral. Relies on L1 session, generates little permanent footprint unless explicitly saved.",
    user_customization_path: "Bypass optional Lab audit completely.",
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
    best_use_case:          "Deeply researching a new domain or auditing complex, multi-source evidence before touching code.",
    chamber_sequence:       "Lab -> School -> Creation",
    pioneer_stack:          "Claude Architect, Grok Reality, Gemini Expansion",
    output_type:            "Research findings, Credibility scores, Published structured notes.",
    quality_speed_profile:  "Depth over Speed",
    tradeoffs:              "Generates extreme text volume. Consumes large token limits.",
    when_not_to_use:        "Straightforward debugging or syntax checking.",
    memory_consequence_effect: "Massive context expansion. Will flood active memory unless committed to Layer 3 immediately.",
    user_customization_path: "Skip School structuring if purely for internal reference.",
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
    best_use_case:          "Mastering a foreign codebase or learning an unfamiliar technology via active execution.",
    chamber_sequence:       "School -> Lab -> Creation",
    pioneer_stack:          "Claude Architect, Gemini, Cursor Builder",
    output_type:            "Lesson records, Mastery checks, Applied artifact.",
    quality_speed_profile:  "Pedagogical depth over pure output speed",
    tradeoffs:              "Deliberately slow. Will refuse to write code until the user passes mastery checks.",
    when_not_to_use:        "Pressing production deadlines.",
    memory_consequence_effect: "Tags objects as 'Learning Thread'. Protects them from aggressive garbage collection.",
    user_customization_path: "Adjust school strictness to allow more code hints.",
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
    best_use_case:          "Building a feature from scratch that requires deep domain logic, user education, and immediate execution.",
    chamber_sequence:       "Lab -> School -> Creation",
    pioneer_stack:          "Codex Systems, Claude, Cursor",
    output_type:            "Analysis substrate, Knowledge curriculum, Final code artifact.",
    quality_speed_profile:  "Balanced execution across all three axes",
    tradeoffs:              "Most rigid sequence. Does not allow skipping chambers.",
    when_not_to_use:        "When only one type of work is needed (e.g., just code or just research).",
    memory_consequence_effect: "Aligns memory perfectly across all three chambers. Ultimate continuity stability.",
    user_customization_path: "Hardcoded progression; user can only adjust pioneer selection per chamber.",
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

  {
    id:                     "rapid-prototype",
    name:                   "Rapid Prototype to Canon",
    purpose:                "Build something quickly in Creation, then run it through Lab to canonicalize the patterns.",
    lead_pioneer:           "cursor-builder",
    supporting_pioneers:    ["claude-architect"],
    home_chamber:           "creation",
    participating_chambers: ["creation", "lab"],
    badge:                  "Prototype",
    badge_color:            "#8A6238",
    estimated_quality:      "good",
    exportable:             true,
    customizable:           true,
    version:                "1.0",
    best_use_case:          "Fast iterations testing a new idea, then immediately saving the result as standard canon.",
    chamber_sequence:       "Creation -> Lab",
    pioneer_stack:          "Cursor Builder -> Claude Architect",
    output_type:            "Working prototype + Canonical note.",
    quality_speed_profile:  "Speed first, then immediate Quality alignment.",
    tradeoffs:              "Double handling of code. Might throw away work during Lab pass.",
    when_not_to_use:        "When building core infrastructure.",
    memory_consequence_effect: "Overwrites L1 draft state with L3 permanent schema.",
    user_customization_path: "Skip Lab step if prototype fails.",
    stages: [
      {
        id:          "prototype-build",
        label:       "Prototype Build",
        chamber:     "creation",
        pioneer:     "cursor-builder",
        description: "Cursor Builder rapidly scaffolds out the concept without strict guardrails.",
        output_type: "Draft code",
        optional:    false,
      },
      {
        id:          "canonize",
        label:       "Lab Canonization",
        chamber:     "lab",
        pioneer:     "claude-architect",
        description: "Claude reviews the prototype code and extracts reusable patterns for the system canon.",
        output_type: "Canonical note",
        optional:    false,
      },
    ],
  },

  {
    id:                     "audit-repair",
    name:                   "Audit → Repair → Canonize",
    purpose:                "Find system drift, fix the code, and lock down the new standard.",
    lead_pioneer:           "antigravity-director",
    supporting_pioneers:    ["cursor-builder", "codex-systems"],
    home_chamber:           "lab",
    participating_chambers: ["lab", "creation"],
    badge:                  "Repair",
    badge_color:            "#52796A",
    estimated_quality:      "elite",
    exportable:             true,
    customizable:           false,
    version:                "1.0",
    best_use_case:          "Cleaning up legacy code or resolving deep architectural tech debt.",
    chamber_sequence:       "Lab -> Creation",
    pioneer_stack:          "Antigravity Director -> Cursor Builder",
    output_type:            "Refactored code + Security Audit.",
    quality_speed_profile:  "Methodical depth.",
    tradeoffs:              "Extremely strict. Halts progress until debt is paid.",
    when_not_to_use:        "Feature development.",
    memory_consequence_effect: "Purges obsolete nodes from memory graph.",
    user_customization_path: "None.",
    stages: [
      {
        id:          "system-audit",
        label:       "System Audit",
        chamber:     "lab",
        pioneer:     "antigravity-director",
        description: "Antigravity maps exact tech debt and anti-patterns.",
        output_type: "Debt manifest",
        optional:    false,
      },
      {
        id:          "repair-build",
        label:       "Repair Build",
        chamber:     "creation",
        pioneer:     "cursor-builder",
        description: "Cursor implements strict architectural fixes with no scope creep.",
        output_type: "Clean code",
        optional:    false,
      },
    ],
  },

  {
    id:                     "signal-action",
    name:                   "Signal → Memory → Directive → Action",
    purpose:                "Rapidly process an external trigger and turn it into executed product.",
    lead_pioneer:           "grok-reality",
    supporting_pioneers:    ["claude-architect", "cursor-builder"],
    home_chamber:           "lab",
    participating_chambers: ["lab", "creation"],
    badge:                  "Action",
    badge_color:            "#4A6B84",
    estimated_quality:      "strong",
    exportable:             true,
    customizable:           true,
    version:                "1.0",
    best_use_case:          "Acting on a live alert or user feedback immediately.",
    chamber_sequence:       "Lab -> Creation",
    pioneer_stack:          "Grok -> Claude -> Cursor",
    output_type:            "Live patch.",
    quality_speed_profile:  "Speed to Resolution.",
    tradeoffs:              "Relies heavily on system assumptions.",
    when_not_to_use:        "Large structural changes.",
    memory_consequence_effect: "Leaves minimal trace beyond the exact patch footprint.",
    user_customization_path: "Bypass Claude translation if simple.",
    stages: [
      {
        id:          "signal-triage",
        label:       "Signal Triage",
        chamber:     "lab",
        pioneer:     "grok-reality",
        description: "Grok reality-checks the incoming signal.",
        output_type: "Validated severity check",
        optional:    false,
      },
      {
        id:          "patch-execution",
        label:       "Patch Execution",
        chamber:     "creation",
        pioneer:     "cursor-builder",
        description: "Cursor implements the patch.",
        output_type: "Patched code",
        optional:    false,
      },
    ],
  },

  {
    id:                     "repo-deploy",
    name:                   "Repo → Build → Deploy Sovereign Flow",
    purpose:                "End-to-end autonomous code publishing from mission start to live URL.",
    lead_pioneer:           "cursor-builder",
    supporting_pioneers:    ["copilot-qa", "codex-systems"],
    home_chamber:           "creation",
    participating_chambers: ["creation"],
    badge:                  "Ship",
    badge_color:            "#8A6238",
    estimated_quality:      "strong",
    exportable:             true,
    customizable:           true,
    version:                "1.0",
    best_use_case:          "Standard continuous deployment and integration runs.",
    chamber_sequence:       "Creation",
    pioneer_stack:          "Cursor -> Copilot QA",
    output_type:            "Live URL.",
    quality_speed_profile:  "Speed over Depth.",
    tradeoffs:              "Cannot handle architectural pivots during run.",
    when_not_to_use:        "When architecture is undefined.",
    memory_consequence_effect: "Tags the commit in L1 memory and closes the branch loop.",
    user_customization_path: "Bypass QA step if emergency.",
    stages: [
      {
        id:          "pre-flight",
        label:       "Pre-Flight Build",
        chamber:     "creation",
        pioneer:     "cursor-builder",
        description: "Execute the main build command to verify the app compiles.",
        output_type: "Build success state",
        optional:    false,
      },
      {
        id:          "qa-guard",
        label:       "Lint & Guard",
        chamber:     "creation",
        pioneer:     "copilot-qa",
        description: "Lint the output and catch any loose wires or regressions.",
        output_type: "QA Sign-off",
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

// ─── Runtime bridge ───────────────────────────────────────────────────────────

/**
 * Build the payload required by runtime-fabric.startWorkflowRun().
 * Bridges the typed WorkflowTemplate definition to the runtime execution record.
 */
export function buildWorkflowRunPayload(
  workflowId: WorkflowId,
  continuityId: string,
): { workflowId: string; continuityId: string; chamber: Exclude<Tab, "profile">; stages: string[] } | undefined {
  const template = getWorkflow(workflowId);
  if (!template) return undefined;
  return {
    workflowId:   template.id,
    continuityId,
    chamber:      template.home_chamber,
    stages:       template.stages.map((s) => s.label),
  };
}

/** Stages assigned to a specific chamber within a workflow. */
export function getStagesForChamber(
  workflowId: WorkflowId,
  chamber: Exclude<Tab, "profile">,
): WorkflowStage[] {
  const template = getWorkflow(workflowId);
  if (!template) return [];
  return template.stages.filter((s) => s.chamber === chamber);
}

/**
 * Ordered list of chambers a workflow passes through, deduplicated.
 * Used to drive cross-chamber handoff signals.
 */
export function getWorkflowHandoffChambers(workflowId: WorkflowId): Exclude<Tab, "profile">[] {
  const template = getWorkflow(workflowId);
  if (!template) return [];
  const seen = new Set<Exclude<Tab, "profile">>();
  const result: Exclude<Tab, "profile">[] = [];
  for (const stage of template.stages) {
    if (!seen.has(stage.chamber)) { seen.add(stage.chamber); result.push(stage.chamber); }
  }
  return result;
}

/** Next chamber in the workflow after the current one. Used for auto-transfer signals. */
export function getNextWorkflowChamber(
  workflowId: WorkflowId,
  currentChamber: Exclude<Tab, "profile">,
): Exclude<Tab, "profile"> | undefined {
  const chain = getWorkflowHandoffChambers(workflowId);
  const idx   = chain.indexOf(currentChamber);
  return idx >= 0 ? chain[idx + 1] : undefined;
}
