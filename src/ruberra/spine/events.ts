// Ruberra — Event Model (spinal cord)
// Append-only. Every spine mutation emits an event. Projections derive from events.

export type EventType =
  | "repo.bound"
  | "repo.created"
  | "thread.opened"
  | "thread.closed"
  | "intent.stated"
  | "directive.accepted"
  | "directive.rejected"
  | "memory.captured"
  | "memory.promoted"
  | "execution.started"
  | "execution.progressed"
  | "execution.succeeded"
  | "execution.failed"
  | "artifact.generated"
  | "artifact.reviewed"
  | "artifact.committed"
  | "canon.proposed"
  | "canon.hardened"
  | "canon.revoked"
  | "contradiction.detected"
  | "contradiction.resolved"
  | "chamber.entered";

export interface RuberraEvent {
  id: string;
  ts: number;
  type: EventType;
  actor: string;
  repo?: string;
  thread?: string;
  parent?: string; // causal parent event id
  payload: Record<string, unknown>;
}

export const newId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
