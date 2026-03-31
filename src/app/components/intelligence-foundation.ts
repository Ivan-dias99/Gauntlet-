import { type Tab } from "./shell-types";

export type HostingLevel = "hosted" | "wrapped" | "proxy";
export type VisibilityLevel = "visible" | "hidden" | "advanced";
export type IntelligenceClass = "sovereign_pioneer" | "chamber_native" | "cross_chamber" | "system_hidden" | "connector_bound";
export type PresenceSourceType = "chamber_default" | "workflow" | "pioneer" | "subagent" | "connector_action";

export interface PioneerDefinition {
  id: string;
  name: string;
  role: string;
  homeChamber: Tab;
  allowedCrossings: Tab[];
  hostingLevel: HostingLevel;
  visibility: VisibilityLevel;
  selectable: boolean;
  canSpawnSubagents: boolean;
  strengths: string[];
  mustNeverDo: string[];
}

export interface GIDefinition {
  id: string;
  name: string;
  class: IntelligenceClass;
  chamber: Tab;
  manualInvoke: boolean;
  autoTrigger: boolean;
  outputContract: string;
  dependencies: string[];
}

export interface SubagentDefinition {
  id: string;
  name: string;
  parentPioneerId: string;
  chamber: Tab;
  taskScope: string[];
  visibility: VisibilityLevel;
  memoryBehavior: "session" | "continuity" | "none";
  outputContract: string;
  spawnWhen: string[];
  doNotSpawnWhen: string[];
}

export type ConnectorCapability = "read" | "write" | "sync" | "export" | "deploy" | "webhook";
export interface ConnectorRegistryItem {
  id: string;
  label: string;
  category: "source" | "build" | "deploy" | "knowledge" | "media" | "automation" | "model_provider";
  organs: Tab[];
  capabilities: ConnectorCapability[];
  appearsInProfile: boolean;
  appearsInChambers: Tab[];
  unlocks: string[];
  workflowDependencies: string[];
  giFamilies: string[];
}

export interface WorkflowTemplate {
  id: string;
  label: string;
  intent: string;
  homeChamber: Tab;
  pioneers: string[];
  subagents: string[];
  crossChamberPattern: Tab[];
  stages: string[];
  outputs: string[];
  exportable: boolean;
  customizableFields: string[];
  version: string;
}

export interface WorkflowPairing {
  id: string;
  label: string;
  workflowIds: string[];
  reason: string;
}

export interface WorkflowExecutionExample {
  id: string;
  workflowId: string;
  title: string;
  stageTrace: string[];
  expectedOutputs: string[];
}

export interface WorkflowExportPack {
  schemaVersion: string;
  workflowId: string;
  exportedAt: number;
  includePolicies: boolean;
}

export interface CustomWorkflowSkeleton {
  id: string;
  label: string;
  baseTemplateId?: string;
  chamber: Tab;
  pioneerStack: string[];
  stageOverrides: string[];
  connectorScopes: string[];
}

export interface ChamberRoutingContract {
  chamber: Tab;
  leadIntelligences: string[];
  autoTriggers: string[];
  handoffTargets: Tab[];
  priorityTasks: string[];
}

export interface ProvenanceTraceEvent {
  id: string;
  timestamp: number;
  continuityId?: string;
  sourceType: PresenceSourceType;
  sourceId: string;
  chamber: Tab;
  action: string;
  metadata?: Record<string, string>;
}

export interface PresenceMetadata {
  leaderType: PresenceSourceType;
  leaderId: string;
  chamber: Tab;
  workflowId?: string;
  activeSubagents: string[];
  connectorActions: string[];
  memoryBound: boolean;
}

export interface ChamberMemoryState {
  chamber: Tab;
  lastContinuityId?: string;
  pinnedObjectIds: string[];
  summarizedContext?: string;
  updatedAt: number;
}

export interface MemoryContinuityState {
  sessionMemoryId: string;
  chamberMemory: ChamberMemoryState[];
  workflowMemoryIds: string[];
  pioneerMemoryIds: string[];
  artifactMemoryIds: string[];
}

export interface CardVisualSignature {
  family: "lab" | "school" | "creation" | "profile";
  colorOwnership: string;
  motherIdentity: string;
  immersionLevel: "light" | "focused" | "deep";
}

