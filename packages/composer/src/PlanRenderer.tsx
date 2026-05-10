// PlanRenderer — renders the agent's DomAction plan: the numbered
// step list, the danger gate (when any step is flagged) and the
// execute button.
//
// Pure presentational. Capsule owns plan state, dispatch and danger
// computation; this module only renders. Empty plans (no actions, no
// compose) fall through to a single "Modelo não conseguiu planear"
// line — kept here so the Capsule can mount one component per plan
// shape instead of repeating two near-identical sections.

import { type DomActionResult } from './dom-actions';
import { describeAction } from './helpers';
import { type DomPlanResult } from './types';
import { type PolicyAck } from './usePlanGuards';

export { type PolicyAck };

export type PlanPhase = 'plan_ready' | 'executing' | 'executed';

export interface DangerInfo {
  danger: boolean;
  reason?: string;
}

export interface PlanRendererProps {
  plan: DomPlanResult;
  planResults: DomActionResult[] | null;
  phase: PlanPhase;
  dangers: DangerInfo[];
  hasDanger: boolean;
  sequenceDanger: DangerInfo;
  policyForcesAck: PolicyAck;
  dangerConfirmed: boolean;
  onConfirmDanger: (confirmed: boolean) => void;
  canDispatchAnyAction: boolean;
  onExecute: () => void;
}

export function PlanRenderer({
  plan,
  planResults,
  phase,
  dangers,
  hasDanger,
  sequenceDanger,
  policyForcesAck,
  dangerConfirmed,
  onConfirmDanger,
  canDispatchAnyAction,
  onExecute,
}: PlanRendererProps) {
  // Empty plan with no compose — model gave up cleanly.
  if (plan.actions.length === 0 && !plan.compose) {
    return (
      <section className="gauntlet-capsule__plan">
        <p className="gauntlet-capsule__plan-empty">
          {plan.reason ?? 'Modelo não conseguiu planear.'}
        </p>
      </section>
    );
  }

  if (plan.actions.length === 0) return null;

  let okCount = 0;
  let failCount = 0;
  if (phase === 'executed' && planResults) {
    for (const r of planResults) r.ok ? okCount++ : failCount++;
  }

  return (
    <section className="gauntlet-capsule__plan" aria-live="polite">
      <header className="gauntlet-capsule__plan-header">
        <span className="gauntlet-capsule__plan-title">
          {phase === 'executed' ? 'resultado' : 'plano'}
        </span>
        <span className="gauntlet-capsule__plan-meta">
          {plan.actions.length} action{plan.actions.length === 1 ? '' : 's'}
          {' · '}
          {plan.model_used}
          {' · '}
          {plan.latency_ms} ms
        </span>
        {phase === 'executed' && (
          <span className="gx-success-badge" role="status">
            <span aria-hidden>✓</span>
            executado · {okCount} ok{failCount > 0 ? ` · ${failCount} falhou` : ''}
          </span>
        )}
      </header>
      <ol className="gauntlet-capsule__plan-list gx-stagger">
        {plan.actions.map((a, i) => {
          const r = planResults?.[i];
          const status = r ? (r.ok ? 'ok' : 'fail') : 'pending';
          const danger = dangers[i];
          return (
            <li
              key={`${i}-${a.type}-${
                'selector' in a
                  ? a.selector
                  : 'path' in a
                    ? a.path
                    : 'cmd' in a
                      ? a.cmd
                      : a.action.kind
              }`}
              className={`gauntlet-capsule__plan-item gauntlet-capsule__plan-item--${status}${
                danger?.danger ? ' gauntlet-capsule__plan-item--danger' : ''
              }`}
            >
              <span className="gauntlet-capsule__plan-step">{i + 1}</span>
              <span className="gauntlet-capsule__plan-desc">{describeAction(a)}</span>
              {danger?.danger && (
                <span
                  className="gauntlet-capsule__plan-danger"
                  title={danger.reason}
                >
                  sensível
                </span>
              )}
              {r && !r.ok && (
                <span className="gauntlet-capsule__plan-err" title={r.error}>
                  {r.error}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {phase !== 'executed' && hasDanger && (
        <div className="gauntlet-capsule__danger-gate" role="alert">
          <header className="gauntlet-capsule__danger-header">
            <span className="gauntlet-capsule__danger-mark" aria-hidden>!</span>
            <span className="gauntlet-capsule__danger-title">
              Acções sensíveis no plano
            </span>
          </header>
          <ul className="gauntlet-capsule__danger-list">
            {policyForcesAck.forced && policyForcesAck.reason && (
              <li key="danger-policy">
                <strong>governança:</strong> {policyForcesAck.reason}
              </li>
            )}
            {sequenceDanger.danger && (
              <li key="danger-sequence">
                <strong>cadeia:</strong> {sequenceDanger.reason ?? 'flagged'}
              </li>
            )}
            {dangers.map((d, i) =>
              d.danger ? (
                <li key={`danger-${i}`}>
                  <strong>step {i + 1}:</strong> {d.reason ?? 'flagged'}
                </li>
              ) : null,
            )}
          </ul>
          <label className="gauntlet-capsule__danger-confirm">
            <input
              type="checkbox"
              checked={dangerConfirmed}
              onChange={(ev) => onConfirmDanger(ev.target.checked)}
              disabled={phase === 'executing'}
            />
            <span>Confirmo, executar mesmo assim.</span>
          </label>
        </div>
      )}
      {phase !== 'executed' && canDispatchAnyAction && (
        <div className="gauntlet-capsule__plan-actions">
          <button
            type="button"
            className={`gauntlet-capsule__execute${
              hasDanger ? ' gauntlet-capsule__execute--danger' : ''
            }`}
            onClick={onExecute}
            disabled={phase === 'executing' || (hasDanger && !dangerConfirmed)}
          >
            {phase === 'executing'
              ? 'executando…'
              : hasDanger
                ? 'Executar com cuidado'
                : 'Executar'}
          </button>
        </div>
      )}
      {phase !== 'executed' && !canDispatchAnyAction && (
        <p className="gauntlet-capsule__plan-empty">
          esta superfície não tem adapter para nenhuma destas acções
          — abre o Gauntlet num shell que as suporte.
        </p>
      )}
    </section>
  );
}
