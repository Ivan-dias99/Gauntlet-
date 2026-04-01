import { projectId, publicAnonKey } from "/utils/supabase/info";
import { type ChamberTab, type TaskType } from "./model-orchestration";

export type ProviderTruth = "hosted" | "wrapped" | "proxy";
export type ExecutionMode = "local" | "wrapped" | "hosted_scaffold";

export interface ExecutionRequest {
  chamber: ChamberTab;
  task: TaskType;
  prompt: string;
  modelId: string;
  providerId: string;
  providerLane?: "open_source_local" | "free_provider" | "wrapped_external" | "premium_hosted_future";
  fallbackChain: string[];
  context: Array<{ role: string; content: string }>;
  signal: AbortSignal;
  localEndpoint?: string;
  timeoutMs?: number;
  maxRetries?: number;
  connectorIds?: string[];
  workflowId?: string;
  continuityId?: string;
}

export interface ExecutionResponse {
  content: string;
  mode: ExecutionMode;
  degraded: boolean;
  blocked: boolean;
  providerTruth: ProviderTruth;
  selectedProviderId: string;
  selectedModelId: string;
  state:
    | "live"
    | "completed"
    | "degraded"
    | "blocked"
    | "failed"
    | "fallback_used"
    | "provider_unavailable"
    | "connector_unavailable"
    | "scaffold_only";
  providerUnavailable: boolean;
  scaffoldOnly: boolean;
  blockedReason?: string;
  localHandshake?: { endpoint?: string; reachable: boolean; latencyMs?: number; checkedAt: number };
  latencyMs: number;
  normalizedRequest: {
    chamber: ChamberTab;
    task: TaskType;
    promptPreview: string;
    fallbackCount: number;
    connectorLinked: boolean;
    connectorCount: number;
    workflowId?: string;
    continuityId?: string;
  };
  attempts: number;
  timedOut: boolean;
  providerHealth: "healthy" | "degraded" | "unavailable";
  localRuntime?: {
    endpoint?: string;
    state: "ready" | "degraded" | "unavailable";
    models: string[];
    capabilities: string[];
    lastCheckedAt?: number;
  };
  error?: string;
}

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b9f46b68`;
const providerHealthCache = new Map<string, { state: "healthy" | "degraded" | "unavailable"; updatedAt: number }>();

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number, externalSignal?: AbortSignal): Promise<{ response?: Response; timedOut: boolean }> {
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  externalSignal?.addEventListener("abort", onAbort, { once: true });
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    return { response, timedOut: false };
  } catch {
    return { timedOut: true };
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener("abort", onAbort);
  }
}

function inferProviderTruth(lane?: ExecutionRequest["providerLane"]): ProviderTruth {
  if (lane === "wrapped_external" || lane === "free_provider") return "wrapped";
  if (lane === "open_source_local") return "proxy";
  return "hosted";
}

async function runWrapped(
  req: ExecutionRequest,
  onChunk?: (chunk: string) => void,
): Promise<ExecutionResponse> {
  const started = performance.now();
  const timeoutMs = req.timeoutMs ?? 45_000;
  const maxRetries = Math.max(0, req.maxRetries ?? 1);
  let attempt = 0;
  let res: Response | undefined;
  let timedOut = false;
  while (attempt <= maxRetries) {
    attempt += 1;
    const result = await fetchWithTimeout(`${SERVER_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        tab: req.chamber,
        task: req.task,
        model: req.modelId,
        fallbackChain: req.fallbackChain,
        messages: [...req.context, { role: "user", content: req.prompt }],
      }),
    }, timeoutMs, req.signal);
    timedOut = result.timedOut;
    if (result.response?.ok && result.response.body) {
      res = result.response;
      break;
    }
  }

  if (!res || !res.ok || !res.body) {
    providerHealthCache.set(req.providerId, { state: timedOut ? "degraded" : "unavailable", updatedAt: Date.now() });
    return {
      content: "",
      mode: "wrapped",
      degraded: true,
      blocked: true,
      providerTruth: inferProviderTruth(req.providerLane),
      selectedProviderId: req.providerId,
      selectedModelId: req.modelId,
      state: timedOut ? "blocked" : "failed",
      providerUnavailable: true,
      scaffoldOnly: false,
      latencyMs: Math.round(performance.now() - started),
      normalizedRequest: {
        chamber: req.chamber,
        task: req.task,
        promptPreview: req.prompt.slice(0, 120),
        fallbackCount: req.fallbackChain.length,
        connectorLinked: (req.connectorIds?.length ?? 0) > 0,
        connectorCount: req.connectorIds?.length ?? 0,
        workflowId: req.workflowId,
        continuityId: req.continuityId,
      },
      attempts: attempt,
      timedOut,
      providerHealth: timedOut ? "degraded" : "unavailable",
      error: timedOut ? "provider_timeout" : "provider_unavailable",
    };
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let content = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      content += chunk;
      onChunk?.(chunk);
    }
  } finally {
    reader.releaseLock();
  }
  const healthState: "healthy" | "degraded" = attempt > 1 ? "degraded" : "healthy";
  providerHealthCache.set(req.providerId, { state: healthState, updatedAt: Date.now() });

  return {
    content,
    mode: "wrapped",
    degraded: false,
    blocked: false,
    providerTruth: inferProviderTruth(req.providerLane),
    selectedProviderId: req.providerId,
    selectedModelId: req.modelId,
    state: "completed",
    providerUnavailable: false,
    scaffoldOnly: false,
    latencyMs: Math.round(performance.now() - started),
    normalizedRequest: {
      chamber: req.chamber,
      task: req.task,
      promptPreview: req.prompt.slice(0, 120),
      fallbackCount: req.fallbackChain.length,
      connectorLinked: (req.connectorIds?.length ?? 0) > 0,
      connectorCount: req.connectorIds?.length ?? 0,
      workflowId: req.workflowId,
      continuityId: req.continuityId,
    },
    attempts: attempt,
    timedOut: false,
    providerHealth: healthState,
  };
}