export interface ChamberEntry {
  id: string;
  title: string;
  chamber: Tab;
  openRoute: { tab: Tab; view: string; id?: string };
  tags: string[];
}

export interface ProjectCard {
  id: string;
  title: string;
  chamber: Tab;
  visual: CardVisualSignature;
  previewSource: { mode: "placeholder" | "generated"; uri?: string };
  detailContextId: string;
  bucket: "recommended" | "recent" | "active" | "flagship";
}

export interface ArtifactCard extends ProjectCard {
  artifactType: string;
  archiveEntryId?: string;
}

export interface SubjectSurface {
  id: string;
  label: string;
  chamber: Tab;
  entries: ChamberEntry[];
}

export interface ChamberCollection {
  chamber: Tab;
  surfaces: SubjectSurface[];
}

export interface DeepPageContext {
  id: string;
  title: string;
  summary: string;
  relatedCardIds: string[];
}

export interface ProjectCanvas {
  id: string;
  title: string;
  owner: string;
  collections: ChamberCollection[];
  projectCards: ProjectCard[];
  artifactCards: ArtifactCard[];
  deepContexts: DeepPageContext[];
}

export interface ModelProviderDefinition {
  id: string;
  label: string;
  lane: "open_source_local" | "free_provider" | "wrapped_external" | "premium_hosted_future";
  status: "can_host_now" | "future_integration";
  capabilities: string[];
  chamberSafety: Tab[];
}

export interface IntelligenceFoundationState {
  pioneers: PioneerDefinition[];
  giRegistry: GIDefinition[];
  subagents: SubagentDefinition[];
  connectorRegistry: ConnectorRegistryItem[];
  workflowTemplates: WorkflowTemplate[];
  routingContracts: ChamberRoutingContract[];
  presence: PresenceMetadata;
  traceEvents: ProvenanceTraceEvent[];
  memory: MemoryContinuityState;
  workflowPairings: WorkflowPairing[];
  workflowExecutionExamples: WorkflowExecutionExample[];
  workflowExports: WorkflowExportPack[];
  customWorkflowSkeletons: CustomWorkflowSkeleton[];
  providerRegistry: ModelProviderDefinition[];
  projectCanvases: ProjectCanvas[];
}

export const PIONEER_REGISTRY: PioneerDefinition[] = [
  { id: "claude_architect", name: "Claude Architect", role: "canonical architecture and law arbitration", homeChamber: "profile", allowedCrossings: ["lab", "school", "creation", "profile"], hostingLevel: "proxy", visibility: "visible", selectable: true, canSpawnSubagents: true, strengths: ["architecture", "governance", "synthesis"], mustNeverDo: ["fabricate execution", "override chamber identity"] },
  { id: "cursor_builder", name: "Cursor Builder", role: "implementation and integration execution", homeChamber: "creation", allowedCrossings: ["lab", "creation", "profile"], hostingLevel: "proxy", visibility: "visible", selectable: true, canSpawnSubagents: true, strengths: ["build execution", "integration", "refactor"], mustNeverDo: ["rewrite product root", "weaken creation terminal supremacy"] },
  { id: "codex_systems", name: "Codex Systems", role: "runtime systems and foundation contracts", homeChamber: "lab", allowedCrossings: ["lab", "school", "creation", "profile"], hostingLevel: "proxy", visibility: "visible", selectable: true, canSpawnSubagents: true, strengths: ["typed systems", "runtime architecture", "orchestration"], mustNeverDo: ["ship decorative logic", "introduce duplicate truth sources"] },
  { id: "grok_reality_pulse", name: "Grok Reality Pulse", role: "external pulse and contradiction scanning", homeChamber: "lab", allowedCrossings: ["lab", "school", "profile"], hostingLevel: "wrapped", visibility: "advanced", selectable: true, canSpawnSubagents: false, strengths: ["trend pulse", "contradiction scan"], mustNeverDo: ["claim certainty without sources"] },
  { id: "gemini_expansion", name: "Gemini Expansion", role: "option expansion and synthesis compression", homeChamber: "school", allowedCrossings: ["lab", "school", "creation"], hostingLevel: "wrapped", visibility: "visible", selectable: true, canSpawnSubagents: true, strengths: ["expansion", "synthesis", "comparatives"], mustNeverDo: ["erase canonical constraints"] },
  { id: "copilot_qa_guard", name: "Copilot QA Guard", role: "quality and regression guard", homeChamber: "profile", allowedCrossings: ["lab", "school", "creation", "profile"], hostingLevel: "proxy", visibility: "hidden", selectable: true, canSpawnSubagents: false, strengths: ["consistency", "edge-case checks"], mustNeverDo: ["replace primary strategy decisions"] },
  { id: "antigravity_surface_director", name: "Antigravity Surface Director", role: "surface closure direction over proven runtime truth", homeChamber: "creation", allowedCrossings: ["school", "creation", "profile"], hostingLevel: "proxy", visibility: "advanced", selectable: true, canSpawnSubagents: false, strengths: ["surface polish guidance", "motion and spacing direction"], mustNeverDo: ["mutate runtime contracts"] },
];

