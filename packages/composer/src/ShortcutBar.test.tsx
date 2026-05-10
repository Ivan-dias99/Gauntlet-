import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ShortcutBar } from './ShortcutBar';

describe('<ShortcutBar />', () => {
  it('renders the idle hints + ready status by default', () => {
    render(<ShortcutBar phase="idle" />);
    expect(screen.getByText('pronto')).toBeTruthy();
    expect(screen.getByText('comandos')).toBeTruthy();
    expect(screen.getByText('palette')).toBeTruthy();
    expect(screen.getByText('recolhe')).toBeTruthy();
  });

  it('switches the status to thinking while planning', () => {
    const { container } = render(<ShortcutBar phase="planning" />);
    expect(screen.getByText('a pensar…')).toBeTruthy();
    const status = container.querySelector('.gx-shortcut-bar__status');
    expect(status?.getAttribute('data-tone')).toBe('thinking');
  });

  it('reports executed in the ok tone', () => {
    const { container } = render(<ShortcutBar phase="executed" />);
    expect(screen.getByText('concluído')).toBeTruthy();
    expect(
      container.querySelector('.gx-shortcut-bar__status')?.getAttribute('data-tone'),
    ).toBe('ok');
  });

  it('switches to the sensitive-action hint set when the danger gate opens', () => {
    const { container } = render(<ShortcutBar phase="plan_ready" dangerGateOpen />);
    expect(screen.getByText('acção sensível')).toBeTruthy();
    expect(screen.getByText('executar com cuidado')).toBeTruthy();
    expect(screen.getByText('cancelar')).toBeTruthy();
    expect(
      container.querySelector('.gx-shortcut-bar__status')?.getAttribute('data-tone'),
    ).toBe('danger');
  });

  it('scopes the polite live region to the status text only', () => {
    const { container } = render(<ShortcutBar phase="streaming" />);
    const root = container.querySelector('.gx-shortcut-bar');
    const status = container.querySelector('.gx-shortcut-bar__status');
    const hints = container.querySelector('.gx-shortcut-bar__hints');
    expect(root?.getAttribute('aria-live')).toBeNull();
    expect(status?.getAttribute('role')).toBe('status');
    expect(status?.getAttribute('aria-live')).toBe('polite');
    expect(hints?.getAttribute('aria-live')).toBeNull();
  });
});
