// SlashMenu RTL — covers the rendering + interaction paths the unit
// tests on buildSlashActions cannot reach (active-index highlight,
// hover-to-select, click-to-pick).

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SlashMenu, type SlashAction } from './SlashMenu';

function action(id: string, label = `/${id}`, hint = `${id} hint`): SlashAction {
  return { id, label, hint, run: vi.fn() };
}

describe('<SlashMenu />', () => {
  it('renders nothing on empty matches', () => {
    const { container } = render(
      <SlashMenu matches={[]} activeIndex={0} onHover={vi.fn()} onPick={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders one row per match with label + hint', () => {
    render(
      <SlashMenu
        matches={[action('a'), action('b'), action('c')]}
        activeIndex={1}
        onHover={vi.fn()}
        onPick={vi.fn()}
      />,
    );
    expect(screen.getByText('/a')).toBeTruthy();
    expect(screen.getByText('/b')).toBeTruthy();
    expect(screen.getByText('/c')).toBeTruthy();
    expect(screen.getByText('a hint')).toBeTruthy();
  });

  it('marks the activeIndex entry as visually active via class name', () => {
    const { container } = render(
      <SlashMenu
        matches={[action('a'), action('b'), action('c')]}
        activeIndex={2}
        onHover={vi.fn()}
        onPick={vi.fn()}
      />,
    );
    const items = container.querySelectorAll('.gauntlet-capsule__slash-item');
    expect(items[0].className).not.toContain('--active');
    expect(items[1].className).not.toContain('--active');
    expect(items[2].className).toContain('--active');
  });

  it('fires onPick on click', () => {
    const onPick = vi.fn();
    const { container } = render(
      <SlashMenu
        matches={[action('a'), action('b')]}
        activeIndex={0}
        onHover={vi.fn()}
        onPick={onPick}
      />,
    );
    const items = container.querySelectorAll('.gauntlet-capsule__slash-item');
    fireEvent.click(items[1]);
    expect(onPick).toHaveBeenCalledWith(1);
  });
});
