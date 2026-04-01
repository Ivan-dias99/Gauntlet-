/**
 * RUBERRA Sovereign Runtime
 * Open-weight / self-hosted AI layer.
 *
 * Execution truth law:
 *   Tier A — local/hosted   = model runs inside self-hosted or Ruberra-owned runtime
 *   Tier B — wrapped/free   = Ruberra calls a free external inference provider
 *   Tier C — proxy          = pioneer behavior emulated via routing, memory, contracts
 *
 * Never claim Tier A for a Tier B or C provider.
 */

import { type Tab } from "./shell-types";

// ─── Execution tiers ──────────────────────────────────────────────────────────

export type RuntimeTier = "A" | "B" | "C";

export const TIER_LABEL: Record<RuntimeTier, string> = {
  A: "local",
  B: "wrapped · free",
  C: "proxy",
};

export const TIER_COLOR: Record<RuntimeTier, string> = {
  A: "var(--r-ok)",     // green — genuinely local/hosted
  B: "var(--r-warn)",   // amber — wrapped external, non-guaranteed
  C: "var(--r-dim)",    // grey  — proxy / no live model
};

export const TIER_DESCRIPTION: Record<RuntimeTier, string> = {
  A: "Runs inside Ruberra runtime or self-hosted Ollama / vLLM endpoint. Execution is local.",
  B: "Routes to a free external inference endpoint. Not guaranteed uptime. Not self-hosted.",
  C: "No live model attached. Pioneer behavior emulated via routing contracts and memory.",
};

// ─── Provider adapter spec ────────────────────────────────────────────────────

export type ProviderAdapterKind =
  | "ollama"            // Ollama local server (OpenAI-compatible /api/chat)
  | "vllm"              // vLLM OpenAI-compatible server
  | "openai_compat"     // Any OpenAI-compatible endpoint (LM Studio, llama.cpp server, etc.)
  | "huggingface_free"  // HuggingFace Inference API (free tier, rate-limited)
  | "groq"              // Groq Cloud (fast inference, free tier available, wrapped)
  | "together"          // Together AI (some free models, wrapped)
  | "proprietary"       // Proprietary provider (OpenAI, Anthropic, Google) — not sovereign
  | "none";             // No live provider

export interface ProviderAdapter {
  id:          string;
  kind:        ProviderAdapterKind;
  tier:        RuntimeTier;
  label:       string;
  base_url:    string;          // empty string = not yet configured
  config_key:  string;          // env var or settings key that enables this adapter
  health_path: string;          // GET path to check liveness, empty = no health endpoint
  requires_key: boolean;
  available:   boolean;         // current availability (false = needs setup or unavailable)
  notes:       string;
}

export const PROVIDER_ADAPTERS: ProviderAdapter[] = [
  // ── Tier A: Local / Self-Hosted ───────────────────────────────────────────
  {
    id:           "ollama-local",
    kind:         "ollama",
    tier:         "A",
    label:        "Ollama (Local)",
    base_url:     "http://localhost:11434",
    config_key:   "RUBERRA_OLLAMA_URL",
    health_path:  "/api/tags",
    requires_key: false,
    available:    false,          // not configured by default; set via env
    notes:        "Run `ollama serve` locally. Set RUBERRA_OLLAMA_URL to enable Tier A.",
  },
  {
    id:           "vllm-local",
    kind:         "vllm",
    tier:         "A",
    label:        "vLLM (Self-Hosted)",
    base_url:     "http://localhost:8000",
    config_key:   "RUBERRA_VLLM_URL",
    health_path:  "/health",
    requires_key: false,
    available:    false,
    notes:        "Run a vLLM OpenAI-compatible server. Set RUBERRA_VLLM_URL to enable.",
  },
  {
    id:           "lm-studio",
    kind:         "openai_compat",
    tier:         "A",
    label:        "LM Studio (Local)",
    base_url:     "http://localhost:1234/v1",
    config_key:   "RUBERRA_LMSTUDIO_URL",
    health_path:  "/v1/models",
    requires_key: false,
    available:    false,
    notes:        "Start LM Studio server. Set RUBERRA_LMSTUDIO_URL to enable.",
  },

  // ── Tier B: Wrapped Free Providers ────────────────────────────────────────
  {
    id:           "groq-free",
    kind:         "groq",
    tier:         "B",
    label:        "Groq Cloud (Free Tier)",
    base_url:     "https://api.groq.com/openai/v1",
    config_key:   "RUBERRA_GROQ_KEY",
    health_path:  "",
    requires_key: true,
    available:    false,
    notes:        "Free tier. Rate-limited. Not guaranteed uptime. Set RUBERRA_GROQ_KEY.",
  },
  {
    id:           "together-free",
    kind:         "together",
    tier:         "B",
    label:        "Together AI (Free Tier)",
    base_url:     "https://api.together.xyz/v1",
    config_key:   "RUBERRA_TOGETHER_KEY",
    health_path:  "",
    requires_key: true,
    available:    false,
    notes:        "Free credits. Rate-limited. Not guaranteed. Set RUBERRA_TOGETHER_KEY.",
  },
  {
    id:           "hf-inference",
    kind:         "huggingface_free",
    tier:         "B",
    label:        "HuggingFace Inference (Free)",
    base_url:     "https://api-inference.huggingface.co/models",
    config_key:   "RUBERRA_HF_KEY",
    health_path:  "",
    requires_key: true,
    available:    false,
    notes:        "Free inference API. Highly variable latency and availability. Set RUBERRA_HF_KEY.",
  },
];

