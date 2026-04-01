/**
 * RUBERRA STACK 10 — Multi-Agent Civilization
 * Sovereign domain authority, agent coordination, collision prevention.
 *
 * Agents are not bots. Not assistants. Not tools.
 * Each agent holds a sovereign domain and governs it absolutely.
 * The civilization is governed — not centrally controlled.
 */

import { assertStackOrder } from "./canon-sovereignty";
import { type MissionId } from "./mission-substrate";

const _g = assertStackOrder("multiagent", ["intelligence", "operations", "flow"]);
if (!_g.valid) console.warn("[Ruberra Multi-Agent] Stack order violation:", _g.reason);

// ─── Agent domain + capability ────────────────────────────────────────────────

export type AgentDomain =
  | "lab"          // Investigation and research authority
  | "school"       // Mastery and synthesis authority
  | "creation"     // Construction and shipping authority
  | "governance"   // Policy and audit authority
  | "security"     // Trust and protection authority
  | "knowledge"    // Knowledge graph authority
  | "analytics"    // Intelligence and pattern authority
  | "operations"   // Execution and flow authority
  | "distribution" // Presence and delivery authority
  | "platform";    // Infrastructure authority

export interface AgentCapability {
  domain:             AgentDomain;
  actions:            string[];
  exclusiveOwnership: boolean; // If true, no other agent may perform these actions
  maxConcurrent:      number;  // Max simultaneous executions for this agent
}

export type AgentStatus = "dormant" | "active" | "busy" | "suspended" | "decommissioned";

export interface AgentManifest {
  id:             string;
  name:           string;
  domain:         AgentDomain;
  capabilities:   AgentCapability[];
  status:         AgentStatus;
  boundMissions:  MissionId[];
  handoffQueue:   string[]; // IDs of pending handoff requests
  spawnedAt:      number;
  lastActiveAt:   number;
}

export function registerAgent(
  opts: Pick<AgentManifest, "id" | "name" | "domain" | "capabilities">
): AgentManifest {
  const now = Date.now();
  return {
    id:            opts.id,
    name:          opts.name,
    domain:        opts.domain,
    capabilities:  opts.capabilities,
    status:        "dormant",
    boundMissions: [],
    handoffQueue:  [],
    spawnedAt:     now,
    lastActiveAt:  now,
  };
}

export function bindMission(agent: AgentManifest, missionId: MissionId): AgentManifest {
  if (agent.boundMissions.includes(missionId)) return agent;
  return { ...agent, boundMissions: [...agent.boundMissions, missionId], lastActiveAt: Date.now() };
}

export function activateAgent(agent: AgentManifest): AgentManifest {
  return { ...agent, status: "active", lastActiveAt: Date.now() };
}

// ─── Collision detection ──────────────────────────────────────────────────────

export type CollisionRisk = "none" | "low" | "high" | "blocked";

export interface CollisionCheck {
  agentAId:   string;
  agentBId:   string;
  resource:   string;  // What both agents are attempting to access/modify
  risk:       CollisionRisk;
  reason:     string;
  resolvedBy?: string; // Agent ID that was given priority
}

export function checkCollision(
  agentA: AgentManifest,
  agentB: AgentManifest,
  resource: string
): CollisionCheck {
  // Same domain on same resource = high collision risk
  if (agentA.domain === agentB.domain) {
    const aOwns = agentA.capabilities.some(
      (c) => c.exclusiveOwnership && c.actions.some((a) => resource.startsWith(a))
    );
    if (aOwns) {
      return {
        agentAId: agentA.id, agentBId: agentB.id, resource,
        risk: "blocked",
        reason: `${agentA.name} holds exclusive ownership of ${resource}`,
        resolvedBy: agentA.id,
      };
    }
    return {
      agentAId: agentA.id, agentBId: agentB.id, resource,
      risk: "high",
      reason: `Both agents share domain "${agentA.domain}" on resource "${resource}"`,
    };
  }
  // Different domains — low risk, cross-domain coordination needed
  return {
    agentAId: agentA.id, agentBId: agentB.id, resource,
    risk: "low",
    reason: `Cross-domain access: ${agentA.domain} ↔ ${agentB.domain}`,
  };
}

