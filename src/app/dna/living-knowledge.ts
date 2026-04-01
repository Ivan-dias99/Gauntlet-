/**
 * RUBERRA STACK 11 — Living Knowledge
 * A knowledge graph that absorbs, connects, and surfaces intelligence
 * across all missions and all history.
 *
 * Knowledge is not a document store.
 * It is a living, connected substrate that grows with consequence.
 */

import { assertStackOrder } from "./canon-sovereignty";
import { type MissionId } from "./mission-substrate";

const _g = assertStackOrder("knowledge", ["mission", "intelligence", "awareness"]);
if (!_g.valid) console.warn("[Ruberra Living Knowledge] Stack order violation:", _g.reason);

// ─── Node types ───────────────────────────────────────────────────────────────

export type KnowledgeNodeId = string;

export type KnowledgeNodeType =
  | "fact"        // Verified, stable truth
  | "decision"    // A choice made in a mission with rationale
  | "insight"     // Intelligence-derived observation
  | "artifact"    // A produced mission output referenced as knowledge
  | "concept"     // Abstract idea or domain term
  | "procedure"   // How to do something
  | "context"     // Background state at a point in time
  | "constraint"; // A rule or boundary that governs execution

export type KnowledgeConfidence = "low" | "medium" | "high" | "verified";

export const CONFIDENCE_RANK: Record<KnowledgeConfidence, number> = {
  low: 1, medium: 2, high: 3, verified: 4,
} as const;

export interface KnowledgeNode {
  id:          KnowledgeNodeId;
  type:        KnowledgeNodeType;
  content:     string;        // The knowledge itself — one clear statement
  missionId?:  MissionId;     // Origin mission if mission-bound
  tags:        string[];
  confidence:  KnowledgeConfidence;
  createdAt:   number;
  updatedAt:   number;
  accessCount: number;
  deprecated:  boolean;       // Superseded by newer knowledge
}

export function createNode(
  opts: Pick<KnowledgeNode, "type" | "content"> &
    Partial<Pick<KnowledgeNode, "missionId" | "tags" | "confidence">>
): KnowledgeNode {
  const now = Date.now();
  return {
    id:          `kn_${now}_${Math.random().toString(36).slice(2, 8)}`,
    type:        opts.type,
    content:     opts.content,
    missionId:   opts.missionId,
    tags:        opts.tags        ?? [],
    confidence:  opts.confidence  ?? "medium",
    createdAt:   now,
    updatedAt:   now,
    accessCount: 0,
    deprecated:  false,
  };
}

export function touchNode(node: KnowledgeNode): KnowledgeNode {
  return { ...node, accessCount: node.accessCount + 1 };
}

export function deprecateNode(node: KnowledgeNode): KnowledgeNode {
  return { ...node, deprecated: true, updatedAt: Date.now() };
}

// ─── Edges ────────────────────────────────────────────────────────────────────

export type KnowledgeRelation =
  | "supports"       // Node A provides evidence for Node B
  | "contradicts"    // Node A conflicts with Node B
  | "extends"        // Node A adds depth to Node B
  | "requires"       // Node A depends on Node B being true
  | "produced"       // Node A was produced by the mission/process that created Node B
  | "references"     // Node A cites Node B
  | "supersedes";    // Node A replaces Node B

export interface KnowledgeEdge {
  id:       string;
  fromId:   KnowledgeNodeId;
  toId:     KnowledgeNodeId;
  relation: KnowledgeRelation;
  strength: number;  // 0–1: how strong/certain the connection is
  createdAt: number;
}