// ─── Open-weight model registry ───────────────────────────────────────────────

export type RuntimeModelClass =
  | "reasoning"
  | "coding"
  | "fast"
  | "embedding"
  | "multimodal"
  | "instruction";

export interface SovereignModel {
  id:            string;
  label:         string;
  family:        string;
  model_class:   RuntimeModelClass;
  tier:          RuntimeTier;
  adapter_id:    string;          // maps to PROVIDER_ADAPTERS entry
  ollama_name:   string;          // name in ollama library (e.g. "llama3.2:8b")
  hf_id:         string;          // HuggingFace model ID
  context_window: number;         // max tokens
  quality:       "good" | "strong" | "elite";
  latency:       "low" | "medium" | "high";
  parameters:    string;          // e.g. "8B", "70B"
  license:       string;
  description:   string;
}

export const SOVEREIGN_MODEL_REGISTRY: SovereignModel[] = [
  // ── Strong reasoning ──────────────────────────────────────────────────────
  {
    id:             "llama3.3-70b",
    label:          "Llama 3.3 70B",
    family:         "Llama",
    model_class:    "reasoning",
    tier:           "A",
    adapter_id:     "ollama-local",
    ollama_name:    "llama3.3:70b",
    hf_id:          "meta-llama/Llama-3.3-70B-Instruct",
    context_window: 128000,
    quality:        "elite",
    latency:        "high",
    parameters:     "70B",
    license:        "Llama 3.3 Community License",
    description:    "Meta's flagship instruction model. Strong reasoning, analysis, and synthesis. Primary Lab + School sovereign default when local hardware allows.",
  },
  {
    id:             "qwen2.5-72b",
    label:          "Qwen 2.5 72B",
    family:         "Qwen",
    model_class:    "reasoning",
    tier:           "A",
    adapter_id:     "ollama-local",
    ollama_name:    "qwen2.5:72b",
    hf_id:          "Qwen/Qwen2.5-72B-Instruct",
    context_window: 128000,
    quality:        "elite",
    latency:        "high",
    parameters:     "72B",
    license:        "Apache 2.0",
    description:    "Alibaba's top instruction model. Excellent multilingual reasoning and structured output. Strong Lab reasoning alternative.",
  },
  {
    id:             "llama3.2-3b",
    label:          "Llama 3.2 3B",
    family:         "Llama",
    model_class:    "fast",
    tier:           "A",
    adapter_id:     "ollama-local",
    ollama_name:    "llama3.2:3b",
    hf_id:          "meta-llama/Llama-3.2-3B-Instruct",
    context_window: 128000,
    quality:        "good",
    latency:        "low",
    parameters:     "3B",
    license:        "Llama 3.2 Community License",
    description:    "Smallest Llama 3.2. Runs on any laptop. Used as fast router, School assessment fallback, and proxy-tier behavior driver.",
  },
  // ── Strong coding ─────────────────────────────────────────────────────────
  {
    id:             "qwen2.5-coder-32b",
    label:          "Qwen 2.5 Coder 32B",
    family:         "Qwen",
    model_class:    "coding",
    tier:           "A",
    adapter_id:     "ollama-local",
    ollama_name:    "qwen2.5-coder:32b",
    hf_id:          "Qwen/Qwen2.5-Coder-32B-Instruct",
    context_window: 131072,
    quality:        "elite",
    latency:        "medium",
    parameters:     "32B",
    license:        "Apache 2.0",
    description:    "Best-in-class open coding model. Sovereign default for Creation terminal when local. Competes with GPT-4o on code tasks.",
  },
  {
    id:             "deepseek-coder-v2-16b",
    label:          "DeepSeek Coder V2 16B",
    family:         "DeepSeek",
    model_class:    "coding",
    tier:           "A",
    adapter_id:     "ollama-local",
    ollama_name:    "deepseek-coder-v2:16b",
    hf_id:          "deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct",
    context_window: 163840,
    quality:        "strong",
    latency:        "medium",
    parameters:     "16B",
    license:        "DeepSeek License",
    description:    "Strong coding model with MoE architecture. Lower VRAM than full 32B while maintaining strong code quality. Creation fallback.",
  },
  // ── Embedding / retrieval ─────────────────────────────────────────────────
  {
    id:             "nomic-embed-text",
    label:          "Nomic Embed Text v1.5",
    family:         "Nomic",
    model_class:    "embedding",
    tier:           "A",
    adapter_id:     "ollama-local",
    ollama_name:    "nomic-embed-text:latest",
    hf_id:          "nomic-ai/nomic-embed-text-v1.5",
    context_window: 8192,
    quality:        "strong",
    latency:        "low",
    parameters:     "137M",
    license:        "Apache 2.0",
    description:    "High-quality local text embeddings. Powers Lab semantic search and School memory recall when Supabase pgvector is configured.",
  },
  // ── Tier B: Wrapped free fallback ─────────────────────────────────────────
  {
    id:             "groq-llama3.3-70b",
    label:          "Llama 3.3 70B (Groq)",
    family:         "Llama",
    model_class:    "reasoning",
    tier:           "B",
    adapter_id:     "groq-free",
    ollama_name:    "",
    hf_id:          "meta-llama/Llama-3.3-70B-Instruct",
    context_window: 128000,
    quality:        "elite",
    latency:        "low",
    parameters:     "70B",
    license:        "Llama 3.3 Community License",
    description:    "Llama 3.3 70B served by Groq. Extremely fast. Free tier with rate limits. Tier B — wrapped, non-guaranteed. Good fallback if local Ollama not available.",
  },
  {
    id:             "groq-llama3.2-3b",
    label:          "Llama 3.2 3B (Groq)",
    family:         "Llama",
    model_class:    "fast",
    tier:           "B",
    adapter_id:     "groq-free",
    ollama_name:    "",
    hf_id:          "meta-llama/Llama-3.2-3B-Preview",
    context_window: 8192,
    quality:        "good",
    latency:        "low",
    parameters:     "3B",
    license:        "Llama 3.2 Community License",
    description:    "Ultra-fast free router via Groq. Use as fast-response fallback for School assessments and brief Lab queries. Tier B.",
  },
];

