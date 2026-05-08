// CommandPalette RTL — fuzzy filter, recents-on-top sort, keyboard
// navigation and run-on-Enter. Exercises the pure presentational
// half (the buildPaletteActions factory has its own pure tests).

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { CommandPalette, type PaletteAction } from './CommandPalette';

function action(id: string, label = `/${id}`): PaletteAction {
  return { id, label, shortcut: '', group: 'action', run: vi.fn() };
}

describe('<CommandPalette />', () => {
  it('renders all actions when the filter is empty', () => {
    render(
      <CommandPalette
        actions={[action('a'), action('b'), action('c')]}
        recentIds={[]}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText('/a')).toBeTruthy();
    expect(screen.getByText('/b')).toBeTruthy();
    expect(screen.getByText('/c')).toBeTruthy();
  });

  it('filters by fuzzy match as the operator types', () => {
    render(
      <CommandPalette
        actions={[
          action('focus'),
          action('copy'),
          action('save'),
          action('clear'),
        ]}
        recentIds={[]}
        onClose={vi.fn()}
      />,
    );
    const input = screen.getByPlaceholderText(/comandos · tools/);
    fireEvent.change(input, { target: { value: 'cy' } });
    expect(screen.getByText('/copy')).toBeTruthy();
    expect(screen.queryByText('/focus')).toBeNull();
    expect(screen.queryByText('/save')).toBeNull();
  });

  it('shows "sem resultados" when nothing matches', () => {
    render(
      <CommandPalette
        actions={[action('focus'), action('copy')]}
        recentIds={[]}
        onClose={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByPlaceholderText(/comandos · tools/), {
      target: { value: 'zzz' },
    });
    expect(screen.getByText('sem resultados')).toBeTruthy();
  });

  it('promotes recents to the top with no filter active', () => {
    const items = [action('a'), action('b'), action('c')];
    const { container } = render(
      <CommandPalette
        actions={items}
        recentIds={['c', 'a']}
        onClose={vi.fn()}
      />,
    );
    const labels = Array.from(
      container.querySelectorAll('.gauntlet-capsule__palette-label'),
    ).map((el) => el.textContent);
    expect(labels).toEqual(['/c', '/a', '/b']);
  });

  it('runs the cursor-row action on Enter', () => {
    const runA = vi.fn();
    const runB = vi.fn();
    const { container } = render(
      <CommandPalette
        actions={[
          { ...action('a'), run: runA },
          { ...action('b'), run: runB },
        ]}
        recentIds={[]}
        onClose={vi.fn()}
      />,
    );
    const panel = container.querySelector('.gauntlet-capsule__palette-panel')!;
    fireEvent.keyDown(panel, { key: 'ArrowDown' });
    fireEvent.keyDown(panel, { key: 'Enter' });
    expect(runA).not.toHaveBeenCalled();
    expect(runB).toHaveBeenCalledTimes(1);
  });

  it('clicks the scrim → onClose', () => {
    const onClose = vi.fn();
    const { container } = render(
      <CommandPalette
        actions={[action('a')]}
        recentIds={[]}
        onClose={onClose}
      />,
    );
    fireEvent.click(
      container.querySelector('.gauntlet-capsule__palette-scrim')!,
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('skips disabled entries on Enter', () => {
    const runDisabled = vi.fn();
    const { container } = render(
      <CommandPalette
        actions={[
          { ...action('disabled'), disabled: true, run: runDisabled },
          action('b'),
        ]}
        recentIds={[]}
        onClose={vi.fn()}
      />,
    );
    const panel = container.querySelector('.gauntlet-capsule__palette-panel')!;
    fireEvent.keyDown(panel, { key: 'Enter' });
    expect(runDisabled).not.toHaveBeenCalled();
  });
});
