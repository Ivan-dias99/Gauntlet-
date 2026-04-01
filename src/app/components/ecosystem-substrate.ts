/**
 * RUBERRA ECOSYSTEM SUBSTRATE — Stack 16: Ecosystem Network
 * Constitutional Layer · Substrate · Installed 2026-04-01
 *
 * A sovereign ecosystem of vetted, consequence-bearing extensions —
 * not a plugin marketplace.
 *
 * Anti-patterns rejected:
 *   — extensions that fragment operator attention
 *   — plugins with no consequence binding
 *   — ecosystem as growth hack
 *   — app stores with no coherence enforcement
 *
 * Dependencies: governance, distribution, value
 */

// ─── EXTENSION TYPES ─────────────────────────────────────────────────────────

export type ExtensionKind =
  | "intelligence-provider" // adds a model or inference capability
  | "connector"             // adds an external integration
  | "knowledge-source"      // adds a domain knowledge corpus
  | "flow-template"         // adds reusable autonomous flow definitions
  | "output-renderer"       // adds a new output rendering surface
  | "operator-tool"         // adds a capability tool for operators
  | "governance-policy";    // adds a trust gate or audit policy

export type ExtensionStatus =
  | "submitted"     // submitted for vetting
  | "under-review"  // being reviewed by sovereignty council
  | "approved"      // cleared for use
  | "active"        // currently deployed in an operator's workspace
  | "suspended"     // temporarily disabled — under investigation
  | "revoked";      // permanently removed

export interface ExtensionManifest {
  id:               string;
  kind:             ExtensionKind;
  label:            string;
  version:          string;
  authorId:         string;
  description:      string;
  /** Capabilities this extension adds */
  capabilities:     string[];
  /** System permissions this extension requires */
  requiredPermissions: ExtensionPermission[];
  /** Chambers this extension operates in */
  chambers:         string[];
  /** Whether this extension produces auditable consequences */
  consequenceBound: boolean;
  /** Verification hash — computed at approval, checked at install */
  integrityHash:    string;
  status:           ExtensionStatus;
  submittedAt:      number;
  approvedAt?:      number;
  revokedAt?:       number;
  revokeReason?:    string;
}

// ─── EXTENSION PERMISSIONS ────────────────────────────────────────────────────

export type ExtensionPermission =
  | "read:missions"         // may read mission objects
  | "write:missions"        // may mutate mission objects
  | "read:knowledge"        // may query the knowledge graph
  | "write:knowledge"       // may write to the knowledge graph
  | "spawn:agents"          // may spawn agents under governing intelligence
  | "execute:flows"         // may trigger autonomous flows
  | "read:governance"       // may read audit records
  | "external:http"         // may make outbound HTTP calls
  | "value:transact"        // may initiate value transactions
  | "system:awareness";     // may read system health data

export interface ExtensionPermissionGrant {
  extensionId:     string;
  operatorId:      string;
  granted:         ExtensionPermission[];
  grantedAt:       number;
  expiresAt?:      number;
  auditId:         string;
}

// ─── INSTALLED EXTENSION ─────────────────────────────────────────────────────

export interface InstalledExtension {
  id:            string;
  manifestId:    string;
  operatorId:    string;
  installedAt:   number;
  permissionGrant: ExtensionPermissionGrant;
  healthy:       boolean;
  lastHealthAt:  number;
  /** Whether the extension has produced any auditable consequence */
  hasConsequence: boolean;
}

// ─── COHERENCE ENFORCEMENT ────────────────────────────────────────────────────

export interface CoherenceCheckResult {
  coherent:   boolean;
  violations: CoherenceViolation[];
}

export interface CoherenceViolation {
  extensionId: string;
  reason:      string;
  severity:    "low" | "medium" | "high" | "critical";
}

/**
 * Check whether an extension is coherent with Ruberra identity law.
 * An extension is incoherent if it creates a parallel identity surface,
 * bypasses governance, or fragments operator attention.
 */
export function checkExtensionCoherence(
  manifest: ExtensionManifest,
): CoherenceCheckResult {
  const violations: CoherenceViolation[] = [];

  if (!manifest.consequenceBound) {
    violations.push({
      extensionId: manifest.id,
      reason:      "Extension produces no auditable consequence — violates consequence law.",
      severity:    "high",
    });
  }

  if (manifest.status === "revoked") {
    violations.push({
      extensionId: manifest.id,
      reason:      "Extension is revoked and may not be installed.",
      severity:    "critical",
    });
  }

  return { coherent: violations.length === 0, violations };
}

// ─── ECOSYSTEM LAWS ───────────────────────────────────────────────────────────

export const ECOSYSTEM_LAWS: readonly string[] = [
  "All extensions are vetted — no extension enters a Ruberra workspace without sovereignty approval.",
  "All extensions are consequence-bound — extensions that produce no auditable consequence are rejected.",
  "Extension permissions are explicit and minimal — the principle of least privilege applies to all extensions.",
  "Extensions may not create parallel identity surfaces — they extend Ruberra, they do not fork it.",
  "Extension integrity is verifiable — every approved extension carries a verifiable integrity hash.",
  "Revocation is immediate — a revoked extension loses all permissions without operator action required.",
  "The ecosystem grows slowly and deliberately — not as a growth hack, but as a capability extension.",
] as const;

export const ECOSYSTEM_REJECTS: readonly string[] = [
  "plugin marketplaces",
  "app stores with no coherence enforcement",
  "extensions that fragment operator attention",
  "plugins with no consequence binding",
  "ecosystem as growth hack",
  "Zapier app ecosystems",
  "integration directories",
] as const;

// ─── RUNTIME HELPERS ──────────────────────────────────────────────────────────

export function buildExtensionManifestId(): string {
  return `ext_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function canInstall(manifest: ExtensionManifest): boolean {
  return manifest.status === "approved" && !!manifest.integrityHash;
}