// ─── Agent coordination ───────────────────────────────────────────────────────

export interface AgentCoordination {
  id:               string;
  missionId:        MissionId;
  leadAgentId:      string;
  supportAgents:    string[];
  activeResources:  string[];       // Resources currently claimed
  nonCollisionLog:  CollisionCheck[];
  state:            "forming" | "active" | "handoff" | "dissolved";
  formedAt:         number;
  updatedAt:        number;
}

export function buildCoordination(
  missionId: MissionId,
  leadId: string,
  supportIds: string[]
): AgentCoordination {
  const now = Date.now();
  return {
    id:              `coord_${now}_${Math.random().toString(36).slice(2, 7)}`,
    missionId,
    leadAgentId:     leadId,
    supportAgents:   supportIds,
    activeResources: [],
    nonCollisionLog: [],
    state:           "forming",
    formedAt:        now,
    updatedAt:       now,
  };
}

export function claimResource(coord: AgentCoordination, resource: string): AgentCoordination {
  if (coord.activeResources.includes(resource)) return coord;
  return {
    ...coord,
    activeResources: [...coord.activeResources, resource],
    updatedAt: Date.now(),
  };
}

export function releaseResource(coord: AgentCoordination, resource: string): AgentCoordination {
  return {
    ...coord,
    activeResources: coord.activeResources.filter((r) => r !== resource),
    updatedAt: Date.now(),
  };
}

export function logCollision(coord: AgentCoordination, check: CollisionCheck): AgentCoordination {
  return {
    ...coord,
    nonCollisionLog: [...coord.nonCollisionLog, check],
    updatedAt: Date.now(),
  };
}

// ─── Agent civilization ───────────────────────────────────────────────────────

export interface AgentCivilization {
  agents:               AgentManifest[];
  activeCoordinations:  AgentCoordination[];
  governingAgentId?:    string;  // The agent holding governance authority
  domainIndex:          Record<AgentDomain, string[]>; // domain → [agentId]
}

export function defaultCivilization(): AgentCivilization {
  return {
    agents:              [],
    activeCoordinations: [],
    domainIndex: {
      lab: [], school: [], creation: [], governance: [],
      security: [], knowledge: [], analytics: [], operations: [],
      distribution: [], platform: [],
    },
  };
}

export function admitAgent(
  civilization: AgentCivilization,
  manifest: AgentManifest
): AgentCivilization {
  const existing = civilization.agents.find((a) => a.id === manifest.id);
  if (existing) return civilization;
  const agents = [...civilization.agents, manifest];
  const domainIndex = { ...civilization.domainIndex };
  domainIndex[manifest.domain] = [...(domainIndex[manifest.domain] ?? []), manifest.id];
  return { ...civilization, agents, domainIndex };
}

export function getDomainAuthority(
  civilization: AgentCivilization,
  domain: AgentDomain
): AgentManifest | undefined {
  const ids = civilization.domainIndex[domain] ?? [];
  return civilization.agents.find((a) => ids.includes(a.id) && a.status === "active");
}

export function resolveAgentForResource(
  civilization: AgentCivilization,
  resource: string,
  domain: AgentDomain
): AgentManifest | undefined {
  return civilization.agents.find(
    (a) => a.domain === domain &&
      a.status !== "suspended" &&
      a.status !== "decommissioned" &&
      a.capabilities.some((c) => c.actions.some((act) => resource.startsWith(act)))
  );
}

// ─── Unified state ────────────────────────────────────────────────────────────

export interface MultiAgentState {
  civilization:  AgentCivilization;
  lastUpdated:   number;
}

export function defaultMultiAgentState(): MultiAgentState {
  return {
    civilization: defaultCivilization(),
    lastUpdated:  Date.now(),
  };
}