// ─── Chamber sovereign defaults ───────────────────────────────────────────────

export interface ChamberSovereignDefault {
  chamber:         Exclude<Tab, "profile">;
  primary_model_id: string;
  fallback_model_id: string;
  fast_model_id:   string;
  model_class:     RuntimeModelClass;
  rationale:       string;
}

export const CHAMBER_SOVEREIGN_DEFAULTS: ChamberSovereignDefault[] = [
  {
    chamber:           "lab",
    primary_model_id:  "llama3.3-70b",
    fallback_model_id: "groq-llama3.3-70b",
    fast_model_id:     "llama3.2-3b",
    model_class:       "reasoning",
    rationale:         "Lab requires strong multi-step reasoning and evidence synthesis. 70B class models are the sovereign default. Groq Tier B as fallback.",
  },
  {
    chamber:           "school",
    primary_model_id:  "qwen2.5-72b",
    fallback_model_id: "groq-llama3.3-70b",
    fast_model_id:     "groq-llama3.2-3b",
    model_class:       "instruction",
    rationale:         "School requires pedagogic clarity and structured instruction. Qwen 2.5 72B excels at structured synthesis. Fast Groq tier for quick assessments.",
  },
  {
    chamber:           "creation",
    primary_model_id:  "qwen2.5-coder-32b",
    fallback_model_id: "deepseek-coder-v2-16b",
    fast_model_id:     "groq-llama3.3-70b",
    model_class:       "coding",
    rationale:         "Creation terminal requires elite code generation. Qwen 2.5 Coder 32B is sovereign primary. DeepSeek Coder as local fallback. Groq as emergency path.",
  },
];

