/**
 * RUBERRA AWARENESS SUBSTRATE — Stack 08: System Awareness
 * Constitutional Layer · Substrate · Installed 2026-04-01
 *
 * The system has a live, accurate model of its own state, health,
 * resources, and trajectory. It surfaces anomalies before operators
 * notice them.
 *
 * Anti-patterns rejected:
 *   — reactive alerting only
 *   — monitoring that requires operator interpretation
 *   — status that is always green
 *   — health checks that are decorative
 *
 * Dependencies: canon, mission, intelligence, operations
 */

// ─── HEALTH DIMENSIONS ───────────────────────────────────────────────────────

export type HealthDimension =
  | "intelligence"    // model routing and inference layer
  | "operations"      // workflow and execution layer
  | "governance"      // audit trail and trust gate layer
  | "knowledge"       // knowledge graph and memory layer
  | "connectors"      // external connector availability
  | "missions"        // active mission execution health
  | "agents"          // pioneer and subagent health
  | "flow"            // autonomous flow execution health
  | "platform";       // infrastructure and runtime health

export type HealthSignal = "nominal" | "degraded" | "critical" | "unknown";

export interface DimensionHealth {
  dimension:   HealthDimension;
  signal:      HealthSignal;
  score:       number;           // 0.0 – 1.0 (1.0 = fully nominal)
  lastChecked: number;
  description: string;
  anomalies:   AnomalyRecord[];
}

// ─── SYSTEM HEALTH MODEL ─────────────────────────────────────────────────────

export interface SystemHealthModel {
  /** Monotonic snapshot timestamp */
  snapshotAt:       number;
  /** Aggregate signal — worst across all dimensions */
  aggregate:        HealthSignal;
  /** Aggregate score — weighted mean across dimensions */
  aggregateScore:   number;
  dimensions:       DimensionHealth[];
  /** Active unresolved anomalies */
  openAnomalies:    AnomalyRecord[];
  /** System self-assessment of its own capability right now */
  capabilityModel:  CapabilityModel;
  /** Resource trajectory — trending up/down/stable */
  trajectory:       ResourceTrajectory;
}

// ─── ANOMALY DETECTION ───────────────────────────────────────────────────────

export type AnomalyClass =
  | "latency-spike"       // response time anomaly
  | "error-rate-rise"     // error frequency increase
  | "model-unavailable"   // intelligence provider not reachable
  | "connector-failure"   // external connector failing
  | "flow-stall"          // autonomous flow stuck beyond threshold
  | "agent-unresponsive"  // pioneer or subagent not responding
  | "mission-overdue"     // mission past expected completion window
  | "knowledge-stale"     // knowledge graph not updated within expected window
  | "governance-gap"      // audit trail has unexpected gaps
  | "resource-exhaustion" // compute, token, or storage limit approaching
  | "cascade-risk"        // pattern suggests impending cascade failure
  | "identity-drift";     // system behavior diverging from Ruberra identity

export type AnomalySeverity = "low" | "medium" | "high" | "critical" | "sovereign";

export type AnomalyState = "open" | "acknowledged" | "resolved" | "escalated";

export interface AnomalyRecord {
  id:           string;
  class:        AnomalyClass;
  severity:     AnomalySeverity;
  dimension:    HealthDimension;
  state:        AnomalyState;
  detectedAt:   number;
  resolvedAt?:  number;
  description:  string;
  /** What the system recommends to resolve */
  recommendation: string;
  /** Metric values that triggered this anomaly */
  triggerValues: Record<string, number | string>;
  /** Related mission IDs if mission-scoped */
  missionIds:   string[];
  /** Related agent IDs if agent-scoped */
  agentIds:     string[];
  /** Audit record IDs relevant to this anomaly */
  auditIds:     string[];
}

// ─── CAPABILITY MODEL ─────────────────────────────────────────────────────────

export type CapabilityTier = "full" | "reduced" | "minimal" | "unavailable";

export interface CapabilityState {
  capability:   string;
  tier:         CapabilityTier;
  reason?:      string;
  degradedSince?: number;
}

export interface CapabilityModel {
  intelligence:  CapabilityTier;
  operations:    CapabilityTier;
  knowledge:     CapabilityTier;
  governance:    CapabilityTier;
  collective:    CapabilityTier;
  distribution:  CapabilityTier;
  details:       CapabilityState[];
  /** True if the system can accept new missions right now */
  acceptingMissions: boolean;
  /** True if autonomous flows can be triggered right now */
  flowsEnabled:  boolean;
  /** True if multi-agent spawning is safe right now */
  agentsEnabled: boolean;
}

// ─── RESOURCE TRAJECTORY ─────────────────────────────────────────────────────

export type TrendDirection = "rising" | "falling" | "stable" | "volatile";

export interface ResourceMetric {
  name:      string;
  current:   number;
  unit:      string;
  trend:     TrendDirection;
  threshold: number;         // value at which alert fires
  critical:  number;         // value at which action must be taken
}

export interface ResourceTrajectory {
  sampledAt:  number;
  metrics:    ResourceMetric[];
  /** Projected time to threshold breach — null if stable */
  ttsBreachMs: number | null;
  /** Projected time to critical — null if stable */
  ttcBreachMs: number | null;
}

// ─── AWARENESS PROBE ──────────────────────────────────────────────────────────

