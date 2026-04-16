// Ruberra — Runtime Fabric
// The bridge between intention and AI consequence.
// Real inference adapters for OpenAI, Anthropic, Ollama, and OpenAI-compatible providers.

import { RuberraEvent } from "./events";
import { append } from "./eventLog";

export type ExecutionProvider =
  | "openai"
  | "anthropic"
  | "google"
  | "ollama"
  | "vllm"
  | "lmstudio"
  | "groq";

export interface RuntimeConfig {
  endpoint?: string;
  apiKey?: string;
  provider: ExecutionProvider;
  model: string;
}

export interface RuntimeRequest {
  prompt: string;
  threadId: string;
  directiveId: string;
  context?: Array<{ role: string; content: string }>;
}

export interface InferenceResult {
  content: string;
  files?: string[];
  diff?: string;
  commitRef?: string;
  usage?: { promptTokens: number; completionTokens: number };
}

// ── Persistent runtime config (survives page navigation, not reload) ────────
let _activeConfig: RuntimeConfig | null = null;

export function setRuntimeConfig(config: RuntimeConfig) {
  _activeConfig = config;
  try {
    localStorage.setItem("ruberra:runtime-config", JSON.stringify(config));
  } catch {}
}

export function getRuntimeConfig(): RuntimeConfig | null {
  if (_activeConfig) return _activeConfig;
  try {
    const stored = localStorage.getItem("ruberra:runtime-config");
    if (stored) {
      _activeConfig = JSON.parse(stored);
      return _activeConfig;
    }
  } catch {}
  return null;
}

export function clearRuntimeConfig() {
  _activeConfig = null;
  try { localStorage.removeItem("ruberra:runtime-config"); } catch {}
}

/**
 * Execute a directive through the runtime fabric.
 * Enforces the event-sourced consequence requirement: every start MUST yield a result.
 */
export async function runRuntime(
  request: RuntimeRequest,
  config?: RuntimeConfig
): Promise<void> {
  const resolved = config ?? getRuntimeConfig();
  if (!resolved) {
    // No config at all — use simulation
    return runSimulation(request);
  }

  const { prompt, threadId, directiveId, context = [] } = request;
  const label = `forge artifact: ${resolved.model}`;

  // 1. Emit start event
  const startEv = await append(
    "execution.started",
    { label, directiveId, model: resolved.model, provider: resolved.provider },
    { thread: threadId, parent: directiveId }
  );

  const executionId = startEv.id;

  try {
    const url = getEndpoint(resolved);
    if (!url) {
      throw new Error(`Fabric Refusal: No endpoint resolved for provider ${resolved.provider}`);
    }

    // Real inference
    const result = await performInference(url, prompt, context, resolved);

    // 2. Emit success
    await append(
      "execution.succeeded",
      { executionId },
      { thread: threadId, parent: executionId }
    );

    // 3. Emit artifact generation
    await append(
      "artifact.generated",
      {
        title: `${resolved.model}: ${prompt.slice(0, 60)}${prompt.length > 60 ? "…" : ""}`,
        executionId,
        directiveId,
        files: result.files,
        diff: result.content,
        commitRef: result.commitRef
      },
      { thread: threadId, parent: executionId }
    );
  } catch (err: any) {
    // 2. Emit failure
    await append(
      "execution.failed",
      { executionId, reason: err.message || "unknown_failure" },
      { thread: threadId, parent: executionId }
    );
  }
}

/** Simulation fallback — no API key needed, deterministic fake response */
async function runSimulation(request: RuntimeRequest): Promise<void> {
  const { prompt, threadId, directiveId } = request;

  const startEv = await append(
    "execution.started",
    { label: "simulation: no provider configured", directiveId, model: "simulation", provider: "simulation" },
    { thread: threadId, parent: directiveId }
  );

  const executionId = startEv.id;

  await new Promise((r) => setTimeout(r, 800));

  await append(
    "execution.succeeded",
    { executionId },
    { thread: threadId, parent: executionId }
  );

  await append(
    "artifact.generated",
    {
      title: `[simulation] ${prompt.slice(0, 50)}`,
      executionId,
      directiveId,
      diff: `// Simulated consequence — configure a provider in Settings to get real AI inference.\n// Directive: ${prompt.slice(0, 120)}`,
      commitRef: "sim-" + Date.now().toString(36)
    },
    { thread: threadId, parent: executionId }
  );
}

// ── Endpoint Resolution ─────────────────────────────────────────────────────

