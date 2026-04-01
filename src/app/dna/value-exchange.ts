/**
 * RUBERRA STACK 15 — Value Exchange
 * Mission output becomes transferable, verifiable, and consequence-bearing.
 *
 * Value exchange is not a marketplace.
 * It is a sovereign layer where mission outputs become first-class transferable units.
 */

import { assertStackOrder } from "./canon-sovereignty";
import { type MissionId } from "./mission-substrate";

const _g = assertStackOrder("value", ["operations", "governance", "distribution"]);
if (!_g.valid) console.warn("[Ruberra Value Exchange] Stack order violation:", _g.reason);

// ─── Value units ──────────────────────────────────────────────────────────────

export type ValueUnitType =
  | "artifact"     // A produced mission output
  | "capability"   // Access to a specialized execution capability
  | "knowledge"    // A verified knowledge package
  | "service"      // An ongoing mission-as-a-service offering
  | "credential";  // A verified proof of execution or mastery

export type ValueStatus =
  | "draft"         // Being formed, not yet ready for exchange
  | "available"     // Ready for transfer
  | "reserved"      // Claimed but not yet transferred
  | "transferred"   // Ownership has moved
  | "revoked";      // Value unit withdrawn

export interface ValueUnit {
  id:           string;
  type:         ValueUnitType;
  missionId:    MissionId;
  label:        string;
  description:  string;
  status:       ValueStatus;
  ownerId:      string;        // Current operator owner
  createdAt:    number;
  updatedAt:    number;
  verifiedAt?:  number;        // When governance layer verified this unit
  expiresAt?:   number;        // Optional expiry
}

export function mintValue(
  missionId: MissionId,
  ownerId: string,
  opts: Pick<ValueUnit, "type" | "label" | "description">
): ValueUnit {
  const now = Date.now();
  return {
    id:          `val_${now}_${Math.random().toString(36).slice(2, 8)}`,
    type:        opts.type,
    missionId,
    label:       opts.label,
    description: opts.description,
    status:      "draft",
    ownerId,
    createdAt:   now,
    updatedAt:   now,
  };
}

export function makeAvailable(unit: ValueUnit): ValueUnit {
  return { ...unit, status: "available", updatedAt: Date.now() };
}

export function verifyValueUnit(unit: ValueUnit): ValueUnit {
  return { ...unit, verifiedAt: Date.now(), updatedAt: Date.now() };
}

// ─── Transfer ─────────────────────────────────────────────────────────────────

export type TransferMethod = "direct" | "governed" | "conditional";

export interface TransferRecord {
  id:           string;
  valueUnitId:  string;
  fromOperator: string;
  toOperator:   string;
  method:       TransferMethod;
  conditions?:  string[];    // For conditional transfers
  fulfilled:    boolean;
  initiatedAt:  number;
  completedAt?: number;
}

export function initiateTransfer(
  unitId: string,
  from: string,
  to: string,
  method: TransferMethod = "direct",
  conditions?: string[]
): TransferRecord {
  return {
    id:           `tr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    valueUnitId:  unitId,
    fromOperator: from,
    toOperator:   to,
    method,
    conditions,
    fulfilled:    false,
    initiatedAt:  Date.now(),
  };
}

export function completeTransfer(record: TransferRecord): TransferRecord {
  return { ...record, fulfilled: true, completedAt: Date.now() };
}

export function transferValue(
  unit: ValueUnit,
  record: TransferRecord
): ValueUnit {
  if (!record.fulfilled) return unit;
  return { ...unit, ownerId: record.toOperator, status: "transferred", updatedAt: Date.now() };
}

// ─── Verification chain ───────────────────────────────────────────────────────

export interface VerificationEntry {
  id:          string;
  valueUnitId: string;
  verifiedBy:  string;    // Operator or system agent ID
  verdict:     "pass" | "fail" | "conditional";
  notes:       string;
  at:          number;
}

export interface VerificationChain {
  valueUnitId: string;
  entries:     VerificationEntry[];
  currentVerdict: "unverified" | "pass" | "fail" | "conditional";
}

export function appendVerification(
  chain: VerificationChain,
  entry: VerificationEntry
): VerificationChain {
  const entries = [...chain.entries, entry];
  // Latest entry drives current verdict
  return { ...chain, entries, currentVerdict: entry.verdict === "pass" ? "pass" : entry.verdict === "fail" ? "fail" : "conditional" };
}

// ─── Exchange ledger ──────────────────────────────────────────────────────────

export interface ExchangeLedger {
  units:         ValueUnit[];
  transfers:     TransferRecord[];
  verifications: VerificationChain[];
  lastUpdated:   number;
}

export function defaultExchangeLedger(): ExchangeLedger {
  return { units: [], transfers: [], verifications: [], lastUpdated: Date.now() };
}

export function addValueUnit(ledger: ExchangeLedger, unit: ValueUnit): ExchangeLedger {
  return { ...ledger, units: [...ledger.units, unit], lastUpdated: Date.now() };
}

export function recordTransfer(ledger: ExchangeLedger, record: TransferRecord): ExchangeLedger {
  return { ...ledger, transfers: [...ledger.transfers, record], lastUpdated: Date.now() };
}

// ─── Value policy ─────────────────────────────────────────────────────────────

export interface ValuePolicy {
  missionId:         MissionId;
  allowedTypes:      ValueUnitType[];
  requireGovernance: boolean;  // All transfers must be governance-approved
  maxTransferDepth:  number;   // How many times a unit can be re-transferred
}

export function defaultValuePolicy(missionId: MissionId): ValuePolicy {
  return {
    missionId,
    allowedTypes:      ["artifact", "knowledge"],
    requireGovernance: false,
    maxTransferDepth:  3,
  };
}

// ─── Unified state ────────────────────────────────────────────────────────────

export interface ValueExchangeState {
  ledger:      ExchangeLedger;
  policies:    Record<MissionId, ValuePolicy>;
  lastUpdated: number;
}

export function defaultValueExchangeState(): ValueExchangeState {
  return { ledger: defaultExchangeLedger(), policies: {}, lastUpdated: Date.now() };
}
