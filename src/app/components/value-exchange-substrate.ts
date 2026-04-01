/**
 * RUBERRA VALUE EXCHANGE SUBSTRATE — Stack 15: Value Exchange
 * Constitutional Layer · Substrate · Installed 2026-04-01
 *
 * A native value exchange layer where mission output becomes transferable,
 * monetizable, and verifiable — no third-party marketplace dependency.
 *
 * Anti-patterns rejected:
 *   — value extraction by intermediaries
 *   — platform take rates that erode operator sovereignty
 *   — value locked in closed ecosystems
 *   — manual invoicing outside the system
 *
 * Dependencies: operations, governance, distribution
 */

// ─── VALUE UNIT ───────────────────────────────────────────────────────────────

export type ValueUnitKind =
  | "output"          // a mission output offered for transfer
  | "service"         // a repeatable operator-defined service
  | "license"         // a time-bound access right to an output or capability
  | "bundle"          // a collection of outputs/services
  | "subscription"    // recurring access to an operator or system capability
  | "commission";     // a share of future value from a downstream mission

export type ValueCurrency =
  | "sovereign"       // Ruberra's native internal unit (not external currency)
  | "fiat-USD"        // US dollar (external settlement)
  | "fiat-EUR"        // Euro (external settlement)
  | "fiat-GBP"        // Pound (external settlement)
  | "crypto";         // programmable money (external settlement)

export interface ValueUnit {
  id:              string;
  kind:            ValueUnitKind;
  title:           string;
  description:     string;
  /** Operator who owns and offers this unit */
  ownerId:         string;
  /** Mission that produced this unit */
  missionId?:      string;
  /** Output object IDs that constitute this unit */
  outputIds:       string[];
  /** Provenance chain proving authenticity */
  provenanceChainId: string;
  currency:        ValueCurrency;
  price:           number;
  /** Whether this unit can be transferred to another operator */
  transferable:    boolean;
  /** Whether this unit's provenance can be verified by recipient */
  verifiable:      boolean;
  createdAt:       number;
  expiresAt?:      number;
  status:          "draft" | "listed" | "sold" | "transferred" | "expired" | "revoked";
}

// ─── VALUE TRANSACTION ────────────────────────────────────────────────────────

export type TransactionStatus =
  | "initiated"
  | "pending-verification"
  | "settled"
  | "failed"
  | "refunded"
  | "disputed";

export interface ValueTransaction {
  id:             string;
  valueUnitId:    string;
  senderId:       string;         // operator paying / receiving
  receiverId:     string;         // operator receiving value
  currency:       ValueCurrency;
  amount:         number;
  /** Ruberra's share — zero until take-rate policy is set */
  platformFee:    number;
  /** Net amount to receiver after fee */
  netAmount:      number;
  status:         TransactionStatus;
  initiatedAt:    number;
  settledAt?:     number;
  provenanceChainId: string;
  auditId:        string;
  /** External reference if settlement goes through an external rail */
  externalRef?:   string;
}

// ─── VALUE OFFER ──────────────────────────────────────────────────────────────

export interface ValueOffer {
  id:          string;
  valueUnitId: string;
  ownerId:     string;
  targetId?:   string;   // directed offer to a specific operator (null = open market)
  message:     string;
  expiresAt?:  number;
  status:      "open" | "accepted" | "declined" | "expired" | "withdrawn";
  createdAt:   number;
}

// ─── TRANSFER CONTRACT ────────────────────────────────────────────────────────

/**
 * A TransferContract encodes the rights and obligations that move with a ValueUnit.
 * The recipient receives exactly what the contract specifies — no more, no less.
 */
export interface TransferContract {
  id:              string;
  valueUnitId:     string;
  transactionId:   string;
  grantorId:       string;
  recipientId:     string;
  /** What the recipient is permitted to do with this value unit */
  rights:          ValueRight[];
  /** Obligations the recipient carries */
  obligations:     string[];
  /** Whether the recipient may re-transfer */
  sublicensable:   boolean;
  effectiveAt:     number;
  expiresAt?:      number;
  auditId:         string;
}

export type ValueRight =
  | "read"            // may read the output
  | "use"             // may use the output in their own work
  | "deploy"          // may deploy or publish the output
  | "distribute"      // may share the output with others
  | "modify"          // may create derivative works
  | "monetize";       // may charge others for access to the output

// ─── VALUE EXCHANGE LAWS ──────────────────────────────────────────────────────

export const VALUE_EXCHANGE_LAWS: readonly string[] = [
  "Value exchange is native — operators never leave Ruberra to monetize their mission output.",
  "Every value transaction carries a provenance chain — provenance cannot be stripped from transferred outputs.",
  "Transfer contracts are explicit — recipients receive exactly the rights the contract specifies.",
  "Platform fees are transparent and operator-consented — no hidden take rates.",
  "Value is sovereign — Ruberra does not lock mission outputs in a closed marketplace.",
  "Every transaction produces an audit record — no value exchange occurs silently.",
  "Verification is built-in — any recipient can verify the authenticity of what they received.",
] as const;

export const VALUE_EXCHANGE_REJECTS: readonly string[] = [
  "Gumroad",
  "Stripe Connect",
  "third-party marketplaces",
  "manual invoicing for mission output",
  "value extraction by intermediaries",
  "platform take rates that erode operator sovereignty",
  "value locked in closed ecosystems",
  "output transferred without provenance chain",
] as const;

// ─── RUNTIME HELPERS ──────────────────────────────────────────────────────────

export function buildValueUnitId(): string {
  return `vu_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildTransactionId(): string {
  return `tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildTransferContractId(): string {
  return `tc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function computeNetAmount(amount: number, platformFee: number): number {
  return Math.max(0, amount - platformFee);
}
