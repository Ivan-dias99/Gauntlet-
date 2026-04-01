/**
 * RUBERRA MULTI-AGENT SUBSTRATE — Stack 10: Multi-Agent Civilization
 * Constitutional Layer · Substrate · Installed 2026-04-01
 *
 * A civilization of specialized agents, each with sovereign domain
 * authority, collaborating under a single governing intelligence.
 *
 * Anti-patterns rejected:
 *   — agents without domain authority
 *   — agents that hallucinate coordination
 *   — agent chaos without governance
 *   — single-agent bottlenecks masquerading as multi-agent
 *
 * Dependencies: intelligence, operations, flow
 */

// ─── AGENT DOMAIN AUTHORITY ──────────────────────────────────────────────────

export type AgentDomain =
  | "research"        // Lab chamber — investigation, evidence, hypothesis
  | "learning"        // School chamber — curriculum, tracks, roles
  | "creation"        // Creation chamber — build, blueprint, artifact
  | "governance"      // Governance fabric — audit, trust, provenance
  | "awareness"       // System awareness — health, anomaly, trajectory
  | "knowledge"       // Knowledge graph — memory, surfacing, connections
  | "analytics"       // Intelligence analytics — patterns, signals, prediction
  | "orchestration"   // Cross-domain coordination — no execution, only routing
  | "execution"       // Direct execution — tool calls, connector invocations
  | "synthesis";      // Cross-chamber synthesis — merge, summarize, decide

export type AgentAuthority = "sovereign" | "domain" | "scoped" | "transient";

/**
 * DomainAuthority defines what a given agent class may and may not do.
 */
export interface DomainAuthority {
  domain:         AgentDomain;
  authority:      AgentAuthority;
  /** Domains this agent may coordinate with (read, request, reference) */
  canCoordinateWith: AgentDomain[];
  /** Domains this agent may not enter */
  cannotEnter:    AgentDomain[];
  /** Actions this agent may never take, regardless of instruction */
  hardBlocks:     string[];
  /** Whether this agent can spawn subagents within its domain */
  canSpawnSubagents: boolean;
}

// ─── AGENT LIFECYCLE ─────────────────────────────────────────────────────────

export type AgentLifecycleState =
  | "dormant"         // defined but not running
  | "spawning"        // being initialized
  | "active"          // executing its task
  | "waiting"         // waiting for input or dependency
  | "reporting"       // submitting output to governing intelligence
  | "retiring"        // completing and cleaning up
  | "retired"         // finished — may be recalled
  | "failed"          // terminated due to failure
  | "suspended";      // paused by governing intelligence

export interface AgentInstance {
  instanceId:     string;
  pioneerId:      string;         // definition ID from pioneer-registry
  domain:         AgentDomain;
  authority:      DomainAuthority;
  missionId?:     string;
  flowRunId?:     string;
  spawnedBy:      string;         // actor ID — operator, governing intelligence, or parent agent
  spawnedAt:      number;
  state:          AgentLifecycleState;
  taskContract:   AgentTaskContract;
  outputContract: AgentOutputContract;
  auditIds:       string[];
  parentInstanceId?: string;      // for subagents spawned by a parent agent
  childInstanceIds:  string[];
}

// ─── AGENT TASK CONTRACT ──────────────────────────────────────────────────────

export interface AgentTaskContract {
  /** What the agent is asked to do — one precise directive */
  directive:       string;
  /** Inputs the agent receives at spawn */
  inputs:          Record<string, unknown>;
  /** What the agent must NOT do within this task */
  constraints:     string[];
  /** Maximum time to complete before governing intelligence intervenes */
  timeoutMs:       number;
  /** Whether this task may modify external state */
  mutationAllowed: boolean;
  /** Governing intelligence ID that owns this agent's output */
  governingGiId:   string;
}

// ─── AGENT OUTPUT CONTRACT ────────────────────────────────────────────────────

export type AgentOutputVerdict = "complete" | "partial" | "failed" | "deferred";

