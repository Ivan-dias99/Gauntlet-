/**
 * RUBERRA STACK 01 — Canon + Sovereignty
 * Runtime materialization of the constitutional kernel.
 *
 * This file proves Ruberra's identity at runtime.
 * It enforces stack order, identity filter, and anti-drift detection.
 * It is the single authority for constitutional truth during execution.
 *
 * DO NOT modify without sovereign authorization.
 * DO NOT import this file into UI components as a data source —
 * it is a law substrate, not a feature module.
 */

import {
  RUBERRA_IS,
  RUBERRA_IS_NOT,
  RUBERRA_CANNOT_BECOME,
  RUBERRA_STACK_REGISTRY,
  RUBERRA_CURRENT_PHASE,
  getStack,
  type StackId,
  type StackPhase,
  type IdentityVerdict,
  type IdentityFilterResult,
} from "./stack-registry";

// ─── MOTHER LAW ───────────────────────────────────────────────────────────────

/**
 * The immutable mother law of Ruberra.
 * Every system decision is judged against this record.
 */
export const MOTHER_LAW = {
  organism:         "one sovereign mission operating system",
  spine:            "one neural spine — no disconnected sub-products",
  unit:             "mission is the atomic unit — not feature, not task, not notification",
  chambers:         ["lab", "school", "creation"] as const,
  profile:          "the sovereign ledger — not a settings page, not a dashboard",
  surface_law:      "everything visible must produce consequence or be removed",
  memory_law:       "the system remembers — it does not reset between sessions",
  fragmentation_law:"no surface exists as an island — all things connect",
  premium_law:      "the interface is a workstation, not a consumer app",
  calm_law:         "mineral and warm stone — never neon, never clutter",
} as const;

// ─── DRIFT SIGNAL REGISTRY ────────────────────────────────────────────────────

/**
 * Words and phrases that signal product drift toward the CANNOT list.
 * Any proposed surface containing these signals is flagged for review.
 */
const DRIFT_SIGNALS: Array<{ signal: string; reason: string; verdict: IdentityVerdict }> = [
  { signal: "dashboard",          verdict: "replace",     reason: "Dashboard metaphor erodes mission-first identity. Replace with consequence-bearing surface." },
  { signal: "plugin marketplace", verdict: "remove",      reason: "Marketplace pattern contradicts sovereign ecosystem law." },
  { signal: "feature flag",       verdict: "remove",      reason: "Feature flags signal SaaS product thinking. Not Ruberra." },
  { signal: "pricing tier",       verdict: "remove",      reason: "Pricing tiers push toward the CANNOT list: SaaS product with tiers." },
  { signal: "notification hub",   verdict: "remove",      reason: "Notification hub is explicitly in the CANNOT list." },
  { signal: "social feed",        verdict: "remove",      reason: "Consumer social pattern. Ruberra is not a social product." },
  { signal: "app store",          verdict: "replace",     reason: "App store pattern erodes sovereign ecosystem law." },
  { signal: "widget",             verdict: "subordinate", reason: "Widget implies disconnected, decorative surface. Wire it to consequence or remove." },
  { signal: "onboarding wizard",  verdict: "replace",     reason: "Onboarding wizard feels SaaS consumer. Replace with sovereign entry experience." },
  { signal: "usage analytics",    verdict: "subordinate", reason: "Usage analytics must serve mission intelligence, not vanity metrics." },
  { signal: "upgrade plan",       verdict: "remove",      reason: "Upgrade plan signals SaaS monetization model. Not Ruberra." },
] as const;

// ─── IDENTITY FILTER ─────────────────────────────────────────────────────────

/**
 * Runtime identity filter.
 * Every proposed surface, feature, or concept passes through this gate.
 *
 * Returns a verdict: "keep" | "subordinate" | "replace" | "remove"
 */
export function runIdentityFilter(candidate: string): IdentityFilterResult {
  const lower = candidate.toLowerCase();

  // Check explicit drift signals first
  for (const entry of DRIFT_SIGNALS) {
    if (lower.includes(entry.signal)) {
      return { verdict: entry.verdict, reason: entry.reason };
    }
  }

  // Check against IS_NOT patterns
  for (const forbidden of RUBERRA_IS_NOT) {
    const keywords = forbidden.toLowerCase().split(" ").filter((w) => w.length > 4);
    const matches = keywords.filter((kw) => lower.includes(kw));
    if (matches.length >= Math.min(2, keywords.length)) {
      return {
        verdict: "replace",
        reason:  `"${candidate}" resembles "${forbidden}" — replace with Ruberra-native equivalent.`,
      };
    }
  }

  // Check against CANNOT patterns
  for (const cannot of RUBERRA_CANNOT_BECOME) {
    const keywords = cannot.toLowerCase().split(" ").filter((w) => w.length > 4);
    const matches = keywords.filter((kw) => lower.includes(kw));
    if (matches.length >= 2) {
      return {
        verdict: "remove",
        reason:  `"${candidate}" pushes toward the CANNOT list: "${cannot}". Remove.`,
      };
    }
  }

  // Check affinity against IS list
  for (const affirmed of RUBERRA_IS) {
    const keywords = affirmed.toLowerCase().split(" ").filter((w) => w.length > 4);
    const matches = keywords.filter((kw) => lower.includes(kw));
    if (matches.length >= 1) {
      return {
        verdict: "keep",
        reason:  `"${candidate}" aligns with Ruberra identity: "${affirmed}".`,
      };
    }
  }

  return {
    verdict: "subordinate",
    reason:  `"${candidate}" is not recognized as clearly Ruberra-native. Review before building.`,
  };
}

