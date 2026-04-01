/**
 * RUBERRA VISION DNA — STACK REGISTRY
 * Constitutional Layer · Canonical Truth · Installed 2026-04-01
 *
 * This file is the machine-readable form of the Ruberra Vision DNA.
 * It is not a feature file. It is not a config file.
 * It is the direction the system carries in its bones.
 *
 * DO NOT modify without sovereign authorization.
 * Every field encodes a decision that was made at the constitutional level.
 */

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type StackId =
  | "canon"
  | "mission"
  | "intelligence"
  | "operations"
  | "experience"
  | "security"
  | "governance"
  | "awareness"
  | "flow"
  | "multiagent"
  | "knowledge"
  | "analytics"
  | "collective"
  | "distribution"
  | "value"
  | "ecosystem"
  | "platform"
  | "org"
  | "personal"
  | "compound";

export type StackPriority = "base" | "core" | "scale" | "moat" | "late-stage";

export type StackPhase =
  | "constitution"  // Phase 0 — DNA installation
  | "birth"         // Phase 1 — Stacks 01–02
  | "intelligence"  // Phase 2 — Stacks 03–04
  | "operation"     // Phase 3 — Stacks 05–08
  | "expansion"     // Phase 4 — Stacks 09–13
  | "sovereignty";  // Phase 5 — Stacks 14–20

export interface StackBenchmark {
  /** External tools, patterns, or costs this stack eliminates */
  replaces: string[];
  /** Strongest existing work in this domain to learn from */
  learnsFrom: string[];
  /** Anti-patterns specific to this domain that are rejected */
  rejects: string[];
  /** The operator-felt pain this stack ends */
  resolves: string[];
}

export interface StackEntry {
  /** Canonical numeric order — immutable */
  order: number;
  /** Canonical short identifier */
  id: StackId;
  /** Full canonical V10 name */
  name: string;
  /** Priority classification */
  priority: StackPriority;
  /** Phase in which this stack becomes operational */
  phase: StackPhase;
  /** Stacks that must be installed before this one can operate */
  dependencies: StackId[];
  /** V10 direction — the ten-year forward target for this stack */
  v10: string;
  /** Benchmark encoding for this stack */
  benchmark: StackBenchmark;
}

// ─── STACK REGISTRY ──────────────────────────────────────────────────────────

