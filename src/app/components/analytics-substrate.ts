/**
 * RUBERRA ANALYTICS SUBSTRATE — Stack 12: Intelligence Analytics
 * Constitutional Layer · Substrate · Installed 2026-04-01
 *
 * Deep intelligence analytics that reveal patterns, predict outcomes,
 * and surface strategic intelligence — not dashboards.
 *
 * Anti-patterns rejected:
 *   — vanity metrics
 *   — dashboards that are viewed and forgotten
 *   — analytics decoupled from action
 *   — BI tools that produce no consequence
 *
 * Dependencies: intelligence, awareness, knowledge
 */

// ─── ANALYTIC SIGNAL ─────────────────────────────────────────────────────────

export type AnalyticSignalClass =
  | "pattern"         // recurring structure detected across missions or time
  | "prediction"      // forward projection based on observed trajectory
  | "anomaly"         // unexpected deviation from baseline
  | "opportunity"     // condition favorable to a mission objective
  | "risk"            // condition threatening a mission objective
  | "milestone"       // a threshold reached (positive or negative)
  | "correlation";    // two variables moving together — not yet causal

export type AnalyticSignalStrength = "weak" | "moderate" | "strong" | "definitive";

export type AnalyticActionKind =
  | "review"          // surface to operator for review
  | "route"           // route to a specific chamber or pioneer
  | "spawn-flow"      // trigger an autonomous flow
  | "update-knowledge"// write to knowledge graph
  | "escalate"        // surface as critical signal
  | "log-only";       // record but do not surface

export interface AnalyticSignal {
  id:             string;
  class:          AnalyticSignalClass;
  strength:       AnalyticSignalStrength;
  title:          string;
  description:    string;
  /** What the system recommends to act on this signal */
  recommendedAction: AnalyticActionKind;
  actionPayload:  Record<string, unknown>;
  /** Mission IDs the signal applies to — empty = system-level */
  missionIds:     string[];
  /** Knowledge node IDs that support this signal */
  evidenceNodeIds: string[];
  /** Confidence 0.0–1.0 */
  confidence:     number;
  detectedAt:     number;
  /** Time window the signal covers */
  windowMs:       number;
  acknowledged:   boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: number;
}

// ─── PATTERN RECORD ──────────────────────────────────────────────────────────

export type PatternScope = "operator" | "mission-type" | "chamber" | "agent" | "system";

export interface PatternRecord {
  id:           string;
  scope:        PatternScope;
  title:        string;
  description:  string;
  /** How many times this pattern has been observed */
  occurrences:  number;
  firstSeenAt:  number;
  lastSeenAt:   number;
  /** Missions where this pattern was observed */
  missionIds:   string[];
  /** Signal IDs that generated or confirmed this pattern */
  signalIds:    string[];
  /** Whether this pattern has been promoted to the knowledge graph */
  knowledgeNodeId?: string;
  strength:     AnalyticSignalStrength;
}

// ─── INTELLIGENCE METRIC ──────────────────────────────────────────────────────

export type MetricKind =
  | "mission-velocity"    // missions completed per time unit
  | "execution-quality"   // % of flows that completed without recovery
  | "knowledge-growth"    // new knowledge nodes added per time unit
  | "agent-efficiency"    // output-to-spawns ratio
  | "consequence-rate"    // operator actions that produced real consequence
  | "signal-action-rate"  // % of signals acted upon
  | "pattern-depth"       // average pattern occurrence count
  | "compound-rate";      // rate of cross-mission knowledge reuse

export interface IntelligenceMetric {
  id:        string;
  kind:      MetricKind;
  label:     string;
  value:     number;
  unit:      string;
  direction: "higher-is-better" | "lower-is-better" | "target-band";
  target?:   number;
  band?:     { low: number; high: number };
  sampledAt: number;
  windowMs:  number;
}

// ─── STRATEGIC INTELLIGENCE REPORT ───────────────────────────────────────────

/**
 * A strategic intelligence report is not a dashboard.
 * It surfaces the three most consequential signals right now
 * and the one recommended action for each.
 */
export interface StrategicIntelligenceReport {
  id:             string;
  generatedAt:    number;
  /** The single highest-priority insight */
  primaryInsight: AnalyticSignal;
  /** Top 2–3 supporting signals */
  signals:        AnalyticSignal[];
  /** The one action that would have the most impact right now */
  topRecommendation: string;
  metrics:        IntelligenceMetric[];
  patterns:       PatternRecord[];
  /** Audit record for this report generation */
  auditId?:       string;
}

// ─── ANALYTICS WINDOW ────────────────────────────────────────────────────────

export type AnalyticsWindowKind =
  | "session"         // current operator session
  | "daily"
  | "weekly"
  | "monthly"
  | "mission-lifetime"// from mission creation to completion
  | "all-time";

export interface AnalyticsWindow {
  kind:    AnalyticsWindowKind;
  startMs: number;
  endMs:   number;
}

// ─── ANALYTICS LAWS ──────────────────────────────────────────────────────────

export const ANALYTICS_LAWS: readonly string[] = [
  "Analytics surfaces strategic intelligence — not raw data, not vanity metrics.",
  "Every signal carries a recommended action — analytics without action is decoration.",
  "Patterns are promoted to knowledge — the graph grows from analytic observations.",
  "Predictions are probabilistic — confidence is always explicit, never hidden.",
  "Strategic reports are concise — one primary insight, one top recommendation.",
  "Analytics is mission-grounded — metrics are tied to mission consequence, not system events.",
  "Analytics data is operator-owned — it is never sold, aggregated externally, or used against the operator.",
] as const;

export const ANALYTICS_REJECTS: readonly string[] = [
  "vanity metrics",
  "dashboards that are viewed and forgotten",
  "analytics decoupled from action",
  "BI dashboards",
  "Mixpanel",
  "Amplitude",
  "manual data analysis workflows",
  "metrics that reward activity over consequence",
] as const;

// ─── RUNTIME HELPERS ──────────────────────────────────────────────────────────

export function buildAnalyticSignalId(): string {
  return `sig_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildPatternRecordId(): string {
  return `pat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildStrategicReportId(): string {
  return `sr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildAnalyticSignal(
  params: Omit<AnalyticSignal, "id" | "detectedAt" | "acknowledged">,
): AnalyticSignal {
  return {
    ...params,
    id:          buildAnalyticSignalId(),
    detectedAt:  Date.now(),
    acknowledged: false,
  };
}

export function analyticsWindowFor(kind: AnalyticsWindowKind): AnalyticsWindow {
  const now = Date.now();
  const windowMap: Record<AnalyticsWindowKind, number> = {
    "session":          2 * 60 * 60 * 1000,
    "daily":            24 * 60 * 60 * 1000,
    "weekly":       7 * 24 * 60 * 60 * 1000,
    "monthly":     30 * 24 * 60 * 60 * 1000,
    "mission-lifetime": 0,     // caller provides explicit start
    "all-time":         now,
  };
  return {
    kind,
    startMs: now - (windowMap[kind] ?? 0),
    endMs:   now,
  };
}
