/**
 * RUBERRA STACK 20 — Compound Intelligence Network
 * Every mission, every agent, every operator, and every output
 * compounds into a growing advantage that cannot be replicated by starting over.
 *
 * Compound intelligence is not a feature. It is the irreversible consequence
 * of operating inside Ruberra long enough that the system knows you,
 * your missions, your patterns, and your trajectory better than any external tool.
 */

import { assertStackOrder } from "./canon-sovereignty";
import { type MissionId } from "./mission-substrate";

const _g = assertStackOrder("compound", ["multiagent", "analytics", "collective", "ecosystem", "org", "personal"]);
if (!_g.valid) console.warn("[Ruberra Compound Intelligence] Stack order violation:", _g.reason);

// ─── Compound nodes ───────────────────────────────────────────────────────────

export type CompoundNodeType =
  | "operator"      // A human operator's accumulated intelligence
  | "mission"       // A mission and all its accumulated context
  | "agent"         // An agent's domain mastery
  | "knowledge"     // A knowledge cluster
  | "pattern"       // A discovered cross-mission pattern
  | "output"        // A produced artifact with proven value
  | "ecosystem";    // An admitted ecosystem extension's contribution

export interface CompoundNode {
  id:            string;
  type:          CompoundNodeType;
  entityId:      string;    // The ID of the underlying entity (operatorId, missionId, etc.)
  label:         string;
  advantageScore: number;   // 0–1 how much this node contributes to compound advantage
  growthRate:    number;    // How fast this node's advantage is growing (per day, 0–1 normalized)
  firstSeenAt:   number;
  lastUpdated:   number;
}

export function createCompoundNode(
  type: CompoundNodeType,
  entityId: string,
  label: string,
  initialAdvantage = 0.1
): CompoundNode {
  const now = Date.now();
  return {
    id:             `cn_${type}_${entityId.replace(/\W/g, "_")}`,
    type,
    entityId,
    label,
    advantageScore: Math.max(0, Math.min(1, initialAdvantage)),
    growthRate:     0.01,
    firstSeenAt:    now,
    lastUpdated:    now,
  };
}

export function compoundNode(node: CompoundNode, delta: number): CompoundNode {
  const newScore = Math.max(0, Math.min(1, node.advantageScore + delta));
  const ageMs    = Date.now() - node.firstSeenAt;
  const ageDays  = Math.max(1, ageMs / 86_400_000);
  const growthRate = newScore / ageDays;
  return { ...node, advantageScore: newScore, growthRate, lastUpdated: Date.now() };
}

// ─── Compound edges ───────────────────────────────────────────────────────────

export type CompoundRelationType =
  | "amplifies"     // Node A increases the value of Node B
  | "depends_on"    // Node A requires Node B to function
  | "trained_on"    // Node A (agent/model) learned from Node B
  | "produced"      // Node A (mission/operator) produced Node B
  | "reinforces";   // Node A repeated pattern of Node B

export interface CompoundEdge {
  id:       string;
  fromId:   string;   // CompoundNode ID
  toId:     string;   // CompoundNode ID
  relation: CompoundRelationType;
  weight:   number;   // 0–1 strength of compound relationship
  createdAt: number;
}

export function createCompoundEdge(
  fromId: string,
  toId: string,
  relation: CompoundRelationType,
  weight = 0.5
): CompoundEdge {
  return {
    id:        `ce_${fromId.slice(-6)}_${toId.slice(-6)}_${relation}`,
    fromId,
    toId,
    relation,
    weight:    Math.max(0, Math.min(1, weight)),
    createdAt: Date.now(),
  };
}

// ─── Advantage measurement ────────────────────────────────────────────────────

export interface AdvantageRecord {
  id:            string;
  missionId?:    MissionId;
  operatorId?:   string;
  dimension:     "knowledge_depth" | "execution_speed" | "pattern_recognition" | "domain_mastery" | "network_effect";
  baselineScore: number;  // Score when first measured
  currentScore:  number;  // Current score
  delta:         number;  // currentScore - baselineScore
  measuredAt:    number;
}

