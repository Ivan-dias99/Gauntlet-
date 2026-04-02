import { RUBERRA_OBJECTS, buildMessageObject, type RuberraObject } from "./object-graph";
import { type Message, type MessageExecutionTrace, type Tab } from "./shell-types";
import {
  defaultIntelligenceFoundationState,
  resolveRouteDecision,
  type ModelProviderDefinition,
  type IntelligenceFoundationState,
  type PresenceMetadata,
  type ProvenanceTraceEvent,
  type RouteDecisionInput,
  type WorkflowTemplate,
  type WorkflowExportPack,
} from "./intelligence-foundation";
import { type SystemHealthModel, defaultSystemHealthModel } from "./awareness-substrate";
import {
  type CompoundNetwork,
  defaultCompoundNetwork,
  addCompoundNode,
  createCompoundNode,
  estimateReplicationBarrier,
} from "../dna/compound-intelligence";
import { type ConsequenceAttribution } from "../dna/collective-execution";
import { type AnalyticsPattern } from "../dna/intelligence-analytics";
import { type PresenceManifest } from "../dna/distribution-presence";

export type LifecycleStatus =
  | "draft"
  | "in_progress"
  | "paused"
  | "resumed"
  | "blocked"
  | "needs_input"
  | "ready_for_transfer"
  | "transferred"
  | "validated"
  | "completed"
  | "exported"
  | "archived";

export interface ContinuityItem {
  id: string;
  title: string;
  chamber: Exclude<Tab, "profile">;
  status: LifecycleStatus;
  route: { tab: Exclude<Tab, "profile">; view: string; id?: string };
  linkedObjectId?: string;
  workflowId?: string;
  pioneerId?: string;
  giId?: string;
  hostingLevel?: "hosted" | "wrapped" | "proxy";
  connectorRefs?: string[];
  supportChain?: string[];
  providerId?: string;
  providerLane?: "open_source_local" | "free_provider" | "wrapped_external" | "premium_hosted_future";
  modelId?: string;
  routeReason?: string;
  transferDestinations: Exclude<Tab, "profile">[];
  updatedAt: number;
  /** Latest completed run snapshot for Profile ledger */
  lastRunDigest?: string;
  lastExecutionState?: MessageExecutionTrace["executionState"];
  lastModelId?: string;
  lastProviderId?: string;
}

export type SignalType = "lifecycle" | "transfer" | "connector" | "reward" | "recommendation";
export interface RuntimeSignal {
  id: string;
  type: SignalType;
  label: string;
  severity: "info" | "warn" | "critical";
  sourceChamber: Tab;
  destinationChamber: Tab;
  destination: { tab: Tab; view: string; id?: string };
  linkedObjectId?: string;
  createdAt: number;
  read: boolean;
  resolved: boolean;
}

export interface TransferRecord {
  id: string;
  continuityId: string;
  from: Exclude<Tab, "profile">;
  to: Exclude<Tab, "profile">;
  objectId?: string;
  reason: string;
  createdAt: number;
}

export interface RewardRecord {
  id: string;
  kind: "mastery" | "experiment" | "build" | "transfer" | "export" | "recovery";
  title: string;
  points: number;
  chamber: Tab;
  createdAt: number;
}

export interface ConnectorState {
  id: string;
  label: string;
  chamber: Tab;
  enabled: boolean;
  status: "ready" | "needs_config" | "degraded";
  completeness: number;
  lastOutcome?: "success" | "failed" | "degraded";
  lastUpdated: number;
}

export interface PreferenceState {
  preferredChamber: Exclude<Tab, "profile">;
  preferredObjectType: string;
  outputStyle: "structured" | "mixed";
  autoTransferHints: boolean;
  modelOverrides: Partial<Record<Exclude<Tab, "profile">, string>>;
  lastUpdated: number;
}

export interface AISettingsState {
  modelPolicy: "balanced" | "quality_first" | "speed_first";
  safetyMode: "standard" | "strict";
  autoSummaries: boolean;
  allowFallbackRouting: boolean;
  localRuntimeEndpoint?: string;
  lastUpdated: number;
}

export interface PluginRuntimeState {
  id: string;
  label: string;
  enabled: boolean;
  status: "ready" | "needs_auth" | "error";
  scope: "workspace" | "school" | "lab" | "creation";
  lastRunAt?: number;
  lastUpdated: number;
}

export interface WorkspaceKnowledge {
  owner: string;
  workspace: string;
  activeProject: string;
  priorities: string[];
  updatedAt: number;
}

export interface SearchIndexEntry {
  id: string;
  title: string;
  kind: "object" | "continuity" | "signal";
  chamber: Tab;
  status?: string;
  route: { tab: Tab; view: string; id?: string };
  searchableText: string;
  updatedAt: number;
}

export interface ContinuityRecommendation {
  continuityId: string;
  title: string;
  chamber: Exclude<Tab, "profile">;
  action: "resume" | "transfer" | "export" | "retry";
  reason: string;
  destination: { tab: Tab; view: string; id?: string };
}


export interface ExecutionResultRecord {
  id: string;
  continuityId: string;
  chamber: Exclude<Tab, "profile">;
  requestedProviderId?: string;
  selectedProviderId: string;
  requestedModelId?: string;
  selectedModelId: string;
  providerLane?: "open_source_local" | "free_provider" | "wrapped_external" | "premium_hosted_future";
  executionMode: "local" | "wrapped" | "hosted_scaffold";
  executionState:
    | "live"
    | "completed"
    | "degraded"
    | "blocked"
    | "failed"
    | "fallback_used"
    | "provider_unavailable"
    | "connector_unavailable"
    | "scaffold_only";
  fallbackUsed: boolean;
  providerUnavailable: boolean;
  connectorUnavailable: boolean;
  scaffoldOnly: boolean;
  connectorPathUsed: boolean;
  workflowId?: string;
  outcome: "success" | "degraded" | "blocked" | "error";
  latencyMs?: number;
  blockedReason?: string;
  errorMessage?: string;
  createdAt: number;
}

