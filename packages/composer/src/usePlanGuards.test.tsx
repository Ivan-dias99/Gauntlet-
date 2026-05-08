// usePlanGuards tests — covers the four memos the hook exposes:
// dangers, sequenceDanger, policyForcesAck, hasDanger,
// canDispatchAnyAction. These gate the danger banner + the Executar
// button; regressions are real-world-safety regressions.

import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { type Ambient } from './ambient';
import { usePlanGuards } from './usePlanGuards';
import {
  DEFAULT_COMPOSER_SETTINGS,
  type ComposerSettings,
  type DomPlanResult,
} from './types';

function ambient(over: Partial<Ambient> = {}): Ambient {
  return {
    shell: 'browser',
    capabilities: {} as Ambient['capabilities'],
    transport: { fetchJson: vi.fn() } as unknown as Ambient['transport'],
    storage: {} as Ambient['storage'],
    selection: { read: vi.fn(() => null) } as unknown as Ambient['selection'],
    ...over,
  } as Ambient;
}

function plan(overrides: Partial<DomPlanResult> = {}): DomPlanResult {
  return {
    plan_id: 'p1',
    context_id: 'ctx',
    actions: [],
    compose: '',
    reason: '',
    model_used: 'mock',
    latency_ms: 0,
    ...overrides,
  } as DomPlanResult;
}

describe('usePlanGuards', () => {
  it('returns empty/false defaults when plan is null', () => {
    const { result } = renderHook(() =>
      usePlanGuards({
        plan: null,
        ambient: ambient(),
        url: 'https://example.com',
        settings: DEFAULT_COMPOSER_SETTINGS,
      }),
    );
    expect(result.current.dangers).toEqual([]);
    expect(result.current.hasDanger).toBe(false);
    expect(result.current.sequenceDanger.danger).toBe(false);
    expect(result.current.policyForcesAck.forced).toBe(false);
    expect(result.current.canDispatchAnyAction).toBe(false);
  });

  it('flags a password fill as dangerous and propagates to hasDanger', () => {
    const { result } = renderHook(() =>
      usePlanGuards({
        plan: plan({
          actions: [
            { type: 'fill', selector: 'input[name="password"]', value: 'x' },
          ],
        }),
        ambient: ambient({
          domActions: { execute: vi.fn() },
        } as Partial<Ambient>),
        url: 'https://example.com',
        settings: DEFAULT_COMPOSER_SETTINGS,
      }),
    );
    expect(result.current.dangers[0].danger).toBe(true);
    expect(result.current.hasDanger).toBe(true);
    expect(result.current.canDispatchAnyAction).toBe(true);
  });

  it('detects sequence danger (sensitive fill + submit click)', () => {
    const { result } = renderHook(() =>
      usePlanGuards({
        plan: plan({
          actions: [
            { type: 'fill', selector: 'input[name="password"]', value: 'x' },
            { type: 'click', selector: 'button[type="submit"]' },
          ],
        }),
        ambient: ambient({
          domActions: { execute: vi.fn() },
        } as Partial<Ambient>),
        url: 'https://example.com',
        settings: DEFAULT_COMPOSER_SETTINGS,
      }),
    );
    expect(result.current.sequenceDanger.danger).toBe(true);
    expect(result.current.hasDanger).toBe(true);
  });

  it('returns canDispatchAnyAction=false when no adapter matches', () => {
    const { result } = renderHook(() =>
      usePlanGuards({
        plan: plan({ actions: [{ type: 'click', selector: '#x' }] }),
        ambient: ambient(), // no domActions, no shellExec, no filesystem
        url: 'https://example.com',
        settings: DEFAULT_COMPOSER_SETTINGS,
      }),
    );
    expect(result.current.canDispatchAnyAction).toBe(false);
  });

  it('forces danger ack when domain policy requires it', () => {
    const settings: ComposerSettings = {
      ...DEFAULT_COMPOSER_SETTINGS,
      domains: {
        'example.com': {
          ...DEFAULT_COMPOSER_SETTINGS.default_domain_policy,
          require_danger_ack: true,
        },
      },
    };
    const { result } = renderHook(() =>
      usePlanGuards({
        plan: plan({ actions: [{ type: 'highlight', selector: 'h1' }] }),
        ambient: ambient({
          domActions: { execute: vi.fn() },
        } as Partial<Ambient>),
        url: 'https://example.com',
        settings,
      }),
    );
    expect(result.current.policyForcesAck.forced).toBe(true);
    expect(result.current.policyForcesAck.reason).toContain('example.com');
    expect(result.current.hasDanger).toBe(true);
  });

  it('forces danger ack when an action-type policy requires it', () => {
    const settings: ComposerSettings = {
      ...DEFAULT_COMPOSER_SETTINGS,
      actions: {
        'fs.write': {
          ...DEFAULT_COMPOSER_SETTINGS.default_action_policy,
          require_danger_ack: true,
        },
      },
    };
    const { result } = renderHook(() =>
      usePlanGuards({
        plan: plan({
          actions: [{ type: 'fs.write', path: '/a.txt', content: 'x' }],
        }),
        ambient: ambient({
          filesystem: { writeTextFile: vi.fn() },
        } as Partial<Ambient>),
        url: 'https://example.com',
        settings,
      }),
    );
    expect(result.current.policyForcesAck.forced).toBe(true);
    expect(result.current.policyForcesAck.reason).toContain('fs.write');
  });
});
