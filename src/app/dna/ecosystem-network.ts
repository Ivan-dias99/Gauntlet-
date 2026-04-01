/**
 * RUBERRA STACK 16 — Ecosystem Network
 * A sovereign ecosystem of vetted, consequence-bearing extensions.
 * Not a plugin marketplace. Not an app store.
 *
 * Every extension admitted to Ruberra is consequence-bearing.
 * It either earns its position or is removed.
 */

import { assertStackOrder } from "./canon-sovereignty";

const _g = assertStackOrder("ecosystem", ["governance", "distribution", "value"]);
if (!_g.valid) console.warn("[Ruberra Ecosystem] Stack order violation:", _g.reason);

// ─── Extension types ──────────────────────────────────────────────────────────

export type ExtensionType =
  | "connector"     // External service integration
  | "intelligence"  // Specialized intelligence module
  | "workflow"      // Pre-built mission workflow template
  | "surface"       // UI surface extension
  | "agent"         // Specialized domain agent
  | "analytics";    // Analytics module

export type ExtensionStatus =
  | "proposed"      // Submitted for vetting
  | "vetting"       // Under active review
  | "admitted"      // Cleared for use
  | "probationary"  // Admitted with active monitoring
  | "suspended"     // Temporarily blocked
  | "ejected";      // Permanently removed

export type VettingVerdict = "pass" | "conditional" | "fail";

export interface EcosystemExtension {
  id:           string;
  name:         string;
  type:         ExtensionType;
  authorId:     string;
  description:  string;
  status:       ExtensionStatus;
  capabilities: string[];
  consequences: string[];   // What this extension can change in the system
  version:      string;
  submittedAt:  number;
  updatedAt:    number;
}

export function proposeExtension(
  opts: Pick<EcosystemExtension, "id" | "name" | "type" | "authorId" | "description" | "capabilities" | "consequences" | "version">
): EcosystemExtension {
  const now = Date.now();
  return { ...opts, status: "proposed", submittedAt: now, updatedAt: now };
}

// ─── Vetting ──────────────────────────────────────────────────────────────────

export interface VettingCheck {
  id:           string;
  criterion:    string;
  verdict:      VettingVerdict;
  notes:        string;
  checkedAt:    number;
}

export interface VettingRecord {
  extensionId: string;
  checks:      VettingCheck[];
  finalVerdict?: VettingVerdict;
  reviewerId:  string;
  startedAt:   number;
  completedAt?: number;
}

export function createVettingRecord(extensionId: string, reviewerId: string): VettingRecord {
  return {
    extensionId,
    checks:    [],
    reviewerId,
    startedAt: Date.now(),
  };
}

export function addVettingCheck(
  record: VettingRecord,
  criterion: string,
  verdict: VettingVerdict,
  notes: string
): VettingRecord {
  const check: VettingCheck = {
    id:        `vc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    criterion,
    verdict,
    notes,
    checkedAt: Date.now(),
  };
  return { ...record, checks: [...record.checks, check] };
}

export function finalizeVetting(record: VettingRecord): VettingRecord {
  const failCount  = record.checks.filter((c) => c.verdict === "fail").length;
  const condCount  = record.checks.filter((c) => c.verdict === "conditional").length;
  const verdict: VettingVerdict =
    failCount > 0     ? "fail" :
    condCount > 0     ? "conditional" : "pass";
  return { ...record, finalVerdict: verdict, completedAt: Date.now() };
}

export function admitExtension(
  ext: EcosystemExtension,
  record: VettingRecord
): EcosystemExtension {
  const status: ExtensionStatus =
    record.finalVerdict === "pass"        ? "admitted" :
    record.finalVerdict === "conditional" ? "probationary" : "ejected";
  return { ...ext, status, updatedAt: Date.now() };
}

// ─── Consequence enforcement ──────────────────────────────────────────────────

export interface ExtensionConsequence {
  extensionId: string;
  type:        "positive" | "neutral" | "negative";
  description: string;
  at:          number;
}

export function recordExtensionConsequence(
  extensionId: string,
  type: ExtensionConsequence["type"],
  description: string
): ExtensionConsequence {
  return { extensionId, type, description, at: Date.now() };
}

export function shouldEject(consequences: ExtensionConsequence[]): boolean {
  const recent = consequences.filter((c) => Date.now() - c.at < 7 * 86_400_000); // last 7 days
  const negCount = recent.filter((c) => c.type === "negative").length;
  return negCount >= 3;
}

// ─── Network state ────────────────────────────────────────────────────────────

export interface EcosystemNetworkState {
  extensions:   EcosystemExtension[];
  vettingQueue: VettingRecord[];
  consequences: ExtensionConsequence[];
  lastUpdated:  number;
}

export function defaultEcosystemState(): EcosystemNetworkState {
  return { extensions: [], vettingQueue: [], consequences: [], lastUpdated: Date.now() };
}

export function admitToNetwork(
  state: EcosystemNetworkState,
  ext: EcosystemExtension
): EcosystemNetworkState {
  const extensions = [...state.extensions.filter((e) => e.id !== ext.id), ext];
  return { ...state, extensions, lastUpdated: Date.now() };
}

export function getAdmittedExtensions(state: EcosystemNetworkState): EcosystemExtension[] {
  return state.extensions.filter((e) => e.status === "admitted" || e.status === "probationary");
}
