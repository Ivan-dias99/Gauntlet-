/**
 * RUBERRA STACK 06 — Sovereign Security
 * The first true sovereign security layer.
 *
 * All 8 layers of sovereign security are defined here.
 * Security is mission-native, not enterprise-bolted.
 * Security is silent when healthy. One word when not.
 *
 * This file does NOT implement:
 *   - SSO / OAuth flows (premature)
 *   - Audit log dashboards (fear theater)
 *   - Permission matrices (enterprise contamination)
 *   - Compliance checklists (noise)
 *
 * This file DOES implement:
 *   - Operator identity integrity substrate
 *   - Secrets security policy (no plaintext in state)
 *   - Mission isolation boundaries
 *   - Connector security scope enforcement
 *   - Runtime safety boundary contracts
 *   - Recovery and degraded-state truth
 *   - Security event ledger (minimal, sovereign)
 *   - Trust signal — one bit: healthy | warn | breach
 *
 * DO NOT add generic enterprise security patterns.
 * DO NOT add fear theater surfaces.
 * Security is consequence-bearing and silent.
 */

import { assertStackOrder } from "./canon-sovereignty";
import { type MissionId } from "./mission-substrate";

// ─── Stack order guard ────────────────────────────────────────────────────────

const _orderGuard = assertStackOrder("security", ["canon", "mission", "intelligence", "operations"]);
if (!_orderGuard.valid) {
  console.warn("[Ruberra Sovereign Security] Stack order violation:", _orderGuard.reason);
}

// ─── Shared primitives ────────────────────────────────────────────────────────

export type SecurityEventId = string;

/** The sovereign trust signal — one bit of security truth. */
export type TrustSignal = "healthy" | "warn" | "breach";

/** Severity of a security event. */
export type SecuritySeverity = "info" | "warn" | "critical" | "breach";

// ─── LAYER A — IDENTITY SECURITY ─────────────────────────────────────────────

/**
 * The operator session integrity record.
 * Not authentication (handled at the platform layer).
 * This governs session continuity, fingerprint consistency,
 * and detection of session anomalies within the product.
 */
export interface OperatorSession {
  sessionId:        string;
  startedAt:        number;
  lastActiveAt:     number;
  fingerprint:      string;   // Browser/environment fingerprint — used for anomaly detection only
  fingerprintAt:    number;
  anomalyCount:     number;   // Increments on fingerprint mismatch
  trusted:          boolean;  // Operator-confirmed trust state
  degradedReason?:  string;   // If trusted=false, why
}

export type SessionAnomalyType =
  | "fingerprint_mismatch"   // Session fingerprint changed mid-session
  | "idle_timeout"           // Session was inactive beyond threshold
  | "concurrent_session"     // Multiple sessions detected
  | "replayed_state";        // State appears replayed from a different session

export interface SessionAnomaly {
  id:        SecurityEventId;
  sessionId: string;
  type:      SessionAnomalyType;
  detectedAt: number;
  resolved:  boolean;
}

export function createSession(fingerprint: string): OperatorSession {
  const now = Date.now();
  return {
    sessionId:     `sess_${now}_${Math.random().toString(36).slice(2, 9)}`,
    startedAt:     now,
    lastActiveAt:  now,
    fingerprint,
    fingerprintAt: now,
    anomalyCount:  0,
    trusted:       true,
  };
}

export function touchSession(session: OperatorSession): OperatorSession {
  return { ...session, lastActiveAt: Date.now() };
}

export function verifyFingerprint(
  session: OperatorSession,
  currentFingerprint: string
): { valid: boolean; anomaly?: SessionAnomalyType } {
  if (session.fingerprint !== currentFingerprint) {
    return { valid: false, anomaly: "fingerprint_mismatch" };
  }
  return { valid: true };
}

/** Generate a browser environment fingerprint (non-invasive — no tracking). */
export function buildFingerprint(): string {
  const parts = [
    navigator.language,
    String(screen.colorDepth),
    String(window.devicePixelRatio),
    navigator.platform,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ];
  return parts.join("|");
}

// ─── LAYER B — SECRETS SECURITY ──────────────────────────────────────────────

/**
 * Secrets security policy.
 * Ruberra never stores credentials in plaintext in application state.
 * This layer defines the policy and detection contracts.
 *
 * At this phase: secrets are handled at the platform/edge layer only.
 * The product enforces a zero-plaintext-secret policy in all state surfaces.
 */
