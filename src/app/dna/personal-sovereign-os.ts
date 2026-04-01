/**
 * RUBERRA STACK 19 — Personal Sovereign OS
 * A personal sovereign OS that operates on behalf of the individual.
 * Persistent. Memory-bearing. Always-on. Always current.
 *
 * The personal OS is not a user profile.
 * It is the sovereign substrate through which one operator's
 * intelligence, memory, and mission history compounds over time.
 */

import { assertStackOrder } from "./canon-sovereignty";
import { type MissionId } from "./mission-substrate";

const _g = assertStackOrder("personal", ["experience", "awareness", "knowledge"]);
if (!_g.valid) console.warn("[Ruberra Personal OS] Stack order violation:", _g.reason);

// ─── Operator profile ─────────────────────────────────────────────────────────

export type OperatorExpertiseDomain =
  | "product"   | "engineering" | "research"  | "design"
  | "strategy"  | "operations"  | "marketing" | "science"
  | "law"       | "finance"     | "education" | "other";

export interface SovereignPreferences {
  primaryDomain:      OperatorExpertiseDomain;
  workingStyle:       "focused" | "exploratory" | "systematic" | "adaptive";
  preferredChamber:   "lab" | "school" | "creation";
  contextDepth:       "shallow" | "standard" | "deep";
  signalThreshold:    "minimal" | "standard" | "verbose";
  autoActivateMission: boolean;
}

export interface OperatorProfile {
  operatorId:    string;
  displayName:   string;
  preferences:   SovereignPreferences;
  activeMissions: MissionId[];
  completedCount: number;
  joinedAt:      number;
  lastActiveAt:  number;
}

export function defaultPreferences(): SovereignPreferences {
  return {
    primaryDomain:       "other",
    workingStyle:        "adaptive",
    preferredChamber:    "lab",
    contextDepth:        "standard",
    signalThreshold:     "standard",
    autoActivateMission: true,
  };
}

export function createOperatorProfile(operatorId: string, displayName: string): OperatorProfile {
  const now = Date.now();
  return {
    operatorId,
    displayName,
    preferences:    defaultPreferences(),
    activeMissions: [],
    completedCount: 0,
    joinedAt:       now,
    lastActiveAt:   now,
  };
}

// ─── Personal memory ──────────────────────────────────────────────────────────

export type PersonalMemoryClass =
  | "preference"      // A learned preference about how the operator works
  | "domain_context"  // Domain-specific knowledge the operator holds
  | "mission_history" // Compressed history of a completed mission
  | "shortcut"        // A recurrent pattern the operator uses
  | "resolved"        // A previously open question now resolved
  | "insight";        // An insight gained from across missions

export interface PersonalMemoryEntry {
  id:          string;
  class:       PersonalMemoryClass;
  content:     string;
  missionRef?: MissionId;
  confidence:  number;    // 0–1 — how certain this memory is
  createdAt:   number;
  accessCount: number;
  decaysAt?:   number;    // If set, memory weakens after this timestamp
}

export function createMemoryEntry(
  class_: PersonalMemoryClass,
  content: string,
  opts?: { missionRef?: MissionId; confidence?: number; ttlMs?: number }
): PersonalMemoryEntry {
  const now = Date.now();
  return {
    id:          `pmem_${now}_${Math.random().toString(36).slice(2, 7)}`,
    class:       class_,
    content,
    missionRef:  opts?.missionRef,
    confidence:  opts?.confidence ?? 0.8,
    createdAt:   now,
    accessCount: 0,
    decaysAt:    opts?.ttlMs ? now + opts.ttlMs : undefined,
  };
}

export function accessMemory(entry: PersonalMemoryEntry): PersonalMemoryEntry {
  return { ...entry, accessCount: entry.accessCount + 1 };
}

export function isMemoryAlive(entry: PersonalMemoryEntry): boolean {
  if (!entry.decaysAt) return true;
  return Date.now() < entry.decaysAt;
}

// ─── Personal agent ───────────────────────────────────────────────────────────

export type PersonalAgentState = "dormant" | "active" | "learning" | "executing" | "reflecting";

export interface PersonalAgent {
  operatorId:    string;
  state:         PersonalAgentState;
  currentMission?: MissionId;
  pendingActions:  string[];   // Actions the agent intends to take
  blockedOn?:      string;
  lastReflectedAt?: number;
  activatedAt:   number;
  totalRunCount: number;
}

export function defaultPersonalAgent(operatorId: string): PersonalAgent {
  return {
    operatorId,
    state:         "dormant",
    pendingActions: [],
    activatedAt:   Date.now(),
    totalRunCount: 0,
  };
}

export function activatePersonalAgent(agent: PersonalAgent, missionId?: MissionId): PersonalAgent {
  return {
    ...agent,
    state:          "active",
    currentMission: missionId ?? agent.currentMission,
    totalRunCount:  agent.totalRunCount + 1,
  };
}

export function reflectAgent(agent: PersonalAgent): PersonalAgent {
  return { ...agent, state: "reflecting", lastReflectedAt: Date.now() };
}

// ─── Operator context ─────────────────────────────────────────────────────────

/**
 * The live operator context — the minimal package of sovereign truth
 * about what this operator knows, is doing, and cares about right now.
 */
export interface OperatorContext {
  operatorId:     string;
  activeMission?: MissionId;
  recentMemories: PersonalMemoryEntry[];   // Top-ranked for current context
  preferences:    SovereignPreferences;
  agentState:     PersonalAgentState;
  surfacedAt:     number;
}

export function buildOperatorContext(
  profile: OperatorProfile,
  memory: PersonalMemoryEntry[],
  agent: PersonalAgent
): OperatorContext {
  const alive = memory.filter(isMemoryAlive);
  const recent = [...alive]
    .sort((a, b) => b.accessCount - a.accessCount || b.createdAt - a.createdAt)
    .slice(0, 8);

  return {
    operatorId:     profile.operatorId,
    activeMission:  profile.activeMissions[0],
    recentMemories: recent,
    preferences:    profile.preferences,
    agentState:     agent.state,
    surfacedAt:     Date.now(),
  };
}

// ─── Unified state ────────────────────────────────────────────────────────────

export interface PersonalSovereignOSState {
  profile:     OperatorProfile;
  memory:      PersonalMemoryEntry[];
  agent:       PersonalAgent;
  context:     OperatorContext | null;
  lastUpdated: number;
}

export function defaultPersonalOS(operatorId: string): PersonalSovereignOSState {
  const profile = createOperatorProfile(operatorId, operatorId);
  const agent   = defaultPersonalAgent(operatorId);
  return {
    profile,
    memory:      [],
    agent,
    context:     null,
    lastUpdated: Date.now(),
  };
}