function getEndpoint(config: RuntimeConfig): string | undefined {
  if (config.endpoint) return config.endpoint;

  switch (config.provider) {
    case "openai":   return "https://api.openai.com/v1/chat/completions";
    case "anthropic": return "https://api.anthropic.com/v1/messages";
    case "google":   return "https://generativelanguage.googleapis.com/v1beta";
    case "ollama":   return "http://localhost:11434/v1/chat/completions";
    case "lmstudio": return "http://localhost:1234/v1/chat/completions";
    case "vllm":     return "http://localhost:8000/v1/chat/completions";
    case "groq":     return "https://api.groq.com/openai/v1/chat/completions";
    default:         return undefined;
  }
}

// ── Real Inference Engine ───────────────────────────────────────────────────

async function performInference(
  url: string,
  prompt: string,
  context: Array<{ role: string; content: string }>,
  config: RuntimeConfig
): Promise<InferenceResult> {
  if (config.provider === "anthropic") {
    return callAnthropic(url, prompt, context, config);
  }
  // OpenAI, Ollama, vLLM, LMStudio, Groq all use OpenAI-compatible API
  return callOpenAICompatible(url, prompt, context, config);
}

// ── OpenAI-Compatible Adapter ───────────────────────────────────────────────
// Works for: OpenAI, Ollama, vLLM, LMStudio, Groq, and any OpenAI-compat endpoint

async function callOpenAICompatible(
  url: string,
  prompt: string,
  context: Array<{ role: string; content: string }>,
  config: RuntimeConfig
): Promise<InferenceResult> {
  const messages = [
    ...context.map(m => ({ role: m.role, content: m.content })),
    {
      role: "system" as const,
      content: "You are Ruberra's execution engine. Given a directive, produce the code changes, analysis, or artifact requested. Be precise and actionable. Output the result directly — no preamble."
    },
    { role: "user" as const, content: prompt }
  ];

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (config.apiKey) {
    headers["Authorization"] = `Bearer ${config.apiKey}`;
  }

  const body: Record<string, unknown> = {
    model: config.model,
    messages,
    temperature: 0.3,
    max_tokens: 4096,
  };

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(`${config.provider} API error ${res.status}: ${errorBody.slice(0, 200)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "";
  const usage = data.usage ? {
    promptTokens: data.usage.prompt_tokens ?? 0,
    completionTokens: data.usage.completion_tokens ?? 0,
  } : undefined;

  return parseInferenceContent(content, usage);
}

// ── Anthropic Adapter ───────────────────────────────────────────────────────

async function callAnthropic(
  url: string,
  prompt: string,
  context: Array<{ role: string; content: string }>,
  config: RuntimeConfig
): Promise<InferenceResult> {
  if (!config.apiKey) {
    throw new Error("Anthropic API requires an API key");
  }

  // Build messages — Anthropic format: alternating user/assistant
  const anthropicMessages: Array<{ role: "user" | "assistant"; content: string }> = [];

  for (const msg of context) {
    const role = msg.role === "assistant" ? "assistant" : "user";
    anthropicMessages.push({ role, content: msg.content });
  }
  anthropicMessages.push({ role: "user", content: prompt });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 4096,
      system: "You are Ruberra's execution engine. Given a directive, produce the code changes, analysis, or artifact requested. Be precise and actionable. Output the result directly — no preamble.",
      messages: anthropicMessages,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(`Anthropic API error ${res.status}: ${errorBody.slice(0, 200)}`);
  }

  const data = await res.json();
  const content = data.content?.[0]?.text ?? "";
  const usage = data.usage ? {
    promptTokens: data.usage.input_tokens ?? 0,
    completionTokens: data.usage.output_tokens ?? 0,
  } : undefined;

  return parseInferenceContent(content, usage);
}

// ── Response Parser ─────────────────────────────────────────────────────────
// Extracts structured artifact data from raw AI response content.

function parseInferenceContent(
  content: string,
  usage?: { promptTokens: number; completionTokens: number }
): InferenceResult {
  // Try to extract file references from the content
  const filePattern = /(?:^|\n)(?:[\-+]{3}|File:|Modified:|Created:)\s*[`"']?([^\s`"'\n]+\.\w+)/gm;
  const files: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = filePattern.exec(content)) !== null) {
    const file = match[1];
    if (file && !files.includes(file)) files.push(file);
  }

  // If content has diff-like patterns, treat it as a diff
  const hasDiffMarkers = /^[+-]{3}\s|^@@\s/m.test(content);
  const diff = hasDiffMarkers ? content : undefined;

  return {
    content,
    files: files.length > 0 ? files : undefined,
    diff: diff ?? content,
    usage,
  };
}