export const RUBERRA_STACK_REGISTRY: Readonly<StackEntry[]> = [
  {
    order: 1,
    id: "canon",
    name: "Ruberra Canon + Sovereignty Stack",
    priority: "base",
    phase: "birth",
    dependencies: [],
    v10: "The self-validating constitutional kernel. The system proves its own identity at runtime.",
    benchmark: {
      replaces: ["ad hoc product principles", "scattered design docs", "tribal knowledge"],
      learnsFrom: ["constitutional governance models", "RFC processes in mature open source"],
      rejects: ["drift", "feature committees", "consensus-driven identity erosion"],
      resolves: ["direction loss", "pioneer misalignment", "product identity drift over time"],
    },
  },
  {
    order: 2,
    id: "mission",
    name: "Ruberra Mission Substrate Stack",
    priority: "base",
    phase: "birth",
    dependencies: ["canon"],
    v10: "Mission is the atomic unit. Every object, run, signal, and output is bound to a mission. Missions evolve, compound, and transfer.",
    benchmark: {
      replaces: ["task managers", "project trackers", "kanban boards", "Linear", "Notion projects"],
      learnsFrom: ["OKR systems", "military mission planning", "consequence-driven execution models"],
      rejects: ["task-first thinking", "feature-over-mission prioritization", "disconnected to-do lists"],
      resolves: ["loss of mission context across sessions", "fragmentation of output from intent", "work that produces no consequence"],
    },
  },
  {
    order: 3,
    id: "intelligence",
    name: "Ruberra Sovereign Intelligence Stack",
    priority: "core",
    phase: "intelligence",
    dependencies: ["canon", "mission"],
    v10: "A sovereign intelligence routing layer that selects, blends, and trains models based on mission-domain history — no single model dependency.",
    benchmark: {
      replaces: ["single-model lock-in", "hardcoded GPT/Claude calls", "Cursor AI", "Copilot subscriptions"],
      learnsFrom: ["mixture-of-experts routing", "model specialization research", "domain-adapted fine-tuning"],
      rejects: ["decorative AI", "AI that produces no consequence", "model worship over mission service"],
      resolves: ["single model failure brittleness", "generic AI output with no domain fit", "AI costs unaligned with mission value"],
    },
  },
  {
    order: 4,
    id: "operations",
    name: "Ruberra Autonomous Operations Stack",
    priority: "core",
    phase: "intelligence",
    dependencies: ["canon", "mission", "intelligence"],
    v10: "Fully autonomous operational cadence. The system schedules, executes, and audits its own operations without manual triggering.",
    benchmark: {
      replaces: ["cron jobs", "Zapier", "Make", "n8n", "manual workflow triggering"],
      learnsFrom: ["autonomous agent research", "self-healing distributed systems", "operations research"],
      rejects: ["human-in-the-loop for routine work", "brittle automation chains", "tool-hopping orchestration"],
      resolves: ["operator time lost to routine execution", "workflow fragility", "manual scheduling burden"],
    },
  },
  {
    order: 5,
    id: "experience",
    name: "Ruberra Adaptive Experience Stack",
    priority: "core",
    phase: "operation",
    dependencies: ["canon", "mission", "intelligence", "operations"],
    v10: "A living, adaptive environment that reconfigures itself to the operator's current mission phase — not a static UI.",
    benchmark: {
      replaces: ["static SaaS dashboards", "one-size-fits-all UI", "preference panels with no consequence"],
      learnsFrom: ["adaptive interface research", "context-aware computing", "OS-level personalization"],
      rejects: ["cosmetic personalization", "theme pickers that change nothing functional", "dashboard metaphors"],
      resolves: ["cognitive load from irrelevant UI during focused mission work", "context-switching friction"],
    },
  },
  {
    order: 6,
    id: "security",
    name: "Ruberra Sovereign Security Stack",
    priority: "base",
    phase: "operation",
    dependencies: ["canon", "mission", "intelligence"],
    v10: "Zero-trust sovereign security at every layer. No external dependency for trust verification. All data is operator-owned.",
    benchmark: {
      replaces: ["delegated auth to third parties", "cloud-vendor trust models", "security as an add-on"],
      learnsFrom: ["zero-trust architecture", "sovereign data principles", "end-to-end encryption patterns"],
      rejects: ["security theater", "compliance checkbox culture", "trust-by-default external APIs"],
      resolves: ["operator data exposure", "vendor lock-in through data custody", "security as afterthought"],
    },
  },
  {
    order: 7,
    id: "governance",
    name: "Ruberra Trust + Governance Stack",
    priority: "base",
    phase: "operation",
    dependencies: ["canon", "mission", "security"],
    v10: "Full audit trail, provenance chain, and consequence trail for every system action. Governance is not a feature — it is the spine.",
    benchmark: {
      replaces: ["manual audit logs", "disconnected compliance tools", "governance as documentation"],
      learnsFrom: ["blockchain provenance models", "legal chain of custody", "distributed consensus"],
      rejects: ["governance as ceremony", "audit trails that are never read", "compliance over consequence"],
      resolves: ["operator inability to verify what the system did and why", "trust gaps in multi-agent execution"],
    },
  },
  {
    order: 8,
    id: "awareness",
    name: "Ruberra System Awareness Stack",
    priority: "core",
    phase: "operation",
    dependencies: ["canon", "mission", "intelligence", "operations"],
    v10: "The system has a live, accurate model of its own state, health, resources, and trajectory. It surfaces anomalies before operators notice them.",
    benchmark: {
      replaces: ["manual monitoring dashboards", "Datadog for apps not infrastructure", "status pages"],
      learnsFrom: ["observability engineering", "self-aware distributed systems", "predictive monitoring"],
      rejects: ["reactive alerting only", "monitoring that requires operator interpretation", "status that is always green"],
      resolves: ["invisible system degradation", "operator surprise from system failures", "health blind spots"],
    },
  },
  {
    order: 9,
    id: "flow",
    name: "Ruberra Autonomous Flow Stack",
    priority: "scale",
    phase: "expansion",
    dependencies: ["intelligence", "operations", "awareness"],
    v10: "Autonomous multi-step flows execute, recover from failure, and learn from outcomes — no human loop required for routine execution.",
    benchmark: {
      replaces: ["manual multi-step workflows", "brittle automation", "operator-as-glue between tools"],
      learnsFrom: ["self-healing pipeline research", "reinforcement learning from execution outcomes", "fault-tolerant distributed systems"],
      rejects: ["flows that break silently", "flows requiring constant operator supervision", "flows with no memory of prior runs"],
      resolves: ["execution brittleness", "operator time lost to workflow babysitting", "context loss between flow steps"],
    },
  },
  {
    order: 10,
    id: "multiagent",
    name: "Ruberra Multi-Agent Civilization Stack",
    priority: "scale",
    phase: "expansion",
    dependencies: ["intelligence", "operations", "flow"],
    v10: "A civilization of specialized agents, each with sovereign domain authority, collaborating under a single governing intelligence.",
    benchmark: {
      replaces: ["single-agent bottlenecks", "generic AI assistants", "parallel tool calls without coordination"],
      learnsFrom: ["multi-agent systems research", "swarm intelligence", "military unit specialization models"],
      rejects: ["agents without domain authority", "agents that hallucinate coordination", "agent chaos without governance"],
      resolves: ["single-agent throughput limits", "lack of specialization in AI output", "coordination overhead in multi-agent work"],
    },
  },
  {
    order: 11,
    id: "knowledge",
    name: "Ruberra Living Knowledge Stack",
    priority: "scale",
    phase: "expansion",
    dependencies: ["mission", "intelligence", "awareness"],
    v10: "A living knowledge graph that absorbs, connects, and surfaces relevant intelligence across all missions and all history.",
    benchmark: {
      replaces: ["Notion wikis", "Confluence", "static documentation", "disconnected note systems"],
      learnsFrom: ["knowledge graph research", "semantic search", "spaced repetition systems"],
      rejects: ["knowledge that dies when the session ends", "documentation that is never read", "search that returns documents not answers"],
      resolves: ["knowledge decay across sessions", "inability to surface relevant prior work during active missions", "team knowledge silos"],
    },
  },
  {
    order: 12,
    id: "analytics",
    name: "Ruberra Intelligence Analytics Stack",
    priority: "scale",
    phase: "expansion",
    dependencies: ["intelligence", "awareness", "knowledge"],
    v10: "Deep intelligence analytics that reveal patterns, predict outcomes, and surface strategic intelligence — not dashboards.",
    benchmark: {
      replaces: ["BI dashboards", "Mixpanel", "Amplitude", "manual data analysis workflows"],
      learnsFrom: ["predictive analytics research", "strategic intelligence systems", "pattern recognition at scale"],
      rejects: ["vanity metrics", "dashboards that are viewed and forgotten", "analytics decoupled from action"],
      resolves: ["operator inability to see patterns in their own work", "reactive decision-making from lagging indicators"],
    },
  },
  {
    order: 13,
    id: "collective",
    name: "Ruberra Collective Execution Stack",
    priority: "scale",
    phase: "expansion",
    dependencies: ["operations", "flow", "multiagent"],
    v10: "Multiple operators executing under a shared mission graph with consequence attribution and non-collision enforcement.",
    benchmark: {
      replaces: ["shared Google Docs", "Slack threads as execution records", "GitHub issues as mission tracking"],
      learnsFrom: ["distributed systems coordination", "military operations planning", "CRDT-based collaboration"],
      rejects: ["collaboration that destroys individual consequence attribution", "coordination that creates merge conflicts in intent"],
      resolves: ["collision between operators working on shared missions", "loss of individual contribution traceability in collective work"],
    },
  },
  {
    order: 14,
    id: "distribution",
    name: "Ruberra Distribution + Presence Stack",
    priority: "moat",
    phase: "sovereignty",
    dependencies: ["experience", "awareness"],
    v10: "Sovereign presence everywhere operators need to work — not locked to a browser tab.",
    benchmark: {
      replaces: ["browser-only SaaS", "desktop apps with no sync", "mobile apps that are crippled versions"],
      learnsFrom: ["OS-level distribution", "offline-first architecture", "ambient computing"],
      rejects: ["presence that requires internet for basic function", "presence that feels like a different product per platform"],
      resolves: ["operator inability to work in their preferred environment", "context loss when switching devices or modes"],
    },
  },
  {
    order: 15,
    id: "value",
    name: "Ruberra Value Exchange Stack",
    priority: "moat",
    phase: "sovereignty",
    dependencies: ["operations", "governance", "distribution"],
    v10: "A native value exchange layer where mission output becomes transferable, monetizable, and verifiable — no third-party marketplace dependency.",
    benchmark: {
      replaces: ["Gumroad", "Stripe Connect", "third-party marketplaces", "manual invoicing for mission output"],
      learnsFrom: ["sovereign payment rails", "creator economy infrastructure", "programmable money models"],
      rejects: ["value extraction by intermediaries", "platform take rates that erode operator sovereignty", "value locked in closed ecosystems"],
      resolves: ["operator inability to capture value from their mission output within the same system they used to create it"],
    },
  },
  {
    order: 16,
    id: "ecosystem",
    name: "Ruberra Ecosystem Network Stack",
    priority: "late-stage",
    phase: "sovereignty",
    dependencies: ["governance", "distribution", "value"],
    v10: "A sovereign ecosystem of vetted, consequence-bearing extensions — not a plugin marketplace.",
    benchmark: {
      replaces: ["plugin marketplaces", "app stores", "integration directories", "Zapier app ecosystems"],
      learnsFrom: ["curated platform ecosystems", "operating system extension models"],
      rejects: ["extensions that fragment operator attention", "plugins with no consequence binding", "ecosystem as growth hack"],
      resolves: ["capability gaps that require operators to leave Ruberra", "ecosystem fragmentation that breaks system coherence"],
    },
  },
  {
    order: 17,
    id: "platform",
    name: "Ruberra Platform Infrastructure Stack",
    priority: "scale",
    phase: "sovereignty",
    dependencies: ["operations", "security", "governance"],
    v10: "The infrastructure layer is invisible to operators and sovereign to Ruberra — no cloud vendor lock-in at the application layer.",
    benchmark: {
      replaces: ["Vercel", "Supabase as core dependency", "cloud-vendor managed identity"],
      learnsFrom: ["bare-metal sovereignty models", "infrastructure-as-code", "multi-cloud abstraction layers"],
      rejects: ["infrastructure that operators must manage", "infrastructure costs that scale against operator interests", "vendor APIs in the critical path"],
      resolves: ["cloud vendor dependency risk", "infrastructure complexity exposed to operators", "cost unpredictability from vendor pricing changes"],
    },
  },
  {
    order: 18,
    id: "org",
    name: "Ruberra Organizational Intelligence Stack",
    priority: "moat",
    phase: "sovereignty",
    dependencies: ["operations", "awareness", "analytics"],
    v10: "Organizational intelligence that maps team capability, mission health, and execution quality — not HR software.",
    benchmark: {
      replaces: ["HR platforms", "performance review systems", "org chart tools", "team health dashboards"],
      learnsFrom: ["organizational network analysis", "capability mapping research", "execution quality metrics"],
      rejects: ["org intelligence as surveillance", "performance metrics decoupled from mission consequence", "team health theater"],
      resolves: ["organizational blind spots about capability and execution quality", "inability to route missions to the right operators"],
    },
  },
  {
    order: 19,
    id: "personal",
    name: "Ruberra Personal Sovereign OS Stack",
    priority: "moat",
    phase: "sovereignty",
    dependencies: ["experience", "awareness", "knowledge"],
    v10: "A personal sovereign OS that operates on behalf of the individual — persistent, memory-bearing, always-on, always current.",
    benchmark: {
      replaces: ["personal productivity apps", "life OS systems", "Notion personal setups", "second brain tools"],
      learnsFrom: ["personal computing history", "ambient intelligence research", "life management systems"],
      rejects: ["personal OS as another app to maintain", "personal data stored in closed silos", "personal intelligence that resets between sessions"],
      resolves: ["operator need to maintain a personal system separately from their professional mission work"],
    },
  },
  {
    order: 20,
    id: "compound",
    name: "Ruberra Compound Intelligence Network Stack",
    priority: "late-stage",
    phase: "sovereignty",
    dependencies: ["multiagent", "analytics", "collective", "ecosystem", "org", "personal"],
    v10: "The compound intelligence network where every mission, every agent, every operator, and every output compounds into a growing advantage that cannot be replicated by starting over.",
    benchmark: {
      replaces: ["isolated intelligence per session", "AI that learns nothing from prior work", "knowledge that does not compound"],
      learnsFrom: ["network effects research", "compounding systems design", "institutional memory models"],
      rejects: ["intelligence that is stateless by design", "systems where starting over is as good as continuing", "platforms that commoditize their own operators"],
      resolves: ["the fundamental problem of AI amnesia — the inability of systems to compound intelligence across time, missions, and operators"],
    },
  },
] as const;