export const GI_REGISTRY: GIDefinition[] = [
  { id: "lab_analyst_core", name: "Lab Analyst Core", class: "chamber_native", chamber: "lab", manualInvoke: true, autoTrigger: true, outputContract: "analysis|evidence|verdict blocks", dependencies: ["codex_systems"] },
  { id: "school_tutor_core", name: "School Tutor Core", class: "chamber_native", chamber: "school", manualInvoke: true, autoTrigger: true, outputContract: "lesson|framework|progress blocks", dependencies: ["gemini_expansion"] },
  { id: "creation_build_core", name: "Creation Build Core", class: "chamber_native", chamber: "creation", manualInvoke: true, autoTrigger: true, outputContract: "build plan|artifact package", dependencies: ["cursor_builder"] },
  { id: "profile_ledger_core", name: "Profile Ledger Core", class: "chamber_native", chamber: "profile", manualInvoke: true, autoTrigger: true, outputContract: "continuity|recommendation|orchestration records", dependencies: ["claude_architect", "copilot_qa_guard"] },
  { id: "router_gi", name: "Router GI", class: "cross_chamber", chamber: "profile", manualInvoke: false, autoTrigger: true, outputContract: "lead chamber + pioneer route", dependencies: ["profile_ledger_core"] },
];

export const SUBAGENT_REGISTRY: SubagentDefinition[] = [
  { id: "research_analyst", name: "Research Analyst", parentPioneerId: "codex_systems", chamber: "lab", taskScope: ["research clustering", "hypothesis expansion"], visibility: "visible", memoryBehavior: "continuity", outputContract: "research pack", spawnWhen: ["investigation asks", "evidence gaps"], doNotSpawnWhen: ["simple short answers"] },
  { id: "evidence_mapper", name: "Evidence Mapper", parentPioneerId: "claude_architect", chamber: "lab", taskScope: ["claim-source map", "confidence tagging"], visibility: "advanced", memoryBehavior: "continuity", outputContract: "evidence map", spawnWhen: ["verdict requests"], doNotSpawnWhen: ["no evidence required"] },
  { id: "curriculum_builder", name: "Curriculum Builder", parentPioneerId: "gemini_expansion", chamber: "school", taskScope: ["track plans", "lesson sequencing"], visibility: "visible", memoryBehavior: "continuity", outputContract: "curriculum graph", spawnWhen: ["learning plan asks"], doNotSpawnWhen: ["execution-only asks"] },
  { id: "build_planner", name: "Build Planner", parentPioneerId: "cursor_builder", chamber: "creation", taskScope: ["build staging", "artifact package plans"], visibility: "visible", memoryBehavior: "continuity", outputContract: "build pipeline", spawnWhen: ["build/deploy asks"], doNotSpawnWhen: ["pure study asks"] },
  { id: "connector_manager", name: "Connector Manager", parentPioneerId: "codex_systems", chamber: "profile", taskScope: ["connector scope control", "health checks"], visibility: "advanced", memoryBehavior: "session", outputContract: "connector action plans", spawnWhen: ["connector mutations"], doNotSpawnWhen: ["offline no-connector tasks"] },
];

