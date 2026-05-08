// usePlanGuards — guard layer in front of plan execution.
//
// Computes the four memos the Capsule needs to render the danger gate
// and gate the Executar button:
//   * dangers              — per-action heuristic flagging (assessDanger)
//   * sequenceDanger       — order-aware flagging (assessSequenceDanger)
//   * policyForcesAck      — governance override from settings
//   * hasDanger            — any of the above
//   * canDispatchAnyAction — at least one step has a working adapter
//
// Pure-ish: depends on plan, ambient (for adapter probe), snapshot.url
// (for domain policy lookup) and settings (for governance overrides).
// All are cheap to derive — no async, no side effects.

import { useMemo } from 'react';
import { type Ambient } from './ambient';
import { assessDanger, assessSequenceDanger, type DangerAssessment } from './dom-actions';
import { type ComposerSettings, type DomPlanResult } from './types';

export interface PolicyAck {
  forced: boolean;
  reason: string | null;
}

export interface UsePlanGuardsResult {
  dangers: DangerAssessment[];
  sequenceDanger: DangerAssessment;
  policyForcesAck: PolicyAck;
  hasDanger: boolean;
  canDispatchAnyAction: boolean;
}

export interface UsePlanGuardsArgs {
  plan: DomPlanResult | null;
  ambient: Ambient;
  url: string;
  settings: ComposerSettings;
}

export function usePlanGuards({
  plan,
  ambient,
  url,
  settings,
}: UsePlanGuardsArgs): UsePlanGuardsResult {
  // Per-step heuristic flagging — submit buttons, password inputs,
  // "Delete" labels. Recomputed only when the plan changes.
  const dangers = useMemo<DangerAssessment[]>(
    () => (plan ? plan.actions.map(assessDanger) : []),
    [plan],
  );

  // Per-action adapter check — used to gate the Executar button. The
  // dispatcher would surface "no adapter" as a per-row error otherwise,
  // but the operator deserves to see "this shell can't" before they
  // click. True when at least one action in the plan has a working
  // dispatch path in the current ambient.
  const canDispatchAnyAction = useMemo(() => {
    if (!plan || plan.actions.length === 0) return false;
    return plan.actions.some((a) => {
      if (a.type === 'shell.run') return !!ambient.shellExec;
      if (a.type === 'fs.read') return !!ambient.filesystem?.readTextFile;
      if (a.type === 'fs.write') return !!ambient.filesystem?.writeTextFile;
      return !!ambient.domActions?.execute;
    });
  }, [plan, ambient]);

  const sequenceDanger = useMemo<DangerAssessment>(
    () => (plan ? assessSequenceDanger(plan.actions) : { danger: false }),
    [plan],
  );

  // Sprint 4 — policy-forced ack. When the active domain policy or any
  // action's type policy carries require_danger_ack=true, force the
  // danger gate even on plans that look benign. Lets the operator
  // tighten beyond the heuristic-driven flagging.
  const policyForcesAck = useMemo<PolicyAck>(() => {
    if (!plan || plan.actions.length === 0) {
      return { forced: false, reason: null };
    }
    let host = '';
    try {
      host = new URL(url).hostname.toLowerCase();
    } catch {
      // Invalid URL on a hostile page — fall through to defaults.
    }
    const domainPolicy = settings.domains[host] ?? settings.default_domain_policy;
    if (domainPolicy.require_danger_ack) {
      return {
        forced: true,
        reason: host
          ? `policy: domain '${host}' requires explicit confirmation`
          : 'policy: default domain policy requires explicit confirmation',
      };
    }
    for (const a of plan.actions) {
      const policy = settings.actions[a.type] ?? settings.default_action_policy;
      if (policy.require_danger_ack) {
        return {
          forced: true,
          reason: `policy: action type '${a.type}' requires explicit confirmation`,
        };
      }
    }
    return { forced: false, reason: null };
  }, [plan, url, settings]);

  const hasDanger =
    dangers.some((d) => d.danger) ||
    sequenceDanger.danger ||
    policyForcesAck.forced;

  return { dangers, sequenceDanger, policyForcesAck, hasDanger, canDispatchAnyAction };
}
