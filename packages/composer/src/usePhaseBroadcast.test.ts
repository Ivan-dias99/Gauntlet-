import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePhaseBroadcast } from './usePhaseBroadcast';

describe('usePhaseBroadcast', () => {
  it('dispatches gauntlet:phase on mount with the current phase', () => {
    const spy = vi.spyOn(window, 'dispatchEvent');
    renderHook(() => usePhaseBroadcast('idle'));
    const events = spy.mock.calls
      .map((c) => c[0])
      .filter((ev): ev is CustomEvent => ev instanceof CustomEvent && ev.type === 'gauntlet:phase');
    expect(events.length).toBeGreaterThan(0);
    expect(events[events.length - 1].detail).toEqual({ phase: 'idle' });
    spy.mockRestore();
  });

  it('re-dispatches when the phase changes', () => {
    const spy = vi.spyOn(window, 'dispatchEvent');
    const { rerender } = renderHook(({ p }: { p: 'idle' | 'streaming' }) => usePhaseBroadcast(p), {
      initialProps: { p: 'idle' },
    });
    rerender({ p: 'streaming' });
    const phases = spy.mock.calls
      .map((c) => c[0])
      .filter((ev): ev is CustomEvent => ev instanceof CustomEvent && ev.type === 'gauntlet:phase')
      .map((ev) => ev.detail.phase);
    expect(phases).toContain('idle');
    expect(phases).toContain('streaming');
    spy.mockRestore();
  });

  it('does not re-dispatch when the same phase is passed again', () => {
    const spy = vi.spyOn(window, 'dispatchEvent');
    const { rerender } = renderHook(({ p }: { p: 'idle' }) => usePhaseBroadcast(p), {
      initialProps: { p: 'idle' },
    });
    const after1 = spy.mock.calls.filter(
      (c) => c[0] instanceof CustomEvent && (c[0] as CustomEvent).type === 'gauntlet:phase',
    ).length;
    rerender({ p: 'idle' });
    const after2 = spy.mock.calls.filter(
      (c) => c[0] instanceof CustomEvent && (c[0] as CustomEvent).type === 'gauntlet:phase',
    ).length;
    expect(after2).toBe(after1);
    spy.mockRestore();
  });
});
