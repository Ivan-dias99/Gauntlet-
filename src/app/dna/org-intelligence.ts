/**
 * RUBERRA STACK 18 — Organizational Intelligence
 * Maps team capability, mission health, and execution quality.
 * Not HR software. Not a team dashboard.
 *
 * Org intelligence is the sovereign model of how a collective
 * of operators executes missions — what works, what doesn't.
 */

import { assertStackOrder } from "./canon-sovereignty";
import { type MissionId } from "./mission-substrate";

const _g = assertStackOrder("org", ["operations", "awareness", "analytics"]);
if (!_g.valid) console.warn("[Ruberra Org Intelligence] Stack order violation:", _g.reason);

// ─── Capability mapping ───────────────────────────────────────────────────────

export type CapabilityDomain =
  | "investigation"   // Lab — research, analysis, discovery
  | "mastery"         // School — learning, synthesis, teaching
  | "construction"    // Creation — building, shipping, coding
  | "governance"      // Governance, audit, policy
  | "orchestration"   // Multi-agent coordination
  | "intelligence"    // AI/model operation and tuning
  | "security";       // Security and trust management

export type CapabilityLevel = "novice" | "practitioner" | "expert" | "sovereign";

export const CAPABILITY_LEVEL_SCORE: Record<CapabilityLevel, number> = {
  novice: 1, practitioner: 2, expert: 3, sovereign: 4,
} as const;

export interface CapabilityRecord {
  operatorId:  string;
  domain:      CapabilityDomain;
  level:       CapabilityLevel;
  evidence:    string[];    // Missions or actions that demonstrate this capability
  updatedAt:   number;
}

export interface TeamCapabilityMap {
  operatorCapabilities: Record<string, CapabilityRecord[]>; // operatorId → records
  domainCoverage:       Record<CapabilityDomain, number>;   // domain → avg score
  gaps:                 CapabilityDomain[];                 // Domains with no expert coverage
  lastMapped:          number;
}

export function defaultCapabilityMap(): TeamCapabilityMap {
  const domains: CapabilityDomain[] = ["investigation","mastery","construction","governance","orchestration","intelligence","security"];
  return {
    operatorCapabilities: {},
    domainCoverage: Object.fromEntries(domains.map((d) => [d, 0])) as Record<CapabilityDomain, number>,
    gaps: [...domains],
    lastMapped: Date.now(),
  };
}

export function recordCapability(
  map: TeamCapabilityMap,
  record: CapabilityRecord
): TeamCapabilityMap {
  const existing = map.operatorCapabilities[record.operatorId] ?? [];
  const updated  = [...existing.filter((r) => r.domain !== record.domain), record];
  const all      = { ...map.operatorCapabilities, [record.operatorId]: updated };

  // Recompute domain coverage
  const domains = Object.keys(map.domainCoverage) as CapabilityDomain[];
  const coverage = Object.fromEntries(domains.map((domain) => {
    const records = Object.values(all).flatMap((rs) => rs.filter((r) => r.domain === domain));
    if (records.length === 0) return [domain, 0];
    const avg = records.reduce((s, r) => s + CAPABILITY_LEVEL_SCORE[r.level], 0) / records.length;
    return [domain, avg];
  })) as Record<CapabilityDomain, number>;

  const gaps = domains.filter((d) => coverage[d] < CAPABILITY_LEVEL_SCORE["practitioner"]);

  return { ...map, operatorCapabilities: all, domainCoverage: coverage, gaps, lastMapped: Date.now() };
}

// ─── Mission health ───────────────────────────────────────────────────────────

export type MissionHealthStatus = "thriving" | "nominal" | "at_risk" | "failing" | "stalled";

export interface MissionHealthRecord {
  missionId:    MissionId;
  status:       MissionHealthStatus;
  velocityScore: number;    // 0–1
  qualityScore:  number;    // 0–1
  blockerCount:  number;
  runCount:      number;
  lastAssessedAt: number;
}

export function assessMissionHealth(
  missionId: MissionId,
  velocity: number,
  quality: number,
  blockers: number,
  runs: number
): MissionHealthRecord {
  const composite = (velocity * 0.4) + (quality * 0.4) + (blockers === 0 ? 0.2 : Math.max(0, 0.2 - blockers * 0.05));
  const status: MissionHealthStatus =
    composite > 0.8                 ? "thriving" :
    composite > 0.6                 ? "nominal"  :
    composite > 0.4                 ? "at_risk"  :
    runs === 0                      ? "stalled"  : "failing";

  return {
    missionId,
    status,
    velocityScore: velocity,
    qualityScore:  quality,
    blockerCount:  blockers,
    runCount:      runs,
    lastAssessedAt: Date.now(),
  };
}

// ─── Execution quality ────────────────────────────────────────────────────────

export type ExecutionQualityDimension =
  | "decision_clarity"    // Decisions are clear and documented
  | "scope_adherence"     // Work stays within defined scope
  | "handoff_fidelity"    // Context is preserved across handoffs
  | "recovery_speed"      // How quickly blockers are resolved
  | "output_coherence";   // Outputs are coherent with mission objectives

export interface ExecutionQualityScore {
  operatorId:  string;
  missionId:   MissionId;
  dimensions:  Record<ExecutionQualityDimension, number>; // 0–1
  composite:   number;
  measuredAt:  number;
}

export function measureExecutionQuality(
  operatorId: string,
  missionId: MissionId,
  dimensions: Record<ExecutionQualityDimension, number>
): ExecutionQualityScore {
  const values = Object.values(dimensions);
  const composite = values.reduce((s, v) => s + v, 0) / Math.max(values.length, 1);
  return { operatorId, missionId, dimensions, composite, measuredAt: Date.now() };
}

// ─── Org insights ─────────────────────────────────────────────────────────────

export interface OrgInsight {
  id:          string;
  type:        "gap" | "strength" | "risk" | "opportunity";
  headline:    string;
  detail:      string;
  actionable:  boolean;
  at:          number;
}

export function surfaceOrgInsights(
  capMap: TeamCapabilityMap,
  healthRecords: MissionHealthRecord[]
): OrgInsight[] {
  const insights: OrgInsight[] = [];
  const now = Date.now();

  for (const gap of capMap.gaps) {
    insights.push({
      id:         `oi_${now}_${gap}`,
      type:       "gap",
      headline:   `No expert coverage in ${gap}`,
      detail:     `Domain "${gap}" lacks practitioner-level or above coverage in the team.`,
      actionable: true,
      at:         now,
    });
  }

  const failingMissions = healthRecords.filter((h) => h.status === "failing" || h.status === "stalled");
  for (const m of failingMissions) {
    insights.push({
      id:         `oi_${now}_${m.missionId}`,
      type:       "risk",
      headline:   `Mission ${m.missionId} is ${m.status}`,
      detail:     `Velocity: ${(m.velocityScore * 100).toFixed(0)}% — Quality: ${(m.qualityScore * 100).toFixed(0)}% — Blockers: ${m.blockerCount}`,
      actionable: true,
      at:         now,
    });
  }

  return insights;
}

// ─── Unified state ────────────────────────────────────────────────────────────

export interface OrgIntelligenceState {
  capabilityMap:   TeamCapabilityMap;
  missionHealth:   MissionHealthRecord[];
  qualityScores:   ExecutionQualityScore[];
  insights:        OrgInsight[];
  lastUpdated:     number;
}

export function defaultOrgState(): OrgIntelligenceState {
  return {
    capabilityMap: defaultCapabilityMap(),
    missionHealth: [],
    qualityScores: [],
    insights:      [],
    lastUpdated:   Date.now(),
  };
}