export async function checkLocalRuntimeHealth(endpoint?: string, signal?: AbortSignal): Promise<{ reachable: boolean; latencyMs?: number; checkedAt: number }> {
  const checkedAt = Date.now();
  if (!endpoint) return { reachable: false, checkedAt };
  try {
    const start = performance.now();
    const res = await fetch(`${endpoint.replace(/\\/$/, "")}/api/tags`, { method: "GET", signal });
    const latencyMs = Math.round(performance.now() - start);
    return { reachable: res.ok, latencyMs, checkedAt };
  } catch {
    return { reachable: false, checkedAt };
  }
}

async function fetchLocalModels(endpoint?: string, signal?: AbortSignal): Promise<string[]> {
  if (!endpoint) return [];
  try {
    const res = await fetch(`${endpoint.replace(/\\/$/, "")}/api/tags`, { method: "GET", signal });
    if (!res.ok) return [];
    const json = await res.json() as { models?: Array<{ name?: string }> };
    return (json.models ?? []).map((m) => m.name).filter(Boolean) as string[];
  } catch {
    return [];
  }
}

async function runLocalProxy(req: ExecutionRequest, onChunk?: (chunk: string) => void): Promise<ExecutionResponse> {
  const started = performance.now();
  const health = await checkLocalRuntimeHealth(req.localEndpoint, req.signal);
  const models = health.reachable ? await fetchLocalModels(req.localEndpoint, req.signal) : [];
  if (!health.reachable) {
    providerHealthCache.set(req.providerId, { state: "unavailable", updatedAt: Date.now() });
    return {
      content: "Local/open-source runtime unavailable — endpoint handshake failed.",
      mode: "local",
      degraded: true,
      blocked: true,
      providerTruth: inferProviderTruth(req.providerLane),
      selectedProviderId: req.providerId,
      selectedModelId: req.modelId,
      state: "provider_unavailable",
      providerUnavailable: true,
      scaffoldOnly: false,
      blockedReason: "local_runtime_unreachable",
      localHandshake: { endpoint: req.localEndpoint, ...health },
      latencyMs: Math.round(performance.now() - started),
      normalizedRequest: {
        chamber: req.chamber,
        task: req.task,
        promptPreview: req.prompt.slice(0, 120),
        fallbackCount: req.fallbackChain.length,
        connectorLinked: (req.connectorIds?.length ?? 0) > 0,
        connectorCount: req.connectorIds?.length ?? 0,
        workflowId: req.workflowId,
        continuityId: req.continuityId,
      },
      attempts: 1,
      timedOut: false,
      providerHealth: "unavailable",
      localRuntime: {
        endpoint: req.localEndpoint,
        state: "unavailable",
        models: [],
        capabilities: [],
        lastCheckedAt: health.checkedAt,
      },
    };
  }
  const summary = `[local-proxy:${req.modelId}] chamber=${req.chamber} task=${req.task} :: ${req.prompt.slice(0, 180)}`;
  onChunk?.(summary);
  providerHealthCache.set(req.providerId, { state: models.length > 0 ? "healthy" : "degraded", updatedAt: Date.now() });
  return {
    content: summary,
    mode: "local",
    degraded: true,
    blocked: false,
    providerTruth: inferProviderTruth(req.providerLane),
    selectedProviderId: req.providerId,
    selectedModelId: req.modelId,
    state: "degraded",
    providerUnavailable: false,
    scaffoldOnly: false,
    localHandshake: { endpoint: req.localEndpoint, ...health },
    latencyMs: Math.round(performance.now() - started),
    normalizedRequest: {
      chamber: req.chamber,
      task: req.task,
      promptPreview: req.prompt.slice(0, 120),
      fallbackCount: req.fallbackChain.length,
      connectorLinked: (req.connectorIds?.length ?? 0) > 0,
      connectorCount: req.connectorIds?.length ?? 0,
      workflowId: req.workflowId,
      continuityId: req.continuityId,
    },
    attempts: 1,
    timedOut: false,
    providerHealth: models.length > 0 ? "healthy" : "degraded",
    localRuntime: {
      endpoint: req.localEndpoint,
      state: models.length > 0 ? "ready" : "degraded",
      models,
      capabilities: ["chat", "summarize", "code"],
      lastCheckedAt: health.checkedAt,
    },
  };
}