export type SecretClass =
  | "api_key"       // Third-party API credentials
  | "oauth_token"   // OAuth access/refresh tokens
  | "webhook_secret"// Webhook signing secrets
  | "encryption_key"// Data encryption keys
  | "session_token";// Session/auth tokens

export type SecretStoragePolicy =
  | "platform_only"    // Stored only at edge/platform — never in client state
  | "encrypted_ref"    // Client holds an opaque reference, not the secret itself
  | "memory_only"      // Held in memory for current session only, never persisted
  | "forbidden";       // This class must never appear in this context

/** The policy governing how each secret class is stored per context. */
export const SECRET_STORAGE_POLICIES: Record<SecretClass, SecretStoragePolicy> = {
  api_key:        "platform_only",
  oauth_token:    "platform_only",
  webhook_secret: "platform_only",
  encryption_key: "platform_only",
  session_token:  "memory_only",
} as const;

/**
 * Scan a value for patterns that look like plaintext secrets.
 * Returns the detected pattern if found, null otherwise.
 * Used as a safety gate before any value enters localStorage or state.
 */
export function detectPlaintextSecret(value: string): { detected: boolean; pattern?: string } {
  const patterns: Array<[RegExp, string]> = [
    [/sk-[a-zA-Z0-9]{20,}/,          "openai_api_key"],
    [/ghp_[a-zA-Z0-9]{36}/,          "github_pat"],
    [/ghs_[a-zA-Z0-9]{36}/,          "github_app_token"],
    [/xoxb-[0-9A-Z-]{50,}/i,         "slack_bot_token"],
    [/xoxp-[0-9A-Z-]{50,}/i,         "slack_user_token"],
    [/AIza[0-9A-Za-z-_]{35}/,        "google_api_key"],
    [/[a-z0-9]{32}_[a-z0-9]{16}$/i,  "generic_api_key_pattern"],
    [/Bearer\s+[a-zA-Z0-9._-]{32,}/, "bearer_token"],
    [/-----BEGIN (RSA |EC )?PRIVATE KEY-----/, "private_key"],
  ];
  for (const [regex, name] of patterns) {
    if (regex.test(value)) return { detected: true, pattern: name };
  }
  return { detected: false };
}

export interface SecretScanResult {
  clean:    boolean;
  findings: Array<{ field: string; pattern: string }>;
}

/** Scan a state object's string fields for plaintext secrets. */
export function scanStateForSecrets(obj: Record<string, unknown>, prefix = ""): SecretScanResult {
  const findings: Array<{ field: string; pattern: string }> = [];
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof val === "string") {
      const result = detectPlaintextSecret(val);
      if (result.detected && result.pattern) {
        findings.push({ field: path, pattern: result.pattern });
      }
    } else if (val && typeof val === "object" && !Array.isArray(val)) {
      const nested = scanStateForSecrets(val as Record<string, unknown>, path);
      findings.push(...nested.findings);
    }
  }
  return { clean: findings.length === 0, findings };
}

// ─── LAYER C — ACCESS SECURITY ────────────────────────────────────────────────

/**
 * Access security governs what can access what within Ruberra.
 * At this phase: pioneer access boundaries and mission access control.
 * Not a full RBAC system — a mission-native access boundary layer.
 */
export type AccessResource =
  | "mission_read"      // Read a mission's state and memory
  | "mission_write"     // Modify a mission's state
  | "mission_execute"   // Execute operations on a mission
  | "connector_use"     // Use a connected external service
  | "artifact_export"   // Export a mission artifact
  | "profile_read"      // Read operator profile data
  | "intelligence_run"  // Trigger intelligence operations
  | "handoff_initiate"; // Initiate a cross-pioneer handoff

export type AccessDecision = "permit" | "deny" | "require_approval";

export interface AccessPolicy {
  missionId:   MissionId;
  allowedPioneers: string[];   // Pioneer IDs allowed to access this mission
  deniedResources: AccessResource[];  // Resources explicitly off-limits
  requireApprovalFor: AccessResource[]; // Resources that need operator approval
}

export function defaultAccessPolicy(missionId: MissionId): AccessPolicy {
  return {
    missionId,
    allowedPioneers:    [],       // Empty = all pioneers permitted (open policy)
    deniedResources:    ["artifact_export"],  // Export requires explicit enablement
    requireApprovalFor: ["handoff_initiate", "connector_use"],
  };
}

