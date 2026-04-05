/**
 * RUBERRA — Mother Shell
 * Full state management ported from github.com/Ivan-star-dev/Ruberra
 * with Make-environment streaming via Supabase edge function.
 */

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { projectId, publicAnonKey } from "@/utils/supabase/info";
import { SovereignBar } from "./components/SovereignBar";
import { ShellSideRail } from "./components/ShellSideRail";
import { FloatingNoteSystem } from "./components/FloatingNoteSystem";
import { GlobalCommandPalette } from "./components/GlobalCommandPalette";
import { SignalsPanel } from "./components/SignalsPanel";
import { GlobalExecutionBand, type GlobalExecutionSnapshot } from "./components/GlobalExecutionBand";
import { LabMode } from "./components/modes/LabMode";
import { SchoolMode } from "./components/modes/SchoolMode";
import { CreationMode } from "./components/modes/CreationMode";
import { ProfileMode } from "./components/modes/ProfileMode";
import { MissionContextBand } from "./components/MissionContextBand";
import { SystemHealthBand } from "./components/SystemHealthBand";
import { defaultSystemModel, buildResourceSnapshot, updateSystemModel, setMissionState, type SystemModel } from "./dna/system-awareness";
import {
  type Mission,
  loadMissions,
  saveMissions,
  upsertMission,
} from "./dna/mission-substrate";
import {
  type MissionOperationsState,
  type TaskStatus,
  type ApprovalDecision,
  TASK_STATUS_LABEL,
  buildOperationState,
  createOperationFlow,
  advanceFlow,
  createTask,
  defaultApprovalPolicy,
  defaultMissionOperationsState,
  dismissSignal,
  emitSignal,
  evaluateApprovalTrigger,
  buildReleaseGate,
  transitionTask,
  type ApprovalRequest,
} from "./dna/autonomous-operations";
import {
  defaultAutonomousOperationsState,
  type AutonomousOperationsState,
} from "./components/autonomous-operations";
import {
  type Tab, type Message, type SignalStatus,
  type LabView, type SchoolView, type CreationView, type ProfileView,
  type FloatingNote, type Theme, type NavFn,
  type ExecutionResultEntry, type ExecutionState, type MessageExecutionTrace,
} from "./components/shell-types";
import { parseBlocks } from "./components/parseBlocks";
import { HeroLanding } from "./components/HeroLanding";
import {
  DEFAULT_TASK_BY_CHAMBER,
  DEFAULT_MODEL_BY_TASK,
  resolveExecutionPlan,
  type ChamberTab,
  type TaskType,
} from "./components/model-orchestration";
import {
  awardProgress,
  buildSearchIndex,
  createOrUpdateContinuity,
  loadRuntimeFabric,
  markSignalRead,
  markAllSignalsRead,
  patchContinuityRunTrace,
  pushSignal,
  recordRuntimeMessageObject,
  recommendedConnectorsForChamber,
  recommendContinuityActions,
  resumeContinuity,
  routeIntelligenceRequest,
  resolveSignal,
  saveRuntimeFabric,
  transitionContinuity,
  transferContinuity,
  updateAISettings,
  updatePreferences,
  updateWorkspaceKnowledge,
  updateRuntimePatterns,
  syncRuntimeKnowledge,
  recordRuntimeAttribution,
  updateRuntimePresence,
  heartbeatRuntimePresence,
  upsertPlugin,
  upsertConnector,
  exportContinuity,
  startWorkflowRun,
  buildContextHandoff,
  appendRunTimeline,
  transitionWorkflowStage,
  upsertProviderHealth,
  upsertCompoundRun,
  updateKnowledgeGraph,
  updateExchangeLedger,
  updateEcosystemState,
  updatePlatformState,
  updateOrgState,
  updatePersonalOS,
  updateCollectiveState,
  type ExecutionResultRecord,
  type RuntimeFabric,
  type ContinuityItem,
} from "./components/runtime-fabric";
import { resolveRouteDecision } from "./components/intelligence-foundation";
import {
  getExecutionTruth,
  buildLiveAdapterRegistry,
  resolveSovereignStack,
  PROVIDER_ADAPTERS,
  SOVEREIGN_MODEL_REGISTRY,
  CHAMBER_SOVEREIGN_DEFAULTS,
} from "./components/sovereign-runtime";
import { getContractByIntent, resolveIntent } from "./components/routing-contracts";
import { MODEL_REGISTRY } from "./components/model-orchestration";
import { enforceExecutionGate } from "./components/governance-fabric";
import { buildWorkflowRunPayload } from "./components/workflow-engine";
import { executeAIRequest, type ExecutionRequest } from "./components/execution-adapters";
import { defaultCivilization, registerAgent, admitAgent, activateAgent, type AgentDomain } from "./dna/multi-agent";
import { detectPatterns } from "./dna/intelligence-analytics";
import { defaultKnowledgeGraph, createNode, addNode } from "./dna/living-knowledge";
import { defaultCollectiveState, createMember, admitMember, buildMissionGraphNode, addToMissionGraph, claimCollectiveResource, checkCollectiveCollision, attributeConsequence, recordAttribution } from "./dna/collective-execution";
import { defaultExchangeLedger, mintValue, makeAvailable, addValueUnit, verifyValueUnit } from "./dna/value-exchange";
import { defaultPresenceManifest, createChannel, registerChannel, heartbeatChannel } from "./dna/distribution-presence";
import { defaultEcosystemState, proposeExtension, admitToNetwork } from "./dna/ecosystem-network";
import { defaultPlatformState, createInfraLayer, addLayer } from "./dna/platform-infrastructure";
import { defaultOrgState, assessMissionHealth, surfaceOrgInsights, defaultCapabilityMap } from "./dna/org-intelligence";
import { defaultPersonalOS, createMemoryEntry, buildOperatorContext } from "./dna/personal-sovereign-os";
import { defaultCompoundNetwork } from "./dna/compound-intelligence";
import { defaultTrustGovernanceState, upsertLedger, getMissionLedger, appendAuditToLedger, appendConsequenceToLedger } from "./dna/trust-governance";
import {
  defaultSovereignSecurityState,
  type SovereignSecurityState,
  createSession,
  buildFingerprint,
  verifyFingerprint,
  updateTrustSignal,
  createSecurityEvent,
  acknowledgeEvent,
  getUnacknowledgedEvents,
  deriveTrustSignal,
  evaluateAccess,
  defaultAccessPolicy,
  defaultIsolationBoundary,
  verifyIsolation,
  scanConnectorOutput,
  checkStorageSafety,
  DEFAULT_RUNTIME_SAFETY_POLICY,
} from "./dna/sovereign-security";
import { defaultAutonomousFlowState, createFlowDef, createFlowRun, createFlowStepDef, upsertFlowDef, upsertFlowRun } from "./dna/autonomous-flow";
import {
  prioritizeMemory,
  resolveMissionRoute,
  evaluateAutonomy,
  type MemoryItem,
  type MemoryRecallRequest,
  type MissionReasoningResult,
} from "./dna/sovereign-intelligence";
import { PIONEER_REGISTRY } from "./components/pioneer-registry";
import { mcpMissionCreate, mcpMissionUpdateState, mcpMissionAttachContinuity, mcpMissionBuildHandoff } from "./components/mcp-client";

// ─── Constants ────────────────────────────────────────────────────────────────
const TABS: Tab[] = ["lab", "school", "creation", "profile"];
const STORAGE_KEY       = "ruberra_messages_v2";
const GOV_STORAGE_KEY   = "ruberra_trust_gov_v1";


