/**
 * RUBERRA GOVERNANCE FABRIC — Stack 07: Trust + Governance
 * Constitutional Layer · Substrate · Installed 2026-04-01
 *
 * Governance is not a feature. It is the spine.
 * Every system action carries a provenance chain.
 * Every consequence is attributed. Every trust gate is enforceable.
 *
 * Anti-patterns rejected:
 *   — governance as ceremony
 *   — audit trails that are never read
 *   — compliance over consequence
 *   — trust-by-default
 *
 * Dependencies: canon, mission, security
 */

// ─── ACTION ACTORS ────────────────────────────────────────────────────────────

export type GovernanceActorKind =
  | "operator"        // human sovereign — authenticated session
  | "pioneer"         // named AI agent with domain authority
  | "subagent"        // scoped sub-agent spawned by pioneer
  | "system"          // internal Ruberra system process
  | "connector"       // external connector executing under contract
  | "governance";     // the governance fabric itself acting on itself

export interface GovernanceActor {
  kind:       GovernanceActorKind;
  id:         string;       // operator ID, pioneer ID, or system process name
  label:      string;
  missionId?: string;       // mission context at time of action (if known)
  chamberId?: string;       // chamber context at time of action (if known)
}

// ─── AUDIT RECORD ─────────────────────────────────────────────────────────────

export type AuditVerdict =
  | "allowed"         // action proceeded
  | "blocked"         // action rejected by trust gate
  | "deferred"        // action held pending approval
  | "overridden"      // action blocked but operator force-approved
  | "partial"         // action started but did not complete cleanly
  | "reversed";       // action was subsequently reversed

export type AuditSeverity = "trace" | "info" | "warn" | "critical" | "sovereign";

export interface AuditRecord {
  /** Globally unique audit event identifier */
  id:              string;
  /** Monotonic timestamp in ms since epoch — immutable after creation */
  timestamp:       number;
  /** The actor that initiated the action */
  actor:           GovernanceActor;
  /** Short canonical name for the action class */
  action:          string;
  /** Human-readable description of what was attempted */
  intent:          string;
  /** What actually changed as a result — empty if blocked */
  consequence:     string;
  /** Verdict returned by the trust gate */
  verdict:         AuditVerdict;
  /** Severity classification */
  severity:        AuditSeverity;
  /** Chain of prior audit IDs this action depends on (provenance) */
  provenanceChain: string[];
  /** Mission this action belongs to */
  missionId?:      string;
  /** Stack that owns this action class */
  stackId?:        string;
  /** Additional structured context — never contains secrets */
  meta:            Record<string, string | number | boolean>;
}

// ─── PROVENANCE CHAIN ─────────────────────────────────────────────────────────

export interface ProvenanceLink {
  auditId:    string;
  action:     string;
  actorId:    string;
  timestamp:  number;
  verdict:    AuditVerdict;
}

export interface ProvenanceChain {
  /** The terminal output or object whose lineage this represents */
  subjectId:   string;
  subjectKind: string;
  /** Ordered from origin to most recent */
  links:       ProvenanceLink[];
  /** True if chain is complete — no gaps */
  intact:      boolean;
}

// ─── TRUST GATES ─────────────────────────────────────────────────────────────

export type TrustGatePolicy =
  | "allow-all"       // no restriction (constitution-level bootstrap only)
  | "operator-only"   // only authenticated operators may proceed
  | "pioneer-scoped"  // only the named pioneer may proceed
  | "mission-bound"   // actor must be operating within an active mission
  | "require-audit"   // action allowed but must produce an audit record
  | "require-approval"// action deferred until operator explicit approval
  | "deny-always";    // this action is permanently blocked in this context

export interface TrustGate {
  id:       string;
  label:    string;
  policy:   TrustGatePolicy;
  /** Actions this gate governs — exact match or glob-style prefix */
  covers:   string[];
  /** Conditions under which a stricter policy applies */
  escalate?: {
    when:   string;          // condition description
    policy: TrustGatePolicy;
  };
  reason:   string;
}