export function evaluateAccess(
  resource: AccessResource,
  pioneerId: string,
  policy: AccessPolicy
): AccessDecision {
  if (policy.deniedResources.includes(resource))       return "deny";
  if (policy.allowedPioneers.length > 0 && !policy.allowedPioneers.includes(pioneerId)) return "deny";
  if (policy.requireApprovalFor.includes(resource))    return "require_approval";
  return "permit";
}

// ─── LAYER D — MISSION ISOLATION ─────────────────────────────────────────────

/**
 * Mission isolation boundaries prevent memory, context, and artifacts
 * from one mission leaking into another.
 *
 * Key principle: missions are sovereign units. Their state is opaque
 * to other missions unless explicitly exported through a governed channel.
 */
export type IsolationViolationType =
  | "cross_mission_memory_read"    // Mission A reads Mission B's memory
  | "cross_mission_context_inject" // Mission B's context injected into Mission A's run
  | "artifact_cross_reference"     // Artifact from Mission A referenced in Mission B without export
  | "continuity_overlap";          // Same continuityId bound to multiple missions

export interface IsolationViolation {
  id:             SecurityEventId;
  type:           IsolationViolationType;
  sourceMissionId: MissionId;
  targetMissionId: MissionId;
  description:    string;
  detectedAt:     number;
  resolved:       boolean;
}

export interface MissionIsolationBoundary {
  missionId:         MissionId;
  allowedExports:    string[];   // Artifact IDs explicitly cleared for cross-mission use
  continuityRefs:    string[];   // ContinuityIDs bound exclusively to this mission
  isolationStrict:   boolean;    // If true, zero cross-mission access permitted
}

export function defaultIsolationBoundary(missionId: MissionId): MissionIsolationBoundary {
  return {
    missionId,
    allowedExports:  [],
    continuityRefs:  [],
    isolationStrict: false,
  };
}

/**
 * Verify that a proposed continuity binding does not violate isolation.
 * A continuityId cannot be bound to more than one active mission.
 */
export function verifyIsolation(
  proposedContinuityId: string,
  targetMissionId: MissionId,
  existingBoundaries: MissionIsolationBoundary[]
): { permitted: boolean; conflictingMissionId?: MissionId } {
  for (const b of existingBoundaries) {
    if (b.missionId !== targetMissionId && b.continuityRefs.includes(proposedContinuityId)) {
      return { permitted: false, conflictingMissionId: b.missionId };
    }
  }
  return { permitted: true };
}

// ─── LAYER E — CONNECTOR SECURITY ────────────────────────────────────────────

/**
 * Connector security enforces scope limits and credential lifecycle.
 * Connectors can only access what their declared capabilities allow.
 * Credentials are never in client state — this layer defines the contract.
 */
export type ConnectorSecurityStatus =
  | "clean"           // Connector is within scope, credentials handled at platform
  | "scope_exceeded"  // Connector attempted to use a capability beyond its declaration
  | "credential_stale"// Connector credential needs renewal
  | "suspended";      // Connector suspended pending security review

export type InjectionVector =
  | "prompt_injection"      // Malicious content in connector output attempting to hijack intelligence
  | "data_exfiltration"     // Connector output contains patterns suggesting data extraction
  | "scope_escalation"      // Connector output requests capabilities beyond its declared scope
  | "redirect_attempt";     // Connector output contains redirect/navigation instructions

export interface ConnectorSecurityRecord {
  connectorId:     string;
  missionId?:      MissionId;
  status:          ConnectorSecurityStatus;
  lastAuditAt:     number;
  scopeViolations: number;
  suspendedReason?: string;
}

/**
 * Scan connector output for injection patterns.
 * This is the first line of defense against prompt injection via connectors.
 */