export interface ConnectorActionRecord {
  id: string;
  continuityId: string;
  workflowId?: string;
  requestedConnectorId: string;
  selectedConnectorId: string;
  connectorId: string;
  chamber: Tab;
  action: "read" | "write" | "sync" | "export" | "deploy" | "webhook";
  phase: "requested" | "executing" | "completed" | "failed";
  status: "success" | "failed" | "degraded";
  connectorAvailable: boolean;
  retryCount: number;
  payloadSummary: string;
  resultSummary: string;
  errorSummary?: string;
  degradedMode: boolean;
  createdAt: number;
}

export interface ConnectorIOTrace {
  id: string;
  continuityId: string;
  connectorId: string;
  service: string;
  route: string;
  requestPayload: string;
  responsePayload: string;
  errorPayload?: string;
  outcomeClass: "ok" | "degraded" | "failed";
  retryScheduled: boolean;
  createdAt: number;
}

export interface ProviderHealthRecord {
  providerId: string;
  state: "healthy" | "degraded" | "unavailable";
  lastError?: string;
  lastLatencyMs?: number;
  updatedAt: number;
}

export interface WorkflowStageState {
  id: string;
  label: string;
  status: "pending" | "running" | "completed" | "failed";
  startedAt?: number;
  endedAt?: number;
  error?: string;
}

export interface WorkflowRunRecord {
  id: string;
  workflowId: string;
  continuityId: string;
  chamber: Exclude<Tab, "profile">;
  status: "running" | "completed" | "failed" | "degraded";
  activeStageId: string;
  stages: WorkflowStageState[];
  startedAt: number;
  endedAt?: number;
  outcomeSummary?: string;
}

export interface RunTimelineEvent {
  id: string;
  continuityId: string;
  chamber: Tab;
  type: "execution" | "workflow" | "connector" | "signal";
  status: "live" | "completed" | "degraded" | "blocked" | "failed";
  label: string;
  timestamp: number;
}

export interface ChamberExecutionPolicy {
  chamber: Exclude<Tab, "profile">;
  priorityRoutes: string[];
  bias: "evidence_heavy" | "clarity_safe" | "terminal_strong";
  fallbackPolicy: "code_audit_fallback" | "lighter_fast_fallback" | "build_terminal_fallback";
}

export interface RunDigestCard {
  continuityId: string;
  title: string;
  chamber: Exclude<Tab, "profile">;
  executionState: ExecutionResultRecord["executionState"];
  workflowId?: string;
  connectorCount: number;
  lastEventLabel?: string;
  updatedAt: number;
}

export interface RunOutcomeBundle {
  continuityId: string;
  chamber: Exclude<Tab, "profile">;
  executionState: ExecutionResultRecord["executionState"];
  provider: { id?: string; state: "healthy" | "degraded" | "unavailable" | "unknown" };
  connectors: { total: number; degraded: number; failed: number };
  workflow?: { id: string; status: WorkflowRunRecord["status"] };
  lastTimelineLabel?: string;
}

export interface ProviderPodiumPlan {
  primary: ModelProviderDefinition;
  fallback?: ModelProviderDefinition;
  routeClass: "coding" | "reasoning" | "fast";
}

function pickProvider(
  providers: ModelProviderDefinition[],
  lane: ModelProviderDefinition["lane"],
  chamber: Tab,
): ModelProviderDefinition | undefined {
  return providers.find((provider) => provider.lane === lane && provider.chamberSafety.includes(chamber));
}

export interface RuntimeFabric {
  objects: RuberraObject[];
  continuity: ContinuityItem[];
  signals: RuntimeSignal[];
  transfers: TransferRecord[];
  rewards: RewardRecord[];
  connectors: ConnectorState[];
  preferences: PreferenceState;
  aiSettings: AISettingsState;
  plugins: PluginRuntimeState[];
  workspace: WorkspaceKnowledge;
  executionResults: ExecutionResultRecord[];
  connectorActions: ConnectorActionRecord[];
  connectorIO: ConnectorIOTrace[];
  providerHealth: ProviderHealthRecord[];
  workflowRuns: WorkflowRunRecord[];
  runTimeline: RunTimelineEvent[];
  chamberPolicies: ChamberExecutionPolicy[];
  intelligence: IntelligenceFoundationState;
  /** Stack 08 — live system health model */
  systemHealth?: SystemHealthModel;
  /** Stack 20 — compound intelligence network, grows with each completed run */
  compoundNetwork?: CompoundNetwork;
  /** Stack 12 — analytics patterns, persisted results */
  analyticsPatterns: AnalyticsPattern[];
  /** Stack 13 — attribution records for collective work consequence */
  attributions: ConsequenceAttribution[];
  /** Stack 14 — distribution manifests, persisted for session presence */
  presenceManifests: Record<string, PresenceManifest>;
}

const STORAGE_KEY = "ruberra_runtime_fabric_v6";

const DEFAULT_CONNECTORS: ConnectorState[] = [
  { id: "knowledge-pack", label: "Knowledge Pack", chamber: "school", enabled: true, status: "ready", completeness: 100, lastUpdated: Date.now() },
  { id: "evidence-bridge", label: "Evidence Bridge", chamber: "lab", enabled: true, status: "ready", completeness: 92, lastUpdated: Date.now() },
  { id: "artifact-export", label: "Artifact Export", chamber: "creation", enabled: true, status: "needs_config", completeness: 68, lastUpdated: Date.now() },
  { id: "profile-ledger", label: "Profile Ledger", chamber: "profile", enabled: true, status: "ready", completeness: 100, lastUpdated: Date.now() },
];

const DEFAULT_PREFERENCES: PreferenceState = {
  preferredChamber: "school",
  preferredObjectType: "lesson",
  outputStyle: "structured",
  autoTransferHints: true,
  modelOverrides: {},
  lastUpdated: Date.now(),
};

const DEFAULT_AI_SETTINGS: AISettingsState = {
  modelPolicy: "balanced",
  safetyMode: "standard",
  autoSummaries: true,
  allowFallbackRouting: true,
  localRuntimeEndpoint: "http://127.0.0.1:11434",
  lastUpdated: Date.now(),
};

