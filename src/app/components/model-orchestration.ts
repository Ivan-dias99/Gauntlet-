import { type Tab } from "./shell-types";

export type ChamberTab = "lab" | "school" | "creation";
export type ProviderId =
  | "openai" | "anthropic" | "google" | "runway" | "elevenlabs"
  // Open-source / self-hosted
  | "ollama" | "vllm" | "lmstudio" | "groq";

export type TaskType =
  | "creation_image"
  | "creation_video"
  | "creation_voice"
  | "creation_music"
  | "creation_artifact"
  | "school_tutor"
  | "school_curriculum"
  | "school_assessment"
  | "lab_research"
  | "lab_analysis"
  | "lab_simulation"
  | "lab_code"
  | "lab_audit";

export interface ModelDescriptor {
  id: string;
  label: string;
  family: string;
  provider: ProviderId;
  chamber: ChamberTab;
  latency: "low" | "medium" | "high";
  quality: "good" | "strong" | "elite";
  unavailable?: boolean;
  benchmark: string;
  role: string;
  tags: string[];
}

export const MODEL_REGISTRY: ModelDescriptor[] = [
  // OpenAI
  { id: "gpt-5.4-codex",       label: "GPT 5.4",              family: "GPT",        provider: "openai",      chamber: "lab",      latency: "medium", quality: "elite",  benchmark: "Reasoning & Code",        role: "Primary Commander",          tags: ["research", "code", "audit"] },
  { id: "gpt-5.4-tutor",       label: "GPT 5.4 Tutor",        family: "GPT",        provider: "openai",      chamber: "school",   latency: "medium", quality: "elite",  benchmark: "Didactic & Mastery",       role: "Lead Instructor",            tags: ["teaching", "curriculum", "assessment"] },
  { id: "gpt-5.4-creator",     label: "GPT 5.4 Creator",      family: "GPT",        provider: "openai",      chamber: "creation", latency: "medium", quality: "elite",  benchmark: "Artifact & System Design", role: "Primary Builder",            tags: ["artifact", "design", "docs", "code"] },

  // Anthropic
  { id: "claude-opus-4.6",     label: "Opus 4.6",             family: "Claude",     provider: "anthropic",   chamber: "lab",      latency: "high",   quality: "elite",  benchmark: "Synthesis & Reasoning",    role: "Elite Analyst",              tags: ["analysis", "reasoning", "audit"] },
  { id: "claude-sonnet-4.6",   label: "Sonnet 4.6",           family: "Claude",     provider: "anthropic",   chamber: "lab",      latency: "medium", quality: "strong", benchmark: "Synthesis & Simulation",   role: "Secondary Auditor",          tags: ["analysis", "reasoning", "simulation"] },
  { id: "claude-opus-4.6-sch", label: "Opus 4.6",             family: "Claude",     provider: "anthropic",   chamber: "school",   latency: "high",   quality: "elite",  benchmark: "Deep Curriculum",          role: "Deep Curriculum Architect",  tags: ["didactic", "explanation", "mastery"] },
  { id: "claude-haiku-4.5",    label: "Haiku 4.5",            family: "Claude",     provider: "anthropic",   chamber: "school",   latency: "low",    quality: "good",   benchmark: "Quick Drills & Reflex",    role: "Rapid Assessment Engine",    tags: ["quick tutoring", "assessment", "study drills"] },

  // Google
  { id: "gemini-3.1-pro-high", label: "Gemini 3.1 Pro (High)",family: "Gemini",     provider: "google",      chamber: "lab",      latency: "medium", quality: "elite",  benchmark: "Context & Search",         role: "Matrix Core Insight",        tags: ["research", "synthesis"] },
  { id: "gemini-3.1-pro-low",  label: "Gemini 3.1 Pro (Low)", family: "Gemini",     provider: "google",      chamber: "lab",      latency: "low",    quality: "strong", benchmark: "Fast Orchestration",       role: "Real-time Coordinator",      tags: ["synthesis", "quick research"] },
  { id: "gemini-3.0-flash",    label: "Gemini 3 Flash",       family: "Gemini",     provider: "google",      chamber: "school",   latency: "low",    quality: "good",   benchmark: "Quick Drills & Reflex",    role: "Rapid Support",              tags: ["quick tutoring", "study drills"] },

  // Specialist
  { id: "runway-gen4",         label: "Runway Gen-4",         family: "Runway",     provider: "runway",      chamber: "creation", latency: "high",   quality: "elite",  benchmark: "Video Generation",         role: "Media Specialist",           tags: ["video"] },
  { id: "imagen-4",            label: "Imagen 4",             family: "Imagen",     provider: "google",      chamber: "creation", latency: "medium", quality: "strong", benchmark: "Image Generation",         role: "Visual Specialist",          tags: ["image", "design"] },
  { id: "elevenlabs-studio",   label: "11Labs Studio",        family: "ElevenLabs", provider: "elevenlabs",  chamber: "creation", latency: "low",    quality: "strong", benchmark: "Voice Generation",         role: "Audio Specialist",           tags: ["voice", "audio", "music"], unavailable: true },

  // ── Open-source: Ollama (Tier A local) ───────────────────────────────────────
  { id: "llama3.3:70b",          label: "Llama 3.3 70B",          family: "Llama",     provider: "ollama",   chamber: "lab",      latency: "high",   quality: "elite",  benchmark: "Reasoning & Analysis",     role: "Sovereign Lab Analyst",      tags: ["research", "reasoning", "analysis"] },
  { id: "llama3.3:70b-school",   label: "Llama 3.3 70B",          family: "Llama",     provider: "ollama",   chamber: "school",   latency: "high",   quality: "elite",  benchmark: "Deep Instruction",         role: "Sovereign Tutor",            tags: ["teaching", "curriculum"] },
  { id: "llama3.3:70b-creation", label: "Llama 3.3 70B",          family: "Llama",     provider: "ollama",   chamber: "creation", latency: "high",   quality: "elite",  benchmark: "Code & Artifact",          role: "Sovereign Builder",          tags: ["artifact", "code"] },
  { id: "qwen2.5:72b",           label: "Qwen 2.5 72B",           family: "Qwen",      provider: "ollama",   chamber: "lab",      latency: "high",   quality: "elite",  benchmark: "Multilingual Reasoning",   role: "Sovereign Analyst",          tags: ["research", "analysis"] },
  { id: "qwen2.5-coder:32b",     label: "Qwen 2.5 Coder 32B",    family: "Qwen",      provider: "ollama",   chamber: "creation", latency: "medium", quality: "elite",  benchmark: "Elite Code Generation",    role: "Sovereign Code Forge",       tags: ["code", "artifact", "build"] },
  { id: "deepseek-coder-v2:16b", label: "DeepSeek Coder V2 16B", family: "DeepSeek",  provider: "ollama",   chamber: "creation", latency: "medium", quality: "strong", benchmark: "Code Generation (MoE)",    role: "Code Specialist",            tags: ["code", "build"] },
  { id: "llama3.2:3b",           label: "Llama 3.2 3B",           family: "Llama",     provider: "ollama",   chamber: "school",   latency: "low",    quality: "good",   benchmark: "Fast Assessment",          role: "Quick Drill Engine",         tags: ["quick tutoring", "assessment"] },

  // ── Open-source: vLLM (Tier A self-hosted OpenAI-compat) ─────────────────────
  { id: "vllm-default",          label: "vLLM Model",             family: "vLLM",      provider: "vllm",     chamber: "lab",      latency: "medium", quality: "strong", benchmark: "Self-Hosted Inference",    role: "Self-Hosted Analyst",        tags: ["research", "analysis"] },
  { id: "vllm-code",             label: "vLLM Model",             family: "vLLM",      provider: "vllm",     chamber: "creation", latency: "medium", quality: "strong", benchmark: "Self-Hosted Code",         role: "Self-Hosted Builder",        tags: ["code", "build"] },
  { id: "vllm-school",           label: "vLLM Model",             family: "vLLM",      provider: "vllm",     chamber: "school",   latency: "medium", quality: "strong", benchmark: "Self-Hosted Instruction",  role: "Self-Hosted Tutor",          tags: ["teaching"] },

  // ── Open-source: LM Studio (Tier A local OpenAI-compat) ──────────────────────
  { id: "lmstudio-default",      label: "LM Studio Model",        family: "LM Studio", provider: "lmstudio", chamber: "lab",      latency: "medium", quality: "strong", benchmark: "Local Studio Inference",   role: "Studio Analyst",             tags: ["research", "analysis"] },
  { id: "lmstudio-code",         label: "LM Studio Model",        family: "LM Studio", provider: "lmstudio", chamber: "creation", latency: "medium", quality: "strong", benchmark: "Local Studio Code",        role: "Studio Builder",             tags: ["code", "build"] },
  { id: "lmstudio-school",       label: "LM Studio Model",        family: "LM Studio", provider: "lmstudio", chamber: "school",   latency: "medium", quality: "strong", benchmark: "Local Studio Instruction", role: "Studio Tutor",               tags: ["teaching"] },

  // ── Open-source: Groq (Tier B cloud fast inference) ──────────────────────────
  { id: "groq-llama3.3-70b",     label: "Llama 3.3 70B (Groq)",  family: "Llama",     provider: "groq",     chamber: "lab",      latency: "low",    quality: "elite",  benchmark: "Ultra-Fast Reasoning",     role: "Groq Analyst",               tags: ["research", "reasoning", "fast"] },
  { id: "groq-llama3.3-70b-sch", label: "Llama 3.3 70B (Groq)",  family: "Llama",     provider: "groq",     chamber: "school",   latency: "low",    quality: "elite",  benchmark: "Ultra-Fast Instruction",   role: "Groq Tutor",                 tags: ["teaching", "fast"] },
  { id: "groq-llama3.3-70b-cre", label: "Llama 3.3 70B (Groq)",  family: "Llama",     provider: "groq",     chamber: "creation", latency: "low",    quality: "elite",  benchmark: "Ultra-Fast Build",         role: "Groq Builder",               tags: ["code", "build", "fast"] },
  { id: "groq-llama3.2-3b",      label: "Llama 3.2 3B (Groq)",   family: "Llama",     provider: "groq",     chamber: "school",   latency: "low",    quality: "good",   benchmark: "Fastest Drill",            role: "Groq Assessment Engine",     tags: ["assessment", "fast"] },
];

