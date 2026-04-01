import {
  CREATION_BLUEPRINTS,
  CREATION_ENGINES,
  LAB_DOMAINS,
  SCHOOL_ROLES,
  SCHOOL_TRACKS,
} from "./product-data";
import { type Message, type Tab, type NavFn } from "./shell-types";

export type RuberraObjectType =
  | "course"
  | "track"
  | "lesson"
  | "role_path"
  | "framework"
  | "reference"
  | "deep_study"
  | "curriculum_map"
  | "reading_pack"
  | "explainer"
  | "investigation"
  | "experiment"
  | "audit"
  | "analysis"
  | "simulation"
  | "evidence_pack"
  | "decision_matrix"
  | "verdict"
  | "signal_report"
  | "failure_map"
  | "hypothesis_thread"
  | "blueprint"
  | "build_plan"
  | "artifact_pack"
  | "engine"
  | "template"
  | "system"
  | "offer"
  | "product_stack"
  | "service_model"
  | "launch_pack"
  | "monetization_path";

export interface RuberraObject {
  id: string;
  title: string;
  chamber: Tab;
  type: RuberraObjectType;
  summary: string;
  why_it_matters: string;
  status: string;
  tags: string[];
  prerequisites: string[];
  related_items: string[];
  next_steps: string[];
  action_route: { tab: Tab; view: string; id?: string };
  archive_route: { tab: Tab; view: "archive"; id?: string };
  source_basis: string;
  created_at: number;
  updated_at: number;
  confidence?: "low" | "medium" | "high";
  quality?: "draft" | "stable" | "verified";
}

const now = Date.now();

export const RUBERRA_OBJECTS: RuberraObject[] = [
  ...LAB_DOMAINS.flatMap((d) => [
    {
      id: d.id,
      title: d.label,
      chamber: "lab" as const,
      type: "investigation" as const,
      summary: d.tagline,
      why_it_matters: "Establishes investigation runway with linked school tracks and creation outputs.",
      status: "active",
      tags: ["domain", "research", ...d.linkedTracks],
      prerequisites: [],
      related_items: [...d.linkedTracks, ...d.linkedBlueprints, ...d.experiments.map((e) => e.id)],
      next_steps: ["Open domain detail", "Run experiment", "Bridge to related track"],
      action_route: { tab: "lab", view: "domain", id: d.id },
      archive_route: { tab: "lab", view: "archive", id: d.id },
      source_basis: "seeded:lab_domain",
      created_at: now,
      updated_at: now,
      confidence: "high" as const,
      quality: "verified" as const,
    },
    ...d.experiments.map((e) => ({
      id: e.id,
      title: e.title,
      chamber: "lab" as const,
      type: e.type.toLowerCase().includes("audit") ? "audit" as const : e.type.toLowerCase().includes("analysis") ? "analysis" as const : e.type.toLowerCase().includes("experiment") ? "experiment" as const : "simulation" as const,
      summary: e.desc,
      why_it_matters: "Connects evidence work to lessons and blueprint-ready outputs.",
      status: "ready",
      tags: [e.type.toLowerCase(), ...e.tools.map((t) => t.toLowerCase())],
      prerequisites: [d.id],
      related_items: [...e.linkedLessons, ...e.linkedBlueprints],
      next_steps: ["Open experiment detail", "Send to lab code", "Bridge to school lesson"],
      action_route: { tab: "lab", view: "experiment", id: e.id },
      archive_route: { tab: "lab", view: "archive", id: e.id },
      source_basis: "seeded:lab_experiment",
      created_at: now,
      updated_at: now,
      confidence: "high" as const,
      quality: "verified" as const,
    })),
  ]),
  ...SCHOOL_TRACKS.flatMap((t) => [
    {
      id: t.id,
      title: t.title,
      chamber: "school" as const,
      type: "track" as const,
      summary: t.tagline,
      why_it_matters: "Defines mastery progression and bridges into lab and creation.",
      status: "active",
      tags: [t.level.toLowerCase(), "curriculum"],
      prerequisites: [],
      related_items: [...t.linkedDomains, ...t.linkedBlueprints, ...t.lessons.map((l) => l.id)],
      next_steps: ["Open track", "Run mastery check", "Open linked lab domain"],
      action_route: { tab: "school", view: "track", id: t.id },
      archive_route: { tab: "school", view: "archive", id: t.id },
      source_basis: "seeded:school_track",
      created_at: now,
      updated_at: now,
      confidence: "high" as const,
      quality: "verified" as const,
    },
    ...t.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      chamber: "school" as const,
      type: "lesson" as const,
      summary: `${l.duration} • ${l.status}`,
      why_it_matters: "Provides concrete mastery unit with linked experiments and blueprints.",
      status: l.status,
      tags: ["lesson", l.status],
      prerequisites: [t.id],
      related_items: [...l.linkedExperiments, ...l.linkedBlueprints],
      next_steps: ["Open lesson", "Run mastery check", "Open related experiment"],
      action_route: { tab: "school", view: "lesson", id: l.id },
      archive_route: { tab: "school", view: "archive", id: l.id },
      source_basis: "seeded:school_lesson",
      created_at: now,
      updated_at: now,
      confidence: "medium" as const,
      quality: "stable" as const,
    })),
  ]),
  ...SCHOOL_ROLES.map((r) => ({
    id: r.id,
    title: r.title,
    chamber: "school" as const,
    type: "role_path" as const,
    summary: r.desc,
    why_it_matters: "Maps future capability to required tracks and applied builds.",
    status: r.demand.toLowerCase(),
    tags: ["role", r.domain.toLowerCase()],
    prerequisites: r.requiredTracks,
    related_items: [...r.linkedDomains, ...r.linkedBlueprints],
    next_steps: ["Open role detail", "Open required track", "Bridge to creation blueprint"],
    action_route: { tab: "school", view: "role", id: r.id },
    archive_route: { tab: "school", view: "archive", id: r.id },
    source_basis: "seeded:school_role",
    created_at: now,
    updated_at: now,
    confidence: "high" as const,
    quality: "verified" as const,
  })),
  ...CREATION_BLUEPRINTS.map((b) => ({
    id: b.id,
    title: b.title,
    chamber: "creation" as const,
    type: "blueprint" as const,
    summary: b.desc,
    why_it_matters: "Converts knowledge into packageable output and shipping flow.",
    status: "ready",
    tags: [b.category.toLowerCase(), ...b.tags.map((t) => t.toLowerCase())],
    prerequisites: b.linkedTracks,
    related_items: [...b.linkedDomains, ...b.linkedEngines],
    next_steps: ["Open blueprint", "Route to build terminal", "Open engine"],
    action_route: { tab: "creation", view: "blueprint", id: b.id },
    archive_route: { tab: "creation", view: "archive", id: b.id },
    source_basis: "seeded:creation_blueprint",
    created_at: now,
    updated_at: now,
    confidence: "high" as const,
    quality: "verified" as const,
  })),
  ...CREATION_ENGINES.map((e) => ({
    id: e.id,
    title: e.title,
    chamber: "creation" as const,
    type: "engine" as const,
    summary: e.desc,
    why_it_matters: "Production engine for repeated artifact generation.",
    status: "active",
    tags: ["engine", "template"],
    prerequisites: [],
    related_items: e.linkedBlueprints,
    next_steps: ["Open engine detail", "Open linked blueprint", "Run build"],
    action_route: { tab: "creation", view: "engine", id: e.id },
    archive_route: { tab: "creation", view: "archive", id: e.id },
    source_basis: "seeded:creation_engine",
    created_at: now,
    updated_at: now,
    confidence: "high" as const,
    quality: "verified" as const,
  })),
];

