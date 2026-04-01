/**
 * RUBERRA — Mother Shell
 * Full state management ported from github.com/Ivan-star-dev/Ruberra
 * with Make-environment streaming via Supabase edge function.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SovereignBar } from "./components/SovereignBar";
import { ShellSideRail } from "./components/ShellSideRail";
import { FloatingNoteSystem } from "./components/FloatingNoteSystem";
import { LabMode } from "./components/modes/LabMode";
import { SchoolMode } from "./components/modes/SchoolMode";
import { CreationMode } from "./components/modes/CreationMode";
import { ProfileMode } from "./components/modes/ProfileMode";
import {
  type Tab, type Message, type SignalStatus,
  type LabView, type SchoolView, type CreationView, type ProfileView,
  type FloatingNote, type Theme, type NavFn,
} from "./components/shell-types";
import { parseBlocks } from "./components/parseBlocks";
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
  pushSignal,
  recordRuntimeMessageObject,
  recordExecutionResult,
  upsertExecutionResultByContinuity,
  recordConnectorAction,
  recordConnectorIOTrace,
  upsertProviderHealth,
  updateConnectorOperationalState,
  computeConnectorRetryPolicy,
  appendRunTimeline,
  startWorkflowRun,
  transitionWorkflowStage,
  getChamberExecutionPolicy,
  resolveProviderPodium,
  recommendedConnectorsForChamber,
  recommendContinuityActions,
  resumeContinuity,
  routeIntelligenceRequest,
  planWebExecutionPath,
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
  type RuntimeFabric,
} from "./components/runtime-fabric";
import { resolveRouteDecision } from "./components/intelligence-foundation";
import { executeAIRequest } from "./components/execution-adapters";

// ─── Constants ────────────────────────────────────────────────────────────────
const TABS: Tab[] = ["lab", "school", "creation", "profile"];
const STORAGE_KEY = "ruberra_messages_v2";
const MAX_CONTEXT = 20;

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

  // ── Floating notes ───────────────────────────────────────────────────────────
  const [notes, setNotes] = useState<FloatingNote[]>([]);

  // ── Theme ────────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [theme]);

  // ── Persistence ───────────────────────────────────────────────���──────────────
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
          destination: { tab: "profile", view: "projects" },
          linkedObjectId: connector.id,
        });
      }
      return next;
    });
  }, [runtimeFabric.connectors]);

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

  const handleClearTab = useCallback((tab: Tab) => {
    setMessages((prev) => ({ ...prev, [tab]: [] }));
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as TabMessages;
        parsed[tab] = [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch { /* ignore */ }
  }, []);

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
    const task = tasks[tab as ChamberTab];
    setRuntimeFabric((prev) => updatePreferences(prev, {
      preferredChamber: tab,
      preferredObjectType: tab === "school" ? "lesson" : tab === "lab" ? "experiment" : "artifact_pack",
    }));
    const requestedModelId = activeModels[tab as ChamberTab];
    const plan = resolveExecutionPlan(tab, task, requestedModelId);
    const workflowId = task.startsWith("creation") ? "build_pipeline" : undefined;
    const routeDecision = resolveRouteDecision(runtimeFabric.intelligence, {
      workflowId,
      requestText: text,
    });
    const providerPodium = resolveProviderPodium(runtimeFabric, routeDecision.chamber, text);
    const webPath = planWebExecutionPath(runtimeFabric, routeDecision.chamber, text);
    const chamberPolicy = getChamberExecutionPolicy(runtimeFabric, tab);
    const leaderPioneer = runtimeFabric.intelligence.pioneers.find((entry) => entry.id === routeDecision.pioneerId);
    const hostingLevel = leaderPioneer?.hostingLevel ?? "proxy";
    const connectorRefs = recommendedConnectorsForChamber(runtimeFabric, routeDecision.chamber);
    setRuntimeFabric((prev) => routeIntelligenceRequest(prev, {
      workflowId,
      requestText: text,
    }).fabric);
    if (routeDecision.chamber !== tab) {
      setRuntimeFabric((prev) => pushSignal(prev, {
        type: "recommendation",
        label: `Route advisory: ${routeDecision.chamber} is recommended lead for this request`,
        severity: "info",
        sourceChamber: "profile",
        destinationChamber: routeDecision.chamber,
        destination: { tab: routeDecision.chamber, view: routeDecision.chamber === "creation" ? "terminal" : "chat" },
      }));
    }
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
        supportChain: routeDecision.supportChain,
        workflowId,
        hostingLevel,
        providerId: providerPodium.primary.id,
        providerLane: providerPodium.primary.lane,
        modelId: selectedModelId,
        executionState: "live",
        chamberRoute: routeDecision.chamber,
        connectorRefs,
      },
    };
    setMessages((prev) => ({ ...prev, [tab]: [...prev[tab], userMsg] }));
    setRuntimeFabric((prev) => recordRuntimeMessageObject(prev, userMsg));
    setLoading((prev)  => ({ ...prev, [tab]: true }));
    setSignals((prev)  => ({ ...prev, [tab]: "streaming" }));

    const assistantId = crypto.randomUUID();
    const continuityId = `${tab}-${assistantId}`;
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
      supportChain: routeDecision.supportChain,
      hostingLevel,
      providerId: providerPodium.primary.id,
      providerLane: providerPodium.primary.lane,
      modelId: selectedModelId,
      connectorRefs,
      routeReason: routeDecision.reason,
    }));
    setRuntimeFabric((prev) => recordExecutionResult(prev, {
      continuityId,
      chamber: tab,
      requestedProviderId: providerPodium.primary.id,
      selectedProviderId: providerPodium.primary.id,
      requestedModelId: requestedModelId,
      selectedModelId: selectedModelId,
      providerLane: providerPodium.primary.lane,
      executionMode: providerPodium.primary.lane === "open_source_local" ? "local" : providerPodium.primary.lane === "premium_hosted_future" ? "hosted_scaffold" : "wrapped",
      executionState: "live",
      fallbackUsed: false,
      providerUnavailable: false,
      connectorUnavailable: false,
      scaffoldOnly: false,
      connectorPathUsed: !!webPath,
      workflowId,
      outcome: "success",
      latencyMs: 0,
    }));
    setRuntimeFabric((prev) => appendRunTimeline(prev, {
      continuityId,
      chamber: tab,
      type: "execution",
      status: "live",
      label: `${tab} execution live (${chamberPolicy.bias})`,
    }));
    if (workflowId) {
      const workflow = runtimeFabric.intelligence.workflowTemplates.find((entry) => entry.id === workflowId);
      if (workflow) {
        setRuntimeFabric((prev) => startWorkflowRun(prev, {
          workflowId,
          continuityId,
          chamber: tab,
          stages: workflow.stages,
        }));
      }
    }
    if (webPath) {
      setRuntimeFabric((prev) => pushSignal(prev, {
        type: "connector",
        label: `Web path armed via ${webPath.mode} (${webPath.intent})`,
        severity: "info",
        sourceChamber: routeDecision.chamber,
        destinationChamber: routeDecision.chamber,
        destination: { tab: routeDecision.chamber, view: routeDecision.chamber === "creation" ? "terminal" : "chat" },
        linkedObjectId: assistantId,
      }));
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
          meta: {
            routeReason: routeDecision.reason,
            pioneerId: routeDecision.pioneerId,
            giId: routeDecision.giId,
            supportChain: routeDecision.supportChain,
            workflowId,
            hostingLevel,
            providerId: providerPodium.primary.id,
            providerLane: providerPodium.primary.lane,
            modelId: selectedModelId,
            executionState: "live",
            chamberRoute: routeDecision.chamber,
            connectorRefs,
          },
        },
      ],
    }));

    let parseOnComplete = true;
    let assistantContent = "";

    try {
      const history = messagesRef.current[tab]
        .filter((m) => m.id !== assistantId)
        .slice(-MAX_CONTEXT)
        .map(({ role, content }) => ({ role, content }));

      const execution = await executeAIRequest({
        chamber: tab,
        task,
        prompt: text,
        modelId: selectedModelId,
        providerId: providerPodium.primary.id,
        providerLane: providerPodium.primary.lane,
        fallbackChain: plan.fallbackChain,
        context: history,
        signal: controller.signal,
        localEndpoint: runtimeFabric.aiSettings.localRuntimeEndpoint,
        connectorIds: webPath?.connectorIds,
        workflowId,
        continuityId,
      }, (chunk) => {
        assistantContent += chunk;
        setMessages((prev) => ({
          ...prev,
          [tab]: prev[tab].map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          ),
        }));
      });

      if (execution.blocked && execution.error) {
        throw new Error(execution.error);
      }
      if (!assistantContent && execution.content) {
        assistantContent = execution.content;
        setMessages((prev) => ({
          ...prev,
          [tab]: prev[tab].map((m) =>
            m.id === assistantId ? { ...m, content: execution.content } : m
          ),
        }));
      }
      setMessages((prev) => ({
        ...prev,
        [tab]: prev[tab].map((m) =>
          m.id === assistantId
            ? {
              ...m,
              meta: {
                ...m.meta,
                executionState: execution.state,
              },
            }
            : m
        ),
      }));

      setSignals((prev) => ({ ...prev, [tab]: "completed" }));
      setRuntimeFabric((prev) => recordRuntimeMessageObject(prev, {
        id: assistantId,
        role: "assistant",
        content: assistantContent,
        tab,
        timestamp: Date.now(),
        meta: {
          routeReason: routeDecision.reason,
          pioneerId: routeDecision.pioneerId,
          giId: routeDecision.giId,
          supportChain: routeDecision.supportChain,
          workflowId,
          hostingLevel,
          providerId: providerPodium.primary.id,
          providerLane: providerPodium.primary.lane,
          modelId: selectedModelId,
          executionState: execution.state,
          chamberRoute: routeDecision.chamber,
          connectorRefs,
        },
      }));
      setRuntimeFabric((prev) => {
        let next = transitionContinuity(prev, continuityId, "completed");
        next = upsertExecutionResultByContinuity(next, continuityId, {
          selectedProviderId: execution.selectedProviderId,
          selectedModelId: execution.selectedModelId,
          executionMode: execution.mode,
          executionState: execution.state,
          fallbackUsed: execution.selectedModelId !== requestedModelId || execution.selectedProviderId !== providerPodium.primary.id,
          providerUnavailable: execution.providerUnavailable,
          connectorUnavailable: !!webPath && webPath.connectorIds.length === 0,
          scaffoldOnly: execution.scaffoldOnly,
          connectorPathUsed: !!webPath,
          outcome: execution.blocked ? "blocked" : execution.degraded ? "degraded" : "success",
          latencyMs: execution.latencyMs,
          blockedReason: execution.blockedReason,
          errorMessage: execution.error ?? execution.blockedReason,
        });
        next = upsertProviderHealth(next, {
          providerId: execution.selectedProviderId,
          state: execution.providerHealth,
          lastError: execution.error ?? execution.blockedReason,
          lastLatencyMs: execution.latencyMs,
        });
        next = appendRunTimeline(next, {
          continuityId,
          chamber: tab,
          type: "execution",
          status: execution.blocked ? "blocked" : execution.degraded ? "degraded" : "completed",
          label: execution.blocked ? "execution blocked" : execution.degraded ? "execution degraded" : "execution completed",
        });
        if (workflowId) {
          next = transitionWorkflowStage(next, continuityId, execution.blocked ? "failed" : execution.degraded ? "degraded" : "completed", execution.error);
          next = appendRunTimeline(next, {
            continuityId,
            chamber: tab,
            type: "workflow",
            status: execution.blocked ? "failed" : execution.degraded ? "degraded" : "completed",
            label: execution.blocked ? "workflow failed" : execution.degraded ? "workflow completed with degradation" : "workflow completed",
          });
        }
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
        if (tab === "school") {
          next = pushSignal(next, {
            type: "transfer",
            label: "Lesson completion unlocked a Lab validation route",
            severity: "info",
            sourceChamber: "school",
            destinationChamber: "lab",
            destination: { tab: "lab", view: "analysis" },
            linkedObjectId: assistantId,
          });
        }
        if (webPath) {
          for (const connectorId of webPath.connectorIds) {
            const retryPolicy = computeConnectorRetryPolicy(next, connectorId);
            next = recordConnectorAction(next, {
              continuityId,
              workflowId,
              requestedConnectorId: connectorId,
              selectedConnectorId: connectorId,
              connectorId,
              chamber: tab,
              action: "read",
              status: execution.blocked ? "degraded" : execution.providerUnavailable ? "failed" : "success",
              phase: execution.blocked ? "failed" : "completed",
              connectorAvailable: webPath.connectorIds.length > 0,
              retryCount: retryPolicy.retryCount,
              payloadSummary: `${webPath.intent} intent`,
              resultSummary: execution.blocked ? "blocked by provider state" : "connector path armed",
              errorSummary: execution.error,
              degradedMode: execution.degraded || execution.blocked,
            });
            next = updateConnectorOperationalState(next, connectorId, execution.blocked ? "degraded" : execution.providerUnavailable ? "failed" : "success");
            next = recordConnectorIOTrace(next, {
              continuityId,
              connectorId,
              service: connectorId,
              route: webPath.mode,
              requestPayload: `${webPath.intent}:${text.slice(0, 120)}`,
              responsePayload: execution.blocked ? "blocked" : "armed",
              errorPayload: execution.error ?? execution.blockedReason,
              outcomeClass: execution.blocked ? "failed" : execution.degraded ? "degraded" : "ok",
              retryScheduled: retryPolicy.shouldRetry && (execution.blocked || execution.providerUnavailable),
            });
            next = appendRunTimeline(next, {
              continuityId,
              chamber: tab,
              type: "connector",
              status: execution.blocked ? "degraded" : "completed",
              label: `${connectorId} ${execution.blocked ? "degraded" : "completed"}`,
            });
          }
        }
        return next;
      });
      setTimeout(() => {
        setSignals((prev) =>
          prev[tab] === "completed" ? { ...prev, [tab]: "idle" } : prev
        );
      }, 2400);

    } catch (err) {
      const isAbort = err instanceof Error && err.name === "AbortError";
      parseOnComplete = false;

      if (isAbort) {
        setSignals((prev) => ({ ...prev, [tab]: "idle" }));
        setRuntimeFabric((prev) => {
          let next = transitionContinuity(prev, continuityId, "paused");
          next = upsertExecutionResultByContinuity(next, continuityId, {
            executionState: "blocked",
            outcome: "blocked",
            errorMessage: "aborted_by_user",
          });
          next = appendRunTimeline(next, {
            continuityId,
            chamber: tab,
            type: "execution",
            status: "blocked",
            label: "execution paused by user",
          });
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
              ? { ...m, content: "Error — please try again." }
              : m
          ),
        }));
        setSignals((prev) => ({ ...prev, [tab]: "error" }));
        setRuntimeFabric((prev) => {
          let next = transitionContinuity(prev, continuityId, "blocked");
          next = upsertExecutionResultByContinuity(next, continuityId, {
            executionState: "failed",
            outcome: "error",
            errorMessage: err instanceof Error ? err.message : "unknown_error",
          });
          next = upsertProviderHealth(next, {
            providerId: providerPodium.primary.id,
            state: "unavailable",
            lastError: err instanceof Error ? err.message : "unknown_error",
          });
          if (workflowId) {
            next = transitionWorkflowStage(next, continuityId, "failed", err instanceof Error ? err.message : "unknown_error");
          }
          next = appendRunTimeline(next, {
            continuityId,
            chamber: tab,
            type: "execution",
            status: "failed",
            label: "execution failed",
          });
          next = pushSignal(next, {
            type: "recommendation",
            label: `${tab} task blocked — check details and retry`,
            severity: "critical",
            sourceChamber: tab,
            destinationChamber: tab,
            destination: { tab, view: tab === "creation" ? "terminal" : "chat" },
          });
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
      if (parseOnComplete) {
        applyParsedBlocks(assistantId, tab);
      }
    }
  }, [activeTab, activeModels, applyParsedBlocks, runtimeFabric, tasks]);

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [signalsOpen, setSignalsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchChamberFilter, setSearchChamberFilter] = useState<"all" | ChamberTab>("all");
  const [searchLifecycleFilter, setSearchLifecycleFilter] = useState<"all" | string>("all");
  const searchIndex = buildSearchIndex(runtimeFabric);
  const filteredObjects = searchIndex.filter((entry) =>
    (searchChamberFilter === "all" || entry.chamber === searchChamberFilter) &&
    (!searchText.trim() || entry.searchableText.includes(searchText.toLowerCase())) &&
    (searchLifecycleFilter === "all" || entry.status === searchLifecycleFilter)
  ).slice(0, 12);
  const notificationItems = runtimeFabric.signals.filter((s) => !s.read).slice(0, 12);
  const hasSignals = notificationItems.length > 0;
  const continuityRecommendations = recommendContinuityActions(runtimeFabric);

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
      {/* Sovereign Bar */}
      <SovereignBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isLive={isLive}
        theme={theme}
        onThemeToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        onSearchToggle={() => setSearchOpen((v) => !v)}
        onSignalsToggle={() => setSignalsOpen((v) => !v)}
        hasSignals
      />

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
          onNewNote={addNote}
          onClearTab={handleClearTab}
          navigate={navigate}
        />

        {/* Operational Surface */}
        <main style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
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
                  onExport={(continuityId) => setRuntimeFabric((prev) => exportContinuity(prev, continuityId))}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {searchOpen && (
        <div style={{ position: "absolute", top: 48, right: 18, width: 360, background: "var(--r-surface)", border: "1px solid var(--r-border)", borderRadius: "8px", zIndex: 60, padding: "10px" }}>
          <input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search objects, tags, chambers…" style={{ width: "100%", border: "1px solid var(--r-border)", borderRadius: "6px", padding: "8px", fontSize: "12px", marginBottom: "8px", background: "var(--r-bg)" }} />
          <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
            <select value={searchChamberFilter} onChange={(e) => setSearchChamberFilter(e.target.value as "all" | ChamberTab)} style={{ flex: 1, border: "1px solid var(--r-border)", borderRadius: "5px", background: "var(--r-bg)", fontSize: "10px", fontFamily: "monospace", height: "24px" }}>
              <option value="all">all chambers</option>
              <option value="school">school</option>
              <option value="lab">lab</option>
              <option value="creation">creation</option>
            </select>
            <select value={searchLifecycleFilter} onChange={(e) => setSearchLifecycleFilter(e.target.value)} style={{ flex: 1, border: "1px solid var(--r-border)", borderRadius: "5px", background: "var(--r-bg)", fontSize: "10px", fontFamily: "monospace", height: "24px" }}>
              <option value="all">all lifecycle</option>
              <option value="in_progress">in_progress</option>
              <option value="paused">paused</option>
              <option value="blocked">blocked</option>
              <option value="completed">completed</option>
              <option value="transferred">transferred</option>
            </select>
          </div>
          <div style={{ maxHeight: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
            {filteredObjects.map((obj) => (
              <button key={obj.id} onClick={() => { navigate(obj.route.tab, obj.route.view, obj.route.id); setSearchOpen(false); }} style={{ textAlign: "left", border: "1px solid var(--r-border)", background: "var(--r-bg)", borderRadius: "6px", padding: "8px", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", fontWeight: 500 }}>{obj.title}</span>
                  <span style={{ fontSize: "9px", fontFamily: "monospace", color: "var(--r-dim)" }}>{obj.chamber}</span>
                </div>
                <span style={{ fontSize: "10px", color: "var(--r-subtext)" }}>{obj.kind} · {obj.status ?? "active"}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {signalsOpen && (
        <div style={{ position: "absolute", top: 48, right: 390, width: 300, background: "var(--r-surface)", border: "1px solid var(--r-border)", borderRadius: "8px", zIndex: 60, padding: "10px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "11px", fontFamily: "monospace", color: "var(--r-dim)" }}>Signals</p>
          {notificationItems.map((item) => (
            <button key={item.id} onClick={() => { navigate(item.destination.tab, item.destination.view, item.destination.id); setRuntimeFabric((prev) => resolveSignal(markSignalRead(prev, item.id), item.id)); setSignalsOpen(false); }} style={{ width: "100%", textAlign: "left", border: "1px solid var(--r-border)", background: "var(--r-bg)", borderRadius: "6px", padding: "8px", marginBottom: "6px", cursor: "pointer", fontSize: "11px" }}>
              {item.type} · {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Status bar */}
      <div
        style={{
          height: "22px",
          borderTop: "1px solid var(--r-border)",
          background: "var(--r-surface)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: "0",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <motion.div
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: isLive ? "var(--r-accent)" : "var(--r-pulse)",
            }}
          />
          <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.10em", color: "var(--r-subtext)", textTransform: "uppercase" }}>
            {isLive ? "Streaming" : "Connected"}
          </span>
        </div>

        <div style={{ width: "1px", height: "10px", background: "var(--r-border)", margin: "0 12px" }} />

        <span style={{ fontFamily: "monospace", fontSize: "9px", color: "var(--r-dim)", letterSpacing: "0.05em" }}>
          {activeTab === "profile" ? "profile-ledger · memory-fabric" : `${activeModels[activeTab as ChamberTab]} · ${tasks[activeTab as ChamberTab]}`}
        </span>

        <div style={{ flex: 1 }} />

        <span style={{ fontFamily: "monospace", fontSize: "9px", color: "var(--r-dim)", letterSpacing: "0.05em" }}>
          {activeTab.toUpperCase()}
        </span>

        <div style={{ width: "1px", height: "10px", background: "var(--r-border)", margin: "0 12px" }} />

        <span style={{ fontFamily: "monospace", fontSize: "9px", color: "var(--r-dim)", letterSpacing: "0.04em" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </span>
      </div>

      {/* Floating notes layer */}
      <FloatingNoteSystem notes={notes} onChange={updateNote} onRemove={removeNote} />
    </div>
  );
}