// ─── Sovereign stack resolver ─────────────────────────────────────────────────

export interface SovereignResolution {
  model:           SovereignModel;
  adapter:         ProviderAdapter;
  tier:            RuntimeTier;
  tier_label:      string;
  tier_color:      string;
  execution_truth: string;          // human-readable: "local · Ollama" etc.
  is_available:    boolean;
}

/** Sentinel adapter returned when no real adapter is available. */
const DEGRADED_ADAPTER: ProviderAdapter = {
  id: "none", kind: "none", tier: "C", label: "Not configured",
  base_url: "", config_key: "", health_path: "",
  requires_key: false, available: false, notes: "",
};

/** Sentinel model returned when the model registry is completely empty. */
const DEGRADED_MODEL: SovereignModel = {
  id: "none", label: "None", family: "none", model_class: "instruction",
  tier: "C", adapter_id: "none", ollama_name: "", hf_id: "",
  context_window: 0, quality: "good", latency: "low",
  parameters: "0B", license: "none", description: "No model available",
};

export function resolveSovereignStack(
  chamber: Exclude<Tab, "profile">,
  prefer_class?: RuntimeModelClass,
): SovereignResolution {
  const defaults = CHAMBER_SOVEREIGN_DEFAULTS.find((d) => d.chamber === chamber);
  const preferredId = defaults?.primary_model_id ?? "llama3.3-70b";
  const preferredClassModelIds = prefer_class
    ? SOVEREIGN_MODEL_REGISTRY.filter((model) => model.model_class === prefer_class).map((model) => model.id)
    : [];

  // Try primary, then fallback, then any available, then any in registry
  const candidates = [
    preferredId,
    defaults?.fallback_model_id,
    defaults?.fast_model_id,
    ...preferredClassModelIds,
  ].filter(Boolean) as string[];

  let model: SovereignModel | undefined;
  let adapter: ProviderAdapter | undefined;

  for (const id of candidates) {
    const m = SOVEREIGN_MODEL_REGISTRY.find((sm) => sm.id === id);
    if (!m) continue;
    const a = PROVIDER_ADAPTERS.find((pa) => pa.id === m.adapter_id);
    if (a) { model = m; adapter = a; break; }
  }

  // Ultimate fallback: first model in registry
  if (!model) {
    model = SOVEREIGN_MODEL_REGISTRY[0];
    if (model) {
      adapter = PROVIDER_ADAPTERS.find((pa) => pa.id === model!.adapter_id) ?? PROVIDER_ADAPTERS[0];
    }
  }

  // Hard fallback: registry is empty — return a degraded proxy resolution
  if (!model) {
    return {
      model:           DEGRADED_MODEL,
      adapter:         DEGRADED_ADAPTER,
      tier:            "C",
      tier_label:      TIER_LABEL["C"],
      tier_color:      TIER_COLOR["C"],
      execution_truth: "proxy · not configured",
      is_available:    false,
    };
  }

  const tier        = model.tier;
  const is_available = adapter?.available ?? false;
  const execution_truth = is_available
    ? `${adapter?.kind ?? "unknown"} · ${model.label}`
    : `${TIER_LABEL[tier]} · not configured`;

  return {
    model,
    adapter:     (adapter ?? DEGRADED_ADAPTER),
    tier,
    tier_label:  TIER_LABEL[tier],
    tier_color:  TIER_COLOR[tier],
    execution_truth,
    is_available,
  };
}