// ─── LOOKUP HELPERS ───────────────────────────────────────────────────────────

export function getStack(id: StackId): StackEntry | undefined {
  return RUBERRA_STACK_REGISTRY.find((s) => s.id === id);
}

export function getStacksByPriority(priority: StackPriority): StackEntry[] {
  return RUBERRA_STACK_REGISTRY.filter((s) => s.priority === priority);
}

export function getStacksByPhase(phase: StackPhase): StackEntry[] {
  return RUBERRA_STACK_REGISTRY.filter((s) => s.phase === phase);
}

export function getDependenciesFor(id: StackId): StackEntry[] {
  const stack = getStack(id);
  if (!stack) return [];
  return stack.dependencies.map((depId) => getStack(depId)).filter((s): s is StackEntry => s !== undefined);
}

export function getDependentsOf(id: StackId): StackEntry[] {
  return RUBERRA_STACK_REGISTRY.filter((s) => s.dependencies.includes(id));
}

// ─── IDENTITY FILTER ─────────────────────────────────────────────────────────

export type IdentityVerdict = "keep" | "subordinate" | "replace" | "remove";

export interface IdentityFilterResult {
  verdict: IdentityVerdict;
  reason: string;
}

export const RUBERRA_IS: readonly string[] = [
  "sovereign mission operating system",
  "one mother identity",
  "one neural spine",
  "mission-first",
  "chamber-native",
  "consequence-driven",
  "memory-bearing",
  "anti-fragmentation",
  "premium workstation-grade interface",
  "structurally dense with real information",
  "visually calm — mineral, warm stone",
  "alive because the data inside it is alive",
] as const;

