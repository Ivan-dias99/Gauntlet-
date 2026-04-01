/**
 * RUBERRA KNOWLEDGE SUBSTRATE — Stack 11: Living Knowledge
 * Constitutional Layer · Substrate · Installed 2026-04-01
 *
 * A living knowledge graph that absorbs, connects, and surfaces
 * relevant intelligence across all missions and all history.
 *
 * Anti-patterns rejected:
 *   — knowledge that dies when the session ends
 *   — documentation that is never read
 *   — search that returns documents not answers
 *   — knowledge silos per chamber or per operator
 *
 * Dependencies: mission, intelligence, awareness
 */

// ─── KNOWLEDGE NODE ───────────────────────────────────────────────────────────

export type KnowledgeNodeKind =
  | "fact"            // a verified, mission-grounded assertion
  | "hypothesis"      // a testable claim under investigation
  | "decision"        // a decision made during mission execution
  | "lesson"          // a synthesized insight from experience
  | "pattern"         // a recurring structure observed across missions
  | "constraint"      // a known limit or boundary condition
  | "output"          // a mission output (artifact, report, model)
  | "reference"       // a pointer to external knowledge
  | "connection";     // an explicit link between two other nodes

export type KnowledgeNodeStatus =
  | "live"            // active — currently referenced by missions
  | "consolidated"    // merged into a higher-confidence node
  | "deprecated"      // superseded by newer knowledge
  | "quarantined"     // flagged for review — confidence too low
  | "archived";       // historical record — not surfaced in active queries

export interface KnowledgeNode {
  id:              string;
  kind:            KnowledgeNodeKind;
  status:          KnowledgeNodeStatus;
  title:           string;
  body:            string;
  /** Confidence score 0.0–1.0 — updated as evidence accumulates */
  confidence:      number;
  /** Missions that contributed to or reference this node */
  missionIds:      string[];
  /** Operators who authored or validated this node */
  operatorIds:     string[];
  /** Edges to other nodes */
  connections:     KnowledgeEdge[];
  /** Tags for retrieval */
  tags:            string[];
  /** Chamber(s) this node is most relevant to */
  chambers:        string[];
  createdAt:       number;
  updatedAt:       number;
  /** Expiry — nodes older than this require re-validation */
  expiresAt?:      number;
}

// ─── KNOWLEDGE EDGES ─────────────────────────────────────────────────────────

export type KnowledgeEdgeKind =
  | "supports"        // this node provides evidence for the target
  | "contradicts"     // this node conflicts with the target
  | "refines"         // this node narrows or qualifies the target
  | "depends-on"      // this node requires the target to be true
  | "derives-from"    // this node was produced from the target
  | "supersedes"      // this node replaces the target
  | "related";        // semantic proximity without causal direction

export interface KnowledgeEdge {
  targetId:   string;
  kind:       KnowledgeEdgeKind;
  weight:     number;    // 0.0–1.0 — strength of the relationship
  reason:     string;
  createdAt:  number;
}

// ─── KNOWLEDGE QUERY ─────────────────────────────────────────────────────────

export type KnowledgeQueryMode =
  | "semantic"        // meaning-based retrieval
  | "exact"           // id or tag exact match
  | "mission-scoped"  // only nodes from a specific mission context
  | "chamber-scoped"  // only nodes relevant to a chamber
  | "graph-traverse"; // follow edges from a seed node

export interface KnowledgeQuery {
  mode:         KnowledgeQueryMode;
  text?:        string;
  tags?:        string[];
  missionId?:   string;
  chamber?:     string;
  seedNodeId?:  string;          // for graph-traverse mode
  edgeKinds?:   KnowledgeEdgeKind[];
  maxDepth?:    number;          // for graph-traverse mode
  minConfidence?: number;
  maxResults:   number;
  includeStatuses?: KnowledgeNodeStatus[];
}

export interface KnowledgeQueryResult {
  nodes:     KnowledgeNode[];
  queryId:   string;
  executedAt: number;
  /** How the system arrived at these results */
  rationale: string;
}

// ─── KNOWLEDGE WRITE CONTRACT ─────────────────────────────────────────────────

export type KnowledgeWriteKind =
  | "create"          // new node
  | "update"          // update existing node body or confidence
  | "connect"         // add an edge between existing nodes
  | "consolidate"     // merge two nodes into one higher-confidence node
  | "deprecate"       // mark a node as superseded
  | "quarantine";     // flag for review

export interface KnowledgeWriteContract {
  kind:       KnowledgeWriteKind;
  actorId:    string;
  missionId?: string;
  /** For create/update — the node payload */
  node?:      Partial<KnowledgeNode>;
  /** For connect — edge definition */
  edge?:      { fromId: string; toId: string; edgeKind: KnowledgeEdgeKind; weight: number; reason: string };
  /** For consolidate — IDs to merge */
  mergeIds?:  string[];
  auditId?:   string;
}

// ─── KNOWLEDGE LAWS ───────────────────────────────────────────────────────────

export const KNOWLEDGE_LAWS: readonly string[] = [
  "Knowledge is persistent — it does not die when a session ends.",
  "Knowledge is connected — isolated nodes are incomplete; the graph is the value.",
  "Knowledge is mission-grounded — every node carries a provenance chain to a mission.",
  "Knowledge surfaces answers, not documents — relevance is derived, not enumerated.",
  "Knowledge expires — stale, unvalidated nodes are quarantined before they mislead.",
  "Knowledge is sovereign — it belongs to the operator, not a cloud vendor.",
  "Knowledge cannot be siloed per chamber — the graph is shared across all chambers.",
  "Knowledge is written with governance — every write carries an audit record and actor attribution.",
] as const;

export const KNOWLEDGE_REJECTS: readonly string[] = [
  "knowledge that dies when the session ends",
  "documentation that is never read",
  "search that returns documents not answers",
  "knowledge silos per chamber or per operator",
  "Notion wikis",
  "Confluence",
  "static documentation",
  "disconnected note systems",
] as const;

// ─── RUNTIME HELPERS ──────────────────────────────────────────────────────────

export function buildKnowledgeNodeId(): string {
  return `kn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildKnowledgeQueryId(): string {
  return `kq_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildKnowledgeNode(
  params: Omit<KnowledgeNode, "id" | "createdAt" | "updatedAt" | "connections">,
): KnowledgeNode {
  const now = Date.now();
  return {
    ...params,
    id:          buildKnowledgeNodeId(),
    connections: [],
    createdAt:   now,
    updatedAt:   now,
  };
}

export function isNodeLive(node: KnowledgeNode): boolean {
  return node.status === "live" && (node.expiresAt == null || node.expiresAt > Date.now());
}

export function connectNodes(
  from: KnowledgeNode,
  to:   KnowledgeNode,
  kind: KnowledgeEdgeKind,
  weight: number,
  reason: string,
): void {
  from.connections.push({ targetId: to.id, kind, weight, reason, createdAt: Date.now() });
  from.updatedAt = Date.now();
}
