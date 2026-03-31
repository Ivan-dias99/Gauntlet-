/**
 * RUBERRA Pioneer Registry
 * Canonical typed definitions for all Ruberra GI pioneers.
 * Source of truth for orchestration, routing, and presence layer.
 */

import { type Tab } from "./shell-types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PioneerId =
  | "claude-architect"
  | "cursor-builder"
  | "codex-systems"
  | "grok-reality"
  | "gemini-expansion"
  | "copilot-qa"
  | "antigravity-director";

export type HostingLevel = "hosted" | "wrapped" | "proxy";
export type Visibility   = "visible" | "hidden" | "advanced";

export interface Pioneer {
  id:                  PioneerId;
  name:                string;
  role:                string;
  short_role:          string;
  home_chamber:        Exclude<Tab, "profile">;
  allowed_crossings:   Exclude<Tab, "profile">[];
  hosting_level:       HostingLevel;
  visibility:          Visibility;
  selectable:          boolean;
  can_spawn_subagents: boolean;
  model_family:        string;
  accent:              string;
  strengths:           string[];
  must_never_do:       string[];
  default_triggers:    string[];
  description:         string;
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const PIONEER_REGISTRY: Pioneer[] = [
  {
    id:                  "claude-architect",
    name:                "Claude Architect",
    role:                "Strategic Research Architect",
    short_role:          "Research",
    home_chamber:        "lab",
    allowed_crossings:   ["lab", "school", "creation"],
    hosting_level:       "wrapped",
    visibility:          "visible",
    selectable:          true,
    can_spawn_subagents: false,
    model_family:        "Claude / Anthropic",
    accent:              "#52796A",
    strengths:           [
      "Long-context synthesis",
      "Evidence evaluation",
      "Multi-source reasoning",
      "Hypothesis structuring",
      "Audit and verification",
    ],
    must_never_do: [
      "Fabricate citations",
      "Overstate confidence",
      "Skip evidence grounding",
    ],
    default_triggers: [
      "Analyze and synthesize",
      "Audit reasoning",
      "Cross-reference sources",
      "Build research structure",
    ],
    description:
      "Leads high-depth research, synthesis, and strategic analysis. Primary intelligence for Lab. Trusted for evidence-heavy reasoning and multi-step structured thought.",
  },
  {
    id:                  "cursor-builder",
    name:                "Cursor Builder",
    role:                "Execution Engineer",
    short_role:          "Build",
    home_chamber:        "creation",
    allowed_crossings:   ["creation", "lab"],
    hosting_level:       "wrapped",
    visibility:          "visible",
    selectable:          true,
    can_spawn_subagents: false,
    model_family:        "GPT / OpenAI",
    accent:              "#8A6238",
    strengths:           [
      "Code generation and architecture",
      "Directive execution",
      "System design",
      "Artifact production",
      "Build sequencing",
    ],
    must_never_do: [
      "Generate non-functional code stubs",
      "Ignore stated constraints",
      "Produce decorative outputs",
    ],
    default_triggers: [
      "Build and implement",
      "Write system architecture",
      "Generate production artifact",
      "Execute directive",
    ],
    description:
      "Primary builder for Creation chamber. Executes code directives, system blueprints, and production artifacts. Pairs with Claude Architect for validated output chains.",
  },
  {
    id:                  "codex-systems",
    name:                "Codex Systems",
    role:                "Runtime Systems Architect",
    short_role:          "Systems",
    home_chamber:        "lab",
    allowed_crossings:   ["lab", "creation"],
    hosting_level:       "wrapped",
    visibility:          "visible",
    selectable:          true,
    can_spawn_subagents: true,
    model_family:        "GPT / OpenAI",
    accent:              "#52796A",
    strengths:           [
      "Orchestration design",
      "Runtime schema architecture",
      "Object graph reasoning",
      "Continuity systems",
      "Type-safe implementation",
    ],
    must_never_do: [
      "Introduce speculative architecture without grounding",
      "Break existing runtime contracts",
      "Leave orphaned types",
    ],
    default_triggers: [
      "Design runtime architecture",
      "Build object graph",
      "Implement typed schema",
      "Orchestrate multi-agent pipeline",
    ],
    description:
      "Designs and implements the runtime truth layer. Responsible for system schemas, orchestration contracts, and object graph integrity across all chambers.",
  },
  {
    id:                  "grok-reality",
    name:                "Grok Reality Pulse",
    role:                "Real-Time Intelligence Broker",
    short_role:          "Reality",
    home_chamber:        "lab",
    allowed_crossings:   ["lab", "school", "creation"],
    hosting_level:       "proxy",
    visibility:          "advanced",
    selectable:          true,
    can_spawn_subagents: false,
    model_family:        "Grok / xAI",
    accent:              "#4A6B84",
    strengths:           [
      "Live signal processing",
      "Speed-first intelligence",
      "Reality-check passes",
      "Rapid hypothesis scoring",
      "Counter-narrative detection",
    ],
    must_never_do: [
      "Present unverified data as fact",
      "Lead long-form structured builds",
      "Replace deep synthesis work",
    ],
    default_triggers: [
      "Quick reality check",
      "Fast intelligence pass",
      "Counter-check hypothesis",
      "Live signal scan",
    ],
    description:
      "Rapid-response intelligence broker. Best deployed for reality checks, live signal processing, and fast-pass validation. Proxy-hosted — output must be verified by Claude Architect before use in structured deliverables.",
  },
  {
    id:                  "gemini-expansion",
    name:                "Gemini Expansion",
    role:                "Context Expansion Specialist",
    short_role:          "Context",
    home_chamber:        "lab",
    allowed_crossings:   ["lab", "school", "creation"],
    hosting_level:       "wrapped",
    visibility:          "visible",
    selectable:          true,
    can_spawn_subagents: false,
    model_family:        "Gemini / Google",
    accent:              "#4A6B84",
    strengths:           [
      "Ultra-long context handling",
      "Cross-modal search and synthesis",
      "Curriculum mapping",
      "Knowledge graph expansion",
      "Rapid orchestration support",
    ],
    must_never_do: [
      "Hallucinate citations",
      "Lead depth-sensitive reasoning alone",
      "Replace audit functions",
    ],
    default_triggers: [
      "Expand context window",
      "Map knowledge graph",
      "Cross-reference large corpus",
      "Support orchestration layer",
    ],
    description:
      "Specializes in ultra-long context operations, knowledge expansion, and fast orchestration support. Natural support pioneer for Claude Architect in research-heavy workflows.",
  },
  {
    id:                  "copilot-qa",
    name:                "Copilot QA Guard",
    role:                "Quality Assurance and Consistency Controller",
    short_role:          "QA",
    home_chamber:        "creation",
    allowed_crossings:   ["creation", "lab", "school"],
    hosting_level:       "proxy",
    visibility:          "advanced",
    selectable:          false,
    can_spawn_subagents: false,
    model_family:        "GPT / Microsoft",
    accent:              "#786220",
    strengths:           [
      "Code review and cleanup",
      "Consistency enforcement",
      "Edge case coverage",
      "Small refactor execution",
      "Type correctness validation",
    ],
    must_never_do: [
      "Lead structural design decisions",
      "Override architect decisions",
      "Introduce new product directions",
    ],
    default_triggers: [
      "Review and clean up",
      "Check consistency",
      "Catch edge cases",
      "Finalize small fixes",
    ],
    description:
      "Deployed at the tail of build chains for quality, consistency, and cleanup. Not a lead pioneer — supports Cursor Builder and Codex Systems as a finishing pass. Proxy-hosted.",
  },
  {
    id:                  "antigravity-director",
    name:                "Antigravity Surface Director",
    role:                "Strategic Audit and Gap Detection Director",
    short_role:          "Audit",
    home_chamber:        "lab",
    allowed_crossings:   ["lab", "school", "creation"],
    hosting_level:       "hosted",
    visibility:          "visible",
    selectable:          true,
    can_spawn_subagents: false,
    model_family:        "Gemini / Google",
    accent:              "#4A6B84",
    strengths:           [
      "Strategic gap detection",
      "Taxonomy auditing",
      "Content integrity review",
      "Product surface analysis",
      "Ontology verification",
    ],
    must_never_do: [
      "Implement runtime code",
      "Redesign approved surfaces",
      "Introduce new product directions without prompt",
    ],
    default_triggers: [
      "Audit product surface",
      "Detect taxonomy gaps",
      "Review strategic alignment",
      "Verify ontology integrity",
    ],
    description:
      "Strategic audit lead. Defines the gap map before any implementation pass. Verifies product integrity and taxonomy correctness. Hosted — highest trust for strategic directives.",
  },
];

// ─── Lookups ──────────────────────────────────────────────────────────────────

export function getPioneer(id: PioneerId): Pioneer | undefined {
  return PIONEER_REGISTRY.find((p) => p.id === id);
}

export function getPioneersByChamberId(chamber: Exclude<Tab, "profile">): Pioneer[] {
  return PIONEER_REGISTRY.filter(
    (p) => p.home_chamber === chamber || p.allowed_crossings.includes(chamber)
  );
}

export function getSelectablePioneers(): Pioneer[] {
  return PIONEER_REGISTRY.filter((p) => p.selectable && p.visibility !== "hidden");
}

export function getVisiblePioneers(): Pioneer[] {
  return PIONEER_REGISTRY.filter((p) => p.visibility === "visible");
}

export const PIONEER_BY_CHAMBER: Record<Exclude<Tab, "profile">, PioneerId[]> = {
  lab:      ["claude-architect", "codex-systems", "gemini-expansion", "grok-reality", "antigravity-director"],
  school:   ["claude-architect", "gemini-expansion", "grok-reality"],
  creation: ["cursor-builder", "codex-systems", "copilot-qa", "claude-architect"],
};
