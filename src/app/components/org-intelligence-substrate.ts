/**
 * RUBERRA ORG INTELLIGENCE SUBSTRATE — Stack 18: Organizational Intelligence
 * Constitutional Layer · Substrate · Installed 2026-04-01
 *
 * Organizational intelligence that maps team capability, mission health,
 * and execution quality — not HR software.
 *
 * Anti-patterns rejected:
 *   — org intelligence as surveillance
 *   — performance metrics decoupled from mission consequence
 *   — team health theater
 *   — HR platforms
 *
 * Dependencies: operations, awareness, analytics
 */

// ─── CAPABILITY MAP ───────────────────────────────────────────────────────────

export type CapabilityDomain =
  | "research"
  | "engineering"
  | "design"
  | "strategy"
  | "execution"
  | "synthesis"
  | "teaching"
  | "governance"
  | "systems-thinking"
  | "domain-specific";   // custom domain defined by the org

export type CapabilityLevel = "emerging" | "proficient" | "expert" | "sovereign";

export interface OperatorCapability {
  domain:       CapabilityDomain;
  domainLabel?: string;           // for domain-specific
  level:        CapabilityLevel;
  /** Evidence from mission execution — not self-assessed */
  evidence:     CapabilityEvidence[];
  lastEvidenceAt: number;
}

export interface CapabilityEvidence {
  missionId:   string;
  description: string;
  quality:     "high" | "medium" | "low";
  recordedAt:  number;
}

export interface OperatorProfile {
  operatorId:    string;
  capabilities:  OperatorCapability[];
  /** Mission IDs the operator has completed — source of capability evidence */
  completedMissionIds: string[];
  /** Domains where this operator's missions have highest consequence rate */
  strongDomains: CapabilityDomain[];
  /** Domains where the operator is developing */
  growthDomains: CapabilityDomain[];
  lastActiveAt:  number;
}

// ─── MISSION ROUTING INTELLIGENCE ────────────────────────────────────────────

/**
 * Org intelligence answers the question: which operator should lead this mission?
 * It routes based on capability evidence, not org charts or seniority.
 */
export interface MissionRoutingQuery {
  missionType:     string;
  requiredDomains: CapabilityDomain[];
  preferredLevel:  CapabilityLevel;
  /** Exclude operators already at mission capacity */
  excludeAtCapacity: boolean;
}

export interface MissionRoutingResult {
  query:         MissionRoutingQuery;
  candidates:    MissionRoutingCandidate[];
  topCandidate?: string;          // operatorId
  rationale:     string;
}

export interface MissionRoutingCandidate {
  operatorId:    string;
  matchScore:    number;         // 0.0–1.0
  matchedDomains: CapabilityDomain[];
  gapDomains:    CapabilityDomain[];
  currentMissionCount: number;
}

// ─── TEAM HEALTH ──────────────────────────────────────────────────────────────

export type TeamHealthSignal = "strong" | "healthy" | "strained" | "at-risk" | "unknown";

export interface TeamHealthModel {
  orgId:          string;
  snapshotAt:     number;
  signal:         TeamHealthSignal;
  /** Active missions vs team capacity */
  capacityRatio:  number;
  /** % of missions completing on time */
  velocityScore:  number;
  /** % of missions with high consequence output */
  qualityScore:   number;
  /** Capability gap areas — skills the org needs but lacks */
  capabilityGaps: CapabilityDomain[];
  /** Operators with no active mission — available for new missions */
  availableOperators: string[];
  /** Operators at or near capacity */
  strainedOperators:  string[];
}

// ─── EXECUTION QUALITY ────────────────────────────────────────────────────────

export type ExecutionQualityTier = "high" | "medium" | "low" | "insufficient-data";

export interface ExecutionQualityRecord {
  operatorId:    string;
  missionId:     string;
  tier:          ExecutionQualityTier;
  /** Percentage of flows that completed without recovery */
  flowCompletion: number;
  /** Percentage of outputs reviewed as high-consequence */
  outputQuality:  number;
  /** Whether mission was completed within expected window */
  onTime:         boolean;
  recordedAt:     number;
}

// ─── ORG INTELLIGENCE LAWS ───────────────────────────────────────────────────

export const ORG_INTELLIGENCE_LAWS: readonly string[] = [
  "Org intelligence is evidence-based — capability is inferred from mission execution, not self-assessment.",
  "Org intelligence is not surveillance — it informs routing, not punishment or monitoring.",
  "Mission routing is consequence-based — the best match for a mission is determined by execution quality evidence.",
  "Capability gaps are a routing signal, not a judgment — they trigger development missions, not performance reviews.",
  "Team health is mission-health — it is measured by consequence output, not activity metrics.",
  "No operator's data is used against them — org intelligence serves missions, not management hierarchy.",
  "Org intelligence feeds analytics — patterns in team capability inform the strategic intelligence layer.",
] as const;

export const ORG_INTELLIGENCE_REJECTS: readonly string[] = [
  "HR platforms",
  "performance review systems",
  "org chart tools",
  "team health dashboards",
  "org intelligence as surveillance",
  "performance metrics decoupled from mission consequence",
  "team health theater",
] as const;

// ─── RUNTIME HELPERS ──────────────────────────────────────────────────────────

export function buildOperatorProfileId(): string {
  return `opro_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function scoreCapabilityMatch(
  operator:   OperatorProfile,
  required:   CapabilityDomain[],
  preferred:  CapabilityLevel,
): number {
  if (required.length === 0) return 0.5;
  const matched = required.filter((d) =>
    operator.capabilities.some(
      (c) => c.domain === d && ["proficient", "expert", "sovereign"].includes(c.level)
    )
  );
  const levelBonus = operator.capabilities.some(
    (c) => required.includes(c.domain) && c.level === preferred
  ) ? 0.1 : 0;
  return Math.min(1.0, (matched.length / required.length) + levelBonus);
}
