import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

describe('<ThemeToggle />', () => {
  it('reflects the current theme on data-theme', () => {
    const { container } = render(<ThemeToggle theme="dark" onToggle={vi.fn()} />);
    expect(container.querySelector('.gx-theme-toggle')?.getAttribute('data-theme')).toBe('dark');
  });

  it('fires onToggle on click', () => {
    const onToggle = vi.fn();
    render(<ThemeToggle theme="light" onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('exposes a Portuguese aria-label that names the active theme', () => {
    render(<ThemeToggle theme="light" onToggle={vi.fn()} />);
    expect(screen.getByLabelText(/Tema claro — alternar/)).toBeTruthy();
  });

  it('keeps icon glyphs aria-hidden so screen readers do not double-announce', () => {
    const { container } = render(<ThemeToggle theme="light" onToggle={vi.fn()} />);
    container.querySelectorAll('.gx-theme-toggle__icon').forEach((el) => {
      expect(el.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
