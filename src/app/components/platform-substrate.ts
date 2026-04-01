/**
 * RUBERRA PLATFORM SUBSTRATE — Stack 17: Platform Infrastructure
 * Constitutional Layer · Substrate · Installed 2026-04-01
 *
 * The infrastructure layer is invisible to operators and sovereign to Ruberra —
 * no cloud vendor lock-in at the application layer.
 *
 * Anti-patterns rejected:
 *   — infrastructure that operators must manage
 *   — vendor APIs in the critical path
 *   — cost unpredictability from vendor pricing changes
 *   — cloud vendor-managed identity
 *
 * Dependencies: operations, security, governance
 */

// ─── INFRASTRUCTURE LAYER ────────────────────────────────────────────────────

export type InfraLayer =
  | "compute"         // execution environments
  | "storage"         // persistent data storage
  | "network"         // data transport
  | "identity"        // authentication and authorization
  | "sync"            // state synchronization across surfaces
  | "observability"   // metrics, logs, tracing
  | "secrets";        // credential and key management

export type InfraVendorTier =
  | "sovereign"       // Ruberra-owned infrastructure — no external dependency
  | "abstracted"      // behind a Ruberra abstraction layer — vendor is swappable
  | "constrained"     // external vendor but with contractual sovereignty clauses
  | "dependent";      // direct external vendor dependency — migration path required

export interface InfraComponent {
  id:             string;
  layer:          InfraLayer;
  label:          string;
  vendorTier:     InfraVendorTier;
  vendor?:        string;          // null if sovereign
  /** Ruberra's abstraction interface over this component */
  abstractionId:  string;
  /** Can this component be swapped without application code change? */
  swappable:      boolean;
  /** Estimated migration effort if vendor lock-in is resolved */
  migrationEffort?: "trivial" | "moderate" | "significant" | "major";
  healthy:        boolean;
  lastHealthAt:   number;
}

// ─── ABSTRACTION INTERFACE ────────────────────────────────────────────────────

/**
 * Every external vendor in Ruberra's stack must be behind an abstraction.
 * The abstraction defines the contract — the vendor implements it.
 * Swapping the vendor requires only a new implementation, not application changes.
 */
export interface InfraAbstraction {
  id:             string;
  layer:          InfraLayer;
  label:          string;
  /** The canonical interface contract — vendor-agnostic */
  contract:       string[];
  /** Current implementation */
  implementedBy:  string;
  /** Alternative implementations that could fulfill this contract */
  alternatives:   string[];
  /** Whether the current implementation is Ruberra-native */
  sovereign:      boolean;
}

export const RUBERRA_INFRA_ABSTRACTIONS: Readonly<InfraAbstraction[]> = [
  {
    id:            "storage-abstraction",
    layer:         "storage",
    label:         "Sovereign Storage Interface",
    contract:      ["read(key)", "write(key, value)", "delete(key)", "list(prefix)", "watch(key, callback)"],
    implementedBy: "supabase-postgres",
    alternatives:  ["self-hosted-postgres", "sqlite-wasm", "libsql", "turso"],
    sovereign:     false,
  },
  {
    id:            "identity-abstraction",
    layer:         "identity",
    label:         "Sovereign Identity Interface",
    contract:      ["authenticate(credentials)", "verify(token)", "refresh(token)", "revoke(token)"],
    implementedBy: "supabase-auth",
    alternatives:  ["self-hosted-auth", "sovereign-jwt", "passkey-native"],
    sovereign:     false,
  },
  {
    id:            "sync-abstraction",
    layer:         "sync",
    label:         "Sovereign Sync Protocol",
    contract:      ["push(delta)", "pull(since)", "merge(conflicts)", "subscribe(channel)"],
    implementedBy: "ruberra-sync-v1",
    alternatives:  ["electric-sql", "cr-sqlite"],
    sovereign:     true,
  },
  {
    id:            "secrets-abstraction",
    layer:         "secrets",
    label:         "Sovereign Secrets Interface",
    contract:      ["get(key)", "set(key, value)", "rotate(key)", "audit(key)"],
    implementedBy: "env-based-secrets",
    alternatives:  ["vault", "sovereign-kms"],
    sovereign:     false,
  },
] as const;

// ─── COST SOVEREIGNTY ─────────────────────────────────────────────────────────

/**
 * Cost sovereignty means Ruberra's infrastructure costs scale with Ruberra's
 * interests — not against them. Every vendor in the stack must have a known
 * sovereignty path.
 */
export interface CostSovereigntyRecord {
  componentId:     string;
  currentMonthlyCost?: number;
  scalingModel:    "fixed" | "per-operator" | "per-request" | "per-storage" | "unknown";
  sovereigntyPath: string;   // what it would take to eliminate this vendor cost
  priorityToResolve: "immediate" | "roadmap" | "long-term" | "monitored";
}

// ─── PLATFORM LAWS ───────────────────────────────────────────────────────────

export const PLATFORM_LAWS: readonly string[] = [
  "Every external vendor is behind an abstraction — application code never calls vendor APIs directly.",
  "Every abstraction has a known sovereignty path — no permanent external dependencies.",
  "Infrastructure is invisible to operators — they never manage servers, credentials, or storage.",
  "Cost sovereignty is tracked — the migration path away from every cost-scaling vendor is defined.",
  "Identity is sovereign — operator credentials and tokens are never custodied by a vendor.",
  "Sync is sovereign — state transport uses Ruberra's own protocol, not a vendor sync service.",
  "Observability data stays internal — metrics and logs are never shipped to external aggregators by default.",
] as const;

export const PLATFORM_REJECTS: readonly string[] = [
  "Vercel",
  "Supabase as a core dependency",
  "cloud-vendor managed identity",
  "infrastructure that operators must manage",
  "infrastructure costs that scale against operator interests",
  "vendor APIs in the critical path without abstraction",
] as const;

// ─── RUNTIME HELPERS ──────────────────────────────────────────────────────────

export function getAbstraction(layer: InfraLayer): InfraAbstraction | undefined {
  return RUBERRA_INFRA_ABSTRACTIONS.find((a) => a.layer === layer);
}

export function isLayerSovereign(layer: InfraLayer): boolean {
  const abstraction = getAbstraction(layer);
  return abstraction?.sovereign ?? false;
}
