/**
 * RUBERRA STACK 12 — Intelligence Analytics
 * Patterns, predictions, and strategic intelligence.
 *
 * Analytics is not a dashboard. It is a sovereign intelligence layer
 * that reveals what the system knows about itself.
 */

import { assertStackOrder } from "./canon-sovereignty";
import { type MissionId } from "./mission-substrate";

const _g = assertStackOrder("analytics", ["intelligence", "awareness", "knowledge"]);
if (!_g.valid) console.warn("[Ruberra Intelligence Analytics] Stack order violation:", _g.reason);

// ─── Dimensions ───────────────────────────────────────────────────────────────

export type AnalyticsDimension =
  | "velocity"         // Speed of mission progression
  | "quality"          // Output and decision quality
  | "depth"            // Reasoning and investigation depth
  | "coverage"         // Scope coverage vs mission boundaries
  | "reliability"      // Consistency of execution
  | "compound_growth"; // How much advantage is compounding

export const DIMENSION_LABEL: Record<AnalyticsDimension, string> = {
  velocity:       "velocity",
  quality:        "quality",
  depth:          "depth",
  coverage:       "coverage",
  reliability:    "reliability",
  compound_growth:"compound growth",
} as const;

// ─── Patterns ─────────────────────────────────────────────────────────────────

export type PatternType =
  | "recurring_blocker"    // The same type of blocker appears repeatedly
  | "success_pattern"      // A sequence that consistently produces good outcomes
  | "performance_trend"    // A directional change in quality or speed
  | "knowledge_gap"        // A recurring area where knowledge is missing
  | "pioneer_strength"     // A pioneer consistently performs well in a domain
  | "scope_drift"          // Mission scope repeatedly expands beyond boundary
  | "handoff_friction";    // Cross-chamber transfers consistently lose fidelity

export interface AnalyticsPattern {
  id:          string;
  type:        PatternType;
  missionId?:  MissionId;
  confidence:  number;       // 0–1
  headline:    string;       // One-line pattern description
  evidence:    string[];     // Supporting observations
  detectedAt:  number;
  actionable:  boolean;
}

export function createPattern(
  type: PatternType,
  headline: string,
  evidence: string[],
  opts?: { missionId?: MissionId; confidence?: number }
): AnalyticsPattern {
  return {
    id:         `pat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    missionId:  opts?.missionId,
    confidence: opts?.confidence ?? 0.7,
    headline,
    evidence,
    detectedAt: Date.now(),
    actionable: evidence.length >= 2,
  };
}

export function detectPatterns(events: string[]): AnalyticsPattern[] {
  const patterns: AnalyticsPattern[] = [];
  const blockerEvents = events.filter((e) => e.toLowerCase().includes("block"));
  if (blockerEvents.length >= 2) {
    patterns.push(createPattern(
      "recurring_blocker",
      `${blockerEvents.length} blocker events detected`,
      blockerEvents.slice(0, 5),
      { confidence: Math.min(0.95, 0.5 + blockerEvents.length * 0.1) }
    ));
  }
  const successEvents = events.filter((e) => e.toLowerCase().includes("complet") || e.toLowerCase().includes("success"));
  if (successEvents.length >= 3) {
    patterns.push(createPattern(
      "success_pattern",
      `${successEvents.length} successful completions — pattern forming`,
      successEvents.slice(0, 5),
      { confidence: Math.min(0.95, 0.4 + successEvents.length * 0.08) }
    ));
  }
  return patterns;
}

// ─── Predictions ──────────────────────────────────────────────────────────────

export type PredictionTarget =
  | "mission_completion"    // Will the mission complete in the estimated timeframe?
  | "blocker_probability"   // Likelihood of hitting a blocker in the next N steps
  | "quality_score"         // Predicted output quality
  | "time_to_outcome"       // Estimated time to mission outcome
  | "knowledge_saturation"; // When knowledge graph for this mission will stabilize

export type PredictionHorizon = "immediate" | "near" | "medium" | "long";

export const HORIZON_LABEL: Record<PredictionHorizon, string> = {
  immediate: "< 1 hour",
  near:      "1–24 hours",
  medium:    "1–7 days",
  long:      "> 7 days",
} as const;

export interface Prediction {
  id:         string;
  target:     PredictionTarget;
  missionId?: MissionId;
  value:      number;      // 0–1 probability or normalized score
  confidence: number;      // 0–1 confidence in the prediction itself
  horizon:    PredictionHorizon;
  basis:      string[];    // Evidence supporting this prediction
  at:         number;
}

export function buildPrediction(
  target: PredictionTarget,
  missionId: MissionId | undefined,
  evidence: string[],
  horizon: PredictionHorizon = "near"
): Prediction {
  // Heuristic: more evidence = higher confidence, value derived from evidence sentiment
  const positiveSignals = evidence.filter((e) =>
    /success|complet|pass|ready|clear/i.test(e)
  ).length;
  const negativeSignals = evidence.filter((e) =>
    /block|fail|error|miss|gap/i.test(e)
  ).length;
  const total = Math.max(evidence.length, 1);
  const value      = Math.max(0.1, Math.min(0.95, (positiveSignals - negativeSignals * 0.5) / total + 0.5));
  const confidence = Math.min(0.9, 0.3 + evidence.length * 0.07);

  return {
    id:         `pred_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    target,
    missionId,
    value,
    confidence,
    horizon,
    basis:      evidence,
    at:         Date.now(),
  };
}