const DEFAULT_CHAMBER_POLICIES: ChamberExecutionPolicy[] = [
  { chamber: "lab",      priorityRoutes: ["research", "analysis", "audit"],      bias: "evidence_heavy",  fallbackPolicy: "code_audit_fallback" },
  { chamber: "school",   priorityRoutes: ["tutor", "curriculum", "assessment"],  bias: "clarity_safe",    fallbackPolicy: "lighter_fast_fallback" },
  { chamber: "creation", priorityRoutes: ["build", "artifact", "code", "drafting"], bias: "terminal_strong", fallbackPolicy: "build_terminal_fallback" },
];

const DEFAULT_PLUGINS: PluginRuntimeState[] = [
  { id: "calendar-sync", label: "Calendar Sync", enabled: false, status: "needs_auth", scope: "workspace", lastUpdated: Date.now() },
  { id: "repo-bridge", label: "Repo Bridge", enabled: true, status: "ready", scope: "lab", lastUpdated: Date.now() },
  { id: "lesson-export", label: "Lesson Export", enabled: true, status: "ready", scope: "school", lastUpdated: Date.now() },
];

const DEFAULT_WORKSPACE: WorkspaceKnowledge = {
  owner: "Sovereign Architect",
  workspace: "Ruberra Neural Mesh Workspace",
  activeProject: "Ruberra Generation Next",
  priorities: ["continuity truth", "runtime consequence", "profile ledger integrity"],
  updatedAt: Date.now(),
};

function initialFabric(): RuntimeFabric {
  return {
    objects: RUBERRA_OBJECTS,
    continuity: [],
    signals: [],
    transfers: [],
    rewards: [],
    connectors: DEFAULT_CONNECTORS,
    preferences: DEFAULT_PREFERENCES,
    aiSettings: DEFAULT_AI_SETTINGS,
    plugins: DEFAULT_PLUGINS,
    workspace: DEFAULT_WORKSPACE,
    executionResults: [],
    connectorActions: [],
    connectorIO: [],
    providerHealth: [],
    workflowRuns: [],
    runTimeline: [],
    chamberPolicies: DEFAULT_CHAMBER_POLICIES,
    intelligence: defaultIntelligenceFoundationState(),
    systemHealth: defaultSystemHealthModel(),
    compoundNetwork: defaultCompoundNetwork(),
    analyticsPatterns: [],
    attributions: [],
    presenceManifests: {},
  };
}

export function loadRuntimeFabric(): RuntimeFabric {
  if (typeof window === "undefined") return initialFabric();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialFabric();
    const parsed = JSON.parse(raw) as RuntimeFabric;
    return {
      ...initialFabric(),
      ...parsed,
      objects: parsed.objects?.length ? parsed.objects : RUBERRA_OBJECTS,
      connectors: parsed.connectors?.length ? parsed.connectors : DEFAULT_CONNECTORS,
      preferences: parsed.preferences ?? DEFAULT_PREFERENCES,
      aiSettings: parsed.aiSettings ?? DEFAULT_AI_SETTINGS,
      plugins: parsed.plugins?.length ? parsed.plugins : DEFAULT_PLUGINS,
      workspace: parsed.workspace ?? DEFAULT_WORKSPACE,
      executionResults: parsed.executionResults ?? [],
      connectorActions: parsed.connectorActions ?? [],
      connectorIO: parsed.connectorIO ?? [],
      providerHealth: parsed.providerHealth ?? [],
      workflowRuns: parsed.workflowRuns ?? [],
      runTimeline: parsed.runTimeline ?? [],
      chamberPolicies: parsed.chamberPolicies?.length ? parsed.chamberPolicies : DEFAULT_CHAMBER_POLICIES,
      intelligence: parsed.intelligence ?? defaultIntelligenceFoundationState(),
      analyticsPatterns: parsed.analyticsPatterns ?? [],
      attributions: parsed.attributions ?? [],
      presenceManifests: parsed.presenceManifests ?? {},
    };
  } catch {
    return initialFabric();
  }
}

export function saveRuntimeFabric(fabric: RuntimeFabric) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fabric));
  } catch {
    // ignore
  }
}

export function upsertObject(fabric: RuntimeFabric, object: RuberraObject): RuntimeFabric {
  const idx = fabric.objects.findIndex((o) => o.id === object.id);
  if (idx === -1) return { ...fabric, objects: [object, ...fabric.objects] };
  const next = [...fabric.objects];
  next[idx] = { ...next[idx], ...object, updated_at: Date.now() };
  return { ...fabric, objects: next };
}

export function createOrUpdateContinuity(
  fabric: RuntimeFabric,
  payload: Omit<ContinuityItem, "updatedAt" | "transferDestinations"> & { transferDestinations?: Exclude<Tab, "profile">[] },
): RuntimeFabric {
  const idx = fabric.continuity.findIndex((w) => w.id === payload.id);
  const item: ContinuityItem = {
    ...payload,
    transferDestinations: payload.transferDestinations ?? transferDefaults(payload.chamber),
    updatedAt: Date.now(),
  };
  if (idx === -1) return { ...fabric, continuity: [item, ...fabric.continuity] };
  const next = [...fabric.continuity];
  next[idx] = item;
  return { ...fabric, continuity: next };
}

function transferDefaults(chamber: Exclude<Tab, "profile">): Exclude<Tab, "profile">[] {
  if (chamber === "school") return ["lab", "creation"];
  if (chamber === "lab") return ["school", "creation"];
  return ["lab", "school"];
}

export function transitionContinuity(fabric: RuntimeFabric, id: string, status: LifecycleStatus): RuntimeFabric {
  return {
    ...fabric,
    continuity: fabric.continuity.map((item) => (item.id === id ? { ...item, status, updatedAt: Date.now() } : item)),
  };
}