async function runHostedScaffold(req: ExecutionRequest): Promise<ExecutionResponse> {
  const started = performance.now();
  providerHealthCache.set(req.providerId, { state: "degraded", updatedAt: Date.now() });
  return {
    content: "Provider lane is defined but not yet live. Route switched to wrapped/local fallback when available.",
    mode: "hosted_scaffold",
    degraded: true,
    blocked: true,
    providerTruth: inferProviderTruth(req.providerLane),
    selectedProviderId: req.providerId,
    selectedModelId: req.modelId,
    state: "scaffold_only",
    providerUnavailable: true,
    scaffoldOnly: true,
    blockedReason: "premium_hosted_not_live",
    latencyMs: Math.round(performance.now() - started),
    normalizedRequest: {
      chamber: req.chamber,
      task: req.task,
      promptPreview: req.prompt.slice(0, 120),
      fallbackCount: req.fallbackChain.length,
      connectorLinked: (req.connectorIds?.length ?? 0) > 0,
      connectorCount: req.connectorIds?.length ?? 0,
      workflowId: req.workflowId,
      continuityId: req.continuityId,
    },
    attempts: 1,
    timedOut: false,
    providerHealth: "degraded",
    localRuntime: {
      endpoint: req.localEndpoint,
      state: "degraded",
      models: [],
      capabilities: [],
    },
  };
}

export async function executeAIRequest(req: ExecutionRequest, onChunk?: (chunk: string) => void): Promise<ExecutionResponse> {
  if (req.providerLane === "wrapped_external" || req.providerLane === "free_provider") {
    return runWrapped(req, onChunk);
  }
  if (req.providerLane === "open_source_local") {
    return runLocalProxy(req, onChunk);
  }
  return runHostedScaffold(req);
}
