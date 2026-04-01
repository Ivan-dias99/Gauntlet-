/**
 * RUBERRA COMPOUND NETWORK SUBSTRATE — Stack 20: Compound Intelligence Network
 * Constitutional Layer · Substrate · Installed 2026-04-01
 *
 * The compound intelligence network where every mission, every agent,
 * every operator, and every output compounds into a growing advantage
 * that cannot be replicated by starting over.
 *
 * Anti-patterns rejected:
 *   — intelligence that is stateless by design
 *   — systems where starting over is as good as continuing
 *   — platforms that commoditize their own operators
 *   — AI amnesia
 *
 * Dependencies: multiagent, analytics, collective, ecosystem, org, personal
 */

// ─── COMPOUND UNIT ────────────────────────────────────────────────────────────

export type CompoundUnitKind =
  | "knowledge-node"      // a knowledge graph node that has survived and been reinforced
  | "pattern"             // a pattern confirmed across multiple missions
  | "capability-signal"   // an operator capability signal with enough evidence
  | "model-routing"       // a model routing decision confirmed as higher quality
  | "flow-outcome"        // a flow outcome that has improved future flow execution
  | "agent-improvement"   // a domain agent that has accumulated domain history
  | "collective-memory";  // a cross-operator memory that benefits future collectives

export interface CompoundUnit {
  id:              string;
  kind:            CompoundUnitKind;
  /** The underlying object that carries the compound value */
  subjectId:       string;
  /** How many reinforcing events have contributed to this unit */
  reinforcements:  number;
  /** Confidence score derived from reinforcement count and quality 0.0–1.0 */
  confidence:      number;
  /** Operators who have contributed to this compound unit */
  contributorIds:  string[];
  /** Mission IDs that generated reinforcing events */
  missionIds:      string[];
  /** Rate at which this unit is being reinforced (per week) */
  reinforcementRate: number;
  firstCreatedAt:  number;
  lastReinforcedAt: number;
  /** Whether this unit has crossed the threshold to become a durable moat asset */
  matureAsset:     boolean;
}

// ─── COMPOUND GRAPH ───────────────────────────────────────────────────────────

/**
 * The CompoundGraph is the top-level view of the compounding system.
 * It maps how compound units connect to each other and where the
 * deepest compounding is occurring.
 */
export interface CompoundGraph {
  id:              string;
  snapshotAt:      number;
  units:           CompoundUnit[];
  /** Total number of reinforcing events since system inception */
  totalReinforcements: number;
  /** Number of mature moat assets */
  matureAssetCount:  number;
  /** Compound rate — how quickly the graph is growing */
  weeklyGrowthRate:  number;
  /** The single area with the deepest compounding */
  deepestDomain?:    string;
  /** Domains with zero or minimal compounding — gaps */
  compoundingGaps:   string[];
}

// ─── ANTI-AMNESIA LAW ─────────────────────────────────────────────────────────

/**
 * The anti-amnesia system ensures that no knowledge, pattern, or
 * capability signal is lost to session boundaries, model changes,
 * or infrastructure resets.
 */
export type AmnesiaRiskClass =
  | "session-boundary"      // knowledge that lives only in the current session
  | "model-reset"           // knowledge held only in a model's context window
  | "infrastructure-event"  // knowledge at risk from infra changes
  | "operator-departure"    // knowledge held only by one departing operator
  | "stale-node";           // knowledge node past expiry without re-validation

export interface AmnesiaRiskRecord {
  id:           string;
  class:        AmnesiaRiskClass;
  subjectId:    string;
  subjectKind:  string;
  description:  string;
  severity:     "low" | "medium" | "high" | "critical";
  detectedAt:   number;
  mitigated:    boolean;
  mitigatedAt?: number;
  mitigationAction?: string;
}

// ─── COMPOUND ADVANTAGE MODEL ─────────────────────────────────────────────────

/**
 * The compound advantage model quantifies the system's moat — the accumulated
 * intelligence that makes starting over increasingly costly for any operator.
 */
export interface CompoundAdvantageModel {
  operatorId?:     string;   // null = org-level
  snapshotAt:      number;
  /** Estimated cost-to-replicate in operator-hours if they started fresh */
  replicationCost: number;
  /** How long ago the operator started contributing to the compound network */
  networkAgeMs:    number;
  /** Number of cross-mission knowledge reuses */
  knowledgeReuses: number;
  /** Number of times operator patterns saved time vs baseline */
  patternSavings:  number;
  /** Whether the compound advantage has crossed the moat threshold */
  moatActive:      boolean;
  /** The primary domains where the moat is strongest */
  strongMoatDomains: string[];
}

// ─── COMPOUND LAWS ───────────────────────────────────────────────────────────

export const COMPOUND_LAWS: readonly string[] = [
  "Every completed mission compounds — its knowledge, patterns, and outputs are reinforced into the network.",
  "Every agent interaction compounds — domain agents grow more capable with each task.",
  "Operators compound together — collective work produces compound units no single operator could.",
  "The compound network is sovereign — it belongs to the operators who built it, not to Ruberra.",
  "Anti-amnesia is mandatory — no compound unit may be lost to session boundaries or infrastructure events.",
  "Starting over is measurably worse than continuing — the compound advantage is quantifiable.",
  "The compound graph is transparent — operators can see exactly what they have built and what it is worth.",
  "Compound units may be exported and transferred — operators own their compound advantage.",
] as const;

export const COMPOUND_REJECTS: readonly string[] = [
  "isolated intelligence per session",
  "AI that learns nothing from prior work",
  "knowledge that does not compound",
  "intelligence that is stateless by design",
  "systems where starting over is as good as continuing",
  "platforms that commoditize their own operators",
  "AI amnesia — the inability to compound intelligence across time",
] as const;

// ─── MATURITY THRESHOLDS ─────────────────────────────────────────────────────

export const COMPOUND_MATURITY_THRESHOLD = {
  /** Min reinforcements before a unit is considered mature */
  minReinforcements: 5,
  /** Min confidence score for moat designation */
  minConfidence:     0.8,
  /** Min reinforcement rate (per week) to be considered active */
  minWeeklyRate:     1.0,
} as const;

// ─── RUNTIME HELPERS ──────────────────────────────────────────────────────────

export function buildCompoundUnitId(): string {
  return `cu_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildAmnesiaRiskId(): string {
  return `ar_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function isMatureAsset(unit: CompoundUnit): boolean {
  return (
    unit.reinforcements >= COMPOUND_MATURITY_THRESHOLD.minReinforcements &&
    unit.confidence     >= COMPOUND_MATURITY_THRESHOLD.minConfidence      &&
    unit.reinforcementRate >= COMPOUND_MATURITY_THRESHOLD.minWeeklyRate
  );
}

export function computeReplicationCost(units: CompoundUnit[]): number {
  // Estimate: each mature unit with each reinforcement = 1 operator-hour
  return units
    .filter((u) => u.matureAsset)
    .reduce((sum, u) => sum + u.reinforcements, 0);
}

export function buildCompoundUnit(
  params: Omit<CompoundUnit, "id" | "firstCreatedAt" | "matureAsset">,
): CompoundUnit {
  const unit: CompoundUnit = {
    ...params,
    id:            buildCompoundUnitId(),
    firstCreatedAt: Date.now(),
    matureAsset:   false,
  };
  unit.matureAsset = isMatureAsset(unit);
  return unit;
}