/** Attach visible run consequence to a continuity row (Profile orchestration ledger). */
export function patchContinuityRunTrace(
  fabric: RuntimeFabric,
  continuityId: string,
  trace: Pick<MessageExecutionTrace, "executionState" | "modelId" | "providerId"> & { digest: string },
): RuntimeFabric {
  return {
    ...fabric,
    continuity: fabric.continuity.map((item) =>
      item.id === continuityId
        ? {
            ...item,
            lastRunDigest: trace.digest.slice(0, 220),
            lastExecutionState: trace.executionState,
            lastModelId: trace.modelId,
            lastProviderId: trace.providerId,
            updatedAt: Date.now(),
          }
        : item
    ),
  };
}

export function transferContinuity(
  fabric: RuntimeFabric,
  continuityId: string,
  to: Exclude<Tab, "profile">,
  reason: string,
): RuntimeFabric {
  const current = fabric.continuity.find((item) => item.id === continuityId);
  if (!current) return fabric;
  const transfer: TransferRecord = {
    id: crypto.randomUUID(),
    continuityId,
    from: current.chamber,
    to,
    objectId: current.linkedObjectId,
    reason,
    createdAt: Date.now(),
  };
  const updated = fabric.continuity.map((item) =>
    item.id === continuityId ? { ...item, status: "transferred", chamber: to, route: { tab: to, view: to === "creation" ? "terminal" : "chat" }, updatedAt: Date.now() } : item,
  );
  return { ...fabric, continuity: updated, transfers: [transfer, ...fabric.transfers] };
}

export function pushSignal(fabric: RuntimeFabric, signal: Omit<RuntimeSignal, "id" | "createdAt" | "read" | "resolved">): RuntimeFabric {
  const item: RuntimeSignal = {
    ...signal,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    read: false,
    resolved: false,
  };
  return { ...fabric, signals: [item, ...fabric.signals].slice(0, 120) };
}

export function markSignalRead(fabric: RuntimeFabric, id: string): RuntimeFabric {
  return { ...fabric, signals: fabric.signals.map((signal) => (signal.id === id ? { ...signal, read: true } : signal)) };
}

/** Mark every signal read (clears bell badge); does not resolve items. */
export function markAllSignalsRead(fabric: RuntimeFabric): RuntimeFabric {
  return {
    ...fabric,
    signals: fabric.signals.map((signal) => (signal.read ? signal : { ...signal, read: true })),
  };
}

export function resolveSignal(fabric: RuntimeFabric, id: string): RuntimeFabric {
  return { ...fabric, signals: fabric.signals.map((signal) => (signal.id === id ? { ...signal, read: true, resolved: true } : signal)) };
}

export function recordRuntimeMessageObject(fabric: RuntimeFabric, message: Message): RuntimeFabric {
  return upsertObject(fabric, buildMessageObject(message));
}

export function awardProgress(
  fabric: RuntimeFabric,
  reward: Omit<RewardRecord, "id" | "createdAt">,
): RuntimeFabric {
  const item: RewardRecord = { ...reward, id: crypto.randomUUID(), createdAt: Date.now() };
  return { ...fabric, rewards: [item, ...fabric.rewards].slice(0, 80) };
}

export function upsertConnector(
  fabric: RuntimeFabric,
  connectorId: string,
  patch: Partial<ConnectorState>,
): RuntimeFabric {
  const existing = fabric.connectors.find((connector) => connector.id === connectorId);
  if (!existing) {
    const created: ConnectorState = {
      id: connectorId,
      label: connectorId,
      chamber: "profile",
      enabled: true,
      status: "needs_config",
      completeness: 40,
      lastUpdated: Date.now(),
      ...patch,
    };
    return { ...fabric, connectors: [created, ...fabric.connectors] };
  }
  return {
    ...fabric,
    connectors: fabric.connectors.map((connector) =>
      connector.id === connectorId ? { ...connector, ...patch, lastUpdated: Date.now() } : connector,
    ),
  };
}

export function upsertPlugin(
  fabric: RuntimeFabric,
  pluginId: string,
  patch: Partial<PluginRuntimeState>,
): RuntimeFabric {
  const idx = fabric.plugins.findIndex((plugin) => plugin.id === pluginId);
  if (idx === -1) {
    const created: PluginRuntimeState = {
      id: pluginId,
      label: pluginId,
      enabled: false,
      status: "needs_auth",
      scope: "workspace",
      lastUpdated: Date.now(),
      ...patch,
    };
    return { ...fabric, plugins: [created, ...fabric.plugins] };
  }
  const next = [...fabric.plugins];
  next[idx] = { ...next[idx], ...patch, lastUpdated: Date.now() };
  return { ...fabric, plugins: next };
}

export function updatePreferences(fabric: RuntimeFabric, patch: Partial<PreferenceState>): RuntimeFabric {
  return {
    ...fabric,
    preferences: { ...fabric.preferences, ...patch, lastUpdated: Date.now() },
  };
}

export function updateAISettings(fabric: RuntimeFabric, patch: Partial<AISettingsState>): RuntimeFabric {
  return {
    ...fabric,
    aiSettings: { ...fabric.aiSettings, ...patch, lastUpdated: Date.now() },
  };
}

export function updateWorkspaceKnowledge(fabric: RuntimeFabric, patch: Partial<WorkspaceKnowledge>): RuntimeFabric {
  return {
    ...fabric,
    workspace: { ...fabric.workspace, ...patch, updatedAt: Date.now() },
  };
}

export function patchPresenceMetadata(fabric: RuntimeFabric, patch: Partial<PresenceMetadata>): RuntimeFabric {
  return {
    ...fabric,
    intelligence: {
      ...fabric.intelligence,
      presence: { ...fabric.intelligence.presence, ...patch },
    },
  };
}