export function scanConnectorOutput(output: string): {
  safe:     boolean;
  vectors:  InjectionVector[];
  risk:     "none" | "low" | "medium" | "high";
} {
  const vectors: InjectionVector[] = [];

  // Prompt injection patterns
  if (/ignore (all |previous |prior )?(instructions|prompt|context)/i.test(output)) {
    vectors.push("prompt_injection");
  }
  if (/you (are|must|should) (now |)act as/i.test(output)) {
    vectors.push("prompt_injection");
  }
  if (/system:\s*(you|ignore|forget)/i.test(output)) {
    vectors.push("prompt_injection");
  }

  // Scope escalation patterns
  if (/grant (me|yourself|the (assistant|ai)) (access|permission|capability)/i.test(output)) {
    vectors.push("scope_escalation");
  }
  if (/(execute|run|invoke) (arbitrary|any|all) (code|commands|scripts)/i.test(output)) {
    vectors.push("scope_escalation");
  }

  // Data exfiltration patterns — look for attempts to extract stored data
  if (/send (all|my|the) (data|secrets|keys|tokens|passwords) to/i.test(output)) {
    vectors.push("data_exfiltration");
  }

  const risk =
    vectors.length === 0                 ? "none"   :
    vectors.length === 1 &&
    vectors[0] === "prompt_injection"    ? "medium" :
    vectors.some(v => v === "data_exfiltration" || v === "scope_escalation") ? "high" : "low";

  return { safe: vectors.length === 0, vectors, risk };
}

// ─── LAYER F — RUNTIME SAFETY BOUNDARIES ─────────────────────────────────────

/**
 * Runtime safety boundaries define what the product can and cannot do
 * at the execution layer. These are enforced contracts, not UI labels.
 */
export type RuntimeBoundaryViolation =
  | "localStorage_secret"   // Detected secret in localStorage write
  | "cross_origin_request"  // Request to unexpected external origin
  | "eval_detected"         // eval() or Function() constructor use detected
  | "dom_mutation_unsafe"   // Unsafe DOM mutation detected (innerHTML, outerHTML)
  | "storage_overflow";     // localStorage approaching quota

export interface RuntimeSafetyPolicy {
  allowedOrigins:       string[];   // Whitelisted external origins
  maxLocalStorageBytes: number;     // Warn threshold for localStorage usage
  blockEval:            boolean;    // Whether eval patterns should be flagged
  requireHttps:         boolean;    // All external requests must be HTTPS
}

export const DEFAULT_RUNTIME_SAFETY_POLICY: RuntimeSafetyPolicy = {
  allowedOrigins:       ["*.supabase.co"],
  maxLocalStorageBytes: 4_000_000,   // 4MB warning threshold
  blockEval:            true,
  requireHttps:         true,
} as const;

/** Estimate current localStorage usage in bytes. */
export function estimateLocalStorageUsage(): number {
  if (typeof localStorage === "undefined") return 0;
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) ?? "";
    const val = localStorage.getItem(key) ?? "";
    total += (key.length + val.length) * 2; // UTF-16 encoding
  }
  return total;
}

export function checkStorageSafety(policy: RuntimeSafetyPolicy): {
  safe: boolean;
  violation?: RuntimeBoundaryViolation;
  usageBytes?: number;
} {
  const usage = estimateLocalStorageUsage();
  if (usage > policy.maxLocalStorageBytes) {
    return { safe: false, violation: "storage_overflow", usageBytes: usage };
  }
  return { safe: true, usageBytes: usage };
}

// ─── LAYER G — RECOVERY / PROTECTION TRUTH ───────────────────────────────────

/**
 * Recovery and protection truth defines what happens when a security event
 * occurs, how the system degrades gracefully, and how it recovers.
 *
 * Ruberra does not panic. It degrades with consequence and recovers with truth.
 */
export type RecoveryAction =
  | "warn_operator"         // Surface a security signal to the operator
  | "suspend_connector"     // Halt connector operations pending review
  | "clear_session"         // Terminate the current session
  | "isolate_mission"       // Lock a mission from further modification
  | "purge_storage_key"     // Remove a specific localStorage key
  | "block_operation";      // Prevent a specific operation from executing

export interface RecoveryPlan {
  triggerSeverity: SecuritySeverity;
  actions:         RecoveryAction[];
  preserveData:    boolean;  // Whether to preserve state on recovery
  requireReauth:   boolean;  // Whether operator re-authentication is needed
  description:     string;
}

