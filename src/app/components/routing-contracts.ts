/**
 * RUBERRA Routing Contracts
 * Typed routing model: determines lead chamber, lead pioneer,
 * support pioneers, workflow context, and connector requirements.
 * First implementation layer — extensible, not exhaustive.
 */

import { type Tab } from "./shell-types";
import { type PioneerId, PIONEER_REGISTRY } from "./pioneer-registry";
import { type TaskType } from "./model-orchestration";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LeadChamber   = Exclude<Tab, "profile">;
export type RouteIntent   =
  | "research"
  | "build"
  | "learn"
  | "audit"
  | "synthesize"
  | "execute"
  | "orchestrate";

export interface RoutingContract {
  intent:              RouteIntent;
  lead_chamber:        LeadChamber;
  lead_pioneer:        PioneerId;
  support_pioneers:    PioneerId[];
  workflow_template_id?: string;
  connector_required:  boolean;
  show_provenance:     boolean;
  label:               string;
  description:         string;
}

export interface ResolvedRoute {
  contract:            RoutingContract;
  model_id:            string;
  task:                TaskType;
  provenance_label:    string;
  hosting_truth:       string;
  support_chain:       string[];
}

// ─── Contract definitions ─────────────────────────────────────────────────────

export const ROUTING_CONTRACTS: RoutingContract[] = [
  {
    intent:           "research",
    lead_chamber:     "lab",
    lead_pioneer:     "claude-architect",
    support_pioneers: ["gemini-expansion", "antigravity-director"],
    connector_required: false,
    show_provenance:  true,
    label:            "Research Lead",
    description:      "Claude Architect leads. Gemini expands context. Antigravity validates taxonomy.",
  },
  {
    intent:           "build",
    lead_chamber:     "creation",
    lead_pioneer:     "cursor-builder",
    support_pioneers: ["codex-systems", "copilot-qa"],
    connector_required: false,
    show_provenance:  true,
    label:            "Build Lead",
    description:      "Cursor Builder executes. Codex Systems anchors runtime integrity. Copilot QA finishes.",
  },
  {
    intent:           "learn",
    lead_chamber:     "school",
    lead_pioneer:     "claude-architect",
    support_pioneers: ["gemini-expansion"],
    connector_required: false,
    show_provenance:  true,
    label:            "School Lead",
    description:      "Claude Architect leads structured pedagogy. Gemini expands curriculum context.",
  },
  {
    intent:           "audit",
    lead_chamber:     "lab",
    lead_pioneer:     "antigravity-director",
    support_pioneers: ["claude-architect", "codex-systems"],
    connector_required: false,
    show_provenance:  true,
    label:            "Audit Lead",
    description:      "Antigravity detects gaps. Claude verifies reasoning. Codex validates runtime integrity.",
  },
  {
    intent:           "synthesize",
    lead_chamber:     "lab",
    lead_pioneer:     "claude-architect",
    support_pioneers: ["gemini-expansion", "grok-reality"],
    workflow_template_id: "deep-research",
    connector_required: false,
    show_provenance:  true,
    label:            "Synthesis Lead",
    description:      "Claude Architect synthesizes. Gemini expands. Grok reality-checks the output.",
  },
  {
    intent:           "execute",
    lead_chamber:     "creation",
    lead_pioneer:     "cursor-builder",
    support_pioneers: ["claude-architect"],
    workflow_template_id: "rapid-build",
    connector_required: false,
    show_provenance:  true,
    label:            "Execution Lead",
    description:      "Cursor Builder executes directly. Claude Architect validates output on request.",
  },
  {
    intent:           "orchestrate",
    lead_chamber:     "lab",
    lead_pioneer:     "codex-systems",
    support_pioneers: ["claude-architect", "cursor-builder", "antigravity-director"],
    workflow_template_id: "maximum-quality",
    connector_required: false,
    show_provenance:  true,
    label:            "Orchestration Lead",
    description:      "Codex Systems coordinates full multi-pioneer pipeline across all chambers.",
  },
];

// ─── Intent resolution ────────────────────────────────────────────────────────

const INTENT_KEYWORDS: Record<RouteIntent, string[]> = {
  research:     ["research", "analyze", "investigate", "study", "audit", "compare", "evidence"],
  build:        ["build", "create", "generate", "implement", "code", "construct", "write", "make"],
  learn:        ["teach", "explain", "lesson", "learn", "curriculum", "tutorial", "master", "understand"],
  audit:        ["audit", "review", "verify", "check", "validate", "inspect", "test"],
  synthesize:   ["synthesize", "consolidate", "summarize", "combine", "integrate", "merge"],
  execute:      ["execute", "run", "deploy", "ship", "launch", "produce", "export"],
  orchestrate:  ["orchestrate", "coordinate", "pipeline", "workflow", "sequence", "plan", "design"],
};

export function resolveIntent(text: string): RouteIntent {
  const lower = text.toLowerCase();
  let best: RouteIntent = "research";
  let bestScore = 0;

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS) as [RouteIntent, string[]][]) {
    const score = keywords.reduce((s, kw) => s + (lower.includes(kw) ? 1 : 0), 0);
    if (score > bestScore) { best = intent; bestScore = score; }
  }

  return best;
}

export function getContractByIntent(intent: RouteIntent): RoutingContract {
  return ROUTING_CONTRACTS.find((c) => c.intent === intent) ?? ROUTING_CONTRACTS[0];
}

export function getContractByChamber(chamber: LeadChamber): RoutingContract {
  return ROUTING_CONTRACTS.find((c) => c.lead_chamber === chamber) ?? ROUTING_CONTRACTS[0];
}

export function resolveRoute(text: string, chamber: LeadChamber, task: TaskType): ResolvedRoute {
  const intent   = resolveIntent(text);
  // Prefer chamber-matched contract, fall back to intent-based
  const chamberContract = ROUTING_CONTRACTS.find(
    (c) => c.lead_chamber === chamber && c.intent === intent
  );
  const contract = chamberContract ?? getContractByChamber(chamber);

  const leadPioneer = PIONEER_REGISTRY.find((p) => p.id === contract.lead_pioneer);
  const supportChain = contract.support_pioneers.map((id) => {
    const p = PIONEER_REGISTRY.find((p2) => p2.id === id);
    return p?.name ?? id;
  });

  return {
    contract,
    model_id: task,
    task,
    provenance_label: `${leadPioneer?.name ?? contract.lead_pioneer} · ${contract.label}`,
    hosting_truth: leadPioneer?.hosting_level ?? "wrapped",
    support_chain: supportChain,
  };
}