export const CONNECTOR_REGISTRY: ConnectorRegistryItem[] = [
  { id: "github", label: "GitHub", category: "source", organs: ["lab", "creation", "profile"], capabilities: ["read", "write", "sync", "deploy"], appearsInProfile: true, appearsInChambers: ["lab", "creation"], unlocks: ["repo sync", "PR operations"], workflowDependencies: ["build_pipeline", "research_to_build"], giFamilies: ["build_planner", "research_analyst"] },
  { id: "supabase", label: "Supabase", category: "build", organs: ["creation", "profile"], capabilities: ["read", "write", "deploy"], appearsInProfile: true, appearsInChambers: ["creation"], unlocks: ["runtime deploy", "data operations"], workflowDependencies: ["build_pipeline"], giFamilies: ["build_planner"] },
  { id: "figma", label: "Figma", category: "media", organs: ["creation"], capabilities: ["read", "export"], appearsInProfile: true, appearsInChambers: ["creation"], unlocks: ["design extraction"], workflowDependencies: ["design_to_build"], giFamilies: ["build_planner"] },
  { id: "notion", label: "Notion", category: "knowledge", organs: ["school", "profile"], capabilities: ["read", "write", "sync"], appearsInProfile: true, appearsInChambers: ["school"], unlocks: ["knowledge sync"], workflowDependencies: ["learning_pipeline"], giFamilies: ["curriculum_builder"] },
  { id: "webhooks", label: "Webhooks", category: "automation", organs: ["profile", "creation"], capabilities: ["webhook", "export"], appearsInProfile: true, appearsInChambers: ["creation"], unlocks: ["workflow automation"], workflowDependencies: ["canonical_loop"], giFamilies: ["connector_manager"] },
];

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  { id: "canonical_loop", label: "Ivan Canonical Loop", intent: "single-command sovereign orchestration", homeChamber: "profile", pioneers: ["claude_architect", "codex_systems", "cursor_builder", "copilot_qa_guard"], subagents: ["research_analyst", "curriculum_builder", "build_planner"], crossChamberPattern: ["profile", "lab", "school", "creation", "profile"], stages: ["intake", "route", "execute", "validate", "package", "ledger_close"], outputs: ["trace bundle", "export package", "next-step recommendations"], exportable: true, customizableFields: ["pioneers", "stages", "connector scope"], version: "1.0.0" },
  { id: "build_pipeline", label: "Build Heavy Pipeline", intent: "creation-led implementation and export", homeChamber: "creation", pioneers: ["cursor_builder", "codex_systems", "copilot_qa_guard"], subagents: ["build_planner", "connector_manager"], crossChamberPattern: ["creation", "lab", "profile"], stages: ["plan", "execute", "verify", "export"], outputs: ["artifact", "deployment trace"], exportable: true, customizableFields: ["connector scope", "verification policy"], version: "1.0.0" },
];

export const WORKFLOW_PAIRINGS: WorkflowPairing[] = [
  { id: "pair-research-build", label: "Research → Build", workflowIds: ["canonical_loop", "build_pipeline"], reason: "convert validated analysis into shipped artifacts" },
];

export const WORKFLOW_EXECUTION_EXAMPLES: WorkflowExecutionExample[] = [
  { id: "ex-canonical-01", workflowId: "canonical_loop", title: "Flagship Ivan Workflow Example", stageTrace: ["intake", "route", "execute", "validate", "package", "ledger_close"], expectedOutputs: ["trace bundle", "artifact package", "continuity recommendation"] },
];

export const CUSTOM_WORKFLOW_SKELETONS: CustomWorkflowSkeleton[] = [
  { id: "custom-skeleton-1", label: "Custom Sovereign Skeleton", baseTemplateId: "canonical_loop", chamber: "profile", pioneerStack: ["claude_architect", "codex_systems"], stageOverrides: [], connectorScopes: ["github"] },
];

