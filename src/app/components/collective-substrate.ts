/**
 * RUBERRA COLLECTIVE SUBSTRATE — Stack 13: Collective Execution
 * Constitutional Layer · Substrate · Installed 2026-04-01
 *
 * Multiple operators executing under a shared mission graph with
 * consequence attribution and non-collision enforcement.
 *
 * Anti-patterns rejected:
 *   — collaboration that destroys individual consequence attribution
 *   — coordination that creates merge conflicts in intent
 *   — shared state without ownership
 *
 * Dependencies: operations, flow, multiagent
 */

// ─── COLLECTIVE SESSION ───────────────────────────────────────────────────────

export type CollectiveRole =
  | "lead"            // mission lead — final authority on direction
  | "contributor"     // contributing operator — bounded scope
  | "reviewer"        // review and validate only — no mutation rights
  | "observer"        // view-only — no write access
  | "agent";          // AI agent participating in collective execution

export interface CollectiveMember {
  operatorId:   string;
  role:         CollectiveRole;
  joinedAt:     number;
  /** Domains this member has claimed write authority over */
  claimedDomains: string[];
  /** Object IDs this member has active write locks on */
  lockedObjects: string[];
  lastActiveAt:  number;
  /** Attribution record for this member's contributions */
  contributionIds: string[];
}

export interface CollectiveSession {
  id:           string;
  missionId:    string;
  openedAt:     number;
  closedAt?:    number;
  members:      CollectiveMember[];
  /** Write lock registry — objectId → operatorId */
  writeLocks:   Record<string, string>;
  /** Merge queue — proposed mutations awaiting lead approval */
  mergeQueue:   CollectiveMergeProposal[];
  /** Consequence attribution ledger */
  attributions: AttributionRecord[];
  auditIds:     string[];
}

// ─── WRITE LOCK ENFORCEMENT ───────────────────────────────────────────────────

export interface WriteLockResult {
  granted:      boolean;
  objectId:     string;
  operatorId:   string;
  conflictWith?: string;   // operatorId of the holder if not granted
  reason?:      string;
}

export function acquireWriteLock(
  objectId:    string,
  operatorId:  string,
  session:     CollectiveSession,
): WriteLockResult {
  const existing = session.writeLocks[objectId];
  if (existing && existing !== operatorId) {
    return { granted: false, objectId, operatorId, conflictWith: existing, reason: `Object locked by ${existing}` };
  }
  session.writeLocks[objectId] = operatorId;
  const member = session.members.find((m) => m.operatorId === operatorId);
  if (member && !member.lockedObjects.includes(objectId)) {
    member.lockedObjects.push(objectId);
  }
  return { granted: true, objectId, operatorId };
}

export function releaseWriteLock(
  objectId:   string,
  operatorId: string,
  session:    CollectiveSession,
): void {
  if (session.writeLocks[objectId] === operatorId) {
    delete session.writeLocks[objectId];
    const member = session.members.find((m) => m.operatorId === operatorId);
    if (member) {
      member.lockedObjects = member.lockedObjects.filter((id) => id !== objectId);
    }
  }
}

// ─── MERGE PROPOSAL ───────────────────────────────────────────────────────────

export type MergeProposalStatus =
  | "pending"         // awaiting lead review
  | "approved"        // lead approved — ready to merge
  | "rejected"        // lead rejected — contributor must revise
  | "merged"          // merged into mission graph
  | "withdrawn";      // contributor withdrew the proposal

export interface CollectiveMergeProposal {
  id:           string;
  proposerId:   string;
  missionId:    string;
  title:        string;
  description:  string;
  /** Object IDs this proposal would mutate */
  affectedObjects: string[];
  status:       MergeProposalStatus;
  proposedAt:   number;
  reviewedAt?:  number;
  reviewedBy?:  string;
  reviewNotes?: string;
  mergedAt?:    number;
  auditId?:     string;
}

// ─── ATTRIBUTION RECORD ───────────────────────────────────────────────────────

export type ContributionKind =
  | "authored"        // original creation
  | "edited"          // modification to existing
  | "reviewed"        // validation or approval
  | "executed"        // triggered a flow or operation
  | "discovered"      // identified a pattern or insight
  | "merged";         // merged a contribution into the mission graph

export interface AttributionRecord {
  id:             string;
  operatorId:     string;
  missionId:      string;
  kind:           ContributionKind;
  description:    string;
  /** Objects this contribution produced or modified */
  objectIds:      string[];
  consequenceIds: string[];
  auditId:        string;
  recordedAt:     number;
}

// ─── COLLECTIVE LAWS ─────────────────────────────────────────────────────────

export const COLLECTIVE_LAWS: readonly string[] = [
  "Every contribution is attributed — collective work does not erase individual consequence.",
  "Write locks prevent collision — no two operators may mutate the same object simultaneously.",
  "The lead has final authority — merge proposals require lead approval before entering the mission graph.",
  "All merges are audited — the merge history is part of the mission's provenance chain.",
  "Observers cannot mutate — role boundaries are enforced at the substrate, not by convention.",
  "Collective sessions have a mission binding — there is no collective execution outside a mission.",
  "Attribution records are immutable — contributions cannot be reassigned after the fact.",
] as const;

export const COLLECTIVE_REJECTS: readonly string[] = [
  "shared Google Docs",
  "Slack threads as execution records",
  "GitHub issues as mission tracking",
  "collaboration that destroys individual consequence attribution",
  "coordination that creates merge conflicts in intent",
  "shared state with no ownership model",
] as const;

// ─── RUNTIME HELPERS ──────────────────────────────────────────────────────────

export function buildCollectiveSessionId(): string {
  return `col_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildMergeProposalId(): string {
  return `mp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildAttributionId(): string {
  return `attr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildAttributionRecord(
  params: Omit<AttributionRecord, "id" | "recordedAt">,
): AttributionRecord {
  return { ...params, id: buildAttributionId(), recordedAt: Date.now() };
}

export function getMemberRole(
  operatorId: string,
  session:    CollectiveSession,
): CollectiveRole | undefined {
  return session.members.find((m) => m.operatorId === operatorId)?.role;
}

export function canMutate(
  operatorId: string,
  session:    CollectiveSession,
): boolean {
  const role = getMemberRole(operatorId, session);
  return role === "lead" || role === "contributor" || role === "agent";
}
