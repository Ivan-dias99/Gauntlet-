/**
 * RUBERRA DISTRIBUTION SUBSTRATE — Stack 14: Distribution + Presence
 * Constitutional Layer · Substrate · Installed 2026-04-01
 *
 * Sovereign presence everywhere operators need to work —
 * not locked to a browser tab.
 *
 * Anti-patterns rejected:
 *   — browser-only SaaS
 *   — mobile apps that are crippled versions
 *   — context loss when switching devices or modes
 *   — presence that requires internet for basic function
 *
 * Dependencies: experience, awareness
 */

// ─── SURFACE TYPES ────────────────────────────────────────────────────────────

export type RuberraSurface =
  | "web-app"         // primary browser application
  | "desktop-app"     // native desktop (Electron or Tauri)
  | "mobile-app"      // native mobile (iOS / Android)
  | "cli"             // command-line interface
  | "ide-extension"   // editor plugin (VS Code, JetBrains, etc.)
  | "api"             // programmatic API surface
  | "ambient";        // OS-level ambient presence (notifications, widgets)

export type SurfaceCapabilityTier = "full" | "reduced" | "read-only" | "minimal" | "unavailable";

export interface SurfaceCapability {
  surface:            RuberraSurface;
  tier:               SurfaceCapabilityTier;
  /** Features available on this surface */
  features:           string[];
  /** Features unavailable on this surface */
  missing:            string[];
  offlineSupport:     boolean;
  /** Whether context fully transfers to/from this surface */
  contextFidelity:    "full" | "partial" | "none";
}

// ─── PRESENCE CONTRACT ────────────────────────────────────────────────────────

/**
 * A PresenceContract defines what Ruberra guarantees across all surfaces.
 * No surface may violate these invariants.
 */
export interface PresenceContract {
  id:           string;
  label:        string;
  /** The guarantee this contract encodes */
  guarantee:    string;
  /** Surfaces this contract applies to */
  surfaces:     RuberraSurface[];
  /** Whether offline support is part of this contract */
  offlineScope: boolean;
  /** Anti-pattern this contract prevents */
  prevents:     string;
}

export const RUBERRA_PRESENCE_CONTRACTS: Readonly<PresenceContract[]> = [
  {
    id:          "context-persistence",
    label:       "Context Persistence Across Surfaces",
    guarantee:   "Operator context — active mission, current chamber, work in progress — transfers fully when switching surfaces.",
    surfaces:    ["web-app", "desktop-app", "mobile-app", "cli"],
    offlineScope: false,
    prevents:    "context loss when switching devices or environments",
  },
  {
    id:          "offline-mission-read",
    label:       "Offline Mission Read",
    guarantee:   "Operators may read active missions and prior outputs without an internet connection.",
    surfaces:    ["desktop-app", "mobile-app", "cli"],
    offlineScope: true,
    prevents:    "total dependency on internet for basic mission work",
  },
  {
    id:          "surface-parity-core",
    label:       "Core Feature Parity",
    guarantee:   "Mission creation, chamber navigation, and output review are available on all non-ambient surfaces.",
    surfaces:    ["web-app", "desktop-app", "mobile-app", "cli"],
    offlineScope: false,
    prevents:    "mobile or desktop versions that are crippled relative to the browser",
  },
  {
    id:          "ambient-notifications",
    label:       "Ambient Signal Surfacing",
    guarantee:   "High-priority signals surface to the operator regardless of which surface they are currently using.",
    surfaces:    ["web-app", "desktop-app", "mobile-app", "ambient"],
    offlineScope: false,
    prevents:    "operator missing a critical system signal because they are not in the browser tab",
  },
  {
    id:          "sovereign-sync",
    label:       "Sovereign Sync Protocol",
    guarantee:   "State synchronization between surfaces uses Ruberra's own sync protocol — no cloud vendor sync dependency.",
    surfaces:    ["web-app", "desktop-app", "mobile-app", "cli", "api"],
    offlineScope: true,
    prevents:    "vendor lock-in through sync infrastructure",
  },
] as const;

// ─── SYNC STATE ───────────────────────────────────────────────────────────────

export type SyncStatus = "synced" | "syncing" | "pending" | "conflict" | "offline" | "error";

export interface SurfaceSyncState {
  surface:       RuberraSurface;
  status:        SyncStatus;
  lastSyncedAt:  number;
  pendingWrites: number;
  conflictCount: number;
  offlineSince?: number;
}

export interface DistributionState {
  activeSurface:  RuberraSurface;
  surfaces:       SurfaceSyncState[];
  /** True if any surface has unresolved conflicts */
  hasConflicts:   boolean;
  /** True if any surface is offline */
  hasOfflineSurface: boolean;
}

// ─── OFFLINE SNAPSHOT ─────────────────────────────────────────────────────────

/**
 * An offline snapshot captures the minimum state required for a surface
 * to operate without connectivity.
 */
export interface OfflineSnapshot {
  id:            string;
  createdAt:     number;
  expiresAt:     number;
  /** Active missions at snapshot time */
  missionIds:    string[];
  /** Knowledge nodes included in snapshot */
  knowledgeNodeIds: string[];
  /** Pending writes queued for sync */
  pendingWrites: PendingWrite[];
}

export interface PendingWrite {
  id:          string;
  surface:     RuberraSurface;
  action:      string;
  payload:     Record<string, unknown>;
  createdAt:   number;
  attempts:    number;
}

// ─── DISTRIBUTION LAWS ────────────────────────────────────────────────────────

export const DISTRIBUTION_LAWS: readonly string[] = [
  "Context transfers without loss when an operator moves between surfaces.",
  "Ruberra is not a browser tab — it has presence wherever the operator works.",
  "Offline capability is a right, not a premium feature — basic mission work survives connectivity loss.",
  "Sync is sovereign — no external cloud vendor owns the sync protocol or the sync data.",
  "Surface parity for core features is contractual — no surface may cripple the operator.",
  "Ambient signals reach the operator regardless of active surface.",
  "Context fidelity is tracked and surfaced — operators always know if context transfer was partial.",
] as const;

export const DISTRIBUTION_REJECTS: readonly string[] = [
  "browser-only SaaS",
  "desktop apps with no sync",
  "mobile apps that are crippled versions of the browser app",
  "context loss when switching devices or modes",
  "presence that requires internet for basic function",
  "sync through cloud vendor-owned infrastructure",
] as const;

// ─── RUNTIME HELPERS ──────────────────────────────────────────────────────────

export function buildOfflineSnapshotId(): string {
  return `snap_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildPendingWriteId(): string {
  return `pw_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function defaultSyncState(surface: RuberraSurface): SurfaceSyncState {
  return {
    surface,
    status:        "synced",
    lastSyncedAt:  Date.now(),
    pendingWrites: 0,
    conflictCount: 0,
  };
}

export function isContractViolated(
  contract: PresenceContract,
  state:    DistributionState,
): boolean {
  if (contract.offlineScope && !state.hasOfflineSurface) return false;
  // A contract is violated if a required surface is not in synced or syncing state
  return contract.surfaces.some((s) => {
    const surfState = state.surfaces.find((ss) => ss.surface === s);
    return surfState?.status === "error";
  });
}