// ─── Mission analytics ────────────────────────────────────────────────────────

export interface MissionAnalytics {
  missionId:   MissionId;
  dimensions:  Record<AnalyticsDimension, number>; // 0–1 scores
  patterns:    AnalyticsPattern[];
  predictions: Prediction[];
  insights:    AnalyticsInsight[];
  lastUpdated: number;
}

export interface AnalyticsInsight {
  id:         string;
  dimension:  AnalyticsDimension;
  headline:   string;
  value:      number;    // The dimension score
  delta?:     number;    // Change since last measurement
  actionable: boolean;
  at:         number;
}

export function buildAnalyticsInsight(
  dimension: AnalyticsDimension,
  value: number,
  delta?: number
): AnalyticsInsight {
  const low = value < 0.35;
  const high = value > 0.75;
  const headline = low
    ? `${DIMENSION_LABEL[dimension]} is low — review mission execution`
    : high
    ? `${DIMENSION_LABEL[dimension]} is strong`
    : `${DIMENSION_LABEL[dimension]} is nominal`;

  return {
    id:         `ins_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    dimension,
    headline,
    value,
    delta,
    actionable: low,
    at:         Date.now(),
  };
}

export function buildMissionAnalytics(missionId: MissionId): MissionAnalytics {
  const now = Date.now();
  return {
    missionId,
    dimensions: {
      velocity:       0.5,
      quality:        0.5,
      depth:          0.5,
      coverage:       0.5,
      reliability:    0.5,
      compound_growth: 0.0,
    },
    patterns:    [],
    predictions: [],
    insights:    [],
    lastUpdated: now,
  };
}

export function scoreDimension(
  dimension: AnalyticsDimension,
  evidence: string[]
): number {
  const positive = evidence.filter((e) => /good|high|strong|fast|complet|pass|ready/i.test(e)).length;
  const negative = evidence.filter((e) => /low|slow|block|fail|miss|error/i.test(e)).length;
  const base = 0.5;
  const adj  = (positive - negative) / Math.max(evidence.length, 1);
  return Math.max(0.05, Math.min(0.99, base + adj * 0.4));
}

export function deriveInsights(analytics: MissionAnalytics): AnalyticsInsight[] {
  return (Object.entries(analytics.dimensions) as [AnalyticsDimension, number][]).map(
    ([dim, val]) => buildAnalyticsInsight(dim, val)
  );
}

// ─── Unified state ────────────────────────────────────────────────────────────

export interface AnalyticsState {
  missionAnalytics: Record<MissionId, MissionAnalytics>;
  globalPatterns:   AnalyticsPattern[];
  lastUpdated:      number;
}

export function defaultAnalyticsState(): AnalyticsState {
  return { missionAnalytics: {}, globalPatterns: [], lastUpdated: Date.now() };
}
