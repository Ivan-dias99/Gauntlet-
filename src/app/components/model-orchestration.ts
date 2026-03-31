import { type Tab } from "./shell-types";

export type ProviderId = "openai" | "anthropic" | "google" | "runway" | "elevenlabs";

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
  latency: "low" | "medium" | "high";
  quality: "good" | "strong" | "elite";
  unavailable?: boolean;
  benchmark: string;
  role: string;
}

export const MODEL_REGISTRY: ModelDescriptor[] = [
  // OpenAI
  { id: "gpt-5.4-codex", label: "GPT 5.4", family: "GPT", provider: "openai", latency: "medium", quality: "elite", benchmark: "Reasoning & Code", role: "Primary Commander" },
  { id: "gpt-5.4-tutor", label: "GPT 5.4 Tutor", family: "GPT", provider: "openai", latency: "medium", quality: "elite", benchmark: "Didactic & Mastery", role: "Lead Instructor" },
  { id: "gpt-5.4-creator", label: "GPT 5.4 Creator", family: "GPT", provider: "openai", latency: "medium", quality: "elite", benchmark: "Artifact & System Design", role: "Primary Builder" },
  
  // Anthropic
  { id: "claude-sonnet-5.0", label: "Sonnet 5.0", family: "Claude", provider: "anthropic", latency: "medium", quality: "strong", benchmark: "Synthesis & Simulation", role: "Secondary Auditor" },
  { id: "claude-opus-4.6", label: "Opus 4.6", family: "Claude", provider: "anthropic", latency: "high", quality: "elite", benchmark: "Deep Curriculum", role: "Deep Curriculum Architect" },

  // Google
  { id: "gemini-3.1-pro-high", label: "Gemini 3.1 Pro (High)", family: "Gemini", provider: "google", latency: "medium", quality: "elite", benchmark: "Context & Search", role: "Matrix Core Insight" },
  { id: "gemini-3.1-pro-low", label: "Gemini 3.1 Pro (Low)", family: "Gemini", provider: "google", latency: "low", quality: "strong", benchmark: "Fast Orchestration", role: "Real-time Coordinator" },
  { id: "gemini-3.0-flash", label: "Gemini 3 Flash", family: "Gemini", provider: "google", latency: "low", quality: "good", benchmark: "Quick Drills & Reflex", role: "Rapid Support" },

  // Specialist
  { id: "runway-gen4", label: "Runway Gen-4", family: "Runway", provider: "runway", latency: "high", quality: "elite", benchmark: "Video Generation", role: "Media Specialist" },
  { id: "imagen-4", label: "Imagen 4", family: "Imagen", provider: "google", latency: "medium", quality: "strong", benchmark: "Image Generation", role: "Visual Specialist" },
  { id: "elevenlabs-studio", label: "11Labs Studio", family: "ElevenLabs", provider: "elevenlabs", latency: "low", quality: "strong", benchmark: "Voice Generation", role: "Audio Specialist", unavailable: true },
];

export const CHAMBER_TASKS: Record<Tab, TaskType[]> = {
  creation: ["creation_artifact", "creation_image", "creation_video", "creation_voice", "creation_music"],
  school: ["school_tutor", "school_curriculum", "school_assessment"],
  lab: ["lab_research", "lab_analysis", "lab_simulation", "lab_code", "lab_audit"],
};

export const TASK_LABELS: Record<TaskType, string> = {
  creation_image: "Image Forge",
  creation_video: "Video Forge",
  creation_voice: "Voice Forge",
  creation_music: "Music Forge",
  creation_artifact: "Artifact Build",
  school_tutor: "Tutor Session",
  school_curriculum: "Curriculum Plan",
  school_assessment: "Mastery Check",
  lab_research: "Research",
  lab_analysis: "Analysis",
  lab_simulation: "Simulation",
  lab_code: "Code",
  lab_audit: "Audit",
};

export const DEFAULT_TASK_BY_CHAMBER: Record<Tab, TaskType> = {
  creation: "creation_artifact",
  school: "school_tutor",
  lab: "lab_analysis",
};

export const DEFAULT_MODEL_BY_TASK: Record<TaskType, string> = {
  creation_artifact: "gpt-5.4-creator",
  creation_image: "imagen-4",
  creation_video: "runway-gen4",
  creation_voice: "elevenlabs-studio",
  creation_music: "elevenlabs-studio",
  school_tutor: "gpt-5.4-tutor",
  school_curriculum: "claude-opus-4.6",
  school_assessment: "gemini-3.0-flash",
  lab_research: "gemini-3.1-pro-high",
  lab_analysis: "claude-sonnet-5.0",
  lab_simulation: "claude-sonnet-5.0",
  lab_code: "gpt-5.4-codex",
  lab_audit: "gpt-5.4-codex",
};

export const FALLBACK_CHAIN_BY_TASK: Record<TaskType, string[]> = {
  creation_artifact: ["gpt-5.4-creator", "gemini-3.1-pro-high"],
  creation_image: ["imagen-4", "gpt-5.4-creator"],
  creation_video: ["runway-gen4", "gpt-5.4-creator"],
  creation_voice: ["elevenlabs-studio", "gpt-5.4-creator"],
  creation_music: ["elevenlabs-studio", "gpt-5.4-creator"],
  school_tutor: ["gpt-5.4-tutor", "gemini-3.1-pro-low"],
  school_curriculum: ["claude-opus-4.6", "gpt-5.4-tutor"],
  school_assessment: ["gemini-3.0-flash", "gpt-5.4-tutor"],
  lab_research: ["gemini-3.1-pro-high", "gpt-5.4-codex"],
  lab_analysis: ["claude-sonnet-5.0", "gemini-3.1-pro-high"],
  lab_simulation: ["claude-sonnet-5.0", "gpt-5.4-codex"],
  lab_code: ["gpt-5.4-codex", "claude-sonnet-5.0"],
  lab_audit: ["gpt-5.4-codex", "gemini-3.1-pro-high"],
};

export function getModelPool(_chamber: Tab): ModelDescriptor[] {
  // All models are available in the matrix pool, selection depends on user assignment.
  return MODEL_REGISTRY;
}

export function resolveExecutionPlan(chamber: Tab, task: TaskType, requestedModelId?: string) {
  const pool = getModelPool(chamber);
  const preferred = requestedModelId ?? DEFAULT_MODEL_BY_TASK[task];
  const chain = [preferred, ...FALLBACK_CHAIN_BY_TASK[task]].filter((id, i, all) => id && all.indexOf(id) === i);

  const selected = chain
    .map((id) => pool.find((m) => m.id === id))
    .find((m) => m && !m.unavailable)
    ?? pool.find((m) => !m.unavailable)
    ?? pool[0];

  const fallbackUsed = !!selected && selected.id !== preferred;
  const fallbackReason = fallbackUsed ? `requested model unavailable; routed to ${selected?.label}` : undefined;

  return {
    selectedModel: selected,
    fallbackChain: chain,
    fallbackReason,
  };
}
