/**
 * RUBERRA STACK 13 — Collective Execution
 * Multiple operators executing under a shared mission graph
 * with consequence attribution and non-collision enforcement.
 *
 * Collective is not collaboration software.
 * It is sovereign joint execution under one governing mission graph.
 */

import { assertStackOrder } from "./canon-sovereignty";
import { type MissionId } from "./mission-substrate";

const _g = assertStackOrder("collective", ["operations", "flow", "multiagent"]);
if (!_g.valid) console.warn("[Ruberra Collective Execution] Stack order violation:", _g.reason);

// ─── Collective members ───────────────────────────────────────────────────────

export type OperatorRole = "sovereign" | "lead" | "contributor" | "observer";

export const ROLE_RANK: Record<OperatorRole, number> = {
  sovereign: 4, lead: 3, contributor: 2, observer: 1,
} as const;

export interface CollectiveMember {
  operatorId:     string;
  role:           OperatorRole;
  boundMissions:  MissionId[];
  permissions:    string[];    // Explicit resource-level permissions
  joinedAt:       number;
  lastActiveAt:   number;
}

export function createMember(
  operatorId: string,
  role: OperatorRole,
  boundMissions: MissionId[] = []
): CollectiveMember {
  const now = Date.now();
  return {
    operatorId,
    role,
    boundMissions,
    permissions:  [],
    joinedAt:     now,
    lastActiveAt: now,
  };
}

export function canOperate(member: CollectiveMember, missionId: MissionId): boolean {
  if (member.role === "sovereign" || member.role === "lead") return true;
  return member.boundMissions.includes(missionId);
}

// ─── Consequence attribution ──────────────────────────────────────────────────

export type ContributionType = "primary" | "support" | "review" | "approval" | "observation";

export interface ConsequenceAttribution {
  id:             string;
  missionId:      MissionId;
  operatorId:     string;
  action:         string;
  contribution:   ContributionType;
  consequenceRef: string;  // What was produced / changed
  reversible:     boolean;
  at:             number;
}

export function attributeConsequence(
  missionId: MissionId,
  operatorId: string,
  action: string,
  contribution: ContributionType,
  consequenceRef: string,
  reversible = true
): ConsequenceAttribution {
  return {
    id:             `attr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    missionId,
    operatorId,
    action,
    contribution,
    consequenceRef,
    reversible,
    at:             Date.now(),
  };
}

// ─── Mission graph ────────────────────────────────────────────────────────────

export interface MissionGraphNode {
  missionId:    MissionId;
  dependencies: MissionId[];   // Missions that must complete before this
  dependents:   MissionId[];   // Missions that depend on this
  assignedTo?:  string;        // operatorId with lead authority
  status:       "pending" | "active" | "blocked" | "complete";
}

export function buildMissionGraphNode(
  missionId: MissionId,
  dependencies: MissionId[] = []
): MissionGraphNode {
  return { missionId, dependencies, dependents: [], status: "pending" };
}

export function isNodeReady(node: MissionGraphNode, completedIds: Set<MissionId>): boolean {
  return node.status === "pending" && node.dependencies.every((d) => completedIds.has(d));
}

// ─── Collision map ────────────────────────────────────────────────────────────

export interface CollisionMapEntry {
  resourceId:  string;
  claimedBy:   string[];     // operatorIds holding a claim
  riskLevel:   "none" | "low" | "high" | "blocked";
  lastUpdated: number;
}

export function checkCollectiveCollision(
  map: CollisionMapEntry[],
  resourceId: string,
  operatorId: string
): { safe: boolean; conflictWith?: string } {
  const entry = map.find((e) => e.resourceId === resourceId);
  if (!entry || entry.claimedBy.length === 0) return { safe: true };
  const others = entry.claimedBy.filter((id) => id !== operatorId);
  if (others.length === 0) return { safe: true };
  return { safe: false, conflictWith: others[0] };
}

export function claimCollectiveResource(
  map: CollisionMapEntry[],
  resourceId: string,
  operatorId: string
): CollisionMapEntry[] {
  const existing = map.find((e) => e.resourceId === resourceId);
  if (existing) {
    if (existing.claimedBy.includes(operatorId)) return map;
    return map.map((e) =>
      e.resourceId === resourceId
        ? { ...e, claimedBy: [...e.claimedBy, operatorId], riskLevel: e.claimedBy.length > 0 ? "high" : "none", lastUpdated: Date.now() }
        : e
    );
  }
  return [...map, { resourceId, claimedBy: [operatorId], riskLevel: "none", lastUpdated: Date.now() }];
}

// ─── Collective state ─────────────────────────────────────────────────────────

export interface CollectiveState {
  members:        CollectiveMember[];
  missionGraph:   MissionGraphNode[];
  attributions:   ConsequenceAttribution[];
  collisionMap:   CollisionMapEntry[];
  lastUpdated:    number;
}

export function defaultCollectiveState(): CollectiveState {
  return {
    members:      [],
    missionGraph: [],
    attributions: [],
    collisionMap: [],
    lastUpdated:  Date.now(),
  };
}

export function admitMember(
  state: CollectiveState,
  member: CollectiveMember
): CollectiveState {
  if (state.members.find((m) => m.operatorId === member.operatorId)) return state;
  return { ...state, members: [...state.members, member], lastUpdated: Date.now() };
}

export function recordAttribution(
  state: CollectiveState,
  attr: ConsequenceAttribution
): CollectiveState {
  return { ...state, attributions: [...state.attributions, attr], lastUpdated: Date.now() };
}

export function addToMissionGraph(
  state: CollectiveState,
  node: MissionGraphNode
): CollectiveState {
  if (state.missionGraph.find((n) => n.missionId === node.missionId)) return state;
  return { ...state, missionGraph: [...state.missionGraph, node], lastUpdated: Date.now() };
}