// ─── STACK ORDER ASSERTION ────────────────────────────────────────────────────

/**
 * Assert that a stack may be operationally opened.
 * Checks that all dependencies are in the installed set.
 */
export function assertStackOrder(
  requestingId: StackId,
  installedIds: StackId[],
): { valid: boolean; blockedBy: StackId[]; reason: string } {
  const stack = getStack(requestingId);
  if (!stack) {
    return { valid: false, blockedBy: [], reason: `Unknown stack id: "${requestingId}"` };
  }

  const unmet = stack.dependencies.filter((dep) => !installedIds.includes(dep));

  if (unmet.length > 0) {
    const names = unmet.map((id) => getStack(id)?.name ?? id).join(", ");
    return {
      valid:     false,
      blockedBy: unmet,
      reason:    `Stack "${stack.name}" cannot open. Unmet dependencies: ${names}`,
    };
  }

  return {
    valid:     true,
    blockedBy: [],
    reason:    `Stack "${stack.name}" — all dependencies satisfied.`,
  };
}

// ─── ANTI-DRIFT SCANNER ───────────────────────────────────────────────────────

/**
 * Scan a list of proposed surface descriptions for drift.
 * Returns only those that fail the identity filter (verdict !== "keep").
 */
export function scanForDrift(
  surfaces: string[],
): Array<{ surface: string; result: IdentityFilterResult }> {
  return surfaces
    .map((s) => ({ surface: s, result: runIdentityFilter(s) }))
    .filter((entry) => entry.result.verdict !== "keep");
}

// ─── PHASE GATE ───────────────────────────────────────────────────────────────

/**
 * Assert that the system is at or beyond a required phase before opening a capability.
 */
export function assertPhaseGate(
  required: StackPhase,
): { permitted: boolean; reason: string } {
  const ORDER: StackPhase[] = [
    "constitution",
    "birth",
    "intelligence",
    "operation",
    "expansion",
    "sovereignty",
  ];

  const currentIndex  = ORDER.indexOf(RUBERRA_CURRENT_PHASE);
  const requiredIndex = ORDER.indexOf(required);

  if (currentIndex < requiredIndex) {
    return {
      permitted: false,
      reason:    `System is in phase "${RUBERRA_CURRENT_PHASE}". Phase "${required}" is not yet active.`,
    };
  }

  return { permitted: true, reason: `Phase gate "${required}" — permitted.` };
}

// ─── CANON VALIDATION ────────────────────────────────────────────────────────

/**
 * Validate that the stack registry is internally consistent.
 * Returns an array of violations. Empty array = clean.
 */
export function validateCanonRegistry(): string[] {
  const violations: string[] = [];
  const allIds = new Set(RUBERRA_STACK_REGISTRY.map((s) => s.id));

  for (const stack of RUBERRA_STACK_REGISTRY) {
    // Order must be 1-based and continuous
    if (stack.order < 1 || stack.order > RUBERRA_STACK_REGISTRY.length) {
      violations.push(`Stack "${stack.id}" has invalid order: ${stack.order}`);
    }

    // All dependencies must exist in registry
    for (const dep of stack.dependencies) {
      if (!allIds.has(dep)) {
        violations.push(`Stack "${stack.id}" references unknown dependency: "${dep}"`);
      }
      // Dependency must have lower order (no forward dependencies)
      const depStack = getStack(dep);
      if (depStack && depStack.order >= stack.order) {
        violations.push(
          `Stack "${stack.id}" (order ${stack.order}) depends on "${dep}" (order ${depStack.order}) — dependency must precede stack.`,
        );
      }
    }

    // V10 direction must not be empty
    if (!stack.v10 || stack.v10.length < 10) {
      violations.push(`Stack "${stack.id}" has missing or insufficient V10 direction.`);
    }
  }

  // Unique orders
  const orders = RUBERRA_STACK_REGISTRY.map((s) => s.order);
  const uniqueOrders = new Set(orders);
  if (uniqueOrders.size !== orders.length) {
    violations.push("Duplicate order values detected in stack registry.");
  }

  return violations;
}

// ─── CONSTITUTIONAL TRUTH ────────────────────────────────────────────────────

/**
 * The single exportable constitutional truth record.
 * Readable at runtime by any module that needs to know Ruberra's state.
 * Not for UI rendering — for system-level decisions.
 */
export const CONSTITUTIONAL_TRUTH = {
  name:           "Ruberra Canon + Sovereignty Stack",
  stackId:        "canon" as StackId,
  installedDate:  "2026-04-01",
  currentPhase:   RUBERRA_CURRENT_PHASE,
  stackCount:     RUBERRA_STACK_REGISTRY.length,
  motherLaw:      MOTHER_LAW,
  canon: {
    is:            RUBERRA_IS,
    isNot:         RUBERRA_IS_NOT,
    cannotBecome:  RUBERRA_CANNOT_BECOME,
  },
} as const;

// ─── SELF-VALIDATION AT MODULE LOAD ──────────────────────────────────────────

/**
 * Canon self-validation runs once at module load.
 * Any violations are logged as warnings — they do not throw.
 * A clean registry produces no output.
 */
const _canonViolations = validateCanonRegistry();
if (_canonViolations.length > 0) {
  console.warn("[Ruberra Canon] Registry violations detected:", _canonViolations);
}
