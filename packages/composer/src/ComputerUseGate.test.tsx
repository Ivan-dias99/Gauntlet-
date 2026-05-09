// ComputerUseGate RTL — covers the description formatter, the
// approve/reject lifecycle, the Esc-to-reject keybinding, and the
// useComputerUseGate hook's enqueue → execute pipeline. Effect on the
// host OS isn't testable from happy-dom (no real cursor or keyboard);
// we assert only the contract between the gate, the hook and the
// adapter — the adapter primitives are smoke-tested Rust-side in
// `apps/desktop/src-tauri/tests/smoke.rs`.

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import {
  ComputerUseGate,
  describeComputerUseAction,
  runComputerUseAction,
  useComputerUseGate,
  type ComputerUseAction,
} from './ComputerUseGate';
import { type AmbientComputerUse } from './ambient';

function fakeAdapter(): AmbientComputerUse {
  return {
    moveCursor: vi.fn().mockResolvedValue(undefined),
    click: vi.fn().mockResolvedValue(undefined),
    typeText: vi.fn().mockResolvedValue(undefined),
    pressKey: vi.fn().mockResolvedValue(undefined),
  };
}

describe('describeComputerUseAction', () => {
  it('renders move with both coordinates', () => {
    expect(
      describeComputerUseAction({ kind: 'move', x: 400, y: 300 }),
    ).toBe('Move cursor to (400, 300)');
  });
  it('renders click with the button name', () => {
    expect(
      describeComputerUseAction({ kind: 'click', button: 'right' }),
    ).toBe('Click right mouse button');
  });
  it('renders type with quotes + truncation past 60 chars', () => {
    const long = 'x'.repeat(70);
    const out = describeComputerUseAction({ kind: 'type', text: long });
    expect(out.startsWith('Type "')).toBe(true);
    expect(out).toContain('…');
    // Body inside the quotes is 57 chars + ellipsis, never the full 70.
    expect(out.length).toBeLessThan('Type "'.length + 70);
  });
  it('renders press with the key in quotes', () => {
    expect(
      describeComputerUseAction({ kind: 'press', key: 'Enter' }),
    ).toBe('Press key "Enter"');
  });
});

describe('runComputerUseAction', () => {
  it('routes each action kind to the matching adapter primitive', async () => {
    const a = fakeAdapter();
    await runComputerUseAction(a, { kind: 'move', x: 10, y: 20 });
    expect(a.moveCursor).toHaveBeenCalledWith(10, 20);

    await runComputerUseAction(a, { kind: 'click', button: 'left' });
    expect(a.click).toHaveBeenCalledWith('left');

    await runComputerUseAction(a, { kind: 'type', text: 'abc' });
    expect(a.typeText).toHaveBeenCalledWith('abc');

    await runComputerUseAction(a, { kind: 'press', key: 'Tab' });
    expect(a.pressKey).toHaveBeenCalledWith('Tab');
  });
});

describe('<ComputerUseGate />', () => {
  it('renders nothing when no action is pending', () => {
    const { container } = render(
      <ComputerUseGate
        pending={null}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />,
    );
    expect(container.querySelector('.gauntlet-cu-gate')).toBeNull();
  });

  it('renders the description, reason and both buttons when an action is pending', () => {
    const action: ComputerUseAction = {
      kind: 'move',
      x: 100,
      y: 200,
      reason: 'agent wants to click Send',
    };
    render(
      <ComputerUseGate
        pending={action}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />,
    );
    expect(screen.getByText('Move cursor to (100, 200)')).toBeTruthy();
    expect(screen.getByText('agent wants to click Send')).toBeTruthy();
    expect(screen.getByText(/aprovar/i)).toBeTruthy();
    expect(screen.getByText(/rejeitar/i)).toBeTruthy();
  });

  it('approve button calls onApprove with the pending action', () => {
    const onApprove = vi.fn();
    const action: ComputerUseAction = { kind: 'click', button: 'left' };
    render(
      <ComputerUseGate
        pending={action}
        onApprove={onApprove}
        onReject={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText(/aprovar/i));
    expect(onApprove).toHaveBeenCalledWith(action);
  });

  it('Esc key triggers onReject', () => {
    const onReject = vi.fn();
    render(
      <ComputerUseGate
        pending={{ kind: 'press', key: 'a' }}
        onApprove={vi.fn()}
        onReject={onReject}
      />,
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onReject).toHaveBeenCalled();
  });
});

describe('useComputerUseGate', () => {
  it('enqueue stores a pending action; approve drains it via the adapter', async () => {
    const adapter = fakeAdapter();
    const { result } = renderHook(() => useComputerUseGate(adapter));

    expect(result.current.gateProps.pending).toBeNull();

    act(() => {
      result.current.enqueue({ kind: 'move', x: 5, y: 5 });
    });
    expect(result.current.gateProps.pending).toEqual({
      kind: 'move',
      x: 5,
      y: 5,
    });

    await act(async () => {
      await result.current.gateProps.onApprove({
        kind: 'move',
        x: 5,
        y: 5,
      });
    });
    expect(result.current.gateProps.pending).toBeNull();
    expect(adapter.moveCursor).toHaveBeenCalledWith(5, 5);
  });

  it('reject clears the pending action without invoking the adapter', () => {
    const adapter = fakeAdapter();
    const { result } = renderHook(() => useComputerUseGate(adapter));

    act(() => {
      result.current.enqueue({ kind: 'click', button: 'middle' });
    });
    expect(result.current.gateProps.pending).not.toBeNull();

    act(() => {
      result.current.gateProps.onReject();
    });
    expect(result.current.gateProps.pending).toBeNull();
    expect(adapter.click).not.toHaveBeenCalled();
  });

  it('approve is a no-op (no throw) when adapter is undefined', async () => {
    const { result } = renderHook(() => useComputerUseGate(undefined));
    act(() => {
      result.current.enqueue({ kind: 'move', x: 1, y: 1 });
    });
    await act(async () => {
      await result.current.gateProps.onApprove({
        kind: 'move',
        x: 1,
        y: 1,
      });
    });
    expect(result.current.gateProps.pending).toBeNull();
  });
});
