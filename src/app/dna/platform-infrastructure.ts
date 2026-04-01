/**
 * RUBERRA STACK 17 — Platform Infrastructure
 * The infrastructure layer is invisible to operators and sovereign to Ruberra.
 * No cloud vendor lock-in at the application layer.
 *
 * Platform is not DevOps tooling.
 * It is the sovereign substrate beneath every Ruberra operation.
 */

import { assertStackOrder } from "./canon-sovereignty";

const _g = assertStackOrder("platform", ["operations", "security", "governance"]);
if (!_g.valid) console.warn("[Ruberra Platform] Stack order violation:", _g.reason);

// ─── Infrastructure layers ────────────────────────────────────────────────────

export type InfraLayerType =
  | "compute"     // Execution and processing capacity
  | "storage"     // Data persistence
  | "network"     // Connectivity and routing
  | "intelligence"// Model inference infrastructure
  | "edge"        // Edge compute for low-latency presence
  | "security";   // Security infrastructure (keys, certs, vaults)

export type InfraLayerStatus = "nominal" | "degraded" | "offline" | "unknown";

export interface InfraLayer {
  id:           string;
  type:         InfraLayerType;
  provider:     string;     // e.g. "supabase", "cloudflare", "sovereign"
  status:       InfraLayerStatus;
  sovereign:    boolean;    // True = Ruberra owns/controls this; false = vendor dependency
  region?:      string;
  lastHealthAt: number;
  metadata:     Record<string, string>;
}

export function createInfraLayer(
  type: InfraLayerType,
  provider: string,
  sovereign: boolean,
  metadata: Record<string, string> = {}
): InfraLayer {
  return {
    id:           `infra_${type}_${provider.replace(/\W/g, "_")}`,
    type,
    provider,
    status:       "unknown",
    sovereign,
    lastHealthAt: Date.now(),
    metadata,
  };
}

// ─── Resource pool ────────────────────────────────────────────────────────────

export type ResourceUnit = "vcpu" | "mb_ram" | "gb_storage" | "req_per_sec" | "token_per_min";

export interface ResourcePool {
  layerId:     string;
  unit:        ResourceUnit;
  total:       number;
  used:        number;
  reserved:    number;
  lastUpdated: number;
}

export function available(pool: ResourcePool): number {
  return Math.max(0, pool.total - pool.used - pool.reserved);
}

export function utilizationRatio(pool: ResourcePool): number {
  if (pool.total === 0) return 0;
  return (pool.used + pool.reserved) / pool.total;
}

// ─── Sovereign deploy ─────────────────────────────────────────────────────────

export type DeployTarget = "edge" | "serverless" | "container" | "static" | "hybrid";
export type DeployStatus = "pending" | "running" | "success" | "failed" | "rolled_back";

export interface SovereignDeploy {
  id:          string;
  target:      DeployTarget;
  artifact:    string;     // Artifact ID or reference
  status:      DeployStatus;
  initiatedBy: string;
  layerId:     string;
  startedAt:   number;
  completedAt?: number;
  rollbackRef?: string;    // Previous deploy ID to roll back to
}

export function createDeploy(
  target: DeployTarget,
  artifact: string,
  initiatedBy: string,
  layerId: string
): SovereignDeploy {
  return {
    id:          `deploy_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    target,
    artifact,
    status:      "pending",
    initiatedBy,
    layerId,
    startedAt:   Date.now(),
  };
}

export function advanceDeploy(deploy: SovereignDeploy, status: DeployStatus): SovereignDeploy {
  const terminal = status === "success" || status === "failed" || status === "rolled_back";
  return {
    ...deploy,
    status,
    completedAt: terminal ? Date.now() : deploy.completedAt,
  };
}

// ─── Infrastructure policy ────────────────────────────────────────────────────

export interface InfraPolicy {
  preferSovereign:       boolean;  // Always prefer sovereign-controlled layers
  allowedProviders:      string[];
  maxVendorDependencies: number;   // Max non-sovereign layers tolerated
  requireHttps:          boolean;
  auditAllDeploys:       boolean;
}

export const DEFAULT_INFRA_POLICY: InfraPolicy = {
  preferSovereign:       true,
  allowedProviders:      ["supabase", "cloudflare", "vercel"],
  maxVendorDependencies: 3,
  requireHttps:          true,
  auditAllDeploys:       true,
} as const;

// ─── Infra health ─────────────────────────────────────────────────────────────

export type InfraHealth = "sovereign_healthy" | "vendor_dependent" | "degraded" | "offline";

export function deriveInfraHealth(layers: InfraLayer[]): InfraHealth {
  if (layers.every((l) => l.status === "offline")) return "offline";
  if (layers.some((l) => l.status === "degraded" || l.status === "offline")) return "degraded";
  const nonSovereign = layers.filter((l) => !l.sovereign && l.status !== "offline");
  if (nonSovereign.length > DEFAULT_INFRA_POLICY.maxVendorDependencies) return "vendor_dependent";
  return "sovereign_healthy";
}

// ─── Unified state ────────────────────────────────────────────────────────────

export interface PlatformInfraState {
  layers:      InfraLayer[];
  pools:       ResourcePool[];
  deployHistory: SovereignDeploy[];
  policy:      InfraPolicy;
  health:      InfraHealth;
  lastAuditAt: number;
}

export function defaultPlatformState(): PlatformInfraState {
  return {
    layers:        [],
    pools:         [],
    deployHistory: [],
    policy:        DEFAULT_INFRA_POLICY,
    health:        "sovereign_healthy",
    lastAuditAt:   Date.now(),
  };
}

export function addLayer(state: PlatformInfraState, layer: InfraLayer): PlatformInfraState {
  const layers = [...state.layers.filter((l) => l.id !== layer.id), layer];
  return { ...state, layers, health: deriveInfraHealth(layers), lastAuditAt: Date.now() };
}