export const CHAMBER_TASKS: Record<ChamberTab, TaskType[]> = {
  creation: ["creation_artifact", "creation_image", "creation_video", "creation_voice", "creation_music"],
  school:   ["school_tutor", "school_curriculum", "school_assessment"],
  lab:      ["lab_research", "lab_analysis", "lab_simulation", "lab_code", "lab_audit"],
};

export const TASK_LABELS: Record<TaskType, string> = {
  creation_image:    "Image Forge",
  creation_video:    "Video Forge",
  creation_voice:    "Voice Forge",
  creation_music:    "Music Forge",
  creation_artifact: "Artifact Build",
  school_tutor:      "Tutor Session",
  school_curriculum: "Curriculum Plan",
  school_assessment: "Mastery Check",
  lab_research:      "Research",
  lab_analysis:      "Analysis",
  lab_simulation:    "Simulation",
  lab_code:          "Code",
  lab_audit:         "Audit",
};

export const DEFAULT_TASK_BY_CHAMBER: Record<ChamberTab, TaskType> = {
  creation: "creation_artifact",
  school:   "school_tutor",
  lab:      "lab_analysis",
};

export const CHAMBER_EXECUTION_MAP: Record<ChamberTab, { focus: string[]; fastFallbackTask: TaskType }> = {
  lab:      { focus: ["reasoning", "analysis", "research", "audit"], fastFallbackTask: "lab_analysis" },
  school:   { focus: ["tutor", "synthesis", "curriculum"],           fastFallbackTask: "school_tutor" },
  creation: { focus: ["build", "code", "artifact", "drafting"],      fastFallbackTask: "creation_artifact" },
};