export const CHAMBER_ROUTING_CONTRACTS: ChamberRoutingContract[] = [
  { chamber: "lab", leadIntelligences: ["codex_systems", "lab_analyst_core"], autoTriggers: ["risk scan", "evidence map"], handoffTargets: ["school", "creation", "profile"], priorityTasks: ["analysis", "audit", "research", "verdict"] },
  { chamber: "school", leadIntelligences: ["gemini_expansion", "school_tutor_core"], autoTriggers: ["progress tracking", "reference curation"], handoffTargets: ["lab", "creation", "profile"], priorityTasks: ["curriculum", "lesson", "framework", "mastery"] },
  { chamber: "creation", leadIntelligences: ["cursor_builder", "creation_build_core"], autoTriggers: ["revision", "packaging"], handoffTargets: ["profile", "lab", "school"], priorityTasks: ["build", "artifact", "terminal execution", "export"] },
  { chamber: "profile", leadIntelligences: ["claude_architect", "profile_ledger_core"], autoTriggers: ["continuity recommendations", "routing proposals"], handoffTargets: ["lab", "school", "creation"], priorityTasks: ["orchestration", "connector policy", "workflow management"] },
];

export const PROVIDER_REGISTRY: ModelProviderDefinition[] = [
  { id: "ollama_local", label: "Ollama Local", lane: "open_source_local", status: "can_host_now", capabilities: ["chat", "code", "summarize"], chamberSafety: ["lab", "creation"] },
  { id: "hf_inference", label: "HF Inference", lane: "free_provider", status: "future_integration", capabilities: ["chat", "classify"], chamberSafety: ["lab", "school"] },
  { id: "openai_wrapped", label: "OpenAI Wrapped", lane: "wrapped_external", status: "can_host_now", capabilities: ["chat", "tooling", "code"], chamberSafety: ["lab", "school", "creation"] },
  { id: "premium_hosted", label: "Premium Hosted Future", lane: "premium_hosted_future", status: "future_integration", capabilities: ["multimodal orchestration"], chamberSafety: ["lab", "school", "creation", "profile"] },
];

export const PROJECT_CANVAS_SEEDS: ProjectCanvas[] = [
  {
    id: "canvas-ruberra-core",
    title: "Ruberra Core Canvas",
    owner: "Sovereign Architect",
    collections: [
      { chamber: "lab", surfaces: [{ id: "lab-s1", label: "Investigations", chamber: "lab", entries: [{ id: "le-1", title: "Risk Scan", chamber: "lab", openRoute: { tab: "lab", view: "analysis" }, tags: ["risk"] }] }] },
      { chamber: "school", surfaces: [{ id: "school-s1", label: "Tracks", chamber: "school", entries: [{ id: "se-1", title: "Systems Track", chamber: "school", openRoute: { tab: "school", view: "track" }, tags: ["track"] }] }] },
      { chamber: "creation", surfaces: [{ id: "creation-s1", label: "Builds", chamber: "creation", entries: [{ id: "ce-1", title: "Flagship Build", chamber: "creation", openRoute: { tab: "creation", view: "terminal" }, tags: ["build"] }] }] },
      { chamber: "profile", surfaces: [{ id: "profile-s1", label: "Workflows", chamber: "profile", entries: [{ id: "pe-1", title: "Ivan Canonical Loop", chamber: "profile", openRoute: { tab: "profile", view: "projects" }, tags: ["workflow"] }] }] },
    ],
    projectCards: [
      { id: "pc-1", title: "Flagship Runtime Closure", chamber: "profile", visual: { family: "profile", colorOwnership: "violet", motherIdentity: "ruberra", immersionLevel: "deep" }, previewSource: { mode: "placeholder" }, detailContextId: "ctx-1", bucket: "flagship" },
    ],
    artifactCards: [
      { id: "ac-1", title: "Creation Output Pack", chamber: "creation", visual: { family: "creation", colorOwnership: "amber", motherIdentity: "ruberra", immersionLevel: "focused" }, previewSource: { mode: "generated", uri: "runtime://artifact/ac-1" }, detailContextId: "ctx-1", bucket: "active", artifactType: "artifact_pack", archiveEntryId: "archive-ac-1" },
    ],
    deepContexts: [{ id: "ctx-1", title: "Flagship Context", summary: "Cross-chamber closure context", relatedCardIds: ["pc-1", "ac-1"] }],
  },
];

export function defaultPresenceMetadata(): PresenceMetadata {
  return {
    leaderType: "chamber_default",
    leaderId: "profile_ledger_core",
    chamber: "profile",
    activeSubagents: [],
    connectorActions: [],
    memoryBound: true,
  };
}

