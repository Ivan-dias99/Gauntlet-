/**
 * RUBERRA STACK 08 — System Awareness
 * Resource health, anomaly detection, and system model substrate.
 *
 * Awareness is not monitoring theater. It is the sovereign system
 * knowing its own operational truth at any given moment.
 *
 * The system knows: what it is consuming, whether it is healthy,
 * what anomalies are active, and what state each mission is in.
 *
 * DO NOT build dashboards from this. DO NOT wire to Datadog or Sentry.
 * Awareness is internal system intelligence — not external observability.
 */

import { assertStackOrder } from "./canon-sovereignty";
import { type MissionId } from "./mission-substrate";

// ─── Stack order guard ────────────────────────────────────────────────────────

const _g = assertStackOrder("awareness", ["canon", "mission", "intelligence", "operations"]);
if (!_g.valid) {
  console.warn("[Ruberra System Awareness] Stack order violation:", _g.reason);
}

// ─── RESOURCE SNAPSHOT ───────────────────────────────────────────────────────

/**
 * A point-in-time snapshot of system resource consumption.
 * All values are best-effort client estimates — not kernel-level metrics.
 * The snapshot is the raw material for health derivation and anomaly detection.
 */
export interface ResourceSnapshot {
  memoryMb:          number;   // Estimated JS heap usage in MB
  storageKb:         number;   // Estimated localStorage usage in KB
  activeConnections: number;   // Active external connections (fetch, websocket)
  latencyMs:         number;   // Latest observed request latency in ms
  at:                number;   // Unix ms timestamp of this snapshot
}

/**
 * Build a current ResourceSnapshot from available browser APIs.
 * Falls back to zeros for unavailable APIs — never throws.
 */
export function buildResourceSnapshot(): ResourceSnapshot {
  const at = Date.now();

  // Memory — performance.memory is non-standard but widely available
  let memoryMb = 0;
  try {
    const perf = performance as unknown as {
      memory?: { usedJSHeapSize: number };
    };
    if (perf.memory?.usedJSHeapSize) {
      memoryMb = Math.round(perf.memory.usedJSHeapSize / (1024 * 1024));
    }
  } catch { /* unavailable */ }

  // Storage — estimate localStorage usage
  let storageKb = 0;
  try {
    let bytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) ?? "";
      const val = localStorage.getItem(key) ?? "";
      bytes += (key.length + val.length) * 2;
    }
    storageKb = Math.round(bytes / 1024);
  } catch { /* unavailable */ }

  return {
    memoryMb,
    storageKb,
    activeConnections: 0,    // Cannot reliably enumerate from client — caller must inject
    latencyMs:         0,    // Caller injects from observed request timing
    at,
  };
}

// ─── SYSTEM HEALTH SIGNAL ─────────────────────────────────────────────────────

/**
 * The sovereign health signal — one word, sovereign truth.
 * healthy  — all systems nominal
 * degraded — one or more subsystems under stress but functional
 * critical — system reliability is at risk; operation should be constrained
 * unknown  — insufficient data to determine health
 */
export type SystemHealthSignal = "healthy" | "degraded" | "critical" | "unknown";

// ─── ANOMALY TYPE ────────────────────────────────────────────────────────────

export type AnomalyType =
  | "latency_spike"
  | "memory_pressure"
  | "connection_drop"
  | "model_timeout"
  | "storage_near_full"
  | "unexpected_state";

export const ANOMALY_LABEL: Record<AnomalyType, string> = {
  latency_spike:      "latency spike",
  memory_pressure:    "memory pressure",
  connection_drop:    "connection drop",
  model_timeout:      "model timeout",
  storage_near_full:  "storage near full",
  unexpected_state:   "unexpected state",
} as const;

// ─── SYSTEM ANOMALY ──────────────────────────────────────────────────────────

/**
 * A detected system anomaly is a point-in-time deviation from expected behavior.
 * Anomalies are detected, held, resolved — not accumulated into a log wall.
 * Only unresolved anomalies affect the health signal.
 */
export interface SystemAnomaly {
  id:          string;
  type:        AnomalyType;
  severity:    "low" | "medium" | "high";
  description: string;
  detectedAt:  number;
  resolved:    boolean;
}

