/**
 * RUBERRA PERSONAL OS SUBSTRATE — Stack 19: Personal Sovereign OS
 * Constitutional Layer · Substrate · Installed 2026-04-01
 *
 * A personal sovereign OS that operates on behalf of the individual —
 * persistent, memory-bearing, always-on, always current.
 *
 * Anti-patterns rejected:
 *   — personal OS as another app to maintain
 *   — personal data stored in closed silos
 *   — personal intelligence that resets between sessions
 *   — second-brain tools that are disconnected from execution
 *
 * Dependencies: experience, awareness, knowledge
 */

// ─── PERSONAL CONTEXT ─────────────────────────────────────────────────────────

export type PersonalContextKind =
  | "preference"      // operator-expressed preference
  | "pattern"         // inferred behavioral pattern
  | "focus"           // current deep focus area
  | "energy"          // self-reported energy/attention state
  | "goal"            // personal mission-level objective
  | "routine"         // recurring operational cadence
  | "memory";         // explicit memory the operator wants persisted

export type ContextPersistenceScope =
  | "session"         // lives for this session only
  | "rolling-30d"     // retained for 30 days
  | "permanent"       // persists indefinitely until operator revokes
  | "mission-scoped"  // lives as long as the linked mission is active
  | "daily-reset";    // resets at start of each day

export interface PersonalContextRecord {
  id:              string;
  kind:            PersonalContextKind;
  operatorId:      string;
  title:           string;
  body:            string;
  scope:           ContextPersistenceScope;
  /** Confidence that this record is still accurate 0.0–1.0 */
  confidence:      number;
  /** Whether this record was operator-authored or system-inferred */
  source:          "operator" | "system-inferred" | "session-observed";
  /** If source = session-observed, the session that produced this */
  sessionId?:      string;
  /** Missions this context is linked to */
  missionIds:      string[];
  createdAt:       number;
  updatedAt:       number;
  expiresAt?:      number;
}

// ─── PERSONAL INTELLIGENCE LAYER ─────────────────────────────────────────────

/**
 * The Personal Intelligence Layer is the always-on, always-current
 * model of the individual operator. It informs routing, surfaces
 * relevant context, and personalizes mission execution.
 */
export interface PersonalIntelligenceModel {
  operatorId:          string;
  snapshotAt:          number;
  /** Inferred current focus area */
  currentFocus?:       string;
  /** Active goals the operator has set */
  activeGoals:         PersonalContextRecord[];
  /** Inferred behavioral patterns */
  patterns:            PersonalContextRecord[];
  /** Explicit memories */
  memories:            PersonalContextRecord[];
  /** Preference records — surfaced to all chambers */
  preferences:         PersonalContextRecord[];
  /** Current routines */
  routines:            PersonalRoutine[];
  /** Knowledge nodes the operator has personally authored */
  authoredKnowledge:   string[];
  /** The operator's sovereign productivity model */
  sovereignModel:      SovereignProductivityModel;
}

// ─── SOVEREIGN PRODUCTIVITY MODEL ────────────────────────────────────────────

/**
 * The sovereign productivity model is Ruberra's understanding of
 * how this operator works best — not generic productivity advice.
 */
export interface SovereignProductivityModel {
  /** Time windows when this operator is historically most effective */
  peakWindows:      TimeWindow[];
  /** Mission types where this operator produces highest-quality output */
  strongMissionTypes: string[];
  /** Contexts that tend to interrupt this operator's flow */
  flowInterruptors: string[];
  /** How many concurrent missions this operator handles best */
  optimalConcurrency: number;
  /** Average time to complete a mission of each type */
  velocityByType:   Record<string, number>;  // missionType → avgMs
  lastUpdatedAt:    number;
}

export interface TimeWindow {
  label:      string;
  startHour:  number;   // 0–23 in operator's local timezone
  endHour:    number;
  confidence: number;   // 0.0–1.0
}

// ─── PERSONAL ROUTINE ─────────────────────────────────────────────────────────

export type RoutineKind = "daily" | "weekly" | "mission-start" | "mission-end" | "focus-block";

export interface PersonalRoutine {
  id:          string;
  operatorId:  string;
  kind:        RoutineKind;
  label:       string;
  /** Steps the system executes when this routine triggers */
  steps:       RoutineStep[];
  enabled:     boolean;
  lastRunAt?:  number;
  nextRunAt?:  number;
}

export interface RoutineStep {
  id:       string;
  action:   string;
  params:   Record<string, unknown>;
  order:    number;
}

// ─── PERSONAL DATA SOVEREIGNTY ────────────────────────────────────────────────

export interface PersonalDataSovereigntyStatement {
  operatorId:   string;
  /** What Ruberra holds about this operator */
  dataClasses:  PersonalDataClass[];
  /** Operator-granted permissions for each class */
  permissions:  PersonalDataPermission[];
  /** Operator's right to export and delete */
  portability:  { exportable: boolean; deletable: boolean };
  acknowledgedAt: number;
}

export type PersonalDataClass =
  | "usage-patterns"
  | "mission-history"
  | "knowledge-contributions"
  | "capability-evidence"
  | "preferences"
  | "routines"
  | "memories"
  | "productivity-model";

export type PersonalDataPermission =
  | "use-for-routing"     // use to improve mission routing
  | "use-for-analytics"   // use for personal intelligence analytics
  | "use-for-collective"  // share (anonymized) for collective intelligence
  | "no-external-sharing" // never share outside Ruberra
  | "no-aggregation";     // never aggregate with other operators

// ─── PERSONAL OS LAWS ─────────────────────────────────────────────────────────

export const PERSONAL_OS_LAWS: readonly string[] = [
  "Personal intelligence is persistent — it does not reset between sessions.",
  "The operator's sovereign model is inferred from evidence, not from generic templates.",
  "Personal data is operator-owned — it is never sold, aggregated externally, or used without consent.",
  "The personal OS operates on behalf of the operator, not the platform.",
  "Personal routines are mission-aware — they adapt to the operator's current mission phase.",
  "Personal context transfers across surfaces — the personal OS is not a browser feature.",
  "The personal OS is not a second brain tool — it is structurally integrated with execution.",
] as const;

export const PERSONAL_OS_REJECTS: readonly string[] = [
  "personal productivity apps",
  "life OS systems",
  "Notion personal setups",
  "second brain tools",
  "personal OS as another app to maintain",
  "personal data stored in closed vendor silos",
  "personal intelligence that resets between sessions",
] as const;

// ─── RUNTIME HELPERS ──────────────────────────────────────────────────────────

export function buildPersonalContextId(): string {
  return `pctx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildRoutineId(): string {
  return `rtn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function isContextExpired(record: PersonalContextRecord): boolean {
  return record.expiresAt != null && record.expiresAt < Date.now();
}

export function getLiveContext(
  model: PersonalIntelligenceModel,
): PersonalContextRecord[] {
  const all = [
    ...model.activeGoals,
    ...model.patterns,
    ...model.memories,
    ...model.preferences,
  ];
  return all.filter((r) => !isContextExpired(r));
}
