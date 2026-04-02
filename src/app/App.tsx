/**
 * RUBERRA — Mother Shell
 * Full state management ported from github.com/Ivan-star-dev/Ruberra
 * with Make-environment streaming via Supabase edge function.
 */

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
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
  TASK_STATUS_LABEL,
  buildOperationState,
  createTask,
  createOperationFlow,
  defaultMissionOperationsState,
  dismissSignal,
  emitSignal,
  buildReleaseGate,
  advanceFlow,
  transitionTask,
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
  upsertPlugin,
  upsertConnector,
  exportContinuity,
  startWorkflowRun,
  buildContextHandoff,
  appendRunTimeline,
  transitionWorkflowStage,
  upsertProviderHealth,
  upsertCompoundRun,
  type ExecutionResultRecord,
  type RuntimeFabric,
  type ContinuityItem,
} from "./components/runtime-fabric";
import { resolveRouteDecision } from "./components/intelligence-foundation";
import { getExecutionTruth, buildLiveAdapterRegistry, resolveSovereignStack } from "./components/sovereign-runtime";
import { getContractByIntent, resolveIntent } from "./components/routing-contracts";
import { MODEL_REGISTRY } from "./components/model-orchestration";
import { enforceExecutionGate } from "./components/governance-fabric";
import { buildWorkflowRunPayload } from "./components/workflow-engine";
import { executeAIRequest, type ExecutionRequest } from "./components/execution-adapters";
import { defaultCivilization, registerAgent, admitAgent, activateAgent, type AgentDomain } from "./dna/multi-agent";
import { detectPatterns } from "./dna/intelligence-analytics";
import { defaultKnowledgeGraph, createNode, addNode } from "./dna/living-knowledge";
import { defaultCollectiveState, createMember, admitMember, buildMissionGraphNode, addToMissionGraph, claimCollectiveResource, checkCollectiveCollision, attributeConsequence, recordAttribution } from "./dna/collective-execution";
import { defaultPresenceManifest, createChannel, registerChannel, heartbeatChannel } from "./dna/distribution-presence";
import { defaultExchangeLedger, mintValue, makeAvailable, addValueUnit, verifyValueUnit } from "./dna/value-exchange";
import { defaultEcosystemState, proposeExtension, admitToNetwork } from "./dna/ecosystem-network";
import { defaultPlatformState, createInfraLayer, addLayer } from "./dna/platform-infrastructure";
import { defaultOrgState, assessMissionHealth, surfaceOrgInsights, defaultCapabilityMap } from "./dna/org-intelligence";
import { defaultPersonalOS, createMemoryEntry, buildOperatorContext } from "./dna/personal-sovereign-os";
import { defaultCompoundNetwork } from "./dna/compound-intelligence";
import { defaultTrustGovernanceState, upsertLedger, getMissionLedger, appendAuditToLedger } from "./dna/trust-governance";
import { defaultAutonomousFlowState, createFlowDef, createFlowRun, createFlowStepDef, upsertFlowDef, upsertFlowRun } from "./dna/autonomous-flow";
import {
  defaultSovereignSecurityState,
  updateTrustSignal,
  createSession,
  buildFingerprint,
  verifyFingerprint,
  createSecurityEvent,
  acknowledgeEvent,
  getUnacknowledgedEvents,
  defaultAccessPolicy,
  evaluateAccess,
} from "./dna/sovereign-security";
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
const STORAGE_KEY      = "ruberra_messages_v2";
const GOV_STORAGE_KEY  = "ruberra_trust_gov_v1";

