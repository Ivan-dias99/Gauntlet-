import { type Tab } from "./shell-types";
export type ChamberTab = Exclude<Tab, "profile">;

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
  provider: ProviderId;
  chamber: ChamberTab;
  latency: "low" | "medium" | "high";
  quality: "good" | "strong" | "elite";
  unavailable?: boolean;
  tags: string[];
}

export const MODEL_REGISTRY: ModelDescriptor[] = [
  { id: "gpt-5.3-codex", label: "GPT-5.3 Codex", provider: "openai", chamber: "lab", latency: "medium", quality: "elite", tags: ["research", "code", "audit"] },
  { id: "claude-sonnet-5", label: "Claude Sonnet 5", provider: "anthropic", chamber: "lab", latency: "medium", quality: "strong", tags: ["analysis", "reasoning", "simulation"] },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", provider: "google", chamber: "lab", latency: "low", quality: "strong", tags: ["research", "synthesis"] },

  { id: "gpt-5.3-tutor", label: "GPT-5.3 Tutor", provider: "openai", chamber: "school", latency: "medium", quality: "elite", tags: ["teaching", "curriculum", "assessment"] },
  { id: "claude-opus-4.5", label: "Claude Opus 4.5", provider: "anthropic", chamber: "school", latency: "high", quality: "elite", tags: ["didactic", "explanation", "mastery"] },
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", provider: "google", chamber: "school", latency: "low", quality: "good", tags: ["quick tutoring", "study drills"] },

  { id: "gpt-5.3-creator", label: "GPT-5.3 Creator", provider: "openai", chamber: "creation", latency: "medium", quality: "elite", tags: ["artifact", "design", "docs", "code"] },
  { id: "runway-gen4", label: "Runway Gen-4", provider: "runway", chamber: "creation", latency: "high", quality: "elite", tags: ["video"] },
  { id: "imagen-4", label: "Imagen 4", provider: "google", chamber: "creation", latency: "medium", quality: "strong", tags: ["image", "design"] },
  { id: "elevenlabs-studio", label: "ElevenLabs Studio", provider: "elevenlabs", chamber: "creation", latency: "low", quality: "strong", tags: ["voice", "audio", "music"], unavailable: true },
];

export const CHAMBER_TASKS: Record<ChamberTab, TaskType[]> = {
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

export const DEFAULT_TASK_BY_CHAMBER: Record<ChamberTab, TaskType> = {
  creation: "creation_artifact",
  school: "school_tutor",
  lab: "lab_analysis",
};

export const CHAMBER_EXECUTION_MAP: Record<ChamberTab, { focus: string[]; fastFallbackTask: TaskType }> = {
  lab: { focus: ["reasoning", "analysis", "research", "audit"], fastFallbackTask: "lab_analysis" },
  school: { focus: ["tutor", "synthesis", "curriculum"], fastFallbackTask: "school_tutor" },
  creation: { focus: ["build", "code", "artifact", "drafting"], fastFallbackTask: "creation_artifact" },
};

export const DEFAULT_MODEL_BY_TASK: Record<TaskType, string> = {
  creation_artifact: "gpt-5.3-creator",
  creation_image: "imagen-4",
  creation_video: "runway-gen4",
  creation_voice: "elevenlabs-studio",
  creation_music: "elevenlabs-studio",
  school_tutor: "gpt-5.3-tutor",
  school_curriculum: "claude-opus-4.5",
  school_assessment: "gpt-5.3-tutor",
  lab_research: "gpt-5.3-codex",
  lab_analysis: "claude-sonnet-5",
  lab_simulation: "claude-sonnet-5",
  lab_code: "gpt-5.3-codex",
  lab_audit: "gpt-5.3-codex",
};

export const FALLBACK_CHAIN_BY_TASK: Record<TaskType, string[]> = {
  creation_artifact: ["gpt-5.3-creator", "imagen-4"],
  creation_image: ["imagen-4", "gpt-5.3-creator"],
  creation_video: ["runway-gen4", "gpt-5.3-creator"],
  creation_voice: ["elevenlabs-studio", "gpt-5.3-creator"],
  creation_music: ["elevenlabs-studio", "gpt-5.3-creator"],
  school_tutor: ["gpt-5.3-tutor", "claude-opus-4.5", "gemini-2.5-flash"],
  school_curriculum: ["claude-opus-4.5", "gpt-5.3-tutor"],
  school_assessment: ["gpt-5.3-tutor", "gemini-2.5-flash"],
  lab_research: ["gpt-5.3-codex", "gemini-2.5-pro", "claude-sonnet-5"],
  lab_analysis: ["claude-sonnet-5", "gpt-5.3-codex"],
  lab_simulation: ["claude-sonnet-5", "gpt-5.3-codex"],
  lab_code: ["gpt-5.3-codex", "claude-sonnet-5"],
  lab_audit: ["gpt-5.3-codex", "claude-sonnet-5", "gemini-2.5-pro"],
};

export function getModelPool(chamber: ChamberTab): ModelDescriptor[] {
  return MODEL_REGISTRY.filter((m) => m.chamber === chamber);
}

export function resolveExecutionPlan(chamber: ChamberTab, task: TaskType, requestedModelId?: string) {
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
