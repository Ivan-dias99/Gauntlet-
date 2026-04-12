// Ruberra — Event Model
// The Event Log is a sovereign organ, not infrastructure. Single source of
// truth. Every spine mutation must emit an event; silent no-ops are forbidden.
// Projections are read-only derivatives of this log.

export type EventType =
  | "null.consequence" // Law of Consequence: explicit null outcome with reason
  | "repo.bound"
  | "repo.created"
  | "repo.verified" // git authority: backend confirmed .git present
  | "thread.opened"
  | "thread.activated"
  | "thread.closed"
  | "thread.archived"  // soft-hide from default view; still in spine
  | "intent.stated"
  | "concept.stated"   // architect-first: structured idea before directive commitment
  | "directive.accepted"
  | "directive.rejected"
  | "memory.captured"
  | "memory.promoted"
  | "memory.elevated"   // truth-state transition: observed→retained, retained→hardened
  | "memory.revoked"    // truth-state transition: any→revoked
  | "execution.started"
  | "execution.progressed"
  | "execution.succeeded"
  | "execution.failed"
  | "artifact.generated"
  | "artifact.reviewed" // payload: { artifactId, outcome: "accepted"|"rejected", reason }
  | "artifact.rejected"
  | "artifact.committed"
  | "canon.proposed"
  | "canon.hardened"
  | "canon.revoked"
  | "contradiction.detected"
  | "contradiction.resolved"
  | "knowledge.synthesized"  // cross-thread manual link: architect binds knowledge to another thread
  | "directive.drafted"      // W10: autonomous draft — system suggests a directive from concept + canon
  | "pioneer.assigned"       // W10: pioneer bound to a thread or directive for execution
  | "pioneer.released"       // W10: pioneer released from assignment
  | "directive.proposed"     // W10: execution or agent proposes a follow-up directive
  | "proposal.accepted"      // W10: proposed directive promoted to real directive
  | "proposal.dismissed"     // W10: proposed directive rejected with reason
  | "flow.defined"           // W10: multi-step directive flow created
  | "flow.step.completed"    // W10: one step of a flow finished
  | "flow.completed"         // W10: entire flow resolved (all steps done or aborted)
  | "agent.registered"       // W10: named agent with capabilities joins the organism
  | "agent.assigned"         // W10: directive assigned to a specific agent
  | "execution.handoff"      // W11: pioneer hands execution to another pioneer
  | "canon.endorsed"         // W11: pioneer endorses a canon proposal, building consensus
  | "chamber.entered";

export interface RuberraEvent {
  id: string;
  ts: number;
  seq?: number; // insertion order within the same millisecond; used for stable replay ordering
  type: EventType;
  actor: string;
  repo?: string;
  thread?: string;
  parent?: string; // causal parent event id
  payload: Record<string, unknown>;
}

export const newId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