export function defaultMemoryContinuityState(): MemoryContinuityState {
  return {
    sessionMemoryId: crypto.randomUUID(),
    chamberMemory: [
      { chamber: "lab", pinnedObjectIds: [], updatedAt: Date.now() },
      { chamber: "school", pinnedObjectIds: [], updatedAt: Date.now() },
      { chamber: "creation", pinnedObjectIds: [], updatedAt: Date.now() },
      { chamber: "profile", pinnedObjectIds: [], updatedAt: Date.now() },
    ],
    workflowMemoryIds: [],
    pioneerMemoryIds: [],
    artifactMemoryIds: [],
  };
}

export function defaultIntelligenceFoundationState(): IntelligenceFoundationState {
  return {
    pioneers: PIONEER_REGISTRY,
    giRegistry: GI_REGISTRY,
    subagents: SUBAGENT_REGISTRY,
    connectorRegistry: CONNECTOR_REGISTRY,
    workflowTemplates: WORKFLOW_TEMPLATES,
    routingContracts: CHAMBER_ROUTING_CONTRACTS,
    presence: defaultPresenceMetadata(),
    traceEvents: [],
    memory: defaultMemoryContinuityState(),
    workflowPairings: WORKFLOW_PAIRINGS,
    workflowExecutionExamples: WORKFLOW_EXECUTION_EXAMPLES,
    workflowExports: [],
    customWorkflowSkeletons: CUSTOM_WORKFLOW_SKELETONS,
    providerRegistry: PROVIDER_REGISTRY,
    projectCanvases: PROJECT_CANVAS_SEEDS,
  };
}

export interface RouteDecisionInput {
  chamberHint?: Tab;
  workflowId?: string;
  preferredPioneerId?: string;
  requestText: string;
}

export interface RouteDecisionResult {
  chamber: Tab;
  pioneerId: string;
  giId: string;
  reason: string;
}

export function resolveRouteDecision(state: IntelligenceFoundationState, input: RouteDecisionInput): RouteDecisionResult {
  if (input.preferredPioneerId) {
    const pioneer = state.pioneers.find((entry) => entry.id === input.preferredPioneerId);
    if (pioneer) {
      const defaultGi = state.giRegistry.find((entry) => entry.chamber === pioneer.homeChamber) ?? state.giRegistry[0];
      return {
        chamber: pioneer.homeChamber,
        pioneerId: pioneer.id,
        giId: defaultGi.id,
        reason: "preferred pioneer selected",
      };
    }
  }
  if (input.workflowId) {
    const workflow = state.workflowTemplates.find((entry) => entry.id === input.workflowId);
    if (workflow) {
      return {
        chamber: workflow.homeChamber,
        pioneerId: workflow.pioneers[0],
        giId: state.giRegistry.find((entry) => entry.chamber === workflow.homeChamber)?.id ?? state.giRegistry[0].id,
        reason: "workflow home chamber route",
      };
    }
  }
  if (input.chamberHint) {
    const chamberPioneer = state.pioneers.find((entry) => entry.homeChamber === input.chamberHint) ?? state.pioneers[0];
    return {
      chamber: input.chamberHint,
      pioneerId: chamberPioneer.id,
      giId: state.giRegistry.find((entry) => entry.chamber === input.chamberHint)?.id ?? state.giRegistry[0].id,
      reason: "chamber hint route",
    };
  }
  const text = input.requestText.toLowerCase();
  if (text.includes("build") || text.includes("ship") || text.includes("deploy")) {
    return { chamber: "creation", pioneerId: "cursor_builder", giId: "creation_build_core", reason: "keyword build route" };
  }
  if (text.includes("learn") || text.includes("curriculum") || text.includes("lesson")) {
    return { chamber: "school", pioneerId: "gemini_expansion", giId: "school_tutor_core", reason: "keyword learning route" };
  }
  if (text.includes("analy") || text.includes("audit") || text.includes("research")) {
    return { chamber: "lab", pioneerId: "codex_systems", giId: "lab_analyst_core", reason: "keyword analysis route" };
  }
  return { chamber: "profile", pioneerId: "claude_architect", giId: "profile_ledger_core", reason: "default sovereign route" };
}
