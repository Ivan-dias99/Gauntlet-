import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('<EmptyState />', () => {
  it('renders the kicker, title and four rituals', () => {
    render(<EmptyState onPick={vi.fn()} />);
    expect(screen.getByText(/Aether v1/i)).toBeTruthy();
    expect(screen.getByText('O que queres fazer?')).toBeTruthy();
    expect(screen.getByText('Resumir página em 3 bullets')).toBeTruthy();
    expect(screen.getByText('Traduzir seleção para EN')).toBeTruthy();
    expect(screen.getByText('Explicar como se eu tivesse 12 anos')).toBeTruthy();
    expect(screen.getByText('Clicar elemento por selector')).toBeTruthy();
  });

  it('fires onPick with the slash hint when a ritual is clicked', () => {
    const onPick = vi.fn();
    render(<EmptyState onPick={onPick} />);
    fireEvent.click(screen.getByText('Resumir página em 3 bullets'));
    expect(onPick).toHaveBeenCalledWith('/resumir');
  });

  it('connects the title to the section via aria-labelledby', () => {
    const { container } = render(<EmptyState onPick={vi.fn()} />);
    const section = container.querySelector('.gx-empty');
    const title = container.querySelector('#gx-empty-title');
    expect(section?.getAttribute('aria-labelledby')).toBe('gx-empty-title');
    expect(title?.textContent).toBe('O que queres fazer?');
  });

  it('exposes each ritual as a list item button', () => {
    const { container } = render(<EmptyState onPick={vi.fn()} />);
    const rituals = container.querySelectorAll('.gx-empty__ritual');
    expect(rituals.length).toBe(4);
    rituals.forEach((r) => {
      expect(r.tagName).toBe('BUTTON');
      expect(r.getAttribute('role')).toBe('listitem');
    });
  });
});
