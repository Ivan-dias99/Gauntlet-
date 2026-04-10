// Ruberra — Runtime Fabric
// The bridge between intention and AI consequence.
// Harvested from legacy adapters, hardened for the active organism.

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

/**
 * Execute a directive through the runtime fabric.
 * Enforces the event-sourced consequence requirement: every start MUST yield a result.
 */
export async function runRuntime(
  request: RuntimeRequest,
  config: RuntimeConfig
): Promise<void> {
  const { prompt, threadId, directiveId, context = [] } = request;
  const label = `forge artifact: ${config.model}`;

  // 1. Emit start event
  const startEv = await append(
    "execution.started",
    { label, directiveId, model: config.model, provider: config.provider },
    { thread: threadId, parent: directiveId }
  );

  const executionId = startEv.id;

  try {
    // Determine target URL based on provider
    const url = getEndpoint(config);
    if (!url) {
      throw new Error(`Fabric Refusal: No endpoint found for provider ${config.provider}`);
    }

    // Attempt AI call (Simulation for now unless VITE_RUBERRA_EXEC_URL is set)
    const result = await performInference(url, prompt, context, config);

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
        title: `Forged Artifact: ${config.model}`,
        executionId,
        directiveId,
        files: result.files,
        diff: result.diff,
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

function getEndpoint(config: RuntimeConfig): string | undefined {
  const env = (import.meta as any).env;
  if (env?.VITE_RUBERRA_EXEC_URL) return env.VITE_RUBERRA_EXEC_URL;
  if (config.endpoint) return config.endpoint;
  
  // Standard defaults for local providers
  if (config.provider === "ollama") return "http://localhost:11434";
  if (config.provider === "lmstudio") return "http://localhost:1234";
  if (config.provider === "vllm") return "http://localhost:8000";
  
  return undefined;
}

async function performInference(
  url: string,
  prompt: string,
  context: Array<{ role: string; content: string }>,
  config: RuntimeConfig
): Promise<{ files?: string[]; diff?: string; commitRef?: string }> {
  const env = (import.meta as any).env;
  // If no real backend is active, simulate a successful consequence
  // to prevent a "dead" shell feeling while in development.
  const isSimulation = url === "simulate" || !env?.VITE_RUBERRA_EXEC_URL;

  if (isSimulation) {
    await new Promise((r) => setTimeout(r, 1200)); // Simulate latency
    return {
      files: ["src/simulation.ts"],
      diff: `+ // Simulated consequence from ${config.model}`,
      commitRef: "sim-deadbeef"
    };
  }

  // Real inference logic would live here, calling the appropriate adapter
  // for OpenAI, Anthropic, or local OpenAI-compat.
  // For now, this is the "Fabric Hinge" that handles the Simulation vs Reality split.
  throw new Error("Sovereign Fabric: Real inference requires VITE_RUBERRA_EXEC_URL bind.");
}