// ─── Per-chamber summary ──────────────────────────────────────────────────────

export function getChamberRuntimeSummary(chamber: Exclude<Tab, "profile">) {
  const resolution  = resolveSovereignStack(chamber);
  const defaults    = CHAMBER_SOVEREIGN_DEFAULTS.find((d) => d.chamber === chamber);
  const primaryModel= SOVEREIGN_MODEL_REGISTRY.find((m) => m.id === defaults?.primary_model_id);
  const fallback    = SOVEREIGN_MODEL_REGISTRY.find((m) => m.id === defaults?.fallback_model_id);
  const fast        = SOVEREIGN_MODEL_REGISTRY.find((m) => m.id === defaults?.fast_model_id);

  return { resolution, primaryModel, fallback, fast, defaults };
}

// ─── Execution truth for chat presence ────────────────────────────────────────

export interface ExecutionTruth {
  tier:        RuntimeTier;
  tier_label:  string;
  tier_color:  string;
  model_label: string;
  adapter_kind: string;
  is_available: boolean;
  chamber:     Exclude<Tab, "profile">;
}

export function getExecutionTruth(chamber: Exclude<Tab, "profile">): ExecutionTruth {
  const r = resolveSovereignStack(chamber);
  return {
    tier:         r.tier,
    tier_label:   r.tier_label,
    tier_color:   r.tier_color,
    model_label:  r.model.label,
    adapter_kind: r.adapter.kind,
    is_available: r.is_available,
    chamber,
  };
}

// ─── Live adapter availability probing ───────────────────────────────────────

/** Ping a single adapter's health endpoint. Returns true only on HTTP 200. */
export async function probeAdapterAvailability(
  adapter: ProviderAdapter,
  signal?: AbortSignal,
): Promise<boolean> {
  if (!adapter.base_url || !adapter.health_path) return false;
  const url = `${adapter.base_url.replace(/\/$/, "")}${adapter.health_path}`;
  try {
    const res = await fetch(url, { method: "GET", signal });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Probe all configured adapters in parallel.
 * Returns updated registry with live `available` values.
 * Use at startup or when settings change.
 */
export async function buildLiveAdapterRegistry(signal?: AbortSignal): Promise<ProviderAdapter[]> {
  const settled = await Promise.allSettled(
    PROVIDER_ADAPTERS.map(async (adapter) => ({
      ...adapter,
      available: await probeAdapterAvailability(adapter, signal),
    }))
  );
  return settled.map((r, i) =>
    r.status === "fulfilled" ? r.value : { ...PROVIDER_ADAPTERS[i], available: false }
  );
}

/**
 * Resolve sovereign stack using live-probed adapter availability.
 * Returns the first adapter that is actually reachable right now.
 */
export async function resolveLiveSovereignStack(
  chamber: Exclude<Tab, "profile">,
  signal?: AbortSignal,
): Promise<SovereignResolution> {
  const liveAdapters = await buildLiveAdapterRegistry(signal);
  const defaults     = CHAMBER_SOVEREIGN_DEFAULTS.find((d) => d.chamber === chamber);
  const candidates   = [
    defaults?.primary_model_id,
    defaults?.fallback_model_id,
    defaults?.fast_model_id,
  ].filter(Boolean) as string[];

  for (const id of candidates) {
    const model   = SOVEREIGN_MODEL_REGISTRY.find((m) => m.id === id);
    if (!model) continue;
    const adapter = liveAdapters.find((a) => a.id === model.adapter_id);
    if (adapter?.available) {
      return {
        model,
        adapter,
        tier:            model.tier,
        tier_label:      TIER_LABEL[model.tier],
        tier_color:      TIER_COLOR[model.tier],
        execution_truth: `${adapter.kind} · ${model.label}`,
        is_available:    true,
      };
    }
  }

  return {
    model:           SOVEREIGN_MODEL_REGISTRY[0] ?? DEGRADED_MODEL,
    adapter:         DEGRADED_ADAPTER,
    tier:            "C",
    tier_label:      TIER_LABEL["C"],
    tier_color:      TIER_COLOR["C"],
    execution_truth: "proxy · no local runtime detected",
    is_available:    false,
  };
}