export const RUBERRA_IS_NOT: readonly string[] = [
  "SaaS dashboard",
  "generic AI wrapper",
  "clone of GitHub",
  "clone of Copilot",
  "clone of Vercel",
  "clone of Supabase",
  "clone of Notion",
  "clone of Linear",
  "clone of ChatGPT",
  "clone of Claude",
  "clone of Gemini",
  "clone of Grok",
  "clone of Cursor",
  "collection of features",
  "hub of plugins",
  "pretty but dead interface",
  "stack zoo",
  "assistant that forgets",
  "product that rewards fragmentation",
] as const;

export const RUBERRA_CANNOT_BECOME: readonly string[] = [
  "SaaS product with pricing tiers and feature flags",
  "platform that sells integrations as its core value",
  "consumer social product",
  "AI chatbot with a pretty skin",
  "dashboard aggregator",
  "notification hub",
  "product dependent on external tools for core intelligence",
  "product that fragments operator attention",
  "product competing on cheapness, speed-to-ship, or feature count",
] as const;

// ─── VISION PHASE MAP ─────────────────────────────────────────────────────────

export interface PhaseDefinition {
  phase: StackPhase;
  label: string;
  description: string;
  stackIds: StackId[];
  completionCriteria: string[];
}

export const RUBERRA_PHASE_MAP: Readonly<PhaseDefinition[]> = [
  {
    phase: "constitution",
    label: "Phase 0 — Constitution",
    description: "DNA of the system is installed. Identity filter active. Stack registry canonical. No operational stack work begins before this phase is complete.",
    stackIds: [],
    completionCriteria: [
      "RUBERRA_VISION_DNA.md installed in repository",
      "stack-registry.ts installed in codebase",
      "identity filter encoded in codebase",
      "anti-drift law encoded in codebase",
      "cascade law encoded in codebase",
    ],
  },
  {
    phase: "birth",
    label: "Phase 1 — Birth",
    description: "Canon and Mission stacks fully operational. Sovereign identity alive. Mission unit is first-class object. Three chambers consequence-bearing. Profile ledger is source of truth.",
    stackIds: ["canon", "mission"],
    completionCriteria: [
      "Stack 01 (canon) operationally complete",
      "Stack 02 (mission) operationally complete",
      "All three chambers emit consequence objects",
      "Profile ledger reflects real runtime state",
      "Anti-fragmentation law enforced in code",
    ],
  },
  {
    phase: "intelligence",
    label: "Phase 2 — Intelligence",
    description: "Sovereign intelligence routing and autonomous operations fully operational. System has real intelligence routing. Operations make the system self-sustaining in its domain.",
    stackIds: ["intelligence", "operations"],
    completionCriteria: [
      "Stack 03 (intelligence) operationally complete",
      "Stack 04 (operations) operationally complete",
      "Model orchestration serves mission-driven decisions",
      "Operations layer self-sustaining for domain-level tasks",
    ],
  },
  {
    phase: "operation",
    label: "Phase 3 — Operation",
    description: "Experience, security, governance, and awareness stacks operational. System is secure, governed, self-aware, and adaptive. First phase where Ruberra can be trusted with real operator work.",
    stackIds: ["experience", "security", "governance", "awareness"],
    completionCriteria: [
      "Stack 05 (experience) operationally complete",
      "Stack 06 (security) operationally complete",
      "Stack 07 (governance) operationally complete",
      "Stack 08 (awareness) operationally complete",
      "System can be trusted with real operator work without supervision",
    ],
  },
  {
    phase: "expansion",
    label: "Phase 4 — Expansion",
    description: "Flow, multi-agent, knowledge, analytics, and collective stacks operational. System behaves as an organism, not a tool.",
    stackIds: ["flow", "multiagent", "knowledge", "analytics", "collective"],
    completionCriteria: [
      "Stacks 09–13 operationally complete",
      "Autonomous flows execute and recover without operator intervention",
      "Multiple agents collaborate under governing intelligence",
      "Knowledge graph is live and surfacing relevant intelligence",
      "Collective execution is non-colliding and consequence-attributed",
    ],
  },
  {
    phase: "sovereignty",
    label: "Phase 5 — Reach / Sovereignty Scale",
    description: "Distribution, value exchange, ecosystem, platform, org intelligence, personal OS, and compound intelligence become the compounding moat. Ruberra is irreplaceable for its operators.",
    stackIds: ["distribution", "value", "ecosystem", "platform", "org", "personal", "compound"],
    completionCriteria: [
      "Stacks 14–20 operationally complete",
      "Sovereign presence across all operator environments",
      "Native value exchange without third-party marketplace dependency",
      "Compound intelligence network growing across all missions and operators",
      "Starting over is no longer as good as continuing — compounding is real",
    ],
  },
] as const;