export function measureAdvantage(
  dimension: AdvantageRecord["dimension"],
  current: number,
  baseline: number,
  opts?: { missionId?: MissionId; operatorId?: string }
): AdvantageRecord {
  return {
    id:            `adv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    missionId:     opts?.missionId,
    operatorId:    opts?.operatorId,
    dimension,
    baselineScore: baseline,
    currentScore:  current,
    delta:         current - baseline,
    measuredAt:    Date.now(),
  };
}

// ─── Replication barrier ──────────────────────────────────────────────────────

/**
 * The replication barrier measures how hard it would be for a new entrant
 * to replicate the compound intelligence accumulated in this Ruberra instance.
 * This is the key metric that makes Ruberra irreplaceable over time.
 */
export interface ReplicationBarrier {
  score:           number;   // 0–1: how hard to replicate (higher = harder)
  knowledgeDepth:  number;   // Months of accumulated knowledge
  missionHistory:  number;   // Number of completed missions
  patternCount:    number;   // Unique patterns discovered
  networkSize:     number;   // Number of compound nodes
  estimatedAt:     number;
}

export function estimateReplicationBarrier(
  missionCount: number,
  knowledgeNodes: number,
  patternCount: number,
  networkNodes: number,
  ageMs: number
): ReplicationBarrier {
  const ageDays   = ageMs / 86_400_000;
  const ageFactor = Math.min(1, ageDays / 365);  // Grows to 1 after 1 year
  const scale     = Math.min(1, (missionCount * 0.02 + knowledgeNodes * 0.005 + patternCount * 0.03 + networkNodes * 0.004));
  const score     = (scale * 0.6 + ageFactor * 0.4);

  return {
    score:           Math.max(0, Math.min(1, score)),
    knowledgeDepth:  Math.round(ageDays / 30),
    missionHistory:  missionCount,
    patternCount,
    networkSize:     networkNodes,
    estimatedAt:     Date.now(),
  };
}

// ─── Compound network ─────────────────────────────────────────────────────────

export interface CompoundNetwork {
  nodes:        CompoundNode[];
  edges:        CompoundEdge[];
  advantages:   AdvantageRecord[];
  barrier:      ReplicationBarrier;
  lastUpdated:  number;
}

export function defaultCompoundNetwork(): CompoundNetwork {
  return {
    nodes:       [],
    edges:       [],
    advantages:  [],
    barrier:     estimateReplicationBarrier(0, 0, 0, 0, 0),
    lastUpdated: Date.now(),
  };
}

export function addCompoundNode(network: CompoundNetwork, node: CompoundNode): CompoundNetwork {
  const nodes = [...network.nodes.filter((n) => n.id !== node.id), node];
  return { ...network, nodes, lastUpdated: Date.now() };
}

export function addCompoundEdge(network: CompoundNetwork, edge: CompoundEdge): CompoundNetwork {
  const edges = [...network.edges.filter((e) => e.id !== edge.id), edge];
  return { ...network, edges, lastUpdated: Date.now() };
}

export function recordAdvantage(
  network: CompoundNetwork,
  record: AdvantageRecord
): CompoundNetwork {
  return { ...network, advantages: [...network.advantages, record], lastUpdated: Date.now() };
}

export function refreshBarrier(network: CompoundNetwork, ageMs: number): CompoundNetwork {
  const missions = network.nodes.filter((n) => n.type === "mission").length;
  const knowledge = network.nodes.filter((n) => n.type === "knowledge").length;
  const patterns = network.nodes.filter((n) => n.type === "pattern").length;
  const barrier = estimateReplicationBarrier(missions, knowledge, patterns, network.nodes.length, ageMs);
  return { ...network, barrier, lastUpdated: Date.now() };
}

// ─── Unified state ────────────────────────────────────────────────────────────

export interface CompoundIntelligenceState {
  network:     CompoundNetwork;
  lastUpdated: number;
}

export function defaultCompoundState(): CompoundIntelligenceState {
  return { network: defaultCompoundNetwork(), lastUpdated: Date.now() };
}