export function findObject(id: string) {
  return RUBERRA_OBJECTS.find((item) => item.id === id);
}

export function listObjectsForChamber(chamber: Tab) {
  return RUBERRA_OBJECTS.filter((item) => item.chamber === chamber);
}

export function buildMessageObject(message: Message): RuberraObject {
  const inferredType: RuberraObjectType =
    message.tab === "school" ? "deep_study" : message.tab === "lab" ? "signal_report" : "artifact_pack";
  const tr = message.execution_trace;
  const traceSummary = tr
    ? `${tr.executionState} · ${tr.modelId ?? ""} · ${(tr.executionResults ?? []).slice(-1)[0]?.summary ?? ""}`.trim()
    : "";
  const baseSummary = message.content.slice(0, 180);
  const summary = message.role === "assistant" && tr && traceSummary.length > 12
    ? `${traceSummary.slice(0, 200)}${baseSummary ? ` — ${baseSummary.slice(0, 120)}` : ""}`
    : baseSummary;

  return {
    id: message.id,
    title: message.content.slice(0, 80) || `Untitled ${message.tab}`,
    chamber: message.tab,
    type: inferredType,
    summary,
    why_it_matters: "Captured runtime output for chamber continuity and archive reopen.",
    status: message.role === "assistant" ? "captured" : "query",
    tags: [message.role, "runtime", ...(tr ? [`exec:${tr.executionState}`] : [])],
    prerequisites: [],
    related_items: [],
    next_steps: ["Open chamber chat", "Continue from archive", "Bridge to related object"],
    action_route: { tab: message.tab, view: message.tab === "creation" ? "terminal" : "chat" },
    archive_route: { tab: message.tab, view: "archive", id: message.id },
    source_basis: "runtime:message",
    created_at: message.timestamp,
    updated_at: message.timestamp,
    confidence: "medium",
    quality: "stable",
  };
}

export function openObject(navigate: NavFn, object: RuberraObject) {
  navigate(object.action_route.tab, object.action_route.view, object.action_route.id);
}

export function mergeObjectsByRecency(...sets: RuberraObject[][]): RuberraObject[] {
  const merged = new Map<string, RuberraObject>();
  for (const set of sets) {
    for (const object of set) {
      const existing = merged.get(object.id);
      if (!existing || object.updated_at >= existing.updated_at) {
        merged.set(object.id, object);
      }
    }
  }
  return Array.from(merged.values()).sort((a, b) => b.updated_at - a.updated_at);
}