export const RUBERRA_TRUST_GATES: Readonly<TrustGate[]> = [
  {
    id:      "mission-write-gate",
    label:   "Mission Write Gate",
    policy:  "operator-only",
    covers:  ["mission.create", "mission.archive", "mission.transfer"],
    reason:  "Mission lifecycle mutations are operator-sovereign acts.",
  },
  {
    id:      "pioneer-spawn-gate",
    label:   "Pioneer Spawn Gate",
    policy:  "mission-bound",
    covers:  ["pioneer.spawn", "subagent.spawn"],
    escalate: {
      when:   "pioneer.canSpawnSubagents === false",
      policy: "deny-always",
    },
    reason:  "Agents may only be spawned within an active mission context.",
  },
  {
    id:      "connector-write-gate",
    label:   "Connector Write Gate",
    policy:  "require-approval",
    covers:  ["connector.write", "connector.deploy", "connector.webhook"],
    reason:  "Connector writes and deploys are irreversible external actions — operator approval required.",
  },
  {
    id:      "data-export-gate",
    label:   "Data Export Gate",
    policy:  "require-audit",
    covers:  ["data.export", "output.transfer"],
    reason:  "All data leaving Ruberra must carry a full provenance trail.",
  },
  {
    id:      "governance-self-gate",
    label:   "Governance Self-Mutation Gate",
    policy:  "deny-always",
    covers:  ["governance.modify-trust-gate", "governance.erase-audit-record"],
    reason:  "The governance fabric cannot be mutated or censored by any actor — including itself.",
  },
  {
    id:      "constitution-gate",
    label:   "Constitutional Mutation Gate",
    policy:  "deny-always",
    covers:  ["constitution.modify", "stack-registry.overwrite", "identity.redefine"],
    reason:  "Constitutional substrate is immutable at runtime. Changes require sovereign authorization out-of-band.",
  },
  {
    id:      "default-audit-gate",
    label:   "Default Audit Gate (catch-all)",
    policy:  "require-audit",
    covers:  ["*"],
    reason:  "GOVERNANCE_LAW[0]: every action produces an AuditRecord — no unregistered action may proceed silently.",
  },
] as const;

// ─── CONSEQUENCE TRAIL ────────────────────────────────────────────────────────

export type ConsequenceKind =
  | "state-change"    // system state mutated
  | "output-produced" // a new output object was created
  | "agent-spawned"   // a new agent was launched
  | "connector-fired" // an external connector was invoked
  | "mission-event"   // mission lifecycle advanced
  | "knowledge-write" // knowledge graph updated
  | "value-event"     // value exchange transaction recorded
  | "no-op";          // action produced no consequence (blocked or dry-run)

export interface ConsequenceRecord {
  id:           string;
  auditId:      string;           // links back to the AuditRecord that produced this
  kind:         ConsequenceKind;
  subjectId:    string;
  subjectKind:  string;
  description:  string;
  reversible:   boolean;
  reversedById?: string;          // AuditRecord ID of the reversal action, if reversed
  timestamp:    number;
}

// ─── GOVERNANCE SESSION ───────────────────────────────────────────────────────

/**
 * A governance session is a bounded window of authority.
 * It ties a stream of audit records to an operator session and a mission context.
 * When the session closes, all pending approvals expire.
 */
export interface GovernanceSession {
  id:          string;
  operatorId:  string;
  missionId?:  string;
  openedAt:    number;
  closedAt?:   number;
  auditIds:    string[];
  state:       "open" | "closed" | "expired";
}

// ─── GOVERNANCE LAW ───────────────────────────────────────────────────────────

/**
 * The immutable laws of the governance fabric.
 * These are enforced at the substrate level — not configurable.
 */
export const GOVERNANCE_LAWS: readonly string[] = [
  "Every system action produces an AuditRecord — no silent mutations.",
  "Every output object carries a ProvenanceChain — no unattributed outputs.",
  "Every actor is identified — no anonymous system actions.",
  "Trust gates cannot be bypassed by any actor, including governance itself.",
  "Audit records are append-only — no record may be modified or deleted after creation.",
  "Governance self-mutation is permanently blocked — the fabric cannot revise its own history.",
  "Constitution-level substrate is immutable at runtime — it requires out-of-band sovereign authorization.",
  "Every consequence is recorded — no invisible side-effects.",
] as const;