// ─── ANOMALY DETECTION ───────────────────────────────────────────────────────

/** Thresholds that govern anomaly detection. Pure constants — no side effects. */
const THRESHOLDS = {
  latencySpike:      2000,    // ms — above this is a latency spike
  memoryPressure:    200,     // MB — above this is memory pressure
  memoryHigh:        512,     // MB — above this is severe memory pressure
  storageNearFull:   3500,    // KB — above this is storage near full (4MB limit)
  storageCritical:   3900,    // KB — above this is critical
} as const;

/**
 * Detect anomalies from a current snapshot, optionally compared to a prior snapshot.
 * Returns only newly detected anomalies — resolved state is managed separately.
 * Pure function — no side effects.
 */
export function detectAnomalies(
  snapshot: ResourceSnapshot,
  prev?: ResourceSnapshot,
): SystemAnomaly[] {
  const anomalies: SystemAnomaly[] = [];
  const now = snapshot.at;

  // Latency spike
  if (snapshot.latencyMs > THRESHOLDS.latencySpike) {
    anomalies.push({
      id:          `anomaly_${now}_lat`,
      type:        "latency_spike",
      severity:    snapshot.latencyMs > THRESHOLDS.latencySpike * 2 ? "high" : "medium",
      description: `Request latency at ${snapshot.latencyMs}ms — above ${THRESHOLDS.latencySpike}ms threshold.`,
      detectedAt:  now,
      resolved:    false,
    });
  }

  // Memory pressure
  if (snapshot.memoryMb > THRESHOLDS.memoryPressure) {
    anomalies.push({
      id:          `anomaly_${now}_mem`,
      type:        "memory_pressure",
      severity:    snapshot.memoryMb > THRESHOLDS.memoryHigh ? "high" : "medium",
      description: `JS heap at ${snapshot.memoryMb}MB — above ${THRESHOLDS.memoryPressure}MB threshold.`,
      detectedAt:  now,
      resolved:    false,
    });
  }

  // Storage near full
  if (snapshot.storageKb > THRESHOLDS.storageNearFull) {
    anomalies.push({
      id:          `anomaly_${now}_stor`,
      type:        "storage_near_full",
      severity:    snapshot.storageKb > THRESHOLDS.storageCritical ? "high" : "low",
      description: `LocalStorage at ${snapshot.storageKb}KB — approaching 4MB limit.`,
      detectedAt:  now,
      resolved:    false,
    });
  }

  // Connection drop — detect if prior had connections and now has none
  if (prev && prev.activeConnections > 0 && snapshot.activeConnections === 0) {
    anomalies.push({
      id:          `anomaly_${now}_conn`,
      type:        "connection_drop",
      severity:    "medium",
      description: `Active connections dropped from ${prev.activeConnections} to 0.`,
      detectedAt:  now,
      resolved:    false,
    });
  }

  return anomalies;
}

// ─── HEALTH DERIVATION ───────────────────────────────────────────────────────

/**
 * Derive the system health signal from a snapshot and the active anomalies.
 * Health is purely a function of current state — pure function, no side effects.
 */
export function deriveSystemHealth(
  snapshot: ResourceSnapshot,
  anomalies: SystemAnomaly[],
): SystemHealthSignal {
  if (snapshot.memoryMb === 0 && snapshot.storageKb === 0 && snapshot.at === 0) {
    return "unknown";
  }

  const active = anomalies.filter((a) => !a.resolved);

  if (active.some((a) => a.severity === "high"))   return "critical";
  if (active.some((a) => a.severity === "medium"))  return "degraded";
  if (active.length > 0)                            return "degraded";
  return "healthy";
}

// ─── AWARENESS INSIGHT ───────────────────────────────────────────────────────

/**
 * An awareness insight is a synthesized observation surfaced by the system.
 * Insights are sparse — only produced when the system has something meaningful to say.
 * Not an event stream. Not a log. A sovereign observation.
 */
export interface AwarenessInsight {
  id:       string;
  type:     "resource" | "trajectory" | "anomaly" | "recovery";
  headline: string;   // One line — what the system observed
  at:       number;
}