export function recordProvenanceEvent(
  fabric: RuntimeFabric,
  payload: Omit<ProvenanceTraceEvent, "id" | "timestamp">,
): RuntimeFabric {
  const event: ProvenanceTraceEvent = {
    ...payload,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  return {
    ...fabric,
    intelligence: {
      ...fabric.intelligence,
      traceEvents: [event, ...fabric.intelligence.traceEvents].slice(0, 500),
    },
  };
}

export function routeIntelligenceRequest(
  fabric: RuntimeFabric,
  input: RouteDecisionInput,
): { fabric: RuntimeFabric; chamber: Tab; pioneerId: string; giId: string; reason: string; supportChain: string[] } {
  const decision = resolveRouteDecision(fabric.intelligence, input);
  let next = patchPresenceMetadata(fabric, {
    chamber: decision.chamber,
    leaderType: "pioneer",
    leaderId: decision.pioneerId,
  });
  next = recordProvenanceEvent(next, {
    sourceType: "pioneer",
    sourceId: decision.pioneerId,
    chamber: decision.chamber,
    action: "route_decision",
    metadata: { giId: decision.giId, reason: decision.reason, supportChain: decision.supportChain.join(",") },
  });
  return {
    fabric: next,
    chamber: decision.chamber,
    pioneerId: decision.pioneerId,
    giId: decision.giId,
    reason: decision.reason,
    supportChain: decision.supportChain,
  };
}

export function recommendedConnectorsForChamber(fabric: RuntimeFabric, chamber: Tab): string[] {
  return fabric.intelligence.connectorRegistry
    .filter((connector) => connector.organs.includes(chamber))
    .slice(0, 3)
    .map((connector) => connector.id);
}

export function upsertWorkflowTemplate(fabric: RuntimeFabric, template: WorkflowTemplate): RuntimeFabric {
  const idx = fabric.intelligence.workflowTemplates.findIndex((item) => item.id === template.id);
  if (idx === -1) {
    return {
      ...fabric,
      intelligence: {
        ...fabric.intelligence,
        workflowTemplates: [template, ...fabric.intelligence.workflowTemplates],
      },
    };
  }
  const nextTemplates = [...fabric.intelligence.workflowTemplates];
  nextTemplates[idx] = template;
  return {
    ...fabric,
    intelligence: {
      ...fabric.intelligence,
      workflowTemplates: nextTemplates,
    },
  };
}


export function resolveProviderPodium(fabric: RuntimeFabric, chamber: Tab, text: string): ProviderPodiumPlan {
  const providers = fabric.intelligence.providerRegistry;
  const normalized = text.toLowerCase();
  const routeClass: ProviderPodiumPlan["routeClass"] =
    normalized.includes("code") || normalized.includes("build")
      ? "coding"
      : normalized.includes("fast") || normalized.includes("quick")
        ? "fast"
        : "reasoning";

  const primary =
    (routeClass === "coding" && (pickProvider(providers, "wrapped_external", chamber) ?? pickProvider(providers, "open_source_local", chamber)))
    || (routeClass === "fast" && (pickProvider(providers, "free_provider", chamber) ?? pickProvider(providers, "wrapped_external", chamber)))
    || (pickProvider(providers, "open_source_local", chamber) ?? pickProvider(providers, "wrapped_external", chamber))
    || providers[0];
  const fallback = providers.find((provider) => provider.id !== primary.id && provider.chamberSafety.includes(chamber));
  return { primary, fallback, routeClass };
}

export interface WebExecutionPath {
  mode: "connector" | "provider_gateway";
  connectorIds: string[];
  providerId?: string;
  intent: "research" | "validation" | "fetch";
}

export function planWebExecutionPath(fabric: RuntimeFabric, chamber: Tab, text: string): WebExecutionPath | undefined {
  const normalized = text.toLowerCase();
  if (!normalized.includes("web") && !normalized.includes("research") && !normalized.includes("source")) return undefined;
  const connectorIds = recommendedConnectorsForChamber(fabric, chamber);
  const provider = resolveProviderPodium(fabric, chamber, text).primary;
  return {
    mode: connectorIds.length > 0 ? "connector" : "provider_gateway",
    connectorIds,
    providerId: provider?.id,
    intent: normalized.includes("validate") ? "validation" : normalized.includes("fetch") ? "fetch" : "research",
  };
}

export function recordExecutionResult(
  fabric: RuntimeFabric,
  payload: Omit<ExecutionResultRecord, "id" | "createdAt">,
): RuntimeFabric {
  const item: ExecutionResultRecord = { ...payload, id: crypto.randomUUID(), createdAt: Date.now() };
  return { ...fabric, executionResults: [item, ...fabric.executionResults].slice(0, 300) };
}

export function upsertExecutionResultByContinuity(
  fabric: RuntimeFabric,
  continuityId: string,
  patch: Partial<ExecutionResultRecord>,
): RuntimeFabric {
  const idx = fabric.executionResults.findIndex((entry) => entry.continuityId === continuityId);
  if (idx === -1) return fabric;
  const next = [...fabric.executionResults];
  next[idx] = { ...next[idx], ...patch };
  return { ...fabric, executionResults: next };
}

export function recordConnectorAction(
  fabric: RuntimeFabric,
  payload: Omit<ConnectorActionRecord, "id" | "createdAt">,
): RuntimeFabric {
  const item: ConnectorActionRecord = { ...payload, id: crypto.randomUUID(), createdAt: Date.now() };
  return { ...fabric, connectorActions: [item, ...fabric.connectorActions].slice(0, 300) };
}

export function recordConnectorIOTrace(
  fabric: RuntimeFabric,
  payload: Omit<ConnectorIOTrace, "id" | "createdAt">,
): RuntimeFabric {
  const item: ConnectorIOTrace = { ...payload, id: crypto.randomUUID(), createdAt: Date.now() };
  return { ...fabric, connectorIO: [item, ...fabric.connectorIO].slice(0, 400) };
}

export function upsertProviderHealth(
  fabric: RuntimeFabric,
  payload: Omit<ProviderHealthRecord, "updatedAt">,
): RuntimeFabric {
  const idx = fabric.providerHealth.findIndex((entry) => entry.providerId === payload.providerId);
  const record: ProviderHealthRecord = { ...payload, updatedAt: Date.now() };
  if (idx === -1) return { ...fabric, providerHealth: [record, ...fabric.providerHealth] };
  const next = [...fabric.providerHealth];
  next[idx] = record;
  return { ...fabric, providerHealth: next };
}

export function updateConnectorOperationalState(
  fabric: RuntimeFabric,
  connectorId: string,
  outcome: "success" | "failed" | "degraded",
): RuntimeFabric {
  return {
    ...fabric,
    connectors: fabric.connectors.map((connector) =>
      connector.id === connectorId
        ? {
          ...connector,
          status: outcome === "failed" ? "degraded" : connector.status,
          completeness: outcome === "success" ? Math.min(100, connector.completeness + 2) : Math.max(30, connector.completeness - 6),
          lastOutcome: outcome,
          lastUpdated: Date.now(),
        }
        : connector,
    ),
  };
}

export function appendRunTimeline(
  fabric: RuntimeFabric,
  payload: Partial<Omit<RunTimelineEvent, "id" | "timestamp">> & { label: string; continuityId: string },
): RuntimeFabric {
  const event: RunTimelineEvent = {
    status:  "info" as any,
    chamber: "lab" as any,
    type:    "log" as any,
    ...payload,
    id:        crypto.randomUUID() as string,
    timestamp: Date.now(),
  };
  return { ...fabric, runTimeline: [event, ...fabric.runTimeline].slice(0, 1000) };
}

export function startWorkflowRun(
  fabric: RuntimeFabric,
  payload: { workflowId: string; continuityId: string; chamber: Exclude<Tab, "profile">; stages: string[] },
): RuntimeFabric {
  const startedAt = Date.now();
  const stages: WorkflowStageState[] = payload.stages.map((label, idx) => ({
    id: `${payload.continuityId}-${idx}`,
    label,
    status: idx === 0 ? "running" : "pending",
    startedAt: idx === 0 ? startedAt : undefined,
  }));
  const run: WorkflowRunRecord = {
    id: crypto.randomUUID(),
    workflowId: payload.workflowId,
    continuityId: payload.continuityId,
    chamber: payload.chamber,
    status: "running",
    activeStageId: stages[0]?.id ?? "",
    stages,
    startedAt,
  };
  return { ...fabric, workflowRuns: [run, ...fabric.workflowRuns].slice(0, 300) };
}

export function transitionWorkflowStage(
  fabric: RuntimeFabric,
  continuityId: string,
  status: WorkflowRunRecord["status"],
  error?: string,
): RuntimeFabric {
  const idx = fabric.workflowRuns.findIndex((entry) => entry.continuityId === continuityId);
  if (idx === -1) return fabric;
  const run = fabric.workflowRuns[idx];
  const runningStageIndex = run.stages.findIndex((stage) => stage.status === "running");
  const nextStages = run.stages.map((stage, i) => {
    if (i === runningStageIndex) {
      return { ...stage, status: status === "failed" ? "failed" : "completed", endedAt: Date.now(), error };
    }
    if (i === runningStageIndex + 1 && status === "running") {
      return { ...stage, status: "running", startedAt: Date.now() };
    }
    return stage;
  });
  const nextRun: WorkflowRunRecord = {
    ...run,
    status,
    stages: nextStages,
    activeStageId: status === "running"
      ? (nextStages.find((s) => s.status === "running")?.id ?? run.activeStageId)
      : run.activeStageId,
    endedAt: status === "running" ? undefined : Date.now(),
    outcomeSummary: status === "failed" ? error ?? "workflow stage failed" : status === "degraded" ? "workflow completed with degradation" : status === "completed" ? "workflow completed" : run.outcomeSummary,
  };
  const nextRuns = [...fabric.workflowRuns];
  nextRuns[idx] = nextRun;
  return { ...fabric, workflowRuns: nextRuns };
}

export function getChamberExecutionPolicy(fabric: RuntimeFabric, chamber: Exclude<Tab, "profile">): ChamberExecutionPolicy {
  return fabric.chamberPolicies.find((entry) => entry.chamber === chamber) ?? DEFAULT_CHAMBER_POLICIES.find((entry) => entry.chamber === chamber)!;
}

export function buildRunDigestCards(fabric: RuntimeFabric): RunDigestCard[] {
  return fabric.continuity.map((item) => {
    const execution = fabric.executionResults.find((entry) => entry.continuityId === item.id);
    const lastEvent = fabric.runTimeline.find((entry) => entry.continuityId === item.id);
    const connectorCount = fabric.connectorActions.filter((entry) => entry.continuityId === item.id).length;
    return {
      continuityId: item.id,
      title: item.title,
      chamber: item.chamber,
      executionState: execution?.executionState ?? "blocked",
      workflowId: item.workflowId,
      connectorCount,
      lastEventLabel: lastEvent?.label,
      updatedAt: item.updatedAt,
    };
  }).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 100);
}