/**
 * Anti-patterns that governance explicitly rejects.
 */
export const GOVERNANCE_REJECTS: readonly string[] = [
  "governance as ceremony",
  "audit trails that are never read",
  "compliance over consequence",
  "trust-by-default for external actors",
  "governance toggles that can be disabled",
  "audit records that can be purged",
  "trust gates that can be bypassed at runtime",
] as const;

// ─── RUNTIME HELPERS ──────────────────────────────────────────────────────────

export function buildAuditId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildConsequenceId(): string {
  return `cq_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildGovernanceSessionId(): string {
  return `gsess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function resolveGate(action: string, gates: readonly TrustGate[]): TrustGate | undefined {
  // Exact match or prefix match first; wildcard catch-all last
  return gates.find((g) =>
    g.covers.some((c) =>
      c === "*" ? false : (action === c || action.startsWith(c.replace(".*", "")))
    )
  ) ?? gates.find((g) => g.covers.includes("*"));
}

export function isActionAllowed(
  action: string,
  actor: GovernanceActor,
  gates: readonly TrustGate[] = RUBERRA_TRUST_GATES,
): { allowed: boolean; gate?: TrustGate; verdict: AuditVerdict } {
  const gate = resolveGate(action, gates);
  // No gate should never occur with the catch-all installed; guard defensively
  if (!gate) return { allowed: false, verdict: "blocked" };

  switch (gate.policy) {
    case "allow-all":       return { allowed: true,  gate, verdict: "allowed" };
    case "deny-always":     return { allowed: false, gate, verdict: "blocked" };
    case "require-approval":return { allowed: false, gate, verdict: "deferred" };
    case "require-audit":   return { allowed: true,  gate, verdict: "allowed" };
    case "operator-only":   return {
      allowed:  actor.kind === "operator",
      gate,
      verdict:  actor.kind === "operator" ? "allowed" : "blocked",
    };
    case "pioneer-scoped":  return {
      allowed:  actor.kind === "pioneer" || actor.kind === "operator",
      gate,
      verdict:  (actor.kind === "pioneer" || actor.kind === "operator") ? "allowed" : "blocked",
    };
    case "mission-bound":   return {
      allowed:  !!actor.missionId,
      gate,
      verdict:  actor.missionId ? "allowed" : "blocked",
    };
    default:                return { allowed: false, gate, verdict: "blocked" };
  }
}

export function buildAuditRecord(
  params: Omit<AuditRecord, "id" | "timestamp">,
): AuditRecord {
  return {
    ...params,
    id:        buildAuditId(),
    timestamp: Date.now(),
  };
}

export function buildProvenanceChain(
  subjectId:   string,
  subjectKind: string,
  links:       ProvenanceLink[],
): ProvenanceChain {
  const intact = links.length > 0 && links.every((l) => l.verdict === "allowed");
  return { subjectId, subjectKind, links: [...links].sort((a, b) => a.timestamp - b.timestamp), intact };
}

// ─── Execution gate enforcement ───────────────────────────────────────────────

export interface ExecutionGateResult {
  allowed:   boolean;
  verdict:   AuditVerdict;
  gateName?: string;
  auditId:   string;
  reason:    string;
}

/**
 * Enforce a trust gate for a named action and actor.
 * Returns a structured result with audit ID for recording.
 * This is the single call site for all execution gate enforcement.
 */
export function enforceExecutionGate(
  action: string,
  actor:  GovernanceActor,
  gates:  readonly TrustGate[] = RUBERRA_TRUST_GATES,
): ExecutionGateResult {
  const result  = isActionAllowed(action, actor, gates);
  const auditId = buildAuditId();
  return {
    allowed:  result.allowed,
    verdict:  result.verdict,
    gateName: result.gate?.label ?? result.gate?.id,
    auditId,
    reason:   result.allowed
      ? `${result.gate?.label ?? result.gate?.id ?? "default"} · ${result.verdict}`
      : `blocked by ${result.gate?.label ?? result.gate?.id ?? "default"} gate`,
  };
}
