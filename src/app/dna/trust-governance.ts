/**
 * RUBERRA STACK 07 — Trust + Governance
 * Provenance, consequence, and policy substrate.
 *
 * Governance is not compliance theater. It is the sovereign record
 * of every consequential action — who, what, when, and what it produced.
 *
 * Every action with consequence must be audited.
 * Every consequence must be recorded.
 * Every actor must carry a trust level.
 * Policy is the law that governs what is permitted before it happens.
 *
 * DO NOT add enterprise compliance checklists.
 * DO NOT treat this as an audit log dashboard.
 * Governance is consequence-bearing and silent until consulted.
 */

import { assertStackOrder } from "./canon-sovereignty";
import { type MissionId } from "./mission-substrate";

// ─── Stack order guard ────────────────────────────────────────────────────────

const _g = assertStackOrder("governance", ["canon", "mission", "security"]);
if (!_g.valid) {
  console.warn("[Ruberra Trust + Governance] Stack order violation:", _g.reason);
}

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────

export type AuditEntryId       = string;
export type ConsequenceRecordId = string;
export type TrustActorId       = string;

// ─── TRUST LEVEL ──────────────────────────────────────────────────────────────

/**
 * The five-level trust hierarchy.
 * Level is earned through basis, not assumed.
 * Sovereign is the terminal trust level — assigned only through explicit constitution act.
 */
export type TrustLevel = "none" | "low" | "standard" | "high" | "sovereign";

export const TRUST_LEVEL_RANK: Record<TrustLevel, number> = {
  none:     0,
  low:      1,
  standard: 2,
  high:     3,
  sovereign: 4,
} as const;

// ─── TRUST RECORD ─────────────────────────────────────────────────────────────

/**
 * A trust record binds an actor to a trust level with a provable basis.
 * Trust is not inferred — it is granted with a reason and an optional expiry.
 */
export interface TrustRecord {
  actorId:    TrustActorId;
  level:      TrustLevel;
  basis:      string;         // Why this trust level was granted
  grantedAt:  number;
  expiresAt?: number;         // If set, trust degrades to "none" after this timestamp
}

export function createTrustRecord(
  actorId: TrustActorId,
  level: TrustLevel,
  basis: string,
  expiresAt?: number,
): TrustRecord {
  return {
    actorId,
    level,
    basis,
    grantedAt: Date.now(),
    expiresAt,
  };
}

export function evaluateTrustRecord(record: TrustRecord): TrustLevel {
  if (record.expiresAt !== undefined && Date.now() > record.expiresAt) return "none";
  return record.level;
}

// ─── AUDIT ENTRY ─────────────────────────────────────────────────────────────

/**
 * An audit entry is the immutable record of a consequential action.
 * Hash is a deterministic fingerprint of the entry content — enabling chain integrity.
 * Every entry knows its consequence and the actor who performed the action.
 */
export interface AuditEntry {
  id:          AuditEntryId;
  missionId:   MissionId;
  action:      string;       // What action was taken — canonical name
  actor:       TrustActorId; // Who performed the action
  at:          number;       // Unix ms timestamp
  consequence: string;       // What this action produced or changed
  hash:        string;       // Deterministic fingerprint of this entry's content
}

/**
 * Derive a deterministic hash from an audit entry's content.
 * Pure function — same inputs always produce same output.
 * Not cryptographic-grade — sovereign audit fingerprint only.
 */
function hashEntryContent(
  missionId: MissionId,
  action: string,
  actor: TrustActorId,
  at: number,
  consequence: string,
  prevHash?: string,
): string {
  const raw = [missionId, action, actor, String(at), consequence, prevHash ?? "genesis"].join("|");
  // Deterministic djb2-style hash — no side effects, no crypto API dependency
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) + hash) ^ raw.charCodeAt(i);
    hash = hash >>> 0; // Convert to unsigned 32-bit
  }
  return hash.toString(16).padStart(8, "0");
}

export function createAuditEntry(
  missionId: MissionId,
  action: string,
  actor: TrustActorId,
  consequence: string,
  prevHash?: string,
): AuditEntry {
  const at   = Date.now();
  const id   = `audit_${at}_${Math.random().toString(36).slice(2, 8)}`;
  const hash = hashEntryContent(missionId, action, actor, at, consequence, prevHash);
  return { id, missionId, action, actor, at, consequence, hash };
}

// ─── PROVENANCE CHAIN ────────────────────────────────────────────────────────

/**
 * A provenance chain is the ordered, hash-linked record of all audit entries.
 * The rootHash anchors the chain. The tip is the hash of the last entry.
 * Any tampering with an entry breaks the chain — detectable at verification.
 */
export interface ProvenanceChain {
  entries:  AuditEntry[];
  rootHash: string;       // Hash of the genesis (first) entry
  tip:      string;       // Hash of the most recent entry
}

export function appendToChain(
  chain: ProvenanceChain,
  entry: AuditEntry,
): ProvenanceChain {
  return {
    entries:  [...chain.entries, entry],
    rootHash: chain.rootHash,
    tip:      entry.hash,
  };
}

export function createProvenanceChain(firstEntry: AuditEntry): ProvenanceChain {
  return {
    entries:  [firstEntry],
    rootHash: firstEntry.hash,
    tip:      firstEntry.hash,
  };
}

/**
 * Verify chain integrity by re-hashing each entry and confirming hash links.
 * Returns true if the chain is clean.
 */
export function verifyChainIntegrity(chain: ProvenanceChain): boolean {
  if (chain.entries.length === 0) return true;
  for (let i = 0; i < chain.entries.length; i++) {
    const entry   = chain.entries[i];
    const prevHash = i === 0 ? undefined : chain.entries[i - 1].hash;
    const expected = hashEntryContent(
      entry.missionId,
      entry.action,
      entry.actor,
      entry.at,
      entry.consequence,
      prevHash,
    );
    if (entry.hash !== expected) return false;
  }
  return chain.tip === chain.entries[chain.entries.length - 1].hash;
}