export function buildCursorConsumptionPack(fabric: RuntimeFabric) {
  const runCards = buildRunDigestCards(fabric).slice(0, 24);
  const chatIdentityRows = runCards.map((card) => ({
    continuityId: card.continuityId,
    chamber: card.chamber,
    executionState: card.executionState,
    workflowId: card.workflowId,
  }));
  const terminalExecutionStrip = fabric.executionResults.slice(0, 24).map((result) => ({
    continuityId: result.continuityId,
    executionState: result.executionState,
    outcome: result.outcome,
    fallbackUsed: result.fallbackUsed,
    latencyMs: result.latencyMs,
  }));
  const connectorPanels = fabric.connectorActions.slice(0, 24).map((action) => ({
    continuityId: action.continuityId,
    connectorId: action.connectorId,
    phase: action.phase,
    status: action.status,
    degradedMode: action.degradedMode,
    errorSummary: action.errorSummary,
  }));
  const statusPanels = fabric.executionResults.slice(0, 24).map((result) => ({
    continuityId: result.continuityId,
    state: result.executionState,
    providerUnavailable: result.providerUnavailable,
    connectorUnavailable: result.connectorUnavailable,
    scaffoldOnly: result.scaffoldOnly,
    blockedReason: result.blockedReason,
  }));
  return {
    chatIdentityRows,
    terminalExecutionStrip,
    profileRunCards: runCards,
    connectorPanels,
    workflowPanels: fabric.workflowRuns.slice(0, 24),
    statusPanels,
    providerHealth: fabric.providerHealth.slice(0, 24),
    connectorIO: fabric.connectorIO.slice(0, 24),
  };
}

