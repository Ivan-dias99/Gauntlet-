/**
 * RUBERRA Connector Registry
 * Typed connector objects: real system integrations with honest status.
 * No fake "live" claims. Status is truthful.
 */

import { type Tab } from "./shell-types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ConnectorCategory =
  | "code"
  | "deployment"
  | "storage"
  | "design"
  | "knowledge"
  | "communication"
  | "automation"
  | "media"
  | "data"
  | "ai";

export type ConnectorStatus =
  | "connected"      // live and configured
  | "available"      // can be connected, not yet configured
  | "coming_soon"    // planned, not yet available
  | "disconnected";  // was connected, now inactive

export type ConnectorCapability = "read" | "write" | "sync" | "export" | "deploy" | "search";

export interface ConnectorDefinition {
  id:           string;
  name:         string;
  category:     ConnectorCategory;
  description:  string;
  organs:       Exclude<Tab, "profile">[];
  capabilities: ConnectorCapability[];
  status:       ConnectorStatus;
  quick_actions: { label: string; description: string }[];
  icon_char:    string;   // single-char or emoji for visual identification
  accent:       string;
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const CONNECTOR_REGISTRY: ConnectorDefinition[] = [
  // ── Code ──────────────────────────────────────────────────────────────────
  {
    id:           "github",
    name:         "GitHub",
    category:     "code",
    description:  "Read repos, push commits, open PRs, reference code context in Lab and Creation.",
    organs:       ["lab", "creation"],
    capabilities: ["read", "write", "sync", "export"],
    status:       "available",
    quick_actions: [
      { label: "Browse repos",    description: "Load a repo into Lab analysis context" },
      { label: "Commit artifact", description: "Push a Creation output to a branch" },
      { label: "Open PR",         description: "Initiate a pull request from a build" },
    ],
    icon_char: "◈",
    accent:    "#1a1a1a",
  },

  // ── Deployment ────────────────────────────────────────────────────────────
  {
    id:           "vercel",
    name:         "Vercel",
    category:     "deployment",
    description:  "Deploy Creation artifacts directly to Vercel previews and production.",
    organs:       ["creation"],
    capabilities: ["deploy", "sync"],
    status:       "available",
    quick_actions: [
      { label: "Deploy preview",    description: "Push current artifact to a Vercel preview URL" },
      { label: "Check deployment",  description: "Retrieve latest deploy status" },
    ],
    icon_char: "▲",
    accent:    "#000000",
  },
  {
    id:           "supabase",
    name:         "Supabase",
    category:     "data",
    description:  "Query tables, run functions, read storage — directly connected to Ruberra backend.",
    organs:       ["lab", "creation"],
    capabilities: ["read", "write", "sync"],
    status:       "connected",
    quick_actions: [
      { label: "Query table",     description: "Run a SQL query from Lab" },
      { label: "Read edge logs",  description: "Inspect function logs from Creation" },
      { label: "Browse storage",  description: "Access file storage from context" },
    ],
    icon_char: "⬡",
    accent:    "#3ecf8e",
  },

  // ── Design ────────────────────────────────────────────────────────────────
  {
    id:           "figma",
    name:         "Figma",
    category:     "design",
    description:  "Import frames, component specs, and design tokens into Creation build context.",
    organs:       ["creation", "lab"],
    capabilities: ["read", "export"],
    status:       "available",
    quick_actions: [
      { label: "Import frame spec", description: "Load a Figma frame as Creation reference" },
      { label: "Extract tokens",    description: "Pull design tokens into build context" },
    ],
    icon_char: "◐",
    accent:    "#a259ff",
  },
  {
    id:           "framer",
    name:         "Framer",
    category:     "design",
    description:  "Export Creation artifacts as Framer components or read Framer CMS.",
    organs:       ["creation"],
    capabilities: ["read", "export"],
    status:       "coming_soon",
    quick_actions: [
      { label: "Export component", description: "Push a Creation build to Framer" },
    ],
    icon_char: "◑",
    accent:    "#0099ff",
  },

  // ── Knowledge ─────────────────────────────────────────────────────────────
  {
    id:           "notion",
    name:         "Notion",
    category:     "knowledge",
    description:  "Sync School notes and Lab findings to Notion pages. Export study dossiers.",
    organs:       ["school", "lab"],
    capabilities: ["read", "write", "export", "sync"],
    status:       "available",
    quick_actions: [
      { label: "Export lesson",   description: "Push a School lesson to a Notion page" },
      { label: "Sync findings",   description: "Write Lab findings to a Notion database" },
      { label: "Import notes",    description: "Load Notion content as School context" },
    ],
    icon_char: "≡",
    accent:    "#1a1a1a",
  },
  {
    id:           "google-drive",
    name:         "Google Drive",
    category:     "storage",
    description:  "Read documents and spreadsheets from Drive into Lab and School context.",
    organs:       ["lab", "school"],
    capabilities: ["read", "sync", "export"],
    status:       "available",
    quick_actions: [
      { label: "Load document",     description: "Import a Drive doc into analysis context" },
      { label: "Export artifact",   description: "Save a Creation output to Drive" },
    ],
    icon_char: "◇",
    accent:    "#4285f4",
  },

  // ── Media ─────────────────────────────────────────────────────────────────
  {
    id:           "youtube",
    name:         "YouTube",
    category:     "media",
    description:  "Ingest video transcripts into School learning context or Lab research.",
    organs:       ["school", "lab"],
    capabilities: ["read", "search"],
    status:       "coming_soon",
    quick_actions: [
      { label: "Load transcript", description: "Pull video transcript into School context" },
      { label: "Search content",  description: "Find relevant videos for a research topic" },
    ],
    icon_char: "▶",
    accent:    "#ff0000",
  },

  // ── Automation ────────────────────────────────────────────────────────────
  {
    id:           "webhook",
    name:         "API / Webhook",
    category:     "automation",
    description:  "Trigger external webhooks, call custom APIs, pipe outputs to automation chains.",
    organs:       ["creation", "lab"],
    capabilities: ["write", "sync"],
    status:       "available",
    quick_actions: [
      { label: "Call endpoint",   description: "Send a request from Creation output" },
      { label: "Setup trigger",   description: "Configure a webhook on run completion" },
    ],
    icon_char: "⇒",
    accent:    "#786220",
  },

  // ── Local ────────────────────────────────────────────────────────────────
  {
    id:           "local-files",
    name:         "Local Files",
    category:     "storage",
    description:  "Upload files directly to Ruberra context. Supported: text, code, markdown, PDF.",
    organs:       ["lab", "school", "creation"],
    capabilities: ["read"],
    status:       "available",
    quick_actions: [
      { label: "Upload file",    description: "Add a local file to active chamber context" },
      { label: "Load codebase",  description: "Import a local repo or folder for Lab analysis" },
    ],
    icon_char: "⊞",
    accent:    "#52796A",
  },

  // ── AI providers ─────────────────────────────────────────────────────────
  {
    id:           "openai-api",
    name:         "OpenAI API",
    category:     "ai",
    description:  "Direct OpenAI API integration for model-level routing within Ruberra.",
    organs:       ["lab", "school", "creation"],
    capabilities: ["read", "write"],
    status:       "connected",
    quick_actions: [
      { label: "Check usage",    description: "View current token consumption" },
      { label: "Change model",   description: "Override model selection for session" },
    ],
    icon_char: "◉",
    accent:    "#10a37f",
  },
  {
    id:           "anthropic-api",
    name:         "Anthropic API",
    category:     "ai",
    description:  "Claude model routing — core to Lab research and School curriculum.",
    organs:       ["lab", "school", "creation"],
    capabilities: ["read", "write"],
    status:       "connected",
    quick_actions: [
      { label: "Check quota",    description: "View Anthropic API usage" },
      { label: "Switch to Opus", description: "Escalate current session to Opus" },
    ],
    icon_char: "◎",
    accent:    "#d4a373",
  },

  // ── Sovereign / Open-Weight Runtime ────────────────────────────────────────
  {
    id:           "ollama-local",
    name:         "Ollama (Local Runtime)",
    category:     "ai",
    description:  "Self-hosted open-weight model runtime. Tier A — runs entirely locally. Zero external calls. Configure RUBERRA_OLLAMA_URL to activate.",
    organs:       ["lab", "school", "creation"],
    capabilities: ["read", "write"],
    status:       "available",
    quick_actions: [
      { label: "Check health",    description: "Ping Ollama server at configured URL" },
      { label: "List models",     description: "Show locally pulled models via /api/tags" },
      { label: "Set as default",  description: "Set Ollama as Tier A primary for all chambers" },
    ],
    icon_char: "⊛",
    accent:    "#52796A",
  },
  {
    id:           "vllm-server",
    name:         "vLLM Server",
    category:     "ai",
    description:  "OpenAI-compatible vLLM inference server. Tier A — self-hosted. Supports tensor-parallel large models. Configure RUBERRA_VLLM_URL to activate.",
    organs:       ["lab", "creation"],
    capabilities: ["read", "write"],
    status:       "available",
    quick_actions: [
      { label: "Check health",   description: "Ping vLLM /health endpoint" },
      { label: "List models",    description: "Show available models on the server" },
    ],
    icon_char: "⊗",
    accent:    "#4A6B84",
  },
  {
    id:           "groq-free",
    name:         "Groq Cloud (Free Tier)",
    category:     "ai",
    description:  "Tier B — wrapped. Groq inference API free tier. Extremely fast Llama 3.3 70B. Rate-limited, non-guaranteed. Set RUBERRA_GROQ_KEY to activate.",
    organs:       ["lab", "school", "creation"],
    capabilities: ["read", "write"],
    status:       "available",
    quick_actions: [
      { label: "Check quota",    description: "View current rate limit status" },
      { label: "Enable fallback", description: "Use Groq as Tier B fallback for all chambers" },
    ],
    icon_char: "⊡",
    accent:    "#786220",
  },
];

// ─── Category metadata ────────────────────────────────────────────────────────

export const CONNECTOR_CATEGORY_LABELS: Record<ConnectorCategory, string> = {
  code:          "Code",
  deployment:    "Deployment",
  storage:       "Storage",
  design:        "Design",
  knowledge:     "Knowledge",
  communication: "Communication",
  automation:    "Automation",
  media:         "Media",
  data:          "Data",
  ai:            "AI Providers",
};

// ─── Lookups ──────────────────────────────────────────────────────────────────

export function getConnectorsByCategory(category: ConnectorCategory): ConnectorDefinition[] {
  return CONNECTOR_REGISTRY.filter((c) => c.category === category);
}

export function getConnectorsByOrgan(organ: Exclude<Tab, "profile">): ConnectorDefinition[] {
  return CONNECTOR_REGISTRY.filter((c) => c.organs.includes(organ));
}

export function getConnectorsByStatus(status: ConnectorStatus): ConnectorDefinition[] {
  return CONNECTOR_REGISTRY.filter((c) => c.status === status);
}

export function getConnectorById(id: string): ConnectorDefinition | undefined {
  return CONNECTOR_REGISTRY.find((c) => c.id === id);
}

export const CONNECTOR_CATEGORY_ORDER: ConnectorCategory[] = [
  "ai", "code", "deployment", "data", "knowledge", "storage", "design", "automation", "media", "communication",
];