export const DEFAULT_MODEL_BY_TASK: Record<TaskType, string> = {
  creation_artifact: "gpt-5.4-creator",
  creation_image:    "imagen-4",
  creation_video:    "runway-gen4",
  creation_voice:    "elevenlabs-studio",
  creation_music:    "elevenlabs-studio",
  school_tutor:      "gpt-5.4-tutor",
  school_curriculum: "claude-opus-4.6-sch",
  school_assessment: "claude-haiku-4.5",
  lab_research:      "gemini-3.1-pro-high",
  lab_analysis:      "claude-sonnet-4.6",
  lab_simulation:    "claude-sonnet-4.6",
  lab_code:          "gpt-5.4-codex",
  lab_audit:         "claude-opus-4.6",
};

export const FALLBACK_CHAIN_BY_TASK: Record<TaskType, string[]> = {
  creation_artifact: ["gpt-5.4-creator", "gemini-3.1-pro-high"],
  creation_image:    ["imagen-4", "gpt-5.4-creator"],
  creation_video:    ["runway-gen4", "gpt-5.4-creator"],
  creation_voice:    ["elevenlabs-studio", "gpt-5.4-creator"],
  creation_music:    ["elevenlabs-studio", "gpt-5.4-creator"],
  school_tutor:      ["gpt-5.4-tutor", "gemini-3.1-pro-low"],
  school_curriculum: ["claude-opus-4.6-sch", "gpt-5.4-tutor"],
  school_assessment: ["claude-haiku-4.5", "gemini-3.0-flash"],
  lab_research:      ["gemini-3.1-pro-high", "gpt-5.4-codex"],
  lab_analysis:      ["claude-sonnet-4.6", "gemini-3.1-pro-high"],
  lab_simulation:    ["claude-sonnet-4.6", "gpt-5.4-codex"],
  lab_code:          ["gpt-5.4-codex", "claude-sonnet-4.6"],
  lab_audit:         ["claude-opus-4.6", "gpt-5.4-codex"],
};

export function getModelPool(chamber: ChamberTab): ModelDescriptor[] {
  return MODEL_REGISTRY.filter((m) => m.chamber === chamber);
}

export function resolveExecutionPlan(chamber: ChamberTab, task: TaskType, requestedModelId?: string) {
  const pool      = getModelPool(chamber);
  const preferred = requestedModelId ?? DEFAULT_MODEL_BY_TASK[task];
  const chain     = [preferred, ...FALLBACK_CHAIN_BY_TASK[task]].filter((id, i, all) => id && all.indexOf(id) === i);
  const selected  = chain.map((id) => pool.find((m) => m.id === id)).find((m) => m && !m.unavailable)
    ?? pool.find((m) => !m.unavailable) ?? pool[0];
  const fallbackUsed   = !!selected && selected.id !== preferred;
  const fallbackReason = fallbackUsed ? "requested model unavailable; routed to " + (selected?.label ?? "") : undefined;
  return { selectedModel: selected, fallbackChain: chain, fallbackReason };
}