export function createEdge(
  fromId: KnowledgeNodeId,
  toId: KnowledgeNodeId,
  relation: KnowledgeRelation,
  strength = 0.7
): KnowledgeEdge {
  return {
    id:        `ke_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    fromId,
    toId,
    relation,
    strength:  Math.max(0, Math.min(1, strength)),
    createdAt: Date.now(),
  };
}

// ─── Graph ────────────────────────────────────────────────────────────────────

export interface KnowledgeGraph {
  nodes:        KnowledgeNode[];
  edges:        KnowledgeEdge[];
  missionIndex: Record<MissionId, KnowledgeNodeId[]>;
  tagIndex:     Record<string, KnowledgeNodeId[]>;
}

export function defaultKnowledgeGraph(): KnowledgeGraph {
  return { nodes: [], edges: [], missionIndex: {}, tagIndex: {} };
}

export function addNode(graph: KnowledgeGraph, node: KnowledgeNode): KnowledgeGraph {
  const nodes = [...graph.nodes, node];
  const missionIndex = { ...graph.missionIndex };
  if (node.missionId) {
    missionIndex[node.missionId] = [...(missionIndex[node.missionId] ?? []), node.id];
  }
  const tagIndex = { ...graph.tagIndex };
  for (const tag of node.tags) {
    tagIndex[tag] = [...(tagIndex[tag] ?? []), node.id];
  }
  return { ...graph, nodes, missionIndex, tagIndex };
}

export function addEdge(graph: KnowledgeGraph, edge: KnowledgeEdge): KnowledgeGraph {
  return { ...graph, edges: [...graph.edges, edge] };
}

// ─── Absorption ───────────────────────────────────────────────────────────────

export function absorbKnowledge(
  graph: KnowledgeGraph,
  content: string,
  missionId: MissionId | undefined,
  type: KnowledgeNodeType,
  tags: string[] = []
): { graph: KnowledgeGraph; node: KnowledgeNode } {
  const node = createNode({ type, content, missionId, tags });
  return { graph: addNode(graph, node), node };
}

// ─── Query ────────────────────────────────────────────────────────────────────

export interface KnowledgeQuery {
  text:           string;
  missionId?:     MissionId;
  types?:         KnowledgeNodeType[];
  tags?:          string[];
  minConfidence?: KnowledgeConfidence;
  excludeDeprecated?: boolean;
}

export interface KnowledgeResult {
  nodes:           KnowledgeNode[];
  relevanceScores: Record<KnowledgeNodeId, number>;
}

export function queryKnowledge(graph: KnowledgeGraph, query: KnowledgeQuery): KnowledgeResult {
  const minRank = query.minConfidence ? CONFIDENCE_RANK[query.minConfidence] : 0;
  const queryLower = query.text.toLowerCase();

  let candidates = graph.nodes.filter((n) => {
    if (query.excludeDeprecated !== false && n.deprecated) return false;
    if (query.missionId && n.missionId !== query.missionId) return false;
    if (query.types?.length && !query.types.includes(n.type)) return false;
    if (query.tags?.length && !query.tags.some((t) => n.tags.includes(t))) return false;
    if (CONFIDENCE_RANK[n.confidence] < minRank) return false;
    return true;
  });

  const relevanceScores: Record<KnowledgeNodeId, number> = {};
  for (const node of candidates) {
    const contentLower = node.content.toLowerCase();
    const words = queryLower.split(/\s+/).filter(Boolean);
    const matches = words.filter((w) => contentLower.includes(w)).length;
    const tagBonus = (query.tags ?? []).filter((t) => node.tags.includes(t)).length * 0.1;
    const confidenceBonus = CONFIDENCE_RANK[node.confidence] * 0.05;
    const recencyBonus = Math.max(0, 1 - (Date.now() - node.updatedAt) / 86_400_000_00) * 0.1;
    relevanceScores[node.id] = (matches / Math.max(words.length, 1)) + tagBonus + confidenceBonus + recencyBonus;
  }

  candidates = candidates
    .filter((n) => relevanceScores[n.id] > 0)
    .sort((a, b) => (relevanceScores[b.id] ?? 0) - (relevanceScores[a.id] ?? 0));

  return { nodes: candidates, relevanceScores };
}

export function getMissionKnowledge(graph: KnowledgeGraph, missionId: MissionId): KnowledgeNode[] {
  const ids = new Set(graph.missionIndex[missionId] ?? []);
  return graph.nodes.filter((n) => ids.has(n.id) && !n.deprecated);
}

export function getConnectedNodes(
  graph: KnowledgeGraph,
  nodeId: KnowledgeNodeId,
  relation?: KnowledgeRelation
): KnowledgeNode[] {
  const edges = graph.edges.filter(
    (e) => (e.fromId === nodeId || e.toId === nodeId) &&
      (!relation || e.relation === relation)
  );
  const connectedIds = new Set(edges.flatMap((e) => [e.fromId, e.toId]).filter((id) => id !== nodeId));
  return graph.nodes.filter((n) => connectedIds.has(n.id));
}

// ─── Unified state ────────────────────────────────────────────────────────────

export interface LivingKnowledgeState {
  graph:       KnowledgeGraph;
  lastUpdated: number;
}

export function defaultLivingKnowledgeState(): LivingKnowledgeState {
  return { graph: defaultKnowledgeGraph(), lastUpdated: Date.now() };
}