export interface AgentOutputContract {
  verdict:         AgentOutputVerdict;
  outputs:         Record<string, unknown>;
  /** Consequence records produced during this task */
  consequenceIds:  string[];
  /** Audit record for this output */
  auditId?:        string;
  completedAt?:    number;
  /** Reason for partial or failed verdict */
  reason?:         string;
  /** Objects this agent suggests the governing intelligence should act on */
  recommendations: AgentRecommendation[];
}

export interface AgentRecommendation {
  kind:    "route" | "spawn" | "escalate" | "knowledge-write" | "signal";
  payload: Record<string, unknown>;
  reason:  string;
}

// ─── GOVERNING INTELLIGENCE ───────────────────────────────────────────────────

/**
 * The Governing Intelligence is the coordinating layer above agents.
 * It does not execute tasks — it routes, arbitrates, and synthesizes.
 */
export interface GoverningIntelligenceSession {
  id:              string;
  missionId?:      string;
  openedAt:        number;
  closedAt?:       number;
  /** All agent instances spawned under this GI session */
  agentInstances:  string[];
  /** Collision detection state — prevents two agents modifying the same object */
  claimedObjects:  Record<string, string>; // objectId → instanceId
  /** Cross-agent output synthesis queue */
  synthesisQueue:  string[];              // instanceIds awaiting synthesis
  auditIds:        string[];
}

// ─── NON-COLLISION ENFORCEMENT ────────────────────────────────────────────────

export interface CollisionCheckResult {
  safe:        boolean;
  conflictWith?: string;  // instanceId of the conflicting agent
  objectId:    string;
  reason?:     string;
}

export function checkAgentCollision(
  objectId:   string,
  instanceId: string,
  session:    GoverningIntelligenceSession,
): CollisionCheckResult {
  const existingClaim = session.claimedObjects[objectId];
  if (!existingClaim || existingClaim === instanceId) {
    return { safe: true, objectId };
  }
  return {
    safe:         false,
    conflictWith: existingClaim,
    objectId,
    reason:       `Object ${objectId} is already claimed by agent ${existingClaim}.`,
  };
}

export function claimObject(
  objectId:   string,
  instanceId: string,
  session:    GoverningIntelligenceSession,
): void {
  session.claimedObjects[objectId] = instanceId;
}

export function releaseObject(
  objectId: string,
  session:  GoverningIntelligenceSession,
): void {
  delete session.claimedObjects[objectId];
}

// ─── CIVILIZATION LAWS ────────────────────────────────────────────────────────

export const MULTIAGENT_LAWS: readonly string[] = [
  "Every agent has a defined domain — no agent acts outside its domain authority.",
  "No two agents may mutate the same object simultaneously — collision enforcement is mandatory.",
  "All agent spawning is governed — agents cannot spawn without a governing intelligence session.",
  "Agents report to governing intelligence — they do not act on their own recommendations.",
  "Agent output always carries an audit record — no silent agent execution.",
  "Agents may not override each other's outputs — synthesis is the governing intelligence's responsibility.",
  "A single governing intelligence coordinates all agents in a session — no distributed authority.",
  "Agent retirement is explicit — no zombie agents that continue after their task is complete.",
] as const;

export const MULTIAGENT_REJECTS: readonly string[] = [
  "agents without domain authority",
  "agents that hallucinate coordination",
  "agent chaos — multiple agents mutating the same object",
  "single-agent bottlenecks masquerading as multi-agent architecture",
  "agents spawning other agents without governing intelligence oversight",
  "parallel tool calls with no coordination contract",
] as const;

// ─── RUNTIME HELPERS ──────────────────────────────────────────────────────────

export function buildAgentInstanceId(): string {
  return `agent_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildGISessionId(): string {
  return `gi_sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildAgentInstance(
  params: Omit<AgentInstance, "instanceId" | "spawnedAt" | "childInstanceIds" | "auditIds">,
): AgentInstance {
  return {
    ...params,
    instanceId:      buildAgentInstanceId(),
    spawnedAt:       Date.now(),
    childInstanceIds: [],
    auditIds:        [],
  };
}

export function isAgentTerminal(instance: AgentInstance): boolean {
  return ["retired", "failed"].includes(instance.state);
}