// ─── GOVERNANCE POLICY ───────────────────────────────────────────────────────

/**
 * A governance policy governs what actions require audit,
 * which fields become immutable after a threshold, and who is trusted to act.
 *
 * Policy is mission-bound. Not product-wide.
 */
export interface GovernancePolicy {
  missionId:       MissionId;
  requireAuditFor: string[];      // Action names that must be audited
  immutableAfter:  string[];      // Field names that lock after first write
  trustedActors:   TrustActorId[]; // Actors recognized as trusted by this mission
}

export function defaultGovernancePolicy(missionId: MissionId): GovernancePolicy {
  return {
    missionId,
    requireAuditFor: [
      "mission_transition",
      "artifact_export",
      "policy_change",
      "trust_grant",
      "handoff_initiate",
    ],
    immutableAfter: ["identity.name", "identity.chamberLead"],
    trustedActors:  [],
  };
}

/**
 * Evaluate whether an action by an actor is permitted under a governance policy.
 * Returns a permit decision, whether audit is required, and the reason.
 */
export function evaluateGovernance(
  action: string,
  actorId: TrustActorId,
  policy: GovernancePolicy,
): { permitted: boolean; auditRequired: boolean; reason: string } {
  const auditRequired = policy.requireAuditFor.includes(action);

  // If the action requires audit, actor must be in the trusted set (or trusted set is open)
  if (auditRequired && policy.trustedActors.length > 0 && !policy.trustedActors.includes(actorId)) {
    return {
      permitted:    false,
      auditRequired,
      reason: `Action "${action}" requires audit and actor "${actorId}" is not in the trusted actor set.`,
    };
  }

  return {
    permitted:    true,
    auditRequired,
    reason: auditRequired
      ? `Action "${action}" is permitted for actor "${actorId}" — audit entry required.`
      : `Action "${action}" is permitted for actor "${actorId}" — no audit required.`,
  };
}

// ─── CONSEQUENCE RECORD ───────────────────────────────────────────────────────

/**
 * A consequence record is the sovereign record of what an action produced.
 * It is more expansive than an audit entry — it carries reversibility truth.
 * If reversible=false, the consequence is permanent. This matters for governance.
 */
export interface ConsequenceRecord {
  id:          ConsequenceRecordId;
  missionId:   MissionId;
  action:      string;
  consequence: string;
  reversible:  boolean;
  at:          number;
}

export function recordConsequence(
  missionId: MissionId,
  action: string,
  consequence: string,
  reversible: boolean,
): ConsequenceRecord {
  return {
    id:         `cons_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    missionId,
    action,
    consequence,
    reversible,
    at: Date.now(),
  };
}

export function getIrreversibleConsequences(records: ConsequenceRecord[]): ConsequenceRecord[] {
  return records.filter((r) => !r.reversible);
}

// ─── GOVERNANCE LEDGER ────────────────────────────────────────────────────────

/**
 * The unified governance ledger for a mission.
 * Combines the provenance chain (audit trail) with consequence trail and policy.
 * The governance ledger is the mission's authoritative consequence record.
 */
export interface GovernanceLedger {
  missionId:       MissionId;
  auditTrail:      ProvenanceChain;
  consequenceTrail: ConsequenceRecord[];
  policy:          GovernancePolicy;
}

export function defaultGovernanceLedger(missionId: MissionId): GovernanceLedger {
  return {
    missionId,
    auditTrail:      { entries: [], rootHash: "genesis", tip: "genesis" },
    consequenceTrail: [],
    policy:          defaultGovernancePolicy(missionId),
  };
}

export function appendAuditToLedger(
  ledger: GovernanceLedger,
  action: string,
  actor: TrustActorId,
  consequence: string,
): GovernanceLedger {
  const prevHash = ledger.auditTrail.tip;
  const entry    = createAuditEntry(ledger.missionId, action, actor, consequence, prevHash);
  const chain    = ledger.auditTrail.entries.length === 0
    ? createProvenanceChain(entry)
    : appendToChain(ledger.auditTrail, entry);
  return { ...ledger, auditTrail: chain };
}

export function appendConsequenceToLedger(
  ledger: GovernanceLedger,
  action: string,
  consequence: string,
  reversible: boolean,
): GovernanceLedger {
  const record = recordConsequence(ledger.missionId, action, consequence, reversible);
  return { ...ledger, consequenceTrail: [...ledger.consequenceTrail, record] };
}

// ─── TRUST GOVERNANCE STATE ───────────────────────────────────────────────────

/**
 * The unified trust + governance state.
 * Per-product trust registry. Per-mission ledgers.
 */
export interface TrustGovernanceState {
  trustRegistry: TrustRecord[];
  ledgers:       Record<MissionId, GovernanceLedger>;
  lastUpdated:   number;
}

export function defaultTrustGovernanceState(): TrustGovernanceState {
  return {
    trustRegistry: [],
    ledgers:       {},
    lastUpdated:   Date.now(),
  };
}

export function getMissionLedger(
  state: TrustGovernanceState,
  missionId: MissionId,
): GovernanceLedger {
  return state.ledgers[missionId] ?? defaultGovernanceLedger(missionId);
}

export function upsertLedger(
  state: TrustGovernanceState,
  ledger: GovernanceLedger,
): TrustGovernanceState {
  return {
    ...state,
    ledgers:     { ...state.ledgers, [ledger.missionId]: ledger },
    lastUpdated: Date.now(),
  };
}