export function buildRunOutcomeBundles(fabric: RuntimeFabric): RunOutcomeBundle[] {
  return fabric.continuity.map((item) => {
    const execution = fabric.executionResults.find((entry) => entry.continuityId === item.id);
    const providerState = execution?.selectedProviderId
      ? fabric.providerHealth.find((entry) => entry.providerId === execution.selectedProviderId)?.state ?? "unknown"
      : "unknown";
    const connectorSlice = fabric.connectorActions.filter((entry) => entry.continuityId === item.id);
    const degraded = connectorSlice.filter((entry) => entry.status === "degraded").length;
    const failed = connectorSlice.filter((entry) => entry.status === "failed").length;
    const workflow = fabric.workflowRuns.find((entry) => entry.continuityId === item.id);
    const lastTimelineLabel = fabric.runTimeline.find((entry) => entry.continuityId === item.id)?.label;
    return {
      continuityId: item.id,
      chamber: item.chamber,
      executionState: execution?.executionState ?? "blocked",
      provider: { id: execution?.selectedProviderId, state: providerState },
      connectors: { total: connectorSlice.length, degraded, failed },
      workflow: workflow ? { id: workflow.workflowId, status: workflow.status } : undefined,
      lastTimelineLabel,
    };
  }).slice(0, 200);
}

export function computeConnectorRetryPolicy(
  fabric: RuntimeFabric,
  connectorId: string,
): { retryCount: number; shouldRetry: boolean } {
  const recent = fabric.connectorActions.filter((entry) => entry.connectorId === connectorId).slice(0, 5);
  const failures = recent.filter((entry) => entry.status !== "success").length;
  const retryCount = Math.min(3, failures);
  return {
    retryCount,
    shouldRetry: retryCount > 0 && retryCount < 3,
  };
}

export function exportWorkflowTemplatePack(fabric: RuntimeFabric, workflowId: string): { fabric: RuntimeFabric; pack?: WorkflowExportPack } {
  const workflow = fabric.intelligence.workflowTemplates.find((item) => item.id === workflowId);
  if (!workflow) return { fabric };
  const pack: WorkflowExportPack = {
    schemaVersion: "ruberra.workflow-pack.v1",
    workflowId,
    exportedAt: Date.now(),
    includePolicies: true,
  };
  return {
    fabric: {
      ...fabric,
      intelligence: {
        ...fabric.intelligence,
        workflowExports: [pack, ...fabric.intelligence.workflowExports].slice(0, 50),
      },
    },
    pack,
  };
}

export function importWorkflowTemplatePack(
  fabric: RuntimeFabric,
  pack: WorkflowExportPack,
  template: WorkflowTemplate,
): RuntimeFabric {
  let next = upsertWorkflowTemplate(fabric, template);
  next = {
    ...next,
    intelligence: {
      ...next.intelligence,
      workflowExports: [pack, ...next.intelligence.workflowExports].slice(0, 50),
    },
  };
  return next;
}

export function resumeContinuity(fabric: RuntimeFabric, continuityId: string): RuntimeFabric {
  const item = fabric.continuity.find((entry) => entry.id === continuityId);
  if (!item) return fabric;
  let next = transitionContinuity(fabric, continuityId, "resumed");
  next = pushSignal(next, {
    type: "lifecycle",
    label: `${item.title.slice(0, 48)} resumed`,
    severity: "info",
    sourceChamber: "profile",
    destinationChamber: item.chamber,
    destination: item.route,
    linkedObjectId: item.linkedObjectId,
  });
  return next;
}

export function recommendContinuityActions(fabric: RuntimeFabric): ContinuityRecommendation[] {
  const recs: ContinuityRecommendation[] = [];
  for (const item of fabric.continuity) {
    if (item.status === "paused" || item.status === "needs_input") {
      recs.push({
        continuityId: item.id,
        title: item.title,
        chamber: item.chamber,
        action: "resume",
        reason: "run is paused and can be resumed from profile",
        destination: item.route,
      });
      continue;
    }
    if (item.status === "blocked") {
      recs.push({
        continuityId: item.id,
        title: item.title,
        chamber: item.chamber,
        action: "retry",
        reason: "run was blocked; retry with chamber model policy",
        destination: item.route,
      });
      continue;
    }
    if (item.status === "completed" || item.status === "validated") {
      const nextTab = item.transferDestinations[0] ?? "lab";
      recs.push({
        continuityId: item.id,
        title: item.title,
        chamber: item.chamber,
        action: "transfer",
        reason: "completed run can be transferred to a linked chamber",
        destination: { tab: nextTab, view: nextTab === "creation" ? "terminal" : "chat" },
      });
      recs.push({
        continuityId: item.id,
        title: item.title,
        chamber: item.chamber,
        action: "export",
        reason: "completed run is export-ready for the profile ledger",
        destination: { tab: "profile", view: "exports", id: item.id },
      });
    }
  }
  return recs.slice(0, 24);
}

export function buildSearchIndex(fabric: RuntimeFabric): SearchIndexEntry[] {
  const objectEntries: SearchIndexEntry[] = fabric.objects.map((object) => ({
    id: `object:${object.id}`,
    title: object.title,
    kind: "object",
    chamber: object.chamber,
    status: object.status,
    route: object.action_route,
    searchableText: [object.title, object.summary, object.tags.join(" "), object.type].join(" ").toLowerCase(),
    updatedAt: object.updated_at,
  }));
  const continuityEntries: SearchIndexEntry[] = fabric.continuity.map((item) => ({
    id: `continuity:${item.id}`,
    title: item.title,
    kind: "continuity",
    chamber: item.chamber,
    status: item.status,
    route: item.route,
    searchableText: [item.title, item.status, item.chamber].join(" ").toLowerCase(),
    updatedAt: item.updatedAt,
  }));
  const signalEntries: SearchIndexEntry[] = fabric.signals.map((signal) => ({
    id: `signal:${signal.id}`,
    title: signal.label,
    kind: "signal",
    chamber: signal.destinationChamber,
    status: signal.resolved ? "resolved" : signal.read ? "read" : "new",
    route: signal.destination,
    searchableText: [signal.label, signal.type, signal.severity].join(" ").toLowerCase(),
    updatedAt: signal.createdAt,
  }));
  return [...objectEntries, ...continuityEntries, ...signalEntries]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 500);
}