function loadTrustGov() {
  if (typeof window === "undefined") return defaultTrustGovernanceState();
  try {
    const raw = localStorage.getItem(GOV_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ReturnType<typeof defaultTrustGovernanceState>;
  } catch { /* corrupt */ }
  return defaultTrustGovernanceState();
}
const MAX_CONTEXT = 20;

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
  const [securityState, setSecurityState] = useState(defaultSovereignSecurityState);

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
  const [_civBase]          = useState(defaultCivilization);
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
  const [_collectiveBase, setCollectiveBase] = useState(defaultCollectiveState);
  const [_presenceBase]     = useState(() => defaultPresenceManifest("operator-1"));
  const [_ledgerBase]       = useState(defaultExchangeLedger);
  const [_ecoBase]          = useState(defaultEcosystemState);
  const [_platformStateBase] = useState(defaultPlatformState);
  const [_orgStateBase]     = useState(defaultOrgState);
  const [_personalOSBase]   = useState(() => defaultPersonalOS("operator-1"));
  // compoundNetwork is live in runtimeFabric — removed dead useState duplicate
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
  useEffect(() => {
    const controller = new AbortController();
    buildLiveAdapterRegistry(controller.signal)
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
  }, []);

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
    const task = tasks[tab as ChamberTab];
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
          label: plan.fallbackReason,
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
    const connectorActionRows = recommendedConnectorsForChamber(runtimeFabric, tab).map((cid) => {
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
    // Governance gate — enforce execution policy before dispatch
    const govResult = enforceExecutionGate(`chamber.${tab}.dispatch`, {
      kind:      "operator",
      id:        runtimeFabric.workspace.owner,
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
      let usedLocalPath = false;
      const localHealth = runtimeFabric.providerHealth.find(
        (ph) => ph.state === "healthy" && (ph.providerId === "ollama-local" || ph.providerId.startsWith("vllm"))
      );
      if (localHealth) {
        const sovereign = resolveSovereignStack(tab);
        if (sovereign.is_available) {
          const localReq: ExecutionRequest = {
            chamber:       tab,
            task,
            prompt:        text,
            modelId:       sovereign.model.ollama_name || sovereign.model.id,
            providerId:    localHealth.providerId,
            providerLane:  "open_source_local",
            fallbackChain: plan.fallbackChain,
            context:       contextualHistory,
            signal:        controller.signal,
            localEndpoint: runtimeFabric.aiSettings.localRuntimeEndpoint ?? "http://localhost:11434",
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
                    : { ...m, content: m.content + chunk, execution_trace: { ...m.execution_trace, executionState: "live", executionResults: [...er, { phase: "stream", summary: "Local sovereign runtime", at: Date.now() }] } };
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

      // MCP: attach continuity to active mission + build handoff digest — fire-and-forget
      if (activeMissionId) {
        mcpMissionAttachContinuity(activeMissionId, continuityId).catch(() => { /* non-fatal */ });
        mcpMissionBuildHandoff(activeMissionId).catch(() => { /* non-fatal */ });
      }

      if (tab === "creation") {
        setFlowState((prev) => {
          const run = prev.runs.find((r) => r.missionId === continuityId);
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
          // Persist attribution to collective state — this is what makes consequence real
          setCollectiveBase((prev) => recordAttribution(prev, attr));
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
            const run = prev.runs.find((r) => r.missionId === continuityId);
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
  const searchIndex = useMemo(() => buildSearchIndex(runtimeFabric), [runtimeFabric]);
  const activeMission = activeMissionId ? missions.find((m) => m.id === activeMissionId) ?? null : null;
  const missionTaskByContinuityRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!activeMissionId) {
      setActiveMissionOps(null);
      missionTaskByContinuityRef.current = {};
      return;
    }
    setActiveMissionOps((prev) => {
      if (prev?.missionId === activeMissionId) return prev;
      return defaultMissionOperationsState(activeMissionId);
    });
  }, [activeMissionId]);

  useEffect(() => {
    if (!activeMissionId || !activeMission) return;
    setSystemModel((prev) => {
      const live = prev.missionStates[activeMissionId];
      if (live === "running" || live === "blocked") return prev;
      return setMissionState(prev, activeMissionId, activeMission.ledger.currentState);
    });
  }, [activeMissionId, activeMission?.ledger.currentState]);

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
            decision: "approved",
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
            decision: "rejected",
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
    const signalEvents = runtimeFabric.signals.map((s) => s.label);
    const continuityEvents = runtimeFabric.continuity.map((c) => `${c.status} ${c.title}`);
    const missionOutcomeEvents = activeMissionOps
      ? [
          ...activeMissionOps.tasks.map((t) => `${t.status} ${t.title} ${t.outputDigest ?? ""}`.trim()),
          ...activeMissionOps.observations.map((o) => `${o.class} ${o.summary}`),
        ]
      : [];
    return detectPatterns([...signalEvents, ...continuityEvents, ...missionOutcomeEvents]);
  }, [runtimeFabric.signals, runtimeFabric.continuity, activeMissionOps]);

  const orgState = useMemo(() => {
    const missionHealth = missions.map((m) => {
      const missionContinuity = runtimeFabric.continuity.filter((c) => c.workflowId === m.id || c.title.includes(m.label));
      const runs      = missionContinuity.length;
      const completed = missionContinuity.filter((c) => c.status === "completed" || c.status === "exported").length;
      const velocity  = runs > 0 ? completed / runs : 0;
      const blockers  = runtimeFabric.signals.filter((s) => s.severity === "critical" || s.severity === "warn").length;
      const quality   = runs > 0 ? Math.max(0, 1 - blockers * 0.1) : 0.5;
      return assessMissionHealth(m.id, velocity, quality, blockers, runs);
    });
    const capMap   = defaultCapabilityMap();
    const insights = surfaceOrgInsights(capMap, missionHealth);
    return { ..._orgStateBase, missionHealth, insights, lastUpdated: Date.now() };
  }, [missions, runtimeFabric.continuity, runtimeFabric.signals, _orgStateBase]);

  const platformState = useMemo(() => {
    // Derive inference status from live-probed providerHealth, fall back to static resolution.
    // Any healthy provider (Tier A local or Tier B wrapped) makes inference "nominal".
    const liveHealthy = runtimeFabric.providerHealth.some((ph) => ph.state === "healthy");
    const execTruth = getExecutionTruth(activeTab === "profile" ? "lab" : activeTab as Exclude<typeof activeTab, "profile">);
    const inferenceStatus: "nominal" | "degraded" =
      liveHealthy ? "nominal" : execTruth.is_available ? "nominal" : "degraded";
    const providerLabel = liveHealthy
      ? (runtimeFabric.providerHealth.find((ph) => ph.state === "healthy")?.providerId ?? "local")
      : (execTruth.adapter ?? "sovereign");
    let state = _platformStateBase;
    state = addLayer(state, { ...createInfraLayer("intelligence", providerLabel, liveHealthy), status: inferenceStatus });
    state = addLayer(state, { ...createInfraLayer("network", "supabase", false), status: "nominal" });
    state = addLayer(state, { ...createInfraLayer("storage", "supabase", false), status: "nominal" });
    return state;
  }, [_platformStateBase, runtimeFabric.providerHealth, activeTab]);

  const personalOS = useMemo(() => {
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
    const context = buildOperatorContext(_personalOSBase.profile, memories, _personalOSBase.agent);
    return { ..._personalOSBase, memory: memories, context, lastUpdated: Date.now() };
  }, [runtimeFabric.preferences, runtimeFabric.aiSettings, runtimeFabric.continuity, missions, _personalOSBase]);

  // ── Event-pathway substrates ──────────────────────────────────────────────────

  // 1. Civilization: pioneer registry + mission bindings from continuity
  const civilization = useMemo(() => {
    let civ = _civBase;
    for (const p of PIONEER_REGISTRY.slice(0, 10)) {
      const manifest = registerAgent({
        id:           p.id,
        name:         p.name,
        domain:       p.home_chamber as AgentDomain,
        capabilities: p.strengths.map((s) => ({ id: s, label: s, domain: p.home_chamber as AgentDomain })),
      });
      const activeContinuity = runtimeFabric.continuity.filter((c) => c.pioneerId === p.id);
      const isActive = activeContinuity.some((c) => c.status === "in_progress");
      const boundMissions = activeContinuity.map((c) => c.id);
      let agent = boundMissions.reduce(
        (m, mid) => ({ ...m, boundMissions: [...m.boundMissions, mid], lastActiveAt: Date.now() }),
        manifest
      );
      if (isActive) agent = activateAgent(agent);
      civ = admitAgent(civ, agent);
    }
    return civ;
  }, [_civBase, runtimeFabric.continuity]);

  // 2. Collective: operator as sovereign + mission graph + real collision map
  const collectiveState = useMemo(() => {
    const owner = runtimeFabric.workspace.owner;
    let state = _collectiveBase;
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
    return { ...state, collisionMap, lastUpdated: Date.now() };
  }, [_collectiveBase, missions, runtimeFabric.workspace.owner, runtimeFabric.continuity, _collectiveBase.attributions]);

  // 3. Presence manifest: always register the web channel; add active chambers
  const presenceManifest = useMemo(() => {
    let manifest = _presenceBase;
    const webCh = createChannel("web", { runtime: "browser", app: "ruberra-shell" });
    manifest = registerChannel(manifest, webCh);
    if (messages.lab.length > 0)      manifest = registerChannel(manifest, createChannel("api",  { chamber: "lab" }));
    if (messages.creation.length > 0) manifest = registerChannel(manifest, createChannel("cli",  { chamber: "creation" }));
    // Heartbeat: refresh lastSeenAt on all channels every 30s tick
    manifest = { ...manifest, channels: manifest.channels.map(heartbeatChannel) };
    return manifest;
  }, [_presenceBase, messages.lab.length, messages.creation.length, heartbeatTick]);

  // 4. Exchange ledger: exported continuity items become governance-verified value units
  const exchangeLedger = useMemo(() => {
    let ledger = _ledgerBase;
    for (const c of runtimeFabric.continuity.filter((x) => x.status === "exported")) {
      // verifyValueUnit: sets verifiedAt — governance gate already enforced on export path
      const unit = verifyValueUnit(makeAvailable(mintValue(c.id, runtimeFabric.workspace.owner, {
        type:        "knowledge_artifact",
        label:       c.title.slice(0, 60),
        description: `${c.chamber} · exported continuity`,
      })));
      ledger = addValueUnit(ledger, unit);
    }
    return ledger;
  }, [_ledgerBase, runtimeFabric.continuity, runtimeFabric.workspace.owner]);

  // 5. Ecosystem: enabled connectors become admitted extensions
  const ecosystemState = useMemo(() => {
    let state = _ecoBase;
    for (const c of runtimeFabric.connectors.filter((x) => x.enabled)) {
      const ext = proposeExtension({
        id:           c.id,
        name:         c.id,
        type:         "data_connector",
        authorId:     "ruberra-core",
        description:  `${c.id} connector — enabled`,
        capabilities: ["read", "sync"],
        consequences: ["external-data-ingested"],
        version:      "1.0.0",
      });
      state = admitToNetwork(state, { ...ext, status: "admitted" });
    }
    return state;
  }, [_ecoBase, runtimeFabric.connectors]);

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
        trustSignal={securityState.trustSignal}
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
            (c) => (c.workflowId === activeMission.id || c.title.includes(activeMission.label)) &&
              (c.status === "completed" || c.status === "exported")
          ).length}
        />
      )}

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

        {/* Side Rail */}
        <ShellSideRail
          activeTab={activeTab}
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
          onTabChange={handleTabChange}
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
                  missionState={adaptiveMissionState}
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
                  missionState={adaptiveMissionState}
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
                  missionState={adaptiveMissionState}
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
                  flowState={flowState}
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
        onUpdate={updateNote}
        onRemove={removeNote}
      />
    </div>
  );
}
