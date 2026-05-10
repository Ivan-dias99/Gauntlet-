import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

describe('<ThemeToggle />', () => {
  it('reflects the current theme on data-theme', () => {
    const { container } = render(<ThemeToggle theme="dark" onChangeTheme={vi.fn()} />);
    expect(container.querySelector('.gx-theme-toggle')?.getAttribute('data-theme')).toBe('dark');
  });

  it('fires onChangeTheme with the inverse theme on click', () => {
    const onChangeTheme = vi.fn();
    render(<ThemeToggle theme="light" onChangeTheme={onChangeTheme} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onChangeTheme).toHaveBeenCalledWith('dark');
  });

  it('flips dark → light when starting from dark', () => {
    const onChangeTheme = vi.fn();
    render(<ThemeToggle theme="dark" onChangeTheme={onChangeTheme} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onChangeTheme).toHaveBeenCalledWith('light');
  });

  it('exposes a Portuguese aria-label that names the active theme', () => {
    render(<ThemeToggle theme="light" onChangeTheme={vi.fn()} />);
    expect(screen.getByLabelText(/Tema claro — alternar/)).toBeTruthy();
  });

  it('keeps icon glyphs aria-hidden so screen readers do not double-announce', () => {
    const { container } = render(<ThemeToggle theme="light" onChangeTheme={vi.fn()} />);
    container.querySelectorAll('.gx-theme-toggle__icon').forEach((el) => {
      expect(el.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
