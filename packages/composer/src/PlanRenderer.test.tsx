// PlanRenderer RTL — covers the action-list rendering, the danger
// gate visibility + interactions, and the Executar button states.
// This is what the operator sees before authorising side-effects;
// regressions in the gate are real-world-safety regressions.

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { type DomActionResult } from './dom-actions';
import { PlanRenderer, type DangerInfo, type PolicyAck } from './PlanRenderer';
import { type DomPlanResult } from './types';

function plan(actions: DomPlanResult['actions'] = []): DomPlanResult {
  return {
    plan_id: 'p1',
    context_id: 'ctx',
    actions,
    compose: '',
    reason: '',
    model_used: 'mock',
    latency_ms: 50,
  } as DomPlanResult;
}

const noDanger: DangerInfo = { danger: false };
const noPolicy: PolicyAck = { forced: false, reason: null };

function defaultProps(over: Record<string, unknown> = {}) {
  return {
    plan: plan([{ type: 'highlight', selector: 'h1' }]),
    planResults: null as DomActionResult[] | null,
    phase: 'plan_ready' as const,
    dangers: [noDanger],
    hasDanger: false,
    sequenceDanger: noDanger,
    policyForcesAck: noPolicy,
    dangerConfirmed: false,
    onConfirmDanger: vi.fn(),
    canDispatchAnyAction: true,
    onExecute: vi.fn(),
    ...over,
  };
}

describe('<PlanRenderer />', () => {
  it('falls back to "Modelo não conseguiu planear" on empty plans with no compose + no reason', () => {
    render(
      <PlanRenderer
        {...defaultProps({
          plan: { ...plan([]), compose: '', reason: undefined },
        })}
      />,
    );
    expect(screen.getByText('Modelo não conseguiu planear.')).toBeTruthy();
  });

  it('uses the model-supplied reason when present', () => {
    render(
      <PlanRenderer
        {...defaultProps({
          plan: { ...plan([]), reason: 'pedido fora de scope' },
        })}
      />,
    );
    expect(screen.getByText('pedido fora de scope')).toBeTruthy();
  });

  it('returns null when plan has no actions and a non-empty compose', () => {
    const { container } = render(
      <PlanRenderer
        {...defaultProps({
          plan: { ...plan([]), compose: 'hello' },
        })}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders one row per action with description + step number', () => {
    render(
      <PlanRenderer
        {...defaultProps({
          plan: plan([
            { type: 'click', selector: '#a' },
            { type: 'fill', selector: '#b', value: 'x' },
          ]),
          dangers: [noDanger, noDanger],
        })}
      />,
    );
    expect(screen.getByText('click #a')).toBeTruthy();
    expect(screen.getByText(/fill #b/)).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('shows the danger gate when hasDanger is true and phase is not executed', () => {
    render(
      <PlanRenderer
        {...defaultProps({
          dangers: [{ danger: true, reason: 'submit-shaped' }],
          hasDanger: true,
        })}
      />,
    );
    expect(screen.getByText('Acções sensíveis no plano')).toBeTruthy();
    expect(screen.getByText(/submit-shaped/)).toBeTruthy();
  });

  it('disables Execute when danger is unconfirmed', () => {
    render(
      <PlanRenderer
        {...defaultProps({
          dangers: [{ danger: true, reason: 'rx' }],
          hasDanger: true,
          dangerConfirmed: false,
        })}
      />,
    );
    const btn = screen.getByText('Executar com cuidado').closest('button')!;
    expect(btn.hasAttribute('disabled')).toBe(true);
  });

  it('enables Execute and labels it differently once danger is confirmed', () => {
    render(
      <PlanRenderer
        {...defaultProps({
          dangers: [{ danger: true, reason: 'rx' }],
          hasDanger: true,
          dangerConfirmed: true,
        })}
      />,
    );
    const btn = screen.getByText('Executar com cuidado').closest('button')!;
    expect(btn.hasAttribute('disabled')).toBe(false);
  });

  it('fires onExecute when Executar is clicked (no danger)', () => {
    const onExecute = vi.fn();
    render(<PlanRenderer {...defaultProps({ onExecute })} />);
    fireEvent.click(screen.getByText('Executar'));
    expect(onExecute).toHaveBeenCalledTimes(1);
  });

  it('flips onConfirmDanger when the checkbox toggles', () => {
    const onConfirmDanger = vi.fn();
    render(
      <PlanRenderer
        {...defaultProps({
          dangers: [{ danger: true, reason: 'rx' }],
          hasDanger: true,
          onConfirmDanger,
        })}
      />,
    );
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(onConfirmDanger).toHaveBeenCalledWith(true);
  });

  it('shows the no-adapter line when canDispatchAnyAction is false', () => {
    render(
      <PlanRenderer
        {...defaultProps({ canDispatchAnyAction: false })}
      />,
    );
    expect(
      screen.getByText(/esta superfície não tem adapter/),
    ).toBeTruthy();
  });

  it('annotates per-step results with ok / fail status', () => {
    render(
      <PlanRenderer
        {...defaultProps({
          plan: plan([
            { type: 'click', selector: '#a' },
            { type: 'click', selector: '#b' },
          ]),
          planResults: [
            { action: { type: 'click', selector: '#a' }, ok: true },
            { action: { type: 'click', selector: '#b' }, ok: false, error: 'no element' },
          ],
          dangers: [noDanger, noDanger],
          phase: 'executed',
        })}
      />,
    );
    expect(screen.getByText('no element')).toBeTruthy();
  });
});