export function buildAwarenessInsight(
  type: AwarenessInsight["type"],
  headline: string,
): AwarenessInsight {
  return {
    id:       `insight_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    headline,
    at:       Date.now(),
  };
}

// ─── SYSTEM MODEL ────────────────────────────────────────────────────────────

/**
 * The system model is the living, unified self-image of the Ruberra runtime.
 * It knows the current resource state, its health signal, all active anomalies,
 * and the operational state of each tracked mission.
 *
 * The system model is updated by the awareness substrate — never by UI layers.
 */
export interface SystemModel {
  snapshot:      ResourceSnapshot;
  health:        SystemHealthSignal;
  anomalies:     SystemAnomaly[];
  missionStates: Record<MissionId, "running" | "idle" | "blocked" | "planning" | "active" | "paused" | "completed" | "archived">;
  lastUpdated:   number;
}

export function defaultSystemModel(): SystemModel {
  return {
    snapshot: {
      memoryMb:          0,
      storageKb:         0,
      activeConnections: 0,
      latencyMs:         0,
      at:                0,
    },
    health:        "unknown",
    anomalies:     [],
    missionStates: {},
    lastUpdated:   Date.now(),
  };
}

/**
 * Update the system model with a new snapshot.
 * Detects new anomalies, derives health, retains unresolved prior anomalies.
 * Pure function — returns a new SystemModel, does not mutate.
 */
export function updateSystemModel(
  model: SystemModel,
  snapshot: ResourceSnapshot,
): SystemModel {
  const newAnomalies     = detectAnomalies(snapshot, model.snapshot.at > 0 ? model.snapshot : undefined);
  const retainedPrior    = model.anomalies.filter((a) => !a.resolved);
  const allAnomalies     = [...retainedPrior, ...newAnomalies];
  const health           = deriveSystemHealth(snapshot, allAnomalies);

  return {
    ...model,
    snapshot,
    health,
    anomalies:   allAnomalies,
    lastUpdated: Date.now(),
  };
}

export function resolveAnomaly(model: SystemModel, anomalyId: string): SystemModel {
  return {
    ...model,
    anomalies:   model.anomalies.map((a) => a.id === anomalyId ? { ...a, resolved: true } : a),
    lastUpdated: Date.now(),
  };
}

export function setMissionState(
  model: SystemModel,
  missionId: MissionId,
  state: "running" | "idle" | "blocked" | "planning" | "active" | "paused" | "completed" | "archived",
): SystemModel {
  const anomalyId = `anomaly_mission_${missionId}`;
  let anomalies = model.anomalies;

  if (state === "blocked") {
    // Inject mission-blocked anomaly if not already present
    const alreadyPresent = anomalies.some((a) => a.id === anomalyId && !a.resolved);
    if (!alreadyPresent) {
      const now = Date.now();
      anomalies = [
        ...anomalies,
        {
          id:          anomalyId,
          type:        "unexpected_state" as AnomalyType,
          severity:    "medium" as const,
          description: `Mission blocked — cannot advance without resolution. Mission: ${missionId.slice(0, 40)}`,
          detectedAt:  now,
          resolved:    false,
        },
      ];
    }
  } else {
    // Resolve mission-blocked anomaly when returning to running/idle
    anomalies = anomalies.map((a) =>
      a.id === anomalyId && !a.resolved ? { ...a, resolved: true } : a
    );
  }

  const health = deriveSystemHealth(model.snapshot, anomalies);

  return {
    ...model,
    missionStates: { ...model.missionStates, [missionId]: state },
    anomalies,
    health,
    lastUpdated:   Date.now(),
  };
}

// ─── SYSTEM AWARENESS STATE ───────────────────────────────────────────────────

/**
 * The unified system awareness envelope.
 * Holds the live system model and accumulated insights.
 */
export interface SystemAwarenessState {
  model:       SystemModel;
  insights:    AwarenessInsight[];
  lastUpdated: number;
}

export function defaultSystemAwarenessState(): SystemAwarenessState {
  return {
    model:       defaultSystemModel(),
    insights:    [],
    lastUpdated: Date.now(),
  };
}
