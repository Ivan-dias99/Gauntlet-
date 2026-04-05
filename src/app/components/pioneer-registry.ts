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
  strengths:             string[];
  must_never_do:         string[];
  default_triggers:      string[];
  description:           string;
  task_fit:              string;
  chamber_fit:           string;
  benchmark_advantage:   string;
  speed_depth_profile:   "speed-heavy" | "balanced" | "depth-heavy";
  memory_behavior:       string;
  avoid_when:            string;
  best_pairing:          string;
  recommended_workflows: string[];
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
    task_fit:            "Research, Synthesis, Canonical Documentation, Deep Logic",
    chamber_fit:         "Lab Primary, School Secondary",
    benchmark_advantage: "Highest safety against hallucination in long-form synthesis",
    speed_depth_profile: "depth-heavy",
    memory_behavior:     "Reads deep context gracefully. Best for L3 Canon memory digestion.",
    avoid_when:          "Need fast, cheap, or simple coding snippets.",
    best_pairing:        "Pairs with Cursor Builder. Architect decides, Builder executes.",
    recommended_workflows: ["Maximum Quality Pipeline", "Research Heavy Workflow"],
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
    task_fit:            "Code Generation, Artifact Output, Build Directives",
    chamber_fit:         "Creation Primary",
    benchmark_advantage: "High structural obedience for direct output rendering",
    speed_depth_profile: "speed-heavy",
    memory_behavior:     "Relies on L1 short session memory for task focus.",
    avoid_when:          "Defining ontology, deep system strategy from scratch.",
    best_pairing:        "Pairs with Claude Architect.",
    recommended_workflows: ["Build Heavy Workflow", "Rapid Prototype to Canon"],
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
    task_fit:            "Orchestration, Type Schema, Runtime Architecture",
    chamber_fit:         "Lab & Creation",
    benchmark_advantage: "Complex relational graph logic execution",
    speed_depth_profile: "depth-heavy",
    memory_behavior:     "Highly attentive to dependency and type constraints.",
    avoid_when:          "Creative writing, UI visual styling, or fast marketing copy.",
    best_pairing:        "Pairs with Copilot QA for edge-case coverage.",
    recommended_workflows: ["Ivan Canonical Sovereign Loop", "Audit → Repair → Canonize"],
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
    task_fit:            "Signal evaluation, Alert triage, Counter-checks",
    chamber_fit:         "Lab (Signal detection)",
    benchmark_advantage: "Fast multi-node check against edge-cases",
    speed_depth_profile: "speed-heavy",
    memory_behavior:     "Ephemeral. Discards depth for fast response.",
    avoid_when:          "Structuring a multi-document canonical truth.",
    best_pairing:        "Pairs with Claude Architect for verification.",
    recommended_workflows: ["Signal → Memory → Directive → Action"],
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
    task_fit:            "Context synthesis, Document mining, Broad search",
    chamber_fit:         "Lab & School",
    benchmark_advantage: "Massive context ingestion without needle-in-haystack loss",
    speed_depth_profile: "depth-heavy",
    memory_behavior:     "Holds entire project codebase or PDF library easily.",
    avoid_when:          "Execution of surgical code alterations in strict formats.",
    best_pairing:        "Pairs with Cursor Builder to supply knowledge.",
    recommended_workflows: ["Learning Heavy Workflow", "Lab → School → Creation Trinity"],
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
    task_fit:            "Linting, Consistency checks, Typo fixes",
    chamber_fit:         "Creation (Finishing layer)",
    benchmark_advantage: "Granular defect detection in established patterns",
    speed_depth_profile: "speed-heavy",
    memory_behavior:     "Relies entirely on immediate diff context.",
    avoid_when:          "Architecting new features.",
    best_pairing:        "Pairs with Cursor Builder.",
    recommended_workflows: ["Repo → Build → Deploy Sovereign Flow"],
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
    task_fit:            "Audits, Quality Control, Gap Analysis, Taxonomy verification",
    chamber_fit:         "Lab Primary, Creation Validation",
    benchmark_advantage: "High adversarial resilience, strong logical gap detection",
    speed_depth_profile: "balanced",
    memory_behavior:     "Analyzes L3 canon memory against L1 session drafts.",
    avoid_when:          "Writing the actual first draft or code.",
    best_pairing:        "Pairs with Claude Architect.",
    recommended_workflows: ["Audit → Repair → Canonize"],
  },
];

// ─── Lookups ──────────────────────────────────────────────────────────────────

export function getPioneer(id: PioneerId): Pioneer | undefined {
  return PIONEER_REGISTRY.find((p) => p.id === id);
}

/** Map intelligence-foundation ids (underscores) to registry pioneers (kebab-case). */
export function getPioneerFromRuntimeId(id: string): Pioneer | undefined {
  const kebab = id.replace(/_/g, "-") as PioneerId;
  return getPioneer(kebab);
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