/**
 * A probe is a typed measurement that the awareness system executes
 * on a schedule to build the SystemHealthModel.
 */
export type ProbeKind =
  | "ping"           // liveness check — pass/fail
  | "latency"        // response time measurement
  | "count"          // object count (active missions, open flows, etc.)
  | "rate"           // event rate over window
  | "ratio"          // error_count / total_count
  | "drift";         // structural diff against canonical baseline

export interface AwarenessProbe {
  id:          string;
  kind:        ProbeKind;
  dimension:   HealthDimension;
  label:       string;
  /** Interval in ms at which this probe should execute */
  intervalMs:  number;
  /** Thresholds that trigger anomaly creation */
  thresholds: {
    degraded:  number;
    critical:  number;
  };
  /** Human-readable interpretation of a high value */
  highMeans:   string;
}

export const RUBERRA_AWARENESS_PROBES: Readonly<AwarenessProbe[]> = [
  {
    id:         "intelligence-latency",
    kind:       "latency",
    dimension:  "intelligence",
    label:      "Intelligence Layer Latency",
    intervalMs: 30_000,
    thresholds: { degraded: 3000, critical: 10_000 },
    highMeans:  "Model routing or inference is slow — missions will experience delay.",
  },
  {
    id:         "active-mission-count",
    kind:       "count",
    dimension:  "missions",
    label:      "Active Mission Count",
    intervalMs: 60_000,
    thresholds: { degraded: 50, critical: 200 },
    highMeans:  "Mission volume is high — check flow and agent capacity.",
  },
  {
    id:         "flow-stall-rate",
    kind:       "ratio",
    dimension:  "flow",
    label:      "Flow Stall Rate",
    intervalMs: 60_000,
    thresholds: { degraded: 0.05, critical: 0.2 },
    highMeans:  "More than 5% of autonomous flows are stalling — investigate trigger and recovery logic.",
  },
  {
    id:         "governance-gap-check",
    kind:       "drift",
    dimension:  "governance",
    label:      "Audit Trail Continuity",
    intervalMs: 120_000,
    thresholds: { degraded: 1, critical: 5 },
    highMeans:  "Audit trail has gaps — silent actions may be occurring.",
  },
  {
    id:         "connector-error-rate",
    kind:       "rate",
    dimension:  "connectors",
    label:      "Connector Error Rate",
    intervalMs: 30_000,
    thresholds: { degraded: 5, critical: 20 },
    highMeans:  "Connector failure rate is elevated — external integrations may be degraded.",
  },
  {
    id:         "identity-drift-check",
    kind:       "drift",
    dimension:  "platform",
    label:      "Identity Drift Check",
    intervalMs: 300_000,
    thresholds: { degraded: 1, critical: 3 },
    highMeans:  "System behavior is diverging from Ruberra canonical identity — anti-drift enforcement needed.",
  },
] as const;

// ─── AWARENESS LAWS ───────────────────────────────────────────────────────────

export const AWARENESS_LAWS: readonly string[] = [
  "The system always has a live, accurate model of its own state.",
  "Anomalies are surfaced proactively — operators are never surprised by system failures.",
  "Status that is always green is evidence of broken monitoring, not of system health.",
  "The capability model is honest — it never overclaims what the system can do right now.",
  "Trajectory is forward-looking — awareness predicts failure, it does not only record it.",
  "Identity drift is a monitored anomaly class — behavioral divergence from Ruberra law is detectable.",
  "Awareness data feeds governance — every anomaly produces an audit record.",
] as const;

export const AWARENESS_REJECTS: readonly string[] = [
  "manual monitoring dashboards",
  "reactive alerting without prediction",
  "status pages that are always green",
  "health checks that require operator interpretation",
  "monitoring decoupled from action",
  "anomaly detection with no recommendation",
] as const;

// ─── RUNTIME HELPERS ──────────────────────────────────────────────────────────

export function buildAnomalyId(): string {
  return `anomaly_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildAnomalyRecord(
  params: Omit<AnomalyRecord, "id" | "detectedAt">,
): AnomalyRecord {
  return { ...params, id: buildAnomalyId(), detectedAt: Date.now() };
}

export function aggregateHealth(dimensions: DimensionHealth[]): HealthSignal {
  if (dimensions.length === 0) return "unknown";
  if (dimensions.some((d) => d.signal === "critical")) return "critical";
  if (dimensions.some((d) => d.signal === "degraded")) return "degraded";
  if (dimensions.some((d) => d.signal === "unknown"))  return "unknown";
  return "nominal";
}

export function defaultCapabilityModel(): CapabilityModel {
  return {
    intelligence:     "full",
    operations:       "full",
    knowledge:        "full",
    governance:       "full",
    collective:       "full",
    distribution:     "full",
    details:          [],
    acceptingMissions: true,
    flowsEnabled:      true,
    agentsEnabled:     true,
  };
}

export function defaultSystemHealthModel(): SystemHealthModel {
  return {
    snapshotAt:     Date.now(),
    aggregate:      "unknown",
    aggregateScore: 1.0,
    dimensions:     [],
    openAnomalies:  [],
    capabilityModel: defaultCapabilityModel(),
    trajectory: {
      sampledAt:   Date.now(),
      metrics:     [],
      ttsBreachMs: null,
      ttcBreachMs: null,
    },
  };
}