export function exportContinuity(fabric: RuntimeFabric, continuityId: string): RuntimeFabric {
  const item = fabric.continuity.find((c) => c.id === continuityId);
  if (!item) return fabric;
  let next = transitionContinuity(fabric, continuityId, "exported");
  next = awardProgress(next, {
    kind: "export",
    title: `${item.chamber} export`,
    points: 30,
    chamber: "profile",
  });
  next = pushSignal(next, {
    type: "reward",
    label: `${item.title.slice(0, 48)} exported to profile ledger`,
    severity: "info",
    sourceChamber: item.chamber,
    destinationChamber: "profile",
    destination: { tab: "profile", view: "exports" },
    linkedObjectId: item.linkedObjectId,
  });
  // Governance audit: persist export event into run timeline (consequence record)
  next = appendRunTimeline(next, {
    continuityId,
    label: `governance.export: ${item.chamber} · ${item.title.slice(0, 60)} → profile ledger`,
  });
  return next;
}

// ─── Cross-chamber context handoff ───────────────────────────────────────────

/**
 * Build a compact context digest from recent messages.
 * Safe to store in ContinuityItem.lastRunDigest and carry across chambers.
 */
export function buildContextHandoff(
  messages: Array<{ role: string; content: string }>,
  maxMessages = 6,
): { digest: string; messageCount: number; lastRole: string } {
  const recent = messages.slice(-maxMessages);
  const digest = recent
    .map((m) => `[${m.role}] ${m.content.slice(0, 200)}`)
    .join("\n---\n")
    .slice(0, 1400);
  return {
    digest,
    messageCount: recent.length,
    lastRole:     recent[recent.length - 1]?.role ?? "none",
  };
}

/**
 * Transfer a continuity item to another chamber, carrying a context digest
 * and pushing a cross-chamber transfer signal in one atomic update.
 * Preferred over raw transferContinuity() when message context must travel.
 */
export function handoffContinuity(
  fabric: RuntimeFabric,
  continuityId: string,
  to: Exclude<Tab, "profile">,
  digest: string,
  reason: string,
): RuntimeFabric {
  let next = transferContinuity(fabric, continuityId, to, reason);
  const item = fabric.continuity.find((c) => c.id === continuityId);
  if (!item) return next;
  next = {
    ...next,
    continuity: next.continuity.map((c) =>
      c.id === continuityId ? { ...c, lastRunDigest: digest.slice(0, 1400) } : c
    ),
  };
  next = pushSignal(next, {
    type:               "transfer",
    label:              `${item.title.slice(0, 48)} → ${to}`,
    severity:           "info",
    sourceChamber:      item.chamber,
    destinationChamber: to,
    destination:        { tab: to, view: to === "creation" ? "terminal" : "chat", id: continuityId },
    linkedObjectId:     item.linkedObjectId,
  });
  return next;
}

// ─── Compound network update ──────────────────────────────────────────────────
/**
 * Called on each successful run completion. Adds or reinforces the compound
 * node for this chamber session and refreshes the replication barrier score.
 */
export function upsertCompoundRun(
  fabric: RuntimeFabric,
  opts: { chamber: string; continuityId: string; contentLen: number },
): RuntimeFabric {
  const network = fabric.compoundNetwork ?? defaultCompoundNetwork();
  const nodeId  = `cn_chamber_${opts.chamber}_${opts.continuityId.slice(-8)}`;
  const existing = network.nodes.find((n) => n.id === nodeId);
  const advantage = Math.min(1, (opts.contentLen / 4000) * 0.4 + 0.05);

  const updatedNodes = existing
    ? network.nodes.map((n) =>
        n.id === nodeId
          ? { ...n, advantageScore: Math.min(1, n.advantageScore + advantage * 0.3), lastUpdated: Date.now() }
          : n
      )
    : [...network.nodes, createCompoundNode("output", opts.continuityId, `${opts.chamber} run`, advantage)];

  const barrier = estimateReplicationBarrier(
    fabric.continuity.filter((c) => c.status === "completed").length,
    fabric.objects.length,
    0,
    updatedNodes.length,
    Date.now() - (fabric.runTimeline[0]?.timestamp ?? Date.now()),
  );

  return {
    ...fabric,
    compoundNetwork: {
      ...network,
      nodes:       updatedNodes,
      barrier,
      lastUpdated: Date.now(),
    },
  };
}

export function recordRuntimeAttribution(fabric: RuntimeFabric, attribution: ConsequenceAttribution): RuntimeFabric {
  return { ...fabric, attributions: [attribution, ...fabric.attributions].slice(0, 400) };
}

export function updateRuntimePatterns(fabric: RuntimeFabric, patterns: AnalyticsPattern[]): RuntimeFabric {
  return { ...fabric, analyticsPatterns: patterns };
}

export function updateRuntimePresence(fabric: RuntimeFabric, manifest: PresenceManifest): RuntimeFabric {
  return {
    ...fabric,
    presenceManifests: {
      ...fabric.presenceManifests,
      [manifest.operatorId]: manifest,
    },
  };
}

export function heartbeatRuntimePresence(fabric: RuntimeFabric, operatorId: string): RuntimeFabric {
  const manifest = fabric.presenceManifests[operatorId];
  if (!manifest) return fabric;
  return {
    ...fabric,
    presenceManifests: {
      ...fabric.presenceManifests,
      [operatorId]: {
        ...manifest,
        channels: manifest.channels.map((c) => ({ ...c, lastSeenAt: Date.now() })),
        lastUpdated: Date.now(),
      },
    },
  };
}