function loadTrustGov() {
  if (typeof window === "undefined") return defaultTrustGovernanceState();
  try {
    const raw = localStorage.getItem(GOV_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ReturnType<typeof defaultTrustGovernanceState>;
  } catch { /* corrupt */ }
  return defaultTrustGovernanceState();
}


const MAX_CONTEXT = 20;

const TERMINAL_EXECUTION_STATES = new Set<MessageExecutionTrace["executionState"]>([
  "completed",
  "degraded",
  "blocked",
  "error",
  "aborted",
  "provider_unavailable",
  "scaffold_only",
]);

function mapExecutionStateToTaskStatus(state: MessageExecutionTrace["executionState"]): TaskStatus {
  if (state === "completed") return "completed";
  if (state === "degraded" || state === "scaffold_only") return "review";
  if (state === "aborted") return "cancelled";
  return "blocked";
}

function buildExecutionTaskTitle(message: Message, result?: ExecutionResultRecord): string {
  const base = (message.execution_trace?.routeDigest ?? message.content ?? "Mission execution").slice(0, 72).trim();
  const providerModel = [result?.selectedProviderId, result?.selectedModelId].filter(Boolean).join(" · ");
  return providerModel ? `${base} · ${providerModel}`.slice(0, 96) : base.slice(0, 96);
}

// ─── Stack 03 — Mission context builder ──────────────────────────────────────
/**
 * Compresses the active mission identity into a system message prefix.
 * Injected at position 0 of every dispatch when a mission is active.
 * This is the core mechanism by which sovereign intelligence serves
 * the mission rather than the generic session.
 */
function buildMissionSystemContext(mission: Mission): string {
  const lines = [
    "You are serving a Ruberra sovereign mission. Stay strictly within mission scope.",
    `MISSION: ${mission.identity.name}`,
    `OBJECTIVE: ${mission.identity.outcomeStatement}`,
    `SCOPE: ${mission.identity.scope}`,
    `NOT THIS: ${mission.identity.notThis}`,
    `CHAMBER: ${mission.identity.chamberLead}`,
  ];
  if (mission.identity.successCriteria.length > 0) {
    lines.push(`SUCCESS CRITERIA: ${mission.identity.successCriteria.slice(0, 3).join("; ")}`);
  }
  return lines.join("\n");
}

/**
 * Stack 03 — Mission memory recall.
 * Surfaces the last N execution continuity items bound to this mission
 * as prior context. Intelligence must know what has happened in this
 * mission, not just what the mission is.
 */
function buildMissionMemoryContext(mission: Mission, continuity: ContinuityItem[]): string | null {
  const missionName = mission.identity.name.toLowerCase();
  const relevant = continuity
    .filter((c) =>
      c.workflowId === mission.id ||
      c.title.toLowerCase().includes(missionName)
    )
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 4);
  if (relevant.length === 0) return null;
  const lines = ["PRIOR MISSION RUNS:"];
  for (const c of relevant) {
    const digest = c.lastRunDigest ?? `${c.status}: ${c.title}`;
    lines.push(`- [${c.chamber}] ${digest.slice(0, 120)}`);
  }
  return lines.join("\n");
}
const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b9f46b68`;

type TabMessages = Record<Tab, Message[]>;
type TabLoading  = Record<Tab, boolean>;
type TabSignals  = Record<Tab, SignalStatus>;
type TabDrafts   = Record<Tab, string>;
type ChamberTasks    = Record<ChamberTab, TaskType>;
type ChamberModels   = Record<ChamberTab, string>;

function emptyRecord<T>(value: T): Record<Tab, T> {
  return Object.fromEntries(TABS.map((t) => [t, value])) as Record<Tab, T>;
}

function loadMessages(): TabMessages {
  if (typeof window === "undefined") return emptyRecord<Message[]>([]);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as TabMessages;
      if (TABS.every((t) => Array.isArray(parsed[t]))) return parsed;
    }
  } catch { /* corrupt storage */ }
  return emptyRecord<Message[]>([]);
}

function recallMissionPriorContext(
  mission: Mission,
  requestText: string,
): { request: MemoryRecallRequest; items: MemoryItem[]; priorContext: string } {
  const now = Date.now();
  const decisionItems: MemoryItem[] = mission.memory.decisions.map((d) => ({
    id: d.id,
    missionId: mission.id,
    content: `${d.statement} — ${d.rationale}`,
    sourceType: "decision",
    priority: d.reversible ? "standard" : "high",
    createdAt: d.at,
    lastAccessAt: now,
    accessCount: 1,
    compressed: false,
  }));
  const contextItems: MemoryItem[] = [
    ...(mission.memory.context
      ? [{
          id: `${mission.id}-context`,
          missionId: mission.id,
          content: mission.memory.context,
          sourceType: "context" as const,
          priority: "high" as const,
          createdAt: mission.memory.lastUpdated,
          lastAccessAt: now,
          accessCount: 1,
          compressed: false,
        }]
      : []),
    ...mission.memory.constraints.map((c, i) => ({
      id: `${mission.id}-constraint-${i}`,
      missionId: mission.id,
      content: c,
      sourceType: "constraint" as const,
      priority: "high" as const,
      createdAt: mission.memory.lastUpdated,
      lastAccessAt: now,
      accessCount: 1,
      compressed: false,
    })),
    ...mission.memory.priorReasoning.map((r, i) => ({
      id: `${mission.id}-reasoning-${i}`,
      missionId: mission.id,
      content: r,
      sourceType: "reasoning" as const,
      priority: "standard" as const,
      createdAt: mission.memory.lastUpdated,
      lastAccessAt: now,
      accessCount: 1,
      compressed: true,
      compressedSummary: r.slice(0, 140),
    })),
  ];
  const all = [...decisionItems, ...contextItems];
  const request: MemoryRecallRequest = {
    missionId: mission.id,
    query: requestText,
    maxItems: 6,
    minPriority: "standard",
    sourceTypes: ["decision", "constraint", "reasoning", "context"],
  };
  const scoped = all.filter((item) => {
    const pRank = { critical: 4, high: 3, standard: 2, low: 1, discard: 0 } as const;
    return pRank[item.priority] >= pRank[request.minPriority] &&
      (!request.sourceTypes || request.sourceTypes.includes(item.sourceType));
  });
  const recalled = prioritizeMemory(scoped, request.query, request.maxItems);
  const priorContext = recalled.map((i) => i.compressedSummary ?? i.content).join(" | ");
  return { request, items: recalled, priorContext };
}

export default function App() {
  // ── Core state ──────────────────────────────────────────────────────────────
  const [activeTab,    setActiveTab]    = useState<Tab>("lab");
  const [messages,     setMessages]     = useState<TabMessages>(loadMessages);
  const [loading,      setLoading]      = useState<TabLoading>(emptyRecord(false));
  const [signals,      setSignals]      = useState<TabSignals>(emptyRecord<SignalStatus>("idle"));
  const [drafts,       setDrafts]       = useState<TabDrafts>(emptyRecord(""));
  const [tasks, setTasks] = useState<ChamberTasks>({
    lab: DEFAULT_TASK_BY_CHAMBER.lab,
    school: DEFAULT_TASK_BY_CHAMBER.school,
    creation: DEFAULT_TASK_BY_CHAMBER.creation,
  });
  const [activeModels, setActiveModels] = useState<ChamberModels>({
    lab: DEFAULT_MODEL_BY_TASK[DEFAULT_TASK_BY_CHAMBER.lab],
    school: DEFAULT_MODEL_BY_TASK[DEFAULT_TASK_BY_CHAMBER.school],
    creation: DEFAULT_MODEL_BY_TASK[DEFAULT_TASK_BY_CHAMBER.creation],
  });

  // ── Chamber sub-views ────────────────────────────────────────────────────────
  const [labView,      setLabView]      = useState<LabView>("home");
  const [schoolView,   setSchoolView]   = useState<SchoolView>("home");
  const [creationView, setCreationView] = useState<CreationView>("home");
  const [profileView, setProfileView] = useState<ProfileView>("overview");
  const [runtimeFabric, setRuntimeFabric] = useState<RuntimeFabric>(loadRuntimeFabric);
  const [missions, setMissions] = useState<Mission[]>(loadMissions);
  const [operations, setOperations] = useState<AutonomousOperationsState>(defaultAutonomousOperationsState);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(() => {
    try { return localStorage.getItem("ruberra_active_mission_id") ?? null; } catch { return null; }
  });
  const [activeMissionOps, setActiveMissionOps] = useState<MissionOperationsState | null>(() =>
    activeMissionId ? defaultMissionOperationsState(activeMissionId) : null
  );
  const [securityState, setSecurityState] = useState<SovereignSecurityState>(defaultSovereignSecurityState);

  // ── Detail navigation ────────────────────────────────────────────────────────
  const [detailId, setDetailId] = useState<string>("");

  // ── Navigation system — the heart of product connectivity ────────────────────
  const navigate = useCallback<NavFn>((tab, view, id = "") => {
    setActiveTab(tab);
    if (tab === "lab")      setLabView(view as LabView);
    if (tab === "school")   setSchoolView(view as SchoolView);
    if (tab === "creation") setCreationView(view as CreationView);
    if (tab === "profile") setProfileView(view as ProfileView);
    setDetailId(id);
  }, []);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setDetailId("");
    if (tab === "lab") setLabView("home");
    if (tab === "school") setSchoolView("home");
    if (tab === "creation") setCreationView("home");
    if (tab === "profile") setProfileView("overview");
  }, []);

  // ── Floating notes ───────────────────────────────────────────────────────────
  const [notes, setNotes] = useState<FloatingNote[]>([]);

  // ── Shell / Hero Mode ────────────────────────────────────────────────────────
  const [isShellMode, setIsShellMode] = useState<boolean>(true);

  // ── Theme ────────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState<Theme>("light");

  // ── System model (awareness) ─────────────────────────────────────────────────
  const [systemModel, setSystemModel] = useState<SystemModel>(defaultSystemModel);

  // ── Command palette + signals panel ───────────────────────────────────────────
  const [cmdOpen, setCmdOpen] = useState(false);
  const [signalsOpen, setSignalsOpen] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(false);
  // ── Presence heartbeat tick ───────────────────────────────────────────────────
  const [heartbeatTick, setHeartbeatTick] = useState(0);
  // ── Stack substrates ─────────────────────────────────────────────────────────
  // Stacks 10-20 now use canonical RuntimeFabric persistence only.
  const searchIndex = useMemo(() => buildSearchIndex(runtimeFabric), [runtimeFabric]);
  const trustSignal = deriveTrustSignal(securityState.events);
  const activeMission = activeMissionId ? missions.find((m) => m.id === activeMissionId) ?? null : null;
  const missionTaskByContinuityRef = useRef<Record<string, string>>({});
  const generatedMissionTaskRef = useRef<Set<string>>(new Set());

  const knowledgeGraph = useMemo(() => {
    let g = defaultKnowledgeGraph();
    for (const obj of runtimeFabric.objects.slice(0, 20)) {
      const node = createNode({
        type:       obj.type === "investigation" ? "concept" : obj.type === "lesson" ? "concept" : "artifact",
        content:    obj.title,
        tags:       obj.tags ?? [],
        confidence: "medium",
      });
      g = addNode(g, node);
    }
    return g;
  }, [runtimeFabric.objects]);

  const [civBase] = useState(() => {
    try {
      const raw = localStorage.getItem("ruberra_stack_civBase");
      if (raw) return JSON.parse(raw);
    } catch { /* corrupt */ }
    return defaultCivilization();
  });
  const [trustGovState, setTrustGovState] = useState(loadTrustGov);
  const [flowState, setFlowState] = useState(defaultAutonomousFlowState);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setCmdOpen(false);
        setSignalsOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [theme]);

  // ── Persistence ───────────────────────────────────────────────────────────────
  const messagesRef = useRef<TabMessages>(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch { /* storage full */ }
    }, 500);
    return () => clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    saveRuntimeFabric(runtimeFabric);
  }, [runtimeFabric]);

  useEffect(() => {
    setRuntimeFabric((prev) => syncRuntimeKnowledge(prev));
  }, [runtimeFabric.objects]);

  useEffect(() => {
    saveMissions(missions);
  }, [missions]);

  useEffect(() => {
    try { localStorage.setItem(GOV_STORAGE_KEY, JSON.stringify(trustGovState)); } catch { /* storage full */ }
  }, [trustGovState]);



  const handleMissionUpsert = useCallback((m: Mission) => {
    setMissions((prev) => {
      const isNew = !prev.find((existing) => existing.id === m.id);
      if (isNew) {
        // Persist to MCP KV store — fire-and-forget, non-blocking
        mcpMissionCreate({
          name:             m.identity.name,
          chamberLead:      m.identity.chamberLead,
          description:      m.identity.description || undefined,
          outcomeStatement: m.identity.outcomeStatement || undefined,
          tags:             m.identity.tags.length ? m.identity.tags : undefined,
        }).catch(() => { /* non-fatal */ });
      } else {
        // Sync state transition to MCP if ledger state changed
        const existing = prev.find((ex) => ex.id === m.id);
        if (existing && existing.ledger.currentState !== m.ledger.currentState) {
          mcpMissionUpdateState(m.id, m.ledger.currentState, "mission state sync").catch(() => { /* non-fatal */ });
        }
      }
      return upsertMission(prev, m);
    });
  }, []);

  // ── Stack 04 — Autonomous Operations handlers ─────────────────────────────────
  const handleOperationSignalRead = useCallback((id: string) => {
    setOperations((prev) => ({
      ...prev,
      signals: prev.signals.map((s) => s.id === id ? { ...s, read: true } : s),
    }));
  }, []);

  const handleOperationSignalResolve = useCallback((id: string) => {
    setOperations((prev) => ({
      ...prev,
      signals: prev.signals.map((s) => s.id === id ? { ...s, read: true, resolved: true, resolvedAt: Date.now() } : s),
    }));
  }, []);

  const handleHandoffAccept = useCallback((id: string) => {
    setOperations((prev) => ({
      ...prev,
      handoffs: prev.handoffs.map((h) => h.id === id ? { ...h, state: "accepted" as const, acceptedAt: Date.now() } : h),
    }));
  }, []);

  const handleHandoffReject = useCallback((id: string, reason: string) => {
    setOperations((prev) => ({
      ...prev,
      handoffs: prev.handoffs.map((h) => h.id === id ? { ...h, state: "rejected" as const, rejectionReason: reason } : h),
    }));
  }, []);

  const recordSecurityEvent = useCallback((event: ReturnType<typeof createSecurityEvent>) => {
    setSecurityState((prev) => updateTrustSignal({
      ...prev,
      events: [event, ...prev.events].slice(0, 200),
      lastAuditAt: Date.now(),
    }));
  }, []);

  const handleMissionActivate = useCallback((missionId: string) => {
    abortRefs.current.lab?.abort();
    abortRefs.current.school?.abort();
    abortRefs.current.creation?.abort();
    abortRefs.current.profile?.abort();
    setLoading(emptyRecord(false));
    setSignals(emptyRecord("idle"));
    setDrafts(emptyRecord(""));
    setActiveMissionId(missionId);
    setActiveMissionOps(defaultMissionOperationsState(missionId));
    const mission = missions.find((m) => m.id === missionId);
    setSystemModel((prev) => {
      let next = prev;
      if (activeMissionId) next = setMissionState(next, activeMissionId, "idle");
      return setMissionState(next, missionId, mission?.ledger.currentState ?? "active");
    });
    // Stack 05: ghost-safe activation — abort all in-flight chamber requests before binding new mission
    Object.values(abortRefs.current).forEach((c) => c?.abort());
    setLoading({ lab: false, school: false, creation: false, profile: false });
    setSignals({ lab: "idle", school: "idle", creation: "idle", profile: "idle" });
    setActiveMissionId(missionId);
    const existing = systemModel.missionOperations[missionId];
    setActiveMissionOps(existing || defaultMissionOperationsState(missionId));
    try { localStorage.setItem("ruberra_active_mission_id", missionId); } catch { /* storage full */ }
  }, [activeMissionId, missions]);

  const handleMissionRelease = useCallback(() => {
    if (activeMissionId) {
      setSystemModel((prev) => setMissionState(prev, activeMissionId, "idle"));
    }
    setActiveMissionId(null);
    setActiveMissionOps(null);
    try { localStorage.removeItem("ruberra_active_mission_id"); } catch { /* ignore */ }
  }, [activeMissionId]);
  const handleMissionPaletteNew = useCallback(() => {
    setActiveTab("profile");
    setProfileView("projects");
  }, []);

  const handleMissionPaletteSwitch = useCallback(() => {
    setActiveTab("profile");
    setProfileView("projects");
  }, []);

  const handleMissionPaletteHandoff = useCallback(() => {
    if (!activeMissionId) return;
    mcpMissionBuildHandoff(activeMissionId).catch(() => { /* non-fatal */ });
    setActiveTab("profile");
    setProfileView("operations");
  }, [activeMissionId]);

  // ── Sovereign runtime probe — live adapter availability on mount ─────────────
  // Re-runs when aiSettings change so updated endpoints are probed immediately.
  useEffect(() => {
    const controller = new AbortController();
    const osCfg = runtimeFabric.aiSettings.openSourceProviders;
    const endpointOverrides: Record<string, string> = {};
    if (osCfg?.ollama?.endpoint)   endpointOverrides["ollama-local"] = osCfg.ollama.endpoint;
    if (osCfg?.vllm?.endpoint)     endpointOverrides["vllm-local"]   = osCfg.vllm.endpoint;
    if (osCfg?.lmstudio?.endpoint) endpointOverrides["lm-studio"]    = osCfg.lmstudio.endpoint;

    buildLiveAdapterRegistry(controller.signal, endpointOverrides)
      .then((liveAdapters) => {
        setRuntimeFabric((prev) => {
          let next = prev;
          for (const adapter of liveAdapters) {
            const healthState = adapter.available ? "healthy" : "unavailable";
            // Store by adapter id (sovereign-runtime id space)
            next = upsertProviderHealth(next, { providerId: adapter.id, state: healthState });
            // Also store by model-registry provider id so execution trace lookups resolve correctly
            if (adapter.registryProviderId) {
              next = upsertProviderHealth(next, { providerId: adapter.registryProviderId, state: healthState });
            }
          }
          return next;
        });
      })
      .catch(() => { /* probe failures are non-fatal */ });
    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runtimeFabric.aiSettings.openSourceProviders]);

  useEffect(() => {
    if (securityState.session) return;
    setSecurityState((prev) => updateTrustSignal({
      ...prev,
      session: createSession(buildFingerprint()),
      lastAuditAt: Date.now(),
    }));
  }, [securityState.session]);

  // ── Presence heartbeat — update channel lastSeenAt every 30s ─────────────────
  useEffect(() => {
    const id = setInterval(() => setHeartbeatTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const needsConfig = runtimeFabric.connectors.filter((c) => c.status === "needs_config");
    if (!needsConfig.length) return;
    setRuntimeFabric((prev) => {
      let next = prev;
      for (const connector of needsConfig) {
        const exists = next.signals.some((s) => !s.resolved && s.type === "connector" && s.linkedObjectId === connector.id);
        if (exists) continue;
        next = pushSignal(next, {
          type: "connector",
          label: `${connector.label} needs configuration`,
          severity: "warn",
          sourceChamber: "profile",
          destinationChamber: "profile",
          destination: { tab: "profile", view: "connectors" },
          linkedObjectId: connector.id,
        });
      }
      return next;
    });
  }, [runtimeFabric.connectors]);

  // ── System model health — periodic real snapshot ──────────────────────────────
  useEffect(() => {
    const tick = () => {
      const snapshot = buildResourceSnapshot();
      setSystemModel((prev) => updateSystemModel(prev, snapshot));
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  // ── Stack 06: Operator session init — identity integrity substrate ─────────────
  useEffect(() => {
    setSecurityState((prev) => {
      if (prev.session) return prev;
      const session = createSession(buildFingerprint());
      return updateTrustSignal({ ...prev, session });
    });
  }, []);

  // ── Stack 06: Runtime safety — periodic storage safety check ──────────────────
  useEffect(() => {
    const check = () => {
      const result = checkStorageSafety(DEFAULT_RUNTIME_SAFETY_POLICY);
      if (!result.safe) {
        setSecurityState((prev) => {
          const alreadyFlagged = prev.events.some(
            (e) => !e.acknowledged && e.type === "storage_overflow"
          );
          if (alreadyFlagged) return prev;
          const event = createSecurityEvent({
            type:     "storage_overflow",
            severity: "warn",
            summary:  `localStorage usage ${Math.round((result.usageBytes ?? 0) / 1024)}KB exceeds safety threshold.`,
          });
          return updateTrustSignal({ ...prev, events: [...prev.events, event] });
        });
      }
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  // ── Abort refs ───────────────────────────────────────────────────────────────
  const abortRefs = useRef<Record<Tab, AbortController | null>>(
    emptyRecord<AbortController | null>(null)
  );

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleCancel = useCallback(() => {
    abortRefs.current[activeTab]?.abort();
  }, [activeTab]);

  const handleDraftChange = useCallback((text: string) => {
    setDrafts((prev) => ({ ...prev, [activeTab]: text }));
  }, [activeTab]);

  const handleTaskChange = useCallback((tab: ChamberTab, task: TaskType) => {
    setTasks((prev) => ({ ...prev, [tab]: task }));
    setActiveModels((prev) => ({ ...prev, [tab]: DEFAULT_MODEL_BY_TASK[task] }));
  }, []);

  const handleModelChange = useCallback((tab: ChamberTab, modelId: string) => {
    setActiveModels((prev) => ({ ...prev, [tab]: modelId }));
  }, []);

  const applyParsedBlocks = useCallback((id: string, tab: Tab) => {
    setMessages((prev) => ({
      ...prev,
      [tab]: prev[tab].map((m) => {
        if (m.id !== id || m.role !== "assistant") return m;
        const blocks = parseBlocks(m.content);
        return blocks.length > 0 ? { ...m, blocks } : m;
      }),
    }));
  }, []);

  // ── Stream handler ────────────────────────────────────────────────────────────
  const handleSend = useCallback(async (text: string) => {
    const tab = activeTab;
    if (tab === "profile") return;
    const fingerprint = buildFingerprint();
    if (securityState.session) {
      const sessionCheck = verifyFingerprint(securityState.session, fingerprint);
      if (!sessionCheck.valid) {
        recordSecurityEvent(createSecurityEvent({
          type: "session_anomaly",
          severity: "critical",
          missionId: activeMissionId ?? undefined,
          summary: "Session fingerprint mismatch detected",
          detail: `Anomaly: ${sessionCheck.anomaly ?? "unknown"}`,
        }));
        setSystemModel((prev) => activeMissionId ? setMissionState(prev, activeMissionId, "blocked") : prev);
        return;
      }
    } else {
      setSecurityState((prev) => updateTrustSignal({
        ...prev,
        session: createSession(fingerprint),
        lastAuditAt: Date.now(),
      }));
    }
    if (activeMission && (activeMission.ledger.currentState === "completed" || activeMission.ledger.currentState === "archived")) {
      setRuntimeFabric((prev) => pushSignal(prev, {
        type: "recommendation",
        label: `Mission ${activeMission.ledger.currentState} — release mission context before new dispatch`,
        severity: "warn",
        sourceChamber: tab,
        destinationChamber: "profile",
        destination: { tab: "profile", view: "projects" },
        linkedObjectId: activeMission.id,
      }));
      return;
    }

    // ── Stack 04: Sovereign Dispatch Guard ──────────────────────────────────
    // If the mission substrate is blocked or awaiting sovereign approval,
    // the execution chain is frozen. Directives cannot bypass operational law.
    if (activeMissionOps && !activeMissionOps.operationState.isHealthy) {
      setSignals((prev) => ({ ...prev, [tab]: "error" }));
      setRuntimeFabric((prev) => pushSignal(prev, {
        type:               "lifecycle",
        label:              `Dispatch Blocked · Mission: "${activeMission?.identity.name || activeMissionId}" is unhealthy`,
        severity:           "critical",
        sourceChamber:      tab,
        destinationChamber: "profile",
        destination:        { tab: "profile", view: "overview" },
        body: "The operational substrate has hit a blocker or requires approval. Execution is suspended until the mission state is restored to 'healthy'.",
      }));
      return;
    }
    // ─────────────────────────────────────────────────────────────────────────

    const task = tasks[tab as ChamberTab];
    const connectorCandidates = recommendedConnectorsForChamber(runtimeFabric, tab);
    setRuntimeFabric((prev) => updatePreferences(prev, {
      preferredChamber: tab,
      preferredObjectType: tab === "school" ? "lesson" : tab === "lab" ? "experiment" : "artifact_pack",
    }));
    const requestedModelId = activeModels[tab as ChamberTab];
    const plan = resolveExecutionPlan(tab, task, requestedModelId);
    const workflowId =
      tab === "creation" ? "build-heavy"    :
      tab === "lab"      ? "research-heavy" :
      tab === "school"   ? "learning-heavy" : "balanced-trinity";
    // Stack 03: when mission is active, honor declared pioneer stack in routing
    const baseRouteDecision = resolveRouteDecision(runtimeFabric.intelligence, {
      chamberHint: tab,
      workflowId,
      requestText: text,
      preferredPioneerId: activeMission?.workflow.pioneerStack[0],
    });
    const missionMemoryRecall = activeMission ? recallMissionPriorContext(activeMission, text) : null;
    const missionRoute = activeMission ? resolveMissionRoute({
      missionId: activeMission.id,
      missionStatus: activeMission.ledger.currentState,
      chamberLead: activeMission.identity.chamberLead,
      requestText: text,
      preferredPioneer: undefined,
      depth: "standard",
      sessionChamber: tab,
    }) : null;
    if (missionRoute && missionRoute.chamber !== tab) {
      setRuntimeFabric((prev) => pushSignal(prev, {
        type: "recommendation",
        label: `Mission route requires ${missionRoute.chamber} chamber for this dispatch`,
        severity: "warn",
        sourceChamber: tab,
        destinationChamber: missionRoute.chamber,
        destination: { tab: missionRoute.chamber, view: missionRoute.chamber === "creation" ? "terminal" : "chat" },
        linkedObjectId: activeMission?.id,
      }));
      return;
    }
    const missionRoutePinned = missionRoute && missionRoute.chamber === tab ? missionRoute : null;
    if (activeMission && activeMissionId) {
      const accessPolicy = {
        ...defaultAccessPolicy(activeMissionId),
        allowedPioneers: activeMission.workflow.pioneerStack.length ? activeMission.workflow.pioneerStack : [],
        requireApprovalFor: activeMission.policy.requiresApproval.includes("connector_use")
          ? ["mission_execute", "connector_use", "handoff_initiate"]
          : ["connector_use", "handoff_initiate"],
      };
      const accessVerdict = evaluateAccess("mission_execute", missionRoutePinned?.pioneerId ?? baseRouteDecision.pioneerId, accessPolicy);
      if (accessVerdict !== "permit") {
        recordSecurityEvent(createSecurityEvent({
          type: "scope_violation",
          severity: accessVerdict === "deny" ? "critical" : "warn",
          missionId: activeMissionId,
          summary: `mission_execute ${accessVerdict} for pioneer`,
          detail: `${missionRoutePinned?.pioneerId ?? baseRouteDecision.pioneerId} on ${tab}`,
        }));
        setSystemModel((prev) => setMissionState(prev, activeMissionId, "blocked"));
        return;
      }
      if (connectorCandidates.length > 0) {
        const connectorVerdict = evaluateAccess("connector_use", missionRoutePinned?.pioneerId ?? baseRouteDecision.pioneerId, accessPolicy);
        if (connectorVerdict !== "permit") {
          recordSecurityEvent(createSecurityEvent({
            type: "scope_violation",
            severity: connectorVerdict === "deny" ? "critical" : "warn",
            missionId: activeMissionId,
            summary: `connector_use ${connectorVerdict} for pioneer`,
            detail: `${missionRoutePinned?.pioneerId ?? baseRouteDecision.pioneerId} on ${tab}`,
          }));
          setSystemModel((prev) => setMissionState(prev, activeMissionId, "blocked"));
          return;
        }
      }
      const autonomy = evaluateAutonomy(
        `${tab}.${task}.${text.slice(0, 140)}`,
        {
          missionId: activeMissionId,
          maxAutoStepsBeforeCheck: 4,
          allowIrreversibleActions: false,
          requireApprovalFor: activeMission.policy.requiresApproval,
          forbiddenActions: activeMission.policy.forbidden,
          scopeBoundary: activeMission.identity.scope,
        },
        activeMissionOps?.tasks.length ?? 0,
      );
      if (autonomy.decision === "stop" || autonomy.decision === "escalate" || autonomy.decision === "pause_check") {
        recordSecurityEvent(createSecurityEvent({
          type: autonomy.decision === "stop" ? "scope_violation" : "recovery_executed",
          severity: autonomy.decision === "stop" ? "critical" : "warn",
          missionId: activeMissionId,
          summary: `Autonomy gate ${autonomy.decision}`,
          detail: autonomy.reason,
        }));
        setActiveMissionOps((prev) => {
          if (!prev || prev.missionId !== activeMissionId) return prev;
          const now = Date.now();
          const approvalRequest = autonomy.decision === "escalate" || autonomy.decision === "pause_check"
            ? {
                id: `apr_${now}_${Math.random().toString(36).slice(2, 8)}`,
                missionId: activeMissionId,
                trigger: autonomy.decision === "escalate" ? "high_risk_operation" as const : "scope_boundary_cross" as const,
                requestedBy: missionRoutePinned?.pioneerId ?? baseRouteDecision.pioneerId,
                description: autonomy.reason.slice(0, 180),
                consequence: `Dispatch held for approval · ${tab}`,
                riskLevel: autonomy.riskLevel,
                createdAt: now,
              }
            : null;
          const observation = {
            id: `obs_${now}_${tab}`,
            missionId: activeMissionId,
            class: autonomy.decision === "stop" ? "blocker_hit" as const : "approval_needed" as const,
            summary: autonomy.reason.slice(0, 140),
            pioneerId: missionRoutePinned?.pioneerId ?? baseRouteDecision.pioneerId,
            at: now,
          };
          const next = {
            ...prev,
            pendingApprovals: approvalRequest ? [...prev.pendingApprovals, approvalRequest] : prev.pendingApprovals,
            observations: [...prev.observations, observation],
            signals: [
              ...prev.signals,
              emitSignal(activeMissionId, {
                type: autonomy.decision === "stop" ? "blocker" : "approval_needed",
                priority: autonomy.decision === "stop" ? "critical" : "high",
                headline: autonomy.decision === "stop" ? "dispatch blocked by mission policy" : "approval required before dispatch",
                body: autonomy.reason.slice(0, 140),
                actionable: true,
              }),
            ],
            governanceLog: [
              ...prev.governanceLog,
              {
                id: `gov_${now}_${tab}`,
                missionId: activeMissionId,
                action: autonomy.decision === "stop" ? "abort" : "preview",
                triggeredBy: missionRoutePinned?.pioneerId ?? baseRouteDecision.pioneerId ?? "operator",
                approved: false,
                consequence: autonomy.reason.slice(0, 180),
                at: now,
              },
            ],
            lastUpdated: now,
          };
          return {
            ...next,
            operationState: buildOperationState(activeMissionId, next.tasks, next.observations, next.pendingApprovals.length),
          };
        });
        setSystemModel((prev) => setMissionState(prev, activeMissionId, "blocked"));
        return;
      }
      const highImpactAction =
        /deploy|export|webhook|publish|delete|rollback|external/i.test(text) || tab === "creation";
      if (highImpactAction) {
        const highImpactGate = enforceExecutionGate(
          tab === "creation" ? "connector.deploy" : "connector.write",
          {
            kind: "operator",
            id: runtimeFabric.workspace.owner,
            missionId: activeMissionId,
            chamberId: tab,
            label: runtimeFabric.workspace.owner,
          }
        );
        if (!highImpactGate.allowed) {
          recordSecurityEvent(createSecurityEvent({
            type: "scope_violation",
            severity: highImpactGate.verdict === "deferred" ? "warn" : "critical",
            missionId: activeMissionId,
            summary: `High-impact gate ${highImpactGate.verdict}`,
            detail: highImpactGate.reason,
          }));
          setActiveMissionOps((prev) => {
            if (!prev || prev.missionId !== activeMissionId) return prev;
            const next = {
              ...prev,
              pendingApprovals: [
                ...prev.pendingApprovals,
                {
                  id: `apr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                  missionId: activeMissionId,
                  trigger: "external_effect" as const,
                  requestedBy: missionRoutePinned?.pioneerId ?? baseRouteDecision.pioneerId,
                  description: highImpactGate.reason.slice(0, 180),
                  consequence: "High-impact action held until sovereign approval",
                  riskLevel: "high" as const,
                  createdAt: Date.now(),
                },
              ],
              signals: [
                ...prev.signals,
                emitSignal(activeMissionId, {
                  type: "approval_needed",
                  priority: "high",
                  headline: "High-impact action requires approval",
                  body: highImpactGate.reason.slice(0, 140),
                  actionable: true,
                }),
              ],
              lastUpdated: Date.now(),
            };
            return {
              ...next,
              operationState: buildOperationState(activeMissionId, next.tasks, next.observations, next.pendingApprovals.length),
            };
          });
          return;
        }
      }
    }
    const routeDecision = {
      ...baseRouteDecision,
      pioneerId: missionRoutePinned?.pioneerId ?? baseRouteDecision.pioneerId,
      giId: missionRoutePinned?.giId ?? baseRouteDecision.giId,
      supportChain: missionRoutePinned
        ? Array.from(new Set([...(missionRoutePinned.supportChain ?? []), ...baseRouteDecision.supportChain]))
        : baseRouteDecision.supportChain,
      reason: missionRoutePinned
        ? `${baseRouteDecision.reason} · ${missionRoutePinned.missionReason}`
        : baseRouteDecision.reason,
    };
    const missionReasoning: MissionReasoningResult | null = missionRoutePinned ? {
      requestId: `reason_${Date.now()}`,
      missionId: missionRoutePinned.missionId,
      mode: "planning",
      steps: [
        {
          id: `step_context_${Date.now()}`,
          at: Date.now(),
          operation: "prior-context-recall",
          input: text.slice(0, 120),
          output: missionMemoryRecall?.priorContext?.slice(0, 180) ?? "no prior context",
          confidence: missionMemoryRecall?.items.length ? "high" : "medium",
        },
        {
          id: `step_route_${Date.now()}`,
          at: Date.now(),
          operation: "mission-route-resolution",
          input: missionRoutePinned.reason,
          output: missionRoutePinned.missionReason,
          confidence: "high",
        },
      ],
      conclusion: missionRoutePinned.reason,
      confidence: "high",
      nextActions: [
        `dispatch.${tab}`,
        `workflow.${missionRoutePinned.workflowId ?? workflowId}`,
      ],
      producedAt: Date.now(),
    } : null;
    const leaderPioneer = runtimeFabric.intelligence.pioneers.find((entry) => entry.id === routeDecision.pioneerId);
    const hostingLevel = leaderPioneer?.hostingLevel ?? "proxy";
    setRuntimeFabric((prev) => routeIntelligenceRequest(prev, {
      chamberHint: tab,
      workflowId,
      requestText: text,
    }).fabric);
    const selectedModelId = plan.selectedModel?.id ?? requestedModelId;
    if (selectedModelId !== requestedModelId) {
      setActiveModels((prev) => ({ ...prev, [tab]: selectedModelId }));
      if (plan.fallbackReason) {
        setRuntimeFabric((prev) => pushSignal(prev, {
          type: "recommendation",
          label: plan.fallbackReason ?? "fallback triggered",
          severity: "warn",
          sourceChamber: tab,
          destinationChamber: tab,
          destination: { tab, view: tab === "creation" ? "terminal" : "chat" },
        }));
      }
    }

    abortRefs.current[tab]?.abort();
    const controller = new AbortController();
    abortRefs.current[tab] = controller;

    const requestedModelMeta = MODEL_REGISTRY.find((m) => m.id === requestedModelId);
    const connectorActionRows = connectorCandidates.map((cid) => {
      const row = runtimeFabric.connectors.find((c) => c.id === cid);
      const reg = runtimeFabric.intelligence.connectorRegistry.find((r) => r.id === cid);
      const name = reg?.label ?? cid;
      const st = row ? (row.enabled ? row.status : "disabled") : "unknown";
      return { id: cid, label: `${name} · ${st}` };
    });

    const userMsg: Message = {
      id:        crypto.randomUUID(),
      role:      "user",
      content:   text,
      tab,
      timestamp: Date.now(),
      meta: {
        routeReason: routeDecision.reason,
        pioneerId: routeDecision.pioneerId,
        giId: routeDecision.giId,
        workflowId,
        hostingLevel,
        providerId: requestedModelMeta?.provider,
        modelId: requestedModelId,
        supportChain: routeDecision.supportChain,
      },
    };
    setMessages((prev) => ({ ...prev, [tab]: [...prev[tab], userMsg] }));
    setRuntimeFabric((prev) => recordRuntimeMessageObject(prev, userMsg));
    setLoading((prev)  => ({ ...prev, [tab]: true }));
    setSignals((prev)  => ({ ...prev, [tab]: "streaming" }));

    const assistantId = crypto.randomUUID();
    const continuityId = `${tab}-${assistantId}`;
    if (activeMissionId) {
      const isolationCheck = verifyIsolation(continuityId, activeMissionId, securityState.isolationBoundaries);
      if (!isolationCheck.permitted) {
        recordSecurityEvent(createSecurityEvent({
          type: "isolation_violation",
          severity: "critical",
          missionId: activeMissionId,
          summary: "continuity overlap blocked",
          detail: `continuity ${continuityId} already bound to ${isolationCheck.conflictingMissionId}`,
        }));
        setSystemModel((prev) => setMissionState(prev, activeMissionId, "blocked"));
        return;
      }
      setSecurityState((prev) => {
        const boundary = prev.isolationBoundaries.find((b) => b.missionId === activeMissionId)
          ?? defaultIsolationBoundary(activeMissionId);
        const nextBoundary = {
          ...boundary,
          continuityRefs: boundary.continuityRefs.includes(continuityId)
            ? boundary.continuityRefs
            : [...boundary.continuityRefs, continuityId],
        };
        return updateTrustSignal({
          ...prev,
          isolationBoundaries: [
            nextBoundary,
            ...prev.isolationBoundaries.filter((b) => b.missionId !== activeMissionId),
          ],
          lastAuditAt: Date.now(),
        });
      });
    }

    // ── Stack 06: Session identity re-verification at dispatch ────────────────
    // Re-verify the operator session fingerprint at every dispatch.
    // A mismatch means the browser environment changed mid-session — emit a security event.
    if (securityState.session) {
      const fpCheck = verifyFingerprint(securityState.session, buildFingerprint());
      if (!fpCheck.valid && fpCheck.anomaly) {
        setSecurityState((prev) => {
          const event = createSecurityEvent({
            type:      "session_anomaly",
            severity:  "critical",
            summary:   `Session identity mismatch at dispatch — anomaly: ${fpCheck.anomaly}`,
            missionId: activeMissionId ?? undefined,
          });
          return updateTrustSignal({ ...prev, events: [...prev.events, event] });
        });
      }
    }
    // ── End Stack 06 session identity check ───────────────────────────────────
    // Governance gate — enforce execution policy before dispatch
    const govResult = enforceExecutionGate(`chamber.${tab}.dispatch`, {
      kind:      "operator",
      id:        runtimeFabric.workspace.owner,
      label:     "Sovereign Operator",
      missionId: activeMissionId ?? undefined,
    });
    // Record audit entry into trust governance state
    const _govMissionId = activeMissionId ?? "session";
    setTrustGovState((prev) => {
      const ledger  = getMissionLedger(prev, _govMissionId);
      const updated = appendAuditToLedger(
        ledger,
        `chamber.${tab}.dispatch`,
        runtimeFabric.workspace.owner,
        govResult.allowed ? `dispatch allowed · ${tab}` : `dispatch blocked · ${govResult.reason}`,
      );
      return upsertLedger(prev, updated);
    });
    // Collective collision check — warn if another in-progress continuity holds this chamber
    const existingRun = runtimeFabric.continuity.find(
      (c) => c.chamber === tab && c.status === "in_progress"
    );
    if (existingRun) {
      const collision = checkCollectiveCollision(
        collectiveState.collisionMap,
        `chamber.${tab}`,
        runtimeFabric.workspace.owner,
      );
      if (!collision.safe) {
        setRuntimeFabric((prev) => pushSignal(prev, {
          type:               "lifecycle",
          label:              `Collision: ${tab} chamber already held by ${collision.conflictWith ?? "another run"} — contention risk`,
          severity:           "warn",
          sourceChamber:      tab,
          destinationChamber: tab,
          destination:        { tab, view: "chat" },
        }));
      }
    }

    if (!govResult.allowed) {
      recordSecurityEvent(createSecurityEvent({
        type: "scope_violation",
        severity: govResult.verdict === "deferred" ? "warn" : "critical",
        missionId: activeMissionId ?? undefined,
        summary: "Execution gate blocked dispatch",
        detail: govResult.reason,
      }));
      setRuntimeFabric((prev) => pushSignal(prev, {
        type:               "lifecycle",
        label:              `${tab} dispatch blocked — ${govResult.reason}`,
        severity:           "warn",
        sourceChamber:      tab,
        destinationChamber: "profile",
        destination:        { tab: "profile", view: "overview" },
      }));
      setLoading((prev)  => ({ ...prev, [tab]: false }));
      setSignals((prev)  => ({ ...prev, [tab]: "idle" }));
      return;
    }
    // Persist governance audit as timeline event
    setRuntimeFabric((prev) => appendRunTimeline(prev, {
      continuityId: `${tab}-pre-dispatch`,
      label:        `governance.${govResult.verdict}: ${govResult.reason}`,
    }));

    // ── Stack 06: Mission-level access authorization ───────────────────────────────
    // Enforce permission lattice: pioneer must be permitted to execute on this mission.
    // evaluateAccess returns "permit" | "deny" | "require_approval".
    // Default policy is open (allowedPioneers: []) — enforcement activates when policy restricts.
    if (activeMission && activeMissionId) {
      const missionAccessPolicy = defaultAccessPolicy(activeMissionId);
      const accessDecision = evaluateAccess(
        "mission_execute",
        routeDecision.pioneerId ?? "operator",
        missionAccessPolicy
      );
      if (accessDecision !== "permit") {
        setSecurityState((prev) => {
          const event = createSecurityEvent({
            type:      "scope_violation",
            severity:  accessDecision === "deny" ? "critical" : "warn",
            summary:   `Pioneer access ${accessDecision} for mission_execute on "${activeMission.identity.name}" — pioneer: ${routeDecision.pioneerId ?? "unknown"}`,
            missionId: activeMissionId,
          });
          return updateTrustSignal({ ...prev, events: [...prev.events, event] });
        });
        if (accessDecision === "deny") {
          setRuntimeFabric((prev) => pushSignal(prev, {
            type:               "lifecycle",
            label:              `Mission execute denied — ${routeDecision.pioneerId ?? "unknown pioneer"} not authorized for "${activeMission.identity.name}"`,
            severity:           "warn",
            sourceChamber:      tab,
            destinationChamber: "profile",
            destination:        { tab: "profile", view: "overview" },
          }));
          setLoading((prev)  => ({ ...prev, [tab]: false }));
          setSignals((prev)  => ({ ...prev, [tab]: "idle" }));
          return;
        }
      }
    }
    // ── End Stack 06 access gate ──────────────────────────────────────────────────

    // ── Stack 05: Terminal mission dispatch gate ──────────────────────────────────
    // Completed and archived missions cannot receive new dispatches.
    // Emit a consequential recommendation signal and abort — operator must open a new mission.
    if (activeMission && (activeMission.ledger.currentState === "completed" || activeMission.ledger.currentState === "archived")) {
      setRuntimeFabric((prev) => pushSignal(prev, {
        type:               "recommendation",
        label:              `Mission "${activeMission.identity.name}" is ${activeMission.ledger.currentState} — open a new mission to continue`,
        severity:           "critical",
        sourceChamber:      tab,
        destinationChamber: "profile",
        destination:        { tab: "profile", view: "projects" },
      }));
      setLoading((prev)  => ({ ...prev, [tab]: false }));
      setSignals((prev)  => ({ ...prev, [tab]: "idle" }));
      return;
    }
    // ── End Stack 05 terminal gate ────────────────────────────────────────────────

    // ── Stack 04: Operations substrate — pre-dispatch lifecycle ─────────────────
    // Task enters in_progress BEFORE execution. OperationFlow created for this run.
    // Approval gate evaluated when external effects are present.
    let _opsTaskId: string | null = null;
    if (activeMission && activeMissionId) {
      const hasExternalEffect = connectorActionRows.length > 0;
      const policy             = defaultApprovalPolicy(activeMissionId);
      const approvalEval        = hasExternalEffect
        ? evaluateApprovalTrigger("external_effect", policy)
        : null;

      const dispatchTask = transitionTask(
        createTask(activeMissionId, {
          title:      (text.slice(0, 96) || "Dispatch").trim(),
          objective:  text.slice(0, 200),
          notThis:    activeMission.identity.notThis || "No mission drift.",
          class:      tab === "lab" ? "investigation" : tab === "school" ? "mastery" : "construction",
          chamberLead: tab,
          priority:   "standard",
          riskLevel:  hasExternalEffect ? "high" : "low",
        }),
        "active"
      );
      _opsTaskId = dispatchTask.id;

      const dispatchFlow = advanceFlow({
        ...createOperationFlow(
          activeMissionId,
          `${tab} · ${text.slice(0, 40).trim()}`,
          [
            { label: "Route",   taskId: dispatchTask.id },
            { label: "Execute", taskId: dispatchTask.id },
            { label: "Settle",  taskId: dispatchTask.id },
          ],
          activeMission.ledger.currentState
        ),
        state: "running" as const,
      });

      const newApprovals: ApprovalRequest[] =
        approvalEval?.decision === "escalate_sovereign"
          ? [{
              id:          `apr_${Date.now()}`,
              missionId:   activeMissionId,
              taskId:      dispatchTask.id,
              trigger:     "external_effect" as const,
              requestedBy: routeDecision.pioneerId ?? "sovereign",
              description: `External connector effect: ${connectorActionRows.map((r) => r.label).join(", ")}`,
              consequence: "Execution proceeds; external connector state may change.",
              riskLevel:   "high" as const,
              createdAt:   Date.now(),
            }]
          : [];

      // Pre-mark assistant message ID — prevents useEffect from double-processing
      generatedMissionTaskRef.current.add(assistantId);

      setActiveMissionOps((prev) => {
        const base = prev?.missionId === activeMissionId ? prev : defaultMissionOperationsState(activeMissionId);
        const pendingApprovals = [...base.pendingApprovals, ...newApprovals];
        return {
          ...base,
          tasks:            [...base.tasks, dispatchTask],
          activeFlow:       dispatchFlow,
          pendingApprovals,
          operationState:   buildOperationState(
            activeMissionId, [...base.tasks, dispatchTask], base.observations, pendingApprovals.length
          ),
          lastUpdated: Date.now(),
        };
      });
    }
    // ── End Stack 04 pre-dispatch ────────────────────────────────────────────────

    setSystemModel((prev) => setMissionState(prev, activeMissionId ?? continuityId, "running"));
    setRuntimeFabric((prev) => createOrUpdateContinuity(prev, {
      id: continuityId,
      title: text.slice(0, 90),
      chamber: tab,
      status: "in_progress",
      route: { tab, view: tab === "creation" ? "terminal" : "chat" },
      linkedObjectId: assistantId,
      workflowId,
      pioneerId: routeDecision.pioneerId,
      giId: routeDecision.giId,
      hostingLevel,
      routeReason: routeDecision.reason,
    }));

    // Creation: start a workflow run record for the directive
    if (tab === "creation") {
      const wfPayload = buildWorkflowRunPayload("build-heavy", continuityId);
      if (wfPayload) setRuntimeFabric((prev) => startWorkflowRun(prev, wfPayload));
      // Autonomous flow: create a FlowDef + running FlowRun for the directive
      setFlowState((prev) => {
        const def = createFlowDef(continuityId, text.slice(0, 60), [
          createFlowStepDef("step-plan",   "Plan",    "creation.plan"),
          createFlowStepDef("step-build",  "Build",   "creation.build"),
          createFlowStepDef("step-verify", "Verify",  "creation.verify"),
        ]);
        const run = { ...createFlowRun(def, continuityId), state: "running" as const };
        return upsertFlowRun(upsertFlowDef(prev, def), run);
      });
    }
    const execTruth = getExecutionTruth(tab);
    const modelDegraded = selectedModelId !== requestedModelId;
    const contractForDigest = getContractByIntent(resolveIntent(text));
    // Stack 03: when mission is active, surface mission-bound route reason
    const missionRouteReason = activeMission
      ? resolveMissionRoute({
          missionId:     activeMission.id,
          missionStatus: activeMission.ledger.currentState,
          chamberLead:   activeMission.identity.chamberLead,
          requestText:   text,
          depth:         "standard",
          sessionChamber: tab,
        }).missionReason
      : null;
    const routeDigestLine = activeMission
      ? `${contractForDigest.label} · ${activeMission.identity.name} · ${missionRouteReason ?? routeDecision.reason}`
      : `${contractForDigest.label} · ${routeDecision.reason}`;
    const initialRunState: ExecutionState =
      hostingLevel === "proxy" ? "scaffold_only" : "streaming";
    const baseResults: ExecutionResultEntry[] = [
      { phase: "route", summary: routeDigestLine.slice(0, 140), at: Date.now() },
    ];
    if (missionReasoning) {
      baseResults.push({
        phase: "mission",
        summary: missionReasoning.conclusion.slice(0, 140),
        at: missionReasoning.producedAt,
      });
      if (missionReasoning.nextActions[0]) {
        baseResults.push({
          phase: "next",
          summary: missionReasoning.nextActions.join(" → ").slice(0, 140),
          at: missionReasoning.producedAt,
        });
      }
    }
    if (plan.fallbackReason) {
      baseResults.push({ phase: "fallback", summary: plan.fallbackReason.slice(0, 120), at: Date.now() });
    }
    const giLabel =
      runtimeFabric.intelligence.giRegistry.find((g) => g.id === routeDecision.giId)?.name ?? routeDecision.giId;
    const initialTrace: MessageExecutionTrace = {
      executionState: initialRunState,
      providerId: plan.selectedModel?.provider,
      modelId: selectedModelId,
      supportChain: routeDecision.supportChain,
      workflowId,
      hostingLevel,
      executionResults: baseResults,
      connectorActions: connectorActionRows,
      fallbackFromModelId: modelDegraded ? requestedModelId : undefined,
      leadPioneerId: routeDecision.pioneerId,
      giId: routeDecision.giId,
      giLabel,
      routeDigest: routeDigestLine,
    };

    if (activeMissionId && activeMission) {
      let createdTaskId: string | null = null;
      setActiveMissionOps((prev) => {
        const base = prev?.missionId === activeMissionId ? prev : defaultMissionOperationsState(activeMissionId);
        const rawTask = createTask(activeMissionId, {
          title: `${routeDigestLine}`.slice(0, 96),
          objective: text.slice(0, 220),
          notThis: activeMission.identity.notThis || "No mission drift.",
          class: tab === "lab" ? "investigation" : tab === "school" ? "mastery" : "construction",
          chamberLead: tab,
          pioneerId: routeDecision.pioneerId,
          priority: "standard",
          riskLevel: "low",
        });
        const task = transitionTask(rawTask, "active");
        createdTaskId = task.id;
        const flowTemplate = createOperationFlow(
          activeMissionId,
          `Dispatch · ${tab}`,
          [
            { label: "Governance Gate", taskId: task.id },
            { label: "Runtime Dispatch", taskId: task.id },
            { label: "Consequence Commit", taskId: task.id },
          ],
          activeMission.ledger.currentState,
        );
        const activeFlow = { ...flowTemplate, state: "running" as const };
        const gate = tab === "creation"
          ? buildReleaseGate(activeMissionId, `creation.release.${task.id.slice(0, 8)}`, [
              "governance gate passed",
              "runtime execution completed",
              "artifact consequence recorded",
            ])
          : undefined;
        const observation = {
          id: `obs_${Date.now()}_${task.id.slice(0, 6)}`,
          missionId: activeMissionId,
          taskId: task.id,
          class: "run_start" as const,
          summary: `dispatch start · ${routeDigestLine.slice(0, 110)}`,
          pioneerId: routeDecision.pioneerId,
          at: Date.now(),
        };
        const next = {
          ...base,
          tasks: [...base.tasks, task],
          activeFlow,
          observations: [...base.observations, observation],
          signals: [
            ...base.signals,
            emitSignal(activeMissionId, {
              type: "insight",
              priority: "standard",
              taskId: task.id,
              headline: `execution started · ${task.title.slice(0, 52)}`,
              body: `mission:${activeMissionId} · continuity:${continuityId}`,
              actionable: false,
            }),
          ],
          releaseGates: gate ? [...base.releaseGates, gate] : base.releaseGates,
          governanceLog: [
            ...base.governanceLog,
            {
              id: `gov_${Date.now()}_${task.id.slice(0, 6)}`,
              missionId: activeMissionId,
              taskId: task.id,
              action: "execute",
              triggeredBy: routeDecision.pioneerId ?? "operator",
              approved: true,
              gateId: gate?.id,
              consequence: `dispatch started · ${tab}`,
              at: Date.now(),
            },
          ],
          lastUpdated: Date.now(),
        };
        return {
          ...next,
          operationState: buildOperationState(activeMissionId, next.tasks, next.observations, next.pendingApprovals.length),
        };
      });
      if (createdTaskId) {
        missionTaskByContinuityRef.current[continuityId] = createdTaskId;
      }
    }

    setMessages((prev) => ({
      ...prev,
      [tab]: [
        ...prev[tab],
        {
          id: assistantId,
          role: "assistant",
          content: "",
          tab,
          timestamp: Date.now(),
          execution_truth: {
            tier:        execTruth.tier,
            tier_label:  execTruth.tier_label,
            model_label: plan.selectedModel?.label ?? execTruth.model_label,
            pioneer:     routeDecision.pioneerId ?? undefined,
            chamber:     tab,
          },
          execution_trace: initialTrace,
        },
      ],
    }));

    let parseOnComplete = true;
    let assistantContent = "";
    let streamPhaseLogged = false;

    try {
      const history = messagesRef.current[tab]
        .filter((m) => m.id !== assistantId)
        .slice(-MAX_CONTEXT)
        .map(({ role, content }) => ({ role, content }));
      // Stack 03: mission context injection — identity + deep memory — intelligence serves mission, not session
      const missionIdentityCtx = activeMission ? buildMissionSystemContext(activeMission) : null;
      const missionMemoryPrefix = missionMemoryRecall?.priorContext
        ? `\n\nPRIOR MISSION CONTEXT:\n${missionMemoryRecall.priorContext}`
        : (activeMission ? (buildMissionMemoryContext(activeMission, runtimeFabric.continuity) ? `\n\n${buildMissionMemoryContext(activeMission, runtimeFabric.continuity)}` : "") : "");
      const missionCtx = missionIdentityCtx ? `${missionIdentityCtx}${missionMemoryPrefix}` : null;
      const contextualHistory: Array<{ role: string; content: string }> = missionCtx
        ? [{ role: "system", content: missionCtx }, ...history]
        : history;

      // ── Sovereign routing: try live local runtime first ──────────────────────
      // Checks providerHealth (populated by buildLiveAdapterRegistry on mount).
      // Supports Ollama (NDJSON), vLLM (OpenAI-compat), LM Studio (OpenAI-compat).
      let usedLocalPath = false;
      const LOCAL_PROVIDER_IDS = new Set(["ollama-local", "vllm-local", "lm-studio"]);
      const localHealth = runtimeFabric.providerHealth.find(
        (ph) => ph.state === "healthy" && LOCAL_PROVIDER_IDS.has(ph.providerId)
      );
      if (localHealth) {
        // Resolve adapter spec and sovereign model for this chamber+provider
        const adapter = PROVIDER_ADAPTERS.find((a) => a.id === localHealth.providerId);
        const chamberDefaults = CHAMBER_SOVEREIGN_DEFAULTS.find((d) => d.chamber === tab);
        const candidateModelIds = [
          chamberDefaults?.primary_model_id,
          chamberDefaults?.fallback_model_id,
          chamberDefaults?.fast_model_id,
        ].filter(Boolean) as string[];
        const sovereignModel =
          SOVEREIGN_MODEL_REGISTRY.find((m) => candidateModelIds.includes(m.id) && m.adapter_id === localHealth.providerId)
          ?? SOVEREIGN_MODEL_REGISTRY.find((m) => m.adapter_id === localHealth.providerId);

        if (adapter && sovereignModel) {
          // Resolve endpoint: prefer user-configured value, fall back to adapter default
          const osCfg = runtimeFabric.aiSettings.openSourceProviders;
          const localEndpoint =
            localHealth.providerId === "ollama-local"
              ? (osCfg?.ollama?.endpoint   || adapter.base_url)
              : localHealth.providerId === "vllm-local"
              ? (osCfg?.vllm?.endpoint     || adapter.base_url)
              : localHealth.providerId === "lm-studio"
              ? (osCfg?.lmstudio?.endpoint || adapter.base_url)
              : adapter.base_url;

          // Ollama uses NDJSON /api/chat; vLLM + LM Studio use OpenAI /v1/chat/completions
          const lane: ExecutionRequest["providerLane"] =
            adapter.kind === "ollama" ? "open_source_local" : "openai_compat_local";

          // Model name: Ollama uses ollama_name (e.g. "llama3.3:70b"); others use registry id
          const resolvedModelId =
            adapter.kind === "ollama"
              ? (sovereignModel.ollama_name || sovereignModel.id)
              : sovereignModel.id;

          const localReq: ExecutionRequest = {
            chamber:       tab,
            task,
            prompt:        text,
            modelId:       resolvedModelId,
            providerId:    localHealth.providerId,
            providerLane:  lane,
            fallbackChain: plan.fallbackChain,
            context:       contextualHistory,
            signal:        controller.signal,
            localEndpoint,
            continuityId,
          };
          const localRes = await executeAIRequest(localReq, (chunk) => {
            assistantContent += chunk;
            if (!streamPhaseLogged && chunk.length > 0) {
              streamPhaseLogged = true;
              setMessages((prev) => ({
                ...prev,
                [tab]: prev[tab].map((m) => {
                  if (m.id !== assistantId || m.role !== "assistant" || !m.execution_trace) return m;
                  const er = m.execution_trace.executionResults;
                  return er.some((e) => e.phase === "stream")
                    ? { ...m, content: m.content + chunk }
                    : { ...m, content: m.content + chunk, execution_trace: { ...m.execution_trace, executionState: "live", executionResults: [...er, { phase: "stream", summary: `Local sovereign runtime · ${adapter.label}`, at: Date.now() }] } };
                }),
              }));
            } else {
              setMessages((prev) => ({
                ...prev,
                [tab]: prev[tab].map((m) => m.id === assistantId ? { ...m, content: m.content + chunk } : m),
              }));
            }
          });
          usedLocalPath = !localRes.blocked && !localRes.providerUnavailable && localRes.content.length > 0;
        }
      }

      if (!usedLocalPath) {
      const res = await fetch(`${SERVER_URL}/chat`, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body:   JSON.stringify({
          tab,
          task,
          model: selectedModelId,
          fallbackChain: plan.fallbackChain,
          messages: [...contextualHistory, { role: "user", content: text }],
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        setMessages((prev) => ({
          ...prev,
          [tab]: prev[tab].map((m) =>
            m.id === assistantId && m.role === "assistant" && m.execution_trace
              ? {
                  ...m,
                  content: `Request blocked (${res.status}). Retry or check connector policy.`,
                  execution_trace: {
                    ...m.execution_trace,
                    executionState: "blocked",
                    executionResults: [
                      ...m.execution_trace.executionResults,
                      { phase: "http", summary: `blocked · HTTP ${res.status}`, at: Date.now() },
                    ],
                  },
                }
              : m
          ),
        }));
        setRuntimeFabric((prev) =>
          patchContinuityRunTrace(prev, continuityId, {
            executionState: "blocked",
            modelId: selectedModelId,
            providerId: plan.selectedModel?.provider,
            digest: `blocked · HTTP ${res.status} · ${routeDigestLine}`,
          })
        );
        throw new Error(`HTTP ${res.status}`);
      }

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          assistantContent += chunk;
          if (!streamPhaseLogged && assistantContent.length > 0) {
            streamPhaseLogged = true;
            setMessages((prev) => ({
              ...prev,
              [tab]: prev[tab].map((m) => {
                if (m.id !== assistantId || m.role !== "assistant" || !m.execution_trace) return m;
                const er = m.execution_trace.executionResults;
                if (er.some((e) => e.phase === "stream")) return { ...m, content: m.content + chunk };
                return {
                  ...m,
                  content: m.content + chunk,
                  execution_trace: {
                    ...m.execution_trace,
                    executionState: "live",
                    executionResults: [...er, { phase: "stream", summary: "Upstream tokens received", at: Date.now() }],
                  },
                };
              }),
            }));
          } else {
            setMessages((prev) => ({
              ...prev,
              [tab]: prev[tab].map((m) =>
                m.id === assistantId ? { ...m, content: m.content + chunk } : m
              ),
            }));
          }
        }
      } finally {
        reader.releaseLock();
      }
      } // end if (!usedLocalPath)

      setSignals((prev) => ({ ...prev, [tab]: "completed" }));

      // ── Stack 06: Connector output security scan ──────────────────────────────
      // Scan completed AI response for prompt injection, scope escalation, exfiltration.
      // Creates a SecurityEvent if patterns detected — drives the trust signal.
      if (assistantContent.length > 0) {
        const scanResult = scanConnectorOutput(assistantContent);
        if (!scanResult.safe) {
          setSecurityState((prev) => {
            const event = createSecurityEvent({
              type:      "injection_attempt",
              severity:  scanResult.risk === "high" ? "critical" : "warn",
              summary:   `Security vectors detected in ${tab} response: ${scanResult.vectors.join(", ")}`,
              missionId: activeMissionId ?? undefined,
            });
            return updateTrustSignal({ ...prev, events: [...prev.events, event] });
          });
        }
      }
      // ── End Stack 06 connector scan ───────────────────────────────────────────
      const finalRunState: ExecutionState =
        modelDegraded && plan.fallbackReason?.toLowerCase().includes("unavailable")
          ? "provider_unavailable"
          : modelDegraded
            ? "degraded"
            : "completed";
      setMessages((prev) => ({
        ...prev,
        [tab]: prev[tab].map((m) => {
          if (m.id !== assistantId || m.role !== "assistant" || !m.execution_trace) return m;
          const er = m.execution_trace.executionResults.filter((e) => e.phase !== "finalize");
          return {
            ...m,
            execution_trace: {
              ...m.execution_trace,
              executionState: finalRunState,
              executionResults: [
                ...er,
                {
                  phase: "finalize",
                  summary: `${assistantContent.length} chars · ${plan.selectedModel?.label ?? selectedModelId}`,
                  at: Date.now(),
                },
              ],
            },
          };
        }),
      }));
      const completedTrace: MessageExecutionTrace = {
        executionState: finalRunState,
        providerId: plan.selectedModel?.provider,
        modelId: selectedModelId,
        supportChain: routeDecision.supportChain,
        workflowId,
        hostingLevel,
        executionResults: [
          ...baseResults.filter((e) => e.phase !== "finalize"),
          ...(streamPhaseLogged ? [{ phase: "stream" as const, summary: "Upstream tokens received", at: Date.now() }] : []),
          { phase: "finalize", summary: `${assistantContent.length} chars · ${plan.selectedModel?.label ?? selectedModelId}`, at: Date.now() },
        ],
        connectorActions: connectorActionRows,
        fallbackFromModelId: modelDegraded ? requestedModelId : undefined,
        leadPioneerId: routeDecision.pioneerId,
        giId: routeDecision.giId,
        giLabel,
        routeDigest: routeDigestLine,
      };
      setRuntimeFabric((prev) => {
        let next = patchContinuityRunTrace(prev, continuityId, {
          executionState: completedTrace.executionState,
          modelId: selectedModelId,
          providerId: plan.selectedModel?.provider,
          digest: `${completedTrace.executionState} · ${plan.selectedModel?.label ?? selectedModelId} · ${assistantContent.length} chars`,
        });
        next = recordRuntimeMessageObject(next, {
          id: assistantId,
          role: "assistant",
          content: assistantContent,
          tab,
          timestamp: Date.now(),
          meta: {
            routeReason: routeDecision.reason,
            pioneerId: routeDecision.pioneerId,
            giId: routeDecision.giId,
            workflowId,
            hostingLevel,
            providerId: plan.selectedModel?.provider,
            modelId: selectedModelId,
            supportChain: routeDecision.supportChain,
          },
          execution_trace: completedTrace,
        });

        // ── Stack 12 & 13: Collective & Analytics Persistence ──────────────────
        // Persist the attribution record for the Creation completion.
        if (tab === "creation") {
          const attr = attributeConsequence(
            activeMissionId ?? continuityId,
            next.workspace.owner,
            `creation.build · ${assistantContent.length} chars`,
            "primary",
            continuityId,
            false,
          );
          next = recordRuntimeAttribution(next, attr);
        }

        // Detect and persist intelligence patterns from the updated signals/runs.
        const currentSignals = next.signals.map((s) => s.label);
        const currentContinuity = next.continuity.map((c) => `${c.status} ${c.title}`);
        const nextPatterns = detectPatterns([...currentSignals, ...currentContinuity]);
        next = updateRuntimePatterns(next, nextPatterns);
        

        return next;
      });
      setSystemModel((prev) => setMissionState(prev, activeMissionId ?? continuityId, "idle"));

      if (activeMissionId) {
        const taskId = missionTaskByContinuityRef.current[continuityId];
        setActiveMissionOps((prev) => {
          if (!prev || prev.missionId !== activeMissionId || !taskId) return prev;
          const runtimeResult = runtimeFabric.executionResults.find((entry) => entry.continuityId === continuityId);
          const modelProvider = [runtimeResult?.selectedProviderId ?? completedTrace.providerId, runtimeResult?.selectedModelId ?? completedTrace.modelId]
            .filter(Boolean)
            .join(" · ");
          const durationLabel = runtimeResult?.latencyMs ? `${Math.round(runtimeResult.latencyMs)}ms` : undefined;
          const terminalStatus = mapExecutionStateToTaskStatus(completedTrace.executionState);
          const digest = [
            `status:${completedTrace.executionState}`,
            modelProvider ? `runtime:${modelProvider}` : undefined,
            durationLabel ? `duration:${durationLabel}` : undefined,
            `mission:${activeMissionId}`,
            completedTrace.routeDigest ?? assistantContent.slice(0, 120),
          ].filter(Boolean).join(" · ");
          const pseudoMessage: Message = {
            id: assistantId,
            role: "assistant",
            content: assistantContent,
            tab,
            timestamp: Date.now(),
            execution_trace: completedTrace,
          };
          const tasks = prev.tasks.map((task) =>
            task.id === taskId
              ? transitionTask(
                  { ...task, title: buildExecutionTaskTitle(pseudoMessage, runtimeResult) || task.title },
                  terminalStatus,
                  { outputDigest: digest }
                )
              : task
          );
          const flow = prev.activeFlow?.steps.some((step) => step.taskId === taskId)
            ? (() => {
                let running = prev.activeFlow!;
                while (running.state !== "complete") running = advanceFlow(running);
                return running;
              })()
            : prev.activeFlow;
          const releaseGates = prev.releaseGates.map((gate) =>
            gate.label.includes(taskId.slice(0, 8))
              ? { ...gate, status: terminalStatus === "completed" ? "passing" : "failing", resolvedAt: Date.now(), blockedBy: terminalStatus === "completed" ? undefined : completedTrace.executionState }
              : gate
          );
          const observation = {
            id: `obs_${Date.now()}_${taskId.slice(0, 6)}`,
            missionId: activeMissionId,
            taskId,
            class: terminalStatus === "completed" ? "run_complete" as const : "state_change" as const,
            summary: digest.slice(0, 140),
            at: Date.now(),
          };
          const next = {
            ...prev,
            tasks,
            activeFlow: flow,
            observations: [...prev.observations, observation],
            signals: [
              ...prev.signals,
              emitSignal(activeMissionId, {
                type: terminalStatus === "completed" ? "task_complete" : "blocker",
                priority: terminalStatus === "completed" ? "standard" : "high",
                taskId,
                headline: `${TASK_STATUS_LABEL[terminalStatus]} · ${tasks.find((t) => t.id === taskId)?.title.slice(0, 52) ?? "mission run"}`,
                body: digest.slice(0, 140),
                actionable: terminalStatus !== "completed",
              }),
            ],
            releaseGates,
            governanceLog: [
              ...prev.governanceLog,
              {
                id: `gov_${Date.now()}_${taskId.slice(0, 6)}`,
                missionId: activeMissionId,
                taskId,
                action: "execute",
                triggeredBy: "runtime",
                approved: terminalStatus === "completed",
                consequence: digest.slice(0, 180),
                at: Date.now(),
              },
            ],
            lastUpdated: Date.now(),
          };
          return {
            ...next,
            operationState: buildOperationState(activeMissionId, next.tasks, next.observations, next.pendingApprovals.length),
          };
        });
      }

      // ── Stack 07: consequence record — dispatch execution is irreversible ────────
      setTrustGovState((prev) => {
        const govMissionId = activeMissionId ?? continuityId;
        const ledger = getMissionLedger(prev, govMissionId);
        const consequenceLedger = appendConsequenceToLedger(
          ledger,
          `dispatch.completion.${tab}`,
          `${finalRunState} · ${selectedModelId} · ${assistantContent.length} chars · continuity:${continuityId.slice(-8)}`,
          false,
        );
        return upsertLedger(prev, consequenceLedger);
      });

      // MCP: attach continuity to active mission + build handoff digest — fire-and-forget
      if (activeMissionId) {
        mcpMissionAttachContinuity(activeMissionId, continuityId).catch(() => { /* non-fatal */ });
        mcpMissionBuildHandoff(activeMissionId).catch(() => { /* non-fatal */ });
      }

      if (tab === "creation") {
        setFlowState((prev) => {
          const run = Object.values(prev.runs).find((r) => r.missionId === continuityId);
          if (!run) return prev;
          return upsertFlowRun(prev, { ...run, state: "complete", completedAt: Date.now() });
        });
      }
      setRuntimeFabric((prev) => {
        let next = transitionContinuity(prev, continuityId, "completed");
        next = pushSignal(next, {
          type: "lifecycle",
          label: `${tab} run completed — ready for next step`,
          severity: "info",
          sourceChamber: tab,
          destinationChamber: tab,
          destination: { tab, view: "archive" },
          linkedObjectId: assistantId,
        });
        next = awardProgress(next, {
          kind: tab === "school" ? "mastery" : tab === "lab" ? "experiment" : "build",
          title: `${tab} completion`,
          points: 20,
          chamber: tab,
        });
        if (tab === "lab") {
          // Lab finding extraction — prefer first heading from response, fall back to content slice
          const headingMatch = assistantContent.match(/^#{1,3}\s+(.+)$/m);
          const findingLabel = headingMatch
            ? headingMatch[1].slice(0, 72)
            : assistantContent.replace(/\s+/g, " ").trim().slice(0, 72);
          next = pushSignal(next, {
            type:               "lifecycle",
            label:              `Lab finding: ${findingLabel}`,
            severity:           "info",
            sourceChamber:      "lab",
            destinationChamber: "lab",
            destination:        { tab: "lab", view: "analysis", id: assistantId },
            linkedObjectId:     assistantId,
          });
          // Cross-chamber propagation: if Creation has an active continuity, route finding there
          const activeCreation = next.continuity.find((c) => c.chamber === "creation" && c.status === "in_progress");
          if (activeCreation) {
            next = pushSignal(next, {
              type:               "transfer",
              label:              `Lab → Creation: ${findingLabel.slice(0, 52)}`,
              severity:           "info",
              sourceChamber:      "lab",
              destinationChamber: "creation",
              destination:        { tab: "creation", view: "terminal", id: activeCreation.id },
              linkedObjectId:     assistantId,
            });
          }
          // Cross-chamber consequence: Lab always tells Profile about findings
          next = pushSignal(next, {
            type:               "lifecycle",
            label:              `Lab → Profile: finding logged · ${findingLabel.slice(0, 52)}`,
            severity:           "info",
            sourceChamber:      "lab",
            destinationChamber: "profile",
            destination:        { tab: "profile", view: "overview" },
            linkedObjectId:     assistantId,
          });
        }
        if (tab === "school") {
          // Dynamic lesson signal — extract subject from response instead of static label
          const lessonHeading = assistantContent.match(/^#{1,3}\s+(.+)$/m);
          const lessonLabel = lessonHeading
            ? lessonHeading[1].slice(0, 60)
            : assistantContent.replace(/\s+/g, " ").trim().slice(0, 60);
          next = pushSignal(next, {
            type:               "transfer",
            label:              `School → Lab: "${lessonLabel}" validated — lab route unlocked`,
            severity:           "info",
            sourceChamber:      "school",
            destinationChamber: "lab",
            destination:        { tab: "lab", view: "analysis" },
            linkedObjectId:     assistantId,
          });
          // School continuity recommendations — push signals for any paused/blocked runs
          const recs = recommendContinuityActions(next).slice(0, 3);
          for (const rec of recs) {
            next = pushSignal(next, {
              type:               "recommendation",
              label:              `${rec.title.slice(0, 48)} — ${rec.reason}`,
              severity:           "info",
              sourceChamber:      "school",
              destinationChamber: rec.destination.tab,
              destination:        rec.destination,
            });
          }
          // Cross-chamber consequence: School always tells Profile about mastery progress
          next = pushSignal(next, {
            type:               "lifecycle",
            label:              `School → Profile: mastery logged · "${lessonLabel.slice(0, 48)}"`,
            severity:           "info",
            sourceChamber:      "school",
            destinationChamber: "profile",
            destination:        { tab: "profile", view: "overview" },
            linkedObjectId:     assistantId,
          });
        }
        if (tab === "creation") {
          // Pack context digest and attach to continuity for cross-chamber carry
          const history = messagesRef.current[tab].slice(-6).map(({ role, content }) => ({ role, content }));
          const handoff = buildContextHandoff(history);
          next = {
            ...next,
            continuity: next.continuity.map((c) =>
              c.id === continuityId ? { ...c, lastRunDigest: handoff.digest } : c
            ),
          };
          // Advance workflow stage to completed for the Creation run
          next = transitionWorkflowStage(next, continuityId, "completed");
          // Attribution consequence — record that this operator produced a build artifact
          const attr = attributeConsequence(
            activeMissionId ?? continuityId,
            next.workspace.owner,
            `creation.build · ${assistantContent.length} chars`,
            "primary",
            continuityId,
            false,
          );
          // Persist attribution to RuntimeFabric — canonical persistence
          next = { ...next, attributions: [...(next.attributions ?? []), attr] };
          next = pushSignal(next, {
            type:               "lifecycle",
            label:              `Creation attributed: ${attr.consequenceRef.slice(0, 60)} — ${next.workspace.owner}`,
            severity:           "info",
            sourceChamber:      "creation",
            destinationChamber: "profile",
            destination:        { tab: "profile", view: "overview" },
            linkedObjectId:     continuityId,
          });
        }
        // Compound network: register this run as a compound node on every completion
        next = upsertCompoundRun(next, { chamber: tab, continuityId, contentLen: assistantContent.length });
        return next;
      });
      setTimeout(() => {
        setSignals((prev) =>
          prev[tab] === "completed" ? { ...prev, [tab]: "idle" } : prev
        );
      }, 2400);

    } catch (err: unknown) {
      const isAbort = err instanceof Error && err.name === "AbortError";
      parseOnComplete = false;

      if (isAbort) {
        setMessages((prev) => ({
          ...prev,
          [tab]: prev[tab].map((m) =>
            m.id === assistantId && m.role === "assistant" && m.execution_trace
              ? { ...m, execution_trace: { ...m.execution_trace, executionState: "aborted" } }
              : m
          ),
        }));
        setRuntimeFabric((prev) =>
          patchContinuityRunTrace(prev, continuityId, {
            executionState: "aborted",
            modelId: selectedModelId,
            providerId: plan.selectedModel?.provider,
            digest: `aborted · ${routeDigestLine.slice(0, 100)}`,
          })
        );
        if (activeMissionId) {
          const taskId = missionTaskByContinuityRef.current[continuityId];
          setActiveMissionOps((prev) => {
            if (!prev || prev.missionId !== activeMissionId || !taskId) return prev;
            const tasks = prev.tasks.map((task) =>
              task.id === taskId
                ? transitionTask(task, "cancelled", { outputDigest: `status:aborted · mission:${activeMissionId} · ${routeDigestLine.slice(0, 120)}` })
                : task
            );
            const observation = {
              id: `obs_${Date.now()}_${taskId.slice(0, 6)}`,
              missionId: activeMissionId,
              taskId,
              class: "state_change" as const,
              summary: `run aborted · ${routeDigestLine.slice(0, 110)}`,
              at: Date.now(),
            };
            const next = {
              ...prev,
              tasks,
              observations: [...prev.observations, observation],
              signals: [
                ...prev.signals,
                emitSignal(activeMissionId, {
                  type: "insight",
                  priority: "high",
                  taskId,
                  headline: "execution aborted",
                  body: routeDigestLine.slice(0, 140),
                  actionable: true,
                }),
              ],
              governanceLog: [
                ...prev.governanceLog,
                {
                  id: `gov_${Date.now()}_${taskId.slice(0, 6)}`,
                  missionId: activeMissionId,
                  taskId,
                  action: "abort",
                  triggeredBy: "operator",
                  approved: true,
                  consequence: "dispatch aborted by operator",
                  at: Date.now(),
                },
              ],
              lastUpdated: Date.now(),
            };
            return {
              ...next,
              operationState: buildOperationState(activeMissionId, next.tasks, next.observations, next.pendingApprovals.length),
            };
          });
        }
        setSignals((prev) => ({ ...prev, [tab]: "idle" }));
        setSystemModel((prev) => setMissionState(prev, activeMissionId ?? continuityId, "idle"));
        setRuntimeFabric((prev) => {
          let next = transitionContinuity(prev, continuityId, "paused");
          next = pushSignal(next, {
            type: "lifecycle",
            label: `${tab} task paused — resume from profile or archive`,
            severity: "warn",
            sourceChamber: tab,
            destinationChamber: "profile",
            destination: { tab: "profile", view: "overview" },
          });
          return next;
        });
      } else {
        console.error("[Ruberra] stream error", err);
        setMessages((prev) => ({
          ...prev,
          [tab]: prev[tab].map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: "Error — please try again.",
                  execution_trace: m.execution_trace
                    ? {
                        ...m.execution_trace,
                        executionState: "error",
                        executionResults: [
                          ...m.execution_trace.executionResults.filter((e) => e.phase !== "error"),
                          { phase: "error", summary: String(err instanceof Error ? err.message : "stream failure").slice(0, 120), at: Date.now() },
                        ],
                      }
                    : m.execution_trace,
                }
              : m
          ),
        }));
        setSignals((prev) => ({ ...prev, [tab]: "error" }));
        setRuntimeFabric((prev) =>
          patchContinuityRunTrace(prev, continuityId, {
            executionState: "error",
            modelId: selectedModelId,
            providerId: plan.selectedModel?.provider,
            digest: `error · ${String(err instanceof Error ? err.message : "failure").slice(0, 120)}`,
          })
        );
        if (activeMissionId) {
          const taskId = missionTaskByContinuityRef.current[continuityId];
          setActiveMissionOps((prev) => {
            if (!prev || prev.missionId !== activeMissionId || !taskId) return prev;
            const failure = String(err instanceof Error ? err.message : "failure").slice(0, 120);
            const tasks = prev.tasks.map((task) =>
              task.id === taskId
                ? transitionTask(task, "blocked", { blockedBy: failure, outputDigest: `status:error · mission:${activeMissionId} · ${failure}` })
                : task
            );
            const observation = {
              id: `obs_${Date.now()}_${taskId.slice(0, 6)}`,
              missionId: activeMissionId,
              taskId,
              class: "blocker_hit" as const,
              summary: `run failed · ${failure}`,
              at: Date.now(),
            };
            const next = {
              ...prev,
              tasks,
              observations: [...prev.observations, observation],
              signals: [
                ...prev.signals,
                emitSignal(activeMissionId, {
                  type: "blocker",
                  priority: "critical",
                  taskId,
                  headline: "execution failed",
                  body: failure,
                  actionable: true,
                }),
              ],
              releaseGates: prev.releaseGates.map((gate) =>
                gate.label.includes(taskId.slice(0, 8))
                  ? { ...gate, status: "failing", blockedBy: failure, resolvedAt: Date.now() }
                  : gate
              ),
              governanceLog: [
                ...prev.governanceLog,
                {
                  id: `gov_${Date.now()}_${taskId.slice(0, 6)}`,
                  missionId: activeMissionId,
                  taskId,
                  action: "retry",
                  triggeredBy: "runtime",
                  approved: false,
                  consequence: `execution failed · ${failure}`,
                  at: Date.now(),
                },
              ],
              lastUpdated: Date.now(),
            };
            return {
              ...next,
              operationState: buildOperationState(activeMissionId, next.tasks, next.observations, next.pendingApprovals.length),
            };
          });
        }
        setSystemModel((prev) => setMissionState(prev, activeMissionId ?? continuityId, "blocked"));
        if (tab === "creation") {
          setFlowState((prev) => {
            const run = Object.values(prev.runs).find((r) => r.missionId === continuityId);
            if (!run) return prev;
            return upsertFlowRun(prev, { ...run, state: "failed", completedAt: Date.now() });
          });
        }
        setRuntimeFabric((prev) => {
          let next = transitionContinuity(prev, continuityId, "blocked");
          next = pushSignal(next, {
            type: "recommendation",
            label: `${tab} task blocked — check details and retry`,
            severity: "critical",
            sourceChamber: tab,
            destinationChamber: tab,
            destination: { tab, view: tab === "creation" ? "terminal" : "chat" },
          });
          if (tab === "creation") {
            next = transitionWorkflowStage(next, continuityId, "failed");
          }
          return next;
        });
        setTimeout(() => {
          setSignals((prev) =>
            prev[tab] === "error" ? { ...prev, [tab]: "idle" } : prev
          );
        }, 2400);
      }
    } finally {
      // ── Stack 04: Close task lifecycle + advance flow + emit completion signal ─
      if (activeMission && activeMissionId && _opsTaskId) {
        const finalStatus: TaskStatus = parseOnComplete ? "completed" : "blocked";
        const contentDigest = assistantContent.slice(0, 140) || routeDigestLine.slice(0, 140);
        setActiveMissionOps((prev) => {
          if (!prev || prev.missionId !== activeMissionId) return prev;
          const tasks = prev.tasks.map((t) =>
            t.id === _opsTaskId
              ? transitionTask(t, finalStatus, { outputDigest: contentDigest })
              : t
          );
          // Advance flow through Execute → Settle → complete
          const closedFlow = prev.activeFlow
            ? advanceFlow(advanceFlow(prev.activeFlow))
            : prev.activeFlow;
          const completionSignal = emitSignal(activeMissionId, {
            type:     "task_complete",
            priority: finalStatus === "blocked" ? "high" : "standard",
            taskId:   _opsTaskId!,
            headline: `${finalStatus === "completed" ? "Settled" : "Blocked"} · ${tab} · ${contentDigest.slice(0, 52)}`,
            body:     contentDigest,
            actionable: finalStatus === "blocked",
          });
          const observations = [
            ...prev.observations,
            {
              id:         `obs_${Date.now()}_${_opsTaskId!.slice(-6)}`,
              missionId:  activeMissionId,
              taskId:     _opsTaskId!,
              class:      "run_complete" as const,
              summary:    contentDigest,
              pioneerId:  routeDecision.pioneerId ?? undefined,
              at:         Date.now(),
            },
          ];
          return {
            ...prev,
            tasks,
            activeFlow:    closedFlow,
            signals:       [...prev.signals, completionSignal],
            observations,
            operationState: buildOperationState(
              activeMissionId, tasks, observations, prev.pendingApprovals.length
            ),
            lastUpdated: Date.now(),
          };
        });
      }
      // ── End Stack 04 post-dispatch ───────────────────────────────────────────

      setLoading((prev) => ({ ...prev, [tab]: false }));
      abortRefs.current[tab] = null;
      delete missionTaskByContinuityRef.current[continuityId];
      if (parseOnComplete) {
        applyParsedBlocks(assistantId, tab);
      }
    }
  }, [activeMission, activeMissionId, activeMissionOps?.tasks.length, activeTab, activeModels, applyParsedBlocks, recordSecurityEvent, runtimeFabric, securityState.session, tasks]);

  // ── Notes ─────────────────────────────────────────────────────────────────────
  const addNote = useCallback(() => {
    const note: FloatingNote = {
      id:        crypto.randomUUID(),
      content:   "",
      tab:       activeTab,
      pinned:    false,
      x:         Math.max(80, window.innerWidth / 2 - 128 + Math.random() * 60),
      y:         Math.max(80, 120 + Math.random() * 80),
      timestamp: Date.now(),
    };
    setNotes((prev) => [...prev, note]);
  }, [activeTab]);

  const updateNote = useCallback((id: string, updates: Partial<FloatingNote>) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, ...updates } : n));
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id || n.pinned));
  }, []);

  const isLive = Object.values(signals).some((s) => s === "streaming");


  useEffect(() => {
    if (!activeMissionId) {
      setActiveMissionOps(null);
      missionTaskByContinuityRef.current = {};
      generatedMissionTaskRef.current.clear();
      return;
    }
    setActiveMissionOps((prev) => {
      if (prev?.missionId === activeMissionId) return prev;
      return defaultMissionOperationsState(activeMissionId);
    });
  }, [activeMissionId]);

  // Stack 05: mission ledger → awareness model sync
  // When the mission ledger state transitions to "blocked", propagate to SystemModel
  // so SystemHealthBand surfaces the anomaly via real mission-state events.
  useEffect(() => {
    if (!activeMissionId || !activeMission) return;
    const ledgerState = activeMission.ledger.currentState;
    if (ledgerState === "blocked") {
      setSystemModel((prev) => setMissionState(prev, activeMissionId, "blocked"));
    } else if (ledgerState === "completed" || ledgerState === "archived") {
      // Terminal — resolve any blocked anomaly, set idle in awareness
      setSystemModel((prev) => setMissionState(prev, activeMissionId, "idle"));
    }
  }, [activeMission?.ledger.currentState, activeMissionId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!activeMissionId || !activeMission) return;
    setSystemModel((prev) => {
      const live = prev.missionStates[activeMissionId];
      if (live === "running" || live === "blocked") return prev;
      return setMissionState(prev, activeMissionId, activeMission.ledger.currentState);
    });
  }, [activeMissionId, activeMission?.ledger.currentState]);

  useEffect(() => {
    if (!activeMissionId || !activeMission) return;
    const chambers: Exclude<Tab, "profile">[] = ["lab", "school", "creation"];
    const executionEvents: Array<{
      id: string;
      chamber: Exclude<Tab, "profile">;
      status: TaskStatus;
      title: string;
      digest: string;
      blockedBy?: string;
    }> = [];
    for (const chamber of chambers) {
      for (const m of messages[chamber]) {
        const trace = m.execution_trace;
        if (!trace || m.role !== "assistant") continue;
        if (generatedMissionTaskRef.current.has(m.id)) continue;
        if (!TERMINAL_EXECUTION_STATES.has(trace.executionState)) continue;

        const executionResult = runtimeFabric.executionResults.find((result) =>
          result.chamber === chamber &&
          (!trace.providerId || result.selectedProviderId === trace.providerId) &&
          (!trace.modelId || result.selectedModelId === trace.modelId)
        );
        const modelProvider = [executionResult?.selectedProviderId ?? trace.providerId, executionResult?.selectedModelId ?? trace.modelId]
          .filter(Boolean)
          .join(" · ");
        const durationLabel = executionResult?.latencyMs ? `${Math.round(executionResult.latencyMs)}ms` : undefined;
        const status = mapExecutionStateToTaskStatus(trace.executionState);
        const lastResult = trace.executionResults?.slice(-1)[0];
        const digestSegments = [
          `status:${trace.executionState}`,
          modelProvider ? `runtime:${modelProvider}` : undefined,
          durationLabel ? `duration:${durationLabel}` : undefined,
          `mission:${activeMissionId}`,
          lastResult?.summary ?? trace.routeDigest ?? m.content.slice(0, 120),
        ].filter(Boolean);
        executionEvents.push({
          id: m.id,
          chamber,
          status,
          title: buildExecutionTaskTitle(m, executionResult),
          digest: digestSegments.join(" · "),
          blockedBy: executionResult?.blockedReason ?? executionResult?.errorMessage,
        });
      }
    }
    if (!executionEvents.length) return;
    setActiveMissionOps((prev) => {
      const base = prev?.missionId === activeMissionId ? prev : defaultMissionOperationsState(activeMissionId);
      let next = { ...base };
      for (const ev of executionEvents) {
        const rawTask = createTask(activeMissionId, {
          title: ev.title || "Execution completion",
          objective: ev.digest,
          notThis: activeMission.identity.notThis || "No mission drift.",
          class: ev.chamber === "lab" ? "investigation" : ev.chamber === "school" ? "mastery" : "construction",
          chamberLead: ev.chamber,
          priority: "standard",
          riskLevel: "low",
        });
        const task = transitionTask(rawTask, ev.status, { outputDigest: ev.digest, blockedBy: ev.blockedBy });
        next = {
          ...next,
          tasks: [...next.tasks, task],
          observations: [
            ...next.observations,
            {
              id: `obs_${Date.now()}_${ev.id.slice(0, 6)}`,
              missionId: activeMissionId,
              taskId: task.id,
              class: ev.status === "completed" ? "run_complete" : "state_change",
              summary: ev.digest.slice(0, 140),
              pioneerId: task.pioneerId,
              at: Date.now(),
            },
          ],
          signals: [
            ...next.signals,
            emitSignal(activeMissionId, {
              type: ev.status === "completed" ? "task_complete" : "blocker",
              priority: ev.status === "completed" ? "standard" : "high",
              taskId: task.id,
              headline: `${TASK_STATUS_LABEL[task.status]} · ${task.title.slice(0, 52)}`,
              body: ev.digest.slice(0, 140),
              actionable: true,
            }),
          ],
          lastUpdated: Date.now(),
        };
        generatedMissionTaskRef.current.add(ev.id);
      }
      return {
        ...next,
        operationState: buildOperationState(
          activeMissionId,
          next.tasks,
          next.observations,
          next.pendingApprovals.length,
        ),
      };
    });
  }, [activeMission, activeMissionId, messages, runtimeFabric.executionResults]);

  const handleMissionOpsSignalDismiss = useCallback((signalId: string) => {
    if (!activeMissionId) return;
    setActiveMissionOps((prev) => {
      if (!prev || prev.missionId !== activeMissionId) return prev;
      const signals = prev.signals.map((s) => (s.id === signalId ? dismissSignal(s) : s));
      const observation = {
        id: `obs_${Date.now()}_${signalId.slice(0, 6)}`,
        missionId: activeMissionId,
        class: "state_change" as const,
        summary: `signal dismissed · ${signalId}`,
        at: Date.now(),
      };
      return {
        ...prev,
        signals,
        observations: [...prev.observations, observation],
        operationState: buildOperationState(activeMissionId, prev.tasks, [...prev.observations, observation], prev.pendingApprovals.length),
        lastUpdated: Date.now(),
      };
    });
  }, [activeMissionId]);

  const handleMissionOpsApprovalApprove = useCallback((requestId: string) => {
    if (!activeMissionId) return;
    setActiveMissionOps((prev) => {
      if (!prev || prev.missionId !== activeMissionId) return prev;
      const request = prev.pendingApprovals.find((r) => r.id === requestId);
      if (!request) return prev;
      const tasks = request.taskId
        ? prev.tasks.map((task) =>
            task.id === request.taskId && (task.status === "review" || task.status === "pending")
              ? transitionTask(task, "approved")
              : task
          )
        : prev.tasks;
      const observation = {
        id: `obs_${Date.now()}_${requestId.slice(0, 6)}`,
        missionId: activeMissionId,
        taskId: request.taskId,
        class: "state_change" as const,
        summary: `approval approved · ${request.description.slice(0, 80)}`,
        at: Date.now(),
      };
      const next = {
        ...prev,
        tasks,
        pendingApprovals: prev.pendingApprovals.filter((r) => r.id !== requestId),
        approvalHistory: [
          ...prev.approvalHistory,
          {
            requestId,
            missionId: activeMissionId,
            decision: "approved" as ApprovalDecision,
            decidedBy: "operator",
            rationale: "approved from mission operations panel",
            resolvedAt: Date.now(),
          },
        ],
        observations: [...prev.observations, observation],
        signals: [
          ...prev.signals,
          emitSignal(activeMissionId, {
            type: "mission_advance",
            priority: "standard",
            taskId: request.taskId,
            headline: `approval accepted · ${request.description.slice(0, 52)}`,
            body: request.consequence.slice(0, 140),
            actionable: false,
          }),
        ],
        lastUpdated: Date.now(),
      };
      return {
        ...next,
        operationState: buildOperationState(activeMissionId, next.tasks, next.observations, next.pendingApprovals.length),
      };
    });
  }, [activeMissionId]);

  const handleMissionOpsApprovalReject = useCallback((requestId: string) => {
    if (!activeMissionId) return;
    setActiveMissionOps((prev) => {
      if (!prev || prev.missionId !== activeMissionId) return prev;
      const request = prev.pendingApprovals.find((r) => r.id === requestId);
      if (!request) return prev;
      const tasks = request.taskId
        ? prev.tasks.map((task) =>
            task.id === request.taskId
              ? transitionTask(task, "blocked", { blockedBy: `approval rejected · ${request.description.slice(0, 80)}` })
              : task
          )
        : prev.tasks;
      const observation = {
        id: `obs_${Date.now()}_${requestId.slice(0, 6)}`,
        missionId: activeMissionId,
        taskId: request.taskId,
        class: "blocker_hit" as const,
        summary: `approval rejected · ${request.description.slice(0, 80)}`,
        at: Date.now(),
      };
      const next = {
        ...prev,
        tasks,
        pendingApprovals: prev.pendingApprovals.filter((r) => r.id !== requestId),
        approvalHistory: [
          ...prev.approvalHistory,
          {
            requestId,
            missionId: activeMissionId,
            decision: "rejected" as ApprovalDecision,
            decidedBy: "operator",
            rationale: "rejected from mission operations panel",
            resolvedAt: Date.now(),
          },
        ],
        observations: [...prev.observations, observation],
        signals: [
          ...prev.signals,
          emitSignal(activeMissionId, {
            type: "blocker",
            priority: "high",
            taskId: request.taskId,
            headline: `approval rejected · ${request.description.slice(0, 52)}`,
            body: request.consequence.slice(0, 140),
            actionable: true,
          }),
        ],
        lastUpdated: Date.now(),
      };
      return {
        ...next,
        operationState: buildOperationState(activeMissionId, next.tasks, next.observations, next.pendingApprovals.length),
      };
    });
  }, [activeMissionId]);
  const lastExecutionSnapshot = useMemo<GlobalExecutionSnapshot | null>(() => {
    const latestMessageTrace = Object.values(messages)
      .flatMap((bucket) => bucket)
      .filter((m) => m.role === "assistant" && m.execution_trace)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    if (!latestMessageTrace?.execution_trace || latestMessageTrace.tab === "profile") return null;
    const chamber = latestMessageTrace.tab as Exclude<Tab, "profile">;
    const trace = latestMessageTrace.execution_trace;
    const latestResult = [...runtimeFabric.executionResults]
      .sort((a, b) => b.createdAt - a.createdAt)
      .find((r) => r.chamber === chamber);
    const leadPioneer = trace.leadPioneerId
      ? PIONEER_REGISTRY.find((p) => p.id === trace.leadPioneerId)
      : undefined;
    return {
      state:      trace.executionState,
      chamber,
      modelId:    latestResult?.selectedModelId ?? trace.modelId,
      providerId: latestResult?.selectedProviderId ?? trace.providerId,
      latencyMs:  latestResult?.latencyMs,
      eiName:     leadPioneer?.short_role ?? leadPioneer?.name ?? undefined,
    };
  }, [messages, runtimeFabric.executionResults]);
  const lastExecutionProviderHealth = useMemo(() => {
    if (!lastExecutionSnapshot?.providerId) return "unknown" as const;
    return runtimeFabric.providerHealth.find((p) => p.providerId === lastExecutionSnapshot.providerId)?.state ?? "unknown";
  }, [runtimeFabric.providerHealth, lastExecutionSnapshot]);
  const notificationItems = runtimeFabric.signals.filter((s) => !s.read).slice(0, 12);
  const hasSignals = notificationItems.length > 0;
  const continuityRecommendations = recommendContinuityActions(runtimeFabric);
  const analyticsPatterns = useMemo(() => {
    return runtimeFabric.analyticsPatterns ?? [];
  }, [runtimeFabric.analyticsPatterns]);


  const orgState = useMemo(() => {
    // Start from persisted state or default
    const base = runtimeFabric.orgState ?? defaultOrgState();
    const missionHealth = missions.map((m) => {
      const missionContinuity = runtimeFabric.continuity.filter((c) => c.workflowId === m.id || c.title.includes(m.identity.name));
      const runs      = missionContinuity.length;
      const completed = missionContinuity.filter((c) => c.status === "completed" || c.status === "exported").length;
      const velocity  = runs > 0 ? completed / runs : 0;
      const blockers  = runtimeFabric.signals.filter((s) => s.severity === "critical" || s.severity === "warn").length;
      const quality   = runs > 0 ? Math.max(0, 1 - blockers * 0.1) : 0.5;
      return assessMissionHealth(m.id, velocity, quality, blockers, runs);
    });
    const capMap   = defaultCapabilityMap();
    const insights = surfaceOrgInsights(capMap, missionHealth);
    return { ...base, missionHealth, insights, lastUpdated: Date.now() };
  }, [missions, runtimeFabric.continuity, runtimeFabric.signals, runtimeFabric.orgState]);

  const platformState = useMemo(() => {
    // Start from persisted state or default
    const base = runtimeFabric.platformState ?? defaultPlatformState();
    // Derive inference status from live-probed providerHealth, fall back to static resolution.
    // Any healthy provider (Tier A local or Tier B wrapped) makes inference "nominal".
    const liveHealthy = runtimeFabric.providerHealth.some((ph) => ph.state === "healthy");
    const execTruth = getExecutionTruth(activeTab === "profile" ? "lab" : activeTab as Exclude<typeof activeTab, "profile">);
    const inferenceStatus: "nominal" | "degraded" =
      liveHealthy ? "nominal" : execTruth.is_available ? "nominal" : "degraded";
    const providerLabel = liveHealthy
      ? (runtimeFabric.providerHealth.find((ph) => ph.state === "healthy")?.providerId ?? "local")
      : (execTruth.adapter_kind ?? "sovereign");
    let state = base;
    state = addLayer(state, { ...createInfraLayer("intelligence", providerLabel, liveHealthy), status: inferenceStatus });
    state = addLayer(state, { ...createInfraLayer("network", "supabase", false), status: "nominal" });
    state = addLayer(state, { ...createInfraLayer("storage", "supabase", false), status: "nominal" });
    return state;
  }, [runtimeFabric.platformState, runtimeFabric.providerHealth, activeTab]);

  const personalOS = useMemo(() => {
    // Start from persisted state or default
    const base = runtimeFabric.personalOS ?? defaultPersonalOS("operator-1");
    const memories = [
      createMemoryEntry("preference", `Preferred chamber: ${runtimeFabric.preferences.preferredChamber}`),
      createMemoryEntry("preference", `Output style: ${runtimeFabric.preferences.outputStyle}`),
      createMemoryEntry("preference", `AI model policy: ${runtimeFabric.aiSettings.modelPolicy}`),
      // Active and completed missions — sovereign work compound memory
      ...missions.filter((m) => m.ledger.currentState !== "archived").slice(0, 6).map((m) =>
        createMemoryEntry("mission_history", `mission · ${m.identity.chamberLead} · ${m.identity.name.slice(0, 60)} · ${m.ledger.currentState}`)
      ),
      // Recent continuity sessions — execution compound memory
      ...runtimeFabric.continuity.slice(0, 5).map((c) =>
        createMemoryEntry("mission_history", `${c.chamber} · ${c.title.slice(0, 60)}`)
      ),
    ];
    const context = buildOperatorContext(base.profile, memories, base.agent);
    return { ...base, memory: memories, context, lastUpdated: Date.now() };
  }, [runtimeFabric.preferences, runtimeFabric.aiSettings, runtimeFabric.continuity, missions, runtimeFabric.personalOS]);

  // ── Event-pathway substrates ──────────────────────────────────────────────────

  // 1. Civilization: pioneer registry + mission bindings from continuity
  const civilization = useMemo(() => {
    let civ = civBase;
    for (const p of PIONEER_REGISTRY.slice(0, 10)) {
      const manifest = registerAgent({
        id:           p.id,
        name:         p.name,
        domain:       p.home_chamber as AgentDomain,
        capabilities: p.strengths.map((s) => ({ id: s, label: s, domain: p.home_chamber as AgentDomain, actions: [s], exclusiveOwnership: false, maxConcurrent: 2 })),
      });
      const activeContinuity = runtimeFabric.continuity.filter((c) => c.pioneerId === p.id);
      const isActive = activeContinuity.some((c) => c.status === "in_progress");
      const boundMissions = activeContinuity.map((c) => c.id);
      const lastActiveAt = activeContinuity.reduce((max, c) => Math.max(max, c.updatedAt ?? 0), 0);
      let agent = boundMissions.reduce(
        (m, mid) => ({ ...m, boundMissions: [...m.boundMissions, mid], lastActiveAt }),
        manifest
      );
      if (isActive) agent = activateAgent(agent);
      civ = admitAgent(civ, agent);
    }
    return civ;
  }, [civBase, runtimeFabric.continuity]);

  // 2. Collective: operator as sovereign + mission graph + real collision map
  const collectiveState = useMemo(() => {
    const owner = runtimeFabric.workspace.owner;
    // Start from persisted state or default
    let state = runtimeFabric.collectiveState ?? defaultCollectiveState();
    state = admitMember(state, createMember(owner, "sovereign", missions.map((m) => m.id)));
    for (const m of missions) {
      state = addToMissionGraph(state, buildMissionGraphNode(m.id));
    }
    // Collision map: each in-progress continuity thread claims its chamber resource
    // Multiple claimants on the same chamber → riskLevel escalates to "high"
    let collisionMap = state.collisionMap;
    for (const c of runtimeFabric.continuity.filter((x) => x.status === "in_progress")) {
      const claimant = c.pioneerId ?? owner;
      collisionMap = claimCollectiveResource(collisionMap, `chamber.${c.chamber}`, claimant);
    }
    return { ...state, attributions: runtimeFabric.attributions, collisionMap, lastUpdated: Date.now() };
  }, [runtimeFabric.collectiveState, missions, runtimeFabric.workspace.owner, runtimeFabric.continuity, runtimeFabric.attributions]);

  // 3. Presence manifest: always register the web channel; add active chambers
  const presenceManifest = useMemo(() => {
    const owner = runtimeFabric.workspace.owner;
    let manifest = runtimeFabric.presenceManifests[owner];
    if (!manifest) {
      manifest = defaultPresenceManifest(owner);
    }
    // Context-sensitive updates for the active channel
    if (messages.lab.length > 0)      manifest = registerChannel(manifest, createChannel("api",  { chamber: "lab" }));
    if (messages.creation.length > 0) manifest = registerChannel(manifest, createChannel("cli",  { chamber: "creation" }));

    // Auto-update context to reflect current Shell state
    manifest = {
      ...manifest,
      context: {
        ...manifest.context,
        activeChamber: activeTab === "profile" ? undefined : activeTab as any,
        missionId: activeMissionId ?? undefined,
      },
      lastUpdated: Date.now(),
    };

    return manifest;
  }, [runtimeFabric.presenceManifests, runtimeFabric.workspace.owner, messages.lab.length, messages.creation.length, activeTab, activeMissionId]);

  // Sync presence heartbeat into substrate
  useEffect(() => {
    setRuntimeFabric((prev) => {
      let next = updateRuntimePresence(prev, presenceManifest);
      next = heartbeatRuntimePresence(next, prev.workspace.owner);
      return next;
    });
  }, [heartbeatTick, presenceManifest]);

  // 4. Exchange ledger: exported continuity items become governance-verified value units
  const exchangeLedger = useMemo(() => {
    // Start from persisted state or default
    let ledger = runtimeFabric.exchangeLedger ?? defaultExchangeLedger();
    for (const c of runtimeFabric.continuity.filter((x) => x.status === "exported")) {
      // verifyValueUnit: sets verifiedAt — governance gate already enforced on export path
      const unit = verifyValueUnit(makeAvailable(mintValue(c.id, runtimeFabric.workspace.owner, {
        type:        "artifact",
        label:       c.title.slice(0, 60),
        description: `${c.chamber} · exported continuity`,
      })));
      ledger = addValueUnit(ledger, unit);
    }
    return ledger;
  }, [runtimeFabric.exchangeLedger, runtimeFabric.continuity, runtimeFabric.workspace.owner]);

  // 5. Ecosystem: enabled connectors become admitted extensions
  const ecosystemState = useMemo(() => {
    // Start from persisted state or default
    let state = runtimeFabric.ecosystemState ?? defaultEcosystemState();
    for (const c of runtimeFabric.connectors.filter((x) => x.enabled)) {
      const ext = proposeExtension({
        id:           c.id,
        name:         c.id,
        type:         "connector",
        authorId:     "ruberra-core",
        description:  `${c.id} connector — enabled`,
        capabilities: ["read", "sync"],
        consequences: ["external-data-ingested"],
        version:      "1.0.0",
      });
      state = admitToNetwork(state, { ...ext, status: "admitted" });
    }
    return state;
  }, [runtimeFabric.ecosystemState, runtimeFabric.connectors]);

  // Stack state persistence (11→20): persist consequence surfaces to canonical RuntimeFabric only
  // Stack 11: Living Knowledge — absorb real objects into knowledge graph
  useEffect(() => {
    setRuntimeFabric((prev) => {
      let graph = prev.knowledgeGraph?.graph ?? defaultKnowledgeGraph();
      for (const obj of prev.objects.slice(0, 20)) {
        const node = createNode({
          type: obj.type === "investigation" || obj.type === "lesson" ? "concept" : "artifact",
          content: obj.title,
          tags: obj.tags ?? [],
          confidence: "medium",
        });
        graph = addNode(graph, node);
      }
      return updateKnowledgeGraph(prev, { graph, lastUpdated: Date.now() });
    });
  }, [runtimeFabric.objects]);

  // Stack 10: Civilization persistence
  useEffect(() => {
    try { localStorage.setItem("ruberra_stack_civBase", JSON.stringify(civilization)); } catch { /* storage full */ }
  }, [civilization]);

  // Stack 13: Collective State — persist to RuntimeFabric
  useEffect(() => {
    setRuntimeFabric((prev) => updateCollectiveState(prev, collectiveState));
  }, [collectiveState]);

  // Stack 15: Exchange Ledger — persist to RuntimeFabric
  useEffect(() => {
    setRuntimeFabric((prev) => updateExchangeLedger(prev, exchangeLedger));
  }, [exchangeLedger]);

  // Stack 16: Ecosystem State — persist to RuntimeFabric
  useEffect(() => {
    setRuntimeFabric((prev) => updateEcosystemState(prev, ecosystemState));
  }, [ecosystemState]);

  // Stack 17: Platform State — persist to RuntimeFabric
  useEffect(() => {
    setRuntimeFabric((prev) => updatePlatformState(prev, platformState));
  }, [platformState]);

  // Stack 18: Org Intelligence State — persist to RuntimeFabric
  useEffect(() => {
    setRuntimeFabric((prev) => updateOrgState(prev, orgState));
  }, [orgState]);

  // Stack 19: Personal OS — persist to RuntimeFabric
  useEffect(() => {
    setRuntimeFabric((prev) => updatePersonalOS(prev, personalOS));
  }, [personalOS]);

  const activeMissionRuntimeState = activeMissionId ? systemModel.missionStates[activeMissionId] : undefined;
  const adaptiveMissionState = activeMission
    ? (activeMissionRuntimeState === "running" || activeMissionRuntimeState === "blocked"
        ? activeMissionRuntimeState
        : activeMission.ledger.currentState)
    : undefined;
  const handleSecurityAcknowledge = useCallback(() => {
    setSecurityState((prev) => {
      const [head] = getUnacknowledgedEvents(prev.events);
      if (!head) return prev;
      return updateTrustSignal({
        ...prev,
        events: prev.events.map((event) => event.id === head.id ? acknowledgeEvent(event) : event),
      });
    });
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--r-bg)",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
        transition: "background 0.2s ease",
      }}
    >
      <AnimatePresence>
        {isShellMode && (
          <HeroLanding
            key="hero"
            theme={theme}
            onEnter={(chamber) => {
              if (chamber && (chamber === "lab" || chamber === "school" || chamber === "creation" || chamber === "profile")) {
                setActiveTab(chamber as Tab);
                if (chamber === "lab")      setLabView("home");
                if (chamber === "school")   setSchoolView("home");
                if (chamber === "creation") setCreationView("home");
                if (chamber === "profile")  setProfileView("overview");
              }
              setIsShellMode(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Sovereign Bar */}
      <SovereignBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onHomeClick={() => navigate(activeTab, "home")}
        isLive={isLive}
        theme={theme}
        onThemeToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        onSearchToggle={() => setCmdOpen((v) => !v)}
        onSignalsToggle={() => setSignalsOpen((v) => !v)}
        hasSignals={hasSignals}
        onManageMatrix={() => { setActiveTab("profile"); setProfileView("pioneers"); }}
        systemHealth={runtimeFabric.systemHealth}
        workspaceOwner={runtimeFabric.workspace.owner}
        workspaceSubtitle={`${runtimeFabric.workspace.activeProject} · ledger`}
        trustSignal={trustSignal}
        onSecurityAcknowledge={handleSecurityAcknowledge}
      />

      {/* System Health Band — silent unless degraded or critical */}
      <SystemHealthBand
        model={systemModel}
        missionState={adaptiveMissionState}
        missionName={activeMission?.identity.name}
      />

      {/* Mission Context Band — global mission binding, shown across all chambers */}
      {activeMission && (
        <MissionContextBand
          mission={activeMission}
          onRelease={handleMissionRelease}
          isExecuting={Object.values(loading).some(Boolean)}
          runtimeState={adaptiveMissionState}
          runCount={runtimeFabric.continuity.filter(
            (c) => (c.workflowId === activeMission.id || c.title.includes(activeMission.identity.name)) &&
              (c.status === "completed" || c.status === "exported")
          ).length}
        />
      )}

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

        {/* Side Rail */}
        <ShellSideRail
          activeTab={activeTab}
          onTabChange={handleTabChange}
          messages={messages}
          signals={signals}
          labView={labView}
          schoolView={schoolView}
          creationView={creationView}
          profileView={profileView}
          onLabView={(v) => { setLabView(v); setDetailId(""); }}
          onSchoolView={(v) => { setSchoolView(v); setDetailId(""); }}
          onCreationView={(v) => { setCreationView(v); setDetailId(""); }}
          onProfileView={setProfileView}
          navigate={navigate}
          collapsed={railCollapsed}
          onToggleCollapsed={() => setRailCollapsed((v) => !v)}
        />

        {/* Operational Surface */}
        <main style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}
            >
              {activeTab === "lab" && (
                <LabMode
                  messages={messages.lab}
                  isLoading={loading.lab}
                  draft={drafts.lab}
                  onDraftChange={handleDraftChange}
                  onSend={handleSend}
                  onCancel={handleCancel}
                  labView={labView}
                  onLabView={(v) => { setLabView(v); setDetailId(""); }}
                  navigate={navigate}
                  detailId={detailId}
                  task={tasks.lab}
                  modelId={activeModels.lab}
                  onTaskChange={(task) => handleTaskChange("lab", task)}
                  onModelChange={(modelId) => handleModelChange("lab", modelId)}
                  missionName={activeMission?.identity.name}
                  missionStatus={activeMission?.ledger.currentState}
                />
              )}
              {activeTab === "school" && (
                <SchoolMode
                  messages={messages.school}
                  isLoading={loading.school}
                  draft={drafts.school}
                  onDraftChange={handleDraftChange}
                  onSend={handleSend}
                  onCancel={handleCancel}
                  schoolView={schoolView}
                  onSchoolView={(v) => { setSchoolView(v); setDetailId(""); }}
                  navigate={navigate}
                  detailId={detailId}
                  task={tasks.school}
                  modelId={activeModels.school}
                  onTaskChange={(task) => handleTaskChange("school", task)}
                  onModelChange={(modelId) => handleModelChange("school", modelId)}
                  missionName={activeMission?.identity.name}
                  missionStatus={activeMission?.ledger.currentState}
                />
              )}
              {activeTab === "creation" && (
                <CreationMode
                  messages={messages.creation}
                  isLoading={loading.creation}
                  draft={drafts.creation}
                  onDraftChange={handleDraftChange}
                  onSend={handleSend}
                  onCancel={handleCancel}
                  creationView={creationView}
                  onCreationView={(v) => { setCreationView(v); setDetailId(""); }}
                  navigate={navigate}
                  detailId={detailId}
                  task={tasks.creation}
                  modelId={activeModels.creation}
                  onTaskChange={(task) => handleTaskChange("creation", task)}
                  onModelChange={(modelId) => handleModelChange("creation", modelId)}
                  missionName={activeMission?.identity.name}
                  missionStatus={activeMission?.ledger.currentState}
                />
              )}
              {activeTab === "profile" && (
                <ProfileMode
                  messages={messages}
                  profileView={profileView}
                  onProfileView={setProfileView}
                  navigate={navigate}
                  continuity={runtimeFabric.continuity}
                  signals={runtimeFabric.signals}
                  rewards={runtimeFabric.rewards}
                  connectors={runtimeFabric.connectors}
                  preferences={runtimeFabric.preferences}
                  aiSettings={runtimeFabric.aiSettings}
                  plugins={runtimeFabric.plugins}
                  workspace={runtimeFabric.workspace}
                  intelligence={runtimeFabric.intelligence}
                  objects={runtimeFabric.objects}
                  recommendations={continuityRecommendations}
                  onTransfer={(id, to, reason) => setRuntimeFabric((prev) => transferContinuity(prev, id, to, reason))}
                  onResume={(id) => setRuntimeFabric((prev) => resumeContinuity(prev, id))}
                  onToggleConnector={(id, enabled) =>
                    setRuntimeFabric((prev) => upsertConnector(prev, id, {
                      enabled,
                      status: enabled ? "ready" : "needs_config",
                      completeness: enabled ? 100 : 40,
                    }))
                  }
                  onTogglePlugin={(id, enabled) =>
                    setRuntimeFabric((prev) => upsertPlugin(prev, id, {
                      enabled,
                      status: enabled ? "ready" : "needs_auth",
                    }))
                  }
                  onPreferencePatch={(patch) => setRuntimeFabric((prev) => updatePreferences(prev, patch))}
                  onAISettingsPatch={(patch) => setRuntimeFabric((prev) => updateAISettings(prev, patch))}
                  onWorkspacePatch={(patch) => setRuntimeFabric((prev) => updateWorkspaceKnowledge(prev, patch))}
                  onExport={(continuityId) => {
                    setRuntimeFabric((prev) => exportContinuity(prev, continuityId));
                    // Governance audit: record sovereign verification verdict at time of export
                    const exportVerifiedAt = Date.now();
                    setTrustGovState((prev) => {
                      const ledger  = getMissionLedger(prev, activeMissionId ?? continuityId);
                      const updated = appendAuditToLedger(
                        ledger,
                        `export.${continuityId.slice(0, 12)}`,
                        runtimeFabric.workspace.owner,
                        `continuity exported · sovereignty verified · verifiedAt:${exportVerifiedAt} · ${continuityId}`,
                      );
                      return upsertLedger(prev, updated);
                    });
                  }}
                  missions={missions}
                  onMissionUpsert={handleMissionUpsert}
                  onMissionActivate={handleMissionActivate}
                  activeMissionId={activeMissionId}
                  activeMissionOps={activeMissionOps}
                  onMissionOpsSignalDismiss={handleMissionOpsSignalDismiss}
                  onMissionOpsApprovalApprove={handleMissionOpsApprovalApprove}
                  onMissionOpsApprovalReject={handleMissionOpsApprovalReject}
                  operations={operations}
                  onOperationSignalRead={handleOperationSignalRead}
                  onOperationSignalResolve={handleOperationSignalResolve}
                  onHandoffAccept={handleHandoffAccept}
                  onHandoffReject={handleHandoffReject}
                  civilization={civilization}
                  analyticsPatterns={analyticsPatterns}
                  knowledgeGraph={knowledgeGraph}
                  collectiveState={collectiveState}
                  presenceManifest={presenceManifest}
                  exchangeLedger={exchangeLedger}
                  ecosystemState={ecosystemState}
                  platformState={platformState}
                  orgState={orgState}
                  personalOS={personalOS}
                  compoundNetwork={runtimeFabric.compoundNetwork ?? defaultCompoundNetwork()}
                  governanceEntries={Object.values(trustGovState.ledgers).flatMap(l => l.auditTrail.entries)}
                  governanceConsequences={Object.values(trustGovState.ledgers).flatMap(l => l.consequenceTrail)}
                  flowState={flowState}
                  systemModel={systemModel}
                  distributionLedger={[]}
                  providerHealth={runtimeFabric.providerHealth}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <SignalsPanel
        open={signalsOpen}
        onClose={() => setSignalsOpen(false)}
        signals={runtimeFabric.signals}
        onOpen={(item) => {
          navigate(item.destination.tab, item.destination.view, item.destination.id);
          setRuntimeFabric((prev) => resolveSignal(markSignalRead(prev, item.id), item.id));
          setSignalsOpen(false);
        }}
        onDismiss={(id) => setRuntimeFabric((prev) => markSignalRead(prev, id))}
        onMarkAllRead={() => setRuntimeFabric((prev) => markAllSignalsRead(prev))}
      />

      <GlobalExecutionBand
        snapshot={lastExecutionSnapshot}
        missionName={activeMission?.identity.name}
        providerHealth={lastExecutionProviderHealth}
      />

      <GlobalCommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        navigate={navigate}
        searchIndex={searchIndex}
        onMissionNew={handleMissionPaletteNew}
        onMissionSwitch={handleMissionPaletteSwitch}
        onMissionHandoff={activeMission ? handleMissionPaletteHandoff : undefined}
        activeMissionName={activeMission?.identity.name}
        missions={missions}
      />

      <FloatingNoteSystem
        notes={notes}
        onChange={updateNote}
        onRemove={removeNote}
      />
    </div>
  );
}
