import type { PioneerId } from "../components/pioneer-registry";
import type { StackId } from "./stack-registry";

export type StackTaskStatus = "queued" | "in_progress" | "blocked" | "done";

export interface StackTask {
  id: string;
  stackId: StackId;
  title: string;
  owner: PioneerId;
  supportOwners: PioneerId[];
  status: StackTaskStatus;
  definitionOfDone: string;
}

export const STACK_EXECUTION_QUEUE: StackTask[] = [
  {
    id: "canon-doc-source-lock",
    stackId: "canon",
    title: "Lock canonical source-of-truth docs and remove conflicting framing",
    owner: "claude-architect",
    supportOwners: ["codex-systems", "copilot-qa"],
    status: "in_progress",
    definitionOfDone:
      "Constitution, agent memory, and root workspace routing are aligned with zero contradictory identity language.",
  },
  {
    id: "canon-stack-gate-enforcement",
    stackId: "canon",
    title: "Enforce stack-order gate so downstream stacks cannot be advanced out of order",
    owner: "codex-systems",
    supportOwners: ["claude-architect"],
    status: "in_progress",
    definitionOfDone:
      "A typed execution queue exists with explicit ownership and status for the active frontier and locked downstream tasks.",
  },
  {
    id: "mission-entity-model",
    stackId: "mission",
    title: "Define mission entity model and lifecycle contracts",
    owner: "codex-systems",
    supportOwners: ["cursor-builder", "claude-architect"],
    status: "queued",
    definitionOfDone:
      "Mission type contracts include lifecycle states, consequence links, and ownership mappings.",
  },
  {
    id: "mission-first-shell-entry",
    stackId: "mission",
    title: "Shift shell entry flow from generic chat to mission-first entry",
    owner: "cursor-builder",
    supportOwners: ["claude-architect", "copilot-qa"],
    status: "queued",
    definitionOfDone:
      "Primary shell route opens in mission context before chamber activity begins.",
  },
  {
    id: "mission-reality-verification",
    stackId: "mission",
    title: "Run reality-check audit on mission substrate assumptions",
    owner: "grok-reality",
    supportOwners: ["claude-architect"],
    status: "queued",
    definitionOfDone:
      "Mission substrate assumptions are stress-tested and unresolved contradictions are logged.",
  },
];

export const ACTIVE_STACK_FRONTIER: StackId = "canon";
