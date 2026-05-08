// AnswerPanel RTL — covers the textual-answer card the cápsula shows
// after the agent emits `compose`. Pure presentational, but the
// callbacks + flag-driven labels are what the operator clicks.

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { AnswerPanel } from './AnswerPanel';

function baseProps() {
  return {
    compose: 'Hello world',
    modelUsed: 'mock',
    latencyMs: 42,
    copied: false,
    savedFlash: null as string | null,
    savedToDiskFlash: null as string | null,
    onCopy: vi.fn(),
    onSaveMemory: vi.fn(),
    onCopyBlock: vi.fn(),
  };
}

describe('<AnswerPanel />', () => {
  it('renders compose text with model + latency meta', () => {
    render(<AnswerPanel {...baseProps()} />);
    expect(screen.getByText('Hello world')).toBeTruthy();
    expect(screen.getByText(/mock/)).toBeTruthy();
    expect(screen.getByText(/42 ms/)).toBeTruthy();
  });

  it('shows "Copy" by default and "copiado ✓" after copied flips', () => {
    const { rerender } = render(<AnswerPanel {...baseProps()} />);
    expect(screen.getByText('Copy')).toBeTruthy();
    rerender(<AnswerPanel {...baseProps()} copied />);
    expect(screen.getByText('copiado ✓')).toBeTruthy();
  });

  it('shows "Save" / "guardado ✓" based on savedFlash', () => {
    const { rerender } = render(<AnswerPanel {...baseProps()} />);
    expect(screen.getByText('Save')).toBeTruthy();
    rerender(<AnswerPanel {...baseProps()} savedFlash="saved" />);
    expect(screen.getByText('guardado ✓')).toBeTruthy();
  });

  it('hides "Guardar como" when onSaveDisk is not provided', () => {
    render(<AnswerPanel {...baseProps()} />);
    expect(screen.queryByText('Guardar como')).toBeNull();
  });

  it('shows "Guardar como" when onSaveDisk is wired and the flash text when set', () => {
    const onSaveDisk = vi.fn();
    const { rerender } = render(
      <AnswerPanel {...baseProps()} onSaveDisk={onSaveDisk} />,
    );
    expect(screen.getByText('Guardar como')).toBeTruthy();
    rerender(
      <AnswerPanel
        {...baseProps()}
        onSaveDisk={onSaveDisk}
        savedToDiskFlash="report.md (1 KB)"
      />,
    );
    expect(screen.getByText('→ report.md (1 KB)')).toBeTruthy();
  });

  it('wires Copy / Save / Guardar como to the right callbacks', () => {
    const onCopy = vi.fn();
    const onSaveMemory = vi.fn();
    const onSaveDisk = vi.fn();
    const { container } = render(
      <AnswerPanel
        {...baseProps()}
        onCopy={onCopy}
        onSaveMemory={onSaveMemory}
        onSaveDisk={onSaveDisk}
      />,
    );
    // Markdown's CodeBlock decoration renders its own copy buttons,
    // so anchor on the buttons inside the actions row to disambiguate.
    const buttons = container.querySelectorAll(
      '.gauntlet-capsule__compose-actions button',
    );
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);
    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(onSaveMemory).toHaveBeenCalledTimes(1);
    expect(onSaveDisk).toHaveBeenCalledTimes(1);
  });
});