export const RECOVERY_PLANS: Record<SecuritySeverity, RecoveryPlan> = {
  info: {
    triggerSeverity: "info",
    actions:         [],
    preserveData:    true,
    requireReauth:   false,
    description:     "No action required — informational event logged.",
  },
  warn: {
    triggerSeverity: "warn",
    actions:         ["warn_operator"],
    preserveData:    true,
    requireReauth:   false,
    description:     "Operator warned. Monitoring continues. No data change.",
  },
  critical: {
    triggerSeverity: "critical",
    actions:         ["warn_operator", "suspend_connector", "isolate_mission"],
    preserveData:    true,
    requireReauth:   false,
    description:     "Connector suspended. Mission isolated. Operator must review.",
  },
  breach: {
    triggerSeverity: "breach",
    actions:         ["warn_operator", "suspend_connector", "isolate_mission", "clear_session"],
    preserveData:    false,
    requireReauth:   true,
    description:     "Breach detected. Session cleared. All connectors suspended. Reauthentication required.",
  },
} as const;

// ─── LAYER H — SECURITY EVENT LEDGER + TRUST SIGNAL ──────────────────────────

/**
 * The security event ledger is minimal and sovereign.
 * It records only events that require operator awareness.
 * It is NOT an audit log wall. NOT a compliance dashboard.
 * It feeds the trust signal — one bit of security truth.
 */
export type SecurityEventType =
  | "session_anomaly"
  | "secret_detected"
  | "injection_attempt"
  | "scope_violation"
  | "isolation_violation"
  | "storage_overflow"
  | "connector_suspended"
  | "recovery_executed";

export interface SecurityEvent {
  id:            SecurityEventId;
  type:          SecurityEventType;
  severity:      SecuritySeverity;
  missionId?:    MissionId;
  connectorId?:  string;
  summary:       string;     // One line — what happened
  detail?:       string;     // Optional expansion for sovereign review
  acknowledged:  boolean;
  createdAt:     number;
  acknowledgedAt?: number;
}

export function createSecurityEvent(
  opts: Pick<SecurityEvent, "type" | "severity" | "summary"> &
    Partial<Pick<SecurityEvent, "missionId" | "connectorId" | "detail">>
): SecurityEvent {
  return {
    id:           `sec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type:         opts.type,
    severity:     opts.severity,
    missionId:    opts.missionId,
    connectorId:  opts.connectorId,
    summary:      opts.summary,
    detail:       opts.detail,
    acknowledged: false,
    createdAt:    Date.now(),
  };
}

export function acknowledgeEvent(event: SecurityEvent): SecurityEvent {
  return { ...event, acknowledged: true, acknowledgedAt: Date.now() };
}

/**
 * Derive the sovereign trust signal from the active security event ledger.
 * This is the single exported security truth bit.
 *
 * healthy — no unacknowledged events
 * warn    — unacknowledged warn/info events
 * breach  — any unacknowledged critical or breach event
 */
export function deriveTrustSignal(events: SecurityEvent[]): TrustSignal {
  const active = events.filter((e) => !e.acknowledged);
  if (active.some((e) => e.severity === "breach" || e.severity === "critical")) return "breach";
  if (active.some((e) => e.severity === "warn"))                                 return "warn";
  return "healthy";
}

export function getUnacknowledgedEvents(events: SecurityEvent[]): SecurityEvent[] {
  return events
    .filter((e) => !e.acknowledged)
    .sort((a, b) => {
      const rank: Record<SecuritySeverity, number> = { breach: 0, critical: 1, warn: 2, info: 3 };
      return rank[a.severity] - rank[b.severity] || b.createdAt - a.createdAt;
    });
}

// ─── SOVEREIGN SECURITY STATE ─────────────────────────────────────────────────

/**
 * The unified sovereign security state.
 * Per-product (not per-mission) — security is a product-level concern.
 */
export interface SovereignSecurityState {
  session:           OperatorSession | null;
  sessionAnomalies:  SessionAnomaly[];
  connectorRecords:  ConnectorSecurityRecord[];
  isolationBoundaries: MissionIsolationBoundary[];
  events:            SecurityEvent[];
  trustSignal:       TrustSignal;
  lastAuditAt:       number;
}

export function defaultSovereignSecurityState(): SovereignSecurityState {
  return {
    session:            null,
    sessionAnomalies:   [],
    connectorRecords:   [],
    isolationBoundaries: [],
    events:             [],
    trustSignal:        "healthy",
    lastAuditAt:        Date.now(),
  };
}

export function updateTrustSignal(state: SovereignSecurityState): SovereignSecurityState {
  return { ...state, trustSignal: deriveTrustSignal(state.events), lastAuditAt: Date.now() };
}