// ─── CASCADE LAW ──────────────────────────────────────────────────────────────

/**
 * The Cascade Law encoded as enumerable steps.
 * All pioneers read this before opening any task.
 */
export const CASCADE_LAW_STEPS: readonly string[] = [
  "Inspect latest relevant state only — not all state, only what is relevant to the frontier",
  "Inspect what was completed in the owned frontier",
  "Inspect what remained open",
  "Preserve what is real — real work, real code, real consequence",
  "Remove what is false — duplicates, dead surfaces, weak patterns, anti-Ruberra",
  "Implement only the true frontier — the next real thing, not a detour",
  "Verify — build passes, runtime passes, consequence is real",
  "Repair if partial — partial completion is not completion",
  "Advance — only then open the next frontier",
] as const;

export const CASCADE_LAW_VIOLATIONS: readonly string[] = [
  "Opening a new task while prior residue is open",
  "Implementing decorative surfaces without consequence",
  "Merging work that fails build or runtime",
  "Adding features outside the current owned frontier",
  "Drifting toward the CANNOT list for any reason",
] as const;

// ─── CURRENT PHASE ────────────────────────────────────────────────────────────

/**
 * The current operational phase of Ruberra.
 * Update this only when a phase is formally closed and the next begins.
 * Changing this field is a constitutional act — it requires sovereign authorization.
 */
export const RUBERRA_CURRENT_PHASE: StackPhase = "intelligence";
